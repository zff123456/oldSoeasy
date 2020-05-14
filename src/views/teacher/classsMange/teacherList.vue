<template>

  <div class="right" v-loading="isLoading" element-loading-text="拼命加载中">
    <div class="search-box">
      <el-input v-model="type" placeholder="请输入教师姓名" style="width:300px;" clearable></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchStu" style="margin-left:20px">搜索</el-button>
    </div>
    <div class="table-box">
      <el-table stripe style="" border :data="flatten(tableData.slice((currentPage -1) * pagesize, currentPage * pagesize))" :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}">
        <el-table-column prop="nickname" label="教师姓名" width="130"></el-table-column>
        <el-table-column prop="name" label="账号"></el-table-column>
        <el-table-column prop="create_time" label="注册时间" min-width="160">
          <template slot-scope="scope">{{ scope.row.create_time | time}}</template>
        </el-table-column>
        <el-table-column prop="login_ip" label="登录IP" min-width="100"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="bianji(scope.row)"   >编辑</el-button>
            <el-button size="mini" type="primary" @click="checket(scope.row)"  >重置密码</el-button>
            <el-button size="mini" type="danger" @click="open(scope.row)"   >删除</el-button>
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
    <!-- 修改信息表单表单 -->
    <el-dialog title="修改信息" :visible.sync="dialogFormVisible" width="500px" custom-class="cuotidialog" ref="dialog" style="margin-left:-300px;margin-top:23vh">
      <el-form :model="form" label-width="40px">
        <el-form-item label="姓名" >
          <el-input v-model="form.name" label-width="400px"></el-input>
        </el-form-item>
        <el-form-item label="账号" >
          <el-input v-model="form.zhanghao" label-width="400px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCheck">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      disabled:false,
      tableData: [],
      isLoading: false,
      type: '',
      id: '',
      school_id: '',
      isLoading: false,
      pagesize: 15,
      currentPage: 1,
      dialogFormVisible: false,
      form: {
      name: '',
      zhanghao: '',
      id: ''
      }
    };
  },
  created() {
    this.id = localStorage.getItem("id");
    this.school_id = localStorage.getItem("school_id");
    console.log(this.id,this.school_id)
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
      const res = await this.$http.post("admin/teacher/teacherlstnew", qs.stringify({school_id: this.school_id, nickname: ''}));
      if (res.status === 200 && res.data.code === "1") {
        this.tableData = res.data.info
      }
    },
    blockState(e){
      // if(e.status == 1) { return "正常"} else { return "等待审核" }
    },
    async checket(e){ // 重置密码
        console.log(this.id,this.school_id)
      if(this.school_id==67&&this.id!=828){
        // this.disabled=true
        console.log(111)
         this.$message({message: '请尽快联系袁利老师',type: "error",duration: 4000});
         return
      }else{

      const res = await this.$http.post("admin/teacher/teacherpwdupdata", qs.stringify({id: e.id}));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({message: res.data.info,type: "success",duration: 2000});
        this.getList();
      } else {
        this.$message({message: res.data.info,type: "error",duration: 2000});
      }
      }
    },
    open(e) { // 删除学生提示
      console.log(this.id,this.school_id)
      if(this.school_id==67&&this.id!=828){
        // this.disabled=true
        console.log(111)
         this.$message({message: '请尽快联系袁利老师',type: "error",duration: 4000});
         return
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
    async delit(e){ 
      // 删除学生。
      // console.log(111)
     

        const res = await this.$http.post("admin/teacher/tecacherdel", qs.stringify({id: e.id}));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({message: res.data.info,type: "success",duration: 4000});
        this.getList();
      } else {
        this.$message({message: res.data.info,type: "error",duration: 4000});
      }

      
    
    },
    async bianji(e){
       console.log(111)
       console.log(this.id,this.school_id)
      if(this.school_id==67&&this.id!=828){
        // this.disabled=true
        console.log(111)
         this.$message({message: '请联系袁利老师',type: "error",duration: 4000});
         return
      }else{
        this.dialogFormVisible = true;
        this.form.name = e.nickname;
        this.form.zhanghao = e.name;
        this.form.id = e.id;
      }
      // return
     
    },
    async searchStu(){ // 搜索姓名
      if (this.type == ''){
        this.getList();
        return false;
      };
      const res = await this.$http.post("admin/teacher/teacherlstnew", qs.stringify({nickname: this.type, school_id:this.school_id}));
      if (res.status === 200 && res.data.code === "1") {
        this.tableData = res.data.info;
      } else {
        this.$message({ message: "未搜索到此学生信息", type: "error", duration: 3000});
      }
    },
    async submitCheck(){ // 提交
      this.dialogFormVisible = false;
      if (this.form.name.trim() == '' ){
        this.$message({message: "姓名不能为空",type: "error",duration: 4000});
        return false;
      };
      if (this.form.zhanghao.trim() == ''){
        this.$message({message: "账号不能为空",type: "error",duration: 4000});
        return false;
      };
      const res = await this.$http.post("admin/teacher/teacherupdata", qs.stringify({id: this.form.id,nickname: this.form.name, name: this.form.zhanghao}));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({message: res.data.info,type: "success",duration: 4000});
        this.getList();
      } else {
        this.$message({message: res.data.info,type: "error",duration: 4000});
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
  // overflow: hidden;
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
</style>