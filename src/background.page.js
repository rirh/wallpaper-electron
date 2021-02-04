import path from "path";
const isDevelopment = process.env.NODE_ENV !== "production";
const pages = () => {
  const { screen } = require("electron");
  return [
    {
      name: "index",
      proload: true,
      options: {
        width: 290,
        height: 610,
        maximizable:false,

        y: screen.getCursorScreenPoint().y / 2,
        x: screen.getCursorScreenPoint().x / 2 - 282 / 2,
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
          preload: require("path").join(__dirname, "preload.js"),
          devTools: isDevelopment
        }
      }
    },
    {
      name: "setting",
      proload: true,
      options: {
        width: 200,
        height: 300,
        maximizable:false,
        show: false,
        transparent: true,
        frame: false,
        icon: path.join(__static, "icon.png")
      }
    }
  ];
};
/* global __static */
export default pages;
