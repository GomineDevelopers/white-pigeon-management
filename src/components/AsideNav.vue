<template>
  <el-row class="left_aside">
    <el-row class="header_logo">
      <img src="../assets/image/app_icon.png" />
      <span>朱鹊医访</span>
    </el-row>
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      router
      active-text-color="#3399FF"
      unique-opened
    >
      <el-menu-item index="/hospitalManagement">
        <img v-if="$route.path == '/hospitalManagement'" src="../assets/image/yy.png" />
        <img v-else src="../assets/image/yy1.png" />
        <span slot="title">医院管理</span>
      </el-menu-item>
      <el-submenu index="/productManagement">
        <template slot="title">
          <img src="../assets/image/cp1.png" />
          <span>产品管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/productManagement">产品管理</el-menu-item>
          <el-menu-item index="/productSection">产品科室</el-menu-item>
          <el-menu-item index="/sectionManagement">科室管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="/doctorManagement">
        <template slot="title">
          <img src="../assets/image/ys1.png" />
          <span>医生管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/doctorManagement">医生管理</el-menu-item>
          <el-menu-item index="/doctorapplylist">医生申请</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="/representative">
        <template slot="title">
          <img src="../assets/image/db1.png" />
          <span slot="title">代表管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/representative">
            <span slot="title">代表管理</span>
          </el-menu-item>
          <!-- <el-menu-item index="/terminateagreement">
            <span slot="title">产品解约</span>
          </el-menu-item> -->
          <el-menu-item index="/feedbacklist">
            <span slot="title">代表反馈</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="/regionAssigned">
        <template slot="title">
          <!-- <img src="../assets/image/qygl.png" /> -->
          <img src="../assets/image/qygl1.png" />
          <span>区域管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/regionAssigned">区域分配</el-menu-item>
          <!-- <el-menu-item index="/applyRecord">申请记录</el-menu-item> -->
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="/regionalManager">
        <img src="../assets/image/qyjl.png" v-if="$route.path === '/regionalManager'" />
        <img src="../assets/image/qyjl1.png" v-if="$route.path != '/regionalManager'" />
        <span slot="title">区域经理</span>
      </el-menu-item>
      <el-submenu index="/biddingManagement">
        <template slot="title">
          <img src="../assets/image/zbgl1.png" />
          <span>产品申请</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/biddingManagement">申请记录</el-menu-item>
          <el-menu-item index="/contract">合同下载</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <!-- <el-submenu index="8">
        <template slot="title">
          <img src="../assets/image/qy.png" />
          <img src="../assets/image/qy1.png" />
          <span>签约管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="8-1">签约审批</el-menu-item>
          <el-menu-item index="8-2">签约档案</el-menu-item>
        </el-menu-item-group>
      </el-submenu>-->
      <el-submenu index="/purposetopical">
        <template slot="title">
          <img src="../assets/image/bfhy1.png" />
          <span>拜访会议</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/purposetopical">拜访目的</el-menu-item>
          <el-menu-item index="/visitapprove">拜访审核</el-menu-item>
          <el-menu-item index="/visitverification">拜访核销</el-menu-item>
          <el-menu-item index="/mettingTheme">会议主题</el-menu-item>
          <el-menu-item index="/mettingapprove">会议审核</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="/historyflowdirectory">
        <template slot="title">
          <img src="../assets/image/jj1.png" />
          <span>奖金计算</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/historyflowdirectory">核销</el-menu-item>
          <el-menu-item index="/incomedetail">奖金明细</el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <!-- <el-menu-item index="11">
        <img src="../assets/image/yjbg.png" />
        <img src="../assets/image/yjbg1.png" />
        <span slot="title">业绩报告</span>
      </el-menu-item>-->
      <el-submenu index="/register">
        <template slot="title">
          <img src="../assets/image/yjbg1.png" />
          <span>小鱼儿平台</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/register">注册服务者</el-menu-item>
          <el-menu-item index="/postdemand">需求发布</el-menu-item>
          <el-menu-item index="/registeredserviceinfo">注册服务者列表</el-menu-item>
          <el-menu-item index="/server">上传报名服务者</el-menu-item>
          <el-menu-item index="/pay">跳转支付列表</el-menu-item>
          <el-menu-item index="/order">服务者订单列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="/dataCenter">
        <img src="../assets/image/zlzx.png" v-if="$route.path === '/dataCenter'" />
        <img src="../assets/image/zlzx1.png" v-if="$route.path != '/dataCenter'" />
        <span slot="title">资料中心</span>
      </el-menu-item>
      <el-menu-item index="/propertymanagement" v-if="access == 'true'">
        <img src="../assets/image/qx.png" v-if="$route.path === '/propertymanagement'" />
        <img src="../assets/image/qx1.png" v-else />
        <span slot="title">权限管理</span>
      </el-menu-item>
      <!-- <el-menu-item index="14">
        <img src="../assets/image/sz.png" />
        <img src="../assets/image/sz1.png" />
        <span slot="title">系统设置</span>
      </el-menu-item>-->
    </el-menu>
  </el-row>
</template>
<script>
export default {
  name: "asideNav",
  data() {
    return {
      access: null,
    };
  },
  created() {
    this.access = localStorage.getItem("access");
    // console.log(this.access);
  },
  methods: {
    handleOpen() {
      //   console.log(key, keyPath);
    },
    handleClose() {
      //   console.log(key, keyPath);
    },
  },
};
</script>
<style>
.left_aside .el-menu {
  border: none;
}
.left_aside .el-menu .el-menu-item {
  border-left: 3px solid #fff;
}
.left_aside .el-menu .el-menu-item.is-active {
  border-left: 3px solid #3399ff;
  background: rgba(51, 153, 255, 0.06);
}
.left_aside .el-menu .el-icon-arrow-down {
  font-size: 16px;
}
</style>
<style scoped>
.feedback_icon {
  font-size: 22px;
  color: #666;
  margin-right: 8px;
}
.feedback_icon_active {
  color: #46a1ff;
  font-size: 22px;
  margin-right: 8px;
}
.left_aside {
  background: #fff;
  height: 100%;
  z-index: 99;
}
.header_logo {
  font-weight: bold;
  font-size: 22px;
  height: 60px;
  line-height: 60px;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  justify-content: center;
}
.header_logo img {
  height: 45px;
  margin-right: 15px;
}
.el-menu-vertical-demo {
  overflow-y: auto;
  height: calc(100% - 60px);
  box-shadow: 2px 5px 6px 0px rgba(218, 218, 218, 1);
}
.el-menu-item img,
.el-submenu__title img {
  margin-right: 8px;
  width: 20px;
  vertical-align: text-top;
}
</style>
