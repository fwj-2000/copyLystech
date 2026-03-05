import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { title } from 'process';

const { t } = useI18n();
const baseStore = useBaseStore();
export const columns = [
  {
    title: '工单号',
    field: 'workOrderNo',
    minWidth: 120,
  },
  {
    title: '工单类型',
    field: 'workOrderTypeName',
    width: 80,
  },
  {
    field: 'factoryMoldNo',
    title: '厂内模号',
  },
  {
    field: 'billNumber',
    title: '单据号',
  },
  {
    title: '生产进度',
    field: 'proProgress',
    cellRender: {
      name: 'Tag',
      options: [
        { id: 0, fullName: t('dict.planProgress.0'), theme: 'gray', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.planProgress.1'), theme: 'blue', rowKey: 'statusDesc' },
        { id: 2, fullName: t('dict.planProgress.2'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    i18nField: 'proProgressName',
    width: 90,
  },
  {
    title: '延期情况',
    field: 'delayState',
    width: 90,
    cellRender: {
      name: 'Tag',
      options: [
        { id: 0, fullName: t('dict.delaySituation.0'), theme: 'green', rowKey: 'statusDesc' },
        { id: 1, fullName: t('dict.delaySituation.1'), theme: 'red', rowKey: 'statusDesc' },
      ],
    },
    i18nField: 'delayStateName',
  },
  {
    title: '内部料号',
    field: 'productCode',
    minWidth: 160,
  },
  {
    title: '工单日期',
    field: 'workOrderDate',
    minWidth: 100,
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    formatter: ({ cellValue }) => (cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : ''),
  },
  {
    title: '工厂',
    field: 'factoryAreaName',
    minWidth: 120,
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '数量',
    field: 'quantity',
    minWidth: 80,
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '待完成数量',
    field: 'outstandQty',
    minWidth: 100,
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
  },
  {
    title: '工艺路线',
    field: 'routeMap',
    visible: true,
    showOverflow: false,
    resizable: true,
    // sortable: true,
    // filters: [{ data: '' }],
    // filterRender: {
    //   name: 'Input',
    // },
    width: 'auto',
    slots: {
      default: 'routeMap',
    },
    i18nField: 'CommonCol.processRoute',
  },
];
