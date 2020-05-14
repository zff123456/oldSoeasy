<template>
  <div class="about">
    <el-container class="index-box" :class="isblock == true ?'':'active'">
      <!-- 头部栏 -->
      <el-header style="padding-left:0;height:60px;padding-right:0;">
        <div class="left fl" v-if="isblock == true">
          <img src="./../assets/35207.png" alt="">
          SO EASY
        </div>
        <div class="retract fl" @click="retract">
          <i class="el-icon-s-unfold"></i>
        </div>
        <div class="header-center">{{chhoolName}}</div>
        <div class="header">
          <div class="header-title">
            <i class="el-icon-user-solid"></i>
            {{nickname}}
          </div>
        </div>
        <div @click="logout" class="logout">退出登录
        </div>
      </el-header>
      <el-container>
        <el-aside width="180px" class="index-cebian" v-if="isblock == true" >
          <!-- 学生侧边栏 -->
          <!-- default-active="statistics" -->
          <el-menu
            :default-active="activerouter"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#2A3542"
            text-color="#fff"
            active-text-color="#409EFF"
            :router="true"
            v-if="identity == 2"
            :unique-opened="true"
          >
          <!-- :default-active="currentMenu" -->
            <el-menu-item index="statistics">
              <i class="el-icon-user-solid"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-menu-item index="workmanship">
              <i class="el-icon-finished"></i>
              <span slot="title">答题技巧</span>
            </el-menu-item>
            <el-menu-item index="erDrill">
              <i class="el-icon-edit"></i>
              <span slot="title">真题演练</span>
            </el-menu-item>
            <el-menu-item index="danxiangTupo">
              <i class="el-icon-discount"></i>
              <span slot="title">单项突破</span>
            </el-menu-item>
            <el-menu-item index="studentDanciList">
              <i class="el-icon-film"></i>
              <span slot="title">单词列表</span>
            </el-menu-item>
            <el-menu-item index="cuotuPhotomontage">
              <i class="el-icon-folder-delete"></i>
              <span slot="title">错题集锦</span>
            </el-menu-item>
            <!-- <el-menu-item index="speakExam">
              <i class="el-icon-microphone"></i>
              <span slot="title">口语考试</span>
            </el-menu-item> -->
            <el-menu-item index="subscribeList">
              <i class="el-icon-notebook-2"></i>
              <span slot="title">预约考试</span>
            </el-menu-item>
            <el-menu-item index="subscribeKaoshi">
              <i class="el-icon-s-management"></i>
              <span slot="title">我的预约</span>
            </el-menu-item>
            <el-menu-item index="gotoKaoshi">
              <i class="el-icon-edit-outline"></i>
              <span slot="title">无纸化考试</span>
            </el-menu-item>
            <el-menu-item index="dataFenxi">
              <i class="el-icon-s-data"></i>
              <span slot="title">数据分析</span>
            </el-menu-item>
            <el-menu-item index="chartAnalysis">
              <i class="el-icon-data-line"></i>
              <span slot="title">图表分析</span>
            </el-menu-item>
            <el-menu-item index="changePassword">
              <i class="el-icon-unlock"></i>
              <span slot="title">密码修改</span>
            </el-menu-item>
            <el-menu-item index="stucreateGongdan">
              <i class="el-icon-circle-plus-outline"></i>
              <span slot="title">问题反馈</span>
            </el-menu-item>
            <el-menu-item index="gongdanLlist">
              <i class="el-icon-document"></i>
              <span slot="title">问题列表</span>
            </el-menu-item>
            <el-menu-item index="aboutUs">
              <i class="el-icon-phone"></i>
              <span slot="title">联系我们</span>
            </el-menu-item>
          </el-menu>
          <!-- 教师侧边栏  -->
          <el-menu
            :default-active="activerouter"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#2A3542"
            text-color="#fff"
            active-text-color="#409EFF"
            :router="true"
            v-if="identity == 1"
            :unique-opened="true"
          >
            <el-menu-item index="statistics">
              <i class="el-icon-user-solid"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <!-- 班级管理（ 创建班级  班级列表  ） -->
            <el-submenu index="8">
              <template slot="title">
                <i class="el-icon-school"></i>
                <span>班级管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="teacherList">
                  <i class="el-icon-document"></i>教师列表
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <el-menu-item index="createClass">
                  <i class="el-icon-folder-add"></i>我的班级
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <el-menu-item index="classList">
                  <i class="el-icon-document"></i>学校班级
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!-- 学生管理（学生列表  ） -->
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-guide"></i>
                <span>学生管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="studentsList">
                  <i class="el-icon-tickets"></i>学生列表
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!-- 成绩分析 -->
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-s-marketing"></i>
                <span>成绩分析</span>
              </template>
              <!-- <el-menu-item-group>
                <el-menu-item index="yonghuStatistics">
                  <i class="el-icon-document-copy"></i>用户统计
                </el-menu-item>
              </el-menu-item-group> -->
              <el-menu-item-group>
                <el-menu-item index="kaoshiStatistics">
                  <i class="el-icon-tickets"></i>考试统计
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <el-menu-item index="cuotiStatistics">
                  <i class="el-icon-data-line"></i>图表统计
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!-- 我的试卷 -->
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-folder-opened"></i>
                <span>我的试卷</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="studentOrder">
                  <i class="el-icon-document"></i>学生预约
                </el-menu-item>
              </el-menu-item-group>
              <!-- <el-menu-item-group>
                <el-menu-item index="myPaper">
                  <i class="el-icon-edit-outline"></i>即来即考
                </el-menu-item>
              </el-menu-item-group> -->
            </el-submenu>
            <!-- 试卷管理。 -->
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-notebook-2"></i>
                <span>试卷管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="addPaper">
                  <i class="el-icon-plus"></i>新增试卷
                </el-menu-item>
                <el-menu-item index="zizhuzujuan">
                  <i class="el-icon-folder-checked"></i>自主组卷
                </el-menu-item>
                <el-menu-item index="fourAdd">
                  <i class="el-icon-circle-plus-outline"></i>四级新增
                </el-menu-item>
                <el-menu-item index="sixAdd">
                  <i class="el-icon-document-add"></i>六级新增
                </el-menu-item>
                <el-menu-item index="aAddPaper">
                  <i class="el-icon-folder-add"></i>A级新增
                </el-menu-item>
                <el-menu-item index="bAddPaper">
                  <i class="el-icon-first-aid-kit"></i>B级新增
                </el-menu-item>
                <el-menu-item index="otherPapers" disabled @mouseenter.native="open2">
                  <i class="el-icon-document"></i>其它试卷
                </el-menu-item>
                <el-menu-item index="paperList">
                  <i class="el-icon-receiving"></i>试卷列表
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!-- 题库列表 -->
            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-collection"></i>
                <span>题库列表</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="studentDanciList">
                  <i class="el-icon-film"></i>
                  <span slot="title">单词列表</span>
                </el-menu-item>
                <el-menu-item index="fourList">
                  <i class="el-icon-s-order"></i>四级题库
                </el-menu-item>
                <el-menu-item index="sixList">
                  <i class="el-icon-s-management"></i>六级题库
                </el-menu-item>
                <el-menu-item index="aList">
                  <i class="el-icon-document-copy"></i>A级题库
                </el-menu-item>
                <el-menu-item index="bList">
                  <i class="el-icon-folder-opened"></i>B级题库
                </el-menu-item>
                <el-menu-item index="questionList" disabled @mouseenter.native="open2">
                  <i class="el-icon-notebook-1"></i>其它题库
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!-- 售后管理  （创建工单  工单列表    关于我们） -->
            <el-submenu index="7">
              <template slot="title">
                <i class="el-icon-phone"></i>
                <span>售后管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="stucreateGongdan">
                  <i class="el-icon-circle-plus-outline"></i>创建工单
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <el-menu-item index="gongdanLlist">
                  <i class="el-icon-tickets"></i>工单列表
                </el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group>
                <el-menu-item index="aboutUs">
                  <i class="el-icon-phone-outline"></i>联系我们
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <!-- 个人中心（新增用户 用户列表 修改密码） -->
            <el-submenu index="6">
              <template slot="title">
                <i class="el-icon-s-custom"></i>
                <span>个人中心</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="changePsd">
                  <i class="el-icon-unlock"></i>修改密码
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 路由主体 -->
        <el-main>
          <!-- 子路由出口： -->
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
/* eslint-disable */
let that = this;
export default {
  data() {
    return {
      isblock: true,
      nickname: "",
      chhoolName: "",
      identity: "",
      currentMenu:'/statistics',
      activerouter: '',
    };
  },
  created() {
    this.nickname = localStorage.getItem("nickname");
    this.chhoolName = localStorage.getItem("school_name");
    this.identity = localStorage.getItem("identity");
  },
  computed: {},
  mounted() {
    //获取地址栏中的路由，设置elementui中的导航栏选中状态
    this.activerouter = this.$route.path.replace("/","");
    window.addEventListener('beforeunload', e => {
      // window.localStorage.removeItem('titleName')
      if(event.clientX>document.body.clientWidth && event.clientY < 0 || event.altKey){ 
        this.$http({
          header: ({'Content-Type': 'application/x-www-form-urlencodeed'}),
          method: 'POST',
          url: 'admin/Examination/closeBrowser',
          data: {},
          withCredentials: false,
        }).then((res) => {
          //  这里做登录拦截
          if (res.status === 200 && res.data.code === "1") {
            console.log("成功res:",res);
          } else {
            console.log("失败res",res);
          }
        });
      }else{
        console.log("你正在刷新页面");
      };
      console.log("调起来。。");
    });
    // window.onunload = function(){
    //   var a_n = window.event.screenX - window.screenLeft;
    //   var a_b = a_n > document.documentElement.scrollWidth-20;
    //   if(a_b && window.event.clientY< 0 || window.event.altKey){    
    //     this.$http({
    //       header: ({'Content-Type': 'application/x-www-form-urlencodeed'}),
    //       method: 'POST',
    //       url: 'admin/Examination/closeBrowser',
    //       data: {},
    //       withCredentials: false,
    //     }).then((res) => {
    //       //  这里做登录拦截
    //       if (res.status === 200 && res.data.code === "1") {
    //         console.log("成功res:",res);
    //       } else {
    //         console.log("失败res",res);
    //       }
    //     });
    //   }else{
    //     console.log('跳转或者刷新页面行为');
    //   } 
    // }
  },
  methods: {
    retract() {
      this.isblock == true ? (this.isblock = false) : (this.isblock = true);
      // this.isblock == true ? this.$refs.indexBox.style.margin-left : 0 :
      // console.log(this.$refs.indexBox)
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    async logout() {
      try {
        await this.$confirm("您是否确定退出?", "温馨提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        // 退出登录逻辑：
        this.$router.push("/");
        localStorage.removeItem("identity");
        localStorage.removeItem("id");
        localStorage.removeItem("school_name");
        localStorage.removeItem("school_id");
        localStorage.removeItem("nickname");
      } catch (e) {
        this.$message({
          type: "info",
          message: "已取消退出"
        });
      }
    },
    open2() {
      this.$notify({
        title: '提示',
        message: '您还未购买其它题库，请先行购买',
        duration: 2500,
        position: 'bottom-left',
        type: 'warning'
      });
    }
  }
};
</script>


<style lang="less">
@import url("../assets/css/index.less");
.about {
  // min-height: 100% !important;
  width: 100%;
  height: 100%;
  background-color: #2A3542;
  .index-box {
    height: 100%;
    padding-top: 60px;
    &.active {
      padding-left: 0;
    }
    .el-container {
      height: 100%;
    }
  }
}
.el-form-item--small .el-form-item__content,
.el-form-item--small .el-form-item__label {
  line-height: 40px;
  .el-form-item__content {
    padding-left: 120px !important;
  }
}
div.el-dialog {
  width: 100%;
  margin: 0;
  padding: 0;
  margin-top: 0 !important;
}
div.el-dialog__header {
  padding-left: 30px;
  padding-right: 30px;
  // padding-top: 20px;
}
div.el-dialog__footer {
  padding-left: 30px;
  padding-right: 30px;
}
div.el-dialog__body {
  padding: 10px 30px;
}
.header {
  position: absolute;
  top: 0;
  right: 140px;
  color: @theme;
  font-size: 14px;
}
.el-header,
.el-footer {
  background: #fff; /* fallback for old browsers */
  color: @theme;
  text-align: center;
  line-height: 60px;
  border-bottom: 2px solid @theme;
  padding-left: 0;
  width: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1;
  box-sizing: border-box;

}
.el-header .left {
  background-color: #2A3542;
  height: 60px;
  line-height: 60px;
  font-size: 14px;
  width: 180px;
  color: #fff;
  border-bottom: 2px solid #fff;
  box-sizing: border-box;
  img {
    height: 50px;
    width: 78px;
    margin-top: 5px;
    margin-left: 20px;
  }
}
.header-center {
  text-align: center;
  color: @theme;
  text-indent: -60px;
  font-size: 24px;
  font-family:cursive, Georgia, serif;
  font-weight: 700;
}
.el-aside {
  background-color: #fff;
  color: #000;
  text-align: center;
  overflow: hidden;
}
.el-main {
  background-color: #f8f8f8;
  color: #000;
  text-align: left;
  height: 100%;
  box-sizing: border-box;
}
.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}
.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.index-cebian {
  text-align: left;
  background-color: #2A3542;
  z-index: 10;
  overflow: auto;
  min-height: 100%;
}
.logout {
  color: @theme;
  position: absolute;
  right: 20px;
  top: 0;
  text-decoration: none;
  font-size: 12px;
  cursor: pointer;
}
.retract {
  height: 100%;
  margin-left: 20px;
  cursor: pointer;
  color: @theme;
  font-size: 20px;
}
.index-cebian .el-menu-item-group__title  {
  padding: 0;
}
.index-cebian .el-menu {
  border-right: none;
  .el-submenu .el-menu-item {
    height: 50px;
    line-height: 50px;
    padding: 0 45px;
    min-width: 180px;
  }
}
.el-menu-item.is-active {
  background-color: #fff !important;
}
.titleBox {
  .el-input--small .el-input__inner {
    height: 28px;
    border-radius: 2px;
  }
}
.el-menu-vertical-demo {
  overflow: hidden;
}
.el-dialog.cuotidialog {
  position: absolute;
  top: 10vh;
  right: 50%;
  transform: translateX(500px);
  overflow: auto;
  max-height: 80vh;
}
.el-dialog.mibile-cuotidialog {
  position: absolute;
  top: 10vh;
  // right: 50%;
  // transform: translateX(500px);
  overflow: auto;
  max-height: 80vh;
}
</style>
