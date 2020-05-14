<template>
  <div class="right" v-loading="isLoading" element-loading-text="拼命加载中">
    <div class="search-box">
      <div class="title">选择预约类型</div>
      <el-select v-model="type" placeholder="我的预约考试" @change="getUserList">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
    </div>
    <div class="table-box">
      <el-table :data="flatten(tableData.slice((currentPage -1) * pagesize, currentPage * pagesize))" stripe style="" border :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}">
        <el-table-column prop="test_paper_name" label="试卷名称" width="150"></el-table-column>
        <el-table-column prop="start_time" label="开考时间">
          <template slot-scope="scope">{{ scope.row.start_time | time}}</template>
        </el-table-column>
        <el-table-column prop="end_time" label="结束时间">
          <template slot-scope="scope">{{ scope.row.end_time | time}}</template>
        </el-table-column>
        <el-table-column prop="state" label="试卷状态">
          <template slot-scope="scope">{{blockState(scope.row.state)}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" :disabled="scope.row.state == 0" @click="gouYuyue(scope.row)">查看列表</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页插件。 -->
      <div style="float:right;padding-top:5px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="pagesize"
          layout="total, prev, pager, next,jumper"
          :total="tableData.length"
        ></el-pagination>
      </div>

    </div>
    
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      tableData: [],
      isLoading: false,
      options: [
        {
          value: "1",
          label: "学校预约考试"
        },
        {
          value: "2",
          label: "我的预约考试"
        }
      ],
      type: '我的预约考试',
      teacher_id: '',
      school_id: '',
      subordinate_id: '',
      pagesize: 15,
      currentPage: 1,
      nickname: '',
    };
  },
  created() {
    this.teacher_id = localStorage.getItem("id");
    this.nickname = localStorage.getItem("nickname");
    this.school_id = localStorage.getItem("school_id");
    this.getList();
     console.log(this.school_id,this.teacher_id)
  },
  computed: {},
  methods: {
    handleSizeChange(val) {
      this.pagesize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    flatten(arr) {
      var res = [];
      arr.map(item => {
        if (Array.isArray(item)) {
          res = res.concat(flatten(item));
        } else {
          res.push(item);
        }
      });
      return res;
    },
    async getUserList(){
      this.getList()
    },
    async getList(){
      if( this.type == 1){
        console.log(this.school_id,this.teacher_id)
        const res = await this.$http.post("admin/Examination/AppointmentExaminationlst", qs.stringify({ subordinate: 1, subordinate_id: this.school_id,type: 2}));
        if (res.status === 200 && res.data.code === "1") {
          this.tableData = res.data.info
        }
        console.log(res)
      };
      if ( this.type == 2 || this.type == "我的预约考试" ){
        const res = await this.$http.post(
          "admin/Examination/AppointmentExaminationlst",
          qs.stringify({ subordinate: 2, subordinate_id: this.teacher_id,type: 2})
        );
        if (res.status === 200 && res.data.code === "1") {
          this.tableData = res.data.info;
        }
      }
    },
    blockState(e) {
      if (e == 1) {
        return "正常";
      } else {
        return "等待审核";
      }
    },
    async gouYuyue(e) {
      console.log(e.id);
      localStorage.setItem("yuyueList_id", e.id); // 用户名称
      this.$router.push({ name: "studentYuyueList" });
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../../../assets/css/index.less");
.right {
  background-color: #fff;
  height: 100%;
  width: 100%;
  .search-box {
    height: 50px;
    line-height: 50px;
    padding: 0 15px;
    .title {
      color: @theme;
      float: left;
      font-size: 14px;
      margin-right: 20px;
    }
  }
  .table-box {
    padding: 10px;
    padding-top: 0;
  }
  .transfer-box {
    float: left;
    font-size: 18px;
    margin-top: 15px;
    margin-right: 20px;
  }
}
.cell .el-button {
  padding: 4px 9px;
  font-size: 12px;
}
input::-webkit-input-placeholder {
  color: #000;
}
input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #000;
}
input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #000;
}
input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #000;
}
</style>
