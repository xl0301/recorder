const fs = require("fs");
const path = require("path");

const filePath = path.resolve(__dirname, "../data", "data.json");
console.log(filePath);
function writeFile(str) {
  try {
    fs.writeFile(filePath, str, "utf-8", (err) => {
      if (err) {
        return Promise.reject({ msg: "写入失败" + err });
      }
      return Promise.resolve({ msg: "写入成功", code: "00" });
    });
  } catch (error) {
    return Promise.reject({ msg: "写入失败" + error });
  }
}
function readFile() {
  const file = fs.readFileSync(filePath, "utf-8");
  return file;
}
module.exports = {
  writeFile,
  readFile,
};
