<template>
  <div class="RegionalManager">
    <!-- 面包屑 -->
    <span class="breadcrumb">区域经理</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item">
          <span>姓名：</span>
          <el-input size="small" v-model="managerName" placeholder="请输入"></el-input>
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
        <el-button size="small" plain icon="el-icon-plus" @click="addVisble = true"
          >新增经理</el-button
        >
        <el-button size="small" plain icon="el-icon-bottom" @click="downLoad">下载</el-button>
      </div>
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中..."
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column prop="province_name" label="省" width="160"></el-table-column>
        <el-table-column prop="city_name" label="市/区" width="160"></el-table-column>
        <el-table-column prop="name" label="姓名" width="130"></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="200"></el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template scope="scope">
            <span v-if="scope.row.status == 1">正常</span>
            <span v-else class="logout">注销</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template scope="scope">
            <el-tooltip
              class="item"
              :enterable="false"
              effect="dark"
              content="查看"
              placement="top"
            >
              <i class="el-icon-view" @click="handleDetail(scope.$index, scope.row)"></i>
            </el-tooltip>
            <el-tooltip
              v-if="scope.row.status == 1"
              class="item"
              :enterable="false"
              effect="dark"
              content="注销"
              placement="top"
            >
              <i class="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next, sizes, jumper"
          :page-sizes="[10, 20, 30, 40]"
          @current-change="currentChange"
          @size-change="sizeChange"
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
        <li><label>姓名：</label>{{ singleData.name }}</li>
        <li><label>手机号：</label>{{ singleData.phone }}</li>
        <li>
          <label>状态：</label>
          <span v-if="singleData.status == 1">正常</span>
          <span v-else class="logout">注销</span>
        </li>
      </ul>
      <div class="dialog_title" slot="title"><span class="line"></span>经理信息</div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="detailVisble = false">确 定</el-button>
        <el-button size="small" type="info" plain @click="detailVisble = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增经理 -->
    <el-dialog class="dialog_wrap" :visible.sync="addVisble" :append-to-body="true">
      <div class="dialog_title" slot="title"><span class="line"></span>新增经理</div>
      <el-form :model="managerData" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="省/市：" prop="option">
          <el-cascader
            class="width_full"
            size="small"
            :options="provinceAndCityData"
            v-model="managerData.option"
            @change="handleManagerChange"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input size="small" v-model="managerData.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" prop="email">
          <el-input size="small" v-model.number="managerData.email" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            size="small"
            type="password"
            v-model="managerData.password"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addManager('ruleForm')">确 定</el-button>
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
    // 手机号验证
    let checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手机号"));
      } else {
        const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      listLoading: false, //加载数据中
      addVisble: false, //新增
      detailVisble: false, //详情弹窗
      singleData: {}, //单条数据
      managerName: null, // 搜索姓名
      provinceAndCityDataPlus: provinceAndCityDataPlus, //省市数据带“全部”
      provinceAndCityData: provinceAndCityData, //省市数据不带“全部”
      searchOption: [], //搜索省市
      isSearch: false, //是否是搜索请求
      managerData: {
        option: [],
        name: null,
        email: null,
        password: null
      }, //新增数据
      page: 1,
      row: 10,
      total: 0,
      list: [],
      rules: {
        name: [{ required: true, message: "请输入姓名" }],
        option: [{ required: true, message: "请选择省市" }],
        email: [{ required: true, validator: checkPhone, trigger: "blur" }],
        password: [{ required: true, message: "请输入密码" }]
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getListData();
    });
  },
  methods: {
    //地区省市操作
    handleChange(arr) {
      this.searchOption = arr;
    },

    // 新增/编辑经理省市选择
    handleManagerChange(arr) {
      this.managerData.option = arr;
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
        .regionList(params)
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
      this.page = 1;
      this.isSearch = false;
      this.getListData();
    },

    // 下载
    downLoad() {},

    // 查看详情
    handleDetail(index, row) {
      this.detailVisble = true;
      this.singleData = row;
    },

    // 删除
    handleDelete(index, row) {
      this.$messageBox
        .confirm("确认注销该条记录吗?", "提示", {
          type: "warning"
        })
        .then(() => {
          let params = { regional_manager_id: row.id };
          this.delRegion(params);
        })
        .catch(() => {
          console.log("取消");
        });
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

    // 新增经理
    addManager(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitManager();
        } else {
          return false;
        }
      });
    },

    // 注销区域经理
    delRegion(params) {
      this.$api
        .delRegion(params)
        .then(res => {
          if (res.code == 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getListData();
          } else {
            this.$message({
              message: res.message,
              type: "success"
            });
          }
        })
        .catch(err => {
          console.log(err);
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
            province_code: this.managerData.option[0],
            city_code: this.managerData.option[1],
            name: this.managerData.name,
            email: this.managerData.email,
            password: this.managerData.password
          };
          this.addRegion(params);
        })
        .catch(() => {
          console.log("取消");
        });
    },
    addRegion(params) {
      this.$api
        .addRegion(params)
        .then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.managerData.option = [];
            this.managerData.name = null;
            this.managerData.email = null;
            this.managerData.password = null;
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
        .catch(err => {
          this.addVisble = false;
          console.log(err);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
