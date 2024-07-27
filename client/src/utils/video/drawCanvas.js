let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 400;

let str = "hello world".split(" ");

let arr = Array(Math.ceil(canvas.width / 10)).fill(0);
const colors = ["#0f0", "#f00", "#00f", "#ff0", "#0ff", "#8ebf55", "#d55170"]; // 添加颜色数组

const rain = () => {
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  arr.forEach((item, index) => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)]; // 随机选取颜色
    ctx.fillStyle = randomColor; // 使用随机颜色
    ctx.fillText(
      str[Math.floor(Math.random() * str.length)],
      index * 10,
      item + 10
    );
    arr[index] =
      item > canvas.height || item > Math.random() * 10000 ? 0 : item + 10;
  });
};
// rain();
setInterval(rain, 100);
