import { getLineInfoListBySearchKey, getFactoryAreaList } from '/@/api/equipment/information';
import { useI18n } from '/@/hooks/web/useI18n';

const { t } = useI18n();

export const getFormConfig = () => {
  return [
    {
      fieldName: 'Code',
      label: '',
      i18nField: 'Code',
      component: 'Input',
      componentProps: {
        placeholder: '请输入设备编码',
      },
    },
    {
      fieldName: 'Name',
      label: '',
      i18nField: 'Name',
      component: 'Input',
      componentProps: {
        placeholder: '请输入设备名称',
      },
    },
    {
      fieldName: 'factoryArea',
      label: '',
      i18nField: 'FactoryAreaName',
      component: 'ApiSelect',
      componentProps: {
        api: getFactoryAreaList,
        placeholder: '请选择厂区',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'searchKey',
        },
        resultField: 'data',
        filterOption: false,
        // notFoundContent: null,
        immediate: true,
        useChangeCopy: true,
        labelField: 'name',
        valueField: 'id',
        nameFormat: ['name'],
      },
      colProps: { span: 4 },
    },
    {
      fieldName: 'customizeCode',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入管制编码',
      },
      colProps: { span: 4 },
    },
    {
      fieldName: 'Type',
      label: '',
      component: 'Select',
      componentProps: {
        allowClear: true,
        placeholder: '请选择设备类型',
        fieldNames: {
          label: 'fullName',
          value: 'id',
        },
      },
    },
    {
      fieldName: 'LineInfoId',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        beforeFetch: (params: any) => {
          const { searchKey } = params;
          return searchKey ?? ' ';
        },
        api: getLineInfoListBySearchKey, // 动态获取线体列表的接口
        placeholder: '请选择线体',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'searchKey', // 搜索参数名
        },
        resultField: 'data',
        labelField: 'LineName',
        valueField: 'Id',
        filterOption: false,
      },
    },
  ];
};
export const getColumn = () => {
  return [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    { title: '厂区', field: 'FactoryAreaName', width: 120 },
    { title: 'SAP厂区', field: 'sapFactoryAreaName', width: 120 },
    {
      title: '铭牌出厂日期',
      field: 'sapManufactureDate',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
      width: 120,
    },
    { title: 'SAP设备型号', field: 'sapEquipmentModel', width: 120 },
    { title: '设备类型', field: 'Type', slots: { default: 'Type' } },
    { title: '设备分类', field: 'Category', slots: { default: 'Category' } },
    { title: '设备编码', field: 'Code' },
    { title: '固定资产编码', field: 'AssetCode' },
    { title: '管制编码', field: 'customizeCode' },
    { title: '固定资产名称', field: 'Name' },
    { title: '规格型号', field: 'Specification' },
    { title: '机身序列号', field: 'SerialNumber' },
    { title: '品牌', field: 'brand' },
    { title: '设备制造商', field: 'SupplierName' },
    {
      title: '实物是否存在',
      field: 'Exist',
      width: 100,
      slots: { default: 'Exist' },
      // cellRender: {
      //   name: 'Tag',
      //   options: [
      //     { id: 1, fullName: t('common.yesText'), theme: 'green' },
      //     { id: 2, fullName: t('common.noText'), theme: 'red' },//??? 待确认
      //   ],
      // },
    },
    { title: '使用状态', field: 'UseStatus', width: 100, slots: { default: 'UseStatus' } },
    { title: '异常备注', field: 'faultReasonName' },
    { title: '设备型号', field: 'EquipmentModel' },
    { title: '物理位置', field: 'Position' },
    { title: '使用部门', field: 'DepartmentId' },
    { title: '是否启用', field: 'Status', width: 100, slots: { default: 'Status' } },
    { title: '线体', field: 'LineInfoName' },
    { title: '责任人', field: 'DutyUserName' },
    { title: '是否专用设备', field: 'UseSpecial', width: 100, slots: { default: 'UseSpecial' } },
    { title: '使用年限', field: 'ServiceLife', slots: { default: 'ServiceLife' } },
    {
      title: '到厂时间',
      field: 'ArrivalTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    { title: '财务折旧', field: 'Depreciation' },
    { title: '所属组织', field: 'OrgName' },
    { title: '备注', field: 'Remark' },
    { title: 'IP地址', field: 'AddressIp' },
    { title: '端口号', field: 'AddressPort' },
    { title: '设备量程/mm', field: 'equipmentSpan' },
    { title: '创建人', field: 'CreatorUserName' },
    {
      title: '创建时间',
      field: 'CreatorTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    { title: '修改人', field: 'LastModifyUserName' },
    {
      title: '修改时间',
      field: 'LastModifyTime',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    },
  ];
};
