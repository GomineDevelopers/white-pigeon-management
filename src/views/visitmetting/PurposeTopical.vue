<template>
  <div class="RegionalManager">
    <!-- 面包屑 -->
    <span class="breadcrumb">拜访目的</span>
    <!-- 列表 -->
    <div class="main_list">
      <div class="toolbar">
        <el-button size="small" plain icon="el-icon-plus" @click="handleCreate">新增</el-button>
      </div>
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中..."
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column label="序号" type="index" width="140">
          <template slot-scope="scope">
            <span>{{ (page - 1) * row + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="product_name" label="产品名" min-width="150">
          <template slot-scope="scope">{{
            scope.row.product_name + "-" + scope.row.package
          }}</template>
        </el-table-column>
        <el-table-column prop="visit_goal" label="拜访目的" min-width="200"></el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              :enterable="false"
              effect="dark"
              content="查看"
              placement="top"
            >
              <i class="el-icon-view" @click="handleDetail(scope.$index, scope.row)"></i>
            </el-tooltip>
            <template v-if="scope.row.status == 1">
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
                v-if="scope.row.status == 1"
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
        >
        </el-pagination>
      </div>
    </div>
    <!-- 详情弹窗 -->
    <el-dialog class="dialog_wrap" :visible.sync="detailVisble" :append-to-body="true" width="30%">
      <div class="dialog_title" slot="title"><span class="line"></span>拜访目的</div>
      <ul class="dialog_detail">
        <li><label>产品名：</label>{{ singleData.product_name + "-" + singleData.package }}</li>
        <li><label>拜访目的：</label>{{ singleData.visit_goal }}</li>
        <li>
          <label>状态：</label>
          <span v-if="singleData.status == 1">正常</span>
          <span v-else class="logout">已注销</span>
        </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="detailVisble = false">确 定</el-button>
        <el-button size="small" type="info" plain @click="detailVisble = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增/编辑拜访目的 -->
    <el-dialog class="dialog_wrap" :visible.sync="addVisble" :append-to-body="true">
      <div class="dialog_title" slot="title"><span class="line"></span>拜访目的</div>
      <el-form :model="addAndEditData" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="产品名" prop="product_id" class="width_full">
          <el-select
            v-model="addAndEditData.product_id"
            :disabled="isEdit"
            placeholder="请选择产品名"
            no-data-text="无可添加产品"
          >
            <el-option
              v-for="(item, index) in product"
              :label="item.product_name"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拜访目的" prop="visit_goal">
          <el-input
            class="textarea_box"
            type="textarea"
            v-model="addAndEditData.visit_goal"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addVisit('ruleForm')">
          <span v-show="submitLoading" class="submit_loading"
            ><i class="el-icon-loading"></i>数据提交中...</span
          >
          <span v-show="!submitLoading">确 定</span>
        </el-button>
        <el-button size="small" type="info" plain @click="addVisble = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "PurposeTopical",
  data() {
    return {
      listLoading: false, //加载数据中
      addVisble: false, //新增
      detailVisble: false, //详情弹窗
      isEdit: false, // 是否是修改数据
      submitLoading: false, //新增修改数据加载
      singleData: {}, //单条数据
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
        visit_goal: [{ required: true, message: "请输入拜访目的" }],
        product_id: [{ required: true, message: "请选择产品名" }]
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getListData();
      this.getproductList();
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
        .visitTopicList(params)
        .then(res => {
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
                  product_name: item.product_name + "-" + item.package
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
          this.delVisit(params);
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

    // 新增拜访目的
    addVisit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isEdit ? this.updateVisit() : this.createVisit();
        } else {
          return false;
        }
      });
    },

    // 注销拜访目的
    delVisit(params) {
      this.$api
        .delVisit(params)
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
    createVisit() {
      let params = {
        product_id: this.addAndEditData.product_id,
        visit_goal: this.addAndEditData.visit_goal
      };
      this.submitLoading = true;
      this.$api
        .createVisit(params)
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

    //提交修改拜访目的数据
    updateVisit() {
      let params = {
        visit_goal_id: this.visit_goal_id,
        visit_goal: this.addAndEditData.visit_goal
      };
      this.submitLoading = true;
      this.$api
        .updateVisit(params)
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
.textarea_box textarea {
  min-height: 200px !important;
}
</style>
<style scoped>
.main_list {
  margin-top: 20px;
}
</style>
