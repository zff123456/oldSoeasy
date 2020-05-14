<template>
  <div class="right" v-loading="isLoading" element-loading-text="拼命加载中">
  <!-- 首页选项页面。 -->
    <van-swipe :autoplay="3000" indicator-color="white" style="height:200px">
      <van-swipe-item>
        <div class="swiper-box">
          <img src="../../assets/image/swiper01.jpg" alt="">
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="swiper-box">
          <img src="../../assets/image/swiper02.jpg" alt="">
        </div>
      </van-swipe-item>
      <van-swipe-item>
        <div class="swiper-box">
          <img src="../../assets/image/swiper03.jpg" alt="">
        </div>
      </van-swipe-item>
    </van-swipe>
    <transition name="el-zoom-in-top">
      <div class="na-content">
        <p>模拟题</p>
        <van-grid clickable :column-num="4">
          <van-grid-item icon="label-o" text="A级模拟"  @click="toPath( 2, 3)"/>
          <van-grid-item icon="orders-o" text="B级模拟" @click="toPath( 2, 4)"/>
          <van-grid-item icon="records" text="四级模拟" @click="toPath(2,1)"/>
          <van-grid-item icon="good-job-o" text="六级模拟" @click="toPath(2,2)" />
        </van-grid>
        <p>真题</p>
        <van-grid clickable :column-num="4">
          <van-grid-item icon="label-o" text="A级真题" @click="toPath( 1,3)"/>
          <van-grid-item icon="orders-o" text="B级真题" @click="toPath(1, 4)"/>
          <van-grid-item icon="records" text="四级真题" @click="toPath( 1, 1)"/>
          <van-grid-item icon="good-job-o" text="六级真题" @click="toPath(1,2)"/>
        </van-grid>
        <p>其他操作</p>
        <van-grid :column-num="4" clickable>
          <van-grid-item icon="home-o" text="无纸化考试" to="/mobilegokaoshi"  />
          <van-grid-item icon="failure" text="错题类型" to="/cuotileixing" />
          <van-grid-item icon="points" text="错题集锦" to="/mobileCuoti" />
          <van-grid-item icon="home-o" text="单项突破" to="/mobileBreakThrough"/>
          <van-grid-item icon="completed" text="数据统计" to="/mobileDataFenxi"/>
          <van-grid-item icon="chart-trending-o" text="图表统计" to="/mobileCharts" />
          <van-grid-item icon="notes-o" text="单词学习" to="/mobildWordsList" />
          <van-grid-item icon="records" text="修改密码" to="/mobileCheckMima" />
          <van-grid-item icon="phone-o" text="联系我们" to="/mobileAboutas" />
         
        </van-grid>
        <div style="height:40px;background-color: #f8f8f8;"></div>
      </div>
    </transition>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      // item: '',
      isLoading: false,
      isBlock: false,
      nickname: '',
      chhoolName: '',
      identity: '',
      stu_id: '',
    };
  },
  created() {
    this.nickname = localStorage.getItem("nickname");
    this.chhoolName = localStorage.getItem("school_name");
    this.stu_id = localStorage.getItem("id");
    // this.getItem();
  },
  computed: {},
  methods: {
    // async getItem() {
    //   const res = await this.$http.post(
    //     "admin/index/studenhome",
    //     qs.stringify({ id: this.t_id, identity: this.use_user })
    //   );
    //   if (res.status === 200 && res.data.code === "1") {
    //     this.item = res.data.info.shijuan;
    //   };
    // },
    // onClickLeft() {
    //   this.$router.go(-1);
    // },
    // onClickRight() {
    //   this.isBlock == true? this.isBlock = false : this.isBlock = true;
    // },
    toPath(type, test_paper_type_id){
      this.isBlock = false;
      localStorage.setItem("type", type); // 存试卷类型
      localStorage.setItem("test_paper_type_id", test_paper_type_id); // 存试卷类型
      this.$router.push({
        name: `mobilePaperList`,
      });
      // if (this.$route.path == '/mobilePaperList'){
      //   location.reload();
      // };
    },
  }
};
</script>

<style lang="less" scoped>
.right {
  background-color: #fff;
  min-height: 100%;
  // text-align: center;
  .data-box {
    padding: .533333rem;
  }
  .na-content {
    transition-duration: 1s;
    // position: fixed;
    // top: 46px;
    // z-index: 999999;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: #f8f8f8;
    color: #409EFF;
    padding-bottom: 40px;
    p {
      background-color: #f8f8f8;
      font-size: .426667rem;
      padding: 0 .8rem;
      height: 1.066667rem;
      line-height: 1.066667rem;
    }
  }
  .swiper-box {
    height: 200px;
    img {
      height: 200px;
      width: 100%;
      object-fit: cover;
    }
  }
}

</style>