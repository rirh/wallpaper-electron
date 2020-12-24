"use strict";
import electron, { ipcMain, ipcRenderer, remote } from "electron";

document.addEventListener('DOMNodeInserted', () => {
  window.ipcMain = ipcMain;
  window.ipcRenderer = ipcRenderer;
  window.electron = electron;
  window.remote = remote;
  window.process = process;
  window.os = require('os');
})