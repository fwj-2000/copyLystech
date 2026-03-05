<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <a-button type="primary" @click="handlePrint" v-auth="'btn_add'">{{ t('common.add') }}</a-button>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'confirmStatus'">
              <a-switch
                v-model:checked="record.confirmStatus"
                :checkedValue="1"
                :unCheckedValue="0"
                @change="onConfirmStatusChange(record)"
                :disabled="!!record.confirmStatus" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <addModal @register="registerAddForm" @reload="reload" />
  </div>
</template>
<script setup lang="ts">
  import { onMounted } from 'vue';
  import { BasicTable, useTable, BasicColumn, FormSchema, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import addModal from '../components/addModal.vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { getManualstart, updateManualStatus } from '/@/api/productionDeal/dieCuttingTally';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getFactoryList } from '/@/api/basicData/factory';

  const { createMessage, createConfirm } = useMessage();

  const baseStore = useBaseStore();

  const { t } = useI18n();
  const columns: BasicColumn[] = [
    { title: '姓名', dataIndex: 'fullName', align: 'left', width: 260 },
    { title: '厂别', dataIndex: 'factoryName', align: 'left', width: 120 },
    { title: '工序', dataIndex: 'workOrderType', align: 'left', width: 120 },
    { title: '组别', dataIndex: 'groupName', align: 'left', width: 120 },
    { title: '班次', dataIndex: 'classesName', sorter: true, align: 'left', width: 100 },
    { title: '开工时间', dataIndex: 'creatorTime', format: 'date|YYYY-MM-DD HH:mm:ss', sorter: true, align: 'left', width: 300 },
    { title: '是否确认开工', dataIndex: 'confirmStatus', sorter: true, align: 'left' },
  ];

  const searchFormSchema: FormSchema[] = [
    {
      field: 'workNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '请输入工号',
      },
      colProps: { span: 4 },
    },
    {
      field: 'factory',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: getFactoryList,
        placeholder: '请选择厂别',
        resultField: 'data',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        labelField: 'Name',
        valueField: 'Code',
      },
      colProps: { span: 4 },
    },
    {
      field: 'classes',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择班次',
        api: () => {
          return baseStore.getDictionaryData('ClassesName');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      colProps: { span: 4 },
    },
  ];

  const [registerAddForm, { openModal: openFormModal, setModalProps }] = useModal();

  const [registerTable, { getForm, reload }] = useTable({
    api: getManualstart,
    title: '',
    columns,
    rowKey: 'Id',
    isCanResizeParent: true,
    canResize: true, //自适应高度
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      autoAdvancedLine: 1, //自动展开行
    },
    striped: true,
    useSearchForm: true, //使用搜索表单
    showTableSetting: true, //刷新按钮,默认打开

    showIndexColumn: false, //显示序号
  });

  // 更改开工状态
  async function onConfirmStatusChange({ id }) {
    try {
      const { code, msg } = await updateManualStatus(id);
      if (code === 200) {
        createMessage.success(msg);
      }
    } catch (error) {
      console.log(error);
    } finally {
      reload();
    }
    // createConfirm({
    //   iconType: 'warning',
    //   title: t('common.tipTitle'),
    //   content: `是否确认开工?`,
    //   onOk: async () => {

    //   },
    //   onCancel: () => {},
    // });
  }

  function handlePrint(data) {
    setModalProps({ width: 500, useWrapper: false });
    openFormModal(true, data);
  }

  onMounted(() => {
    getForm().setProps({
      showResetButton: false,
      submitButtonOptions: {
        text: t('common.searchText'),
        type: 'ghost',
      },
    });
  });
</script>

<style lang="less" scoped>
  ::v-deep(.ant-table-container) {
    padding: 0 0 0 10px !important;
  }
</style>
