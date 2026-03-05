<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';

  interface UploadFileItem {
    fileName?: string;
    filePath?: string;
  }

  withDefaults(
    defineProps<{
      items: UploadFileItem[];
      allowDelete?: boolean;
    }>(),
    {
      items: () => [],
      allowDelete: false,
    },
  );

  const emit = defineEmits<{
    (e: 'preview', item: UploadFileItem): void;
    (e: 'download', item: UploadFileItem): void;
    (e: 'delete', index: number): void;
  }>();

  const { t } = useI18n();
</script>

<template>
  <div class="file-upload-wrapper-box">
    <div class="file-upload-wrapper">
      <b class="mr-10px">{{ t('common.attachment') }}:</b>
      <template v-for="(item, index) in items" :key="item.filePath || item.fileName || index">
        <div class="item-list mx-5px">
          <a @click.stop="emit('preview', item)" class="item-file-name ellipsis">{{ item.fileName }}</a>
          <div>
            <a-button type="link" @click="emit('download', item)">
              <template #icon>
                <i class="icon-ym icon-ym-btn-download"></i>
              </template>
            </a-button>
            <a-button v-if="allowDelete" type="link" @click="emit('delete', index)">
              <template #icon>
                <i class="icon-ym icon-ym-delete"></i>
              </template>
            </a-button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="less" scoped>
  .file-upload-wrapper-box {
    box-sizing: border-box;
    height: max-content;
    padding: 0 12px 8px;
  }

  .file-upload-wrapper {
    padding: 4px 0 4px 4px;
    width: 100%;
    display: flex;
    line-height: 24px;
    flex-flow: row wrap;
    height: max-content;
    align-items: center;
    background: #f7f7f7;
    border-radius: 4px;
  }

  .item-list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .ellipsis {
    overflow: hidden; /* 隐藏溢出的内容 */
    white-space: nowrap; /* 不换行 */
    text-overflow: ellipsis; /* 用省略号表示溢出的内容 */
    max-width: 75%;
  }
</style>
