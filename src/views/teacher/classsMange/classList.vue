<template>
  <div class="right" v-loading="isLoading" element-loading-text="拼命加载中">
    <!-- <div class="search-box">
      <div class="title">选择班级类型</div>
      <el-select v-model="type" placeholder="我的班级" @change="getUserList">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
    </div> -->
    <div class="table-box">
      <el-table :data="flatten(tableData.slice((currentPage -1) * pagesize, currentPage * pagesize))" stripe style="" border :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}">
        <el-table-column prop="teacher_name" label="教师姓名" width="150"></el-table-column>
        <el-table-column prop="class_name" label="班级名称"></el-table-column>
        <el-table-column prop="student_num" label="应有学生数"></el-table-column>
        <el-table-column prop="use_num" label="班级注册人数"></el-table-column>
        <el-table-column prop="addtime" label="添加时间" min-width="180">
          <template slot-scope="scope">{{ scope.row.addtime | time}}</template>
        </el-table-column>
        <el-table-column prop="update_time" label="最近修改时间" min-width="180">
          <template slot-scope="scope">{{ scope.row.update_time | time}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="speak(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="open(scope.row)">删除</el-button>
            <el-button size="mini" type="primary" @click="transferaseStu(scope.row)">学生</el-button>
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
export default {
  data() {
    return {
      labelPosition: 'left',
      tableData: [],
      isLoading: false,
      options: [
        {
          value: "1",
          label: "我的班级"
        },
        {
          value: "2",
          label: "全校班级"
        }
      ],
      type: 1,
      teacher_id: '',
      school_id: '',
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
      pagesize: 15,
      currentPage: 1,
    };
  },
  created() {
    this.teacher_id = localStorage.getItem("id");
    this.school_id = localStorage.getItem("school_id");
    console.log( this.teacher_id,this.school_id )
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
    async getUserList(){
      this.getList()
    },
    async getList(){
      if(this.type == '123' || this.type == 2){
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
      if (this.form.name == "") {
        this.$message({ message: "班级名称不能为空", type: "error", duration: 2000});
        return false;
      }
      if (this.form.people == "") {
        this.$message({ message: "应有学生数不能为空", type: "error", duration: 2000});
        return false;
      }
      const res = await this.$http.post("admin/teacher/updatateacherclass", qs.stringify({ id: this.one_id, class_name: this.form.name,student_num: this.form.people }));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({ message: res.data.info, type: "success", duration: 3000});
        this.dialogFormVisible = false;
        this.getList()
      }else {
        this.$message({ message: res.data.info, type: "error", duration: 3000});
      }
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
    transferaseStu(e){ // 转移班级
      localStorage.setItem("transferaseId", e.id); // 转移的班级id
      this.$router.push({ name: "teacherStuList" });
    },
    async transferaseTeacher(e){ // 列表之中转移到班级
      const res = await this.$http.get(`admin/teacher/classzhuanyi?id=${e.id}&teacher_id=${this.teacher_id}&school_id=${this.school_id}`);
      if (res.status === 200 && res.data.code === "1") {
        this.teacherList = res.data.info;
        this.one_id = e.id;
      }
      this.isTeacherBlock = true;
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
        this.getList()
        this.isTeacherBlock = false;
        this.teacherValue = "";
      }else {
        this.$message({ message: res.data.info, type: "error", duration: 3000});
        console.log(res.data)
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
  width: 100%;
  overflow: hidden;
  .search-box {
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    .title {
      color: @theme;
      float: left;
      font-size: 14px;
      margin-right: 20px;
    }
  }
  .table-box {
    padding: 10px;
    // margin-top: 10px;
  }
}
.cell .el-button {
  padding: 4px 9px;
  font-size: 12px;
}
input::-webkit-input-placeholder{
    color:#000;
}
input::-moz-placeholder{   /* Mozilla Firefox 19+ */
    color:#000;
}
input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
    color:#000;
}
input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
    color:#000;
}
.dialog {
  width: 400px;
  margin: 20vh auto 0;
}
</style>