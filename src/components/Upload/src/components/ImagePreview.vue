<template>
  <div>
    <a-image-preview-group :preview="{ visible, onVisibleChange: vis => (visible = vis) }">
      <a-image :width="200" src="https://aliyuncdn.antdv.com/vue.png" />
      <a-image :width="200" src="https://aliyuncdn.antdv.com/logo.png" />
    </a-image-preview-group>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  const visible = ref<boolean>(false);
  const setVisible = (value): void => {
    visible.value = value;
  };
</script>
