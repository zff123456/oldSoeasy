<template>
  <div class="right" v-loading="isLoading" element-loading-text="拼命加载中">
    <div class="table-box">
      <el-table style="width: 100%" border="" stripe :data="flatten(tableData.slice((currentPage -1) * pagesize, currentPage * pagesize))" :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}">
        <el-table-column prop="id" label="Id" width="65"></el-table-column>
        <el-table-column prop="test_paper_name" label="试卷名称">
          <template slot-scope="scope">{{testPaperName(scope.row.test_paper_name)}}</template>
        </el-table-column>
        <el-table-column prop="test_paper_type_name" label="所属题库">
          <template slot-scope="scope">{{tesPaperTypeName(scope.row.test_paper_type_name)}}</template>
        </el-table-column>
        <el-table-column prop="audio_url" label="音频地址" min-width="160"></el-table-column>
      </el-table>
    </div>
    <!-- 嵌套表格dialog -->
    <div class="dialog-box">
      <el-dialog title="问题列表" :visible.sync="dialogTableVisible" style="width:1000px;margin: 0 auto;margin-top:15vh;">
        <el-table :data="innerList" :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}">
          <el-table-column prop="id" label="Id" width="65"></el-table-column>
          <el-table-column property="audio_url" label="音频地址"></el-table-column>
          <el-table-column property="xuanxiang" label="选项">
            <template slot-scope="scope">{{`${scope.row.xuanxiang[0]}&nbsp;${scope.row.xuanxiang[1]}&nbsp;${scope.row.xuanxiang[2]}&nbsp;${scope.row.xuanxiang[3]}`}}</template>
          </el-table-column>
          <el-table-column property="daan" label="答案"></el-table-column>
        </el-table>
      </el-dialog>
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
  name: "listenLongList",
  props: ["paperId", "paperName"],
  data() {
    return {
      tableData: [],
      isLoading: false,
      pagesize: 15,
      currentPage: 1,
      dialogTableVisible: false,
      innerList: [],
    };
  },
  created() {
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
    async getThesisList() {
      this.isLoading = true;
      const res = await this.$http.post("admin/paper/CETETxinwenbaodaolst",qs.stringify({cet: this.paperId,type: 3}));
      if (res.status === 200 && res.data.code === "1") {
        this.tableData = res.data.info;
        this.isLoading = false;
      }
      console.log(res);
    },
    testPaperName(i){
      if(i == null){return "无"} else {return i};
    },
    tesPaperTypeName(i){
      if(i == null){return "无"} else {return i};
    },
    revision(i,e){ // 编辑

    },
    delit(e){ // 删除

    },
    async lookChecket(i){ // 查看选项
      this.dialogTableVisible = true;
      this.isLoading = true;
      const res = await this.$http.post("admin/paper/CETETxinwenbaodaolstxuanxiang",qs.stringify({id: i.id}));
      if (res.status === 200 && res.data.code === "1") {
        this.innerList = res.data.info;
        this.isLoading = false;
      }
      console.log(res);
    },
    innerRevision(i,e){ // 单题修改

    },
    innerDelit(i){ // 单题删除

    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/css/index.less");
.right {
  box-sizing: border-box;
}
.cell .el-button {
  padding: 4px 9px;
  font-size: 12px;
}
</style>
