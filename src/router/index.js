import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
    children: [
      {
        path: "/regionalManager",
        name: "regionalManager",
        component: () => import(/* webpackChunkName: "home" */ "../views/RegionalManager.vue")
      },
      { path: "/", redirect: "/regionalManager" } //二级路由默认首页为数据总览页
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () => import(/* webpackChunkName: "login" */ "../views/login/Login.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
