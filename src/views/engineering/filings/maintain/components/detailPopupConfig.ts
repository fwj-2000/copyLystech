// import { useI18n } from '/@/hooks/web/useI18n';
import { getDict, formatTableData, langList, factoryList } from './ApplyPopConfig';
import { cloneDeep } from 'lodash-es';

// const { t } = useI18n();

export function getSchemas(isNarrow = false) {
  return [
    {
      label: '产品内部料号',
      field: 'insidePartNumber',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '语言',
      field: 'filingsLanguage',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '工厂',
      field: 'factory',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '直接客户料号',
      field: 'immediateCustomerPartNumber',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '外观',
      field: 'exterior',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '品名',
      field: 'goodsName',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '产品主要颜色',
      field: 'productColor',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '产品类型',
      field: 'productType',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '最小包装方式',
      field: 'minPackingMode',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '最小包装数量',
      field: 'minPackingQty',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '金属箔厚度(mm)',
      field: 'thickness',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '规格尺寸',
      field: 'specSize',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    // {
    //   label: '单位',
    //   field: 'sizeUnit',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '',
    //   },
    // },
    {
      label: '产品结构',
      field: 'productMix',
      component: 'Input',
      colProps: { span: 8 },
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '主要材质/成分比例',
      field: 'materialQuality',
      component: 'Input',
      colProps: { span: 12 },
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '用途',
      field: 'purpose',
      component: 'Textarea',
      colProps: { span: 24 },
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '功能原理',
      field: 'functionalPrinciple',
      component: 'Textarea',
      colProps: { span: 24 },
      componentProps: {
        placeholder: '',
      },
    },
    // {
    //   label: '项目名称',
    //   field: 'projectName',
    //   component: 'Input',
    //   i18nField: 'CommonCol.projectName',
    //   componentProps: {
    //     placeholder: '',
    //   },
    // },
    {
      label: '是否单面自粘',
      field: 'isSelfPaste',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '是否为保密料号',
      field: 'isSecrecyMaterial',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '保密料号单重(kg/pcs)',
      field: 'secrecyMaterialWeight',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    // {
    //   label: '重量单位',
    //   field: 'weightUnit',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '',
    //   },
    // },
    {
      label: '是否设变',
      field: 'isSetChange',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '主材材料八码',
      field: 'shortMaterialCodes',
      colProps: { span: 24 },
      component: 'Input',
      slot: 'shortMaterialCodes',
    },
    {
      label: '原厂商型号',
      field: 'singleMaterialNumbers',
      i18nField: 'singleMaterialNumber',
      colProps: { span: 24 },
      component: 'Input',
      slot: 'singleMaterialNumbers',
    },
    {
      label: '备注(工程备案数据)',
      field: 'engineeringRmk',
      component: 'Input',
      colProps: { span: 24 },
      componentProps: {
        placeholder: '',
      },
    },
  ].map(item => {
    const span = item?.colProps?.span || 4;
    const doubleSpan = span * 2;
    item.colProps = {
      span: isNarrow ? (doubleSpan > 24 ? 24 : doubleSpan) : span,
    };
    return item;
  });
}

/**
 * 表单数据进行语言处理
 * @param formData
 * @returns
 */
export async function converTableDataByLanguage(formData: any) {
  await getDict();
  const [data] = formatTableData([cloneDeep(formData)]);

  // 语言翻译
  data.filingsLanguage = langList.find(item => `${item.enCode}` === `${data.filingsLanguage}`)?.fullName || '';
  // 工厂
  data.factory = factoryList.find(item => `${item.Code}` === `${data.factory}`)?.Name || '';
  // 外观
  data.exterior = data.exteriorList.find(item => `${item.enCode}` === `${data.exterior}`)?.fullName || '';
  // 产品类型
  data.productType = data.productTypeOptions.find(item => `${item.enCode}` === `${data.productType}`)?.fullName || '';
  // 是否单面自粘
  data.isSelfPaste = data.yesOrNoOptions.find(item => `${item.enCode}` === `${data.isSelfPaste}`)?.fullName || '';
  // 是否为保密料号
  data.isSecrecyMaterial = data.yesOrNoOptions.find(item => `${item.enCode}` === `${data.isSecrecyMaterial}`)?.fullName || '';
  // 是否设变
  data.isSetChange = data.yesOrNoOptions.find(item => `${item.enCode}` === `${data.isSetChange}`)?.fullName || '';

  return data;
}
