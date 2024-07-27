const express = require("express");
const bodyParser = require("body-parser");
const fileUtils = require("./controller/index");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,Content-Type,token"
//   );
//   next();
// });
app.post("/upload_video", async (req, res) => {
  const { events } = req.body;
  if (events) {
    fileUtils.writeFile(events);
    res.send({ msg: "上传成功", code: "00" });
  } else {
    res.send({ msg: "上传失败" });
  }
});
app.post("/fetch_video", (req, res) => {
  const file = fileUtils.readFile();
  console.log(file);
  if (file) {
    res.send({ code: "00", msg: "读取成功", data: file });
  } else {
    res.send({ msg: "读取失败！" });
  }
});
app.listen("2000", () => {
  console.log("server is running on http://localhost:2000");
});
