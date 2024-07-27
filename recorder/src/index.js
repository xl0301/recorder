import { updateCropConfig, domObserver } from "./utils/handleCrop";
class Recorder {
  constructor(config) {
    const { selector = "", crops = [] } = config;
    this.crops = crops;
    this.selector = selector;
    this.video_bits_per_sec = 10 * 1024 * 1024; //解码率10m/bps
    this.recordedBlobs = [];
    this.init();
  }
  init = () => {
    this.stream = null;
    this.supportedType = null;
    this.mediaRecorder = null;
    this.downloadVideoElement = document.createElement("video");
    this.transformVideoElement = document.createElement("video");
    this.canvasElement = document.createElement("canvas");
    this.isSharingScreen = false;
    this.isStop = false;
    this.ctx = this.canvasElement.getContext("2d");
  };
  handleCrops() {
    const selector = this.selector;
    const crops = this.crops;
    let cutObj = null;
    if (selector) {
      const dom = document.querySelector(selector);
      if (dom) {
        cutObj = updateCropConfig(dom);
        // 判断格式正确的话
      } else if (crops) {
        cutObj = { ...crops };
      }
      if (!cutObj) {
        throw new TypeError("请输入正确的selector或者crops参数");
      }
      const { startX, startY, width, height } = cutObj;
      this.canvasElement.width = width;
      this.canvasElement.height = height;
      this.crops = { ...cutObj };
    }
  }
  /**
   * 开始捕获屏幕
   */
  startSharingScreen = async function () {
    this.handleCrops();
    try {
      this.stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: { max: 240 },
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
      return Promise.reject("捕获屏幕失败！", error);
    }
  };
  /**
   * 转换视频流
   */
  transformVideoStream = () => {
    if (typeof this.stream == undefined || !this.stream) {
      console.log("stream不存在!!");
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
    console.log("is drawing");
    const { startX, startY, width, height } = this.crops;
    console.log(startX, startY, width, height);
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
    this.mediaRecorder.start(1000); // collect 1000ms of data blobs
    console.log("MediaRecorder started", mediaRecorder);
  };
  // 注意这里要写成箭头函数，否则的话这里的this不是指向实例而是指向调用者
  handleDataAvailable = (event) => {
    console.log("event", event.data);
    if (event.data && event.data.size > 0) {
      console.log(this.recordedBlobs);
      this.recordedBlobs.push(event.data);
    }
  };

  stopRecording() {
    this.stream.getTracks().forEach((track) => track.stop());
    this.isStop = true;
    this.mediaRecorder.stop();
    this.transformVideoElement.controls = true;
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
    }, 100);
  }
  /**
   * 开始录制屏幕
   */
  startRecording = () => {
    if (this.isSharingScreen) {
      this.handleRecorder();
      this.draw();
      return Promise.resolve("录制开始");
    } else {
      throw new Error("请同意共享屏幕！！");
    }
  };
}
// const recorder = new Recorder({ selector: "#canvas" });
const recorder = new Recorder({ selector: "#canvas" });
export default recorder;
