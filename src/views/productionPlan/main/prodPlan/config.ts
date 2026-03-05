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
    field: 'field_1',
    width: 100,
  },
  {
    title: '状态',
    field: 'field_2',
    width: 120,
  },
  {
    title: '机台号',
    field: 'field_3',
    width: 80,
  },
  {
    title: '线体配置',
    field: 'field_4',
    width: 150,
  },
  {
    title: '楼层',
    field: 'field_5',
    width: 80,
  },
  {
    title: 'SAP工单号',
    field: 'field_6',
    width: 140,
  },
  {
    title: '工单号',
    field: 'field_7',
    width: 140,
  },
  {
    title: '关联FC单号',
    field: 'field_8',
    width: 120,
  },
  {
    title: '产品内部料号',
    field: 'field_9',
    width: 160,
  },
  {
    title: '旧版成品编码',
    field: 'field_10',
    width: 120,
  },
  {
    title: 'PC',
    field: 'field_11',
    width: 80,
  },
  {
    title: 'MC',
    field: 'field_12',
    width: 80,
  },
  {
    title: '生产工艺',
    field: 'field_13',
    width: 150,
  },
  {
    title: '下达天数',
    field: 'field_14',
    width: 100,
  },
  {
    title: '是否类似',
    field: 'field_15',
    width: 100,
  },
  {
    title: '重点料件',
    field: 'field_16',
    width: 100,
  },
  {
    title: '工艺类型',
    field: 'field_17',
    width: 100,
  },
  {
    title: '需求欠数',
    field: 'field_18',
    width: 100,
  },
  {
    title: '库存',
    field: 'field_19',
    width: 80,
  },
  {
    title: '排产产能(PCSH)',
    field: 'field_20',
    width: 140,
  },
  {
    title: '手工产能(PCSH)',
    field: 'field_21',
    width: 140,
  },
  {
    title: '约当产能（PCSH)',
    field: 'field_22',
    width: 140,
  },
  {
    title: '约当系数',
    field: 'field_23',
    width: 100,
  },
  {
    title: '换模调机时间',
    field: 'field_24',
    width: 140,
  },
  {
    title: '损耗率',
    field: 'field_25',
    width: 80,
  },
  {
    title: '模切排产数',
    field: 'field_26',
    width: 120,
  },
  {
    title: '工单数量（PCS）',
    field: 'field_27',
    width: 140,
  },
  {
    title: '排产建议',
    field: 'field_28',
    width: 120,
  },
  {
    title: '排程交期',
    field: 'field_29',
    width: 120,
  },
  {
    title: '排程备注',
    field: 'field_30',
    width: 120,
  },
  {
    title: '预计工时',
    field: 'field_31',
    width: 100,
  },
];

export const tableColumns2 = [
  {
    title: '结单状况',
    field: 'field_52',
    width: 100,
  },
  {
    title: '累计生产数',
    field: 'field_53',
    width: 120,
  },
  {
    title: '上周累计完成',
    field: 'field_54',
    width: 140,
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
    field: 'field_59',
    width: 140,
  },
  {
    title: '数据同步时间',
    field: 'field_60',
    width: 140,
  },
];

//   可编辑列
export const editScheColumns = [
  {
    field: 'target',
    title: '排程交期',
    width: 100,
    editRender: {
      name: 'DatePicker',
    },
  },
  {
    field: 'source',
    title: '预估排程交期',
    width: 100,
    editRender: {
      name: 'DatePicker',
    },
  },
  {
    field: 'remark',
    title: '排程备注',
    width: 100,
    editRender: {
      name: 'Input',
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
    // {
    //   fieldName: 'searchDate',
    //   label: '',
    //   component: 'WeekPicker',
    //   componentProps: {
    //     placeholder: t('dict.FcDataColumn.searchDate'),
    //     // valueFormat: 'YYYY-ww',
    //   },
    //   // defaultValue: getYearWeek(),
    //   defaultValue: dayjs(new Date()),
    // },
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

export const getEditScheColumns = () => {
  const columns = [...editScheColumns, ...tableColumns, ...getWeekDates(), ...tableColumns2];
  return columns;
};
