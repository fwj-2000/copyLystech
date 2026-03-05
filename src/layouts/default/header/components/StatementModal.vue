<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="官方声明" :footer="null" :width="400" class="about-modal">
    <div class="about-modal-main">
      LYDC说明
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';

  const [registerModal] = useModalInner();
</script>
