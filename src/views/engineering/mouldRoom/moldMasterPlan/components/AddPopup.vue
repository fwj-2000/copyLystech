<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :okText="t('dict.NewMoldColumn.issued')"
    :destroyOnClose="true"
    :showOkBtn="false"
    :cancelText="t('common.cancel')"
    :title="t('dict.CommonCol.moldGrandPlan')"
    class="full-popup pb-10px top-0">
    <template #appendToolbar>
      <a-button type="primary" class="mx-12px" @click="handleSaveAction">{{ t('common.saveText') }}</a-button>
    </template>
    <ScrollContainer>
      <!-- 基础信息 -->
      <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
        <div class="title-stick">
          <div class="gun"></div>
          <div class="title">{{ t('common.baseinfo') }}</div>
        </div>
        <BasicForm @register="registerBasicInfoForm"> </BasicForm>
      </a-card>

      <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
        <div class="card-title">
          <div class="card-title-left">
            <div class="title-stick">
              <div class="gun"></div>
              <div class="title">{{ t('routes.productionPlan-mainPlan') }}</div>
            </div>
            <BasicForm class="schedule-form mb-0" @register="registerScheduleForm"> </BasicForm>
          </div>

          <div class="title-legend">
            <div class="legend-item">
              <div class="w-[8px] h-[8px] rounded-[50%] plan-color"></div>
              <div class="legend-name">{{ t('dict.CommonCol.planTime') }}</div>
            </div>

            <div class="legend-item">
              <div class="w-[8px] h-[8px] rounded-[50%] finish-color"></div>
              <div class="legend-name">{{ t('dict.CommonCol.actualCompletionTime') }}</div>
            </div>
          </div>
        </div>
        <DateGrid class="grid-header">
          <template #dateField="{ row, column }">
            <div class="w-full h-full flex justify-center items-center"> {{ row[column.field] === '1' ? t('dict.dutyType.2') : '' }} </div>
          </template>
        </DateGrid>
      </a-card>
    </ScrollContainer>
  </BasicPopup>
  <ClassesSettingModal @register="registerClassesSettingModal" @onSelect="handleClassesSetting" />
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicForm, useForm } from '/@/components/Form';
  import { ScrollContainer } from '/@/components/Container';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { moldplan, moldplanDetail } from '/@/api/engineering/mould';
  import { basicFormSchemas } from '../config';
  import dayjs from 'dayjs';
  import { useDate } from '../hooks/useDate';
  import { transformI18nVxeTable } from '/@/utils/index';
  import ClassesSettingModal from './ClassesSettingModal.vue';
  import { useBaseStore } from '/@/store/modules/base';

  const { t } = useI18n();
  const emit = defineEmits(['reload', 'register']);

  const baseStore = useBaseStore();
  const { createMessage } = useMessage();
  const [registerClassesSettingModal, { openModal: openClassesSettingModal }] = useModal();

  const [registerBasicInfoForm, { setFieldsValue, validateFields, updateSchema }] = useForm({
    schemas: basicFormSchemas,
    layout: 'vertical',
    labelWidth: 220,
    baseColProps: {
      span: 6,
    },
    i18nConfig: {
      moduleCode: 'MoldPlanColumn',
      transferRange: ['placeholder', 'label'],
    },
  });

  const [registerScheduleForm, { setFieldsValue: setScheduletFieldsValue, validateFields: scheduletValidateFields }] = useForm({
    schemas: [
      {
        field: 'schedulingCycle',
        label: '排期选择',
        component: 'DateRange',
        componentProps: {
          plcaeholder: '请输入',
          onChange: (date: string[]) => {
            const { dateArray } = useDate(date);
            updateColumn(dateArray);
          },
        },
        colProps: { span: 8 },
        rules: [{ required: true, trigger: 'blur' }],
      },
    ],
    labelWidth: 100,
    fieldMapToTime: [['schedulingCycle', ['startDate', 'endDate']]],
    i18nConfig: {
      moduleCode: 'MoldPlanColumn',
      transferRange: ['placeholder', 'label'],
    },
  });

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const detailId = ref('');
  const handleTyle = ref('');
  const baseColumns = [
    {
      // 序号
      field: 'seq',
      type: 'seq',
      title: t('dict.CommonCol.seq'),
      align: 'center',
      width: 50,
      fixed: 'left',
    },
    {
      // 工序名称
      field: 'process',
      title: t('dict.MoldPartPlanColumn.processName'),
      width: 120,
      fixed: 'left',
    },
    {
      // 时间
      field: 'time',
      title: t('sys.errorLog.tableColumnDate'),
      width: 120,
      fixed: 'left',
    },
  ];

  function handleClassesSetting(data) {
    const { index, currentField, rest } = data;
    dateApi.getDataSource().forEach((data, data_index) => {
      if (data_index === index) {
        data[currentField] = rest;
      }
    });
  }

  // 渲染表头日期
  const renderDateHeader = () => {
    setScheduletFieldsValue({ schedulingCycle: [dayjs(), dayjs().add(2, 'month')] });
    const defaultDate = [dayjs().format('YYYY-MM-DD'), dayjs().add(2, 'month').format('YYYY-MM-DD')];
    const { dateArray } = useDate(defaultDate);
    updateColumn(dateArray);
  };
  // 渲染表格数据
  const renderTableData = async () => {
    const defaultDate = [dayjs().format('YYYY-MM-DD'), dayjs().add(2, 'month').format('YYYY-MM-DD')];
    const { dateArray } = useDate(defaultDate);
    // type '0'-计划 '1'-完成
    const table = moldPlanProcessData.value
      .flatMap(item => [
        { process: item.fullName, processCode: item.enCode, time: t('dict.CommonCol.planTime'), type: '0' },
        { process: item.fullName, processCode: item.enCode, time: t('dict.CommonCol.actualCompletionTime'), type: '1' },
      ])
      .map(date => {
        // 设置周日为休息日
        const obj = dateArray.reduce((acc, { field }) => {
          const date = dayjs(field);
          if (date.day() === 0) {
            // day() 返回的是星期几，0 表示周日
            acc[field] = '1';
          }
          return acc;
        }, {});
        return {
          ...date,
          ...obj,
        };
      });

    await dateApi.grid.reloadData(table);
  };

  const updateColumn = array => {
    const list = [...baseColumns, ...array];
    dateApi?.grid?.reloadColumn(transformI18nVxeTable(list));
  };

  const moldPlanProcessData = ref<any>([]);

  const getProccessName = code => {
    return moldPlanProcessData.value.find(item => item.enCode === code).fullName;
  };

  const getDetailData = async () => {
    const { data } = await moldplanDetail(detailId.value).finally(() => {
      changeLoading(false);
    });
    const { cavityNumber, detailList, moldBaseMaterials, moldNo, moldSupplier, productName, remark, startDate, endDate } = data;
    // 基础信息渲染
    setFieldsValue({
      moldNo,
      productName,
      cavityNumber,
      moldSupplier,
      moldBaseMaterials,
      remark,
    });
    let startTime: any = '';
    let endTime: any = '';
    if (startDate && !endDate) {
      // 开始时间有，结束时间没有，从开始时间往后+2个月
      startTime = dayjs(startDate);
      endTime = dayjs(startDate).add(2, 'month');
    } else if (!startDate && !endDate) {
      // 开始时间没有，结束时间没有，从今天往后+2个月
      startTime = dayjs();
      endTime = dayjs().add(2, 'month');
    } else if (startDate && endDate) {
      startTime = dayjs(startDate);
      endTime = dayjs(endDate);
    }
    // 排期选择渲染
    setScheduletFieldsValue({ schedulingCycle: [startTime, endTime] });
    // 排期表格渲染
    const { dateArray } = useDate([startTime.format('YYYY-MM-DD'), endTime.format('YYYY-MM-DD')]);
    updateColumn(dateArray);
    const table = detailList.map(item => {
      const dateObj = (item.planRestDay || item.completionRestDay || '').split(',').reduce((acc, date) => {
        acc[date] = '1';
        return acc;
      }, {});
      // 设置周日为休息日
      const obj = dateArray.reduce((acc, { field }) => {
        const date = dayjs(field);
        if (date.day() === 0) {
          // day() 返回的是星期几，0 表示周日
          acc[field] = '1';
        }
        return acc;
      }, {});
      return {
        id: item.id,
        headId: item.headId,
        ...dateObj,
        ...obj,
        startTime: item.planStartDate || item.completionStartTime,
        endTime: item.planEndDate || item.completionEndTime,
        process: getProccessName(item.process),
        processCode: item.process,
        time: item.type === '0' ? t('dict.CommonCol.planTime') : t('dict.CommonCol.actualCompletionTime'),
        type: item.type,
      };
    });
    dateApi.grid.reloadData(table);
  };

  async function init(info) {
    detailId.value = '';
    changeLoading(true);
    handleTyle.value = info.type;
    moldPlanProcessData.value = await baseStore.getDictionaryData('MoldPlanProcess');

    if (info.type === 'add') {
      handleTyle.value = info.type;
      renderDateHeader();
      setTimeout(async () => {
        await renderTableData();
        changeLoading(false);
      }, 200);
    } else {
      detailId.value = info.id;
      updateSchema([
        {
          field: 'moldNo',
          componentProps: {
            disabled: true,
          },
        },
      ]);
      getDetailData();
    }
  }

  const handleClose = () => {
    dateApi.grid.reloadData([]);
    closePopup();
  };

  const handleSaveAction = async () => {
    const values = await validateFields();
    const { schedulingCycle } = await scheduletValidateFields();
    const detailList = dateApi.getDataSource().map(item => {
      const restDays = Object.keys(item)
        .filter(key => item[key] === '1' && key.includes('-'))
        .join(',');
      return {
        process: item.processCode,
        planStartDate: item.type === '0' ? item.startTime : '',
        planEndDate: item.type === '0' ? item.endTime || item.startTime : '',
        planRestDay: item.type === '0' ? restDays : '',
        completionStartTime: item.type === '1' ? item.startTime : '',
        completionEndTime: item.type === '1' ? item.endTime || item.startTime : '',
        completionRestDay: item.type === '1' ? restDays : '',
        type: item.type,
      };
    });
    changeLoading(true);
    const { code, msg } = await moldplan({
      id: detailId.value,
      startDate: dayjs(schedulingCycle[0]).format('YYYY-MM-DD'),
      endDate: dayjs(schedulingCycle[1]).format('YYYY-MM-DD'),
      ...values,
      detailList,
    }).finally(() => {
      changeLoading(false);
    });
    if (code === 200) {
      createMessage.success(msg);
      emit('reload');
      handleClose();
      return;
    }
    createMessage.error(msg);
  };

  const isDoubleClick = ref(false);
  const gridEvents = {
    cellDblclick(data) {
      isDoubleClick.value = true;
      const currentField = data.column.field;
      openClassesSettingModal(true, { currentField, row: data.row, index: data.$rowIndex });
      setTimeout(() => {
        isDoubleClick.value = false;
      }, 200);
    },
    cellClick(data) {
      setTimeout(() => {
        if (isDoubleClick.value) return;
        // 单击事件
        const { row, column } = data;
        const basicColumnFild = ['seq', 'process', 'time'];
        const value = column.property;
        if (row[column.field] === '1' || basicColumnFild.includes(column.property)) return;
        // 开始时间和结束时间都有
        if (row.startTime && row.endTime) {
          row.startTime = value;
          row.endTime = '';
        }
        // 开始时间有而结束时间没有
        if (row.startTime && !row.endTime) {
          // 当前时间大于开始时间，将当前时间赋值给endTime
          if (dayjs(value).isAfter(dayjs(row.startTime), 'day')) {
            row.endTime = value;
          } else {
            // 当前时间小于等于开始时间，将当前时间赋值给startTime
            row.startTime = value;
          }
        }
        // 开始时间和结束时间都没有的情况
        if (!row.startTime && !row.endTime) {
          row.startTime = value;
        }
      }, 200);
    },
  };

  const [DateGrid, dateApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-moldMasterPlan-timeList',
      size: 'default',
      layout: 'full',
      checkboxConfig: {
        checkField: 'isChecked',
        indeterminateField: 'isIndeterminate',
      },
      maxHeight: 600,
      minHeight: 550,
      scrollY: {
        enabled: false,
      },
      scrollX: {
        enabled: false,
      },
      pagerConfig: {
        autoHidden: true,
      },
      toolbarConfig: {
        enabled: false,
      },
      menuConfig: {
        enabled: true,
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
        if (row[column.field] === '1') {
          return 'rest-cell';
        }

        if (row.startTime && !row.endTime && row.startTime === column.property) {
          return row.type === '0' ? 'plan-color' : 'finish-color';
        }
        if (!row.startTime || !row.endTime) return;
        const isAfter = dayjs(column.property).isAfter(row.startTime, 'day') || dayjs(column.property).isSame(row.startTime, 'day');
        const isBefore = dayjs(column.property).isBefore(row.endTime, 'day') || dayjs(column.property).isSame(row.endTime, 'day');
        if (isAfter && isBefore) {
          return row.type === '0' ? 'plan-color' : 'finish-color';
        }
      },
      spanMethod(data) {
        const { row, $rowIndex: rowIndex, column, visibleData } = data;
        const spanFields = ['process'];
        const diffField = 'process';
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
    },
    gridEvents,
  });
</script>
<style lang="less" scoped>
  .schedule-form {
    flex: 1;

    ::v-deep(.ant-form-item:not(.ant-form-item-with-help)) {
      margin-bottom: 0;
    }
  }

  ::v-deep(.rest-cell) {
    color: #70541c;
    background-color: rgb(255 123 0 / 10%);
  }

  ::v-deep(.finish-color) {
    background-color: #52c41a;
  }

  ::v-deep(.plan-color) {
    background-color: #1890ff;
  }

  ::v-deep(.grid-header) {
    .vxe-header--row {
      height: 80px;
    }

    .vxe-header--column {
      .vxe-cell {
        // padding-left: 0;
        // padding-right: 0;
      }
    }

    .vxe-cell--title {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      text-align: center;
      align-items: center;
      width: 100%;
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

    .vxe-cell {
      // padding: 0 !important;
    }
  }

  .full-popup {
    ::v-deep(.vxe-table--body-wrapper) {
      height: auto !important;
    }
  }

  .card-title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    justify-content: space-between;

    .card-title-left {
      display: flex;
      flex: 1;
      align-items: center;

      .title-stick {
        display: flex;
        align-items: center;

        .gun {
          border-radius: 2px;
          background: #ff7b00;
          width: 2px;
          height: 14px;
          margin-right: 10px;
        }

        .title {
          color: #1a1a1a;
          font-size: 14px;
          font-style: normal;
          font-weight: 700;
          line-height: 22px; /* 157.143% */
        }

        //&:before {

        //}
        :deep(.ant-upload-list-picture-card-container) {
          width: 250px;
          height: 250px;
        }

        :deep(.ant-upload.ant-upload-select-picture-card) {
          width: 250px;
          height: 250px;
        }

        :deep(.ant-upload) {
          width: 250px;
          height: 250px;
        }
      }
    }

    .title-legend {
      margin-left: 12px;
      display: flex;

      .legend-item {
        display: flex;
        align-items: center;
        margin-left: 12px;

        .legend-name {
          color: #666;
          font-size: 14px;
          margin-left: 4px;
        }
      }
    }
  }

  .upload-file-title {
    display: flex;
    align-items: center;
  }

  ::v-deep(.vxe-table--fixed-left-wrapper, .vxe-table--fixed-right-wrapper) {
    z-index: 2 !important;
    height: calc(100% - 15px) !important;
  }
</style>
