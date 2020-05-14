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
        <el-form-item label="备选项">
          <quill-editor v-model="alternative" style="width:550px;margin-left:10px" :options="editorOption"></quill-editor>
        </el-form-item>
        <p>添加问题</p>
        <div class="single-box" v-for="(item,key,id) in options" :key="key">
          <!-- <el-button type="primary" v-on:click.stop="getCanshu(item,key,id)" size="mini" >获取参数</el-button> -->
          <el-form-item label="题目">
            <el-input v-model="item.wenti" style="margin-left:10px;width:550px" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="正确答案">
            <el-select v-model="item.daan" placeholder="请选择活正确答案" style="margin-left:10px;width:550px">
              <el-option
                v-for="item in english"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <!-- <el-radio-group v-model="item.daan" style="margin-left:10px">
              <el-radio label="A">A</el-radio>
              <el-radio label="B">B</el-radio>
              <el-radio label="C">C</el-radio>
              <el-radio label="D">D</el-radio>
            </el-radio-group> -->
          </el-form-item>
          <el-form-item label="题眼">
            <quill-editor v-model="item.tiyan" style="width:550px;margin-left:10px" :options="editorOption"></quill-editor>
          </el-form-item>
          <el-form-item label="解析">
            <quill-editor v-model="item.jiexi" style="width:550px;margin-left:10px" :options="editorOption"></quill-editor>
          </el-form-item>
        </div>
        <div class="additem-box">
            <el-button type="primary" @click="addContent" size="mini" style="margin-left: 90px;margin-top:10px">增加一个题目</el-button>
            <el-button type="danger" @click="delitContent" size="mini" style="margin-left: 20px;margin-top:10px">删掉一个题目</el-button>
          </div>
        <el-form-item style="margin-left:10px">
          <el-button type="primary" @click="onSubmit" style="float: right;margin-right:17px;margin-top:5px">立即创建</el-button>
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
  name: "longRead",
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
      alternative: '', // 备选项
      options: [
        {
          wenti: '',
          daan: '',
          tiyan: '',
          jiexi: '',
        }
      ],
      english: [
        {value: 'A',label: '选项 A'},{value: 'B',label: '选项 B'},{value: 'C',label: '选项 C'},{value: 'D',label: '选项 D'},{value: 'E',label: '选项 E'},
        {value: 'F',label: '选项 F'},{value: 'G',label: '选项 G'},{value: 'H',label: '选项 H'},{value: 'I',label: '选项 I'},{value: 'J',label: '选项 J'},
        {value: 'K',label: '选项 K'},{value: 'L',label: '选项 L'},{value: 'M',label: '选项 M'},{value: 'N',label: '选项 N'},{value: 'O',label: '选项 O'},
        {value: 'P',label: '选项 P'},{value: 'Q',label: '选项 Q'},{value: 'R',label: '选项 R'},{value: 'S',label: '选项 S'},{value: 'T',label: '选项 T'}
      ]
    };
  },
  created() {
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
    addContent(){
      this.options.push({
        wenti: '',
        daan: '',
        tiyan: '',
        jiexi: '',
      })
    },
    delitContent(){
      if (this.options.length > 1){
        this.options.pop()
      } else {
        this.$message({message: "最少保留一个问题",type: "warning",duration: 2000});
      }
    },
    async onSubmit() {
      if(this.alternative == ''){
        this.$message({message: "备选项内容不能为空",type: "warning",duration: 2000});
        return false;
      }
      for ( let i = 0 ; i < this.options.length ; i++) {
        if(this.options[i].wenti == ''){
          this.$message({message: "问题题目不能为空",type: "warning",duration: 2000});
          return false;
        }
        if(this.options[i].daan == ''){
          this.$message({message: "正确答案不能为空",type: "warning",duration: 2000});
          return false;
        }
        if(this.options[i].tiyan == ''){
          this.$message({message: "问题题眼不能为空",type: "warning",duration: 2000});
          return false;
        }
        if(this.options[i].jiexi == ''){
          this.$message({message: "问题解析不能为空",type: "warning",duration: 2000});
          return false;
        }
      }
      const res = await this.$http.post("admin/paper/addCETchangyuedu",qs.stringify({ 
        test_paper_id: this.paper_ty,
        beixuanxiang: this.alternative,
        options: this.options,
        cet: this.paperName
      }));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({message: res.data.info,type: "success",duration: 2000});
        this.paper_ty = '';
        this.alternative = '';
        this.options = [{
          wenti: '',
          daan: '',
          tiyan: '',
          jiexi: '',
        }]
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
  // overflow: hidden;
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
  }
}
</style>
