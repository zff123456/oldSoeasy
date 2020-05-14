<template>
  <div class="right" style="height:100%">
    <div class="button-box">
      <el-button type="primary" plain @click.native="check(1)" :class="isCheck == 1?'checked':''">听短对话</el-button>
      <el-button type="primary" plain @click.native="check(2)" :class="isCheck == 2?'checked':''">听长对话</el-button>
      <el-button type="primary" plain @click.native="check(3)" :class="isCheck == 3?'checked':''">短文填空</el-button>
      <el-button type="primary" plain @click.native="check(4)" :class="isCheck == 4?'checked':''">听短文</el-button>
      <el-button type="primary" plain @click.native="check(5)" :class="isCheck == 5?'checked':''">词汇选择</el-button>
      <el-button type="primary" plain @click.native="check(6)" :class="isCheck == 6?'checked':''">词汇填空</el-button>
      <el-button type="primary" plain @click.native="check(7)" :class="isCheck == 7?'checked':''">仔细阅读</el-button>
      <el-button type="primary" plain @click.native="check(8)" :class="isCheck == 8?'checked':''">阅读填空</el-button>
      <el-button type="primary" plain @click.native="check(9)" :class="isCheck == 9?'checked':''">词汇匹配</el-button>
      <el-button type="primary" plain @click.native="check(10)" :class="isCheck == 10?'checked':''">阅读理解</el-button>
      <el-button type="primary" plain @click.native="check(11)" :class="isCheck == 11?'checked':''">翻译选择</el-button>
      <el-button type="primary" plain @click.native="check(12)" :class="isCheck == 12?'checked':''">英译汉</el-button>
      <el-button type="primary" plain @click.native="check(13)" :class="isCheck == 13?'checked':''">作文</el-button> 
    </div>
    <div class="component-box">
      <listenDuan v-if="isCheck == 1" :paperId="paperId" :paperName="paperName"></listenDuan> <!-- 听短对话 -->
      <listenChangList v-if="isCheck == 2" :paperId="paperId" :paperName="paperName"></listenChangList> <!-- 听长对话 -->
      <shortTiankongList v-if="isCheck == 3" :paperId="paperId" :paperName="paperName"></shortTiankongList> <!-- 短文填空 -->
      <tingduanwenList v-if="isCheck == 4" :paperId="paperId" :paperName="paperName"></tingduanwenList>   <!--  听短文  -->
      <cihuiSelection v-if="isCheck == 5" :paperId="paperId" :paperName="paperName"></cihuiSelection> <!-- 词汇选择 -->
      <cihuiCalking v-if="isCheck == 6" :paperId="paperId" :paperName="paperName"></cihuiCalking> <!-- 词汇填空 -->
      <carefulReadingList v-if="isCheck == 7" :paperId="paperId" :paperName="paperName"></carefulReadingList> <!-- 仔细阅读 -->
      <readList v-if="isCheck == 8" :paperId="paperId" :paperName="paperName"></readList> <!-- 阅读填空 -->
      <vocabularyList v-if="isCheck == 9" :paperId="paperId" :paperName="paperName"></vocabularyList> <!-- 词汇匹配 -->
      <readingLijieList v-if="isCheck == 10" :paperId="paperId" :paperName="paperName"></readingLijieList> <!-- 阅读理解 -->
      <fanyiSelection v-if="isCheck == 11" :paperId="paperId" :paperName="paperName"></fanyiSelection> <!-- 翻译选择 -->
      <chineseEnglishList v-if="isCheck == 12" :paperId="paperId" :paperName="paperName"></chineseEnglishList> <!-- 英译汉 -->
      <thesisList v-if="isCheck == 13" :paperId="paperId" :paperName="paperName"></thesisList> <!-- 作文 -->
    </div>
  </div>
</template>

<script>
import listenDuan from '../../../components/listComponents/listenDuan'; // 听短对话
import listenChangList from '../../../components/listComponents/listenChangList'; // 听长对话 listenChangList
import shortTiankongList from '../../../components/listComponents/shortTiankongList'; // 短文填空列表
import cihuiCalking from '../../../components/listComponents/cihuiCalking'; // 词汇填空
import carefulReadingList from '../../../components/listComponents/carefulReadingList'; // 仔细阅读
import readList from '../../../components/listComponents/readList'; // 阅读填空
import vocabularyList from '../../../components/listComponents/vocabularyList'; // 词汇匹配
import readingLijieList from '../../../components/listComponents/readingLijieList'; // 阅读理解
import cihuiSelection from '../../../components/listComponents/cihuiSelection'; // 词汇选择
import fanyiSelection from '../../../components/listComponents/fanyiSelection'; // 翻译选择
import chineseEnglishList from '../../../components/listComponents/chineseEnglishList'; // 英译汉
import thesisList from '../../../components/listComponents/thesisList'; // 作文
import tingduanwenList from '../../../components/listComponents/tingduanwenList'; // 听短文
export default {
  data() {
    return {
      isCheck: 1,
      paperId: 3,
      paperName: 3,
    };
  },
  components: {
    listenDuan: listenDuan, // 听短对话
    listenChangList: listenChangList, // 听长对话
    carefulReadingList: carefulReadingList, // 仔细阅读
    cihuiCalking: cihuiCalking, // 词汇填空
    shortTiankongList: shortTiankongList, // 短文填空
    cihuiSelection: cihuiSelection, // 词汇选择
    readList: readList, // 阅读填空列表
    vocabularyList: vocabularyList, // 词汇匹配
    readingLijieList: readingLijieList, // 阅读理解
    fanyiSelection: fanyiSelection, // 翻译选择
    chineseEnglishList: chineseEnglishList, // 英译汉
    thesisList: thesisList, // 作文组件
    tingduanwenList: tingduanwenList,  // 听短文
  },
  created() {},
  computed: {},
  methods: {
    check(item){
      this.isCheck = item;
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../../assets/css/index.less");
.right {
  background-color: #fff;
  .button-box {
    text-align: left;
    padding: 10px;
    padding-bottom: 0;
    border-bottom: 2px solid @theme;
    height: 44px;
    box-sizing: border-box;
    position: relative;
    button {
      background-color: #fff;
      border: none;
      border-radius: 5px 5px 0 0;
      margin-left: 0;
      font-size: 14px;
      &.checked {
        background-color: @theme;
        color: #fff;
        &:hover {
          color: #fff;
        }
      }
      &:hover {
        color: @theme;
      }
    }
  }
  .component-box {
    text-align: left;
    padding: 10px;
    box-sizing: border-box;
    padding-top: 0;
    overflow: hidden;
    .right {
      overflow: hidden;
    }
  } 
}

</style>