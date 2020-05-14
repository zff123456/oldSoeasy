/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui"; // 引入elementui
import "element-ui/lib/theme-chalk/index.css"; // 引入element ui样式
Vue.config.productionTip = false;
import "./assets/css/index.css"; // 公共样式
Vue.use(ElementUI, { size: "small", zIndex: 2000 });
import axios from "axios";
Vue.prototype.$http = axios;
// axios.defaults.baseURL = "http://127.0.0.1:90/";
// axios.defaults.baseURL = "http://127.0.0.1/";
// axios.defaults.baseURL = "http://192.168.1.102/";
axios.defaults.baseURL = "http://ruanjian.chinadingao.com/"; //线上
axios.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded";
// axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
import "./config/global.js"; // 引全局路径
import "./untils/until.js"; // 引入关闭浏览器事件
import moment from "moment"; // 时间处理插件

import VueQuillEditor from "vue-quill-editor"; // 引入富文本编辑器
import "quill/dist/quill.core.css"; // 引入富文本编辑器
import "quill/dist/quill.snow.css"; // 引入富文本编辑器
import "quill/dist/quill.bubble.css"; // 引入富文本编辑器

import Vant from 'vant'; // 手机端组件库
import 'vant/lib/index.css'; // 手机端组件库
Vue.use(Vant);

Vue.use(VueQuillEditor);
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
// 导航守卫
router.beforeEach((to, from, next) => {
    if (to.path === "/login") {
        next();
        return;
    }
    const user = localStorage.getItem("identity");
    if (user) {
        // 登录
        next();
    } else {
        // 没有登录
        this.$router.push({ name: "login" });
    }
});
// 请求拦截器
// axios.interceptors.request.use(config => {
//   const identity = localStorage.getItem('identity');
//   if (!identity) {
//     this.$message({ message: res.data.info,type: "error",duration: 3000});
//     this.$router.push({ name: "login" });
//   }
//   return config
// });
Vue.filter('time', function(value, formatString) { //挂载全局 时间格式化 过滤器  
    if (value == 0) {
        return '无时间限制'
    } else {
        formatString = formatString || 'YYYY年MM月DD日 HH:mm';
        return moment.unix(value).format(formatString); // 时间戳转时间
    }
});

// window.onbeforeunload = function() {
//   //鼠标相对于用户屏幕的水平位置 - 窗口左上角相对于屏幕左上角的水平位置 = 鼠标在当前窗口上的水平位置
//   var n = window.event.screenX - window.screenLeft;
//   //鼠标在当前窗口内时，n<m，b为false；鼠标在当前窗口外时，n>m，b为true。20这个值是指关闭按钮的宽度
//   var b = n > document.documentElement.scrollWidth-20;
//   //鼠标在客户区内时，window.event.clientY>0；鼠标在客户区外时，window.event.clientY<0
//   if(b && window.event.clientY < 0 || window.event.altKey || window.event.ctrlKey){
//   　    　    //关闭浏览器时你想做的事
//       alert("关闭");
//   }else if(event.clientY > document.body.clientHeight || event.altKey){
//   　　        //刷新浏览器时你想做的事
//       alert("刷新");
//   }
// }