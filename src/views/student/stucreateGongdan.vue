<template>
  <div class="right clearfix">
    <div class="form-boxes">
      <el-form  label-width="80px">
        <el-form-item label="问题描述">
          <el-input v-model="problem" style="margin-left:10px;width:550px" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-upload
            style="margin-left:10px"
            :action="actionPath"
            multiple
            :limit="1"
            :file-list="fileList"
            :on-success="fileSuccess">
            <el-button type="primary" style="font-size: 14px;">上传<i class="el-icon-upload el-icon--right"></i></el-button>
            <div slot="tip" class="el-upload__tip">只能上传图片，且只能上传一张图片(非必选项)</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="contactinformation" style="margin-left:10px;width:550px"></el-input>
        </el-form-item>
        <el-form-item style="margin-left:10px">
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
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
      fileList: [],
      file_name: '', // 上传图片
      actionPath: '',
      problem: '', // 问题描述
      contactinformation: '', // 联系方式
      id: '',
      identity: '',
      school_name: '',
      nickname: '',
      
    };
  },
  created() {
    this.actionPath = `${BASE_URL}admin/paper/updatafile`;
    this.id = localStorage.getItem("id");
    this.identity = localStorage.getItem("identity");
    this.school_name = localStorage.getItem("school_name");
    this.nickname = localStorage.getItem("nickname");
  },

  computed: {},
  methods: {
    fileSuccess(response, file, fileList){
      this.file_name = response.info
      console.log(this.file_name)
    },
    async onSubmit() {
      if(this.problem.replace(/\s*/g,"") == ''){
        this.$message({message: "问题描述不能为空",type: "warning",duration: 2000});
        return false;
      }
      if(this.contactinformation.replace(/\s*/g,"") == ''){
        this.$message({message: "联系方式不能为空",type: "warning",duration: 2000});
        return false;
      }
      const res = await this.$http.post("admin/teacher/addgongdan",qs.stringify({
        id: this.id,
        identity: this.identity,
        school_name: this.school_name,
        nickname: this.nickname,
        problem: this.problem,
        img_url: this.file_name,
        contactinformation: this.contactinformation
      }));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({message: res.data.info,type: "success",duration: 2000});
        this.contactinformation = '';
        this.file_name = '';
        this.problem = '';
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
  box-sizing: border-box;
  background-color: #fff;
  overflow: hidden;
  min-height: 100%;

  padding-top: 20px;
  .form-boxes {
    width: 660px;
    text-align: left;
    margin: 20px;
    margin-top: 0;
    padding: 30px 20px 20px 15px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    .el-form-item .el-form-item--small {
      line-height: 50px;
    }
  }
}
</style>
