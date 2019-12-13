import { get, post } from "./http";
let api = {
  login: params => post("/admin/login", params), //登录
  logout: params => post("/admin/logout", params), //退出登录
  logout: params => post("/admin/logout", params), //退出登录
  addRegion: params => post("/admin/RegionManager/addRegion", params), //添加区域经理
  regionManagerDetail: params => post("/admin/RegionManager/regionManagerDetail", params), //区域经理详情
  delRegion: params => post("/admin/RegionManager/delRegion", params), //注销区域经理
  regionList: params => post("/admin/RegionManager/regionList", params) //区域经理列表
};
export default api;
