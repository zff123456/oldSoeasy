<template>
  <!-- 听单句 -->
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
        <el-table-column label="操作" align="center" min-width="110">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="openOne(scope.row)">查看详情</el-button>
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

    <!-- 再做一次弹框。 -->
    <el-dialog title="题目展示" :visible.sync="dialogTableVisible" width="1000px" custom-class="cuotidialog" ref="dialog" >
      <!-- 单独一种听单句 -->
      <div class="content-box">
          <div class="duanwen-options" >
            <div class="option-one" v-for="(ie, k, index) in danjvOneList">
              <el-button type="success" icon="el-icon-video-play" @click="play_xinwen_opt(ie)" ref="dw_btn" style="padding: 5px 10px;font-size: 12px;margin-top:10px">第({{k + 1}})小题听力</el-button>
              <div v-html="ie.oneTranslate" style="margin-top:10px;padding:10px"></div>
              <div class="xuanxiang" v-for="(i,e) in ie.xuanxiang" style="margin-top: 5px">
                <el-radio v-model="ie.yn" :label="e">{{i}}</el-radio>
              </div>
              <div v-html="ie.tiyan" style="margin-top:10px;border: 1px dashed #ccc;padding:10px">{{ie.tiyan}}</div>
              <div v-html="ie.jiexi" style="margin-top:10px;border: 1px dashed #ccc;padding:10px">{{ie.jiexi}}</div>
            </div>
          </div>
          <!-- 提交按钮。 -->
          <!-- <el-button type="primary" @click="submitXinweng(item)">提交</el-button> -->
      </div>
    
    </el-dialog>
    <audio ref="xinwenOpt" size="mini"></audio>
  </div>
</template>

<script>
import qs from "qs";
export default {
  name: "tingdanjv",
  props: ["paperId", "paperName"],
  data() {
    return {
      tableData: [],
      isLoading: false,
      pagesize: 15,
      currentPage: 1,
      dialogTableVisible: false,
      danjvOneList: [],
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
      const res = await this.$http.post("admin/paper/tingdanjulst",qs.stringify({}));
      if (res.status === 200 && res.data.code === "1") {
        this.tableData = res.data.info;
        this.isLoading = false;
      }
    },
    testPaperName(i){
      if(i == null){return "不属于任何试卷"} else {return i};
    },
    tesPaperTypeName(i){
      if(i == null){return "不属于任何题库"} else {return i};
    },
    openOne(item){
      this.danjvOneList = item.xuanxiang;
      for ( var i = 0 ; i < this.danjvOneList.length ; i++) {
        this.danjvOneList[i].xuanxiang = this.danjvOneList[i].xuanxiang.split(",|");
      };
      this.dialogTableVisible = true;
    },
    play_xinwen_opt(ie){ // 新闻报道 单项
      this.$refs.xinwenOpt.src = `${BASE_URL}${ie.audio_url}`;
      this.$refs.xinwenOpt.play();
    },
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