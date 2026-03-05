import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { getunitList } from '/@/api/common/constant';
import { getFactoryList } from '/@/api/basicData/factory';
import { h } from 'vue';
import { Input, InputNumber } from 'ant-design-vue';
import { getCAEProductType } from '/@/api/engineering/customsAffairsEngineering';
import { getMaterialCode } from '/@/api/structure/materialCode';

const { t } = useI18n();
const baseStore = useBaseStore();

export enum PRODUCT_TYPE_ENUM {
  胶类 = 'Adhesives',
  铜箔类 = 'CopperFoil',
  其他类 = 'Others',
}

/** 产品类型(中文)，取值字典 `CAEProductType` */
export const productTypeOptionsZh: Array<any> = [];
/** 产品类型(英文)，取值字典 `CAEProductType` */
export const productTypeOptionsEn: Array<any> = [];
/** 产品类型(越文)，取值字典 `CAEProductType` */
export const productTypeOptionsVi: Array<any> = [];
async function getProductTypeOptions() {
  return getCAEProductType().then(res => {
    (res.data || []).forEach(item => {
      productTypeOptionsZh.push({ enCode: item.productTypeCode, fullName: item.productTypeZh });
      productTypeOptionsEn.push({ enCode: item.productTypeCode, fullName: item.productTypeEn });
      productTypeOptionsVi.push({ enCode: item.productTypeCode, fullName: item.productTypeVN });
    });
  });
}

/** 是否选项(中文)，取值字典 `YesOrNo` */
export const yesOrNoOptionsZh: Array<any> = [
  {
    enCode: 0,
    fullName: '否',
  },
  {
    enCode: 1,
    fullName: '是',
  },
];
/** 是否选项(英文)，取值字典 `YesOrNo` */
export const yesOrNoOptionsEn: Array<any> = [
  {
    enCode: 0,
    fullName: 'No',
  },
  {
    enCode: 1,
    fullName: 'Yes',
  },
];
/** 是否选项(越文)，取值字典 `YesOrNo` */
export const yesOrNoOptionsVi: Array<any> = [
  {
    enCode: 0,
    fullName: 'Không',
  },
  {
    enCode: 1,
    fullName: 'Vâng',
  },
];

/** 工厂列表 */
export const factoryList: Array<any> = [];
async function loadFactoryList() {
  return getFactoryList().then(res => {
    const list = res.data || [];
    factoryList.push(...list);
  });
}

/** 单位列表 */
export const unitList: Array<any> = [];
async function loadUnitList() {
  return getunitList({ keyword: '' }).then(res => {
    const list = res.data || [];
    unitList.push(...list);
  });
}

export enum FILING_LANGUAGE_ENUM {
  中文 = 1,
  英文 = 2,
  中英文 = 3,
  中越文 = 4,
  中英越文 = 5,
  越文 = 6,
}
/** 语言列表 */
export const langList: Array<any> = [];
async function getLangList() {
  return baseStore.getDictionaryData('FilingLanguage').then((res: Array<any>) => {
    const list = res || [];
    langList.push(...list);
  });
}

/** 外观列表，取值字典`DieCutShipPattern` */
export const exteriorListZh: Array<any> = [
  {
    enCode: 'N',
    fullName: 'N',
  },
  {
    enCode: 'P',
    fullName: 'P',
  },
  {
    enCode: 'R',
    fullName: 'R',
  },
];

const dictPromiseResolveList: Array<any> = [];
let isLoaded = false;
/** 提前加载下拉选项，用于复制和显示处理 */
export async function getDict() {
  if (dictPromiseResolveList.length === 0) {
    Promise.all([loadFactoryList(), loadUnitList(), getLangList(), getProductTypeOptions()])
      .catch(e => {
        console.warn('🚀 ~ getDict.catch ~ e:', e);
      })
      .finally(() => {
        dictPromiseResolveList.forEach(resolve => resolve());
        isLoaded = true;
      });
  }
  return isLoaded ? Promise.resolve() : new Promise(resolve => dictPromiseResolveList.push(resolve));
}
getDict();

/** 编辑列 */
export function getEditTableColumn() {
  return [
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    {
      title: '语言',
      field: 'filingsLanguage',
      width: 100,
      formatter: ({ cellValue }) => {
        const target = langList.find(item => `${item.enCode}` === `${cellValue}`);
        return target?.fullName || cellValue;
      },
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 240,
    },
    {
      title: '工厂',
      field: 'factory',
      width: 150,
      formatter: ({ cellValue }) => {
        const target = factoryList.find(item => item.Code === cellValue);
        return target?.Name || cellValue;
      },
      // filters: [{ data: '' }],
      // filterRender: {
      //   name: 'ApiSelect',
      //   props: {
      //     api: getFactoryList,
      //     apiSearch: {
      //       show: true,
      //       searchName: 'Name',
      //     },
      //     resultField: 'data',
      //     labelField: 'Name',
      //     valueField: 'Code',
      //     showSearch: true,
      //     immediate: true,
      //     alwaysLoad: true,
      //     filterOption: false,
      //     notFoundContent: null,
      //   },
      // },
    },
    {
      title: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      width: 150,
    },
    {
      title: '直接客户料号',
      field: 'immediateCustomerPartNumber',
      width: 150,
      // editRender: {
      //   name: 'Input',
      //   props: {
      //     disabled: true,
      //   },
      // },
    },
    {
      title: '外观',
      field: 'exterior',
      width: 150,
      formatter: ({ cellValue, row }) => {
        const target = (row.exteriorList || []).find(item => `${item.enCode}` === `${cellValue}`);
        return target?.fullName || cellValue;
      },
    },
    {
      title: '品名',
      field: 'goodsName',
      width: 150,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    {
      title: '产品主要颜色',
      field: 'productColor',
      width: 150,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    {
      title: '产品类型',
      field: 'productType',
      width: 150,
      editRender: {
        name: 'ASelect',
        dynamicOptionsField: 'productTypeOptions',
        props: {
          fieldNames: { label: 'fullName', value: 'enCode' },
        },
      },
    },
    {
      title: '产品结构',
      field: 'productMix',
      width: 150,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    {
      title: '最小包装方式',
      field: 'minPackingMode',
      width: 150,
      editRender: {
        // name: 'Input',
        // props: {},
        enabled: true,
      },
      titleSuffix: {
        content: t('dict.CustomsAffairsEngineering.minPackingModeEditTip'),
      },
      slots: {
        edit: ({ row }) => {
          // 当产品类型不为【胶类】时，禁止编辑
          return h(Input, {
            disabled: row.productType !== PRODUCT_TYPE_ENUM.胶类,
            value: row.minPackingMode,
            onChange: ({ target }) => {
              row.minPackingMode = target?.value || '';
            },
          });
        },
      },
    },
    {
      title: '最小包装数量',
      field: 'minPackingQty',
      width: 150,
      editRender: {
        // name: 'Input',
        // props: {},
        enabled: true,
      },
      titleSuffix: {
        content: t('dict.CustomsAffairsEngineering.minPackingQtyEditTip'),
      },
      slots: {
        edit: ({ row }) => {
          // 当产品类型不为【胶类】时，禁止编辑
          return h(Input, {
            disabled: row.productType !== PRODUCT_TYPE_ENUM.胶类,
            value: row.minPackingQty,
            onChange: ({ target }) => {
              row.minPackingQty = target?.value || '';
            },
          });
        },
      },
    },
    {
      title: '金属箔厚度(mm)',
      field: 'thickness',
      width: 150,
      titleSuffix: {
        content: t('dict.CustomsAffairsEngineering.thicknessEditTip'),
      },
      editRender: {
        enabled: true,
      },
      slots: {
        edit: ({ row }) => {
          // 当产品类型不为【铜箔】时，禁止编辑
          return h(InputNumber, {
            disabled: row.productType !== PRODUCT_TYPE_ENUM.铜箔类,
            value: row.thickness,
            onChange: value => {
              row.thickness = value;
            },
          });
        },
      },
    },
    {
      title: '规格尺寸(mm)',
      field: 'specSize',
      width: 300,
      titleSuffix: {
        content: t('dict.CustomsAffairsEngineering.specSizeEditTip'),
      },
      editRender: {
        enabled: true,
        // name: 'Input',
        // props: {},
      },
      children: [
        // 长度
        {
          title: t('common.length'),
          field: 'specSizeLength',
          width: 100,
          editRender: {
            name: 'InputNumber',
            props: {
              min: 0,
            },
          },
        },
        // 宽度
        {
          title: t('dict.CommonCol.width'),
          field: 'specSizeWidth',
          width: 100,
          editRender: {
            name: 'InputNumber',
            props: {
              min: 0,
            },
          },
        },
        // 厚度
        {
          title: t('dict.CommonCol.thickness'),
          field: 'specSizeThickness',
          width: 100,
          editRender: {
            name: 'InputNumber',
            props: {
              min: 0,
            },
          },
        },
      ],
    },
    // {
    //   title: '单位',
    //   field: 'sizeUnit',
    //   i18nField: 'sizeUnit',
    //   formatter: ({ cellValue }) => {
    //     const target = unitList.find(item => item.Code === cellValue);
    //     return target?.Name || cellValue;
    //   },
    //   width: 150,
    // },
    {
      title: '主要材质/成分比例',
      field: 'materialQuality',
      width: 240,
      editRender: {
        name: 'Textarea',
        props: {
          autoSize: { minRows: 1 },
        },
      },
    },
    {
      title: '用途说明',
      field: 'purpose',
      width: 150,
      editRender: {
        name: 'Textarea',
        props: {
          autoSize: { minRows: 1 },
        },
      },
    },
    {
      title: '功能原理',
      field: 'functionalPrinciple',
      width: 150,
      editRender: {
        name: 'Textarea',
        props: {
          autoSize: { minRows: 1 },
        },
      },
    },
    {
      title: '是否单面自粘',
      field: 'isSelfPaste',
      width: 150,
      editRender: {
        name: 'ASelect',
        dynamicOptionsField: 'yesOrNoOptions',
        props: {
          fieldNames: { label: 'fullName', value: 'enCode' },
        },
      },
    },
    {
      title: '主材材料八码',
      field: 'shortMaterialCodes',
      width: 200,
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getMaterialCode,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'shortMaterialCode',
          },
          immediate: true,
          params: {
            pageSize: 20,
          },
          placeholder: '',
          resultField: 'data',
          labelField: 'shortMaterialCode',
          valueField: 'shortMaterialCode',
          filterOption: false,
          mode: 'multiple',
          onChange: (value: Array<string>, option: Array<any>, { row }) => {
            handleShortMaterialCodeChange(value, option, row);
          },
        },
      },
      titleSuffix: {
        content: t('dict.CustomsAffairsEngineering.shortMaterialCodeEditTip'),
      },
      slots: {
        default: 'shortMaterialCodes',
      },
    },
    {
      title: '原厂商型号',
      field: 'singleMaterialNumbers',
      i18nField: 'singleMaterialNumber',
      width: 200,
      formatter: ({ cellValue }) => {
        return Array.isArray(cellValue) ? cellValue.join('、') : cellValue || '';
      },
    },
    {
      title: '是否为保密料号',
      field: 'isSecrecyMaterial',
      width: 150,
      editRender: {
        name: 'ASelect',
        dynamicOptionsField: 'yesOrNoOptions',
        props: {
          fieldNames: { label: 'fullName', value: 'enCode' },
        },
      },
    },
    {
      title: '保密料号单重(kg/pcs)',
      field: 'secrecyMaterialWeight',
      width: 180,
      formatter: ({ cellValue }) => {
        if (cellValue === null || cellValue === undefined || isNaN(cellValue)) return '';
        // 使用toFixed确保固定小数位显示，避免科学计数法
        return Number(cellValue).toFixed(7);
      },
      editRender: {
        name: 'InputNumber',
        props: {
          precision: 7,
        },
      },
    },
    // {
    //   title: '重量单位',
    //   field: 'weightUnit',
    //   width: 150,
    //   editRender: {
    //     name: 'ASelect',
    //     props: {
    //       options: unitList,
    //       fieldNames: { label: 'Name', value: 'Code' },
    //     },
    //   },
    // },
    {
      title: '是否设变',
      field: 'isSetChange',
      width: 150,
      editRender: {
        name: 'ASelect',
        dynamicOptionsField: 'yesOrNoOptions',
        props: {
          fieldNames: { label: 'fullName', value: 'enCode' },
        },
      },
    },
    {
      title: '备注(工程备案数据)',
      field: 'engineeringRmk',
      width: 240,
      editRender: {
        name: 'Input',
        props: {},
      },
      titleSuffix: {
        content: t('dict.CustomsAffairsEngineering.engineeringRmkEditTip'),
      },
    },
  ];
}

/**
 * 当产品类型为【胶类】时.显示【最小包装方式】、【最小包装数量】字段.必填
 * @param param0
 * @returns
 */
function validatorMinPacking({ cellValue, row }) {
  if (row.productType === PRODUCT_TYPE_ENUM.胶类 && !cellValue) {
    return Promise.reject(new Error(t('common.required')));
  }
  return Promise.resolve();
}

/** 表格校验规则 */
export const editRules = {
  // 品名
  goodsName: [{ required: true, message: t('common.required') }],
  // 产品主要颜色
  productColor: [{ required: true, message: t('common.required') }],
  // 产品类型
  productType: [{ required: true, message: t('common.required') }],
  // 规格尺寸
  specSize: [{ required: true, message: t('common.required') }],
  specSizeLength: [
    { required: true, message: t('common.required') },
    {
      validator: ({ cellValue }) => {
        // 校验长度必须是大于零的
        if (Number.isNaN(Number(cellValue)) || cellValue <= 0) {
          return new Error(t('common.gtZero'));
        }
      },
    },
  ],
  specSizeWidth: [
    { required: true, message: t('common.required') },
    {
      validator: ({ cellValue }) => {
        // 校验宽度必须是大于零的
        if (Number.isNaN(Number(cellValue)) || cellValue <= 0) {
          return new Error(t('common.gtZero'));
        }
      },
    },
  ],
  specSizeThickness: [
    { required: true, message: t('common.required') },
    {
      validator: ({ cellValue }) => {
        // 校验厚度必须是大于零的
        if (Number.isNaN(Number(cellValue)) || cellValue <= 0) {
          return new Error(t('common.gtZero'));
        }
      },
    },
  ],
  // 最小包装方式
  minPackingMode: [{ validator: validatorMinPacking }],
  // 最小包装数量
  minPackingQty: [{ validator: validatorMinPacking }],
  // 金属箔厚度(mm)
  thickness: [
    {
      validator: ({ cellValue, row }) => {
        // 当产品类型为【铜箔】时．显示金属箔厚度(mm)字段．必填
        if (row.productType === PRODUCT_TYPE_ENUM.铜箔类 && !cellValue) {
          return Promise.reject(new Error(t('common.required')));
        }
        return Promise.resolve();
      },
    },
  ],
  // 主要材质/成分比例
  materialQuality: [{ required: true, message: t('common.required') }],
  // 是否单面自粘
  isSelfPaste: [{ required: true, message: t('common.required') }],
  // 是否为保密料号
  isSecrecyMaterial: [{ required: true, message: t('common.required') }],
  // 用途
  purpose: [{ required: true, message: t('common.required') }],
  // 功能原理
  functionalPrinciple: [{ required: true, message: t('common.required') }],
  // 主材材料八码
  shortMaterialCodes: [
    { required: true, message: t('common.required') },
    {
      validator: ({ cellValue }) => {
        if (!Array.isArray(cellValue) || cellValue.length === 0) {
          return new Error(t('common.required'));
        }
      },
    },
  ],
};

/**
 * 根据语言，给表格设置对应的下拉选项，并且格式化数据
 * @param list 表格数据列表
 * @param isEdit 是否为编辑状态
 */
export function formatTableData(list: Array<any>, isEdit = false) {
  list.forEach(row => {
    if (row.filingsLanguage === FILING_LANGUAGE_ENUM.英文) {
      row.yesOrNoOptions = yesOrNoOptionsEn;
      row.exteriorList = exteriorListZh;
      row.productTypeOptions = productTypeOptionsEn;
    } else if (row.filingsLanguage === FILING_LANGUAGE_ENUM.越文) {
      row.yesOrNoOptions = yesOrNoOptionsVi;
      row.exteriorList = exteriorListZh;
      row.productTypeOptions = productTypeOptionsVi;
    } else {
      row.yesOrNoOptions = yesOrNoOptionsZh;
      row.exteriorList = exteriorListZh;
      row.productTypeOptions = productTypeOptionsZh;
    }

    // 将【规格尺寸(`specSize`)】由：10mm*10mm*10mm 转换为【长度(`specSizeLength`)】、【宽度(`specSizeWidth`)】、【高度(`specSizeThickness`)】三个字段
    // 规格尺寸(`specSize`)字段值为空时，都默认为零
    const [length = '', width = '', thickness = ''] = row.specSize?.split('*') || [];
    row.specSizeLength = +(length.replace('mm', '') || '');
    if (Number.isNaN(row.specSizeLength)) {
      row.specSizeLength = '';
    }
    row.specSizeWidth = +(width.replace('mm', '') || '');
    if (Number.isNaN(row.specSizeWidth)) {
      row.specSizeWidth = '';
    }
    row.specSizeThickness = +(thickness.replace('mm', '') || '');
    if (Number.isNaN(row.specSizeThickness)) {
      row.specSizeThickness = '';
    }

    // 兼容旧数据处理，如果是编辑状态，不存在【主材材料八码(`shortMaterialCodes`)】时，清空【原厂商型号(`singleMaterialNumbers`)】
    if (isEdit && (!row.shortMaterialCodes || row.shortMaterialCodes.length === 0)) {
      row.singleMaterialNumbers = [];
    }
  });
  return list;
}

/**
 * 处理【主材材料八码(`shortMaterialCodes`)】变更事件
 * @param value 当前选中的数组
 * @param option 当前选中的选项
 * @param row 当前行数据
 */
export function handleShortMaterialCodeChange(value: Array<string>, option: Array<any>, row: any) {
  if (typeof row.materialNumberMap !== 'object') {
    row.materialNumberMap = {};
  }
  const map: Record<string, string> = {};
  const list: Array<string> = [];
  if (value.length > 0) {
    value.forEach(item => {
      const originalModelNumber =
        row.materialNumberMap[item] || option.find(opt => opt.value === item || opt.shortMaterialCode === item)?.originalModelNumber || '';
      map[item] = originalModelNumber;
      list.push(originalModelNumber);
    });
  }
  row.materialNumberMap = map;
  row.singleMaterialNumbers = list;
}
