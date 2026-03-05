import { BasicColumn } from '/@/components/Table';

export const previewColumns: BasicColumn[] = [
  { title: '工单号', dataIndex: 'workOrderNo', align: 'left' },
  { title: '调离岗位', dataIndex: 'transferTypeName', align: 'left' },
  { title: '产品名称', dataIndex: 'productCode', align: 'left' },
  { title: '机台', dataIndex: 'machineNo', sorter: true, align: 'left' },
  { title: '调离类型', dataIndex: 'transferPositionName', align: 'left' },
  { title: '班次', dataIndex: 'classesName', sorter: true, align: 'left' },
  { title: '备注', dataIndex: 'remark' },
];

const baseColumns: BasicColumn[] = [
  { title: '工单号', dataIndex: 'workOrderNo', align: 'left' },
  { title: '姓名', dataIndex: 'fullName', align: 'left' },
  { title: '厂别', dataIndex: 'factoryName', align: 'left' },
  { title: '组别ID', dataIndex: 'group', align: 'left' },
  { title: '组别名称', dataIndex: 'groupName', align: 'left' },
  { title: '调离岗位', dataIndex: 'transferTypeName', align: 'left' },
  { title: '产品名称', dataIndex: 'productCode', align: 'left' },
  { title: '机台', dataIndex: 'machineNo', sorter: true, align: 'left' },
  { title: '调离类型', dataIndex: 'transferPositionName', align: 'left' },
  { title: '班次', dataIndex: 'classesName', sorter: true, align: 'left' },
  { title: '备注', dataIndex: 'remark' },
];

export const columns: BasicColumn[] = [
  ...baseColumns,
  { title: '创建人', dataIndex: 'creatorUserName', sorter: true, align: 'left' },
  { title: '创建时间', dataIndex: 'creatorTime', format: 'date|YYYY-MM-DD HH:mm:ss', sorter: true, align: 'left' },
  // { title: '修改人', dataIndex: 'lastModifyUserName', width: 90 },
  // { title: '修改时间', dataIndex: 'lastModifyTime', format: 'date|YYYY-MM-DD HH:mm:ss' },
];

export const importColumns: BasicColumn[] = [
  { title: 'excel行号', dataIndex: 'number', width: 120, key: 'number', sorter: true },
  { title: '数据', dataIndex: 'errorMsg', width: 100 },
  ...baseColumns,
];
