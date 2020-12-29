"use strict";
import path from 'path';
import { app, Tray, Menu, screen } from "electron";
let tray = null;
export default function () {
  const iconPath = path.join(__dirname, "../src/assets/38x38@2x.png");
  tray = new Tray(iconPath);
  tray.setToolTip(`${app.getName()}`);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: `开机启动：${app.getLoginItemSettings().openAtLogin ? '开' : '关'}`, click: function () {
        app.setLoginItemSettings({ openAtLogin: !app.getLoginItemSettings().openAtLogin });
      }
    },
    { label: '退出', click: function () { app.quit() } }
  ])
  tray.setContextMenu(contextMenu)
  tray.on("click", () => {
    win.setPosition(screen.getCursorScreenPoint().x - 282 / 2, 10);
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });
  return tray;
}