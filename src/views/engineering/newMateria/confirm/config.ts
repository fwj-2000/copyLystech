import { FormProps } from '/@/components/Table';
import { getFactory } from '/@/api/engineering/newMateria';
import { getMaterialList } from '/@/api/purchase/materialBase';
import { getStatus } from '/@/components/CustomComponents/src/material/Constant';
import { getFactoryList } from '/@/api/customerSerivce';

export function getUnReviewFormConfig() {
  return [
    {
      fieldName: 'applyNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '需求单号',
        allowClear: true,
      },
    },
    {
      fieldName: 'insidePartNumber',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
        allowClear: true,
      },
    },
    {
      fieldName: 'insideNumberOld',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '旧版成品编码',
        allowClear: true,
      },
    },
    {
      fieldName: 'factoryId',
      i18nField: 'CommonCol.factory',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '工厂',
        allowClear: true,
        api: getFactoryList,
        resultField: 'data',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'factory',
        },
        valueField: 'Id',
        immediate: false,
        filterOption: false,
        nameFormat: ['Code', '/', 'Name'],
      },
    },
    {
      fieldName: 'applyUserId',
      i18nField: 'CommonCol.applyUser',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '申请人',
        allowClear: true,
      },
    },
    {
      fieldName: 'currentProcessorId',
      i18nField: 'CommonCol.currentNodeUser',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '当前处理人',
        allowClear: true,
      },
    },
    // {
    //   fieldName: 'materialAreaId',
    //   i18nField: 'materialAreaName',
    //   label: '',
    //   component: 'ApiSelect',
    //   componentProps: {
    //     placeholder: '材料归属',
    //     api: getMaterialList,
    //     apiSearch: {
    //       show: false,
    //     },
    //     params: {
    //       isSelectRoot: 'true',
    //       displayArea: 'MaterialWarehouse',
    //     },
    //     resultField: 'data.list',
    //     labelField: 'fullName',
    //     valueField: 'id',
    //     showSearch: false,
    //     immediate: true,
    //     filterOption: false,
    //   },
    // },
    {
      fieldName: 'status',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '状态',
        options: getStatus(),
        allowClear: true,
      },
    },
  ];
}
