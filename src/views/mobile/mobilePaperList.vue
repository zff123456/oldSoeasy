<template>
  <div class="right">
    <!-- 试卷列表 -->
    <van-list v-model="loading" :finished="true" >
      <!-- <van-cell v-for="(item,key) in tableData" :key="key" :title="item.test_paper_name" @click="toKaosho(item)" :style="item.huancun==1?'red':'' "/> -->
      
      <van-cell v-for="(item,key) in tableData" :key="key" :title="item.test_paper_name" @click="toKaosho(item)" :style="{'color':item.huancun==1 ? 'red':''}"/>
    </van-list>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      tableData: [],
      loading: false,
      finished: false
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
  computed: {},
  methods: {
    async getThesisList() {
      this.isLoading = true;
      const res = await this.$http.post("admin/teacher/schoolpaperlst",qs.stringify({
        type: this.type, 
        test_paper_type_id: this.test_paper_type_id,
        school_id:this.school_id,
        student_id: this.stu_id
      }));
      console.log(res)
      if (res.status === 200 && res.data.code === "1") {
        this.tableData = res.data.info;
        console.log(this.tableData)
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this.$message({message: res.data.info,type: "error",duration: 2000});
      }
    },
    toKaosho(item){
      localStorage.setItem("kaoshiId", item.id);
      if (this.test_paper_type_id == 1){ this.$router.push({ name: "mobile-four-kaoshi" }) };
      if (this.test_paper_type_id == 2){ this.$router.push({ name: "mobile-six-kaoshi" }) };
      if (this.test_paper_type_id == 3){ this.$router.push({ name: "mobile-a-kaoshi" }) };
      if (this.test_paper_type_id == 4){ this.$router.push({ name: "mobile-b-kaoshi" }) };
    }
  }
};
</script>

<style lang="less" scoped>
.right {
  background-color: #fff;
  height: 100%;
  text-align: center;
}
.red{
  color:red
}

</style>