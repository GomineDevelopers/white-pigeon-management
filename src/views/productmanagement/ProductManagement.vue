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
            <el-option-group v-for="group in product" :key="group.label" :label="group.label">
              <el-option
                v-for="(item, index) in group.options"
                :label="item.product_name"
                :value="item.id"
                :key="index"
              >
                <span :class="{ logout: item.status != 1 }">{{ item.product_name }}</span>
              </el-option>
            </el-option-group>
          </el-select>
        </div>
        <div class="main_header_item">
          <span>通用名：</span>
          <el-input size="small" v-model="commonName" placeholder="请输入"></el-input>
        </div>
        <div class="main_header_item">
          <span>状态：</span>
          <el-select size="small" v-model="searchStatus" placeholder="请选择" style="width: 120px">
            <el-option label="正常" value="1"></el-option>
            <el-option label="注销" value="2"></el-option>
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
        <el-button size="small" plain icon="el-icon-plus" @click="handleCreate">新增产品</el-button>
        <!-- <el-button size="small" plain icon="el-icon-bottom" @click="downLoad">下载</el-button> -->
      </div>
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column prop="id" label="产品编号" min-width="80"></el-table-column>
        <el-table-column prop="product_name" label="产品名" min-width="140">
          <template slot-scope="scope">{{scope.row.product_name+'-'+scope.row.specification}}</template>
        </el-table-column>
        <el-table-column prop="generic_name" label="通用名" min-width="160"></el-table-column>
        <el-table-column prop="dosage_form" label="剂型" width="100"></el-table-column>
        <el-table-column prop="specification" label="规格" width="120"></el-table-column>
        <el-table-column prop="package" label="包装" min-width="120"></el-table-column>
        <el-table-column prop="factory" label="厂家" min-width="280"></el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">正常</span>
            <span v-else class="logout">注销</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <i class="el-icon-view" @click="handleDetail(scope.$index, scope.row)"></i>
            </el-tooltip>
            <template v-if="scope.row.status == 1">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <i class="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
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
          @current-change="currentChange"
          @size-change="sizeChange"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- 详情弹窗 -->
    <el-dialog
      class="dialog_wrap dialog_wrap_detail"
      :visible.sync="detailVisble"
      :append-to-body="true"
      width="30%"
    >
      <div class="dialog_title" slot="title"><span class="line"></span>产品信息</div>
      <ul class="dialog_detail">
        <li>
          <label>产品名：</label>
          {{ singleData.product_name }}-{{ singleData.specification }}
        </li>
        <li>
          <label>通用名：</label>
          {{ singleData.generic_name }}
        </li>
        <li>
          <label>剂型：</label>
          {{ singleData.dosage_form }}
        </li>
        <li>
          <label>规格：</label>
          {{ singleData.specification }}
        </li>
        <li>
          <label>包装：</label>
          {{ singleData.package }}
        </li>
        <li>
          <label>厂家：</label>
          {{ singleData.factory }}
        </li>
        <li>
          <label>竞品名：</label>
          {{ singleData.compete_name }}
        </li>
        <li>
          <label>所属省份：</label>
          {{ singleData.province_name }}
        </li>
        <li>
          <label>主要适应症：</label>
          <p>{{ singleData.indications }}</p>
        </li>
        <li>
          <label>中标价（元）：</label>
          {{ singleData.bidding_price }}
        </li>
        <li>
          <label>生产公司：</label>
          {{ singleData.product_company }}
        </li>
        <li>
          <label>产品公司盖章：</label>
          <el-image
            class="img"
            :src="singleData.product_company_stamp"
            :preview-src-list="[singleData.product_company_stamp]"
            v-if="singleData.product_company_stamp"
          ></el-image>
        </li>
        <li>
          <label>产品图片：</label>
          <el-image
            class="img"
            :src="singleData.product_image"
            :preview-src-list="[singleData.product_image]"
            v-if="singleData.product_image"
          ></el-image>
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
    <el-dialog
      class="dialog_wrap dialog_wrap_detail"
      :visible.sync="addVisble"
      :append-to-body="true"
    >
      <div class="dialog_title" slot="title">
        <span class="line"></span>
        {{ isEdit ? "修改" : "新增" }}产品信息
      </div>
      <el-form v-if="addVisble" :model="addData" :rules="rules" ref="ruleForm" label-width="130px">
        <el-form-item label="产品名：" prop="product_name">
          <el-input size="small" v-model="addData.product_name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="通用名：" prop="generic_name">
          <el-input size="small" v-model="addData.generic_name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="剂型：" prop="dosage_form">
          <el-input size="small" v-model="addData.dosage_form" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="规格：" prop="specification">
          <el-input size="small" v-model="addData.specification" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="包装：" prop="package">
          <el-input size="small" v-model="addData.package" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="厂家：" prop="factory">
          <el-input size="small" v-model="addData.factory" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="竞品名：" prop="compete_name">
          <el-input size="small" v-model="addData.compete_name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="所属省份：" prop="province_code" class="width_full">
          <el-select
            size="small"
            :disabled="isEdit"
            v-model="addData.province_code"
            @change="changeProvince"
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in provinceList"
              :label="item.name"
              :value="item.code"
              :key="index"
            ></el-option>
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
          <el-input size="small" v-model="addData.bidding_price" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="生产公司：" prop="product_company">
          <el-input size="small" v-model="addData.product_company" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="产品公司盖章：" prop="product_company_stamp">
          <div class="upload_img">
            <el-image
              class="img"
              v-if="addData.product_company_stamp"
              :src="addData.product_company_stamp"
            ></el-image>
            <i
              class="el-icon-plus"
              v-show="!company_stamp_percent || addData.product_company_stamp == null"
            ></i>
            <el-progress
              v-show="company_stamp_percent"
              :percentage="company_stamp_percent"
              color="#67c23a"
            ></el-progress>
            <input type="file" accept="image/*" data-num="1" @change="checkFile" />
          </div>
        </el-form-item>
        <el-form-item label="产品图片：" prop="product_image">
          <div class="upload_img">
            <el-image
              class="img"
              v-if="addData.product_image"
              :src="addData.product_image"
            ></el-image>
            <i
              class="el-icon-plus"
              v-show="!product_image_percent || addData.product_image == null"
            ></i>
            <el-progress
              v-show="product_image_percent"
              :percentage="product_image_percent"
              color="#67c23a"
            ></el-progress>
            <input type="file" accept="image/*" data-num="2" @change="checkFile" />
          </div>
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
import * as qiniu from "qiniu-js";
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
      isEdit: false, //是否是编辑内容
      addData: {}, //新增数据
      company_stamp_percent: 0, //公司盖章图片上传进度条
      product_image_percent: 0, //产品图片上传进度条
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
        factory: { required: true, message: "请输入厂家" },
        province_code: { required: true, message: "请选择省" },
        indications: { required: true, message: "请输入主要适应症" },
        bidding_price: { required: true, message: "请输入中标价" },
        product_company: { required: true, message: "请输入生产公司" },
        product_company_stamp: {
          required: true,
          message: "请上传产品公司盖章"
        },
        product_image: { required: true, message: "请上传产品图片" }
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
          product_id: this.productName,
          generic_name: this.commonName,
          status: this.searchStatus,
          page: this.page,
          row: this.row
        };
        console.log(params)
      } else {
        params = {
          page: this.page,
          row: this.row
        };
      }
      this.$api
        .productManagerList(params)
        .then(res => {
          console.log(res)
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
                  product_name: item.product_name+'-'+item.specification,
                  status: item.status,
                });
              } else {
                this.product[1].options.push({
                  id: item.id,
                  product_name: item.product_name+'-'+item.specification,
                  status: item.status,
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
      if (this.commonName == null && this.productName == null && this.searchStatus == null) {
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

    // 新增产品
    handleCreate() {
      this.isEdit = false;
      this.addVisble = true;
      this.company_stamp_percent = 0;
      this.product_image_percent = 0;
      this.addData = {
        product_company_stamp: null,
        product_image: null
      };
    },

    // 编辑产品
    handleEdit(index, row) {
      this.isEdit = true;
      this.addVisble = true;
      this.company_stamp_percent = 0;
      this.product_image_percent = 0;
      this.addData = JSON.parse(JSON.stringify(row));
    },

    // 选择所属省份弹出提示
    changeProvince(val) {
      this.$messageBox.alert(
        "医院省市区数据非常重要，数据提交后将无法更改，请确认省市区信息无误！"
      );
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
    updateProduct() {
      let params = {
        product_id: this.addData.id,
        product_name: this.addData.product_name,
        generic_name: this.addData.generic_name,
        dosage_form: this.addData.dosage_form,
        specification: this.addData.specification,
        package: this.addData.package,
        factory: this.addData.factory,
        compete_name: this.addData.compete_name,
        province_code: this.addData.province_code,
        indications: this.addData.indications,
        bidding_price: this.addData.bidding_price,
        product_company: this.addData.product_company,
        product_company_stamp: this.addData.product_company_stamp,
        product_image: this.addData.product_image
      };
      this.submitLoading = true;
      this.$api
        .productEdit(params)
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

    // 选择图片上传
    checkFile(e) {
      let files = e.target.files[0];
      if (!files.type.match("image/*")) {
        this.$message.error("请选择图片格式的文件上传");
        return;
      }
      this.fileNumber = e.target.dataset.num;
      this.getToken(files);
    },

    // 获取上去七牛云的doman和token
    getToken(file) {
      this.$api
        .getQiniuToken()
        .then(res => {
          if (res.code === 100) {
            let domain = res.domain;
            let token = res.token;
            this.uploadToQiniuyun(file, token, domain);
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 上传文件到七牛云
    uploadToQiniuyun(file, token, domain) {
      let _this = this;
      const config = {
        useCdnDomain: true,
        region: qiniu.region.z2
      };
      let api = `http://${domain}/`;
      let fileName = _this.fileNumber == 1 ? `company_stamp_${file.name}` : `product_${file.name}`;
      let putExtra = {
        mimeType: null
      };
      const observable = qiniu.upload(file, fileName, token, putExtra, config);
      observable.subscribe({
        next(res) {
          let percent = Math.floor(res.total.percent);
          if (_this.fileNumber == 1) {
            _this.company_stamp_percent = percent;
          } else {
            _this.product_image_percent = percent;
          }
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
          let imgSrc = `${api}${res.key}`;
          if (_this.fileNumber == 1) {
            _this.addData.product_company_stamp = imgSrc;
          } else {
            _this.addData.product_image = imgSrc;
          }
        }
      });
    }
  }
};
</script>
<style>
.upload_img .el-progress-bar__outer {
  height: 4px !important;
}
.upload_img .el-progress__text {
  font-size: 12px !important;
  color: #67c23a;
}
</style>
<style>
/* .dialog_wrap_detail .el-dialog {
  max-height: 80%;
} */
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
.upload_img {
  width: 120px;
  height: 120px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}
.upload_img .img {
  width: 100%;
  height: 100%;
}
.upload_img .el-icon-plus {
  color: #d9d9d9;
  font-size: 50px;
  margin-top: 35px;
}
.upload_img .el-progress {
  position: absolute;
  bottom: 2px;
  left: 0;
  right: 0;
}

.upload_img input {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
