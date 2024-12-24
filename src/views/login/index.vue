<template>
  <div class="login-container">
    <div class="starry-background">
      <div class="stars-layer stars-near">
        <div class="star" v-for="n in 200" :key="`near-${n}`"></div>
      </div>
      <div class="stars-layer stars-middle">
        <div class="star" v-for="n in 200" :key="`mid-${n}`"></div>
      </div>
      <div class="stars-layer stars-far">
        <div class="star" v-for="n in 200" :key="`far-${n}`"></div>
      </div>
    </div>
    
    <div class="grid-overlay"></div>
    
    <div class="login-content">
      <div class="login-card">
        <div class="brand-section">
          <div class="logo-wrapper">
            <div class="logo-ring"></div>
            <el-icon class="logo-icon" :size="32"><Platform /></el-icon>
          </div>
          <h1 class="brand-name">
            <span class="tech-text">SYSTEM</span>
            <div class="brand-decoration"></div>
          </h1>
        </div>
        
        <div class="form-section">
          <h2 class="welcome-text">Welcome Back <span class="tech-emoji">🚀</span></h2>
          <p class="subtitle">Sign in to access your dashboard</p>
          
          <el-form 
            :model="form" 
            ref="formRef" 
            class="login-form"
          >
            <el-form-item prop="username" :rules="rules.username">
              <el-input
                v-model="form.username"
                placeholder="用户名"
                :prefix-icon="User"
                class="custom-input"
                @keyup.enter="handleLogin"
              />
            </el-form-item>
            
            <el-form-item prop="password" :rules="rules.password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="密码"
                :prefix-icon="Lock"
                class="custom-input"
                show-password
                @keyup.enter="handleLogin"
              />
            </el-form-item>

            <!-- <div class="form-footer">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <el-button link type="primary" class="forgot-link">忘记密码？</el-button>
            </div> -->
            
            <el-button 
              type="primary" 
              class="login-button" 
              @click="handleLogin"
              :loading="loading"
            >
              {{ loading ? '登录中...' : '登录' }}
            </el-button>
          </el-form>

          <div class="login-tips" v-if="loginError">
            <el-alert
              :title="loginError"
              type="error"
              show-icon
              :closable="false"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { User, Lock, Platform } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const store = useStore()
const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const rememberMe = ref(false)
const loginError = ref('')

const form = ref({
  username: '',
  password: '',
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度至少为3个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
  ],
}

const handleLogin = async () => {
  if (loading.value) return
  
  try {
    loginError.value = ''
    const valid = await formRef.value.validate()
    if (!valid) return

    loading.value = true
    await store.dispatch('user/loginAsync', { ...form.value })
    ElMessage.success('登录成功')
    router.replace('/')
  } catch (error) {
    loginError.value = error.message || '登录失败，请检查用户名和密码'
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  console.log('onMounted')
})
</script>

<style lang="scss" scoped>
@use "sass:list";
@use "sass:math";
@use "sass:map";

.login-container {
  min-height: 100vh;
  background: #0a0d1c;
  display: grid;
  place-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  perspective: 1500px;
}

.starry-background {
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  overflow: hidden;
  z-index: 1;
  background: radial-gradient(ellipse at center,
    rgba(15, 23, 42, 0) 0%,
    rgba(10, 13, 28, 0.9) 100%
  );
  transform-style: preserve-3d;
  transform-origin: center center;
}

.stars-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  
  &.stars-near {
    transform: translateZ(50px);
    animation: rotate-space 40s linear infinite;
  }
  
  &.stars-middle {
    transform: translateZ(0);
    animation: rotate-space 60s linear infinite;
  }
  
  &.stars-far {
    transform: translateZ(-50px);
    animation: rotate-space 80s linear infinite;
  }
}

.star {
  position: absolute;
  border-radius: 50%;
  transform-style: preserve-3d;
  
  @for $i from 1 through 200 {
    &:nth-child(#{$i}) {
      $layer: if($i <= 70, 'near', if($i <= 140, 'middle', 'far'));
      
      $size-map: (
        'near': list.nth((2px, 2.5px, 3px), ($i % 3) + 1),
        'middle': list.nth((1.5px, 2px, 2.5px), ($i % 3) + 1),
        'far': list.nth((1px, 1.5px, 2px), ($i % 3) + 1)
      );
      $size: map.get($size-map, $layer);
      
      $opacity-map: (
        'near': list.nth((0.9, 0.8, 0.85), ($i % 3) + 1),
        'middle': list.nth((0.7, 0.6, 0.65), ($i % 3) + 1),
        'far': list.nth((0.5, 0.4, 0.45), ($i % 3) + 1)
      );
      $base-opacity: map.get($opacity-map, $layer);
      
      $glow-map: (
        'near': '0 0 4px rgba(255, 255, 255, 0.8), 0 0 8px rgba(255, 255, 255, 0.5)',
        'middle': '0 0 3px rgba(255, 255, 255, 0.6), 0 0 6px rgba(255, 255, 255, 0.3)',
        'far': '0 0 2px rgba(255, 255, 255, 0.4), 0 0 4px rgba(255, 255, 255, 0.2)'
      );
      $glow: map.get($glow-map, $layer);
      
      $section-x: math.floor(math.div($i, 20)) * 20;
      $section-y: math.div($i % 20, 1) * 10;
      
      $random-offset-x: math.random() * 15 - 7.5;
      $random-offset-y: math.random() * 15 - 7.5;
      
      $duration: 2s + math.random() * 3s;
      $delay: math.floor(math.random() * 10) * -1s;
      
      $left: -25 + $section-x + $random-offset-x;
      $top: -25 + $section-y + $random-offset-y;
      
      left: #{$left * 1%};
      top: #{$top * 1%};
      width: $size;
      height: $size;
      background: #fff;
      opacity: $base-opacity;
      box-shadow: #{$glow};
      animation: twinkle-#{$layer}-#{$i} $duration $delay infinite ease-in-out;
      
      @keyframes twinkle-#{$layer}-#{$i} {
        0%, 100% {
          opacity: $base-opacity * 0.5;
          transform: scale(1);
        }
        50% {
          opacity: $base-opacity;
          transform: scale(1.2);
        }
      }
    }
  }
}

@keyframes rotate-space {
  from {
    transform: rotate3d(0, 1, 0.1, 0deg);
  }
  to {
    transform: rotate3d(0, 1, 0.1, 360deg);
  }
}

.grid-overlay {
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background-image: 
    linear-gradient(rgba(96, 165, 250, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(96, 165, 250, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 1;
  transform-style: preserve-3d;
  animation: rotate-space 60s linear infinite;
  opacity: 0.2;
}

.login-content {
  position: relative;
  z-index: 10;
  transform-style: preserve-3d;
  transform: translateZ(80px);
}

.login-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  z-index: 10;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      transparent 0%,
      rgba(96, 165, 250, 0.03) 50%,
      transparent 100%
    );
    animation: shimmer 3s infinite;
  }
}

.logo-wrapper {
  position: relative;
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  
  .logo-ring {
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border: 2px solid rgba(96, 165, 250, 0.5);
    border-radius: 20px;
    animation: rotate 10s linear infinite;
    
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      border: 2px solid transparent;
      border-top-color: #60a5fa;
      border-radius: 20px;
      animation: rotate 2s linear infinite;
    }
  }
  
  .logo-icon {
    position: relative;
    z-index: 2;
    color: #60a5fa;
    filter: drop-shadow(0 0 10px rgba(96, 165, 250, 0.5));
  }
}

.brand-name {
  .tech-text {
    font-family: 'Orbitron', sans-serif;
    background: linear-gradient(to right, #60a5fa, #3b82f6);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    letter-spacing: 2px;
  }
  
  .brand-decoration {
    width: 30px;
    height: 2px;
    background: #3b82f6;
    margin: 8px auto 0;
    position: relative;
    
    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 6px;
      height: 6px;
      background: #60a5fa;
      border-radius: 50%;
      top: -2px;
    }
    
    &::before { left: -3px; }
    &::after { right: -3px; }
  }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.login-form {
  position: relative;
  z-index: 11;
  
  :deep(.el-form-item) {
    margin-bottom: 24px;
  }
  
  :deep(.custom-input) {
    .el-input__wrapper {
      background: rgba(255, 255, 255, 0.02) !important;
      border: 1px solid rgba(96, 165, 250, 0.2);
      box-shadow: none;
      border-radius: 12px;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: rgba(96, 165, 250, 0.4);
        background: rgba(255, 255, 255, 0.03);
      }
      
      &.is-focus {
        border-color: #60a5fa;
        box-shadow: 0 0 0 2px rgba(96, 165, 250, 0.2);
        background: rgba(255, 255, 255, 0.04);
      }
    }
    
    input {
      color: #fff;
      caret-color: #60a5fa;
      
      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus,
      &:-webkit-autofill:active {
        -webkit-text-fill-color: #fff !important;
        -webkit-box-shadow: 0 0 0 30px rgba(255, 255, 255, 0.02) inset !important;
        transition: background-color 5000s ease-in-out 0s;
      }
      
      &::placeholder {
        color: rgba(255, 255, 255, 0.5);
      }

      &::selection {
        background: rgba(96, 165, 250, 0.3);
      }
    }

    .el-input__prefix {
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

.login-button {
  width: 100%;
  height: 48px;
  background: linear-gradient(45deg, #3b82f6, #60a5fa);
  border: none;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 8px;
  
  &:hover {
    background: linear-gradient(45deg, #2563eb, #3b82f6);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.welcome-text,
.subtitle {
  color: #fff;
}

.subtitle {
  opacity: 0.7;
}

.login-tips {
  margin-top: 16px;
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

@media (max-width: 480px) {
  .login-card {
    padding: 24px;
  }
  
  .brand-section {
    margin-bottom: 32px;
    
    .logo-wrapper {
      width: 56px;
      height: 56px;
    }
    
    .brand-name {
      font-size: 20px;
    }
  }
  
  .form-section {
    .welcome-text {
      font-size: 20px;
    }
    
    .subtitle {
      font-size: 14px;
    }
  }
}
</style>
