<template>
  <div class="right">
    <!-- 听力实验box -->
    <div style="color:red;font-size:24px;width:100%;text-align: center;">此功能尚未开发完成。</div>
    <div class="ceshi-box">
        <el-button type="primary" @mousedown.prevent.native ="mouseStart" @mouseup.prevent.native ="mouseEnd" >{{time}}</el-button>
    </div>
    <!-- 抽屉嵌套。 -->
    <!-- <el-button type="primary" @click="table = true">点击打开录像</el-button> -->
      <!-- <el-drawer
        title="视频录入功能"
        :visible.sync="table"
        direction="rtl"
        size="500px"> -->
          <article style="border:1px solid white;width:900px;height:800px;margin:0 auto;background-color:white;">
            <section class="experiment" style="width:850px; height:640px;border:1px solid green; margin:10px auto 25px;">
              <div id="videos-container" ref="videosContainer" style="width:850px; height:640px;"></div>
            </section>
            <section class="experiment" style="text-align:center;border:none; margin-top:20px;">
              <button id="openCamera" @click="startVideo" :disabled="disvideo">打开摄像头</button>
              <button id="start-recording" @click="staetTranscribe" :disabled="disvideo">开始录制</button>
              <button id="save-recording" @click="saveVideo">保存</button>
              <button  @click="send">发送</button>
            </section>
          </article>
      <!-- </el-drawer> -->
  </div>
</template>


<script>
import qs from "qs";
import recording from '../../untils/recorder.js';
// import { saveAs } from "../../untils/fileSaver";
import "../../untils/fileSaver.js";
let that = this;
// 录制视频demo代码
var mediaStream;
var recorderFile;
var stopRecordCallback;
var mediaRecorder;
// var videosContainer = document.querySelector('#videos-container');
// var videosContainer = this.$refs.videosContainer;
var MediaUtils = {
  /**
  * 获取用户媒体设备(处理兼容的问题)
  * @param videoEnable {boolean} - 是否启用摄像头
  * @param audioEnable {boolean} - 是否启用麦克风
  * @param callback {Function} - 处理回调
  */
  getUserMedia: function (videoEnable, audioEnable, callback) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia
      || navigator.msGetUserMedia || window.getUserMedia;
    var constraints = { video: videoEnable, audio: audioEnable };
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        callback(false, stream);
      })['catch'](function (err) {
        callback(err);
      });
    } else if (navigator.getUserMedia) {
      navigator.getUserMedia(constraints, function (stream) {
        callback(false, stream);
      }, function (err) {
        callback(err);
      });
    } else {
      callback(new Error('Not support userMedia'));
    }
  },
  /**
  * 关闭媒体流
  * @param stream {MediaStream} - 需要关闭的流
  */
  closeStream: function (stream) {
    if (typeof stream.stop === 'function') {
      stream.stop();
    }
    else {
      let trackList = [stream.getAudioTracks(), stream.getVideoTracks()];
      for (let i = 0; i < trackList.length; i++) {
        let tracks = trackList[i];
        if (tracks && tracks.length > 0) {
          for (let j = 0; j < tracks.length; j++) {
            let track = tracks[j];
            if (typeof track.stop === 'function') {
              track.stop();
            }
          }
        }
      }
    }
  }
};

export default {
  data() {
    return {
      // 录音Demo
      time: '按住说话(60秒)',
      num: 60, // 按住说话时间
      recorder: null,
      interval: '',
      startTime: '', // 语音开始时间
      endTime: '', // 语音结束
      // 录像demo
      table: false,
      disvideo: false,
    };
  },
  created() {
    this.id = localStorage.getItem("id");
    console.log("saveAs::,",this.saveAs);
  },
  computed: {},
  methods: {
    //   录音功能。
    // 清除定时器
    clearTimer () {
      if (this.interval) {
        this.num = 60
        clearInterval(this.interval)
      }
    },
    // 长按说话
    mouseStart () {
      // this.form.time = "请开始口语表达";
      this.clearTimer()
      this.startTime = new Date().getTime()
      recording.get((rec) => {
        // 当首次按下时，要获取浏览器的麦克风权限，所以这时要做一个判断处理
        if (rec) {
          // 首次按下，只调用一次
          if (this.flag) {
            this.mouseEnd()
            this.flag = false
          } else {
            this.recorder = rec
            this.interval = setInterval(() => {
              if (this.num <= 0) {
                this.recorder.stop()
                this.num = 60
                this.clearTimer()
              } else {
                this.num--
                this.time = '松开结束（' + this.num + '秒）'
                this.recorder.start()
              }
            }, 1000)
          }
        }
      })
    },
    // 松开时上传语音
    mouseEnd () {
      // this.form.time = "按住说话(60秒)";
      this.clearTimer()
      this.endTime = new Date().getTime()
      if (this.recorder) {
        this.recorder.stop()
        // 重置说话时间
        this.num = 60
        this.time = '按住说话（' + this.num + '秒）'
        // 获取语音二进制文件
        let bold = this.recorder.getBlob()
        // 将获取的二进制对象转为二进制文件流
        let files = new File([bold], 'test.mp3', {type: 'audio/mp3', lastModified: Date.now()})
        let fd = new FormData()
        fd.append('file', files)
        // fd.append('tenantId', 3) // 额外参数，可根据选择填写
        // 这里是通过上传语音文件的接口，获取接口返回的路径作为语音路径
        this.$http({
          header: ({'Content-Type': 'application/x-www-form-urlencodeed'}),
          method: 'POST',
          url: 'admin/login/file',
          data: fd,
          withCredentials: false,
        }).then((res) => {
          //  这里做登录拦截
          if (res.status === 200 && res.data.code === "1") {
            console.log("成功res:",res);
          } else {
            console.log("失败res",res);
          }
        });
      }
    },
    //   视频录入功能。
    startVideo () { // 开启摄像头按钮。
      // this.disabled = true;
      // startBtn.disabled = false;
      this.openCamera();
    },
    staetTranscribe () { // 开始录制视频按钮
      // this.disabled = true;
      // this.openCamera();
      this.startRecord();
    },
    saveVideo () { // 保存视频按钮
      this.saver();
    },
    openCamera() { // 开启摄像头。
      var videosContainer = document.getElementById('videos-container');
      var len = videosContainer.childNodes.length;
      for (var i = 0; i < len; i++) {
        videosContainer.removeChild(videosContainer.childNodes[i]);
      }
      var video = document.createElement('video');
      var videoWidth = 850;
      var videoHeight = 640;
      video.controls = false;
      video.muted = true;
      video.width = videoWidth;
      video.height = videoHeight;
      MediaUtils.getUserMedia(true, true, function (err, stream) {
        if (err) {
          throw err;
        } else {
          // 通过 MediaRecorder 记录获取到的媒体流
          mediaRecorder = new MediaRecorder(stream);
          mediaStream = stream;
          var chunks = [], startTime = 0;
          video.srcObject = stream;
          video.play();
          videosContainer.appendChild(video);
          mediaRecorder.ondataavailable = function (e) {
            mediaRecorder.blobs.push(e.data);
            chunks.push(e.data);
          };
          mediaRecorder.blobs = [];

          mediaRecorder.onstop = function (e) {
            recorderFile = new Blob(chunks, { 'type': mediaRecorder.mimeType });
            chunks = [];
            if (null != stopRecordCallback) {
              stopRecordCallback();
            }
          };
        }
      });
    },
    // 停止录制
    stopRecord(callback) {
      stopRecordCallback = callback;
      // 终止录制器
      mediaRecorder.stop();
      // 关闭媒体流
      MediaUtils.closeStream(mediaStream);
    },
    // 开始录制视频
    startRecord() {
      let that = this;
      mediaRecorder.start();
      setTimeout(function () {
        // 结束
        that.stopRecord(function () {
          // alert("录制成功!");
          //send();
          that.saver();
        });
      }, 10000);
    },
    saver() { //  保存视频按钮。
      var file = new File([recorderFile], 'soeasy-' + (new Date).toISOString().replace(/:|\./g, '-') + '.mp4', {
        type: 'video/mp4'
      });
      this.saveAs(file);
    },
    send() { // 发送视频
      var file = new File([recorderFile], 'soeasy-' + (new Date).toISOString().replace(/:|\./g, '-') + '.mp4', {
        type: 'video/mp4'
      });
      var data = new FormData();
      data.append("username", "test");
      data.append("userfile", file);
      var req = new XMLHttpRequest();
      req.open("POST", "com.spinsoft.bip.frame.utils.image.saveMp4.biz.ext");
      req.send(data);
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/css/index.less");
.right {
  background-color: #fff;
  min-height: 100%;
  overflow: hidden;
  
  .ceshi-box {
    margin: 20px;
    
  }
  .experiment {
    button {
      background-color: @theme;
      border: none;
      margin: 10px;
      color:  #fff;
      height: 32px;
      padding: 0 15px;
      border-radius: 4px;
      cursor: pointer;
    }
  }
}
</style>