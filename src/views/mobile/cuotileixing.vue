<template>
  <div class="right">
    <div class="table-box">
      <!-- <p style="text-align: center;height:40px;line-height: 40px;">{{identity == 2? '错题统计' : '班级错题统计'}}</p> -->
      <el-table style="width: 100%" border="" stripe :data="itemDate" :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}">
        <el-table-column prop="type_name" label="题目类型" fixed width="90"></el-table-column>
        <el-table-column prop="zongtishu" label="总题数"></el-table-column>
        <el-table-column prop="duinum" label="正确数量"></el-table-column>
        <el-table-column prop="cuonum" label="错题数量"></el-table-column>
        <el-table-column prop="zhengquelv" label="正确率">
          <template slot-scope="scope">{{`${scope.row.zhengquelv}%`}}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
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
  methods: {
    async getItem() {
      const res = await this.$http.post(
        "admin/index/studenhome",
        qs.stringify({ id: this.id, identity: this.identity })
      );
      if (res.status === 200 && res.data.code === "1") {
        for (var i in res.data.info.tongji) {
          this.itemDate.push(res.data.info.tongji[i]);
        }
      };
    },
  }
};
</script>

<style lang="less" scoped>
.right {
  background-color: #fff;
  height: 100%;
}

</style>