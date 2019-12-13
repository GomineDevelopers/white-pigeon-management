import { get, post } from "./http";
let api = {
  userInfo: params => post("/membercreate/user", params), //用户信息
};
export default api;
