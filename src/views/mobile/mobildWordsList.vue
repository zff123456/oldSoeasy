<template>
  <div class="right" v-loading="isLoading" element-loading-text="拼命加载中">
    <div class="list-box">
      <audio src="" ref="audio"></audio>
      <ul>
        <li v-for="(item,key) in flatten(tableData.slice((currentPage -1) * pagesize, currentPage * pagesize))">
          <div class="cont-box">
            <div class="title" v-show="item.collect == 0 || item.collect == 1 || item.collect == 3" @click="item.collect = 2">{{item.englishWord}}</div>
            <div class="title" v-show="item.collect == 2 " @click="item.collect = 0">查看单词</div>
            <div class="content" v-show="item.collect == 0 || item.collect == 1|| item.collect == 2 " @click="item.collect = 3">{{item.pa}}</div>
            <div class="content" v-show="item.collect == 3  " @click="item.collect = 0">查看音标</div>
            <van-button icon="volume-o" type="info" style="float:right;margin-top: .133333rem;" size="mini" @click = "playVideo(item)"/>
          </div>
          <div class="tatle-text">中文：</div>
          <div class="content zhongwen">{{item.chineseWord}}</div>
          <div class="tatle-text">例句：</div>
          <p>{{item.englishInstance1}}</p>
          <p>{{item.chineseInstance1}}</p>
          <p>{{item.englishInstance2}}</p>
          <p>{{item.chineseInstance2}}</p>
        </li>
      </ul>
    </div>
    <div style="float:right;padding-top:15px">
      <el-pagination
        small
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pagesize"
        layout=" prev, pager, next"
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
      pagesize: 10,
      currentPage: 1,
      isLoading: false,
      identity: "",
      type: "",
      test_paper_type_id: "",
      school_id: "",
      stu_id: "",
      tableData: []
    };
  },
  created() {
    this.getList();
  },
  components: {},
  computed: {},
  methods: {
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
    handleSizeChange(val) {
      this.pagesize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    async getList(){
      const res = await this.$http.post( "admin/teacher/dancilst" );
      console.log(res)
      if (res.status === 200 && res.data.code === "1") {
        this.tableData = res.data.info;
      }
    },
    playVideo(e){
      this.$refs.audio.src = e.pron;
      this.$refs.audio.play();
    },
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/css/index.less");
.right {
  background-color: #fff;
  min-height: 100%;
  box-sizing: border-box;
  padding: .266667rem .533333rem;
  .list-box {
    ul {
      li {
        box-shadow: 0 .053333rem .32rem 0 rgba(0, 0, 0, 0.1);
        padding: .533333rem;
        margin: .266667rem 0;
        .zhongwen {
          font-size: .426667rem;
          word-break:break-word;
        }
        .tatle-text {
          font-size: .48rem;
          font-weight: 700;
        }
        .cont-box {
          overflow: hidden;
          height: .8rem;
          line-height: .8rem;
          .title {
            font-size: .533333rem;
            float: left;
            font-weight: 700
          }
          .content {
            font-size: .426667rem;
            text-indent: 2em;
            word-break:break-word;
            float: left;
            // margin-top: .133333rem;
          }
        }
        
        p {
          font-size: .373333rem;
          text-align: left;
          text-indent: 2em;
        }

      }
    }
  }
}
</style>