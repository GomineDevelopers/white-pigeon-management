<template>
  <div class="RegionalManager">
    <!-- 面包屑 -->
    <span class="breadcrumb">
      <span v-if="type == 1">拜访核销</span><span v-if="type == 2">会议核销</span> -
      <i>张琳</i></span
    >
    <!-- 列表 -->
    <div class="main_list">
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中..."
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column prop="hospital" label="医院" min-width="140"></el-table-column>
        <el-table-column prop="product" label="产品" min-width="140"></el-table-column>
        <el-table-column label="数量" min-width="140">
          <template scope="scope"> {{ scope.row.num }}条 </template>
        </el-table-column>
        <el-table-column label="核销日期" min-width="140">
          <template scope="scope"> {{ scope.row.date }} </template>
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
export default {
  name: "VerificationList",
  data() {
    return {
      type: "",
      listLoading: false, //加载数据中
      page: 1,
      row: 10,
      total: 0,
      list: [
        {
          hospital: "复旦大学附属眼耳鼻喉科医院",
          product: "美维宁",
          num: "12",
          date: "2019-03-29"
        },
        {
          hospital: "复旦大学附属眼耳鼻喉科医院",
          product: "美维宁",
          num: "12",
          date: "2019-03-29"
        },
        {
          hospital: "复旦大学附属眼耳鼻喉科医院",
          product: "美维宁",
          num: "12",
          date: "2019-03-29"
        },
        {
          hospital: "复旦大学附属眼耳鼻喉科医院",
          product: "美维宁",
          num: "12",
          date: "2019-03-29"
        },
        {
          hospital: "复旦大学附属眼耳鼻喉科医院",
          product: "美维宁",
          num: "12",
          date: "2019-03-29"
        }
      ]
    };
  },
  mounted() {
    this.type = this.$route.query.type;
  },
  methods: {
    // 获取列表数据
    getListData() {},

    // 点击分页当前页数
    currentChange(val) {
      this.page = val;
      this.getListData();
    },

    // 切换每页条数
    sizeChange(val) {
      this.row = val;
      this.getListData();
    }
  }
};
</script>
<style scoped>
.breadcrumb {
  display: block;
  margin-bottom: 10px;
}
.breadcrumb i {
  font-style: normal;
  color: #1890ff;
  font-size: 18px;
}
</style>
