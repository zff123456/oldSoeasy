<template>
  <div class="right" v-loading="isLoading" element-loading-text="拼命加载中">
    <!-- 表格筛选。 -->
    <div class="table-box">
      <el-table style="width: 100%" border="" stripe :data="flatten(tableData.slice((currentPage -1) * pagesize, currentPage * pagesize))" :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}">
        <el-table-column prop="id" label="Id" width="65"></el-table-column>
        <el-table-column prop="nickname" label="姓名"></el-table-column>
        <el-table-column label="账号" prop="name"></el-table-column>
        <el-table-column prop="login_time" label="登录时间"></el-table-column>
        <el-table-column prop="login_ip" label="登录Ip"></el-table-column>
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
      pagesize: 15,
      currentPage: 1,
    };
  },
  created() {
    this.getPaperList();
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
    async getPaperList() {
      this.isLoading = true;
      const res = await this.$http.post("admin/Personal/personalCenter");
      if (res.status === 200 && res.data.code === "1") {
        this.tableData = res.data.info;
        this.isLoading = false;
      }
    },
  }
};
</script>

<style lang="less" scoped>
@import url("../../../assets/css/index.less");
.cell .el-button {
  padding: 4px 9px;
  font-size: 12px;
}
.right {
  height: 100%;
  background-color: #fff;
  .search-box {
    text-align: left;
    color: @theme;
    height: 60px;
    line-height: 60px;
    margin-bottom: 5px;
    padding-left: 25px;
    .el-select {
      margin-left: 20px;
    }
  }
  .table-box {
    padding: 0 20px;
  }
}
.dialog {
  width: 500px;
  margin: 15vh auto 0;
}
</style>
