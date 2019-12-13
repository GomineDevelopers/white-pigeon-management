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
  //以下几个路由无需token
  if (to.path == "/login") {
    next();
  } else {
    if (token) {
      store.commit("setToken", token);
      next();
    } else {
      Message({
        message: "请先登录！",
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
