<template>
  <div>
    <!-- 面包屑 -->
    <span class="breadcrumb">合同下载</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item">
          <span>代表姓名：</span>
          <el-input size="small" v-model="deputyName" placeholder="请输入医药代表姓名"></el-input>
        </div>
        <div class="main_header_item">
          <span>产品名：</span>
          <el-select size="small" v-model="productId" placeholder="请选择">
            <el-option-group v-for="group in product" :key="group.label" :label="group.label">
              <el-option
                v-for="(item, index) in group.options"
                :label="item.product_name"
                :value="item.id"
                :key="index"
              >
                <span :class="{ logout: item.status != 1 }">
                  {{ item.product_name }}
                </span>
              </el-option>
            </el-option-group>
          </el-select>
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
        element-loading-text="数据拼命加载中"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column label="序号" type="index" min-width="50">
          <template slot-scope="scope">
            <span>{{ (page - 1) * row + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="代表姓名" min-width="120"></el-table-column>
        <el-table-column prop="province_name" label="所属省份" min-width="140"></el-table-column>
        <el-table-column prop="hospital_name" label="医院名称" min-width="260"></el-table-column>
        <el-table-column prop="product_name" label="产品名" min-width="140"></el-table-column>
        <el-table-column prop="modify_time" label="签约日期" min-width="140">
          <template slot-scope="scope">
            {{ scope.row.modify_time.substring(0, 10) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="region_promise_sales"
          label="区域经理定销量"
          min-width="140"
        ></el-table-column>
        <el-table-column
          prop="region_bidding_price"
          label="区域经理定单价"
          min-width="140"
        ></el-table-column>
        <el-table-column prop="status" label="状态" min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.is_sign == 2" class="status_waiting">已通过，未签约</span>
            <span v-if="scope.row.is_sign == 1" class="status_success">已签约</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <i class="el-icon-view" @click="handleDetail(scope.$index, scope.row)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="下载合同" placement="top">
              <i
                v-if="scope.row.is_sign == 1"
                class="el-icon-download"
                @click="downFile(scope.row.id)"
              ></i>
            </el-tooltip>
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
        ></el-pagination>
      </div>
    </div>
    <!-- 详情弹窗 -->
    <el-dialog class="dialog_wrap" :visible.sync="detailVisble" :append-to-body="true" width="30%">
      <div class="dialog_title" slot="title"><span class="line"></span>申请信息</div>
      <ul class="dialog_detail">
        <li>
          <label>医药代表姓名：</label>
          {{ singleData.user_name }}
        </li>
        <li>
          <label>所属省份：</label>
          {{ singleData.province_name }}
        </li>
        <li>
          <label>医院名称：</label>
          {{ singleData.hospital_name }}
        </li>
        <li>
          <label>产品名称：</label>
          {{ singleData.product_name }}
        </li>
        <li>
          <label>承诺销量：</label>
          {{ singleData.promise_sales }}
        </li>
        <li>
          <label>承诺完成时间：</label>
          {{ singleData.complete_time }}
        </li>
        <li>
          <label>代表对医院了解：</label>
          <p>{{ singleData.hospital_know }}</p>
        </li>
        <li>
          <label>代表对竞品了解：</label>
          <p>{{ singleData.commodity_know }}</p>
        </li>
        <li>
          <label>状态：</label>
          <span v-if="singleData.is_sign == 2" class="status_waiting">已通过，未签约</span>
          <span v-else-if="singleData.is_sign == 1" class="status_success">已签约</span>
        </li>
        <li v-if="singleData.is_sign == 1">
          <label>合同：</label>
          <el-button size="mini" type="primary" @click="downFile(singleData.id)"
            >下载合同</el-button
          >
        </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="detailVisble = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "BiddingManagement",
  data() {
    return {
      listLoading: false, //加载数据中
      detailVisble: false, //详情弹窗
      singleData: {}, //单条数据
      deputyName: null, // 搜索姓名
      productId: null, //搜索产品ID
      isSearch: false, //是否是搜索请求
      page: 1,
      row: 10,
      total: 0,
      list: [],
      product: [
        {
          label: "有效产品",
          options: []
        },
        {
          label: "已注销产品",
          options: []
        }
      ]
    };
  },
  mounted() {
    this.getListData();
    this.getproductList();
  },
  methods: {
    // 获取列表数据
    getListData() {
      this.listLoading = true;
      let params = null;
      if (this.isSearch) {
        params = {
          user_name: this.deputyName,
          product_id: this.productId,
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
        .contractManagerList(params)
        .then(res => {
          if (res.code == 200) {
            this.total = res.contract_list_count;
            this.list = res.contract_list;
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

    // 获取产品
    getproductList() {
      this.$api
        .productList()
        .then(res => {
          if (res.code == 200) {
            res.product_list.forEach(item => {
              if (item.status == 1) {
                this.product[0].options.push({
                  id: item.id,
                  product_name: item.product_name,
                  status: item.status
                });
              } else {
                this.product[1].options.push({
                  id: item.id,
                  product_name: item.product_name,
                  status: item.status
                });
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 搜索
    search() {
      if (this.deputyName == null && this.productId == null) {
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
      this.deputyName = null;
      this.productId = null;
      this.isSearch = false;
      this.getListData();
    },

    // 查看详情
    handleDetail(index, row) {
      this.detailVisble = true;
      this.singleData = row;
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

    // 下载PDF文件
    downFile(id) {
      let params = { hospital_product_id: id };
      this.$api.downContractPdf(params);
    }
  }
};
</script>
<style scoped>
.dialog_detail li {
  overflow: hidden;
}
.dialog_detail li label {
  width: 120px;
  float: left;
}
.dialog_detail li p {
  padding-left: 130px;
  margin-top: 0;
  margin-bottom: 0;
}
.dialog_detail .img {
  width: 200px;
}
</style>
