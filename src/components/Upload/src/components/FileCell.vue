<template>
  <span v-for="(item, index) in infoList" :key="item.filePath" class="table-a mr-1" @click="handleClick(item)">
    {{ item.fileName }}
    <span v-if="index < infoList.length - 1">、</span>
  </span>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
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
</script>
