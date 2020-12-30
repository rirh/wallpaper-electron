"use strict";
import path from "path";
import { app, Tray, Menu, BrowserWindow } from "electron";
let tray = null;
export default function() {
  // eslint-disable-next-line no-undef
  const iconPath = path.join(__static, "38x38@2x.png");
  tray = new Tray(iconPath);
  tray.setToolTip(`${app.getName()}`);
  const getWindowPosition = () => {
    const [win] = BrowserWindow.getAllWindows();
    const windowBounds = win.getBounds();
    const trayBounds = tray.getBounds();
    const x = Math.round(
      trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
    );
    const y = Math.round(trayBounds.y + trayBounds.height);
    return { x, y };
  };
  const [win] = BrowserWindow.getAllWindows();
  if (process.platform === "darwin") {
    const position = getWindowPosition();
    win.setPosition(position.x, position.y, false);
  }
  win.show();
  win.focus();
  if (process.platform !== "darwin") {
    const contextMenu = Menu.buildFromTemplate([
      // {
      //   label: `开机启动：${
      //     app.getLoginItemSettings().openAtLogin ? "开" : "关"
      //   }`,
      //   click: function() {
      //     app.setLoginItemSettings({
      //       openAtLogin: !app.getLoginItemSettings().openAtLogin
      //     });
      //   }
      // },
      {
        label: "退出",
        click: function() {
          app.quit();
        }
      }
    ]);
    tray.setContextMenu(contextMenu);
  }
  tray.on("click", e => {
    e.preventDefault();
    const [win] = BrowserWindow.getAllWindows();
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });
  return tray;
}
