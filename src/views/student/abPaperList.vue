<template>
  <!-- ab级英译汉 -->
  <div class="right" v-loading="isLoading" element-loading-text="拼命加载中">
    <div class="table-box">
      <el-table style="width: 100%" border="" stripe :data="flatten(tableData.slice((currentPage -1) * pagesize, currentPage * pagesize))" class="table" :row-style="{height:'48px'}"  :header-row-style="{height:'48px'}">
        <el-table-column prop="id" label="序号" width="65"></el-table-column>
        <!-- prop="test_paper_name" -->
        <el-table-column prop="test_paper_name" label="试卷名称" min-width="120"></el-table-column>
        <el-table-column prop="manfen" label="总分">
        </el-table-column>
        <el-table-column prop="test_paper_type_name" label="试卷所属"></el-table-column>
        <el-table-column prop="cishu" label="练习次数"></el-table-column>
        <el-table-column prop="zuigaofeng" label="最高分"></el-table-column>
        <el-table-column prop="zuidifeng" label="最低分">
        </el-table-column>
        <el-table-column prop="pingjunfen" label="平均分">
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="startKaoshi(scope.row)" v-if="scope.row.huancun == 1">继续作答</el-button>
            <el-button size="mini" type="primary" @click="startKaoshi(scope.row)" v-if="scope.row.huancun == 0">开始训练</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="button-box">
      <el-button size="mini" type="primary" @click="goback">返回真题演练</el-button>
    </div>
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
    <!-- 导出Excel -->
    <el-button type="primary" @click="exportExcel" icon="el-icon-upload2" class="excel">导出Excel</el-button>
  </div>
</template>

<script>
import qs from "qs";
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    return {
      tableData: [],
      isLoading: false,
      pagesize: 15,
      currentPage: 1,
      id: '',
      identity: '',
      type: '',
      test_paper_type_id: '',
      school_id: '',
      stu_id: '',
    };
  },
  created() {
    this.type = localStorage.getItem("type");
    this.test_paper_type_id = localStorage.getItem("test_paper_type_id");
    this.stu_id = localStorage.getItem("id");
    this.school_id = localStorage.getItem("school_id");
    this.identity = localStorage.getItem("identity");
    this.getThesisList();
  },
  components: {

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
    async getThesisList() {
      this.isLoading = true;
      console.log(this.type,this.test_paper_type_id,this.school_id,this.stu_id);
      const res = await this.$http.post("admin/teacher/schoolpaperlst",qs.stringify({
        
        
        type: this.type, 
        test_paper_type_id: this.test_paper_type_id,
        school_id:this.school_id,
        student_id: this.stu_id
      }));
      if (res.status === 200 && res.data.code === "1") {
        this.tableData = res.data.info;
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this.$message({message: res.data.info,type: "error",duration: 2000});
      }
    },
    goback(){
      this.$router.go(-1);//返回上一层
    },
    startKaoshi(e){
      localStorage.setItem("kaoshiId", e.id);
      if (this.test_paper_type_id == 1){ this.$router.push({ name: "fourKaoshi" }) };
      if (this.test_paper_type_id == 2){ this.$router.push({ name: "sixKaoshi" }) };
      if (this.test_paper_type_id == 3){ this.$router.push({ name: "aKaoshi" }) };
      if (this.test_paper_type_id == 4){ this.$router.push({ name: "bKaoshi" }) };
    },
    exportExcel() {
      let getCurrentPage = this.currentPage;
      this.pagesize = 99999;
      this.currentPage = 1;
      this.$nextTick(function () {
        let time = new Date();
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        let name = year + "" + month + "" + day;
        var wb = XLSX.utils.table_to_book(document.querySelector(".table"));
        var wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array"
        });
        try {
          FileSaver.saveAs(
            new Blob([wbout], { type: "application/octet-stream" }),
            name + ".xlsx"
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
        this.pagesize = 15;
        this.currentPage = getCurrentPage;
        return wbout;
      })
    },
    
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/css/index.less");
.right {
  box-sizing: border-box;
  min-height: 100%;
  background-color: #fff;
  padding: 20px;
  overflow: hidden;
  .button-box {
    float: left;
    margin-top: 10px;
    .el-button {
      padding: 4px 9px;
      font-size: 12px;
    }
  }

}
.cell .el-button {
  padding: 4px 9px;
  font-size: 12px;
}
.excel {
  padding: 4px 9px;
  font-size: 12px;
  float: right;
  margin-right: 20px;
  margin-top: 10px;
}
</style>