import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//自己的配置
import api from "./api/axios";
import "./js/element-ui";
import "./css/public.css";

Vue.prototype.$api = api;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
