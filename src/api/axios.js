import { get, post } from "./http";
let api = {
  login: params => post("/login", params), //登录
  logout: params => post("/logout", params), //退出登录
  addRegion: params => post("/RegionManager/addRegion", params), //添加区域经理
  regionManagerDetail: params => post("/RegionManager/regionManagerDetail", params), //区域经理详情
  delRegion: params => post("/RegionManager/delRegion", params), //注销区域经理
  regionList: params => post("/RegionManager/regionList", params) //区域经理列表
};
export default api;
