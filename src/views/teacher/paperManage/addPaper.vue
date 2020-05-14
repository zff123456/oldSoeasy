<template>
  <div class="right">
    <div class="form-boxes">
      <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"> 
      <el-form-item label="所属题库">
        <el-select v-model="paper_ty" placeholder="请选择题库" style="width:200px;margin-left:10px">
          <el-option
            v-for="item in paperList"
            :key="item.id"
            :label="item.name"
            :value="[item.id,item.name]"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="试卷类型">
        <el-radio-group v-model="ruleForm.type" style="margin-left:10px">
          <el-radio label="1">真题</el-radio>
          <el-radio label="2">模拟题</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="试卷名称">
        <el-input v-model="ruleForm.test_paper_name" style="width:200px;margin-left:10px"></el-input>
      </el-form-item>
      <el-form-item label="试卷所属">
        <el-radio-group v-model="ruleForm.subordinate" style="margin-left:10px">
          <el-radio label="0">系统</el-radio>
          <el-radio label="1">学校</el-radio>
          <el-radio label="2">教师</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="使用方式">
        <el-radio-group v-model="ruleForm.paper_type" style="margin-left:10px">
          <el-radio label="0">系统训练使用</el-radio>
          <el-radio label="1">预约考试</el-radio>
          <el-radio label="2">即来即考</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择时间">
        <div class="block">
          <el-date-picker
            :disabled="ruleForm.paper_type == 0 || ruleForm.paper_type == ''"
            style="margin-left:10px;width:360px"
            v-model="value2"
            value-format="timestamp"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00', '08:00:00']">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="上传音频">
        <el-input v-model="file_name_na"  placeholder="输入听力文件名称(非必填)" style="width:200px;margin-left:10px"></el-input>
      </el-form-item>
      <el-form-item v-if="file_name_na !== ''">
        <el-upload 
          style="margin-left:10px"
          class="upload-demo"
          :action="actionPath"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :on-success="fileSuccess">
          <el-button type="primary" style="font-size: 14px;">上传<i class="el-icon-upload el-icon--right"></i></el-button>
          <div slot="tip" class="el-upload__tip">只能上传mp3格式文件，且只能上传一个文件</div>
        </el-upload>
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
      // isCheck: 1,
      // goods_introduce: '',
      // paperId: 1,
      // paperName: 2,
      fileList: [],
      file_name: '',
      value2: '', // 时间
      ruleForm: {
        type: '', // 试卷类型
        test_paper_name: '', // 试卷名称
        subordinate: '', // 试卷所属
        paper_type: '', // 使用方式
      },
      paperList: [],
      paper_ty: [],
      file_name_na: '',
      start_time: '',
      end_time: '',
      actionPath: '',
      id: '',
      school_id: '',
      post_id: 0,
    };
  },
  created() {
    this.id = localStorage.getItem("id");
    this.school_id = localStorage.getItem("school_id");
    this.actionPath = `${BASE_URL}admin/paper/updatafile`;
    this.getPaper()
  },
  computed: {},
  methods: {
    async getPaper(){
      const res = await this.$http.post("admin/paper/testpapertypelst",);
      if (res.status === 200 && res.data.code === "1") {
        this.paperList = res.data.info
      }
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    fileSuccess(response, file, fileList){
      let str = response.info;
      let spl = str.substring(str.length-3)
      if(spl == 'mp3' || spl == "MP3"){
        this.file_name = response.info;
      } else {
        this.$message({message: "只能上传mp3格式的音频文件",type: "warning",duration: 2000});
      }
    },
    async submitForm(){
      if(this.paper_ty == ''){
        this.$message({message: "请选择题库",type: "warning",duration: 2000});
        return false;
      }
      const test_paper_type_id = this.paper_ty[0];
      const test_paper_type_name = this.paper_ty[1];
      console.log(test_paper_type_id,test_paper_type_name)
      
      if(this.ruleForm.type == ''){
        this.$message({message: "请选择试卷类型",type: "warning",duration: 2000});
        return false;
      }
      if(this.ruleForm.test_paper_name.replace(/\s*/g,"") == ''){
        this.$message({message: "请选择试卷名称",type: "warning",duration: 2000});
        return false;
      }
      if(this.ruleForm.subordinate == ''){
        this.$message({message: "请选择试卷所属",type: "warning",duration: 2000});
        return false;
      }
      if(this.ruleForm.paper_type == ''){
        this.$message({message: "请选择使用方式",type: "warning",duration: 2000});
        return false;
      }
      if (this.value2 !== ''){
        this.start_time = this.value2[0];
        this.end_time = this.value2[1];
      }
      if(this.ruleForm.subordinate == 1){
        this.post_id = this.school_id
      };
      if (this.ruleForm.subordinate == 2 ){
        this.post_id = this.id;
      }
      const res = await this.$http.post("admin/paper/addupdatatestpaper",qs.stringify({ 
        test_paper_type_id: test_paper_type_id, 
        test_paper_type_name:  test_paper_type_name,
        type: this.ruleForm.type,
        test_paper_name: this.ruleForm.test_paper_name.replace(/\s*/g,""),
        subordinate: this.ruleForm.subordinate,
        paper_type: this.ruleForm.paper_type,
        start_time: this.start_time,
        end_time: this.end_time,
        file: this.file_name,
        file_name: this.file_name_na.replace(/\s*/g,""),
        subordinate_id: this.post_id,
        id: 0
        
      }));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({message: res.data.info,type: "success",duration: 2000});
        console.log("创建成功")
        this.paper_ty = "";
        this.ruleForm.type = "";
        this.ruleForm.test_paper_name = "";
        this.ruleForm.subordinate = "";
        this.ruleForm.paper_type = "";
        this.value2  = "";
        this.file_name_na = "";
        this.file_name = ""
      } else {
        this.$message({message: res.data.info,type: "error",duration: 2000});
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