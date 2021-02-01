import { BrowserWindow, createProtocol } from "electron";
import store from "../electron-store";

export default function ({ name, options }) {
  // const isDevelopment = process.env.NODE_ENV !== "production";
  // Create the browser window.
  const window = new BrowserWindow({
    ...options,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      webSecurity: false,
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      enableRemoteModule: true,
      preload: require("path").join(__dirname, "preload.js"),
      devTools: true
    }
  });
  store.set(name, window.id);
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    window.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}${name}`);
    if (!process.env.IS_TEST) window.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    window.loadURL(`app://./${name}.html`);
  }
  return window;
}
