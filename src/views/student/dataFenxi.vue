<template>
  <div class="right" v-loading="isLoading" element-loading-text="拼命加载中">
    <!-- <div class="search-box">
      <div class="title">选择教师</div>
      <el-select v-model="tracher" placeholder="请选择教师" @change="changeTeacher">
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
        <el-select v-model="classes" placeholder="请选择班级" @change="changeClass">
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
      <el-select v-model="type" placeholder="请选择学生">
        <el-option
          v-for="item in stuList"
          :key="item.id"
          :label="item.nickname"
          :value="[item.id,item.nickname]"
        ></el-option>
      </el-select>
      <el-button type="primary" style="margin-left:30px" @click="">搜索</el-button>
    </div> -->
    <div class="table-box">
      <el-table :data="flatten(tableData.slice((currentPage -1) * pagesize, currentPage * pagesize))" stripe style="" border class="table" :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}">
        <el-table-column prop="test_paper_name" label="试卷名称" min-width="170"></el-table-column>
        <el-table-column prop="school_name" label="我的学校"></el-table-column>
        <el-table-column prop="teacher_name" label="我的老师" ></el-table-column>
        <el-table-column prop="class_name" label="我的班级"></el-table-column>
        <el-table-column prop="u_nickname" label="我的姓名" min-width="90"></el-table-column>
        <el-table-column prop="u_name" label="我的账号" min-width="90"></el-table-column>
        <el-table-column prop="start_time" label="开始考试时间" min-width="160">
          <template slot-scope="scope">{{ scope.row.start_time | time}}</template>
        </el-table-column>
        <el-table-column prop="addtime" label="交卷时间" min-width="160">
          <template slot-scope="scope">{{ scope.row.addtime | time}}</template>
        </el-table-column>
        <el-table-column prop="manfen" label="试卷总分"></el-table-column>
        <el-table-column prop="zongfen" label="我的得分" min-width="70"></el-table-column>
        <el-table-column label="操作" align="center" min-width="110">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" :disabled="scope.row.state == 0" @click="startKaoshi(scope.row)">再做一次</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页插件。 -->
      <div style="float:right;padding-top:5px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          layout="total, prev, pager, next,jumper"
          :total="tableData.length"
        ></el-pagination>
      </div>

    </div>
    <!-- 导出Excel -->
    <el-button type="primary" @click="exportExcel" icon="el-icon-upload2" class="excel">导出Excel</el-button>
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
    };
  },
  created() {
    this.teacher_id = localStorage.getItem("id");
    this.nickname = localStorage.getItem("nickname");
    this.school_id = localStorage.getItem("school_id");
    
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
      const res = await this.$http.post("admin/teacher/tubiaofenxi", qs.stringify({ student_id: this.teacher_id}));
      console.log(this.teacher_id);
      
      if (res.status === 200 && res.data.code === "1") {
        this.tableData = res.data.info
      }
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
      this.type = "";
      this.getClass();
    },
    async getClass() { // 获取班级
      const res = await this.$http.post(
        "admin/login/classlst",
        qs.stringify({ teacher_id: this.tracher[0] })
      );
      console.log(res.data.info);
      if (res.status === 200 && res.data.code === "1") {
        this.classList = res.data.info;
      }
    },
    changeClass(){
      this.type = "";
      this.getStu();
    },
    async getStu() { // 获取学生
      const res = await this.$http.post(
        "admin/login/studentlst",
        qs.stringify({ class_id: this.classes[0] })
      );
      console.log(res.data.info);
      if (res.status === 200 && res.data.code === "1") {
        this.stuList = res.data.info;
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
  .search-box {
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    float: left;
    .title {
      color: @theme;
      float: left;
      font-size: 14px;
      margin-right: 20px;
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
}
</style>