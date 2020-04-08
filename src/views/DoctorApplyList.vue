<template>
  <div>
    <!-- 面包屑 -->
    <span class="breadcrumb">医生申请</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item">
          <span>代表姓名：</span>
          <el-input size="small" v-model="deputyName" placeholder="请输入医药代表姓名"></el-input>
        </div>
      </el-col>
      <el-col :span="4" class="main_header_btns">
        <el-button size="small" type="primary" @click="search">搜索</el-button>
        <el-button size="small" type="primary" @click="resetSearch" plain>重置</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <div class="main_list">
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column label="序号" type="index" min-width="50">
          <template slot-scope="scope">
            <span>{{ (page - 1) * row + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="代表姓名" min-width="120"></el-table-column>
        <el-table-column prop="doctor_name" label="医生姓名" min-width="120"></el-table-column>
        <el-table-column prop="sex" label="性别" min-width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.sex == 2">女</span>
            <span v-if="scope.row.sex == 1">男</span>
          </template>
        </el-table-column>
        <el-table-column prop="hospital_name" label="所属医院" min-width="260"></el-table-column>
        <el-table-column prop="section_name" label="科室" min-width="200"></el-table-column>
        <el-table-column prop="sex" label="状态" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.doctor_status == 2">离职</span>
            <span v-if="scope.row.doctor_status == 1">在职</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <i class="el-icon-view" @click="handleDetail(scope.$index, scope.row)"></i>
            </el-tooltip>
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
          :page-sizes="[10, 20, 30, 40]"
          :current-page.sync="page"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- 详情弹窗 -->
    <el-dialog class="dialog_wrap" :visible.sync="detailVisble" :append-to-body="true" width="30%">
      <div class="dialog_title" slot="title"><span class="line"></span>申请信息</div>
      <ul class="dialog_detail">
        <li>
          <label>代表姓名：</label>
          {{ singleData.user_name }}
        </li>
        <li>
          <label>医生姓名：</label>
          {{ singleData.doctor_name }}
        </li>
        <li>
          <label>性别：</label>
          {{ setSex(singleData.sex) }}
        </li>
        <li>
          <label>所属医院：</label>
          {{ singleData.hospital_name }}
        </li>
        <li>
          <label>科室：</label>
          {{ singleData.section_name }}
        </li>
        <li>
          <label>状态：</label>
          {{ setStatus(singleData.doctor_status) }}
        </li>
        <li>
          <label>职务：</label>
          {{ setDoctorDuty(singleData.duty) }}
        </li>
        <li>
          <label>学历：</label>
          {{ setEducation(singleData.educate) }}
        </li>
        <li>
          <label>专业人士：</label>
          {{ setDoctorType(singleData.educate) }}
        </li>
        <li>
          <label>学术头衔：</label>
          {{ setAcademicTitle(singleData.academic_title) }}
        </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="detailVisble = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "DoctorApplyList",
  data() {
    return {
      listLoading: false, //加载数据中
      detailVisble: false, //详情弹窗
      singleData: {}, //单条数据
      deputyName: null, // 搜索姓名
      productId: null, //搜索产品ID
      isSearch: false, //是否是搜索请求
      page: 1,
      row: 10,
      total: 0,
      list: [],
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    // 获取列表数据
    getListData() {
      this.listLoading = true;
      let params = null;
      if (this.isSearch) {
        params = {
          user_name: this.deputyName,
          page: this.page,
          row: this.row,
        };
      } else {
        params = {
          page: this.page,
          row: this.row,
        };
      }
      this.$api
        .doctorApplyrRecord(params)
        .then((res) => {
          if (res.code == 200) {
            this.total = res.doctor_list_count;
            this.list = res.doctor_list;
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

    // 搜索
    search() {
      if (this.deputyName == null) {
        this.$message({
          message: "请输入代表姓名",
          type: "error",
        });
        return false;
      }
      this.isSearch = true;
      this.page = 1;
      this.getListData();
    },

    // 重置搜索内容
    resetSearch() {
      this.deputyName = null;
      this.isSearch = false;
      this.getListData();
    },

    // 查看详情
    handleDetail(index, row) {
      this.detailVisble = true;
      this.singleData = row;
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
    //获取医生职位
    setDoctorDuty(id) {
      switch (id) {
        case 1:
          return "病区副护士长";
        case 2:
          return "病区护士长";
        case 3:
          return "采购";
        case 4:
          return "处长";
        case 5:
          return "床位医生";
        case 6:
          return "带组医生";
        case 7:
          return "负责人";
        case 8:
          return "副处长";
        case 9:
          return "副局长";
        case 10:
          return "副科长";
        case 11:
          return "副书记";
        case 12:
          return "副所长";
        case 13:
          return "副院长";
        case 14:
          return "副站长";
        case 15:
          return "副主任";
        case 16:
          return "进修护士";
        case 17:
          return "进修医生";
        case 18:
          return "局长";
        case 19:
          return "科副护士长";
        case 20:
          return "科护士长";
        case 21:
          return "科长";
        case 22:
          return "库管";
        case 23:
          return "秘书";
        case 24:
          return "普通职员";
        case 25:
          return "书记";
        case 26:
          return "所长";
        case 27:
          return "院长";
        case 28:
          return "院长助理";
        case 29:
          return "站长";
        case 30:
          return "主管";
        case 31:
          return "主任";
        case 32:
          return "主任助理";
        case 33:
          return "助教";
        case 34:
          return "助理";
        case 35:
          return "住院部医生";
        case 36:
          return "总住院医师";
        case 37:
          return "组长";
        case 38:
          return "未知";
        default:
          break;
      }
    },

    //获取性别
    setSex(type) {
      switch (type) {
        case 1:
          return "男";
          break;
        case 2:
          return "女";
          break;
        case 3:
          return "保密";
          break;
        default:
          break;
      }
    },

    //获取医生状态
    setStatus(type) {
      switch (type) {
        case 1:
          return "在职";
          break;
        case 2:
          return "离职";
          break;
        default:
          break;
      }
    },
    //医生学历
    setEducation(type) {
      switch (type) {
        case 1:
          return "学士/大学本科";
          break;
        case 2:
          return "大专";
          break;
        case 3:
          return "博士";
          break;
        case 4:
          return "初中级以下";
          break;
        case 5:
          return "硕士";
          break;
        case 6:
          return "高中";
          break;
        case 7:
          return "中专";
          break;
        case 8:
          return "其他";
          break;
        default:
          break;
      }
    },
    //专业人士分类
    setDoctorType(type) {
      switch (type) {
        case 1:
          return "护师（士）";
          break;
        case 2:
          return "技师（士）";
          break;
        case 3:
          return "检验师（士）";
          break;
        case 4:
          return "其他卫生技术人员";
          break;
        case 5:
          return "药剂师（士）";
          break;
        case 6:
          return "执业医师";
          break;
        default:
          break;
      }
    },

    //医生头衔
    setAcademicTitle(type) {
      switch (type) {
        case 1:
          return "副教授";
          break;
        case 2:
          return "副研究员";
          break;
        case 3:
          return "讲师";
          break;
        case 4:
          return "教授";
          break;
        case 5:
          return "无学术职称";
          break;
        case 6:
          return "研究院";
          break;
        case 7:
          return "助教";
          break;
        case 8:
          return "未知";
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style scoped>
.dialog_detail li {
  overflow: hidden;
}
.dialog_detail li label {
  width: 120px;
  float: left;
}
.dialog_detail li p {
  padding-left: 130px;
  margin-top: 0;
  margin-bottom: 0;
}
.dialog_detail .img {
  width: 200px;
}
</style>
