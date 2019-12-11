import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "regionalManager",
    component: () => import(/* webpackChunkName: "hospital" */ "../views/RegionalManager.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
