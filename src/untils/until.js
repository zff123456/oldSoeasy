// console.log("引入关闭浏览器文件。");
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


// 阻止浏览器刷新关闭
// var UnloadConfirm = {};
// UnloadConfirm.MSG_UNLOAD = "数据尚未保存，离开后可能会导致数据丢失\n\n您确定要离开吗？";
// UnloadConfirm.set = function(a) {
//   window.onbeforeunload = function(b) {
//     b = b || window.event;
//     b.returnValue = a;
//     return a
//   }
// };
// UnloadConfirm.clear = function() {
//     fckDraft.delDraftById();
//     window.onbeforeunload = function() {}
// };
// UnloadConfirm.set(UnloadConfirm.MSG_UNLOAD);