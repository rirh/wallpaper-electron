import path from "path";
const pages = () => {
  const { screen } = require("electron");
  console.log(Math.floor(screen.getCursorScreenPoint().x - 282 / 2 + 40));
  return [
    {
      name: "index",
      proload: true,
      options: {
        width: 290,
        height: 610,
        y: 0,
        x: 0,
        transparent: true,
        frame: false,
        show: false,
        fullscreenable: false,
        resizable: false,
        alwaysOnTop: false,
        icon: path.join(__static, "icon.png"),
        webPreferences: {
          webSecurity: false,
          nodeIntegration: true,
          enableRemoteModule: true,
          preload: path.join(__static, "preload.js"),
          devTools: true
        }
      }
    },
    {
      name: "setting",
      proload: true,
      options: {
        width: 200,
        height: 300,
        y: 75,
        show: false,
        transparent: true,
        x: 0,
        frame: false,
        icon: path.join(__static, "icon.png")
      }
    }
  ];
};
/* global __static */
export default pages;
