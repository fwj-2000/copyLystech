import { useI18n } from '/@/hooks/web/useI18n';
import { getSapCompanyCode } from '/@/api/basicData/productCodeApply';

const { t } = useI18n();

export function getColumns() {
  return [
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    // 产品内部料号
    {
      title: t('dict.PartNumberApplyColumn.InsidePartNumber'),
      field: 'InsidePartNumber',
      minWidth: 220,
    },
    // 终端客户料号
    {
      title: t('dict.PartNumberApplyColumn.TerminalCustomerPartNumber'),
      field: 'TerminalCustomerPartNumber',
      minWidth: 160,
    },
    // 工厂
    {
      title: t('dict.PartNumberApplyColumn.Factory'),
      field: 'Factory',
      minWidth: 160,
    },
    // 终端config描述
    {
      title: t('dict.PartNumberApplyColumn.ConfigDescription'),
      field: 'ConfigDescription',
      minWidth: 160,
      editRender: {
        name: 'Input',
      },
    },
    // AE料号
    {
      title: t('dict.PartNumberApplyColumn.AEPartNumber'),
      field: 'AEPartNumber',
      minWidth: 160,
      editRender: {
        name: 'Input',
      },
    },
    // 直接项目代码
    {
      title: t('dict.PartNumberApplyColumn.ImmediateCustomerProjectCode'),
      field: 'ImmediateCustomerProjectCode',
      minWidth: 160,
      editRender: {
        name: 'Input',
      },
    },
    // 直接客户SAP代码
    {
      field: 'ImmediateCustomerSapCode',
      title: t('dict.PartNumberApplyColumn.ImmediateCustomerSapCode'),
      component: 'Input',
      componentProps: { disabled: true },
    },
    // 直接客户料号
    {
      title: t('dict.PartNumberApplyColumn.ImmediateCustomerPartNumber'),
      field: 'ImmediateCustomerPartNumber',
      minWidth: 160,
      editRender: {
        name: 'Input',
      },
    },
    // 直接客户料号2
    {
      title: t('dict.PartNumberApplyColumn.ImmediateCustomerPartNumber2'),
      field: 'ImmediateCustomerPartNumber2',
      minWidth: 160,
      editRender: {
        name: 'Input',
      },
    },
    // 直接客户料号版本
    {
      title: t('dict.PartNumberApplyColumn.ImmediateCustomerPartVersion'),
      field: 'ImmediateCustomerPartVersion',
      minWidth: 160,
      editRender: {
        name: 'Input',
      },
    },
    // 直接客户Config描述
    {
      title: t('dict.PartNumberApplyColumn.ImmediateCustomerConfigDescription'),
      field: 'ImmediateCustomerConfigDescription',
      minWidth: 160,
      editRender: {
        name: 'Input',
      },
    },
    // 产品描述
    {
      title: t('dict.PartNumberApplyColumn.ProductDesc'),
      field: 'ProductDesc',
      minWidth: 160,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: 'V63config',
      field: 'VSTC',
      width: 150,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: 'V67config',
      field: 'VSSC',
      width: 150,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: 'V68config',
      field: 'VSEC',
      width: 150,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: 'V62config',
      field: 'VSixtyTwoConfig',
      width: 150,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: 'V64config',
      field: 'V64config',
      width: 150,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: 'V69config',
      field: 'V69config',
      width: 150,
      editRender: {
        name: 'Input',
      },
    },
    // 产品代码
    {
      title: t('dict.PartNumberApplyColumn.ProductCode'),
      field: 'ProductCode',
      width: 150,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: 'Batch',
      field: 'Batch',
      width: 150,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: 'V63Description',
      field: 'VSTD',
      width: 150,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: 'V64Description',
      field: 'VSFD',
      width: 150,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: 'config34',
      field: 'CTF',
      width: 150,
      editRender: {
        name: 'Input',
      },
    },
    // 标签打印版本
    {
      title: t('dict.PartNumberApplyColumn.LabelPV'),
      field: 'LabelPV',
      width: 150,
      editRender: {
        name: 'Input',
      },
    },
    // SAP公司代码
    {
      field: 'SapCompanyCode',
      title: t('dict.PartNumberApplyColumn.SapCompanyCode'),
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'SapCompanyName',
        props: {
          api: getSapCompanyCode,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'name',
          },
          resultField: 'data',
          labelField: 'name',
          valueField: 'code',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          nameFormat: ['code', '/', 'name'],
        },
      },
    },
  ];
}

export const editRules: any = {};
