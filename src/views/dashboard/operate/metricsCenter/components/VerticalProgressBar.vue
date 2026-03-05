<template>
  <div class="progress-container">
    <div class="progress-bar" :style="{ height: props.progress + '%' }"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  progress: {
    type: Number,
    default: 0
  }
})

</script>

<style scoped>
.progress-container {
  height: 100%;
  width: 100%;
  background-color: #f3f3f3;
  position: relative;
}

.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: #3e7bfa;
  width: 100%;
  transition: height 0.3s ease;
}
</style>