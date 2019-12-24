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
          <el-input size="small" v-model="hospitalId" placeholder="请输入"></el-input>
        </div>
        <div class="main_header_item">
          <span>等级：</span>
          <el-select size="small" v-model="gradeId" placeholder="请选择">
            <el-option
              v-for="item in gradeArr"
              :key="item.id"
              :label="item.grade_name"
              :value="item.id"
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
        <el-button size="small" plain icon="el-icon-plus" @click="handleCreate">新增医院</el-button>
        <el-button size="small" plain icon="el-icon-bottom" @click="downLoad">下载</el-button>
      </div>
      <el-table
        :data="tableData"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        style="width: 100%"
      >
        <el-table-column prop="hospital_num" label="医院编号" width="120"></el-table-column>
        <el-table-column prop="hospital_name" label="医院名称" min-width="260"></el-table-column>
        <el-table-column prop="hospital_rank" label="医院等级" width="120"></el-table-column>
        <el-table-column prop="business" label="经营方式" width="120"></el-table-column>
        <el-table-column prop="phone" label="联系方式" width="160"></el-table-column>
        <el-table-column prop="net" label="医院网址" width="240"></el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <i class="el-icon-view" @click="handleDetail(scope.$index, scope.row)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <i class="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
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
          :total="1000"
        ></el-pagination>
      </div>
    </div>
    <!-- 详情弹窗 -->
    <el-dialog class="dialog_wrap" :visible.sync="detailVisble" :append-to-body="true" width="30%">
      <div class="dialog_title" slot="title">
        <span class="line"></span>医院信息
      </div>
      <ul class="dialog_detail">
        <li>
          <label>医院编号：</label>
          {{ singleData.hospital_num }}
        </li>
        <li>
          <label>医院名称：</label>
          {{ singleData.hospital_name }}
        </li>
        <li>
          <label>医院等级：</label>
          {{ singleData.hospital_rank }}
        </li>
        <li>
          <label>经营方式：</label>
          {{ singleData.business }}
        </li>
        <li>
          <label>医院网址：</label>
          {{ singleData.net }}
        </li>
        <li>
          <label>联系方式：</label>
          {{ singleData.phone }}
        </li>
        <li>
          <label>所在省市：</label>
          {{ singleData.province_name }}
          {{ singleData.city_name }}
        </li>
        <li>
          <label>详细地址：</label>
          {{ singleData.address }}
        </li>
        <li>
          <span>
            <label>经度：</label>
            {{ singleData.lng }}
          </span>
          <span>
            <label>纬度：</label>
            {{ singleData.lat }}
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
      <div class="dialog_title" slot="title">
        <span class="line"></span>新增医院
      </div>
      <el-form v-if="addVisble" :model="addData" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="医院编号：" prop="hospital_num">
          <el-input size="small" v-model="addData.hospital_num" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="医院名称：" prop="hospital_name" class="width_full">
          <el-select size="small" v-model="addData.hospital_name" placeholder="请选择医院名称">
            <el-option label="复旦大学附属眼耳鼻喉科医院" value="复旦大学附属眼耳鼻喉科医院"></el-option>
            <el-option label="附属眼耳鼻喉科医院" value="附属眼耳鼻喉科医院"></el-option>
          </el-select>
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
        <el-form-item label="经营方式：" prop="business" class="width_full">
          <el-select size="small" v-model="addData.business" placeholder="请选择经营方式">
            <el-option label="公立" value="公立"></el-option>
            <el-option label="私立" value="私立"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医院网址：" prop="net">
          <el-input size="small" v-model="addData.net" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="phone">
          <el-input size="small" v-model="addData.phone" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="省/市：" prop="option">
          <el-cascader
            class="width_full"
            size="small"
            :options="provinceAndCityData"
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
              <el-input size="small" v-model="addData.lng" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经度：" prop="lat">
              <el-input size="small" v-model="addData.lat" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="addManager('ruleForm')">确 定</el-button>
        <el-button size="small" type="info" plain @click="addVisble = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  provinceAndCityDataPlus,
  provinceAndCityData
} from "element-china-area-data";
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
      provinceAndCityDataPlus: provinceAndCityDataPlus, //省市数据带“全部”
      provinceAndCityData: provinceAndCityData, //省市数据不带“全部”
      isSearch: false, //是否是搜索请求
      searchOption: [], //搜索省市
      gradeId: null, //搜索等级
      hospitalId: null, //搜索医院
      addData: {
        // option: [],
        // hospital_num: null,
        // hospital_name: null,
        // hospital_rank: null,
        // business: null,
        // net: null,
        // phone: null,
        // province_code: null,
        // city_code: null,
        // address: null,
        // lng: null,
        // lat: null
      }, //新增数据
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
      tableData: [
        {
          hospital_num: 1,
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          hospital_rank: "三级甲等",
          business: "公立",
          phone: "304-62194335",
          net: "www.baidu.com",
          province_name: "贵州省",
          city_name: "贵阳市",
          address: "观山湖区贵阳北站",
          lng: 121.3343,
          lat: 33.454353
        },
        {
          hospital_num: 12,
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          hospital_rank: "三级甲等",
          business: "公立",
          phone: "304-62194335",
          net: "www.baidu.com",
          province_name: "贵州省",
          city_name: "贵阳市",
          address: "观山湖区贵阳北站",
          lng: 121.3343,
          lat: 33.454353
        },
        {
          hospital_num: 15,
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          hospital_rank: "三级甲等",
          business: "公立",
          phone: "304-62194335",
          net: "www.jd.com",
          province_name: "贵州省",
          city_name: "贵阳市",
          address: "观山湖区贵阳北站",
          lng: 121.3343,
          lat: 33.454353
        },
        {
          hospital_num: 5,
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          hospital_rank: "三级甲等",
          business: "公立",
          phone: "304-62194335",
          net: "www.baidu.com",
          province_name: "贵州省",
          city_name: "贵阳市",
          address: "观山湖区贵阳北站",
          lng: 121.3343,
          lat: 33.454353
        },
        {
          hospital_num: 18,
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          hospital_rank: "三级甲等",
          business: "公立",
          phone: "304-62194335",
          net: "www.jd.com",
          province_name: "贵州省",
          city_name: "贵阳市",
          address: "观山湖区贵阳北站",
          lng: 121.3343,
          lat: 33.454353
        },
        {
          hospital_num: 165,
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          hospital_rank: "三级甲等",
          business: "公立",
          phone: "304-62194335",
          net: "www.baidu.com",
          province_name: "贵州省",
          city_name: "贵阳市",
          address: "观山湖区贵阳北站",
          lng: 121.3343,
          lat: 33.454353
        },
        {
          hospital_num: 189,
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          hospital_rank: "三级甲等",
          business: "公立",
          phone: "304-62194335",
          net: "www.jd.com",
          province_name: "贵州省",
          city_name: "贵阳市",
          address: "观山湖区贵阳北站",
          lng: 121.3343,
          lat: 33.454353
        },
        {
          hospital_num: 156,
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          hospital_rank: "三级甲等",
          business: "公立",
          phone: "304-62194335",
          net: "www.baidu.com",
          province_name: "贵州省",
          city_name: "贵阳市",
          address: "观山湖区贵阳北站",
          lng: 121.3343,
          lat: 33.454353
        },
        {
          hospital_num: 651,
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          hospital_rank: "三级甲等",
          business: "公立",
          phone: "304-62194335",
          net: "www.baidu.com",
          province_name: "贵州省",
          city_name: "贵阳市",
          address: "观山湖区贵阳北站",
          lng: 121.3343,
          lat: 33.454353
        },
        {
          hospital_num: 761,
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          hospital_rank: "三级甲等",
          business: "公立",
          phone: "304-62194335",
          net: "www.baidu.com",
          province_name: "贵州省",
          city_name: "贵阳市",
          address: "观山湖区贵阳北站",
          lng: 121.3343,
          lat: 33.454353
        },
        {
          hospital_num: 1756,
          hospital_name: "复旦大学附属眼耳鼻喉科医院",
          hospital_rank: "三级甲等",
          business: "公立",
          phone: "304-62194335",
          net: "www.baidu.com",
          province_name: "贵州省",
          city_name: "贵阳市",
          address: "观山湖区贵阳北站",
          lng: 121.3343,
          lat: 33.454353
        }
      ],
      rules: {
        hospital_num: { required: true, message: "请输入医院编号" },
        option: { required: true, message: "请选择省市" },
        hospital_name: { required: true, message: "请输入医院名称" },
        hospital_rank: { required: true, message: "请选择医院等级" },
        business: { required: true, message: "请选择经营方式" },
        phone: { required: true, message: "请输入联系方式" },
        address: { required: true, message: "请输入详细地址" },
        lng: { required: true, message: "请输入医院纬度" },
        lat: { required: true, message: "请输入医院经度" }
      }
    };
  },
  mounted() {},
  methods: {
    //地区省市搜索操作
    handleChange(arr) {
      this.searchOption = arr;
    },

    // 新增/编辑经理省市选择
    handleManagerChange(arr) {
      this.addData.option = arr;
    },
    // 获取列表数据
    getListData() {
      let params = {
        page: this.page,
        row: this.row
      };
      console.log(params);
      // this.listLoading = true;
    },
    // 状态转换
    formatStatus(row, column) {
      return row.status == 1 ? "正常" : "注销";
    },
    // 搜索
    search() {
      if (
        this.hospitalId == null &&
        !this.searchOption.length &&
        this.gradeId == null
      ) {
        this.$message({
          message: "请输入或选择搜索内容",
          type: "error"
        });
        return false;
      }
      console.log(this.hospitalId, this.searchOption, this.gradeId);
    },
    // 重置搜索内容
    resetSearch() {
      this.searchOption = [];
      this.gradeId = null;
      this.hospitalId = null;
    },
    // 下载
    downLoad() {
      console.log("下载");
    },
    // 查看详情
    handleDetail(index, row) {
      this.detailVisble = true;
      this.singleData = row;
      console.log(index, row);
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
      //   console.log(index, row);
    },

    // 新增科室
    handleCreate() {
      this.isEdit = false;
      this.addData = {};
      this.addVisble = true;
    },

    // 编辑医院
    handleEdit(index, row) {
      this.isSearch = true;
      this.addVisble = true;
      this.addData = JSON.parse(JSON.stringify(row));
      console.log(row);
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
      console.log(val);
    },
    // 新增经理
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
      console.log(this.addData);
    }
  }
};
</script>
