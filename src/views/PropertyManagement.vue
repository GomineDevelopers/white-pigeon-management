<template>
  <div class="RegionalManager">
    <!-- 面包屑 -->
    <span class="breadcrumb">权限管理</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item">
          <span>姓名：</span>
          <el-input size="small" v-model="searchName" placeholder="请输入"></el-input>
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
        <el-button size="small" plain icon="el-icon-plus" @click="handleCreate">新增用户</el-button>
      </div>
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中..."
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column label="序号" type="index" width="120">
          <template slot-scope="scope">
            <span>{{ (page - 1) * size + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="用户ID" width="300"></el-table-column>
        <el-table-column prop="name" label="用户名" min-width="200"></el-table-column>
        <el-table-column prop="role_name" label="工作角色" min-width="200"></el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              :enterable="false"
              effect="dark"
              content="授权"
              placement="top"
            >
              <i class="el-icon-circle-check" @click="handleDetail(scope.$index, scope.row)"></i>
            </el-tooltip>
            <template>
              <el-tooltip
                class="item"
                :enterable="false"
                effect="dark"
                content="编辑"
                placement="top"
              >
                <i class="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"></i>
              </el-tooltip>
              <el-tooltip
                class="item"
                :enterable="false"
                effect="dark"
                content="注销"
                placement="top"
              >
                <i class="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></i>
              </el-tooltip>
            </template>
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
    <!-- 授权弹窗 -->
    <el-dialog
      class="dialog_wrap property_wrap"
      :visible.sync="detailVisble"
      :append-to-body="true"
      width="30%"
    >
      <div class="dialog_title" slot="title"><span class="line"></span>用户授权</div>
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="(item, index) in rulesList" :label="item.id" :key="index">{{
          item.name
        }}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button v-show="empowerLoading" size="small" type="primary">
          <span class="submit_loading"> <i class="el-icon-loading"></i>数据提交中... </span>
        </el-button>
        <el-button v-show="!empowerLoading" size="small" type="primary" @click="editProperty">
          <span>确 定</span>
        </el-button>
        <el-button size="small" type="info" plain @click="detailVisble = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增/编辑用户 -->
    <el-dialog class="dialog_wrap" :visible.sync="addVisble" :append-to-body="true">
      <div class="dialog_title" slot="title"><span class="line"></span>添加/修改用户</div>
      <el-form
        v-if="addVisble"
        :model="addAndEditData"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="用户名：" prop="name" class="width_full">
          <el-input v-model="addAndEditData.name"></el-input>
        </el-form-item>
        <el-form-item label="工作角色：" prop="role_name">
          <el-input v-model="addAndEditData.role_name"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input type="password" v-model="addAndEditData.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addUser('ruleForm')">
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
  name: "PropertyManagement",
  data() {
    // 密码长度验证
    let checkPasswordLength = (rule, value, callback) => {
      if (this.isEdit) {
        if (!value) {
          callback();
        } else {
          const passwordLength = value.length;
          if (passwordLength < 6 || passwordLength > 20) {
            return callback(new Error("密码长度在6到20之间"));
          } else {
            callback();
          }
        }
      } else {
        if (!value) {
          return callback(new Error("请输入密码"));
        } else {
          const passwordLength = value.length;
          if (passwordLength < 6 || passwordLength > 20) {
            return callback(new Error("密码长度在6到20之间"));
          } else {
            callback();
          }
        }
      }
    };
    return {
      listLoading: false, //加载数据中
      addVisble: false, //新增
      detailVisble: false, //详情弹窗
      isEdit: false, // 是否是修改数据
      isSearch: false, //是否是搜索请求
      searchName: null, //搜索姓名
      submitLoading: false, //新增修改数据加载
      empowerLoading: false, //授权提交数据加载
      addAndEditData: {}, //新增数据
      page: 1,
      size: 10,
      total: 0,
      list: [],
      rulesId: null, //授权Id
      rulesList: [], //授权列表
      checkList: [], //授权选择数据
      rules: {
        name: { required: true, message: "请输入用户名" },
        role_name: { required: true, message: "请输入工作角色" },
        password: {
          required: true,
          validator: checkPasswordLength
        }
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getUserInfoList();
      this.getUserRulesList();
    });
  },
  methods: {
    // 获取列表数据
    getUserInfoList() {
      this.listLoading = true;
      let params = {
        name: this.searchName,
        page: this.page,
        size: this.size
      };
      this.$api
        .userInfoList(params)
        .then(res => {
          this.total = res.total;
          this.list = res.data;
          this.listLoading = false;
        })
        .catch(err => {
          this.listLoading = false;
          console.log(err);
        });
    },

    // 获取授权列表数据
    getUserRulesList() {
      this.$api
        .userRulesList()
        .then(res => {
          this.rulesList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 搜索
    search() {
      if (this.searchName == null) {
        this.$message({
          message: "请输入或选择搜索内容",
          type: "error"
        });
        return false;
      }
      this.isSearch = true;
      this.page = 1;
      this.getUserInfoList();
    },

    // 重置搜索内容
    resetSearch() {
      this.searchName = null;
      this.isSearch = false;
      this.getUserInfoList();
    },
    // 弹出授权窗口
    handleDetail(index, row) {
      this.detailVisble = true;
      this.checkList = [];
      this.rulesId = row.id;
      row.auth_data.forEach(item => {
        this.checkList.push(Number(item.id));
      });
    },

    // 新增
    handleCreate() {
      this.isEdit = false;
      this.addVisble = true;
      this.addAndEditData = {
        name: null,
        role_name: null,
        password: null
      };
    },

    // 编辑
    handleEdit(index, row) {
      this.isEdit = true;
      this.addVisble = true;
      this.addAndEditData = {
        id: row.id,
        name: row.name,
        role_name: row.role_name,
        password: null
      };
    },

    // 删除
    handleDelete(index, row) {
      this.$messageBox
        .confirm("确认注销该条记录吗?", "提示", {
          type: "warning"
        })
        .then(() => {
          let params = { id: row.id };
          this.delUser(params);
        })
        .catch(() => {
          console.log("取消");
        });
    },

    // 点击分页当前页数
    currentChange(val) {
      this.page = val;
      this.getUserInfoList();
    },

    // 切换每页条数
    sizeChange(val) {
      this.size = val;
      this.getUserInfoList();
    },

    // 授权
    editProperty() {
      let params = {
        id: this.rulesId,
        auth: this.checkList.join()
      };
      this.empowerLoading = true;
      this.$api
        .userAuthUpdate(params)
        .then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.getUserInfoList();
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
          this.detailVisble = false;
          this.empowerLoading = false;
        })
        .catch(err => {
          this.detailVisble = false;
          this.empowerLoading = false;
          console.log(err);
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 新增用户
    addUser(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isEdit ? this.updateUser() : this.createUser();
        } else {
          return false;
        }
      });
    },

    // 注销用户
    delUser(params) {
      this.$api
        .userDel(params)
        .then(res => {
          if (res.code == 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getUserInfoList();
          } else {
            this.$message({
              message: res.message,
              type: "success"
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 新增提交数据
    createUser() {
      let params = this.addAndEditData;
      this.submitLoading = true;
      this.$api
        .userCreate(params)
        .then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.isSearch = false;
            this.page = 1;
            this.getUserInfoList();
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
        })
        .catch(err => {
          console.log(err);
        });
    },

    //提交修改用户数据
    updateUser() {
      let params = {};
      if (!this.addAndEditData.password) {
        params = {
          id: this.addAndEditData.id,
          name: this.addAndEditData.name,
          role_name: this.addAndEditData.role_name
        };
      } else {
        params = {
          id: this.addAndEditData.id,
          name: this.addAndEditData.name,
          role_name: this.addAndEditData.role_name,
          password: this.addAndEditData.password
        };
      }
      this.submitLoading = true;
      this.$api
        .userUpdate(params)
        .then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.isEdit = false;
            this.getUserInfoList();
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
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style>
.property_wrap .el-checkbox {
  width: 42%;
  margin-top: 10px;
}
.property_wrap .el-checkbox__inner {
  width: 16px;
  height: 16px;
}
.property_wrap .el-checkbox__inner::after {
  left: 5px;
  height: 8px;
}
.property_wrap .el-checkbox__label,
.property_wrap .el-checkbox {
  font-size: 16px;
}
.textarea_box textarea {
  min-height: 200px !important;
}
</style>
<style scoped>
.main_list {
  margin-top: 20px;
}
</style>
