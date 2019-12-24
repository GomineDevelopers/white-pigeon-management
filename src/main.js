import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//自己的配置
import api from "./api/axios";
import "./js/element-ui";
import "./css/public.css";
import { Message } from "element-ui";

Vue.prototype.$api = api;
Vue.config.productionTip = false;

// 检查用户登录状态
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem("adminToken"); //从localStorage中取用户token
  let validTime = localStorage.getItem("validTime"); //从localStorage中取用户token有效时间
  let newDate = new Date().getTime();
  // console.log("newDate", newDate);
  // console.log("validTime", validTime);
  let time = validTime - newDate;
  console.log("token有效时间剩余", time);
  //登录路由无需token
  if (to.path == "/login") {
    next();
  } else {
    if (token) {
      store.commit("setToken", token);
      if (time > 300000) {
        //如果过期时间差小于5分钟  刷新token
        next();
      } else {
        console.log("token快过期了，即将重新请求！");
        api
          .refresh()
          .then(res => {
            console.log(res);
            if (res.code == 200) {
              let expires_in = parseInt(res.expires_in);
              let expiresDate = new Date().getTime() + expires_in * 1000; // 当前时间加上900秒
              store.dispatch("refreshToken", res.access_token); //刷新token
              localStorage.setItem("validTime", expiresDate); //重新存放本地存放access_token有效时间validTime
              next();
            }
          })
          .catch(error => {
            console.log(error);
            Message.error("token刷新失败，请重试！");
          });
      }
    } else {
      Message({
        message: "您当前未登录，请先登录！",
        type: "warning"
      });
      if (to.path == "/login") {
        next(); //注意在router.beforeEach中一定要用next()来跳出导航循环
      } else {
        //如果用户去的页面不是登录页则跳转登录页
        next("/login");
      }
    }
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
