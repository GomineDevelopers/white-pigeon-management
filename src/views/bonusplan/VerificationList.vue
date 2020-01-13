<template>
  <div class="RegionalManager">
    <!-- 面包屑 -->
    <span class="breadcrumb">
      <router-link to="/historyflowdirectory">流向目录</router-link> /
      <router-link :to="{ path: '/bonusplan', query: { id: menuId } }">核销列表</router-link> /
      <span>拜访核销</span>- <i>{{ userName }}</i></span
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
        <el-table-column label="序号" type="index" width="100">
          <template slot-scope="scope">
            <span>{{ (page - 1) * row + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="hospital_name" label="医院" min-width="140"></el-table-column>
        <el-table-column prop="product_name" label="产品" min-width="140"></el-table-column>
        <el-table-column label="数量" min-width="140">
          <template slot-scope="scope"> {{ scope.row.visit_times }}条 </template>
        </el-table-column>
        <el-table-column label="核销日期" min-width="140">
          <template slot-scope="scope"> {{ scope.row.modify_time }} </template>
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
      menuId: "",
      userId: "",
      userName: "",
      listLoading: true, //加载数据中
      page: 1,
      row: 10,
      total: 0,
      list: []
    };
  },
  mounted() {
    this.type = this.$route.query.type;
    this.menuId = this.$route.query.menuId;
    this.userId = this.$route.query.userId;
    this.userName = this.$route.query.userName;
    this.$nextTick(() => {
      this.getListData();
    });
  },
  methods: {
    // 获取列表数据
    getListData() {
      this.listLoading = true;
      let params = {
        menu_id: this.menuId,
        user_id: this.userId,
        page: this.page,
        row: this.row
      };
      this.$api
        .visitList2(params)
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.listLoading = false;
            this.list = res.visit_list;
          }
        })
        .catch(error => {
          console.log(error);
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
  font-size: 18px;
  color: #1890ff;
}
.breadcrumb a {
  color: #adb3a8;
  cursor: pointer;
}
</style>
