<template>
  <el-row class="home">
    <el-container>
      <el-aside width="220px">
        <AsideNav></AsideNav>
      </el-aside>
      <el-container>
        <el-header>
          <TopHeader></TopHeader>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </el-row>
</template>
<script>
import TopHeader from "../components/TopHeader";
import AsideNav from "../components/AsideNav";
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
<style scoped>
.home {
  height: 100%;
}
.el-container {
  height: 100%;
}
.el-header {
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
  overflow: initial !important;
}
.el-main {
  background-color: #fff;
  /* z-index: 9; */
  padding: 20px;
}
</style>
