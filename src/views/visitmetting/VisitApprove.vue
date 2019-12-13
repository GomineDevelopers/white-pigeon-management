<template>
  <el-row class="PurposeTopical">
    <span class="breadcrumb">拜访审核</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item">
          <span>代表：</span>
          <el-input v-model="representative" placeholder="请输入"></el-input>
        </div>
        <div class="main_header_item">
          <span>产品：</span>
          <el-select v-model="product" clearable placeholder="请选择">
            <el-option
              v-for="item in productOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
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
      <el-table
        :data="tableData"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        @selection-change="selectionChange"
        style="width: 100%"
      >
        <el-table-column prop="name" label="代表名" width="90"></el-table-column>
        <el-table-column prop="hospital" label="拜访医院"></el-table-column>
        <el-table-column prop="doctor" label="拜访医生" width="90"></el-table-column>
        <el-table-column prop="purpose" label="拜访目的"></el-table-column>
        <el-table-column prop="product" label="产品" width="120"></el-table-column>
        <el-table-column prop="address" label="位置"></el-table-column>
        <el-table-column prop="startTime" label="开始时间"></el-table-column>
        <el-table-column prop="endTime" label="结束时间"></el-table-column>
        <el-table-column prop="imgList" label="结束时间"></el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <i class="el-icon-view" @click="handleDetail(scope.$index, scope.row)"></i>
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
        >
        </el-pagination>
      </div>
    </div>
    <!-- 详情弹窗 -->
    <el-dialog class="dialog_wrap" :visible.sync="detailVisble" :append-to-body="true" width="30%">
      <ul class="dialog_detail">
        <li><label>代表：</label>{{ singleData.name }}</li>
        <li><label>拜访医院：</label>{{ singleData.hospital }}</li>
        <li><label>拜访医生：</label>{{ singleData.doctor }}</li>
        <li><label>拜访目的：</label>{{ singleData.purpose }}</li>
        <li><label>产品：</label>{{ singleData.product }}</li>
        <li><label>位置：</label>{{ singleData.address }}</li>
        <li><label>开始时间：</label>{{ singleData.startTime }}</li>
        <li><label>结束时间：</label>{{ singleData.endTime }}</li>
        <li><label>拜访照片：</label>{{ singleData.imgList }}</li>
      </ul>
      <div class="dialog_title" slot="title"><span class="line"></span>拜访审核</div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="detailVisble = false">确 定</el-button>
        <el-button size="small" type="info" plain @click="detailVisble = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
export default {
  name: "VisitApprove",
  data() {
    return {
      listLoading: false, //加载数据中
      representative: "", //代表
      productOptions: [
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
      product: "",
      tableData: [
        {
          id: 1,
          name: "应秋生",
          hospital: "上海市长海医院",
          doctor: "冉宇",
          purpose: "推广产品",
          product: "立维宁",
          address: "上海上海市川沙区朝阳街115号",
          startTime: "2019-03-29 16:30",
          endTime: "2019-03-29 16:35",
          imgList: []
        },
        {
          id: 1,
          name: "应秋生",
          hospital: "上海市长海医院",
          doctor: "冉宇",
          purpose: "推广产品",
          product: "立维宁",
          address: "上海上海市川沙区朝阳街115号",
          startTime: "2019-03-29 16:30",
          endTime: "2019-03-29 16:35",
          imgList: []
        },
        {
          id: 1,
          name: "应秋生",
          hospital: "上海市长海医院",
          doctor: "冉宇",
          purpose: "推广产品",
          product: "立维宁",
          address: "上海上海市川沙区朝阳街115号",
          startTime: "2019-03-29 16:30",
          endTime: "2019-03-29 16:35",
          imgList: []
        },
        {
          id: 1,
          name: "应秋生",
          hospital: "上海市长海医院",
          doctor: "冉宇",
          purpose: "推广产品",
          product: "立维宁",
          address: "上海上海市川沙区朝阳街115号",
          startTime: "2019-03-29 16:30",
          endTime: "2019-03-29 16:35",
          imgList: []
        },
        {
          id: 1,
          name: "应秋生",
          hospital: "上海市长海医院",
          doctor: "冉宇",
          purpose: "推广产品",
          product: "立维宁",
          address: "上海上海市川沙区朝阳街115号",
          startTime: "2019-03-29 16:30",
          endTime: "2019-03-29 16:35",
          imgList: []
        },
        {
          id: 1,
          name: "应秋生",
          hospital: "上海市长海医院",
          doctor: "冉宇",
          purpose: "推广产品",
          product: "立维宁",
          address: "上海上海市川沙区朝阳街115号",
          startTime: "2019-03-29 16:30",
          endTime: "2019-03-29 16:35",
          imgList: []
        },
        {
          id: 1,
          name: "应秋生",
          hospital: "上海市长海医院",
          doctor: "冉宇",
          purpose: "推广产品",
          product: "立维宁",
          address: "上海上海市川沙区朝阳街115号",
          startTime: "2019-03-29 16:30",
          endTime: "2019-03-29 16:35",
          imgList: []
        },
        {
          id: 1,
          name: "应秋生",
          hospital: "上海市长海医院",
          doctor: "冉宇",
          purpose: "推广产品",
          product: "立维宁",
          address: "上海上海市川沙区朝阳街115号",
          startTime: "2019-03-29 16:30",
          endTime: "2019-03-29 16:35",
          imgList: []
        },
        {
          id: 1,
          name: "应秋生",
          hospital: "上海市长海医院",
          doctor: "冉宇",
          purpose: "推广产品",
          product: "立维宁",
          address: "上海上海市川沙区朝阳街115号",
          startTime: "2019-03-29 16:30",
          endTime: "2019-03-29 16:35",
          imgList: []
        },
        {
          id: 1,
          name: "应秋生",
          hospital: "上海市长海医院",
          doctor: "冉宇",
          purpose: "推广产品",
          product: "立维宁",
          address: "上海上海市川沙区朝阳街115号",
          startTime: "2019-03-29 16:30",
          endTime: "2019-03-29 16:35",
          imgList: []
        }
      ],
      detailVisble: false, //详情弹窗
      singleData: {} //单条数据详情
    };
  },
  methods: {
    // 选择框选择
    selectionChange(sels) {
      this.selected = sels;
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
    // 查看详情
    handleDetail(index, row) {
      this.detailVisble = true;
      this.singleData = row;
      console.log(index, row);
    }
  }
};
</script>
<style scoped></style>
