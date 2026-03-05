<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="handleSearch" @reset="handleReset" />
      </div>

      <div class="lydc-content-wrapper-content bg-white">
        <Grid class="grid-header">
          <template #toolbar-actions>
            <a-space>
              <!-- 批量导出 -->
              <a-button v-auth="'btn_download'" class="mr-12px" @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
          <template #dateField="{ row, $rowIndex, column }">
            <!-- v-if="!isSunday(column.field)" -->
            <!-- <LazyComponent :detailList="row[column.field]?.detailList" :index="$rowIndex" @click="handleClickDate(row[column.field]?.detailList, row)" /> -->
            <div v-if="row[column.field]?.totalTime" @click="handleClickDate(row[column.field]?.detailList, row)" class="table-a"
              >{{ row[column.field]?.totalTime }}H</div
            >
            <!-- <div v-else>{{ t('dict.dutyType.2') }}</div> -->
          </template>
        </Grid>
      </div>
    </div>
    <ProcessModal @register="registerProcess" @reload="reload"> </ProcessModal>
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ref, onMounted, defineAsyncComponent, nextTick } from 'vue';
  import { processscheduleplan, saveprocesscapacity, processscheduleplanExport } from '/@/api/engineering/mould';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getFormSchema, column } from './config';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import { BasicForm, useForm } from '/@/components/Form';
  import { transformI18nVxeTable } from '/@/utils/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDate } from '/@/views/engineering/mouldRoom/moldMasterPlan/hooks/useDate.ts';
  import ProcessModal from './components/ProcessModal.vue';
  import dayjs from 'dayjs';
  import { cloneDeep } from 'lodash-es';
  import { message } from 'ant-design-vue';

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const { createMessage } = useMessage();
  defineOptions({ name: 'engineering-mouldRoom-processSchedule' });
  const [registerProcess, { openModal: openProcess }] = useModal();

  const LazyComponent = defineAsyncComponent(() => import('./components/DataComponent.vue'));

  const tableColumns = ref<any[]>([]);

  const [registerForm, { getFieldsValue, clearValidate }] = useForm({
    baseColProps: { span: 5 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    autoAdvancedLine: 1,
    actionColOptions: {
      span: 4,
    },
    schemas: getFormSchema(),
    fieldMapToTime: [['pickerVal', ['startDate', 'endDate']]],
    i18nConfig: {
      moduleCode: 'ProcessScheduleColumn',
      transferRange: ['placeholder'],
    },
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-processSchedule-list',
      columns: column,
      api: processscheduleplan,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      proxyConfig: {
        autoLoad: false,
      },
      scrollX: {
        enabled: true,
      },
      scrollY: {
        enabled: false,
      },
      rowConfig: {
        isCurrent: false,
        isHover: false,
      },
      columnConfig: {
        useKey: true,
        isCurrent: false,
        isHover: false,
      },
      cellClassName: ({ row, column }) => {
        // if (isSunday(column.field)) {
        //   return 'rest-cell';
        // }
        if (column.field === 'totalLoad') {
          if (!row.totalLoad) {
            return 'gray-cell';
          }
          if ((row.totalLoad || 0) < (row.normCapacity || 0)) {
            return 'green-cell';
          }
          if ((row.totalLoad || 0) >= (row.normCapacity || 0)) {
            return 'pink-cell';
          }
        }
      },
      beforeFetch: params => {
        return {
          ...params,
          ...getFieldsValue(),
          startDate: dayjs(getFieldsValue().startDate).valueOf(),
          endDate: dayjs(getFieldsValue().endDate).valueOf(),
          processS: getFieldsValue().processS && getFieldsValue().processS.join(','),
        };
      },
      afterFetch: async ({ list }) => {
        // 设置表格单元格合并
        // setTimeout(() => {
        //   setMergeCells(list);
        // }, 200);
        gridApi?.grid.reloadData(transfromTableData(list));
      },
      i18nConfig: {
        moduleCode: 'ProcessScheduleColumn',
      },
    },
    gridEvents: {
      editClosed: ({ row }) => {
        submitFn(row);
      },
    },
  });
  const { reload, reloadColumn } = gridApi;

  async function handleSearch() {
    await reload();
    setTableColumns();
  }

  function forMatDateArray(arr: any[]) {
    const dateObj = {};
    arr.forEach((item: { planDate: string | number | Date | dayjs.Dayjs | null | undefined }) => {
      dateObj[dayjs(item.planDate).format('YYYY-MM-DD')] = item;
    });
    return dateObj;
  }

  function transfromTableData(dataSource: any[]) {
    const _data = cloneDeep(dataSource);
    const tableData = _data.map(item => {
      if (item.planDataList && item.planDataList.length) {
        const dateArray = forMatDateArray(item.planDataList);
        return {
          process: item.process,
          processId: item.processId,
          processName: item.processName,
          totalLoad: item.totalLoad,
          normCapacity: item.normCapacity,
          ...dateArray,
        };
      } else {
        return { ...item };
      }
    });
    return tableData;
  }

  async function handleReset() {
    clearValidate();
    await reload();
    setTableColumns();
  }

  async function submitFn(row) {
    const { msg } = await saveprocesscapacity({ process: row.process, normCapacity: row.normCapacity });
    message.success(msg);
  }

  function isSunday(date) {
    return dayjs(date).day() === 0; // 0 表示星期日
  }

  const handleClickDate = (detailList, row) => {
    return; //暂时关掉弹窗，确定不要弹窗了之后再删掉代码
    if (!hasBtnP('btn_detail')) return createMessage.warning(t('dict.CommonCol.noViewPermissionTip'));
    openProcess(true, { detailList, row });
  };

  // 批量导出
  const handleExport = async () => {
    processscheduleplanExport({
      startDate: dayjs(getFieldsValue().startDate).valueOf(),
      endDate: dayjs(getFieldsValue().endDate).valueOf(),
      processS: getFieldsValue().processS && getFieldsValue().processS.join(','),
    }).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
    });
  };

  const updateColumn = async array => {
    const list = [...column, ...array];
    tableColumns.value = list;
    await reloadColumn(transformI18nVxeTable(list));
  };

  /** 设置表格单元格合并 */
  async function setMergeCells(list: Array<any>) {
    await nextTick(() => gridApi.grid.clearMergeCells());
    const mergeCells: any = [];
    // 计算出周日的字段
    const rowLen = list.length;
    tableColumns.value.forEach((item, index) => {
      if (isSunday(item.field)) {
        mergeCells.push({
          row: 0,
          col: index,
          rowspan: rowLen,
          colspan: 1,
        });
      }
    });
    return gridApi.grid.setMergeCells(mergeCells);
  }

  const setTableColumns = async () => {
    nextTick(() => {
      const { startDate, endDate } = getFieldsValue();
      const defaultDate = [startDate, endDate];
      const showHolidays = false;
      const format = 'MM-DD';
      const { dateArray } = useDate(defaultDate, showHolidays, format);

      updateColumn(
        dateArray.map(item => {
          return {
            ...item,
            width: 120,
            resizable: true,
            showOverflow: false,
          };
        }),
      );
    });
  };

  onMounted(async () => {
    setTableColumns();
    setTimeout(() => {
      reload();
    }, 100); // 延迟调用 防止日期查询默认值未正确生效
  });
</script>

<style lang="less" scoped>
  .lydc-content-wrapper {
    ::v-deep(.vxe-body--column) {
      // .vxe-cell {
      //   height: auto !important;
      // }

      // .vxe-cell--wrapper {
      //   line-height: 50px;
      // }
    }

    ::v-deep(.vxe-cell--wrapper) {
      // height: 100%;
      .total-load {
        height: 100%;
        display: flex;
        align-items: center;
      }

      .plan-block {
        .plan-item {
          display: flex;
          align-items: center;
          padding: 0 4px;
          height: 22px;
          font-size: 14px;
          line-height: 22px;
          border-radius: 4px;
          background-color: #ffefe0;
          width: fit-content;

          .drop {
            width: 8px;
            height: 8px;
            background: #ff7b00;
            border-radius: 50%;
          }

          .time {
            color: #3d3d3d;
            margin: 0 6px;
          }

          .hour {
            color: #1890ff;
          }
        }
      }
    }
  }

  ::v-deep(.green-cell) {
    height: 100%;
    border-left: 4px solid #04bb78;
    background: #cff4e6;
  }

  ::v-deep(.pink-cell) {
    height: 100%;
    border-left: 4px solid #ff4d4f;
    background: #fee;
  }

  ::v-deep(.gray-cell) {
    height: 100%;
    border-left: 4px solid #a2a2a2;
    background: #e8e8e8;
  }

  ::v-deep(.rest-cell) {
    color: #ff7b00;
    background-color: rgb(255 123 0 / 10%);
  }

  ::v-deep(.grid-header) {
    .vxe-header--row {
      height: 80px;
    }

    .vxe-header--column {
      .vxe-cell--wrapper {
        display: flex;
      }
    }

    .vxe-cell--title {
      display: flex;
      flex-wrap: wrap;
      // justify-content: center;
      // text-align: center;
      align-items: center;
      // width: 100%;
    }

    .header-week {
      width: 100%;
      border-bottom: 1px solid var(--vxe-ui-table-border-color);
      padding-bottom: 4px;
    }

    .header-date {
      display: flex;
      width: 100%;
      flex: 1;
      flex-wrap: nowrap;
      padding-top: 6px;
    }
  }
</style>
