"use strict";
import fs from "fs";
import util from "util";
import wallpaper from "wallpaper";
import store from "./electron-store";
import { app, ipcMain, BrowserWindow } from "electron";
import { autoUpdater } from "electron-updater";
import { downloadPic, cancelDownloadPic } from "@/utils/file";
// import path from "path";
const exec = util.promisify(require("child_process").exec);
const setWallpaper = (downloadloc, cb) => {
  const osvar = process.platform;
  //   downloadloc = path.resolve(downloadloc);
  const command = `osascript -e 'tell application "System Events" to tell every desktop to set picture to "${downloadloc}"'`;
  if (osvar === "darwin") {
    // currently only macOS is supported.
    exec(command, err => {
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
      .then(_ => {
        if (cb) cb(_);
      })
      .catch(error => {
        if (cb) cb(error);
        throw error;
      });
  }
};

export default tray => {
  ipcMain.on("setwapper", (_, { path, i }) => {
    setWallpaper(path, _.returnValue(`done${i}`));
  });

  ipcMain.on("setpaper", (_, { path, i }) => {
    downloadPic(path, res => {
      _.sender.send("reply-pro", res);
    })
      .then(loc => {
        console.log(loc);
        setWallpaper(loc, () => {
          _.sender.send("reply-setpaper", { state: "done", i });
        });
      })
      .catch(err => {
        _.sender.send("reply-setpaper", { state: "error", i, err });
      });
  });
  // 设置开机启动
  ipcMain.on("setloginitem", (_, openAtLogin) => {
    app.setLoginItemSettings({ openAtLogin });
  });
  // 打开设置页面
  ipcMain.on("opensettingpage", async () => {
    const winid = store.get("setting");
    const win = BrowserWindow.fromId(winid);
    const windowBounds = win.getBounds();
    const trayBounds = tray.getBounds();
    const x = Math.round(
      trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
    );
    const y = Math.round(trayBounds.y + trayBounds.height);
    win.setPosition(x + 125, y + 55, false);
    if (process.platform === "win32") {
      const { screen } = require("electron");
      win.setAlwaysOnTop(true);
      win.setPosition(
        screen.getCursorScreenPoint().x / 2 - 100,
        screen.getCursorScreenPoint().y / 2 - 150,
        false
      );
    }
    win.on("blur", () => {
      win.hide();
    });
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
      win.focus();
    }
  });

  ipcMain.on("sendCanelDowload", () => {
    cancelDownloadPic();
  });

  ipcMain.on("autoChangeWall", _ => {
    let timer = null;
    const startTimeChange = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        _.sender.send("reply-auto-change-wall");
        startTimeChange();
      }, 1000 * 60 * 60 * 24);
    };
    startTimeChange();
  });

  ipcMain.on("close-app", () => {
    app.exit();
  });

  ipcMain.on("update-auto-lunch-app", (_, checked) => {
    if (typeof checked === "boolean") {
      app.setLoginItemSettings({ openAtLogin: checked });
    }
    _.returnValue = app.getLoginItemSettings().openAtLogin;
  });
};

ipcMain.on("auto-change-image", (_, url) => {
  let is_random = store.get("is_random");
  console.log("auto-change-image", is_random, url);
  if (!is_random) {
    _.sender.send("reply-auto-change-image", { state: "done" });
    return;
  }
  downloadPic(url, () => {})
    .then(loc => {
      setWallpaper(loc, () => {
        _.sender.send("reply-auto-change-image", { state: "done" });
      });
    })
    .catch(err => {
      _.sender.send("reply-auto-change-image", { state: "error", err });
    });
  autoUpdater.checkForUpdatesAndNotify();
});

ipcMain.on("auto-change-image-from-local", _ => {
  const hostdir = store.get("dowload-path");
  let is_random = store.get("is_random");
  console.log("auto-change-image-from-local", is_random);
  if (!is_random) {
    _.sender.send("reply-auto-change-image", { state: "done" });
    return;
  }
  fs.readdir(hostdir, (err, dirs) => {
    const list = dirs.filter(e => e.match(/\.(png|jpe?g|gif|svg)(\?.*)?$/));
    const len = list.length - 1;
    const ran = parseInt(Math.random() * (len - 0 + 1) + 0, 10);
    setWallpaper(
      `${hostdir}${process.platform !== "darwin" ? "\\" : "/"}${list[ran]}`,
      () => {
        _.sender.send("reply-auto-change-image", { state: "done" });
      }
    );
  });
  autoUpdater.checkForUpdatesAndNotify();
});
