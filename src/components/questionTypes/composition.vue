<template>
  <div class="right">
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
        <!--题目 解析 参考答案 -->
        <el-form-item label="题目">
          <el-input v-model="zuowen_title" style="margin-left:10px;width:550px" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="上传图片">
          <el-radio-group v-model="is_img" style="margin-left:10px">
            <el-radio :label="1" v-model="is_img">上传</el-radio>
            <el-radio :label="0" v-model="is_img">不上传</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="is_img == 1">
          <el-upload
            style="margin-left:10px"
            :action="actionPath"
            multiple
            :limit="1"
            :file-list="fileList"
            :on-success="fileSuccess">
            <el-button type="primary" style="font-size: 14px;">上传<i class="el-icon-upload el-icon--right"></i></el-button>
            <div slot="tip" class="el-upload__tip">只能上传图片，且只能上传一个文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="解析">
          <quill-editor v-model="zuowen_text" style="width:550px;margin-left:10px" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="参考答案">
          <quill-editor v-model="referenceVersion" style="width:550px;margin-left:10px" :options="editorOption"></quill-editor>
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
  name: "composition",
  props: ["paperId", "paperName"],
  data() {
    return {
      paperList: [], // 试卷列表
      paper_ty: '', // 选中的试卷
      zuowen_title: '', // 标题
      zuowen_text: '', // 解析
      referenceVersion: '', // 参考答案
      is_img: '', // 是否需要上传图片
      file_name: '', // 上传图片
      fileList: [],
      editorOption: {
        modules:{
          toolbar:[
            
            [{ 'align': [] }],[{ 'color': [] }, { 'background': [] }],[{ 'direction': 'rtl' }],
            ['bold', 'italic', 'underline', 'strike','image','italic','video','size'],
          ]
        }
      }, // 自定义富文本
      id: 0,
      actionPath: '',
      img_id: '',
    };
  },
  created() {
    // console.log("paperId",paperId);
    console.log("this.paperId", this.paperId);
    // console.log("paperName",paperName);
    console.log("this.paperName", this.paperName);
    this.actionPath = `${BASE_URL}admin/paper/updatafile`;
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
    fileSuccess(response, file, fileList){
      this.file_name = response.info
      console.log(this.file_name)
    },
    async onSubmit() {
      // console.log('submit!');
      if (this.is_img == '') {
        this.is_img = 0
      }
      if(this.paper_ty == ''){
        this.paper_ty = 0
      }
      if(this.zuowen_title == ''){
        this.$message({message: "请填写题目",type: "warning",duration: 2000});
        return false;
      }
      if(this.zuowen_text == ''){
        this.$message({message: "请填写解析",type: "warning",duration: 2000});
        return false;
      }
      if(this.referenceVersion == ''){
        this.$message({message: "请填写参考答案",type: "warning",duration: 2000});
        return false;
      }
      const res = await this.$http.post("admin/paper/addupdataCETzuowen",qs.stringify({ 
        test_paper_id: this.paper_ty,
        is_img: this.is_img,
        img_url: this.file_name,
        wenti: this.zuowen_title,
        jiexi: this.zuowen_text,
        daan: this.referenceVersion,
        id: "0",
        img_id: this.img_id,
        cet: this.paperName
      }));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({message: res.data.info,type: "success",duration: 2000});
        this.paper_ty = '';
        this.is_img ='';
        this.file_name = '';
        this.zuowen_title = '';
        this.zuowen_text = '';
        this.referenceVersion = '';
        this.img_id = '';
      } else {
        this.$message({message: res.data.info,type: "warning",duration: 2000});
        this.paper_ty = '';
      }
    },
    
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
