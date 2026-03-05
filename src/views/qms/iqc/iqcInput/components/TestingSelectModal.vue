<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" :draggable="true" showOkBtn @ok="handleSubmit" :width="960">
    <div class="!h-full">
      <BasicForm @register="registerForm">
        <template #formFooter>
          <a-button type="primary" class="ml-3" @click="searchFn">{{ t('common.queryText') }}</a-button>
          <a-button class="ml-3" @click="resetFn">{{ t('common.resetText') }}</a-button>
        </template>
      </BasicForm>
      <div class="h-[460px]">
        <Grid />
      </div>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, nextTick, reactive, readonly } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useBaseStore } from '/@/store/modules/base';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { SAPColumns, STATUS_ENUM } from './config';
  import dayjs from 'dayjs';
  import { getMoldledgerOrder } from '/@/api/qms/iqc';

  interface State {
    dataForm: any;
    checkRowKeys: any[];
    tableData: any[];
    factoryArea: string;
  }
  const state = reactive<State>({
    checkRowKeys: [],
    dataForm: {
      parentId: '',
      parentCategory: '',
      parentOrganizeIdTree: '',
    },
    tableData: [],
    factoryArea: '',
  });
  const emits = defineEmits(['register', 'reload', 'onSelect']);

  const rangePresets = [
    { label: '最近一周', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: '最近两周', value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: '最近一个月', value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: '最近三个月', value: [dayjs().add(-90, 'd'), dayjs()] },
  ];
  const { t } = useI18n();
  const baseStore = useBaseStore();
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  // 其他基础信息
  const SAPFormSchemas: FormSchema[] = [
    {
      field: 'dateVal',
      component: 'DateRange',
      label: '',
      componentProps: {
        presets: rangePresets,
        onChange: e => {
          nextTick(() => {
            searchFn();
          });
        },
      },
      colProps: {
        span: 6,
      },
    },
    {
      field: 'searchKey',
      component: 'Input',
      label: '',
      i18nField: 'syncSapTestOrderSearchKey',
      componentProps: {
        placeholder: '请输入 内部物料编码/供应商编号 搜索',
        onkeydown: e => {
          searchKeyDown(e);
        },
      },
      colProps: {
        span: 8,
      },
    },
  ];
  const [registerForm, { validate, getFieldsValue, resetFields, setFieldsValue }] = useForm({
    schemas: SAPFormSchemas,
    labelWidth: 120,
    actionColOptions: { span: 24 },
    //autoSubmitOnEnter: true,
    //submitFunc: handleSubmit,
    fieldMapToTime: [['dateVal', ['startTime', 'endTime']]],
  });

  const gridEvents = {
    checkboxChange() {
      const grid = gridApi.grid;
      const selectRows = grid.getCheckboxRecords(true);
      if (state.tableData.length == 0) {
        state.tableData = gridApi.getDataSource();
      }

      if (selectRows.length > 0) {
        const innerMaterialCode = selectRows[0].innerMaterialCode;
        const nowData = state.tableData.filter(x => x.innerMaterialCode == innerMaterialCode);
        gridApi.reloadData(nowData);
        selectRows.forEach(item => {
          grid.setCheckboxRow(item, true); // 表格重载之后 选中当前行
        });
      } else {
        gridApi.reloadData(state.tableData);
      }
    },
  };

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      api: params => getMoldledgerOrder({ ...params, ...getFieldsValue(), status: 2, factoryArea: state.factoryArea }),
      columns: SAPColumns,
      virtualXConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: 'lotNo',
      },
      mouseConfig: {
        area: false,
      },
      checkboxConfig: {
        checkRowKeys: state.checkRowKeys,
        checkMethod: ({ row }) => {
          const grid = gridApi.grid;
          const selectRows = grid.getCheckboxRecords(true)[0];
          if (selectRows) {
            if (selectRows.innerMaterialCode === row.innerMaterialCode) {
              return row.applyState === STATUS_ENUM.禁用;
            } else {
              return false;
            }
          }
          return row.applyState === STATUS_ENUM.禁用;
        },
      },
      keyboardConfig: {
        isBack: false,
      },
      pagerConfig: {
        pageSize: 500,
        //   enabled: false,
        //   autoHidden: false,
      },
      toolbarConfig: {
        refresh: false,
        custom: false,
      },
    },
    gridEvents,
  });

  const getTitle = computed(() => t('common.add1Text'));

  function searchFn() {
    gridApi?.clearSelectedRowKeys();
    state.tableData = [];
    gridApi?.query();
  }
  function reloadFn() {
    gridApi?.clearSelectedRowKeys();
    state.tableData = [];
    gridApi?.reload();
  }

  function resetFn() {
    resetFields();
    setTimeout(() => {
      gridApi?.clearSelectedRowKeys();
      state.tableData = [];
      gridApi?.query();
    }, 300);
  }

  function queryFn() {
    gridApi.query();
  }
  function init({ data, checkRowKeys, factoryArea }) {
    state.checkRowKeys = checkRowKeys;
    state.factoryArea = factoryArea;
    queryFn();
    // getLotnolistListFn();
  }

  //扫码之后，分割字符串中内容
  const searchKeyDown = e => {
    if (e.keyCode !== 13) return;
    // 料号 或者 料号,XX CF-XJTX05B-AB001,ZXT06
    const searchKey = e.target.value.replace('，', ',').split(',')[0];
    setFieldsValue({ searchKey: searchKey }); // 设置表单值
    setTimeout(() => {
      searchFn(); // 执行查询
    }, 500);
  };

  //提交
  async function handleSubmit() {
    const grid = gridApi.grid;
    const selectRows = grid.getCheckboxRecords(true);
    if (selectRows.length === 0) return createMessage.error(t('common.selectText'));
    emits('onSelect', selectRows);
    closeModal();
  }
</script>
