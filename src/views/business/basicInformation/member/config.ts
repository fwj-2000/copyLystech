import { BasicColumn } from '/@/components/Table';

export type memberType = 'metaria' | 'custome' | 'innerCode';

export const metarialColumns = [
  {
    title: '料件号',
    dataIndex: 'materialPartsNumber',
  },
  {
    title: '工厂',
    dataIndex: 'factory',
  },
  {
    title: '生产类型',
    width: 100,
    dataIndex: 'productionTypeDesc',
  },
];

export const customerCoulumn = [
  {
    title: '直接客户',
    dataIndex: 'immediateCustomerName',
  },
  {
    title: '内部项目代码',
    dataIndex: 'insideProjectCode',
  },
];

export const innercodeCoulumn = [
  {
    title: '内部项目代码',
    dataIndex: 'insideProjectCode',
  },
];

export const commonColumns: BasicColumn[] = [
  { title: '组织名称', dataIndex: 'orgName', resizable: true, width: 100 },
  { title: '创建人', dataIndex: 'creatorUserName', resizable: true, width: 100 },
  { title: '创建时间', dataIndex: 'creatorTime', width: 100, format: 'date|YYYY-MM-DD' },
  { title: '修改人', dataIndex: 'lastModifyUserName', resizable: true, width: 100 },
  { title: '修改时间', dataIndex: 'lastModifyTime', width: 100, format: 'date|YYYY-MM-DD' },
];
