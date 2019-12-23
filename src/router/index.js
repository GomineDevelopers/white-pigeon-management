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
        component: () =>
          import(/* webpackChunkName: "home" */ "../views/RegionalManager.vue")
      },
      {
        path: "/regionAssigned",
        name: "regionAssigned",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "../views/regionalmanagement/RegionAssigned.vue"
          )
      },
      {
        path: "/applyRecord",
        name: "applyRecord",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "../views/regionalmanagement/ApplyRecord.vue"
          )
      },
      {
        path: "/hospitalManagement",
        name: "hospitalManagement",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "../views/HospitalManagement.vue"
          )
      },
      {
        path: "/purposetopical",
        name: "PurposeTopical",
        component: () =>
          import(
            /* webpackChunkName: "login" */ "../views/visitmetting/PurposeTopical.vue"
          )
      },
      {
        path: "/visitapprove",
        name: "VisitApprove",
        component: () =>
          import(
            /* webpackChunkName: "login" */ "../views/visitmetting/VisitApprove.vue"
          )
      },
      {
        path: "/productManagement",
        name: "ProductManagement",
        component: () =>
          import(
            /* webpackChunkName: "login" */ "../views/productmanagement/ProductManagement.vue"
          )
      },
      {
        path: "/mettingapprove",
        name: "MettingApprove",
        component: () =>
          import(
            /* webpackChunkName: "login" */ "../views/visitmetting/MettingApprove.vue"
          )
      },
      {
        path: "/mettingTheme",
        name: "MettingTheme",
        component: () =>
          import(
            /* webpackChunkName: "login" */ "../views/visitmetting/MettingTheme.vue"
          )
      },
      {
        path: "/dataCenter",
        name: "DataCenter",
        component: () =>
          import(/* webpackChunkName: "login" */ "../views/DataCenter.vue")
      },
      {
        path: "/doctorManagement",
        name: "DoctorManagement",
        component: () =>
          import(
            /* webpackChunkName: "login" */ "../views/DoctorManagement.vue"
          )
      },
      {
        path: "/sectionManagement",
        name: "SectionManagement",
        component: () =>
          import(
            /* webpackChunkName: "login" */ "../views/productmanagement/SectionManagement.vue"
          )
      },
      {
        path: "/productSection",
        name: "ProductSection",
        component: () =>
          import(
            /* webpackChunkName: "login" */ "../views/productmanagement/ProductSection.vue"
          )
      },
      { path: "/", redirect: "/hospitalManagement" } //二级路由默认首页为数据总览页
    ]
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/login/Login.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
