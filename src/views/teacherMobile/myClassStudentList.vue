<template>
  <div class="right" v-loading="isLoading" element-loading-text="拼命加载中">
    <div class="search-box">
      <el-input v-model="type" placeholder="请输入学生姓名" style="width:6.666667rem;" clearable></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchStu" style="margin-left:20px">搜索</el-button>
    </div>
    <div class="table-box">
      <el-table stripe ref="multipleTable" border class="table"
      :data="flatten(tableData.slice((currentPage -1) * pagesize, currentPage * pagesize))" 
      @selection-change="handleSelectionChange" :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}">
        <el-table-column type="selection" width="42"></el-table-column>
        <el-table-column prop="nickname" label="学生姓名" min-width="60"></el-table-column>
        <el-table-column prop="class_name" label="班级" min-width="60"></el-table-column>
        <!-- <el-table-column prop="teacher_name" label="所属教师" width="130"></el-table-column> -->
        <el-table-column prop="name" label="账号"></el-table-column>
        <!-- <el-table-column prop="create_time" label="注册时间" min-width="160">
          <template slot-scope="scope">{{ scope.row.create_time | time}}</template>
        </el-table-column>
        <el-table-column prop="login_ip" label="登录IP" min-width="140"></el-table-column> -->
        <el-table-column label="操作" align="center" min-width="80">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="checket(scope.row)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页插件。 -->
      <div style="float:right;padding-top:15px;width:100%;text-align:right">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          layout=" prev, pager, next"
          :total="tableData.length"
        ></el-pagination>
      </div>
      <!-- 转移按钮box -->
      <!-- <div class="transfer-box">
        <el-button type="primary" @click="goback">返回我的班级</el-button>
      </div> -->
      <div class="transfer-box">
        <el-button type="primary" @click="transfer">转移到其他班级</el-button>
      </div>
      <!-- 导出Excel -->
      <el-button type="primary" @click="exportExcel" icon="el-icon-upload2" class="excel" style="float: right;margin-top: .266667rem;">导出Excel</el-button>
    </div>
    <!-- 转移学生,弹出班级列表 -->
    <el-dialog title="转移学生" :visible.sync="isTeacherBlock" class="dialog">
      <el-form :label-position="labelPosition">
        <el-form-item label="选择班级">
          <el-select v-model="classValue" placeholder="请选择班级" style="width:270px">
            <el-option v-for="item in classList" :key="item.id" :label="item.class_name" :value="[item.id,item.class_name]"></el-option>
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
      tableData: [],
      id: '',
      isLoading: false,
      pagesize: 15,
      currentPage: 1,
      multipleSelection: [],
      isTeacherBlock: false,
      classValue: '',
      classList: [],
      labelPosition: "left",
      newClass_id: '',
      newClass_name: '',
      id_list: [],
      options: [],
      type: '',
    };
  },
  created() {
    // this.id = localStorage.getItem("id");
    this.school_id = localStorage.getItem("school_id");
    this.id = localStorage.getItem("transferaseId");
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
      const res = await this.$http.post("admin/teacher/classstudentlst", qs.stringify({id: this.id}));
      if (res.status === 200 && res.data.code === "1") {
        this.tableData = res.data.info
      }
    },
    async transfer(){
      const stuArr = [];
      for ( var i = 0 ; i < this.multipleSelection.length ; i++) {
        stuArr.push(this.multipleSelection[i].id)
      }
      if (this.multipleSelection.length == 0){
        this.$message({ message: "请选择至少一名学生", type: "error", duration: 3000});
        return false;
      }
      this.isTeacherBlock = true;
      this.id_list = stuArr;
      const res = await this.$http.post("admin/teacher/classlst", qs.stringify({ teacher_id: '',school_id: this.school_id}));
      if (res.status === 200 && res.data.code === "1") {
        const classList = [];
        for(var j = 0; j < res.data.info.length ; j++) {
          if (res.data.info[j].id != this.id) {
            classList.push(res.data.info[j])
          }
        }
        this.classList = classList;
      }
    },
    async tracherListSubmit(){ // 提交更换班级下
      if ( this.classValue.length == 0){
        this.$message({ message: "请选择教师", type: "error", duration: 3000});
        return false;
      };
      this.newClass_id = this.classValue[0];
      this.newClass_name = this.classValue[1];
      const res = await this.$http.post("admin/teacher/studentzhuanyi", qs.stringify({ id: this.id,newclass_id: this.newClass_id, newclass_name: this.newClass_name,id_list: this.id_list}));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({ message: res.data.info, type: "success", duration: 3000});
        this.getList()
        this.isTeacherBlock = false;
      }else {
        this.$message({ message: res.data.info, type: "error", duration: 3000});
      }
    },
    goback(){ // 返回班级列表
      this.$router.go(-1);//返回上一层
    },
    async searchStu(){ // 根据学生姓名搜索。
      if (this.type == ''){
        this.getList();
        return false;
      };
      const res = await this.$http.post("admin/teacher/classstudentlstnew", qs.stringify({nickname: this.type, id:  this.id}));
      if (res.status === 200 && res.data.code === "1") {
        this.tableData = res.data.info;
      } else {
        this.$message({ message: "未搜索到此学生信息", type: "error", duration: 3000});
      }
    },
    async checket(e){
      const res = await this.$http.post("admin/teacher/studentpwdupdata", qs.stringify({id: e.id}));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({message: res.data.info,type: "success",duration: 2000});
        this.getList();
      } else {
        this.$message({message: res.data.info,type: "error",duration: 2000});
      }
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
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/css/index.less");
.right {
  background-color: #fff;
  height: 100%;
  width: 100%;
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
    padding-top: 0;
    // margin-bottom: 20px;
    overflow: hidden;
  }
  .transfer-box {
    float: left;
    font-size: 18px;
    margin-top: .266667rem;
    margin-right: .266667rem;
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
  width: 10rem;
  margin: 20vh auto 0;
}
</style>