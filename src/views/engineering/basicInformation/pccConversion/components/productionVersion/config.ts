import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { isExportOptions, isSyncOptions, renderIsSyncTableCell } from '../../config';
import { useI18n } from '/@/hooks/web/useI18n';
import { getFactoryList } from '/@/api/engineering/sample';
import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();

/**
 * 清单页 - 筛选表单配置
 * @returns
 */
export function getFormConfig() {
  return [
    // {
    //   fieldName: 'sapfactory',
    //   label: '',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '工厂',
    //     allowClear: true,
    //   },
    //   width: 100,
    // },
    // {
    //   fieldName: 'insidePartNumber',
    //   label: '',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '物料编码',
    //     allowClear: true,
    //   },
    //   width: 100,
    // },
    // {
    //   fieldName: 'purchaseUserName',
    //   label: '',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '生产版本',
    //     allowClear: true,
    //   },
    // },
    // {
    //   fieldName: 'personEngineeringName',
    //   label: '',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '生产版本描述',
    //     allowClear: true,
    //   },
    // },
    // {
    //   fieldName: 'terminalCustomerName',
    //   label: '',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '工艺路线组',
    //     allowClear: true,
    //   },
    // },
  ];
}

/**
 * 清单页 - 表格列配置
 * @returns
 */
export function getColumn(): Array<VxeGridPropTypes.Column & Partial<Record<'i18nField', string>>> {
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
    // 是否导出
    {
      title: t('dict.CommonCol.isExport'),
      field: 'isExport',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ASelect',
        props: {
          options: isExportOptions,
          fieldNames: {
            label: 'fullName',
            value: 'id',
          },
        },
      },
      cellRender: {
        name: 'Tag',
        options: isExportOptions,
      },
      minWidth: 100,
    },
    // 导出时间
    {
      title: t('common.exportTime'),
      field: 'exportTime',
      minWidth: 150,
      cellRender: {
        name: 'Date',
        // @ts-ignore
        format: 'YYYY-MM-DD',
      },
      filters: [{ data: '' }],
      filterRender: {
        name: 'DatePicker',
      },
    },
    // 是否同步
    {
      title: t('dict.bomtosap.isSync'),
      field: 'isSync',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ASelect',
        props: {
          options: isSyncOptions,
          fieldNames: {
            label: 'fullName',
            value: 'id',
          },
        },
      },
      slots: {
        default: ({ row }) => renderIsSyncTableCell(row),
      },
      minWidth: 100,
    },
    // sap同步时间
    {
      title: t('dict.bomtosap.syncSapTime'),
      field: 'syncSapTime',
      filters: [{ data: '' }],
      filterRender: { name: 'DatePicker' },
      minWidth: 130,
      cellRender: {
        name: 'Date',
        // @ts-ignore
        format: 'YYYY-MM-DD',
      },
    },
    // sap同步错误信息
    {
      title: t('dict.bomtosap.syncSapError'),
      field: 'syncSapError',
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      minWidth: 200,
    },
    // 生产工厂
    {
      title: t('dict.PCCColumn.factory'),
      field: 'produceFactory',
      formatter: ({ cellValue, row }) => row.produceFactoryName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          api: getFactoryList,
          // apiSearch: {
          //   show: true,
          //   searchName: 'Name',
          // },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          showSearch: true,
          immediate: true,
          alwaysLoad: true,
          filterOption: (input: string, option: { label: string }) => option.label.includes(input),
          notFoundContent: null,
        },
      },
      minWidth: 200,
    },
    // 工厂
    {
      title: t('dict.CommonCol.factoryName'),
      field: 'sapfactory',
      formatter: ({ row }) => row.sapfactoryName || row.sapfactory,
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      minWidth: 200,
    },
    // 物料编码
    {
      title: t('dict.bomtosap.materialCode'),
      field: 'insidePartNumber',
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
      minWidth: 200,
    },
    // 生产版本
    {
      title: t('dict.CommonCol.productionVersion'),
      field: 'produceVersion',
      // filters: [{ data: '' }],
      // filterRender: {
      //   name: 'Input',
      // },
      minWidth: 100,
    },
    // 生产版本描述
    {
      title: t('dict.bomtosap.productionVersionDesc'),
      field: 'produceVersionDesc',
      // filters: [{ data: '' }],
      // filterRender: {
      //   name: 'Input',
      // },
      minWidth: 200,
    },
    // 工艺路线组
    {
      title: t('dict.bomtosap.processRouteGroup'),
      field: 'seq',
      // filters: [{ data: '' }],
      // filterRender: {
      //   name: 'Input',
      // },
      minWidth: 200,
    },
    // 可选工艺路线
    {
      title: t('dict.bomtosap.optionalProcessRoute'),
      field: 'processVersion',
      // filters: [{ data: '' }],
      // filterRender: {
      //   name: 'Input',
      // },
      minWidth: 200,
    },
    // 可选BOM
    {
      title: t('dict.bomtosap.optionalBOM'),
      field: 'bomVersion',
      // filters: [{ data: '' }],
      // filterRender: {
      // name: 'Input',
      // },
      minWidth: 100,
    },
    // 文件编号版本
    {
      title: t('dict.bomtosap.docNumberVersion'),
      field: 'docNumberVersion',
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      width: 120,
    },
    // 备料信息
    {
      title: t('dict.PCCColumn.prepareMaterialInfo'),
      field: 'prepareMaterialInfo',
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      width: 200,
    },
    // 出货材料
    {
      title: t('dict.PCCColumn.shippingMaterial'),
      field: 'shippingMaterial',
      formatter: ({ cellValue, row }) => row.shippingMaterialName || cellValue || '',
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          api: () => {
            return baseStore.getDictionaryData('PCC.ShippingMaterial', true);
          },
          labelField: 'fullName',
          valueField: 'enCode',
          style: {
            width: '120px',
          },
        },
      },
      width: 100,
    },
    // 用量倍数
    {
      title: t('dict.PCCColumn.useQtyMultiple'),
      field: 'useQtyMultiple',
      width: 100,
    },
    // 零损耗(KPCS)
    {
      title: t('dict.bomtosap.zeroDefect'),
      field: 'zeroDefect',
      width: 100,
    },
    // 标准损耗(KPCS)
    {
      title: t('dict.bomtosap.stdDefect'),
      field: 'stdDefect',
      width: 120,
    },
  ];
}
