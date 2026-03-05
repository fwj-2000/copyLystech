import { BasicColumn } from '/@/components/Table';
import { getFactoryListByName, getMaterialList, addSplitingRecordData } from '/@/api/productionDeal/splitingPrint';
import { FormSchema } from '/@/components/Form';
export const columns: BasicColumn[] = [
  { title: '工厂代码', dataIndex: 'FactoryCode', width: 80 },
  { title: '类型', dataIndex: 'Type', width: 50 },
  { title: '工单号', dataIndex: 'WorkOrderNo', width: 120 },
  { title: '物料', dataIndex: 'Material', width: 150 },
  { title: '支数', dataIndex: 'BranchQuantity', width: 50 },
  { title: '需求数量', dataIndex: 'DemandedQuantity', width: 80 },
  { title: '备注', dataIndex: 'Remark', width: 200 },
  { title: '规格', dataIndex: 'Specifications', width: 70 },
  { title: '卷数', dataIndex: 'VolumeQuantity', width: 70 },
  { title: '余料', dataIndex: 'LeaveMaterial', width: 100 },
  { title: '转单', dataIndex: 'TransformOrder', width: 120 },
  { title: '标签数量', dataIndex: 'LabelQuantity', width: 100 },
  { title: '已打标签数', dataIndex: 'PrintedLabelQuantity', width: 100 },
];
//  新加数据的初始值
export const columnsOps = {
  step: '',
  personType: '',
  personLiableId: '',
  personLiableNmae: '',
};

export async function getFactroys(name) {
  const r = await getFactoryListByName(name);
  return r.data.map(el => {
    return {
      id: el.Id,
      fullName: el.FullName,
      code: el.EnCode,
    };
  });
}

export async function getMaterials(data) {
  const r = await getMaterialList(data);
  return r.data;
}

export async function addRecordData(data) {
  const r = await addSplitingRecordData(data);
  return r;
}

export const formSchema: FormSchema[] = [
  {
    field: 'factoryCode',
    slot: 'factoryCode',
    label: '选择厂区',
    labelWidth: 70,
    component: 'Input',
    colProps: { span: 5 },
  },
  // {
  //   field: 'pickerVal',
  //   label: '选择日期:',
  //   labelWidth: 70,
  //   component: 'DateRange',
  //   colProps: { span: 6 },
  // },
  {
    field: 'innerMaterialCode',
    slot: 'innerMaterialCode',
    label: '内部料号',
    labelWidth: 80,
    required: true,
    component: 'Input',
    colProps: {
      span: 14,
    },
  },
];
