
var lastTime = new Date().getTime();
var currentTime = new Date().getTime();
var timeOut =0.1 * 60 * 1000; //设置超时时间： 30分
 
window.onload = function () {
    window.document.onmousedown = function () {
        localStorage.setItem("lastTime",new Date().getTime());
    }
};
function checkTimeout() {
    console.log(window.location.href)
   var aa =window.location.href.substr(window.location.href.length-1,1)
   console.log(window.location.href)
      if(aa !== "/"){
        console.log(window.location.href)
    currentTime = new Date().getTime(); //更新当前时间
    lastTime = localStorage.getItem("lastTime");
    console.log(currentTime - lastTime);
    console.log(timeOut);
    if (currentTime - lastTime > timeOut) { //判断是否超时
        console.log("超时");
        var url = window.location.href;
        var newUrl=url.match(/(\S*)#/)[1];
        window.open(newUrl + '#/','_self');
    }
   
   }
}
 
window.setInterval(checkTimeout, 1000);