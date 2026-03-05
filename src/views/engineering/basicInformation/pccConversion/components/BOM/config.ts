import type { VxeGridPropTypes } from '/@/components/VxeTable';

import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
// import { getUnitListByKeyword } from '/@/api/finance/materialPrice';
import { getProductType } from '/@/api/engineering/pcc';
import { isExportOptions, formatVersion, isSyncOptions, renderIsSyncTableCell } from '../../config';
import { getImUserSelector } from '/@/api/permission/user';
import { getFactoryList } from '/@/api/engineering/sample';
import { ENABLE_OPTIONS } from '/@/views/engineering/PCCBeta/PCCReview/config';
import Decimal from 'decimal.js';

const { t } = useI18n();
const baseStore = useBaseStore();

/**
 * BOM 用途枚举
 */
export enum BOM_PURPOSE_ENUM {
  '生产' = '1',
  '工程/设计' = '2',
  '通用' = '3',
  '核算成本' = '6',
}

/** BOM用途选项，Todo: 替换成字典 */
export const BOMPurposeOptions = [
  { fullName: '生产', id: BOM_PURPOSE_ENUM.生产 },
  { fullName: '工程/设计', id: BOM_PURPOSE_ENUM['工程/设计'] },
  { fullName: '通用', id: BOM_PURPOSE_ENUM.通用 },
  { fullName: '核算成本', id: BOM_PURPOSE_ENUM.核算成本 },
];

/**
 * 清单页 - 筛选表单配置
 * @returns
 */
export function getFormConfig() {
  return [
    // {
    //   fieldName: 'factoryName',
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
    //     placeholder: '父件料件号',
    //     allowClear: true,
    //   },
    //   width: 100,
    // },
    // {
    //   fieldName: 'subPartNumber',
    //   label: '',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '子件料件号',
    //     allowClear: true,
    //   },
    // },
    // {
    //   fieldName: 'engineer',
    //   label: '',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '责任工程师',
    //     allowClear: true,
    //   },
    // },
    // {
    //   fieldName: 'bomType',
    //   label: '',
    //   component: 'ApiSelect',
    //   componentProps: {
    //     placeholder: 'BOM类型',
    //     api: () => baseStore.getDictionaryData('PCC.BomType', true),
    //     labelField: 'fullName',
    //     valueField: 'enCode',
    //     immediate: true,
    //     allowClear: true,
    //   },
    // },
    // {
    //   fieldName: 'terminalCustomerCode',
    //   label: '',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '终端客户',
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
      width: 100,
    },
    // 导出时间
    {
      title: t('common.exportTime'),
      field: 'exportTime',
      width: 150,
      cellRender: {
        name: 'Date',
        // @ts-ignore
        format: 'YYYY-MM-DD',
      },
      aqpFilter: {
        enabled: true,
        name: 'DatePicker',
        props: {
          format: 'YYYY-MM-DD HH:mm:ss',
        },
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
      aqpFilter: {
        enabled: false,
      },
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
      width: 100,
    },
    // sap同步时间
    {
      title: t('dict.bomtosap.syncSapTime'),
      field: 'syncSapTime',
      filters: [{ data: '' }],
      filterRender: { name: 'DatePicker' },
      width: 130,
      cellRender: {
        name: 'Date',
        // @ts-ignore
        format: 'YYYY-MM-DD',
      },
      aqpFilter: {
        enabled: true,
        name: 'DatePicker',
        props: {
          format: 'YYYY-MM-DD HH:mm:ss',
        },
      },
    },
    // sap同步错误信息
    {
      title: t('dict.bomtosap.syncSapError'),
      field: 'syncSapError',
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      width: 200,
      aqpFilter: {
        enabled: false,
      },
    },
    // 生产工厂
    {
      title: t('dict.PCCColumn.factory'),
      field: 'produceFactory',
      formatter: ({ cellValue, row }) => row.produceFactoryName || cellValue || '',
      aqpFilter: {
        enabled: false,
      },
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
          style: {
            width: '180px',
          },
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
      width: 200,
    },
    // 业务类型
    {
      title: t('dict.CommonCol.businessType'),
      field: 'businessType',
      i18nField: 'CommonCol.businessType',
      formatter: ({ cellValue, row }) => row.businessTypeName || cellValue || '',
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          api: () => baseStore.getDictionaryData('SapFactoryMaterial'),
          labelField: 'fullName',
          valueField: 'enCode',
        },
      },
      width: 100,
    },
    // 是否保税
    {
      title: t('dict.CommonCol.isBonded'),
      field: 'isBonded',
      formatter: ({ cellValue, row }) => row.isBondedName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ASelect',
        props: {
          options: [
            {
              fullName: t('common.yes'),
              enCode: 'true',
            },
            {
              fullName: t('common.no'),
              enCode: 'false',
            },
          ],
          fieldNames: {
            label: 'fullName',
            value: 'enCode',
          },
        },
      },
      aqpFilter: {
        name: 'ASelect',
        searchField: 'isBonded',
        cSharpType: 'int',
        props: {
          options: [
            {
              fullName: t('common.yes'),
              enCode: 'true',
            },
            {
              fullName: t('common.no'),
              enCode: 'false',
            },
          ],
          fieldNames: {
            label: 'fullName',
            value: 'enCode',
          },
        },
      },
      width: 100,
    },
    // 产品描述
    {
      title: t('dict.CommonCol.productDesc'),
      field: 'materialDesc',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      width: 200,
    },
    // 系统编号
    {
      title: t('dict.PCCColumn.applyCode'),
      field: 'sysNo',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      width: 200,
    },
    // 生效日期
    {
      title: t('dict.PCCColumn.effectiveDate'),
      field: 'effectiveDate',
      filters: [{ data: '' }],
      filterRender: { name: 'DatePicker' },
      width: 130,
      aqpFilter: {
        enabled: true,
        name: 'DatePicker',
        props: {
          format: 'YYYY-MM-DD HH:mm:ss',
        },
      },
      cellRender: {
        name: 'Date',
        props: {
          format: 'YYYY-MM-DD',
        },
      },
    },
    // 工厂
    {
      title: t('dict.CommonCol.factoryName'),
      field: 'sapfactory',
      formatter: ({ row }) => row.sapfactoryName || row.sapfactory,
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      width: 200,
    },
    // BOM版本
    {
      title: t('dict.bomtosap.BOMVersion'),
      field: 'bomVersion',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      aqpFilter: {
        cSharpType: 'int',
      },
      width: 100,
      formatter: ({ cellValue }) => {
        const value = +cellValue;
        return formatVersion({ cellValue: typeof value === 'number' && !Number.isNaN(value) ? value - 1 : '' });
      },
    },
    // 父件料件号
    {
      title: t('dict.bomtosap.parentPartNumber'),
      field: 'insidePartNumber',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      width: 200,
    },
    {
      title: '是否启用',
      field: 'enable',
      width: 100,
      cellRender: {
        name: 'Tag',
        options: ENABLE_OPTIONS,
      },
      aqpFilter: {
        name: 'Tag',
        cSharpType: 'bool',
        options: ENABLE_OPTIONS,
      },
    },
    // 父件物料描述
    {
      title: t('dict.bomtosap.parentMaterialDesc'),
      field: 'parentMaterialDesc',
      // `父物件描述`直接显示为空
      formatter: () => '',
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      width: 200,
    },
    // BOM用途
    {
      title: t('dict.bomtosap.BOMUsage'),
      field: 'bomUsage',
      // sortable: true,
      filters: [{ data: '' }],
      formatter: ({ cellValue, row }) => row.bomUsageName || cellValue || '',
      filterRender: {
        name: 'ASelect',
        props: {
          options: BOMPurposeOptions,
        },
      },
      width: 100,
    },
    // 可选BOM
    {
      title: t('dict.bomtosap.optionalBOM'),
      field: 'optionalBOM',
      // `可选BOM`的实际展示字段为`bomVersion`，与`BOM版本`字段相同，为了避免在表格中重复，故而写为`optionalBOM`
      formatter: ({ row }) => row.bomVersion || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      width: 100,
      aqpFilter: {
        enabled: false,
      },
    },
    // 基本数量(父件)
    {
      title: t('dict.bomtosap.parentQuantity'),
      field: 'baseQuatity',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
      aqpFilter: {
        cSharpType: 'int',
      },
    },
    // 行项目号
    {
      title: t('dict.bomtosap.projectNumber'),
      field: 'rowPrjNo',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 100,
    },
    // 子件料件号
    {
      title: t('dict.bomtosap.subPartNumber'),
      field: 'subPartNumber',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
    },
    // 子件物料描述
    {
      title: t('dict.bomtosap.subPartDesc'),
      field: 'subPartDesc',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
      aqpFilter: {
        enabled: false,
      },
    },
    // 数量(子件)
    {
      title: t('dict.bomtosap.useQty'),
      field: 'useQty',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 100,
    },
    // 单位
    {
      title: t('dict.CommonCol.materialUnit'),
      field: 'unit',
      formatter: ({ cellValue, row }) => row.unitName || cellValue || '',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: {
      //   name: 'ApiSelect',
      //   props: {
      //     api: getUnitListByKeyword,
      //     showSearch: true,
      //     apiSearch: {
      //       show: true,
      //       searchName: 'keyword',
      //     },
      //     resultField: 'data',
      //     filterOption: false,
      //     notFoundContent: null,
      //     immediate: false,
      //     labelField: 'Name',
      //     valueField: 'Code',
      //   },
      // },
      width: 100,
    },
    // 损耗率
    {
      title: t('dict.bomtosap.lossRate'),
      field: 'lossRate', // 后端暂时没有此字段，用临时字段代替 ---- 2025-08-08
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 100,
    },
    // 替代项目组
    {
      title: t('dict.bomtosap.alternativeProjectTeam'),
      field: 'alternativeProjectTeam', // 后端暂时没有此字段，用临时字段代替 ---- 2025-08-08
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      width: 200,
    },
    // 策略
    {
      title: t('dict.bomtosap.strategy'),
      field: 'strategy', // 后端暂时没有此字段，用临时字段代替 ---- 2025-08-08
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 100,
    },
    // 优先级
    {
      title: t('dict.bomtosap.priority'),
      field: 'priority', // 后端暂时没有此字段，用临时字段代替 ---- 2025-08-08
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 100,
    },
    // 使用可能性
    {
      title: t('dict.bomtosap.usagePossibility'),
      field: 'usagePossibility', // 后端暂时没有此字段，用临时字段代替 ---- 2025-08-08
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 100,
    },
    // 项目文本1
    {
      title: t('dict.bomtosap.projectText1'),
      field: 'remark',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 100,
    },
    // 项目文本2
    {
      title: t('dict.bomtosap.projectText2'),
      field: 'projectText2', // 后端暂时没有此字段，用临时字段代替 ---- 2025-08-08
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 100,
    },
    // 主材料
    {
      title: t('dict.bomtosap.mainMaterials'),
      field: 'mainMaterials',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 100,
      formatter: ({ row }) => (+row.shippingMaterial === 1 ? t('common.yes') : t('common.no')),
    },
    // 非标损耗率(%)
    {
      title: t('dict.bomtosap.defectRateTotal'),
      field: 'defectRateTotal',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
      formatter: ({ cellValue }) => (Number.isNaN(+cellValue) ? '' : Decimal.mul(+cellValue, 100) + ''),
    },
    // 递归允许
    {
      title: t('dict.bomtosap.recursiveAllows'),
      field: 'recursiveAllows', // 后端暂时没有此字段，用临时字段代替 ---- 2025-08-08
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 100,
    },
    // 净废品标识
    {
      title: t('dict.bomtosap.netWasteIdentification'),
      field: 'netWasteIdentification', // 后端暂时没有此字段，用临时字段代替 ---- 2025-08-08
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 100,
    },
    // 责任工程师
    {
      title: t('dict.bomtosap.engineerName'),
      field: 'engineer',
      formatter: ({ cellValue, row }) => row.engineerName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          api: (params: any) => {
            return params.keyword ? getImUserSelector(0, params) : Promise.resolve({ data: { list: [] } });
          },
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data.list',
          labelField: 'fullName',
          valueField: 'id',
          showSearch: true,
          immediate: false,
          alwaysLoad: true,
          filterOption: false,
          notFoundContent: null,
        },
      },
      width: 200,
    },
    // 产品类别
    {
      title: t('dict.FcDataColumn.productCategory'),
      field: 'productType',
      formatter: ({ cellValue, row }) => row.productTypeName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ApiSelect',
        props: {
          api: getProductType,
          apiSearch: {
            show: true,
            searchName: 'ProductCategory',
          },
          resultField: 'data',
          labelField: 'productCategory',
          valueField: 'id',
          showSearch: true,
          immediate: true,
          alwaysLoad: true,
          filterOption: false,
          notFoundContent: null,
        },
      },
      width: 100,
    },
    // 终端客户
    {
      title: t('dict.PriceInquiryColumn.terminalCustomerName'),
      field: 'terminalCustomerCode',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: { name: 'Input' },
      width: 100,
    },
    // BOM类型
    {
      title: t('dict.CommonCol.bomType'),
      field: 'bomType',
      formatter: ({ cellValue, row }) => row.bomTypeName || cellValue || '',
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ASelect',
        props: {
          options: [
            { fullName: 'NPI量试BOM', id: 1 },
            { fullName: '工程试验非备料BOM', id: 2 },
            { fullName: '量产备料BOM', id: 3 },
          ],
        },
      },
      width: 150,
    },
    // 工艺路线类型
    {
      title: t('dict.ProcessRouteColumn.processRouteType'),
      field: 'processTypeName',
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: {
      //   name: 'ApiSelect',
      //   props: {
      //     api: () => {
      //       return baseStore.getDictionaryData('PCC.ProcessType', true);
      //     },
      //     labelField: 'fullName',
      //     valueField: 'enCode',
      //   },
      // },
      width: 200,
    },
    // 特殊获取
    {
      title: t('dict.bomtosap.specialAcquisition'),
      field: 'specialAcquisition', // 后端暂时没有此字段，用临时字段代替 ---- 2025-08-08
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 100,
    },
    // 生产仓储地点
    {
      title: t('dict.bomtosap.storageLocation'),
      field: 'storageLocation', // 后端暂时没有此字段，用临时字段代替 ---- 2025-08-08
      // sortable: true,
      // filters: [{ data: '' }],
      // filterRender: { name: 'Input' },
      width: 200,
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
