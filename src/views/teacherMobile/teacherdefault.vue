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
        <p>班级操作</p>
        <van-grid :column-num="4" clickable>
          <van-grid-item icon="manager-o" text="教师列表" to="/mobileTeacherList" />
          <van-grid-item icon="friends-o" text="学生列表" to="/mobileStuList" />
          <van-grid-item icon="contact" text="我的班级" to="/mobileMyclass" />
          <van-grid-item icon="hotel-o" text="学校班级" to="/schoolClassList" />
        </van-grid>
        <p>其它操作</p>
        <van-grid :column-num="4" clickable>
          <van-grid-item icon="description" text="试卷预览" to="/paperYulan" />
          <van-grid-item icon="notes-o" text="单词学习" to="/mobildWordsList" />
          <van-grid-item icon="column" text="考试统计" to="/mobileStatistics" />
          <van-grid-item icon="chart-trending-o" text="成绩图表" to="/tecChengjiChart" />
          <van-grid-item icon="lock" text="修改密码" to="/mobilchangePassword" />
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
  height: 100%;
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
    // height: 100%;
    // overflow: auto;
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