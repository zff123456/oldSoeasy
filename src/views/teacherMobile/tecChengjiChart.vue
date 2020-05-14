<template>
  <div class="right">
    <div class="search-box">
      <!-- <div class="title">选择教师</div> -->
      <el-select v-model="tracher" placeholder="请选择教师" @change="changeTeacher" clearable style="width:120px;">
        <el-option
          v-for="item in teacherList"
          :key="item.id"
          :label="item.nickname"
          :value="[item.id,item.nickname]"
        ></el-option>
      </el-select>
    </div>
    <div class="search-box">
      <!-- <div class="title">选择班级</div> -->
        <el-select v-model="classes" placeholder="请选择班级" @change="changeClass" style="width:150px;">
          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.class_name"
            :value="[item.id,item.class_name]"
          ></el-option>
        </el-select>
    </div>
    <div class="search-box">
      <!-- <div class="title" style="float:left">选择学生</div> -->
      <el-select v-model="type" placeholder="请选择学生" style="width:120px;float:left">
        <el-option
          v-for="item in stuList"
          :key="item.id"
          :label="item.nickname"
          :value="[item.id,item.nickname]"
        ></el-option>
      </el-select>
      <div class="block" style="float:left;margin-left:34px;margin-top:-0.026667rem">
        <el-button type="primary" style="margin: 10px;" @click="search">搜索</el-button>
      </div>
    </div>
    <div class="button-box">
      <div style="margin-top: 20px;">
        <el-radio-group v-model="radio" size="mini" @change="getList" class="check-box" style="margin: 10px 0;">
          <el-radio-button label="1">今天</el-radio-button>
          <el-radio-button label="2">昨天</el-radio-button>
          <el-radio-button label="3">本周</el-radio-button>
          <el-radio-button label="4">上周</el-radio-button>
          <el-radio-button label="5">本月</el-radio-button>
          <el-radio-button label="6">今年</el-radio-button>
          <!-- <el-radio-button label="7">全部</el-radio-button> -->
        </el-radio-group>
        <!-- <el-radio-group v-model="radio" size="mini" @change="getList" class="check-box">
          <el-radio-button label="1">今天</el-radio-button>
          <el-radio-button label="2">昨天</el-radio-button>
          <el-radio-button label="3">本周</el-radio-button>
          <el-radio-button label="4">上周</el-radio-button>
          <el-radio-button label="5">本月</el-radio-button>
          <el-radio-button label="6">今年</el-radio-button>
          <el-radio-button label="7">全部</el-radio-button>
        </el-radio-group> -->
      </div>
    </div>
      
    <div class="echars">
      <div id="myChart"></div>
    </div>
  
  </div>
</template>
<script>
import qs from "qs";
// import { fork } from 'cluster';
// 引入基本模板
let echarts = require('echarts/lib/echarts');
// 引入柱状图组件
require('echarts/lib/chart/bar');
require('echarts/lib/chart/line');
// 引入提示框和title组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
// 引入dataZoom组件
require('echarts/lib/component/dataZoom');
// 引入切换
require('echarts/lib/component/toolbox');
export default {
  data() {
    return {
      teacher_id: '',
      xArrer: [],
      yArrer: [],
      itemData: '',
      typeOne: "line",
      typeTwo: 'bar',
      identity: '',
      nickname: '',
      school_id: '',
      tableData: [],
      isLoading: false,
      teacherList: [],
      tracher: '',
      classList: [],
      classes: '',
      stuList: [],
      type: '',
      subordinate_id: '',
      pagesize: 15,
      currentPage: 1,
      teacheride: '',
      classide: '',
      uide: '',
      radio: '3',
    };
  },
  created() {
    this.teacher_id = localStorage.getItem("id");
    this.nickname = localStorage.getItem("nickname");
    this.school_id = localStorage.getItem("school_id");
    this.identity = localStorage.getItem("identity");
    this.getList();
    this.getTeacher();
  },
  computed: {},
  methods: {
    drawLine() { // eachers 柱状图方法
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        toolbox: {
          show: true,
          feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar']},
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: [
          {
            type: 'category',
            data: this.xArrer,
            axisPointer: {
              type: 'line'
            },
            axisLabel: {        
              interval: 0,
              formatter:function(value)
              {
                var ret = "";//拼接加\n返回的类目项
                var maxLength = 7;//每项显示文字个数
                var valLength = value.length;//X轴类目项的文字个数
                var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                if (rowN > 1)//如果类目项的文字大于3,
                {
                  for (var i = 0; i < rowN; i++) {
                    var temp = "";//每次截取的字符串
                    var start = i * maxLength;//开始截取的位置
                    var end = start + maxLength;//结束截取的位置
                    //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                    temp = value.substring(start, end) + "\n";
                    ret += temp; //凭借最终的字符串
                  }
                  return ret;
                }
                else {
                  return value;
                }
              }
            },
            axisLine:{
              lineStyle:{
                // x坐标轴的轴线颜色
              }
            }
          }
        ],
        tooltip : {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              show: true
            }
          }
        },
        dataZoom: [
          {   // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 0,      // 左边在 10% 的位置。
            end: 8,      // 右边在 60% 的位置。
            height: 16,  //组件高度
            // minvalueSpan: 20,
            // maxvalueSpan: 20,
          }
        ],
        yAxis: {},
        series: [
          { 
            name: '总分',
            // barGap:'80%',/*多个并排柱子设置柱子之间的间距*/
            // barCategoryGap:'50%',/*多个并排柱子设置柱子之间的间距*/
            type: this.typeTwo, 
            data: this.yArrer,
            itemStyle:{
              normal:{
                  color:'#409EFF'
              }
            }
          }
        ],
        grid: {
          bottom: '80px',
          // x:100,
          // x2:100,
        },
      });
    },
    
    async getList(){
      this.tracher == ''? this.teacheride = '' : this.teacheride = this.tracher[0];
      this.classes == ''? this.classide = '' : this.classide = this.classes[0];
      this.type == ''? this.uide = '' : this.uide = this.type[0];
      if (!this.value2 || this.value2 == ''){ this.start_time = '';this.end_time = '' } else { this.start_time = this.value2[0]/1000;this.end_time = this.value2[1]/1000 };
      const res = await this.$http.post("admin/teacher/tubiaoteachertubiaofenxi", qs.stringify({ school_id: this.school_id, teacher_id: this.teacheride, class_id: this.classide, u_id:this.uide, start_time: this.start_time, end_time: this.end_time, radio: this.radio }));
      // console.log(res.data.info)
      if (res.status === 200 && res.data.code === "1") {
        this.xArrer = [];
        this.yArrer = [];
        this.tableData = res.data.info;
        for ( var i = 0 ; i < this.tableData.length ; i++) {
          this.xArrer.push(this.tableData[i].u_nickname);
          this.yArrer.push(this.tableData[i].zongfen);
        }
      };
      this.drawLine();
    },
    search(){
      // if (this.tracher[0] && this.type == "") {
      //   this.$message({ message: "选择教师之后，必须具体到某位学生，方可查询", type: "error", duration: 4000});
      //   return false;
      // }
      this.getList();
    },
    // async qvxiaoYuyue(e){ // 取消预约
    //   const res = await this.$http.post("admin/Examination/quxiaoyuyue", qs.stringify({ id: e.id}));
    //   if (res.status === 200 && res.data.code === "1") {
    //     this.$message({ message: res.data.info, type: "success", duration: 3000});
    //     this.getList();
    //   } else {
    //     this.$message({ message: res.data.info, type: "error", duration: 3000});
    //   }
    // },
    async getTeacher() { // 获取教师
      const res = await this.$http.post(
        "admin/login/teacherlst",
        qs.stringify({ school_id: this.school_id })
      );
      if (res.status === 200 && res.data.code === "1") {
        this.teacherList = res.data.info;
      }
    },
    changeTeacher(){
      this.classes = "";
      this.classList = [];
      this.type = "";
      this.stuList = [];
      if (this.tracher == "" || !this.tracher){
        this.value2 = '';
        return false;
      }
      this.getClass();
    },
    async getClass() { // 获取班级
      const res = await this.$http.post(
        "admin/login/classlst",
        qs.stringify({ teacher_id: this.tracher[0] })
      );
      if (res.status === 200 && res.data.code === "1") {
        this.classList = res.data.info;
      }
    },
    changeClass(){
      this.type = "";
      this.stuList = [];
      this.getStu();
    },
    async getStu() { // 获取学生
      const res = await this.$http.post(
        "admin/login/studentlst",
        qs.stringify({ class_id: this.classes[0] })
      );
      if (res.status === 200 && res.data.code === "1") {
        this.stuList = res.data.info;
      }
    },
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/css/index.less");
.right {
  background-color: #fff;
  min-height: 100%;
  overflow: hidden;
  padding-top: 15px;
  box-sizing: border-box;
  .search-box {
    height: 50px;
    line-height: 50px;
    padding: 0 22px;
    float: left;
    .title {
      color: @theme;
      float: left;
      font-size: 14px;
      margin-right: 10px;
    }
  }
  .block {
    margin: 0 0 25px;
  }
  .button-box {
    text-align: center;
    // position: relative;
    .check-box {
      max-width: 10rem;
      height: 28px;
      overflow-x:auto;
    }
    
  }
}
.echars #myChart {
  height: 50vh;
  width: 100%;
  margin: 10 auto;
  background-color: #fff;
}

</style>