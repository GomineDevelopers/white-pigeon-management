<template>
  <el-row class="left_aside">
    <el-row class="header_logo">LOGO</el-row>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>导航一</span>
        </template>
        <el-menu-item-group>
          <template slot="title">分组一</template>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="1-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <template slot="title">选项4</template>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">导航二</span>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <i class="el-icon-document"></i>
        <span slot="title">导航三</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">导航四</span>
      </el-menu-item>
    </el-menu>
  </el-row>
</template>
<script>
export default {
  name: "header",
  date() {
    return {};
  },
  methods: {
    handleOpen() {
      //   console.log(key, keyPath);
    },
    handleClose() {
      //   console.log(key, keyPath);
    }
  }
};
</script>
<style scoped>
.left_aside {
  background: #fff;
  height: 100%;
  z-index: 99;
}
.header_logo {
  font-weight: bold;
  font-size: 30px;
  text-align: center;
  height: 60px;
  line-height: 60px;
}
.el-menu-vertical-demo {
  height: calc(100% - 60px);
  box-shadow: 2px 0px 6px 0px rgba(0, 21, 41, 0.35);
}
</style>
