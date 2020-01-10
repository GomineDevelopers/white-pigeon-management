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
        path: "/representative",
        name: "representative",
        component: () =>
          import(/* webpackChunkName: "login" */ "../views/Representative.vue")
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
      {
        path: "/biddingManagement",
        name: "BiddingManagement",
        component: () =>
          import(
            /* webpackChunkName: "login" */ "../views/productapplication/BiddingManagement.vue"
          )
      },
      {
        path: "/contract",
        name: "Contract",
        component: () =>
          import(
            /* webpackChunkName: "login" */ "../views/productapplication/ContractDownload.vue"
          )
      },
      {
        path: "/historyflowdirectory",
        name: "HistoryFlowDirectory",
        component: () =>
          import(
            /* webpackChunkName: "login" */ "../views/bonusplan/HistoryFlowDirectory.vue"
          )
      },
      {
        path: "/bonusplan",
        name: "BonusPlan",
        component: () =>
          import(
            /* webpackChunkName: "login" */ "../views/bonusplan/BonusPlan.vue"
          )
      },
      {
        path: "/incomedetail",
        name: "IncomeDetail",
        component: () =>
          import(
            /* webpackChunkName: "login" */ "../views/bonusplan/IncomeDetail.vue"
          )
      },
      {
        path: "/verificationlist",
        name: "VerificationList",
        component: () =>
          import(
            /* webpackChunkName: "login" */ "../views/bonusplan/VerificationList.vue"
          )
      },
      {
        path: "/mettingverification",
        name: "MettingVerification",
        component: () =>
          import(
            /* webpackChunkName: "login" */ "../views/bonusplan/MettingVerification.vue"
          )
      },
      {
        path: "/propertymanagement",
        name: "PropertyManagement",
        component: () =>
          import(
            /* webpackChunkName: "login" */ "../views/PropertyManagement.vue"
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
