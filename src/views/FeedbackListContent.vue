<template>
  <div class="RegionalManager">
    <!-- 面包屑 -->
    <span class="breadcrumb">代表反馈</span>
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
        <el-table-column prop="province_name" label="省" min-width="80"></el-table-column>
        <el-table-column prop="name" label="姓名" min-width="80"></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="120"></el-table-column>
        <el-table-column prop="idea" label="内容" min-width="210"></el-table-column>
        <el-table-column prop="create_time" label="反馈时间" min-width="140"></el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              :enterable="false"
              effect="dark"
              content="查看"
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
    <!-- 详情弹窗 -->
    <el-dialog class="dialog_wrap" :visible.sync="detailVisble" :append-to-body="true" width="30%">
      <ul class="dialog_detail">
        <li><label>省：</label>{{ singleData.province_name }}</li>
        <li><label>姓名：</label>{{ singleData.name }}</li>
        <li><label>手机号：</label>{{ singleData.phone }}</li>
        <li><label class="white_space">内容：</label>{{ singleData.idea }}</li>
        <li><label>反馈时间：</label>{{ singleData.create_time }}</li>
      </ul>
      <div class="dialog_title" slot="title"><span class="line"></span>反馈内容详情</div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "feedbackListContent",
  data() {
    return {
      listLoading: false, //加载数据中
      detailVisble: false,
      page: 1,
      row: 10,
      total: 0,
      list: [],
      singleData: {} //单条数据
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
      let params = {
        regional_manager_id: this.$route.query.id,
        page: this.page,
        row: this.row
      };
      console.log(params);
      this.$api
        .getUserFeedback(params)
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.total = res.feedback_count[0].count_sum;
            this.list = res.feedback_list;
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
      this.detailVisble = true;
      this.singleData = row;
    }
  }
};
</script>
<style scoped>
.breadcrumb {
  display: block;
  margin-bottom: 10px !important;
}
</style>
