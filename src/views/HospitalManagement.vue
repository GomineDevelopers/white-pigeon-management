<template>
  <div>
    <!-- 面包屑 -->
    <span class="breadcrumb">医院管理</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item">
          <span>地区：</span>
          <el-cascader
            size="small"
            :options="provinceAndCityDataPlus"
            v-model="searchOption"
            @change="handleChange"
          ></el-cascader>
        </div>
        <div class="main_header_item">
          <span>医院：</span>
          <el-input size="small" v-model="hospitalName" placeholder="请输入"></el-input>
        </div>
        <div class="main_header_item">
          <span>等级：</span>
          <el-select size="small" v-model="gradeId" placeholder="请选择" style="width: 120px">
            <el-option
              v-for="item in gradeArr"
              :key="item.id"
              :label="item.grade_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div class="main_header_item">
          <span>状态：</span>
          <el-select size="small" v-model="searchStatus" placeholder="请选择" style="width: 120px">
            <el-option label="正常" value="1"></el-option>
            <el-option label="删除" value="2"></el-option>
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
      <div class="toolbar">
        <el-button size="small" plain icon="el-icon-plus" @click="handleCreate">新增医院</el-button>
      </div>
      <el-table
        :data="tableData"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中..."
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column label="序号" type="index" width="60">
          <template slot-scope="scope">
            <span>{{ (page - 1) * row + scope.$index + 1 }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="id" label="医院编号" min-width="80"></el-table-column> -->
        <el-table-column prop="hospital_name" label="医院名称" min-width="180"></el-table-column>
        <el-table-column
          prop="hospital_level"
          :formatter="levelFormatter"
          label="医院等级"
          min-width="110"
        ></el-table-column>
        <el-table-column
          prop="hospital_type"
          :formatter="typeFormatter"
          label="医院类型"
          min-width="110"
        ></el-table-column>
        <el-table-column
          prop="hospital_run_type"
          :formatter="runTypeFormatter"
          label="经营方式"
          min-width="110"
        ></el-table-column>

        <el-table-column prop="hospital_mobile" label="联系方式" min-width="110"></el-table-column>
        <el-table-column prop="hospital_url" label="医院网址" min-width="150">
          <template slot-scope="scope"
            ><a class="hospital_link" :href="scope.row.hospital_url" target="_blank">{{
              scope.row.hospital_url
            }}</a></template
          >
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90">
          <template slot-scope="scope">
            <span class="normal" v-if="scope.row.status == 1">正常</span>
            <span class="abnormal" v-if="scope.row.status == 2">删除</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <i class="el-icon-view" @click="handleDetail(scope.$index, scope.row)"></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
              v-if="scope.row.status == 1"
            >
              <i class="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              v-if="scope.row.status == 1"
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
          :current-page.sync="page"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <!-- 详情弹窗 -->
    <el-dialog class="dialog_wrap" :visible.sync="detailVisble" :append-to-body="true" width="30%">
      <div class="dialog_title" slot="title"><span class="line"></span>医院信息</div>
      <ul class="dialog_detail">
        <li>
          <label>医院编号：</label>
          {{ singleData.id }}
        </li>
        <li>
          <label>医院名称：</label>
          {{ singleData.hospital_name }}
        </li>
        <li>
          <label>医院等级：</label>
          {{ levelFormatter(singleData) }}
        </li>
        <li>
          <label>医院类型：</label>
          {{ typeFormatter(singleData) }}
        </li>
        <li>
          <label>经营方式：</label>
          {{ runTypeFormatter(singleData) }}
        </li>
        <li>
          <label>医院网址：</label>
          <a class="hospital_link" :href="singleData.hospital_url" target="_blank">{{
            singleData.hospital_url
          }}</a>
        </li>
        <li>
          <label>联系方式：</label>
          {{ singleData.hospital_mobile }}
        </li>
        <li>
          <label>所在省市：</label>
          {{ singleData.province_name }}
          {{ singleData.city_name }}
        </li>
        <li>
          <label>详细地址：</label>
          {{ singleData.detail_address }}
        </li>
        <li>
          <span>
            <label>经度：</label>
            {{ singleData.hospital_longtude }}
          </span>
          <span>
            <label>纬度：</label>
            {{ singleData.hospital_latitude }}
          </span>
        </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="detailVisble = false">确 定</el-button>
        <el-button size="small" type="info" plain @click="detailVisble = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增 -->
    <el-dialog class="dialog_wrap" :visible.sync="addVisble" :append-to-body="true">
      <div class="dialog_title" slot="title" v-if="!isEdit"><span class="line"></span>新增医院</div>
      <div class="dialog_title" slot="title" v-else><span class="line"></span>编辑医院</div>
      <el-form v-if="addVisble" :model="addData" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="医院名称：" prop="hospital_name" class="width_full">
          <el-input
            size="small"
            v-model="addData.hospital_name"
            placeholder="请输入医院名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="医院等级：" prop="hospital_rank" class="width_full">
          <el-select size="small" v-model="addData.hospital_rank" placeholder="请选择医院等级">
            <el-option
              v-for="item in gradeArr"
              :label="item.grade_name"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医院类型：" prop="hospital_type" class="width_full">
          <el-select size="small" v-model="addData.hospital_type" placeholder="请选择医院类型">
            <el-option
              v-for="item in hospitalType"
              :label="item.type"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经营方式：" prop="business" class="width_full">
          <el-select size="small" v-model="addData.business" placeholder="请选择经营方式">
            <el-option
              v-for="item in runType"
              :label="item.type"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医院网址：" prop="net">
          <el-input size="small" v-model="addData.net" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：">
          <el-input size="small" v-model="addData.phone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="省/市/区：" prop="option">
          <el-cascader
            class="width_full"
            :disabled="isEdit"
            size="small"
            :options="provinceoOptions"
            v-model="addData.option"
            @change="handleManagerChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <el-input size="small" v-model="addData.address" placeholder="请输入"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="纬度：" prop="lng">
              <el-input
                size="small"
                v-model="addData.lng"
                @input="addData.lng = addData.lng.replace(/^\s+|\s+$/g, '')"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经度：" prop="lat">
              <el-input
                size="small"
                v-model="addData.lat"
                @input="addData.lat = addData.lat.replace(/^\s+|\s+$/g, '')"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="邮编：">
          <el-input size="small" v-model="addData.postcode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="Email：">
          <el-input size="small" v-model="addData.hospital_email" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addhospital('ruleForm')">确 定</el-button>
        <el-button size="small" type="info" plain @click="addVisble = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { regionData, provinceAndCityDataPlus } from "element-china-area-data";
export default {
  name: "hostpitalManagement",
  data() {
    // 手机号验证
    let checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手机号"));
      } else {
        const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      listLoading: false, //加载数据中
      addVisble: false, //新增
      detailVisble: false, //详情弹窗
      singleData: {}, //单条数据
      provinceoOptions: regionData, //省市区三级联动带全部选项
      provinceAndCityDataPlus: provinceAndCityDataPlus, //省市二级联动带全部选项
      isSearch: false, //是否是搜索请求
      isEdit: false, //编辑和新增的区分标识
      searchOption: [], //搜索省市
      gradeId: null, //搜索等级
      searchStatus: null, //搜索医院状态
      hospitalName: null, //搜索医院
      hospitalId: null, //编辑医院时的医院id
      addData: {}, //新增数据
      page: 1,
      row: 10,
      gradeArr: [
        { id: 1, grade_name: "三级甲等" },
        { id: 2, grade_name: "三级乙等" },
        { id: 3, grade_name: "三级丙等" },
        { id: 4, grade_name: "二级甲等" },
        { id: 5, grade_name: "二级乙等" },
        { id: 6, grade_name: "二级丙等" },
        { id: 7, grade_name: "一级甲等" },
        { id: 8, grade_name: "一级乙等" },
        { id: 9, grade_name: "一级丙等" },
        { id: 10, grade_name: "未知" }
      ],
      hospitalType: [
        { id: 1, type: "综合医院" },
        { id: 2, type: "专科医院" },
        { id: 3, type: "整形美容医院" },
        { id: 4, type: "未知" }
      ],
      runType: [
        { id: 1, type: "国营医院" },
        { id: 2, type: "股份制医院" },
        { id: 3, type: "中外合资医院" },
        { id: 4, type: "合伙制医院" },
        { id: 5, type: "私人医院" },
        { id: 6, type: "未知" }
      ],
      tableData: [],
      total: null,
      rules: {
        option: { required: true, message: "请选择省市区" },
        hospital_name: { required: true, message: "请输入医院名称" },
        hospital_rank: { required: true, message: "请选择医院等级" },
        hospital_type: { required: true, message: "请选择医院类型" },
        business: { required: true, message: "请选择经营方式" },
        address: { required: true, message: "请输入详细地址" },
        lng: { required: true, message: "请输入医院纬度" },
        lat: { required: true, message: "请输入医院经度" }
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getListData();
    });
  },
  methods: {
    //地区省市搜索操作
    handleChange(arr) {
      this.searchOption = arr;
    },
    // 新增/编辑经理省市选择
    handleManagerChange(arr) {
      this.addData.option = arr;
      this.$messageBox
        .confirm("医院省市区数据非常重要，数据提交后将无法更改，请确认省市区信息无误！", "提示", {
          type: "warning"
        })
        .then(() => {
          console.log("确认！");
        })
        .catch(() => {
          console.log("取消！");
        });
    },
    filterStatus(value, row) {
      return row.status === value;
    },
    // 获取列表数据
    getListData() {
      let params = {
        page: this.page,
        row: this.row,
        province_code: this.searchOption[0],
        city_code: this.searchOption[1],
        hospital_name: this.hospitalName,
        hospital_level: this.gradeId,
        status: this.searchStatus
      };
      this.listLoading = true;
      this.$api
        .hospitalManagerList(params)
        .then(res => {
          this.listLoading = false;
          if (res.code == 200) {
            this.total = res.hospital_manager_count;
            this.tableData = res.hospital_manager_list;
          }
        })
        .catch(error => {
          this.listLoading = false;
          console.log(error);
        });
    },
    // 医院等级转换
    levelFormatter(row) {
      if (row.hospital_level != null) {
        switch (row.hospital_level) {
          case 1:
            return "三级甲等";
          case 2:
            return "三级乙等";
          case 3:
            return "三级丙等";
          case 4:
            return "二级甲等";
          case 5:
            return "二级乙等";
          case 6:
            return "二级丙等";
          case 7:
            return "一级甲等";
          case 8:
            return "一级乙等";
          case 9:
            return "一级丙等";
          case 10:
            return "未知";
          default:
            return "";
        }
      } else {
        return "";
      }
    },
    // 医院类型转换
    typeFormatter(row) {
      if (row.hospital_type != null) {
        switch (row.hospital_type) {
          case 1:
            return "综合医院";
          case 2:
            return "专科医院";
          case 3:
            return "整形美容医院";
          case 4:
            return "未知";
          default:
            return "";
        }
      } else {
        return "";
      }
    },
    // 医院等级转换
    runTypeFormatter(row) {
      if (row.hospital_run_type != null) {
        switch (row.hospital_run_type) {
          case 1:
            return "国营医院";
          case 2:
            return "股份制医院";
          case 3:
            return "中外合资医院";
          case 4:
            return "合伙制医院";
          case 5:
            return "私人医院";
          case 6:
            return "未知";
          default:
            return "";
        }
      } else {
        return "";
      }
    },
    // 搜索
    search() {
      if (
        this.hospitalName == null &&
        !this.searchOption.length &&
        this.gradeId == null &&
        this.searchStatus == null
      ) {
        this.$message({
          message: "请输入或选择搜索内容",
          type: "error"
        });
        return false;
      }
      //console.log(this.hospitalName, this.searchOption, this.gradeId);
      this.page = 1;
      this.getListData();
    },
    // 重置搜索内容
    resetSearch() {
      this.searchOption = [];
      this.gradeId = null;
      this.hospitalName = null;
      this.searchStatus = null;
      this.page = 1;
      this.getListData();
    },
    // 下载
    downLoad() {
      let parmas = {
        province_code: this.searchOption[0],
        city_code: this.searchOption[1],
        hospital_name: this.hospitalName,
        hospital_level: this.gradeId,
        status: this.searchStatus,
        is_export: 1
      };
      this.$api.downHospitalManagerExcel(parmas);
    },
    // 查看详情
    handleDetail(index, row) {
      console.log(row);
      this.detailVisble = true;
      this.singleData = row;
    },
    // 删除
    handleDelete(index, row) {
      this.$messageBox
        .confirm("确认删除此医院吗?", "提示", {
          type: "warning"
        })
        .then(() => {
          console.log(row);
          let params = { hospital_id: row.id };
          this.$api
            .hospitalDel(params)
            .then(res => {
              console.log(res);
              if (res.code == 200) {
                this.$message({
                  message: "医院状态更改成功！",
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
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          console.log("取消");
        });
      //   console.log(index, row);
    },

    // 点击新增医院
    handleCreate() {
      this.isEdit = false;
      this.addData = {};
      this.addVisble = true;
    },

    // 编辑医院
    handleEdit(index, row) {
      this.isEdit = true;
      this.addVisble = true;
      this.hospitalId = row.id;
      this.addData = {
        hospital_name: row.hospital_name,
        hospital_rank: row.hospital_level,
        hospital_type: row.hospital_type,
        business: row.hospital_run_type,
        net: row.hospital_url,
        phone: row.hospital_mobile,
        option: [String(row.province_code), String(row.city_code), String(row.area_code)],
        address: row.detail_address,
        lng: row.hospital_longtude,
        lat: row.hospital_latitude,
        postcode: row.postcode,
        hospital_email: row.hospital_email
      };
    },
    // 点击分页当前页数
    currentChange(val) {
      this.page = val;
      this.getListData();
      console.log(val);
    },
    // 切换每页条数
    sizeChange(val) {
      this.row = val;
      this.getListData();
      // console.log(val);
    },
    // 新增医院确认按钮
    addhospital(formName) {
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
      if (this.isEdit) {
        console.log("编辑");
        this.$messageBox
          .confirm("请确认信息无误后再提交！", "提示", {
            type: "warning"
          })
          .then(() => {
            let params = {
              hospital_id: this.hospitalId,
              hospital_name: this.addData.hospital_name,
              hospital_level: this.addData.hospital_rank,
              hospital_type: this.addData.hospital_type,
              hospital_run_type: this.addData.business,
              hospital_url: this.addData.net,
              hospital_mobile: this.addData.phone,
              province_code: this.addData.option[0],
              city_code: this.addData.option[1],
              area_code: this.addData.option[2],
              detail_address: this.addData.address,
              hospital_longtude: this.addData.lng,
              hospital_latitude: this.addData.lat,
              postcode: this.addData.postcode,
              hospital_email: this.addData.hospital_email
            };
            this.$api
              .hospitalEdit(params)
              .then(res => {
                console.log(res);
                if (res.code == 200) {
                  this.$message({
                    message: "编辑信息成功！",
                    type: "success"
                  });
                  this.addVisble = false;
                  this.getListData();
                } else {
                  this.$message({
                    message: res.message,
                    type: "error"
                  });
                }
              })
              .catch(error => {
                this.$message({
                  message: res.message,
                  type: "error"
                });
                console.log(error);
              });
          });
      } else {
        console.log("添加");
        this.$messageBox
          .confirm("请确认无误后再提交！", "提示", {
            type: "warning"
          })
          .then(() => {
            let params = {
              hospital_name: this.addData.hospital_name,
              hospital_level: this.addData.hospital_rank,
              hospital_type: this.addData.hospital_type,
              hospital_run_type: this.addData.business,
              hospital_url: this.addData.net,
              hospital_mobile: this.addData.phone,
              province_code: this.addData.option[0],
              city_code: this.addData.option[1],
              area_code: this.addData.option[2],
              detail_address: this.addData.address,
              hospital_longtude: this.addData.lng,
              hospital_latitude: this.addData.lat,
              postcode: this.addData.postcode,
              hospital_email: this.addData.hospital_email
            };
            this.$api
              .hospitalAdd(params)
              .then(res => {
                console.log(res);
                if (res.code == 200) {
                  this.$message({
                    message: "添加医院成功！",
                    type: "success"
                  });
                  this.addVisble = false;
                  this.page = 1;
                  this.getListData();
                }else{
                  this.$message({
                    message: res.message,
                    type: "error"
                  });
                }
              })
              .catch(error => {
                this.$message({
                  message: res.message,
                  type: "error"
                });
                console.log(error);
              });
          });
      }
    }
  }
};
</script>
<style scoped>
.el-table .el-table__body-wrapper .abnormal {
  color: red;
}
.main_list table .el-table__column-filter-trigger i {
  color: #333 !important;
}
.hospital_link {
  color: #606266;
  text-decoration: none;
}
.hospital_link:hover {
  color: #409eff;
  text-decoration: underline;
}
</style>
