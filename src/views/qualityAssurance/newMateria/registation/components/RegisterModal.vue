<template>
  <BasicModal :width="1000" v-bind="$attrs" @register="registerModal" canFullscreen draggable title="材料登记" @ok="handleSubmit" destroy-on-close>
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-button v-auth="'btn_transfer'" type="primary" @click="handleBatchTransfer">{{ t('common.transfer') }}</a-button>
      </template>
    </BasicTable>
  </BasicModal>
  <TransferModal @register="registerTransferModal" @reload="reload"></TransferModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getListTodo, transfer } from '/@/api/quanlity/newMetarial';
  import { commonColumns } from '../config';
  import { formatTableDefaultText } from '/@/utils';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TransferModal } from '/@/components/CustomComponents/index';
  import { message } from 'ant-design-vue';

  const emit = defineEmits(['submit', 'register']);

  const [registerModal] = useModalInner();
  const [registerTransferModal, { openModal }] = useModal();
  const { t } = useI18n();

  const formatColmns = () => {
    const _cols = commonColumns.filter(el => {
      return el.dataIndex != 'materialNumber';
    });
    _cols.push({
      title: 'SQE',
      dataIndex: 'qualityDesensitizationUserName',
    });
    return _cols;
  };

  const [registerTable, { getSelectRowKeys, reload }] = useTable({
    api: getListTodo,
    beforeFetch: params => {
      params.isEnd = 0;
      return params;
    },
    columns: formatColmns(),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: {
      schemas: [
        {
          field: 'applyNumber',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '来源单号',
          },
        },
        {
          field: 'InsidePartNumber',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '产品内部料号',
          },
        },
        {
          field: 'supplierName',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '供应商名称',
          },
        },
        {
          field: 'manufacturerMaterialsCode',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '供应商材料编码',
          },
        },
        {
          field: 'qualityDesensitizationUserId',
          label: '',
          component: 'CustomUserSelect',
          componentProps: {
            placeholder: 'SQE',
          },
        },
      ],
    },
    showTableSetting: false,
    // immediate: false,
    rowSelection: { type: 'checkbox' },
    isCanResizeParent: false,
    canResize: true,
    resizeHeightOffset: -70,
    scroll: {
      y: 430,
    },
    clickToRowSelect: true,
    transformCellText: ({ text }) => formatTableDefaultText(text),
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
    },
  });

  const handleBatchTransfer = async () => {
    const ids = getSelectRowKeys();
    if (ids && ids.length === 0) {
      return message.info(t('common.selectText'));
    }
    openModal(true, {
      id: ids || [],
      api: transfer,
      beforeFetch: params => {
        return {
          ids: ids,
          transferUserId: params.transferUser,
          transferRemarks: params.remark,
        };
      },
    });
  };

  function handleSubmit() {
    const rows = getSelectRowKeys();
    emit('submit', rows);
  }
</script>
