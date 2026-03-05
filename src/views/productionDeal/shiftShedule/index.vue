<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white h-full">
        <Grid ref="tableRef" class="grid-header">
          <template #seq="data">
            <!-- <span v-if="!data.row.parentId">
              {{ data.row.processName }}工序: 总数 <span class="text-[#1890FF] font-bold text-l"> {{ data.row.total }}</span>
            </span> -->
            <!-- <span>
              {{ data.seq == '1' ? 1 : Number(data.seq) - 1 }}
            </span> -->
          </template>
          <template #toolbar-actions>
            <div>
              <a-button class="mr-16px" type="primary" @click="handleAdd">{{ t('common.addText') }}</a-button>
              <a-button class="mr-16px" v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')" @click="handleExport">{{ t('common.batchExport') }}</a-button>
              <a-button type="error" ghost @click="handleRemove">{{ t('common.batchDelText') }}</a-button>
            </div>
          </template>
          <template #action="{ row }">
            <div class="flex">
              <TableAction :actions="getTableActions(row)" />
            </div>
            <!-- <a-button type="error" ghost @click="handleExport">{{ t('common.batchDelText') }}</a-button> -->
          </template>
        </Grid>
      </div>
    </div>
    <ShedulePop @register="registerShedulePop" @reload="reload" />
  </div>
  <ExportModal @register="registerExportModal" />
</template>

<script setup lang="ts">
  import { ActionItem, TableAction } from '/@/components/Table';
  import { onMounted, reactive, ref, unref } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { IdateResult, useDate } from './hooks/useDate';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { VxeGridPropTypes } from 'vxe-table';
  import { batchDeleteShiftschedule, batchExportShiftschedule, getShiftschedule } from '/@/api/productionDeal/shiftSchedule';
  import { useBaseStore } from '/@/store/modules/base';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePopup } from '/@/components/Popup';
  import ShedulePop from './components/ShedulePop.vue';
  import dayjs from 'dayjs';
  import { useRouter } from 'vue-router';
  import { transformI18nVxeTable } from '/@/utils/index';

  defineOptions({ name: 'productionDeal-shiftShedule' });
  const baseStore = useBaseStore();
  const [registerShedulePop, { openPopup: openShedulePop }] = usePopup();

  const { hasBtnP } = usePermission();
  const { t } = useI18n();
  const { currentRoute } = useRouter();
  type TSTATE = {
    gridOptions: {};
    dateArray: IdateResult[];
  };

  const columns: VxeGridPropTypes.Columns = [
    { type: 'checkbox', field: 'checkbox', width: 60 },
    // { field: 'seq', type: 'seq', title: '序号', width: 60, slots: { default: 'seq' } },
    {
      field: 'dutyPersonName',
      title: '名称',
      // width: 260,
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
    },
    { field: 'classesName', title: '班次', width: 80 },
    {
      field: 'dutyTimeSlot',
      title: '上班时间段',
      width: 120,
    },
    { field: 'dutyDays', title: '上班天数', width: 120 },
    { field: 'relaxDays', title: '休息天数', width: 120 },
    { field: 'restDay', title: '休息日', width: 120 },
    { field: 'factoryAreaName', title: '厂区', width: 120 },
    { field: 'creatorUserName', title: '创建人', width: 240 },
    {
      field: 'creatorTime',
      title: '创建时间',
      width: 160,
      formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : ''),
    },
    { field: 'remark', title: '备注', width: 140 },
    {
      title: '操作',
      field: 'action',
      align: 'center',
      slots: { default: 'action' },
      width: 90,
      fixed: 'right',
    },
  ];

  const gridOptions = {
    api: getShiftschedule,
    size: 'default',
    layout: 'full',
    key: 'id',
    columns,
    height: 'auto',
    minHeight: 600,
    rowConfig: {
      keyField: 'dutyPersonId',
    },
    mouseConfig: {
      area: false, // 是否开启区域选取
    },
    scrollX: {
      enabled: false,
    },
    scrollY: {
      enabled: false,
    },
    spanMethod(data) {
      const { row, $rowIndex: rowIndex, column, visibleData } = data;
      const spanFields = ['checkbox', 'dutyPersonName', 'action', 'factoryAreaName', 'creatorUserName', 'creatorTime', 'restDay', 'remark', 'seq'];
      const diffField = 'dutyPersonId';
      const cellValue = row[diffField];

      if (cellValue && spanFields.includes(column.field)) {
        const prevRow = visibleData[rowIndex - 1];

        // 如果上一行存在且相同，则合并到首行
        if (prevRow && prevRow[diffField] === cellValue) {
          return { rowspan: 0, colspan: 0 };
        }

        // 计算连续相同值的行数
        let countRowspan = 1;
        while (rowIndex + countRowspan < visibleData.length && visibleData[rowIndex + countRowspan][diffField] === cellValue) {
          countRowspan++;
        }

        if (countRowspan > 1) {
          return { rowspan: countRowspan, colspan: 1 };
        }
      }
    },
  };

  const state = reactive<TSTATE>({
    gridOptions,
    dateArray: [],
  });
  const { createMessage, createConfirm } = useMessage();
  const defaultDate = ['2025-01-01', '2025-12-31'];
  const { dateArray } = useDate(defaultDate);
  state.dateArray = dateArray;
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: [
        {
          fieldName: 'dutyPersonName',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '姓名',
          },
        },
        {
          fieldName: 'classes',
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
          colProps: { span: 5 },
        },
      ],
    },
    gridOptions: state.gridOptions,
  });

  onMounted(() => {
    const { dutyPersonId } = unref(currentRoute)?.query;
    gridApi?.setFieldValue('dutyPersonName', dutyPersonId);
    reload();
  });
  function handleAdd({ dutyPersonId }) {
    openShedulePop(true, { dutyPersonId });
  }
  function handleExport() {
    openExportModal(true, {
      api: batchExportShiftschedule,
      listQuery: {
        ...gridApi.getFetchParams(),
      },
      nameProps: 'title',
      idProps: 'field',
      exportOptions: columns,
    });
  }

  function handleRemove(row) {
    let idList: any = [];
    if (row?.dutyPersonId) {
      idList = [row?.dutyPersonId];
    } else {
      idList = gridApi.getSelectRowKeys();
    }
    if (!idList || !idList.length) {
      createMessage.warning(t('common.selectText'));
      return;
    } else {
      createConfirm({
        iconType: 'delete',
        title: t('common.tipTitle'),
        content: t('common.beforeDelTip'),
        onOk: () => {
          try {
            batchDeleteShiftschedule(idList).then(res => {
              createMessage.success(res.msg);
              reload();
            });
          } catch (e) {
            reload();
          }
        },
      });
    }
  }

  function reload() {
    gridApi.reload();
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        // label: t('common.delText'),
        icon: 'icon-ym icon-ym-view',
        onClick: handleEdit.bind(null, record),
        tooltip: t('common.editText'),
        // auth: 'btn_detail',
      },
      {
        // label: t('common.delText'),
        icon: 'icon-ym icon-ym-delete',
        iconType: 'delete',
        onClick: handleRemove.bind(null, record),
        tooltip: t('common.delText'),
        // auth: 'btn_detail',
      },
    ];
  }

  function handleEdit(record) {
    console.log(record);
    handleAdd(record);
  }

  // function hanldeSearch() {}
</script>
