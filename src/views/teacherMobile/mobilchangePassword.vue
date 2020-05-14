<template>
  <div class="right">
    <div class="form-boxes">
      <el-form
      label-width="100px"
      class="demo-ruleForm"> 
      <el-form-item label="姓名">
        <el-input v-model="nickname" style="width:200px;margin-left:10px"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="password" style="width:200px;margin-left:10px" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="affirmPsw" style="width:200px;margin-left:10px" type="password" @blur="teaConfirmPsd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" style="margin-left:10px;padding:12px 20px">立即修改</el-button>
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
      password: '',
      id: '',
      affirmPsw: ''
    };
  },
  created() {
    this.id = localStorage.getItem("id");
    this.getItem();
  },
  computed: {},
  methods: {
    async getItem(){
      const res = await this.$http.get(`admin/teacher/teacherChangePassword?id=${this.id}`);
      if (res.status === 200 && res.data.code === "1") {
        this.nickname = res.data.info.nickname;
      }
    },
    teaConfirmPsd(){ //确认密码
      if(this.password != this.affirmPsw){
        this.$message({message: "确认密码与填写密码不同",type: "error",duration: 3000});
        this.affirmPsw = ''
      }
    },
    async submitForm(){
      if(this.nickname == ''){
        this.$message({message: "请填写姓名",type: "warning",duration: 2000});
        return false;
      }
      if(this.password == ''){
        this.$message({message: "请输入密码",type: "warning",duration: 2000});
        return false;
      }
      if(this.password.length < 5){
        this.$message({message: "密码长度不能少于五位",type: "warning",duration: 2000});
        return false;
      }
      if(this.password != this.affirmPsw){
        this.$message({message: "确认密码与填写密码不同",type: "error",duration: 3000});
        this.affirmPsw = '';
        return false;
      }
      const res = await this.$http.post("admin/teacher/teacherChangePassword",qs.stringify({
        nickname: this.nickname,
        password: this.password,
        id: this.id
      }));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({message: res.data.info,type: "success",duration: 2000});
        this.nickname = '',
        this.affirmPsw = '',
        this.password = ''
      } else {
        this.$message({message: res.data.info,type: "warning",duration: 2000});
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/css/index.less");
.right {
  background-color: #fff;
  min-height: 100%;
  overflow: hidden;
  .form-boxes {
    // width: 480px;
    text-align: left;
    // margin: 20px 0 20px 20px;
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