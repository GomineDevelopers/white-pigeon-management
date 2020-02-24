<template>
  <el-row class="post_demand">
    <el-form
      :label-position="labelPosition"
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      :model="ruleForm"
    >
      <el-row class="form_body">
        <el-form-item label="客户平台id" prop="platformId">
          <el-input v-model="ruleForm.platformId" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="需求标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="需求内容" prop="content">
          <el-input v-model="ruleForm.content"></el-input>
        </el-form-item>
        <el-form-item label="需求金融" prop="finance">
          <el-input v-model="ruleForm.finance"></el-input>
        </el-form-item>
        <el-form-item label="服务者人数" prop="number">
          <el-input v-model="ruleForm.number"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="ruleForm.startTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="ruleForm.endTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="分类" prop="classify">
          <el-input v-model="ruleForm.classify"></el-input>
        </el-form-item>
        <el-form-item label="省市区" prop="city">
          <el-input v-model="ruleForm.city"></el-input>
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
export default {
  name: "PostDemand",
  data() {
    return {
      labelPosition: "top",
      ruleForm: {
        platformId: "",
        title: "",
        content: "",
        finance: "",
        number: "",
        startTime: "",
        endTime: "",
        classify: "",
        city: ""
      },
      rules: {
        platformId: [
          { required: true, message: "请输入平台id", trigger: "blur" }
        ],
        title: [{ required: true, message: "请输入需求标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入需求内容", trigger: "blur" }
        ],
        finance: [
          { required: true, message: "请输入需求金融", trigger: "blur" }
        ],
        number: [
          { required: true, message: "请输入服务者人数", trigger: "blur" }
        ],
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "blur" }
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "blur" }
        ],
        classify: [{ required: true, message: "请输入分类", trigger: "blur" }],
        city: [{ required: true, message: "请选择省市区", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
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
  height: 100%;
  position: relative;
}
.form_body {
  height: calc(100% - 60px);
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
</style>
