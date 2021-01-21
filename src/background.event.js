"use strict";
import { app, ipcMain, BrowserWindow } from "electron";
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
  let child = new BrowserWindow({
    parent: BrowserWindow.getFocusedWindow(),
    modal: true,
    transparent: true,
    backgroundColor: '#fff',
    width: 300,
    height: 300,
    x: 0,
    y: 0,
    webPreferences: {
      webSecurity: false,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await child.loadURL(`../docs/index.html`);
    if (!process.env.IS_TEST) child.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    child.loadURL("app://./index.html");
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
  app.exit()
});