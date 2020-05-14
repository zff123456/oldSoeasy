<template>
  <div class="right" >
    <!-- 短文填空。 -->
    <div class="form-boxes" ref="right">
      <el-form ref="form" label-width="80px">
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
        <!-- 上传新闻音频 -->
        <el-form-item label="短文音频">
          <el-upload
            style="margin-left:10px"
            :action="actionPath"
            multiple
            :limit="1"
            :file-list="fileList"
            :on-success="fileSuccess">
            <el-button type="primary" style="font-size: 14px;">上传<i class="el-icon-upload el-icon--right"></i></el-button>
            <div slot="tip" class="el-upload__tip">上传短文音频文件，且只能上传一个文件</div>
          </el-upload>
        </el-form-item>
        
        <!-- 音频译文 -->
        <el-form-item label="问题">
          <quill-editor v-model="referenceVersion" style="width:550px;margin-left:10px" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="正确答案">
            <el-input v-model="zqdaan" style="margin-left:10px;width:550px" type="textarea" placeholder="正确答案用英文状态下的逗号隔开"></el-input>
          </el-form-item>
          <el-form-item label="参考答案">
          <quill-editor v-model="cankaodaan" style="width:550px;margin-left:10px" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="译文">
          <quill-editor v-model="yiwen" style="width:550px;margin-left:10px" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item style="margin-left:10px">
          <el-button type="primary" @click="onSubmit" style="float: right;margin-right:15px;margin-top:5px">立即创建</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'; // 导入富文本编辑器组件
import qs from "qs"; // qs数据处理插件
export default {
  name: "shortUnderstanding",
  props: ["paperId", "paperName"],
  data() {
    return {
      paperList: [], // 试卷列表
      paper_ty: '', // 选中的试卷
      referenceVersion: '', // 问题
      zqdaan: '', // 正确答案
      fileList: [],
      file_name: '', // 上传新闻音频
      cankaodaan: '', // 参考答案
      yiwen: '', // 译文
      actionPath: '',
      editorOption: {
        modules:{
          toolbar:[
            [{ 'align': [] }],[{ 'color': [] }, { 'background': [] }],[{ 'direction': 'rtl' }],
            ['bold', 'italic', 'underline', 'strike','image','italic','video','size'],
          ]
        }
      }, // 自定义富文本
    };
  },
  created() {
    this.actionPath = `${BASE_URL}admin/paper/updatafile`;
    this.getPaperList();
    // this.$nextTick(() => {this.initScroll()});
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
    fileSuccess(response, file, fileList){
      let str = response.info;
      let spl = str.substring(str.length-3)
      if(spl == 'mp3' || spl == "MP3"){
        this.file_name = response.info;
      } else {
        this.$message({message: "只能上传mp3格式的音频文件",type: "warning",duration: 2000});
      }
    },
    async onSubmit() {
      if(this.file_name == ''){
        this.$message({message: "请上短文闻音频",type: "warning",duration: 2000});
        return false;
      }
      if(this.referenceVersion == ''){
        this.$message({message: "问题不能为空",type: "warning",duration: 2000});
        return false;
      }
      if(this.zqdaan == ''){
        this.$message({message: "正确答案不能为空",type: "warning",duration: 2000});
        return false;
      }
      if(this.cankaodaan == ''){
        this.$message({message: "参考答案不能为空",type: "warning",duration: 2000});
        return false;
      }
      if(this.yiwen == ''){
        this.$message({message: "译文不能为空",type: "warning",duration: 2000});
        return false;
      }
      const res = await this.$http.post("admin/paper/abduanwentiankong",qs.stringify({ 
        test_paper_id: this.paper_ty,
        audio_url: this.file_name,
        wenti: this.referenceVersion,
        cet: this.paperName,
        daan: this.zqdaan,
        cankaodaan: this.cankaodaan,
        yiwen: this.yiwen
      }));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({message: res.data.info,type: "success",duration: 2000});
        this.paper_ty = '',
        this.file_name = '',
        this.referenceVersion = ''
        this.zqdaan = '',
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
@import url("../../assets/css/index.less");
.right {
  box-sizing: border-box;
  
  .form-boxes {
    width: 660px;
    text-align: left;
    margin: 20px 0 20px 20px;
    padding: 30px 20px 10px 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    p {
      font-size: 14px;
      color: @theme;
      width: 100%;
      text-align: center;
      margin-bottom: 10px;
      border-bottom: 1px solid #ccc;
      margin-bottom:15px;
      padding-bottom:10px;
    }
    .single-box {
      border-bottom: 1px dashed #ccc;
      margin-top: 10px;
    }
    .el-form-item .el-form-item--small {
      line-height: 50px;
      
    }
  }
}
</style>
