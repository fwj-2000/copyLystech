<template>
  <div class="file-info">
    <div class="file-info__title" v-if="$slots.title">
      <slot name="title"></slot>
    </div>
    <div class="file-row">
      <div v-for="(item, index) in props.fileList" :key="index" class="file-item">
        <a class="file-name" @click.stop="handlePreview(item)">
          {{ item.fileName }}
        </a>

        <!-- 下载 -->
        <a-button type="link" @click="handleDownload(item)" class="icon-btn">
          <template #icon>
            <i class="icon-ym icon-ym-btn-download text-blue-400"></i>
          </template>
        </a-button>

        <!-- 删除 -->
        <a-button v-if="props.editable" type="link" @click="handleDelete(index)" class="icon-btn">
          <template #icon>
            <i class="icon-ym icon-ym-delete text-red-500"></i>
          </template>
        </a-button>
      </div>
    </div>
    <PreviewModal ref="filePreviewRef" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { PreviewModal } from '/@/components/Upload';
  import { downloadFile } from '/@/utils/file/download';
  import type { PropType } from 'vue';

  interface FileItem {
    fileName: string;
    filePath: string;
    [key: string]: any;
  }

  const props = defineProps({
    editable: { type: Boolean, default: false },
    fileList: {
      type: Array as PropType<FileItem[]>,
      default: () => [],
    },
  });

  const emits = defineEmits<{
    (e: 'update:fileList', value: FileItem[]): void;
  }>();

  const filePreviewRef = ref<InstanceType<typeof PreviewModal> | null>(null);

  function handlePreview(item: FileItem) {
    filePreviewRef.value?.init({
      name: item.fileName,
      url: item.filePath,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
      version: 2,
    });
  }

  function handleDownload(item: FileItem) {
    downloadFile({
      url: item.filePath,
      fileName: item.fileName,
      target: '_blank',
    });
  }

  function handleDelete(index: number) {
    const next = props.fileList.slice();
    next.splice(index, 1);
    emits('update:fileList', next); // 交给父组件更新
  }
</script>

<style scoped lang="less">
  .file-row {
    display: flex;
    flex-wrap: wrap;
    gap: 50px; /* 文件之间的间距 */
  }

  .file-item {
    display: flex;
    align-items: center;
  }

  .file-name {
    color: #409eff;
    cursor: pointer;
    margin-right: 4px;
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .icon-btn {
    padding: 0;
    margin: 0 2px;
  }
</style>
