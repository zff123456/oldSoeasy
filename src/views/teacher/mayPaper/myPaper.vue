<template>
  <div class="right" v-loading="isLoading" element-loading-text="拼命加载中">
    <!-- <div class="search-box">
      <div class="title">选择预约类型</div>
      <el-select v-model="type" placeholder="学校" @change="getUserList">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
    </div> -->
    <div class="table-box">
      <el-table stripe style="" border :data="flatten(tableData.slice((currentPage -1) * pagesize, currentPage * pagesize))" :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}">
        <el-table-column prop="nickname" label="学生姓名" width="130"></el-table-column>
        <el-table-column prop="class_name" label="班级" width="130"></el-table-column>
        <el-table-column prop="teacher_name" label="所属教师" width="130"></el-table-column>
        <el-table-column prop="name" label="账号"></el-table-column>
        <el-table-column prop="create_time" label="注册时间" min-width="160">
          <template slot-scope="scope">{{ scope.row.create_time | time}}</template>
        </el-table-column>
        <el-table-column prop="login_ip" label="登录IP" min-width="140"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="checket(scope.row)">重置密码</el-button>
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

    
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      tableData: [],
      isLoading: false,
      // options: [
      //   {
      //     value: "1",
      //     label: "学校"
      //   },
      //   {
      //     value: "2",
      //     label: "教师"
      //   }
      // ],
      type: '',
      id: '',
      school_id: '',
      isLoading: false,
      pagesize: 15,
      currentPage: 1,
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
      const res = await this.$http.post("admin/teacher/studentlst", qs.stringify({school_id: this.school_id}));
      if (res.status === 200 && res.data.code === "1") {
        this.tableData = res.data.info
      }
      console.log(res);
    },
    blockState(e){
      // if(e.status == 1) { return "正常"} else { return "等待审核" }
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
  }
};
</script>

<style lang="less" scoped>
@import url("../../../assets/css/index.less");
.right {
  background-color: #fff;
  height: 100%;
  width: 100%;
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