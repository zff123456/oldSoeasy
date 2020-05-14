<template>
  <div class="right" v-loading="isLoading" element-loading-text="拼命加载中">

    <audio ref="xinwenAudio"></audio>

    <!-- <div class="sea-box">
      <div class="search-box">
        <div class="title">选择试卷类型</div>
        <el-select v-model="type" placeholder="请选择试卷类型" @change="getUserList">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
    
    <div class="search-box">
      <div class="title">选择题目类型</div>
        <el-select v-model="problem" placeholder="请选择题目类型" @change="getTimu">
          <el-option
            v-for="item in problemList"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </div>
    </div> -->
    <div class="tiku-box" v-if="hasA == true">
      <div class="text-title">A级题库</div>
      <ul>
        <li v-for="item in aList" @click="change(item, 3)" :class="type == 3 && problem == item?'click': ''"><p>{{item}}</p></li>
      </ul>
    </div>
    <div class="tiku-box" v-if="hasB == true">
      <div class="text-title">B级题库</div>
      <ul>
        <li v-for="item in bList" @click="change(item, 4)" :class="type == 4 && problem == item?'click': ''"><p>{{item}}</p></li>
      </ul>
    </div>
    <div class="tiku-box" v-if="hasFour == true">
      <div class="text-title">四级题库</div>
      <ul>
        <li v-for="item in fourList" @click="change(item, 1)" :class="type == 1 && problem == item?'click': ''"><p>{{item}}</p></li>
      </ul>
    </div>
    <div class="tiku-box" v-if="hasSix == true">
      <div class="text-title">六级题库</div>
      <ul>
        <li v-for="item in sixList" @click="change(item, 2)" :class="type == 2 && problem == item?'click': ''"><p>{{item}}</p></li>
      </ul>
    </div>
    <div style="height:20px;width:100%;background-color: #F8F8F8;margin-top:0"></div>

    <ul class="infinite-list" style="overflow:auto">
      <li v-for="(ie,k) in itemData" class="infinite-list-item">
        <el-divider >{{ ie.description }} </el-divider>
        <!-- <p style="padding: 0 10px;text-align: center;">题目类型：{{ie.title}}</p> -->
        <!-- <span style="padding-left: 10px;font-weight: 700;color:#409EFF">问题：</span> -->
        <div v-html="ie.content" style="padding:10px"></div>
        <!-- <span style="padding-left: 10px;font-weight: 700;color:#F56C6C">你的答案：</span>
        <div v-html="ie.user_yn" style="padding:10px;color:#F56C6C"></div>
        <span style="padding-left: 10px;font-weight: 700;color:#67C23A">正确答案：</span>
        <div v-html="ie.yn" style="padding:10px"></div> -->
        <el-divider content-position="right" style="color:#409EFF">添加时间：{{ie.update_time | time}}</el-divider>
      </li>
    </ul>
  </div>
</template>

<script>
/* eslint-disable */
import qs from "qs";
export default {
data() {
    return {
      isLoading: false,
      is_tijiao: false,
      teacher_id: '',
      school_id: '',
      nickname: '',
      options: [],
      type: '',
      problemList: [],
      problem: '',
      fourList: ["长对话","短对话","作文","翻译选择","英汉匹配","阅读 填空解答","词汇与语法结构","日常对话","听短文","短文填空","篇章翻译","仔细阅读","长篇阅读","词汇理解","听短对话","听长对话","听短篇新闻","情景作文","提纲作文","图表作文"],
      sixList: ["长对话","短对话","作文","翻译选择","英汉匹配","阅读 填空解答","阅读 选择题","词汇与语法结构","日常对话","听短文","短文填空","篇章翻译","仔细阅读","长篇阅读","词汇理解","听短对话","听长对话","听短篇新闻","情景作文","提纲作文","图表作文"],
      aList: ["长对话","短对话","作文","翻译选择","英汉匹配","阅读 填空解答","阅读 选择题","词汇与语法结构","日常对话","听短文","短文填空","篇章翻译","仔细阅读","长篇阅读","词汇理解","听短对话","听长对话","听短篇新闻","情景作文","提纲作文","图表作文"],
      bList: ["长对话","短对话","作文","翻译选择","英汉匹配","阅读 填空解答","阅读 选择题","词汇与语法结构","日常对话","听短文","短文填空","篇章翻译","仔细阅读","长篇阅读","词汇理解","听短对话","听长对话","听短篇新闻","情景作文","提纲作文","图表作文"],
      itemData: [],
      itemOne: '',
      english: [
        {value: 'A',label: '选项 A'},{value: 'B',label: '选项 B'},{value: 'C',label: '选项 C'},{value: 'D',label: '选项 D'},{value: 'E',label: '选项 E'},
        {value: 'F',label: '选项 F'},{value: 'G',label: '选项 G'},{value: 'H',label: '选项 H'},{value: 'I',label: '选项 I'},{value: 'J',label: '选项 J'},
        {value: 'K',label: '选项 K'},{value: 'L',label: '选项 L'},{value: 'M',label: '选项 M'},{value: 'N',label: '选项 N'},{value: 'O',label: '选项 O'},
        {value: 'P',label: '选项 P'},{value: 'Q',label: '选项 Q'},{value: 'R',label: '选项 R'},{value: 'S',label: '选项 S'},{value: 'T',label: '选项 T'}
      ],
      hasFour: false,
      hasSix: false,
      hasA: false,
      hasB: false,
    };
  },
  created() {
    this.teacher_id = localStorage.getItem("id");
    this.nickname = localStorage.getItem("nickname");
    this.school_id = localStorage.getItem("school_id");
    this.baseUrl = BASE_URL;
    // console.log(BASE_URL);
    // this.getUserList();
    this.getList();
    
  },
  computed: {},
  watch: {

  },
  methods: {
    async getList(){
      const res = await this.$http.post("admin/Examination/tiku", qs.stringify({ school_id: this.school_id}));
      if (res.status === 200 && res.data.code === "1") {
        this.options = res.data.info;
      };
      // this.type = this.options[0].id;
      // if (this.type == 1){ this.problem = this.fourList[0];this.problemList = this.fourList };
      // if (this.type == 2){ this.problem = this.sixList[0];this.problemList = this.sixList };
      // if (this.type == 3){ this.problem = this.aList[0];this.problemList = this.aList };
      // if (this.type == 4){ this.problem = this.bList[0];this.problemList = this.bList };
      for ( let i = 0 ; i < this.options.length ; i++) {
        if (this.options[i].name == "四级题库"){ this.hasFour = true };
        if (this.options[i].name == "六级题库"){ this.hasSix = true };
        if (this.options[i].name == "A级题库"){ this.hasA = true };
        if (this.options[i].name == "B级题库"){ this.hasB = true };
      }
      this.getTimu();
    },
    getUserList(){
      this.problem = "";
      if (this.type == 1){ this.problemList = this.fourList };
      if (this.type == 2){ this.problemList = this.sixList };
      if (this.type == 3){ this.problemList = this.aList };
      if (this.type == 4){ this.problemList = this.bList };
    },
    change(problem, type){
      this.problem = problem;
      this.type = type;
      this.getTimu();
    },
    async getTimu(){
      this.isLoading = true;
      this.currentPage = 1;
      // this.problem = item;
      // this.type = type;
      const res = await this.$http.post("admin/index/article",qs.stringify({ test_paper_type_name: this.type, problem: this.problem }));
      if (res.status === 200 && res.data.code === "1") {
        this.itemData = res.data.info;
        this.isLoading = false;
      };
    },
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/css/index.less");
.right {
  background-color: #F8F8F8;
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  .infinite-list {
    // height: 1000px;
    // width: 100%;
    background-color: #fff;
    padding: 0 20px 0;
    .infinite-list-item {
      min-height: 60px;
      margin: 20px 0px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border-radius: 2px;
      overflow: hidden;
      padding: 10px;
      position: relative;
      .buttom {
        position: absolute;
        left: 30px;
        bottom: 14px;
        padding: 0 15px;
        background-color: #fff;
        .el-button {
          padding: 7px 12px;
          font-size: 14px;
          margin: 10px 0px 5px;
          width: 100%;
        }
      }
    }
  }
  .sea-box {
    height: 69px;
    background-color: #fff;
    .search-box {
      background-color: #fff;
      height: 50px;
      line-height: 50px;
      padding: 0 15px;
      width: 340px;
      float: left;
      padding-left: 27px;
      margin-top: 7px;
      &:nth-last-child(1) {
        padding-left: 0;
      }
      .title {
        color: @theme;
        float: left;
        font-size: 14px;
        margin-right: 20px;
      }
    }
  }
  
  .content-box {
    background-color: #fff;
    // width: 100%;
    padding: 5px 20px 0px;
    position: relative;
    .el-button {
      &:nth-last-child(1) {
        float: right;
      }
    }
    .big-box {
      padding: 15px 10px 0;
      .zuowen-title {
        font-size: 14px;
        line-height: 30px;
      }
      img {
        height: 200px;
        margin-left: 145px;
      }
      .duanwen-options { // 听短文理解选项
        padding: 10px 0 0;
        // border-top: 1px solid #ccc;
        // margin-top: 10px;
        .option-one {
          border-bottom: 1px dashed #ccc;
          margin: 20px 0;
          padding-bottom: 5px;
          overflow: hidden;
          &:last-child {
            border-bottom: none;
          }
          .xuanxiang {
            font-size: 14px;
            height: 20px;
            margin-left: 30px;
          }
        }
        
      }
      .duanwen-box {
        border-bottom: 2px dashed @theme;
        margin-bottom: 20px;
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
  .tiku-box {
    padding: 15px 0;
    // height: 40px;
    line-height: 40px;
    background-color: #fff;
    // width: 100%;
    height: 100%;
    overflow: hidden;
    
    .text-title {
      float: left;
      width: 80px;
      text-align: center;
    }
    ul {
      // float: left;
      font-size: 14px;
      // border: 1px solid #ccc;
      li {
        margin-top: 5px;
        float: left;
        border: 1px solid #ccc;
        height: 30px;
        padding: 0 10px;
        box-sizing: border-box;
        // border-left: none;
        cursor: pointer;
        &:nth-child(1){
          // border-left: none;
        }
        p {
          line-height: 30px;
        }
      }
    }
  }
}
.video-box .el-button {
  padding: 9px 9px;
  font-size: 14px;
  margin: 10px 0px 5px;
  width: 100%;
}
.cell .el-button {
  padding: 4px 9px;
  font-size: 12px;
}
.big-box .el-button {
  padding: 10px 20px;
  font-size: 16px;
}
.red {
  color: red;
}
.click {
  background-color: @theme;
  color: #fff;
}
</style>