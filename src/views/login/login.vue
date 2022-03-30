<template>
  <div class="login-page">
    <div class="u-flex u-row-center login-wrapper">
      <div class="login-framework u-flex u-row-right">
        <a-form ref="loginForm" :model="form" :rules="rules" layout="vertical" class="login-form ele-bg-white">
          <div class="u-text-center">
            <img class="u-text-center" width="80" :src="`${$baseUrl}logo.png`">
          </div>
          <h4 class="login-form-title ele-text-primary">{{ projectName }}</h4>
          <a-form-item name="username">
            <a-input class="login-input" placeholder="请输入登录账号" v-model:value="form.username" allow-clear size="large">
              <template #prefix>
                <user-outlined class="login-icon ele-text-primary" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="password">
            <a-input-password class="login-input" placeholder="请输入登录密码" v-model:value="form.password" size="large">
              <template #prefix>
                <lock-outlined class="login-icon ele-text-primary" />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item>
            <a-checkbox v-model:checked="form.remember">记住密码 </a-checkbox>
            <router-link to="/forget" class="ele-pull-right" style="line-height: 22px;">忘记密码 </router-link>
          </a-form-item>
          <a-form-item>
            <a-button block size="large" type="primary" :loading="loading" @click="doSubmit">
              {{ loading ? '登录中' : '立即登录' }}
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div class="login-copyright">Copyright © 2021~2022 XXX公司. All rights reserved.</div>
  </div>
</template>

<script>
import {
  UserOutlined,
  LockOutlined
} from '@ant-design/icons-vue'

export default {
  name: 'Login',
  components: {
    UserOutlined,
    LockOutlined
  },
  data() {
    return {
      projectName: process.env.VUE_APP_NAME,
      // 登录框方向, 0居中, 1居右, 2居左
      direction: 1,
      // 加载状态
      loading: false,
      // 表单数据
      form: {
        username: localStorage.getItem('loginName') || '',
        password: '',
        captcha: '',
        remember: true
      },
      // 表单验证规则
      rules: {
        username: [{ required: true, message: '请输入账号', type: 'string', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', type: 'string', trigger: 'blur' }],
        // captcha: [{ required: true, message: '请输入验证码', type: 'string', trigger: 'blur' }]
      },
      // 验证码base64数据
      // captcha: '',
      // 验证码内容, 实际项目去掉
      // text: ''
    }
  },
  mounted() {
    if (this.$setting.takeToken()) {
      this.goHome()
    }
  },
  methods: {
    /* 提交 */
    doSubmit() {
      this.$refs.loginForm
        .validate()
        .then(() => {
          this.mockLogin()
        })
    },
    mockLogin() {
      this.loading = true
      setTimeout(() => {
        this.$message.success('登录成功')
        if (this.form.remember) {
          localStorage.setItem('loginName', this.form.username)
        }
        this.$store
          .dispatch('user/setToken', {
            token: 'Bearer MOCKTOKEN',
            remember: this.form.remember
          })
          .then(() => {
            this.goHome()
          })
      }, 1500)
      
    },
    /* 跳转到首页 */
    goHome() {
      if (this.$route.query && this.$route.query.from) {
        this.$router.push(String(this.$route.query.from))
      } else {
        this.$router.push('/').catch(() => {})
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  position: relative;
  box-sizing: border-box;
  background: #BAE9FF url('/img/login/bg.png') no-repeat center;
  min-height: 100vh;
  width: 100vw;
  background-size: 100% 100%;
}
// /* 背景 */
.login-wrapper {
  position: relative;
  min-height: 100vh;
  width: 100vw;
}

.login-framework {
  position: relative;
  min-width: 1100px;
  width: 1100px;
  height: 640px;
  padding: 10px;
  border-radius: 10px;
  background: url('/img/login/form.png') center no-repeat transparent;
  background-size: 100% 100%;
  box-shadow: #3D80D0 0 20px 80px;
}

/* 卡片 */
.login-form {
  width: 500px;
  height: 620px;
  border-radius: 10px;
  position: relative;
  right: 0;
  padding: 60px 70px;
}

.login-form h4 {
  padding: 0;
  margin: 30px 0;
  text-align: center;
  font-size: 32px;
  font-weight: bold;
}

.login-input {
  // background: #F7F9FF;
  border-radius: 4px;
}
.login-icon {
  margin-right: 10px;
}

/* 底部版权 */
.login-copyright {
  color: #eee;
  text-align: center;
  padding: 48px 0 22px 0;
  position: absolute;
  width: 100%;
  z-index: 1;
  bottom: 0;
}

@media screen and (max-width: 1200px) {
  .login-framework {
    min-width: auto;
    width: 100%;
    height: auto;
    padding: 10px;
  }
  .login-form {
    padding: 30px 30px 0;
    height: auto;

    h4 {
      font-size: 24px;
      margin: 16px 0;
    }
  }
}
</style>
