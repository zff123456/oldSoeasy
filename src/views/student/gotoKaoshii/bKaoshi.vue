<template>
  <div class="right">
    <div class="title-box">
      <h1>{{test_paper.test_paper_name}}</h1>
      <div style="position: absolute;top: 32px;left:0;text-aline:center;width:100%;font-size:16px;color:#66b1ff">总分：{{test_paper.manfen}}分</div>
      <p v-if="identity != 1 && isChakan != 1" ><el-button type="text" v-text="keepTime"></el-button></p>
      <!-- @click="StartCountDown"  -->
      <!-- <el-button type="primary" plain @click="goback" style="float: right;background-color:#409EFF;color:#fff;transform: translateY(-4px);border-radius: 4px;">返回列表页</el-button> -->
      <el-button icon="el-icon-arrow-left" type="primary" @click="goback" class="goback" plain>上一页</el-button>
    </div>
    <div class="kaoshi-box">
      <div class="button-box">
        <el-button type="primary" plain @click.native="check(1)" :class="isCheck == 1?'checked':''">听单句</el-button>
        <el-button type="primary" plain @click.native="check(2)" :class="isCheck == 2?'checked':''">听短对话</el-button>
        <el-button type="primary" plain @click.native="check(3)" :class="isCheck == 3?'checked':''">听长对话</el-button>
        <el-button type="primary" plain @click.native="check(4)" :class="isCheck == 4?'checked':''">短文填空</el-button>
        <el-button type="primary" plain @click.native="check(5)" :class="isCheck == 5?'checked':''">词汇选择</el-button>
        <el-button type="primary" plain @click.native="check(6)" :class="isCheck == 6?'checked':''">词汇填空</el-button>
        <el-button type="primary" plain @click.native="check(7)" :class="isCheck == 7?'checked':''">仔细阅读</el-button>
        <el-button type="primary" plain @click.native="check(8)" :class="isCheck == 8?'checked':''">阅读填空</el-button>
        <el-button type="primary" plain @click.native="check(9)" :class="isCheck == 9?'checked':''">词汇匹配</el-button>
        <el-button type="primary" plain @click.native="check(10)" :class="isCheck == 10?'checked':''">阅读理解</el-button>
        <el-button type="primary" plain @click.native="check(11)" :class="isCheck == 11?'checked':''">翻译选择</el-button>
        <el-button type="primary" plain @click.native="check(12)" :class="isCheck == 12?'checked':''">英译汉</el-button>
        <el-button type="primary" plain @click.native="check(13)" :class="isCheck == 13?'checked':''">作文</el-button>
        <el-button type="warning" plain @click="dialogVisible = true" style="float: right;background-color: #67C23A;color:#fff;transform: translateY(-4px);border-radius: 4px;" :disabled="keepTime == '已提交试卷'" :class="keepTime == '已提交试卷'?'jieshu':''" v-if="identity != 1 && isChakan != 1" :loading="submitLoding">交卷</el-button>
        <el-button type="warning" plain @click="isdialogVisible = true" style="background-color: #E6A23C;color:#fff;float: right;transform: translateY(-4px);border-radius: 4px;margin-right:10px"v-if="identity != 1 && isChakan != 1" >暂停作答</el-button>
      </div>
      <!-- 答题卡 -->
      <div class="datika">
        <audio ref="duanwenAudio"></audio>
        <div class="title">答题卡</div>
        <div class="video-box">
          <el-button type="primary" icon="el-icon-video-play" @click="play_ztingli" :disabled="noplay" v-if="test_paper.file_name != '' &&  test_paper.file_name != null">{{test_paper.file_name}}</el-button>
          <audio ref="vide"></audio>
        </div>
        <div class="one-box">
          <div class="one-title" @click ="check(1)">听单句(每题两分)</div>
          <div class="span-box" v-for="(item, key, index) in tingdanju">
            <em style="font-style:normal;margin-right:5px;font-size:16px">第{{ key + 1 }}大题</em>
            <span :class="ie.yn == ''? '': 'chec'" v-for="(ie, k) in item.xuanzhe[0]" v-if="is_tijiao == false" @click ="check(1)">{{k + 1}}</span>
            <span :class="ie.yn != ie.daan? 'bg-red':'chec'" v-for="(ie, k) in item.xuanzhe[0]" v-if="is_tijiao" @click ="check(1)">{{k + 1}}</span>
          </div>
        </div>
        <div class="one-box">
          <div class="one-title" @click ="check(2)">听短对话(每题两分)</div>
          <div class="span-box" v-for="(item, key, index) in tingduanduihua">
            <em style="font-style:normal;margin-right:5px;font-size:16px">第{{ key + 1 }}大题</em>
            <span :class="ie.yn == ''? '': 'chec'" v-for="(ie, k) in item.xuanzhe[0]" v-if="is_tijiao == false" @click ="check(2)">{{k + 1}}</span>
            <span :class="ie.yn != ie.daan? 'bg-red':'chec'" v-for="(ie, k) in item.xuanzhe[0]" v-if="is_tijiao" @click ="check(2)">{{k + 1}}</span>
          </div>
        </div>
        <div class="one-box">
          <div class="one-title" @click ="check(3)">听长对话(每题两分)</div>
          <div class="span-box" v-for="(item, key, index) in tingchangduihua">
            <em style="font-style:normal;margin-right:5px;font-size:16px">第{{ key + 1 }}大题</em>
            <span :class="ie.yn == ''? '': 'chec'" v-for="(ie, k) in item.xuanzhe[0]" v-if="is_tijiao == false" @click ="check(3)">{{k + 1}}</span>
            <span :class="ie.yn != ie.daan? 'bg-red':'chec'" v-for="(ie, k) in item.xuanzhe[0]" v-if="is_tijiao" @click ="check(3)">{{k + 1}}</span>
          </div>
        </div>
        <div class="one-box">
          <div class="one-title" @click ="check(4)">短文填空(每题两分)</div>
          <div class="span-box">
            <span :class="duanwentiankong.yn[key] == ''? '': 'chec'" v-for="(item, key, index) in duanwentiankong.yn" v-if="is_tijiao == false" @click ="check(4)">{{key + 1}}</span>
            <span :class="chakan(key)? 'chec': 'bg-red'" v-for="(item, key, index) in duanwentiankong.yn" v-if="is_tijiao" @click ="check(4)">{{key + 1}}</span>
          </div>
        </div>
        <div class="one-box">
          <div class="one-title" @click ="check(5)">词汇选择(每题两分)</div>
          <div class="span-box">
            <span :class="item.yn == ''? '': 'chec'" v-for="(item, key, index) in cihuixuanzhe" v-if="is_tijiao == false" @click ="check(5)">{{key + 1}}</span>
            <span :class="item.yn != item.daan? 'bg-red':'chec'" v-for="(item, key, index) in cihuixuanzhe" v-if="is_tijiao" @click ="check(5)">{{key + 1}}</span>
          </div>
        </div>
        <div class="one-box">
          <div class="one-title" @click ="check(6)">词汇填空(每题两分)</div>
          <div class="span-box">
            <span :class="item.yn == ''? '': 'chec'" v-for="(item, key, index) in cihuitiankong" v-if="is_tijiao == false" @click ="check(6)">{{key + 1}}</span>
            <span :class="item.yn.replace(/^\s+|\s+$/g,'') == item.daan.replace(/^\s+|\s+$/g,'')? 'chec': 'bg-red'" v-for="(item, key, index) in cihuitiankong" v-if="is_tijiao" @click ="check(6)">{{key + 1}}</span>
          </div>
        </div>
        <div class="one-box">
          <div class="one-title" @click ="check(7)">仔细阅读(每题两分)</div>
          <div class="span-box" v-for="(item, key, index) in zixiyuedu">
            <em style="font-style:normal;margin-right:5px;font-size:16px">第{{ key + 1 }}大题</em>
            <span :class="ie.yn == ''? '': 'chec'" v-for="(ie, k) in item.xuanzhe[0]" v-if="is_tijiao == false" @click ="check(7)">{{k + 1}}</span>
            <span :class="ie.yn != ie.daan? 'bg-red':'chec'" v-for="(ie, k) in item.xuanzhe[0]" v-if="is_tijiao" @click ="check(7)">{{k + 1}}</span>
          </div>
        </div>
        <div class="one-box">
          <div class="one-title" @click ="check(8)">阅读填空(每题两分)</div>
          <div class="span-box">
            <span :class="yuedutiankong.yn[key] == ''? '': 'chec'" v-for="(item, key, index) in yuedutiankong.yn" v-if="is_tijiao == false" @click ="check(8)">{{key + 1}}</span>
            <span :class="ydtk(key)? 'chec': 'bg-red'" v-for="(item, key, index) in yuedutiankong.yn" v-if="is_tijiao" @click ="check(8)">{{key + 1}}</span>
          </div>
        </div>
        <div class="one-box">
          <div class="one-title" @click ="check(9)">词汇匹配(每题两分)</div>
          <div class="span-box" v-for="(item, key, index) in cihuipipei">
            <em style="font-style:normal;margin-right:5px;font-size:16px">第{{ key + 1 }}大题</em>
            <span :class="ie.yn == ''? '': 'chec'" v-for="(ie, k) in item.xuanzhe" v-if="is_tijiao == false" @click ="check(9)">{{k + 1}}</span>
            <span :class="ie.yn.replace(/^\s+|\s+$/g,'') != ie.daan.replace(/^\s+|\s+$/g,'') ? 'bg-red':'chec'" v-for="(ie, k) in item.xuanzhe" v-if="is_tijiao" @click ="check(9)">{{k + 1}}</span>
          </div>
        </div>
        <div class="one-box">
          <div class="one-title" @click ="check(10)">阅读理解(每题两分)</div>
          <div class="span-box" v-for="(item, key, index) in yuedulijie">
            <em style="font-style:normal;margin-right:5px;font-size:16px">第{{ key + 1 }}大题</em>
            <span :class="ie.yn == ''? '': 'chec'" v-for="(ie, k) in item.xuanzhe" v-if="is_tijiao == false" @click ="check(10)">{{k + 1}}</span>
            <span :class="ie.yn.replace(/^\s+|\s+$/g,'') != ie.daan.replace(/^\s+|\s+$/g,'') ? 'bg-red':'chec'" v-for="(ie, k) in item.xuanzhe" v-if="is_tijiao" @click ="check(10)">{{k + 1}}</span>
          </div>
        </div>
        <div class="one-box">
          <div class="one-title" @click ="check(11)">翻译选择(每题两分)</div>
          <div class="span-box">
            <span :class="item.yn == ''? '': 'chec'" v-for="(item, key, index) in fanyixuanzhe" v-if="is_tijiao == false" @click ="check(11)">{{key + 1}}</span>
            <span :class="item.yn != item.daan? 'bg-red':'chec'" v-for="(item, key, index) in fanyixuanzhe" v-if="is_tijiao" @click ="check(11)">{{key + 1}}</span>
          </div>
        </div>
        <div class="one-box">
          <div class="one-title" @click ="check(12)">英译汉</div>
          <div class="span-box">
            <span :class="yingyihan.yn == ''? '': 'chec'" v-if="is_tijiao == false" @click ="check(12)">1</span>
            <span :class="yingyihan.yn == ''? 'bg-red': 'chec'" v-if="is_tijiao" @click ="check(12)">1</span>
          </div>
        </div>
        <div class="one-box">
          <div class="one-title" @click ="check(13)">作文</div>
          <div class="span-box">
            <span :class="zuowen.yn == ''? '': 'chec'" v-if="is_tijiao == false" @click ="check(13)">1</span>
            <span :class="zuowen.yn == ''? 'bg-red': 'chec'" v-if="is_tijiao" @click ="check(13)">1</span>
          </div>
        </div>
      </div>
      <div class="component-box">
        <!-- 听单句 -->
        <div class="big-box" v-show="isCheck == 1">
          <div class="zuowen-title">Directions: In this section, you will hear several newsreports.At the end of each news report, you will hear two or three questions. Both the news report and the questions will be spoken only once. After you hear a question, you must choose the best answer from the four choices marked A，B，C and D. Then select the corresponding letter on the web page.</div>
          <audio ref="xinwenOpt" size="mini"></audio>
          <div v-for="(item, key, index) in tingdanju" class="duanwen-box">
            <div class="duanwen-options" >
              <div class="option-one" v-for="(ie, k, index) in item.xuanzhe[0]">
                <el-button type="success" icon="el-icon-video-play" @click="play_xinwen_opt(ie,key,k)" ref="dw_btn">第({{k + 1}})小题听力</el-button>
                <el-popover
                  placement="left"
                  width="500"
                  trigger="hover">
                  <template slot-scope="scope">
                    <div v-html="ie.tiyan" style="border: 1px dashed #ccc;padding:10px;max-height:70vh;overflow: auto;"></div>
                  </template>
                  <el-button slot="reference" type="warning" style="float:right" v-show="is_tijiao">题眼</el-button>
                </el-popover>
                <div class="xuanxiang" v-for="(i,e) in ie.xuanxiang" style="margin-top: 5px">
                  <el-radio v-model="ie.yn" :label="e" :class="is_tijiao == true && ie.yn != ie.daan && e == ie.daan? 'red':''">{{i}}</el-radio>
                </div>
                <!-- <div v-if="is_tijiao" v-html="ie.tiyan" style="margin-top:10px;border: 1px dashed #ccc;padding:10px">{{ie.tiyan}}</div> -->
                <div v-if="is_tijiao" v-html="ie.jiexi" style="margin-top:10px;border: 1px dashed #ccc;padding:10px">{{ie.jiexi}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 听短对话 -->
        <div class="big-box" v-show="isCheck == 2">
          <div class="zuowen-title">Directions: In this section, you will hear several newsreports.At the end of each news report, you will hear two or three questions. Both the news report and the questions will be spoken only once. After you hear a question, you must choose the best answer from the four choices marked A，B，C and D. Then select the corresponding letter on the web page.</div>
          <audio ref="duanwenOpt" size="mini"></audio>
          <div v-for="(item, key, index) in tingduanduihua" class="duanwen-box">
            <!-- <el-button size="mini" type="primary" icon="el-icon-video-play" @click ="play_duanwen(item,key)" :disabled="duanwenPlay">第{{key + 1}}题</el-button> -->
            <!-- <audio ref="duanwenAudio"></audio> -->
            <!-- <div v-if="is_tijiao" v-html="item.yiwen" style="margin-top:10px;border: 1px solid #ccc;padding:10px">{{item.yiwen}}</div> -->
            <div class="duanwen-options" >
              <div class="option-one" v-for="(ie, k, index) in item.xuanzhe[0]">
                <el-button type="success" icon="el-icon-video-play" @click="play_duanwen_opt(ie,key,k)" ref="dw_btn">第({{k + 1}})小题听力</el-button>
                <el-popover
                  placement="left"
                  width="500"
                  trigger="hover">
                  <template slot-scope="scope">
                    <div v-html="ie.tiyan" style="border: 1px dashed #ccc;padding:10px;max-height:70vh;overflow: auto;"></div>
                  </template>
                  <el-button slot="reference" type="warning" style="float:right" v-show="is_tijiao">题眼</el-button>
                </el-popover>
                <div class="xuanxiang" v-for="(i,e) in ie.xuanxiang" style="margin-top: 5px">
                  <el-radio v-model="ie.yn" :label="e" :class="is_tijiao == true && ie.yn != ie.daan && e == ie.daan? 'red':''">{{i}}</el-radio>
                </div>
                <!-- <div v-if="is_tijiao" v-html="ie.tiyan" style="margin-top:10px;border: 1px dashed #ccc;padding:10px">{{ie.tiyan}}</div> -->
                <div v-if="is_tijiao" v-html="ie.jiexi" style="margin-top:10px;border: 1px dashed #ccc;padding:10px">{{ie.jiexi}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 听长对话 -->
        <div class="big-box" v-show="isCheck == 3">
          <div class="zuowen-title">Directions: In this section, you will hear several newsreports.At the end of each news report, you will hear two or three questions. Both the news report and the questions will be spoken only once. After you hear a question, you must choose the best answer from the four choices marked A，B，C and D. Then select the corresponding letter on the web page.</div>
          <audio ref="changOpt" size="mini"></audio>
          <div v-for="(item, key, index) in tingchangduihua" class="duanwen-box">
            <el-button size="mini" type="primary" icon="el-icon-video-play" @click ="play_chang(item,key)" :disabled="duanwenPlay">第{{key + 1}}题</el-button>
            <audio ref="changAudio"></audio>
            <div v-if="is_tijiao" v-html="item.yiwen" style="margin-top:10px;border: 1px solid #ccc;padding:10px">{{item.yiwen}}</div>
            <div class="duanwen-options" >
              <div class="option-one" v-for="(ie, k, index) in item.xuanzhe[0]">
                <el-button type="success" icon="el-icon-video-play" @click="play_chang_opt(ie,key,k)" ref="dw_btn">第({{k + 1}})小题听力</el-button>
                <el-popover
                  placement="left"
                  width="500"
                  trigger="hover">
                  <template slot-scope="scope">
                    <div v-html="ie.tiyan" style="border: 1px dashed #ccc;padding:10px;max-height:70vh;overflow: auto;"></div>
                  </template>
                  <el-button slot="reference" type="warning" style="float:right" v-show="is_tijiao">题眼</el-button>
                </el-popover>
                <div class="xuanxiang" v-for="(i,e) in ie.xuanxiang" style="margin-top: 5px">
                  <el-radio v-model="ie.yn" :label="e" :class="is_tijiao == true && ie.yn != ie.daan && e == ie.daan? 'red':''">{{i}}</el-radio>
                </div>
                <!-- <div v-if="is_tijiao" v-html="ie.tiyan" style="margin-top:10px;border: 1px dashed #ccc;padding:10px">{{ie.tiyan}}</div> -->
                <div v-if="is_tijiao" v-html="ie.jiexi" style="margin-top:10px;border: 1px dashed #ccc;padding:10px">{{ie.jiexi}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 短文填空 duanwentiankong -->
        <div class="big-box" v-show="isCheck == 4">
          <div class="zuowen-title">Directions: In this section you will hear a record short passage.The passage is printed in the test paper,but with some words or phrases missing.The passage will be read two times.You are required to put the missing words or phrases on the Answer Sheet in order of the number blanks according to what you hear.Now the passage will begin.</div>
          <div style="overflow:hidden">
            <el-button size="mini" type="primary" icon="el-icon-video-play" @click ="play_aduanwen" :disabled="duanwenPlay">播放音频</el-button>
            <div v-html="duanwentiankong.wenti" style="margin-top:10px;padding:10px"></div>
            <div v-if="is_tijiao" v-html="duanwentiankong.yiwen" style="margin-top:10px;padding:10px"></div>
            <div v-if="is_tijiao" v-html="duanwentiankong.cankaodaan" style="margin-top:10px;padding:10px"></div>
            <div v-if="is_tijiao" v-html="duanwentiankong.daan" style="margin-top:10px;padding:10px"></div>
            <div v-for="(item, key, index) in duanwentiankong.yn">
              <div style="float:left;margin: 10px 10px">
                <span>第{{key + 1}}题：</span>
                <el-input v-model="duanwentiankong.yn[key]" placeholder="请输入答案" style="box-sizing: border-box;padding: 0 5px;width: 200px"></el-input>
              </div>
            </div>
          </div>
        </div>
        <!-- 词汇选择 -->
        <div class="big-box" v-show="isCheck == 5">
          <div>
            <div v-for="(item, key, index) in cihuixuanzhe">
              <div v-html="item.wenti" style="margin-top:10px;padding:10px"></div>
              <div class="xuanxiang" v-for="(i,e) in item.xuanxiang" style="margin-top: 5px">
                <el-radio v-model="item.yn" :label="e" :class="is_tijiao == true && item.yn != item.daan && e == item.daan? 'red':''">{{i}}</el-radio>
              </div>
              <div v-if="is_tijiao" v-html="item.yiwen" style="margin-top:10px;padding:10px"></div>
              <div v-if="is_tijiao" v-html="item.jiexi" style="margin-top:10px;padding:10px"></div>
            </div>
          </div>
        </div>
        <!-- 词汇填空 -->
        <div class="big-box" v-show="isCheck == 6">
          <div>
            <div v-for="(item, key, index) in cihuitiankong">
              <div v-html="item.wenti" style="margin-top:10px;padding:10px"></div>
              <el-input v-model="item.yn" placeholder="请输入答案" style="box-sizing: border-box;padding: 0 10px"></el-input>
              <div v-if="is_tijiao" v-html="item.yiwen" style="margin-top:10px;padding:10px"></div>
              <div v-if="is_tijiao" v-html="item.daan" style="margin-top:10px;padding:10px"></div>
              <div v-if="is_tijiao" v-html="item.cankaodaan" style="margin-top:10px;padding:10px"></div>
            </div>
          </div>
        </div>
        <!-- 仔细阅读 -->
        <div class="big-box" v-show="isCheck == 7">
          <div class="zuowen-title">Directions: In this section, you will hear several newsreports.At the end of each news report, you will hear two or three questions. Both the news report and the questions will be spoken only once. After you hear a question, you must choose the best answer from the four choices marked A，B，C and D. Then select the corresponding letter on the web page.</div>
          <div v-for="(item, key, index) in zixiyuedu" class="duanwen-box">
            <div v-html="item.wenzhang" style="margin-top:10px;padding:10px">{{item.wenzhang}}</div>
            <div class="duanwen-options" >
              <div class="option-one" v-for="(ie, k, index) in item.xuanzhe[0]">
                <el-popover
                  placement="left"
                  width="500"
                  trigger="hover">
                  <template slot-scope="scope">
                    <div v-html="ie.tiyan" style="border: 1px dashed #ccc;padding:10px;max-height:70vh;overflow: auto;"></div>
                  </template>
                  <el-button slot="reference" type="warning" style="float:right" v-show="is_tijiao">题眼</el-button>
                </el-popover>
                <div v-html="ie.wenti" style="margin-top:10px;padding:10px">{{ie.wenti}}</div>
                <div class="xuanxiang" v-for="(i,e) in ie.xuanxiang" style="margin-top: 5px">
                  <el-radio v-model="ie.yn" :label="e" :class="is_tijiao == true && ie.yn != ie.daan && e == ie.daan? 'red':''">{{i}}</el-radio>
                </div>
                <div v-if="is_tijiao" v-html="ie.jiexi" style="margin-top:10px;padding:10px">{{ie.jiexi}}</div>
                <!-- <div v-if="is_tijiao" v-html="ie.tiyan" style="padding:10px">{{ie.tiyan}}</div> -->
              </div>
            </div>
          </div>
        </div>
        <!-- 阅读填空  yuedutiankong -->
        <div class="big-box" v-show="isCheck == 8">
          <div style="overflow:hidden">
            <div v-html="yuedutiankong.duanwen" style="margin-top:10px;padding:10px"></div>
            <div v-html="yuedutiankong.timu" style="margin-top:10px;padding:10px"></div>
            <div style="overflow:hidden;">
              <div v-for="(item, key, index) in yuedutiankong.yn" style="height:52px;float:left;">
                <div style="margin: 10px 10px;width:258px">
                  <span>第{{key + 1}}题：</span>
                  <el-input v-model="yuedutiankong.yn[key]" placeholder="请输入答案" style="box-sizing: border-box;padding: 0 5px;width: 200px"></el-input>
                </div>
              </div>
            </div>
            <div v-if="is_tijiao" v-html="yuedutiankong.daan" style="margin-top:10px;padding:10px;float:left;"></div>
            <div v-if="is_tijiao" v-html="yuedutiankong.jiexi" style="margin-top:10px;padding:10px;float:left;"></div>
            <div v-if="is_tijiao" v-html="yuedutiankong.cankaodaan" style="margin-top:10px;padding:10px;float:left;"></div>
          </div>
        </div>
        <!-- 词汇匹配 -->
        <div class="big-box" v-show="isCheck == 9">
          <div>
            <div v-for="(item, key, index) in cihuipipei">
              <div v-html="item.beixuanxiang" style="margin-top:10px;padding:10px"></div>
              <div v-if="is_tijiao" v-html="item.jiexi" style="margin-top:10px;padding:10px"></div>
              <div class="xuanxiang" v-for="(ie, k, index) in item.xuanzhe">
                <div v-html="ie.wenti" style="margin-top:10px;padding:10px"></div>
                <el-input v-model="ie.yn" placeholder="请输入答案" style="box-sizing: border-box;padding: 0 10px"></el-input>
                <div class="zuowen-title" v-if="is_tijiao">{{ie.daan}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 阅读理解 -->
        <div class="big-box" v-show="isCheck == 10">
          <div>
            <div v-for="(item, key, index) in yuedulijie">
              <div v-html="item.duanwen" style="margin-top:10px;padding:10px"></div>
              <div v-if="is_tijiao" v-html="item.cankaodaan" style="margin-top:10px;padding:10px"></div>
              <div class="xuanxiang" v-for="(ie, k, index) in item.xuanzhe">
                <el-popover
                  placement="left"
                  width="500"
                  trigger="hover">
                  <template slot-scope="scope">
                    <div v-html="ie.tiyan" style="border: 1px dashed #ccc;padding:10px;max-height:70vh;overflow: auto;"></div>
                  </template>
                  <el-button slot="reference" type="warning" style="float:right" v-show="is_tijiao">题眼</el-button>
                </el-popover>
                <div v-html="ie.wenti" style="margin-top:10px;padding:10px"></div>
                <el-input v-model="ie.yn" placeholder="请输入答案" style="box-sizing: border-box;padding: 0 10px"></el-input>
                <div class="zuowen-title" v-if="is_tijiao">{{ie.daan}}</div>
                <!-- <div v-if="is_tijiao" v-html="ie.tiyan" style="margin-top:10px;padding:10px"></div> -->
              </div>
            </div>
          </div>
        </div>
        <!-- 翻译选择 -->
        <div class="big-box" v-show="isCheck == 11">
          <div v-for="(item, key, index) in fanyixuanzhe" class="duanwen-box">
            <div class="zuowen-title">{{item.wenti}}</div>
            <div class="zuowen-title" v-if="is_tijiao">{{item.daan}}</div>
            <div class="zuowen-title" v-if="is_tijiao">{{item.jiexi}}</div>
            <div v-if="is_tijiao" v-html="item.yiwen" style="margin-top:10px;border: 1px solid #ccc;padding:10px">{{item.yiwen}}</div>
            <div class="duanwen-options" style="margin: 15px 0;padding-top: 0">
              <div class="xuanxiang" v-for="(ie, k, index) in item.xuanxiang">
                <el-radio v-model="item.yn" :label="k" :class="is_tijiao == true && item.yn != item.daan && k == item.daan? 'red':''">{{ie}}</el-radio>
              </div>
            </div>
          </div>
        </div>
        <!-- 英译汉 -->
        <div class="big-box" v-show="isCheck == 12">
          <div v-html="yingyihan.wenzhang" style="padding:10px">{{yingyihan.wenzhang}}</div>
          <el-input v-model="yingyihan.yn" :autosize="{ minRows: 26}" type="textarea" style="border-radius: 0;margin: 10px 0"></el-input>
          <div v-html="yingyihan.cankaodaan" v-if="is_tijiao" style="border: 1px solid #ccc;padding:10px">{{yingyihan.cankaodaan}}</div>
          <div v-html="yingyihan.jiexi" v-if="is_tijiao" style="margin-top:10px;border: 1px solid #ccc;padding:10px">{{yingyihan.jiexi}}</div>
        </div>
        <!-- 作文题 -->
        <div class="big-box" v-show="isCheck == 13">
          <div class="zuowen-title">{{zuowen.wenti}}</div>
          <img v-if="zuowen.is_img != 0" :src="zuowenImgUrl" alt="" >
          <el-input v-model="zuowen.yn" :autosize="{ minRows: 26}" type="textarea" style="border-radius: 0;margin: 10px 0"></el-input>
          <div v-html="zuowen.daan" v-if="is_tijiao" style="border: 1px solid #ccc;padding:10px">{{zuowen.daan}}</div>
          <div v-html="zuowen.jiexi" v-if="is_tijiao" style="margin-top:10px;border: 1px solid #ccc;padding:10px">{{zuowen.jiexi}}</div>
        </div>
      </div>

    </div>

    <!-- 是否确认交卷弹框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%"  style="position: fixed;top:300px;left:35%;z-index:999;">
      <span>您确定提交试卷吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="submitLoding">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 是否确认暂停作答弹框 -->
    <el-dialog title="提示：" :visible.sync="isdialogVisible"  width="30%"  style="position: fixed;top:300px;left:35%;z-index:999;">
      <span>点击确定将返回到上一页,并且数据只能保存12小时。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="suspend" :loading="submitLoding">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
/* eslint-disable */
import qs from "qs";
// import { fork } from 'cluster';
export default {
  data() {
    return {
      submitLoding: false,
      isCheck: 1,
      noplay: false,
      zuowen: '',
      listenDuan: '',
      zuowenImgUrl: '', // 作文题目图片路径
      is_tijiao: false,
      test_paper: '',
      bigAudioUrl: '', // 总音频按钮
      duanwenPlay: false,
      duanwenlijie: '',
      keepTime: '开始考试', // 按钮字样
      limittime:120, // 控制倒计时时间
      settime: '', // 倒计时相关
      leftTime: '',
      start_time: '',
      flag: false,
      kaoshiId: '',
      xuancitiankong: '', // 选词填空
      xuancitiankongDy: [], // 选词填空答案
      xinwenbaodao: '', // 新闻报道
      changyuedu: '',
      english: [
        {value: 'A',label: '选项 A'},{value: 'B',label: '选项 B'},{value: 'C',label: '选项 C'},{value: 'D',label: '选项 D'},{value: 'E',label: '选项 E'},
        {value: 'F',label: '选项 F'},{value: 'G',label: '选项 G'},{value: 'H',label: '选项 H'},{value: 'I',label: '选项 I'},{value: 'J',label: '选项 J'},
        {value: 'K',label: '选项 K'},{value: 'L',label: '选项 L'},{value: 'M',label: '选项 M'},{value: 'N',label: '选项 N'},{value: 'O',label: '选项 O'},
        {value: 'P',label: '选项 P'},{value: 'Q',label: '选项 Q'},{value: 'R',label: '选项 R'},{value: 'S',label: '选项 S'},{value: 'T',label: '选项 T'}
      ],
      changduihua: '',
      pianzhangfanyi: '',
      school_id: '',
      id: '',
      yingyihan: '', // 英译汉
      fanyixuanzhe: '', // 翻译选择
      yuedulijie: '', // 阅读理解
      cihuipipei: '', // 词汇匹配
      yuedutiankong: '', // 阅读填空
      zixiyuedu: '', // 仔细阅读
      cihuitiankong: '', // 词汇填空
      cihuixuanzhe: '', // 词汇选择
      duanwentiankong: '', // 短文填空
      tingchangduihua: '', // 听长对话
      tingduanduihua: '', // 听短对话
      tingdanju: '', // 听单句
      isChakan: 0,
      identity: '',
      dialogVisible: false, // 是否确认提交试卷
      isdialogVisible: false, // 是否暂停作答
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
    ydtk(key){
      if (this.yuedutiankong.yn[key] == '' || this.yuedutiankong.yn[key] == undefined){
        return false;
      }
      if (this.yuedutiankong.daan.split(',')[key].replace(/^\s+|\s+$/g,'')  == this.yuedutiankong.yn[key].replace(/^\s+|\s+$/g,'')){
        return true;
      } else {
        return false;
      }
    },
    chakan(key){
      if (this.duanwentiankong.yn[key] == '' || this.duanwentiankong.yn[key] == undefined){
        return false;
      }
      if (this.duanwentiankong.daan.split(',')[key].replace(/^\s+|\s+$/g,'')  == this.duanwentiankong.yn[key].replace(/^\s+|\s+$/g,'')){
        return true;
      } else {
        return false;
      }
    },
    check(item) {
      this.isCheck = item;
    },
    play_ztingli(){ // 总音频
      this.$refs.vide.src = `${this.baseUrl}${this.test_paper.file}`;
      this.$refs.vide.play();
      this.noplay = true;
    },
    play_duanwen(item,key){ // 短文理解听力 duanwenAudio
      // this.$refs.duanwenAudio[key].src = `${this.baseUrl}${item.audio_url}`;
      // this.$refs.duanwenAudio[key].play();
      this.$refs.vide.src = `${this.baseUrl}${item.audio_url}`;
      this.$refs.vide.play();
    },
    play_duanwen_opt(ie,key,k){ // 短文听力下的每一项的播放
      // this.$refs.duanwenOpt.src = `${this.baseUrl}${this.tingduanduihua[key].xuanzhe[0][k].audio_url}`;
      // this.$refs.duanwenOpt.play();
      this.$refs.vide.src = `${this.baseUrl}${this.tingduanduihua[key].xuanzhe[0][k].audio_url}`;
      this.$refs.vide.play();
    },
    play_xinwen_opt(ie,key,k){ // 听单句
      // this.$refs.xinwenOpt.src = `${this.baseUrl}${this.tingdanju[key].xuanzhe[0][k].audio_url}`;
      // this.$refs.xinwenOpt.play();
      this.$refs.vide.src = `${this.baseUrl}${this.tingdanju[key].xuanzhe[0][k].audio_url}`;
      this.$refs.vide.play();
    },
    play_chang(item,key){ // 听长对话 duanwenAudio
      // this.$refs.changAudio[key].src = `${this.baseUrl}${item.audio_url}`;
      // this.$refs.changAudio[key].play();
      this.$refs.vide.src = `${this.baseUrl}${item.audio_url}`;
      this.$refs.vide.play();
    },
    play_chang_opt(ie,key,k){ // 听长对话下的每一项的播放
      this.$refs.vide.src = `${this.baseUrl}${this.tingchangduihua[key].xuanzhe[0][k].audio_url}`;
      this.$refs.vide.play();
    },
    play_aduanwen(){ // A级短文填空播放 
      // this.$refs.duanwenAudio.src = `${this.baseUrl}${this.duanwentiankong.audio_url}`;
      // this.$refs.duanwenAudio.play();
      this.$refs.vide.src = `${this.baseUrl}${this.duanwentiankong.audio_url}`;
      this.$refs.vide.play();
    },
    async getItem(){
      console.log(this.kaoshiId,this.id,this.identity);
      
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
        this.tingdanju = res.data.info.tingdanju;
        if (this.zuowen.is_img == 1){
          this.zuowenImgUrl = `${this.baseUrl}${this.zuowen.img_url}`;
        };
        // console.log(this.zixiyuedu);
      }
    },
    StartCountDown() { // 倒计时代码
        var mydate = new Date();
        mydate.setMinutes(mydate.getMinutes() + this.limittime);
        this.settime=mydate;
        let time = setInterval(() => {
            if (this.flag == true) {
              clearInterval(time)
              this.keepTime = `已提交试卷`;
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
        tingdanju: this.tingdanju, // 听单句
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
    goback(){
      this.$router.go(-1);//返回上一层
    },
    async suspend(){
      const res = await this.$http.post("admin/Examination/zancun",qs.stringify({
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
        tingdanju: this.tingdanju, // 听单句
        start_time: this.start_time,
        test_paper: this.test_paper
      }));
      if (res.status === 200 && res.data.code === "1") {
        this.flag = true;
        this.is_tijiao = true;
        this.submitLoding = false;
        this.$message({message: res.data.info,type: "success",duration: 10000,showClose: true,});
        this.$router.go(-1);//返回上一层
      } else {
        this.submitLoding = false;
        this.$message({message: res.data.info,type: "error",duration: 10000,showClose: true,});
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../../assets/css/index.less");
.red {
  color: red;
}
.bg-red {
  background-color: #F56C6C;
  color: #fff;
  border: 1px solid #F56C6C !important;
}
.right {
  min-height: 100%;
  position: relative;
  padding-top: 75px;
  box-sizing: border-box;
  &:after {
    content: "";
    display: block;
    visibility: hidden;
    height: 0;
    line-height: 0;
    clear: both;
  }
  .title-box {
    height: 75px;
    background-color: #fff;
    width: 100%;
    overflow: hidden;
    text-align: center;
    line-height: 55px;
    position: absolute;
    top: 0;
    left: 0;
    h1 {
      // margin-top: 10px;
      font-size: 26px;
    }
    p {
      margin-top: 5px;
      font-size: 16px;
      // height: 28px;
      line-height: 26px;
      position: absolute;
      right: 0;
      bottom: 0;
      .el-button {
        padding: 4px 5px;
        font-size: 26px;
        border-radius: 2px;
        color: red;
      }
    }
    .daotime {
      position: absolute;
      right: 0;
      top: 0;
    }
    .goback {
      position: absolute;
      left: 5px;
      bottom: 5px;
      // color: red;
      // border: none;
    }
  }
  .kaoshi-box {
    padding-top: 20px;
    .button-box {
      text-align: left;
      padding: 10px;
      padding-bottom: 0;
      border-bottom: 2px solid @theme;
      height: 46px;
      box-sizing: border-box;
      background-color: #fff;
      position: -webkit-sticky;
      position: sticky;
      top: -20px;
      z-index: 11;
      button {
        background-color: #fff;
        border: none;
        border-radius: 5px 5px 0 0;
        margin-left: 0;
        font-size: 16px;
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
        &.jieshu {
          opacity:0.7;
        }
      }
    }
    .component-box {
      text-align: left;
      box-sizing: border-box;
      padding-top: 0;
      overflow: hidden;
      background-color: #fff;
      // width: 730px;
      margin-top: 20px;
      // float: left;
      margin-right: 405px;
      .big-box {
        padding: 20px;
        .zuowen-title {
          font-size: 16px;
          line-height: 30px;
        }
        img {
          height: 200px;
          margin-left: 145px;
        }
        .duanwen-options { // 听短文理解选项
          padding: 10px 0 0;
          // border-top: 1px solid #ccc;
          // margin-top: 10px;
          .option-one {
            border-bottom: 1px dashed #ccc;
            margin: 20px 0;
            padding-bottom: 5px;
            overflow: hidden;
            &:last-child {
              border-bottom: none;
            }
            .xuanxiang {
              font-size: 16px;
              height: 20px;
              margin-left: 30px;
            }
          }
          
        }
        .duanwen-box {
          border-bottom: 2px dashed @theme;
          margin-bottom: 20px;
          &:last-child {
            border-bottom: none;
          }
        }
      }
    }
    .datika {
      background-color: #fff;
      width: 385px;
      float: right;
      height: 70vh;
      margin-left: 20px;
      margin-top: 20px;
      padding: 10px 20px;
      box-sizing: border-box;
      overflow:auto;
      position: -webkit-sticky;
      position: sticky;
      top: 40px;
      z-index: 11;
      .title {
        height: 26px;
        font-size: 16px;
        text-align: center;
        line-height: 26px;
        padding-bottom: 5px;
        color: @theme;
        font-weight: 700;
        border-bottom: 1px solid #ccc;
      }
      .one-box {
        margin-top: 10px;
        border-bottom: 1px dashed #ccc;
        &:last-child {
          border-bottom: none;
        }
        .one-title {
          height: 18px;
          font-size: 16px;
          text-indent: 10px;
          border-left: 2px solid @theme;
          line-height: 18px;
          margin-bottom: 5px;
          color: @theme;
          cursor: pointer;
        }
        .span-box {
          span {
            height: 22px;
            width: 22px;
            border: 1px solid @theme;
            display: inline-block;
            font-size: 12px;
            line-height: 20px;
            margin: 4px;
            text-align: center;
            box-sizing: border-box;
            cursor: pointer;
          }
        }
      }
    }
  }
}
.video-box .el-button {
  padding: 9px 9px;
  font-size: 16px;
  margin: 10px 0px 5px;
  width: 100%;
}
.big-box .el-button {
  padding: 9px 11px;
  font-size: 12px;
  border-radius: 2px;
}
.chec {
  background-color: @theme;
  color: #fff;
  border: none;
}
.button-box .el-button {
  padding: 9px 11px;
  font-size: 16px;
  border-radius: 2px;
}
</style>