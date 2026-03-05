<template>
  <span v-for="(item, index) in infoList" :key="item.filePath" class="table-a mr-1" @click="handleClick(item)">
    {{ item.fileName }}
    <i class="table-a icon-ym icon-ym-btn-download inline-block" style="transform: translateY(3px)" @click.stop="() => handleDownload(item)" />
    <span v-if="index < infoList.length - 1">、</span>
  </span>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { downloadFile } from '/@/utils/file/download';

  const props = defineProps({
    list: {
      type: Array || String,
      default: () => {
        return [];
      },
    },
  });

  const infoList = computed(() => {
    let list = props.list;
    if (typeof list === 'string') {
      list = JSON.parse(list);
    }
    if (!list || list.length === 0) {
      return [];
    }
    return list.map((item: any) => {
      return {
        fileName: item.fileName || item.name || item.fileName || item.originalName,
        filePath: item.filePath || item.path || item.fullPath || item.url,
      };
    });
  });

  const emit = defineEmits(['click']);
  function handleClick(item) {
    emit('click', item);
  }

  function handleDownload(item: any) {
    downloadFile({
      filePath: item.filePath,
      fileName: item.fileName,
    });
  }
</script>

<style lang="less" scoped>
  .table-a {
    color: hsl(209deg 100% 55% / 100%);
    cursor: pointer;
    transition: color 0.3s;
  }
</style>
