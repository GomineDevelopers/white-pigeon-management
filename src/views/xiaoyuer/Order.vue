<template>
  <el-row>
    <!-- 面包屑 -->
    <span class="breadcrumb">服务者订单列表</span>
    <!-- 列表 -->
    <div class="main_list">
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中..."
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column prop="reqid" label="需求ID" width="100"></el-table-column>
        <el-table-column prop="name" label="姓名" width="140"></el-table-column>
        <el-table-column prop="id_card" label="身份证号" width="190"></el-table-column>
        <el-table-column prop="order_id" label="订单号" width="150"></el-table-column>
        <el-table-column
          prop="amount"
          label="订单金额（元）"
          width="150"
          :formatter="formatPrice"
        ></el-table-column>
        <el-table-column prop="create_time" label="订单生成时间" width="200"></el-table-column>
        <el-table-column
          prop="order_time"
          label="订单付款时间（小鱼儿）"
          width="200"
        ></el-table-column>

        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.order_status == 1">服务者确定并提交</span>
            <span v-else-if="scope.row.order_status == 2">服务者拒绝</span>
            <span v-else-if="scope.row.order_status == 3">正常</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="total,prev, pager, next, sizes, jumper"
          :page-sizes="[10, 20, 30, 40]"
          @current-change="currentChange"
          @size-change="sizeChange"
          :current-page.sync="page"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </el-row>
</template>
<script>
export default {
  name: "Order",
  data() {
    return {
      page: 1,
      row: 10,
      total: 0,
      listLoading: false,
      list: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getListData();
    });
  },
  methods: {
    // 获取列表信息
    getListData() {
      this.listLoading = true;
      let params = { page: this.page, row: this.row };
      this.$api
        .orderList(params)
        .then((res) => {
          if (res.code == 200) {
            this.list = res.order_list;
            this.total = res.order_count;
          } else {
            this.$message({
              message: res.message,
              type: "error",
            });
          }
          this.listLoading = false;
        })
        .catch((err) => {
          this.listLoading = false;
          console.log(err);
        });
    },
    // 处理金额分为元
    formatPrice(row) {
      return ((row.amount * 1) / 100).toFixed(2);
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
  },
};
</script>
<style scoped>
.main_list {
  margin-top: 30px;
}
.pay_link {
  color: #409eff;
  text-decoration: none;
}
.order_list span {
  padding-right: 20px;
}
</style>
