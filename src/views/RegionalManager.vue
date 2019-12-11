<template>
  <div>
    <!-- 面包屑 -->
    <span class="breadcrumb">医院管理</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item">
          <span>姓名：</span>
          <el-input size="small" v-model="value" placeholder="请输入"></el-input>
        </div>
        <div class="main_header_item">
          <span>省：</span>
          <el-select size="small" v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="main_header_item">
          <span>市：</span>
          <el-select size="small" v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="4" class="main_header_btns">
        <el-button size="small" type="primary">搜索</el-button>
        <el-button size="small" type="primary" plain>重置</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <div class="main_list">
      <div class="toolbar">
        <el-button size="small" plain icon="el-icon-plus">新增经理</el-button>
        <el-button size="small" plain icon="el-icon-bottom">下载</el-button>
        <el-button size="small" plain icon="el-icon-delete">删除</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column prop="province_name" label="省" width="200"></el-table-column>
        <el-table-column prop="city_name" label="市" width="200"></el-table-column>
        <el-table-column prop="name" label="姓名" width="200"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="status" label="状态" width="150"></el-table-column>
        <el-table-column label="操作" >
            <i class="el-icon-warning-outline"></i>
            <i class="el-icon-delete"></i>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  data() {
    return {
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: "",
      tableData: [{
        province_name: '浙江省',
        city_name: '杭州市',
        name: '冉宇',
        phone: 15761673167,
        status: '正常'
      }, {
        province_name: '浙江省',
        city_name: '乌鲁木齐市',
        name: '冉宇',
        phone: 15761673167,
        status: '正常'
      }, {
        province_name: '浙江省',
        city_name: '杭州市',
        name: '冉宇',
        phone: 15761673167,
        status: '正常'
      }, {
        province_name: '浙江省',
        city_name: '杭州市',
        name: '冉宇',
        phone: 15761673167,
        status: '正常'
      }]
    };
  },
  methods: {}
};
</script>