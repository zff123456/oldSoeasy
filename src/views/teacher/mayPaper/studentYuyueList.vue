<template>
  <div class="right" v-loading="isLoading" element-loading-text="拼命加载中">
    <div class="table-box">
      <el-table stripe style="" border :data="flatten(tableData.slice((currentPage -1) * pagesize, currentPage * pagesize))" :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}">
        <el-table-column prop="test_paper_name" label="试卷名称" width="130"></el-table-column>
        <el-table-column prop="nickname" label="学生姓名" width="130"></el-table-column>
        <!-- <el-table-column prop="teacher_name" label="所属教师" width="130"></el-table-column>
        <el-table-column prop="name" label="账号"></el-table-column> -->
        <el-table-column prop="start_time" label="开考时间" min-width="160">
          <template slot-scope="scope">{{ scope.row.start_time | time}}</template>
        </el-table-column>
        <el-table-column prop="end_time" label="结束时间" min-width="160">
          <template slot-scope="scope">{{ scope.row.end_time | time}}</template>
        </el-table-column>
        <el-table-column prop="addtime" label="添加时间" min-width="160">
          <template slot-scope="scope">{{ scope.row.addtime | time}}</template>
        </el-table-column>
        <el-table-column prop="state" label="试卷状态">
          <template slot-scope="scope">{{blockState(scope.row)}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="checket(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 返回上一层 -->
      <div class="transfer-box">
        <el-button type="primary" @click="goback">返回学生预约</el-button>
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
      type: '',
      id: '',
      school_id: '',
      isLoading: false,
      pagesize: 15,
      currentPage: 1,
      test_paper_id: '',
    };
  },
  created() {
    this.id = localStorage.getItem("id");
    this.school_id = localStorage.getItem("school_id");
    this.test_paper_id = localStorage.getItem("yuyueList_id");
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
    async getList(){
      const res = await this.$http.post("admin/Examination/makeanappointmentuserlst", qs.stringify({test_paper_id: this.test_paper_id}));
      if (res.status === 200 && res.data.code === "1") {
        this.tableData = res.data.info
      }
      console.log(res);
    },
    blockState(e){
      if(e.state == 1) { return "正常"} else { return "等待审核" }
    },
    async checket(e){
      const res = await this.$http.post("admin/Examination/quxiaoyuyue", qs.stringify({id: e.id}));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({message: res.data.info,type: "success",duration: 2000});
        this.getList();
      } else {
        this.$message({message: res.data.info,type: "error",duration: 2000});
      }
    },
    goback(){ // 返回班级列表
      this.$router.go(-1);//返回上一层
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
    padding-top: 0;
  }
  .transfer-box {
    float: left;
    font-size: 18px;
    margin-top: 10px;
    margin-right: 20px;
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