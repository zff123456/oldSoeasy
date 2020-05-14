<template>
  <!-- ab级英译汉 -->
  <div class="right" v-loading="isLoading" element-loading-text="拼命加载中">
    <div class="table-box">
      <el-table style="width: 100%" border="" stripe :data="flatten(tableData.slice((currentPage -1) * pagesize, currentPage * pagesize))" :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}">
        <el-table-column prop="id" label="Id" width="65"></el-table-column>
        <el-table-column prop="nickname" label="用户姓名">
        </el-table-column>
        <el-table-column prop="problem" label="问题" min-width="200">
        </el-table-column>
        <el-table-column prop="contactinformation" label="我的联系方式">
        </el-table-column>
        <el-table-column prop="addtime" label="提交时间">
          <template slot-scope="scope">{{ scope.row.addtime | time}}</template>
        </el-table-column>
        <el-table-column prop="state" label="当前状态">
          <template slot-scope="scope">{{blockState(scope.row.state)}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="delit(scope.row)">删除</el-button>
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
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      tableData: [],
      isLoading: false,
      pagesize: 15,
      currentPage: 1,
      id: '',
      identity: '',
    };
  },
  created() {
    this.id = localStorage.getItem("id");
    this.identity = localStorage.getItem("identity");
    this.getThesisList();
  },
  components: {

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
    blockState(i){
      if(i == 2){return "已处理"} else {return "客服正在处理"}
    },
    async getThesisList() {
      this.isLoading = true;
      const res = await this.$http.post("admin/teacher/gongdanlst",qs.stringify({id: this.id , identity: this.identity}));
      if (res.status === 200 && res.data.code === "1") {
        this.tableData = res.data.info;
        this.isLoading = false;
      }
    },
    async delit(e) {
      const res = await this.$http.post("admin/teacher/delgongdan", qs.stringify({id: e.id}));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({message: res.data.info,type: "success",duration: 2000});
        this.getThesisList();
      } else {
        this.$message({message: res.data.info,type: "error",duration: 2000});
      }
    },
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/css/index.less");
.right {
  box-sizing: border-box;
  height: 100%;
  background-color: #fff;
  padding: 20px;
  .table-box {
    
  }
  .dialog-box {
    
  }
}
.cell .el-button {
  padding: 4px 9px;
  font-size: 12px;
}
</style>
