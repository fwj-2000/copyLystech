import type { VxeGridPropTypes } from '/@/components/VxeTable';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { STATUS_ENUM } from '/@/views/engineering/basicInformation/semifinishedproducts/config';
import { getFactoryList } from '/@/api/business/shippingspace';
import { getQuantitationApplyDetailByMaterial } from '/@/api/business/quantitation';
import { handleInsidePartNumberChange } from '/@/views/business/basicInformation/workCenter/components/detailConfig';

const { t } = useI18n();
const { createMessage } = useMessage();

export const statusOptions = [
  { label: t('dict.enableStatus.1'), value: STATUS_ENUM.启用, fullName: t('dict.enableStatus.1'), id: STATUS_ENUM.启用, theme: 'green' },
  { label: t('dict.enableStatus.2'), value: STATUS_ENUM.禁用, fullName: t('dict.enableStatus.2'), id: STATUS_ENUM.禁用, theme: 'red' },
];
export const DETAIL_PAGE_TYPE_ENUM = {
  新增: '1',
  升版: '2',
  修改: '3',
};

export function getFormConfig() {
  return [
    {
      fieldName: 'sapCode',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: 'SAP工厂代码',
        allowClear: true,
      },
      width: 100,
    },
    {
      fieldName: 'factory',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '工厂代码',
        allowClear: true,
      },
    },
    {
      fieldName: 'creatorUserName',
      label: '',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
    },
    {
      fieldName: 'lastModifyUserName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '修改人',
        allowClear: true,
      },
    },
  ];
}

export function getColumn(): VxeGridPropTypes.Columns {
  return [
    {
      type: 'checkbox',
      field: 'checkbox',
    },
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    {
      title: 'SAP工厂代码',
      field: 'sapCode',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: '工厂代码',
      field: 'factory',
      width: 200,
    },
    // {
    // 	title: '是否启用',
    // 	field: 'enableStatusEnum',
    // 	// @ts-ignore
    // 	i18nField: 'enableStatus',
    // 	sortable: true,
    // 	width: 200,
    // 	cellRender: {
    // 		name: 'Tag',
    // 		options: statusOptions,
    // 	},
    // },
    {
      title: '工作中心代码',
      field: 'code',
      formatter: ({ row, cellValue }) => row.materialTypeName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          // api: getSubclassCodeList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
        },
      },
      width: 200,
    },
    {
      title: '工作中心名称',
      field: 'name',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: '是否启用',
      field: 'enable',
      // @ts-ignore
      i18nField: 'enableStatus',
      sortable: true,
      width: 160,
      cellRender: {
        name: 'Tag',
        options: statusOptions,
      },
    },
    {
      title: '备注',
      field: 'remark',
      // sortable: true,
      width: 200,
    },
    {
      title: '引入人',
      field: 'creatorUserName',
      // sortable: true,
      width: 200,
    },
    {
      title: '引入时间',
      field: 'creatorTime',
      sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'DatePicker' },
      width: 200,
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '修改人',
      field: 'lastModifyUserName',
      // sortable: true,
      width: 200,
    },
    {
      title: '修改时间',
      field: 'lastModifyTime',
      sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'DatePicker' },
      width: 200,
      cellRender: {
        name: 'Date',
      },
    },
    {
      title: '主要制程',
      field: 'mainProcessName',
      // sortable: true,
      width: 200,
    },
  ];
}
