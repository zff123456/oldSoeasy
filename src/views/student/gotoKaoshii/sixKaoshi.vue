<template>
  <div class="right">
    <div class="title-box">
      <h1>{{test_paper.test_paper_name}}</h1>
      <div style="position: absolute;top: 32px;left:0;text-aline:center;width:100%;font-size:16px;color:#66b1ff">总分：{{test_paper.manfen}}分</div>
      <p v-if="identity != 1 && isChakan != 1" >
        <el-button type="text" v-text="keepTime"></el-button>
      </p>
      <!-- @click="StartCountDown"  -->
      <el-button icon="el-icon-arrow-left" type="primary" @click="goback" class="goback" plain>上一页</el-button>
    </div>
    <div class="kaoshi-box">
      <div class="button-box">
        <el-button type="primary" plain @click.native="check(1)" :class="isCheck == 1?'checked':''">作文题</el-button>
        <el-button type="primary" plain @click.native="check(2)" :class="isCheck == 2?'checked':''">听篇章</el-button>
        <el-button type="primary" plain @click.native="check(3)" :class="isCheck == 3?'checked':''">选词填空</el-button>
        <el-button type="primary" plain @click.native="check(4)" :class="isCheck == 4?'checked':''">听讲座对话</el-button>
        <el-button type="primary" plain @click.native="check(5)" :class="isCheck == 5?'checked':''">长篇阅读</el-button>
        <el-button type="primary" plain @click.native="check(6)" :class="isCheck == 6?'checked':''">仔细阅读</el-button>
        <el-button type="primary" plain @click.native="check(7)" :class="isCheck == 7?'checked':''">听长对话</el-button>
        <el-button type="primary" plain @click.native="check(8)" :class="isCheck == 8?'checked':''">篇章翻译</el-button>
        <el-button type="warning" plain @click="dialogVisible = true" style="float: right;background-color: #67C23A;color:#fff;transform: translateY(-4px);border-radius: 4px;" :disabled="keepTime == '已提交试卷'" :class="keepTime == '已提交试卷'?'jieshu':''" v-if="identity != 1 && isChakan != 1" :loading="submitLoding">交卷</el-button>
        <el-button type="warning" plain @click="isdialogVisible = true" style="background-color: #E6A23C;color:#fff;float: right;transform: translateY(-4px);border-radius: 4px;margin-right:10px" v-if="identity != 1 && isChakan != 1">暂停作答</el-button>
      </div>
      <!-- 答题卡 -->
      <div class="datika" ref="product">
        <div class="inner-box">
          <div class="title">答题卡</div>
          <div class="video-box">
            <el-button
              v-if="test_paper.file_name != '' &&  test_paper.file_name != null"
              type="primary"
              icon="el-icon-video-play"
              @click="play_ztingli"
              :disabled="noplay"
            >{{test_paper.file_name}}</el-button>
            <audio ref="vide"></audio>
          </div>
          <div class="one-box">
            <div class="one-title" @click ="check(1)">作文</div>
            <div class="span-box">
              <span :class="zuowen.yn == ''? '': 'chec'" v-if="is_tijiao == false" @click ="check(1)">1</span>
              <span :class="zuowen.yn == ''? 'bg-red': 'chec'" v-if="is_tijiao" @click ="check(1)">1</span>
            </div>
          </div>
          <div class="one-box">
            <div class="one-title" @click ="check(2)">听篇章(每题两分)</div>
            <div class="span-box" v-for="(item, key, index) in duanwenlijie">
              <em style="font-style:normal;margin-right:5px;font-size:16px">第{{ key + 1 }}大题</em>
              <span :class="ie.yn == ''? '': 'chec'" v-for="(ie, k) in item.xuanzhe[0]" v-if="is_tijiao == false" @click ="check(2)">{{k + 1}}</span>
              <span :class="ie.yn != ie.daan? 'bg-red':'chec'" v-for="(ie, k) in item.xuanzhe[0]" v-if="is_tijiao" @click ="check(2)">{{k + 1}}</span>
            </div>
          </div>
          <div class="one-box">
            <div class="one-title" @click ="check(3)">选词填空(每题两分)</div>
            <div class="span-box">
              <span :class="xuancitiankongDy[key] == null? '': 'chec'" v-for="(item, key, index) in xuancitiankong.xuan" v-if="is_tijiao == false" @click ="check(3)">{{key + 1}}</span>
              <span :class="chakan(key)? 'chec': 'bg-red'" v-for="(item, key, index) in xuancitiankong.xuan" v-if="is_tijiao" @click ="check(3)">{{key + 1}}</span>
            </div>
          </div>
          <div class="one-box">
            <div class="one-title" @click ="check(4)">听讲座对话(每题两分)</div>
            <div class="span-box" v-for="(item, key, index) in xinwenbaodao">
              <em style="font-style:normal;margin-right:5px;font-size:16px">第{{ key + 1 }}大题</em>
              <span :class="ie.yn == ''? '': 'chec'" v-for="(ie, k) in item.xuanzhe[0]" v-if="is_tijiao == false" @click ="check(4)">{{k + 1}}</span>
              <span :class="ie.yn != ie.daan? 'bg-red':'chec'" v-for="(ie, k) in item.xuanzhe[0]" v-if="is_tijiao" @click ="check(4)">{{k + 1}}</span>
            </div>
          </div>
          <div class="one-box">
            <div class="one-title" @click ="check(5)">长篇阅读(每题两分)</div>
            <div class="span-box">
              <span :class="item.yn == ''? '': 'chec'" v-for="(item, key, index) in changyuedu.xuanzhe" v-if="is_tijiao == false" @click ="check(5)">{{key + 1}}</span>
              <span :class="item.yn != item.daan? 'bg-red': 'chec'" v-for="(item, key, index) in changyuedu.xuanzhe" v-if="is_tijiao" @click ="check(5)">{{key + 1}}</span>
            </div>
          </div>
          <div class="one-box">
            <div class="one-title" @click ="check(6)">仔细阅读(每题两分)</div>
            <div class="span-box" v-for="(item, key, index) in zixiyuedu">
              <em style="font-style:normal;margin-right:5px;font-size:16px">第{{ key + 1 }}大题</em>
              <span :class="ie.yn == ''? '': 'chec'" v-for="(ie, k) in item.xuanzhe[0]" v-if="is_tijiao == false" @click ="check(6)">{{k + 1}}</span>
              <span :class="ie.yn != ie.daan? 'bg-red':'chec'" v-for="(ie, k) in item.xuanzhe[0]" v-if="is_tijiao" @click ="check(6)">{{k + 1}}</span>
            </div>
          </div>
          <div class="one-box">
            <div class="one-title" @click ="check(7)">听长对话(每题两分)</div>
            <div class="span-box" v-for="(item, key, index) in changduihua">
              <em style="font-style:normal;margin-right:5px;font-size:16px">第{{ key + 1 }}大题</em>
              <span :class="ie.yn == ''? '': 'chec'" v-for="(ie, k) in item.xuanzhe[0]" v-if="is_tijiao == false" @click ="check(7)">{{k + 1}}</span>
              <span :class="ie.yn != ie.daan? 'bg-red':'chec'" v-for="(ie, k) in item.xuanzhe[0]" v-if="is_tijiao" @click ="check(7)">{{k + 1}}</span>
            </div>
          </div>
          <div class="one-box">
            <div class="one-title" @click ="check(8)">篇章翻译</div>
            <div class="span-box">
              <span :class="pianzhangfanyi.yn == ''? '': 'chec'" v-if="is_tijiao == false" @click ="check(8)">1</span>
              <span :class="pianzhangfanyi.yn == ''? 'bg-red': 'chec'" v-if="is_tijiao" @click ="check(8)">1</span>
            </div>
          </div>
        </div>
      </div>
      <div class="component-box">
        <!-- 作文题 -->
        <div class="big-box" v-show="isCheck == 1">
          <div class="zuowen-title">{{zuowen.wenti}}</div>
          <img v-if="zuowen.is_img != 0" :src="zuowenImgUrl" alt="">
          <el-input
            v-model="zuowen.yn"
            :autosize="{ minRows: 26}"
            type="textarea"
            style="border-radius: 0;margin: 10px 0"
          ></el-input>
          <div
            v-html="zuowen.daan"
            v-if="is_tijiao"
            style="border: 1px solid #ccc;padding:10px"
          >{{zuowen.daan}}</div>
          <div
            v-html="zuowen.jiexi"
            v-if="is_tijiao"
            style="margin-top:10px;border: 1px solid #ccc;padding:10px"
          >{{zuowen.jiexi}}</div>
        </div>
        <!-- 听篇章 -->
        <div class="big-box" v-show="isCheck == 2">
          <div
            class="zuowen-title"
          >Directions: In this section, you will hear several newsreports.At the end of each news report, you will hear two or three questions. Both the news report and the questions will be spoken only once. After you hear a question, you must choose the best answer from the four choices marked A，B，C and D. Then select the corresponding letter on the web page.</div>
          <audio ref="duanwenOpt" size="mini"></audio>
          <div v-for="(item, key, index) in duanwenlijie" class="duanwen-box">
            <el-button size="mini" type="primary" icon="el-icon-video-play" @click ="play_duanwen(item,key)" :disabled="duanwenPlay">第{{key + 1}}题</el-button>
            
            <audio ref="duanwenAudio"></audio>
            <div
              v-if="is_tijiao"
              v-html="item.yiwen"
              style="margin-top:10px;border: 1px solid #ccc;padding:10px"
            >{{item.yiwen}}</div>
            <div class="duanwen-options">
              <div class="option-one" v-for="(ie, k, index) in item.xuanzhe[0]">
                <el-button type="success" icon="el-icon-video-play" @click="play_duanwen_opt(ie,key,k)" ref="dw_btn" >第({{k + 1}})小题听力</el-button>
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
                <!-- <div
                  v-if="is_tijiao"
                  v-html="ie.tiyan"
                  style="margin-top:10px;border: 1px dashed #ccc;padding:10px"
                >{{ie.tiyan}}</div> -->
                <div
                  v-if="is_tijiao"
                  v-html="ie.jiexi"
                  style="margin-top:10px;border: 1px dashed #ccc;padding:10px"
                >{{ie.jiexi}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 选词填空 -->
        <div class="big-box" v-show="isCheck == 3">
          <div class="xuancutiankong-box" style="overflow:hidden">
            <div
              v-html="xuancitiankong.duanwen"
              style="padding:10px;padding:10px;"
            >{{xuancitiankong.duanwen}}</div>
            <div class="for-box" v-for="(item, key, index) in xuancitiankong.xuan" style="margin: 10px 20px;width:300px;float:left;overflow: hidden;" >
              <div class="wenti" style="float:left;margin-right:10px;width:70px">第{{key + 1}}题:</div>
              <el-select v-model="xuancitiankongDy[key]" placeholder="请选择">
                <el-option v-for="e in item" :label="e" :value="e"></el-option>
              </el-select>
            </div>
          </div>
          <div style="padding:10px;padding:10px;" v-if="is_tijiao">{{xuancitiankong.daan}}</div>
          <div style="padding:10px;padding:10px;" v-if="is_tijiao">{{xuancitiankong.yiwen}}</div>
        </div>
        <!-- 听讲座对话 -->
        <div class="big-box" v-show="isCheck == 4">
          <div class="zuowen-title">Directions: In this section, you will hear several newsreports.At the end of each news report, you will hear two or three questions. Both the news report and the questions will be spoken only once. After you hear a question, you must choose the best answer from the four choices marked A，B，C and D. Then select the corresponding letter on the web page.</div>
          <audio ref="xinwenOpt" size="mini"></audio>
          <div v-for="(item, key, index) in xinwenbaodao" class="duanwen-box">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-video-play"
              @click ="play_xinwen(item,key)"
              :disabled="duanwenPlay"
            >第{{key + 1}}题</el-button>
            <audio ref="xinwenAudio"></audio>
            <div
              v-if="is_tijiao"
              v-html="item.yiwen"
              style="margin-top:10px;border: 1px solid #ccc;padding:10px"
            >{{item.yiwen}}</div>
            <div class="duanwen-options">
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
                <!-- <div class="xuanxiang" v-for="i in ie.xuanxiang" style="margin-top: 5px">
                  <el-radio v-model="ie.yn" :label="i">{{i}}</el-radio>
                </div>-->
                <div class="xuanxiang" v-for="(i,e) in ie.xuanxiang" style="margin-top: 5px">
                  <el-radio v-model="ie.yn" :label="e" :class="is_tijiao == true && ie.yn != ie.daan && e == ie.daan? 'red':''">{{i}}</el-radio>
                </div>
                <!-- <div
                  v-if="is_tijiao"
                  v-html="ie.tiyan"
                  style="margin-top:10px;border: 1px dashed #ccc;padding:10px"
                >{{ie.tiyan}}</div> -->
                <div
                  v-if="is_tijiao"
                  v-html="ie.jiexi"
                  style="margin-top:10px;border: 1px dashed #ccc;padding:10px"
                >{{ie.jiexi}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 长篇阅读 -->
        <div class="big-box" v-show="isCheck == 5">
          <div>
            <div v-html="changyuedu.beixuanxiang" style="margin-top:10px;padding:10px"></div>
            <div v-for="(item, key, index) in changyuedu.xuanzhe">
              <el-popover
                placement="left"
                width="500"
                trigger="hover">
                <template slot-scope="scope">
                  <div v-html="item.tiyan" style="border: 1px dashed #ccc;padding:10px;max-height:70vh;overflow: auto;"></div>
                </template>
                <el-button slot="reference" type="warning" style="float:right" v-show="is_tijiao">题眼</el-button>
              </el-popover>
              <div class="wenti" style="float:left;margin-left:20px;margin-top:10px;width:70px">第{{key + 1}}题:</div>
              <div v-html="item.wenti" style="margin-top:10px;padding:10px">{{item.wenti}}</div>
              <el-select v-model="item.yn" placeholder="请选择" style="margin-left:20px">
                <!-- :key="item.value" -->
                <el-option
                  v-for="item in english"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
              <div
                style="margin-top:10px;padding:10px;margin-left:10px;"
                v-if="is_tijiao"
              >答案：{{item.daan}}</div>
              <!-- <div v-html="item.tiyan" style="padding:10px;margin-left:10px;" v-if="is_tijiao"></div> -->
              <div v-html="item.jiexi" style="padding:10px;margin-left:10px;" v-if="is_tijiao"></div>
            </div>
          </div>
        </div>
        <!-- 仔细阅读 -->
        <div class="big-box" v-show="isCheck == 6">
          <div
            class="zuowen-title"
          >Directions: In this section, you will hear several newsreports.At the end of each news report, you will hear two or three questions. Both the news report and the questions will be spoken only once. After you hear a question, you must choose the best answer from the four choices marked A，B，C and D. Then select the corresponding letter on the web page.</div>
          <div v-for="(item, key, index) in zixiyuedu" class="duanwen-box">
            <div
              v-html="item.wenzhang"
              style="margin-top:10px;padding:10px"
            >{{item.wenzhang}}</div>
            <div class="duanwen-options">
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
                <div v-html="ie.wenti" style="padding:10px">{{ie.wenti}}</div>
                <div class="xuanxiang" v-for="(i,e) in ie.xuanxiang" style="margin-top: 5px">
                  <el-radio v-model="ie.yn" :label="e" :class="is_tijiao == true && ie.yn != ie.daan && e == ie.daan? 'red':''">{{i}}</el-radio>
                </div>
                <div
                  v-if="is_tijiao"
                  v-html="ie.jiexi"
                  style="margin-top:10px;padding:10px"
                >{{ie.jiexi}}</div>
                <!-- <div v-if="is_tijiao" v-html="ie.tiyan" style="padding:10px">{{ie.tiyan}}</div> -->
              </div>
            </div>
          </div>
        </div>
        <!-- 听长对话 -->
        <div class="big-box" v-show="isCheck == 7">
          <div
            class="zuowen-title"
          >Directions: In this section, you will hear several newsreports.At the end of each news report, you will hear two or three questions. Both the news report and the questions will be spoken only once. After you hear a question, you must choose the best answer from the four choices marked A，B，C and D. Then select the corresponding letter on the web page.</div>
          <audio ref="changOpt" size="mini"></audio>
          <div v-for="(item, key, index) in changduihua" class="duanwen-box">
            <el-button size="mini" type="primary" icon="el-icon-video-play" @click ="play_chang(item,key)" :disabled="duanwenPlay">第{{key + 1}}题</el-button>
            <audio ref="changAudio"></audio>
            <div v-if="is_tijiao" v-html="item.yiwen" style="margin-top:10px;border: 1px solid #ccc;padding:10px">{{item.yiwen}}</div>
            <div class="duanwen-options">
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
                <!-- <div
                  v-if="is_tijiao"
                  v-html="ie.tiyan"
                  style="margin-top:10px;border: 1px dashed #ccc;padding:10px"
                >{{ie.tiyan}}</div> -->
                <div
                  v-if="is_tijiao"
                  v-html="ie.jiexi"
                  style="margin-top:10px;border: 1px dashed #ccc;padding:10px"
                >{{ie.jiexi}}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 篇章翻译 -->
        <div class="big-box" v-show="isCheck == 8">
          <div class="zuowen-title">{{pianzhangfanyi.wenti}}</div>
          <el-input
            v-model="pianzhangfanyi.yn"
            :autosize="{ minRows: 24}"
            type="textarea"
            style="border-radius: 0;margin: 10px 0"
          ></el-input>
          <div
            v-html="pianzhangfanyi.daan"
            v-if="is_tijiao"
            style="border: 1px solid #ccc;padding:10px"
          >{{pianzhangfanyi.daan}}</div>
          <div
            v-html="pianzhangfanyi.jiexi"
            v-if="is_tijiao"
            style="margin-top:10px;border: 1px solid #ccc;padding:10px"
          >{{pianzhangfanyi.jiexi}}</div>
        </div>
      </div>
    </div>

    <!-- 是否确认交卷弹框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      style="position: fixed;top:300px;left:35%;z-index:999;">
      <span>您确定提交试卷吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="submitLoding">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 是否确认暂停作答弹框 -->
    <el-dialog
      title="提示："
      :visible.sync="isdialogVisible"
      width="30%"
      style="position: fixed;top:300px;left:35%;z-index:999;">
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
export default {
  data() {
    return {
      submitLoding: false,
      isCheck: 1,
      noplay: false,
      zuowen: "",
      listenDuan: "",
      zuowenImgUrl: "", // 作文题目图片路径
      is_tijiao: false,
      test_paper: "",
      bigAudioUrl: "", // 总音频按钮
      duanwenPlay: false,
      duanwenlijie: "",
      keepTime: "开始考试", // 按钮字样
      limittime: 120, // 控制倒计时时间
      settime: "", // 倒计时相关
      leftTime: "",
      start_time: "",
      flag: false,
      kaoshiId: "",
      xuancitiankong: "", // 选词填空
      xuancitiankongDy: [], // 选词填空答案
      xinwenbaodao: "", // 新闻报道
      changyuedu: "",
      english: [
        { value: "A", label: "选项 A" },
        { value: "B", label: "选项 B" },
        { value: "C", label: "选项 C" },
        { value: "D", label: "选项 D" },
        { value: "E", label: "选项 E" },
        { value: "F", label: "选项 F" },
        { value: "G", label: "选项 G" },
        { value: "H", label: "选项 H" },
        { value: "I", label: "选项 I" },
        { value: "J", label: "选项 J" },
        { value: "K", label: "选项 K" },
        { value: "L", label: "选项 L" },
        { value: "M", label: "选项 M" },
        { value: "N", label: "选项 N" },
        { value: "O", label: "选项 O" },
        { value: "P", label: "选项 P" },
        { value: "Q", label: "选项 Q" },
        { value: "R", label: "选项 R" },
        { value: "S", label: "选项 S" },
        { value: "T", label: "选项 T" }
      ],
      zixiyuedu: "",
      changduihua: "",
      pianzhangfanyi: "",
      school_id: "",
      id: "",
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
    this.start_time = Date.parse(new Date()) / 1000;
    this.isChakan = this.$route.params.isChakan;
    this.gettItem();
    
    if (this.identity == 2 && this.isChakan != 1){
      this.StartCountDown();
    };
    if (this.identity == 1 || this.isChakan == 1){
      this.is_tijiao = true;
    }
  },
  computed: {},
  methods: {
    chakan(key){
      if (this.xuancitiankongDy[key] == undefined || this.xuancitiankongDy[key] == null){
        return false;
      }
      if (this.xuancitiankong.daan.split(',')[key].replace(/^\s+|\s+$/g,'')  == this.xuancitiankongDy[key].replace(/^\s+|\s+$/g,'')){
        return true;
      } else {
        return false;
      }
    },
    check(item) {
      this.isCheck = item;
    },
    play_ztingli() {
      // 总音频
      this.$refs.vide.src = `${this.baseUrl}${this.test_paper.file}`;
      this.$refs.vide.play();
      this.noplay = true;
    },
    play_duanwen(item, key) {
      // 短文理解听力 duanwenAudio
      // this.$refs.duanwenAudio[key].src = `${this.baseUrl}${item.audio_url}`;
      // this.$refs.duanwenAudio[key].play();
      this.$refs.vide.src = `${this.baseUrl}${item.audio_url}`;
      this.$refs.vide.play();
    },
    play_duanwen_opt(ie, key, k) {
      // 短文听力下的每一项的播放
      // this.$refs.duanwenOpt.src = `${this.baseUrl}${this.duanwenlijie[key].xuanzhe[0][k].audio_url}`;
      // this.$refs.duanwenOpt.play();
      this.$refs.vide.src = `${this.baseUrl}${this.duanwenlijie[key].xuanzhe[0][k].audio_url}`;
      this.$refs.vide.play();
    },
    play_xinwen(item, key) {
      // 新闻报道 duanwenAudio
      // this.$refs.xinwenAudio[key].src = `${this.baseUrl}${item.audio_url}`;
      // this.$refs.xinwenAudio[key].play();
      this.$refs.vide.src = `${this.baseUrl}${item.audio_url}`;
      this.$refs.vide.play();
    },
    play_xinwen_opt(ie, key, k) {
      // 新闻报道 单项
      // this.$refs.xinwenOpt.src = `${this.baseUrl}${this.xinwenbaodao[key].xuanzhe[0][k].audio_url}`;
      // this.$refs.xinwenOpt.play();
      this.$refs.vide.src = `${this.baseUrl}${this.xinwenbaodao[key].xuanzhe[0][k].audio_url}`;
      this.$refs.vide.play();
    },
    play_chang(item, key) {
      // 听长对话 duanwenAudio
      // this.$refs.changAudio[key].src = `${this.baseUrl}${item.audio_url}`;
      // this.$refs.changAudio[key].play();
      this.$refs.vide.src = `${this.baseUrl}${item.audio_url}`;
      this.$refs.vide.play();
    },
    play_chang_opt(ie, key, k) {
      // 听长对话下的每一项的播放
      // this.$refs.changOpt.src = `${this.baseUrl}${this.changduihua[key].xuanzhe[0][k].audio_url}`;
      // this.$refs.changOpt.play();
      this.$refs.vide.src = `${this.baseUrl}${this.changduihua[key].xuanzhe[0][k].audio_url}`;
      this.$refs.vide.play();
    },
    async gettItem() {
      console.log(this.kaoshiId,this.id,this.identity);     
      const res = await this.$http.post(
        "admin/Examination/paperlst",
        qs.stringify({id: this.kaoshiId,u_id:this.id,identity: this.identity})
      );
      if (res.status === 200 && res.data.code === "1") {
        this.zuowen = res.data.info.zuowen;
        this.test_paper = res.data.info.test_paper;
        this.duanwenlijie = res.data.info.duanwenlijie;
        this.xuancitiankong = res.data.info.xuancitiankong;
        this.xinwenbaodao = res.data.info.xinwenbaodao;
        console.log(this.xinwenbaodao)
        this.changyuedu = res.data.info.changyuedu;
        this.zixiyuedu = res.data.info.zixiyuedu;
        this.changduihua = res.data.info.changduihua;
        this.pianzhangfanyi = res.data.info.pianzhangfanyi;
        if (this.zuowen.is_img == 1){
          this.zuowenImgUrl = `${this.baseUrl}${this.zuowen.img_url}`;
        }
      }
    },
    StartCountDown() {
      // 倒计时代码
      var mydate = new Date();
      mydate.setMinutes(mydate.getMinutes() + this.limittime);
      this.settime = mydate;
      let time = setInterval(() => {
        if (this.flag == true) {
          clearInterval(time);
          this.keepTime = `已提交试卷`;
          if (this.leftTime > 0) {
            return false;
          }
          this.submit();
          return false;
        }
        this.timeDown();
      }, 100);
    },
    timeDown() {
      // 倒计时代码
      const endTime = new Date(this.settime);
      const nowTime = new Date();
      this.leftTime = parseInt((endTime.getTime() - nowTime.getTime()) / 1000);
      let d = parseInt(this.leftTime / (24 * 60 * 60));
      let h = this.formate(parseInt((this.leftTime / (60 * 60)) % 24));
      let m = this.formate(parseInt((this.leftTime / 60) % 60));
      let s = this.formate(parseInt(this.leftTime % 60));
      if (this.leftTime <= 0) {
        this.flag = true;
      }
      this.keepTime = `${h}:${m}:${s}`;
    },
    formate(time) {
      // 倒计时代码
      if (time >= 10) {
        return time;
      } else {
        return `0${time}`;
      }
    },
    async submit() {
      this.submitLoding = true;
      this.xuancitiankong.yn = this.xuancitiankongDy;
      const res = await this.$http.post(
        "admin/Examination/addpaper",
        qs.stringify({
          id: this.id,
          kaoshiId: this.kaoshiId,
          school_id: this.school_id,
          zuowen: this.zuowen, // 1
          duanwenlijie: this.duanwenlijie,
          xuancitiankong: this.xuancitiankong,
          xinwenbaodao: this.xinwenbaodao,
          changyuedu: this.changyuedu,
          zixiyuedu: this.zixiyuedu,
          changduihua: this.changduihua,
          pianzhangfanyi: this.pianzhangfanyi,
          test_paper: this.test_paper,
          start_time: this.start_time
        })
      );
      if (res.status === 200 && res.data.code === "1") {
        this.flag = true;
        this.is_tijiao = true;
        this.submitLoding = false;
        this.dialogVisible = false;
        this.$message({
          message: res.data.info,
          type: "success",
          duration: 10000,
          showClose: true
        });
      } else {
        this.submitLoding = false;
        this.dialogVisible = false;
        this.$message({
          message: res.data.info,
          type: "error",
          duration: 10000,
          showClose: true
        });
      }
    },
    goback() {
      this.$router.go(-1); //返回上一层
    },
    async suspend(){
      const res = await this.$http.post("admin/Examination/zancun",qs.stringify({
        id: this.id,
        kaoshiId: this.kaoshiId,
        school_id: this.school_id,
        zuowen: this.zuowen, // 1
        duanwenlijie: this.duanwenlijie,
        xuancitiankong: this.xuancitiankong,
        xinwenbaodao: this.xinwenbaodao,
        changyuedu: this.changyuedu,
        zixiyuedu: this.zixiyuedu,
        changduihua: this.changduihua,
        pianzhangfanyi: this.pianzhangfanyi,
        test_paper: this.test_paper,
        start_time: this.start_time
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