<template>
  <el-row>
    <!-- 面包屑 -->
    <span class="breadcrumb">注册服务者</span>
    <!--工具条-->
    <el-row class="main_header">
      <el-col :span="20">
        <div class="main_header_item">
          <span>代表注册状态：</span>
          <el-select size="small" v-model="registerStatus" placeholder="请选择">
            <el-option
              v-for="item in statusArr"
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
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中..."
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column prop="name" label="姓名" min-width="80"></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="140"></el-table-column>
        <el-table-column prop="id_card" label="证件号" min-width="160"></el-table-column>
        <el-table-column
          prop="id_effect_time"
          label="身份证有效期"
          :formatter="dateFormatter"
          min-width="140"
        ></el-table-column>
        <el-table-column prop="id_address" label="证件地址" min-width="140"></el-table-column>
        <el-table-column prop="open_bank" label="开户行" min-width="140"></el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              :enterable="false"
              effect="dark"
              content="注册"
              placement="top"
              v-if="scope.row.is_operate_register == 2"
            >
              <i class="el-icon-position" @click="register(scope.row)"></i>
            </el-tooltip>
            <el-tooltip
              class="item"
              :enterable="false"
              effect="dark"
              content="已注册"
              placement="top"
              v-if="scope.row.is_operate_register == 1"
            >
              <i class="el-icon-document-checked"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next, sizes, jumper"
          :page-sizes="[10, 20, 30, 40]"
          @current-change="currentChange"
          @size-change="sizeChange"
          :current-page.sync="page"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </el-row>
</template>
<script>
import { minutesTimeFormat2 } from "../../js/public.js";
export default {
  name: "Register",
  data() {
    return {
      registerStatus: "",
      // 代表注册状态
      statusArr: [
        {
          value: 1,
          label: "已注册"
        },
        {
          value: 2,
          label: "未注册"
        }
      ],
      page: 1,
      row: 10,
      total: 0,
      listLoading: false, //加载数据中
      list: []
    };
  },
  mounted() {
    this.getListData();
  },
  methods: {
    dateFormatter(row) {
      if (row.id_effect_time != null) {
        return row.id_effect_time.split(" ")[0];
      } else {
        return row.id_effect_time;
      }
    },
    getListData() {
      this.listLoading = true;
      let params = { is_operate_register: this.registerStatus, page: this.page, row: this.row };
      this.$api
        .getSignUser(params)
        .then(res => {
          if (res.code == 200) {
            console.log(res);
            this.list = res.user_list;
            this.total = res.user_list_count;
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
          this.listLoading = false;
        })
        .catch(err => {
          this.listLoading = false;
          console.log(err);
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
    // 搜索
    search() {
      if (!this.registerStatus) {
        this.$message({
          message: "请选择搜索条件",
          type: "error"
        });
        return false;
      }
      this.page = 1;
      this.getListData();
    },

    // 重置搜索内容
    resetSearch() {
      this.registerStatus = "";
      this.page = 1;
      this.getListData();
    },
    //注册
    register(row) {
      // console.log(row);
      //获取小鱼儿口令
      let params = {
        xyeAct: "15921638245",
        openNo: "021803069",
        secret: "87AC305F8EFB6AB2FA8BF194DA02D8A1"
      };
      this.$api
        .getKey(params)
        .then(res => {
          if (res.code == "00000") {
            this.token = res.token;
            //注册参数
            let signParams = {
              openNo: "021803069",
              xyeAct: "15921638245",
              timestamp: minutesTimeFormat2(),
              token: res.token,
              name: row.name,
              cellphone: row.phone,
              certNo: row.id_card,
              certDate: row.id_effect_time,
              address: row.id_address,
              certFront: row.id_front_img,
              certBack: row.id_back_img,
              signature: row.sign_image,
              type: 0,
              callbackUrl: "http://back.zidata.cn/admin/cooperate/getRegisterByXY"
            };
            let sign = this.objKeySort(signParams).toUpperCase(); //处理sign
            let newParams = signParams;
            newParams["sign"] = sign;
            console.log(newParams);
            this.$api
              .register(newParams)
              .then(res => {
                console.log(res);
                if (res.code == "00000") {
                  this.$message({
                    message: "发送成功！",
                    type: "success"
                  });
                  this.getListData();
                } else {
                  this.$message({
                    message: res.msg,
                    type: "error"
                  });
                }
              })
              .catch(err => {
                console.log(err);
              });
          }
        })
        .catch(error => {
          console.log(error);
          return false;
        });
    },
    //对象按照首字母排序,组成字符串首尾 +secret，md5加密转大写
    objKeySort(obj) {
      //排序的函数
      var newkey = Object.keys(obj).sort(); //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
      var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
      for (var i = 0; i < newkey.length; i++) {
        //遍历newkey数组
        newObj[newkey[i]] = obj[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
      }
      let newObjString = "";
      for (var Key in newObj) {
        newObjString += Key + newObj[Key];
      }
      newObjString = this.$md5(
        "87AC305F8EFB6AB2FA8BF194DA02D8A1" + newObjString + "87AC305F8EFB6AB2FA8BF194DA02D8A1"
      );
      return newObjString; //返回排好序的新对象
    }
  }
};
</script>
<style scoped></style>
