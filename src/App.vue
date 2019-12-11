<template>
  <div id="app">
    <el-container>
      <el-aside width="240px">
        <AsideNav></AsideNav>
      </el-aside>
      <el-container>
        <el-header>
          <TopHeader></TopHeader>
        </el-header>
        <el-main>
          Main
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import TopHeader from "./components/TopHeader";
import AsideNav from "./components/AsideNav";
export default {
  name: "APP",
  components: {
    TopHeader,
    AsideNav
  },
  date() {
    return {};
  }
};
</script>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #333;
  height: 100%;
}
html,
body {
  margin: 0;
  height: 100%;
}
#app .el-container {
  height: 100%;
}
#app .el-header {
  background-color: #fff;
  line-height: 60px;
  box-shadow: 0px 5px 8px 0px rgba(218, 218, 218, 1);
  z-index: 10;
}
.el-aside {
  background: #fff !important;
  text-align: left;
  line-height: 200px;
  z-index: 99;
  overflow: initial;
}
.el-main {
  background-color: #fff;
  text-align: center;
  line-height: 160px;
  z-index: 9;
}
</style>
