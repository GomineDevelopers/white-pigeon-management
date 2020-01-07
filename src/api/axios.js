import { get, post, downFile } from "./http";
let api = {
  login: params => post("/login", params), //登录
  logout: params => post("/logout", params), //退出登录
  refresh: params => post("/refresh", params), //刷新token
  getQiniuToken: params => post("/getQiniu/getToken", params), //获取七牛云Token

  downVisitExcel: params => downFile("/visitManager/visitList", params), //拜访数据下载
  downHospitalManagerExcel: params =>
    downFile("/hospitalManager/hospitalManagerList", params), //医院管理数据下载
  addRegion: params => post("/RegionManager/addRegion", params), //添加区域经理
  regionManagerDetail: params =>
    post("/RegionManager/regionManagerDetail", params), //区域经理详情
  delRegion: params => post("/RegionManager/delRegion", params), //注销区域经理
  regionList: params => post("/RegionManager/regionList", params), //区域经理列表
  regionManagerList: params => get("/RegionManager/regionManagerList", params), //区域管理列表(区域分配)
  downRegionManagerListExcel: params =>
    downFile("/RegionManager/regionManagerList", params), //区域管理列表下载
  getInfoByProvince: params => post("/RegionManager/getInfoByProvince", params), //省市获取信息
  regionManagerSubmit: params =>
    post("/RegionManager/regionManagerSubmit", params), //绑定医院产品
  visitList: params => get("/visitManager/visitList", params), //拜访审核列表
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
  doctorList: params => get("/doctorManager/doctorList", params), //医生管理列表
  downDoctorListExcel: params => downFile("/doctorManager/doctorList", params), //医生管理数据下载
  doctorCreate: params => post("/doctorManager/doctorCreate", params), //医生管理创建
  doctorEdit: params => post("/doctorManager/doctorEdit", params), //医生管理修改
  delDoctor: params => post("/doctorManager/doctorlDel", params), //医生管理删除
  hospitalList: params => post("/hospitalManager/hospitalList", params), //医生管理医院列表
  sectionList: params => post("/sectionManager/sectionList", params), //医生管理科室列表
  sectionManagerList: params =>
    post("/sectionManager/sectionManagerList", params), //科室管理列表
  sectionCreate: params => post("/sectionManager/sectionCreate", params), //科室管理新增
  sectionEdit: params => post("/sectionManager/sectionEdit", params), //科室管理编辑
  delSection: params => post("/sectionManager/sectionDel", params), //科室管理删除
  productSectionList: params =>
    post("/productSectionManager/productSectionList", params), //产品科室管理列表
  createProdutSection: params =>
    post("/productSectionManager/productSection", params), //产品科室管理创建
  productSectionEdit: params =>
    post("/productSectionManager/productSectionEdit", params), //产品科室管理修改
  delProductSection: params =>
    post("/productSectionManager/productSectionDel", params), //产品科室管理删除
  userManagerList: params => get("/userManager/userManagerList", params), //代表管理
  downUserManagerListExcel: params =>
    downFile("/userManager/userManagerList", params), //代表管理数据下载
  productManagerList: params =>
    post("/productManager/productManagerList", params), //产品管理列表
  productAdd: params => post("/productManager/productAdd", params), //产品管理新增
  productEdit: params => post("/productManager/productEdit", params), //产品管理修改
  hospitalManagerList: params =>
    get("/hospitalManager/hospitalManagerList", params), //医院管理列表
  hospitalAdd: params => post("/hospitalManager/hospitalAdd", params), //添加医院
  hospitalDel: params => post("/hospitalManager/hospitalDel", params), //删除医院
  hospitalEdit: params => post("/hospitalManager/hospitalEdit", params), //编辑医院
  hospitalProductList: params =>
    get("/hospitalProductManager/hospitalProductList", params), //产品申请
  downHospitalProductListExcel: params =>
    downFile("/hospitalProductManager/hospitalProductList", params), //产品申请下载
  contractManagerList: params =>
    get("/contractManager/contractManagerList", params), //产申请合同列表
  downContractPdf: params =>
    downFile("/contractManager/downContractPdf", params), //产申请合同PDF下载

  // 权限测试
  property: params => post("/admin/login", params),
  userInfo: params => get("/admin/userinfo", params)
};
export default api;
