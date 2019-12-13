<template>
  <el-row class="PurposeTopical">
    <span class="breadcrumb">拜访会议</span>
    <el-row class="main_list">
      <el-row class="visit_title">
        <span :class="titleActive ? 'active' : ''" @click="titleActive = true">拜访目的</span>
        <span :class="titleActive ? '' : 'active'" @click="titleActive = false">会议主题</span>
      </el-row>
      <el-row class="visit_body">
        <el-row><span>新增</span><span>删除</span></el-row>
        <el-row class="visit_content"> </el-row>
      </el-row>
    </el-row>
  </el-row>
</template>
<script>
export default {
  name: "PurposeTopical",
  data() {
    return {
      titleActive: true
    };
  }
};
</script>
<style scoped>
.breadcrumb {
  display: block;
  margin-bottom: 15px;
}
.main_list .visit_title {
  width: 272px;
  height: 42px;
  line-height: 42px;
  border-radius: 6px;
  border: 1px solid rgba(51, 153, 255, 0.1);
  color: #333;
  margin: 20px auto;
}
.main_list .visit_title span {
  display: inline-block;
  width: 50%;
  text-align: center;
  cursor: pointer;
}
.main_list .visit_title span.active {
  color: #3399ff;
  background: rgba(51, 153, 255, 0.1);
}
</style>
