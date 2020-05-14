/* eslint-disable */
import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
import login from "./views/login.vue"; // 登陆页
import index from "./views/index.vue"; // pc端首页
import mobileIndex from "./views/mobileIndex.vue"; // 移动端首页
import teacherMobileIndex from "./views/teacherMobileIndex.vue"; // 移动端教师版首页
// 手机端四种考试
import cuotileixing from "./views/mobile/cuotileixing"; // 错题类型
import defaultPage from "./views/mobile/defaultPage"; // 手机端首页
import mobileAkaoshi from "./views/mobile/mobile-a-kaoshi"; // 手机端A
import mobileBkaoshi from "./views/mobile/mobile-b-kaoshi"; // 手机端B
import mobileFourkaoshi from "./views/mobile/mobile-four-kaoshi"; // 手机端四
import mobileSixkaoshi from "./views/mobile/mobile-six-kaoshi"; // 手机端六
import mobilePaperList from "./views/mobile/mobilePaperList"; // 移动端试卷
const mobileCheckMima = () =>
    import ("@/views/mobile/mobileCheckMima"); // 修改密码
const mobileAboutas = () =>
    import ("@/views/mobile/mobileAboutas"); // 联系我们
const mobildWordsList = () =>
    import ("@/views/mobile/mobildWordsList"); // 单词学习
const mobileBreakThrough = () =>
    import ("@/views/mobile/mobileBreakThrough"); // 单项突破
const mobileDataFenxi = () =>
    import ("@/views/mobile/mobileDataFenxi"); // 数据分析
const mobileGokaoshi = () =>
    import ("@/views/mobile/mobilegokaoshi"); // 无纸化考试
    const mobileFourwu= () =>
    import ("@/views/mobile/mobile-four-wu"); // 无纸化考试
    const mobileSixwu = () =>
    import ("@/views/mobile/mobile-six-wu"); // 无纸化考试
const mobileCuoti = () =>
    import ("@/views/mobile/mobileCuoti"); // 手机端错题
const mobileCharts = () =>
    import ("@/views/mobile/mobileCharts"); // 手机学生端图表
// 教师学生端都有的
import statistics from "./views/all/statistics/statistics"; // 首页页面
import bar from "./views/all/statistics/echarts/bar"; // 竖状表
import line from "./views/all/statistics/echarts/line"; // 折线状表
// 教师端
//班级管理（ 创建班级  班级列表  ）
const createClass = () =>
    import ("@/views/teacher/classsMange/createClass"); // 创建班级
const classList = () =>
    import ("@/views/teacher/classsMange/classList"); // 班级列表
const studentListMange = () =>
    import ("@/views/teacher/classsMange/studentListMange"); // 学生转移列表
const teacherStuList = () =>
    import ("@/views/teacher/classsMange/teacherStuList"); // 学校班级学生转移列表
const teacherList = () =>
    import ("@/views/teacher/classsMange/teacherList"); // 教师列表
//   // 学生管理
const studentsList = () =>
    import ("@/views/teacher/studentMange/studentsList"); // 学生列表
// //成绩分析
const yonghuStatistics = () =>
    import ("@/views/teacher/achievementFenxi/yonghuStatistics"); // 用户统计
const kaoshiStatistics = () =>
    import ("@/views/teacher/achievementFenxi/kaoshiStatistics"); // 考试统计
const cuotiStatistics = () =>
    import ("@/views/teacher/achievementFenxi/cuotiStatistics"); // 错题统计
// //学生预约
const studentOrder = () =>
    import ("@/views/teacher/mayPaper/studentOrder"); // 学生预约
const myPaper = () =>
    import ("@/views/teacher/mayPaper/myPaper"); // 即来即考
const studentYuyueList = () =>
    import ("@/views/teacher/mayPaper/studentYuyueList"); // 查看预约列表
// //售后管理
const createGongdan = () =>
    import ("@/views/teacher/shouhouManagement/createGongdan"); // 创建工单
const gongdanList = () =>
    import ("@/views/teacher/shouhouManagement/gongdanList"); // 工单列表
const aboutUs = () =>
    import ("@/views/teacher/shouhouManagement/aboutUs"); // 关于我们
// //试卷管理
const addPaper = () =>
    import ("@/views/teacher/paperManage/addPaper"); // 新增试卷  zizhuzujuan
const ziZhuzujuan = () =>
    import ("@/views/teacher/paperManage/zizhuzujuan"); // 自主组卷
const fourAdd = () =>
    import ("@/views/teacher/paperManage/fourAdd"); // 四级试卷
const sixAdd = () =>
    import ("@/views/teacher/paperManage/sixAdd"); // 六级试卷
const aAddPaper = () =>
    import ("@/views/teacher/paperManage/aAddPaper"); // A级试卷
const bAddPaper = () =>
    import ("@/views/teacher/paperManage/bAddPaper"); // B级试卷
const otherPapers = () =>
    import ("@/views/teacher/paperManage/otherPapers"); // 其它试卷
const paperList = () =>
    import ("@/views/teacher/paperManage/paperList"); // 试卷列表
// //题库列表
const questionList = () =>
    import ("@/views/teacher/questionList/questionList"); // 其它列表
const fourList = () =>
    import ("@/views/teacher/questionList/fourList"); // 四级列表
const sixList = () =>
    import ("@/views/teacher/questionList/sixList"); // 六级列表
const aList = () =>
    import ("@/views/teacher/questionList/aList"); // A级列表
const bList = () =>
    import ("@/views/teacher/questionList/bList"); // B级列表
//  //个人中心
const personAddUser = () =>
    import ("@/views/teacher/personalCenter/personAddUser"); // 新增用户
const personUserList = () =>
    import ("@/views/teacher/personalCenter/personUserList"); // 用户列表
const changePsd = () =>
    import ("@/views/teacher/personalCenter/changePsd"); // 修改密码
// 学生端
const workmanship = () =>
    import ("@/views/student/workmanship"); // 答题技巧
const speakExam = () =>
    import ("@/views/student/speakExam"); // 口语考试
const changePassword = () =>
    import ("@/views/student/changePassword"); // 修改密码
const stucreateGongdan = () =>
    import ("@/views/student/stucreateGongdan"); // 创建工单
const gongdanLlist = () =>
    import ("@/views/student/gongdanLlist"); // 工单列表
const danxiangTupo = () =>
    import ("@/views/student/danxiangTupo"); // 单项突破
const erDrill = () =>
    import ("@/views/student/erDrill"); // 真题演练
const subscribeKaoshi = () =>
    import ("@/views/student/subscribeKaoshi"); // 预约考试
const subscribeList = () =>
    import ("@/views/student/subscribeList"); // 预约列表
const gotoKaoshi = () =>
    import ("@/views/student/gotoKaoshi"); // 即来即考
const cuotuPhotomontage = () =>
    import ("@/views/student/cuotuPhotomontage"); // 错题集锦
const dataFenxi = () =>
    import ("@/views/student/dataFenxi"); // 数据分析
const chartAnalysis = () =>
    import ("@/views/student/chartAnalysis"); // 图表分析
const abPaperList = () =>
    import ("@/views/student/abPaperList"); // 试卷列表
const studentDanciList = () =>
    import ("@/views/student/studentDanciList"); // 学生端单词列表
const fourKaoshi = () =>
    import ("@/views/student/gotoKaoshii/fourKaoshi"); // 四级考试
const sixKaoshi = () =>
    import ("@/views/student/gotoKaoshii/sixKaoshi"); // 六级考试
const aKaoshi = () =>
    import ("@/views/student/gotoKaoshii/aKaoshi"); // A级考试
const bKaoshi = () =>
    import ("@/views/student/gotoKaoshii/bKaoshi"); // B级考试
// 无纸化考试
 const fourKaos = () =>
    import ("@/views/student/fourkaos"); // 四级考试
 const sixKaos = () =>
    import ("@/views/student/sixkaos"); // 六级考试
    // const fourKaos = () =>
    // import ("@/views/student/fourkaos"); // 四级考试
// 手机端教师版
const teacherdefault = () =>
    import ("@/views/teacherMobile/teacherdefault"); // 手机端教师版首页
const tecChengjiChart = () =>
    import ("@/views/teacherMobile/tecChengjiChart"); // 手机端教师版首页
const paperYulan = () =>
    import ("@/views/teacherMobile/paperYulan"); // 手机端教师版试卷类型
const mobileStuList = () =>
    import ("@/views/teacherMobile/mobileStuList"); // 手机端教师版学生列表
const mobileTeacherList = () =>
    import ("@/views/teacherMobile/mobileTeacherList"); // 手机端教师列表
const mobileMyclass = () =>
    import ("@/views/teacherMobile/mobileMyclass"); // 手机端我的班级
const myClassStudentList = () =>
    import ("@/views/teacherMobile/myClassStudentList"); // 手机端我的班级下的学生列表
const schoolClassList = () =>
    import ("@/views/teacherMobile/schoolClassList"); // 手机端学校班级列表
const schoolClassStuList = () =>
    import ("@/views/teacherMobile/schoolClassStuList"); // 手机端学校班级下的学生列表
const mobilchangePassword = () =>
    import ("@/views/teacherMobile/mobilchangePassword"); // 修改密码
const mobileStatistics = () =>
    import ("@/views/teacherMobile/mobileStatistics"); // 手机端成绩分析
export default new Router({
    mode: "hash",
    base: process.env.BASE_URL,
    routes: [{
            path: "/",
            name: "login",
            component: login
        },
        {
            path: "/mobileIndex",
            name: "mobileIndex",
            component: mobileIndex,
            redirect: { name: "defaultPage" },
            children: [
                { path: "/defaultPage", name: "defaultPage", component: defaultPage },
                { path: "/mobile-a-kaoshi", name: "mobile-a-kaoshi", component: mobileAkaoshi },
                { path: "/mobile-b-kaoshi", name: "mobile-b-kaoshi", component: mobileBkaoshi },
                { path: "/mobile-four-kaoshi", name: "mobile-four-kaoshi", component: mobileFourkaoshi },
                { path: "/mobile-four-wu", name: "mobile-four-wu", component: mobileFourwu },
                { path: "/mobile-six-wu", name: "mobile-six-wu", component: mobileSixwu },
                { path: "/mobile-six-kaoshi", name: "mobile-six-kaoshi", component: mobileSixkaoshi },
                { path: "/mobilePaperList", name: "mobilePaperList", component: mobilePaperList },
                { path: "/cuotileixing", name: "cuotileixing", component: cuotileixing },
                { path: "/mobileCheckMima", name: "mobileCheckMima", component: mobileCheckMima },
                { path: "/mobileAboutas", name: "mobileAboutas", component: mobileAboutas },
                { path: "/mobildWordsList", name: "mobildWordsList", component: mobildWordsList },
                { path: "/mobileBreakThrough", name: "mobileBreakThrough", component: mobileBreakThrough },
                { path: "/mobileDataFenxi", name: "mobileDataFenxi", component: mobileDataFenxi },
                { path: "/mobileCuoti", name: "mobileCuoti", component: mobileCuoti },
                { path: "/mobileCharts", name: "mobileCharts", component: mobileCharts },
                { path: "/mobilegokaoshi", name: "mobilegokaoshi", component: mobileGokaoshi },
            ]
        },
        {
            path: "/teacherMobileIndex",
            name: "teacherMobileIndex",
            component: teacherMobileIndex,
            redirect: { name: "teacherdefault" },
            children: [
                { path: "/teacherdefault", name: "teacherdefault", component: teacherdefault },
                { path: "/tecChengjiChart", name: "tecChengjiChart", component: tecChengjiChart },
                { path: "/paperYulan", name: "paperYulan", component: paperYulan },
                { path: "/mobileStuList", name: "mobileStuList", component: mobileStuList },
                { path: "/mobileTeacherList", name: "mobileTeacherList", component: mobileTeacherList },
                { path: "/mobileMyclass", name: "mobileMyclass", component: mobileMyclass },
                { path: "/myClassStudentList", name: "myClassStudentList", component: myClassStudentList },
                { path: "/schoolClassList", name: "schoolClassList", component: schoolClassList },
                { path: "/schoolClassStuList", name: "schoolClassStuList", component: schoolClassStuList },
                { path: "/mobilchangePassword", name: "mobilchangePassword", component: mobilchangePassword },
                { path: "/mobileStatistics", name: "mobileStatistics", component: mobileStatistics }
            ]
        },
        {
            path: "/index",
            name: "index",
            component: index,
            redirect: { name: "statistics" },
            children: [
                // 学生端教师端都有的
                {
                    path: "/statistics",
                    name: "statistics",
                    component: statistics,
                    children: [
                        { path: "/bar", name: "bar", component: bar },
                        { path: "/line", name: "line", component: line }
                    ]
                },
                // 教师端路由
                //  //班级管理
                { path: "/createClass", name: "createClass", component: createClass },
                { path: "/classList", name: "classList", component: classList },
                { path: "/studentListMange", name: "studentListMange", component: studentListMange },
                { path: "/teacherList", name: "teacherList", component: teacherList },
                //  //学生管理
                { path: "/studentsList", name: "studentsList", component: studentsList },
                { path: "/teacherStuList", name: "teacherStuList", component: teacherStuList },
                //  //成绩分析
                { path: "/yonghuStatistics", name: "yonghuStatistics", component: yonghuStatistics },
                { path: "/kaoshiStatistics", name: "kaoshiStatistics", component: kaoshiStatistics },
                { path: "/cuotiStatistics", name: "cuotiStatistics", component: cuotiStatistics },
                //  //我的试卷
                { path: "/studentOrder", name: "studentOrder", component: studentOrder },
                { path: "/myPaper", name: "myPaper", component: myPaper },
                { path: "/studentYuyueList", name: "studentYuyueList", component: studentYuyueList },
                //  //售后管理
                { path: "/createGongdan", name: "createGongdan", component: createGongdan },
                { path: "/gongdanList", name: "gongdanList", component: gongdanList },
                { path: "/aboutUs", name: "aboutUs", component: aboutUs },
                //  //试卷管理
                { path: "/addPaper", name: "addPaper", component: addPaper },
                { path: "/zizhuzujuan", name: "zizhuzujuan", component: ziZhuzujuan },
                { path: "/fourAdd", name: "fourAdd", component: fourAdd },
                { path: "/sixAdd", name: "sixAdd", component: sixAdd },
                { path: "/aAddPaper", name: "aAddPaper", component: aAddPaper },
                { path: "/bAddPaper", name: "bAddPaper", component: bAddPaper },
                { path: "/otherPapers", name: "otherPapers", component: otherPapers },
                { path: "/paperList", name: "paperList", component: paperList },
                //  //题库列表
                { path: "/questionList", name: "questionList", component: questionList },
                { path: "/fourList", name: "fourList", component: fourList },
                { path: "/sixList", name: "sixList", component: sixList },
                { path: "/aList", name: "aList", component: aList },
                { path: "/bList", name: "bList", component: bList },
                // //个人中心
                { path: "/personAddUser", name: "personAddUser", component: personAddUser },
                { path: "/personUserList", name: "personUserList", component: personUserList },
                { path: "/changePsd", name: "changePsd", component: changePsd },
                // 学生端路由
                { path: "/changePassword", name: "changePassword", component: changePassword },
                { path: "/stucreateGongdan", name: "stucreateGongdan", component: stucreateGongdan },
                { path: "/gongdanLlist", name: "gongdanLlist", component: gongdanLlist },
                { path: "/danxiangTupo", name: "danxiangTupo", component: danxiangTupo },
                { path: "/erDrill", name: "erDrill", component: erDrill },
                { path: "/subscribeKaoshi", name: "subscribeKaoshi", component: subscribeKaoshi },
                { path: "/gotoKaoshi", name: "gotoKaoshi", component: gotoKaoshi },
                { path: "/subscribeList", name: "subscribeList", component: subscribeList },
                { path: "/cuotuPhotomontage", name: "cuotuPhotomontage", component: cuotuPhotomontage },
                { path: "/dataFenxi", name: "dataFenxi", component: dataFenxi },
                { path: "/abPaperList", name: "abPaperList", component: abPaperList },
                { path: "/chartAnalysis", name: "chartAnalysis", component: chartAnalysis },
                { path: "/speakExam", name: "speakExam", component: speakExam },
                { path: "/studentDanciList", name: "studentDanciList", component: studentDanciList },
                // 前往考试。
                { path: "/fourKaoshi", name: "fourKaoshi", component: fourKaoshi },
                { path: "/fourkaos", name: "fourkaos", component: fourKaos },
                { path: "/sixkaos", name: "sixkaos", component: sixKaos },
                { path: "/sixKaoshi", name: "sixKaoshi", component: sixKaoshi },
                { path: "/aKaoshi", name: "aKaoshi", component: aKaoshi },
                { path: "/bKaoshi", name: "bKaoshi", component: bKaoshi },
                { path: "/workmanship", name: "workmanship", component: workmanship }
            ]
        }
    ]
});