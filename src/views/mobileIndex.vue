<template>
  <div class="right mobile" v-loading="isLoading" element-loading-text="拼命加载中" style="padding-top: 46px;">
    
    <!-- 顶部导航栏 -->
    <van-nav-bar :title='chhoolName' left-text="返回" left-arrow @click-left="onClickLeft" right-text="菜单"  @click-right="onClickRight" :fixed="true" ></van-nav-bar>
    <!-- right-text="菜单" -->
    <!-- 导航页面内容 -->
    <transition name="el-zoom-in-top">
      <div class="nav-content" v-show="isBlock ==true">
        <p>模拟题</p>
        <van-grid clickable :column-num="2">
          <van-grid-item icon="label-o" text="A级模拟"  @click="toPath( 2, 3)" />
          <van-grid-item icon="orders-o" text="B级模拟" @click="toPath( 2, 4)" />
          <van-grid-item icon="records" text="四级模拟" @click="toPath(2,1)" />
          <!-- <van-grid-item icon="good-job-o" text="六级模拟" @click="toPath(2,2)" /> -->
        </van-grid>
        <p>真题</p>
        <van-grid clickable :column-num="2">
          <van-grid-item icon="label-o" text="A级真题" @click="toPath( 1,3)"/>
          <van-grid-item icon="orders-o" text="B级真题" @click="toPath(1, 4)"/>
          <van-grid-item icon="records" text="四级真题" @click="toPath( 1, 1)"/>
          <van-grid-item icon="good-job-o" text="六级真题" @click="toPath(1,2)"/>
        </van-grid>
        <p>其他操作</p>
        <van-grid :column-num="4" clickable>
          <van-grid-item icon="failure" text="错题类型" to="/cuotileixing" @click="isBlock = false" />
          <van-grid-item icon="points" text="错题集锦" to="/mobileCuoti" @click="isBlock = false" />
          <van-grid-item icon="home-o" text="单项突破" to="/mobileBreakThrough" @click="isBlock = false" />
          <van-grid-item icon="completed" text="数据统计" to="/mobileDataFenxi" @click="isBlock = false" />
          <van-grid-item icon="chart-trending-o" text="图表统计" to="/mobileCharts" @click="isBlock = false" />
          <van-grid-item icon="notes-o" text="单词学习" to="/mobildWordsList" @click="isBlock = false" />
          <van-grid-item icon="records" text="修改密码" to="/mobileCheckMima" @click="isBlock = false" />
          <van-grid-item icon="phone-o" text="联系我们" to="/mobileAboutas" @click="isBlock = false" />
          <van-grid-item icon="phone-o" text="无纸化考试" to="/mobilegokaoshi" @click="isBlock = false" />
        </van-grid>
        <div style="height:40px;background-color: #f8f8f8;"></div>
      </div>
    </transition>
    
    <div class="router-box">
      <!-- 子路由出口： -->
      <router-view/>
    </div>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
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
  },
  computed: {
    
  },
  mounted: function () {
    
  },
  watch: {
    
  },
  methods: {
    
    onClickLeft() {
      this.$router.go(-1);
    },
    onClickRight() {
      this.isBlock == true? this.isBlock = false : this.isBlock = true;
    },
    toPath(type, test_paper_type_id){
      this.isBlock = false;
      localStorage.setItem("type", type); // 存试卷类型
      localStorage.setItem("test_paper_type_id", test_paper_type_id); // 存试卷类型
      this.$router.push({
        name: `mobilePaperList`,
      });
      if (this.$route.path == '/mobilePaperList'){
        location.reload();
      };
    },
  }
};
</script>

<style lang="less">
// @import url("../../../assets/css/index.less");
.right {
  // background-color: #fff;
  min-height: 100%;
  width: 100%;
  position: relative;
  .nav-text {
    position: absolute;
    right: 40px;
    top: 12px;
    z-index: 99999;
    font-size: 16px;
    color: #409EFF;
  }
  .van-nav-bar {
    background-color: #fff;
    // position: -webkit-sticky;
    // position:sticky;
    // top: 0;
    // z-index: 9999;
    .van-nav-bar__right i {
      font-size: .533333rem;
    }
    span {
      background-color: #fff;
    }
  }
  .nav-content {
    transition-duration: 1s;
    position: fixed;
    top: 46px;
    z-index: 999999;
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
}
.van-cell:nth-child(even) {
  background-color: #FAFAFA;
}
.van-list>.van-cell {
  font-size: 16px;
}
.van-tabs__line {
  z-index: 0 !important;
}
.el-message-box.is-tijiao {
  width: 100%;
  margin-top: 30vh;
}
</style>