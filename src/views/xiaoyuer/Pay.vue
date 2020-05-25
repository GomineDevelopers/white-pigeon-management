<template>
  <el-row>
    <!-- 面包屑 -->
    <span class="breadcrumb">支付列表</span>
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
        <el-table-column label="支付链接">
          <template slot-scope="scope">
            <a
              v-if="scope.row.status == 1"
              class="pay_link"
              :href="scope.row.deposit_url"
              target="_blank"
              >{{ scope.row.deposit_url }}</a
            >
            <span v-else-if="scope.row.status == 3">{{ scope.row.deposit_url }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="时间" width="160"></el-table-column>
        <el-table-column label="订单号" width="500">
          <template slot-scope="scope">
            <div
              class="order_list"
              v-for="(item, index) in JSON.parse(scope.row.order_list)"
              :key="index"
            >
              <span>金额：{{ ((item.amount * 1) / 100).toFixed(2) }}元</span
              ><span>{{ `身份证号：${item.certNo}` }}</span
              ><span>{{ `订单号：${item.orderId}` }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">未支付</span>
            <div v-else-if="scope.row.status == 3">
              <p style="color: #67C23A">已支付</p>
              <el-button type="primary" size="small" @click="createOrder(scope.row.reqid)"
                >生成服务者订单</el-button
              >
            </div>
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
  name: "Pay",
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
        .linkList(params)
        .then((res) => {
          if (res.code == 200) {
            this.list = res.link_list;
            this.total = res.link_count;
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

    // 生成订单列表
    createOrder(reqid) {
      this.$api
        .getOrderData({ reqid })
        .then((res) => {
          if (res.code == 200) {
            this.$router.push("/order");
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
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
