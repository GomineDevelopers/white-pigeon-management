import { get, post, downFile, del, put, postUpload } from "./http";
let baseURL1 = "http://back.zidata.cn/admin";
let baseURL2 = "https://www.xiaoyuer.net";
let api = {
  login: params => post(baseURL1 + "/login", params, 1), //登录
  logout: params => post(baseURL1 + "/logout", params, 1), //退出登录
  refresh: params => post(baseURL1 + "/refresh", params, 1), //刷新token
  getQiniuToken: params => post(baseURL1 + "/getQiniu/getToken", params, 1), //获取七牛云Token

  downVisitExcel: params => downFile(baseURL1 + "/visitManager/visitList", params, 1), //拜访数据下载
  downHospitalManagerExcel: params =>
    downFile(baseURL1 + "/hospitalManager/hospitalManagerList", params, 1), //医院管理数据下载
  addRegion: params => post(baseURL1 + "/RegionManager/addRegion", params, 1), //添加区域经理
  regionManagerDetail: params => post(baseURL1 + "/RegionManager/regionManagerDetail", params, 1), //区域经理详情
  delRegion: params => post(baseURL1 + "/RegionManager/delRegion", params, 1), //注销区域经理
  regionList: params => post(baseURL1 + "/RegionManager/regionList", params, 1), //区域经理列表
  regionManagerList: params => get(baseURL1 + "/RegionManager/regionManagerList", params, 1), //区域管理列表(区域分配)
  downRegionManagerListExcel: params =>
    downFile(baseURL1 + "/RegionManager/regionManagerList", params, 1), //区域管理列表下载
  getInfoByProvince: params => post(baseURL1 + "/RegionManager/getInfoByProvince", params, 1), //省市获取信息
  regionManagerSubmit: params => post(baseURL1 + "/RegionManager/regionManagerSubmit", params, 1), //绑定医院产品
  visitList: params => get(baseURL1 + "/visitManager/visitList", params, 1), //拜访审核列表
  visitOperate: params => post(baseURL1 + "/visitManager/visitOperate", params, 1), //拜访审核
  visitmultipleOperate: params => post(baseURL1 + "/visitManager/visitmultipleOperate", params, 1), //批量拜访审核
  visitDel: params => post(baseURL1 + "/visitManager/visitDel", params, 1), //拜访删除
  productList: params => post(baseURL1 + "/productManager/productList", params, 1), //产品
  meetingList: params => post(baseURL1 + "/meetingManager/meetingList", params, 1), //会议列表
  meetingoOperate: params => post(baseURL1 + "/meetingManager/meetingoOperate", params, 1), //会议审核
  meetingDetail: params => post(baseURL1 + "/meetingManager/meetingDetail", params, 1), //会议详情
  meetingDel: params => post(baseURL1 + "/meetingManager/meetingDel", params, 1), //会议删除
  visitTopicList: params => post(baseURL1 + "/visitManager/visitTopicList", params, 1), //拜访目的列表
  createVisit: params => post(baseURL1 + "/visitManager/visitTopicCreate", params, 1), //创建拜访目的
  updateVisit: params => post(baseURL1 + "/visitManager/visitTopicUpdate", params, 1), //修改拜访目的
  delVisit: params => post(baseURL1 + "/visitManager/visitTopicDel", params, 1), //删除拜访目的
  meetingTopicList: params => post(baseURL1 + "/meetingManager/meetingTopicList", params, 1), //会议主题列表
  createMeeting: params => post(baseURL1 + "/meetingManager/meetingTopicCreate", params, 1), //创建会议主题
  updateMeeting: params => post(baseURL1 + "/meetingManager/meetingTopicUpdate", params, 1), //修改会议主题
  delMeeting: params => post(baseURL1 + "/meetingManager/meetingTopicDel", params, 1), //删除会议主题
  materialList: params => post(baseURL1 + "/materialManager/materialList", params, 1), //资料中心列表
  materialCreate: params => post(baseURL1 + "/materialManager/materialCreate", params, 1), //资料中心新增资料
  delMaterial: params => post(baseURL1 + "/materialManager/materialDel", params, 1), //资料中心删除资料
  doctorList: params => get(baseURL1 + "/doctorManager/doctorList", params, 1), //医生管理列表
  downDoctorListExcel: params => downFile(baseURL1 + "/doctorManager/doctorList", params, 1), //医生管理数据下载
  doctorCreate: params => post(baseURL1 + "/doctorManager/doctorCreate", params, 1), //医生管理创建
  doctorEdit: params => post(baseURL1 + "/doctorManager/doctorEdit", params, 1), //医生管理修改
  delDoctor: params => post(baseURL1 + "/doctorManager/doctorlDel", params, 1), //医生管理删除
  hospitalList: params => post(baseURL1 + "/hospitalManager/hospitalList", params, 1), //医生管理医院列表
  sectionList: params => post(baseURL1 + "/sectionManager/sectionList", params, 1), //医生管理科室列表
  sectionManagerList: params => post(baseURL1 + "/sectionManager/sectionManagerList", params, 1), //科室管理列表
  sectionCreate: params => post(baseURL1 + "/sectionManager/sectionCreate", params, 1), //科室管理新增
  sectionEdit: params => post(baseURL1 + "/sectionManager/sectionEdit", params, 1), //科室管理编辑
  delSection: params => post(baseURL1 + "/sectionManager/sectionDel", params, 1), //科室管理删除
  productSectionList: params =>
    post(baseURL1 + "/productSectionManager/productSectionList", params, 1), //产品科室管理列表
  createProdutSection: params =>
    post(baseURL1 + "/productSectionManager/productSection", params, 1), //产品科室管理创建
  productSectionEdit: params =>
    post(baseURL1 + "/productSectionManager/productSectionEdit", params, 1), //产品科室管理修改
  delProductSection: params =>
    post(baseURL1 + "/productSectionManager/productSectionDel", params, 1), //产品科室管理删除
  userManagerList: params => get(baseURL1 + "/userManager/userManagerList", params, 1), //代表管理
  downUserManagerListExcel: params =>
    downFile(baseURL1 + "/userManager/userManagerList", params, 1), //代表管理数据下载
  productManagerList: params => post(baseURL1 + "/productManager/productManagerList", params, 1), //产品管理列表
  productAdd: params => post(baseURL1 + "/productManager/productAdd", params, 1), //产品管理新增
  productEdit: params => post(baseURL1 + "/productManager/productEdit", params, 1), //产品管理修改
  hospitalManagerList: params => get(baseURL1 + "/hospitalManager/hospitalManagerList", params, 1), //医院管理列表
  hospitalAdd: params => post(baseURL1 + "/hospitalManager/hospitalAdd", params, 1), //添加医院
  hospitalDel: params => post(baseURL1 + "/hospitalManager/hospitalDel", params, 1), //删除医院
  hospitalEdit: params => post(baseURL1 + "/hospitalManager/hospitalEdit", params, 1), //编辑医院
  hospitalProductList: params =>
    get(baseURL1 + "/hospitalProductManager/hospitalProductList", params, 1), //产品申请
  downHospitalProductListExcel: params =>
    downFile(baseURL1 + "/hospitalProductManager/hospitalProductList", params, 1), //产品申请下载
  contractManagerList: params => get(baseURL1 + "/contractManager/contractManagerList", params, 1), //产申请合同列表
  downContractPdf: params => downFile(baseURL1 + "/contractManager/downContractPdf", params, 1), //产申请合同PDF下载
  userInfoList: params => get(baseURL1 + "/users", params, 1), //权限管理用户列表
  userRulesList: params => get(baseURL1 + "/rules", params, 1), //权限管理用户授权列表
  userCreate: params => post(baseURL1 + "/users/store", params, 1), //权限管理添加用户
  userUpdate: params => put(baseURL1 + "/users/update", params, 1), //权限管理修改用户
  userDel: params => del(baseURL1 + "/users", params, 1), //权限管理删除用户
  userAuthUpdate: params => post(baseURL1 + "/auth/update", params, 1), //权限管理添加、修改用户授权
  flowsdeal: params => postUpload(baseURL1 + "/flows/flowsdeal", params, 1), //流向上传
  menuList: params => get(baseURL1 + "/flows/menulist", params, 1), //流向目录
  flowsList: params => get(baseURL1 + "/flows/flowslist", params, 1), //流向匹配结果
  flowupdate: params => get(baseURL1 + "/flows/flowupdate", params, 1), //流向核销
  downFlowslistExcel: params => downFile(baseURL1 + "/bonus/flowslist", params, 1), //导出核销
  visitList2: params => get(baseURL1 + "/flows/visitlist", params, 1), //匹配的拜访详情（医院，产品）
  meetinglist: params => get(baseURL1 + "/flows/meetinglist", params, 1), //匹配的会议详情（医院，产品）
  userBonusList: params => get(baseURL1 + "/bonus/detailedlist", params, 1), //代表奖金列表
  bonusDetail: params => get(baseURL1 + "/bonus/detailed", params, 1), //代表奖金明细列表
  downBonusDetailExcel: params => downFile(baseURL1 + "/bonus/detailed", params, 1), //代表奖金明细列表下载
  getSignUser: params => post(baseURL1 + "/cooperate/getSignUser", params, 1), //注册小鱼儿用到医药代表的信息

  //小鱼儿接口
  getKey: params => get(baseURL2 + "/open-api/genKey", params, 2), //获取口令
  register: params => post(baseURL2 + "/open-api/register", params, 2) //注册服务者
};
export default api;
