<template>
  <el-row class="PurposeTopical">
    <span class="breadcrumb">拜访核销</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item">
          <span>代表：</span>
          <el-input size="small" v-model="representative" placeholder="请输入"></el-input>
        </div>
        <div class="main_header_item">
          <span>产品：</span>
          <el-select size="small" v-model="product" clearable placeholder="请选择">
            <el-option-group
              v-for="group in productOptions"
              :key="group.label"
              :label="group.label"
            >
              <el-option
                v-for="(item, index) in group.options"
                :label="item.product_name"
                :value="item.id"
                :key="index"
              >
                <span :class="{ logout: item.status != 1 }">{{ item.product_name }}</span>
              </el-option>
            </el-option-group>
          </el-select>
        </div>
        <div class="main_header_item">
          <span>医院：</span>
          <el-input size="small" v-model="hospitalName" placeholder="请输入"></el-input>
        </div>
        <div class="main_header_item">
          <span>状态：</span>
          <el-select size="small" v-model="status" clearable placeholder="请选择">
            <el-option
              v-for="(item, index) in statusList"
              :label="item.value"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </div>
        <el-button size="small" plain icon="el-icon-bottom" @click="downLoad">下载</el-button>
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
        :default-sort="{ prop: 'start_time', order: 'descending' }"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          width="55"
          :selectable="checkSelectable"
        ></el-table-column>
        <el-table-column prop="visit_id" label="拜访编号" min-width="130"></el-table-column>
        <el-table-column prop="user_name" label="代表名" min-width="80"></el-table-column>
        <el-table-column
          prop="hospital_name"
          label="拜访医院"
          sortable
          min-width="150"
        ></el-table-column>
        <el-table-column
          prop="doctor_name"
          label="拜访医生"
          sortable
          min-width="100"
        ></el-table-column>
        <el-table-column prop="product_name" label="产品" min-width="120">
          <template slot-scope="scope">{{
            scope.row.product_name + "-" + scope.row.package
          }}</template>
        </el-table-column>
        <el-table-column prop="visit_position" label="位置" min-width="120"></el-table-column>
        <el-table-column
          prop="start_time"
          sortable
          label="开始时间"
          min-width="150"
        ></el-table-column>
        <el-table-column prop="scope" label="拜访照片" min-width="110">
          <template slot-scope="scope">
            <el-image
              class="visit_img"
              :src="scope.row.visit_image"
              :preview-src-list="[
                scope.row.visit_image,
                scope.row.visit_image_two,
                scope.row.visit_image_three,
              ]"
              v-if="scope.row.visit_image"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="100">
          <template slot-scope="scope">
            <span class="status1" v-if="scope.row.status == 1">通过</span>
            <span class="status2" v-if="scope.row.status == 2">不合格</span>
            <span class="status3" v-if="scope.row.status == 3">待审核</span>
            <span class="status4" v-if="scope.row.status == 4">已核销</span>
            <span class="status5" v-if="scope.row.status == 5">已失效</span>
            <span class="status6" v-if="scope.row.status == 6">创建</span>
            <span class="status7" v-if="scope.row.status == 7">隐藏</span>
            <span class="status8" v-if="scope.row.status == 8">删除</span>
          </template>
        </el-table-column>
        <el-table-column label="核销" min-width="90">
          <template slot-scope="scope">
            <el-button
              type="success"
              v-if="scope.row.status == 1"
              size="mini"
              @click="verification(4, scope.row)"
              >核销
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="查看" placement="top">
              <i class="el-icon-view" @click="handleDetail(scope.$index, scope.row)"></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              v-if="scope.row.status != 8"
            >
              <i class="el-icon-delete" @click="handleDelete(scope.$index, scope.row)"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-row class="batch_approve">
        批量审核：
        <el-button type="success" size="mini" @click="visitMultipleOperate(4)">核销</el-button>
      </el-row>
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
        ></el-pagination>
      </div>
    </div>
    <!-- 详情弹窗 -->
    <el-dialog class="dialog_wrap" :visible.sync="detailVisble" :append-to-body="true" width="30%">
      <ul class="dialog_detail">
        <li>
          <label>代表：</label>
          {{ singleData.user_name }}
        </li>
        <li>
          <label>拜访医院：</label>
          {{ singleData.hospital_name }}
        </li>
        <li>
          <label>拜访医生：</label>
          {{ singleData.doctor_name }}
        </li>
        <li>
          <label>拜访目的：</label>
          {{ singleData.visit_goal }}
        </li>
        <li>
          <label>产品：</label>
          {{ singleData.product_name + "-" + singleData.package }}
        </li>
        <li>
          <label class="white_space">宣传主题：</label>
          <span>{{ singleData.propaganda }}</span>
        </li>
        <li>
          <label class="white_space">医生反馈：</label>
          <span>{{ singleData.doctor_feedback }}</span>
        </li>
        <li>
          <label>位置：</label>
          {{ singleData.visit_position }}
        </li>
        <li>
          <label>开始时间：</label>
          {{ singleData.start_time }}
        </li>
        <li>
          <label>结束时间：</label>
          {{ singleData.end_time }}
        </li>
        <li>
          <label>状态：</label>
          <span v-if="singleData.status == 1">通过</span>
          <span v-if="singleData.status == 2">不合格</span>
          <span v-if="singleData.status == 3">待审核</span>
          <span v-if="singleData.status == 4">已核销</span>
          <span v-if="singleData.status == 5">已失效</span>
          <span v-if="singleData.status == 6">创建</span>
          <span v-if="singleData.status == 7">隐藏</span>
          <span v-if="singleData.status == 8">删除</span>
        </li>
        <li v-if="singleData.status == 2">
          <label>不合格理由：</label>
          <span v-if="singleData.refuse_reason == 1">当日拜访医生重复</span>
          <span v-if="singleData.refuse_reason == 2">医生反馈不合格</span>
          <span v-if="singleData.refuse_reason == 3">拜访时间交叉重合</span>
        </li>
        <li class="img_list">
          <label>拜访照片：</label>
          <span>
            <el-image
              :src="singleData.visit_image"
              :preview-src-list="[singleData.visit_image]"
              v-if="singleData.visit_image"
            ></el-image>
            <el-image
              :src="singleData.visit_image_two"
              :preview-src-list="[singleData.visit_image_two]"
              v-if="singleData.visit_image_two"
            ></el-image>
            <el-image
              :src="singleData.visit_image_three"
              :preview-src-list="[singleData.visit_image_three]"
              v-if="singleData.visit_image_three"
            ></el-image>
          </span>
        </li>
      </ul>
      <div class="dialog_title" slot="title"><span class="line"></span>拜访审核</div>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="small"
          type="success"
          v-if="singleData.status == 1"
          @click="verification(4, singleData)"
          >核 销</el-button
        >
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
export default {
  name: "VisitVerification",
  data() {
    return {
      selected: [],
      listLoading: true, //加载数据中
      representative: "", //代表
      product: "",
      hospitalName: "", //医院名称
      status: "", //状态
      statusList: [
        {
          id: "1",
          value: "通过",
        },
        {
          id: "4",
          value: "已核销",
        },
      ], //状态列表
      productOptions: [
        {
          label: "有效产品",
          options: [],
        },
        {
          label: "已注销产品",
          options: [],
        },
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
      singleData: {}, //单条数据详情
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getListData();
      this.productList();
    });
  },
  methods: {
    cellcb(row) {
      console.log(row);
      if (row.row.status != 3 && row.columnIndex === 0) {
        // console.log(row.row.status,"----",row.row)
        return "myCell";
      }
    },
    checkSelectable(row) {
      return row.status === 1;
    },
    //获取产品列表填入下拉框
    productList() {
      this.$api
        .productList()
        .then((res) => {
          if (res.code == 200) {
            res.product_list.forEach((item) => {
              if (item.status == 1) {
                this.productOptions[0].options.push({
                  id: item.id,
                  product_name:
                    item.product_name + "-" + item.package + "(" + item.province_name + ")",
                  status: item.status,
                });
              } else {
                this.productOptions[1].options.push({
                  id: item.id,
                  product_name:
                    item.product_name + "-" + item.package + "(" + item.province_name + ")",
                  status: item.status,
                });
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 多选选择框选择
    selectionChange(val) {
      this.selected = val;
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
        hospital_name: this.hospitalName,
        status: this.status,
        page: this.page,
        row: this.row,
      };
      this.$api
        .visitCancelList(parmas)
        .then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.total = res.visit_count;
            this.tableData = res.visit_list;
            this.listLoading = false;
          } else {
            this.listLoading = false;
            this.tableData = [];
            this.$message.error("数据请求失败，请重试！");
          }
        })
        .catch((error) => {
          this.listLoading = false;
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
    },
    //搜索
    search() {
      //代表和产品输入一个即可查询
      if (this.representative || this.product || this.hospitalName || this.status) {
        this.page = 1;
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
      this.hospitalName = "";
      this.status = "";
      this.getListData();
    },

    // 下载表格数据
    downLoad() {
      let parmas = {
        user_name: this.representative,
        product_id: this.product,
        is_export: 1,
      };
      this.$api.downVisitCancelList(parmas);
    },
    //删除
    handleDelete(index, row) {
      this.$messageBox
        .confirm("确认删除该条记录吗?", "提示", {
          type: "warning",
        })
        .then(() => {
          let params = { visit_id: row.id };
          this.$api
            .visitDel(params)
            .then((res) => {
              // console.log(res);
              if (res.code == 200) {
                this.$message({
                  message: "操作成功!",
                  type: "success",
                });
                this.getListData(); //重新获取审核列表
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {
          console.log("取消");
        });
    },
    //核销
    verification(type, row) {
      this.$messageBox
        .confirm("确认核销当前拜访吗?", {
          type: "info",
          closeOnClickModal: false,
        })
        .then(() => {
          let params = {
            visit_id: row.id,
            is_pass: type,
          };
          this.$api
            .visitCancel(params)
            .then((res) => {
              if (res.code == 200) {
                this.detailVisble = false;
                this.$message({
                  message: "操作成功!",
                  type: "success",
                });
                this.getListData(); //重新获取审核列表
              } else {
                this.$message.error(res.message);
              }
            })
            .catch((error) => {
              this.$message.error("操作失败，请重试！");
              console.log(error);
            });
        })
        .catch(() => {
          console.log("取消");
        });
    },
    //批量审核拜访
    visitMultipleOperate(type) {
      if (this.selected.length == 0) {
        this.$message.error("当前未选择核销数据！");
        return false;
      }
      let message;
      let messageType;
      if (type == 4) {
        //此处为通过
        message = `确认核销当前 ${this.selected.length} 条拜访吗?`;
        messageType = "info";
        this.$messageBox
          .confirm(message, {
            type: messageType,
            closeOnClickModal: false,
          })
          .then(() => {
            let visitList = [];
            this.selected.forEach((value) => {
              visitList.push(value.id);
            });
            let postData = {
              visit_id_list: visitList,
              is_pass: type,
            };
            this.$api
              .visitCancelmultipleOperate(postData)
              .then((res) => {
                console.log(res);
                if (res.code == 200) {
                  this.detailVisble = false;
                  this.$message({
                    message: "操作成功!",
                    type: "success",
                  });
                  this.getListData(); //重新获取审核列表
                } else {
                  this.$message.error(res.message);
                }
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch(() => {
            console.log("取消");
          });
      }
    },
  },
};
</script>
<style>
.visit_img .el-image__preview {
  width: 66px;
  height: 40px;
  margin-right: 10px;
}
.el-image-viewer__close .el-icon-circle-close {
  font-size: 40px;
}
.refuse_select {
  width: 100%;
}
.refuse_dialog .el-dialog {
  width: 500px;
}
</style>
<style scoped>
.dialog_wrap .dialog_detail .img_list {
  display: -webkit-flex;
  display: flex;
}
.dialog_wrap .dialog_detail .img_list .el-image {
  width: 154px;
  height: 100px;
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
.approved_pass {
  color: #67c23a;
}
.approved_nopass {
  color: #f56c6c;
}
.batch_approve {
  display: -webkit-flex;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  text-align: right;
  height: 60px;
  /* padding-right:20px; */
}
</style>
