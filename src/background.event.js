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
        // node couldn't execute the command
        console.log(err);
        return;
      }
      if (cb) cb();
    });
  } else {
    wallpaper.set(downloadloc);
  }
};

ipcMain.on("setwapper", (_, path) => {
  setWallpaper(path, _.returnValue("done"));
});

ipcMain.on("setpaper", (_, path) => {
  downloadPic(path).then((loc) => {
    setWallpaper(loc,()=>{
      _.sender.send('reply-setpaper', 'done');
    });
  });
});
