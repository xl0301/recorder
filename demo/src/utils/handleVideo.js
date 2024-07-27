import { uploadVideoApi, fetchVideoApi } from "../api/index";
const uploadVideo = async (events) => {
  if (!events) {
    return;
  }
  const res = await uploadVideoApi(JSON.stringify(events));
  console.log(res);
  if (res && res.code && res.code === "00") {
    alert("上传成功");
  } else {
    alert("上传失败！");
  }
};
const fetchVideo = async () => {
  let result = "";
  try {
    const res = await fetchVideoApi();
    if (res && res.code === "00") {
      result = JSON.parse(res.data);
    }
  } catch (error) {}
  return Promise.resolve(result);
};
export { uploadVideo, fetchVideo };
