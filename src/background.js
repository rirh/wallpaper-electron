"use strict";
import { app } from "electron";

import pages from "./background.page";
import createTray from "./background.tray";
import createWindow from "./utils/pageFactoy";
import createMainEvent from "./background.event.js";

// import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";

const isDevelopment = process.env.NODE_ENV !== "production";
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
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
});
app.on("browser-window-blur", () => {
  // const [win] = BrowserWindow.getAllWindows();
  // win.hide();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  //
  proload_page();
  const tray = createTray();
  createMainEvent(tray);
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

const proload_page = () => {
  pages().forEach(e => {
    if (e.proload) {
      createWindow(e);
    }
  });
};
