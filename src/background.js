"use strict";
import { app } from "electron";

import pages from "./background.page";
import createTray from "./background.tray";
import createWindow from "./utils/pageFactoy";
import createMainEvent from "./background.event.js";
import store from "./electron-store";

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
  proload_setting();
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

const proload_setting = () => {
  const default_dowload_path = `${require("os").homedir()}${
    process.platform !== "darwin" ? "\\Downloads" : "/Downloads"
  }`;
  const default_is_random = false;
  const default_random_time =`net-${1000 * 60 * 60}`;
  const path = store.get("dowload-path") || default_dowload_path;
  const is_random = store.get("is_random") || default_is_random;
  const random_time = store.get("random_time") || default_random_time;
  store.set("dowload-path", path);
  store.set("is_random", is_random);
  store.set("random_time", random_time);
};
