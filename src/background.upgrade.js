"use strict";
import { ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle(updateConfig) {
  let message = {
    error: "update error",
    checking: "updating...",
    updateAva: "fetch new version and downloading...",
    updateNotAva: "do not to update",
  };
  // 设置服务器更新地址
  autoUpdater.setFeedURL({
    provider: "generic",
    url: updateConfig.download,
  });
  autoUpdater.on("error", function() {
    sendUpdateMessage(message.error);
  });
  autoUpdater.on("checking-for-update", function() {
    sendUpdateMessage(message.checking);
  });
  // 版本检测结束，准备更新
  autoUpdater.on("update-available", function() {
    sendUpdateMessage(message.updateAva);
  });
  autoUpdater.on("update-not-available", function() {
    sendUpdateMessage(message.updateNotAva);
  });
  // 更新下载进度事件
  autoUpdater.on("download-progress", function(progressObj) {
    console.log("下载进度百分比>>>", progressObj.percent);
  });
  // 下载完成
  autoUpdater.on("update-downloaded", function() // event,
  // releaseNotes,
  // releaseName,
  // releaseDate,
  // updateUrl,
  // quitAndUpdate
  {
    // 退出且重新安装
    autoUpdater.quitAndInstall();
  });
  ipcMain.on("checkForUpdate", () => {
    // 执行自动更新检查
    autoUpdater.checkForUpdates();
  });
  // 通过main进程发送事件给renderer进程，提示更新信息
  function sendUpdateMessage(text) {
    window.mainWindow.webContents.send("message", text);
  }
}
export default updateHandle;
