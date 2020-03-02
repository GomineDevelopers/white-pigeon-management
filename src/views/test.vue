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
          console.log(res);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
