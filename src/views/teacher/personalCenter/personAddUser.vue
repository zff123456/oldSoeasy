<template>
  <div class="right">
    <div class="form-boxes">
      <el-form
      label-width="100px"
      class="demo-ruleForm"> 
      <el-form-item label="姓名">
        <el-input v-model="nickname" style="width:200px;margin-left:10px"></el-input>
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="name" style="width:200px;margin-left:10px"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="password" style="width:200px;margin-left:10px" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" style="margin-left:10px;padding:12px 20px">立即创建</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      nickname: '',
      name: '',
      password: ''
    };
  },
  created() {

  },
  computed: {},
  methods: {
    async submitForm(){
      if(this.nickname == ''){
        this.$message({message: "请填写姓名",type: "warning",duration: 2000});
        return false;
      }
      if(this.name == ''){
        this.$message({message: "请填写账号",type: "warning",duration: 2000});
        return false;
      }
      if(this.password == ''){
        this.$message({message: "请输入密码",type: "warning",duration: 2000});
        return false;
      }
      if(this.password.length > 20 || this.password.length < 5){
        this.$message({message: "密码长度为5-20位",type: "warning",duration: 2000});
        return false;
      }
      const res = await this.$http.post("admin/Personal/addpersonal",qs.stringify({
        nickname: this.nickname,
        name: this.name,
        password: this.password
      }));
      console.log(res);
      if (res.status === 200 && res.data.code === "1") {
        this.$message({message: res.data.info,type: "success",duration: 2000});
        this.nickname = '',
        this.name = '',
        this.password = ''
      } else {
        this.$message({message: res.data.info,type: "warning",duration: 2000});
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../../assets/css/index.less");
.right {
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  
  .form-boxes {
    width: 480px;
    text-align: left;
    margin: 20px 0 20px 20px;
    padding: 20px 20px 20px 0px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    .el-form-item {
      line-height: 50px;
      .el-form-item--small .el-form-item__content, 
      .el-form-item--small .el-form-item__label {
        line-height: 50px;
      }
    }
  }
}
</style>