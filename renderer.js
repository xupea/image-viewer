/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
const pic = document.getElementById("pic");

let disX = 0;
let disY = 0;
let isDrag = false;

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
  console.log("mousemove-x", event.clientX - disX);

  let resultLeft = event.clientX - disX;
  if (resultLeft > 0) {
    resultLeft = 0;
  } else if (
    Math.abs(resultLeft) > Math.abs(pic.clientWidth - window.innerWidth)
  ) {
    resultLeft = -(pic.clientWidth - window.innerWidth);
  }

  let resultTop = event.clientY - disY;
  if (resultTop > 0) {
    resultTop = 0;
  } else if (
    Math.abs(resultTop) > Math.abs(pic.clientHeight - window.innerHeight)
  ) {
    resultTop = -(pic.clientHeight - window.innerHeight);
  }

  console.log(resultLeft, pic.clientWidth, window.innerWidth);
  pic.style.left = resultLeft + "px";
  pic.style.top = resultTop + "px";
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
