<template>
  <div class="RegionalManager">
    <!-- 面包屑 -->
    <span class="breadcrumb">流向目录</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item">
          <span>日期：</span>
          <el-date-picker v-model="date" format="yyyy-MM" type="month" placeholder="选择月">
          </el-date-picker>
        </div>
        <div class="main_header_item">
          <span>月：</span>
          <el-select size="small" v-model="monthValue" placeholder="请选择">
            <el-option
              v-for="(item, index) in monthList"
              :label="item.name"
              :value="item.label"
              :key="index"
            ></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="4" class="main_header_btns">
        <el-button size="small" type="success" @click="search">搜索</el-button>
        <el-button size="small" type="primary" @click="resetSearch" plain>重置</el-button>
      </el-col>
    </el-row>
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item upload_div">
          <span>上传流向：</span>
          <el-upload
            class="upload-demo"
            ref="upload"
            :limit="1"
            action=""
            name="file"
            :file-list="fileList"
            :auto-upload="false"
            :http-request="uploadSectionFile"
            accept=".xls,.xlsx"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button
              style="margin-left: 10px;"
              size="small"
              type="success"
              v-show="!uploadLoading"
              @click="submitUpload"
            >
              上传到服务器
            </el-button>
            <el-button
              style="margin-left: 10px;"
              size="small"
              type="info"
              v-show="uploadLoading"
              icon="el-icon-loading"
            >
              上传中...
            </el-button>
          </el-upload>
        </div>
      </el-col>
    </el-row>
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
        <el-table-column prop="year" label="年" min-width="140"></el-table-column>
        <el-table-column prop="month" label="月" min-width="140"></el-table-column>
        <el-table-column prop="type" label="日" min-width="140"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" min-width="140"></el-table-column>
        <el-table-column prop="status" label="状态" min-width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">正常</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="匹配" placement="top">
              <i class="el-icon-notebook-1" @click="handleList(scope.$index, scope.row)"></i>
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
  </div>
</template>
<script>
import { timeFormat2, monthFormat } from "../../js/public.js";
export default {
  name: "HistoryFlowDirectory",
  data() {
    return {
      uploadLoading: false,
      fileList: [],
      date: "", //选择日期
      monthValue: null, //工具月份选择
      monthList: [
        { label: "上半月", name: "上半月" },
        { label: "下半月", name: "下半月" }
      ],
      listLoading: true, //加载数据中
      page: 1,
      row: 10,
      total: 0,
      list: [],
      menuId: ""
    };
  },
  mounted() {
    console.log(this.date);
    this.$nextTick(() => {
      this.getListData();
    });
  },
  methods: {
    //上传文件到服务器
    submitUpload() {
      let list = document.getElementsByClassName("el-upload-list__item is-ready");
      if (list.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择需要上传的文件"
        });
        return;
      }
      this.uploadLoading = true;
      this.$refs.upload.submit();
    },
    //在this.$refs.upload.submit()上传前做数据处理
    uploadSectionFile(param) {
      var fileObj = param.file;
      let date = timeFormat2(new Date());
      let fileData = new FormData(); // FormData 对象
      fileData.append("file", fileObj); // 文件对象
      fileData.append("year", date.split("-")[0]); // 文件对象
      fileData.append("month", date.split("-")[1]); // 文件对象
      fileData.append("type", date.split("-")[2]); // 文件对象
      let postParams = {
        file: fileData,
        year: date.split("-")[0],
        month: date.split("-")[1],
        type: date.split("-")[2]
      };
      this.$api
        .flowsdeal(fileData)
        .then(res => {
          // console.log(res);
          this.uploadLoading = false;
          if (res.code == 200) {
            this.fileList = [];
            this.$message({
              message: "文件上传成功",
              type: "success"
            });
            this.getListData();
          }
        })
        .catch(error => {
          this.uploadLoading = false;
          console.log(error);
        });
    },

    //搜索流向目录
    search() {
      if (!this.date && !this.monthValue) {
        this.$message({
          type: "warning",
          message: "请选择完整的查询日期"
        });
        return false;
      }
      this.page = 1;
      this.getListData();
    },
    getListData() {
      this.listLoading = true;
      let params = {
        year: this.date ? monthFormat(this.date).split("-")[0] : "",
        month: this.date ? monthFormat(this.date).split("-")[1] : "",
        type: this.monthValue,
        page: this.page,
        row: this.row
      };
      // console.log(params);
      this.$api
        .menuList(params)
        .then(res => {
          if (res.code == 200) {
            this.listLoading = false;
            this.list = res.flows_list;
          }
          console.log(res);
        })
        .catch(error => {
          this.$message({
            type: "warning",
            message: "查询失败，请重试"
          });
          console.log(error);
        });
    },

    // 重置搜索内容
    resetSearch() {
      this.date = "";
      this.monthValue = "";
      this.page = 1;
      this.getListData();
    },

    // 核销
    handleList(index, row) {
      console.log(row);
      this.$router.push({ path: "/bonusplan", query: { id: row.id } });
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

    //拜访或会议详情
    goDetail(type, row) {
      console.log(type, row);
      this.$router.push({ path: "/verificationlist", query: { type: type } });
    }
  }
};
</script>
<style scoped>
.upload_div {
  display: -webkit-flex;
  display: flex;
  margin-bottom: 20px;
}
.detail_link {
  cursor: pointer;
  color: #1890ff;
  text-decoration: underline;
}
</style>
