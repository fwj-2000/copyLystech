<template>
  <Modal v-model:open="visible" :width="788" :height="660" :footer="null" :destroyOnClose="true" @ok="handleOk" @cancel="handleCancel">
    <template #title>
      <div class="manual-custom-title">
        <span class="tag">|</span>
        <span class="title mr-12px"><span class="pr-8px">机台：</span>{{ detailInfo.title || 'AM01' }}</span>
        <span class="title"><span class="pr-8px">周别：</span>{{ detailInfo.subTitle || '2024WK19' }}</span>
      </div>
    </template>
    <div class="p-24px">
      <BasicTable @register="registerTable"></BasicTable>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { Modal } from 'ant-design-vue';
  import { BasicTable, BasicColumn, useTable } from '/@/components/Table';
  import { getTableList } from '/@/api/extend/table';
  import { useI18n } from '/@/hooks/web/useI18n';

  const props = defineProps(['visible', 'detailInfo']);
  const emits = defineEmits(['close']);

  const visible = ref(false);
  const { t } = useI18n();

  const columns: BasicColumn[] = [
    { title: '2024WK14', dataIndex: 'projectName', key: 'reason', width: 100 },
    { title: '2024WK15', dataIndex: 'projectCode', key: 'reason', width: 100 },
    { title: '2024WK16', dataIndex: 'projectType', key: 'reason', width: 100 },
    { title: '2024WK17', dataIndex: 'reason', key: 'reason', width: 100 },
    { title: '2024WK18', dataIndex: 'reason', key: 'reason', width: 100 },
    { title: '2024WK19', dataIndex: 'reason', key: 'reason', width: 100 },
  ];
  const [registerTable] = useTable({
    api: getTableList,
    columns,
    showIndexColumn: false,
    useSearchForm: false,
    showTableSetting: false,
    bordered: false,
    pagination: false,
    scroll: { x: '600px', y: '560px' },
    formConfig: {
      schemas: [
        {
          field: 'keyword',
          label: t('common.keyword'),
          component: 'Input',
          componentProps: {
            placeholder: t('common.enterKeyword'),
            submitOnPressEnter: true,
          },
        },
      ],
    },
    transformCellText: ({ text }) => {
      if (`${text}` == 'null' || `${text}` == 'undefined') return '-';
      return text.length || typeof text === 'number' ? text : ['-'];
    },
  });

  watch(
    () => props.visible,
    newVal => {
      visible.value = newVal;
    },
    { deep: true },
  );

  const handleOk = () => {
    visible.value = false;
    emits('close');
  };
  const handleCancel = () => {
    visible.value = false;
    emits('close');
  };
</script>

<style lang="less" scoped>
  .manual-custom-title {
    display: flex;
    align-items: center;

    .tag {
      width: 4px;
      color: @primary-color;
      padding: 0 8px;
    }
  }
</style>
