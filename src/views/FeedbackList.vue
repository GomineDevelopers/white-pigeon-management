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
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中..."
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column label="序号" type="index" width="100">
          <template slot-scope="scope">
            <span>{{ (page - 1) * row + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="province_name" label="省" min-width="120"></el-table-column>
        <el-table-column prop="city_name" label="市/区" min-width="160"></el-table-column>
        <el-table-column prop="name" label="姓名" min-width="130"></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="200"></el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">正常</span>
            <span v-else class="logout">注销</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              :enterable="false"
              effect="dark"
              content="查看反馈"
              placement="top"
            >
              <i class="el-icon-view" @click="handleDetail(scope.row)"></i>
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
  </div>
</template>
<script>
import { provinceAndCityDataPlus, provinceAndCityData } from "element-china-area-data";
export default {
  name: "RegionalManager",
  data() {
    return {
      listLoading: false, //加载数据中
      addVisble: false, //新增
      singleData: {}, //单条数据
      managerName: null, // 搜索姓名
      provinceAndCityDataPlus: provinceAndCityDataPlus, //省市数据带“全部”
      provinceAndCityData: provinceAndCityData, //省市数据不带“全部”
      searchOption: [], //搜索省市
      isSearch: false, //是否是搜索请求
      page: 1,
      row: 10,
      total: 0,
      list: []
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

    //查看反馈
    handleDetail(row) {
      console.log(row);
      this.$router.push({ path: "/feedbacklistcontent", query: { id: row.id } });
    }
  }
};
</script>
