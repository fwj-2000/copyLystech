import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';
import { getUnitListByKeyword, getMaterialCodeList } from '/@/api/finance/materialPrice';
import { getMaterialAreaChildren, getMaterialQueryByMaterialCode, getMaterialSearchByShortCode, getPCCPackingTypeList } from '/@/api/engineering/pcc';

import { useMessage } from '/@/hooks/web/useMessage';
import { isEmpty, isFunction, isNullOrUnDef } from '/@/utils/is';
import { debounce } from 'lodash-es';

const baseStore = useBaseStore();
const { createMessage } = useMessage();
const { t } = useI18n();

// PCC包材
export function getPccPackageColumn(): any {
  // 如果是编辑，那么新增的时候需要将某些ApiSelect设置默认
  return [
    {
      title: '类型',
      field: 'type',
      width: 180,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'typeName',
        props: {
          api: getPCCPackingTypeList,
          // params: {
          //   enCode: 'PackagingMaterials',
          // },
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          autofocus: true,
          autoSelect: true,
          resultField: 'data',
          labelField: 'typeName',
          valueField: 'typeCode',
          immediate: true,
          filterOption: false,
          notFoundContent: null,
          onChange: (type, data, { row }) => {
            if (type && data) {
              row.type = type;
              row.typeName = data.typeName || data.label;
              row.unit = data.unit;
            }
          },
        },
      },
    },
    {
      title: '包装数量',
      field: 'packQty',
      minWidth: 120,
      editRender: {
        name: 'InputNumber',
        props: {
          // placeholder: t('common.autoCarry'),
          min: 0,
          onChange: (packQty, { row }) => calcUseQty(packQty, row.useQtyMultiple, row),
        },
      },
    },
    {
      title: '单位',
      field: 'unit',
      minWidth: 120,
      // editRender: {
      //   name: 'InputNumber',
      //   props: {
      //     placeholder: t('dict.PCCColumn.capacity'),
      //   },
      // },
    },
    // {
    //   title: '材料八码',
    //   field: 'eightCode',
    //   width: 150,
    //   editRender: {
    //     name: 'Input',
    //     props: {
    //       onChange: (_, { row }) => {
    //         const debounceSelectOriginPartNumber = getDebouncedSelectOriginPartNumber(row, 350);
    //         debounceSelectOriginPartNumber({ row, reset: true });
    //       },
    //     },
    //   },
    // },
    // {
    //   title: '宽度',
    //   field: 'width',
    //   width: 120,
    //   editRender: {
    //     name: 'InputNumber',
    //     props: {
    //       min: 0,
    //       onChange: (width, params) => {
    //         const { row } = params;
    //         if (!width) return;
    //         const originPartNumber = row.originPartNumber || '';
    //         const [_, eightCode, calcWidth] = originPartNumber?.split('-');
    //         const partNumber = buildPartNumber(calcWidth, width, eightCode, originPartNumber);
    //         Object.assign(row, {
    //           partNumber,
    //         });
    //         const debounceSelectOriginPartNumber = getDebouncedSelectOriginPartNumber(row, 350);
    //         debounceSelectOriginPartNumber({ row });
    //       },
    //     },
    //   },
    // },
    // {
    //   title: '查询结果',
    //   field: 'originPartNumber',
    //   width: 180,
    //   formatter: 'ApiSelect',
    //   editRender: {
    //     name: 'ApiSelect',
    //     props: {
    //       api: async params => {
    //         const { shortMaterialCode, materialWidth } = params;
    //         if (!shortMaterialCode || shortMaterialCode.length != 8) return null;
    //         if (isNullOrUnDef(materialWidth)) return null;
    //         return getMaterialSearchByShortCode(params);
    //       },
    //       afterFetch: (res: any, { row }) => {
    //         if (!res) {
    //           return res;
    //         }
    //         if (isEmpty(res?.data)) {
    //           resetPackagePartNumber(row);
    //           return null;
    //         }
    //         const list = Array.isArray(res?.data) ? res?.data : [];
    //         res.data = list.map((item: any) => {
    //           return {
    //             ...item,
    //             desc: item.altMaterial ? `(${t('dict.CommonCol.alternativeMaterials')} ${t('dict.AltMaterialColumn.priority')}:${item.priority || ''})` : '',
    //           };
    //         });
    //       },
    //       placeholder: t('dict.PCCColumn.originPartNumber'),
    //       params: {
    //         toleranceNegative: 0,
    //       },
    //       rowParams: {
    //         shortMaterialCode: 'eightCode',
    //         materialWidth: 'width',
    //       },
    //       showSearch: true,
    //       apiSearch: {
    //         show: true,
    //         searchName: 'keyword',
    //       },
    //       autofocus: true,
    //       autoSelect: true,
    //       resultField: 'data',
    //       labelField: 'materialCode',
    //       valueField: 'materialCode',
    //       nameFormat: ['materialCode', '', 'desc'],
    //       immediate: true,
    //       filterOption: false,
    //       notFoundContent: null,
    //       onChange: (materialCode, data, params) => {
    //         if (!materialCode || !data) return;
    //         const { row } = params;
    //         applyOriginPartNumberChange(materialCode, data, row);
    //       },
    //     },
    //   },
    // },
    {
      title: '包材料号',
      field: 'partNumber',
      minWidth: 210,
      width: '',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
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
          onChange: (_, data, { row }) => {
            if (!data) return;
            const { materialDesc } = data;
            row.description = materialDesc;
          },
        },
      },
    },
    {
      title: '描述',
      field: 'description',
      minWidth: '',
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    {
      title: '用量倍数',
      field: 'useQtyMultiple',
      width: 100,
      editRender: {
        name: 'InputNumber',
        props: {
          // precision: 3,
          // step: 0.001,
          // placeholder: t('common.autoCarry'),
          // onChange: (_, data, params) => {
          //   const { row } = params;
          //   if (data) {
          //     row.periodOfDepreciationName = data.fullName;
          //   } else {
          //     row.periodOfDepreciationName = '';
          //   }
          // },
          onChange: (useQtyMultiple, { row }) => calcUseQty(row.packQty, useQtyMultiple, row),
        },
      },
    },

    {
      title: '用量/KPCS',
      field: 'useQty',
      width: 110,
      editRender: {
        name: 'InputNumber',
        props: {
          // onChange: (_, data, params) => {
          //   const { row } = params;
          //   if (data) {
          //     row.periodOfDepreciationName = data.fullName;
          //   } else {
          //     row.periodOfDepreciationName = '';
          //   }
          // },
        },
      },
    },
    {
      title: '单位',
      field: 'packUnit',
      formatter: 'ApiSelect',
      width: 100,
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getUnitListByKeyword,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          // preciseParam: 'materialWidth',
          resultField: 'data',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          labelField: 'Name',
          valueField: 'Code',
          // 两者并无关联，不加联动处理
          // onChange: (packUnit, data, { row }) => {
          //   console.log('🚀 ~ onChange ~ packUnit, data: ', packUnit, data);
          //   if (packUnit && data) {
          //     row.type = packUnit;
          //     row.typeName = data.fullName || data.label;
          //   }
          // },
        },
      },
    },
    {
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      title: '操作',
      fixed: 'right',
    },
  ];
}

export function getPccPackageCustomColumn(emit): any {
  // 如果是编辑，那么新增的时候需要将某些ApiSelect设置默认
  return [
    {
      title: '类型',
      field: 'type',
      width: 180,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getPCCPackingTypeList,
          // params: {
          //   enCode: 'PackagingMaterials',
          // },
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          autofocus: true,
          autoSelect: true,
          resultField: 'data',
          labelField: 'typeName',
          valueField: 'typeCode',
          immediate: true,
          filterOption: false,
          notFoundContent: null,
          onChange: (type, data, { row }) => {
            console.log('🚀 ~ onChange ~ type, data: ', type, data);
            if (type && data) {
              row.type = type;
              row.typeName = data.typeName || data.label;
              row.unit = data.unit;
            }
          },
        },
      },
    },
    {
      title: '包装数量(PCS)',
      field: 'packQty',
      i18nField: 'CommonCol.packQtyPCS',
      minWidth: 120,
      editRender: {
        name: 'InputNumber',
        props: {
          // placeholder: t('common.autoCarry'),
          min: 0,
          onChange: (packQty, { row }) => calcUseQty(packQty, row.useQtyMultiple, row),
        },
      },
    },
    {
      title: '材料八码',
      field: 'eightCode',
      width: 150,
      editRender: {
        name: 'Input',
        props: {
          onChange: (_, { row }) => {
            const debounceSelectOriginPartNumber = getDebouncedSelectOriginPartNumber(row, 350);
            debounceSelectOriginPartNumber({ row, reset: true });
          },
        },
      },
    },
    {
      title: '宽度',
      field: 'width',
      width: 120,
      editRender: {
        name: 'InputNumber',
        props: {
          min: 0,
          onChange: (width, params) => {
            const { row } = params;
            if (!width) return;
            const originPartNumber = row.originPartNumber || '';
            const [_, eightCode, calcWidth] = originPartNumber?.split('-');
            const partNumber = buildPartNumber(calcWidth, width, eightCode, originPartNumber);
            console.log(partNumber, 'partNumberpartNumberpartNumber');
            Object.assign(row, {
              partNumber,
            });
            const debounceSelectOriginPartNumber = getDebouncedSelectOriginPartNumber(row, 350);
            debounceSelectOriginPartNumber({ row });
          },
        },
      },
    },
    {
      title: '查询结果',
      field: 'originPartNumber',
      width: 180,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: async params => {
            const { shortMaterialCode, materialWidth } = params;
            if (!shortMaterialCode || shortMaterialCode.length != 8) return null;
            if (isNullOrUnDef(materialWidth)) return null;
            return getMaterialSearchByShortCode(params);
          },
          afterFetch: (res: any, { row }) => {
            if (!res) {
              return res;
            }
            if (isEmpty(res?.data)) {
              resetPackagePartNumber(row);
              return null;
            }
            const list = Array.isArray(res?.data) ? res?.data : [];
            res.data = list.map((item: any) => {
              return {
                ...item,
                desc: item.altMaterial ? `(${t('dict.CommonCol.alternativeMaterials')} ${t('dict.AltMaterialColumn.priority')}:${item.priority || ''})` : '',
              };
            });
          },
          placeholder: t('dict.PCCColumn.originPartNumber'),
          params: {
            toleranceNegative: 0,
          },
          rowParams: {
            shortMaterialCode: 'eightCode',
            materialWidth: 'width',
          },
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          autofocus: true,
          autoSelect: true,
          resultField: 'data',
          labelField: 'materialCode',
          valueField: 'materialCode',
          nameFormat: ['materialCode', '', 'desc'],
          immediate: true,
          filterOption: false,
          notFoundContent: null,
          onChange: (materialCode, data, params) => {
            if (!materialCode || !data) return;
            const { row } = params;
            applyOriginPartNumberChange(materialCode, data, row);
          },
        },
      },
    },
    {
      title: '材料料号',
      field: 'partNumber',
      width: 150,
      // editRender: {
      //   name: 'InputNumber',
      //   props: {
      //     placeholder: t('dict.PCCColumn.capacity'),
      //   },
      // },
    },
    {
      title: '描述',
      field: 'description',
      width: 150,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    {
      title: '用量倍数',
      field: 'useQtyMultiple',
      width: 100,
      editRender: {
        name: 'InputNumber',
        props: {
          // precision: 3,
          // step: 0.001,
          onChange: (useQtyMultiple, { row }) => calcUseQty(row.packQty, useQtyMultiple, row),
        },
      },
    },

    {
      title: '用量/KPCS',
      field: 'useQty',
      width: 110,
      editRender: {
        name: 'InputNumber',
        props: {
          // onChange: (_, data, params) => {
          //   const { row } = params;
          //   if (data) {
          //     row.periodOfDepreciationName = data.fullName;
          //   } else {
          //     row.periodOfDepreciationName = '';
          //   }
          // },
        },
      },
    },
    {
      title: '单位',
      field: 'packUnit',
      formatter: 'ApiSelect',
      width: 100,
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getUnitListByKeyword,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          // preciseParam: 'materialWidth',
          resultField: 'data',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          labelField: 'Name',
          valueField: 'Code',
        },
      },
    },
    {
      field: 'action',
      title: t('common.action'),
      width: 100,
      slots: { default: 'action' },
      fixed: 'right',
    },
  ];
}

export function getCustomRules() {
  return {
    type: [
      {
        validator: async ({ col, cell, row, $grid }) => {
          const { data } = await getMaterialAreaChildren({ enCode: 'PackagingMaterials' });
          const target = data.find(item => item.fullName === cell);
          if (!target) {
            return createMessage.warning('请选择正确的类型');
          }
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(target.enCode, target, { row, $grid });
          }
        },
      },
    ],
    packQty: [
      {
        validator: async ({ col, cell, row, $grid }) => {
          if (!cell) {
            return createMessage.warning('请选择正确的包装数量');
          }
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(cell, { row, $grid });
          }
        },
      },
    ],
    eightCode: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell)) return;
          row.eightCode = cell;
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(cell, { row, isPaster: true });
          }
        },
      },
    ],
    width: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell)) return;
          row.width = cell;
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(cell, { row, isPaster: true });
          }
        },
      },
    ],
    originPartNumber: [
      {
        validator: async ({ col, cell, row }) => {
          const { data } = await getMaterialQueryByMaterialCode([cell]);
          if (isNullOrUnDef(cell)) {
            return new Error('请选择正确的料号');
          }
          const {
            editRender: {
              props: { valueField, onChange },
            },
          } = col;
          if (!data || data.length > 1) {
            return new Error('请选择正确的料号');
          }
          console.log('🚀 ~ validator ~ valueField: ', valueField);
          if (isFunction(onChange)) {
            console.log('🚀 ~ validator ~ data[valueField]: ', data[0][valueField]);
            onChange(data[0][valueField], data[0], { row });
          }
        },
      },
    ],
    partNumber: [
      {
        validator: () => {},
      },
    ],
    description: [
      {
        validator: () => {},
      },
    ],
    useQtyMultiple: [
      {
        validator: () => {},
      },
    ],
    useQty: [
      {
        validator: () => {},
      },
    ],
    unit: [
      {
        validator: ({ col, cell, row }, data) => {
          console.log('🚀 ~ validator ~ data: ', data);
          if (!data) {
            return createMessage.warning('请选择正确的类型');
          }
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(data.enCode, data, { row });
          }
        },
      },
    ],
  };
}

export function getBaseRules() {
  return {
    type: [
      {
        validator: async ({ col, cell, row, $grid }, data) => {
          console.log('🚀 ~ validator ~ data: ', data);
          if (!data) {
            return createMessage.warning('请选择正确的类型');
          }
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(data.enCode, data, { row, $grid });
          }
        },
      },
    ],
    packQty: [
      {
        validator: async ({ col, cell, row, $grid }) => {
          if (!cell) {
            return createMessage.warning('请选择正确的包装数量');
          }
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(cell, { row, $grid });
          }
        },
      },
    ],
    eightCode: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell)) return;
          row.eightCode = cell;
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(cell, { row, isPaster: true });
          }
        },
      },
    ],
    width: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell)) return;
          row.width = cell;
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(cell, { row, isPaster: true });
          }
        },
      },
    ],
    originPartNumber: [
      {
        validator: async ({ col, cell, row }) => {
          const { data } = await getMaterialQueryByMaterialCode([cell]);
          if (isNullOrUnDef(cell)) {
            return new Error('请选择正确的料号');
          }
          const {
            editRender: {
              props: { valueField, onChange },
            },
          } = col;
          if (!data || data.length > 1) {
            return new Error('请选择正确的料号');
          }
          if (isFunction(onChange)) {
            onChange(data[0][valueField], data[0], { row });
          }
        },
      },
    ],
    unit: [
      {
        validator: () => {},
      },
    ],
    // partNumber: [
    //   {
    //     validator: () => {},
    //   },
    // ],
    partNumber: [
      {
        validator: ({ col, cell, row }, data) => {
          if (isNullOrUnDef(cell)) {
            return new Error('请选择正确的料号');
          }
          const {
            editRender: {
              props: { valueField, onChange },
            },
          } = col;
          if (!data) {
            return new Error('请选择正确的料号');
          }
          if (isFunction(onChange)) {
            onChange(data[valueField], data, { row });
          }
        },
      },
    ],
    description: [
      {
        validator: () => {},
      },
    ],
    useQtyMultiple: [
      {
        validator: () => {},
      },
    ],
    useQty: [
      {
        validator: () => {},
      },
    ],
    packUnit: [
      {
        validator: async ({ col, cell, row, $grid }, data) => {
          console.log('🚀 ~ validator ~ data: ', data);
          if (!data) {
            return createMessage.warning('请选择正确的单位');
          }
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(data.Name, data, { row, $grid });
          }
        },
      },
    ],
  };
}

function buildPartNumber(calcWidth: string, width: number, eightCode: string, materialCode: string): string {
  if (materialCode) {
    // 匹配出最后一个-后面的值进行替换
    const _width = width || 9999;
    const formattedWidth = _width.toString()?.padStart(4, '0');
    const parts = materialCode.split('-');
    if (parts.length >= 2) {
      const numericCalcWidth = Number(calcWidth);
      const numericWidth = Number(width);
      if (!Number.isNaN(numericCalcWidth) && !Number.isNaN(numericWidth) && numericCalcWidth === numericWidth) {
        parts[parts.length - 1] = formattedWidth;
        return parts.join('-');
      }
      parts[0] = '600';
      parts[parts.length - 1] = formattedWidth;
      return parts.join('-');
    }
    return materialCode;
  }
  // const retNum = Number(calcWidth) - width;
  // let partNumber = '';
  // if (retNum > 3) {
  //   partNumber = `600-${eightCode}-${(width || 9999)?.toString()?.padStart(4, 0)}`;
  // } else {
  //   partNumber = materialCode;
  // }
  return '';
}

const debounceMap = new WeakMap();
function getDebouncedSelectOriginPartNumber(row, delay) {
  if (!debounceMap.has(row)) {
    const debounced = debounce(params => {
      selectOriginPartNumber(params);
    }, delay);
    debounceMap.set(row, debounced);
  }
  return debounceMap.get(row);
}

async function selectOriginPartNumber({ row, reset = false }: { row: any; reset?: boolean }) {
  if (reset) {
    resetPackagePartNumber(row);
  }
  const { eightCode, width } = row;
  if (!eightCode || eightCode.length != 8 || isNullOrUnDef(width)) return;
  try {
    const { data } = await getMaterialSearchByShortCode({
      shortMaterialCode: eightCode,
      materialWidth: width,
      toleranceNegative: 0,
    });
    const list = Array.isArray(data) ? data : [];
    if (isEmpty(list)) {
      resetPackagePartNumber(row);
      return;
    }
    let target = list[0];
    if (list.length > 1) {
      if (list.some(item => item.altMaterial)) return;
      const matched = list.find(item => row.width == item.materialWidth);
      if (matched) {
        target = matched;
      }
    }
    if (!target?.materialCode) return;
    applyOriginPartNumberChange(target.materialCode, target, row);
    row.originPartNumber = target.materialCode;
  } catch (error) {
    console.error('selectOriginPartNumber failed', error);
  }
}

function resetPackagePartNumber(row) {
  row.originPartNumber = '';
  row.originPartNumberName = '';
  row.partNumber = '';
  row.partNumberName = '';
}

function applyOriginPartNumberChange(materialCode, data, row) {
  const { width, eightCode: rowEightCode } = row;
  if (isNullOrUnDef(width) || !rowEightCode) {
    resetPackagePartNumber(row);
    return;
  }
  const [_, eightCode, calcWidth] = materialCode?.split('-');
  const { materialDesc, materialName, materialLength, materialWidth, materialColor } = data;
  const partNumber = buildPartNumber(calcWidth, row.width, eightCode, materialCode);
  Object.assign(row, {
    description: materialDesc || materialName || null,
    wholeLength: materialLength,
    wholeWidth: materialWidth,
    color: materialColor,
    eightCode,
    partNumber,
  });
}

export function calcUseQty(packQty, useQtyMultiple, row) {
  console.log('🚀 ~ calcUseQty ~ packQty, useQtyMultiple, row: ', packQty, useQtyMultiple, row);
  if (row.packUnit !== 'PCS') return;
  // 包材用量 = (1000/包装数量)*用量倍数
  const useQty = ((1000 / (packQty || 0)) * (useQtyMultiple || 0)).toFixed(5);
  row.useQty = useQty;
}
