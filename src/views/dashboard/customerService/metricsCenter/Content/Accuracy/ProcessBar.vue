<!-- 进度条组件 -->
<template>
  <div class="w-[100%] h-[100%] relative process-container">
    <div :class="['relative h-[100%] process overflow-hidden', props.bgClass]" :style="`width: ${props.value}%`">
      <div :class="['h-[100%] absolute top-0 left-0 sweep', props.bgClass]" :style="`width: ${parseInt(props.value, 10) * 2}%`"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    bgClass: string;
    value: string | number;
  }>();
</script>

<style lang="less" scoped>
  .process-container {
    background-color: rgb(190 190 190 / 10%);

    .sweep {
      opacity: 0.2;
      background-size: 200% 100%;
      background-position: -100% 0;
      animation: shine 5s ease-in-out infinite;
    }
  }
  @keyframes shine {
    0% {
      background-position: 200% 0%;
    }

    100% {
      background-position: -100% 0%;
    }
  }

  .process-grey {
    background: linear-gradient(to right, rgb(190 190 190 / 10%), rgb(215 215 215 / 77%));
  }

  .process-yellow {
    background: linear-gradient(to right, rgb(181 225 255 / 15%), rgb(255 161 79 / 86%));
  }

  .process-blue {
    background: linear-gradient(to right, rgb(181 225 255 / 15%), rgb(90 188 254 / 100%));
  }

  .process-purple {
    background: linear-gradient(to right, rgb(201 216 252 / 10%), rgb(57 105 216 / 100%));
  }
</style>
