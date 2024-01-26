// Modules to control application life and create native browser window
const { app, BrowserWindow, screen, ipcMain } = require("electron");
const path = require("node:path");
const { promisify } = require("util");
const sizeOf = promisify(require("image-size"));

async function createWindow() {
  const { workAreaSize, scaleFactor } = screen.getPrimaryDisplay();
  const imageSize = await sizeOf("./viewer1.jpeg");

  console.log("image original size", imageSize);

  let usePriority = "width";
  if (
    imageSize.width / (imageSize.height + 40) >
    workAreaSize.width / workAreaSize.height
  ) {
    usePriority = "width";
  } else {
    usePriority = "height";
  }

  const minHeight = 640;
  const minWidth = 740;

  let mainWindowWidth = minWidth;
  let mainWindowHeight = minHeight;

  console.log(usePriority);

  if (usePriority === "height") {
    mainWindowHeight = workAreaSize.height * 0.9 * scaleFactor;
    mainWindowWidth = minWidth;

    console.log(mainWindowHeight, imageSize.height);
    if (mainWindowHeight > imageSize.height) {
      mainWindowHeight = imageSize.height;
      mainWindowWidth = imageSize.width * (mainWindowHeight / imageSize.height);
    } else {
      mainWindowHeight = workAreaSize.height * 0.9;
      mainWindowWidth = imageSize.width * (mainWindowHeight / imageSize.height);
    }

    if (mainWindowHeight < minHeight) {
      mainWindowHeight = minHeight;
    }

    if (mainWindowWidth < minWidth) {
      mainWindowWidth = minWidth;
    }
  } else if (usePriority === "width") {
    mainWindowWidth = workAreaSize.width * 0.9 * scaleFactor;
    mainWindowHeight = minHeight;

    console.log(mainWindowHeight, imageSize.height);
    if (mainWindowWidth > imageSize.width) {
      mainWindowWidth = imageSize.width;
      mainWindowHeight = imageSize.height * (mainWindowWidth / imageSize.width);
    } else {
      mainWindowWidth = workAreaSize.width * 0.9;
      mainWindowHeight = imageSize.height * (mainWindowWidth / imageSize.width);
    }

    if (mainWindowWidth < minWidth) {
      mainWindowWidth = minWidth;
    }

    if (mainWindowHeight < minHeight) {
      mainWindowHeight = minHeight;
    }
  }

  console.log(~~mainWindowWidth, ~~mainWindowHeight);

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: ~~mainWindowWidth,
    height: ~~mainWindowHeight,
    minHeight,
    minWidth,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    // titleBarStyle: "hidden",
    // titleBarOverlay: false,
    // trafficLightPosition: { x: 14, y: 12 },
  });

  ipcMain.on("maximize", () => {
    console.log("maximize");
    mainWindow.maximize();
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
