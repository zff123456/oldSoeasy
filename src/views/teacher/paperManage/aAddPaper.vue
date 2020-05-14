<template>
  <div class="right">
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
      <listenDuantalk v-if="isCheck == 1" :paperId="paperId" :paperName="paperName"></listenDuantalk> <!-- 听短对话 -->
      <listenLongDuihua v-if="isCheck == 2" :paperId="paperId" :paperName="paperName"></listenLongDuihua> <!-- 听长对话 -->
      <shortUnderstanding v-if="isCheck == 3" :paperId="paperId" :paperName="paperName"></shortUnderstanding> <!-- 短文填空 -->
      <listenDuanWen v-if="isCheck == 4" :paperId="paperId" :paperName="paperName"></listenDuanWen> <!-- 听短文 -->
      <wordSelection v-if="isCheck == 5" :paperId="paperId" :paperName="paperName"></wordSelection> <!-- 词汇选择 -->
      <cihuiGapFilling v-if="isCheck == 6" :paperId="paperId" :paperName="paperName"></cihuiGapFilling> <!-- 词汇填空 -->
      <carefulReading v-if="isCheck == 7" :paperId="paperId" :paperName="paperName"></carefulReading> <!-- 仔细阅读 -->
      <yueduTiankong v-if="isCheck == 8" :paperId="paperId" :paperName="paperName"></yueduTiankong> <!-- 阅读填空 -->
      <vocabularyMatching v-if="isCheck == 9" :paperId="paperId" :paperName="paperName"></vocabularyMatching>   <!-- 词汇匹配 -->
      <readingComprehension v-if="isCheck == 10" :paperId="paperId" :paperName="paperName"></readingComprehension>   <!-- 阅读理解 -->
      <translationChoice v-if="isCheck == 11" :paperId="paperId" :paperName="paperName"></translationChoice>   <!-- 翻译选择 -->
      <englishToChinese v-if="isCheck == 12" :paperId="paperId" :paperName="paperName"></englishToChinese>   <!-- 英译汉 -->
      <composition v-if="isCheck == 13" :paperId="paperId" :paperName="paperName"></composition>   <!-- 作文组件 -->
    </div>
  </div>
</template>

<script>
import listenDuantalk from '../../../components/questionTypes/listenDuantalk'; // 听短对话
import listenLongDuihua from '../../../components/questionTypes/listenLongDuihua'; // 听长对话
import shortUnderstanding from '../../../components/questionTypes/shortUnderstanding'; // 短文填空
import listenDuanWen from '../../../components/questionTypes/listenDuanWen'; // 听短文
import wordSelection from '../../../components/questionTypes/wordSelection'; // 词汇选择
import cihuiGapFilling from '../../../components/questionTypes/cihuiGapFilling'; // 词汇填空
import carefulReading from '../../../components/questionTypes/carefulReading'; // 仔细阅读
import yueduTiankong from '../../../components/questionTypes/yueduTiankong'; // 阅读填空
import vocabularyMatching from '../../../components/questionTypes/vocabularyMatching'; // 词汇匹配
import readingComprehension from '../../../components/questionTypes/readingComprehension'; // 阅读理解
import translationChoice from '../../../components/questionTypes/translationChoice'; // 翻译选择
import englishToChinese from '../../../components/questionTypes/englishToChinese'; // 英译汉
import composition from '../../../components/questionTypes/composition'; // 作文
export default {
  data() {
    return {
      isCheck: 1,
      paperId: 3,
      paperName: 3,
    };
  },
  components: {
    listenDuantalk: listenDuantalk, // 听短对话。
    listenLongDuihua: listenLongDuihua, // 新增听长对话
    shortUnderstanding: shortUnderstanding, // 短文填空ss
    listenDuanWen: listenDuanWen, // 听短文
    wordSelection: wordSelection, // 词汇选择
    cihuiGapFilling: cihuiGapFilling, // 词汇填空
    carefulReading: carefulReading, // 仔细阅读
    yueduTiankong: yueduTiankong, // 阅读填空
    vocabularyMatching: vocabularyMatching, // 词汇匹配
    readingComprehension: readingComprehension, // 阅读理解
    translationChoice: translationChoice, // 翻译选择
    englishToChinese: englishToChinese, // 英译汉
    composition: composition, // 作文组件
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
  min-height: 100%;
  // overflow: hidden;
  .button-box {
    text-align: left;
    padding: 10px;
    padding-bottom: 0;
    border-bottom: 2px solid @theme;
    height: 43px;
    box-sizing: border-box;
    background-color: #fff;
    position: sticky;
    top: -20px;
    z-index: 11;
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