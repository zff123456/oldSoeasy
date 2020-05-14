<template>
    <div>
        <el-card>
        <div class="add" style="margin-top:20px;">
            <audio ref="vide"></audio>
            <div class="left-type" style="margin:10px 0">
                <el-button type="primary" @click="checked(1)" style="margin:0 40px;"> 四级添加 </el-button>
                <el-button type="primary" @click="checked(2)">六级添加 </el-button>
            </div>
            <div class="list" style="margin: 40px 0 0 50px;">
                <div class="title" style="height: 60px;">
                    <div class="item" style="float: left;margin-right:30px">
                        试卷名称  <el-input v-model="zuowen_title"  style="margin-left:10px;margin-right:20px;width:180px" type="text"   clearable></el-input>
                        满分: <el-input v-model="manfen"  style="margin-left:10px;width:180px" type="text" @change="number"  clearable></el-input>
                    </div>
                    <div class="item">
                        开考时间:
                        <el-date-picker  clearable   v-model="value2"   type="datetimerange"  value-format="timestamp":picker-options="pickerOptions"  start-placeholder="选择开考日期"
                                         range-separator="至" end-placeholder="选择结束日期" align="right" style="margin-left:10px;width:300px;">
                        </el-date-picker>
                    </div>
                </div>
                <div v-for="(item,index) in dataList" >
                    <div style="width: 100%;height: 50px;">
                        <div class="list-item" style="float: left;width: 120px;" >
                            <el-button type="primary"  @click="clicks(item,index)">添加{{item.type}}</el-button>
                        </div>
                        <div class="list-right" style="float: left;margin-left: 40px;">
                            <div class="list-item">
                                题目数量:
                                <el-input   v-model="a.cur[index]" style="width: 180px;margin-right:40px;" @change="numberChange"  disabled clearable></el-input>
                                
                                <!-- <el-input v-model="zuowen_title" style="width: 200px;margin-right:40px;" type="text"></el-input> -->
                                题目分数：<el-input style="width: 180px;" v-model="fenshu.fourfenshu[index]" @input= "change1(index)"  clearable> </el-input>
                                <span style="color:red;font-size: 12px;" v-show="index==0||index==7||index==2">只能添加一道题</span>
                            </div>
                        </div>
                    </div>                 
                </div>
            </div>


        <el-dialog style="width: 75%;margin-top: 100px;margin-left: 10%;height: 800px;padding-bottom:50px"  title="提示" :visible.sync="dialogVisible" >
            <!-- flatten(tableData.slice((currentPage -1) * pagesize, currentPage * pagesize)) -->
            <el-table style="width: 100%"    stripe  @selection-change="handleSelectionChange"
                      :data="tableData" :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}">
                <el-table-column  type="selection"  width="55">
                </el-table-column>
                <el-table-column prop="id" label="Id" width="65"></el-table-column>
               
               <el-table-column  poop="test_paper_type_name"  min-width="160" label="试卷名称" >  
                   <template slot-scope="scope">
                        <div style="text-align: center;" >{{testPaperName(scope.row.test_paper_name)}}</div>
                               <div > {{scope.row.wenti}}</div>
                               <div   v-if="activeIndex==5" v-html="scope.row.wenzhang"></div> 
                               <!-- <div   v-if="activeIndex==5" v-html="scope.row.wenzhang"></div>  -->
                               <el-button size="mini" type="primary" icon="el-icon-video-play" @click ="play_duanwen(scope.row.audio_url)"  v-if="activeIndex==1||activeIndex==3||activeIndex==6" >大题听力</el-button>
                               <div  v-if="activeIndex==1||activeIndex==3||activeIndex==5||activeIndex==6">
                                <div v-for="(item,index) in scope.row.xuanzhe[0]" style="margin:15px 0">
                                         <div   v-if="activeIndex==5" > {{item.wenti}}  </div>
                                    <div v-if="activeIndex!=5" >
                                        <!--  -->
                                        <!-- <el-button size="mini" type="primary" icon="el-icon-video-play" @click ="play_duanwen(item.audio_url)" :disabled="duanwenPlay">第{{key + 1}}题</el-button> -->
                                         <el-button type="success" icon="el-icon-video-play" @click="play_duanwen_opt(item.audio_url)" ref="dw_btn">第({{index + 1}})小题听力     
                                          </el-button>
                                          <div>{{item.oneTranslate}}</div>
                                    </div>
                                    <div v-for="(menu,key) in item.xuanxiang" >
                                         {{menu}}
                                    </div>
                                </div>
                               </div>
                               <div   v-if="activeIndex==2">
                                <div  v-html= "scope.row.duanwen" style="margin:10px 0"> </div> 
                                <div   v-html= "scope.row.xuanxiang" ></div> 
                               </div>
                               <div  v-if="activeIndex==4"  v-html= "scope.row.beixuanxiang" style="margin:10px 0"> 
                                   <!-- <div>{{item.wenti}}</div> -->
                            </div>  
                    </template>  
                </el-table-column> 
            </el-table>
           
            <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="add">确 定</el-button>
        </span>
        </el-dialog>
        <el-button type="primary" @click="submit"  style="position: absolute;left: 60%;top:700px;padding:10px 35px;">提交</el-button>
    </div>
<!-- </div> -->
</el-card>
    </div>
</template>

<script>
    import qs from "qs";
    export default {
        data() {
            return {
                baseUrl:"http://ruanjian.chinadingao.com/",
                dialogVisible:false,
                sub1:{name:"",id:""},
                a:{
                    cur:["","","","","","","",""],
                    fenshu:["","","","","","","",""],
                },
                fenshu:{
                    fourfenshu:[]
                },

                aaid:{
                    zuowen:{
                        id:[],
                        fenshu:""
                    },
                    duanwenlijie:{
                        id:[],
                        fenshu:""
                    },
                    xuancitiankong:{
                        id:[],
                        fenshu:""
                    },
                    xinwenbaogao:{
                        id:[],
                        fenshu:""
                    },
                    changpianyuedu:{
                        id:[],
                        fenshu:""
                    },
                    zixiyueduL:{
                        id:[],
                        fenshu:""
                    },
                    tingchangduihua:{
                        id:[],
                        fenshu:""
                    },
                    pianzhangfanyi:{
                        id:[],
                        fenshu:""
                    },
                },
                index:"",
                activeIndex:0,
                timu:{},
                idlist:[],
                // fenshu:{
                //     fourfenshu:[]
                // },
                type:1,
                pagesize: 10,
                currentPage: 1,
                paperId:1,
                tableData:[],
                dataList:[],
                fourData:[{type:'作文题'},{type:'听短文理解',index:1},{type:'选词填空'},{type:'新闻报道'},{type:'长篇阅读'},{type:'仔细阅读'},{type:'听长对话'},{type:'篇章翻译'},],
                sixData:[{type:'作文题'},{type:'听篇章',index:1},{type:'选词填空'},{type:'听讲座对话'},{type:'长篇阅读'},{type:'仔细阅读'},{type:'听长对话'},{type:'篇章翻译'},],
                // aData:[{type:'听短对话'},{type:'听长对话',index:1},{type:'短文填空'},{type:'听短文'},{type:'词汇选择'},{type:'词汇填空'},{type:'仔细阅读'},{type:'阅读填空'}],
                // bData:[{type:'作文题'},{type:'听短文理解',index:1},{type:'选词填空'},{type:'新闻报道'},{type:'长篇阅读'},{type:'仔细阅读'},{type:'听长对话'},{type:'篇章翻译'}],
                zuowen_title:'',
                manfen:'',
                schoolId:'',
                typeName:'四级题库',
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                value2: '',
                start_time: '',
                end_time: '',
                multipleSelection: []
            };
        },
        created() {

        },
        mounted() {          
            this.dataList=this.fourData
            this.schoolId= localStorage.getItem("school_id"); // 学校id
            console.log(this.schoolId); 
            if (!this.value2 || this.value2 == ''){
                this.start_time = '';this.end_time = ''
            } else {
                this.start_time = this.value2[0]/1000;this.end_time = this.value2[1]/1000
            };
            console.log(this.start_time);
            console.log(this.end_time);          
        },
        methods: {
            numberChange(e){
                console.log(e);
            },
            number(){
              let  flag = new RegExp("^[1-9]([0-9])*$").test(this.manfen);
                     if (!flag) {
                        this.$message({message: "请输入正整数",  type: "warning" });
              }
            },
            play_duanwen(val){ // 短文理解听力 duanwenAudio
 
      this.$refs.vide.src = `${this.baseUrl}${val}`;
      this.$refs.vide.play();
    },
    play_duanwen_opt(val){ 
        console.log(val);
        // 短文听力下的每一项的播放
      
      this.$refs.vide.src = `${this.baseUrl}${val}`;
      console.log(this.$refs.vide.src)
      this.$refs.vide.play();
    },
      async  submit(){
        console.log(this.aaid)
            if(this.zuowen_title.trim()==" "){
                   this.$message({message: "请输入试卷名",  type: "warning" });
                   return
            }
            if(this.manfen.trim()==" "){
                   this.$message({message: "请输入试卷的满分数",  type: "warning" });
                return
            }
            if (!this.value2 || this.value2 == ''){
             this.$message({message: "请选择试卷的开考时间",  type: "warning" });
                this.start_time = '';this.end_time = ''
            } else {
                this.start_time = this.value2[0]/1000;this.end_time = this.value2[1]/1000
            };
            for(let key  in  this.aaid){
                console.log(this.aaid[key].id);
                if(this.aaid[key].id.lenght==0||this.aaid[key].fenshu==""){
                    this.$message({message:'数据不能为空',type:'error'})
                    return
                }
            }
        
            console.log(this.start_time);
            console.log(this.end_time);
                        
         const res = await this.$http.post("admin/Testpapergeneration/teacherTestpapergeneration",        
                qs.stringify({
                    test_paper_type_id:this.paperId,
                    test_paper_name:this.zuowen_title,
                    test_paper_type_name :this.typeName,
                    subordinate:1,
                    subordinate_id:this.schoolId,
                    paper_type:2,
                    manfen:this.manfen,
                    start_time:this.start_time,
                    end_time:this.end_time,
                    zuowen:this.aaid.zuowen,
                    pianzhangfanyi:this.aaid.pianzhangfanyi,
                    xuancitiankong:this.aaid.xuancitiankong,
                    changyuedu:this.aaid.changpianyuedu,
                    duanwenlijie:this.aaid.duanwenlijie,
                    zixiyuedu:this.aaid.zixiyueduL,
                    xinwenbaodao:this.aaid.xinwenbaogao,
                    changduihua:this.aaid.tingchangduihua,
                    }));
                console.log(res);  
                if (res.status ==200 && res.data.code =="1") {
                    this.$message({message:res.data.info,type:'success'})
                    this.zuowen_title=""
                    this.manfen=""
                    this.value2=""
                    this.aaid.zuowen.id=[]
                    this.aaid.xuancitiankong.id=[]
                    this.aaid.changpianyuedu.id=[]
                    this.aaid.duanwenlijie.id=[]
                    this.aaid.zixiyueduL.id=[]
                    this.aaid.xinwenbaogao.id=[]
                    this.aaid.tingchangduihua.id=[]
                   this.aaid.pianzhangfanyi.id=[]
                   this.aaid.zuowen.fenshu=''
                    this.aaid.xuancitiankong.fenshu=''
                    this.aaid.changpianyuedu.fenshu=''
                    this.aaid.duanwenlijie.fenshu=''
                    this.aaid.zixiyueduL.fenshu=''
                    this.aaid.xinwenbaogao.fenshu=''
                    this.aaid.tingchangduihua.fenshu=''
                   this.aaid.pianzhangfanyi.fenshu=''                
                     this.a.cur=["","","","","","","",""]
                    this.fenshu.fourfenshu=[]

                   
                } else{
                    this.$message({message:res.data.info,type:'error'})
                }         
                console.log(this.aaid)
            },
           
            checked(val){
                this.paperId=val
                this.activeIndex = 0
                this.tableData=[]
                if(val==1){
                    this.dataList=this.fourData
                    this.typeName="四级题库"
                }
                if(val==2){
                    this.dataList=this.sixData
                    this.typeName="六级题库"
                }
            },
            change1(index){
                console.log(Array.from(this.fenshu.fourfenshu)[0])
                if(this.fenshu.fourfenshu.length == 1){
                    console.log(this.fenshu.fourfenshu[1])
                    this.aaid.zuowen.fenshu = Array.from(this.fenshu.fourfenshu)[0]
                }
                if(this.fenshu.fourfenshu.length == 2){
                    console.log(this.fenshu.fourfenshu[1])
                    this.aaid.duanwenlijie.fenshu = Array.from(this.fenshu.fourfenshu)[1]
                }
                if(this.fenshu.fourfenshu.length == 3){
                    console.log(this.fenshu.fourfenshu[1])
                    this.aaid.xuancitiankong.fenshu = Array.from(this.fenshu.fourfenshu)[2]
                }
                if(this.fenshu.fourfenshu.length == 4){
                    console.log(this.fenshu.fourfenshu[1])
                    this.aaid.xinwenbaogao.fenshu = Array.from(this.fenshu.fourfenshu)[3]
                }
                if(this.fenshu.fourfenshu.length == 5){
                    console.log(this.fenshu.fourfenshu[1])
                    this.aaid.changpianyuedu.fenshu = Array.from(this.fenshu.fourfenshu)[4]
                }
                if(this.fenshu.fourfenshu.length == 6){
                    console.log(this.fenshu.fourfenshu[1])
                    this.aaid.zixiyueduL.fenshu = Array.from(this.fenshu.fourfenshu)[5]
                }
                if(this.fenshu.fourfenshu.length == 7){
                    console.log(this.fenshu.fourfenshu[1])
                    this.aaid.tingchangduihua.fenshu = Array.from(this.fenshu.fourfenshu)[6]
                }
                if(this.fenshu.fourfenshu.length == 8){
                    console.log(this.fenshu.fourfenshu[1])
                    this.aaid.pianzhangfanyi.fenshu = Array.from(this.fenshu.fourfenshu)[7]
                }

            },
            handleSelectionChange(val){
                this.multipleSelection = val;
 
            },
            add(){
              
                this.multipleSelection.forEach((item,index)=>{
                    if(this.activeIndex == 0){
                       
                    if(this.multipleSelection.length>1){
                       this.$message({message:'作文一次只能添加一个',type:'error'})
                    }else{
                        this.aaid.zuowen.id.push(item.id)
                        this.aaid.zuowen.id = Array.from(new Set(this.aaid.zuowen.id)) 
                        this.dialogVisible=false
                    this.a.cur[this.index]=this.multipleSelection.length
                this.fournum = this.multipleSelection.length
                    }
                        // console.log(this.aaid.zuowen)

                                    
                    }
                    if(this.activeIndex == 1){
                        this.aaid.duanwenlijie.id.push(item.id)
                        this.aaid.duanwenlijie.id = Array.from(new Set(this.aaid.duanwenlijie.id))
                        this.dialogVisible=false
                    this.a.cur[this.index]=this.multipleSelection.length
                this.fournum = this.multipleSelection.length
                    }
                    if(this.activeIndex == 2){
                        if(this.multipleSelection.length>1){
                        this.$message({message:'选词填空一次只能添加一个',type:'error'})
                    }else{
                        this.aaid.xuancitiankong.id.push(item.id)
                        // this.aaid.xuancitiankong.id.push(item.id)
                        this.aaid.xuancitiankong.id = Array.from(new Set(this.aaid.xuancitiankong.id))
                        this.dialogVisible=false
                    this.a.cur[this.index]=this.multipleSelection.length
                this.fournum = this.multipleSelection.length
                    } 
                        
                        
                    }
                    if(this.activeIndex == 3){
                        this.aaid.xinwenbaogao.id.push(item.id)
                        this.aaid.xinwenbaogao.id = Array.from(new Set(this.aaid.xinwenbaogao.id))
                        this.dialogVisible=false
                    this.a.cur[this.index]=this.multipleSelection.length
                this.fournum = this.multipleSelection.length
                    }
                    if(this.activeIndex == 4){
                        this.aaid.changpianyuedu.id.push(item.id)
                        this.aaid.changpianyuedu.id = Array.from(new Set(this.aaid.changpianyuedu.id))
                        this.dialogVisible=false
                    this.a.cur[this.index]=this.multipleSelection.length
                this.fournum = this.multipleSelection.length
                       
                    }
                    if(this.activeIndex == 5){
                        this.aaid.zixiyueduL.id.push(item.id)
                        this.aaid.zixiyueduL.id = Array.from(new Set(this.aaid.zixiyueduL.id))
                        this.dialogVisible=false
                    this.a.cur[this.index]=this.multipleSelection.length
                this.fournum = this.multipleSelection.length
                    }
                    if(this.activeIndex == 6){
                        this.aaid.tingchangduihua.id.push(item.id)
                        this.aaid.tingchangduihua.id = Array.from(new Set(this.aaid.tingchangduihua.id))
                        this.dialogVisible=false
                    this.a.cur[this.index]=this.multipleSelection.length
                this.fournum = this.multipleSelection.length
                    }
                    if(this.activeIndex == 7){
                        if(this.multipleSelection.length>1){
                        this.$message({message:'篇章翻译一次只能添加一个',type:'error'})
                    } else{
                        this.aaid.pianzhangfanyi.id.push(item.id)
                        this.aaid.pianzhangfanyi.id = Array.from(new Set(this.aaid.pianzhangfanyi.id))
                        this.dialogVisible=false
                this.a.cur[this.index]=this.multipleSelection.length
                this.fournum = this.multipleSelection.length

                    }
                       
                        
                    }

                    })
          
            },
            handleSizeChange(val) {
                this.pagesize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            flatten(arr) {
                var res = [];
                arr.map(item => {
                    if (Array.isArray(item)) {
                        res = res.concat(flatten(item));
                    } else {
                        res.push(item);
                    }
                });
                return res;
            },
            testPaperName(i){
                if(i == null){return "不属于任何试卷"} else {return i};
            },
            tesPaperTypeName(i){
                if(i == null){return "不属于任何题库"} else {return i};
            },
            clicks(val,value){
                this.index = value
                this.activeIndex=value
                if(this.activeIndex == 0){
                this.getThesisList()
                this.dialogVisible=true
               }
               if(value==1){
                   this.duanwenlijie()
                   this.dialogVisible=true
               }
              if(value==2){
                this.xuancitiankong()
                this.dialogVisible=true
              }
              if(value==3){
                this.xinwenbaodao()
                this.dialogVisible=true
              }
              if(value==4){
                this.changpianyuedu()
                this.dialogVisible=true
              }
              if(value==5){
                this.zixiyuedu()
                this.dialogVisible=true
              }
              if(value==6){
                this.changduihua()
                this.dialogVisible=true
              }
              if(value==7){
                this.pianzhangfanyi()
                this.dialogVisible=true
              }          
               
                   
            },
            // 获取作文
            async getThesisList() {
                this.tableData=[]
                this.isLoading = true;
                const res = await this.$http.post("admin/paper/CETETzuowenlst",qs.stringify({cet: this.paperId }));
                if (res.status === 200 && res.data.code === "1") {
                    this.tableData = res.data.info;
                    console.log(res);
                }
            },
            // 获取短文理解
      async duanwenlijie() {
        this.tableData=[]
                const res = await this.$http.post("admin/paper/CETETxinwenbaodaolst",qs.stringify({cet: this.paperId,type: 3}));
           if (res.status === 200 && res.data.code === "1") {
                     this.tableData = res.data.info;
                     console.log(res);
                     
      }
    },
    // 获取选词填空
    async xuancitiankong() {
        this.tableData=[]
       const res = await this.$http.post("admin/paper/CETETxuancitikonglst",qs.stringify({cet: this.paperId }));
      if (res.status === 200 && res.data.code === "1") {
        this.tableData = res.data.info;
        console.log(res);
        
        // this.isLoading = false;
      }
    },
    // 新闻报道
    async xinwenbaodao() {
        this.tableData=[]
      const res = await this.$http.post("admin/paper/CETETxinwenbaodaolst",qs.stringify({cet: this.paperId,type:1}));
      if (res.status === 200 && res.data.code === "1") {
        this.tableData = res.data.info;
      }
      console.log(res);
    },
    // 长篇阅读
    async changpianyuedu() {
        this.tableData=[]
        // const res = await this.$http.post("admin/paper/CETchangyuedulst",qs.stringify({cet: this.paperId}));
    const res = await this.$http.post("admin/paper/CETchangyuedulst",qs.stringify({cet: this.paperId}));
      if (res.status === 200 && res.data.code === "1") {
        // this.tableData =  Array.from(res.data.info)
        // console.log(typeof(this.tableData))
       
        // var arr = [];
        for (var i in  res.data.info) {
             this.tableData.push(res.data.info[i])
        }; //属性 //arr.push(object[i]); //值 } console.log(arr);
        console.log(this.tableData);

        
      }
      console.log(res);
    },
    // 仔细阅读
    async zixiyuedu() {
        this.tableData=[]
      this.isLoading = true;
      const res = await this.$http.post("admin/paper/CETzixiyuedulst",qs.stringify({cet: this.paperId}));
      if (res.status === 200 && res.data.code === "1") {
        this.tableData = res.data.info
      }
      console.log(res);
    },
    // 长对话
    async changduihua() {
        this.tableData=[]
    const res = await this.$http.post("admin/paper/CETETxinwenbaodaolst",qs.stringify({cet: this.paperId,type: 2}));
      if (res.status === 200 && res.data.code === "1") {
        this.tableData = res.data.info;
      }
      console.log(res);
    },
// 篇章翻译
    async pianzhangfanyi() {
        this.tableData=[]
    const res = await this.$http.post("admin/paper/CETpianzhangfanyilst",qs.stringify({cet: this.paperId }));
      if (res.status === 200 && res.data.code === "1") {
        this.tableData = res.data.info;
      }
    },
        }
    };
</script>

<style scoped lang="less">
    .el-dialog__wrapper.addDialog .el-dialog{
        margin:0 auto!important;
        margin-top:10%;
    }
    .aaa {
        width: 80% !important;
        height:300px !important
    }
    /* el-dialog__wrapper addDialog */
</style>
