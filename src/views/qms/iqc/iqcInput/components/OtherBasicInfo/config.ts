import { FormSchema } from '/@/components/Form';
import { getMaterialList } from '/@/api/purchase/materialBase';

/// 其他基础信息
export const OTHERBASICINFO_SCHEMAS: FormSchema[] = [
  {
    field: 'materialTypeBigId',
    label: '材料归属',
    component: 'ApiSelect',
    componentProps: {
      api: getMaterialList,
      apiSearch: {
        show: false,
      },
      params: {
        isSelectRoot: 'true',
        displayArea: 'MaterialWarehouse',
      },
      resultField: 'data.list',
      labelField: 'fullName',
      valueField: 'id',
      showSearch: false,
      immediate: true,
      filterOption: false,
    },
    required: true,
  },
  {
    field: 'materialTypeId',
    label: '材料类型',
    component: 'Select',
    componentProps: {
      fieldNames: {
        value: 'id',
        label: 'fullName',
      },
      options: [],
    },
    // ifShow: data => {
    //   return data.model.materialAreaId;
    // },
    required: true,
  },
  {
    field: 'notifyPeopleId',
    label: '知会人',
    component: 'CustomUserSelect',
    componentProps: {
      multiple: true,
      showSearch: false,
      placeholder: '项目成员',
      immediate: true,
    },
  },
  { field: 'remark', component: 'Input', label: '备注' },
];
