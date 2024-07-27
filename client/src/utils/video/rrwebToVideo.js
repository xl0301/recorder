// CanvasRecorder.js - smusamashah
// To record canvas effitiently using MediaRecorder
// https://webrtc.github.io/samples/src/content/capture/canvas-record/
import html2canvas from "html2canvas";
const dom = document.querySelector("#canvas");
var viewportTopOffset = window.screenTop || window.screenY;
const { left, top } = dom.getBoundingClientRect();
// window.screenX||window.screenLeft 游览器距离屏幕左边的距离
// window.screenY||window.screenTop 游览器距离屏幕左边的距离
// 游览器视口距离顶部的距离：window.outerHeight-window.innerHeight
const chromeHeight = window.outerHeight - window.innerHeight;

function CanvasRecorder(video_bits_per_sec = 2500000) {
  this.start = startRecording;
  this.stop = stopRecording;
  this.save = download;

  var recordedBlobs = [];
  var supportedType = null;
  var mediaRecorder = null;
  var video = document.createElement("video");
  var isStop = false;
  var recordedBlobs = []; //录制的blobs
  var stream = null; // 共享屏幕视频流
  var canvas = null; // 绘制的canvas
  var ctx = null; // canvas上下文
  var videoElement = null;
  async function startRecording() {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        frameRate: video_bits_per_sec,
        displaySurface: "window",
      },
      surfaceSwitching: "include",
      selfBrowserSurface: "exclude",
      systemAudio: "exclude",
    });
    if (typeof stream == undefined || !stream) {
      return;
    } else {
      videoElement = document.createElement("video");
      videoElement.srcObject = stream;
      videoElement.play();
      canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 400;
      ctx = canvas.getContext("2d");
      function draw() {
        if (isStop) return;
        ctx.drawImage(
          videoElement,
          left,
          top + chromeHeight,
          400,
          400,
          0,
          0,
          400,
          400
        );
        requestAnimationFrame(draw);
      }
      draw(); //将视频流输出到canvas中并截图
      handleRecorder();
    }
  }
  function handleRecorder() {
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
      videoBitsPerSecond: video_bits_per_sec || 2500000, // 2.5Mbps
    };

    try {
      mediaRecorder = new MediaRecorder(canvas.captureStream(), options);
    } catch (e) {
      alert("MediaRecorder is not supported by this browser.");
      console.error("Exception while creating MediaRecorder:", e);
      return;
    }
    mediaRecorder.onstop = handleStop;
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(400); // collect 100ms of data blobs
    console.log("MediaRecorder started", mediaRecorder);
  }
  function handleDataAvailable(event) {
    console.log("event", event.data);
    if (event.data && event.data.size > 0) {
      recordedBlobs.push(event.data);
    }
  }

  function handleStop(event) {
    // console.log("Recorder stopped: ", event);
    // const superBuffer = new Blob(recordedBlobs, { type: supportedType });
    // video.src = window.URL.createObjectURL(superBuffer);
  }

  function stopRecording() {
    stream.getTracks().forEach((track) => track.stop());
    isStop = true;
    mediaRecorder.stop();
    // console.log("Recorded Blobs: ", recordedBlobs);
    video.controls = true;
  }

  function download(file_name) {
    const name = file_name || "recording.mp4";
    const blob = new Blob(recordedBlobs, { type: "video/mp4" });
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
}
export default CanvasRecorder;
