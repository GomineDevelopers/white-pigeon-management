<template>
  <el-row class="login">
    <el-row class="login_content">
      <div class="main_input">
        <div class="login_title">小白鸽后台管理</div>
        <div><el-input placeholder="用户名" v-model="userName" clearable> </el-input></div>
        <div><el-input placeholder="密码" v-model="password" show-password></el-input></div>
        <el-button type="primary" class="submit_btn" round>登&nbsp;&nbsp;&nbsp;录</el-button>
      </div>
    </el-row>
  </el-row>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      userName: "",
      password: ""
    };
  },
  methods: {}
};
</script>
<style scoped>
.login {
  width: 100%;
  height: 100vh;
  background: url("../../assets/image/bgm.jpg") center center no-repeat;
  background-size: 100% 100%;
  display: -webkit-flex;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}
.login_content {
  width: 460px;
  background: #fff;
  padding: 40px 10px;
  border-radius: 6px;
}
.main_input {
  width: 80%;
  margin: 0 auto;
  line-height: 75px;
}
.submit_btn {
  width: 100%;
  font-size: 16px;
}
</style>
