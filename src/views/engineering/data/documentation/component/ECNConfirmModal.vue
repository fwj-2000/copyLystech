<template>
  <BasicModal
    :width="1000"
    v-bind="$attrs"
    @register="registerModal"
    canFullscreen
    draggable
    title="工程资料维护ECN确认"
    @ok="handleSubmit"
    :showCancelBtn="false"
    :closeFunc="() => false"
    destroy-on-close>
    <div class="h-500px">
      <Grid>
        <template #toolbar-actions>
          <a-space>
            <a-button type="primary" @click="handleStatus(true)">{{ t('common.initiate') }} </a-button>
            <a-button @click="handleStatus(false)">{{ t('common.notInitiate') }} </a-button>
          </a-space>
        </template>
      </Grid>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { reactive, ref, unref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useBaseStore } from '/@/store/modules/base';
  import { cloneDeep, set } from 'lodash-es';
  import { canMakeECN } from '/@/api/engineering/engineeringReview';
  import { isNullOrUnDef } from '/@/utils/is';

  const { createConfirm, createMessage } = useMessage();
  const baseStore = useBaseStore();
  const { t } = useI18n();
  const emit = defineEmits(['submit', 'register']);

  let initList = [];

  const STATUS_OPTIONS = [
    {
      label: '是',
      id: true,
      fullName: t('dict.YesOrNo.1'),
      theme: 'green',
    },
    {
      label: '否',
      id: false,
      fullName: t('dict.YesOrNo.0'),
      theme: 'red',
    },
  ];

  const columns = [
    { type: 'checkbox', field: 'checkbox', width: 70 },
    {
      title: '是否发起ECN',
      field: 'canMakeEcn',
      cellRender: {
        name: 'Tag',
        options: STATUS_OPTIONS,
      },
      width: 120,
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 220,
    },
    {
      title: '资料类型',
      field: 'docType',
      width: 180,
    },
    {
      title: '版本',
      field: 'version',
      formatter: ({ cellValue, column, row }) => {
        const { field } = column;
        column.copyDataRow = field;
        let value;
        if (isNullOrUnDef(cellValue)) {
          value = '/';
        } else {
          value = `T${cellValue}`;
        }
        set(row, `copyData.${column.field}`, value);
        return value;
      },
    },
    {
      title: '上一版本PD',
      field: 'prevPDName',
      width: 220,
    },
  ];
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      columns,
      rowConfig: {
        keyField: 'id',
      },
      data: [],
      height: '',
      minHeight: '500px',
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'CommonCol',
      },
      pagerConfig: {
        enabled: false,
      },
      toolbarConfig: {
        enabled: true,
        refresh: false,
        custom: false,
      },
    },
  });

  const { reload, loadData, reloadData, getDataSource, getSelectRows, clearSelectedRowKeys } = gridApi;

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  function init(data) {
    initList = data || [];
    console.log('🚀 ~ init ~ initList: ', initList);
    reloadData(data);
    // reload();
  }

  function handleSubmit() {
    changeOkLoading(true);
    console.log('🚀 ~ handleSubmit ~ initList: ', initList);
    canMakeECN(initList).then(({ code, msg }) => {
      if (code == 200) {
        changeOkLoading(false);
        createMessage.success(msg);
        closeModal();
        emit('close');
      }
    });
  }

  function handleStatus(isMakeEcn) {
    const data = getSelectRows();
    let createMessageFlag = false;
    if (isMakeEcn) {
      data.forEach(item => {
        if (item.version == '0') return (createMessageFlag = true);
        const changeIndex = initList.findIndex(initItem => initItem.id == item.id);
        if (changeIndex > -1) {
          initList[changeIndex].canMakeEcn = true;
        }
        item.canMakeEcn = true;
      });
      if (createMessageFlag) {
        createMessage.warning(t('common.ecnV0NotInitiation'));
      }
    } else {
      data.forEach(item => {
        if (item.hasECN) return (createMessageFlag = true);
        const changeIndex = initList.findIndex(initItem => initItem.id == item.id);
        if (changeIndex > -1) {
          initList[changeIndex].canMakeEcn = false;
        }
        item.canMakeEcn = false;
      });
    }

    clearSelectedRowKeys();
  }
</script>
