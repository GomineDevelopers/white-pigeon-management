<template>
  <div>
    <!-- 面包屑 -->
    <span class="breadcrumb">产品科室</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item">
          <span>产品名：</span>
          <el-select size="small" v-model="productId" placeholder="请选择">
            <el-option
              v-for="(item, index) in product"
              :label="item.product_name"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </div>
        <div class="main_header_item">
          <span>科室名：</span>
          <el-select
            v-model="sectionId"
            filterable
            :filter-method="remoteSearchSection"
            placeholder="请选择或搜索科室"
          >
            <el-option
              v-for="(item, index) in sectionTopList"
              :label="item.section_name"
              :value="item.id"
              :key="index"
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
      <div class="toolbar">
        <el-button size="small" plain icon="el-icon-plus" @click="handleCreate"
          >新增</el-button
        >
      </div>
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column
          prop="product_name"
          label="产品名"
          min-width="200"
        ></el-table-column>
        <el-table-column
          prop="section_name"
          label="科室名"
          min-width="200"
        ></el-table-column>
        <el-table-column
          prop="create_time"
          label="创建日期"
          min-width="200"
        ></el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template scope="scope">
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
    <!-- 新增 -->
    <el-dialog
      class="dialog_wrap"
      :visible.sync="addVisble"
      :append-to-body="true"
    >
      <div class="dialog_title" slot="title">
        <span class="line"></span>科室信息
      </div>
      <el-form
        v-if="addVisble"
        :model="addData"
        :rules="rules"
        ref="ruleForm"
        label-width="140px"
      >
        <el-form-item label="产品名" prop="product_id" class="width_full">
          <el-select
            size="small"
            v-model="addData.product_id"
            placeholder="请选择产品"
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
        <el-form-item
          class="width_full"
          size="small"
          label="科室："
          prop="section_id"
        >
          <el-select
            v-model="addData.section_id"
            filterable
            :filter-method="remoteSection"
            placeholder="请选择或搜索科室"
          >
            <el-option
              v-for="(item, index) in sectionList"
              :label="item.section_name"
              :value="item.id"
              :key="index"
            ></el-option>
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
        <el-button size="small" type="info" plain @click="addVisble = false"
          >取 消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "ProductSection",
  data() {
    return {
      listLoading: false, //加载数据中
      submitLoading: false, //提交数据加载中
      addVisble: false, //新增/编辑
      singleData: {}, //单条数据
      sectionId: null, // 搜索科室ID
      productId: null, // 搜索产品Id
      isSearch: false, //是否是搜索请求
      isEdit: false, // 是否是修改数据
      //新增数据
      addData: {},
      page: 1,
      row: 10,
      total: 0,
      list: [], //科室列表
      product: [],
      sectionTopList: [], //头部搜索科室
      sectionList: [], //科室列表
      sectionSearchList: [], //科室搜索列表
      rules: {
        product_id: { required: true, message: "请选择产品" },
        section_id: { required: true, message: "请选择科室" }
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getListData();
      this.getproductList();
      this.getSectionList();
    });
  },
  methods: {
    // 获取列表数据
    getListData() {
      this.listLoading = true;
      let params = null;
      if (this.isSearch) {
        params = {
          product_id: this.productId,
          section_id: this.sectionId,
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
        .productSectionList(params)
        .then(res => {
          if (res.code == 200) {
            this.total = res.product_section_list_count;
            this.list = res.product_section_list;
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
            this.product = res.product_list.map(item => {
              return { id: item.id, product_name: item.product_name };
            });
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
            this.sectionSearchList = res.section_list;
            this.sectionTopList = res.section_list;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 搜索
    search() {
      if (this.productId == null && this.sectionId == null) {
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
      this.productId = null;
      this.sectionId = null;
      this.isSearch = false;
      this.page = 1;
      this.getListData();
    },

    // 删除
    handleDelete(index, row) {
      this.$messageBox
        .confirm("此操作不可恢复，确认删除该条记录吗?", "提示", {
          type: "warning"
        })
        .then(() => {
          let params = { product_section_id: row.id };
          this.$api
            .delProductSection(params)
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

    // 新增科室
    handleCreate() {
      this.isEdit = false;
      this.addVisble = true;
      this.clearForm();
      this.sectionList = this.sectionSearchList;
    },

    // 编辑科室
    handleEdit(index, row) {
      this.addVisble = true;
      this.isEdit = true;
      this.addData = JSON.parse(JSON.stringify(row));
      this.sectionList = this.sectionSearchList;
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

    // 头部现在搜索框
    remoteSearchSection(query) {
      this.sectionId = null;
      if (query !== "") {
        setTimeout(() => {
          this.sectionTopList = this.sectionSearchList.filter(item => {
            return item.section_name.indexOf(query) > -1;
          });
        }, 200);
      } else {
        setTimeout(() => {
          this.sectionTopList = this.sectionSearchList;
        }, 400);
      }
    },
    // 科室择框搜索
    remoteSection(query) {
      this.addData.section_id = null;
      if (query !== "") {
        setTimeout(() => {
          this.sectionList = this.sectionSearchList.filter(item => {
            return item.section_name.indexOf(query) > -1;
          });
        }, 200);
      } else {
        setTimeout(() => {
          this.sectionList = this.sectionSearchList;
        }, 400);
      }
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
          this.isEdit ? this.updateSection() : this.createSection();
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
        .createProdutSection(params)
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

    // 编辑数据
    updateSection() {
      let params = {
        product_section_id: this.addData.id,
        product_id: this.addData.product_id,
        section_id: this.addData.section_id
      };
      this.submitLoading = true;
      this.$api
        .productSectionEdit(params)
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
    },

    clearForm() {
      this.addData = {
        product_id: null,
        section_id: null
      };
    }
  }
};
</script>
