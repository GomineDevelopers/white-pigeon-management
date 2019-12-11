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
      <el-table :data="tableData" v-loading="listLoading" style="width: 100%">
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column prop="province_name" label="省" width="200"></el-table-column>
        <el-table-column prop="city_name" label="市" width="200"></el-table-column>
        <el-table-column prop="name" label="姓名" width="130"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column prop="status" label="状态" width="80" :formatter="formatStatus"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <i class="el-icon-warning-outline" @click="handleDetail(scope.$index, scope.row)"></i>
            <i class="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout=" prev, pager, next, sizes, jumper"
          :total="400"
        ></el-pagination>
      </div>
    </div>
    <!-- 详情弹窗 -->
    <el-dialog class="dialog_wrap" :visible.sync="detailVisble" :append-to-body="true" width="30%">
        <ul>
            <li>省：{{singleData.province_name}}</li>
            <li>市：{{singleData.city_name}}</li>
            <li>姓名：{{singleData.name}}</li>
            <li>手机号：{{singleData.phone}}</li>
            <li>状态：{{formatStatus(singleData.status)}}</li>
        </ul>
        <div class="dialog_title" slot="title"><span class="line"></span>经理信息</div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detailVisble = false">确 定</el-button>
        <el-button @click="detailVisble = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "",
  data() {
    return {
      listLoading: false,
      detailVisble: true,
      singleData: {},
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
      tableData: [
        {
          province_name: "浙江省",
          city_name: "杭州市",
          name: "冉宇",
          phone: 15761673167,
          status: 1
        },
        {
          province_name: "浙江省",
          city_name: "乌鲁木齐市",
          name: "冉宇",
          phone: 15761673167,
          status: 1
        },
        {
          province_name: "浙江省",
          city_name: "乌鲁木齐市",
          name: "冉宇",
          phone: 15761673167,
          status: 2
        },
        {
          province_name: "浙江省",
          city_name: "乌鲁木齐市",
          name: "冉宇",
          phone: 15761673167,
          status: 1
        },
        {
          province_name: "浙江省",
          city_name: "乌鲁木齐市",
          name: "冉宇",
          phone: 15761673167,
          status: 2
        },
        {
          province_name: "浙江省",
          city_name: "乌鲁木齐市",
          name: "冉宇",
          phone: 15761673167,
          status: 1
        },
        {
          province_name: "浙江省",
          city_name: "乌鲁木齐市",
          name: "冉宇",
          phone: 15761673167,
          status: 2
        },
        {
          province_name: "浙江省",
          city_name: "乌鲁木齐市",
          name: "冉宇",
          phone: 15761673167,
          status: 1
        },
        {
          province_name: "浙江省",
          city_name: "乌鲁木齐市",
          name: "冉宇",
          phone: 15761673167,
          status: 1
        },
        {
          province_name: "浙江省",
          city_name: "杭州市",
          name: "冉宇",
          phone: 15761673167,
          status: 1
        },
        {
          province_name: "浙江省",
          city_name: "杭州市",
          name: "冉宇",
          phone: 15761673167,
          status: 1
        }
      ]
    };
  },
  mounted() {
    //   console.log(this.MessageBox)
    // this.MessageBox.alert('<strong>这是 <i>HTML</i> 片段</strong>', 'HTML 片段', {
    //   dangerouslyUseHTMLString: true
    // });
  },
  methods: {
    //状态转换
    formatStatus(row, column) {
      return row.status == 1 ? "正常" : "注销";
    },
    handleDetail(index, row) {
        this.detailVisble = true;
        this.singleData = row;
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    show() {}
  }
};
</script>