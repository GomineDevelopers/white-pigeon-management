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
            <el-option 
              v-for="(item, index) in product" 
              :label="item.product_name" 
              :value="item.id" 
              :key="index"
            ></el-option>
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
        <el-button size="small" plain icon="el-icon-plus" @click="addVisble = true">新增资料</el-button>
      </div>
      <el-table 
        :data="list" 
        v-loading="listLoading" 
        element-loading-text="数据拼命加载中"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%">
        <el-table-column prop="product_name" label="产品名" width="200"></el-table-column>
        <el-table-column prop="product_data_type" label="类型" width="140">
          <template scope="scope">
             <span v-if="scope.row.product_data_type == 1">科室会议</span>
             <span v-if="scope.row.product_data_type == 2">代表培训</span>
             <span v-if="scope.row.product_data_type == 3">说明书</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="PDF名称" min-width="120"></el-table-column>
        <el-table-column prop="create_time" label="日期" min-width="200" ></el-table-column>
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
          :total="total">
        </el-pagination>
      </div>
    </div>
    <!-- 详情弹窗 -->
    <el-dialog class="dialog_wrap" :visible.sync="detailVisble" :append-to-body="true" width="30%">
        <div class="dialog_title" slot="title"><span class="line"></span>产品信息</div>
        <ul class="dialog_detail">
            <li><label>产品名：</label>{{singleData.product_name}}</li>
            <li><label>类型：</label>
              <span v-if="singleData.product_data_type == 1">科室会议</span>
              <span v-if="singleData.product_data_type == 2">代表培训</span>
              <span v-if="singleData.product_data_type == 3">说明书</span>
            </li>
            <li><label>上传PDF名称：</label>{{singleData.title}}</li>
            <li><label>上传PDF：</label>{{singleData.company_policy_name}}</li>
            <li><label>上传时间：</label>{{singleData.create_time}}</li>
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
        <el-form-item label="产品名" prop="product_id" class="width_full">
          <el-select v-model="addData.product_id" placeholder="请选择产品名" no-data-text="无可添加产品">
            <el-option v-for="(item, index) in product" :label="item.product_name" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="product_id" class="width_full">
          <el-select v-model="addData.productTypeId" placeholder="请选择类型" no-data-text="无可添加类型">
            <el-option v-for="(item, index) in productType" :label="item.label" :value="item.value" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传PDF名称：" prop="pfdName">
          <el-input size="small" v-model="addData.pfdName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="上传PDF：" prop="pfdName">
          <!-- <el-upload
            class="upload-demo"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <span slot="tip" class="el-upload__tip">只能上传PDF格式文件</span>
          </el-upload> -->
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
      productId: null, // 搜索产品Id
      productTypeId: null, // 搜索类型Id
      isSearch: false, //是否是搜索请求
      addData: {
        productId: null,
        productTypeId: null,
        pfdName: null,
        pfdUrl: null
      }, //新增数据
      page: 1,
      row: 10,
      total: 0,
      product: [],
      productType: [
        {
          value: "1",
          label: "科室会议"
        },
        {
          value: "2",
          label: "代表培训"
        },
        {
          value: "3",
          label: "说明书"
        }
      ],
      list: [],
      fileList: [],
      rules: {
        hospital_num: { required: true, message: '请输入医院编号' },
      }
    };
  },
  mounted() {
      this.$nextTick( () =>{
        this.getListData();
        this.getproductList()
      })
  },
  methods: {
    // 获取列表数据
     getListData() {
      this.listLoading = true;
      let params = null;
      if (this.isSearch){
        params = {
          product_id: this.productId,
          product_data_type: this.productTypeId,
          page: this.page,
          row: this.row
        }
      } else {
        params = {
          page: this.page,
          row: this.row
        };
      }
      this.$api.materialList(params)
        .then( res => {
          if(res.code == 200){
            console.log(res)
            this.total = res.meterialDetail_count;
            this.list = res.meterialDetail
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

    // 获取产品
    getproductList() {
      this.$api.productList()
        .then( res => {
          if(res.code == 200){
            this.product = res.product_list.map( item => {
              return {id: item.id, product_name: item.product_name}
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 搜索
    search() {
      if (this.productId == null && this.productTypeId == null) {
        this.$message({
          message: "请选择搜索内容",
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
<style scoped>
.dialog_detail li label{
  width: 100px;
}
</style>