<template>
  <BasicModal
    :width="1200"
    v-bind="$attrs"
    @register="registerModal"
    canFullscreen
    draggable
    :title="t('common.UrgingText')"
    :confirm-loading="confirmLoading"
    @ok="handleSubmit"
    destroy-on-close>
    <div style="height: 500px">
      <Grid />
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import type { VxeGridPropTypes } from 'vxe-table';

  import { h, reactive, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { approveStatusList } from './tableConfig';
  import { pick } from 'lodash-es';
  import { bulkUrge } from '/@/api/business/filingLogReview';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Checkbox } from 'ant-design-vue';

  const { createMessage } = useMessage();
  const { t } = useI18n();
  const emit = defineEmits(['submit', 'register']);

  /** 表格 - 状态 */
  const state = reactive({
    /** PD 是否全选 */
    pdUrgingAll: false,
    /** PD 是否半选 */
    pdUrgingAllIndeterminate: false,
    /** PD 选中数量 */
    pdUrgingLen: 0,
    /** 生产是否全选 */
    produceUrgingAll: false,
    /** 生产是否半选 */
    produceUrgingAllIndeterminate: false,
    /** 生产选中数量 */
    produceUrgingLen: 0,
  });

  /** 表格 - 行选择改变时触发 */
  function changeState(checked: boolean, field: 'pdUrging' | 'produceUrging') {
    const len = checked ? state[`${field}Len`] + 1 : state[`${field}Len`] - 1;
    state[`${field}Len`] = len;
    const rows = gridApi.getDataSource();
    state[`${field}All`] = len === rows.length;
    state[`${field}AllIndeterminate`] = len > 0 && len < rows.length;
  }

  function updateUrginAll(checked: boolean, field: 'pdUrging' | 'produceUrging') {
    const rows = gridApi.getDataSource();
    rows.forEach(row => (row[field] = checked));
    Object.assign(state, {
      [`${field}All`]: checked,
      [`${field}AllIndeterminate`]: false,
      [`${field}Len`]: checked ? rows.length : 0,
    });
  }

  /** 表格 - 列配置 */
  const columns: VxeGridPropTypes.Columns = [
    {
      type: 'seq',
      field: 'seq',
      width: 50,
    },
    {
      title: '工厂',
      field: 'factory',
      width: 110,
      formatter: ({ row }) => [row.factory, row.factoryName].filter(Boolean).join(' / '),
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 180,
      i18nField: 'CommonCol.insidePartNumber',
    },
    {
      title: '工程数据',
      field: 'engineeringStatus',
      width: 90,
      cellRender: {
        name: 'Tag',
        options: approveStatusList as any,
      },
    },
    {
      title: '',
      field: 'pdUrging',
      width: 30,
      className: 'border-right-none',
      headerClassName: 'border-right-none',
      slots: {
        default: ({ row }) =>
          h(Checkbox, {
            checked: row.pdUrging,
            'onUpdate:checked': (val: boolean) => {
              row.pdUrging = val;
              changeState(val, 'pdUrging');
            },
          }),
        header: () =>
          h(Checkbox, {
            checked: state.pdUrgingAll,
            indeterminate: state.pdUrgingAllIndeterminate,
            'onUpdate:checked': (val: boolean) => {
              updateUrginAll(val, 'pdUrging');
            },
          }),
      },
    },
    {
      title: 'PD',
      field: 'pdPersonId',
      i18nField: 'pdPersonName',
      width: 320,
      showOverflow: false,
      editRender: {
        name: 'CustomUserSelect',
        props: {
          multiple: true,
        },
      },
    },
    {
      title: '生产数据',
      field: 'produceStatus',
      width: 90,
      cellRender: {
        name: 'Tag',
        options: approveStatusList as any,
      },
    },
    {
      title: '',
      field: 'produceUrging',
      width: 30,
      className: 'border-right-none',
      headerClassName: 'border-right-none',
      slots: {
        default: ({ row }) =>
          h(Checkbox, {
            checked: row.produceUrging,
            'onUpdate:checked': (val: boolean) => {
              row.produceUrging = val;
              changeState(val, 'produceUrging');
            },
          }),
        header: () =>
          h(Checkbox, {
            checked: state.produceUrgingAll,
            indeterminate: state.produceUrgingAllIndeterminate,
            'onUpdate:checked': (val: boolean) => {
              updateUrginAll(val, 'produceUrging');
            },
          }),
      },
    },
    {
      title: '生产维护人',
      field: 'produceCreateId',
      i18nField: 'produceCreateName',
      width: 320,
      showOverflow: false,
      editRender: {
        name: 'CustomUserSelect',
        props: {
          multiple: true,
        },
      },
    },
  ];

  /** 表格所需字段 */
  const fields: Array<string> = columns.reduce<Array<string>>(
    (prev, cur) => {
      if (cur.field) prev.push(cur.field);
      return prev;
    },
    ['id'],
  );

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      columns,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      i18nConfig: {
        moduleCode: 'CAApplyColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
        autoHidden: false,
      },
      showOverflow: false,
      currentColumnConfig: {
        isFollowSelected: false,
      },
      columnConfig: {
        isCurrent: false,
      },
      position: 'modal',
    },
  });

  const [registerModal, { closeModal }] = useModalInner(init);

  /** 初始化 */
  function init(data: { list: Array<any> }) {
    Object.assign(state, {
      pdUrgingAll: false,
      pdUrgingAllIndeterminate: false,
      pdUrgingLen: 0,
      produceUrgingAll: false,
      produceUrgingAllIndeterminate: false,
      produceUrgingLen: 0,
    });

    const list = Array.isArray(data?.list) ? data.list : [];

    // 表格加载数据
    gridApi.reloadData(
      list.map(item => {
        return {
          ...pick(item, fields),
          pdPersonId: [item.pdPersonId].filter(Boolean),
          pdPersonName: item.pdPersonName || '',
          pdUrging: false,
          produceCreateId: [item.produceCreateId].filter(Boolean),
          produceCreateName: item.produceCreateName || '',
          produceUrging: false,
        };
      }),
    );
  }

  const confirmLoading = ref<boolean>(false);
  /** 提交 */
  async function handleSubmit() {
    const rows = gridApi.getDataSource();

    const list = rows.reduce<Array<{ id: string; pdPersonIds?: Array<string>; produceCreateIds?: Array<string> }>>((pre, cur) => {
      if (!cur.pdUrging && !cur.produceUrging) return pre;
      pre.push({
        id: cur.id,
        pdPersonIds: cur.pdUrging ? cur.pdPersonId : [],
        produceCreateIds: cur.produceUrging ? cur.produceCreateId : [],
      });
      return pre;
    }, []);

    confirmLoading.value = true;
    return bulkUrge(list)
      .then(() => {
        createMessage.success(t('common.operatorSuccess'));
        closeModal();
      })
      .finally(() => {
        confirmLoading.value = false;
      });
  }
</script>

<style lang="less" scoped>
  :deep(.vxe-table--render-default.border--full) {
    .vxe-header--column.border-right-none,
    .vxe-body--column.border-right-none {
      background-image: linear-gradient(transparent, transparent), linear-gradient(var(--vxe-ui-table-border-color), var(--vxe-ui-table-border-color));
    }
  }
</style>
