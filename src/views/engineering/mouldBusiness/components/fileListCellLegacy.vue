<!-- 
 * 有用 ！！！！
 * 支持模旧图纸查看的，不能删！！！
 * 如果要删，请明确【模具申请】及后续流程的模具数据不需要兼容旧数据的图纸展示，或者旧数据图纸已移到【图纸库】，此时可以删 ！！！
-->
<template>
  <a class="table-a" @click="previewFile">
    {{ props.row.moldDrawingsName }}
  </a>
  <Preview ref="filePreviewRef" />
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';

  const props = defineProps({
    row: {
      type: Object,
      default: () => ({}),
    },
  });

  const filePreviewRef = ref<InstanceType<typeof Preview>>();

  function previewFile() {
    filePreviewRef.value &&
      filePreviewRef.value.init({
        name: props.row.moldDrawingsName,
        Id: props.row.moldDrawingsId,
        previewType: 'localPreview',
        noCache: false,
        isCopy: 0,
      });
  }
</script>
