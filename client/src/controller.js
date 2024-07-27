/**
 * 录制与回放
 */
import recorder from "../../recorder/src/index";
const replayBts = document
  .querySelector(".replayBts")
  .querySelectorAll("button");
replayBts[0].onclick = function (params) {
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
