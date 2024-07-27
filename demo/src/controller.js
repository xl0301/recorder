/**
 * 录制与回放
 */
import Recorder from "../../rrweb-player/src/utils/Recorder.ts";
const recorder = new Recorder({ selector: document.querySelector("canvas") });
const replayBts = document
  .querySelector(".replayBts")
  .querySelectorAll("button");
replayBts[0].onclick = function (params) {
  console.log("11", recorder);
  recorder.startSharingScreen();
};
replayBts[1].onclick = function (params) {
  recorder.startRecording();
};
replayBts[2].onclick = function (params) {
  recorder.stopRecording();
};
replayBts[3].onclick = function (params) {
  recorder.download();
};
replayBts[4].onclick = async function (params) {
  await recorder.startSharingScreen();
  recorder.startRecording();
  setTimeout(() => {
    recorder.stopRecording();
    recorder.download();
  }, 5000);
};
