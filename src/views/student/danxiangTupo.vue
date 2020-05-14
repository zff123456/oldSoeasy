<template>
  <div class="right" v-loading="isLoading" element-loading-text="拼命加载中">
    <audio ref="xinwenAudio"></audio>
    <!-- <div class="sea-box">
      <div class="search-box">
      <div class="title">选择试卷类型</div>
      <el-select v-model="type" placeholder="请选择试卷类型" @change="getUserList">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>
    </div> -->
    <!-- </div> -->
    <!-- <div class="search-box">
      <div class="title">选择题目类型</div>
      <el-select v-model="problem" placeholder="请选择题目类型" @change="getTimu">
        <el-option
          v-for="item in problemList"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
    </div> -->
    <div class="tiku-box">
      <div class="text-title">A级题库</div>
      <ul>
        <li v-for="item in aList" :class="type == 3 && problem == item?'click': ''" @click="getTimu(item, 3)"><p>{{item}}</p></li>
      </ul>
    </div>
    <div class="tiku-box">
      <div class="text-title">B级题库</div>
      <ul>
        <li v-for="item in bList" @click="getTimu(item, 4)" :class="type == 4 && problem == item?'click': ''"><p>{{item}}</p></li>
      </ul>
    </div>
    <div class="tiku-box">
      <div class="text-title">四级题库</div>
      <ul>
        <li v-for="item in fourList" @click="getTimu(item, 1)" :class="type == 1 && problem == item?'click': ''"><p>{{item}}</p></li>
      </ul>
    </div>
    <div class="tiku-box">
      <div class="text-title">六级题库</div>
      <ul>
        <li v-for="item in sixList" @click="getTimu(item, 2)" :class="type == 2 && problem == item?'click': ''"><p>{{item}}</p></li>
      </ul>
    </div>
    <div style="height:20px;width:100%;background-color: #F8F8F8;margin-top:0"></div>
    <!--  第一种类型 长段落问题，多行文本输入： -->
    <div class="content-box" v-if="problem == '作文' || problem == '英译汉' || problem == '篇章翻译'">
      <div class="big-box">
        <div class="zuowen-title" v-if="problem != '英译汉'">{{itemOne.wenti}}</div>
        <!-- <div v-html="itemOne.wenti"  v-if="problem != '英译汉'"></div> -->
        <div v-html="itemOne.wenzhang" v-if="problem == '英译汉'"></div>
        <img v-if="itemOne.is_img != 0 && problem == '作文' && itemOne.is_img != undefined" :src="itemOne.img_url" alt="" style="height: 200px;margin-left: 145px;">
        <el-input v-model="itemOne.yn" :autosize="{ minRows: 26}" type="textarea" style="border-radius: 0;margin: 10px 0"></el-input>
        <div v-html="itemOne.daan" v-if="itemOne.state == 0 && problem != '英译汉'" style="border: 1px solid #ccc;padding:10px">{{itemOne.daan}}</div>
        <div v-html="itemOne.cankaodaan" v-if="itemOne.state == 0 && problem == '英译汉'" style="border: 1px solid #ccc;padding:10px"></div>
        <div v-html="itemOne.jiexi" v-if="itemOne.state == 0" style="margin:10px 0;border: 1px solid #ccc;padding:10px">{{itemOne.jiexi}}</div>
        <!-- 提交按钮。 -->
        <div style="height:20px;width:110%;background-color: #F8F8F8;margin:10px 0;transform: translateX(-30px);"></div>
        <el-button type="primary" @click="submitZuowen(itemOne)">提交</el-button>
      </div>
      <!-- 分页插件。 -->
      <div style="position: absolute;right: 0px;top: -53px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          :current-page.sync="currentPage"
          layout="total, prev, pager, next"
          :total="itemData.length"
        ></el-pagination>
      </div>
      <div style="height:20px;width:110%;background-color: #F8F8F8;margin:60px 0 0;transform: translateX(-30px);"></div>
    </div>
    <!--  第一种类型大题音频，小题音频，abcd单选： -->
    <div class="content-box" v-if="problem == '新闻报道' || problem == '听讲座对话'|| problem == '听长对话' || problem == '听短文理解' || problem == '听篇章' || problem == '听短对话'">
      <div class="big-box" v-for="(item,key) in itemData.slice((currentPage -1) * pagesize, currentPage * pagesize)">
          <div class="zuowen-title">Directions: In this section, you will hear several newsreports.At the end of each news report, you will hear two or three questions. Both the news report and the questions will be spoken only once. After you hear a question, you must choose the best answer from the four choices marked A，B，C and D. Then select the corresponding letter on the web page.</div>
          <audio ref="xinwenOpt" size="mini"></audio>
          <el-button size="mini" type="primary" icon="el-icon-video-play" @click="play_xinwen(item,key)" style="padding: 6px 11px;font-size: 12px;">播放大题听力</el-button>
          <div v-if="item.state == 0" v-html="item.yiwen" style="margin-top:10px;border: 1px solid #ccc;padding:10px">{{item.yiwen}}</div>
          <div class="duanwen-options" >
            <div class="option-one" v-for="(ie, k, index) in item.xuanzhe[0]">
              <el-button type="success" icon="el-icon-video-play" @click="play_xinwen_opt(ie,k)" ref="dw_btn" style="padding: 5px 10px;font-size: 12px;">第({{k + 1}})小题听力</el-button>
              <div class="xuanxiang" v-for="(i,e) in ie.xuanxiang" style="margin-top: 5px">
                <el-radio v-model="ie.yn" :label="e" :class="item.state == 0 && ie.yn != ie.daan && e == ie.daan? 'red':''">{{i}}</el-radio>
              </div>
              <div v-if="item.state == 0" v-html="ie.tiyan" style="margin-top:10px;border: 1px dashed #ccc;padding:10px">{{ie.tiyan}}</div>
              <div v-if="item.state == 0" v-html="ie.jiexi" style="margin-top:10px;border: 1px dashed #ccc;padding:10px">{{ie.jiexi}}</div>
            </div>
          </div>
          <div style="height:20px;width:110%;background-color: #F8F8F8;margin:10px 0;transform: translateX(-30px);"></div>
        <!-- 提交按钮。 -->
        <el-button type="primary" @click="submitXinwen(item)">提交</el-button>
      </div>
      <!-- 分页插件。 -->
      <div style="position: absolute;right: 0px;top: -53px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          layout="total, prev, pager, next"
          :current-page.sync="currentPage"
          :total="itemData.length"
        ></el-pagination>
      </div>
      <div style="height:20px;width:110%;background-color: #F8F8F8;margin:60px 0 0;transform: translateX(-30px);"></div>
    </div>
    <!-- 单独一种听单句 -->
    <div class="content-box" v-if="problem == '听单句'">
      <div class="big-box" v-for="(item,key) in itemData.slice((currentPage -1) * pagesize, currentPage * pagesize)">
          <div class="zuowen-title">Directions: In this section, you will hear several newsreports.At the end of each news report, you will hear two or three questions. Both the news report and the questions will be spoken only once. After you hear a question, you must choose the best answer from the four choices marked A，B，C and D. Then select the corresponding letter on the web page.</div>
          <audio ref="xinwenOpt" size="mini"></audio>
            <div class="duanwen-options" >
              <div class="option-one" v-for="(ie, k, index) in item.xuanzhe[0]">
                <el-button type="success" icon="el-icon-video-play" @click="play_xinwen_opt(ie,key,k)" ref="dw_btn" style="padding: 5px 10px;font-size: 12px;">第({{k + 1}})小题听力</el-button>
                <div class="xuanxiang" v-for="(i,e) in ie.xuanxiang" style="margin-top: 5px">
                  <el-radio v-model="ie.yn" :label="e" :class="item.state == 0 && ie.yn != ie.daan && e == ie.daan? 'red':''">{{i}}</el-radio>
                </div>
                <div v-if="item.state == 0" v-html="ie.tiyan" style="margin-top:10px;border: 1px dashed #ccc;padding:10px">{{ie.tiyan}}</div>
                <div v-if="item.state == 0" v-html="ie.jiexi" style="margin-top:10px;border: 1px dashed #ccc;padding:10px">{{ie.jiexi}}</div>
              </div>
            </div>
          <div style="height:20px;width:110%;background-color: #F8F8F8;margin:10px 0;transform: translateX(-30px);"></div>
        <!-- 提交按钮。 -->
        <el-button type="primary" @click="submitXinwen(item)">提交</el-button>
      </div>
      <!-- 分页插件。 -->
      <div style="position: absolute;right: 0px;top: -53px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          :current-page.sync="currentPage"
          layout="total, prev, pager, next"
          :total="itemData.length"
        ></el-pagination>
      </div>
      <div style="height:20px;width:110%;background-color: #F8F8F8;margin:60px 0 0;transform: translateX(-30px);"></div>
    </div>
    <!-- 富文本段落，遍历空数组，下拉选择返回答案   选词填空 -->
    <div class="content-box" v-if="problem == '选词填空'">
      <div class="big-box" v-for="(item,key) in itemData.slice((currentPage -1) * pagesize, currentPage * pagesize)">
        <div class="xuancutiankong-box" style="overflow:hidden">
          <div v-html="item.duanwen" style="padding:10px;padding:10px;">{{item.duanwen}}</div>
          <div class="for-box" v-for="(ie, k, index) in item.xuan" style="margin: 10px 20px;width:300px;float:left;overflow: hidden;">
            <div class="wenti" style="float:left;margin-right:10px;width:70px">第{{k + 1}}题:</div>
            <el-select v-model="xuancitiankongDy[k]" placeholder="请选择">
              <el-option
                v-for="e in ie"
                :key="e"
                :label="e"
                :value="e">
              </el-option>
            </el-select>
          </div>
        </div>
        <div style="padding:10px;padding:10px;" v-if="item.state == 0">{{item.daan}}</div>
        <div style="padding:10px;padding:10px;" v-if="item.state == 0">{{item.yiwen}}</div>
        <div style="height:20px;width:110%;background-color: #F8F8F8;margin:10px 0;transform: translateX(-30px);"></div>
        <!-- 提交按钮。 -->
        <el-button type="primary" @click="submitXinwen(item)">提交</el-button>
      </div>
      <!-- 分页插件。 -->
      <div style="position: absolute;right: 0px;top: -53px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          :current-page.sync="currentPage"
          layout="total, prev, pager, next"
          :total="itemData.length"
        ></el-pagination>
      </div>
      <div style="height:20px;width:110%;background-color: #F8F8F8;margin:60px 0 0;transform: translateX(-30px);"></div>
    </div>
    <!-- 富文本段落，问题，单行输入框  阅读理解  -->
    <div class="content-box" v-if="problem == '阅读理解' || problem == '词汇匹配'">
      <div class="big-box" v-for="(item,key) in itemData.slice((currentPage -1) * pagesize, currentPage * pagesize)">
        <div v-html="item.duanwen" style="margin-top:10px;padding:10px" v-if="problem == '阅读理解'"></div>
        <div v-html="item.beixuanxiang" style="margin-top:10px;padding:10px" v-if="problem == '词汇匹配'"></div>
        <div v-html="item.jiexi" style="margin-top:10px;padding:10px" v-if="problem == '词汇匹配' && item.state == 0"></div>
        <div v-if="item.state == 0" v-html="item.cankaodaan" style="margin-top:10px;padding:10px"></div>
        <div class="xuanxiang" v-for="(ie, k, index) in item.xuanzhe">
          <div v-html="ie.wenti" style="margin-top:10px;padding:10px"></div>
          <el-input v-model="ie.yn" placeholder="请输入答案" style="box-sizing: border-box;padding: 0 10px;margin-bottom:10px"></el-input>
          <div class="zuowen-title" v-if="item.state == 0">{{ie.daan}}</div>
          <div v-if="item.state == 0 && problem == '阅读理解'" v-html="ie.tiyan" style="margin-top:10px;padding:10px"></div>
        </div>
        <div style="height:20px;width:110%;background-color: #F8F8F8;margin-bottom:10px;transform: translateX(-30px);"></div>
        <!-- 提交按钮。 -->
        <el-button type="primary" @click="submitXinwen(item)">提交</el-button>
      </div>
      <!-- 分页插件。 -->
      <div style="position: absolute;right: 0px;top: -53px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          :current-page.sync="currentPage"
          layout="total, prev, pager, next"
          :total="itemData.length"
        ></el-pagination>
      </div>
      <div style="height:20px;width:110%;background-color: #F8F8F8;margin:60px 0 0;transform: translateX(-30px);"></div>
    </div>
    <!-- 富文本段落，循环小题，答案A - T  长篇阅读   -->
    <div class="content-box" v-if="problem == '长篇阅读'">
      <div class="big-box" v-for="(ie,k) in itemData.slice((currentPage -1) * pagesize, currentPage * pagesize)">
        <div v-html="ie.beixuanxiang" style="margin-top:10px;padding:10px"></div>
          <div v-for="(item, key, index) in ie.xuanzhe" style="margin-bottom:10px">
            <div class="wenti" style="float:left;margin-left:20px;margin-top:10px;width:70px">第{{key + 1}}题:</div>
            <div v-html="item.wenti" style="margin-top:10px;padding:10px">{{item.wenti}}</div>
            <el-select v-model="item.yn" placeholder="请选择" style="margin-left:20px">
              <el-option
                v-for="item in english"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div style="margin-top:10px;padding:10px;margin-left:10px;" v-if="ie.state == 0 ">答案：{{item.daan}}</div>
            <div v-html="item.tiyan" style="padding:10px;margin-left:10px;" v-if="ie.state == 0 "></div>
            <div v-html="item.jiexi" style="padding:10px;margin-left:10px;" v-if="ie.state == 0 "></div>
          </div>
        <div style="height:20px;width:110%;background-color: #F8F8F8;margin-bottom:10px;transform: translateX(-30px);"></div>
        <!-- 提交按钮。 -->
        <el-button type="primary" @click="submitYuedu(ie)">提交</el-button>
      </div>
      <!-- 分页插件。 -->
      <div style="position: absolute;right: 0px;top: -53px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          layout="total, prev, pager, next"
          :total="itemData.length"
          :current-page.sync="currentPage"
        ></el-pagination>
      </div>
      <div style="height:20px;width:110%;background-color: #F8F8F8;margin:60px 0 0;transform: translateX(-30px);"></div>
    </div>
    <!-- 富文本段落，问题，abcd单选  仔细阅读 -->
    <div class="content-box" v-if="problem == '仔细阅读'">
      <div class="big-box" v-for="(item,key) in itemData.slice((currentPage -1) * pagesize, currentPage * pagesize)">
        <div class="zuowen-title">Directions: In this section, you will hear several newsreports.At the end of each news report, you will hear two or three questions. Both the news report and the questions will be spoken only once. After you hear a question, you must choose the best answer from the four choices marked A，B，C and D. Then select the corresponding letter on the web page.</div>
        <div v-html="item.wenzhang" style="margin-top:10px;padding:10px">{{item.wenzhang}}</div>
        <div class="duanwen-options">
          <div class="option-one" v-for="(ie, k, index) in item.xuanzhe[0]">
            <div v-html="ie.wenti" style="margin-top:10px;padding:10px">{{ie.wenti}}</div>
            <div class="xuanxiang" v-for="(i,e) in ie.xuanxiang" style="margin-top: 5px">
              <el-radio v-model="ie.yn" :label="e" :class="item.state == 0 && ie.yn != ie.daan && e == ie.daan? 'red':''">{{i}}</el-radio>
            </div>
            <div v-if="item.state == 0" v-html="ie.jiexi" style="margin-top:10px;padding:10px">{{ie.jiexi}}</div>
            <div v-if="item.state == 0" v-html="ie.tiyan" style="padding:10px">{{ie.tiyan}}</div>
          </div>
        </div>
        <div style="height:20px;width:110%;background-color: #F8F8F8;margin-bottom:10px;transform: translateX(-30px);"></div>
        <!-- 提交按钮。 -->
        <el-button type="primary" @click="submitXinwen(item)">提交</el-button>
      </div>
      <!-- 分页插件。 -->
      <div style="position: absolute;right: 0px;top: -53px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          layout="total, prev, pager, next"
          :total="itemData.length"
          :current-page.sync="currentPage"
        ></el-pagination>
      </div>
      <div style="height:20px;width:110%;background-color: #F8F8F8;margin:60px 0 0;transform: translateX(-30px);"></div>
    </div>
    <!-- 阅读填空  短文填空 -->
    <div class="content-box" v-if="problem == '阅读填空' || problem == '短文填空' ">
      <div class="big-box" v-for="(ie,k) in itemData.slice((currentPage -1) * pagesize, currentPage * pagesize)">
        <div class="zuowen-title">Directions: In this section you will hear a record short passage.The passage is printed in the test paper,but with some words or phrases missing.The passage will be read two times.You are required to put the missing words or phrases on the Answer Sheet in order of the number blanks according to what you hear.Now the passage will begin.</div>
        <div style="overflow:hidden">
          <el-button size="mini" type="primary" icon="el-icon-video-play" @click="play_yuedu(ie,k)" v-if="problem == '短文填空'" style="padding: 5px 10px;font-size: 12px;">播放音频</el-button>
          <div v-html="ie.wenti" style="margin-top:10px;padding:10px" v-if="problem == '短文填空'"></div>
          <div v-html="ie.duanwen" style="margin-top:10px;padding:10px" v-if="problem == '阅读填空'"></div>
          <div style="min-height:100%;overflow:hidden">
            <div v-for="(item, key, index) in ie.yn" >
              <div style="float:left;margin: 10px 10px">
                <span>第{{key + 1}}题：</span>
                <el-input v-model="ie.yn[key]" placeholder="请输入答案" style="box-sizing: border-box;padding: 0 5px;width: 200px"></el-input>
              </div>
            </div>
          </div>
          <div v-if="ie.state == 0 " v-html="ie.daan" style="margin-top:10px;padding:10px"></div>
          <div v-if="ie.state == 0 " v-html="ie.yiwen" style="margin-top:10px;padding:10px"></div>
          <div v-if="ie.state == 0 " v-html="ie.cankaodaan" style="margin-top:10px;padding:10px"></div>
        </div>
        <div style="height:20px;width:110%;background-color: #F8F8F8;margin-bottom:10px;transform: translateX(-30px);"></div>
        <!-- 提交按钮。 -->
        <el-button type="primary" @click="submitYuedu(ie)">提交</el-button>
      </div>
      <!-- 分页插件。 -->
      <div style="position: absolute;right: 0px;top: -53px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          layout="total, prev, pager, next"
          :total="itemData.length"
          :current-page.sync="currentPage"
        ></el-pagination>
      </div>
      <div style="height:20px;width:110%;background-color: #F8F8F8;margin:60px 0 0;transform: translateX(-30px);"></div>
    </div>
    <!-- 大音频，小音频，输入框   听短文 -->
    <div class="content-box" v-if="problem == '听短文' ">
      <div class="big-box" v-for="(item,key) in itemData.slice((currentPage -1) * pagesize, currentPage * pagesize)">
        <div class="zuowen-title">Directions: In this section, you will hear several newsreports.At the end of each news report, you will hear two or three questions. Both the news report and the questions will be spoken only once. After you hear a question, you must choose the best answer from the four choices marked A，B，C and D. Then select the corresponding letter on the web page.</div>
        <audio ref="xinwenOpt" size="mini"></audio>
          <el-button size="mini" type="primary" icon="el-icon-video-play" @click="play_xinwen(item,key)" style="padding: 6px 11px;font-size: 12px;">播放大题听力</el-button>
          <div v-if="item.state == 0" v-html="item.yiwen" style="margin-top:10px;border: 1px solid #ccc;padding:10px">{{item.yiwen}}</div>
          <div class="duanwen-options" style="maigin-top:10px">
            <div class="option-one" v-for="(ie, k, index) in item.xuanzhe">
              <!-- <el-button type="success" icon="el-icon-video-play" @click="play_xinwen_opt(ie,k)" style="padding: 5px 10px;font-size: 12px;">第({{k + 1}})小题听力</el-button> -->
              <div v-html="ie.wenti" style="padding:10px"></div>
              <el-input v-model="ie.yn" placeholder="请输入答案" style="box-sizing: border-box;padding: 0 10px"></el-input>
              <div v-if="item.state == 0" v-html="ie.jiexi" style="margin-top:10px;border: 1px dashed #ccc;padding:10px">{{ie.tiyan}}</div>
              <div v-if="item.state == 0" v-html="ie.daan" style="margin-top:10px;border: 1px dashed #ccc;padding:10px">{{ie.jiexi}}</div>
            </div>
          </div>
        <div style="height:20px;width:110%;background-color: #F8F8F8;margin:10px 0;transform: translateX(-30px);"></div>
        <!-- 提交按钮。 -->
        <el-button type="primary" @click="submitXinwen(item)">提交</el-button>
      </div>
      <!-- 分页插件。 -->
      <div style="position: absolute;right: 0px;top: -53px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          layout="total, prev, pager, next"
          :total="itemData.length"
          :current-page.sync="currentPage"
        ></el-pagination>
      </div>
      <div style="height:20px;width:110%;background-color: #F8F8F8;margin:60px 0 0;transform: translateX(-30px);"></div>
    </div>
    <!-- 问题，abcd单选  词汇选择   翻译选择 -->
    <div class="content-box" v-if="problem == '词汇选择' || problem == '翻译选择'">
      <div class="big-box" v-for="(item,key) in itemData.slice((currentPage -1) * pagesize, currentPage * pagesize)">
        <div v-html="item.wenti" style="margin-top:10px;padding:10px"></div>
        <div class="xuanxiang" v-for="(i,e) in item.xuanxiang" style="margin-top: 5px;margin-bottom:10px">
          <el-radio v-model="item.yn" :label="e" :class="item.state == 0 && item.yn != item.daan && e == item.daan? 'red':''">{{i}}</el-radio>
        </div>
        <div v-if="item.state == 0" v-html="item.yiwen" style="margin-top:10px;padding:10px"></div>
        <div v-if="item.state == 0" v-html="item.jiexi" style="margin-top:10px;padding:10px"></div>
        <div style="height:20px;width:110%;background-color: #F8F8F8;margin-bottom:10px;transform: translateX(-30px);"></div>
        <!-- 提交按钮。 -->
        <el-button type="primary" @click="submitFanyi(item)">提交</el-button>
      </div>
      <!-- 分页插件。 -->
      <div style="position: absolute;right: 0px;top: -53px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          layout="total, prev, pager, next"
          :total="itemData.length"
          :current-page.sync="currentPage"
        ></el-pagination>
      </div>
      <div style="height:20px;width:110%;background-color: #F8F8F8;margin:60px 0 0;transform: translateX(-30px);"></div>
    </div>
    <!-- 问题，单行输入框  词汇填空 -->
    <div class="content-box" v-if="problem == '词汇填空'">
      <div class="big-box" v-for="(item,key) in itemData.slice((currentPage -1) * pagesize, currentPage * pagesize)">
        <div v-html="item.wenti" style="margin-top:10px;padding:10px"></div>
        <el-input v-model="item.yn" placeholder="请输入答案" style="box-sizing: border-box;padding: 0 10px;margin-bottom:10px"></el-input>
        <div v-if="item.state == 0" v-html="item.yiwen" style="margin-top:10px;padding:10px"></div>
        <div v-if="item.state == 0" v-html="item.daan" style="margin-top:10px;padding:10px"></div>
        <div v-if="item.state == 0" v-html="item.cankaodaan" style="margin-top:10px;padding:10px"></div>
        <div style="height:20px;width:110%;background-color: #F8F8F8;margin-bottom:10px;transform: translateX(-30px);"></div>
        <!-- 提交按钮。 -->
        <el-button type="primary" @click="submitXinwen(item)">提交</el-button>
      </div>
      <!-- 分页插件。 -->
      <div style="position: absolute;right: 0px;top: -53px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          layout="total, prev, pager, next"
          :total="itemData.length"
          :current-page.sync="currentPage"
        ></el-pagination>
      </div>
      <div style="height:20px;width:110%;background-color: #F8F8F8;margin:60px 0 0;transform: translateX(-30px);"></div>
    </div>
    <!-- 分割线 -->
  </div>
</template>

<script>
/* eslint-disable */
import qs from "qs";
export default {
data() {
    return {
      isLoading: false,
      is_tijiao: false,
      teacher_id: '',
      school_id: '',
      nickname: '',
      options: [],
      type: '',
      problemList: [],
      problem: '',
      fourList: ["作文","听短文理解","选词填空","新闻报道","长篇阅读","仔细阅读","听长对话","篇章翻译"],
      sixList: ["作文","听篇章","选词填空","听讲座对话","长篇阅读","仔细阅读","听长对话","篇章翻译"],
      aList: ["听短对话","听长对话","短文填空","听短文","词汇选择","词汇填空","仔细阅读","阅读填空","词汇匹配","阅读理解","翻译选择","英译汉","作文"],
      bList: ["听单句","听短对话","听长对话","短文填空","词汇选择","词汇填空","仔细阅读","阅读填空","词汇匹配","阅读理解","翻译选择","英译汉","作文"],
      pagesize: 1,
      currentPage: 1,
      zuowenImgUrl: '',
      itemData: [],
      itemOne: '',
      baseUrl: '',
      xuancitiankongDy: [], // 选词填空答案
      english: [
        {value: 'A',label: '选项 A'},{value: 'B',label: '选项 B'},{value: 'C',label: '选项 C'},{value: 'D',label: '选项 D'},{value: 'E',label: '选项 E'},
        {value: 'F',label: '选项 F'},{value: 'G',label: '选项 G'},{value: 'H',label: '选项 H'},{value: 'I',label: '选项 I'},{value: 'J',label: '选项 J'},
        {value: 'K',label: '选项 K'},{value: 'L',label: '选项 L'},{value: 'M',label: '选项 M'},{value: 'N',label: '选项 N'},{value: 'O',label: '选项 O'},
        {value: 'P',label: '选项 P'},{value: 'Q',label: '选项 Q'},{value: 'R',label: '选项 R'},{value: 'S',label: '选项 S'},{value: 'T',label: '选项 T'}
      ],
    };
  },
  created() {
    this.teacher_id = localStorage.getItem("id");
    this.nickname = localStorage.getItem("nickname");
    this.school_id = localStorage.getItem("school_id");
    this.baseUrl = BASE_URL;
    // console.log(BASE_URL);
    this.getList();
    
  },
  computed: {},
  watch: {
    itemData( val ){
      this.changeOne( val );
      deep: true   // 深度监听，监听到更深层级值的变化
    },
    currentPage( val ){
      this.itemOne = this.itemData.slice((this.currentPage -1) * this.pagesize, this.currentPage * this.pagesize);
      console.log(this.itemOne );
      
      this.itemOne = this.itemOne[0];
      console.log("触发分页事件");
      deep: true   // 深度监听，监听到更深层级值的变化
    },
  },
  methods: {
    changeOne( val ){
      console.log(this.itemData.length);
      console.log(this.itemData);
      
      if (this.itemData.length == 1) {
        this.itemOne = val[0];
      } else {
        this.itemOne = this.itemData.slice((this.currentPage -1) * this.pagesize, this.currentPage * this.pagesize);
        this.itemOne = this.itemOne[0];
      }
    },
    handleSizeChange(val) {
      this.pagesize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$set(this,"currentPage", val);
    },
    async getList(){
      const res = await this.$http.post("admin/Examination/tiku", qs.stringify({ school_id: this.school_id}));
      if (res.status === 200 && res.data.code === "1") {
        this.options = res.data.info
      };
      this.type = this.options[0].id;
      if (this.type == 1){ this.problem = this.fourList[0];this.problemList = this.fourList };
      if (this.type == 2){ this.problem = this.sixList[0];this.problemList = this.sixList };
      if (this.type == 3){ this.problem = this.aList[0];this.problemList = this.aList };
      if (this.type == 4){ this.problem = this.bList[0];this.problemList = this.bList };
      this.getTimu(this.problem, this.type);
    },
    getUserList(){
      this.problem = "";
      if (this.type == 1){ this.problemList = this.fourList };
      if (this.type == 2){ this.problemList = this.sixList };
      if (this.type == 3){ this.problemList = this.aList };
      if (this.type == 4){ this.problemList = this.bList };
    },
    async getTimu(item, type){
      this.isLoading = true;
      this.problem = item;
      this.type = type;
      this.currentPage = 1;
      const res = await this.$http.post("admin/Examination/danxiangtupo",qs.stringify({ test_paper_type_name: this.type, problem: this.problem }));
      if (res.status === 200 && res.data.code === "1") {
        this.$set(this,"itemData", res.data.info);
        for ( var i = 0 ; i < this.itemData.length ; i++) {
          console.log(this.itemData);
          
          if (this.itemData[i].is_img  == 1){
            this.itemData[i].img_url = `${BASE_URL}${this.itemData[i].img_url}`;
          }
        };
        this.isLoading = false;
      };
    },
    async submitZuowen(item){
      this.itemOne.state = 0;
      // if(item.yn == '' || item.yn == undefined){
      //   this.$message({message: "您尚未作答",type: "error",duration: 4000});
      // } else {
      //   this.$message({message: "提交成功",type: "success",duration: 4000});
      // }
    },
    submitXinwen(item){
      item.state = 0;
    },
    submitFanyi(item){
      item.state = 0;

    },
    submitYuedu(ie){
      ie.state = 0;
      console.log(ie.state);
    },
    play_yuedu(ie,k){
      // console.log(ie,k);
      this.$refs.xinwenAudio.src = `${BASE_URL}${ie.audio_url}`;
      this.$refs.xinwenAudio.play();
    },
    play_xinwen(item){ // 新闻报道 duanwenAudio
      console.log(this.$refs.xinwenAudio);
      this.$refs.xinwenAudio.src = `${BASE_URL}${item.audio_url}`;
      this.$refs.xinwenAudio.play();
    },
    play_xinwen_opt(ie,k){ // 新闻报道 单项
      const res = this.itemData.slice((this.currentPage -1) * this.pagesize, this.currentPage * this.pagesize);
      this.$refs.xinwenAudio.src = `${BASE_URL}${res[0].xuanzhe[0][k].audio_url}`;
      console.log(this.$refs.xinwenAudio.src);
      this.$refs.xinwenAudio.play();
    },
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/css/index.less");
.right {
  background-color: #F8F8F8;
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  
  .sea-box {
    height: 69px;
    background-color: #fff;
    .search-box {
      background-color: #fff;
      height: 50px;
      line-height: 50px;
      padding: 0 15px;
      width: 340px;
      float: left;
      padding-left: 27px;
      margin-top: 7px;
      &:nth-last-child(1) {
        padding-left: 0;
      }
      .title {
        color: @theme;
        float: left;
        font-size: 16px;
        margin-right: 20px;
      }
    }
  }
  
  .content-box {
    background-color: #fff;
    // width: 100%;
    padding: 5px 20px 0px;
    position: relative;
    .el-button {
      &:nth-last-child(1) {
        float: right;
      }
    }
    .big-box {
      padding: 15px 10px 0;
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
  .tiku-box {
    padding-top: 15px;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
    .text-title {
      float: left;
      width: 80px;
      text-align: center;
    }
    ul {
      float: left;
      font-size: 14px;
      li {
        margin-top: 5px;
        float: left;
        border: 1px solid #ccc;
        height: 30px;
        padding: 0 10px;
        box-sizing: border-box;
        border-left: none;
        cursor: pointer;
        &:nth-child(1){
          border-left: 1px solid #ccc;
        }
        p {
          line-height: 30px;
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
.cell .el-button {
  padding: 4px 9px;
  font-size: 12px;
}
.big-box .el-button {
  padding: 10px 20px;
  font-size: 16px;
}
.red {
  color: red;
}
.click {
  background-color: @theme;
  color: #fff;
}
</style>