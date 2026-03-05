import { ActionItem, BasicColumn, FormProps } from '/@/components/Table';
import { useBaseStore } from '/@/store/modules/base';
import { getFactoryList } from '/@/api/customerSerivce';

const baseStore = useBaseStore();

export function getColumns() {
  return [
    {
      title: '主要制程',
      field: 'mainProcess',
    },
    {
      title: '工厂',
      field: 'factoryName',
    },
    {
      title: '工厂模具代码',
      field: 'moldCode',
      editRender: {
        name: 'Input',
      },
    },
  ];
}

export function getListColumns() {
  return [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    {
      title: '主要制程',
      field: 'mainProcess',
    },
    {
      title: '工厂',
      field: 'factoryName',
    },
    {
      title: '工厂模具代码',
      field: 'moldCode',
      width: 140,
    },
    {
      title: '模具用途',
      field: 'moldPurpose',
    },
    {
      title: '创建人',
      field: 'creatorUserName',
    },
    {
      title: '创建时间',
      field: 'creatorTime',
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '修改人',
      field: 'lastModifyUserName',
    },
    {
      title: '修改时间',
      field: 'lastModifyTime',
      cellRender: {
        name: 'Date',
      },
    },
  ];
}

export function getFormConfig() {
  return [
    {
      label: '',
      fieldName: 'mainProcess',
      component: 'Input',
      componentProps: {
        placeholder: '主要制程',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'factory',
      component: 'Input',
      i18nField: 'factoryName',
      componentProps: {
        placeholder: '工厂',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'moldCode',
      component: 'Input',
      componentProps: {
        placeholder: '工厂模具代码',
        submitOnPressEnter: true,
      },
    },
    {
      label: '',
      fieldName: 'moldPurpose',
      component: 'Input',
      componentProps: {
        placeholder: '模具用途',
        submitOnPressEnter: true,
      },
    },
  ];
}

export function getTableActions(record): ActionItem[] {
  return [
    {
      icon: 'icon-ym icon-ym-btn-preview',
      // onClick: handleEdit.bind(null, record),
    },
  ];
}

function handleEdit() {
  // openEditPop(true, record);
}
