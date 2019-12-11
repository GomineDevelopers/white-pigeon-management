<template>
  <div id="app">
    <el-container>
      <el-header>
        <Header></Header>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <Aside></Aside>
        </el-aside>
        <el-main>
          Main
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Header from "./components/Header";
import Aside from "./components/Aside";
export default {
  name: "header",
  components: {
    Header,
    Aside
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
  /* border-bottom: 1px solid #ccc; */
  box-shadow: 0px 5px 21px 0px rgba(218, 218, 218, 1);
}
.el-aside {
  border-top: 1px solid #f0f0f0;
  background-color: #fff;
  text-align: left;
  line-height: 200px;
}
.el-main {
  background-color: #e9eef3;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
