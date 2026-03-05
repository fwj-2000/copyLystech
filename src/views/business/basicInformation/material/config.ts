import type { FormSchema } from '/@/components/Form/src/types/form';

import { getConfigTypes } from '/@/api/business/member';
import { BasicColumn } from '/@/components/Table';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

// 获取主要制程
export async function getMainProcess() {
  const r = await getConfigTypes(['mainProcess']);
  const _obj = r.data[0].typeList;
  const _list: any = [];
  for (let k in _obj) {
    _list.push({
      id: Number(k),
      fullName: _obj[k],
    });
  }
  return _list;
}

export const StatusList = [
  {
    id: 1,
    fullName: t('dict.enableStatus.1'),
    theme: 'green',
  },
  {
    id: 2,
    fullName: t('dict.enableStatus.2'),
    theme: 'red',
  },
];
export const commonCols: BasicColumn[] = [
  { title: '材料归属', dataIndex: 'MaterialAreaName' },
  { title: '材料内部料号', dataIndex: 'MaterialCode' },
  // {
  //   title: '材料形态',
  //   dataIndex: 'MaterialForm',
  // },
  { title: '原厂商型号', dataIndex: 'OriginalModelNumber' },
  // { title: '供应商简称', dataIndex: 'SupplierName' },
  // { title: '原厂商简称', dataIndex: 'OriginalManufacturerName' },
  // { title: '材料类型', dataIndex: 'MaterialClassName' },
  // { title: '三级分类', dataIndex: 'ThreeLevelName' },
  // { title: '基材类型', dataIndex: 'MaterialQualityName' },
  { title: '材料宽度(MM)', dataIndex: 'MaterialWidth' },
  { title: '材料长度(M)', dataIndex: 'MaterialLength' },
  { title: '总厚度', dataIndex: 'TotalThickness' },
  // { title: '厚度单位', dataIndex: 'ThicknessUnit' },
  // { title: '涂层厚度', dataIndex: 'Tds' },
  // { title: '涂层类型', dataIndex: 'CoatingType' },
  // { title: '基材厚度', dataIndex: 'SubstrateThickness' },
  // { title: '厚度公差', dataIndex: 'Tolerance' },
  { title: '材料规格', dataIndex: 'MaterialSpec', width: 200 },
  // { title: '克重', dataIndex: 'Grammage' },
  // { title: '结构组成', dataIndex: 'Layers' },
  // { title: '颜色', dataIndex: 'MaterialColor' },
  // { title: '其他要求', dataIndex: 'OtherRequirements' },
  // { title: '抗静电功能', dataIndex: 'AntistaticRequirements' },
  { title: '材料描述', dataIndex: 'MaterialDesc', baseCols: { cols: 24 } },
];

export const columns: BasicColumn[] = [
  // { title: '材料内部料号', dataIndex: 'MaterialCode' },
  ...commonCols,
  { title: '主要制程', dataIndex: 'MainProcessDesc', width: 100, i18nField: 'CommonCol.mainProcess' },
  { title: '是否启用', dataIndex: 'Status', width: 100, format: 'tag|' + JSON.stringify(StatusList) },
  // { title: '技术资料', dataIndex: 'files', width: 100 },
  { title: '创建时间', dataIndex: 'CreatorTime', i18nField: 'CreatorDateTime', format: 'date|YYYY/MM/DD' },
  { title: '创建人', dataIndex: 'CreatorUserName' },
  { title: '修改时间', dataIndex: 'LastModifyTime', i18nField: 'LastModifyDateTime', format: 'date|YYYY/MM/DD' },
  { title: '修改人', dataIndex: 'LastModifyUserName' },
];

export const baseFormConfig: Array<FormSchema> = [
  {
    field: 'MaterialCode',
    label: '材料内部料号',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'MaterialAreaName',
    label: '材料归属',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'OriginalModelNumber',
    label: '原厂商型号',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'MaterialWidth',
    label: '材料宽度(MM)',
    component: 'InputNumber',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'MaterialLength',
    label: '材料长度(M)',
    component: 'InputNumber',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'TotalThickness',
    label: '总厚度',
    component: 'InputNumber',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'MaterialSpec',
    label: '材料规格',
    component: 'Input',
  },
  {
    field: 'MaterialDesc',
    label: '材料描述',
    component: 'Input',
  },
];

// 排序
export function sortByOrderList(list: any[], orderList: string[]) {
  const res: any = [];
  for (let i = 0; i < orderList.length; i++) {
    const item = list.find(item => item.id === orderList[i]);
    if (item) {
      res.push(item);
    }
  }
  return res;
}
