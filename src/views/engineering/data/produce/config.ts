import { BasicColumn, FormProps, FormSchema } from '/@/components/Table';
import { getMaterialSearchByShortCode } from '/@/api/engineering/pcc';
import { useBaseStore } from '/@/store/modules/base';
import { getMaterialCodeList } from '/@/api/finance/materialPrice';
import { IS_OPTION_LIST } from '/@/components/CustomComponents/src/quality/Constant';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

const baseStore = useBaseStore();

export function getBaseInfoFormSchema(): FormSchema[] {
  return [
    {
      field: 'applyNo',
      label: '单号',
      component: 'Input',
      componentProps: {
        placeholder: '内部料号',
        disabled: true,
      },
    },
    {
      field: 'innerMaterialNumber',
      label: '产品内部料号',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      field: 'insidePartNumberOld',
      label: '旧版成品编码',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      field: 'terminalCustomerProjectCode',
      label: '终端项目代码',
      component: 'Input',
      componentProps: { placeholder: '终端项目代码', disabled: true },
    },
    {
      field: 'immediateCustomerPartNumber',
      label: '直接客户料号',
      component: 'Input',
      componentProps: {
        placeholder: '直接客户料号',
        disabled: true,
      },
    },
    {
      field: 'terminalCustomerPartNumber',
      label: '终端客户料号',
      component: 'Input',
      componentProps: {
        placeholder: '终端客户料号',
        disabled: true,
      },
    },
    {
      field: 'peakQty',
      label: '需求数量(PCS)',
      component: 'Input',
      componentProps: {
        placeholder: '需求数量(PCS)',
        disabled: true,
      },
    },
    {
      field: 'projectPhase',
      label: '终端项目阶段',
      component: 'Input',
      componentProps: {
        placeholder: '终端项目阶段',
        disabled: true,
      },
    },
    {
      field: 'customerDeliveryTime',
      i18nField: 'customerDeliveryDateTime',
      label: '客户要求交期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '客户要求交期',
        disabled: true,
        format: 'YYYY-MM-DD',
      },
    },
    {
      field: 'productDesc',
      label: '产品描述',
      component: 'Textarea',
      componentProps: {
        placeholder: '产品描述',
        disabled: true,
        rows: 1,
        autoSize: true,
      },
      colProps: {
        span: 18,
      },
    },
    {
      field: 'isHaveStockDesc',
      label: '库存处理',
      component: 'Input',
      componentProps: {
        placeholder: '库存处理',
        disabled: true,
      },
    },
    // 生产工艺
    {
      field: 'process',
      label: t('dict.PCCColumn.process'),
      component: 'ApiSelect',
      required: true,
      componentProps: {
        placeholder: t('dict.PCCColumn.process'),
        api: () => {
          return baseStore.getDictionaryData('PCC.ProcessType', true);
        },
        labelField: 'fullName',
        valueField: 'enCode',
      },
    },
    {
      field: 'experimentType',
      label: '是否实验',
      required: true,
      component: 'Select',
      componentProps: {
        options: IS_OPTION_LIST,
        defaultValue: '0',
        fieldNames: {
          label: 'fullName',
          value: 'id',
        },
      },
    },
    {
      field: 'experimentDuration',
      label: '实验时长(H)',
      component: 'Input',
      componentProps: {
        placeholder: '实验时长(H)',
        disabled: true,
      },
    },
    {
      field: 'experimentQty',
      label: '实验数量(PCS)',
      component: 'Input',
      componentProps: {
        placeholder: '实验数量(PCS)',
        disabled: true,
      },
    },
    {
      field: 'mould',
      label: '是否需要开模',
      required: true,
      component: 'Select',
      componentProps: {
        placeholder: '是否需要开模',
        options: IS_OPTION_LIST,
        fieldNames: {
          label: 'fullName',
          value: 'id',
        },
      },
    },
    {
      field: 'estimatedMoldTime',
      i18nField: 'estimatedMoldDateTime',
      label: '预估模具交期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '预估模具交期',
        format: 'YYYY-MM-DD',
      },
    },
    // 下一节点处理人(主计划)
    {
      label: t('dict.CommonCol.nextHandler', [t('common.MC')]),
      field: 'quantitativePlanUserId',
      component: 'CustomUserSelect',
      componentProps: {
        disabled: false,
      },
    },
    {
      field: 'engineeringRemarks',
      i18nField: 'CommonCol.spRemark',
      label: '备注',
      component: 'Editor',
      componentProps: {
        editorHeight: '130px',
        mode: 'simple',
        toolbarConfig: {
          toolbarKeys: ['bold', 'color', 'bulletedList', 'numberedList'],
        },
      },
      colProps: {
        span: 24,
      },
    },
    // {
    //   field: 'engineeringRemarks',
    //   i18nField: 'CommonCol.spRemark',
    //   label: '特殊备注',
    //   component: 'Textarea',
    //   componentProps: { placeholder: '特殊备注', autoSize: { minRows: 1, maxRows: 5 } },
    //   colProps: {
    //     span: 24,
    //   },
    // },
  ];
}

// 计算利用率 材料利用率公式=【 ( 原材整支宽度 / 使用宽度) 取小数位取整】/ 【 原材整支宽度 / 使用宽度)】
export function calUtilizationRate(record) {
  const { width, materialWidth } = record;
  if (materialWidth == '') return '';
  const minWidth = width || 1;
  const utilizationRate = (Math.floor(materialWidth / minWidth) / (materialWidth / minWidth)) * 100;
  return utilizationRate.toFixed(1);
}
export function getMaterialColumns(): BasicColumn[] {
  return [
    {
      title: '步距组号',
      dataIndex: 'stepDistanceNumber',
      className: 'table-required',
      editRow: true,
      width: 120,
    },
    {
      title: '材料八码',
      dataIndex: 'shortMaterialCode',
      className: 'table-required',
      editRow: true,
      editComponent: 'Input',
      editComponentProps: {
        onChange: (eightCode, data, record) => {
          const { editValueRefs } = record;
          editValueRefs.originPartNumber = '';
          editValueRefs.materialCode = '';
        },
      },
      width: 140,
    },
    {
      title: '宽度(MM)',
      dataIndex: 'width',
      className: 'table-required',
      editRow: true,
      width: 120,
      editComponent: 'InputNumber',
      editComponentProps: {
        min: 0,
      },
    },
    {
      title: '查询结果',
      dataIndex: 'materialCode',
      width: 220,
      editRow: true,
      editComponent: 'ApiSelect',
      editComponentProps: {
        api: getMaterialSearchByShortCode,
        originParams: {
          shortMaterialCode: 'record.shortMaterialCode',
          materialWidth: 'record.width',
          toleranceNegative: 1,
        },
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        afterFetch: (res: any) => {
          const list = Array.isArray(res.data) ? res.data : [];
          res.data = list.map((item: any) => {
            return {
              ...item,
              // item.altMaterial 的值为number类型的0和1，1表示为替代料，0表示为非替代料
              desc: item.altMaterial ? `(${t('dict.CommonCol.alternativeMaterials')} ${t('dict.AltMaterialColumn.priority')}:${item.priority || ''})` : '',
            };
          });
        },
        singleDefaultFirst: true,
        preciseParam: 'materialWidth',
        resultField: 'data',
        labelField: 'materialCode',
        valueField: 'materialCode',
        nameFormat: ['materialCode', '', 'desc'],
        immediate: true,
      },
    },
    {
      title: '材料料号',
      dataIndex: 'originPartNumber',
      editComponent: 'Input',
      editComponentProps: {
        placeholder: t('common.autoCarry'),
      },
      editRow: true,
      width: 220,
    },
    {
      title: '利用率',
      dataIndex: 'materialUtilization',
      helpMessage: ['((整支宽度/使用宽度)向下取整后 * 使用宽度)/整支宽度*100%'],
      editRow: true,
      editComponent: 'InputNumber',
      editComponentProps: {
        placeholder: t('common.systemCalculation'),
        rate: true,
      },
      width: 150,
    },
    {
      title: '使用工序',
      dataIndex: 'processNumber',
      editComponent: 'Select',
      editComponentProps: {
        placeholder: '使用工序',
        allowClear: true,
      },
      width: 200,
      editRow: true,
    },
    {
      title: '出货材料',
      dataIndex: 'shippingMaterials',
      editComponent: 'ApiSelect',
      editComponentProps: {
        api: () => {
          return baseStore.getDictionaryData('PCC.ShippingMaterial');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
      },
      editRow: true,
      width: 140,
    },
    {
      title: '备料信息',
      dataIndex: 'preparationMaterials',
      editRow: true,
      editComponent: 'Input',
      editComponentProps: {
        placeholder: '',
      },
      width: 200,
    },
    {
      title: '用量倍数',
      dataIndex: 'materialDosage',
      editComponent: 'InputNumber',
      editRow: true,
      width: 120,
    },
    {
      title: '用量/KPCS',
      dataIndex: 'qty',
      helpMessage: ['当单位为M或PCS时，系统计算', 'PCS：【1/（1-不良率）*1000】*用量倍数', 'M：【步距/模数/（1-不良率）】*用量倍数'],
      editRow: true,
      editComponentProps: {
        placeholder: t('common.systemCalculation'),
      },
      width: 120,
    },
    {
      title: '单位',
      dataIndex: 'purchaseUnit',
      editRow: true,
      editComponent: 'Select',
      editComponentProps: {
        placeholder: t('common.autoCarry'),
        options: [
          {
            value: 'M',
            label: 'M',
          },
          {
            value: 'PCS',
            label: 'PCS',
          },
        ],
      },
      width: 120,
    },
    {
      title: '描述',
      dataIndex: 'materialDesc',
      editRow: true,
      editComponentProps: {
        placeholder: t('common.autoCarry'),
      },
      width: 200,
    },
    {
      title: '颜色',
      dataIndex: 'materialColor',
      editRow: true,
      editComponentProps: {
        placeholder: t('common.autoCarry'),
      },
      width: 100,
    },
    {
      title: '原材整支长度(M)',
      dataIndex: 'materialLength',
      editRow: true,
      editComponentProps: {
        placeholder: t('common.autoCarry'),
      },
    },
    {
      title: '原材整支宽度(MM)',
      dataIndex: 'materialWidth',
      editRow: true,
      editComponentProps: {
        placeholder: t('common.autoCarry'),
      },
    },
    // {
    //   title: '机台运行10H所需米数(M)',
    //   dataIndex: 'machineFunctionHourQty',
    //   editRow: true,
    //   editComponentProps: {
    //     placeholder: t('common.systemCalculation'),
    //   },
    //   width: 120,
    // },
    {
      title: '备注',
      dataIndex: 'remarks',
      editRow: true,
      width: 200,
    },
  ];
}

export function getPackageColumns(): BasicColumn[] {
  return [
    {
      title: '包材料号',
      dataIndex: 'partNumber',
      editComponent: 'ApiSelect',
      editComponentProps: {
        api: getMaterialCodeList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'materialCode',
        valueField: 'materialCode',
        immediate: true,
        placeholder: '包材料号',
        onChange: (_, data, record) => {
          if (!data) return;
          const { materialDesc, purchaseUnit } = data;
          const { editValueRefs } = record;
          editValueRefs.description = materialDesc;
          editValueRefs.unit = purchaseUnit;
        },
      },
      editRow: true,
      width: 180,
    },
    {
      title: '描述',
      dataIndex: 'description',
      editRow: true,
      editComponentProps: {
        placeholder: t('common.autoCarry'),
      },
      width: 200,
    },
    {
      title: '包材类型',
      dataIndex: 'packagingType',
      editRow: true,
      editComponentProps: {
        placeholder: '包材类型',
      },
      width: 100,
    },
    {
      title: '用量/KPCS',
      dataIndex: 'useQty',
      editRow: true,
      editComponentProps: {
        placeholder: '用量/KPCS',
      },
      width: 100,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      editRow: true,
      editDynamicDisabled: true,
      editComponentProps: {
        placeholder: t('common.autoCarry'),
      },
      width: 100,
    },
  ];
}

export const materialRowData = {
  stepDistanceNumber: 1,
  stepDistance: 0,
  modulus: 0,
  shortMaterialCode: '',
  width: '',
  materialCode: null,
  processNumber: '',
  shippingMaterials: null,
  materialDesc: '',
  materialDosage: 1,
  color: '',
  useQty: '',
  purchaseUnit: '',
  materialLength: '',
  materialWidth: '',
  materialUtilization: '',
  machineFunctionHourQty: '',
  remarks: '',
  onEdit: true,
  editable: true,
};

export const packageRowData = {
  partNumber: null,
  description: '',
  type: '',
  useQty: '',
  unit: '',
  onEdit: true,
  editable: true,
};

export const technologyRowData = {
  // processCode: null,
  processCode: '',
  processName: '',
  adjustmentTime: 0,
  speed: '',
  speedUnit: null,
  defectRate: 0,
  capacity: '',
  capacityUnit: 'K/H',
  processLevel: 0,
  imageList: [],
  onEdit: true,
  editable: true,
  disabled: {
    speed: false,
    speedUnit: false,
  },
};

/** 定义包材字段映射
 * key值为量试包材模块字段
 * value值为pcc包材模块字段
 * */
export const packageFieldMap = {
  packagingTypeId: 'type', // 包材类型
  packagingQty: 'packQty', // 包装数量
  packagingUnit: 'unit', // 包装单位
  partNumber: 'partNumber', // 包材料号
  materialDosage: 'useQtyMultiple', // 用量倍数
  useQty: 'useQty', // 用量
  description: 'description', // 描述
  unit: 'packUnit', // 用量单位
};

/**
 * 定义包材-卷芯字段映射
 * key值为量试包材-卷芯模块字段
 * value值为pcc包材-卷芯模块字段
 * */
export const packageCoreFieldMap = {
  ...packageFieldMap,
  shortMaterialCode: 'eightCode', // 材料八码
  width: 'width', // 宽度
  queryResults: 'originPartNumber', // 查询结果
  materialCode: 'partNumber', // 材料料号
};
