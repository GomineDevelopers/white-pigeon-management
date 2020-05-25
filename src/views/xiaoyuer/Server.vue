<template>
  <el-row v-loading="isLoading" element-loading-text="数据提交中...">
    <!-- 面包屑 -->
    <span class="breadcrumb">需求列表</span>
    <!-- 列表 -->
    <div class="main_list">
      <el-table
        :data="list"
        v-loading="listLoading"
        element-loading-text="数据拼命加载中..."
        element-loading-background="rgba(255, 255, 255, 0.8)"
        style="width: 100%"
      >
        <el-table-column
          prop="client_platform_id"
          label="客户平台ID"
          min-width="100"
        ></el-table-column>
        <el-table-column prop="reqid" label="需求ID" min-width="80"></el-table-column>
        <el-table-column
          prop="demand_title"
          label="需求标题"
          min-width="220"
          tooltip-effect="dark"
        ></el-table-column>
        <el-table-column
          prop="demand_content"
          label="需求内容"
          min-width="240"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="demand_money" label="需求金额" min-width="80"></el-table-column>
        <el-table-column prop="num" label="服务者人数" min-width="90"></el-table-column>
        <el-table-column
          prop="class"
          label="分类"
          min-width="220"
          :formatter="formatClass"
        ></el-table-column>
        <el-table-column
          prop="province"
          label="省份"
          min-width="110"
          :formatter="formatProvince"
        ></el-table-column>
        <el-table-column
          prop="city"
          label="城市"
          min-width="110"
          :formatter="formatCity"
        ></el-table-column>
        <el-table-column
          prop="county"
          label="地区"
          min-width="160"
          :formatter="formatCounty"
        ></el-table-column>
        <el-table-column prop="start_time" label="开始时间" min-width="160">
          <template slot-scope="scope">
            <span>{{ formatTime(scope.row.start_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="end_time" label="结束时间" min-width="160">
          <template slot-scope="scope">
            <span>{{ formatTime(scope.row.end_time) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="submitData(scope.row)">上传</el-button>
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
  name: "Server",
  data() {
    return {
      page: 1,
      row: 10,
      total: 0,
      isLoading: false,
      classList: [], //分类列表
      areaArray: areaArray, //省市列表
      listLoading: false, //加载数据中
      list: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getListData();
      this.getTreeData(XYE.categoryData);
    });
  },
  methods: {
    // 获取分类
    getTreeData(data) {
      try {
        for (var i = 0; i < data.length; i++) {
          if (data[i].items.length < 1) {
            // children若为空数组，则将children设为undefined
            data[i].items = undefined;
          } else {
            // children若不为空数组，则继续 递归调用 本方法
            this.getTreeData(data[i].items);
          }
        }
      } catch (error) {
        console.log(error);
      }
      this.classList = data;
    },
    formatClass(row) {
      let className = "";
      this.classList.forEach((item) => {
        if (item.items) {
          item.items.forEach((item_child) => {
            if (item_child.id === row.class) {
              className = `${item.name} ${item_child.name}`;
            }
          });
        } else {
          className = item.name;
        }
      });
      return className;
    },
    formatProvince(row) {
      for (let item of this.areaArray) {
        if (item.id === row.province) {
          this.cityArray = item.children;
          return item.name;
        }
      }
    },
    formatCity(row) {
      for (let item_pro of this.areaArray) {
        if (item_pro.id === row.province) {
          for (let item_city of item_pro.children) {
            if (item_city.id === row.city) {
              return item_city.name;
            }
          }
        }
      }
    },
    formatCounty(row) {
      for (let item_pro of this.areaArray) {
        if (item_pro.id === row.province) {
          for (let item_city of item_pro.children) {
            if (item_city.id === row.city) {
              for (let item_county of item_city.children) {
                if (item_county.id === row.county) {
                  return item_county.name;
                }
              }
            }
          }
        }
      }
    },
    // 格式化开始和结束时间
    formatTime(time) {
      return `${time.substr(0, 4)}-${time.substr(4, 2)}-${time.substr(6, 2)} ${time.substr(
        8,
        2
      )}:${time.substr(10, 2)}:${time.substr(12, 2)}`;
    },
    // 获取列表信息
    getListData() {
      this.listLoading = true;
      let params = { page: this.page, row: this.row };
      this.$api
        .postDemandList(params)
        .then((res) => {
          if (res.code == 200) {
            this.list = res.post_demand_list;
            this.total = res.post_demand_count;
          } else {
            this.$message({
              message: res.message,
              type: "error",
            });
          }
          this.listLoading = false;
        })
        .catch((err) => {
          this.listLoading = false;
          console.log(err);
        });
    },
    // 获取注册者服务信息
    getRegisterServerData(params) {
      let data = params;
      let applyList = [];
      this.$api
        .registerList({ choose: 2 })
        .then((res) => {
          res.xyr_register_list.forEach((item) => {
            applyList.push({
              certNo: item.certNo,
              cellphone: item.cellphone,
              amount: item.amount * 1 * 100,
            });
          });
          data.applyList = JSON.stringify(applyList);
          this.insertData(data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //提交数据
    insertData(data) {
      this.$api
        .uploadManager(data)
        .then((res) => {
          this.isLoading = false;
          let response = JSON.parse(res);
          if (response.code == "00000") {
            this.$message({
              message: "上传成功！",
              type: "success",
            });
            this.insertDepositUrl(response.depositUrl, response.reqId);
          } else {
            this.$message({
              message: response.msg,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
          this.$message({
            message: err.msg,
            type: "error",
          });
        });
    },
    // 上传返回链接
    insertDepositUrl(url, reqId) {
      this.$api
        .saveLink({ deposit_url: url, reqId })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
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

    //上传
    submitData(row) {
      //获取小鱼儿口令
      this.isLoading = true;
      let params = {
        xyeAct: "15921638245",
        openNo: "021803069",
        secret: "87AC305F8EFB6AB2FA8BF194DA02D8A1",
      };
      this.$api
        .getKey(params)
        .then((res) => {
          let resData = JSON.parse(res);
          if (resData.code == "00000") {
            this.token = resData.token;
            //注册参数
            let signParams = {
              timestamp: minutesTimeFormat2(),
              token: resData.token,
              reqId: row.reqid,
            };
            this.getRegisterServerData(signParams);
          } else {
            this.$message({
              message: resData.msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$message({
            message: error.msg,
            type: "error",
          });
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
    },
  },
};
</script>
<style scoped>
.main_list {
  margin-top: 30px;
}
</style>
