import type { VxeGridPropTypes, VxeTableDefines } from 'vxe-table';
import type { ExCustomStoreData } from './types';

import { h } from 'vue';
import { URGENTLEVEL_STATUS_COLOR_MAP, STATUS_OPTIONS, PURCHASE_STATUS_OPTIONS, CONCLUSION_OPTIONS, confirmModifyOptions } from '../config';
import { useUserStore } from '/@/store/modules/user';
import { createOrUpdateTableCustomData } from '/@/api/system/customData';

const userStore = useUserStore();

/** 展开子表列配置 */
export const SUB_COLUMNS: VxeGridPropTypes.Columns = [
  { type: 'checkbox', width: 50 },
  { title: '单据类型', field: 'itemTypeName', width: 80 },
  { title: '产品内部料号', field: 'insidePartNumber', width: 180 },
  {
    title: '工厂',
    field: 'factoryName',
    width: 120,
    formatter: ({ row }) => {
      return [row.factory, row.factoryName].filter(Boolean).join('/');
    },
  },
  { title: '旧版成品编码', field: 'insidePartNumberOld', width: 180 },
  { title: '模具料号', field: 'moldNo', width: 150 },
  { title: '修改类型', field: 'modifyTypeName', width: 100, className: 'text-red-500' },
  { title: '修改原因', field: 'modifyReason', width: 200, className: 'text-red-500' },
  { title: '模房结论', field: 'moldHouseResult', width: 100, cellRender: { name: 'Tag', options: CONCLUSION_OPTIONS } },
  { title: '采购结论', field: 'purchaseResult', width: 100, cellRender: { name: 'Tag', options: CONCLUSION_OPTIONS } },
  {
    title: '模具实物状态',
    field: 'moldPhysicalStatusName',
    width: 200,
    formatter: ({ row }) => {
      const target = confirmModifyOptions.find(item => item.value === `${row.moldPhysicalStatus}`);
      return target?.label || row.moldPhysicalStatusName || row.moldPhysicalStatus || '';
    },
  },
  { title: '采购类型', field: 'purchaseTypeName', width: 100 },
  {
    title: '供应商',
    field: 'supplier',
    width: 200,
    formatter: ({ row }) => row.supplierName || row.supplier || row.supplierSapCode || '',
  },
  { title: 'PO单号', field: 'poNo', width: 150 },
  { title: 'PR单号', field: 'prNo', width: 150 },
  { title: '模具类型', field: 'moldTypeName', width: 100 },
  { title: '模具备注', field: 'moldRemark', width: 200 },
  {
    title: '紧急程度',
    field: 'urgentLevelName',
    width: 100,
    slots: {
      default: ({ row }) => {
        try {
          const _color = URGENTLEVEL_STATUS_COLOR_MAP[row.urgentLevel].color;
          return h('span', { style: { color: _color } }, row.urgentLevelName);
        } catch {
          return row.urgentLevelName;
        }
      },
    },
  },
  {
    title: '状态',
    field: 'status',
    width: 100,
    cellRender: {
      name: 'Tag',
      options: STATUS_OPTIONS,
    },
  },
  {
    title: '采购状态',
    field: 'purchaseStatus',
    width: 100,
    cellRender: {
      name: 'Tag',
      options: PURCHASE_STATUS_OPTIONS,
    },
  },
  {
    title: '采购处理时间',
    field: 'purchaseDate',
    width: 150,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  { title: '当前节点', field: 'currentNodeName', width: 100 },
  { title: '当前处理人', field: 'currentProcessorName', width: 180 },
  { title: '节点记录', field: 'nodeRecord', width: 100, slots: { default: 'nodeRecord' } },
  { title: '预估寿命(KPCS)', field: 'estimateLifespan', width: 120 },
  { title: '模具用途', field: 'moldUse', width: 100 },
  {
    title: '仓位',
    field: 'shippingSpaceCode',
    width: 150,
    formatter: ({ row }: any) => {
      return [row.shippingSpaceCode, row.shippingSpaceName].filter(Boolean).join('/');
    },
  },
  { title: '成本中心', field: 'costCenter', width: 220 },
  { title: '费用归属', field: 'costAttribution', width: 100 },
  { title: '内部项目代码', field: 'insideProjectCode', width: 100 },
  { title: '直接客户代码', field: 'immediateCustomerCode', width: 100 },
  { title: '产品类型', field: 'productTypeName', width: 80 },
  { title: '项目阶段', field: 'projectPhaseName', width: 80 },
  { title: '要求交期', field: 'requireDeliveryTime', width: 100, cellRender: { name: 'Date', format: 'YYYY-MM-DD' } },
  { title: '交期回复', field: 'replyDeliveryTime', width: 100, cellRender: { name: 'Date', format: 'YYYY-MM-DD' } },
  { title: '模具采购', field: 'purchaseUserName', width: 180, i18nField: 'moldPurchaseName' },
  { title: '脱敏图纸', field: 'drawingshistory', width: 150, slots: { default: 'drawingshistory' } },
  { title: '推送记录', field: 'pushRecords', width: 100, i18nField: 'CommonCol.pushRecords', slots: { default: 'pushRecords' } },
];

/**
 * 使用路由作为展开表id，将`/`替换为`-`，如: `/engineering/mouldBusiness/review` -> `engineering-mouldBusiness-review-expanded-table`
 * @returns
 */
export function getVxeTableId(path: string) {
  if (!path) {
    return '';
  }

  return `${path.replace('/', '').replaceAll('/', '-')}-expanded-table`;
}

/**
 * 从用户存储中恢复展开子表的自定义配置
 * @param id 展开子表的id
 * @returns 展开子表的自定义配置
 */
export function getTableCustomData(id: string) {
  if (!id) return {};
  return (userStore.getTableCustomConfig(id) || '') as VxeTableDefines.CustomStoreData;
}

/**
 * 保存展开子表的自定义配置到用户存储
 * @param id 展开子表的id
 * @param config 展开子表的自定义配置
 * @returns 保存成功的Promise
 */
export async function saveTableCustomData(id: string, storeData: ExCustomStoreData) {
  if (!id || !storeData) return new Error('id or storeData is empty');
  return createOrUpdateTableCustomData(id, storeData).then(res => {
    // 更新缓存数据
    userStore.setTableCustomConfig(id, storeData);
    return res;
  });
}
