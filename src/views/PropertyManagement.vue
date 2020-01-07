<template>
  <div class="RegionalManager">
    <!-- 面包屑 -->
    <span class="breadcrumb">权限管理</span>
    <!-- 列表 -->
    <div class="main_list">
      <div class="toolbar">
        <el-button size="small" plain icon="el-icon-plus" @click="handleCreate"
          >新增用户</el-button
        >
      </div>
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中..."
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column
          prop="product_name"
          label="用户ID"
          width="300"
        ></el-table-column>
        <el-table-column
          prop="visit_goal"
          label="用户名"
          min-width="200"
        ></el-table-column>
        <el-table-column
          prop="visit_goal"
          label="工作角色"
          min-width="200"
        ></el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template scope="scope">
            <el-tooltip
              class="item"
              :enterable="false"
              effect="dark"
              content="授权"
              placement="top"
            >
              <i
                class="el-icon-circle-check"
                @click="handleDetail(scope.$index, scope.row)"
              ></i>
            </el-tooltip>
            <template v-if="scope.row.status == 1">
              <el-tooltip
                class="item"
                :enterable="false"
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
                v-if="scope.row.status == 1"
                class="item"
                :enterable="false"
                effect="dark"
                content="注销"
                placement="top"
              >
                <i
                  class="el-icon-delete"
                  @click="handleDelete(scope.$index, scope.row)"
                ></i>
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
    <!-- 详情弹窗 -->
    <el-dialog
      class="dialog_wrap property_wrap"
      :visible.sync="detailVisble"
      :append-to-body="true"
      width="30%"
    >
      <div class="dialog_title" slot="title">
        <span class="line"></span>用户授权
      </div>
      <el-checkbox-group v-model="checkList">
        <el-checkbox label="复选框 A"></el-checkbox>
        <el-checkbox label="复选框 B"></el-checkbox>
        <el-checkbox label="复选框 C"></el-checkbox>
        <el-checkbox label="禁用"></el-checkbox>
        <el-checkbox label="选中且禁用"></el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="editProperty">
          <span v-show="empowerLoading" class="submit_loading">
            <i class="el-icon-loading"></i>数据提交中...
          </span>
          <span v-show="!empowerLoading">确 定</span>
        </el-button>
        <el-button size="small" type="info" plain @click="detailVisble = false"
          >取 消</el-button
        >
      </div>
    </el-dialog>
    <!-- 新增/编辑用户 -->
    <el-dialog
      class="dialog_wrap"
      :visible.sync="addVisble"
      :append-to-body="true"
    >
      <div class="dialog_title" slot="title">
        <span class="line"></span>添加用户
      </div>
      <el-form
        :model="addAndEditData"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="用户名：" prop="product_id" class="width_full">
          <el-input v-model="addAndEditData.product_id"></el-input>
        </el-form-item>
        <el-form-item label="工作角色：" prop="visit_goal">
          <el-input v-model="addAndEditData.visit_goal"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="visit_goal">
          <el-input
            type="password"
            v-model="addAndEditData.visit_goal"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addUser('ruleForm')">
          <span v-show="submitLoading" class="submit_loading">
            <i class="el-icon-loading"></i>数据提交中...
          </span>
          <span v-show="!submitLoading">确 定</span>
        </el-button>
        <el-button size="small" type="info" plain @click="addVisble = false"
          >取 消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "PropertyManagement",
  data() {
    return {
      listLoading: false, //加载数据中
      addVisble: false, //新增
      detailVisble: false, //详情弹窗
      isEdit: false, // 是否是修改数据
      submitLoading: false, //新增修改数据加载
      empowerLoading: false, //授权提交数据加载
      singleData: {}, //单条数据
      checkList: ["选中且禁用", "复选框 A"],
      addAndEditData: {
        product_id: null,
        visit_goal: null
      }, //新增数据
      page: 1,
      row: 10,
      total: 0,
      list: [],
      product: [],
      rules: {
        visit_goal: [{ required: true, message: "请输入权限" }],
        product_id: [{ required: true, message: "请选择产品名" }]
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getListData();
      // this.getproductList();
    });
  },
  methods: {
    // 获取列表数据
    getListData() {
      this.listLoading = true;
      let params = {
        page: this.page,
        row: this.row
      };
      this.$api
        .userInfo()
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.total = res.visit_goal_count;
            this.list = res.visit_goal_list;
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

    // 获取产品
    getproductList() {
      this.$api
        .productList()
        .then(res => {
          if (res.code == 200) {
            res.product_list.forEach(item => {
              if (item.status == 1) {
                this.product.push({
                  id: item.id,
                  product_name: item.product_name
                });
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 查看详情
    handleDetail(index, row) {
      this.detailVisble = true;
      this.singleData = row;
    },

    // 新增
    handleCreate() {
      this.isEdit = false;
      this.addVisble = true;
      this.addAndEditData.product_id = null;
      this.addAndEditData.visit_goal = null;
    },

    // 编辑
    handleEdit(index, row) {
      this.isEdit = true;
      this.addVisble = true;
      this.visit_goal_id = row.id;
      this.addAndEditData = JSON.parse(JSON.stringify(row));
    },

    // 删除
    handleDelete(index, row) {
      this.$messageBox
        .confirm("确认注销该条记录吗?", "提示", {
          type: "warning"
        })
        .then(() => {
          let params = { visit_goal_id: row.id };
          this.delUser(params);
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

    // 授权
    editProperty() {
      let params = this.checkList;
      this.empowerLoading = true;
      console.log(params);
      return false;
      this.$api
        .createUser(params)
        .then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.page = 1;
            this.getListData();
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
          this.addVisble = false;
          this.empowerLoading = false;
        })
        .catch(err => {
          this.addVisble = false;
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
        .delUser(params)
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
      let params = {
        product_id: this.addAndEditData.product_id,
        visit_goal: this.addAndEditData.visit_goal
      };
      this.submitLoading = true;
      this.$api
        .createUser(params)
        .then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.addAndEditData.product_id = null;
            this.addAndEditData.visit_goal = null;
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
        })
        .catch(err => {
          console.log(err);
        });
    },

    //提交修改用户数据
    updateUser() {
      let params = {
        visit_goal_id: this.visit_goal_id,
        visit_goal: this.addAndEditData.visit_goal
      };
      this.submitLoading = true;
      this.$api
        .updateUser(params)
        .then(res => {
          if (res.code == 200) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.isEdit = false;
            this.addAndEditData.product_id = null;
            this.addAndEditData.visit_goal = null;
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
