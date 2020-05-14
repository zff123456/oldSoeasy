<template>
  <div class="right">
    <div class="form-boxes">
      <el-form ref="form" label-width="80px">
        <!-- 选择试卷 -->
        <el-form-item label="选择试卷" style="ling-height:50px">
          <el-select v-model="paper_ty" placeholder="请选择试卷" style="width:550px;margin-left:10px">
            <el-option
              v-for="item in paperList"
              :key="item.id"
              :label="item.test_paper_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <div class="tishi-text">
          *备选单词使用英文状态下逗号隔开
        </div> -->
        <el-form-item label="短文">
          <quill-editor v-model="tractate" style="width:550px;margin-left:10px" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="文章译文">
          <el-input v-model="articleTranslation" style="margin-left:10px;width:550px" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="备选答案">
          <el-input v-model="alternative" style="margin-left:10px;width:550px" type="textarea" placeholder="备选单词使用英文状态下逗号隔开"></el-input>
        </el-form-item>
        <el-form-item label="正确答案">
          <el-input v-model="rightAnswers" style="margin-left:10px;width:550px" placeholder="正确答案A B C D,使用英文状态下的逗号隔开"></el-input>
        </el-form-item>
        <el-form-item style="margin-left:10px">
          <el-button type="primary" @click="onSubmit" style="float: left;margin-right:15px;margin-top:5px">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

// 导入富文本编辑器组件
import { quillEditor } from 'vue-quill-editor';
import qs from "qs";
export default {
  name: "gapFilling",
  props: ["paperId", "paperName"],
  data() {
    return {
      editorOption: {
        modules:{
          toolbar:[
            [{ 'align': [] }],[{ 'color': [] }, { 'background': [] }],[{ 'direction': 'rtl' }],
            ['bold', 'italic', 'underline', 'strike','image','italic','video','size'],
          ]
        }
      }, // 自定义富文本
      paper_ty: '', // 试卷名称value
      paperList: [], // 试卷名称列表
      alternative: '', // 备选答案
      rightAnswers: '', // 正确答案
      tractate: '', // 短文
      articleTranslation: '', // 文章译文
    };
  },
  created() {
    this.getPaperList();
  },
  components: {
    quillEditor: quillEditor
  },
  computed: {},
  methods: {
    async getPaperList(){
      const res = await this.$http.post("admin/paper/testpapertype",qs.stringify({type: this.paperId }));
      if (res.status === 200 && res.data.code === "1") {
        this.paperList = res.data.info;
      }
    },
    
    async onSubmit() {
      if(this.tractate == ''){
        this.$message({message: "短文内容不能为空",type: "warning",duration: 2000});
        return false;
      }
      if(this.articleTranslation == ''){
        this.$message({message: "文章译文不能为空",type: "warning",duration: 2000});
        return false;
      }
      if(this.alternative == ''){
        this.$message({message: "备选答案不能为空",type: "warning",duration: 2000});
        return false;
      }
      if(this.rightAnswers == ''){
        this.$message({message: "答案不能为空",type: "warning",duration: 2000});
        return false;
      }
      const res = await this.$http.post("admin/paper/addCETduanwentiankong",qs.stringify({ 
        test_paper_id: this.paper_ty,
        duanwen: this.tractate,
        yiwen: this.articleTranslation,
        daan: this.rightAnswers,
        xuanxiang: this.alternative,
        cet: this.paperName,
      }));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({message: res.data.info,type: "success",duration: 2000});
        this.tractate = '';
        this.articleTranslation = '';
        this.alternative = '';
        this.rightAnswers = '';
        this.paper_ty = '';
      } else {
        this.$message({message: res.data.info,type: "warning",duration: 2000});
      }
    },
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/css/index.less");
.right {
  box-sizing: border-box;
  .form-boxes {
    width: 660px;
    text-align: left;
    margin: 20px 0 20px 20px;
    padding: 30px 20px 10px 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    // .tishi-text {
    //   color: red;
    //   font-size: 14px;
    //   text-indent: 30px;
    // }
  }
}
</style>
