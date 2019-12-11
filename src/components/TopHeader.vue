<template>
  <el-row class="top_header">
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
  name: "topHeader",
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
  justify-content: flex-end;
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
