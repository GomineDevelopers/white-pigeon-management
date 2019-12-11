<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: "APP",
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
</style>
