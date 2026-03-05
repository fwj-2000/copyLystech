<template>
  <BasicModal
    width="800px"
    v-bind="$attrs"
    @register="registerModal"
    :title="t('dict.CommonCol.materialQuality')"
    showOkBtn
    @ok="handleSubmit"
    @cancel="handleCloseFn"
    destroyOnClose
    wrapClassName="chooseModal">
    <BasicTable @register="registerTable"></BasicTable>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getMaterialClassList } from '/@/api/engineering/mould';
  import { ref, nextTick } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const emit = defineEmits(['select']);
  const { t } = useI18n();

  const activeId = ref();
  const columns = [
    // 材质
    {
      title: t('dict.CommonCol.materialQuality'),
      dataIndex: 'materialClass',
      width: 160,
    },
    // 材料编码
    { title: t('common.materialCode'), dataIndex: 'insidePartNumber', width: 160 },
    // 材料规格
    { title: t('dict.MaterialDevelopImport.materialSpec'), dataIndex: 'specification', width: 160 },
    // 库存数量
    { title: t('common.quantityInStock'), dataIndex: 'quantity', width: 90 },
    // 库存地点
    { title: t('common.storageLocation'), dataIndex: 'sapWarehouse', width: 160 },
  ];

  const [registerModal, { closeModal }] = useModalInner(init);
  const [registerTable, { setSelectedRowKeys, getSelectRowKeys, getDataSource }] = useTable({
    api: getMaterialClassList,
    columns,
    rowKey: x => [x.materialClass, x.specification].join(','), //getSelectRows获取不到数据
    useSearchForm: true,
    formConfig: {
      autoAdvancedLine: 1, //自动展开行
      baseColProps: {
        span: 8,
      },
      schemas: [
        // 材质搜索
        {
          field: 'material',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: t('dict.CommonCol.materialQuality'),
            submitOnPressEnter: true,
          },
        },
      ],
    },
    rowSelection: {
      type: 'radio',
      hideSelectAll: true,
    },
    showTableSetting: false,
  });
  function handleSubmit() {
    let key = getSelectRowKeys()[0];
    let sels = getDataSource().filter(x => [x.materialClass, x.specification].join() == key);
    emit('select', { list: sels, id: activeId.value });
    closeModal();
  }
  function handleCloseFn() {
    closeModal();
  }
  function init({ id, materials }) {
    activeId.value = id;
    if (!materials) return;
    const selectList = [materials];
    nextTick(() => {
      setSelectedRowKeys(selectList.length ? selectList : []);
    });
  }
</script>

<style lang="less" scoped>
  :deep(.ant-table-body) {
    height: 380px !important;
  }
</style>
