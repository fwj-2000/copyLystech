import { useI18n } from '/@/hooks/web/useI18n';
import { ListByUserfactory } from '/@/api/productionPlan/processRoute';
// import { useLocalStorage } from '@vueuse/core';
// import { getfloor } from '/@/api/qms/iqc/butlerYield';

import dayjs from 'dayjs';

const { t } = useI18n();

// 主页form配置
export function getFormSchema() {
  // const { value: storeData } = useLocalStorage('qms-report-productionProgress', { machineNo: '' });
  return [
    {
      fieldName: 'factoryArea',
      label: '',
      i18nField: 'factoryAreaName',
      component: 'ApiSelect',
      componentProps: {
        api: ListByUserfactory,
        placeholder: '所属厂区',
        showSearch: true,
        resultField: 'data',
        filterOption: (inputValue, path) => {
          return [path].some(option => option.label.includes(inputValue));
        },
        notFoundContent: null,
        immediate: true,
        labelField: 'Name',
        valueField: 'Code',
        defaultFirstOption: true,
        allowClear: false,
      },
    },
    {
      fieldName: 'pickerVal',
      label: '',
      component: 'RangePicker',
      defaultValue: [dayjs().subtract(1, 'days'), dayjs()],
    },
    // {
    //   fieldName: 'floor',
    //   label: '',
    //   component: 'ApiSelect',
    //   componentProps: {
    //     api: getfloor,
    //     placeholder: '所属厂别',
    //     showSearch: true,
    //     resultField: 'data',
    //     filterOption: (value: string, option: { label: string }) => option.label.includes(value),
    //     immediate: true,
    //     useChangeCopy: true,
    //     labelField: 'name',
    //     valueField: 'id',
    //     nameFormat: ['name'],
    //   },
    //   i18nField: 'floorName',
    // },
    {
      fieldName: 'floor',
      label: '',
      i18nField: 'floorName',
      component: 'Select',
      componentProps: {
        placeholder: '所属厂别',
        allowClear: true,
        options: [],
        fieldNames: { label: 'name', value: 'id' },
      },
    },
    {
      fieldName: 'machineNo',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '机台号',
        allowClear: true,
        options: [],
        fieldNames: { label: 'MachineNo', value: 'MachineNo' },
      },
      // defaultValue: storeData.machineNo,
    },
    {
      fieldName: 'manuOrder',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '工单号',
      },
    },
  ];
}
const biggerDieYieId = (dieYieId, item) => {
  if (!item) return '';
  if (!dieYieId) return 'cell-green';
  return Number(item) >= Number(dieYieId) ? 'cell-green' : 'cell-red';
};

// 主页表格column配置
export const column = [
  {
    title: '日期',
    field: 'entDate',
    width: 120,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
  },
  {
    title: '班别',
    field: 'teamName',
    width: 80,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ASelect',
      searchField: 'fTeam',
      props: {
        fieldNames: {
          label: 'fullName',
          value: 'enCode',
        },
        options: [
          { fullName: t('common.dayShift'), enCode: '1' },
          { fullName: t('dict.NightShift'), enCode: '2' },
        ],
      },
    },
  },
  {
    title: '所属厂别',
    field: 'floorName',
    width: 130,
  },
  {
    title: '机台',
    field: 'machineNo',
    width: 120,
  },
  {
    title: '工单号',
    field: 'manuOrder',
    width: 150,
  },
  {
    title: '产品名称',
    field: 'product',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      searchField: 'fProduct',
    },
    width: 120,
  },
  {
    title: '姓名',
    field: 'creatorName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
      searchField: 'fOperatorUserId',
    },
    width: 150,
    // i18nField: 'urgentLevelName',
  },

  {
    title: 'PCC标准良率(%)',
    field: 'dieYieId',
    width: 130,
  },
  {
    title: 'PCC标准效率(K/h)',
    field: 'dieUPH',
    width: 130,
  },
  {
    title: '标准稼动率(%)',
    field: 'dieUtilizationRate',
    width: 120,
  },
  {
    title: '模切数',
    field: 'dieQty',
    width: 100,
  },
  {
    title: '成品相机在线良品数',
    field: 'cameraQty',
    width: 150,
  },
  {
    title: '成品相机在线良率(%)',
    field: 'cameraYieId',
    width: 140,
  },
  {
    title: '手工良品数',
    field: 'handQty',
    width: 120,
  },
  {
    title: '手工不良品数',
    field: 'handBadQty',
    width: 120,
  },
  {
    title: '手工良率(%)',
    field: 'handYieId',
    width: 110,
  },
  {
    title: '手工剩余数',
    field: 'handRemQty',
    width: 120,
  },
  {
    title: '手工完成率(%)',
    field: 'handCompleteRate',
    width: 110,
  },
  {
    title: '模切实际效率(K/h)',
    field: 'dieRealUPH',
    width: 140,
  },
  {
    title: '效率达成率(%)',
    field: 'achieveRate',
    width: 120,
  },
  {
    title: '机台实际稼动率(%)',
    field: 'utilizationRate',
    width: 140,
  },
  {
    title: '稼动达成率(%)',
    field: 'macAchieveRate',
    width: 140,
  },
  {
    title: 'OEE(%)',
    field: 'OEE',
    width: 100,
  },
  {
    title: '成品相机每小时良率统计',
    field: 'statistics',
    width: 140,
    i18nField: 'camerasStatistics',
    children: [
      {
        field: 'eighty',
        title: '20:00-08:00',
        width: 100,
        formatter: ({ cellValue }) => (cellValue ? cellValue + '%' : ''),
        className: ({ row }) => {
          return biggerDieYieId(row.dieYieId, row.eighty);
        },
      },
      {
        field: 'nine',
        title: '09:00-21:00',
        width: 100,
        formatter: ({ cellValue }) => (cellValue ? cellValue + '%' : ''),
        className: ({ row }) => {
          return biggerDieYieId(row.dieYieId, row.nine);
        },
      },
      {
        field: 'ten',
        title: '10:00-22:00',
        width: 100,
        formatter: ({ cellValue }) => (cellValue ? cellValue + '%' : ''),
        className: ({ row }) => {
          return biggerDieYieId(row.dieYieId, row.ten);
        },
      },
      {
        field: 'eleven',
        title: '11:00-23:00',
        width: 100,
        formatter: ({ cellValue }) => (cellValue ? cellValue + '%' : ''),
        className: ({ row }) => {
          return biggerDieYieId(row.dieYieId, row.eleven);
        },
      },
      {
        field: 'twelve',
        title: '12:00-00:00',
        width: 100,
        formatter: ({ cellValue }) => (cellValue ? cellValue + '%' : ''),
        className: ({ row }) => {
          return biggerDieYieId(row.dieYieId, row.twelve);
        },
      },
      {
        field: 'thirteen',
        title: '13:00-01:00',
        width: 100,
        formatter: ({ cellValue }) => (cellValue ? cellValue + '%' : ''),
        className: ({ row }) => {
          return biggerDieYieId(row.dieYieId, row.thirteen);
        },
      },
      {
        field: 'fourteen',
        title: '14:00-02:00',
        width: 100,
        formatter: ({ cellValue }) => (cellValue ? cellValue + '%' : ''),
        className: ({ row }) => {
          return biggerDieYieId(row.dieYieId, row.fourteen);
        },
      },
      {
        field: 'fifteen',
        title: '15:00-03:00',
        width: 100,
        formatter: ({ cellValue }) => (cellValue ? cellValue + '%' : ''),
        className: ({ row }) => {
          return biggerDieYieId(row.dieYieId, row.fifteen);
        },
      },
      {
        field: 'sixteen',
        title: '16:00-04:00',
        width: 100,
        formatter: ({ cellValue }) => (cellValue ? cellValue + '%' : ''),
        className: ({ row }) => {
          return biggerDieYieId(row.dieYieId, row.sixteen);
        },
      },
      {
        field: 'seventeen',
        title: '17:00-05:00',
        width: 100,
        formatter: ({ cellValue }) => (cellValue ? cellValue + '%' : ''),
        className: ({ row }) => {
          return biggerDieYieId(row.dieYieId, row.seventeen);
        },
      },
      {
        field: 'eighteen',
        title: '18:00-06:00',
        width: 100,
        formatter: ({ cellValue }) => (cellValue ? cellValue + '%' : ''),
        className: ({ row }) => {
          return biggerDieYieId(row.dieYieId, row.eighteen);
        },
      },
      {
        field: 'nineteen',
        title: '19:00-07:00',
        width: 100,
        formatter: ({ cellValue }) => (cellValue ? cellValue + '%' : ''),
        className: ({ row }) => {
          return biggerDieYieId(row.dieYieId, row.nineteen);
        },
      },
    ],
  },
  {
    title: '成品相机在线不良率(%)',
    field: 'camBadYieId',
    width: 150,
  },
  // 以下还未联调
  // {
  //   title: 'TOP1不良类型',
  //   field: 'creatorTime',
  //   width: 120,
  // },
  // {
  //   title: 'TOP2不良类型',
  //   field: 'creatorTime',
  //   width: 120,
  // },
  // {
  //   title: 'TOP3不良类型',
  //   field: 'creatorTime',
  //   width: 120,
  // },
  // {
  //   title: 'TOP1不良率(%)',
  //   field: 'creatorTime',
  //   width: 120,
  // },
  // {
  //   title: 'TOP2不良率(%)',
  //   field: 'creatorTime',
  //   width: 120,
  // },
  // {
  //   title: 'TOP3不良率(%)',
  //   field: 'creatorTime',
  //   width: 120,
  // },
  // {
  //   title: 'TOP1不良图片',
  //   field: 'creatorTime',
  //   slots: { default: 'DefectImage1' },
  //   width: 120,
  // },
  // {
  //   title: 'TOP2不良图片',
  //   field: 'creatorTime',
  //   slots: { default: 'DefectImage2' },
  //   width: 120,
  // },
  // {
  //   title: 'TOP3不良图片',
  //   field: 'creatorTime',
  //   slots: { default: 'DefectImage3' },
  //   width: 120,
  // },
];
