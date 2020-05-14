<template>
  <div class="right">
    <div class="tab-box">
      <el-row>
        <el-button plain @click.native="check(1)" :class="isCheck == 1?'checked':''">四级图表</el-button>
        <el-button plain @click.native="check(2)" :class="isCheck == 2?'checked':''">六级图表</el-button>
        <el-button plain @click.native="check(3)" :class="isCheck == 3?'checked':''">A级图表</el-button>
        <el-button plain @click.native="check(4)" :class="isCheck == 4?'checked':''">B级图表</el-button>
      </el-row>
    </div>
    <div class="echars">
      <div id="myChart"></div>
    </div>
    <div class="echars">
      <div id="LineChart"></div>
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
export default {
  data() {
    return {
      isCheck: 1,
      id: '',
      xArrer: [],
      yArrer: [],
      itemData: '',
      typeOne: "line",
      typeTwo: 'bar'
    };
  },
  created() {
    this.id = localStorage.getItem("id");
    this.getItem();
  },
  computed: {},
  mounted() {
    
  },
  methods: {
    check(item){
      this.isCheck = item;
      this.getItem();
    },
    drawLine() { // eachers 柱状图方法
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
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
            end: 20,      // 右边在 60% 的位置。
            height: 16,  //组件高度
          }
        ],
        yAxis: {},
        series: [
          { name: '总分', type: this.typeTwo, data: this.yArrer},
          { name: '作文', type: this.typeTwo, data: this.getName("作文")},
          { name: '听短文理解', type: this.typeTwo, data: this.getName("听短文理解")},
          { name: '选词填空', type: this.typeTwo, data: this.getName("选词填空")},
          { name: '新闻报道', type: this.typeTwo, data: this.getName("新闻报道")},
          { name: '长篇阅读', type: this.typeTwo, data: this.getName("长篇阅读")},
          { name: '仔细阅读', type: this.typeTwo, data: this.getName("仔细阅读")},
          { name: '听长对话', type: this.typeTwo, data: this.getName("听长对话")},
          { name: '篇章翻译', type: this.typeTwo, data: this.getName("篇章翻译")},
          { name: '听篇章', type: this.typeTwo, data: this.getName("听篇章")},
          { name: '听讲座对话', type: this.typeTwo, data: this.getName("听讲座对话")},
          { name: '听短对话', type: this.typeTwo, data: this.getName("听短对话")},
          { name: '短文填空', type: this.typeTwo, data: this.getName("短文填空")},
          { name: '听短文', type: this.typeTwo, data: this.getName("听短文")},
          { name: '词汇选择', type: this.typeTwo, data: this.getName("词汇选择")},
          { name: '词汇填空', type: this.typeTwo, data: this.getName("词汇填空")},
          { name: '阅读填空', type: this.typeTwo, data: this.getName("阅读填空")},
          { name: '词汇匹配', type: this.typeTwo, data: this.getName("词汇匹配")},
          { name: '阅读理解', type: this.typeTwo, data: this.getName("阅读理解")},
          { name: '翻译选择', type: this.typeTwo, data: this.getName("翻译选择")},
          { name: '英译汉', type: this.typeTwo, data: this.getName("英译汉")},
          { name: '听单句', type: this.typeTwo, data: this.getName("听单句")}
        ],
        grid: {
          bottom: '80px',
        },
      });
    },
    LinedrawLine() { // eachers 折线图 方法
      // 基于准备好的dom，初始化echarts实例
      let myChart_z = echarts.init(document.getElementById('LineChart'))
      // 绘制图表
      myChart_z.setOption({
        // title: { text: 'ECharts 入门fdsfhsh' },
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
            end: 20,         // 右边在 60% 的位置。
            height: 16,//组件高度
          }
        ],
        yAxis: {},
        series: [
            { name: '总分', type: this.typeOne, data: this.yArrer},
            { name: '作文', type: this.typeOne, data: this.getName("作文")},
            { name: '听短文理解', type: this.typeOne, data: this.getName("听短文理解")},
            { name: '选词填空', type: this.typeOne, data: this.getName("选词填空")},
            { name: '新闻报道', type: this.typeOne, data: this.getName("新闻报道")},
            { name: '长篇阅读', type: this.typeOne, data: this.getName("长篇阅读")},
            { name: '仔细阅读', type: this.typeOne, data: this.getName("仔细阅读")},
            { name: '听长对话', type: this.typeOne, data: this.getName("听长对话")},
            { name: '篇章翻译', type: this.typeOne, data: this.getName("篇章翻译")},
            { name: '听篇章', type: this.typeOne, data: this.getName("听篇章")},
            { name: '听讲座对话', type: this.typeOne, data: this.getName("听讲座对话")},
            { name: '听短对话', type: this.typeOne, data: this.getName("听短对话")},
            { name: '短文填空', type: this.typeOne, data: this.getName("短文填空")},
            { name: '听短文', type: this.typeOne, data: this.getName("听短文")},
            { name: '词汇选择', type: this.typeOne, data: this.getName("词汇选择")},
            { name: '词汇填空', type: this.typeOne, data: this.getName("词汇填空")},
            { name: '阅读填空', type: this.typeOne, data: this.getName("阅读填空")},
            { name: '词汇匹配', type: this.typeOne, data: this.getName("词汇匹配")},
            { name: '阅读理解', type: this.typeOne, data: this.getName("阅读理解")},
            { name: '翻译选择', type: this.typeOne, data: this.getName("翻译选择")},
            { name: '英译汉', type: this.typeOne, data: this.getName("英译汉")},
            { name: '听单句', type: this.typeOne, data: this.getName("听单句")}
        ],
        grid: {
          bottom: '80px',
        },
      });
    },
    async getItem() {
      this.xArrer = [];
      this.yArrer = [];
      const res = await this.$http.post("admin/teacher/chartfenxi", qs.stringify({student_id: this.id,test_paper_type_id: this.isCheck}));
      if (res.status === 200 && res.data.code === "1") {
        this.itemData = res.data.info;
        for ( var i = 0 ; i < res.data.info.length ; i++) {
          this.xArrer.push(res.data.info[i].test_paper_name);
          this.yArrer.push(res.data.info[i].zongfen)
        }
        this.drawLine();
        this.LinedrawLine();
      }
    },
    getName(name){
      let arr = [];
      for ( var i = 0 ; i < this.itemData.length ; i++) {
        for(var j = 0; j < this.itemData[i].jutifenshu.length ; j++) {
          if (name == this.itemData[i].jutifenshu[j].name){
            arr.push(this.itemData[i].jutifenshu[j].fenshu)
          }
        }
      }
      return arr;
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/css/index.less");
.right {
  background-color: #fff;
  min-height: 100%;
  .tab-box {
    .el-row {
      text-align: center;
      // padding-top: 10px;
      // transform: translateY(10px);
      position: relative;
      top: 20px;
      right: 0;
      z-index: 100;
      .el-button {
        border-radius: 0;
        &.checked {
          background-color: @theme;
          color: #fff;
        }
      }
    }
  }
}
.echars #myChart,
.echars #myChart_z,
.echars #LineChart {
  height: 350px;
  width: 100%;
  margin: 10 auto;
  background-color: #fff;
}

</style>