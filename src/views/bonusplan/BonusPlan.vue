<template>
  <div class="RegionalManager">
    <!-- 面包屑 -->
    <span class="breadcrumb">
      <router-link to="/historyflowdirectory">流向目录</router-link> / 核销列表
    </span>
    <!-- 列表 -->
    <div class="main_list">
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中..."
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column prop="name" label="姓名" min-width="140"></el-table-column>
        <el-table-column label="拜访" min-width="140">
          <template scope="scope">
            <span class="detail_link" @click="goVisitDetail(scope.row)">{{ scope.row.vs }}</span
            >条
          </template>
        </el-table-column>
        <el-table-column prop="metting" label="会议" min-width="140">
          <template scope="scope">
            <span class="detail_link" @click="goMettingDetail(scope.row)">{{ scope.row.ms }}</span
            >人
          </template>
        </el-table-column>
        <el-table-column prop="theory" label="理论奖金（元）" min-width="140"></el-table-column>
        <el-table-column prop="action" label="行为奖金（元）" min-width="140"></el-table-column>
        <el-table-column prop="status" label="状态" min-width="140">
          <template scope="scope">
            <span v-if="scope.row.status == 1">已通过、未核销</span>
            <span v-if="scope.row.status == 4">已核销</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template scope="scope">
            <el-button
              v-if="scope.row.status == 1"
              size="small"
              type="primary"
              @click="handleList(scope.$index, scope.row)"
              >核销</el-button
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
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "BonusPlan",
  data() {
    return {
      listLoading: true, //加载数据中
      page: 1,
      row: 10,
      total: 0,
      list: [],
      menuId: ""
    };
  },
  mounted() {
    this.menuId = this.$route.query.id;
    console.log("流向目录id", this.menuId);
    this.$nextTick(() => {
      this.getListData();
    });
  },
  methods: {
    // 匹配获取列表数据
    getListData() {
      this.listLoading = true;
      let params = {
        menu_id: this.menuId,
        page: this.page,
        row: this.row
      };
      this.$api
        .flowsList(params)
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.listLoading = false;
            this.total = res.flows_count;
            this.$message({
              message: "查询成功",
              type: "success"
            });
            this.list = res.flows_list;
          }
        })
        .catch(error => {
          console.log(error);
          this.listLoading = false;
        });
    },

    // 核销
    handleList(index, row) {
      console.log(row);
      this.$messageBox
        .confirm("确认核销该条记录吗?", "提示", {
          type: "warning"
        })
        .then(() => {
          let params = {
            menu_id: this.menuId,
            user_id: row.user_id
          };
          this.$api
            .flowupdate(params)
            .then(res => {
              if (res.code == 200) {
                this.$message({
                  message: "核销成功",
                  type: "success"
                });
                this.getListData();
              } else {
                this.$message({
                  message: res.message,
                  type: "error"
                });
              }
            })
            .catch(error => {
              console.log(error);
            });
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

    //核销拜访或会议详情
    goVisitDetail(row) {
      this.$router.push({
        path: "/verificationlist",
        query: { menuId: this.menuId, userId: row.user_id, userName: row.name }
      });
    },
    goMettingDetail(row) {
      this.$router.push({
        path: "/mettingverification",
        query: { menuId: this.menuId, userId: row.user_id, userName: row.name }
      });
    }
  }
};
</script>
<style scoped>
.upload_div {
  display: -webkit-flex;
  display: flex;
}
.detail_link {
  cursor: pointer;
  color: #1890ff;
  text-decoration: underline;
}
.breadcrumb {
  display: block;
  margin-bottom: 10px;
}
.breadcrumb a {
  color: #adb3a8;
  cursor: pointer;
}
</style>
