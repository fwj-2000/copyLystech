import { useBaseStore } from '/@/store/modules/base';
import { getFactoryList } from '/@/api/qualityAssurance/cpk';
import { useI18n } from '/@/hooks/web/useI18n';
import { IS_YSE_LIST } from '/@/components/CustomComponents/src/Constant';
import { shippingSpaceTypeOpiotns } from '/@/views/basicData/shippingSpace/config';

const baseStore = useBaseStore();

const { t } = useI18n();

export function getSchema() {
  return [
    // {
    //   fieldName: 'mainProcess',
    //   label: '',
    //   component: 'ApiSelect',
    //   componentProps: {
    //     api: () => baseStore.getDictionaryData('MainProcess'),
    //     resultField: 'data',
    //     labelField: 'fullName',
    //     valueField: 'enCode',
    //     placeholder: '主要制程',
    //     style: 'width: 100%',
    //     allowClear: true,
    //   },
    // },
    {
      fieldName: 'factoryArea',
      label: '',
      i18nField: 'factory',
      component: 'ApiSelect',
      componentProps: {
        api: getFactoryList,
        allowClear: true,
        showSearch: true,
        apiSearch: {
          show: true,
          // searchName: 'factoryCode',
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        nameFormat: ['Code', '/', 'Name'],
        filterOption: (keyword, data) => {
          if (data.label.includes(keyword)) {
            return true;
          }
        },
        immediate: true,
      },
    },
    {
      fieldName: 'workOrderType',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '工单类型',
      },
    },
    {
      fieldName: 'isTag',
      label: '',
      component: 'Select',
      componentProps: {
        fieldNames: { label: 'fullName', value: 'enCode' },
        options: [
          { fullName: t('dict.TransferEnum.Yes'), enCode: 1 },
          { fullName: t('dict.TransferEnum.No'), enCode: 0 },
        ],
      },
    },
  ];
}

export function getColumns() {
  return [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    {
      title: '工厂',
      field: 'factoryAreaName',
      width: 240,
      sortable: true,
    },
    {
      title: '工单类型',
      field: 'workOrderType',
      width: 240,
      sortable: true,
    },
    {
      title: '是否CPK标识',
      field: 'isTag',
      width: 240,
      cellRender: {
        name: 'Tag',
        options: IS_YSE_LIST,
      },
    },
    {
      title: '创建人',
      field: 'creatorUserName',
      minWidth: 140,
      sortable: true,
    },
    {
      title: '创建时间',
      field: 'creatorTime',
      minWidth: 140,
      sortable: true,
      cellRender: { name: 'Date' },
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 70,
      fixed: 'right',
    },
  ];
}

export function getAddColumns() {
  return [
    {
      title: '工厂',
      field: 'factoryArea',
      minWidth: 100,
      width: 220,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getFactoryList,
          allowClear: true,
          showSearch: true,
          apiSearch: {
            show: true,
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          nameFormat: ['Code', '/', 'Name'],
          filterOption: (keyword, data) => {
            if (data.label.includes(keyword)) {
              return true;
            }
          },
          immediate: true,
          onChange: (_, data, { row }) => {
            const label = data.label || _;
            row.factoryAreaName = label;
            console.log(row);
          },
        },
      },
    },
    {
      title: '工单类型',
      field: 'workOrderType',
      editRender: {
        name: 'Input',
      },
      minWidth: 10,
      // width: 220,
    },
    {
      title: '是否CPK标识',
      field: 'isTag',
      editRender: {
        name: 'ASelect',
        props: {
          fieldNames: { label: 'fullName', value: 'enCode' },
          options: [
            { fullName: t('dict.TransferEnum.Yes'), enCode: 1 },
            { fullName: t('dict.TransferEnum.No'), enCode: 0 },
          ],
        },
      },
      minWidth: 10,
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    },
  ];
}
