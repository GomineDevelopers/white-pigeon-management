<template>
  <div class="RegionalManager">
    <!-- 面包屑 -->
    <span class="breadcrumb">奖金计算</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item upload_div">
          <span>上传流向：</span>
          <el-upload
            class="upload-demo"
            ref="upload"
            :limit="1"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">
              上传到服务器
            </el-button>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </div>
        <!-- <el-button size="small" plain icon="el-icon-bottom" @click="downLoad">下载</el-button> -->
      </el-col>
      <el-col :span="4" class="main_header_btns">
        <el-button size="small" type="primary" @click="matching">匹配</el-button>
        <el-button size="small" type="primary" @click="resetSearch" plain>重置</el-button>
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
        <el-table-column prop="name" label="姓名" min-width="140"></el-table-column>
        <el-table-column prop="visit" label="拜访" min-width="140">
          <template scope="scope">
            <span class="detail_link" @click="goDetail(1, scope.row)">{{ scope.row.visit }}</span
            >条
          </template>
        </el-table-column>
        <el-table-column prop="metting" label="会议" min-width="140">
          <template scope="scope">
            <span class="detail_link" @click="goDetail(2, scope.row)">{{ scope.row.metting }}</span
            >条
          </template>
        </el-table-column>
        <el-table-column prop="theoryBonus" label="理论奖金" min-width="140"></el-table-column>
        <el-table-column prop="behaviorBonus" label="行为奖金" min-width="140"></el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template scope="scope">
            <el-button
              v-if="scope.row.status == 1"
              size="small"
              type="primary"
              @click="handleList(scope.$index, scope.row)"
              >核销</el-button
            >
            <span v-else>已核销</span>
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
  name: "representative",
  data() {
    return {
      fileList: [
        // {
        //   name: "food.jpeg",
        //   url:
        //     "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        // }
      ],
      listLoading: false, //加载数据中
      page: 1,
      row: 10,
      total: 0,
      list: [
        {
          name: "岩梅彬",
          visit: "67",
          metting: "12",
          theoryBonus: "2354.12",
          behaviorBonus: "3785.12",
          status: 1
        },
        {
          name: "张琳",
          visit: "32",
          metting: "19",
          theoryBonus: "2354.12",
          behaviorBonus: "3785.12",
          status: 1
        },
        {
          name: "李杰",
          visit: "50",
          metting: "5",
          theoryBonus: "2354.12",
          behaviorBonus: "3785.12",
          status: 1
        },
        {
          name: "严冰",
          visit: "26",
          metting: "0",
          theoryBonus: "2354.12",
          behaviorBonus: "3785.12",
          status: 0
        },
        {
          name: "郑丽然",
          visit: "42",
          metting: "3",
          theoryBonus: "2354.12",
          behaviorBonus: "3785.12",
          status: 1
        }
      ]
    };
  },
  mounted() {},
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },

    // 获取列表数据
    getListData() {},
    dateFormatter(row) {
      if (row.id_effect_time != null) {
        return row.id_effect_time.split(" ")[0];
      } else {
        return row.id_effect_time;
      }
    },

    // 匹配
    matching() {
      console.log("匹配");
    },

    // 重置搜索内容
    resetSearch() {},

    // 核销
    handleList(index, row) {
      console.log(row);
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
}
.detail_link {
  cursor: pointer;
  color: #1890ff;
  text-decoration: underline;
}
</style>
