<template>
  <el-row>
    <!-- 列表 -->
    <div class="main_list">
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中..."
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column prop="name" label="姓名" min-width="80"></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="140"></el-table-column>
        <el-table-column prop="idCard" label="证件号" min-width="160"></el-table-column>
        <el-table-column
          prop="validPeriod"
          label="身份证有效期"
          :formatter="dateFormatter"
          min-width="140"
        ></el-table-column>
        <el-table-column prop="cardAddress" label="证件地址" min-width="140"></el-table-column>
        <el-table-column prop="openingBank" label="开户行" min-width="140"></el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              :enterable="false"
              effect="dark"
              content="注册"
              placement="top"
              v-if="scope.row.status==1"
            >
              <i class="el-icon-document" @click="register(scope.row)"></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              :enterable="false"
              effect="dark"
              content="已注册"
              placement="top"
              v-if="scope.row.status==2"
            >
              <i class="el-icon-document-checked"></i>
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
        ></el-pagination>
      </div>
    </div>
  </el-row>
</template>
<script>
export default {
  name: "Register",
  data() {
    return {
      page: 1,
      row: 10,
      total: 0,
      listLoading: false, //加载数据中
      list: [
        {
          name: "张三",
          phone: "15764328765",
          idCard: "522309198710084325",
          validPeriod: "2020-02-21 ",
          cardAddress: "上海市闵行区",
          openingBank: "浦发银行闵行支行",
          status: 1
        },
        {
          name: "张三",
          phone: "15764328765",
          idCard: "522309198710084325",
          validPeriod: "2020-02-21 ",
          cardAddress: "上海市闵行区",
          openingBank: "浦发银行闵行支行",
          status: 2
        },
        {
          name: "张三",
          phone: "15764328765",
          idCard: "522309198710084325",
          validPeriod: "2020-02-21 ",
          cardAddress: "上海市闵行区",
          openingBank: "浦发银行闵行支行",
          status: 1
        },
        {
          name: "张三",
          phone: "15764328765",
          idCard: "522309198710084325",
          validPeriod: "2020-02-21 ",
          cardAddress: "上海市闵行区",
          openingBank: "浦发银行闵行支行",
          status: 1
        },
        {
          name: "张三",
          phone: "15764328765",
          idCard: "522309198710084325",
          validPeriod: "2020-02-21 ",
          cardAddress: "上海市闵行区",
          openingBank: "浦发银行闵行支行",
          status: 1
        },
        {
          name: "张三",
          phone: "15764328765",
          idCard: "522309198710084325",
          validPeriod: "2020-02-21 ",
          cardAddress: "上海市闵行区",
          openingBank: "浦发银行闵行支行",
          status: 1
        }
      ]
    };
  },
  methods: {
    dateFormatter(row) {
      if (row.validPeriod != null) {
        return row.validPeriod.split(" ")[0];
      } else {
        return row.validPeriod;
      }
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
    //注册
    register(row) {}
  }
};
</script>
<style scoped>
</style>
