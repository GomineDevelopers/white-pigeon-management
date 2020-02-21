import { get, post, downFile, del, put, postUpload } from "./http";
let api = {
  login: params => post("/login", params, 1), //登录
  logout: params => post("/logout", params, 1), //退出登录
  refresh: params => post("/refresh", params, 1), //刷新token
  getQiniuToken: params => post("/getQiniu/getToken", params, 1), //获取七牛云Token

  downVisitExcel: params => downFile("/visitManager/visitList", params, 1), //拜访数据下载
  downHospitalManagerExcel: params =>
    downFile("/hospitalManager/hospitalManagerList", params, 1), //医院管理数据下载
  addRegion: params => post("/RegionManager/addRegion", params, 1), //添加区域经理
  regionManagerDetail: params =>
    post("/RegionManager/regionManagerDetail", params, 1), //区域经理详情
  delRegion: params => post("/RegionManager/delRegion", params, 1), //注销区域经理
  regionList: params => post("/RegionManager/regionList", params, 1), //区域经理列表
  regionManagerList: params =>
    get("/RegionManager/regionManagerList", params, 1), //区域管理列表(区域分配)
  downRegionManagerListExcel: params =>
    downFile("/RegionManager/regionManagerList", params, 1), //区域管理列表下载
  getInfoByProvince: params =>
    post("/RegionManager/getInfoByProvince", params, 1), //省市获取信息
  regionManagerSubmit: params =>
    post("/RegionManager/regionManagerSubmit", params, 1), //绑定医院产品
  visitList: params => get("/visitManager/visitList", params, 1), //拜访审核列表
  visitOperate: params => post("/visitManager/visitOperate", params, 1), //拜访审核
  visitmultipleOperate: params =>
    post("/visitManager/visitmultipleOperate", params, 1), //批量拜访审核
  visitDel: params => post("/visitManager/visitDel", params, 1), //拜访删除
  productList: params => post("/productManager/productList", params, 1), //产品
  meetingList: params => post("/meetingManager/meetingList", params, 1), //会议列表
  meetingoOperate: params => post("/meetingManager/meetingoOperate", params, 1), //会议审核
  meetingDetail: params => post("/meetingManager/meetingDetail", params, 1), //会议详情
  meetingDel: params => post("/meetingManager/meetingDel", params, 1), //会议删除
  visitTopicList: params => post("/visitManager/visitTopicList", params, 1), //拜访目的列表
  createVisit: params => post("/visitManager/visitTopicCreate", params, 1), //创建拜访目的
  updateVisit: params => post("/visitManager/visitTopicUpdate", params, 1), //修改拜访目的
  delVisit: params => post("/visitManager/visitTopicDel", params, 1), //删除拜访目的
  meetingTopicList: params =>
    post("/meetingManager/meetingTopicList", params, 1), //会议主题列表
  createMeeting: params =>
    post("/meetingManager/meetingTopicCreate", params, 1), //创建会议主题
  updateMeeting: params =>
    post("/meetingManager/meetingTopicUpdate", params, 1), //修改会议主题
  delMeeting: params => post("/meetingManager/meetingTopicDel", params, 1), //删除会议主题
  materialList: params => post("/materialManager/materialList", params, 1), //资料中心列表
  materialCreate: params => post("/materialManager/materialCreate", params, 1), //资料中心新增资料
  delMaterial: params => post("/materialManager/materialDel", params, 1), //资料中心删除资料
  doctorList: params => get("/doctorManager/doctorList", params, 1), //医生管理列表
  downDoctorListExcel: params =>
    downFile("/doctorManager/doctorList", params, 1), //医生管理数据下载
  doctorCreate: params => post("/doctorManager/doctorCreate", params, 1), //医生管理创建
  doctorEdit: params => post("/doctorManager/doctorEdit", params, 1), //医生管理修改
  delDoctor: params => post("/doctorManager/doctorlDel", params, 1), //医生管理删除
  hospitalList: params => post("/hospitalManager/hospitalList", params, 1), //医生管理医院列表
  sectionList: params => post("/sectionManager/sectionList", params, 1), //医生管理科室列表
  sectionManagerList: params =>
    post("/sectionManager/sectionManagerList", params, 1), //科室管理列表
  sectionCreate: params => post("/sectionManager/sectionCreate", params, 1), //科室管理新增
  sectionEdit: params => post("/sectionManager/sectionEdit", params, 1), //科室管理编辑
  delSection: params => post("/sectionManager/sectionDel", params, 1), //科室管理删除
  productSectionList: params =>
    post("/productSectionManager/productSectionList", params, 1), //产品科室管理列表
  createProdutSection: params =>
    post("/productSectionManager/productSection", params, 1), //产品科室管理创建
  productSectionEdit: params =>
    post("/productSectionManager/productSectionEdit", params, 1), //产品科室管理修改
  delProductSection: params =>
    post("/productSectionManager/productSectionDel", params, 1), //产品科室管理删除
  userManagerList: params => get("/userManager/userManagerList", params, 1), //代表管理
  downUserManagerListExcel: params =>
    downFile("/userManager/userManagerList", params, 1), //代表管理数据下载
  productManagerList: params =>
    post("/productManager/productManagerList", params, 1), //产品管理列表
  productAdd: params => post("/productManager/productAdd", params, 1), //产品管理新增
  productEdit: params => post("/productManager/productEdit", params, 1), //产品管理修改
  hospitalManagerList: params =>
    get("/hospitalManager/hospitalManagerList", params, 1), //医院管理列表
  hospitalAdd: params => post("/hospitalManager/hospitalAdd", params, 1), //添加医院
  hospitalDel: params => post("/hospitalManager/hospitalDel", params, 1), //删除医院
  hospitalEdit: params => post("/hospitalManager/hospitalEdit", params, 1), //编辑医院
  hospitalProductList: params =>
    get("/hospitalProductManager/hospitalProductList", params, 1), //产品申请
  downHospitalProductListExcel: params =>
    downFile("/hospitalProductManager/hospitalProductList", params, 1), //产品申请下载
  contractManagerList: params =>
    get("/contractManager/contractManagerList", params, 1), //产申请合同列表
  downContractPdf: params =>
    downFile("/contractManager/downContractPdf", params, 1), //产申请合同PDF下载
  userInfoList: params => get("/users", params, 1), //权限管理用户列表
  userRulesList: params => get("/rules", params, 1), //权限管理用户授权列表
  userCreate: params => post("/users/store", params, 1), //权限管理添加用户
  userUpdate: params => put("/users/update", params, 1), //权限管理修改用户
  userDel: params => del("/users", params, 1), //权限管理删除用户
  userAuthUpdate: params => post("/auth/update", params, 1), //权限管理添加、修改用户授权
  flowsdeal: params => postUpload("/flows/flowsdeal", params, 1), //流向上传
  menuList: params => get("/flows/menulist", params, 1), //流向目录
  flowsList: params => get("/flows/flowslist", params, 1), //流向匹配结果
  flowupdate: params => get("/flows/flowupdate", params, 1), //流向核销
  downFlowslistExcel: params => downFile("/bonus/flowslist", params, 1), //导出核销
  visitList2: params => get("/flows/visitlist", params, 1), //匹配的拜访详情（医院，产品）
  meetinglist: params => get("/flows/meetinglist", params, 1), //匹配的会议详情（医院，产品）
  userBonusList: params => get("/bonus/detailedlist", params, 1), //代表奖金列表
  bonusDetail: params => get("/bonus/detailed", params, 1), //代表奖金明细列表
  downBonusDetailExcel: params => downFile("/bonus/detailed", params, 1), //代表奖金明细列表

  //小鱼儿接口
  getKey: params => get("/open-api/genKey", params, 2) //代表奖金明细列表
};
export default api;
