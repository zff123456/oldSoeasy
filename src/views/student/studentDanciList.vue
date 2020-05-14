<template>
  <div class="right">
    <div class="table-box">
      <!-- <div style="text-align:center">
        <van-button type="info" size="small" @click="blockCn" style="margin:.266667rem">只显示中文</van-button>
        <van-button type="info" size="small" @click="blockEn" style="margin:.266667rem">只显示英文</van-button>
        <van-button type="info" size="small" @click="alsoBl" style="margin:.266667rem">全部显示</van-button>
      </div> -->
      <audio src="" ref="audio"></audio>
      <el-table :data="flatten(tableData.slice((currentPage -1) * pagesize, currentPage * pagesize))" stripe style="" border class="table" :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}">
        <el-table-column prop="englishWord" label="单词" v-if="zhanshiEn" width="160">
          <template slot-scope="scope">
            <el-button size="small" type="text" v-show="scope.row.collect == 0 || scope.row.collect == 1 || scope.row.collect == 3" @click="scope.row.collect = 2">{{scope.row.englishWord}}
            </el-button>
            <el-button size="small" type="text" v-show="scope.row.collect == 2 " @click="scope.row.collect = 0">查看单词</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="pa" label="音标" width="140">
          <template slot-scope="scope">
            <el-button size="small" type="text" v-show="scope.row.collect == 0 || scope.row.collect == 1|| scope.row.collect == 2 " @click="scope.row.collect = 3">{{scope.row.pa}}
            </el-button>
            <el-button size="small" type="text" v-show="scope.row.collect == 3  " @click="scope.row.collect = 0">查看音标</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="chineseWord" label="中文" v-if="zhanshiCn"></el-table-column>
        <el-table-column label="发音" prop="" width="100">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="playVideo(scope.row)" icon="el-icon-video-play" style="font-size: 14px;padding: 4px 12px;"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="例句" prop="" width="120">
          <template slot-scope="scope">
            <el-popover
              placement="left-start"
              title="例句"
              width="500"
              trigger="hover"
              :content="blockLize(scope.row)">
              <el-button slot="reference" size="small" type="text">例句</el-button>
            </el-popover>
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
      pagesize: 15,
      currentPage: 1,
      zhanshiCn: true,
      zhanshiEn: true
    };
  },
  created() {
    this.teacher_id = localStorage.getItem("id");
    this.school_id = localStorage.getItem("school_id");
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
      const res = await this.$http.post( "admin/teacher/dancilst" );
      if (res.status === 200 && res.data.code === "1") {
        this.tableData = res.data.info;
      }
    },
    blockCn(){
      this.zhanshiCn = true;
      this.zhanshiEn = false;
    },
    blockEn(){
      this.zhanshiCn = false;
      this.zhanshiEn = true;
    },
    alsoBl(){
      this.zhanshiCn = true;
      this.zhanshiEn = true;
    },
    pageChage(){
      this.zhanshiCn = true;
      this.zhanshiEn = true;
    },
    playVideo(e){
      // console.log(e);
      this.$refs.audio.src = e.pron;
      this.$refs.audio.play();
    },
    blockLize(e){
      return `${e.englishInstance1}${e.chineseInstance1}-----------------------${e.englishInstance2}${e.chineseInstance2}`;
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/css/index.less");
.right {
  background-color: #fff;
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  padding: 20px;
  
}

</style>