<template>
  <div class="right">
    <!-- ab级词汇选择 -->
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
        <el-form-item label="备选词组">
          <el-input v-model="beixuanxiang" style="margin-left:10px;width:550px" type="textarea" placeholder="用英文状态下的逗号隔开"></el-input>
        </el-form-item>
        <el-form-item label="解析">
          <quill-editor v-model="jiexi" style="width:550px;margin-left:10px" :options="editorOption"></quill-editor>
        </el-form-item>
        <!-- 提示文字 -->
        <p>添加问题</p>
        <div class="single-box" v-for="(item,key,id) in options" :key="key">
          <el-form-item label="问题">
            <el-input v-model="item.wenti" style="margin-left:10px;width:550px"></el-input>
          </el-form-item>
          <el-form-item label="答案">
            <el-input v-model="item.daan" style="margin-left:10px;width:550px" placeholder="答案使用大写的ABCD"></el-input>
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
  name: "vocabularyMatching",
  props: ["paperId", "paperName"],
  data() {
    return {
      paperList: [], // 试卷列表
      paper_ty: '', // 选中的试卷
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
          wenti: '', // 题目
          daan: '', // 答案
        }
      ],
      beixuanxiang: '', // 备选项
      jiexi: '', // 解析
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
      if(this.beixuanxiang == ''){
        this.$message({message: "备选项不能为空",type: "warning",duration: 2000});
        return false;
      }
      if(this.jiexi == ''){
        this.$message({message: "解析不能为空",type: "warning",duration: 2000});
        return false;
      }
      for ( let i = 0 ; i < this.options.length ; i++) {
        if(this.options[i].wenti == ''){
          this.$message({message: "问题不能为空",type: "warning",duration: 2000});
          return false;
        }
        if(this.options[i].daan == ''){
          this.$message({message: "答案不能为空",type: "warning",duration: 2000});
          return false;
        }
      }
      const res = await this.$http.post("admin/paper/addcihuipipei",qs.stringify({
        test_paper_id: this.paper_ty,
        options: this.options,
        cet: this.paperName,
        beixuanxiang: this.beixuanxiang,
        jiexi: this.jiexi
      }));
      if (res.status === 200 && res.data.code === "1") {
        this.$message({message: res.data.info,type: "success",duration: 2000});
        this.paper_ty = '';
        this.options = [{
          wenti: '', // 题目
          daan: '', // 答案
        }];
        this.beixuanxiang = '';
        this.jiexi = '';
      } else {
        this.$message({message: res.data.info,type: "warning",duration: 2000});
      }
    },
    addContent(){
      this.options.push({
          wenti: '', // 题目
          daan: '', // 答案
          cankaodaan: '', // 参考答案
          yiwen: '', // 译文
        })
    },
    delitContent(){
      console.log("长度",this.options.length)
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
