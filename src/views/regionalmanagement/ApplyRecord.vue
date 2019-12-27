<template>
  <div>
    <!-- 面包屑 -->
    <span class="breadcrumb">申请记录</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item">
          <span>代表：</span>
          <el-input size="small" v-model="user" placeholder="请输入"></el-input>
        </div>
        <div class="main_header_item">
          <span>产品：</span>
          <el-select size="small" v-model="product_name" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="4" class="main_header_btns">
        <el-button size="small" type="primary" @click="search">搜索</el-button>
        <el-button size="small" type="primary" @click="resetSearch" plain
          >重置</el-button
        >
      </el-col>
    </el-row>
    <!-- 列表 -->
    <div class="main_list">
      <el-table
        :data="tableData"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column
          prop="apply_name"
          label="申请代表"
          width="160"
        ></el-table-column>
        <el-table-column
          prop="apply_time"
          label="申请时间"
          width="160"
        ></el-table-column>
        <el-table-column
          prop="hospital_name"
          label="医院"
          min-width="260"
        ></el-table-column>
        <el-table-column
          prop="product_name"
          label="产品"
          min-width="140"
        ></el-table-column>
        <el-table-column
          prop="reason"
          label="拒绝通过理由"
          min-width="300"
        ></el-table-column>
        <el-table-column prop="status" label="状态" width="120" fixed="right">
          <template scope="scope">
            <span v-if="scope.row.status == 0"
              ><b class="dot refuse"></b>拒绝</span
            >
            <span v-if="scope.row.status == 1"
              ><b class="dot approved"></b>已审批</span
            >
            <span v-if="scope.row.status == 2"
              ><b class="dot pending"></b>待审批</span
            >
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
          :total="1000"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "RegionalManager",
  data() {
    return {
      listLoading: false, //加载数据中
      user: null, // 搜索姓名
      product_name: null, // 搜索省
      page: 1,
      row: 10,
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      tableData: [
        {
          id: 1,
          apply_name: "张三",
          apply_time: "2019-10-02",
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          reason: "就是要拒绝",
          product_name: "臣康安",
          status: 0
        },
        {
          id: 12,
          apply_name: "张三",
          apply_time: "2019-10-02",
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          reason: "就是要拒绝",
          product_name: "臣康安",
          status: 1
        },
        {
          id: 15,
          apply_name: "张三",
          apply_time: "2019-10-02",
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          reason: "就是要拒绝",
          product_name: "臣康安",
          status: 2
        },
        {
          id: 5,
          apply_name: "张三",
          apply_time: "2019-10-02",
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          reason: "就是要拒绝",
          product_name: "臣康安",
          status: 1
        },
        {
          id: 18,
          apply_name: "张三",
          apply_time: "2019-10-02",
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          reason: "就是要拒绝",
          product_name: "臣康安",
          status: 1
        },
        {
          id: 165,
          apply_name: "张三",
          apply_time: "2019-10-02",
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          reason: "就是要拒绝",
          product_name: "臣康安",
          status: 1
        },
        {
          id: 189,
          apply_name: "张三",
          apply_time: "2019-10-02",
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          reason: "就是要拒绝",
          product_name: "臣康安",
          status: 1
        },
        {
          id: 156,
          apply_name: "张三",
          apply_time: "2019-10-02",
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          reason: "就是要拒绝",
          product_name: "臣康安",
          status: 1
        },
        {
          id: 651,
          apply_name: "张三",
          apply_time: "2019-10-02",
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          reason: "就是要拒绝",
          product_name: "臣康安",
          status: 1
        },
        {
          id: 761,
          apply_name: "张三",
          apply_time: "2019-10-02",
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          reason: "就是要拒绝",
          product_name: "臣康安",
          status: 1
        },
        {
          id: 1756,
          apply_name: "张三",
          apply_time: "2019-10-02",
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          reason: "就是要拒绝",
          product_name: "臣康安",
          status: 1
        }
      ]
    };
  },
  mounted() {},
  methods: {
    // 获取列表数据
    getListData() {
      let params = {
        page: this.page,
        row: this.row
      };
      console.log(params);
      // this.listLoading = true;
    },
    // 搜索
    search() {
      if (this.user == null && this.product_name == null) {
        this.$message({
          message: "请输入或选择搜索内容",
          type: "error"
        });
        return false;
      }
      console.log(this.user, this.product_name);
    },
    // 重置搜索内容
    resetSearch() {
      this.user = null;
      this.province = null;
      this.city = null;
    },
    // 点击分页当前页数
    currentChange(val) {
      this.page = val;
      this.getListData();
      console.log(val);
    },
    // 切换每页条数
    sizeChange(val) {
      this.row = val;
      console.log(val);
    }
  }
};
</script>
<style>
/*.main_list .el-table .cell{
    white-space: normal;
} */
</style>
