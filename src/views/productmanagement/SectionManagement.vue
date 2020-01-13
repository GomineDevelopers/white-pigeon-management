<template>
  <div>
    <!-- 面包屑 -->
    <span class="breadcrumb">科室管理</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item">
          <span>科室名：</span>
          <el-input size="small" v-model="sectionName" placeholder="请输入"></el-input>
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
        <el-button size="small" plain icon="el-icon-plus" @click="handleCreate">新增科室</el-button>
      </div>
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column label="序号" type="index" width="150">
          <template slot-scope="scope">
            <span>{{ (page - 1) * row + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="section_name" label="科室名" min-width="200"></el-table-column>
        <el-table-column prop="create_time" label="创建日期" min-width="200"></el-table-column>
        <!-- <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
            >
              <i
                class="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)"
              ></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <i
                class="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
              ></i>
            </el-tooltip>
          </template>
        </el-table-column> -->
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
    <!-- 新增 -->
    <el-dialog class="dialog_wrap" :visible.sync="addVisble" :append-to-body="true">
      <div class="dialog_title" slot="title"><span class="line"></span>科室信息</div>
      <el-form :model="addData" :rules="rules" ref="ruleForm" label-width="140px">
        <el-form-item label="科室名：" prop="section_name">
          <el-input size="small" v-model="addData.section_name" placeholder="请输入"></el-input>
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
  name: "SectionManagement",
  data() {
    return {
      listLoading: false, //加载数据中
      submitLoading: false, //提交数据加载中
      addVisble: false, //新增/编辑
      singleData: {}, //单条数据
      sectionName: null, // 搜索科室名
      isSearch: false, //是否是搜索请求
      // isEdit: false, // 是否是修改数据
      //新增数据
      addData: {},
      page: 1,
      row: 10,
      total: 0,
      list: [], //科室列表
      rules: {
        section_name: { required: true, message: "请输入科室名" }
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getListData();
    });
  },
  methods: {
    // 获取列表数据
    getListData() {
      this.listLoading = true;
      let params = null;
      if (this.isSearch) {
        params = {
          section_name: this.sectionName,
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
        .sectionManagerList(params)
        .then(res => {
          if (res.code == 200) {
            this.total = res.section_manager_list_count;
            this.list = res.section_manager_list;
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

    // 搜索
    search() {
      if (this.sectionName == null) {
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
      this.sectionName = null;
      this.isSearch = false;
      this.page = 1;
      this.getListData();
    },
    // 删除
    // handleDelete(index, row) {
    //   this.$messageBox
    //     .confirm("确认删除该条记录吗?", "提示", {
    //       type: "warning"
    //     })
    //     .then(() => {
    //       let params = { section_id: row.id };
    //       this.$api
    //         .delSection(params)
    //         .then(res => {
    //           if (res.code == 200) {
    //             this.$message({
    //               message: "删除成功",
    //               type: "success"
    //             });
    //             this.getListData();
    //           } else {
    //             this.$message({
    //               message: res.message,
    //               type: "error"
    //             });
    //           }
    //         })
    //         .catch(err => {});
    //     })
    //     .catch(() => {
    //       console.log("取消");
    //     });
    // },

    // 新增科室
    handleCreate() {
      // this.isEdit = false;
      this.addData = {};
      this.addVisble = true;
    },

    // 编辑科室
    // handleEdit(index, row) {
    //   this.addVisble = true;
    //   this.isEdit = true;
    //   this.addData = JSON.parse(JSON.stringify(row));
    // },

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
          this.createSection();
          // this.isEdit ? this.updateSection() : this.createSection();
        })
        .catch(() => {
          console.log("取消");
        });
    },

    // 新增数据
    createSection() {
      let params = this.addData;
      this.submitLoading = true;
      this.$api
        .sectionCreate(params)
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
    }

    // 编辑数据
    // updateSection() {
    //   let params = {
    //     section_id: this.addData.id,
    //     section_name: this.addData.section_name
    //   };
    //   this.submitLoading = true;
    //   this.$api
    //     .sectionEdit(params)
    //     .then(res => {
    //       if (res.code == 200) {
    //         this.$message({
    //           message: res.message,
    //           type: "success"
    //         });
    //         this.isSearch = false;
    //         this.getListData();
    //       } else {
    //         this.$message({
    //           message: res.message,
    //           type: "error"
    //         });
    //       }
    //       this.addVisble = false;
    //       this.submitLoading = false;
    //     })
    //     .catch(err => {
    //       this.addVisble = false;
    //       this.submitLoading = false;
    //       console.log(err);
    //     });
    // }
  }
};
</script>
