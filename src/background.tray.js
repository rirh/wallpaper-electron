"use strict";
import path from "path";
import { app, Tray, Menu, BrowserWindow } from "electron";
import store from "./electron-store";
let tray = null;
export default function() {
  // eslint-disable-next-line no-undef
  const iconPath = path.join(__static, "38x38@2x.png");
  tray = new Tray(iconPath);
  tray.setToolTip(`${app.getName()}`);
  const winid = store.get("index");
  const win = BrowserWindow.fromId(winid);
  const getWindowPosition = () => {
    const windowBounds = win.getBounds();
    const trayBounds = tray.getBounds();
    const x = Math.round(
      trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
    );
    const y = Math.round(trayBounds.y + trayBounds.height);
    return { x, y };
  };
  if (process.platform === "darwin") {
    const position = getWindowPosition();
    win.setPosition(position.x, position.y, false);
  }
  win.show();
  win.focus();
  if (process.platform !== "darwin") {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "开机自启",
        type: "checkbox",
        checked: app.getLoginItemSettings().openAtLogin,
        click: item => {
          const { checked } = item;
          app.setLoginItemSettings({ openAtLogin: checked });
        }
      },
      {
        label: "最小化",
        click: function() {
          const [win] = BrowserWindow.getAllWindows();
          win.hide();
        }
      },
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
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });
  return tray;
}
