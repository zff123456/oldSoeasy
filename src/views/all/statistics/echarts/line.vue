<template>
  <div class="right">
    <!-- echars表单数据展示 -->
    
    <div id="myChart_z"></div>
  </div>
</template>

<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line');
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  data() {
    return {};
  },
  created() {},
  computed: {},
  mounted() {
    this.drawLine();
  },
  methods: {
    drawLine() { // eachers 方法
      // 基于准备好的dom，初始化echarts实例
      let myChart_z = echarts.init(document.getElementById('myChart_z'))
      // 绘制图表
      myChart_z.setOption({
        title: { text: 'ECharts 入门fdsfhsh' },
        tooltip: {},
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'line',
          data: [5, 20, 36, 10, 10, 20]
        }]
      });
    }
  }
};
</script>

<style lang="less" scoped>
.echars {
  background-color: #fff;
}
.echars #myChart,
.echars #myChart_z {
  height: 400px;
  width: 800px;
  margin: 0 auto;
  background-color: #fff;
}
</style>
