import { getSpaceList, getUnitList } from '/@/api/engineering/sample';
// import { getFactoryList } from '/@/api/business/shippingspace';
import { cloneDeep } from 'lodash-es';
import { h } from 'vue';
// 表格新一行字段
export const columnOption = {
  insidePartNumber: '',
  applyShippingSpaceId: '',
  factoryId: '',
  personEngineeringId: '',
  purchaseUserId: '',
  innerMaterialNumber: '',
  innerExternalNumber: '',
  productSizeLong: '',
  productSizeWide: '',
  description: '',
  specifications: '',
  qty: '',
  measurementUnitId: '',
  currentStage: '',
  requestArrivalDate: '',
  remark: '',
  terminalCustomerCode: '',
  immediateCustomerCode: '',
  insideProjectCode: '',
  productArea: '',
};

// 数据配置
export const dataConfig: any = [
  {
    title: '成品内部料号',
    dataIndex: 'insidePartNumber',
    width: 240,
  },
  {
    title: '申请仓位',
    width: 200,
    dataIndex: 'applyShippingSpaceName',
    extra: 'applyShippingSpaceCode',
    sign: '/',
    customRender: ({ text, record }) => {
      return text + '/' + record.applyShippingSpaceCode;
    },
  },
  {
    title: '生产工厂',
    width: 200,
    dataIndex: 'factoryName',
    extra: 'factoryCode',
    sign: '/',
    customRender: ({ text, record }) => {
      return text + '/' + record.factoryCode;
    },
  },
  { title: '责任工程师', dataIndex: 'personEngineeringName' },
  { title: '采购', dataIndex: 'purchaseUserName' },
  { title: '材料内部料号', dataIndex: 'innerMaterialNumber', width: 120 },
  { title: '原厂商型号', dataIndex: 'innerExternalNumber', width: 120 },
  { title: '应用描述', dataIndex: 'description', width: 120 },
  { title: '申请样品规格', dataIndex: 'specifications', width: 120 },
  { title: '申请数量', dataIndex: 'qty', width: 120 },
  { title: '计量单位', dataIndex: 'measurementUnit', width: 120 },
  { title: '成品打样数量（KPCS）', dataIndex: 'finishedProductQty', width: 120 },
  { title: '所处阶段', dataIndex: 'currentStageDesc', width: 120 },
  { title: '要求到样日期', dataIndex: 'requestArrivalDate', width: 120, format: 'date|YYYY-MM-DD' },
  { title: '备注', dataIndex: 'remark', width: 120 },
  {
    title: '终端客户',
    dataIndex: 'terminalCustomerCode',
    width: 160,
    extra: 'terminalCustomerName',
    sign: '/',
    customRender: ({ text, record }) => {
      return text + '/' + record.terminalCustomerName;
    },
  },
  { title: '内部项目代码', dataIndex: 'insideProjectCode', width: 200 },
  // {
  //   title: '直接客户',
  //   dataIndex: 'immediateCustomerCode',
  //   width: 200,
  //   extra: 'immediateCustomerName',
  //   sign: '/',
  //   customRender: ({ text, record }) => {
  //     return text + '/' + record.immediateCustomerName;
  //   },
  // },
  { title: '产品尺寸长(mm)', dataIndex: 'productSizeLong', width: 120 },
  { title: '产品尺寸宽(mm)', dataIndex: 'productSizeWide', width: 120 },
  {
    title: '产品面积(m²)',
    dataIndex: 'productArea',
    width: 200,
  },
];

// 详情
const _detailColumn = cloneDeep(dataConfig);
_detailColumn.splice(
  2,
  0,
  {
    title: '采购回复',
    dataIndex: 'purchaseReplyStatusDesc',
    width: 120,
    customRender: ({ text, record }) => {
      if (record.newsEngineeringStatus == 1) {
        return h('span', { class: 'news-dot right' }, text);
      }
      return text;
    },
  },
  {
    title: '回复日期',
    dataIndex: 'purchaseReplyTime',
    format: 'date|YYYY-MM-DD',
  },
);
export const detailColumn = _detailColumn;

// 采购回复字段
export const purchaseConfig = [
  { title: '计划来料申请样品规格', dataIndex: 'planSpecifications' },
  { title: '计划来料数量', dataIndex: 'planQty' },
  { title: '计量单位', dataIndex: 'measurementUnit' },
  { title: '预计交期', dataIndex: 'expectedDeliveryDateTime' },
  { title: '快递信息', dataIndex: 'expressInformation', extra: 'expressNumber', sign: '-' },
];
// 工程恢复字段
export const engineerConfig = [
  { title: '意见', dataIndex: 'opinionDesc' },
  { title: '备注', dataIndex: 'remark' },
];

export const descOptions = {
  column: { xs: 1, sm: 2, md: 4 },
  labelStyle: { color: '#999', fontSize: '14px' },
  contentStyle: { color: '#1A1A1A', fontSize: '14px' },
};

// export async function getFarhors(k?: string) {
//   const list = (
//     await getFactoryList({
//       factoryCode: k,
//     })
//   ).data;
//   const factoryList: any = [];
//   (list || []).forEach(i => {
//     factoryList.push({
//       id: i.Code,
//       fullName: i.Name + '/' + i.Code,
//       ManagerName: i.ManagerName,
//     });
//   });
//   return factoryList;
// }

// export async function getSpaces(k?: string) {
//   const list = (await getSpaceList(k)).data;
//   const _list: any = [];
//   (list || []).forEach(i => {
//     _list.push({
//       id: i.id,
//       fullName: i.shippingSpaceName + '/' + i.shippingSpaceCode,
//       shippingSpaceCode: i.shippingSpaceCode,
//       factoryId: i.factoryCode,
//       factoryName: i.factoryCode + '/' + i.factoryName,
//     });
//   });
//   return _list;
// }

export async function getUnits(k?: string) {
  const list = (await getUnitList(k)).data;
  const _list: any = [];
  (list || []).forEach(i => {
    _list.push({
      id: i.Id,
      fullName: i.Name + '/' + i.Code,
      Code: i.Code,
    });
  });
  return _list;
}
