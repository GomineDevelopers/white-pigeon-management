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
        changeOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {
          "^/": "/"
        }
      }
    }
  }
};
