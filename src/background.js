"use strict";
import { app, protocol, BrowserWindow, screen } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { autoUpdater } from "electron-updater";
import AutoLaunch from "auto-launch";
// import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import path from "path";
import createTray from "./background.tray.js";
import "./background.event.js";

const isDevelopment = process.env.NODE_ENV !== "production";
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);
let win;
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 290,
    height: 610,
    y: 0,
    x: screen.getCursorScreenPoint().x - 282 / 2 + 60,
    transparent: true,
    frame: false,
    show: false,
    fullscreenable: false,
    resizable: false,
    alwaysOnTop: false,
    /* global __static */
    icon: path.join(__static, "icon.png"),
    webPreferences: {
      webSecurity: false,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
      preload: require("path").join(__dirname, "preload.js"),
      devTools: isDevelopment
    }
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
    autoUpdater.checkForUpdatesAndNotify();
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  console.log("window-all-closed");

  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  console.log("activate");

  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  console.log(win);
});
app.on("browser-window-blur", () => {
  // const [win] = BrowserWindow.getAllWindows();
  // win.hide();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  // Install Vue Devtools
  // try {
  //   await installExtension(VUEJS_DEVTOOLS);
  // } catch (e) {
  //   console.error("Vue Devtools failed to install:", e.toString());
  // }
  // }
  createWindow();
  createTray();
  // 设置开机启动
  if (!isDevelopment) {
    let alConfig = { name: "wall.paper", isHidden: true };
    if (process.env.APPIMAGE) {
      alConfig = Object.assign(alConfig, { path: process.env.APPIMAGE });
    }
    let autoLaunch = new AutoLaunch(alConfig);
    autoLaunch.isEnabled().then(isEnabled => {
      if (!isEnabled) autoLaunch.enable();
    });
  }
});
app.on("browser-window-blur", () => {
  // const [win] = BrowserWindow.getAllWindows();
  // win.hide();
});
// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
