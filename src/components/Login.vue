<template>
 
    
    <!-- 整个页面区域 -->

    <div class="login_container">
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
            <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item class="btns">
            <el-button type="primary" round>登录</el-button>
            <el-button type="info" round @click="resetLoginForm">重置</el-button>

          </el-form-item>
        </el-form>
      </div>
    </div>
  
  
</template>
<script>
export default {
  data () {
    return {
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
    }
  }
}
</script>
<style lang='less' scoped>
  .login_container{
    background: rgb(44, 62, 80);
    height: 100%;
  }
  .login_box{
    width:450px;
    height:300px;
    background-color:#fff;
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
    background-color: #fff;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
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
