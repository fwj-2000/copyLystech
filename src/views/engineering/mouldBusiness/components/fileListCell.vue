<template>
  <template v-if="firstFile">
    <a-tooltip :title="t('common.clickView')">
      <FileDoneOutlined class="table-a mr-5px" @click="handleDesensitizeList" />
    </a-tooltip>
    <span class="table-a" @click="handlePreview">{{ firstFile?.fileName || '' }}</span>
    <Preview ref="filePreviewRef" />
    <FileListModal :isShowVersion="props.isShowVersion" @register="registerFileList" @fileChange="(...args) => emits('fileChange', ...args)" />
  </template>
  <template v-else-if="props.row.moldDrawingsId">
    <FileListCellLegacy :row="props.row" />
  </template>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';

  import { FileDoneOutlined } from '@ant-design/icons-vue';
  import Preview from '/@/components/Upload/src/components/Preview.vue';
  import FileListModal from './fileListModal.vue';
  import FileListCellLegacy from './fileListCellLegacy.vue';

  const props = defineProps({
    list: {
      type: Array as PropType<Array<{ fileName: string; filePath: string }>>,
      default: () => [],
    },
    row: {
      type: Object as any,
      default: () => ({}),
    },
    isShowVersion: {
      type: Boolean,
      default: false,
    },
  });

  const emits = defineEmits(['fileChange']);

  const { t } = useI18n();

  const firstFile = computed(() => (Array.isArray(props.list) ? props.list[0] : void 0));

  const [registerFileList, { openModal: openFileList }] = useModal();
  /**
   * 打开脱敏图纸列表弹框
   * @param row
   */
  function handleDesensitizeList() {
    openFileList(true, { list: props.list });
  }

  const filePreviewRef = ref<InstanceType<typeof Preview>>();
  async function handlePreview() {
    const data = firstFile.value;
    if (!data) {
      return;
    }

    filePreviewRef.value?.init({
      filePath: data.filePath,
      version: 2,
      // @ts-ignore
      name: data.fileName,
    });
  }
</script>
