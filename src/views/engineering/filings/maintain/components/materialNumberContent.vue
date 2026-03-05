<!-- 
 * 主材材料料号内容展示
-->
<template>
  <div class="vxe-cell">
    <span v-for="item in dataList" :key="item" class="table-a" @click="() => handleFileView(item)">{{ item }} </span>
    <FileListModal @register="registerFileList" />
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { fileDownload } from '/@/api/purchase/importMateria';
  import { getTechnologyInfoHistory } from '/@/api/engineering/customsAffairsEngineering';

  import { FileListModal } from '/@/components/Upload';

  const props = defineProps({
    list: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },
  });

  const [registerFileList, { openModal: openFileList }] = useModal();
  const { t } = useI18n();

  const dataList = computed(() => (Array.isArray(props.list) ? props.list : []));

  /** 查看技术资料 */
  function handleFileView(str: string) {
    openFileList(true, {
      id: '',
      downloadApi: fileDownload,
      listApi: () => getTechnologyInfoHistory(str),
      hideVersion: true,
      title: t('dict.MaterialDevelopApplyColumn.files'),
    });
  }
</script>

<style lang="less" scoped>
  .table-a {
    &:not(:last-child)::after {
      content: '、';
      margin-right: 4px;
      color: #000;
      text-decoration: none;
    }
  }
</style>
