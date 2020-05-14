<template>
  <div class="right">
    <!-- 代办理事项 -->
    <div class="data-box">
      <ul class="clearfix">
        <li v-for="(item,key) in item" :key="key">
          <p>{{item[0]}}</p>
          <p>{{item[1]}}</p>
        </li>
      </ul>
    </div>
    <!-- 表格数据 -->
    <div class="content-box">
      <div class="charts">
        <div id="myChart"></div>
      </div>
      <div class="table-box">
        <p style="text-align: center;height:40px;line-height: 40px;">{{identity == 2? '我的错题统计' : '班级错题统计'}}</p>
        <el-table style="width: 100%" border="" stripe :data="itemDate" :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}">
          <el-table-column prop="type_name" label="题目类型"></el-table-column>
          <el-table-column prop="zongtishu" label="总题数"></el-table-column>
          <el-table-column prop="duinum" label="正确数量"></el-table-column>
          <el-table-column prop="cuonum" label="错题数量"></el-table-column>
          <el-table-column prop="zhengquelv" label="正确率">
            <template slot-scope="scope">{{`${scope.row.zhengquelv}%`}}</template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import qs from "qs";
// 引入基本模板
let echarts = require('echarts/lib/echarts');
// 引入柱状图组件
require('echarts/lib/chart/pie');
// 引入提示框和title组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/legend');
export default {
  data() {
    return {
      selected: 1,
      item: "",
      id: "",
      identity: "",
      itemDate: [],
      chartDate: [],
      legendDate: [],
    };
  },
  created() {
    this.id = localStorage.getItem("id");
    this.identity = localStorage.getItem("identity");
    this.getItem();
  },
  computed: {},
  mounted() {},
  methods: {
    tabck(index) {
      this.selected = index; //设置tab选中项
    },
    async getItem() {
      const res = await this.$http.post(
        "admin/index/studenhome",
        qs.stringify({ id: this.id, identity: this.identity })
      );
      console.log(res);
      if (res.status === 200 && res.data.code === "1") {
        console.log(res);
        this.item = res.data.info.shijuan;
        // tongji得到的是对象 要将它遍历为数组
        for (var i in res.data.info.tongji) {
          this.itemDate.push(res.data.info.tongji[i]);
          // this.chartDate.push({value: res.data.info.tongji[i].})
        }
      };
      this.drawLine();
    },
    drawLine() {
      // eachers 饼状图方法
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "考试数据统计",
          // subtext: "纯属虚构",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["60分以下", "60分-80分", "80分到100分", "100分到120分", "120分以上的"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
              { value: 335, name: "60分以下" },
              { value: 310, name: "60分-80分" },
              { value: 234, name: "80分到100分" },
              { value: 135, name: "100分到120分" },
              { value: 1548, name: "120分以上的" }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../../assets/css/index.less");
.right {
  background-color: #fff;
  min-height: 100%;
  box-sizing: border-box;
  .content-box {
    .charts {
      height: 460px;
      width: 45%;
      float: left;
      padding-top: 50px;
      #myChart {
        height: 400px;
        padding: 0 20px 0;
      }
    }
    .table-box {
      
      margin-left: 45%;
      padding: 20px;
    }
  }
}
.data-box ul {
  overflow: hidden;
}
.data-box ul li {
  float: left;
  margin: 20px;
  width: 280px;
  height: 180px;
  padding: 30px 50px;
  box-sizing: border-box;
  border-radius: 10px;
}
.data-box ul li p {
  height: 30px;
  line-height: 30px;
  color: #fff;
  text-align: left;
}
.data-box ul li p:nth-child(1) {
  margin-top: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #fff;
}
.data-box ul li p:nth-child(2) {
  font-size: 28px;
  height: 40px;
  line-height: 40px;
}
.data-box ul li:nth-child(3n + 1) {
  background-color: #ff877e;
}
.data-box ul li:nth-child(3n + 2) {
  background-color: #af7cf3;
}
.data-box ul li:nth-child(3n + 3) {
  background-color: #52afff;
}
.echars {
  position: relative;
}
.echars .router-box {
  position: absolute;
  top: 10px;
  right: 50%;
  z-index: 111;
  transform: translateX(370px);
}
.rlink {
  color: #333;
  height: 30px;
  width: 30px;
}
.theme {
  color: @theme;
}
</style>
