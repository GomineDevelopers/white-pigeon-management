import { get, post } from "./http";
let api = {
  login: params => post("/login", params), //登录
  logout: params => post("/logout", params), //退出登录
  refresh: params => post("/refresh", params), //刷新token
  getQiniuToken: params => post("/getQiniu/getToken", params), //获取七牛云Token
  addRegion: params => post("/RegionManager/addRegion", params), //添加区域经理
  regionManagerDetail: params =>
    post("/RegionManager/regionManagerDetail", params), //区域经理详情
  delRegion: params => post("/RegionManager/delRegion", params), //注销区域经理
  regionList: params => post("/RegionManager/regionList", params), //区域经理列表
  regionManagerList: params => post("/RegionManager/regionManagerList", params), //区域管理列表
  getInfoByProvince: params => post("/RegionManager/getInfoByProvince", params), //省市获取信息
  regionManagerSubmit: params =>
    post("/RegionManager/regionManagerSubmit", params), //绑定医院产品
  visitList: params => post("/visitManager/visitList", params), //拜访审核列表
  visitOperate: params => post("/visitManager/visitOperate", params), //拜访审核
  visitDel: params => post("/visitManager/visitDel", params), //拜访删除
  productList: params => post("/productManager/productList", params), //产品
  meetingList: params => post("/meetingManager/meetingList", params), //会议列表
  meetingoOperate: params => post("/meetingManager/meetingoOperate", params), //会议审核
  meetingDetail: params => post("/meetingManager/meetingDetail", params), //会议详情
  meetingDel: params => post("/meetingManager/meetingDel", params), //会议删除
  visitTopicList: params => post("/visitManager/visitTopicList", params), //拜访目的列表
  createVisit: params => post("/visitManager/visitTopicCreate", params), //创建拜访目的
  updateVisit: params => post("/visitManager/visitTopicUpdate", params), //修改拜访目的
  delVisit: params => post("/visitManager/visitTopicDel", params), //删除拜访目的
  meetingTopicList: params => post("/meetingManager/meetingTopicList", params), //会议主题列表
  createMeeting: params => post("/meetingManager/meetingTopicCreate", params), //创建会议主题
  updateMeeting: params => post("/meetingManager/meetingTopicUpdate", params), //修改会议主题
  delMeeting: params => post("/meetingManager/meetingTopicDel", params), //删除会议主题
  materialList: params => post("/materialManager/materialList", params), //资料中心列表
  materialCreate: params => post("/materialManager/materialCreate", params), //资料中心新增资料
  delMaterial: params => post("/materialManager/materialDel", params), //资料中心删除资料
  doctorList: params => post("/doctorManager/doctorList", params), //医生管理列表
  doctorCreate: params => post("/doctorManager/doctorCreate", params), //医生管理创建
  doctorEdit: params => post("/doctorManager/doctorEdit", params), //医生管理修改
  delDoctor: params => post("/doctorManager/doctorlDel", params), //医生管理删除
  hospitalList: params => post("/hospitalManager/hospitalList", params), //医生管理医院列表
  sectionList: params => post("/sectionManager/sectionList", params), //医生管理科室列表
  sectionManagerList: params =>
    post("/sectionManager/sectionManagerList", params), //科室管理列表
  sectionCreate: params => post("/sectionManager/sectionCreate", params), //科室管理新增
  sectionEdit: params => post("/sectionManager/sectionEdit", params), //科室管理编辑
  delSection: params => post("/sectionManager/sectionDel", params) //科室管理删除
};
export default api;
