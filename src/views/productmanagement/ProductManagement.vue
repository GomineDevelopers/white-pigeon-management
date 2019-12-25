<template>
  <div>
    <!-- 面包屑 -->
    <span class="breadcrumb">产品管理</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item">
          <span>产品名：</span>
          <el-select size="small" v-model="productName" placeholder="请选择">
            <el-option-group
              v-for="group in product"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="(item, index) in group.options"
                :label="item.product_name"
                :value="item.product_name"
                :key="index"
              >
                <span :class="{ logout: item.status != 1 }">{{
                  item.product_name
                }}</span>
              </el-option>
            </el-option-group>
          </el-select>
        </div>
        <div class="main_header_item">
          <span>通用名：</span>
          <el-input
            size="small"
            v-model="commonName"
            placeholder="请输入"
          ></el-input>
        </div>
        <div class="main_header_item">
          <span>状态：</span>
          <el-select
            size="small"
            v-model="searchStatus"
            placeholder="请选择"
            style="width: 120px"
          >
            <el-option label="正常" value="1"> </el-option>
            <el-option label="注销" value="2"> </el-option>
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
          >新增产品</el-button
        >
        <el-button size="small" plain icon="el-icon-bottom" @click="downLoad"
          >下载</el-button
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
          prop="generic_name"
          label="通用名"
          min-width="160"
        ></el-table-column>
        <el-table-column
          prop="dosage_form"
          label="剂型"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="specification"
          label="规格"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="package"
          label="包装"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="factory"
          label="厂家"
          min-width="280"
        ></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template scope="scope">
            <span v-if="scope.row.status == 1">正常</span>
            <span v-else class="logout">注销</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="查看"
              placement="top"
            >
              <i
                class="el-icon-view"
                @click="handleDetail(scope.$index, scope.row)"
              ></i>
            </el-tooltip>
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
        >
        </el-pagination>
      </div>
    </div>
    <!-- 详情弹窗 -->
    <el-dialog
      class="dialog_wrap dialog_wrap_detail"
      :visible.sync="detailVisble"
      :append-to-body="true"
      width="30%"
    >
      <div class="dialog_title" slot="title">
        <span class="line"></span>产品信息
      </div>
      <ul class="dialog_detail">
        <li><label>产品名：</label>{{ singleData.product_name }}</li>
        <li><label>通用名：</label>{{ singleData.generic_name }}</li>
        <li><label>剂型：</label>{{ singleData.dosage_form }}</li>
        <li><label>规格：</label>{{ singleData.specification }}</li>
        <li><label>包装：</label>{{ singleData.package }}</li>
        <li><label>厂家：</label>{{ singleData.factory }}</li>
        <li><label>竞品名：</label>{{ singleData.compete_name }}</li>
        <li><label>所属省份：</label>{{ singleData.province_name }}</li>
        <li>
          <label>主要适应症：</label>
          <p>{{ singleData.indications }}</p>
        </li>
        <li><label>中标价：</label>{{ singleData.bidding_price }}</li>
        <li><label>生产公司：</label>{{ singleData.product_company }}</li>
        <li>
          <label>产品公司盖章：</label>
          <el-image
            class="img"
            :src="singleData.product_company_stamp"
            :preview-src-list="[singleData.product_company_stamp]"
            v-if="singleData.product_company_stamp"
          >
          </el-image>
        </li>
        <li>
          <label>产品图片：</label>
          <el-image
            class="img"
            :src="singleData.product_image"
            :preview-src-list="[singleData.product_image]"
            v-if="singleData.product_image"
          >
          </el-image>
        </li>
        <li>
          <label>状态：</label>
          <span v-if="singleData.status">正常</span>
          <span v-else class="logout">已注销</span>
        </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="detailVisble = false"
          >确 定</el-button
        >
        <el-button size="small" type="info" plain @click="detailVisble = false"
          >取 消</el-button
        >
      </div>
    </el-dialog>
    <!-- 新增 -->
    <el-dialog
      class="dialog_wrap dialog_wrap_detail"
      :visible.sync="addVisble"
      :append-to-body="true"
    >
      <div class="dialog_title" slot="title">
        <span class="line"></span>产品信息
      </div>
      <el-form
        v-if="addVisble"
        :model="addData"
        :rules="rules"
        ref="ruleForm"
        label-width="110px"
      >
        <el-form-item label="产品名：" prop="product_name">
          <el-input
            size="small"
            v-model="addData.product_name"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="通用名：" prop="generic_name">
          <el-input
            size="small"
            v-model="addData.generic_name"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="剂型：" prop="dosage_form">
          <el-input
            size="small"
            v-model="addData.dosage_form"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="规格：" prop="specification">
          <el-input
            size="small"
            v-model="addData.specification"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="包装：" prop="package">
          <el-input
            size="small"
            v-model="addData.package"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="厂家：" prop="factory">
          <el-input
            size="small"
            v-model="addData.factory"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="竞品名：" prop="compete_name">
          <el-input
            size="small"
            v-model="addData.compete_name"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属省份：" prop="province_code">
          <el-select
            size="small"
            v-model="addData.province_code"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in provinceList"
              :label="item.name"
              :value="item.code"
              :key="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主要适应症：" prop="indications">
          <el-input
            type="textarea"
            size="small"
            v-model="addData.indications"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="中标价：" prop="bidding_price">
          <el-input
            size="small"
            v-model="addData.bidding_price"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="生产公司：" prop="product_company">
          <el-input
            size="small"
            v-model="addData.product_company"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品公司盖章：" prop="product_company_stamp">
          <el-input
            size="small"
            v-model="addData.product_company_stamp"
            placeholder="请输入"
          ></el-input>
        </el-form-item>
        <el-form-item label="产品图片：" prop="product_image">
          <el-input
            size="small"
            v-model="addData.product_image"
            placeholder="请输入"
          ></el-input>
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
  name: "ProductManagement",
  data() {
    return {
      listLoading: false, //加载数据中
      submitLoading: false, //提交数据加载中
      addVisble: false, //新增
      detailVisble: false, //详情弹窗
      singleData: {}, //单条数据
      commonName: null, // 搜索通用名
      productName: null, // 搜索产品名
      searchStatus: null, //搜索状态
      isSearch: false, //是否是搜索请求
      isEdit: false,
      addData: {}, //新增数据
      page: 1,
      row: 10,
      total: 0,
      product: [
        {
          label: "有效产品",
          options: []
        },
        {
          label: "已注销产品",
          options: []
        }
      ],
      list: [],
      rules: {
        product_name: { required: true, message: "请输入产品名" },
        generic_name: { required: true, message: "请输入通用名" },
        dosage_form: { required: true, message: "请输入剂型" },
        specification: { required: true, message: "请输入规格" },
        package: { required: true, message: "请输入包装" },
        factory: { required: true, message: "请输入厂家" }
      },
      provinceList: [
        { code: 110000, name: "北京市" },
        { code: 120000, name: "天津市" },
        { code: 130000, name: "河北省" },
        { code: 140000, name: "山西省" },
        { code: 150000, name: "内蒙古自治区" },
        { code: 210000, name: "辽宁省" },
        { code: 220000, name: "吉林省" },
        { code: 230000, name: "黑龙江省" },
        { code: 310000, name: "上海市" },
        { code: 320000, name: "江苏省" },
        { code: 330000, name: "浙江省" },
        { code: 340000, name: "安徽省" },
        { code: 350000, name: "福建省" },
        { code: 360000, name: "江西省" },
        { code: 370000, name: "山东省" },
        { code: 410000, name: "河南省" },
        { code: 420000, name: "湖北省" },
        { code: 430000, name: "湖南省" },
        { code: 440000, name: "广东省" },
        { code: 450000, name: "广西壮族自治区" },
        { code: 460000, name: "海南省" },
        { code: 500000, name: "重庆市" },
        { code: 510000, name: "四川省" },
        { code: 520000, name: "贵州省" },
        { code: 530000, name: "云南省" },
        { code: 540000, name: "西藏自治区" },
        { code: 610000, name: "陕西省" },
        { code: 620000, name: "甘肃省" },
        { code: 630000, name: "青海省" },
        { code: 640000, name: "宁夏回族自治区" },
        { code: 650000, name: "新疆维吾尔自治区" },
        { code: 710000, name: "台湾省" },
        { code: 810000, name: "香港特别行政区" },
        { code: 820000, name: "澳门特别行政区" }
      ]
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
      let params = null;
      if (this.isSearch) {
        params = {
          product_name: this.productName,
          generic_name: this.commonName,
          status: this.searchStatus,
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
        .productManagerList(params)
        .then(res => {
          if (res.code == 200) {
            this.total = res.product_manager_list_count;
            this.list = res.product_manager_list;
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
                this.product[0].options.push({
                  id: item.id,
                  product_name: item.product_name,
                  status: item.status
                });
              } else {
                this.product[1].options.push({
                  id: item.id,
                  product_name: item.product_name,
                  status: item.status
                });
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 搜索
    search() {
      if (
        this.commonName == null &&
        this.productName == null &&
        this.searchStatus == null
      ) {
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
      this.commonName = null;
      this.productName = null;
      this.searchStatus = null;
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
          console.log(row.id);
          let para = { id: row.id };
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

    // 编辑医院
    handleEdit(index, row) {
      this.isEdit = true;
      this.addVisble = true;
      this.addData = JSON.parse(JSON.stringify(row));
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
          this.isEdit ? this.updateProduct() : this.createProduct();
        })
        .catch(() => {
          console.log("取消");
        });
    },

    // 新增数据
    createProduct() {
      let params = this.addData;
      this.submitLoading = true;
      console.log(params);
      return;
      this.$api
        .productAdd(params)
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

    // 修改数据
    updateDoctor() {
      let params = {
        product_id: this.addData.id,
        product_name: this.addData.product_name,
        generic_name: this.addData.generic_name,
        dosage_form: this.addData.dosage_form,
        specification: this.addData.specification,
        package: this.addData.package,
        factory: this.addData.factory
      };
      console.log(params);
      return;
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
<style>
.dialog_wrap_detail .el-dialog {
  max-height: 80%;
}
.dialog_wrap_detail .el-dialog__body {
  max-height: 600px;
  overflow-y: auto;
}
</style>
<style scoped>
.dialog_detail li {
  overflow: hidden;
}
.dialog_detail label {
  width: 110px;
  float: left;
}
.dialog_detail p {
  margin: 0;
  padding-left: 120px;
}
.dialog_detail .img {
  width: 100px;
  height: 100px;
}
</style>
