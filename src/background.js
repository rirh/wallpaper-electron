"use strict";

import { app, protocol, BrowserWindow, Tray, screen } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import path from "path";
import "./background.event.js";

const isDevelopment = process.env.NODE_ENV !== "production";
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);
let win;
async function createWindow() {
  const iconPath = path.join(__dirname, "../src/assets/iconTemplate.png");
  const trayIcon = new Tray(iconPath);
  trayIcon.setToolTip(`${app.getName()}`);
  // Create the browser window.
  win = new BrowserWindow({
    width: 282,
    height: 600,
    y: 0,
    x: screen.getCursorScreenPoint().x - 282 / 2 + 60,
    transparent: true,
    frame: false,
    webPreferences: {
      webSecurity: false,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
      preload: require("path").join(__dirname, "preload.js"),
    },
  });
  // 检测是否MacOS darwin
  if (process.platform === "darwin" || trayIcon) {
    // 点击时显示窗口，并修改窗口的显示位置
    trayIcon.on("click", () => {
      const { width, height } = screen.getPrimaryDisplay().workAreaSize;
      const [defaultWidth, defaultHeight] = [width, height].map((x) =>
        Math.round((x * 3) / 4)
      );
      const WINDOW_WIDTH = defaultWidth - 250;
      const WINDOW_HEIGHT = defaultHeight;
      const HORIZ_PADDING = 15;
      const VERT_PADDING = 15;

      const cursorPosition = screen.getCursorScreenPoint();
      const primarySize = screen.getPrimaryDisplay().workAreaSize;
      const trayPositionVert =
        cursorPosition.y >= primarySize.height / 2 ? "bottom" : "top";
      const trayPositionHoriz =
        cursorPosition.x >= primarySize.width / 2 ? "right" : "left";

      win.setPosition(getTrayPosX(), getTrayPosY());
      if (win.isVisible()) {
        win.hide();
      } else {
        win.show();
      }
      // 计算位置
      function getTrayPosX() {
        const horizBounds = {
          left: cursorPosition.x - WINDOW_WIDTH / 2,
          right: cursorPosition.x + WINDOW_WIDTH / 2,
        };
        if (trayPositionHoriz === "left") {
          return horizBounds.left <= HORIZ_PADDING
            ? HORIZ_PADDING
            : horizBounds.left;
        }
        return horizBounds.right >= primarySize.width
          ? primarySize.width - HORIZ_PADDING - WINDOW_WIDTH
          : horizBounds.right - WINDOW_WIDTH;
      }
      function getTrayPosY() {
        return trayPositionVert === "bottom"
          ? cursorPosition.y - WINDOW_HEIGHT - VERT_PADDING
          : cursorPosition.y + VERT_PADDING;
      }
    });
  }
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
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
