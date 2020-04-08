<template>
  <div>
    <!-- 面包屑 -->
    <span class="breadcrumb">资料中心</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item">
          <span>产品名：</span>
          <el-select size="small" v-model="productId" placeholder="请选择">
            <el-option-group v-for="group in product" :key="group.label" :label="group.label">
              <el-option
                v-for="(item, index) in group.options"
                :label="item.product_name"
                :value="item.id"
                :key="index"
              >
                <span :class="{ logout: item.status != 1 }">
                  {{ item.product_name }}
                </span>
              </el-option>
            </el-option-group>
          </el-select>
        </div>
        <div class="main_header_item">
          <span>类型：</span>
          <el-select size="small" v-model="productTypeId" placeholder="请选择">
            <el-option
              v-for="item in productType"
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
        <el-button size="small" plain icon="el-icon-plus" @click="addVisble = true"
          >新增资料</el-button
        >
      </div>
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column label="序号" type="index" width="100">
          <template slot-scope="scope">
            <span>{{ (page - 1) * row + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="product_name" label="产品名" min-width="140">
          <template slot-scope="scope">{{
            scope.row.product_name + "-" + scope.row.package
          }}</template>
        </el-table-column>
        <el-table-column prop="product_data_type" label="类型" min-width="120">
          <template scope="scope">
            <span v-if="scope.row.product_data_type == 1">科室会议</span>
            <span v-if="scope.row.product_data_type == 2">代表培训</span>
            <span v-if="scope.row.product_data_type == 3">说明书</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="PDF名称" min-width="140">
          <template slot-scope="scope">
            <el-link type="primary" @click="readPDF(scope.row)">
              {{ scope.row.title }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="日期" min-width="200"></el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <i class="el-icon-view" @click="handleDetail(scope.$index, scope.row)"></i>
            </el-tooltip>
            <el-tooltip
              v-if="scope.row.status == 1"
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
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
      <div class="dialog_title" slot="title"><span class="line"></span>产品信息</div>
      <ul class="dialog_detail">
        <li>
          <label>产品名：</label>
          {{ singleData.product_name + "-" + singleData.package }}
        </li>
        <li>
          <label>类型：</label>
          <span v-if="singleData.product_data_type == 1">科室会议</span>
          <span v-if="singleData.product_data_type == 2">代表培训</span>
          <span v-if="singleData.product_data_type == 3">说明书</span>
        </li>
        <li>
          <label>上传PDF名称：</label>
          {{ singleData.title }}
        </li>
        <li>
          <label>上传PDF：</label>
          <el-link type="primary" @click="readPDF(singleData)">{{
            singleData.company_policy_name
          }}</el-link>
        </li>
        <li>
          <label>上传时间：</label>
          {{ singleData.create_time }}
        </li>
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
    <!-- 新增 -->
    <el-dialog class="dialog_wrap" :visible.sync="addVisble" :append-to-body="true">
      <div class="dialog_title" slot="title"><span class="line"></span>产品信息</div>
      <el-form :model="addData" :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item label="产品名" prop="productId" class="width_full">
          <el-select
            size="small"
            v-model="addData.productId"
            placeholder="请选择产品名"
            no-data-text="无可添加产品"
          >
            <el-option
              v-for="(item, index) in product[0].options"
              :label="item.product_name"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="productTypeId" class="width_full">
          <el-select
            size="small"
            v-model="addData.productTypeId"
            placeholder="请选择类型"
            no-data-text="无可添加类型"
          >
            <el-option
              v-for="(item, index) in productType"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传PDF名称：" prop="title">
          <el-input size="small" v-model="addData.title" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="上传PDF：" prop="pfdUrl" ref="uploadPdf">
          <el-button class="upload_btn" size="small" type="primary">
            上传PDF
            <i class="el-icon-upload el-icon--right"></i>
            <input type="file" accept=".pdf" @change="checkFile" />
          </el-button>
          <span class="upload_tips">点击上传PDF</span>
          <div class="upload_name">
            {{ addData.pfdUrl }}
            <i v-show="addData.pfdUrl" class="el-icon-circle-check"></i>
            <el-progress
              v-show="percent > 0 && percent < 100"
              :percentage="percent"
              status="success"
            ></el-progress>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="add('ruleForm')">确 定</el-button>
        <el-button size="small" type="info" plain @click="addVisble = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 预览pdf -->
    <el-dialog class="pdf_view" :visible.sync="pdfVisble" :append-to-body="true">
      <div class="dialog_title" slot="title">
        <span class="line"></span>
        {{ pdfData.title }}
      </div>
      <iframe :src="pdfData.pdfSrc"></iframe>
    </el-dialog>
  </div>
</template>
<script>
import * as qiniu from "qiniu-js";
export default {
  name: "ProductManagement",
  data() {
    return {
      listLoading: false, //加载数据中
      addVisble: false, //新增
      pdfVisble: false,
      detailVisble: false, //详情弹窗
      singleData: {}, //单条数据
      productId: null, // 搜索产品Id
      productTypeId: null, // 搜索类型Id
      isSearch: false, //是否是搜索请求
      pdfData: {}, //预览PDF
      percent: 0,
      addData: {
        productId: null,
        productTypeId: null,
        title: null,
        pfdUrl: null,
      }, //新增数据
      page: 1,
      row: 10,
      total: 0,
      product: [
        {
          label: "有效产品",
          options: [],
        },
        {
          label: "已注销产品",
          options: [],
        },
      ],
      productType: [
        {
          value: "1",
          label: "科室会议",
        },
        {
          value: "2",
          label: "代表培训",
        },
        {
          value: "3",
          label: "说明书",
        },
      ],
      list: [],
      rules: {
        productId: { required: true, message: "请选择产品" },
        productTypeId: { required: true, message: "请选择类型" },
        title: { required: true, message: "请输入PDF名称" },
        pfdUrl: { required: true, message: "请选择上传PDF" },
      },
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
          product_id: this.productId,
          product_data_type: this.productTypeId,
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
        .materialList(params)
        .then((res) => {
          if (res.code == 200) {
            this.total = res.meterialDetail_count;
            this.list = res.meterialDetail;
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

    // 获取产品
    getproductList() {
      this.$api
        .productList()
        .then((res) => {
          if (res.code == 200) {
            res.product_list.forEach((item) => {
              if (item.status == 1) {
                this.product[0].options.push({
                  id: item.id,
                  product_name: item.product_name + "-" + item.package,
                  status: item.status,
                });
              } else {
                this.product[1].options.push({
                  id: item.id,
                  product_name: item.product_name + "-" + item.package,
                  status: item.status,
                });
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 搜索
    search() {
      if (this.productId == null && this.productTypeId == null) {
        this.$message({
          message: "请选择搜索内容",
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
      this.productId = null;
      this.productTypeId = null;
      this.isSearch = false;
      this.page = 1;
      this.getListData();
    },

    // 查看详情
    handleDetail(index, row) {
      this.detailVisble = true;
      this.singleData = row;
    },

    // 预览PDF
    readPDF(row) {
      this.pdfData = {
        title: row.title,
        pdfSrc: row.company_policy_name,
      };
      this.pdfVisble = true;
    },

    // 删除
    handleDelete(index, row) {
      this.$messageBox
        .confirm("确认删除该条记录吗?", "提示", {
          type: "warning",
        })
        .then(() => {
          let params = { material_id: row.id };
          this.delMaterial(params);
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

    // 选择PDF
    checkFile(e) {
      let files = e.target.files[0];
      let errTag = this.$refs.uploadPdf.$el.childNodes[1].childNodes[3];
      if (!files.type.match("application/pdf")) {
        this.$message.error("请选择PDF格式的文件上传");
        return;
      }
      if (errTag.innerText) {
        errTag.style.display = "none";
      }
      this.addData.pfdUrl = null;
      this.getToken(files);
    },

    // 获取上去七牛云的doman和token
    getToken(file) {
      this.$api
        .getQiniuToken()
        .then((res) => {
          if (res.code === 100) {
            let domain = res.domain;
            let token = res.token;
            this.uploadToQiniuyun(file, token, domain);
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 上传文件到七牛云
    uploadToQiniuyun(file, token, domain) {
      let _this = this;
      const config = {
        useCdnDomain: true,
        region: qiniu.region.z2,
      };
      let api = `http://${domain}/`;
      let fileName = file.name;
      let putExtra = {
        mimeType: null,
      };
      const observable = qiniu.upload(file, fileName, token, putExtra, config);
      observable.subscribe({
        next(res) {
          _this.percent = Math.floor(res.total.percent);
        },
        error(err) {
          switch (err.code) {
            case 401:
              _this.$message.error("上传失败，请检查是否登录再重试");
              break;
            default:
              _this.$message.error(err.message);
              break;
          }
        },
        complete(res) {
          _this.addData.pfdUrl = `${api}${res.key}`;
        },
      });
    },

    // 新增资料
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitData();
        } else {
          return false;
        }
      });
    },

    // 删除资料
    delMaterial(params) {
      this.$api
        .delMaterial(params)
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getListData();
          } else {
            this.$message({
              message: res.message,
              type: "success",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 提交数据
    submitData() {
      let params = {
        product_id: this.addData.productId,
        product_data_type: this.addData.productTypeId,
        title: this.addData.title,
        company_policy_name: this.addData.pfdUrl,
      };
      this.$api
        .materialCreate(params)
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              message: res.message,
              type: "success",
            });
            this.addData.productId = null;
            this.addData.productTypeId = null;
            this.addData.titl = null;
            this.addData.pfdUrl = null;
            this.isSearch = false;
            this.page = 1;
            this.getListData();
          } else {
            this.$message({
              message: res.message,
              type: "error",
            });
          }
          this.addVisble = false;
        })
        .catch((err) => {
          this.addVisble = false;
        });
    },
  },
};
</script>
<style>
.pdf_view .el-dialog {
  width: 50%;
  min-width: 768px;
  max-width: 1200px;
  height: 90%;
  margin-bottom: 0 !important;
  margin-top: 1% !important;
}
.pdf_view .el-dialog__headerbtn {
  top: 10px;
}
.pdf_view .el-dialog__headerbtn .el-dialog__close {
  font-size: 32px;
}
.pdf_view .el-dialog .el-dialog__body {
  padding: 0;
  height: 100%;
}
.pdf_view iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
<style scoped>
.dialog_detail li label {
  width: 100px;
}
.upload_btn {
  position: relative;
}
.upload_btn input {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
}
.upload_tips {
  padding-left: 10px;
  color: #aaa;
}
.upload_name {
  position: relative;
}
.upload_name i {
  position: absolute;
  right: 0;
  top: 10px;
  font-size: 20px;
  color: #67c23a;
}
</style>
