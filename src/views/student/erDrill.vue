<template>
  <div class="right">
    <div class="big-box">
      <ul>
        <li @click="isHasFour == false?open2():toPath(2,1)" :class="isHasFour == false?'block':''">
          <img src="../../assets/image/4.png" alt="">
          <span>四级模拟</span>
        </li>
        <li @click="isHasSix == false?open2():toPath(2,2)" :class="isHasSix == false?'block':''">
          <img src="../../assets/image/6.png" alt="">
          <span>六级模拟</span>
        </li>
        <li @click="isHasA == false?open2():toPath( 2, 3)" :class="isHasA == false?'block':''">
          <img src="../../assets/image/A.png" alt="">
          <span>A级模拟</span>
        </li>
        <li @click="isHasB == false?open2():toPath( 2, 4)" :class="isHasB == false?'block':''">
          <img src="../../assets/image/B.png" alt="">
          <span>B级模拟</span>
        </li>
        <li  @click="isHasFour == false?open2():toPath( 1, 1)" :class="isHasFour == false?'block':''">
          <img src="../../assets/image/4.png" alt="">
          <span>四级真题</span>
        </li>
        <li @click="isHasSix == false?open2():toPath(1,2)" :class="isHasSix == false?'block':''">
          <img src="../../assets/image/6.png" alt="">
          <span>六级真题</span>
        </li>
        <li @click="isHasA == false?open2():toPath( 1,3)" :class="isHasA == false?'block':''">
          <img src="../../assets/image/A.png" alt="">
          <span>A级真题</span>
        </li>
        <li @click="isHasB == false?open2():toPath(1, 4)" :class="isHasB == false?'block':''">
          <img src="../../assets/image/B.png" alt="">
          <span>B级真题</span>
        </li>
        <li @click="open1">
          <img src="../../assets/image/kaoyan.png" alt="">
          <span>考研</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      school_id: '',
      isHasFour: false,
      isHasSix: false,
      isHasA: false,
      isHasB: false
    };
  },
  created() {
    this.school_id = localStorage.getItem("school_id");
    this.getItem()
  },
  computed: {},
  methods: {
    toPath(type, test_paper_type_id){
      this.$router.push({
        name: `abPaperList`,
        params: {
          type: type,
          test_paper_type_id: test_paper_type_id
        }
      });
      localStorage.setItem("type", type); // 存试卷类型
      localStorage.setItem("test_paper_type_id", test_paper_type_id); // 存试卷类型
    },
    open1() {
      const h = this.$createElement;
      this.$notify({
        title: '考研',
        message: h('i', { style: 'color: teal'}, '考研功能还在开发中哦。')
      });
    },
    async getItem(){
      const res = await this.$http.post("admin/teacher/Openingofquestionbank",qs.stringify({school_id:this.school_id}));
      if (res.status === 200 && res.data.code === "1") {
      }
      console.log(res);
      const arr = res.data.info;
      for ( var i = 0 ; i < arr.length; i++) {
        if(arr[i].trim() == '1'){ this.isHasFour = true };
        if(arr[i].trim() == '2'){ this.isHasSix = true };
        if(arr[i].trim() == '3'){ this.isHasA = true };
        if(arr[i].trim() == '4'){ this.isHasB = true }
      }
    },
    open2() {
      const h = this.$createElement;
      this.$notify({
        title: '请先行开通',
        message: h('i', { style: 'color: red'}, '您暂未开通本套试卷服务，请先行购买')
      });
    },
  }
};
</script>

<style lang="less" scoped>
@import url("../../assets/css/index.less");
.right {
  background-color: #fff;
  min-height: 100%;
  .big-box {
    padding: 10px;
    ul {
      display:flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      li {
        height: 220px;
        width: 220px;
        float: left;
        margin: 10px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        transition-duration: 0.4s;
        &:hover {
          box-shadow: 0 2px 4px rgba(0, 0, 0, .15), 0 0 6px rgba(0, 0, 0, .15);
          transform: translateY(-2px);
        }
        img {
          width: 210px;
          height: 153px;
          margin: 10px auto 10px;
          display: block;
        }
        span{
          color: @theme;
          text-align: center;
          display: block;
          font-size: 18px;
        }
      }
    }
  }
}
</style>