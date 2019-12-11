import Vue from "vue";
import App from "./App.vue";
import router from "./router";

//自己的配置
import "./js/element-ui";
import "./css/public.css";

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
