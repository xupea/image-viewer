/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
const pic = document.getElementById("pic");
const scale = document.getElementById("scale");

let disX = 0;
let disY = 0;
let isDrag = false;

scale.addEventListener("dblclick", () => {
  console.log("dblclick");
  window.electron.ipcRenderer.send("maximize");
});

pic.addEventListener("load", (event) => {
  console.log(event.target.width, event.target.height);

  scale.innerText = `${Math.round(
    (window.innerWidth / event.target.width) * 100
  )} %`;

  pic.style.width = window.innerWidth + "px";

  const newHeight =
    event.target.height * (window.innerWidth / event.target.width);

  pic.style.height = ~~newHeight + "px";
});

pic.addEventListener("mousedown", (event) => {
  event.preventDefault();
  console.log("mousedown");

  pic.style.cursor = "move";

  isDrag = true;

  disX = event.clientX - pic.offsetLeft;
  disY = event.clientY - pic.offsetTop;
});

pic.addEventListener("mousemove", (event) => {
  if (!isDrag) return;

  event.preventDefault();
  // console.log("mousemove-x", event.clientX - disX);

  let resultLeft = event.clientX - disX;

  if (resultLeft > 0 && window.innerWidth < pic.clientWidth) {
    resultLeft = 0;
  } else if (window.innerWidth >= pic.clientWidth) {
    resultLeft = (window.innerWidth - pic.clientWidth) / 2;
  } else if (
    Math.abs(resultLeft) > Math.abs(pic.clientWidth - window.innerWidth)
  ) {
    resultLeft = -(pic.clientWidth - window.innerWidth);
  }

  let resultTop = event.clientY - disY;

  if (resultTop >= 0) {
    resultTop = 0;
  }

  // if (resultTop >= 0 && pic.clientHeight < window.innerHeight - 40) {
  //   resultTop = pic.style.top;
  // } else if (Math.abs(resultTop) + pic.clientHeight > window.innerHeight - 40) {
  //   resultTop = 0;
  // } else {
  //   resultTop = -(pic.clientHeight - window.innerHeight - 40);
  // }

  console.log(event.clientY - disY, pic.clientHeight, window.innerHeight);
  console.log("resultTop:", resultTop);
  pic.style.left = resultLeft + "px";
  pic.style.top = resultTop + "px";
  // pic.style.transform = `translate(${~~resultLeft}px, ${~~resultTop}px)`;
});

pic.addEventListener("mouseup", (event) => {
  event.preventDefault();
  console.log("mouseup");
  isDrag = false;

  pic.style.cursor = "default";
});

pic.addEventListener("mouseleave", (event) => {
  event.preventDefault();
  console.log("mouseleave");
  isDrag = false;

  pic.style.cursor = "default";
});

window.addEventListener("resize", () => {
  console.log("resize");

  const resultLeft = (window.innerWidth - pic.clientWidth) / 2;
  pic.style.transform = `translateX(${~~resultLeft}px)`;
});
