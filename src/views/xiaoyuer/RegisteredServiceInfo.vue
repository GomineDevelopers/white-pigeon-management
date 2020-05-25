<template>
  <el-row>
    <!-- 面包屑 -->
    <span class="breadcrumb">注册服务者列表</span>
    <!-- 列表 -->
    <div class="main_list">
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中..."
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column prop="name" label="用户姓名" width="230"></el-table-column>
        <el-table-column prop="cellphone" label="手机号" width="200"></el-table-column>
        <el-table-column prop="certNo" label="身份证号" width="220"></el-table-column>
        <el-table-column prop="amount" label="最近一次奖金金额" width="200"></el-table-column>
        <el-table-column
          prop="verification_time"
          label="最近一次奖金的时间"
          min-width="200"
        ></el-table-column>
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
  name: "RegisteredServiceInfo",
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
      let params = { page: this.page, row: this.row, choose: 1 };
      this.$api
        .registerList(params)
        .then((res) => {
          if (res.code == 200) {
            this.list = res.xyr_register_list;
            this.total = res.xyr_register_count;
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
</style>
