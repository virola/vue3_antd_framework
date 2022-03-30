<template>
  <div :class="['login-wrapper', ['', 'login-form-right', 'login-form-left'][direction]]">
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      layout="vertical"
      class="login-form ele-bg-white">
      <h4>忘记密码</h4>
      <a-form-item name="mobile">
        <a-input
          placeholder="请输入绑定手机号"
          v-model:value="form.mobile"
          allow-clear
          size="large">
          <template #prefix>
            <mobile-outlined/>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item name="password">
        <a-input-password
          placeholder="请输入新的登录密码"
          v-model:value="form.password"
          size="large">
          <template #prefix>
            <lock-outlined/>
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item name="password2">
        <a-input-password
          placeholder="请再次输入登录密码"
          v-model:value="form.password2"
          size="large">
          <template #prefix>
            <key-outlined/>
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item name="captcha">
        <div class="login-input-group">
          <a-input
            placeholder="请输入验证码"
            v-model:value="form.captcha"
            allow-clear
            size="large">
            <template #prefix>
              <safety-certificate-outlined/>
            </template>
          </a-input>
          <a-button
            class="login-captcha"
            :disabled="!!countdownTimer"
            @click="showImgCodeCheck">
            <span v-if="!countdownTimer">发送验证码</span>
            <span v-else>已发送 {{ countdownTime }} s</span>
          </a-button>
        </div>
      </a-form-item>
      <a-form-item>
        <router-link
          to="/login"
          class="ele-pull-right"
          style="line-height: 22px;">返回登录
        </router-link>
      </a-form-item>
      <a-form-item>
        <a-button
          block
          size="large"
          type="primary"
          :loading="loading"
          @click="doSubmit">修改密码
        </a-button>
      </a-form-item>
    </a-form>
    <div class="login-copyright">Copyright © 2018~2022 XXX. All rights reserved.</div>
  </div>
  <!-- 编辑弹窗 -->
  <a-modal
    :width="340"
    :footer="null"
    title="发送验证码"
    v-model:visible="showImgCode">
    <div
      class="login-input-group"
      style="margin-bottom: 16px;">
      <a-input
        v-model:value="imgCode"
        placeholder="请输入图形验证码"
        allow-clear
        size="large"/>
      <a-button class="login-captcha">
        <img
          alt=""
          v-if="captcha"
          :src="captcha"
          @click="changeImgCode"/>
      </a-button>
    </div>
    <a-button
      block
      size="large"
      type="primary"
      :loading="codeLoading"
      @click="sendCode">立即发送
    </a-button>
  </a-modal>
</template>

<script>
import {
  MobileOutlined,
  LockOutlined,
  KeyOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'Forget',
  components: {
    MobileOutlined,
    LockOutlined,
    KeyOutlined,
    SafetyCertificateOutlined
  },
  data() {
    let rePswRule = async (rule, value) => {
      if (!value) {
        return Promise.reject('请再次输入新密码');
      }
      if (value === this.form.password) {
        return Promise.resolve();
      }
      return Promise.reject('两次输入密码不一致');
    };
    return {
      // 登录框方向, 0居中, 1居右, 2居左
      direction: 0,
      // 加载状态
      loading: false,
      // 表单数据
      form: {
        mobile: '',
        password: '',
        password2: '',
        captcha: '',
        key: '',
      },
      // 表单验证规则
      rules: {
        mobile: [
          {required: true, message: '请输入绑定手机号', type: 'string', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入新的登录密码', type: 'string', trigger: 'blur'}
        ],
        password2: [
          {required: true, validator: rePswRule, trigger: 'blur'}
        ],
        captcha: [
          {required: true, message: '请输入验证码', type: 'string', trigger: 'blur'}
        ]
      },
      // 用于刷新验证码
      v: new Date().getTime(),
      // 是否显示图形验证码弹窗
      showImgCode: false,
      // 图形验证码
      imgCode: '',
      // 发送验证码按钮loading
      codeLoading: false,
      // 验证码倒计时时间
      countdownTime: 30,
      // 验证码倒计时定时器
      countdownTimer: null,
      // 验证码
      captcha: ""
    };
  },
  computed: {
    
  },
  mounted() {
    // 获取验证码
    this.changeImgCode();
  },
  methods: {
    /* 提交 */
    doSubmit() {
      this.$refs.form.validate().then(() => {
        this.loading = true;
        setTimeout(() => {
          this.$message.success('密码修改成功');
          this.$router.push('/login');
        }, 1000);
      }).catch(() => {
      });
    },
    /* 更换图形验证码 */
    changeImgCode() {
      this.$http.get('/captcha').then(res => {
        if (res.data.code === 0) {
          // 验证码base64字符串
          this.captcha = res.data.data.captcha;
          // 验证码校验key值
          this.form.key = res.data.data.key;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 显示发送短信验证码弹窗 */
    showImgCodeCheck() {
      if (!this.form.mobile) {
        this.$message.error('请输入手机号码');
        return;
      }
      this.imgCode = '';
      this.changeImgCode();
      this.showImgCode = true;
    },
    /* 发送短信验证码 */
    sendCode() {
      if (!this.imgCode) {
        this.$message.error('请输入图形验证码');
        return;
      }
      this.codeLoading = true;
      setTimeout(() => {
        this.$message.success('短信验证码发送成功, 请注意查收!');
        this.showImgCode = false;
        this.codeLoading = false;
        this.startCountdownTimer();
      }, 1000);
    },
    /* 开始对按钮进行倒计时 */
    startCountdownTimer() {
      this.countdownTime = 30;
      this.countdownTimer = setInterval(() => {
        if (this.countdownTime <= 1) {
          clearInterval(this.countdownTimer);
          this.countdownTimer = null;
        }
        this.countdownTime--;
      }, 1000);
    }
  },
  unmounted() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  }
}
</script>

<style scoped>
/* 背景 */
.login-wrapper {
  padding: 48px 16px 0 16px;
  position: relative;
  box-sizing: border-box;
  min-height: 100vh;
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

.login-wrapper:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .2);
}

/* 卡片 */
.login-form {
  width: 360px;
  margin: 0 auto;
  max-width: 100%;
  padding: 0 28px 16px 28px;
  box-sizing: border-box;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  position: relative;
  z-index: 2;
}

.login-form-right .login-form {
  margin: 0 15% 0 auto;
}

.login-form-left .login-form {
  margin: 0 auto 0 15%;
}

.login-form h4 {
  padding: 22px 0;
  text-align: center;
}

/* 验证码 */
.login-input-group {
  display: flex;
  align-items: center;
}

.login-input-group :deep(.ant-input-affix-wrapper) {
  flex: 1;
}

.login-input-group .login-captcha {
  width: 102px;
  height: 40px;
  margin-left: 10px;
  padding: 0;
}

.login-input-group .login-captcha > img {
  width: 100%;
  height: 100%;
}

/* 第三方登录图标 */
.login-oauth-icon {
  color: #fff;
  padding: 5px;
  margin: 0 12px;
  font-size: 18px;
  border-radius: 50%;
  cursor: pointer;
}

/* 底部版权 */
.login-copyright {
  color: #eee;
  text-align: center;
  padding: 48px 0 22px 0;
  position: relative;
  z-index: 1;
}

/* 响应式 */
@media screen and (min-height: 640px) {
  .login-wrapper {
    padding-top: 0;
  }

  .login-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: -230px;
  }

  .login-form-right .login-form,
  .login-form-left .login-form {
    left: auto;
    right: 15%;
    transform: translateX(0);
    margin: -230px auto auto auto;
  }

  .login-form-left .login-form {
    right: auto;
    left: 15%;
  }

  .login-copyright {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

@media screen and (max-width: 768px) {
  .login-form-right .login-form,
  .login-form-left .login-form {
    left: 50%;
    right: auto;
    margin-left: 0;
    margin-right: auto;
    transform: translateX(-50%);
  }
}
</style>
