<template>
  <button @click="test">test</button>
</template>
<script>
export default {
  name: "Register",
  data() {
    return {};
  },
  methods: {
    test() {
      //获取小鱼儿口令
      let params = {
        xyeAct: "15921638245",
        openNo: "021803069",
        secret: "87AC305F8EFB6AB2FA8BF194DA02D8A1"
      };
      this.$api
        .getKey(params)
        .then(res => {
          console.log(JSON.parse(res));
          let data = JSON.parse(res);
          console.log(data.code);
          console.log(data.msg);
          console.log(data.token);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
