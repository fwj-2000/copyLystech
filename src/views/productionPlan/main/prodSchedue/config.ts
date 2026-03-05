import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';
import { getFactoryList } from '/@/api/basicData/productCodeApply';

const { t } = useI18n();

const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
// 抓取今天起的14天日期+周数
export function getWeekDates() {
  const dates: {
    title: string;
    field: string;
    children: any;
  }[] = [];
  let dateTo = new Date(); // 今天
  for (let i = 0; i < 14; i++) {
    // 获取当前日期对应的星期几
    const weekDay = dayjs(dateTo).day();
    const weekName = weekdays[weekDay];
    const date = dayjs(dateTo).format('YYYY/MM/DD');
    dates.push({
      title: date,
      field: date,
      children: [
        {
          title: weekName,
          field: date + weekDay,
          children: [
            {
              title: '白班',
              field: date + 'day',
              children: [
                {
                  title: '计划数量',
                  field: date + 'day_planNum',
                  width: 100,
                },
                {
                  title: '计划工时',
                  field: date + 'day_planHour',
                  width: 100,
                },
              ],
            },
            {
              title: '夜班',
              field: date + 'night',
              children: [
                {
                  title: '计划数量',
                  field: date + 'night_planNum',
                  width: 100,
                },
                {
                  title: '计划工时',
                  field: date + 'night_planHour',
                  width: 100,
                },
              ],
            },
          ],
        },
      ],
    });
    dateTo.setDate(dateTo.getDate() + 1); // 日期加1
  }
  return dates;
}

export const tableColumns = [
  {
    title: '是否已匹配',
    field: 'isMatches',
    width: 90,
    cellRender: {
      name: 'Tag',
      options: [
        { id: 0, fullName: t('dict.Bool.2'), theme: 'red', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.Bool.1'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
  },
  {
    title: '状态',
    field: 'status',
    width: 100,
  },
  {
    title: '年份',
    field: 'years',
    width: 60,
  },
  {
    title: '周数',
    field: 'week',
    width: 60,
  },
  {
    title: '工厂',
    field: 'factoryAreaName',
    width: 120,
  },
  {
    title: '机台号',
    field: 'machineNo',
    width: 80,
  },
  {
    title: '线体配置',
    field: 'lineName',
    width: 100,
  },
  {
    title: '楼层',
    field: 'floor',
    width: 80,
  },
  {
    title: 'SAP工单号',
    field: 'sapWorkerOrderNo',
    width: 140,
  },
  {
    title: '工单号',
    field: 'workerOrderNo',
    width: 120,
  },
  {
    title: '关联FC单号',
    field: 'fCode',
    width: 120,
  },
  {
    title: '产品内部料号',
    field: 'fCode',
    width: 160,
  },
  {
    title: '旧版成品编码',
    field: 'pnOld',
    width: 120,
  },
  {
    title: 'PC',
    field: 'pc',
    width: 80,
  },
  {
    title: 'MC',
    field: 'mc',
    width: 80,
  },
  {
    title: '生产工艺',
    field: 'productProcess',
    width: 150,
  },
  {
    title: '下达天数',
    field: 'issueDays',
    width: 80,
  },
  {
    title: '是否类似',
    field: 'isSimilar',
    width: 80,
  },
  {
    title: '重点料件',
    field: 'field_16',
    width: 100,
  },
  {
    title: '工艺类型',
    field: 'processType',
    width: 80,
  },
  {
    title: '需求欠数',
    field: 'demandQty',
    width: 80,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '库存',
    field: 'stock',
    width: 80,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '排产产能(PCSH)',
    field: 'productCapacity',
    width: 120,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '手工产能(PCSH)',
    field: 'handCapacity',
    width: 120,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '约当产能(PCSH)',
    field: 'jordanCapacity',
    width: 120,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '约当系数',
    field: 'jordanRate',
    width: 80,
  },
  {
    title: '换模调机时间',
    field: 'setupTimeMinute',
    width: 90,
  },
  {
    title: '损耗率',
    field: 'attritionRate',
    width: 80,
  },
  {
    title: '模切排产数',
    field: 'diecutScheduleQty',
    width: 90,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '工单数量(PCS)',
    field: 'workerOrderQty',
    width: 100,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '排产建议',
    field: 'field_28',
    width: 100,
  },
  {
    title: '排程交期',
    field: 'scheduleDelivery',
    width: 100,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '排程备注',
    field: 'scheduleRemark',
    width: 100,
  },
  {
    title: '预计工时',
    field: 'planWorkHour',
    width: 80,
  },
];

export const tableColumns2 = [
  {
    title: '结单状况',
    field: 'statementStatus',
    width: 80,
  },
  {
    title: '累计生产数',
    field: 'totalProductQty',
    width: 90,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '上周累计完成',
    field: 'lastWeekQty',
    width: 100,
    cellRender: {
      name: 'Number',
    },
  },
  {
    title: '客户料号',
    field: 'field_55',
    width: 120,
  },
  {
    title: '车间计划',
    field: 'field_56',
    width: 100,
  },
  {
    title: 'PCC版本号',
    field: 'field_57',
    width: 120,
  },
  {
    title: 'PCC编号',
    field: 'field_58',
    width: 100,
  },
  {
    title: '客户要求交期',
    field: 'customerRequireDelivery',
    width: 120,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '数据同步时间',
    field: 'importTime',
    width: 140,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
];

// 获取完整的columns
export const getColumns = () => {
  const columns = [{ field: 'checkbox', type: 'checkbox' }, ...tableColumns, ...getWeekDates(), ...tableColumns2];
  return columns;
};

export function getFormSchema() {
  return [
    {
      fieldName: 'searchDate',
      label: '',
      component: 'WeekPicker',
      componentProps: {
        placeholder: t('dict.FcDataColumn.searchDate'),
        // valueFormat: 'YYYY-ww',
      },
      // defaultValue: getYearWeek(),
      defaultValue: dayjs(new Date()),
    },
    {
      fieldName: 'innerMaterialCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
      },
    },
    {
      fieldName: 'factoryCode',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: getFactoryList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        nameFormat: ['Code', '/', 'Name'],
        immediate: true,
        placeholder: t('dict.CommonCol.factoryName'),
      },
    },
    {
      fieldName: 'projectName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '项目名称',
      },
    },
  ];
}
