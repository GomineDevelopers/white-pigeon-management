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
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="main_header_item">
          <span>通用名：</span>
          <el-input size="small" v-model="commonName" placeholder="请输入"></el-input>
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
        <el-button size="small" plain icon="el-icon-plus" @click="addVisble = true">新增产品</el-button>
        <el-button size="small" plain icon="el-icon-bottom" @click="downLoad">下载</el-button>
      </div>
      <el-table 
        :data="list" 
        v-loading="listLoading" 
        element-loading-text="数据拼命加载中"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%">
        <el-table-column prop="hospital_name" label="产品名" min-width="200"></el-table-column>
        <el-table-column prop="hospital_rank" label="通用名" min-width="160"></el-table-column>
        <el-table-column prop="business" label="剂型" width="100"></el-table-column>
        <el-table-column prop="phone" label="规格" width="120" ></el-table-column>
        <el-table-column prop="net" label="包装" width="200" ></el-table-column>
        <el-table-column prop="net" label="厂家" min-width="280" ></el-table-column>
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
          :total="1000">
        </el-pagination>
      </div>
    </div>
    <!-- 详情弹窗 -->
    <el-dialog class="dialog_wrap" :visible.sync="detailVisble" :append-to-body="true" width="30%">
        <div class="dialog_title" slot="title"><span class="line"></span>产品信息</div>
        <ul class="dialog_detail">
            <li><label>产品名：</label>{{singleData.hospital_num}}</li>
            <li><label>通用名：</label>{{singleData.hospital_name}}</li>
            <li><label>医院等级：</label>{{singleData.hospital_rank}}</li>
            <li><label>剂型：</label>{{singleData.business}}</li>
            <li><label>规格：</label>{{singleData.net}}</li>
            <li><label>包装：</label>{{singleData.phone}}</li>
            <li><label>厂家：</label>{{singleData.province_name}} {{singleData.city_name}}</li>
        </ul>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="detailVisble = false">确 定</el-button>
        <el-button size="small" type="info" plain @click="detailVisble = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 新增 -->
    <el-dialog class="dialog_wrap" :visible.sync="addVisble" :append-to-body="true">
      <div class="dialog_title" slot="title"><span class="line"></span>产品信息</div>
      <el-form :model="addData" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="产品名：" prop="hospital_num">
          <el-input size="small" v-model="addData.hospital_num" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="通用名：" prop="hospital_num">
          <el-input size="small" v-model="addData.hospital_num" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="剂型：" prop="hospital_num">
          <el-input size="small" v-model="addData.hospital_num" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="规格：" prop="hospital_num">
          <el-input size="small" v-model="addData.hospital_num" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="包装：" prop="hospital_num">
          <el-input size="small" v-model="addData.hospital_num" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="厂家：" prop="hospital_num">
          <el-input size="small" v-model="addData.hospital_num" placeholder="请输入"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary"  @click="addManager('ruleForm')">确 定</el-button>
        <el-button size="small" type="info" plain @click="addVisble = false">取 消</el-button>
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
      addVisble: false, //新增
      detailVisble: false, //详情弹窗
      singleData: {}, //单条数据
      commonName: null, // 搜索姓名
      productName: null, // 搜索产品名
      isSearch: false, //是否是搜索请求
      addData: {
        hospital_num: null,
      }, //新增数据
      page: 1,
      row: 10,
      total: 0,
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
      list: [
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
        hospital_num: { required: true, message: '请输入医院编号' },
      }
    };
  },
  mounted() {
      
  },
  methods: {
    // 获取列表数据
     getListData() {
      this.listLoading = true;
      let params = null;
      if (this.isSearch){
        params = {
          regional_manager_name: this.managerName,
          province_code: this.searchOption[0],
          city_code: this.searchOption[1],
          page: this.page,
          row: this.row
        }
      } else {
        params = {
          page: this.page,
          row: this.row
        };
      }
      this.$api.regionManagerList(params)
        .then( res => {
          if(res.code == 200){
            this.total = res.regional_info_count;
            this.list = res.regional_info_list
          } else {
             this.$message({
              message: res.message,
              type: "error"
            });
          }
          this.listLoading = false;
        })
        .catch( err => {
          this.listLoading = false;
          console.log(err)
        })
    },
    
    // 搜索
    search() {
      if (this.commonName == null && this.productName == null) {
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
      this.isSearch = false;
      this.page = 1;
      this.getListData();
    },

    // 下载
    downLoad() {
      console.log('下载')
    },

    // 查看详情
    handleDetail(index, row) {
      this.detailVisble = true;
      this.singleData = row;
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
    },

    // 编辑医院
    handleEdit(index,row) {
      this.addVisble = true;
      this.addData = row;
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitManager();
        } else {
          return false;
        }
      });
    },
    // 提交数据
    submitManager(){
       this.$messageBox
        .confirm("提交数据后将无法更改，请确认无误后再提交！", "提示", {
          type: "warning"
        })
        .then(() => {
          // let params = {
          //   province_code: this.regionData.option[0],
          //   city_code: this.regionData.option[1],
          //   hospital_id: this.regionData.hospitalId,
          //   product_id: this.regionData.productId,
          //   region_manager_id: this.regionData.managerId
          // };
          this.submitProduct(params);
        })
        .catch(() => {
          console.log("取消");
        });
    },
    submitProduct(params) {
      this.$api.regionManagerSubmit(params)
        .then( res => {
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
        })
        .catch( err => {
          this.addVisble = false;
          console.log(err)
        })
    },

  }
};
</script>