<template>
  <div>
    <!-- 面包屑 -->
    <span class="breadcrumb">医生管理</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item">
          <span>医生姓名：</span>
          <el-input size="small" v-model="doctorName" placeholder="请输入"></el-input>
        </div>
        <div class="main_header_item">
          <span>医生状态：</span>
          <el-select size="small" v-model="doctorStatus" placeholder="请选择">
            <el-option
              v-for="item in doctorStatusArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="4" class="main_header_btns">
        <el-button size="small" type="primary" @click="search">搜索</el-button>
        <el-button size="small" type="primary" @click="resetSearch" plain>重置</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <div class="main_list">
      <div class="toolbar">
        <el-button size="small" plain icon="el-icon-plus" @click="handleCreate">新增医生</el-button>
        <el-button size="small" plain icon="el-icon-bottom" @click="downLoad">下载</el-button>
      </div>
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column prop="doctor_name" label="医生名" min-width="100"></el-table-column>
        <el-table-column prop="sex" label="性别" min-width="60" :formatter="formatSex"></el-table-column>
        <el-table-column prop="hospital_name" label="医院名" min-width="260"></el-table-column>
        <el-table-column prop="section_name" label="科室" min-width="140"></el-table-column>
        <el-table-column prop="position" label="职务" width="160" :formatter="formatPost"></el-table-column>
        <el-table-column prop="doctor_status" label="医生状态" min-width="100">
          <template scope="scope">
            <span v-if="scope.row.doctor_status ==1">
              <b class="dot approved"></b>在职
            </span>
            <span v-else>
              <b class="dot refuse"></b>离职
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <i class="el-icon-view" @click="handleDetail(scope.$index, scope.row)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <i class="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <i class="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></i>
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
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- 详情弹窗 -->
    <el-dialog class="dialog_wrap" :visible.sync="detailVisble" :append-to-body="true" width="30%">
      <div class="dialog_title" slot="title">
        <span class="line"></span>医生信息
      </div>
      <ul class="dialog_detail">
        <li>
          <label>医生名：</label>
          {{singleData.doctor_name}}
        </li>
        <li>
          <label>性别：</label>
          {{formatSex(singleData)}}
        </li>
        <li>
          <label>所属医院：</label>
          {{singleData.hospital_name}}
        </li>
        <li>
          <label>科室：</label>
          {{singleData.section_name}}
        </li>
        <li>
          <label>职务：</label>
          {{ formatPost(singleData) }}
        </li>
        <li>
          <label>职务头衔：</label>
          {{formatjob(singleData.job_title)}}
        </li>
        <li>
          <label>学术头衔：</label>
          {{formatAcademic(singleData.academic_title)}}
        </li>
        <li>
          <label>学历：</label>
          {{ formatEducate(singleData.educate)}}
        </li>
        <li>
          <label>专业人士分类：</label>
          {{ formatDoctorType(singleData.doctor_type)}}
        </li>
        <li>
          <label>医生状态：</label>
          <span v-if="singleData.doctor_status == 1">在职</span>
          <span v-else class="logout">离职</span>
        </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="detailVisble = false">确 定</el-button>
        <el-button size="small" type="info" plain @click="detailVisble = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增 -->
    <el-dialog class="dialog_wrap" :visible.sync="addVisble" :append-to-body="true">
      <div class="dialog_title" slot="title">
        <span class="line"></span>医生信息
      </div>
      <el-form :model="addData" :rules="rules" ref="ruleForm" label-width="140px">
        <el-form-item label="医生名：" prop="doctor_name">
          <el-input size="small" v-model="addData.doctor_name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item class="width_full" size="small" label="性别：" prop="sex">
          <el-select v-model="addData.sex" placeholder="请选择性别">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="width_full" size="small" label="所属医院：" prop="hospital_id">
          <el-select v-model="addData.hospital_id" placeholder="请选择所属医院">
            <el-option
              v-for="(item, index) in hospitalList"
              :label="item.hospital_name"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="width_full" size="small" label="科室：" prop="section_id">
          <el-select v-model="addData.section_id" placeholder="请选择科室">
            <el-option
              v-for="(item, index) in sectionList"
              :label="item.section_name"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="width_full" size="small" label="职务：" prop="position">
          <el-select v-model="addData.position" placeholder="请选择职务">
            <el-option
              v-for="(item, index) in doctorPostList"
              :label="item.post_name"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="width_full" size="small" label="职务头衔：" prop="job_title">
          <el-select v-model="addData.job_title" placeholder="请选择职务头衔">
            <el-option
              v-for="(item, index) in jobList"
              :label="item.job_name"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="width_full" size="small" label="学术头衔：" prop="academic_title">
          <el-select v-model="addData.academic_title" placeholder="请选择学术头衔">
            <el-option
              v-for="(item, index) in academicList"
              :label="item.academic_name"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="width_full" size="small" label="学历：" prop="educate">
          <el-select v-model="addData.educate" placeholder="请选择学历">
            <el-option
              v-for="(item, index) in EducateList"
              :label="item.edu_name"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="width_full" size="small" label="专业人士分类：" prop="doctor_type">
          <el-select v-model="addData.doctor_type" placeholder="请选择专业人士分类">
            <el-option
              v-for="(item, index) in doctorTypeList"
              :label="item.doctor_type_name"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="width_full" size="small" label="医生状态：" prop="doctor_status">
          <el-select v-model="addData.doctor_status" placeholder="请选择医生状态">
            <el-option label="在职" :value="1"></el-option>
            <el-option label="离职" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addManager('ruleForm')">
          <span v-show="submitLoading" class="submit_loading">
            <i class="el-icon-loading"></i>数据提交中...
          </span>
          <span v-show="!submitLoading">确 定</span>
        </el-button>
        <el-button size="small" type="info" plain @click="addVisble = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "DoctorManagement",
  data() {
    return {
      listLoading: false, //加载数据中
      submitLoading: false, //提交数据加载中
      addVisble: false, //新增/编辑
      detailVisble: false, //详情弹窗
      singleData: {}, //单条数据
      doctorName: null, // 搜索姓名
      doctorStatus: null, // 搜索医生状态
      isSearch: false, //是否是搜索请求
      isEdit: false, // 是否是修改数据
      //新增数据
      addData: {},
      page: 1,
      row: 10,
      total: 0,
      // 医生状态
      doctorStatusArr: [
        {
          value: 1,
          label: "在职"
        },
        {
          value: 2,
          label: "离职"
        }
      ],
      // 职务头衔
      jobList: [
        { id: 1, job_name: "按摩师" },
        { id: 2, job_name: "副主任护师" },
        { id: 3, job_name: "副主任技师" },
        { id: 4, job_name: "副主任检验师" },
        { id: 5, job_name: "副主任麻醉师" },
        { id: 6, job_name: "副主任药师" },
        { id: 7, job_name: "副主任医师" },
        { id: 8, job_name: "护师" },
        { id: 9, job_name: "护士" },
        { id: 10, job_name: "技师" },
        { id: 11, job_name: "技士" },
        { id: 12, job_name: "检验师" },
        { id: 13, job_name: "麻醉师" },
        { id: 14, job_name: "美容师" },
        { id: 15, job_name: "实习医生" },
        { id: 16, job_name: "无职称" },
        { id: 17, job_name: "药师" },
        { id: 18, job_name: "药士" },
        { id: 19, job_name: "医师" },
        { id: 20, job_name: "医士" },
        { id: 21, job_name: "营养师" },
        { id: 22, job_name: "主管护师" },
        { id: 23, job_name: "主管技师" },
        { id: 24, job_name: "主管麻醉师" },
        { id: 25, job_name: "主管药师" },
        { id: 26, job_name: "主任护师" },
        { id: 27, job_name: "主任技师" },
        { id: 28, job_name: "主任检验师" },
        { id: 29, job_name: "主任麻醉师" },
        { id: 30, job_name: "主任药师" },
        { id: 31, job_name: "主任医师" },
        { id: 32, job_name: "主治医师" },
        { id: 33, job_name: "住院医师" },
        { id: 34, job_name: "未知" }
      ],
      // 学历
      EducateList: [
        { id: 1, edu_name: "学士/大学本科" },
        { id: 2, edu_name: "大专" },
        { id: 3, edu_name: "博士" },
        { id: 4, edu_name: "初中级以下" },
        { id: 5, edu_name: "硕士" },
        { id: 6, edu_name: "高中" },
        { id: 7, edu_name: "中专" },
        { id: 8, edu_name: "其他" }
      ],
      // 专业人士
      doctorTypeList: [
        { id: 1, doctor_type_name: "学士/护师（士）" },
        { id: 2, doctor_type_name: "技师（士）" },
        { id: 3, doctor_type_name: "检验师（士）" },
        { id: 4, doctor_type_name: "其他卫生技术人员" },
        { id: 5, doctor_type_name: "药剂师（士）" },
        { id: 6, doctor_type_name: "执业医师" }
      ],
      // 学术头衔
      academicList: [
        { id: 1, academic_name: "副教授" },
        { id: 2, academic_name: "副研究员" },
        { id: 3, academic_name: "讲师" },
        { id: 4, academic_name: "教授" },
        { id: 5, academic_name: "无学术职称" },
        { id: 6, academic_name: "研究院" },
        { id: 7, academic_name: "助教" },
        { id: 8, academic_name: "未知" }
      ],
      // 医生职务
      doctorPostList: [
        { id: 1, post_name: "副主任" },
        { id: 2, post_name: "带组医生" },
        { id: 3, post_name: "床位医生" },
        { id: 4, post_name: "大科主任" },
        { id: 5, post_name: "普通职员" },
        { id: 6, post_name: "病区副主任" },
        { id: 7, post_name: "科长" },
        { id: 8, post_name: "大科副主任" },
        { id: 9, post_name: "秘书" },
        { id: 10, post_name: "病区主任" },
        { id: 11, post_name: "住院部医生" },
        { id: 12, post_name: "主任" },
        { id: 13, post_name: "副院长" },
        { id: 14, post_name: "采购" },
        { id: 15, post_name: "其他" },
        { id: 16, post_name: "院长" },
        { id: 17, post_name: "主任助理" },
        { id: 18, post_name: "书记" },
        { id: 19, post_name: "未知" }
      ],
      list: [], //医生列表
      hospitalList: [], //医院列表
      sectionList: [], //科室列表
      rules: {
        doctor_name: { required: true, message: "请输入医生名" },
        sex: { required: true, message: "请选择性别" },
        hospital_id: { required: true, message: "请选择所属医院" },
        section_id: { required: true, message: "请选择科室" },
        position: { required: true, message: "请选择职务" },
        job_title: { required: true, message: "请选择职务头衔" },
        academic_title: { required: true, message: "请选择学术头衔" },
        educate: { required: true, message: "请选择学历" },
        doctor_type: { required: true, message: "请选择专业人士分类" },
        doctor_status: { required: true, message: "请选择医生状态" }
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getListData();
      this.gethospitalList();
      this.getSectionList();
    });
  },
  methods: {
    //性别显示转换
    formatSex(row) {
      return row.sex == 1 ? "男" : "女";
    },

    // 医生职务头衔转换
    formatjob(job_title) {
      switch (job_title) {
        case 1:
          return "按摩师";
        case 2:
          return "副主任护师";
        case 3:
          return "副主任技师";
        case 4:
          return "副主任检验师";
        case 5:
          return "副主任麻醉师";
        case 6:
          return "副主任药师";
        case 7:
          return "副主任医师";
        case 8:
          return "护师";
        case 9:
          return "护士";
        case 10:
          return "技师";
        case 11:
          return "技士";
        case 12:
          return "检验师";
        case 13:
          return "麻醉师";
        case 14:
          return "美容师";
        case 15:
          return "实习医生";
        case 16:
          return "无职称";
        case 17:
          return "药师";
        case 18:
          return "药士";
        case 19:
          return "医师";
        case 20:
          return "医士";
        case 21:
          return "营养师";
        case 22:
          return "主管护师";
        case 23:
          return "主管技师";
        case 24:
          return "主管麻醉师";
        case 25:
          return "主管药师";
        case 26:
          return "主任护师";
        case 27:
          return "主任技师";
        case 28:
          return "主任检验师";
        case 29:
          return "主任麻醉师";
        case 30:
          return "主任药师";
        case 31:
          return "主任医师";
        case 32:
          return "主治医师";
        case 33:
          return "住院医师";
        case 34:
          return "未知";
      }
    },

    // 学历转换
    formatEducate(educate) {
      switch (educate) {
        case 1:
          return "学士/大学本科";
        case 2:
          return "大专";
        case 3:
          return "博士";
        case 4:
          return "初中级以下";
        case 5:
          return "硕士";
        case 6:
          return "高中";
        case 7:
          return "中专";
        case 8:
          return "其他";
      }
    },

    // 专业人士
    formatDoctorType(type) {
      switch (type) {
        case 1:
          return "学士/护师（士）";
        case 2:
          return "技师（士）";
        case 3:
          return "检验师（士）";
        case 4:
          return "其他卫生技术人员";
        case 5:
          return "药剂师（士）";
        case 6:
          return "执业医师";
      }
    },

    // 医生学术头衔转换
    formatAcademic(type) {
      switch (type) {
        case 1:
          return "副教授";
        case 2:
          return "副研究员";
        case 3:
          return "讲师";
        case 4:
          return "教授";
        case 5:
          return "无学术职称";
        case 6:
          return "研究院";
        case 7:
          return "助教";
        case 8:
          return "未知";
      }
    },

    // 医生职务转换
    formatPost(row) {
      switch (row.position) {
        case 1:
          return "副主任";
        case 2:
          return "带组医生";
        case 3:
          return "床位医生";
        case 4:
          return "大科主任";
        case 5:
          return "普通职员";
        case 6:
          return "病区副主任";
        case 7:
          return "科长";
        case 8:
          return "大科副主任";
        case 9:
          return "秘书";
        case 10:
          return "病区主任";
        case 11:
          return "住院部医生";
        case 12:
          return "主任";
        case 13:
          return "副院长";
        case 14:
          return "采购";
        case 15:
          return "其他";
        case 16:
          return "院长";
        case 17:
          return "主任助理";
        case 18:
          return "书记";
        case 19:
          return "未知";
      }
    },

    // 获取列表数据
    getListData() {
      this.listLoading = true;
      let params = null;
      if (this.isSearch) {
        params = {
          doctor_name: this.doctorName,
          doctor_status: this.doctorStatus,
          page: this.page,
          row: this.row
        };
      } else {
        params = {
          page: this.page,
          row: this.row
        };
      }
      this.$api
        .doctorList(params)
        .then(res => {
          if (res.code == 200) {
            this.total = res.doctor_list_count;
            this.list = res.doctor_list;
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

    // 获取医院数据
    gethospitalList() {
      this.$api
        .hospitalList()
        .then(res => {
          if (res.code == 200) {
            this.hospitalList = res.hospital_list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取科室数据
    getSectionList() {
      this.$api
        .sectionList()
        .then(res => {
          if (res.code == 200) {
            this.sectionList = res.section_list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 搜索
    search() {
      if (this.doctorName == null && this.doctorStatus == null) {
        this.$message({
          message: "请输入或选择搜索内容",
          type: "error"
        });
        return false;
      }
      this.isSearch = true;
      this.page = 1;
      this.getListData();
    },

    // 重置搜索内容
    resetSearch() {
      this.doctorName = null;
      this.doctorStatus = null;
      this.isSearch = false;
      this.page = 1;
      this.getListData();
    },

    // 下载
    downLoad() {
      console.log("下载");
    },

    // 查看详情
    handleDetail(index, row) {
      this.detailVisble = true;
      this.singleData = row;
    },

    // 删除
    handleDelete(index, row) {
      this.$messageBox
        .confirm("确认删除该条记录吗?", "提示", {
          type: "warning"
        })
        .then(() => {
          let params = { doctor_id: row.id };
          this.$api
            .delDoctor(params)
            .then(res => {
              if (res.code == 200) {
                this.$message({
                  message: "删除成功",
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
            .catch(err => {});
        })
        .catch(() => {
          console.log("取消");
        });
    },

    // 新增医生
    handleCreate() {
      this.isEdit = false;
      this.addVisble = true;
      this.addData = {};
    },

    // 编辑医生
    handleEdit(index, row) {
      this.addVisble = true;
      this.isEdit = true;
      this.addData = row;
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

    // 新增产品
    addManager(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.submitManager();
        } else {
          return false;
        }
      });
    },
    // 提交数据
    submitManager() {
      this.$messageBox
        .confirm("请确认无误后再提交！", "提示", {
          type: "warning"
        })
        .then(() => {
          this.isEdit ? this.updateDoctor() : this.createDoctor();
        })
        .catch(() => {
          console.log("取消");
        });
    },

    // 新增数据
    createDoctor() {
      let params = this.addData;
      this.submitLoading = true;
      this.$api
        .doctorCreate(params)
        .then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.isSearch = false;
            this.page = 1;
            this.getListData();
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
          this.addVisble = false;
          this.submitLoading = false;
        })
        .catch(err => {
          this.addVisble = false;
          this.submitLoading = false;
          console.log(err);
        });
    },

    // 新增数据
    updateDoctor() {
      let params = {
        doctor_id: this.addData.id,
        doctor_name: this.addData.doctor_name,
        sex: this.addData.sex,
        hospital_id: this.addData.hospital_id,
        section_id: this.addData.section_id,
        position: this.addData.position,
        job_title: this.addData.job_title,
        academic_title: this.addData.academic_title,
        educate: this.addData.educate,
        doctor_type: this.addData.doctor_type,
        doctor_status: this.addData.doctor_status
      };
      this.submitLoading = true;
      this.$api
        .doctorEdit(params)
        .then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.isSearch = false;
            this.getListData();
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
          this.addVisble = false;
          this.submitLoading = false;
        })
        .catch(err => {
          this.addVisble = false;
          this.submitLoading = false;
          console.log(err);
        });
    }
  }
};
</script>
<style scoped>
.dialog_detail li label {
  width: 120px;
}
</style>