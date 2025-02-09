<template>
  <div class="no-permission">
    <div class="content">
      <div class="left">
        <h1 class="error-code">403</h1>
        <h2 class="error-title">访问被拒绝</h2>
        <p class="error-desc">抱歉，您没有权限访问该页面</p>
        <div class="actions">
          <el-button type="primary" @click="goBack">返回上一页</el-button>
          <el-button @click="goHome">返回首页</el-button>
        </div>
      </div>
      <div class="right">
        <div class="shield-icon">
          <i class="el-icon-lock"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.no-permission {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;

  .content {
    display: flex;
    align-items: center;
    max-width: 1000px;
    margin: 0 auto;
    gap: 60px;
  }

  .left {
    flex: 1;
  }

  .error-code {
    font-size: 72px;
    font-weight: bold;
    color: var(--el-color-primary);
    margin: 0 0 20px;
    line-height: 1;
  }

  .error-title {
    font-size: 32px;
    color: #303133;
    margin: 0 0 16px;
  }

  .error-desc {
    font-size: 16px;
    color: #606266;
    margin: 0 0 32px;
  }

  .actions {
    display: flex;
    gap: 16px;
  }

  .right {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .shield-icon {
    width: 200px;
    height: 200px;
    background: #f0f2f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    i {
      font-size: 80px;
      color: var(--el-color-primary);
    }
  }

  @media (max-width: 768px) {
    .content {
      flex-direction: column-reverse;
      text-align: center;
      gap: 40px;
    }

    .actions {
      justify-content: center;
    }

    .shield-icon {
      width: 160px;
      height: 160px;

      i {
        font-size: 60px;
      }
    }
  }
}
</style>