#!/usr/bin/env node
"use strict";
// https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/recipes.html#auto-update
// 自动更新
var exec = require("child_process").exec;
const { pluginOptions: { GN_TOKEN } } = require("./vue.config");
// 此脚本仅适用与个人
let setEn = "";
if (process.platform === "darwin") {
  setEn = `export GH_TOKEN=${GN_TOKEN}`;
} else {
  setEn = `export GH_TOKEN=${GN_TOKEN}`;
}
const commend = `
${setEn} && 
yarn electron:build -p always;
`;
exec(commend);
