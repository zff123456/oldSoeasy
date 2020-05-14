<template>
  <div class="right" v-loading="isLoading" element-loading-text="拼命加载中">
    <div class="search-box">
      <el-input v-model="type" placeholder="请输入学生姓名" style="width:300px;" clearable></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchStu" style="margin-left:20px">搜索</el-button>
    </div>
    <div class="table-box">
      <el-table stripe style="" border :data="tableData" :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}">
        <el-table-column prop="nickname" label="学生姓名" width="130"></el-table-column>
        <el-table-column prop="class_name" label="班级" width="130"></el-table-column>
        <el-table-column prop="teacher_name" label="所属教师" width="130"></el-table-column>
        <el-table-column prop="name" label="账号"></el-table-column>
        <el-table-column prop="create_time" label="注册时间" min-width="160">
          <template slot-scope="scope">{{ scope.row.create_time | time}}</template>
        </el-table-column>
        <el-table-column prop="login_ip" label="登录IP" min-width="120"></el-table-column>
        <el-table-column label="操作" align="center" min-width="140">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="removeClass(scope.row)">转移班级</el-button>
            <el-button size="mini" type="primary" @click="checket(scope.row)">重置密码</el-button>
            <el-button size="mini" type="danger" @click="open(scope.row)">删除</el-button>
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
          :total="currLength"
        ></el-pagination>
      </div>
      <el-dialog title="转移班级" :visible.sync="isTeacherBlock" class="dialog">
        <el-form label-position="left">
          <el-form-item label="选择">
            <el-select v-model="teacherValue" placeholder="请选择班级" style="width:270px">
              <el-option v-for="item in teacherList" :key="item.id" :label="item.class_name" :value="[item.id,item.class_name]"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="isTeacherBlock = false">取 消</el-button>
          <el-button type="primary" @click="tracherListSubmit">确 定</el-button>
        </div>
      </el-dialog>


    </div>

    
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      // labelPosition: left,
      tableData: [],
      isLoading: false,
      type: '',
      id: '',
      school_id: '',
      isLoading: false,
      pagesize: 15,
      currentPage: 1,
      currLength: 0,
      isTeacherBlock:false,
      // 班级的数据
      teacherList:[],
      teacherValue:[],
      teacherName:'',
      teacher_id:'',
      classId:'',
      studentId:[]

    };
  },
  created() {
    this.id = localStorage.getItem("id");
    this.school_id = localStorage.getItem("school_id");
    this.getList();
  },
  computed: {},
  methods: {
    // async getUserList(){
    //   this.getList()
    // },
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
      const res = await this.$http.post("admin/teacher/studentlstnew", qs.stringify({school_id: this.school_id, currentpage: this.currentPage, nickname: this.type}));
      console.log(res);
      
      if (res.status === 200 && res.data.code === "1") {
        // console.log("666",res.data.info)
        this.tableData = res.data.info.user;
        this.currLength = res.data.info.pageinfo.sum;
        this.pagesize = parseInt(res.data.info.pageinfo.page);
      }
    },
    blockState(e){
      // if(e.status == 1) { return "正常"} else { return "等待审核" }
    },
    async checket(e){
      if(this.school_id==67&&this.id!=828){
      this.$message({message: '请尽快联系袁利老师',type: "error",duration: 2000});
    }else{
      const res = await this.$http.post("admin/teacher/studentpwdupdata", qs.stringify({id: e.id}));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({message: res.data.info,type: "success",duration: 2000});
        this.getList();
      } else {
        this.$message({message: res.data.info,type: "error",duration: 2000});
      }
    }
    },
    // 转移班级
  async  removeClass(e){
          console.log(e);
          this.studentId.push(e.id)
          this.classId = e.class_id
      this.isTeacherBlock = true;
      // this.id_list = stuArr;
      const res = await this.$http.post("admin/teacher/classlst", qs.stringify({ teacher_id: '',school_id: e.school_id}));
      console.log(res);
      if (res.status === 200 && res.data.code === "1") {
        this.teacherList=res.data.info
        // const classList = [];
        // for(var j = 0; j < res.data.info.length ; j++) {
        //   if (res.data.info[j].id != this.id) {
        //     classList.push(res.data.info[j])
        //   }
        }
      
      // const res = await this.$http.post("admin/teacher/classlst", qs.stringify({ teacher_id: '',school_id: e.school_id}));
          
    },
    // 转移到其他班级发起请求
  async tracherListSubmit(){
      const res = await this.$http.post("admin/teacher/studentzhuanyi", 
      qs.stringify({ id: this.classId,newclass_id: this.teacherValue[0], newclass_name: this.teacherValue[1],id_list:this.studentId}));
  console.log(res);
if (res.status === 200 && res.data.code === "1") {
  this.isTeacherBlock = false;
  this.$message({
          message: res.data.info,
          type: 'success'
        });
        this.getList()
        this.studentId=[]
        this.teacherValue=[]

}else{
  this.$message({
          message: res.data.info,
          type: 'error'
        });
}
    },
    open(e) { // 删除学生提示
    if(this.school_id==67&&this.id!=828){
      this.$message({message: '请尽快联系袁利老师',type: "error",duration: 2000});
    }else{
      this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
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
    }
    },
    async delit(e){ // 删除学生。
      const res = await this.$http.post("admin/teacher/userdel", qs.stringify({id: e.id}));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({message: res.data.info,type: "success",duration: 2000});
        this.getList();
      } else {
        this.$message({message: res.data.info,type: "error",duration: 2000});
      }
    },
    async searchStu(){ // 搜索姓名
      this.currentPage = 1;
      this.getList();
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../../assets/css/index.less");
.right {
  background-color: #fff;
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  .search-box {
    height: 50px;
    line-height: 50px;
    padding: 0 10px;
    .title {
      color: @theme;
      float: left;
      font-size: 14px;
      margin-right: 20px;
    }
  }
  .table-box {
    padding: 10px;
    padding-top: 10px;
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