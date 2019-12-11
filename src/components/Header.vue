<template>
  <el-row class="top_header">
    <el-row class="header_logo">LOGO</el-row>
    <el-row class="header_right">
      <span>
        <img src="https://img.yzcdn.cn/vant/cat.jpeg" />
        <i class="el-icon-arrow-down"></i>
      </span>
      <span> <i class="el-icon-setting"></i>退出 </span>
    </el-row>
  </el-row>
</template>
<script>
export default {
  name: "header",
  date() {
    return {};
  }
};
</script>
<style scoped>
.top_header {
  background-color: #fff;
  line-height: 60px;
  display: -webkit-flex;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.top_header .header_logo {
  font-weight: bold;
  font-size: 26px;
  flex: 1;
}
.header_right {
  height: 60px;
  display: -webkit-flex;
  display: flex;
}
.header_right span {
  height: 60px;
  display: -webkit-flex;
  display: flex;
  align-items: center;
}
.header_right span:nth-child(1) {
  margin-right: 20px;
}
.header_right img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>
