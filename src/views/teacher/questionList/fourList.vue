<template>
  <div class="right" style="height:100%">
    <div class="button-box">
      <el-button type="primary" plain @click.native="check(1)" :class="isCheck == 1?'checked':''">作文题</el-button>
      <el-button type="primary" plain @click.native="check(4)" :class="isCheck == 4?'checked':''">听短文理解</el-button>
      <el-button type="primary" plain @click.native="check(5)" :class="isCheck == 5?'checked':''">选词填空</el-button>
      <el-button type="primary" plain @click.native="check(2)" :class="isCheck == 2?'checked':''">新闻报道</el-button>
      <el-button type="primary" plain @click.native="check(6)" :class="isCheck == 6?'checked':''">长篇阅读</el-button>
      <el-button type="primary" plain @click.native="check(7)" :class="isCheck == 7?'checked':''">仔细阅读</el-button>
      <el-button type="primary" plain @click.native="check(3)" :class="isCheck == 3?'checked':''">听长对话</el-button>
      <el-button type="primary" plain @click.native="check(8)" :class="isCheck == 8?'checked':''">篇章翻译</el-button>
    </div>
    <div class="component-box">
      <thesisList v-if="isCheck == 1" :paperId="paperId" :paperName="paperName"></thesisList>
      <listenLecture v-if="isCheck == 2" :paperId="paperId" :paperName="paperName"></listenLecture>
      <listenLongList v-if="isCheck == 3" :paperId="paperId" :paperName="paperName"></listenLongList>
      <listenDuanList v-if="isCheck == 4" :paperId="paperId" :paperName="paperName"></listenDuanList>
      <gapFillingList v-if="isCheck == 5" :paperId="paperId" :paperName="paperName"></gapFillingList>
      <longReadList v-if="isCheck == 6" :paperId="paperId" :paperName="paperName"></longReadList>
      <carefulReadingList v-if="isCheck == 7" :paperId="paperId" :paperName="paperName"></carefulReadingList>
      <textualTranslationList v-if="isCheck == 8" :paperId="paperId" :paperName="paperName"></textualTranslationList>
    </div>
  </div>
</template>

<script>
import thesisList from '../../../components/listComponents/thesisList'; // 作文
import listenLecture from '../../../components/listComponents/listenLecture'; // 听新闻报道/ 听讲座  
import listenLongList from '../../../components/listComponents/listenLongList'; // 听长对话
import listenDuanList from '../../../components/listComponents/listenDuanList'; // 短文理解
import gapFillingList from '../../../components/listComponents/gapFillingList'; // 选词填空  
import longReadList from '../../../components/listComponents/longReadList'; // 长篇阅读
import carefulReadingList from '../../../components/listComponents/carefulReadingList'; // 仔细阅读
import textualTranslationList from '../../../components/listComponents/textualTranslationList'; // 新增篇章翻译
export default {
  data() {
    return {
      isCheck: 1,
      paperId: 1,
      paperName: 1,
    };
  },
  components: {
    thesisList: thesisList, // 作文组件
    listenLecture: listenLecture, // 新增听新闻报道
    listenLongList: listenLongList, // 新增听长对话
    listenDuanList: listenDuanList, // 听短文理解
    gapFillingList: gapFillingList, // 选词填空
    longReadList: longReadList, // 长篇阅读
    carefulReadingList: carefulReadingList, // 仔细阅读
    textualTranslationList: textualTranslationList, // 篇章翻译
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
  // height: 100%;
  // overflow: hidden;
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