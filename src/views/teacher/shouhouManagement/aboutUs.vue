<template>
  <div class="right">
    <div class="table-box">
      <el-table :data="tableData" stripe style="width: 100%" border :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}">
        <el-table-column prop="name" label="姓名" width="180"></el-table-column>
        <el-table-column prop="date" label="职位" width="180"></el-table-column>
        <el-table-column prop="sex" label="性别" width="150"></el-table-column>
        <el-table-column prop="address" label="邮箱"></el-table-column>
        <el-table-column prop="phpne" label="电话"></el-table-column>
      </el-table>
    </div>
    <div class="lianxi">
      技术部联系方式：83603946 转 8007
    </div>
  </div>
</template>

<script>
// import qs from "qs";
export default {
  data() {
    return {
      tableData: [
        {
          date: "客服人员",
          name: "祖**",
          address: "2544788165@qq.com",
          phpne: "83603946",
          sex: "女"
        },
        {
          date: "客服人员",
          name: "司**",
          address: "445353231@qq.com",
          phpne: "15850679230",
          sex: "女"
        },
        {
          date: "客服人员",
          name: "王**",
          address: "1556214773@qq.com",
          phpne: "15366030651",
          sex: "女"
        }
      ]
    };
  },
  created() {},
  computed: {},
  methods: {}
};
</script>

<style lang="less" scoped>
@import url("../../../assets/css/index.less");
.right {
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  .lianxi {
    color: @theme;
    float: right;
    font-size: 14px;
    margin: 10px 20px;
  }
  .table-box {
    margin: 10px;
    margin-bottom: 0;
  }
}
</style>
