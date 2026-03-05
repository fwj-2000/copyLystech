<template>
  <div class="file-wrap">
    <Empty v-if="!list.length"></Empty>
    <div class="file-list">
      <div class="file-item" v-for="(item, i) in list" :key="item.id">
        <a class="file-name" @dblclick="handlePreview(item)">{{ item.originFileName }}</a>
        <div class="file-actions" v-if="!props.disabled">
          <div class="download" @click="handleDownload(item)">{{ t('common.downloadText') }}</div>
          <div class="delete" @click="handleDel(item, i)">{{ t('common.delText') }}</div>
        </div>
      </div>
    </div>
  </div>
  <PreviewModal ref="filePreviewRef" />
</template>
<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue';
  import Empty from '/@/components/Lydc/Empty/src/Empty.vue';
  import { downloadByUrl } from '/@/utils/file/download';
  import { PreviewModal } from '/@/components/Upload';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { message } from 'ant-design-vue';

  const { t } = useI18n();
  const props = defineProps({
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    downloadApi: {
      type: Object,
      default: () => {
        return null;
      },
    },
    delApi: {
      type: Object,
      default: () => {
        return null;
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });
  const list = ref(props.list);

  watch(
    () => props.list,
    val => {
      list.value = val;
    },
  );

  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(item) {
    const params = {
      name: item.FileName,
      id: item.id,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    filePreviewRef.value?.init(params);
  }

  async function handleDownload(val) {
    const {
      data: { name, url },
    } = await props.downloadApi(val.id);
    downloadByUrl({ url: url, target: '_blank', fileName: name });
  }

  async function handleDel(item, index) {
    const r = await props.delApi(item.id);
    if (r.code === 200) {
      list.value.splice(index, 1);
      message.success(t('sys.api.operationSuccess'));
    }
  }
</script>
<style lang="less" scoped>
  .file-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    margin-bottom: 10px;
    width: 30%;
    border-bottom: 1px solid #eee;
    position: relative;

    &::after {
      content: '';
      width: 1px;
      height: 20px;
      color: #344481;
      position: absolute;
      top: -10px;
      right: 20px;
    }
  }

  .file-name {
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .file-actions {
    display: flex;
    gap: 10px;
  }

  .download,
  .delete {
    cursor: pointer;
    color: #007bff;
  }
</style>
