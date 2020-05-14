<template>
  <div class="right" v-loading="isLoading" element-loading-text="拼命加载中" style="padding-top:87px">
    <div style="text-align: center;width:100%;font-size: 18px;font-weight: 700;padding: 8px 0;box-sizing: border-box;border-top: 1px solid #f8f8f8;border-bottom: 1px solid #f8f8f8;position:fixed;top: 46px;z-index: 11;background-color: #fff;">{{test_paper.test_paper_name}}</div>
    <div class="djs" >
      <p style="font-size:0.6rem;;height:46px;line-height:46px;margin-left:20px;width:65%;" > 倒计时：<span style="color:red">{{keepTime}}</span></p>
      <!-- <p style="width:33%;background:rgb(87, 181, 227);height:46px;position:absolute;font-size:0.5rem;right:0;top:0;line-height:46px;color:#fff;text-align:center" @click="submit" >交卷</p> -->
      <van-button @click="stop" type="warning" style="width:20%;height:45px;position:absolute;right:23%;top:0;line-height:46px;color:#fff;text-align:center;box-sizing: border-box;">暂停</van-button>
      <van-button type="info" style="width:20%;background:rgb(87, 181, 227);height:45px;position:absolute;right:0;top:0;line-height:46px;color:#fff;text-align:center;box-sizing: border-box;" @click="open" :disabled ="is_tijiao == true" :loading ="submitLoding == true" >交卷</van-button>
    </div>
    <van-tabs title-active-color="#57B5E3" color="#57B5E3" :sticky="true" :offset-top="133">
      <audio ref="xinwenAudio"></audio>
      <!-- 写作 -->
      <van-tab title="作文">
        <div>
          <p class="xzdr">{{zuowen.wenti}}</p>
          <img v-if="zuowen.is_img != 0" :src="zuowenImgUrl" alt="" style="width: 90%;margin: 0 auto;margin-left: 5%;">
          <van-cell-group>
            <van-field class="xzda" type="textarea" placeholder="请输入答案" v-model="zuowen.yn"/>
          </van-cell-group>
        </div>
        <van-divider contentPosition="center" style="color:#57B5E3;border-color:#1989fa;font-size:16px;" v-if="is_tijiao">解析</van-divider>
        <div v-if="is_tijiao">
          <div class="jx" v-html="zuowen.jiexi"></div>
        </div>
        <van-divider contentPosition="center" style="color:#57B5E3;border-color:#1989fa;font-size:16px;" v-if="is_tijiao">参考答案</van-divider>
        <div v-if="is_tijiao">
          <div class="ckda" v-html="zuowen.daan"></div>
        </div>
      </van-tab>
      <!-- 听短对话 -->
      <van-tab title="听短对话">
        <div>
          <p class="xzdr">Directions: In this section, you will hear several newsreports.At the end of each news report, you will hear two or three questions. Both the news report and the questions will be spoken only once. After you hear a question, you must choose the best answer from the four choices marked A，B，C and D. Then select the corresponding letter on the web page.</p>
        </div>
        <div v-for="(item, key, index) in tingduanduihua">
          <div class="ckda" v-if="is_tijiao" v-html="item.yiwen"></div>
          <!-- <van-button icon="play-circle-o" type="info" style="margin-left:.4rem" size="small" @click="play_xinwen(item,key)">第{{key + 1}}题</van-button> -->
          <div v-for="(ie, k, index) in item.xuanzhe[0]">
            <div>
              <van-button icon="play-circle-o" type="primary" style="margin-left:.4rem" size="mini" @click="play_xinwen_opt(ie,key,k)">第({{k + 1}})小题听力</van-button>
              <el-popover
                placement="left"
                width="250"
                trigger="click">
                <template slot-scope="scope">
                  <div v-html="ie.tiyan" style="border: 1px dashed #ccc;padding:10px;font-size: .32rem;max-height:70vh;overflow: auto;"></div>
                </template>
                <el-button slot="reference" type="warning" style="float:right;margin:10px" size="mini" v-show="is_tijiao">题眼</el-button>
              </el-popover>
            </div>
            <van-radio-group class="xwbgra" v-model="ie.yn" >
              <van-radio :name="e" checked-color="#57B5E3" v-for="(i,e) in ie.xuanxiang">{{i}}</van-radio>
            </van-radio-group>
            <!-- <div class="ty"><div v-if="is_tijiao" v-html="ie.tiyan"></div></div> -->
            <div class="ty"><div v-if="is_tijiao" v-html="ie.jiexi"></div></div>
          </div>
          <hr style="width:90%"/>
        </div>
      </van-tab>
      <!-- 听长对话 -->
      <van-tab title="听长对话">
        <div>
          <p class="xzdr">Directions: In this section you will hear several conversations. Listen to the conversations carefully and then answer the questions that follow.</p>
        </div>
        <div v-for="(item, key, index) in tingchangduihua">
          <div v-if="is_tijiao" v-html="item.yiwen" class="ckda">{{item.yiwen}}</div>
          <van-button icon="play-circle-o" type="info" style="margin-left:.4rem" size="small" @click ="play_chang(item,key)">第{{key + 1}}题</van-button>
          <div v-for="(ie, k, index) in item.xuanzhe[0]">
            <van-button icon="play-circle-o" type="primary" style="margin-left:.4rem" size="mini" @click="play_chang_opt(ie,key,k)">第({{k + 1}})小题听力</van-button>
            <el-popover
              placement="left"
              width="250"
              trigger="click">
              <template slot-scope="scope">
                <div v-html="ie.tiyan" style="border: 1px dashed #ccc;padding:10px;font-size: .32rem;max-height:70vh;overflow: auto;"></div>
              </template>
              <el-button slot="reference" type="warning" style="float:right;margin:10px" size="mini" v-show="is_tijiao">题眼</el-button>
            </el-popover>
            <van-radio-group class="xwbgra" v-model="ie.yn">
              <van-radio :name="e" checked-color="#57B5E3" v-for="(i,e) in ie.xuanxiang">{{i}}</van-radio>
            </van-radio-group>
            <!-- <div class="ty"><div v-if="is_tijiao" v-html="ie.tiyan"></div></div> -->
            <div class="ty"><div v-if="is_tijiao" v-html="ie.jiexi"></div></div>
          </div>
          <hr style="width:90%"/>
        </div>
      </van-tab>
      <!-- 听短文填空 -->
      <van-tab title="短文填空">
        <div>
          <p class="xzdr">Directions: In this section you will hear a record short passage.The passage is printed in the test paper,but with some words or phrases missing.The passage will be read two times.You are required to put the missing words or phrases on the Answer Sheet in order of the number blanks according to what you hear.Now the passage will begin.</p>
        </div>
        <van-button icon="play-circle-o" type="info" style="margin-left:.4rem" size="small" @click ="play_aduanwen">第1题</van-button>
        <div class="xctkxx"><div v-html="duanwentiankong.wenti"></div></div>
        <div v-for="(item, key, index) in duanwentiankong.yn">
          <van-cell-group>
            <van-field v-model="duanwentiankong.yn[key]" :label="pronum(key)" type="textarea" placeholder="请输入单词" rows="1" autosize/>
          </van-cell-group>
        </div>
        <div v-if="is_tijiao"><div class="ckda" v-html="duanwentiankong.daan"></div></div>
        <div v-if="is_tijiao"><div class="ckda" v-html="duanwentiankong.yiwen"></div></div>
        <div v-if="is_tijiao"><div class="ckda" v-html="duanwentiankong.cankaodaan"></div></div>
      </van-tab>
      <!-- 听短文 -->
      <van-tab title="听短文">
        <div>
          <p class="xzdr">Directions: In this section, you will hear several newsreports.At the end of each news report, you will hear two or three questions. Both the news report and the questions will be spoken only once. After you hear a question, you must choose the best answer from the four choices marked A，B，C and D. Then select the corresponding letter on the web page.</p>
        </div>
        <div  v-for="(item, key, index) in tingduanwen">
          <van-button icon="play-circle-o" type="info" style="margin-left:.4rem" size="small" @click ="play_xinwen(item,key)">第{{key + 1}}题</van-button>
          <div v-if="is_tijiao" v-html="item.yiwen" class="ckda">{{item.yiwen}}</div>
          <div v-for="(ie, k, index) in item.xuanzhe">
            <div class="xctkxx"><div>{{ ie.wenti }}</div></div>
            <van-cell-group>
              <van-field v-model="ie.yn" placeholder="请输入答案" />
            </van-cell-group>
            <div class="ty"><div v-if="is_tijiao" v-html="ie.daan"></div></div>
            <div class="ty"><div v-if="is_tijiao" v-html="ie.jiexi"></div></div>
          </div>
          <hr style="width:90%"/>
        </div>
      </van-tab>
      <!-- 词汇选择 -->
      <van-tab title="词汇选择">
        <div v-for="(item, key, index) in cihuixuanzhe">
          <div class="xctkxx"><div v-html="item.wenti"></div></div>
          <van-radio-group class="xwbgra" v-model="item.yn" >
            <van-radio :name="e" checked-color="#57B5E3" v-for="(i,e) in item.xuanxiang">{{i}}</van-radio>
          </van-radio-group>
          <div class="xctkxx" v-if="is_tijiao" ><div v-html="item.yiwen"></div></div>
          <div class="xctkxx" v-if="is_tijiao" ><div v-html="item.jiexi"></div></div>
        </div>
      </van-tab>
      <!-- 词汇填空 -->
      <van-tab title="词汇填空">
        <div v-for="(item, key, index) in cihuitiankong">
          <div class="xctkxx"><div>{{ item.wenti }}</div></div>
          <van-cell-group>
            <van-field v-model="item.yn" placeholder="请输入答案" />
          </van-cell-group>
          <div class="ty"><div v-if="is_tijiao" v-html="item.yiwen"></div></div>
          <div class="ty"><div v-if="is_tijiao" v-html="item.daan"></div></div>
          <div class="ty"><div v-if="is_tijiao" v-html="item.cankaodaan"></div></div>
        </div>
      </van-tab>
      <!-- 仔细阅读 -->
      <van-tab title="仔细阅读">
        <div>
          <p class="xzdr">Directions: In this section there are some passages. Each passage is followed by some questions or unfinished statements with four choices marked A), B), C), and D). You are supposed to read the passage and make the best choice to complete each question or unfinished statement. Then select the corresponding letter on the web page.</p>
          <hr style="width:90%">
        </div>
        <div v-for="(item, key, index) in zixiyuedu">
          <div class="zxyddw" v-html="item.wenzhang" style="margin-bottom:20px"></div>
          <div v-for="(ie, k, index) in item.xuanzhe[0]">
            <div>
              <el-popover
                placement="left"
                width="250"
                trigger="click">
                <template slot-scope="scope">
                  <div v-html="ie.tiyan" style="border: 1px dashed #ccc;padding:10px;font-size: .32rem;max-height:70vh;overflow: auto;"></div>
                </template>
                <el-button slot="reference" type="warning" style="float:right;margin:10px" size="mini" v-show="is_tijiao">题眼</el-button>
              </el-popover>
              <div color="#57B5E3" class="zxydtm" v-html="ie.wenti"></div>
            </div>
            <van-radio-group class="zxydxx" v-model="ie.yn">
              <van-radio :name="e" checked-color="#57B5E3" v-for="(i,e) in ie.xuanxiang">{{i}}</van-radio>
            </van-radio-group>
            <div v-if="is_tijiao"><div class="jx" v-html="ie.jiexi"></div></div>
            <!-- <div v-if="is_tijiao"><div class="jx" v-html="ie.tiyan"></div></div> -->
          </div>
          <hr style="width:90%;color: #1989FA">
        </div>
      </van-tab>
      <!-- 阅读填空 -->
      <van-tab title="阅读填空">
        <div class="xctkxx"><div v-html="yuedutiankong.duanwen"></div></div>
        <div class="xctkxx"><div v-html="yuedutiankong.timu" ></div></div>
        <div v-for="(item, key, index) in yuedutiankong.yn">
          <van-cell-group>
            <van-field v-model="yuedutiankong.yn[key]" :label="pronum(key)" type="textarea" placeholder="请输入单词" rows="1" autosize/>
          </van-cell-group>
        </div>
        <div v-if="is_tijiao"><div class="ckda" v-html="yuedutiankong.daan"></div></div>
        <div v-if="is_tijiao"><div class="ckda" v-html="yuedutiankong.yiwen"></div></div>
        <div v-if="is_tijiao"><div class="ckda" v-html="yuedutiankong.cankaodaan"></div></div>
      </van-tab>
      <!-- 词汇匹配 -->
      <van-tab title="词汇匹配">
        <div v-for="(item, key, index) in cihuipipei">
          <div><div class="ckda" v-html="item.beixuanxiang"></div></div>
          <div class="xuanxiang" v-for="(ie, k, index) in item.xuanzhe">
            <div>
              
              <div class="ckda" v-html="ie.wenti"></div>
            </div>
            <van-cell-group>
              <van-field v-model="ie.yn" placeholder="请输入答案" rows="1" autosize/>
            </van-cell-group>
            <div v-if="is_tijiao"><div class="ckda" v-html="ie.daan"></div></div>
          </div>
          <div v-if="is_tijiao"><div class="ckda" v-html="item.jiexi"></div></div>
        </div>
      </van-tab>
      <!-- 阅读理解 -->
      <van-tab title="阅读理解">
        <div v-for="(item, key, index) in yuedulijie">
          <div><div class="ckda" v-html="item.duanwen"></div></div>
          <div class="xuanxiang" v-for="(ie, k, index) in item.xuanzhe">
            <div>
              <el-popover
                placement="left"
                width="250"
                trigger="click">
                <template slot-scope="scope">
                  <div v-html="ie.tiyan" style="border: 1px dashed #ccc;padding:10px;font-size: .32rem;max-height:70vh;overflow: auto;"></div>
                </template>
                <el-button slot="reference" type="warning" style="float:right;margin:10px" size="mini" v-show="is_tijiao">题眼</el-button>
              </el-popover>
              <div class="ckda" v-html="ie.wenti"></div>
            </div>
            <van-cell-group>
              <van-field v-model="ie.yn" placeholder="请输入答案" rows="1" autosize/>
            </van-cell-group>
            <div v-if="is_tijiao"><div class="ckda" v-html="ie.daan"></div></div>
            <!-- <div v-if="is_tijiao"><div class="ckda" v-html="ie.tiyan"></div></div> -->
          </div>
        </div>
      </van-tab>
      <!-- 翻译选择 -->
      <van-tab title="翻译选择">
        <div v-for="(item, key, index) in fanyixuanzhe">
          <div class="xctkxx"><div v-html="item.wenti"></div></div>
          <van-radio-group class="xwbgra" v-model="item.yn" >
            <van-radio :name="e" checked-color="#57B5E3" v-for="(i,e) in item.xuanxiang">{{i}}</van-radio>
          </van-radio-group>
          <div class="xctkxx" v-if="is_tijiao" ><div v-html="item.yiwen"></div></div>
          <div class="xctkxx" v-if="is_tijiao" ><div v-html="item.jiexi"></div></div>
        </div>
      </van-tab>
      <!-- 英译汉 -->
      <van-tab title="英译汉">
        <div>
          <div>
            <div class="ckda" v-html="yingyihan.wenzhang"></div>
          </div>
          <van-cell-group>
            <van-field class="xzda" type="textarea" placeholder="请输入答案" v-model="yingyihan.yn"/>
          </van-cell-group>
        </div>
        <van-divider contentPosition="center" style="color:#57B5E3;border-color:#1989fa;font-size:16px;" v-if="is_tijiao">解析</van-divider>
        <div v-if="is_tijiao">
          <div class="jx" v-html="yingyihan.jiexi"></div>
        </div>
        <van-divider contentPosition="center" style="color:#57B5E3;border-color:#1989fa;font-size:16px;" v-if="is_tijiao">参考答案</van-divider>
        <div v-if="is_tijiao">
          <div class="ckda" v-html="yingyihan.cankaodaan"></div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      isLoading: false,
      english: [
        {value: 'A',label: '选项 A'},{value: 'B',label: '选项 B'},{value: 'C',label: '选项 C'},{value: 'D',label: '选项 D'},{value: 'E',label: '选项 E'},
        {value: 'F',label: '选项 F'},{value: 'G',label: '选项 G'},{value: 'H',label: '选项 H'},{value: 'I',label: '选项 I'},{value: 'J',label: '选项 J'},
        {value: 'K',label: '选项 K'},{value: 'L',label: '选项 L'},{value: 'M',label: '选项 M'},{value: 'N',label: '选项 N'},{value: 'O',label: '选项 O'},
        {value: 'P',label: '选项 P'},{value: 'Q',label: '选项 Q'},{value: 'R',label: '选项 R'},{value: 'S',label: '选项 S'},{value: 'T',label: '选项 T'}
      ],
      is_tijiao: false,
      baseUrl: '',
      kaoshiId: '',
      school_id: '',
      identity: '',
      id: '',
      start_time: '',
      isChakan: '',
      zuowen: '',
      test_paper: '',
      duanwenlijie: '',
      xuancitiankong: '',
      xuancitiankongDy: [], // 选词填空答案
      xinwenbaodao: '',
      changyuedu: '',
      zixiyuedu: '',
      changduihua: '',
      pianzhangfanyi: '',
      zuowenImgUrl: '',
      keepTime: '开始考试', // 按钮字样
      limittime:120, // 控制倒计时时间
      settime: '', // 倒计时相关
      leftTime: '',
      flag: false,
      showPicker: false,
      xuanciKey: '',
      changyuedyKey: '',
      changShowPicker: false,
      tingduanduihua: '', // 听短对话
      tingchangduihua: '', // 听长对话
      duanwentiankong: '', // 短文填空
      tingduanwen: '', // 听短文
      cihuixuanzhe: '', // 词汇选择
      cihuitiankong: '', // 词汇填空
      yuedutiankong: '', // 阅读填空
      cihuipipei: '', // 词汇匹配
      yuedulijie: '', // 阅读理解
      fanyixuanzhe: '', // 翻译选择
      yingyihan: '', // 英译汉
      submitLoding: false,
    };
  },
  created() {
    this.baseUrl = `${BASE_URL}`;
    this.kaoshiId = localStorage.getItem("kaoshiId");
    this.school_id = localStorage.getItem("school_id");
    this.identity = localStorage.getItem("identity");
    this.id = localStorage.getItem("id");
    this.start_time = Date.parse(new Date())/1000;
    this.isChakan = this.$route.params.isChakan;
    this.getItem();
    if (this.identity == 2 && this.isChakan != 1){
      this.StartCountDown();
    };
    if (this.identity == 1 || this.isChakan == 1){
      this.is_tijiao = true;
    }
  },
  computed: {},
  methods: {
    async getItem(){
      const res = await this.$http.post("admin/Examination/paperlst",qs.stringify({id: this.kaoshiId,u_id:this.id,identity: this.identity}));
      if (res.status === 200 && res.data.code === "1") {
        this.zuowen = res.data.info.zuowen;
        this.test_paper = res.data.info.test_paper;
        this.yingyihan = res.data.info.yingyihan;
        this.fanyixuanzhe = res.data.info.fanyixuanzhe;
        this.yuedulijie = res.data.info.yuedulijie;
        this.cihuipipei = res.data.info.cihuipipei;
        this.yuedutiankong = res.data.info.yuedutiankong;
        this.zixiyuedu = res.data.info.zixiyuedu;
        this.cihuitiankong = res.data.info.cihuitiankong;
        this.cihuixuanzhe = res.data.info.cihuixuanzhe;
        this.duanwentiankong = res.data.info.duanwentiankong;
        this.tingchangduihua = res.data.info.tingchangduihua;
        this.tingduanduihua = res.data.info.tingduanduihua;
        this.tingduanwen = res.data.info.tingduanwen;
        if (this.zuowen.is_img == 1){
          this.zuowenImgUrl = `${this.baseUrl}${this.zuowen.img_url}`;
        }
      }
    },
    StartCountDown() { // 倒计时代码
      var mydate = new Date();
      mydate.setMinutes(mydate.getMinutes() + this.limittime);
      this.settime=mydate;
      let time = setInterval(() => {
          if (this.flag == true) {
            clearInterval(time)
            this.keepTime = `已提交`;
            if (this.leftTime > 0) {
              return false;
            }
            this.submit();
            return false;
          }
          this.timeDown()
      }, 100)
    },
    timeDown() { // 倒计时代码
      const endTime = new Date(this.settime);
      const nowTime = new Date();
      this.leftTime = parseInt((endTime.getTime() - nowTime.getTime()) / 1000);
      let d = parseInt(this.leftTime / (24 * 60 * 60));
      let h = this.formate(parseInt(this.leftTime / (60 * 60) % 24));
      let m = this.formate(parseInt(this.leftTime / 60 % 60));
      let s = this.formate(parseInt(this.leftTime % 60));
      if (this.leftTime <= 0) {
        this.flag = true;
      }
      this.keepTime = `${h}:${m}:${s}`;
    },
    formate(time) { // 倒计时代码
      if (time >= 10) {
          return time
      } else {
        return `0${time}`
      }
    },
    async submit(){ // 交卷
      this.submitLoding = true;
      const res = await this.$http.post("admin/Examination/ABaddpaper",qs.stringify({
        id: this.id,
        kaoshiId: this.kaoshiId,
        school_id: this.school_id,
        zuowen: this.zuowen,  // 1
        yingyihan: this.yingyihan, // 英译汉
        fanyixuanzhe: this.fanyixuanzhe, // 翻译选择
        yuedulijie: this.yuedulijie, // 阅读理解
        cihuipipei: this.cihuipipei, // 词汇匹配
        yuedutiankong: this.yuedutiankong, // 阅读填空
        zixiyuedu: this.zixiyuedu, // 仔细阅读
        cihuitiankong: this.cihuitiankong, // 词汇填空
        cihuixuanzhe: this.cihuixuanzhe, // 词汇选择
        duanwentiankong: this.duanwentiankong, // 短文填空
        tingchangduihua: this.tingchangduihua, // 听长对话
        tingduanduihua: this.tingduanduihua, // 听短对话
        tingduanwen: this.tingduanwen, // 听短文
        start_time: this.start_time,
        test_paper: this.test_paper
      }));
      if (res.status === 200 && res.data.code === "1") {
        this.flag = true;
        this.is_tijiao = true;
        this.submitLoding = false;
        this.dialogVisible = false;
        this.$message({message: res.data.info,type: "success",duration: 10000,showClose: true,});
      } else {
        this.submitLoding = false;
        this.dialogVisible = false;
        this.$message({message: res.data.info,type: "error",duration: 10000,showClose: true,});
      }
    },
    play_xinwen(item,key){ // 新闻报道 duanwenAudio
      this.$refs.xinwenAudio.src = `${this.baseUrl}${item.audio_url}`;
      this.$refs.xinwenAudio.play();
    },
    play_xinwen_opt(ie,key,k){ // 听短对话
      this.$refs.xinwenAudio.src = `${this.baseUrl}${this.tingduanduihua[key].xuanzhe[0][k].audio_url}`;
      this.$refs.xinwenAudio.play();
    },
    play_chang(item,key){ // 听长对话 duanwenAudio
      this.$refs.xinwenAudio.src = `${this.baseUrl}${item.audio_url}`;
      this.$refs.xinwenAudio.play();
    },
    play_chang_opt(ie,key,k){ // 听长对话下的每一项的播放
      this.$refs.xinwenAudio.src = `${this.baseUrl}${this.tingchangduihua[key].xuanzhe[0][k].audio_url}`;
      this.$refs.xinwenAudio.play();
    },
    play_duanwen(item,key){ // 短文理解听力 duanwenAudio
      this.$refs.xinwenAudio.src = `${this.baseUrl}${item.audio_url}`;
      this.$refs.xinwenAudio.play();
    },
    play_duanwen_opt(ie,key,k){ // 短文听力下的每一项的播放
      this.$refs.xinwenAudio.src = `${this.baseUrl}${this.duanwenlijie[key].xuanzhe[0][k].audio_url}`;
      this.$refs.xinwenAudio.play();
    },
    play_aduanwen(){ // A级短文填空播放 
      this.$refs.xinwenAudio.src = `${this.baseUrl}${this.duanwentiankong.audio_url}`;
      this.$refs.xinwenAudio.play();
    },
    onConfirm(value) {
      this.xuancitiankongDy[this.xuanciKey] = value;
      this.showPicker = false;
    },
    pronum(key){ return `第${key + 1}题`;},
    xuanciPiker(key){
      this.xuanciKey = key;
      this.showPicker = true;
    },
    answer(){
      if (!this.xuancitiankong.daan){
        return "加载中";
      }
      let ans = this.xuancitiankong.daan.replace(/\,/g, ' , ');
      return ans;
    },
    twoConfirm(value,index){
      this.changyuedu.xuanzhe[this.changyuedyKey].yn = this.english[index].value;
      this.changShowPicker = false;
    },
    changyueduPicker(key){
      this.changyuedyKey = key;
      this.changShowPicker = true;
    },
    englishIng(){
      let engValue = [];
      for ( var i = 0 ; i < this.english.length ; i++) {
        engValue.push(this.english[i].label);
      }
      return engValue;
    },
    open() {
      this.$confirm('此操作将提交试卷, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'is-tijiao'
      }).then(() => {
        this.submit();
      }).catch(() => {  });
    },
    stop(){
       this.$confirm('返回上一页，且数据只能保存48小时', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'      ,
        customClass: 'is-tijiao'
      }).then(() => {
        this.suspend();
      console.log(1)
      }).catch(() => { 
        console.log(2)
       });
    },
  async suspend(){
      const res = await this.$http.post("admin/Examination/zancun",qs.stringify({
//         id: this.id,
//         kaoshiId: this.kaoshiId,
//         school_id: this.school_id,
//         zuowen: this.zuowen,  // 1
//         duanwenlijie: this.duanwenlijie,
//         xuancitiankong: this.xuancitiankong,
//         xinwenbaodao: this.xinwenbaodao,
//         changyuedu: this.changyuedu,
//         zixiyuedu: this.zixiyuedu,
//         changduihua: this.changduihua,
//         pianzhangfanyi: this.pianzhangfanyi,
//         test_paper: this.test_paper,
//         start_time: this.start_time
        id: this.id,
        kaoshiId: this.kaoshiId,
        school_id: this.school_id,
        zuowen: this.zuowen,  // 1
        yingyihan: this.yingyihan, // 英译汉
        fanyixuanzhe: this.fanyixuanzhe, // 翻译选择
        yuedulijie: this.yuedulijie, // 阅读理解
        cihuipipei: this.cihuipipei, // 词汇匹配
        yuedutiankong: this.yuedutiankong, // 阅读填空
        zixiyuedu: this.zixiyuedu, // 仔细阅读
        cihuitiankong: this.cihuitiankong, // 词汇填空
        cihuixuanzhe: this.cihuixuanzhe, // 词汇选择
        duanwentiankong: this.duanwentiankong, // 短文填空
        tingchangduihua: this.tingchangduihua, // 听长对话
        tingduanduihua: this.tingduanduihua, // 听短对话
        tingduanwen: this.tingduanwen, // 听短文
        start_time: this.start_time,
        test_paper: this.test_paper
      }));
            console.log(res)
      if (res.status === 200 && res.data.code === "1") {
        console.log(res)
        this.flag = true;
        this.is_tijiao = true;
        this.submitLoding = false;
        this.$message({message: res.data.info,type: "success",duration: 10000,showClose: true,});
        this.$router.go(-1);//返回上一层
      } else {
        this.submitLoding = false;
        this.$message({message: res.data.info,type: "error",duration: 10000,showClose: true,});
      }
    }
  

  }
};
</script>

<style lang="less" scoped>
// .van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
//   border-width: 0 0;
// }
.right {
  background-color: #fff;
  min-height: 100%;
  .djs {
    background-color: #fff;
    // position: -webkit-sticky;
    position:fixed;
    top: 88px;
    z-index: 11;
    width:100%;
    font-size: 0.2rem;
  }
  .wz1 {
    background-color: #fff;
    font-size: 0.5rem;
  }
  .exit {
    font-size: 0.6rem;
  }
  .xzdr {
    font-size: 0.3rem;
    width: 90%;
    margin-left: 5%;
    margin-top: 0.5rem;
    text-align: justify;
    display: block;
    line-height: 30px;
  }
  .xzda {
    width: 90%;
    margin-left: 5%;
    border: 1px solid black;
    margin-top: 0.5rem;
    border-radius: 4px;
  }
  .xwbgra {
    font-size: 0.3rem;
    margin: 0.3rem;
    display: block;
    
  }
  .xwbgra .van-radio {
    padding: 0.1rem;
  }
  .xwbgth {
    font-size: 0.4rem;
    background: #57b5e3;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    margin-left: 15px;
    color: #fff;
  }
  .zxydth {
    font-size: 0.4rem;
    background: #57b5e3;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    margin-left: 15px;
    color: #fff;
    margin-top: 0.3rem;
    margin-bottom: 0.3rem;
  }
  .xctkxx {
    font-size: 0.3rem;
    width: 90%;
    margin-left: 5%;
    margin-top: 0.5rem;
    text-align: justify;
    display: block;
    line-height: 30px;
  }
  .xctkdw {
    font-size: 0.3rem;
    width: 90%;
    margin-left: 5%;
    margin-top: 0.5rem;
    text-align: justify;
    display: block;
    line-height: 30px;
  }
  .pzfytm {
    font-size: 0.4rem;
    width: 90%;
    margin-left: 5%;
    margin-top: 0.5rem;
    text-align: justify;
    display: block;
    line-height: 30px;
  }
  .zxyddw {
    font-size: 0.4rem;
    width: 90%;
    margin-left: 5%;
    margin-top: 0.5rem;
    text-align: justify;
    display: block;
    line-height: 30px;
  }
  .zxydtm {
    font-size: 0.4rem;
    width: 90%;
    margin-left: 5%;
    // margin-top: 0.5rem;
    text-align: justify;
    display: block;
    line-height: 30px;
    // position: absolute;
  }

  .zxydxx {
    font-size: 0.3rem;
    margin: 0.3rem;
    display: block;
  }
  .zxydxx .van-radio {
    padding: 0.1rem;
  }
  .jx {
    font-size: 0.3rem;
    width: 90%;
    display: block;
    line-height: 30px;
    text-align: justify;
    // border: 1px solid #57B5E3;
    padding: 10px;
    margin-left: 2%;
  }
  .ckda {
    font-size: 0.3rem;
    width: 90%;
    display: block;
    line-height: 30px;
    text-align: justify;
    // border: 1px solid #57B5E3;
    padding: 10px;
    margin-left: 2%;
  }
  .ty {
    font-size: 0.3rem;
    width: 90%;
    display: block;
    line-height: 30px;
    text-align: justify;
    // border: 1px solid #57B5E3;
    padding: 10px;
    margin-left: 2%;
  }
  .wdda {
    font-size: 0.3rem;
    width: 90%;
    display: block;
    line-height: 30px;
    text-align: justify;
    // border: 1px solid #57B5E3;
    padding: 10px;
    margin-left: 2%;
  }
  .van-tabs__nav--line>.van-tabs__line {
    z-index: 0;
  }

}

</style>
