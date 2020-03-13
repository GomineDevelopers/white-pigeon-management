const webpack = require("webpack");
let path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  publicPath: "./",
  assetsDir: "static",
  productionSourceMap: false,
  //反向代理的配置
  devServer: {
    proxy: {
      "/": {
        target: "http://back.zidata.cn/admin", //目标地址
        changeOrigin: true,
        pathRewrite: {
          "^/": "/"
        }
      }
    }
  }
};
