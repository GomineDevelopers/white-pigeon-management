import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
    redirect: "/hospitalManagement",
    children: [
      {
        path: "/test",
        name: "test",
        component: () => import(/* webpackChunkName: "home" */ "../views/test.vue"),
      },
      {
        path: "/regionalManager",
        name: "regionalManager",
        component: () => import(/* webpackChunkName: "home" */ "../views/RegionalManager.vue"),
      },
      {
        path: "/regionAssigned",
        name: "regionAssigned",
        component: () =>
          import(
            /* webpackChunkName: "home" */
            "../views/regionalmanagement/RegionAssigned.vue"
          ),
      },
      {
        path: "/applyRecord",
        name: "applyRecord",
        component: () =>
          import(
            /* webpackChunkName: "home" */
            "../views/regionalmanagement/ApplyRecord.vue"
          ),
      },
      {
        path: "/hospitalManagement",
        name: "hospitalManagement",
        component: () =>
          import(
            /* webpackChunkName: "home" */
            "../views/HospitalManagement.vue"
          ),
      },
      {
        path: "/purposetopical",
        name: "PurposeTopical",
        component: () =>
          import(
            /* webpackChunkName: "login" */
            "../views/visitmetting/PurposeTopical.vue"
          ),
      },
      {
        path: "/visitapprove",
        name: "VisitApprove",
        component: () =>
          import(
            /* webpackChunkName: "login" */
            "../views/visitmetting/VisitApprove.vue"
          ),
      },
      {
        path: "/visitverification",
        name: "VisitVerification",
        component: () =>
          import(
            /* webpackChunkName: "login" */
            "../views/visitmetting/VisitVerification.vue"
          ),
      },
      {
        path: "/productManagement",
        name: "ProductManagement",
        component: () =>
          import(
            /* webpackChunkName: "login" */
            "../views/productmanagement/ProductManagement.vue"
          ),
      },
      {
        path: "/mettingapprove",
        name: "MettingApprove",
        component: () =>
          import(
            /* webpackChunkName: "login" */
            "../views/visitmetting/MettingApprove.vue"
          ),
      },
      {
        path: "/mettingTheme",
        name: "MettingTheme",
        component: () =>
          import(
            /* webpackChunkName: "login" */
            "../views/visitmetting/MettingTheme.vue"
          ),
      },
      {
        path: "/dataCenter",
        name: "DataCenter",
        component: () => import(/* webpackChunkName: "login" */ "../views/DataCenter.vue"),
      },
      {
        path: "/doctorManagement",
        name: "DoctorManagement",
        component: () =>
          import(
            /* webpackChunkName: "login" */
            "../views/DoctorManagement.vue"
          ),
      },
      {
        path: "/representative",
        name: "representative",
        component: () =>
          import(
            /* webpackChunkName: "login" */ "../views/representativemanagement/Representative.vue"
          ),
      },
      {
        path: "/terminateagreement",
        name: "terminateagreement",
        component: () =>
          import(
            /* webpackChunkName: "login" */ "../views/representativemanagement/TerminateAgreement.vue"
          ),
      },
      {
        path: "/sectionManagement",
        name: "SectionManagement",
        component: () =>
          import(
            /* webpackChunkName: "login" */
            "../views/productmanagement/SectionManagement.vue"
          ),
      },
      {
        path: "/productSection",
        name: "ProductSection",
        component: () =>
          import(
            /* webpackChunkName: "login" */
            "../views/productmanagement/ProductSection.vue"
          ),
      },
      {
        path: "/biddingManagement",
        name: "BiddingManagement",
        component: () =>
          import(
            /* webpackChunkName: "login" */
            "../views/productapplication/BiddingManagement.vue"
          ),
      },
      {
        path: "/contract",
        name: "Contract",
        component: () =>
          import(
            /* webpackChunkName: "login" */
            "../views/productapplication/ContractDownload.vue"
          ),
      },
      {
        path: "/historyflowdirectory",
        name: "HistoryFlowDirectory",
        component: () =>
          import(
            /* webpackChunkName: "login" */
            "../views/bonusplan/HistoryFlowDirectory.vue"
          ),
      },
      {
        path: "/bonusplan",
        name: "BonusPlan",
        component: () =>
          import(
            /* webpackChunkName: "login" */
            "../views/bonusplan/BonusPlan.vue"
          ),
      },
      {
        path: "/incomedetail",
        name: "IncomeDetail",
        component: () =>
          import(
            /* webpackChunkName: "login" */
            "../views/bonusplan/IncomeDetail.vue"
          ),
      },
      {
        path: "/verificationlist",
        name: "VerificationList",
        component: () =>
          import(
            /* webpackChunkName: "login" */
            "../views/bonusplan/VerificationList.vue"
          ),
      },
      {
        path: "/mettingverification",
        name: "MettingVerification",
        component: () =>
          import(
            /* webpackChunkName: "login" */
            "../views/bonusplan/MettingVerification.vue"
          ),
      },
      {
        path: "/propertymanagement",
        name: "PropertyManagement",
        component: () =>
          import(
            /* webpackChunkName: "login" */
            "../views/PropertyManagement.vue"
          ),
      },
      {
        path: "/register",
        name: "Register",
        component: () =>
          import(
            /* webpackChunkName: "xiaoyuer" */
            "../views/xiaoyuer/Register.vue"
          ),
      },
      {
        path: "/postdemand",
        name: "PostDemand",
        component: () =>
          import(
            /* webpackChunkName: "xiaoyuer" */
            "../views/xiaoyuer/PostDemand.vue"
          ),
      },
      {
        path: "/registeredserviceinfo",
        name: "RegisteredServiceInfo",
        component: () =>
          import(
            /* webpackChunkName: "xiaoyuer" */
            "../views/xiaoyuer/RegisteredServiceInfo.vue"
          ),
      },
      {
        path: "/server",
        name: "Server",
        component: () =>
          import(
            /* webpackChunkName: "xiaoyuer" */
            "../views/xiaoyuer/Server.vue"
          ),
      },
      {
        path: "/pay",
        name: "Pay",
        component: () =>
          import(
            /* webpackChunkName: "xiaoyuer" */
            "../views/xiaoyuer/Pay.vue"
          ),
      },
      {
        path: "/order",
        name: "Order",
        component: () =>
          import(
            /* webpackChunkName: "xiaoyuer" */
            "../views/xiaoyuer/Order.vue"
          ),
      },
      {
        path: "/feedbacklist",
        name: "feedbackList",
        component: () =>
          import(
            /* webpackChunkName: "xiaoyuer" */
            "../views/feedback/FeedbackList.vue"
          ),
      },
      {
        path: "/feedbacklistcontent",
        name: "feedbackListContent",
        component: () =>
          import(
            /* webpackChunkName: "xiaoyuer" */
            "../views/feedback/FeedbackListContent.vue"
          ),
      },
      {
        path: "/doctorapplylist",
        name: "DoctorApplyList",
        component: () =>
          import(
            /* webpackChunkName: "xiaoyuer" */
            "../views/DoctorApplyList.vue"
          ),
      },
      {
        path: "/",
        redirect: "/hospitalManagement",
      }, //二级路由默认首页为数据总览页
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import(/* webpackChunkName: "login" */ "../views/login/Login.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
