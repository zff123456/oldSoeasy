<template>
  <div class="right">
    <div class="button-box">
      <el-button type="primary" plain @click.native="check(1)" :class="isCheck == 1?'checked':''">新增作文题</el-button>
      <el-button type="primary" plain @click.native="check(4)" :class="isCheck == 4?'checked':''">新增听短文理解</el-button>
      <el-button type="primary" plain @click.native="check(5)" :class="isCheck == 5?'checked':''">新增选词填空</el-button>
      <el-button type="primary" plain @click.native="check(2)" :class="isCheck == 2?'checked':''">新增新闻报道</el-button>
      <el-button type="primary" plain @click.native="check(6)" :class="isCheck == 6?'checked':''">新增长篇阅读</el-button>
      <el-button type="primary" plain @click.native="check(7)" :class="isCheck == 7?'checked':''">新增仔细阅读</el-button>
      <el-button type="primary" plain @click.native="check(3)" :class="isCheck == 3?'checked':''">新增听长对话</el-button>
      <el-button type="primary" plain @click.native="check(8)" :class="isCheck == 8?'checked':''">新增篇章翻译</el-button>
    </div>
    <div class="component-box">
      <composition v-if="isCheck == 1" :paperId="paperId" :paperName="paperName"></composition>
      <listenNewsReport v-if="isCheck == 2" :paperId="paperId" :paperName="paperName"></listenNewsReport>
      <listenLongDuihua v-if="isCheck == 3" :paperId="paperId" :paperName="paperName"></listenLongDuihua>
      <duanUnderstand v-if="isCheck == 4" :paperId="paperId" :paperName="paperName"></duanUnderstand>
      <gapFilling v-if="isCheck == 5" :paperId="paperId" :paperName="paperName"></gapFilling>
      <longRead v-if="isCheck == 6" :paperId="paperId" :paperName="paperName"></longRead>
      <carefulReading v-if="isCheck == 7" :paperId="paperId" :paperName="paperName"></carefulReading>
      <textualTranslation v-if="isCheck == 8" :paperId="paperId" :paperName="paperName"></textualTranslation>
    </div>
  </div>
</template>
 
 
<script>
import composition from '../../../components/questionTypes/composition'; // 作文
import listenNewsReport from '../../../components/questionTypes/listenNewsReport'; // 听新闻报道
import listenLongDuihua from '../../../components/questionTypes/listenLongDuihua'; // 听长对话
import duanUnderstand from '../../../components/questionTypes/duanUnderstand'; // 短文理解
import gapFilling from '../../../components/questionTypes/gapFilling'; // 选词填空
import longRead from '../../../components/questionTypes/longRead'; // 长篇阅读
import carefulReading from '../../../components/questionTypes/carefulReading'; // 仔细阅读
import textualTranslation from '../../../components/questionTypes/textualTranslation'; // 新增篇章翻译
export default {
  data() {
    return {
      isCheck: 1,
      paperId: 1,
      paperName: 1,
    };
  },
  components: {
    composition: composition, // 作文组件
    listenNewsReport: listenNewsReport, // 新增听新闻报道
    listenLongDuihua: listenLongDuihua, // 新增听长对话
    duanUnderstand: duanUnderstand, // 新增短文理解
    gapFilling: gapFilling, // 选词填空
    longRead: longRead, // 长篇阅读
    carefulReading: carefulReading, // 仔细阅读
    textualTranslation: textualTranslation, // 篇章翻译
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