<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-number">
        <div class="four first">4</div>
        <div class="zero">0</div>
        <div class="four second">4</div>
      </div>
      <h1 class="error-title">页面未找到</h1>
      <p class="error-desc">抱歉，您访问的页面不存在或已被移除</p>
      <router-link to="/" class="back-home">
        返回首页
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page404'
}
</script>

<style lang="scss" scoped>
@use 'sass:color';
.error-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.error-content {
  text-align: center;
  padding: 2rem;
}

.error-number {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  
  .four, .zero {
    font-size: 8rem;
    font-weight: bold;
    color: #1482f0;
    position: relative;
  }

  .zero {
    width: 8rem;
    height: 8rem;
    border: 1rem solid #1482f0;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  .first {
    animation: bounce 2s infinite;
  }

  .second {
    animation: bounce 2s infinite 0.5s;
  }
}

.error-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  animation: fadeIn 0.5s ease-in;
}

.error-desc {
  color: #606c76;
  margin-bottom: 2rem;
  animation: fadeIn 0.5s ease-in 0.2s both;
}

.back-home {
  display: inline-block;
  padding: 0.8rem 2rem;
  background: #1482f0;
  color: white;
  border-radius: 2rem;
  text-decoration: none;
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-in 0.4s both;

  &:hover {
    background: color.adjust(#1482f0, $lightness: -10%);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(20, 130, 240, 0.2);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
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
</style>
  