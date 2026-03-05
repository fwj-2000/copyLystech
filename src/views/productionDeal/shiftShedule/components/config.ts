import { FormSchema } from '/@/components/Table';
import { VxeGridPropTypes } from 'vxe-table';

export const baseColumns: VxeGridPropTypes.Columns = [
  { type: 'checkbox', field: 'checkbox', align: 'center' },
  // {
  //   field: 'seq',
  //   type: 'seq',
  //   title: '序号',
  //   align: 'center',
  // },
  {
    field: 'dutyPersonName',
    title: '姓名',
    minWidth: 200,
  },
];
