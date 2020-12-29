const WorkerPlugin = require("worker-plugin");
module.exports = {
  configureWebpack: {
    plugins: [new WorkerPlugin()]
  },
  pluginOptions: {
    GN_TOKEN: "db28130a8bdeee1284b8a0377581cccc44ee8c38",
    electronBuilder: {
      // List native deps here if they don't work
      externals: ["my-native-dep"],
      // If you are using Yarn Workspaces, you may have multiple node_modules folders
      // List them all here so that VCP Electron Builder can find them
      nodeModulesPath: ["../../node_modules", "./node_modules"],
      // seting background nodeIntegration
      nodeIntegration: true,
      preload: "src/preload.js",
      builderOptions: {
        productName: "wall.paper",
        appId: "com.wall.paper",
        publish: ["github"],
        dmg: {
          contents: [
            {
              x: 410,
              y: 150,
              type: "link",
              path: "/Applications"
            },
            {
              x: 130,
              y: 150,
              type: "file"
            }
          ]
        },
        mac: {
          icon: "./build/icons/icon.icns"
        },
        nsis: {
          oneClick: false, // 一键安装
          allowElevation: true, // 允许请求权限提升。如果为false，则用户必须使用提升的权限重新启动安装程序
          allowToChangeInstallationDirectory: true, // 允许修改安装路径
          perMachine: true, // 是否开启安装时权限限制(此电脑或当前用户)
          createDesktopShortcut: true, //创建桌面图标
          createStartMenuShortcut: true, // 创建开始菜单图标
          shortcutName: "Paper", // 图标名称
          //guid:"", // 注册表名 不推荐修改
          installerIcon: "./build/icons/icon.ico", // 安装图标
          uninstallerIcon: "./build/icons/icon.ico", // 卸载图标
          installerHeaderIcon: "./build/icons/icon.ico" // 安装时头部图标
        }
      }
    }
  },
  chainWebpack: config => {
    config.resolve.symlinks(true); // 修复热更新失效
  }
};
