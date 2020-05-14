<template>
  <div class="right" v-loading="isLoading" element-loading-text="拼命加载中">
    <!-- 信息筛选。 -->
    <div class="search-box">
      <span>试卷筛选</span>
      <el-select v-model="getPaperId" clearable placeholder="请选择试卷类型">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-select v-model="getPaperType" clearable placeholder="请选择真题或模拟题">
        <el-option
          v-for="item in opts"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="search" style="margin-left:20px">搜索</el-button>
    </div>
    <!-- 表格筛选。 -->
    <div class="table-box">
      <el-table style="width: 100%" border="" stripe :data="flatten(tableData.slice((currentPage -1) * pagesize, currentPage * pagesize))" :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}">
        <el-table-column prop="id" label="Id" width="65"></el-table-column>
        <el-table-column prop="test_paper_name" label="试卷名称" min-width="120"></el-table-column>
        <el-table-column label="试卷类型" width="90">
          <template slot-scope="scope">{{blockType(scope.row.type)}}</template>
        </el-table-column>
        <el-table-column prop="test_paper_type_name" label="所属题库" width="100"></el-table-column>
        <el-table-column label="所属" width="80">
          <template slot-scope="scope">{{subordinate(scope.row.subordinate)}}</template>
        </el-table-column>
        <el-table-column label="开始时间" min-width="100">
          <template slot-scope="scope">{{ scope.row.start_time | time}}</template>
        </el-table-column>
        <el-table-column prop="end_time" label="结束时间" min-width="100">
          <template slot-scope="scope">{{ scope.row.end_time | time}}</template>
        </el-table-column>
        <el-table-column label="音频文件名称" min-width="130">
          <template slot-scope="scope">{{blockFile_name(scope.row.file_name)}}</template>
        </el-table-column>
        <el-table-column label="当前状态" width="80">
          <template slot-scope="scope">{{lookState(scope.row.state)}}</template>
        </el-table-column>
        <el-table-column prop="cishu" label="考试次数"></el-table-column>
        <el-table-column prop="zuigaofeng" label="最高分"></el-table-column>
        <el-table-column prop="zuidifeng" label="最低分"></el-table-column>
        <el-table-column prop="pingjunfen" label="平均分"></el-table-column>
        <el-table-column label="操作" align="center" width="110">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" :disabled="scope.row.state == 0"  @click="startKaoshi(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页插件。 -->
      <div style="float:right;padding-top:5px;height:40px;margin-right:15px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          layout="total, prev, pager, next,jumper"
          :total="tableData.length"
        ></el-pagination>
      </div>
    <!-- 弹出框。 -->
    <el-dialog title="修改信息" :visible.sync="dialogFormVisible" style="text-align:left" class="dialog">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" label-position="left">
        <el-form-item label="所属题库">
          <el-select v-model="paper_ty" placeholder="请选择题库" style="width:200px;margin-left:-25px">
            <el-option
              v-for="item in paperList"
              :key="item.id"
              :label="item.name"
              :value="[item.id,item.name]"
              v-model="paper_ty"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="试卷类型">
          <el-radio-group v-model="ruleForm.type" style="margin-left:-25px">
            <el-radio :label="1" v-model="ruleForm.type">真题</el-radio>
            <el-radio :label="2" v-model="ruleForm.type">模拟题</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="试卷名称">
          <el-input v-model="ruleForm.test_paper_name" style="width:200px;margin-left:-25px"></el-input>
        </el-form-item>
        <el-form-item label="试卷所属">
          <el-radio-group v-model="ruleForm.subordinate" style="margin-left:-25px">
            <el-radio :label="0" v-model="ruleForm.subordinate">系统</el-radio>
            <el-radio :label="1" v-model="ruleForm.subordinate">学校</el-radio>
            <el-radio :label="2" v-model="ruleForm.subordinate">教师</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="使用方式">
          <el-radio-group v-model="ruleForm.paper_type" style="margin-left:-25px">
            <el-radio :label="0" v-model="ruleForm.paper_type">系统训练使用</el-radio>
            <el-radio :label="1" v-model="ruleForm.paper_type">预约考试</el-radio>
            <el-radio :label="2" v-model="ruleForm.paper_type">即来即考</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择时间">
          <div class="block">
            <el-date-picker
              :disabled="ruleForm.paper_type == 0 || ruleForm.paper_type == ''"
              style="margin-left:-25px;width:360px"
              v-model="value2"
              value-format="timestamp"
              type="datetimerange"
              align="right"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00', '08:00:00']"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="上传音频">
          <el-input
            v-model="file_name_na"
            placeholder="输入听力文件名称(非必填)"
            style="width:200px;margin-left:-25px"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="file_name_na !== ''">
          <el-upload
            style="margin-left:-25px"
            class="upload-demo"
            :action="actionPath"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :on-success="fileSuccess"
          >
            <el-button type="primary" style="font-size: 14px;">上传
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
            <div slot="tip" class="el-upload__tip">只能上传mp3格式文件，且只能上传一个文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      isLoading: true,
      pagesize: 15,
      currentPage: 1,
      tableData: [],
      value: "",
      dialogFormVisible: false,
      fileList: [],
      file_name: "",
      value2: "", // 时间
      ruleForm: {
        type: "", // 试卷类型
        test_paper_name: "", // 试卷名称
        subordinate: "", // 试卷所属
        paper_type: "" // 使用方式
      },
      paperList: [],
      paper_ty: [],
      file_name_na: "",
      start_time: "",
      end_time: "",
      test_paper_type_id: '',
      test_paper_type_name: '',
      list_id: '',
      options: [],
      actionPath: '',
      opts: [
        {value: '1',label: '真题'},
        {value: '2',label: '模拟题'}
      ],
      getPaperId: '',
      getPaperType: '',
      teacher_id: '',
    };
  },
  created() {
    // this.revision();
    this.actionPath = `${BASE_URL}admin/paper/updatafile`;
    this.school_id = localStorage.getItem("school_id");
    this.teacher_id = localStorage.getItem("id");
    this.getPaperList();
    this.getPaper();
    this.getList();
  },
  computed: {},
  methods: {
    handleSizeChange(val) {
      this.pagesize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    flatten(arr) {
      var res = [];
      arr.map(item => {
        if (Array.isArray(item)) {
          res = res.concat(flatten(item));
        } else {
          res.push(item);
        }
      });
      return res;
    },
    async getPaperList() {
      this.isLoading = true;
      this.currentPage = 1;
      console.log(this.teacher_id,this.getPaperId,this.getPaperType)
      const res = await this.$http.post("admin/paper/testpaperlst",qs.stringify({ 
        teacher_id: this.teacher_id,
        test_paper_type_id: this.getPaperId,
        type: this.getPaperType
      }));
      if (res.status === 200 && res.data.code === "1") {
        this.tableData = res.data.info;
        this.isLoading = false;
      }
    },
    blockType(e){
      // e == 0?return "真题" : return '模拟题';
      if(e == 1){ return "真题" } else { return '模拟题' }
    },
    lookState(e){
      if (e == 0) {
        return "等待审核";
      } else if (e == 1) {
        return "正常";
      } else {
        return "删除";
      }
    },
    subordinate(i) {
      if (i == 0) {
        return "系统";
      } else if (i == 1) {
        return "学校";
      } else {
        return "教师";
      }
    },
    blockFile_name(i){
      if (i == "") {
        return "无";
      } else {
        return i;
      }
    },
    async delit(e) {
      // console.log("admin/paper/deltestpaper",i);
      console.log("eeeeee::,,",e.id);
      const res = await this.$http.post("admin/paper/deltestpaper", qs.stringify({id: e.id}));
      if (res.status === 200 && res.data.code === "1") {
        console.log(res.data);
        this.$message({message: res.data.info,type: "success",duration: 2000});
        this.getPaperList();
      }
    },
    async shenhe(i,e) {
      console.log("eeeeee::,,",e.id);
      const res = await this.$http.post("admin/paper/passtheaudit", qs.stringify({id: e.id}));
      if (res.status === 200 && res.data.code === "1") {
        console.log(res.data);
        this.$message({message: res.data.info,type: "success",duration: 2000});
        this.getPaperList();
      }
    },
    async revision(i, e) {
      // console.log(e.id);
      this.dialogFormVisible = true;
      const res = await this.$http.post("admin/paper/onetestpaper", qs.stringify({id: e.id}));
      if (res.status === 200 && res.data.code === "1") {
        this.test_paper_type_id = res.data.info.test_paper_type_id;
        this.test_paper_type_name = res.data.info.test_paper_type_name;
        this.ruleForm.type = res.data.info.type;
        this.ruleForm.test_paper_name = res.data.info.test_paper_name;
        this.ruleForm.subordinate = res.data.info.subordinate;
        this.ruleForm.paper_type = res.data.info.paper_type;
        this.start_time = res.data.info.start_time;
        this.end_time = res.data.info.end_time;
        // subordinate_id: 0,
        this.file_name = res.data.info.file;
        this.file_name_na = res.data.info.file_name;
        this.list_id = e.id;
      }
    },
    async getPaper() {
      const res = await this.$http.post("admin/paper/testpapertypelst");
      if (res.status === 200 && res.data.code === "1") {
        this.paperList = res.data.info;
      }
    },
    async submitForm(){
      if (this.paper_ty !== ""){
        this.test_paper_type_id = this.paper_ty[0];
        this.test_paper_type_name = this.paper_ty[1];
      }
      if(this.ruleForm.test_paper_name == ''){
        this.$message({message: "请填写试卷名称",type: "warning",duration: 2000});
        return false;
      }
      if (this.value2 !== ''){
        this.start_time = this.value2[0];
        this.end_time = this.value2[1];
      }
      if (this.file == ''){
        this.file_name = "";
      }
      if (this.ruleForm.paper_type == 0){
        this.start_time = "";
        this.end_time = ""
      }
      const res = await this.$http.post("admin/paper/addupdatatestpaper",qs.stringify({ 
        test_paper_type_id: this.test_paper_type_id, 
        test_paper_type_name:  this.test_paper_type_name,
        type: this.ruleForm.type,
        test_paper_name: this.ruleForm.test_paper_name,
        subordinate: this.ruleForm.subordinate,
        paper_type: this.ruleForm.paper_type,
        start_time: this.start_time,
        end_time: this.end_time,
        subordinate_id: 0,
        file: this.file_name,
        file_name: this.file_name_na,
        id: this.list_id
      }))
      if (res.status === 200 && res.data.code === "1") {
        this.dialogFormVisible = false;
        this.$message({message: res.data.info,type: "success",duration: 2000});
        console.log("上传成功");
        this.getPaperList();
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
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
    startKaoshi(e){ // 开始考试
    console.log(111)
      localStorage.setItem("kaoshiId", e.id);
      console.log(e);
      
      if (e.test_paper_type_id == 1){ this.$router.push({ name: "fourKaoshi",params: { isChakan: 0} },) };
      if (e.test_paper_type_id == 2){ this.$router.push({ name: "sixKaoshi",params: { isChakan: 0} }) };
      if (e.test_paper_type_id == 3){ this.$router.push({ name: "aKaoshi",params: { isChakan: 0} }) };
      if (e.test_paper_type_id == 4){ this.$router.push({ name: "bKaoshi",params: { isChakan: 0} }) };
    },
    async getList(){
      const res = await this.$http.post("admin/Examination/tiku", qs.stringify({ school_id: this.school_id}));
      if (res.status === 200 && res.data.code === "1") {
        this.options = res.data.info;
      };
    },
    search(){
      if (this.getPaperId == ''){
        this.$message({message: "请选择试卷类型",type: "error",duration: 4000});
        return false;
      } else if ( this.getPaperType == '' ){
        this.$message({message: "请选择真题或模拟题",type: "error",duration: 4000});
      } else {
        this.getPaperList();
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../../assets/css/index.less");
.cell .el-button {
  padding: 4px 9px;
  font-size: 12px;
}
.right {
  min-height: 100%;
  background-color: #fff;
  overflow: hidden;
  .search-box {
    text-align: left;
    color: @theme;
    height: 60px;
    line-height: 60px;
    margin-bottom: 5px;
    padding-left: 25px;
    .el-select {
      margin-left: 20px;
    }
  }
  .table-box {
    padding: 0 20px;
  }
}
.dialog {
  width: 500px;
  margin: 15vh auto 0;
}
</style>