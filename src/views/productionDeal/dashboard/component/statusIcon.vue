<template>
  <div class="status-block-container">
    <div class="status-icon">
      <div class="status-icon-success ml-16px">
        <img :src="g_r" alt="" />
      </div>
      <div class="status-icon-normal ml-16px">
        <img :src="n_n" alt="" />
      </div>
      <div class="status-icon-warning ml-16px">
        <img :src="w_r" alt="" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import n_n from '/@/assets/images/dashbord/n_n.png';
  import g_r from '/@/assets/images/dashbord/g_r.png';
  import w_r from '/@/assets/images/dashbord/w_r.png';
</script>

<style lang="less" scoped>
  .status-block-container {
    display: flex;
    align-items: center;
  }

  .status-block {
    display: flex;
    font-family: Roboto, sans-serif;
    font-style: normal;
    font-weight: bold;
    height: 102px;
  }

  .success-card {
    background: rgb(0 140 63 / 40%);
    color: #00d539;
    border: 1px solid #00d539;
    padding: 10px;
    min-width: 124px;
  }

  .warning-card {
    background: rgb(255 166 0 / 30%);
    color: #ffa600;
    border: 1px solid #ffa600;
    padding: 10px;
    min-width: 120px;
  }

  .normal-card {
    background: rgb(255 255 255 / 25%);
    color: #fff;
    border: 1px solid #fff;
    padding: 10px;
    min-width: 120px;
  }

  .status-icon {
    display: flex;
    height: 50px;

    &-success {
      min-width: 50px;
      background: rgb(0 140 63 / 40%);
      padding: 10px;
    }

    &-warning {
      min-width: 50px;
      background: rgb(255 166 0 / 30%);
      padding: 10px;
    }

    &-normal {
      min-width: 50px;
      background: rgb(255 255 255 / 25%);
      padding: 10px;
    }
  }
</style>
