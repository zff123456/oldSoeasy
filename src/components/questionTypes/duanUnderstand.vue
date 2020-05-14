<template>
  <div class="right">
    <div class="form-boxes">
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
        <el-form-item label="新闻音频">
          <el-upload
            style="margin-left:10px"
            :action="actionPath"
            multiple
            :limit="1"
            :file-list="fileList"
            :on-success="fileSuccess">
            <el-button type="primary" style="font-size: 14px;">上传<i class="el-icon-upload el-icon--right"></i></el-button>
            <div slot="tip" class="el-upload__tip">上传新闻音频文件，且只能上传一个文件</div>
          </el-upload>
        </el-form-item>
        
        <!-- 音频译文 -->
        <el-form-item label="音频译文">
          <quill-editor v-model="referenceVersion" style="width:550px;margin-left:10px" :options="editorOption"></quill-editor>
        </el-form-item>
        <!-- 提示文字 -->
        <p>添加问题</p>
        <!-- 单行问题 -->
        <div class="single-box" v-for="(item,key,id) in options" :key="key">
          <!-- <el-button type="primary" v-on:click.stop="getCanshu(item,key,id)" size="mini" >获取参数</el-button> -->
          <el-form-item label="题目音频">
            <el-upload
              style="margin-left:10px"
              :action="oneActionPath"
              multiple
              :limit="1"
              :file-list="fileList"
              :data="{id:key}"
              :on-success="oneFileSuccess">
              <el-button type="primary" style="font-size: 14px;">上传<i class="el-icon-upload el-icon--right"></i></el-button>
              <div slot="tip" class="el-upload__tip">上传新闻音频文件，且只能上传一个文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="题目译文">
            <el-input v-model="item.oneTranslate" style="margin-left:10px;width:550px"></el-input>
          </el-form-item>
          <el-form-item label="选项A">
            <el-input v-model="item.optionA" style="margin-left:10px;width:550px"></el-input>
          </el-form-item>
          <el-form-item label="选项B">
            <el-input v-model="item.optionB" style="margin-left:10px;width:550px"></el-input>
          </el-form-item>
          <el-form-item label="选项C">
            <el-input v-model="item.optionC" style="margin-left:10px;width:550px"></el-input>
          </el-form-item>
          <el-form-item label="选项D">
            <el-input v-model="item.optionD" style="margin-left:10px;width:550px"></el-input>
          </el-form-item>
          <el-form-item label="正确答案">
            <el-radio-group v-model="item.answer" style="margin-left:10px">
              <el-radio label="A">A</el-radio>
              <el-radio label="B">B</el-radio>
              <el-radio label="C">C</el-radio>
              <el-radio label="D">D</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="题眼">
            <quill-editor v-model="item.tiyan" style="width:550px;margin-left:10px" :options="editorOption"></quill-editor>
          </el-form-item>
          <el-form-item label="解析">
            <el-input v-model="item.jiexi" style="margin-left:10px;width:550px" type="textarea"></el-input>
          </el-form-item>
        </div>
        <div class="additem-box">
          <el-button type="primary" @click="addContent" size="mini" style="margin-left: 90px;margin-top:10px">增加一个题目</el-button>
          <el-button type="danger" @click="delitContent" size="mini" style="margin-left: 20px;margin-top:10px">删掉一个题目</el-button>
        </div>
        <el-form-item style="margin-left:10px">
          <el-button type="primary" @click="onSubmit" style="float: right;margin-right:15px;margin-top:5px">立即创建</el-button>
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
  name: "duanUnderstand",
  props: ["paperId", "paperName"],
  data() {
    return {
      paperList: [], // 试卷列表
      paper_ty: '', // 选中的试卷
      referenceVersion: '', // 音频译文
      fileList: [],
      actionPath: '',
      oneActionPath: '',
      editorOption: {
        modules:{
          toolbar:[
            [{ 'align': [] }],[{ 'color': [] }, { 'background': [] }],[{ 'direction': 'rtl' }],
            ['bold', 'italic', 'underline', 'strike','image','italic','video','size'],
          ]
        }
      }, // 自定义富文本
      options: [
        {
          oneActios: '',
          oneTranslate: '',
          optionA: '',
          optionB: '',
          optionC: '',
          optionD: '',
          tiyan: '',
          jiexi: '',
          answer: '',
        }
      ]
    };
  },
  created() {
    console.log("this.paperId", this.paperId);
    console.log("this.paperName", this.paperName);
    this.actionPath = `${BASE_URL}admin/paper/updatafile`;
    this.oneActionPath = `${BASE_URL}admin/paper/updatafileetc`;
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
        this.$message({message: "请上传新闻音频",type: "warning",duration: 2000});
        return false;
      }
      if(this.referenceVersion == ''){
        this.$message({message: "音频译文不能为空",type: "warning",duration: 2000});
        return false;
      }
      for ( let i = 0 ; i < this.options.length ; i++) {
        if(this.options[i].oneActios == ''){
          this.$message({message: "题目音频不能为空",type: "warning",duration: 2000});
          return false;
        }
        if(this.options[i].oneTranslate == ''){
          this.$message({message: "题目译文不能为空",type: "warning",duration: 2000});
          return false;
        }
        if(this.options[i].optionA == '' || this.options[i].optionB == '' ||this.options[i].optionC == '' ||this.options[i].optionD == '' ){
          this.$message({message: "请将题目选项填写完整",type: "warning",duration: 2000});
          return false;
        }
        if(this.options[i].answer == ''){
          this.$message({message: "题目正确答案不能为空",type: "warning",duration: 2000});
          return false;
        }
        if(this.options[i].tiyan == ''){
          this.$message({message: "题目题眼不能为空",type: "warning",duration: 2000});
          return false;
        }
        if(this.options[i].jiexi == ''){
          this.$message({message: "题目解析不能为空",type: "warning",duration: 2000});
          return false;
        }
      }
      const res = await this.$http.post("admin/paper/addCETxinwenbaodao",qs.stringify({ 
        test_paper_id: this.paper_ty,
        audio_url: this.file_name,
        yiwen: this.referenceVersion,
        options: this.options,
        type: 3, // 3 四级代表听短文理解 六级代表听篇章
        cet: this.paperName,
      }));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({message: res.data.info,type: "success",duration: 2000});
        this.paper_ty = '',
        this.file_name = '',
        this.referenceVersion = '',
        this.options = [{
                        oneActios: '',
                        oneTranslate: '',
                        optionA: '',
                        optionB: '',
                        optionC: '',
                        optionD: '',
                        tiyan: '',
                        jiexi: '',
                        answer: '',}]
      } else {
        this.$message({message: res.data.info,type: "warning",duration: 2000});
      }
    },
    oneFileSuccess(response, file, fileList) {
      let str = response.info.url;
      let spl = str.substring(str.length-3)
      if(spl == 'mp3' || spl == "MP3"){
        let photo_id = response.info.id.id;
        this.options[photo_id].oneActios = response.info.url;
      } else {
        this.$message({message: "只能上传mp3格式的音频文件",type: "warning",duration: 2000});
      }
    },
    addContent(){
      this.options.push({
        oneActios: '', // 单个音频地址
        oneTranslate: '', // 题目译文
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        tiyan: '', // 题眼
        jiexi: '', // 解析
        answer: '', // 答案
      })
    },
    delitContent(){
      if (this.options.length > 1){
        this.options.pop()
      } else {
        this.$message({message: "最少保留一个问题",type: "warning",duration: 2000});
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
