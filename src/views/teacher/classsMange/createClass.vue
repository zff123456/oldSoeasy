<template>
  <div class="right">
    <div class="titleBox">
      <ul>
        <li>班级名称</li>
        <li><el-input v-model="classname" style="width:150px;border-radius: 2px;" placeholder="必填项"></el-input></li>
        <li>班级人数</li>
        <li><el-input v-model="people" style="width:150px;border-radius: 2px;" type="number" placeholder="必填项"></el-input></li>
        <li><el-button type="primary" @click="submitForm" style="margin-left:10px;padding:7.5px 14px">新增班级</el-button></li>
        <!-- <li><el-button type="primary" @click="tishi" style="margin-left:10px;padding:7.5px 14px">新增班级</el-button></li> -->
      </ul>
    </div>

    <div class="table-box">
      <el-table :data="flatten(tableData.slice((currentPage -1) * pagesize, currentPage * pagesize))" stripe style="" border :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}">
        <el-table-column prop="teacher_name" label="教师姓名"></el-table-column>
        <el-table-column prop="class_name" label="班级名称"></el-table-column>
        <el-table-column prop="student_num" label="应有学生数"></el-table-column>
        <el-table-column prop="use_num" label="班级注册人数"></el-table-column>
        <el-table-column prop="addtime" label="添加时间" min-width="180">
          <template slot-scope="scope">{{ scope.row.addtime | time}}</template>
        </el-table-column>
        <el-table-column prop="update_time" label="最近修改时间" min-width="180">
          <template slot-scope="scope">{{ scope.row.update_time | time}}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="400" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="speak(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="open(scope.row)">删除</el-button>
            <el-button size="mini" type="primary" @click="transferaseStu(scope.row)">学生</el-button>
            <el-button size="mini" type="warning" @click="transferaseTeacher(scope.row)">转移</el-button>
            <el-button size="mini" type="primary" @click="exportFour(scope.row, '作文')">导出四级作文</el-button>
            <el-button size="mini" type="primary" @click="exportFour(scope.row, '篇章翻译')">导出四级翻译</el-button>
            <el-button size="mini" type="primary" @click="exportExcel(scope.row)">导出成绩</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
    <!--  导出的成绩表格  -->
    <div class="table-box" v-show="false">
      <el-table :data="excelTabal" stripe border :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}" class="table">
        <el-table-column prop="nickname" label="姓名"></el-table-column>
        <el-table-column prop="name" label="学号"></el-table-column>
        <el-table-column prop="cishu" label="做题次数"></el-table-column>
        <el-table-column prop="zuigaofeng" label="最高分"></el-table-column>
        <el-table-column prop="zuidifeng" label="最低分"></el-table-column>
        <el-table-column prop="pingjunfen" label="平均分"></el-table-column>
      </el-table>
    </div>
    <!--  导出的四级作文  -->
    <div class="table-box" v-show="false">
      <el-table :data="excelZuowen" stripe border :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}" class="tafour">
        <el-table-column prop="u_nickname" label="学生姓名"></el-table-column>
        <el-table-column prop="u_name" label="学生学号"></el-table-column>
        <el-table-column prop="test_paper_name" label="试卷名称"></el-table-column>
        <el-table-column prop="addtime" label="添加时间">
          <template slot-scope="scope">{{ scope.row.addtime | time}}</template>
        </el-table-column>
        <el-table-column prop="wenti" label="问题"></el-table-column>
        <el-table-column prop="user_yn" label="学生答案"></el-table-column>
        <!-- <el-table-column prop="pingjunfen" label="平均分"></el-table-column> -->
      </el-table>
    </div>
    <!-- 编辑班级信息弹框 -->
    <el-dialog title="修改信息" :visible.sync="dialogFormVisible" class="dialog">
      <el-form :model="form" :label-position="labelPosition">
        <el-form-item label="班级名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="应有学生数" :label-width="formLabelWidth">
          <el-input v-model="form.people" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sbmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 转移教师弹出框 -->
    <el-dialog title="转移班级" :visible.sync="isTeacherBlock" class="dialog">
      <el-form :label-position="labelPosition">
        <el-form-item label="选择教师">
          <el-select v-model="teacherValue" placeholder="请选择教师" style="width:270px">
            <el-option v-for="item in teacherList" :key="item.id" :label="item.nickname" :value="[item.id,item.nickname]"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isTeacherBlock = false">取 消</el-button>
        <el-button type="primary" @click="tracherListSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import XLSX from "xlsx";
import FileSaver from "file-saver";
export default {
  data() {
    return {
      classname: '',
      people: '',
      teacher_id: '',
      school_id: '',
      school_name: '',
      nickname: '',
      pagesize: 15,
      currentPage: 1,
      tableData: [],
      labelPosition: 'left',
      isLoading: false,
      dialogFormVisible: false,
      form: {
        name: '',
        people: '',
      },
      formLabelWidth: '105px',
      one_id: '',
      isTeacherBlock: false,
      teacherValue: "",
      teacherList: [],
      teach_id: '',
      teacher_name: '',
      type: "我的班级",
      excelTabal: [],
      excelZuowen: [],
    };
  },
  created() {
    this.teacher_id = localStorage.getItem("id");
    this.school_id = localStorage.getItem("school_id");
    this.school_name = localStorage.getItem("school_name");
    // 老师的名称
    this.nickname = localStorage.getItem("nickname");
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
    // async getList(){
    //   const res = await this.$http.post("admin/Examination/AppointmentExaminationlst", qs.stringify({ subordinate: 1, subordinate_id: this.school_id}));
    //   if (res.status === 200 && res.data.code === "1") {
    //     this.tableData = res.data.info
    //   }
    //   console.log(this.tableData)
    // },
    async getList(){
      console.log(this.teacher_id)
      if(this.type == '我的班级' || this.type == 1){
        const res = await this.$http.post("admin/teacher/classlst", qs.stringify({ teacher_id: this.teacher_id,school_id: ''}));
        if (res.status === 200 && res.data.code === "1") {
          this.tableData = res.data.info
        }
      } else {
        const res = await this.$http.post("admin/teacher/classlst", qs.stringify({ teacher_id: '',school_id: this.school_id}));
        if (res.status === 200 && res.data.code === "1") {
          this.tableData = res.data.info
        }
      }
    },
    speak(e){ // 修改数据
      this.dialogFormVisible = true;
      this.form.name = e.class_name;
      this.form.people = e.student_num;
      this.one_id = e.id;
    },
    async sbmit(){ // 提交修改
      if (this.form.name.replace(/\s*/g,"") == "") {
        this.$message({ message: "班级名称不能为空", type: "error", duration: 2000});
        return false;
      }
      if (this.form.people.replace(/\s*/g,"") == "") {
        this.$message({ message: "应有学生数不能为空", type: "error", duration: 2000});
        return false;
      }
      const res = await this.$http.post("admin/teacher/updatateacherclass", qs.stringify({ id: this.one_id, class_name: this.form.name.replace(/\s*/g,""),student_num: this.form.people.replace(/\s*/g,"") }));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({ message: res.data.info, type: "success", duration: 3000});
        this.dialogFormVisible = false;
        this.getList()
      }else {
        this.$message({ message: res.data.info, type: "error", duration: 3000});
      }
    },
    transferaseStu(e){ 
      // 转移班级
      localStorage.setItem("transferaseId", e.id); 
      // 转移的班级id
      this.$router.push({ name: "studentListMange" });
    },
    async transferaseTeacher(e){ // 列表之中转移到班级
      const res = await this.$http.get(`admin/teacher/classzhuanyi?id=${e.id}&teacher_id=${this.teacher_id}&school_id=${this.school_id}`);
      if (res.status === 200 && res.data.code === "1") {
        this.teacherList = res.data.info;
        this.one_id = e.id;
      }
      this.isTeacherBlock = true;
    },
    open(e) { // 删除学生提示
      this.$confirm('此操作将永久删除该班级, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delit(e);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async delit(e){ // 删除班级
      const res = await this.$http.post("admin/teacher/delclass", qs.stringify({ id: e.id}));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({ message: res.data.info, type: "success", duration: 3000});
        this.getList()
      }else {
        this.$message({ message: res.data.info, type: "error", duration: 3000});
      }
    },
    async tracherListSubmit(){ // 提交更换教师名下
      if (this.teacherValue == ""){
        this.$message({ message: res.data.info, type: "warning", duration: 3000});
        return false;
      };
      this.teach_id = this.teacherValue[0];
      this.teacher_name = this.teacherValue[1];
      const res = await this.$http.post("admin/teacher/classzhuanyi", qs.stringify({ id: this.one_id,teacher_id: this.teach_id, teacher_name: this.teacher_name}));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({ message: res.data.info, type: "success", duration: 3000});
        this.getList();
        this.isTeacherBlock = false;
        this.teacherValue = "";
      }else {
        this.$message({ message: res.data.info, type: "error", duration: 3000});
        console.log(res.data)
      }
    },
    async submitForm(){
      if(this.classname.replace(/\s*/g,"") == ''){
        this.$message({message: "请填写班级姓名",type: "warning",duration: 2000});
        return false;
      }
      if(this.people.replace(/\s*/g,"") == ''){
        this.$message({message: "请填写班级人数",type: "warning",duration: 2000});
        return false;
      }
      const res = await this.$http.post("admin/teacher/addteacherclass",qs.stringify({
        class_name: this.classname.replace(/\s*/g,""),
        student_num: this.people.replace(/\s*/g,""),
        teacher_id: this.teacher_id,
        school_id: this.school_id,
        school_name: this.school_name,
        teacher_name: this.nickname
      }));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({message: res.data.info,type: "success",duration: 2000});
        this.classname = '';
        this.people = '';
        this.getList()
      } else {
        this.$message({message: res.data.info,type: "warning",duration: 2000});
      }
    },
    async exportExcel( chengji ) {
      const res = await this.$http.post("admin/teacher/classstudentachievementexcl", qs.stringify({ class_id: chengji.id }));
      if (res.status === 200 && res.data.code === "1") {
        this.excelTabal = res.data.info
        // if (this.excelTabal == []){ return false; }
      } else {
        this.$message({ message: "暂无数据", type: "error", duration: 3000});
      }
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
    async exportFour( chengji , name){
      const res = await this.$http.post("admin/teacher/zuowenfanyidaochu", qs.stringify({ cet: 1, type_name: name, class_id: chengji.id  }));
      console.log(res);
      
      if (res.status === 200 && res.data.code === "1") {
        this.excelZuowen = res.data.info
      }
      let getCurrentPage = this.currentPage;
      this.pagesize = 99999;
      this.currentPage = 1;
      this.$nextTick(function () {
        let time = new Date();
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        let name = year + "" + month + "" + day;
        var wb = XLSX.utils.table_to_book(document.querySelector(".tafour"));
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
    tishi(){
      this.$message({ message: "教室版无法创建班级", type: "error", duration: 3000});
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../../assets/css/index.less");
.right {
  background-color: #fff;
  min-height: 100%;
  overflow: hidden;
  .titleBox {
    ul {
      float: right;
      vertical-align: bottom;
      height: 40px;
      line-height: 40px;
      li {
        float: left;
        margin: 0 5px;
        color: #333;
      }
    }
  }
  .table-box {
    padding: 10px;
    margin-top: 40px;
  }
}
.dialog {
  width: 400px;
  margin: 20vh auto 0;
}
.cell .el-button {
  padding: 4px 9px;
  font-size: 12px;
}
</style>