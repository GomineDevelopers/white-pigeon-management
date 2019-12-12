<template>
  <div>
    <!-- 面包屑 -->
    <span class="breadcrumb">医院管理</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item">
          <span>姓名：</span>
          <el-input size="small" v-model="user" placeholder="请输入"></el-input>
        </div>
        <div class="main_header_item">
          <span>省：</span>
          <el-select size="small" v-model="province" placeholder="请选择">
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
          <el-select size="small" v-model="city" placeholder="请选择">
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
        <el-button size="small" type="primary" @click="search">搜索</el-button>
        <el-button size="small" type="primary" @click="resetSearch" plain>重置</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <div class="main_list">
      <div class="toolbar">
        <el-button size="small" plain icon="el-icon-plus" @click="addVisble = true">新增经理</el-button>
        <el-button size="small" plain icon="el-icon-bottom" @click="downLoad">下载</el-button>
        <el-button size="small" plain icon="el-icon-delete" @click="deleteselected">删除</el-button>
      </div>
      <el-table 
        :data="tableData" 
        v-loading="listLoading" 
        element-loading-text="数据拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        @selection-change="selectionChange" 
        style="width: 100%">
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column prop="province_name" label="省" width="200"></el-table-column>
        <el-table-column prop="city_name" label="市" width="200"></el-table-column>
        <el-table-column prop="name" label="姓名" width="130"></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="200"></el-table-column>
        <el-table-column prop="status" label="状态" width="80" :formatter="formatStatus"></el-table-column>
        <el-table-column label="操作" width="120">
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
          :total="1000">
        </el-pagination>
      </div>
    </div>
    <!-- 详情弹窗 -->
    <el-dialog class="dialog_wrap" :visible.sync="detailVisble" :append-to-body="true" width="30%">
        <ul class="dialog_detail">
            <li><label>省：</label>{{singleData.province_name}}</li>
            <li><label>市：</label>{{singleData.city_name}}</li>
            <li><label>姓名：</label>{{singleData.name}}</li>
            <li><label>手机号：</label>{{singleData.phone}}</li>
            <li><label>状态：</label>{{ singleData.status? formatStatus(singleData.status) : ''}}</li>
        </ul>
        <div class="dialog_title" slot="title"><span class="line"></span>经理信息</div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="detailVisble = false">确 定</el-button>
        <el-button size="small" type="info" plain @click="detailVisble = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增经理 -->
    <el-dialog class="dialog_wrap" :visible.sync="addVisble" :append-to-body="true">
      <div class="dialog_title" slot="title"><span class="line"></span>新增经理</div>
      <el-form :model="addManagerData" :rules="rules" ref="ruleForm" label-width="100px">
        <el-row>
        <el-col :span="12">
        <el-form-item label="省：" prop="province_code">
          <el-select size="small" v-model="addManagerData.province_code" placeholder="请选择省">
            <el-option label="浙江省" value="zj"></el-option>
            <el-option label="安徽省" value="ah"></el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item size="small" label="市：" prop="city_code">
          <el-select v-model="addManagerData.city_code" placeholder="请选择市">
            <el-option label="贵阳" value="gy"></el-option>
            <el-option label="遵义" value="zy"></el-option>
          </el-select>
        </el-form-item>
        </el-col>
        </el-row>
        <el-form-item label="姓名：" prop="name">
          <el-input size="small" v-model="addManagerData.name"></el-input>
        </el-form-item>
        <el-form-item  label="手机号：" prop="email">
          <el-input size="small" v-model.number="addManagerData.email"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input size="small" type="password" v-model="addManagerData.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary"  @click="addManager('ruleForm')">确 定</el-button>
        <el-button size="small" type="primary"  @click="addManager('ruleForm')">重 置</el-button>
        <el-button size="small" type="info" plain @click="addVisble = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

export default {
  name: "RegionalManager",
  data() {
    // 手机号验证
    let checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入手机号'));
        } else {
          const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
    };
    return {
      listLoading: false, //加载数据中
      addVisble: false, //新增
      detailVisble: false, //详情弹窗
      singleData: {}, //单条数据
      selected: [], //选中数据
      user: null, // 搜索姓名
      province: null, // 搜索省
      city: null, // 搜索市
      addManagerData: {
        province_code: null,
        city_code: null,
        name: null,
        email: null,
        password: null,
      }, //新增数据
      page: 1,
      row: 10,
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
      tableData: [
        {
            id: 1,
            province_name: "浙江省",
            city_name: "杭州市",
            name: "冉宇",
            phone: 15761673167,
            status: 1
        },
        {
            id: 12,
            province_name: "浙江省",
            city_name: "乌鲁木齐市",
            name: "冉宇",
            phone: 15761673167,
            status: 1
        },
        {
            id: 15,
            province_name: "浙江省",
            city_name: "乌鲁木齐市",
            name: "冉宇",
            phone: 15761673167,
            status: 2
        },
        {
            id: 5,
            province_name: "浙江省",
            city_name: "乌鲁木齐市",
            name: "冉宇",
            phone: 15761673167,
            status: 1
        },
        {
            id: 18,
            province_name: "浙江省",
            city_name: "乌鲁木齐市",
            name: "冉宇",
            phone: 15761673167,
            status: 2
        },
        {
            id: 165,
            province_name: "浙江省",
            city_name: "乌鲁木齐市",
            name: "冉宇",
            phone: 15761673167,
            status: 1
        },
        {
            id: 189,
            province_name: "浙江省",
            city_name: "乌鲁木齐市",
            name: "冉宇",
            phone: 15761673167,
            status: 2
        },
        {
            id: 156,
            province_name: "浙江省",
            city_name: "乌鲁木齐市",
            name: "冉宇",
            phone: 15761673167,
            status: 1
        },
        {
            id: 651,
            province_name: "浙江省",
            city_name: "乌鲁木齐市",
            name: "冉宇",
            phone: 15761673167,
            status: 1
        },
        {
            id: 761,
            province_name: "浙江省",
            city_name: "杭州市",
            name: "冉宇",
            phone: 15761673167,
            status: 1
        },
        {
            id: 1756,
            province_name: "浙江省",
            city_name: "杭州市",
            name: "冉宇",
            phone: 15761673167,
            status: 1
        }
      ],
      rules: {
        name: [
          { required: true, message: '请输入姓名', },
        ],
        province_code: [
          { required: true, message: '请选择省份', }
        ],
        city_code: [
          { required: true, message: '请选择市', }
        ],
        email: [
          { required: true, validator: checkPhone, trigger: 'blur'},
        ],
        password: [
          { required: true, message: '请输入密码' }
        ]
      }
    };
  },
  mounted() {
      
  },
  methods: {
    // 获取列表数据
    getListData() {
      let params = {
        page: this.page,
        row: this.row
      };
      console.log(params)
      // this.listLoading = true;
    },
    // 状态转换
    formatStatus(row, column) {
      return row.status == 1 ? "正常" : "注销";
    },
    // 搜索
    search() {
      if (this.user == null && this.province == null && this.city == null){
        this.$message({
            message: '请输入或选择搜索内容',
            type: 'error'
        });
        return false
      }
      console.log(this.user,this.province,this.city)
    },
    // 重置搜索内容
    resetSearch() {
      this.user = null;
      this.province = null;
      this.city = null;
    },
    // 下载
    downLoad() {
      console.log('下载')
    },
    // 查看详情
    handleDetail(index, row) {
        this.detailVisble = true;
        this.singleData = row;
      console.log(index, row);
    },
    // 删除
    handleDelete(index, row) {
        this.$messageBox.confirm('确认删除该条记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                console.log(row.id)
                let para = { id: row.id };
            }).catch(() => {
                console.log('取消')
            });
    //   console.log(index, row);
    },
    // 选择框选择
    selectionChange(sels) {
        this.selected = sels
    },
    // 删除选中选项
    deleteselected() {
        if(!this.selected.length) {
            this.$message({
                message: '未选中数据',
                type: 'error'
            });
            return false;
        }
        this.$messageBox.confirm('确认删除所选记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                console.log(this.selected)
                
            }).catch(() => {
                console.log('取消')
            });
    },
    // 点击分页当前页数
    currentChange(val) {
      this.page = val;
      this.getListData();
      console.log(val)
    },
    // 切换每页条数
    sizeChange(val) {
      this.row = val;
      console.log(val)
    },
    // 新增经理
    addManager(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitManager();
        } else {
          return false;
        }
      });
    },
    // 重置新增表单数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 提交数据
    submitManager(){
      console.log(this.addManagerData)
    }

  }
};
</script>
<style scoped>
.dialog_detail li{
    line-height: 36px;
    color: #333;
    font-size: 14px;
}
.dialog_detail li label{
    display: inline-block;
    min-width: 62px;
    margin-right: 10px;
    text-align: right;
}
</style>