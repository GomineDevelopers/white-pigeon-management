<template>
  <div class="RegionalManager">
    <!-- 面包屑 -->
    <span class="breadcrumb">代表管理</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item">
          <span>姓名：</span>
          <el-input size="small" v-model="managerName" placeholder="请输入"></el-input>
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
        <el-button size="small" plain icon="el-icon-bottom" @click="downLoad">下载</el-button>
      </div>
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中..."
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column prop="province_name" label="省" width="100"></el-table-column>
        <el-table-column prop="id" label="代表编号" width="120"></el-table-column>
        <el-table-column prop="name" label="姓名" width="100"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="id_card" label="身份证号"></el-table-column>
        <el-table-column
          prop="id_effect_time"
          label="身份证有效期"
          :formatter="dateFormatter"
        ></el-table-column>
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
            <!-- <el-tooltip
              v-if="scope.row.status == 1"
              class="item"
              :enterable="false"
              effect="dark"
              content="注销"
              placement="top"
            >
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
        <li><label>姓名：</label>{{ singleData.name }}</li>
        <li><label>手机号：</label>{{ singleData.phone }}</li>
        <li><label>身份证号：</label>{{ singleData.id_card }}</li>
        <li><label>证件地址：</label>{{ singleData.id_address }}</li>
        <li><label>证件有效期：</label>{{ dateFormatter(singleData) }}</li>
        <li><label>银行卡号：</label>{{ singleData.card_no }}</li>
        <li><label>开户行：</label>{{ singleData.bank_name }}</li>
        <li>
          <label>身份证照片：</label>
          <el-image
            :src="singleData.id_front_img"
            :preview-src-list="[singleData.id_front_img, singleData.id_back_img]"
            v-if="singleData.id_front_img"
          >
          </el-image>
          <el-image
            :src="singleData.id_back_img"
            :preview-src-list="[singleData.id_front_img, singleData.id_back_img]"
            v-if="singleData.id_back_img"
          >
          </el-image>
        </li>
      </ul>
      <div class="dialog_title" slot="title"><span class="line"></span>代表信息</div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="detailVisble = false">确 定</el-button>
        <el-button size="small" type="info" plain @click="detailVisble = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { provinceAndCityDataPlus, provinceAndCityData } from "element-china-area-data";
export default {
  name: "representative",
  data() {
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
          name: this.managerName,
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
        .userManagerList(params)
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.total = res.user_list_count;
            this.list = res.user_list;
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
    dateFormatter(row) {
      if (row.id_effect_time != null) {
        return row.id_effect_time.split(" ")[0];
      } else {
        return row.id_effect_time;
      }
    },

    // 搜索
    search() {
      if (this.managerName == null) {
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
      this.page = 1;
      this.isSearch = false;
      this.getListData();
    },

    // 下载
    downLoad() {
      console.log("下载");
    },

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
    }
  }
};
</script>
<style scoped>
.dialog_wrap .dialog_detail li .el-image {
  width: 154px;
  height: 100px;
  margin-right: 10px;
}
.dialog_detail li label {
  white-space: nowrap;
}
</style>
