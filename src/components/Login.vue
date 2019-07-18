<template>
 
    
    <!-- 整个页面区域 -->
  <div class="newbg">
    
    <div class="login_container">
      <img :src="images" >
      <!-- 中间白色的盒子区域 -->
      <div class="login_box">
        <!-- 头像区域 -->
        <div class="avatar_box">
          <img src="../assets/logo.png" alt="">
        </div>
        <!-- 表单区域 -->
        <el-form ref="loginFormRef" :model="loginForm" class="login_form" :rules="loginFormRules">
          
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input  v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input @blur="loseBlur" @focus="getBlur" type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" ></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item class="btns">
            <el-button type="primary" round @click="login">登录</el-button>
            <el-button type="info" round @click="resetLoginForm">重置</el-button>

          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
  
</template>
<script>
import { async } from 'q';
import { log } from 'util';
export default {
  data () {
    return {
      images:require('../assets/bg.jpeg'),
      

      loginForm:{
        username:'',
        password:''
      },
      loginFormRules:{
        username: [
              { required: true, message: '你没输用户名哦', trigger: 'blur' },
              { min: 3, max: 5, message: '你需要输入3-5个字符哦', trigger: 'blur' }
            ],
        password: [
              { required: true, message: '你没输密码哦', trigger: 'blur' },
              { min: 5, max: 10, message: '你需要输入5-10个字符哦', trigger: 'blur' }
            ]
      }
    }
  },
  methods:{
    resetLoginForm(){
      this.$refs.loginFormRef.resetFields()
    },
    login(){
      this.$refs.loginFormRef.validate(async valid =>{
        if(!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        if(res.meta.status !== 200) return console.log("登录失败");
        console.log("登录成功");
      });
      
    },
    loseBlur(){
        console.log('失去了焦点');
        this.images = require("../assets/bg.jpeg")
        
        
    },
    getBlur(){
        console.log('获得了焦点');
        this.images = require("../assets/bg1.jpg")
    }
  }
}
</script>
<style lang='less' scoped>
  .login_container{

    height: 82%;
  }
  .login_container img{
    height: 100%;

  }
  .newbg{
    position: absolute;
    width: 700px;
    height: 540px;
    bottom: pink;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
  }
  .login_box{
    width:450px;
    height:300px;
    background-color:rgba(255,255,255,0.5);
    border-radius: 3px;
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
  }
  .avatar_box{
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255,255,255,0.5);
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: rgba(255,255,255,0.5);
    }
  }
  .login_form{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .btns{
    display: flex;
    justify-content: flex-end;
  }
  
</style>
