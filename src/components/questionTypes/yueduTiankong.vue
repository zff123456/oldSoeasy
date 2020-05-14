<template>
  <div class="right">
    <!-- 新增篇章翻译。 -->
    <div class="form-boxes">
      <el-form  label-width="80px">
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
        <el-form-item label="短文">
          <quill-editor v-model="duanwen" style="width:550px;margin-left:10px" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="题目">
          <quill-editor v-model="timu" style="width:550px;margin-left:10px" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="答案">
          <el-input v-model="daan" style="margin-left:10px;width:550px" type="textarea" placeholder="答案用英文状态下的逗号隔开"></el-input>
        </el-form-item>
        <el-form-item label="参考答案">
          <quill-editor v-model="cankaodaan" style="width:550px;margin-left:10px" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="参考答案译文">
          <quill-editor v-model="yiwen" style="width:550px;margin-left:10px" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item style="margin-left:10px">
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

// 导入富文本编辑器组件
import { quillEditor } from 'vue-quill-editor'
import qs from "qs";
export default {
  name: "yueduTiankong",
  props: ["paperId", "paperName"],
  data() {
    return {
      paperList: [], // 试卷列表
      paper_ty: '', // 选中的试卷
      duanwen: '', // 短文
      timu: '', // 题目
      daan: '', // 答案
      cankaodaan: '', // 参考答案
      yiwen: '', // 参考答案译文
      editorOption: {
        modules:{
          toolbar:[
            
            [{ 'align': [] }],[{ 'color': [] }, { 'background': [] }],[{ 'direction': 'rtl' }],
            ['bold', 'italic', 'underline', 'strike','image','italic','video','size'],
          ]
        }
      }, // 自定义富文本
      id: 0,
    };
  },
  created() {
    this.getPaperList()
  },
  components: {
    quillEditor: quillEditor
  },
  computed: {},
  methods: {
    async getPaperList(){
      const res = await this.$http.post("admin/paper/testpapertype",qs.stringify({type: this.paperId }));
      if (res.status === 200 && res.data.code === "1") {
        this.paperList = res.data.info
        console.log(res.data);
      }
    },
    
    async onSubmit() {
      if(this.duanwen == ''){
        this.$message({message: "短文内容不能为空",type: "warning",duration: 2000});
        return false;
      }
      if(this.timu == ''){
        this.$message({message: "题目内容不能为空",type: "warning",duration: 2000});
        return false;
      }
      if(this.daan == ''){
        this.$message({message: "答案不能为空",type: "warning",duration: 2000});
        return false;
      }
      if(this.cankaodaan == ''){
        this.$message({message: "参考答案不能为空",type: "warning",duration: 2000});
        return false;
      }
      if(this.yiwen == ''){
        this.$message({message: "参考答案译文不能为空",type: "warning",duration: 2000});
        return false;
      }
      const res = await this.$http.post("admin/paper/abyuedutiankong",qs.stringify({
        test_paper_id: this.paper_ty,
        duanwen: this.duanwen,
        timu: this.timu,
        daan: this.daan,
        cankaodaan: this.cankaodaan,
        yiwen: this.yiwen,
        cet: this.paperId,
      }));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({message: res.data.info,type: "success",duration: 2000});
        this.paper_ty = '';
        this.duanwen = '';
        this.timu = '';
        this.daan = '';
        this.cankaodaan = '',
        this.yiwen = ''
      } else {
        this.$message({message: res.data.info,type: "warning",duration: 2000});
      }
    }
  }
};
</script>

<style lang="less" scoped>
.right {
  box-sizing: border-box;
  .form-boxes {
    width: 660px;
    text-align: left;
    margin: 20px 0 20px 20px;
    padding: 30px 20px 20px 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    .el-form-item .el-form-item--small {
      line-height: 50px;
    }
  }
}
</style>
