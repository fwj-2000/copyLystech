<template>
  <div class="screen-no-data">
    <img :src="noDataTop" alt="no-data" class="top-image" />
    <img :src="noDataBottom" alt="no-data" class="bottom-image" />
  </div>
</template>

<script setup lang="ts">
  import noDataBottom from '/@/assets/images/screen/nodata-bottom.png';
  import noDataTop from '/@/assets/images/screen/nodata-top.png';
</script>

<style lang="less" scoped>
  .screen-no-data {
    @keyframes rotate {
      from {
        transform: rotateZ(0deg);
      }

      to {
        transform: rotateZ(360deg);
      }
    }

    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;

    .top-image {
      max-width: 180px;
      position: absolute;
      top: 32%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
    }

    .bottom-image {
      position: absolute;
      max-width: 180px;
      top: 35%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
    }

    .rotating {
      animation: rotate 3s linear infinite;
    }
  }
</style>
