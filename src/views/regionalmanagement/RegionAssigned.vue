<template>
  <div>
    <!-- 面包屑 -->
    <span class="breadcrumb">区域分配</span>
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
        <el-button size="small" plain icon="el-icon-bottom" @click="downLoad">下载</el-button>
      </el-col>
      <el-col :span="4" class="main_header_btns">
        <el-button size="small" type="primary" @click="search">搜索</el-button>
        <el-button size="small" type="primary" @click="resetSearch" plain>重置</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <div class="main_list">
      <div class="toolbar">
        <el-button size="small" plain icon="el-icon-plus" @click="addVisble = true"
          >新增区域</el-button
        >
      </div>
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column label="序号" type="index" width="80">
          <template slot-scope="scope">
            <span>{{ (page - 1) * row + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="province_name" label="省" min-width="120"></el-table-column>
        <el-table-column prop="city_name" label="市/区" min-width="120"></el-table-column>
        <el-table-column prop="hospital_name" label="医院名称" min-width="260"></el-table-column>
        <el-table-column prop="id" label="医院编号" min-width="120"></el-table-column>
        <el-table-column prop="product_name" label="产品名" min-width="140">
          <template slot-scope="scope">{{
            scope.row.product_name + "-" + scope.row.package
          }}</template>
        </el-table-column>
        <el-table-column prop="user_name" label="区域经理" min-width="100"></el-table-column>
        <!-- <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">正常</span>
            <span v-else class="logout">注销</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="60" fixed="right">
          <template slot-scope="scope">
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
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 详情弹窗 -->
    <el-dialog class="dialog_wrap" :visible.sync="detailVisble" :append-to-body="true" width="30%">
      <ul class="dialog_detail">
        <li><label>省：</label>{{ singleData.province_name }}</li>
        <li><label>市：</label>{{ singleData.city_name }}</li>
        <li><label>医院名称：</label>{{ singleData.hospital_name }}</li>
        <li><label>医院编号：</label>{{ singleData.id }}</li>
        <li><label>产品名：</label>{{ singleData.product_name + "-" + singleData.package }}</li>
        <li><label>区域经理：</label>{{ singleData.user_name }}</li>
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
    <el-dialog class="dialog_wrap width_full" :visible.sync="addVisble" :append-to-body="true">
      <div class="dialog_title" slot="title"><span class="line"></span>区域信息</div>
      <el-form
        :model="regionData"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        v-loading="addLoading"
        element-loading-text="数据拼命加载中..."
      >
        <el-form-item size="small" label="产品名：" prop="productId">
          <el-select
            v-model="regionData.productId"
            placeholder="请选择产品名"
            no-data-text="无可添加医院产品"
            @change="productChange"
          >
            <el-option
              v-for="(item, index) in productList"
              :label="item.product_name"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="省份：" prop="provinceCode">
          <el-select
            v-model="regionData.provinceCode"
            placeholder="请选择省份"
            no-data-text="无可添加省份"
            @change="provinceChange"
          >
            <el-option
              v-for="(item, index) in provinceData"
              :label="item.name"
              :value="item.province_code"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="城市：" prop="cityCode">
          <el-select
            v-model="regionData.cityCode"
            placeholder="请选择城市"
            no-data-text="无可添加城市"
            @change="cityChange"
          >
            <el-option
              v-for="(item, index) in cityData"
              :label="item.name"
              :value="item.city_code"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="医院名称：" prop="hospitalId">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group
            v-model="regionData.hospitalIdList"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="item in hosptalList"
              :label="item.hospital_name"
              :value="item.hospital_id"
              :key="item"
              >{{ item.hospital_name }}</el-checkbox
            >
          </el-checkbox-group>
          <!-- <el-select
            v-model="regionData.hospitalIdList"
            multiple
            placeholder="请选择医院名称"
            @change="changeHospital"
            no-data-text="无可添加区域医院"
          >
            <el-option
              v-for="(item, index) in hosptalList"
              :label="item.hospital_name"
              :value="item.hospital_id"
              :key="index"
            ></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item size="small" label="区域经理：" prop="managerId">
          <el-select
            v-model="regionData.managerId"
            placeholder="请选择区域经理"
            no-data-text="无可添加区域经理"
          >
            <el-option
              v-for="(item, index) in regionList"
              :label="item.name"
              :value="item.manager_id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addManager('ruleForm')">
          <span v-show="submitLoading" class="submit_loading"
            ><i class="el-icon-loading"></i>数据提交中...</span
          >
          <span v-show="!submitLoading">确 定</span>
        </el-button>
        <el-button size="small" type="info" plain @click="addVisble = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { provinceAndCityDataPlus } from "element-china-area-data";
export default {
  name: "RegionalManager",
  data() {
    return {
      listLoading: false, //加载数据中
      addLoading: false, // 新增加载数据中
      addVisble: false, //新增
      detailVisble: false, //详情弹窗
      submitLoading: false, // 数据提交加载
      singleData: {}, //单条数据
      managerName: null, // 搜索姓名
      provinceAndCityDataPlus: provinceAndCityDataPlus, //省市数据带“全部”
      productList: [], //产品列表
      provinceData: [], //省份数据
      cityData: [], //城市数据
      checkAll: false, //医院数据全选
      isIndeterminate: true,
      hosptalList: [], //医院列表
      regionList: [], //区域经理列表
      searchOption: [], //搜索省市
      isSearch: false, //是否是搜索请求
      regionData: {
        provinceCode: "",
        cityCode: "",
        hospitalIdList: [],
        productId: "",
        managerId: ""
      }, //新增数据
      page: 1,
      row: 10,
      total: 0,
      list: [],
      rules: {
        provinceCode: [{ required: true, message: "请选择省份", trigger: "change" }],
        cityCode: [{ required: true, message: "请选择城市", trigger: "change" }],
        hospitalIdList: [{ required: true, message: "请选择医院名称", trigger: "change" }],
        productId: [{ required: true, message: "请选择产品名", trigger: "change" }],
        managerId: [{ required: true, message: "请选择区域经理", trigger: "change" }]
      }
    };
  },
  mounted() {
    this.getListData();
    this.getproductList();
  },
  methods: {
    // 获取产品
    getproductList() {
      this.$api
        .productList()
        .then(res => {
          if (res.code == 200) {
            res.product_list.forEach(item => {
              this.productList.push({
                id: item.id,
                product_name: item.product_name + "-" + item.package
              });
            });
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //产品选择改变
    productChange(value) {
      console.log(value);
      this.provinceData = [];
      this.cityData = [];
      this.regionData.provinceCode = "";
      this.regionData.cityCode = "";
      let params = { product_id: this.regionData.productId };
      this.getprovinceData(params);
    },
    //通过产品获取省份信息
    getprovinceData(params) {
      this.addLoading = true;
      this.$api
        .regionManagerProduct(params)
        .then(res => {
          this.addLoading = false;
          if (res.code == 200) {
            this.provinceData = res.china_region_info;
          }
        })
        .catch(error => {
          this.addLoading = false;
          console.log(error);
        });
    },
    //省份改变
    provinceChange(value) {
      console.log("省份", value);
      this.cityData = [];
      this.regionList = [];
      this.regionData.cityCode = "";
      let params = { province_code: value };
      this.addLoading = true;
      //通过省份获取城市信息
      this.$api
        .getHospitalByProvince(params)
        .then(res => {
          this.addLoading = false;
          if (res.code == 200) {
            this.cityData = res.china_city_info;
          }
        })
        .catch(error => {
          this.addLoading = false;
          console.log(error);
        });
    },
    //城市改变
    cityChange(value) {
      console.log("城市", value);
      this.hosptalList = [];
      this.regionList = [];
      this.addLoading = true;
      let params = {
        province_code: this.regionData.provinceCode,
        city_code: this.regionData.cityCode,
        product_id: this.regionData.productId
      };
      this.$api
        .getHospitalByCity(params)
        .then(res => {
          console.log(res);
          this.addLoading = false;
          if (res.code == 200) {
            this.hosptalList = res.hospital_id_list;
            this.regionList = res.mangager_info;
          }
        })
        .catch(error => {
          this.addLoading = false;
          console.log(error);
        });
    },
    handleCheckAllChange(val) {
      this.regionData.hospitalIdList = val ? this.hosptalList : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.hosptalList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
    },
    //地区省市操作
    handleChange(arr) {
      this.searchOption = arr;
    },

    // 新增/编辑经理省市选择
    handleManagerChange(arr) {
      console.log(arr[0]);
    },

    // 获取列表数据
    getListData() {
      this.listLoading = true;
      let params = null;
      if (this.isSearch) {
        params = {
          regional_manager_name: this.managerName,
          province_code: this.searchOption[0],
          city_code: this.searchOption[1],
          page: this.page,
          row: this.row
        };
      } else {
        params = {
          page: this.page,
          row: this.row
        };
      }
      this.$api
        .regionManagerList(params)
        .then(res => {
          if (res.code == 200) {
            this.total = res.regional_info_count;
            this.list = res.regional_info_list;
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
          this.listLoading = false;
        })
        .catch(err => {
          this.listLoading = false;
          console.log(err);
        });
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
      let params = {
        regional_manager_name: this.managerName,
        province_code: this.searchOption[0],
        city_code: this.searchOption[1],
        is_export: 1
      };
      this.$api.downRegionManagerListExcel(params);
    },

    // 查看详情
    handleDetail(index, row) {
      this.detailVisble = true;
      this.singleData = row;
    },

    // 删除
    // handleDelete(index, row) {
    //     this.$messageBox.confirm('确认删除该条记录吗?', '提示', {
    //             type: 'warning'
    //         }).then(() => {
    //             console.log(row.id)
    //             let para = { id: row.id };
    //         }).catch(() => {
    //             console.log('取消')
    //         });
    // //   console.log(index, row);
    // },

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
    changeHospital(val) {
      // this.productList = [];
      // this.regionData.productId = null;
      // this.hosptalList.forEach(item => {
      //   if (item.id == val) {
      //     this.productList = item.product_info;
      //   }
      // });
    },

    // 新增区域
    addManager(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitManager();
        } else {
          return false;
        }
      });
    },

    // 提交数据
    submitManager() {
      this.$messageBox
        .confirm("提交数据后将无法更改，请确认无误后再提交！", "提示", {
          type: "warning"
        })
        .then(() => {
          let params = {
            history_id_list: this.regionData.hospitalIdList,
            product_id: this.regionData.provinceCode,
            province_code: this.regionData.provinceCode,
            city_code: this.regionData.cityCode,
            regional_manager_id: this.regionData.managerId
          };
          console.log(params);
          return false;
          this.submitRegion(params);
          this.submitLoading = true;
        })
        .catch(() => {
          console.log("取消");
        });
    },
    submitRegion(params) {
      this.$api
        .regionManagerSubmit(params)
        .then(res => {
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
          this.submitLoading = false;
        })
        .catch(err => {
          this.addVisble = false;
          this.submitLoading = false;
          console.log(err);
        });
    },

    // 重置添加数据
    resetAddData() {}
  }
};
</script>
