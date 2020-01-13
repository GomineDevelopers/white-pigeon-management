import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: ""
  },
  mutations: {
    //设置token
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("adminToken", token);
    },
    // 用户刷新 token 成功，使用新的 token 替换掉本地的token
    refreshToken(state, token) {
      state.token = token;
      localStorage.setItem("adminToken", token);
    },
    //退出登录
    logout(state) {
      state.token = "";
      localStorage.removeItem("adminToken");
      localStorage.removeItem("validTime");
      localStorage.removeItem("access");
    }
  },
  actions: {
    // 将刷新的 token 保存至本地
    refreshToken({ commit }, token) {
      return new Promise(function(resolve, reject) {
        commit("refreshToken", token);
      });
    },
    logout({ commit }) {
      return new Promise(function(resolve, reject) {
        commit("logout");
      });
    }
  },
  getters: {}
});
