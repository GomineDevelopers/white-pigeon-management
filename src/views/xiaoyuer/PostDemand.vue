<template>
  <el-row class="post_demand">
    <!-- 面包屑 -->
    <span class="breadcrumb">需求发布</span>
    <el-form
      :label-position="labelPosition"
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      :model="ruleForm"
    >
      <el-row class="form_body">
        <el-form-item label="客户平台id" prop="id">
          <el-input disabled v-model="ruleForm.id" placeholder="请生成客户平台id"></el-input>
          <el-button class="coustom_id" type="primary" @click="creatId">生成平台id</el-button>
        </el-form-item>
        <el-form-item label="需求标题" prop="reqTitle">
          <el-input v-model="ruleForm.reqTitle" maxlength="30" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="需求内容" prop="reqDes">
          <el-input
            v-model="ruleForm.reqDes"
            type="textarea"
            maxlength="1000"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="需求金额（单位：分）" prop="reqAmount">
          <el-input v-model="ruleForm.reqAmount" type="number"></el-input>
        </el-form-item>
        <el-form-item label="服务者人数（最大值100人）" prop="serNumber">
          <el-input v-model="ruleForm.serNumber" type="number"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="ruleForm.startTime"
            type="datetime"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="ruleForm.endTime"
            type="datetime"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="分类" prop="class">
          <!-- <el-input v-model="ruleForm.class"></el-input> -->
          <el-cascader
            v-model="ruleForm.class"
            :options="classifyOptions"
            :props="classifyOptionProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="省市区" prop="city">
          <!-- <el-input v-model="ruleForm.city"></el-input> -->
          <el-cascader
            v-model="ruleForm.city"
            :options="options"
            :props="optionProps"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-row>
      <el-row class="form_bottom">
        <el-form-item class="last_form_item">
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-row>
</template>
<script>
import { minutesTimeFormat2 } from "../../js/public.js";
export default {
  name: "PostDemand",
  data() {
    // 需求金额 不超过5000000人
    let checkServerPrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入需求金额"));
      } else if (value > 5000000) {
        return callback(new Error("需求金额不大于5000000分"));
      } else {
        callback();
      }
    };
    // 服务人数验证 不超过100人
    let checkServerNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入服务者人数"));
      } else if (value > 100) {
        return callback(new Error("服务者人数最多不超过100人"));
      } else {
        callback();
      }
    };
    return {
      labelPosition: "top",
      classifyOptions: [], //分类的数据
      classifyOptionProps: {
        value: "id",
        label: "name",
        children: "items",
      },
      options: [], //省市区的数据
      optionProps: {
        value: "id",
        label: "name",
        children: "children",
      },
      ruleForm: {
        id: "",
        reqTitle: "",
        reqDes: "",
        reqAmount: "",
        serNumber: "",
        startTime: "",
        endTime: "",
        class: [],
        city: [],
      },
      rules: {
        id: [{ required: true, message: "请生成平台id", trigger: "blur" }],
        reqTitle: [{ required: true, message: "请输入需求标题", trigger: "blur" }],
        reqDes: [{ required: true, message: "请输入需求内容", trigger: "blur" }],
        reqAmount: [{ required: true, validator: checkServerPrice, trigger: "blur" }],
        serNumber: [
          {
            required: true,
            validator: checkServerNum,
            trigger: "blur",
          },
        ],
        startTime: [{ required: true, message: "请选择开始时间", trigger: "change" }],
        endTime: [{ required: true, message: "请选择结束时间", trigger: "change" }],
        class: [{ required: true, message: "请选择分类", trigger: "change" }],
        city: [{ required: true, message: "请选择省市区", trigger: "change" }],
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.options = areaArray;
      this.classifyOptions = this.getTreeData(XYE.categoryData);
    });
  },
  methods: {
    handleChange(value) {
      // console.log(value);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.getKey();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    //获取小鱼儿口令
    getKey() {
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
              id: this.ruleForm.id,
              reqTitle: this.ruleForm.reqTitle,
              reqDes: this.ruleForm.reqDes,
              reqAmount: this.ruleForm.reqAmount,
              serNumber: this.ruleForm.serNumber,
              startTime: this.formatTime(this.ruleForm.startTime),
              endTime: this.formatTime(this.ruleForm.endTime),
              class: this.ruleForm.class[1],
              province: this.ruleForm.city[0],
              city: this.ruleForm.city[1],
              district: this.ruleForm.city[2],
            };
            this.addData(signParams);
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

    // 发布数据
    addData(params) {
      this.$api
        .postDemand(params)
        .then((res) => {
          let response = JSON.parse(res);
          if (response.code == "00000") {
            this.$message({
              message: "发送成功！",
              type: "success",
            });
            this.ruleForm = {
              id: "",
              reqTitle: "",
              reqDes: "",
              reqAmount: "",
              serNumber: "",
              startTime: "",
              endTime: "",
              class: [],
              city: [],
            };
            this.$router.replace("/server");
          } else {
            this.$message({
              message: response.msg,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: err.msg,
            type: "error",
          });
        });
    },
    // 生成客户平台ID
    creatId() {
      let customId = new Date().getTime().toString();
      this.ruleForm.id = Number(customId.substr(customId.length - 9));
    },
    // 格式化时间
    formatTime(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = this.isLessThanTen(date.getMonth() + 1);
      let day = this.isLessThanTen(date.getDate());
      let hours = this.isLessThanTen(date.getHours());
      let minutes = this.isLessThanTen(date.getMinutes());
      let seconds = this.isLessThanTen(date.getSeconds());

      return `${year}${month}${day}${hours}${minutes}${seconds}`;
    },
    // 判断是否小于10，如果小于10就补0
    isLessThanTen(t) {
      return t < 10 ? `0${t}` : t;
    },
    //处理分类为空的items
    // 递归判断列表，把最后的items设为undefined
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
      return data;
    },
  },
};
</script>
<style>
.post_demand .el-form--label-top .el-form-item__label {
  padding: 0 0 0px;
}
.post_demand .el-form .el-form-item__content {
  width: 400px;
}
.post_demand .el-form .el-form-item {
  margin-bottom: 10px;
}
</style>
<style scoped>
.post_demand {
  height: 100%;
}
.post_demand .el-form {
  margin-top: 20px;
  height: 100%;
  position: relative;
}
.post_demand .coustom_id {
  margin-top: 10px;
}
.form_body {
  height: calc(100% - 80px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 20px;
}
.post_demand .el-form .last_form_item {
  border-top: 1px solid #f0f0f0;
  height: 60px;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  margin-bottom: 0px !important;
}
.post_demand .el-form .el-form-item__content .el-cascader,
.post_demand .el-form .el-form-item__content .el-date-editor--date {
  width: 100%;
}
</style>
