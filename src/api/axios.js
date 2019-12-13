import { get, post } from "./http";
let api = {
  userInfo: params => post("/membercreate/user", params), //用户信息
  login: params => post("/login", params) //登录
};
export default api;
