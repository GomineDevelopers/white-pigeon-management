<template>
  <div class="RegionalManager">
    <!-- 面包屑 -->
    <span class="breadcrumb">奖金明细</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item">
          <span>代表姓名：</span>
          <el-input size="small" v-model="searchName" placeholder="请输入"></el-input>
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
        <el-table-column prop="name" label="代表姓名" width="120"></el-table-column>
        <el-table-column
          prop="extractable_bonus"
          label="本期可提奖金"
          min-width="120"
        ></el-table-column>
        <el-table-column
          prop="develop_bonus"
          label="本期医院开发奖"
          min-width="120"
        ></el-table-column>
        <el-table-column
          prop="invite_bonus"
          label="本期推荐奖（元）"
          min-width="120"
        ></el-table-column>
        <el-table-column
          prop="deposit"
          label="本期应扣押金（元）"
          min-width="120"
        ></el-table-column>
        <el-table-column
          prop="total_bonus"
          label="本期总计奖金（元）"
          min-width="120"
        ></el-table-column>
        <!-- <el-table-column prop="role_name" label="累计已返奖金" min-width="120"></el-table-column>
        <el-table-column prop="role_name" label="累计押金" min-width="120"></el-table-column>
        <el-table-column prop="role_name" label="累计延迟奖金" min-width="120"></el-table-column>
        <el-table-column prop="role_name" label="累计总金额" min-width="120"></el-table-column> -->
        <el-table-column
          prop="create_time"
          label="核销日期"
          :formatter="dateFormatter"
          min-width="120"
        ></el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template scope="scope">
            <el-button
              size="mini"
              type="primary"
              plain
              @click="handleDetail(scope.$index, scope.row)"
              >详细</el-button
            >
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
        ></el-pagination>
      </div>
    </div>
    <!-- 详情弹窗 -->
    <el-dialog class="dialog_wrap" :visible.sync="detailVisble" :append-to-body="true" width="40%">
      <div class="dialog_title" slot="title"><span class="line"></span>代表奖金详情</div>
      <ul class="dialog_detail">
        <li>
          <label>代表姓名：</label>
          {{ singleData.name }}
        </li>
        <li class="detail_table">
          <label>开发医院产品：</label>
          <div class="table">
            <el-table
              :data="list"
              border
              show-summary
              v-loading="listLoading"
              element-loading-text="数据拼命加载中..."
              element-loading-background="rgba(255, 255, 255, 0.8)"
              style="width: 100%"
            >
              <el-table-column prop="id" label="医院"></el-table-column>
              <el-table-column prop="name" label="产品"></el-table-column>
              <el-table-column prop="id" label="理论奖金"></el-table-column>
              <el-table-column prop="id" label="行为奖金"></el-table-column>
              <el-table-column prop="id" label="业绩奖金"></el-table-column>
            </el-table>
          </div>
        </li>
        <li>
          <label>本期可提奖金（元）：</label>
          {{ singleData.extractable_bonus }}
        </li>
        <li>
          <label>本期业绩奖金（元）：</label>
          {{ singleData.achievement_bonus }}
        </li>
        <li>
          <label>本期医院开发奖（元）：</label>
          {{ singleData.develop_bonus }}
        </li>
        <li>
          <label>本期推荐奖（元）：</label>
          {{ singleData.invite_bonus }}
        </li>
        <li>
          <label>本期应扣押金（元）：</label>
          {{ singleData.deposit }}
        </li>
        <li>
          <label>本期总计奖金（元）：</label>
          {{ singleData.total_bonus }}
        </li>
        <!-- <li>
          <label>累计已返奖金：</label>
          {{ singleData.id }}
        </li>
        <li>
          <label>累计押金：</label>
          {{ singleData.id }}
        </li>
        <li>
          <label>累计延迟奖金：</label>
          {{ singleData.id }}
        </li>
        <li>
          <label>累计总金额：</label>
          {{ singleData.id }}
        </li> -->
      </ul>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="detailVisble = false">确 定</el-button>
        <el-button size="small" type="info" plain @click="detailVisble = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "IncomeDetail",
  data() {
    return {
      listLoading: false, //加载数据中
      detailVisble: false, //详情弹窗
      isSearch: false, //是否是搜索请求
      searchName: null, //搜索姓名
      singleData: {},
      page: 1,
      size: 10,
      total: 0,
      list: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getIncomeDetailList();
    });
  },
  methods: {
    // 获取列表数据
    getIncomeDetailList() {
      this.listLoading = true;
      let params = {
        info: this.searchName,
        page: this.page,
        size: this.size
      };
      console.log("params", params);
      this.$api
        .userBonusList(params)
        .then(res => {
          console.log(res);
          this.listLoading = false;
          if (res.code == 200) {
            this.total = res.detailed_count;
            this.list = res.detailed_list;
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
        })
        .catch(err => {
          this.listLoading = false;
          console.log(err);
        });
    },

    // 搜索
    search() {
      if (this.searchName == null) {
        this.$message({
          message: "请输入搜索内容",
          type: "error"
        });
        return false;
      }
      this.isSearch = true;
      this.page = 1;
      this.getIncomeDetailList();
    },

    // 重置搜索内容
    resetSearch() {
      this.searchName = null;
      this.isSearch = false;
      this.page = 1;
      this.getUserInfoList();
    },

    // 弹出代表详情
    handleDetail(index, row) {
      this.detailVisble = true;
      // console.log(row);
      let params = {
        menu_id: row.menu_id,
        user_id: row.user_id
      };
      this.$api
        .bonusDetail(params)
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.singleData = res.bonus_datiled[0];
          }
        })
        .catch(error => {
          console.log(res);
        });
    },

    // 点击分页当前页数
    currentChange(val) {
      this.page = val;
      this.getUserInfoList();
    },

    // 切换每页条数
    sizeChange(val) {
      this.size = val;
      this.getUserInfoList();
    },
    dateFormatter(row) {
      if (row.create_time != null) {
        return row.create_time.split(" ")[0];
      } else {
        return row.create_time;
      }
    }
  }
};
</script>
<style>
.property_wrap .el-checkbox {
  width: 42%;
  margin-top: 10px;
}
.property_wrap .el-checkbox__inner {
  width: 16px;
  height: 16px;
}
.property_wrap .el-checkbox__inner::after {
  left: 5px;
  height: 8px;
}
.property_wrap .el-checkbox__label,
.property_wrap .el-checkbox {
  font-size: 16px;
}
.textarea_box textarea {
  min-height: 200px !important;
}
.dialog_detail .table th {
  padding: 0;
  background: #fafafa;
}
.dialog_detail .table td {
  padding: 5px 0;
}
</style>
<style scoped>
.main_list {
  margin-top: 20px;
}
.el-dialog .dialog_detail {
  padding-left: 0;
}
.dialog_detail li label {
  width: 160px;
  white-space: nowrap;
}

.dialog_detail .detail_table .table {
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
