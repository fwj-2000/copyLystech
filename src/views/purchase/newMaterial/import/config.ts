import { h } from 'vue';
import { getStatus, IS_OPTION_LIST } from '/@/components/CustomComponents/src/material/Constant';
import { BasicColumn, FormProps } from '/@/components/Table';
import { getFactory, getInnerPartNumber } from '/@/api/engineering/newMateria';
import { FormSchema } from '/@/components/Form';
import { useBaseStore } from '/@/store/modules/base';
import { getSupplierList } from '/@/api/equipment/information';
import { getMaterialList } from '/@/api/purchase/materialBase';
import { useI18n } from '/@/hooks/web/useI18n';
import type { ColumnWithI18n } from '/@/effects/plugins/vxe-table/types';
import { getUnitListByKeyword } from '/@/api/finance/materialPrice';
const { t } = useI18n();

interface FormConfig {
  labelWidth: number;
  layout: 'vertical' | 'inline' | 'horizontal';
  baseColProps: {
    span: number;
  };
  rowProps: any;
  schemas: FormSchema[];
}

export function baseFrorm(): FormConfig {
  return {
    labelWidth: 220,
    layout: 'vertical',
    baseColProps: {
      span: 4,
    },
    rowProps: {
      align: 'top',
      justify: 'start',
      gutter: 5,
    },
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
      transferRange: ['placeholder', 'label'],
    },
    schemas: [
      {
        field: 'insidePartNumber',
        label: '产品内部料号',
        component: 'Input',
        componentProps: {
          disabled: true,
        },
      },
      {
        field: 'insideNumberOld',
        label: '旧版成品编码',
        component: 'Input',
        componentProps: {
          disabled: true,
        },
      },
      {
        field: 'terminalProject',
        label: '终端项目代码',
        component: 'Input',
        componentProps: {
          disabled: true,
        },
      },
      {
        field: 'factoryId',
        i18nField: 'CommonCol.factory',
        label: '工厂',
        component: 'ApiSelect',
        componentProps: {
          disabled: true,
          api: getFactory,
          apiSearch: {
            show: true,
            searchName: 'code',
          },
          placeholder: '请选择',
          showSearch: true,
          resultField: 'data',
          searchKey: 'factoryCode',
          valueField: 'Id',
          nameFormat: ['Code', '/', 'Name'],
        },
      },
      {
        field: 'applySpec',
        label: '申请规格',
        component: 'Input',
        componentProps: {
          disabled: true,
        },
      },
      {
        field: 'deliveryDate',
        label: '要求交期',
        component: 'DatePicker',
        componentProps: {
          disabled: true,
          format: 'YYYY-MM-DD',
        },
      },
      {
        field: 'terminalCustomerName',
        label: '终端客户信息',
        component: 'Input',
        componentProps: {
          disabled: true,
          placeholder: '系统生成',
          i18nField: 'CommonCol.fromSys',
        },
      },
      {
        field: 'productLineCode',
        label: '产品线',
        component: 'Input',
        componentProps: {
          disabled: true,
          placeholder: '系统生成',
          i18nField: 'CommonCol.fromSys',
        },
      },
      {
        field: 'productTypeName',
        label: '产品类型',
        component: 'Input',
        componentProps: {
          disabled: true,
        },
      },
      {
        field: 'projectStage',
        label: '项目现阶段',
        component: 'ApiSelect',
        componentProps: {
          disabled: true,
          api: async () => {
            return await baseStore.getDictionaryData('ProjectStage');
          },
          apiSearch: {
            show: false,
          },
          resultField: '',
          labelField: 'fullName',
          valueField: 'enCode',
          showSearch: false,
          immediate: true,
          filterOption: false,
          notFoundContent: null,
        },
      },
      {
        field: 'isNUD',
        i18nField: 'isNUDDesc',
        label: '是否NUD',
        component: 'Select',
        componentProps: {
          disabled: true,
          placeholder: '请选择',
          options: IS_OPTION_LIST,
        },
      },
      {
        field: 'estimateTotal',
        label: '预估项目总量(W)',
        component: 'InputNumber',
        componentProps: {
          disabled: true,
          min: 1,
        },
      },
      {
        field: 'estimateProductionTime',
        i18nField: 'estimateProductionDateTime',
        label: '预计量产月份',
        component: 'DatePicker',
        componentProps: {
          disabled: true,
          placeholder: '请选择预计量产月份',
          picker: 'month',
          format: 'YYYY-MM',
        },
      },
      {
        field: 'productSizeWide',
        label: '产品宽度(MM)',
        component: 'InputNumber',
        componentProps: { placeholder: '请选择', disabled: true, min: 0 },
      },
      {
        field: 'productSizeLong',
        label: '产品长度(MM)',
        component: 'InputNumber',
        componentProps: { placeholder: '请选择', disabled: true, min: 0 },
      },
      {
        field: 'consumption',
        label: '用量(M2/KPCS)',
        component: 'InputNumber',
        componentProps: { placeholder: '系统计算', i18nField: 'CommonCol.sysCal', disabled: true },
      },
      {
        field: 'productArea',
        label: '预估总面积(M2)',
        component: 'InputNumber',
        componentProps: { placeholder: '系统计算', i18nField: 'CommonCol.sysCal', disabled: true },
      },
      {
        field: 'pdManagerId',
        i18nField: 'pdManagerName',
        label: 'PD经理',
        component: 'CustomUserSelect',
        componentProps: { placeholder: '请选择', showSearch: true, disabled: true },
      },
      {
        field: 'technologyId',
        i18nField: 'technologyName',
        label: '技术中心',
        component: 'CustomUserSelect',
        componentProps: { placeholder: '请选择', showSearch: true, disabled: true },
      },
      {
        field: 'purchaseUserId',
        i18nField: 'purchaseUserName',
        label: '开发采购',
        component: 'CustomUserSelect',
        componentProps: { placeholder: '请选择', showSearch: true, disabled: true },
      },
      {
        field: 'isCustomerRefers',
        i18nField: 'isCustomerRefersDesc',
        label: '是否客指',
        component: 'Select',
        componentProps: {
          disabled: true,
          placeholder: '请选择',
          options: IS_OPTION_LIST,
        },
      },
      {
        field: 'remarks',
        label: '备注',
        component: 'Input',
        componentProps: {
          disabled: true,
        },
        colProps: {
          span: 12,
        },
      },
      {
        field: 'documentControlId',
        label: t('dict.CommonCol.nextHandler', [t('dict.MaterialDevelopApplyColumn.documentControlId')]),
        component: 'CustomUserSelect',
        componentProps: {},
        required: true,
      },
    ],
  };
}
// export function baseFrorm(): FormConfig {
//   return {
//     labelWidth: 220,
//     layout: 'vertical',
//     baseColProps: {
//       span: 4,
//     },
//     rowProps: {
//       align: 'top',
//       justify: 'start',
//       gutter: 5,
//     },
//     i18nConfig: {
//       moduleCode: 'MaterialDevelopApplyColumn',
//       transferRange: ['placeholder', 'label'],
//     },
//     schemas: [
//       {
//         field: 'applyNumber',
//         label: '需求单号',
//         component: 'Input',
//         componentProps: {
//           disabled: true,
//           placeholder: '系统生成',
//           i18nField: 'CommonCol.fromSys',
//         },
//       },
//       {
//         field: 'applyUserName',
//         label: '申请人',
//         component: 'Input',
//         componentProps: {
//           disabled: true,
//           placeholder: '系统生成',
//           i18nField: 'CommonCol.fromSys',
//         },
//       },
//       {
//         field: 'applyDatetime',
//         i18nField: 'CommonCol.applyTime',
//         label: '申请日期',
//         component: 'DatePicker',
//         defaultValue: new Date().getTime(),
//         componentProps: {
//           disabled: true,
//           placeholder: '系统生成',
//           i18nField: 'CommonCol.fromSys',
//         },
//       },
//       {
//         field: 'factoryId',
//         i18nField: 'CommonCol.factory',
//         label: '工厂',
//         component: 'ApiSelect',
//         componentProps: {
//           disabled: true,
//           api: getFactory,
//           apiSearch: {
//             show: true,
//             searchName: 'code',
//           },
//           placeholder: '请选择',
//           showSearch: true,
//           resultField: 'data',
//           searchKey: 'factoryCode',
//           valueField: 'Id',
//           nameFormat: ['Code', '/', 'Name'],
//         },
//       },
//       {
//         field: 'purchaseUserId',
//         i18nField: 'purchaseUserName',
//         label: '开发采购',
//         component: 'CustomUserSelect',
//         componentProps: { placeholder: '请选择', showSearch: true, disabled: true },
//       },
//       {
//         field: 'pdManagerId',
//         i18nField: 'pdManagerName',
//         label: 'PD经理',
//         component: 'CustomUserSelect',
//         componentProps: { placeholder: '请选择', showSearch: true, disabled: true },
//       },
//     ],
//   };
// }

const baseStore = useBaseStore();
// export function projectFrorm(changeCallback?: CallableFunction): FormConfig {
//   return {
//     labelWidth: 220,
//     layout: 'vertical',
//     baseColProps: {
//       span: 4,
//     },
//     rowProps: {
//       align: 'top',
//       justify: 'start',
//       gutter: 5,
//     },
//     i18nConfig: {
//       moduleCode: 'MaterialDevelopApplyColumn',
//       transferRange: ['placeholder', 'label'],
//       excludeFields: ['documentControlId'],
//     },
//     schemas: [
//       {
//         field: 'insidePartNumber',
//         label: '产品内部料号',
//         component: 'Input',
//         componentProps: {
//           disabled: true,
//         },
//       },
//       {
//         field: 'terminalCustomerName',
//         label: '终端客户信息',
//         component: 'Input',
//         componentProps: {
//           disabled: true,
//           placeholder: '系统生成',
//           i18nField: 'CommonCol.fromSys',
//         },
//       },
//       {
//         field: 'productLineCode',
//         label: '产品线',
//         component: 'Input',
//         componentProps: {
//           disabled: true,
//           placeholder: '系统生成',
//           i18nField: 'CommonCol.fromSys',
//         },
//       },
//       {
//         field: 'productTypeName',
//         label: '产品类型',
//         component: 'Input',
//         componentProps: {
//           disabled: true,
//         },
//       },
//       {
//         field: 'projectStage',
//         label: '项目现阶段',
//         component: 'ApiSelect',
//         componentProps: {
//           disabled: true,
//           api: async () => {
//             return await baseStore.getDictionaryData('ProjectStage');
//           },
//           apiSearch: {
//             show: false,
//           },
//           resultField: '',
//           labelField: 'fullName',
//           valueField: 'enCode',
//           showSearch: false,
//           immediate: true,
//           filterOption: false,
//           notFoundContent: null,
//         },
//       },
//       {
//         field: 'isNUD',
//         i18nField: 'isNUDDesc',
//         label: '是否NUD',
//         component: 'Select',
//         componentProps: {
//           disabled: true,
//           placeholder: '请选择',
//           options: IS_OPTION_LIST,
//         },
//       },
//       {
//         field: 'estimateTotal',
//         label: '预估项目总量(W)',
//         component: 'InputNumber',
//         componentProps: {
//           disabled: true,
//           min: 1,
//         },
//       },
//       {
//         field: 'estimateProductionTime',
//         i18nField: 'estimateProductionDateTime',
//         label: '预计量产月份',
//         component: 'DatePicker',
//         componentProps: {
//           disabled: true,
//           placeholder: '请选择预计量产月份',
//           picker: 'month',
//           format: 'YYYY-MM',
//         },
//       },
//       {
//         field: 'productSizeWide',
//         label: '产品宽度(MM)',
//         component: 'InputNumber',
//         componentProps: { placeholder: '请选择', disabled: true, min: 0 },
//       },
//       {
//         field: 'productSizeLong',
//         label: '产品长度(MM)',
//         component: 'InputNumber',
//         componentProps: { placeholder: '请选择', disabled: true, min: 0 },
//       },
//       {
//         field: 'consumption',
//         label: '用量(M2/KPCS)',
//         component: 'InputNumber',
//         componentProps: { placeholder: '系统计算', i18nField: 'CommonCol.sysCal', disabled: true },
//       },
//       {
//         field: 'productArea',
//         label: '预估总面积(M2)',
//         component: 'InputNumber',
//         componentProps: { placeholder: '系统计算', i18nField: 'CommonCol.sysCal', disabled: true },
//       },
//       {
//         field: 'isCustomerRefers',
//         i18nField: 'isCustomerRefersDesc',
//         label: '是否客指',
//         component: 'Select',
//         componentProps: {
//           disabled: true,
//           placeholder: '请选择',
//           options: IS_OPTION_LIST,
//         },
//       },
//       // 文控
//       {
//         field: 'documentControlId',
//         label: t('dict.CommonCol.nextHandler', [t('dict.MaterialDevelopApplyColumn.documentControlId')]),
//         component: 'CustomUserSelect',
//         componentProps: {},
//         required: true,
//       },
//     ],
//   };
// }
export function materialFrorm(handleValidate, handleValueChange): FormConfig {
  return {
    labelWidth: 220,
    layout: 'vertical',
    baseColProps: {
      span: 4,
    },
    rowProps: {
      align: 'middle',
      justify: 'start',
      gutter: 5,
    },
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
      transferRange: ['placeholder', 'label'],
    },
    schemas: [
      {
        field: 'materialAreaId',
        i18nField: 'materialAreaName',
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
        field: 'materialForm',
        label: '材料形态',
        component: 'ApiSelect',
        componentProps: {
          api: async () => {
            return await baseStore.getDictionaryData('MaterialForm');
          },
          apiSearch: {
            show: false,
          },
          resultField: '',
          labelField: 'fullName',
          valueField: 'enCode',
          showSearch: false,
          immediate: true,
          filterOption: false,
          notFoundContent: null,
        },
        required: true,
      },
      {
        field: 'originalModelNumber',
        label: '原厂商型号',
        component: 'Input',
        componentProps: {},
        required: true,
      },
      {
        field: 'supplierId',
        i18nField: 'supplierName',
        label: '供应商名称',
        component: 'ApiSelect',
        componentProps: {
          api: getSupplierList,
          apiSearch: {
            show: true,
            searchName: 'name',
          },
          labelField: 'shortName',
          valueField: 'id',
          resultField: 'data',
          nameFormat: ['shortName', '/', 'code'],
          showSearch: true,
          immediate: false,
          filterOption: false,
        },
        required: true,
      },
      {
        field: 'originalManufacturerName',
        // i18nField: 'originalManufacturerName',
        label: '原厂商简称',
        component: 'Input',
        componentProps: {
          // api: getSupplierList,
          // apiSearch: {
          //   show: true,
          //   keyword: 'supplierName',
          // },
          // labelField: 'name',
          // valueField: 'id',
          // showSearch: true,
          // resultField: 'data',
          // nameFormat: ['name', '/', 'code'],
        },
        required: true,
      },
      {
        field: 'materialClassId',
        i18nField: 'materialClassName',
        label: '材料类型',
        component: 'Select',
        componentProps: {
          fieldNames: {
            value: 'id',
            label: 'fullName',
          },
          options: [],
        },
        required: true,
      },
      {
        field: 'threeLevelName',
        label: '三级分类',
        component: 'Input',
        componentProps: {},
      },
      {
        field: 'materialQualityId',
        i18nField: 'materialQualityName',
        label: '基材类型',
        component: 'Select',
      },
      {
        field: 'materialWidth',
        label: '材料宽度(MM)',
        component: 'InputNumber',
        componentProps: { min: 0 },
      },
      {
        field: 'materialLength',
        label: '材料长度(M)',
        component: 'InputNumber',
        componentProps: { min: 0 },
      },
      {
        field: 'substrateThickness',
        i18nField: 'materialThickness',
        label: '基材厚度(MM)',
        component: 'InputNumber',
        componentProps: { min: 0 },
        rules: [
          {
            trigger: 'blur',
            message: t('common.totalThickTip'),
            validator: (ops, value, r) => {
              handleValidate(ops, value, r);
            },
          },
        ],
      },
      {
        field: 'materialThicknessTotal',
        label: '总厚度(MM)',
        required: true,
        component: 'InputNumber',
        componentProps: {
          min: 0,
          onChange: (val: number) => {
            handleValueChange('materialThicknessTotal', val);
          },
        },
        rules: [
          {
            trigger: 'change',
            message: t('common.totalThickTip'),
            validator: (ops, value, r) => {
              return handleValidate(ops, value, r);
            },
          },
        ],
      },
      {
        field: 'tds',
        label: '涂层厚度(MM)',
        component: 'InputNumber',
        componentProps: { min: 0 },
      },
      {
        field: 'tolerance',
        label: '厚度公差(MM)',
        component: 'Input',
        componentProps: { min: 0 },
      },
      {
        field: 'materialSpec',
        label: '材料规格',
        component: 'Input',
      },
      {
        field: 'coatingType',
        label: '涂层类型',
        component: 'ApiSelect',
        componentProps: {
          api: async () => {
            return await baseStore.getDictionaryData('CoatingTypeEnum');
          },
          apiSearch: {
            show: false,
          },
          resultField: '',
          labelField: 'fullName',
          valueField: 'enCode',
          showSearch: false,
          immediate: true,
          filterOption: false,
          notFoundContent: null,
        },
        required: true,
      },
      {
        field: 'materialColor',
        i18nField: 'colour',
        label: '颜色',
        component: 'Input',
        // required: true,
        componentProps: {},
      },
      {
        field: 'grammage',
        i18nField: 'gram',
        label: '克重(G)',
        component: 'Input',
        // required: true,
      },
      {
        field: 'releaseForceLevel',
        i18nField: 'releaseForceLevel',
        label: '粘性/离型力等级',
        component: 'Input',
        // required: true,
      },
      {
        field: 'antistaticRequirements',
        i18nField: 'resistStaticElectricityType',
        label: '抗静电功能',
        component: 'ApiSelect',
        componentProps: {
          api: async () => {
            return await baseStore.getDictionaryData('ResistStaticElectricityEnum');
          },
          apiSearch: {
            show: false,
          },
          resultField: '',
          labelField: 'fullName',
          valueField: 'enCode',
          showSearch: false,
          immediate: true,
          filterOption: false,
          notFoundContent: null,
        },
        required: true,
      },
      {
        field: 'layers',
        i18nField: 'singleDoubleLayer',
        label: '结构组成',
        component: 'ApiSelect',
        componentProps: {
          api: async () => {
            return await baseStore.getDictionaryData('SingleDoubleLayerEnum');
          },
          apiSearch: {
            show: false,
          },
          resultField: '',
          labelField: 'fullName',
          valueField: 'enCode',
          showSearch: false,
          immediate: true,
          filterOption: false,
          notFoundContent: null,
        },
        required: true,
      },
      {
        field: 'purchaseUnit',
        label: '采购单位',
        component: 'ApiSelect',
        componentProps: {
          api: getUnitListByKeyword,
          apiSearch: {
            show: false,
            searchName: 'keyword',
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          showSearch: false,
          immediate: true,
          filterOption: false,
          notFoundContent: null,
        },
        required: true,
      },
      {
        field: 'standard',
        label: '标准/非标准',
        component: 'ApiSelect',
        componentProps: {
          api: async () => {
            return await baseStore.getDictionaryData('standardEnum');
          },
          apiSearch: {
            show: false,
          },
          resultField: '',
          labelField: 'fullName',
          valueField: 'enCode',
          showSearch: false,
          immediate: true,
          filterOption: false,
          notFoundContent: null,
        },
        required: true,
      },
      {
        field: 'otherRequirements',
        label: '其他要求',
        component: 'Textarea',
        componentProps: {
          rows: 1,
          autoSize: true,
        },
      },
      {
        field: 'appendage',
        label: '附膜',
        component: 'Input',
        componentProps: {},
      },
      {
        field: 'dataInvalidTime',
        label: '环保资料失效日期',
        component: 'DatePicker',
        componentProps: { format: 'YYYY-MM-DD' },
      },
      {
        field: 'materialEffective',
        label: '材料有效期(月）',
        component: 'Input',
        componentProps: {},
      },
      {
        field: 'materialDesc',
        label: '材料描述',
        component: 'Textarea',
        componentProps: {
          // disabled: true,
          rows: 1,
          autoSize: true,
        },
        colProps: {
          span: 12,
        },
      },
    ],
  };
}

export function getFormConfig(): Partial<FormProps> {
  return {
    baseColProps: {
      span: 4,
    },
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
      transferRange: ['placeholder', 'label'],
    },
    schemas: [
      {
        label: '',
        field: 'originCode',
        component: 'Input',
        componentProps: {
          placeholder: '来源单号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'insidePartNumber',
        component: 'Input',
        componentProps: {
          placeholder: '产品内部料号',
          submitOnPressEnter: true,
        },
      },
      {
        label: '',
        field: 'terminalCustomerPartNumber',
        component: 'Input',
        componentProps: {
          placeholder: '终端客户料号',
          submitOnPressEnter: true,
        },
      },
      // {
      //   label: '',
      //   field: 'applyCode',
      //   component: 'Input',
      //   componentProps: {
      //     placeholder: '来源单号',
      //     submitOnPressEnter: true,
      //   },
      // },
      // {
      //   label: '',
      //   field: 'factory',
      //   component: 'Input',
      //   componentProps: {
      //     placeholder: '工厂',
      //     submitOnPressEnter: true,
      //   },
      // },
      {
        label: '',
        field: 'insideProjectCode',
        component: 'Input',
        componentProps: {
          placeholder: '内部项目代码',
          submitOnPressEnter: true,
        },
      },
    ],
  };
}

export const columns = (handleNodeModal): BasicColumn[] => {
  return [
    { title: '需求单号', dataIndex: 'applyNumber', width: 130 },
    { title: '产品内部料号', dataIndex: 'insidePartNumber', width: 220 },
    { title: '旧版成品编码', dataIndex: 'insideNumberOld', width: 150 },
    { title: '材料流水编码', dataIndex: 'materialNumber', width: 150 },
    { title: '状态', dataIndex: 'status', width: 100, format: 'tag|' + JSON.stringify(getStatus('statusDesc')) },
    { title: '当前处理人', dataIndex: 'currentProcessor', width: 230 },
    { title: '当前节点', dataIndex: 'currentNodeName', width: 120 },
    {
      title: '节点记录',
      dataIndex: 'nodeDetail',
      width: 100,
      customRender: ({ record }) => {
        if (record.status == 0) return '/';
        return h('span', { class: 'table-a', onClick: handleNodeModal.bind(null, record) }, t('common.viewDetails'));
      },
    },
    // { title: '材料描述', dataIndex: 'materialDesc' },
    // { title: '供应商名称', dataIndex: 'supplierName' },
    { title: '供应商', dataIndex: 'supplierName', width: 220 },
    { title: '供应商材料编码', dataIndex: 'manufacturerMaterialsCode', width: 150 },
    { title: '工厂', dataIndex: 'factoryName', width: 130 },
    // { title: 'PD', dataIndex: 'applyUserName' },
    { title: '开发采购', dataIndex: 'purchaseUserName', width: 230 },
    { title: '是否客指', dataIndex: 'isCustomerRefersDesc', width: 80 },
    { title: '处理时间', dataIndex: 'lastModifyTime', format: 'date|YYYY-MM-DD ', width: 180, i18nField: 'CommonCol.handleTime' },
    { title: '申请人', dataIndex: 'applyUserName', key: 'applyUserName', width: 230, sorter: true },
    // { title: '申请部门', dataIndex: 'applyDeptName', key: 'applyDeptName', width: 150, sorter: true },
    {
      title: '申请时间',
      dataIndex: 'applyDate',
      width: 180,
      format: 'date|YYYY-MM-DD HH:mm',
    },
    // { title: '修改人', dataIndex: 'lastModifyUserName', key: 'lastModifyUserName', width: 110, sorter: true },
    // {
    //   title: '修改日期',
    //   dataIndex: 'lastModifyTime',
    //   key: 'lastModifyTime',
    //   width: 110,
    //   sorter: true,
    //   format: 'date|YYYY-MM-DD',
    // },
  ];
};

export const vxeColumns = (handleNodeModal): ColumnWithI18n[] => {
  return [
    { type: 'checkbox', width: 48 },
    { title: '需求单号', field: 'applyNumber', width: 120 },
    { title: '产品内部料号', field: 'insidePartNumber', width: 220 },
    { title: '旧版成品编码', field: 'insideNumberOld', width: 150 },
    { title: '材料流水编码', field: 'materialNumber', width: 200 },
    {
      title: '状态',
      field: 'status',
      width: 100,
      cellRender: {
        name: 'Tag',
        options: getStatus('statusDesc'),
      },
    },
    { title: '供应商', field: 'supplierName', width: 220 },
    { title: '当前处理人', field: 'currentProcessor', width: 230 },
    { title: '当前节点', field: 'currentNodeName', width: 160 },
    {
      title: '节点记录',
      field: 'nodeDetail',
      width: 100,
      slots: {
        default: 'nodeDetail',
      },
    },
    // { title: '供应商材料编码', field: 'manufacturerMaterialsCode', width: 220 },
    { title: '原厂商型号', field: 'originalModelNumber', width: 220 },
    { title: '工厂', field: 'factoryName', width: 140 },
    { title: '开发采购', field: 'purchaseUserName', width: 230 },
    { title: '是否客指', field: 'isCustomerRefersDesc', width: 80 },
    // {
    //   title: '处理时间',
    //   field: 'lastModifyTime',
    //   i18nField: 'CommonCol.handleTime',
    //   width: 160,
    //   cellRender: {
    //     name: 'Date',
    //     format: 'YYYY-MM-DD',
    //   },
    // },
    { title: '申请人', field: 'applyUserName', width: 230 },
    {
      title: '申请时间',
      field: 'applyDateTime',
      width: 160,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm',
      },
    },
    {
      title: '操作',
      field: 'action',
      width: 90,
      fixed: 'right',
      slots: {
        default: 'action',
      },
    },
  ];
};
