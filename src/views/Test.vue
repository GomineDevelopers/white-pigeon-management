<template>
  <el-row>
    <button @click="getKey">小鱼儿测试</button>
    <el-row>{{data}}</el-row>
  </el-row>
</template>
<script>
export default {
  name: "test",
  data() {
    return {
      data: null
    };
  },
  methods: {
    getKey() {
      // 小鱼儿账号:15921638245
      // 客户号:021803069
      // secret:87AC305F8EFB6AB2FA8BF194DA02D8A1
      // 有效请求IP:39.98.248.69
      let params = {
        xyeAct: "15921638245",
        openNo: "021803069",
        secret: "87AC305F8EFB6AB2FA8BF194DA02D8A1"
      };
      this.$api
        .getKey(params)
        .then(res => {
          console.log(res);
          if (res.code == "00000") {
            this.data = res;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
