"use strict";
import { ipcMain } from "electron";
import wallpaper from "wallpaper";
import util from "util";
import { downloadPic } from "@/utils/file";

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

ipcMain.on("setwapper", (_, path) => {
  setWallpaper(path, _.returnValue("done"));
});

ipcMain.on("setpaper", (_, path) => {
  downloadPic(path).then((loc) => {
    setWallpaper(loc, (res) => {
      console.log(res);
      _.sender.send("reply-setpaper", "done");
    });
  });
});
