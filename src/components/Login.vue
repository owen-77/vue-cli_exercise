<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
        label-width="0"
        class="loginForm"
        autocomplete="off"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            class="radius prefix"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            class="radius prefix"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" round @click="login">登录</el-button>
          <el-button type="info" round @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { loginApi } from '@/api'
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$message.closeAll()
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await loginApi(this.loginForm)
        if (!res.data) return this.$message.error('用户名或密码错误！')
        this.$message.success('登陆成功！')
        window.sessionStorage.token = res.data.token
        this.$router.push('/home')
      })
    }
  },
  created() {
    this.$message.closeAll()
  }
}
</script>

<style>
.radius input.el-input__inner {
  border-radius: 20px;
}
.prefix span.el-input__prefix {
  left: 10px;
}
</style>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;

  .login_box {
    position: absolute;
    width: 450px;
    height: 320px;
    background-color: #fff;
    border-radius: 15px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
      position: absolute;
      width: 130px;
      height: 130px;
      padding: 10px;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 1px solid #eee;
      border-radius: 50%;
      background-color: #fff;
      box-shadow: 0 0 20px dodgerblue;

      img {
        width: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    .loginForm {
      position: absolute;
      bottom: 0;
      box-sizing: border-box;
      width: 100%;
      padding: 0 20px;

      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>
