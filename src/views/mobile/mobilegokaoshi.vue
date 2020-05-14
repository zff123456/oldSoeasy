<template>
    <div class="right" v-loading="isLoading" element-loading-text="拼命加载中">
      <div class="search-box">
        <div class="title">选择预约类型</div>
        <el-select v-model="type" placeholder="学校" @change="getUserList">
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
          <!-- <el-table-column prop="start_time" label="开始时间">
            <template slot-scope="scope">{{ scope.row.start_time | time}}</template>
          </el-table-column>
          <el-table-column prop="end_time" label="结束时间">
            <template slot-scope="scope">{{ scope.row.end_time | time}}</template>
          </el-table-column> -->
          <el-table-column prop="state" label="试卷状态">
            <template slot-scope="scope">{{blockState(scope.row.state)}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="goutuKaoshi(scope.row)" :disabled="scope.row.state != 1">开始考试</el-button>
              <!-- :disabled="scope.row.state == 0"  -->
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
            label: "学校"
          },
          {
            value: "2",
            label: "教师"
          }
        ],
        type: '',
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
      // async getList(){
      //   const res = await this.$http.post("admin/Examination/jilailikao", qs.stringify({ u_id: this.teacher_id}));
      //   if (res.status === 200 && res.data.code === "1") {
      //     this.tableData = res.data.info
      //   }
      // },
      async getUserList(){
        this.getList()
      },
      async getList(){
        if( this.type == 1 || this.type == ''){ 
          const res = await this.$http.post("admin/Testpapergeneration/wuzihuakoashi", qs.stringify({ school_id: this.school_id}));
          if (res.status === 200 && res.data.code === "1") {
            this.tableData = res.data.info
            console.log(res.data)
          } else {
            console.log(res.data)
          }
        };
        if( this.type == 2){
          const res = await this.$http.post("admin/Examination/jilailikao", qs.stringify({ subordinate: 2, subordinate_id: this.teacher_id}));
          if (res.status === 200 && res.data.code === "1") {
            this.tableData = res.data.info
            console.log(res.data)
          } else {
            console.log(res.data)
          }
        };
      },
      async goutuKaoshi(e){ // 开始考试
        const data = Date.parse(new  Date())/1000;
        if (data < e.start_time) {
          this.$message({ message: "未到考试时间，无法进行考试", type: "warning", duration: 3000});
          return false;
        };
        if ( data > e.end_time){
          this.$message({ message: "考试时间已结束，无法进行考试", type: "warning", duration: 3000});
          return false;
        };
        console.log(e);
        
        // localStorage.setItem("kaoshiId", e.id);
        localStorage.setItem("kaoshiId", e.id);
        console.log();
        
      if (e.test_paper_type_id == 1){ this.$router.push({ name: "mobile-four-wu" }) };
      if (e.test_paper_type_id == 2){ this.$router.push({ name: "mobile-six-wu" }) };
      // if (e.test_paper_type_id == 3){ this.$router.push({ name: "mobile-a-kaoshi" }) };
      // if (e.test_paper_type_id == 4){ this.$router.push({ name: "mobile-b-kaoshi" }) };
      },
      blockState(e){
        if(e == 1) { return "正常"} else { return "等待审核" }
      },
    }
  };
  </script>
  
  <style lang="less" scoped>
  @import url("../../assets/css/index.less");
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
  }
  .cell .el-button {
    padding: 4px 9px;
    font-size: 12px;
  }
  input::-webkit-input-placeholder{
      color:#000;
  }
  input::-moz-placeholder{   /* Mozilla Firefox 19+ */
      color:#000;
  }
  input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
      color:#000;
  }
  input:-ms-input-placeholder{  /* Internet Explorer 10-11 */ 
      color:#000;
  }
  </style>