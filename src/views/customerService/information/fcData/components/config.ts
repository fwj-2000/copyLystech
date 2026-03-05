// import XEUtils from 'xe-utils';
import { auditStatusOptions } from '../../fcDataAudit/PendingPane/config';
import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';
import dayjs, { Dayjs } from 'dayjs';
import { formatWithOriginalDecimals } from '/@/utils/baseinfo/number';
const { t: $t } = useI18n();

export const push3_8StatusOptions = [
  { id: 1, fullName: $t('dict.YesOrNo.1'), theme: 'green' },
  { id: 0, fullName: $t('dict.YesOrNo.0'), theme: 'red' },
];

// 格式化数量
const formatterQuantity = ({ cellValue }) => {
  if (cellValue == 0) return '0';
  if (!cellValue) return '';
  return formatWithOriginalDecimals(cellValue, { decimal: 0, round: true });
};
// 格式化金额
const formatterPrice = ({ cellValue }) => {
  if (cellValue == 0) return '0';
  if (!cellValue) return '';
  return formatWithOriginalDecimals(cellValue, { decimal: 2, round: true });
};

export const formatWeek = (date: Dayjs) => {
  const weeksDayjs = dayjs(date);
  return `${weeksDayjs.endOf('week').year()}-${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`;
};

export const columns = [
  { type: 'checkbox', field: 'checkbox', width: 50 },
  {
    title: $t('dict.FcDataColumn.batchNumber'),
    width: 100,
    field: 'batchNumber',
  },
  {
    title: $t('dict.FcDataColumn.auditStatus'),
    field: 'auditStatus',
    cellRender: {
      name: 'Tag',
      options: auditStatusOptions,
    },
    minWidth: 120,
  },
  {
    title: $t('dict.FcDataColumn.push3_8'),
    field: 'push3_8',
    cellRender: {
      name: 'Tag',
      options: push3_8StatusOptions,
    },
    width: 100,
  },
  {
    title: $t('dict.FcDataColumn.rePush3_8'),
    field: 'rePush3_8',
    cellRender: {
      name: 'Tag',
      options: push3_8StatusOptions,
    },
    width: 100,
  },
  {
    title: $t('dict.FcDataColumn.currentProcessorName'),
    width: 120,
    field: 'currentProcessorName',
  },
  {
    title: $t('dict.FcDataColumn.currentNode'),
    width: 100,
    field: 'currentNode',
    formatter: ({ cellValue }) => {
      return cellValue ? $t(`dict.FcData.FlowNode.${cellValue}`) : cellValue;
    },
  },
  {
    title: $t('dict.FcDataColumn.customerCode'),
    field: 'customerCode',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 100,
  },
  {
    title: $t('dict.FcDataColumn.factory'),
    field: 'factory',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 100,
  },
  {
    title: $t('dict.FcDataColumn.customerPerson'),
    field: 'customerPerson',
    width: 100,
  },
  {
    title: $t('dict.FcDataColumn.project'),
    field: 'project',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 100,
  },
  {
    title: $t('dict.FcDataColumn.projectPhase'),
    field: 'projectPhase',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 100,
  },
  {
    title: $t('dict.FcDataColumn.innerMaterialNumber'),
    field: 'innerMaterialNumber',
  },
  {
    title: $t('dict.FcDataColumn.middleMaterialNumber'),
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    field: 'middleMaterialNumber',
  },
  {
    title: $t('dict.FcDataColumn.factoryAreaName'),
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    field: 'factoryAreaName',
  },
  {
    title: $t('dict.FcDataColumn.shipmentLocation'),
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    field: 'shipmentLocationName',
  },
  {
    title: $t('dict.FcDataColumn.useQuantity'),
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    field: 'useQuantity',
    width: 100,
  },
  {
    title: $t('dict.FcDataColumn.vmiOrJit'),
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    field: 'vmiOrJit',
    width: 100,
  },
  {
    title: $t('dict.FcDataColumn.tradeCurrency'),
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    field: 'tradeCurrency',
    width: 100,
  },
  {
    title: $t('dict.FcDataColumn.productCategory'),
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    field: 'productCategory',
  },
  {
    title: $t('dict.FcDataColumn.materialPrinciple'),
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    field: 'materialPrinciple',
  },
  {
    title: $t('dict.FcDataColumn.lastWeekDemandQuantity'),
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    field: 'lastWeekDemandQuantity',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: $t('dict.FcDataColumn.lastWeekOweQuantity'),
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    field: 'lastWeekOweQuantity',
    width: 100,
    formatter: formatterQuantity,
  },
  {
    title: $t('dict.FcDataColumn.changeRatio'),
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    field: 'changeRatio',
  },
  {
    title: $t('dict.FcDataColumn.customerInventory'),
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    field: 'customerInventory',
    width: 120,
    formatter: formatterQuantity,
  },
  {
    title: $t('dict.FcDataColumn.customerInventoryUseWeek'),
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    field: 'customerInventoryUseWeek',
  },
  {
    title: $t('dict.FcDataColumn.remark1'),
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    field: 'remark1',
  },
  {
    title: $t('dict.FcDataColumn.finishedProductInventory'),
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    field: 'finishedProductInventory',
    width: 100,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK1',
    field: 'quantity1',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK2',
    field: 'quantity2',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK3',
    field: 'quantity3',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK4',
    field: 'quantity4',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK5',
    field: 'quantity5',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK6',
    field: 'quantity6',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK7',
    field: 'quantity7',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK8',
    field: 'quantity8',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK9',
    field: 'quantity9',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK10',
    field: 'quantity10',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK11',
    field: 'quantity11',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK12',
    field: 'quantity12',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK13',
    field: 'quantity13',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK14',
    field: 'quantity14',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK15',
    field: 'quantity15',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK16',
    field: 'quantity16',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK17',
    field: 'quantity17',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK18',
    field: 'quantity18',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK19',
    field: 'quantity19',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK20',
    field: 'quantity20',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK21',
    field: 'quantity21',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK22',
    field: 'quantity22',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK23',
    field: 'quantity23',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK24',
    field: 'quantity24',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK25',
    field: 'quantity25',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK26',
    field: 'quantity26',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK27',
    field: 'quantity27',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK28',
    field: 'quantity28',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK29',
    field: 'quantity29',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK30',
    field: 'quantity30',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK31',
    field: 'quantity31',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK32',
    field: 'quantity32',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK33',
    field: 'quantity33',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK34',
    field: 'quantity34',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: 'WK35',
    field: 'quantity35',
    width: 100,
    formatter: formatterQuantity,
    editRender: { name: 'Input' },
  },
  {
    title: $t('dict.FcDataColumn.materialIsMore'),
    field: 'materialIsMore',
    width: 185,
  },
  {
    title: $t('dict.FcDataColumn.remark2'),
    field: 'remark2',
  },
  {
    title: $t('dict.FcDataColumn.price'),
    field: 'price',
    auth: 'price',
    width: 100,
  },
  {
    title: $t('dict.FcDataColumn.currency'),
    field: 'currency',
    width: 100,
  },
  {
    title: 'WK1',
    field: 'totalPrice1',
    auth: 'totalPrice1',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK2',
    field: 'totalPrice2',
    auth: 'totalPrice2',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK3',
    field: 'totalPrice3',
    auth: 'totalPrice3',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK4',
    field: 'totalPrice4',
    auth: 'totalPrice4',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK5',
    field: 'totalPrice5',
    auth: 'totalPrice5',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK6',
    field: 'totalPrice6',
    auth: 'totalPrice6',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK7',
    field: 'totalPrice7',
    auth: 'totalPrice7',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK8',
    field: 'totalPrice8',
    auth: 'totalPrice8',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK9',
    field: 'totalPrice9',
    auth: 'totalPrice9',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK10',
    field: 'totalPrice10',
    auth: 'totalPrice10',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK11',
    field: 'totalPrice11',
    auth: 'totalPrice11',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK12',
    field: 'totalPrice12',
    auth: 'totalPrice12',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK13',
    field: 'totalPrice13',
    auth: 'totalPrice13',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK14',
    field: 'totalPrice14',
    auth: 'totalPrice14',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK15',
    field: 'totalPrice15',
    auth: 'totalPrice15',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK16',
    field: 'totalPrice16',
    auth: 'totalPrice16',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK17',
    field: 'totalPrice17',
    auth: 'totalPrice17',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK18',
    field: 'totalPrice18',
    auth: 'totalPrice18',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK19',
    field: 'totalPrice19',
    auth: 'totalPrice19',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK20',
    field: 'totalPrice20',
    auth: 'totalPrice20',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK21',
    field: 'totalPrice21',
    auth: 'totalPrice21',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK22',
    field: 'totalPrice22',
    auth: 'totalPrice22',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK23',
    field: 'totalPrice23',
    auth: 'totalPrice23',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK24',
    field: 'totalPrice24',
    auth: 'totalPrice24',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK25',
    field: 'totalPrice25',
    auth: 'totalPrice25',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK26',
    field: 'totalPrice26',
    auth: 'totalPrice26',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK27',
    field: 'totalPrice27',
    auth: 'totalPrice27',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK28',
    field: 'totalPrice28',
    auth: 'totalPrice28',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK29',
    field: 'totalPrice29',
    auth: 'totalPrice29',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK30',
    field: 'totalPrice30',
    auth: 'totalPrice30',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK31',
    field: 'totalPrice31',
    auth: 'totalPrice31',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK32',
    field: 'totalPrice32',
    auth: 'totalPrice32',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK33',
    field: 'totalPrice33',
    auth: 'totalPrice33',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK34',
    field: 'totalPrice34',
    auth: 'totalPrice34',
    width: 100,
    formatter: formatterPrice,
  },
  {
    title: 'WK35',
    field: 'totalPrice35',
    auth: 'totalPrice35',
    width: 100,
    formatter: formatterPrice,
  },
];

export const importColumns: BasicColumn[] = [
  {
    title: 'excel行号',
    dataIndex: 'number',
    width: 120,
    key: 'number',
    sorter: true,
  },
  ...(columns as any),
];

// 根据周数动态生成表格列
export const getWeekTitle = (weekDate: Dayjs, addWeek: number) => {
  const newDate = weekDate.add(addWeek, 'week').endOf('week');
  return `${newDate.format('YYYY')}WK${newDate.format('ww')}`;
};
