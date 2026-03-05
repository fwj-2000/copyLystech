<template>
  <div class="lydc-content-wrapper http404-container bg-white">
    <div class="http404">
      <img src="../../../assets/images/404(1).png" alt="404" class="pic-404" />
      <div class="bullshit__headline">{{ message }}</div>
      <a-button type="primary" size="middle" @click="$router.push('/home')">返回首页</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const message = '暂无权限，请联系平台管理员授权！';
</script>

<style lang="less" scoped>
  .http404-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .http404 {
    width: 397px;
    height: 330.35px;
    flex-shrink: 0;
    border-radius: 17.387px;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .pic-404 {
    width: 257px;
    height: 211px;
    flex-shrink: 0;
  }

  .bullshit__headline {
    color: #ff7b00;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: 34.774px; /* 193.187% */
  }
</style>
