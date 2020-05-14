<template>
  <div id="app" >
    <router-view />
  </div>
</template>
<script>
    export default {
        data() {
            return {
                lastTime: null, //最后一次点击的时间
                currentTime: null, //当前点击的时间
                timeOut: 30 * 60 * 1000 //设置超时时间： 30分钟
            };
        },
        methods: {
            isDo() {
                this.currentTime = new Date().getTime(); //记录这次点击的时间
                if(this.currentTime - this.lastTime > this.timeOut) {  //判断上次最后一次点击的时间和这次点击的时间间隔是否大于10分钟
                    // 这里写状态已过期后执行的操作
                    this.$router.push({name: "login",})
                     this.currentTime = new Date().getTime(); //记录这次点击的时间
                     this.lastTime = new Date().getTime();
                } else {
                    this.lastTime = new Date().getTime(); //如果在10分钟内点击，则把这次点击的时间记录覆盖掉之前存的最后一次点击的时间
                }
            }
        },
        created(){
            this.lastTime = new Date().getTime();   //网页第一次打开时，记录当前时间
        }
    }
</script>

<style>

</style>
<style scoped>
#app {
  height: 100%;
  width: 100%;
}
.el-dialog__wrapper.addDialog .el-dialog{
    margin:0 auto!important;
    margin-top:10%;
}
#app .aaa .el-dialog__wrapper{
    width: 80% !important;
}

</style>
