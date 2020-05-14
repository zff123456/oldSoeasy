<!-- 考试统计。 -->
<template>
  <div class="right" v-loading="isLoading" element-loading-text="拼命加载中">
    <div class="search-box">
      <div class="title">选择教师</div>
      <el-select v-model="tracher" placeholder="请选择教师" @change="changeTeacher" clearable style="width:120px;">
        <el-option
          v-for="item in teacherList"
          :key="item.id"
          :label="item.nickname"
          :value="[item.id,item.nickname]"
        ></el-option>
      </el-select>
    </div>
    <div class="search-box">
      <div class="title">选择班级</div>
        <el-select v-model="classes" placeholder="请选择班级" @change="changeClass" style="width:150px;">
          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.class_name"
            :value="[item.id,item.class_name]"
          ></el-option>
        </el-select>
    </div>
    <div class="search-box">
      <div class="title">选择学生</div>
      <el-select v-model="type" placeholder="请选择学生" style="width:120px;">
        <el-option
          v-for="item in stuList"
          :key="item.id"
          :label="item.nickname"
          :value="[item.id,item.nickname]"
        ></el-option>
      </el-select>
      <el-button type="primary" style="margin: 10px;" @click="search">搜索</el-button>
    </div>
    
    <!-- <div class="block">
      <el-date-picker
        v-model="value2"
        type="datetimerange"
        value-format="timestamp"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="选择开始日期"
        end-placeholder="选择结束日期"
        align="right"
        style="margin:10px;width:340px;">
      </el-date-picker>
    </div> -->
      
    <div class="table-box">
      <el-table :data="tableData" stripe style="" border class="table" :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}">
        <el-table-column prop="school_name" label="学校名称"></el-table-column>
        <el-table-column prop="teacher_name" label="教师名称" ></el-table-column>
        <el-table-column prop="class_name" label="班级名称"></el-table-column>
        <el-table-column prop="u_nickname" label="学生姓名" min-width="90"></el-table-column>
        <el-table-column prop="u_name" label="学生账号" min-width="90"></el-table-column>
        <el-table-column prop="start_time" label="开始考试时间" min-width="160">
          <template slot-scope="scope">{{ scope.row.start_time | time}}</template>
        </el-table-column>
        <el-table-column prop="addtime" label="交卷时间" min-width="160">
          <template slot-scope="scope">{{ scope.row.addtime | time}}</template>
        </el-table-column>
        <el-table-column prop="manfen" label="试卷总分"></el-table-column>
        <el-table-column prop="" label="等级" min-width="70">
          <template slot-scope="scope">{{ grade(scope.row.test_paper_type_id) }}</template>
        </el-table-column>
        <el-table-column prop="zongfen" label="我的得分" min-width="70"></el-table-column>
        <el-table-column label="操作" align="center" min-width="110" v-if="identity != 1">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" :disabled="scope.row.state == 0" @click="startKaoshi(scope.row)" >再做一次</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页插件。 -->
      <div style="float:right;padding-top:5px;overflow: hidden;width:100%;text-align: right;">
        <el-pagination
          small
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          :current-page="currentPage"
          layout="total, prev, pager, next"
          :total="currLength"
        ></el-pagination>
      </div>

    </div>
    <!-- 导出Excel -->
    <a  style="height:24px; width:102px;display: inline-block;float: right;margin-top:6px;" download  ref="herf" :href="aherf()">
      <el-button type="primary"  icon="el-icon-upload2" class="excel">导出Excel</el-button>
    </a>
    <!-- <el-button type="primary" @click="exportExcel" icon="el-icon-upload2" class="excel">导出Excel</el-button> -->
  </div>
</template>
<script>
import qs from "qs";
import XLSX from "xlsx";
import FileSaver from "file-saver";
export default {
  data() {
    return {
      tableData: [],
      isLoading: false,
      teacherList: [],
      tracher: '',
      classList: [],
      classes: '',
      stuList: [],
      type: '',
      teacher_id: '',
      school_id: '',
      subordinate_id: '',
      pagesize: 15,
      currentPage: 1,
      nickname: '',
      teacheride: '',
      classide: '',
      uide: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      value2: '',
      identity: '',
      start_time: '',
      end_time: '',
      downloadUrl: '',
      currLength: 0,
    };
  },
  created() {
    this.teacher_id = localStorage.getItem("id");
    this.nickname = localStorage.getItem("nickname");
    this.school_id = localStorage.getItem("school_id");
    this.identity = localStorage.getItem("identity");
    // this.downloadUrl = `${BASE_URL}admin/teacher/studentexcl?school_id=${this.school_id}&teacher_id=${this.teacheride}&class_id=${this.classide}&u_id=${this.uide}&start_time=${this.start_time}&end_time=${this.end_time}`;
    this.getList();
    this.getTeacher();
  },
  computed: {},
  methods: {
    handleSizeChange(val) {
      this.pagesize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
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
    async getList(){
      this.tracher == ''? this.teacheride = '' : this.teacheride = this.tracher[0];
      this.classes == ''? this.classide = '' : this.classide = this.classes[0];
      this.type == ''? this.uide = '' : this.uide = this.type[0];
      if (!this.value2 || this.value2 == ''){ this.start_time = '';this.end_time = '' } else { this.start_time = this.value2[0]/1000;this.end_time = this.value2[1]/1000 };
      const res = await this.$http.post("admin/teacher/teachertubiaofenxinew", qs.stringify({ school_id: this.school_id, teacher_id: this.teacheride, class_id: this.classide, u_id:this.uide, start_time: this.start_time, end_time: this.end_time, currentpage: this.currentPage,}));
      // console.log(res.data.info)
      if (res.status === 200 && res.data.code === "1") {
        // this.tableData = res.data.info;
        // console.log(res.data.info)
        this.tableData = res.data.info.user_add_paper;
        this.currLength = res.data.info.pageinfo.sum;
        this.pagesize = parseInt(res.data.info.pageinfo.page);
      }
    },
    search(){
      this.currentPage = 1;
      // if (this.tracher[0] && this.type == "") {
      //   this.$message({ message: "选择教师之后，必须具体到某位学生，方可查询", type: "error", duration: 4000});
      //   return false;
      // }
      this.getList();
    },
    aherf(){
      this.tracher == ''? this.teacheride = '' : this.teacheride = this.tracher[0];
      this.classes == ''? this.classide = '' : this.classide = this.classes[0];
      this.type == ''? this.uide = '' : this.uide = this.type[0];
      if (!this.value2 || this.value2 == ''){ this.start_time = '';this.end_time = '' } else { this.start_time = this.value2[0]/1000;this.end_time = this.value2[1]/1000 };
      return `${BASE_URL}admin/teacher/studentexcl?school_id=${this.school_id}&teacher_id=${this.teacheride}&class_id=${this.classide}&u_id=${this.uide}&start_time=${this.start_time}&end_time=${this.end_time}`;
    },
    async qvxiaoYuyue(e){ // 取消预约
      const res = await this.$http.post("admin/Examination/quxiaoyuyue", qs.stringify({ id: e.id}));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({ message: res.data.info, type: "success", duration: 3000});
        this.getList();
      } else {
        this.$message({ message: res.data.info, type: "error", duration: 3000});
      }
    },
    startKaoshi(e){
      localStorage.setItem("kaoshiId", e.test_paper_id);
      if (e.test_paper_type_id == 1){ this.$router.push({ name: "fourKaoshi", params: { isChakan: 0}}) };
      if (e.test_paper_type_id == 2){ this.$router.push({ name: "sixKaoshi",params: { isChakan: 0}}) };
      if (e.test_paper_type_id == 3){ this.$router.push({ name: "aKaoshi",params: { isChakan: 0}}) };
      if (e.test_paper_type_id == 4){ this.$router.push({ name: "bKaoshi",params: { isChakan: 0}}) };
    },
    exportExcel() {
      let getCurrentPage = this.currentPage;
      this.pagesize = 99999;
      this.currentPage = 1;
      this.$nextTick(function () {
        let time = new Date();
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        let name = year + "" + month + "" + day;
        var wb = XLSX.utils.table_to_book(document.querySelector(".table"));
        var wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array"
        });
        try {
          FileSaver.saveAs(
            new Blob([wbout], { type: "application/octet-stream" }),
            name + ".xlsx"
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
        this.pagesize = 15;
        this.currentPage = getCurrentPage;
        return wbout;
      })
    },
    grade( e ){
      if (e == 1){ return "四级" };
      if (e == 2){ return "六级" };
      if (e == 3){ return "A级" };
      if (e == 4){ return "B级" };
      if (e == 5){ return "其他" };
    },
    async getTeacher() { // 获取教师
      const res = await this.$http.post(
        "admin/login/teacherlst",
        qs.stringify({ school_id: this.school_id })
      );
      if (res.status === 200 && res.data.code === "1") {
        this.teacherList = res.data.info;
      }
    },
    changeTeacher(){
      this.classes = "";
      this.classList = [];
      this.type = "";
      this.stuList = [];
      if (this.tracher == "" || !this.tracher){
        this.value2 = '';
        return false;
      }
      this.getClass();
    },
    async getClass() { // 获取班级
      const res = await this.$http.post(
        "admin/login/classlst",
        qs.stringify({ teacher_id: this.tracher[0] })
      );
      if (res.status === 200 && res.data.code === "1") {
        this.classList = res.data.info;
      }
    },
    changeClass(){
      this.type = "";
      this.stuList = [];
      this.getStu();
    },
    async getStu() { // 获取学生
      const res = await this.$http.post(
        "admin/login/studentlst",
        qs.stringify({ class_id: this.classes[0] })
      );
      if (res.status === 200 && res.data.code === "1") {
        this.stuList = res.data.info;
      }
    },
    // admin/teacher/studentexcl
    async exceptor() { // 导出数据
      const res = await this.$http.get(
        "admin/teacher/studentexcl",
        qs.stringify({})
      );
      if (res.status === 200 && res.data.code === "1") {
        // this.stuList = res.data.info;
        console.log(res);
      }
    },
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/css/index.less");
.right {
  background-color: #fff;
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  padding-bottom: 20px;
  box-sizing: border-box;
  .search-box {
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    float: left;
    .title {
      color: @theme;
      float: left;
      font-size: 14px;
      margin-right: 10px;
    }
  }
  .table-box {
    padding: 10px;
    // padding-top: 0;
  }
}
.cell .el-button {
  padding: 4px 9px;
  font-size: 12px;
}
.excel {
  padding: 4px 9px;
  font-size: 12px;
  float: right;
  margin-right: 12px;
  // margin: 10px 20px 15px;
  // margin-top: 20px;
}
</style>