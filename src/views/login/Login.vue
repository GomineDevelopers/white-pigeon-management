<template>
  <el-row class="login">
    <el-row class="login_content">
      <div class="main_input">
        <div class="login_title">朱鹊医访后台管理</div>
        <div>
          <el-input placeholder="用户名" v-model="userName" clearable> </el-input>
        </div>
        <div>
          <el-input
            placeholder="密码"
            v-model="password"
            show-password
            @keyup.enter.native="login"
          ></el-input>
        </div>
        <el-button type="primary" class="submit_btn" round @click="login"
          >登&nbsp;&nbsp;&nbsp;录</el-button
        >
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
  methods: {
    login() {
      if (!this.userName || !this.password) {
        this.$message({
          message: "请填写用户名和密码！",
          type: "warning"
        });
        return false;
      }
      let params = {
        email: this.userName,
        password: this.password
      };
      this.$api
        .login(params)
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            let expires_in = parseInt(res.expires_in);
            let expiresDate = new Date().getTime() + expires_in * 1000; // 当前时间加上900秒
            // console.log("时间戳", expiresDate);
            this.$store.commit("setToken", res.access_token); //设置store中adminToken
            localStorage.setItem("adminToken", res.access_token); //本地存放access_token
            localStorage.setItem("validTime", expiresDate); //本地存放access_token有效时间validTime
            localStorage.setItem("access", res.access); //本地存放access(是否是管理员 true/false)
            this.$message({
              message: "登录成功",
              type: "success"
            });
            setTimeout(() => {
              if (this.$route.query.redirect) {
                console.log("重定向地址", this.$route.query.redirect);
                this.$router.replace({
                  path: decodeURIComponent(this.$route.query.redirect)
                });
              } else {
                this.$router.replace({ path: "/" });
              }
            }, 1000);
          } else if (res.code == 401) {
            this.$message.error("用户名或密码错误！");
          } else if (res.code == 500) {
            this.$message.error("创建不了凭证，请重试！");
          } else {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
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
