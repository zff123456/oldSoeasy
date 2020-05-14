<template>
  <div class="login">
    <div class="title-img" v-if="ismobile == false"><img src="../assets/20190714101041.png" alt=""></div>
    <div class="form_box">
      <!-- 学生登录表单 -->
        <div class="student-form" v-if="identity == 1">
          <div class="title">学生登录</div>
          <!-- <el-button type="text" @click="flag == true? check():dialogFormVisible = true" class="register" v-if="ismobile == false">点击登录教师账号</el-button> -->
          <el-button type="text" @click="flag == true? check():dialogFormVisible = true" class="register">点击登录教师账号</el-button>
          <el-input
            placeholder="请输入账号"
            v-model="stuForm.name"
            clearable
            class="input"
            prefix-icon="el-icon-user-solid"
            validate-event
          ></el-input>
          <el-input
            placeholder="请输入密码"
            v-model="stuForm.psw"
            show-password
            class="input"
            prefix-icon="el-icon-lock"
          ></el-input>
          <el-input
            placeholder="请输入验证码"
            v-model="verifyNum"
            clearable
            class="input"
            prefix-icon="el-icon-key"
            style="width: 156px;"
          ></el-input>
          <div class="code" @click="refreshCode">
            <Sidentify :identifyCode="identifyCode"></Sidentify>
          </div>
          <el-button type="primary" @click="onSubmit" class="login_btn">登录账号</el-button>
          <el-button
            type="success"
            class="login_btn fr"
            @click="studentRegister = true"
          >注册账号</el-button>
          <el-button type="warning" class="login_btn fr" v-if="isIphon == false" style="margin: 0;padding: 0;margin-top:10px">
            <a :href="downloadUrl" style="color:#fff;width: 100%;display: block;height: 30px;line-height: 30px;" >下载安卓版SoEasy</a>
          </el-button>
        </div>
        <!-- 教师登录表单 -->
        <div class="student-form" v-if="identity == 2">
          <div class="title">教师登录</div>
          <el-button type="text"  class="register" @click="check">点击登录学生账号</el-button>
          <el-input
            placeholder="请输入账号"
            v-model="teachForm.name"
            clearable
            class="input"
            prefix-icon="el-icon-user-solid"
            validate-event
          ></el-input>
          <el-input
            placeholder="请输入密码"
            v-model="teachForm.psw"
            show-password
            class="input"
            prefix-icon="el-icon-lock"
          ></el-input>
          <el-input
            placeholder="请输入验证码"
            v-model="verifyNum"
            clearable
            class="input"
            prefix-icon="el-icon-key"
          ></el-input>
          <div class="code" @click="refreshCode">
            <Sidentify :identifyCode="identifyCode"></Sidentify>
          </div>
          <el-button type="primary" @click="teacherSubmit" class="login_btn">登录账号</el-button>
          <el-button type="success" class="login_btn fr" @click="teacherRegister = true">注册账号</el-button>
        </div>
      <!-- 填入密匙 -->
      <el-dialog title="密匙：" :visible.sync="dialogFormVisible" class="dialog" style="width:330px;margin-top: 30vh;">
        <el-input placeholder="请输入密匙" v-model="input" show-password></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="postMishi">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 学生账号注册表单 -->
      <el-dialog title="注册学生账号" :visible.sync="studentRegister" class="dialog stu-dialog" style="width:320px" :class="ismobile == true? 'phone-class': ''">
        <el-select
          v-model="sheng"
          placeholder="请选择省份"
          style="width:260px;"
          @change="changeShengfen"
        >
          <el-option v-for="item in shengList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="chengshi" placeholder="请选择城市" style="width:260px;" @change="changeCity">
          <el-option
            v-for="item in chengshiList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select v-model="school" placeholder="请选择学校" style="width:260px;" @change="changeSchool">
          <el-option
            v-for="item in schoolList"
            :key="item.id"
            :label="item.school_name"
            :value="[item.id,item.school_name]"
          ></el-option>
        </el-select>
        <el-select
          v-model="tracher"
          placeholder="请选择教师"
          style="width:260px;"
          @change="changeTeacher"
        >
          <el-option
            v-for="item in tracherList"
            :key="item.id"
            :label="item.nickname"
            :value="[item.id,item.nickname]"
          ></el-option>
        </el-select>
        <el-select v-model="classes" placeholder="请选择班级" style="width:260px;">
          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.class_name"
            :value="[item.id,item.class_name]"
          ></el-option>
        </el-select>
        <el-input
          style="width:260px;margin-top:10px"
          placeholder="请输入真实姓名"
          v-model="stuRegister.name"
          clearable
        ></el-input>
        <el-input
          style="width:260px;margin-top:10px"
          placeholder="请输入账号"
          v-model="stuRegister.account"
          clearable
        ></el-input>
        <el-input
          style="width:260px;margin-top:10px"
          placeholder="请输入密码"
          v-model="stuRegister.psw"
          clearable
          show-password
        ></el-input>
        <el-input
          style="width:260px;margin-top:10px"
          placeholder="请确认密码"
          v-model="stuRegister.affirmPsw"
          clearable
          show-password
          @blur="teaConfirmPsd"
        ></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="studentRegister = false">取 消</el-button>
          <el-button type="primary" @click="zhuceStudent" :loading="btnLogin">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 教师账号注册表单 -->
      <el-dialog title="注册教师账号" :visible.sync="teacherRegister" class="dialog stu-dialog" style="">
        <el-select
          v-model="sheng"
          placeholder="请选择省份"
          style="width:280px;"
          @change="changeShengfen"
        >
          <el-option v-for="item in shengList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="chengshi" placeholder="请选择城市" style="width:280px;" @change="changeCity">
          <el-option
            v-for="item in chengshiList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select v-model="school" placeholder="请选择学校" style="width:280px;">
          <el-option
            v-for="item in schoolList"
            :key="item.id"
            :label="item.school_name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-input
          style="width:280px;margin-top:10px"
          placeholder="请输入真实姓名"
          v-model="teachRegister.name"
          clearable
        ></el-input>
        <el-input
          style="width:280px;margin-top:10px"
          placeholder="请输入账号"
          v-model="teachRegister.account"
          clearable
          minlength="6"
          maxlength="20"
        ></el-input>
        <el-input
          style="width:280px;margin-top:10px"
          placeholder="请输入密码"
          v-model="teachRegister.psw"
          clearable
          show-password
        ></el-input>
        <el-input
          style="width:280px;margin-top:10px"
          placeholder="请确认密码"
          v-model="teachRegister.affirmPsw"
          clearable
          show-password
          @blur="teaConfirmPsd"
        ></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="teacherRegister = false">取 消</el-button>
          <el-button type="primary" @click="zhuceTeacher" :loading="btnLogin">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import qs from "qs";
import Sidentify from "../components/identify";
export default {
  components: {
    Sidentify
  },
  data() {
    return {
      teacherRegister: false,
      studentRegister: false,
      input: "",
      dialogFormVisible: false,
      flag: false,
      identity: 1,
      islogin: false,
      identifyCodes: "1234567890",
      identifyCode: "",
      verifyNum: "",
      stuForm: {
        // 学生登录表单
        name: "",
        psw: ""
      },
      stuRegister: {
        name: "",
        account: "",
        psw: "",
        affirmPsw: ""
      },
      teachForm: {
        // 教师登录表单
        name: "",
        psw: ""
      },
      teachRegister: {
        name: "",
        account: "",
        psw: "",
        affirmPsw: ""
      },
      shengList: [],
      chengshiList: [],
      schoolList: [],
      tracherList: [],
      classList: [],
      sheng: "",
      chengshi: "",
      school: "",
      tracher: "",
      classes: "",
      school_name: "",
      school_id: "",
      teacher_id: "",
      teacher_name: "",
      class_id: "",
      class_name: "",
      btnLogin: false,
      ismobile: false, // 判断是否是手机
      downloadUrl: '',
      isIphon: false,
    };
  },
  created: function() {
    this.isMobile();
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
    this.downloadUrl = `${BASE_URL}admin/index/download`;
    this.getShengshi();
  },
  methods: {
    async getShengshi() {// 获取省市
      const res = await this.$http.post(
        "admin/login/citylst",
        qs.stringify({ parent_id: 0 })
      );
      if (res.status === 200 && res.data.code === "1") {
        this.shengList = res.data.info;
      }
    },
    changeShengfen() {
      // 省市值发生改变
      this.chengshi = "";
      this.school = "";
      this.tracher = "";
      this.classes = "";
      this.getCity();
    },
    changeCity() {
      // 城市值发生改变
      this.school = "";
      this.tracher = "";
      this.classes = "";
      this.getSchool();
    },
    changeSchool() {
      // 学校值发生改变
      this.tracher = "";
      this.classes = "";
      this.getTeacher();
    },
    changeTeacher() {
      // 教师值发生改变
      this.classes = "";
      this.getClass();
    },
    async getCity() {
      // 获取城市
      const res = await this.$http.post(
        "admin/login/citylst",
        qs.stringify({ parent_id: this.sheng })
      );
      if (res.status === 200 && res.data.code === "1") {
        this.chengshiList = res.data.info;
        console.log("chengshi::,", res.data.info);
      }
    },
    async getSchool() {
      // 获取学校
      const res = await this.$http.post(
        "admin/login/schoollst",
        qs.stringify({ city: this.chengshi })
      );
      if (res.status === 200 && res.data.code === "1") {
        this.schoolList = res.data.info;
      }
    },
    async getTeacher() {
      // 获取教师
      this.school_id = this.school[0];
      const res = await this.$http.post(
        "admin/login/teacherlst",
        qs.stringify({ school_id: this.school_id })
      );
      if (res.status === 200 && res.data.code === "1") {
        this.tracherList = res.data.info;
      }
      console.log(res.data);
      // console.log(this.school[0])
    },
    async getClass() {
      // 获取班级
      this.teacher_id = this.tracher[0];
      const res = await this.$http.post(
        "admin/login/classlst",
        qs.stringify({ teacher_id: this.teacher_id })
      );
      console.log("s::,", res);
      if (res.status === 200 && res.data.code === "1") {
        this.classList = res.data.info;
      }
    },
    async onSubmit() {
      this.btnLogin = true;
      // 点击登录
      if (this.stuForm.name == "") {
        this.$message({
          message: "请输入账号",
          type: "error",
          duration: 2000
        });
        this.btnLogin = false;
        return false;
      }
      if (this.stuForm.psw == "") {
        this.$message({
          message: "请输入密码",
          type: "error",
          duration: 2000
        });
        this.btnLogin = false;
        return false;
      }
      if (this.identifyCode !== this.verifyNum) {
        this.$message({ message: "验证码错误", type: "error", duration: 2000 });
        this.verifyNum = "";
        this.refreshCode();
        this.btnLogin = false;
        return false;
      }
      const res = await this.$http.post(
        "admin/teacher/studentlogin",
        qs.stringify({ name: this.stuForm.name, password: this.stuForm.psw })
      );
      if (res.status === 200 && res.data.code === "1") {
        // document.cookie = 'isLogin=123';
        console.log(res);
        
        localStorage.setItem("id", res.data.info.data.id); // 教师id
        localStorage.setItem("identity", res.data.info.data.identity); // 身份
        localStorage.setItem("school_id", res.data.info.data.school_id); // 学校id
        localStorage.setItem("school_name", res.data.info.data.school_name); // 学校名称
        localStorage.setItem("nickname", res.data.info.data.nickname); // 用户名称
        this.btnLogin = false;
        if (this.ismobile == false){
          this.$router.push({ name: "index" });
        } else {
          this.$router.push({ name: "mobileIndex" });
        }
      } else {
        this.$message({ message: res.data.info, type: "error", duration: 3000});
        this.btnLogin = false;
        this.refreshCode();
      }
    },
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
    },
    async postMishi() {
      // 提交密匙
      const res = await this.$http.post(
        "admin/teacher/verificationkey",
        qs.stringify({ key: this.input })
      );
      if (res.status === 200 && res.data.code === "1") {
        this.input = "";
        this.dialogFormVisible = false;
        this.identity = 2;
        this.flag = true;
      } else {
        this.$message({
          message: "密匙验证失败",
          type: "error",
          duration: 3000
        });
      }
    },
    async teacherSubmit() {
      // 教师登录
      this.btnLogin = true;
      if (this.teachForm.name == "") {
        this.$message({
          message: "账号不能为空",
          type: "warning",
          duration: 2000
        });
        this.btnLogin = false;
        return false;
      }
      if (this.teachForm.psw == "") {
        this.$message({
          message: "密码不能为空",
          type: "warning",
          duration: 2000
        });
        this.btnLogin = false;
        return false;
      }
      if (this.verifyNum != this.identifyCode) {
        this.$message({
          message: "验证码不正确",
          type: "warning",
          duration: 2000
        });
        this.btnLogin = false;
        return false;
      }
      const res = await this.$http.post(
        "admin/teacher/teacherlogin",
        qs.stringify({
          name: this.teachForm.name,
          password: this.teachForm.psw
        })
      );
      if (res.status === 200 && res.data.code === "1") {
        console.log(res)
        localStorage.setItem("id", res.data.info.data.id); // 教师id
        localStorage.setItem("identity", res.data.info.data.identity); // 身份
        localStorage.setItem("school_name", res.data.info.data.school_name); // 学校名称
        localStorage.setItem("school_id", res.data.info.data.school_id); // 学校id
        localStorage.setItem("nickname", res.data.info.data.nickname); // 用户名称
        this.btnLogin = false;
        if (this.ismobile == false){
          this.$router.push({ name: "index" });
        } else {
          this.$router.push({ name: "teacherMobileIndex" });
        }
      } else {
        this.refreshCode();
        this.teachForm.name = "";
        this.teachForm.psw = "";
        this.verifyNum = "";
        this.btnLogin = false;
        this.$message({ message: res.data.info, type: "error", duration: 3000 });
      }
    },
    teaConfirmPsd() {
      // 注册账号确认密码
      if (this.teachRegister.affirmPsw.replace(/\s*/g,"") != this.teachRegister.psw.replace(/\s*/g,"")) {
        this.$message({
          message: "确认密码与填写密码不同",
          type: "error",
          duration: 3000
        });
        this.teachRegister.affirmPsw = "";
      }
      if (this.stuRegister.affirmPsw.replace(/\s*/g,"") != this.stuRegister.psw.replace(/\s*/g,"")) {
        this.$message({
          message: "确认密码与填写密码不同",
          type: "error",
          duration: 3000
        });
        this.stuRegister.affirmPsw = "";
      }
    },
    async zhuceTeacher() {
      // 注册教师账号
      this.btnLogin = true;
      if (this.sheng == "") {
        this.$message({
          message: "请选择省份",
          type: "warning",
          duration: 2000
        });
        this.btnLogin = false;
        return false;
      }
      if (this.chengshi == "") {
        this.$message({
          message: "请选择城市",
          type: "warning",
          duration: 2000
        });
        this.btnLogin = false;
        return false;
      }
      if (this.school == "") {
        this.$message({
          message: "请选择学校",
          type: "warning",
          duration: 2000
        });
        this.btnLogin = false;
        return false;
      }
      if (this.teachRegister.name.replace(/\s*/g,"") == "") {
        this.$message({
          message: "请输入真实姓名",
          type: "warning",
          duration: 2000
        });
        this.btnLogin = false;
        return false;
      }
      if (this.teachRegister.account.replace(/\s*/g,"") == "") {
        this.$message({
          message: "请输入账号",
          type: "warning",
          duration: 2000
        });
        this.btnLogin = false;
        return false;
      }
     
      
      if (this.teachRegister.account.replace(/\s*/g,"").length < 6) {
        this.$message({
          message: "账号长度为6-20位",
          type: "warning",
          duration: 2000
        });
        this.btnLogin = false;
        return false;
      }
      if (this.teachRegister.psw.replace(/\s*/g,"") == "") {
        this.$message({
          message: "密码不能为空",
          type: "error",
          duration: 3000
        });
        this.btnLogin = false;
        return false;
      }
      console.log(this.sheng);
      console.log(this.chengshi);
      console.log(this.school);
      
      if (this.teachRegister.affirmPsw.replace(/\s*/g,"") != this.teachRegister.psw.replace(/\s*/g,"")) {
        this.$message({
          message: "确认密码与填写密码不同",
          type: "error",
          duration: 3000
        });
        this.teachRegister.affirmPsw = "";
        this.btnLogin = false;
        return false;
      }
      const res = await this.$http.post(
        "admin/teacher/regteacher",
        qs.stringify({
          nickname: this.teachRegister.name.replace(/\s*/g,""),
          name: this.teachRegister.account.replace(/\s*/g,""),
          password: this.teachRegister.psw.replace(/\s*/g,""),
          school_id: this.school
        })
      );
      if (res.status === 200 && res.data.code === "1") {
        this.$message({
          message: res.data.info,
          type: "success",
          duration: 3000
        });
        this.chengshiList = [];
        this.schoolList = [];
        this.sheng = "";
        this.chengshi = "";
        this.school = "";
        this.teachRegister.name = "";
        this.teachRegister.account = "";
        this.teachRegister.psw = "";
        this.teacherRegister = false;
        this.btnLogin = false;
      } else {
        this.$message({
          message: res.data.info,
          type: "error",
          duration: 3000
        });
        this.btnLogin = false;
      }
    },
    async zhuceStudent() { // 注册学生账号
      this.btnLogin = true;
      console.log(this.sheng);
      console.log(this.chengshi);
      console.log(this.school);
      if (this.sheng == "") {
        this.$message({
          message: "请选择省份",
          type: "warning",
          duration: 2000
        });
        this.btnLogin = false;
        return false;
      }
      if (this.chengshi == "") {
        this.$message({
          message: "请选择城市",
          type: "warning",
          duration: 2000
        });
        this.btnLogin = false;
        return false;
      }
      if (this.school == "") {
        this.$message({
          message: "请选择学校",
          type: "warning",
          duration: 2000
        });
        this.btnLogin = false;
        return false;
      }
      if (this.school != "") {
        this.school_name = this.school[1];
        this.school_id = this.school[0];
      }
      if (this.tracher == "") {
        this.$message({
          message: "请选择教师",
          type: "warning",
          duration: 2000
        });
        this.btnLogin = false;
        return false;
      }
      if (this.tracher != "") {
        this.teacher_name = this.tracher[1];
        this.teacher_id = this.tracher[0];
      }
      if (this.classes == "") {
        this.$message({
          message: "请选择班级",
          type: "warning",
          duration: 2000
        });
        this.btnLogin = false;
        return false;
      }
      if (this.classes != "") {
        this.class_name = this.classes[1];
        this.class_id = this.classes[0];
      }
      if (this.stuRegister.name.replace(/\s*/g,"") == "") {
        this.$message({
          message: "请输入真实姓名",
          type: "warning",
          duration: 2000
        });
        this.btnLogin = false;
        return false;
      }
      if (this.stuRegister.account.replace(/\s*/g,"") == "") {
        this.$message({
          message: "请输入账号",
          type: "warning",
          duration: 2000
        });
        this.btnLogin = false;
        return false;
      }
      
      if (
        this.stuRegister.account.replace(/\s*/g,"").length < 6 ||
        this.stuRegister.account.replace(/\s*/g,"").length > 20
      ) {
        this.$message({
          message: "账号长度为6-20位",
          type: "warning",
          duration: 2000
        });
        this.btnLogin = false;
        return false;
      }
      if (this.stuRegister.psw.replace(/\s*/g,"") == "") {
        this.$message({
          message: "密码不能为空",
          type: "error",
          duration: 3000
        });
        this.btnLogin = false;
        return false;
      }
      if (this.stuRegister.psw.replace(/\s*/g,"") != this.stuRegister.affirmPsw.replace(/\s*/g,"")) {
        this.$message({
          message: "确认密码与填写密码不同",
          type: "error",
          duration: 3000
        });
        this.stuRegister.affirmPsw = "";
        this.btnLogin = false;
        return false;
      }
      const res = await this.$http.post(
        "admin/teacher/regstudent",
        qs.stringify({
          school_name: this.school_name,
          school_id: this.school_id,
          // teacher_name: this.teacher_name,
          // teacher_id: this.teacher_id,
          //   school_name:'中山大学南方学院',
          // school_id: 7,
          teacher_name: this.teacher_name,
          teacher_id: this.teacher_id,
          class_id: this.class_id,
          class_name: this.class_name,
          nickname: this.stuRegister.name.replace(/\s*/g,""),
          name: this.stuRegister.account.replace(/\s*/g,""),
          password: this.stuRegister.psw.replace(/\s*/g,"")
        })
      );
      if (res.status === 200 && res.data.code === "1") {
        this.$message({ message: res.data.info, type: "success", duration: 3000 });
        // this.chengshiList = [];
        // this.schoolList = [];
        // this.sheng = "";
        // this.chengshi = "";
        // this.school = "";
        // this.tracher = "";
        // this.classes = "";
        // this.stuRegister.name = "";
        // this.stuRegister.psw = "";
        // this.stuRegister.affirmPsw = "";
        // this.stuRegister.account = "";
        this.btnLogin = false;
        // this.studentRegister = false;
      } else {
        this.$message({ message: res.data.info, type: "error", duration: 3000 });
        this.btnLogin = false;
      }
    },
    check() {
      this.identity == 1 ? (this.identity = 2) : (this.identity = 1);
    },
    isMobile(){ // 判断是否是手机端
      var system = { win: false, mac: false, xll: false, ipad:false };
      //检测平台
      var p = navigator.platform;
      system.win = p.indexOf("Win") == 0;
      system.mac = p.indexOf("Mac") == 0;
      system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
      system.ipad = (navigator.userAgent.match(/iPad/i) != null)?true:false;
      //跳转语句，如果是PC访问就自动跳转到所要访问的页面
      if (system.win || system.mac || system.xll||system.ipad) {
        this.ismobile =false;
      } else {
        this.ismobile = true;
      };
      var u = navigator.userAgent, app = navigator.appVersion;
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isAndroid) {
        this.isIphon = false;
      }
      if (isIOS) {
        //这个是ios操作系统
        this.isIphon = true;
      }
    },
    
  }
};
</script>
<style scoped lang="less">
#app{
  height: 100%;
}
.form_box>.phone-class {
  margin-top: 10vh;
  max-height: 80%;
  overflow: auto;
  
}
.login {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-image: url("http://ruanjian.chinadingao.com/uploads/20190705/f76a0e8c6c2ca103d99435ae56de81d.jpg");
  background-size: cover;
  background-position: center center;
  .title-img {
    float: left;
    width: 100%;
    margin-top: 30px;
    img {
      margin: 0 auto;
    }
  }
}
.form_box {
  width: 280px;
  margin: 0 auto;
  margin-top: 28vh;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 20px 25px;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  position: relative;
  transition-duration: 0.5s;
  .student-form,
  .teacher-form {
    .title {
      color: #409eff;
      font-size: 22px;
      padding: 7px 0;
      border-bottom: 1px solid #409eff;
      margin-bottom: 5px;
    }
    .register {
      position: absolute;
      top: 27px;
      right: 30px;
    }
    .input {
      margin-top: 10px;
      &:nth-child(5) {
        width: 156px;
      }
      .el-input__inner {
        border: none;
        border-bottom: 1px solid #ccc;
      }
    }
    .code {
      margin-top: 10px;
      border-radius: 4px;
    }
    .login_btn {
      margin-top: 10px;
      width: 100%;
      padding-top: 8px;
      padding-bottom: 8px;
      border-radius: 2px;
    }
  }
}
.code {
  width: 114px;
  height: 32px;
  border: 1px solid #409eff;
  box-sizing: border-box;
  overflow: hidden;
  float: right;
}
.verify {
  height: 32px;
  width: 120px;
  border-radius: 5px;
}
.login_btn {
  border-radius: 5px;
}
.dialog {
  padding: 0;
  margin: 0 auto;
  height: 500px;
}
.stu-dialog {
  width: 340px;
  margin-top: 15vh;
  height: 700px;
  border-radius: 4px;
  .el-dialog {
    margin-top: 0;
  }
  .el-dialog__body {
    margin-top: -10px;
    .el-select {
      margin-top: 10px;
      &:nth-child(1) {
        margin-top: -40px;
      }
    }
  }

  &:nth-child(1) {
    margin: 0;
  }
}
</style>
