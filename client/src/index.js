import "../../rrweb-player/dist/style.css";
import "../src/assets/style/index.css";
import "./controller";
import * as rrweb from "rrweb";
import rrwebPlayer from "../../rrweb-player/dist/index.mjs";
import { uploadVideo, fetchVideo } from "./utils/video/handleVideo";
import "./utils/video/drawCanvas";
import "./utils/scripts/index";
const countBts = document.querySelector(".countBts").querySelectorAll("button");
const rrwebBts = document.querySelector(".rrwebBts").querySelectorAll("button");
const serverBts = document
  .querySelector(".serverBts")
  .querySelectorAll("button");
const replayContainer = document.querySelector(".replayContainer");
const count = document.querySelector(".count");
/**
 * 展示区按钮
 */
countBts[0].onclick = function (params) {
  count.innerText = Number(count.innerText) + 1;
};
countBts[1].onclick = function (params) {
  count.innerText = Number(count.innerText) - 1;
};
/**
 * rrwebBts
 */

let events = [];
let stopFn = null;
rrwebBts[0].onclick = function (params) {
  console.log("开始录制");
  events = [];
  stopFn = rrweb.record({
    emit: (event) => {
      // 将 event 存入 events 数组中
      events.push(event);
    },
    recordCanvas: true,
  });
};
rrwebBts[1].onclick = function (params) {
  stopFn();
};
// 开始播放
rrwebBts[2].onclick = function (params) {
  console.log(events);
  if (!(events && events.length > 0)) {
    alert("数据为空，请先录制！");
    return;
  }
  setTimeout(() => {
    const replayInstance = new rrwebPlayer({
      target: replayContainer,
      // 配置项
      props: {
        events: events,
        skipInactive: false, //是否快速跳过无用户操作的阶段
        showDebug: false, //是否在回放过程中打印 debug 信息
        showWarning: false, //是否在回放过程中打印警告信息
        autoPlay: true, //是否自动播放
        showControlle: true, //是否显示播放器控制 UI
        speedOption: [1, 2, 4, 8], //倍速播放可选值
        UNSAFE_replayCanvas: true,
      },
      downloadConfig: {
        isFullScreen: false,
        target: "",
      },
    });
    replayInstance.addEventListener("finish", (payload) => {
      console.log("播放结束");
    });
  }, 100);
};
/**
 * 上传与下载
 */
serverBts[0].onclick = function () {
  uploadVideo(events);
};
serverBts[1].onclick = async function () {
  const res = await fetchVideo();
  if (res) {
    events = res;
  }
};
