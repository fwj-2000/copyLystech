import { useBaseStore } from '/@/store/modules/base';
import { getFactoryList } from '/@/api/business/shippingspace';
import { getSapFactoryList } from '/@/api/purchase/supplierInformation';
import { useI18n } from '/@/hooks/web/useI18n';

const baseStore = useBaseStore();

const { t } = useI18n();

const statusOptions = [
  { id: 1, fullName: t('common.enableText'), theme: 'green' },
  { id: 2, fullName: t('common.disableText'), theme: 'red' },
];

export const mainCoulumnVxe = [
  {
    title: '是否参与MRP计算',
    field: 'isCalcWithMRP',
    i18nField: 'isCalcWithMRPDes',
    width: 130,
    cellRender: {
      name: 'Tag',
      options: [
        { id: 1, fullName: t('dict.isOpen.1'), theme: 'green' },
        { id: 2, fullName: t('dict.isOpen.2'), theme: 'red' },
      ],
    },
  },
  {
    title: '主要制程',
    field: 'mainProcess',
    i18nField: 'CommonCol.mainProcess',
    width: 140,
    formatter: ({ row }) => row.mainProcessName || row.mainProcess || '',
  },
  { title: '工厂名称', field: 'factoryName', i18nField: 'CommonCol.factoryName', resizable: true, width: 140 },
  { title: '工厂代码', field: 'factoryCode', i18nField: 'CommonCol.factoryCode', resizable: true, width: 140 },
  {
    title: 'SAP工厂代码',
    field: 'sapFactoryCode',
    width: 140,
  },
  {
    title: 'SAP工厂名称',
    field: 'sapFactoryName',
    width: 140,
  },
  { title: '仓位编码', field: 'shippingSpaceCode', resizable: true, width: 140 },
  { title: '仓位名称', field: 'shippingSpaceName', resizable: true, width: 140 },
  {
    title: '仓位类型',
    field: 'type',
    width: 140,
    formatter: ({ row }) => row.typeName || row.type || '',
  },
  {
    title: '仓位归属',
    field: 'attribution',
    width: 140,
    formatter: ({ row }) => row.attributionName || row.attribution || '',
  },
  { title: '备注', field: 'remarks', i18nField: 'CommonCol.remark', width: 120 },
];

export const columnsVxe = [
  { type: 'checkbox', field: 'checkbox' },
  {
    title: '状态',
    field: 'status',
    i18nField: 'CommonCol.status',
    width: 60,
    cellRender: {
      name: 'Tag',
      options: statusOptions,
    },
  },
  ...mainCoulumnVxe,
  { title: '创建人', field: 'creatorUserName', i18nField: 'CommonCol.creatorUserName', resizable: true, width: 100 },
  { title: '创建时间', field: 'creatorTime', i18nField: 'CommonCol.creatorTime', width: 120, cellRender: { name: 'Date', format: 'YYYY-MM-DD HH:mm' } },
  { title: '修改人', field: 'lastModifyUserName', i18nField: 'CommonCol.updateUser', resizable: true, width: 100 },
  { title: '修改时间', field: 'lastModifyTime', i18nField: 'CommonCol.updateTime', width: 120, cellRender: { name: 'Date', format: 'YYYY-MM-DD HH:mm' } },
  // 操作行
  {
    title: t('common.action'),
    field: 'action',
    width: '100',
    fixed: 'right',
    slots: {
      default: 'action',
    },
  },
];

/** 主要制程 */
export const mainProcessOptions: Array<any> = [];
/** 工厂 选项 */
export const factoryOptions: Array<{ MainProcess: number | string; Code: string; Name: string }> = [];
/** SAP工厂选项 */
export const sapFactoryOptions: Array<any> = [];
/** 仓位类型字典项 */
export const shippingSpaceTypeOpiotns: Array<any> = [];
/** 仓位归属字典项 */
export const shippingSpaceAttributionOptions: Array<any> = [];
/** 获取编辑用的基本数据 */
export async function getDcitOptions() {
  if (shippingSpaceAttributionOptions.length > 0) {
    return true;
  }
  return Promise.all([
    getFactoryList({}), // 获取全量的工厂
    getSapFactoryList({}), // 获取全量的SAP工厂
    baseStore.getDictionaryData('ShippingSpaceType', true), // 执行一次获取全部字典，其余字典取缓存
  ])
    .then(([factoryRes, sapFactoryRes, typeRes]) => {
      factoryOptions.push(...factoryRes.data);
      sapFactoryOptions.push(...sapFactoryRes.data);
      shippingSpaceTypeOpiotns.push(...(typeRes as Array<any>));
      return Promise.all([baseStore.getDictionaryData('ShippingSpaceAttribution', true), baseStore.getDictionaryData('MainProcess', true)]);
    })
    .then(([attributionRes, mainProcessRes]) => {
      shippingSpaceAttributionOptions.push(...(attributionRes as Array<any>));
      mainProcessOptions.push(...(mainProcessRes as Array<any>));
    });
}

try {
  await getDcitOptions();
} catch (error) {
  console.error(error);
}
