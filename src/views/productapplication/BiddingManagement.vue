<template>
  <div>
    <!-- 面包屑 -->
    <span class="breadcrumb">产品申请</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item">
          <span>代表姓名：</span>
          <el-input size="small" v-model="deputyName" placeholder="请输入医药代表姓名"></el-input>
        </div>
        <div class="main_header_item">
          <span>省：</span>
          <el-select size="small" v-model="provinceCode" placeholder="请选择">
            <el-option
              v-for="(item, index) in provinceList"
              :label="item.name"
              :value="item.code"
              :key="index"
            ></el-option>
          </el-select>
        </div>
        <el-button size="small" plain icon="el-icon-bottom" @click="downLoad">下载</el-button>
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
        <el-table-column prop="user_name" label="代表姓名" min-width="100"></el-table-column>
        <el-table-column prop="province_name" label="所属省份" min-width="100"></el-table-column>
        <el-table-column prop="hospital_name" label="医院名称" min-width="220"></el-table-column>
        <el-table-column prop="product_name" label="产品名" min-width="140">
          <template slot-scope="scope">{{
            scope.row.product_name + "-" + scope.row.package + "-" + scope.row.province_name
          }}</template>
        </el-table-column>
        <el-table-column prop="promise_sales" label="承诺销量" min-width="100"></el-table-column>
        <el-table-column
          prop="region_promise_sales"
          label="区域经理审核销量"
          min-width="120"
        ></el-table-column>
        <el-table-column
          prop="region_bidding_price"
          label="区域经理审核单价"
          min-width="120"
        ></el-table-column>
        <el-table-column
          prop="complete_time"
          label="承诺完成时间"
          min-width="160"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          min-width="80"
          :filters="[
            { text: '通过', value: 1 },
            { text: '拒绝', value: 2 },
            { text: '待审核', value: 3 },
          ]"
          :filter-method="filterStatus"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1" class="status_success">通过</span>
            <span v-else-if="scope.row.status == 2" class="logout">拒绝</span>
            <span v-else class="status_waiting">待审核</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="90" fixed="right">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <i class="el-icon-edit" @click="handleEdit(scope.row)"></i>
            </el-tooltip>
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
          <label>医药代表姓名：</label>
          {{ singleData.user_name }}
        </li>
        <li>
          <label>所属省份：</label>
          {{ singleData.province_name }}
        </li>
        <li>
          <label>医院名称：</label>
          {{ singleData.hospital_name }}
        </li>
        <li>
          <label>产品名称：</label>
          {{ singleData.product_name + "-" + singleData.package + "-" + singleData.province_name }}
        </li>
        <li>
          <label>承诺销量：</label>
          {{ singleData.promise_sales }}
        </li>
        <li>
          <label>创建时间：</label>
          {{ dateFormatter(singleData) }}
        </li>
        <li>
          <label>承诺完成时间：</label>
          {{ singleData.complete_time }}
        </li>
        <li>
          <label>代表对医院了解：</label>
          <span>{{ singleData.hospital_know }}</span>
        </li>
        <li>
          <label>代表对竞品了解：</label>
          <span>{{ singleData.commodity_know }}</span>
        </li>
        <li>
          <label>状态：</label>
          <span v-if="singleData.status == 1" class="status_success">通过</span>
          <span v-else-if="singleData.status == 2" class="logout">拒绝</span>
          <span v-else class="status_waiting">待审核</span>
        </li>
        <li v-show="singleData.status == 2">
          <label>被拒绝理由：</label>
          {{ singleData.no_pass_reason }}
        </li>
        <li>
          <label>签名图：</label>
          <el-image
            class="img"
            :src="singleData.sign_image"
            :preview-src-list="[singleData.sign_image]"
            v-if="singleData.sign_image"
          ></el-image>
        </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="detailVisble = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 新增 -->
    <el-dialog class="dialog_wrap" :visible.sync="auditDataShow" :append-to-body="true">
      <div class="dialog_title" slot="title"><span class="line"></span>编辑</div>
      <el-form :model="auditData" :rules="auditRules" ref="auditForm" label-width="100px">
        <el-form-item label="审核销量：" prop="auditSales">
          <el-input size="small" v-model="auditData.auditSales" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="审核单价：" prop="auditPrice">
          <el-input size="small" v-model="auditData.auditPrice" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="auditButton('auditForm')">确 定</el-button>
        <el-button size="small" type="info" plain @click="auditDataShow = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "BiddingManagement",
  data() {
    return {
      listLoading: false, //加载数据中
      detailVisble: false, //详情弹窗
      singleData: {}, //单条数据
      deputyName: null, // 搜索姓名
      provinceCode: null, //搜索省
      isSearch: false, //是否是搜索请求
      page: 1,
      row: 10,
      total: 0,
      list: [],
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
        { code: 820000, name: "澳门特别行政区" },
      ],
      auditDataShow: false,
      auditData: {
        id: "",
        auditSales: "", //审核销量
        auditPrice: "", //审核单价
      },
      auditRules: {
        auditSales: { required: true, message: "请输入审核销量" },
        auditPrice: { required: true, message: "请输入审核单价" },
      },
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    dateFormatter(row) {
      if (row.create_time != null) {
        return row.create_time.split(" ")[0];
      } else {
        return row.create_time;
      }
    },
    // 获取列表数据
    getListData() {
      this.listLoading = true;
      let params = null;
      if (this.isSearch) {
        params = {
          user_name: this.deputyName,
          province_code: this.provinceCode,
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
        .hospitalProductList(params)
        .then((res) => {
          // console.log(res);
          if (res.code == 200) {
            this.total = res.hospital_product_count;
            this.list = res.hospital_product_list;
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
    filterStatus(value, row) {
      return row.status === value;
    },

    // 搜索
    search() {
      if (this.deputyName == null && this.provinceCode == null) {
        this.$message({
          message: "请输入或选择搜索内容",
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
      this.searchOption = [];
      this.isSearch = false;
      this.page = 1;
      this.getListData();
    },

    // 下载
    downLoad() {
      let params = {
        user_name: this.deputyName,
        province_code: this.provinceCode,
        is_export: 1,
      };
      this.$api.downHospitalProductListExcel(params);
    },
    // 编辑
    handleEdit(row) {
      this.auditDataShow = true;
      this.auditData.id = row.id;
      this.auditData.auditSales = row.region_promise_sales;
      this.auditData.auditPrice = row.region_bidding_price;
    },
    // 新增医院确认按钮
    auditButton(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            hospital_product_id: this.auditData.id,
            region_promise_sales: this.auditData.auditSales,
            region_bidding_price: this.auditData.auditPrice,
          };
          this.$api
            .editProductAuditData(params)
            .then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: "修改数据成功！",
                  type: "success",
                });
                this.auditDataShow = false;
                this.getListData();
              } else {
                this.$message({
                  message: res.message,
                  type: "error",
                });
              }
            })
            .catch((error) => {
              this.$message({
                message: "修改数据失败",
                type: "error",
              });
              console.log(error);
            });
        } else {
          return false;
        }
      });
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
