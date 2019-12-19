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
        <el-button size="small" type="primary" @click="search">搜索</el-button>
        <el-button size="small" type="primary" plain @click="reset">重置</el-button>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <div class="main_list">
      <el-table
        :data="tableData"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        @selection-change="selectionChange"
        style="width: 100%"
      >
        <el-table-column prop="user_name" label="代表名" width="90"></el-table-column>
        <el-table-column prop="hospital_name" label="拜访医院"></el-table-column>
        <el-table-column prop="doctor_name" label="拜访医生" width="90"></el-table-column>
        <el-table-column prop="visit_goal" label="拜访目的"></el-table-column>
        <el-table-column prop="product_name" label="产品" width="100"></el-table-column>
        <el-table-column prop="visit_position" label="位置"></el-table-column>
        <el-table-column prop="start_time" label="开始时间"></el-table-column>
        <el-table-column prop="end_time" label="结束时间"></el-table-column>
        <el-table-column prop="status" label="状态" width="90">
          <template scope="scope">
            <span class="status1" v-if="scope.row.status == 1">通过</span>
            <span class="status2" v-if="scope.row.status == 2">不合格</span>
            <span class="status3" v-if="scope.row.status == 3">待审核</span>
            <span class="status4" v-if="scope.row.status == 4">已经取消</span>
            <span class="status5" v-if="scope.row.status == 5">已经失效</span>
            <span class="status6" v-if="scope.row.status == 6">创建</span>
            <span class="status7" v-if="scope.row.status == 7">隐藏</span>
            <span class="status8" v-if="scope.row.status == 8">删除</span>
          </template>
        </el-table-column>
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
          :current-page.sync="page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 详情弹窗 -->
    <el-dialog class="dialog_wrap" :visible.sync="detailVisble" :append-to-body="true" width="30%">
      <ul class="dialog_detail">
        <li><label>代表：</label>{{ singleData.user_name }}</li>
        <li><label>拜访医院：</label>{{ singleData.hospital_name }}</li>
        <li><label>拜访医生：</label>{{ singleData.doctor_name }}</li>
        <li><label>拜访目的：</label>{{ singleData.visit_goal }}</li>
        <li><label>产品：</label>{{ singleData.product_name }}</li>
        <li><label>位置：</label>{{ singleData.visit_position }}</li>
        <li><label>开始时间：</label>{{ singleData.start_time }}</li>
        <li><label>结束时间：</label>{{ singleData.end_time }}</li>
        <li>
          <label>状态：</label>
          <span v-if="singleData.status == 1">通过</span>
          <span v-if="singleData.status == 2">不合格</span>
          <span v-if="singleData.status == 3">待审核</span>
          <span v-if="singleData.status == 4">已经取消</span>
          <span v-if="singleData.status == 5">已经失效</span>
          <span v-if="singleData.status == 6">创建</span>
          <span v-if="singleData.status == 7">隐藏</span>
          <span v-if="singleData.status == 8">删除</span>
        </li>
        <li class="img_list">
          <label>拜访照片：</label>
          <span>
            <img :src="singleData.visit_image" v-if="singleData.visit_image" />
            <img :src="singleData.visit_image_two" v-if="singleData.visit_image_two" />
            <img :src="singleData.visit_image_three" v-if="singleData.visit_image_three" />
          </span>
        </li>
      </ul>
      <div class="dialog_title" slot="title"><span class="line"></span>拜访审核</div>
      <div slot="footer" class="dialog-footer" v-if="singleData.status == 3">
        <el-button size="small" type="primary" @click="approve(1)">通 过</el-button>
        <el-button size="small" type="warning" @click="approve(2)">拒 绝</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
export default {
  name: "VisitApprove",
  data() {
    return {
      listLoading: true, //加载数据中
      representative: "", //代表
      product: "",
      productOptions: [
        // {
        //   value: 1,
        //   label: ""
        // }
      ],
      page: 1,
      row: 10,
      total: null,
      tableData: [
        // {
        //   id: 1,
        //   user_name: "应秋生",
        //   hospital_name: "上海市长海医院",
        //   doctor_name: "冉宇",
        //   visit_goal: "推广产品",
        //   product_name: "立维宁",
        //   visit_position: "上海上海市川沙区朝阳街115号",
        //   start_time: "2019-03-29 16:30",
        //   end_time: "2019-03-29 16:35",
        //   visit_image: '',
        //   visit_image_two:'',
        //   visit_image_three:''
        // }
      ],
      detailVisble: false, //详情弹窗
      singleData: {} //单条数据详情
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getListData();
      this.productList();
    });
  },
  methods: {
    //获取产品列表填入下拉框
    productList() {
      this.$api
        .productList()
        .then(res => {
          // console.log(res);
          if (res.code == 200) {
            res.product_list.forEach(item => {
              this.productOptions.push({
                value: item.id,
                label: item.product_name
              });
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 选择框选择
    selectionChange(sels) {
      this.selected = sels;
    },
    // 点击分页当前页数page
    currentChange(val) {
      this.page = val;
      this.listLoading = true;
      this.getListData();
    },
    //获取拜访数据
    getListData() {
      this.listLoading = true;
      let parmas = {
        user_name: this.representative,
        product_id: this.product,
        page: this.page,
        row: this.row
      };
      this.$api
        .visitList(parmas)
        .then(res => {
          // console.log(res);
          if (res.code == 200) {
            this.total = res.visit_count;
            this.tableData = res.visit_list;
            this.listLoading = false;
          } else {
            this.tableData = [];
            this.$message.error("数据请求失败，请重试！");
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 切换每页条数row
    sizeChange(val) {
      this.row = val;
      this.listLoading = true;
      this.getListData();
    },
    // 查看详情
    handleDetail(index, row) {
      this.detailVisble = true;
      this.singleData = row;
      // console.log(index, row);
    },
    //搜索
    search() {
      //代表和产品输入一个即可查询
      if (this.representative || this.product) {
        this.getListData();
      } else {
        this.$message.error("请输入查询条件！");
        return false;
      }
    },
    //重置搜索内容
    reset() {
      this.product = "";
      this.representative = "";
      this.getListData();
    },
    //删除
    handleDelete(index, row) {
      this.$messageBox
        .confirm("确认删除该条记录吗?", "提示", {
          type: "warning"
        })
        .then(() => {
          let params = { visit_id: row.id };
          this.$api
            .visitDel(params)
            .then(res => {
              console.log(res);
              if (res.code == 200) {
                this.$message({
                  message: "操作成功!",
                  type: "success"
                });
                this.getListData(); //重新获取审核列表
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          console.log("取消");
        });
    },
    //通过审核
    approve(type) {
      let message;
      let messageType;
      if (type == 1) {
        message = "确认修改当前状态为‘通过’吗?";
        messageType = "info";
      } else {
        message = "确认拒绝当前拜访吗？状态提交后不可更改！";
        messageType = "warning";
      }
      this.$messageBox
        .confirm(message, {
          type: messageType,
          closeOnClickModal: false
        })
        .then(() => {
          let params = { visit_id: this.singleData.id, is_pass: type };
          this.$api
            .visitOperate(params)
            .then(res => {
              if (res.code == 200) {
                this.detailVisble = false;
                this.$message({
                  message: "操作成功!",
                  type: "success"
                });
                this.getListData(); //重新获取审核列表
              } else {
                this.$message.error("操作失败，请重试！");
              }
            })
            .catch(error => {
              this.$message.error("操作失败，请重试！");
              console.log(error);
            });
        })
        .catch(() => {
          console.log("取消");
        });
    }
  }
};
</script>
<style scoped>
.dialog_wrap .dialog_detail li img {
  width: 154px;
  height: 100px;
}
.dialog_wrap .dialog_detail .img_list {
  display: -webkit-flex;
  display: flex;
}
.img_list img {
  margin-right: 10px;
}
.status1 {
  color: #5ed2ad;
}
.status2 {
  color: red;
}
.status3 {
  color: #e6a23c;
}
.status8,
.status4,
.status5 {
  color: #999;
}
</style>
