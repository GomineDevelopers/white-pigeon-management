<template>
  <div>
    <!-- 面包屑 -->
    <span class="breadcrumb">区域管理</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item">
          <span>姓名：</span>
          <el-input size="small" v-model="managerName" placeholder="请输入区域经理姓名"></el-input>
        </div>
        <div class="main_header_item">
          <span>省/市：</span>
          <el-cascader
            size="small"
            :options="provinceAndCityDataPlus"
            v-model="searchOption"
            @change="handleChange"
          >
          </el-cascader>
        </div>
      </el-col>
      <el-col :span="4" class="main_header_btns">
        <el-button size="small" type="primary" @click="search">搜索</el-button>
        <el-button size="small" type="primary" @click="resetSearch" plain>重置</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <div class="main_list">
      <div class="toolbar">
        <el-button size="small" plain icon="el-icon-plus" @click="addVisble = true">新增区域</el-button>
        <el-button size="small" plain icon="el-icon-bottom" @click="downLoad">下载</el-button>
      </div>
      <el-table 
        :data="list" 
        v-loading="listLoading" 
        element-loading-text="数据拼命加载中"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%">
        <el-table-column prop="province_name" label="省" width="160"></el-table-column>
        <el-table-column prop="city_name" label="市/区" width="160"></el-table-column>
        <el-table-column prop="hospital_name" label="医院名称" min-width="260"></el-table-column>
        <el-table-column prop="id" label="医院编号" min-width="120"></el-table-column>
        <el-table-column prop="product_name" label="产品名" min-width="140" ></el-table-column>
        <el-table-column prop="user_name" label="区域经理" min-width="100" ></el-table-column>
        <!-- <el-table-column prop="status" label="状态" width="80">
          <template scope="scope">
            <span v-if="scope.row.status == 1">正常</span>
            <span v-else class="logout">注销</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="60" fixed="right">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <i class="el-icon-view" @click="handleDetail(scope.$index, scope.row)"></i>
            </el-tooltip>
            <!-- <el-tooltip v-if="scope.row.status == 1" class="item" effect="dark" content="删除" placement="top">
              <i class="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></i>
            </el-tooltip> -->
            
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next, sizes, jumper"
          @current-change="currentChange"
          @size-change="sizeChange"
          :page-sizes="[10, 20, 30, 40]"
          :current-page.sync="page"
          :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 详情弹窗 -->
    <el-dialog class="dialog_wrap" :visible.sync="detailVisble" :append-to-body="true" width="30%">
        <ul class="dialog_detail">
            <li><label>省：</label>{{singleData.province_name}}</li>
            <li><label>市：</label>{{singleData.city_name}}</li>
            <li><label>医院名称：</label>{{singleData.hospital_name}}</li>
            <li><label>医院编号：</label>{{singleData.id}}</li>
            <li><label>产品名：</label>{{singleData.product_name}}</li>
            <li><label>区域经理：</label>{{singleData.user_name}}</li>
            <li>
              <label>状态：</label>
              <span v-if="singleData.status == 1">正常</span>
              <span v-else class="logout">注销</span>
            </li>
        </ul>
        <div class="dialog_title" slot="title"><span class="line"></span>区域信息</div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="detailVisble = false">确 定</el-button>
        <el-button size="small" type="info" plain @click="detailVisble = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增 -->
    <el-dialog  class="dialog_wrap width_full" :visible.sync="addVisble" :append-to-body="true"
      >
      <div class="dialog_title" slot="title"><span class="line"></span>区域信息</div>
      <el-form :model="regionData" :rules="rules" ref="ruleForm" label-width="100px" v-loading="addLoading" element-loading-text="数据拼命加载中...">
        <el-form-item label="省/市：" prop="option">
          <el-cascader
            class="width_full"
            size="small"
            :options="provinceAndCityData"
            v-model="regionData.option"
            @change="handleManagerChange"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item size="small" label="医院名称：" prop="hospitalId">
          <el-select v-model="regionData.hospitalId" placeholder="请选择医院名称"  @change="chaggeHospital">
            <el-option v-for="(item, index) in hosptalList" :label="item.hospital_name" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="产品名：" prop="productId">
          <el-select v-model="regionData.productId" placeholder="请选择产品名">
            <el-option v-for="(item, index) in productList" :label="item.product_name" :value="item.product_id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="区域经理：" prop="managerId">
          <el-select v-model="regionData.managerId" placeholder="请选择区域经理">
            <el-option v-for="(item, index) in regionList" :label="item.name" :value="item.region_id" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary"  @click="addManager('ruleForm')">确 定</el-button>
        <el-button size="small" type="info" plain @click="addVisble = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { provinceAndCityDataPlus, provinceAndCityData } from "element-china-area-data";
export default {
  name: "RegionalManager",
  data() {
    return {
      listLoading: false, //加载数据中
      addLoading: false, // 新增加载数据中
      addVisble: false, //新增
      detailVisble: false, //详情弹窗
      singleData: {}, //单条数据
      managerName: null, // 搜索姓名
      provinceAndCityDataPlus: provinceAndCityDataPlus, //省市数据带“全部”
      provinceAndCityData: provinceAndCityData, //省市数据不带“全部”
      searchOption: [], //搜索省市
      isSearch: false, //是否是搜索请求
      regionData: {
        option: [],
        hospitalId: null,
        productId: null,
        managerId: null,
      }, //新增数据
      regionList: [], //区域经理列表
      hosptalList: [], //医院列表
      productList: [], //产品列表
      page: 1,
      row: 10,
      total: 0,
      list: [],
      rules: {
        option: [{ required: true, message: "请选择省市", trigger: 'change'}],
        hospitalId: [{ required: true, message: '请选择医院名称', trigger: 'change'}],
        productId: [{ required: true, message: '请选择产品名', trigger: 'change'}],
        managerId: [{ required: true, message: '请选择区域经理', trigger: 'change'}]
      }
    };
  },
  mounted() {
      this.getListData();
  },
  methods: {

    //地区省市操作
    handleChange(arr) {
      this.searchOption = arr;
    },

    // 新增/编辑经理省市选择
    handleManagerChange(arr) {
      this.regionData.option = arr;
      this.resetAddData();
      let params = {
        province_code: arr[0],
        city_code: arr[1],
      }
      this.getInfoByProvince(params);
    },

    // 获取列表数据
    getListData() {
      this.listLoading = true;
      let params = null;
      if (this.isSearch){
        params = {
          regional_manager_name: this.managerName,
          province_code: this.searchOption[0],
          city_code: this.searchOption[1],
          page: this.page,
          row: this.row
        }
      } else {
        params = {
          page: this.page,
          row: this.row
        };
      }
      this.$api.regionManagerList(params)
        .then( res => {
          if(res.code == 200){
            this.total = res.regional_info_count;
            this.list = res.regional_info_list
          } else {
             this.$message({
              message: res.message,
              type: "error"
            });
          }
          this.listLoading = false;
        })
        .catch( err => {
          this.listLoading = false;
          console.log(err)
        })
    },

    // 搜索
    search() {
      if (this.managerName == null && !this.searchOption.length) {
        this.$message({
          message: "请输入或选择搜索内容",
          type: "error"
        });
        return false;
      }
      this.isSearch = true;
      this.page = 1;
      this.getListData();
    },

    // 重置搜索内容
    resetSearch() {
      this.managerName = null;
      this.searchOption = [];
      this.isSearch = false;
      this.page = 1;
      this.getListData();
    },

    // 下载
    downLoad() {
      console.log('下载')
    },

    // 查看详情
    handleDetail(index, row) {
        this.detailVisble = true;
        this.singleData = row;
    },

    // 删除
    handleDelete(index, row) {
        this.$messageBox.confirm('确认删除该条记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                console.log(row.id)
                let para = { id: row.id };
            }).catch(() => {
                console.log('取消')
            });
    //   console.log(index, row);
    },

    // 点击分页当前页数
    currentChange(val) {
      this.page = val;
      this.getListData();
    },

    // 切换每页条数
    sizeChange(val) {
      this.row = val;
      this.getListData();
    },

    // 切换医院选择
    chaggeHospital(val) {
      this.productList = [];
      this.regionData.productId = null;
      this.hosptalList.forEach( item => {
        if(item.id == val) {
          this.productList = item.product_info;
        }
      })
    },  

    // 通过省市获取医院信息
    getInfoByProvince(params){
      this.addLoading = true;
      this.$api.getInfoByProvince(params)
        .then( res => {
          if (res.code == 200) {
            this.hosptalList = res.hospital_product;
            this.regionList = res.region_list;
          };
          this.addLoading = false;
        })
        .catch( err => {
          this.addLoading = false;
          console.log(err)
        })
    },

    // 新增区域
    addManager(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitManager();
        } else {
          return false;
        }
      });
    },

    // 提交数据
    submitManager(){
       this.$messageBox
        .confirm("提交数据后将无法更改，请确认无误后再提交！", "提示", {
          type: "warning"
        })
        .then(() => {
          let params = {
            province_code: this.regionData.option[0],
            city_code: this.regionData.option[1],
            hospital_id: this.regionData.hospitalId,
            product_id: this.regionData.productId,
            region_manager_id: this.regionData.managerId
          };
          this.submitRegion(params);
        })
        .catch(() => {
          console.log("取消");
        });
    },
    submitRegion(params) {
      this.$api.regionManagerSubmit(params)
        .then( res => {
          if (res.code == 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.regionData.option = [];
            this.resetAddData();
            this.isSearch = false;
            this.page = 1;
            this.getListData();
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
          this.addVisble = false;
        })
        .catch( err => {
          this.addVisble = false;
          console.log(err)
        })
    },

    // 重置添加数据
    resetAddData() {
      this.hosptalList = [];
      this.productList = [];
      this.regionList = [];
      this.regionData.hospitalId = null;
      this.regionData.productId = null;
      this.regionData.managerId = null;
    }
  }

  
};
</script>