import { updateCropConfig } from "./handleCrop";

type Crops = {
  startX: number;
  startY: number;
  width: number;
  height: number;
};
type Config = {
  selector?: HTMLElement;
  crops?: Crops;
  isFullScreen: boolean;
};
class Recorder {
  crops: Crops;
  selector: HTMLElement | null;
  video_bits_per_sec: number = 10 * 1024 * 1024;
  recordedBlobs: any[];
  stream: any;
  supportedType:
    | [
        "video/webm",
        "video/webm,codecs=vp9",
        "video/vp8",
        "video/webm;codecs=vp8",
        "video/webm;codecs=daala",
        "video/webm;codecs=h264",
        "video/mpeg"
      ]
    | null;
  mediaRecorder: any;
  downloadVideoElement: HTMLVideoElement | null;
  transformVideoElement: HTMLVideoElement | null;
  canvasElement: HTMLCanvasElement | null;
  isSharingScreen: boolean; //播放是否停止
  isStartRecording: boolean;
  isStop: boolean;
  ctx: any;
  isFullScreen: boolean;
  constructor(config: Config) {
    this.crops = config?.crops || { startX: 0, startY: 0, width: 0, height: 0 };
    this.selector = config?.selector;
    this.isFullScreen = config?.isFullScreen || false;
    this.init();
  }
  init = () => {
    this.recordedBlobs = [];
    this.stream = null;
    this.supportedType = null;
    this.mediaRecorder = null;
    this.downloadVideoElement = document.createElement("video");
    this.transformVideoElement = document.createElement("video");
    this.canvasElement = document.createElement("canvas");
    this.isSharingScreen = false; //播放是否停止
    this.isStartRecording = false;
    this.isStop = false;
    this.ctx = this.canvasElement.getContext("2d");
  };
  handleCrops() {
    const selector = this.selector;
    console.log("handleCrops", selector);
    const crops = this.crops;
    let cutObj = null;
    if (this.isFullScreen) {
      cutObj = {
        startX: 0,
        startY: 0,
        width: screen.width,
        height: screen.height,
      };
    } else if (crops && crops.width !== 0 && crops.height !== 0) {
      cutObj = { ...crops };
    } else if (selector) {
      cutObj = updateCropConfig(selector);
    }
    if (!cutObj) {
      throw new Error("请输入正确的selector或者crops参数");
    }
    const { width, height } = cutObj;
    this.canvasElement.width = width;
    this.canvasElement.height = height;
    this.crops = { ...cutObj };
  }
  /**
   * 开始捕获屏幕
   */
  startSharingScreen = async function () {
    this.init();
    try {
      this.stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: { max: 240 },
          //@ts-ignore
          displaySurface: "window",
        },
        surfaceSwitching: "include",
        selfBrowserSurface: "exclude",
        systemAudio: "exclude",
      });
      this.isSharingScreen = true;
      this.transformVideoStream();
      return Promise.resolve("捕获屏幕成功");
    } catch (error) {
      this.isSharingScreen = false;
      console.log("捕获屏幕失败！", error);
      return Promise.reject("捕获屏幕失败！" + error);
    }
  };
  /**
   * 转换视频流
   */
  transformVideoStream = () => {
    if (typeof this.stream == undefined || !this.stream) {
      console.log("stream不存在!");
      return;
    }
    this.transformVideoElement.srcObject = this.stream;
    this.transformVideoElement.play();
  };
  /**
   * 绘制每一帧
   * @returns void
   */
  draw = () => {
    if (this.isStop) {
      console.log("录制停止");
      return;
    }
    // console.log("is drawing");
    const { startX, startY, width, height } = this.crops;
    // console.log(startX, startY, width, height);
    this.ctx.drawImage(
      this.transformVideoElement,
      startX,
      startY,
      width,
      height,
      0,
      0,
      width,
      height
    );
    requestAnimationFrame(this.draw);
  };
  /**
   * 处理录制屏幕
   */
  handleRecorder = () => {
    console.log(this);
    let supportedType = null;
    let mediaRecorder = null;
    let types = [
      "video/webm",
      "video/webm,codecs=vp9",
      "video/vp8",
      "video/webm;codecs=vp8",
      "video/webm;codecs=daala",
      "video/webm;codecs=h264",
      "video/mpeg",
    ];

    for (let i in types) {
      if (MediaRecorder.isTypeSupported(types[i])) {
        supportedType = types[i];
        break;
      }
    }
    if (supportedType == null) {
      console.log("No supported type found for MediaRecorder");
    }
    let options = {
      mimeType: supportedType,
      videoBitsPerSecond: this.video_bits_per_sec || 2500000, // 2.5Mbps
    };

    try {
      this.mediaRecorder = new MediaRecorder(
        this.canvasElement.captureStream(),
        options
      );
    } catch (e) {
      alert("MediaRecorder is not supported by this browser.");
      console.error("Exception while creating MediaRecorder:", e);
      return;
    }
    // this.mediaRecorder.onstop = handleStop;
    this.mediaRecorder.ondataavailable = this.handleDataAvailable;
    this.mediaRecorder.start(100); // collect 1000ms of data blobs
    console.log("MediaRecorder started", mediaRecorder);
  };
  // 注意这里要写成箭头函数，否则的话这里的this不是指向实例而是指向调用者
  handleDataAvailable = (event) => {
    console.log("event", event.data);
    if (event.data && event.data.size > 0) {
      // console.log(this.recordedBlobs);
      this.recordedBlobs.push(event.data);
    }
  };

  stopRecording() {
    if (this.isSharingScreen && this.isStartRecording) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.isStop = true;
      this.mediaRecorder.stop();
      this.transformVideoElement.controls = true;
      return Promise.resolve("已停止录屏");
    } else {
      return Promise.reject("请先开始录屏");
    }
  }

  download(file_name) {
    const name = file_name || "recording.mp4";
    const blob = new Blob(this.recordedBlobs, { type: "video/mp4" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      this.recordedBlobs = [];
    }, 1000);
  }
  /**
   * 开始录制屏幕
   */
  startRecording = () => {
    this.handleCrops();
    if (this.isSharingScreen) {
      this.isStartRecording = true;
      this.draw();
      this.handleRecorder();
      return Promise.resolve("录制开始");
    } else {
      this.isStartRecording = false;
      return Promise.reject("请先同意共享屏幕");
    }
  };
}
export default Recorder;
