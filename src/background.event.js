"use strict";
import { app, ipcMain, BrowserView } from "electron";
import wallpaper from "wallpaper";
import util from "util";
import { downloadPic, cancelDownloadPic } from "@/utils/file";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";

// import path from "path";
const exec = util.promisify(require("child_process").exec);
const setWallpaper = (downloadloc, cb) => {
  const osvar = process.platform;
  //   downloadloc = path.resolve(downloadloc);
  const command = `osascript -e 'tell application "System Events" to tell every desktop to set picture to "${downloadloc}"'`;
  if (osvar === "darwin") {
    // currently only macOS is supported.
    exec(command, (err) => {
      if (err) {
        if (cb) cb(err);
        // node couldn't execute the command
        console.log(err);
        return;
      }
      if (cb) cb("done");
    });
  } else {
    wallpaper
      .set(downloadloc)
      .then((_) => {
        if (cb) cb(_);
      })
      .catch((error) => {
        if (cb) cb(error);
        throw error;
      });
  }
};

ipcMain.on("setwapper", (_, { path, i }) => {
  setWallpaper(path, _.returnValue(`done${i}`));
});

ipcMain.on("setpaper", (_, { path, i }) => {
  downloadPic(path, (res) => {
    _.sender.send("reply-pro", res);
  }).then((loc) => {
    setWallpaper(loc, () => {
      _.sender.send("reply-setpaper", { state: "done", i });
    });
  }).catch(err => {
    _.sender.send("reply-setpaper", { state: "error", i });
  });
});
// 设置开机启动
ipcMain.on("setloginitem", (_, openAtLogin) => {
  app.setLoginItemSettings({ openAtLogin });
});
// 打开设置页面
ipcMain.on("opensettingpage", () => {
  const view = new BrowserView();
  view.setBounds({ x: 400, y: 40, width: 300, height: 300 });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    view.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}/setting`);
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    view.loadURL("app://./index.html/setting");
  }
});
ipcMain.on("sendCanelDowload", () => {
  cancelDownloadPic();
});
