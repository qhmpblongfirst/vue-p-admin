<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-image">
        <div class="welcome-text">
          <div class="welcome-line1">欢迎登录</div>
          <div class="welcome-line2">啥都中</div>
        </div>
      </div>
      <div class="login-form">
        <div class="login-header">
          <Icon icon="mdi:account-circle" class="login-icon" />
        </div>
        <el-form :model="form" ref="formRef" label-position="top">
          <el-form-item label="用户名" prop="username" :rules="rules.username">
            <el-input 
              v-model="form.username" 
              placeholder="请输入用户名" 
              autocomplete="new-username"
            >
              <template #prefix>
                <Icon icon="mdi:account" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password" :rules="rules.password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              autocomplete="new-password"
            >
              <template #prefix>
                <Icon icon="mdi:lock" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin" class="login-button">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { Icon } from '@iconify/vue'

const store = useStore()
const router = useRouter()
const form = ref({
  username: '',
  password: '',
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const handleLogin = async () => {
  try {
    await store.dispatch('user/loginAsync', { ...form.value })
    router.replace('/')
  } catch (error) {
    console.error('Login error:', error)
  }
}
</script>

<style lang="scss" scoped>
$primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
$secondary-gradient: linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%);
$box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
$border-radius: 20px;

@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  @include flex-center;
  height: 100vh;
  background: $primary-gradient;
}

.login-box {
  display: flex;
  width: 800px;
  height: 500px;
  background-color: #ffffff;
  border-radius: $border-radius;
  overflow: hidden;
  box-shadow: $box-shadow;
}

.login-form {
  flex: 1;
  padding: 20px 40px 40px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .login-header{
    @include flex-center;
    .login-icon{
      font-size: 96px;
      color: #ff9a9e;
    }
  }
}

.login-image {
  flex: 1;
  background-image: $secondary-gradient;
  @include flex-center;
  overflow: hidden;
  position: relative;

  .welcome-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    letter-spacing: 2px;
    text-transform: uppercase;
    animation: fadeIn 1.5s ease-out, float 3s ease-in-out infinite;

    .welcome-line1, .welcome-line2 {
      font-weight: 700;
    }

    .welcome-line1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
    }

    .welcome-line2 {
      font-size: 2rem;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      width: 60%;
      height: 3px;
      background: white;
      transform: translateX(-50%) scaleX(0);
      transform-origin: center;
      transition: transform 0.5s ease-out;
    }
  }

  &:hover .welcome-text::after {
    transform: translateX(-50%) scaleX(1);
  }
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@media (max-width: 768px) {
  .login-box {
    width: 90%;
    flex-direction: column;
    height: auto;
  }

  .login-image {
    height: 200px;

    .welcome-text {
      .welcome-line1 {
        font-size: 2rem;
      }
      .welcome-line2 {
        font-size: 1.5rem;
      }
    }
  }
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input {
  --el-input-hover-border-color: #764ba2;
  --el-input-focus-border-color: #764ba2;
}

.el-input__inner {
  border-radius: 8px;
}

.login-button {
  width: 100%;
  height: 50px;
}
</style>
