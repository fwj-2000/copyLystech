import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';
import { getUnitListByKeyword } from '/@/api/finance/materialPrice';
import { getMaterialSearchByShortCode } from '/@/api/engineering/pcc';
import { isExist, isFunction, isNullOrUnDef, isEmpty } from '/@/utils/is';
import { get } from 'lodash-es';
import { getDebouncedFunction } from '/@/views/engineering/PCCBeta/components/PccMaterial/autoSelectInsidePartNumber';
import handleOriginPartNumberChange from '/@/views/engineering/PCCBeta/components/PccMaterial/handleOriginPartNumberChange';

const baseStore = useBaseStore();

const { t } = useI18n();
export function getColumn() {
  return [
    {
      title: '步距组号',
      field: 'stepDistanceNumber',
      width: 95,
      editRender: {},
      slots: { edit: 'stepDistanceNumber', default: 'stepDistanceNumber_default' },
    },
  ];
}

// PCC材料
export function getPccMaterialColumn(emit, props): any {
  // 如果是编辑，那么新增的时候需要将某些ApiSelect设置默认
  return [
    {
      title: '步距组号',
      field: 'stepDistanceNumber',
      width: 95,
      editRender: {},
      slots: { edit: 'stepDistanceNumber', default: 'stepDistanceNumber_default' },
    },
    {
      title: '材料八码',
      field: 'eightCode',
      width: 120,
      editRender: {
        name: 'Input',
        props: {
          onChange: async (e, { row, isPaster }) => {
            console.log('🚀 ~ e: ', e, isPaster);
            const debounceSelectInsidePartNumber = getDebouncedFunction(row, 350);
            debounceSelectInsidePartNumber({ row });
          },
          // onKeydown: (e, { row }) => {
          //   if (e.key === 'Backspace') {
          //     row.eightCode = '';
          //     row.originPartNumber = '';
          //     row.originPartNumberName = '';
          //     row.partNumber = '';
          //   }
          // },
        },
      },
    },
    {
      title: '宽度(MM)',
      field: 'width',
      width: 120,
      editRender: {
        name: 'InputNumber',
        props: {
          placeholder: t('dict.PCCColumn.width'),
          onChange: async (width, { row }) => {
            const values = await props.getValues();
            row.factory = values?.prodInfo?.factory;
            const debounceSelectInsidePartNumber = getDebouncedFunction(row, 350);
            debounceSelectInsidePartNumber({ row });
            const { wholeWidth } = row;
            if (isExist(width) && isExist(wholeWidth)) {
              if (width === 0) {
                row.utilizationRate = '100%';
                return;
              }
              const ret = (Math.floor(wholeWidth / width) / (wholeWidth / width)) * 100;
              if (Number.isNaN(ret)) return '/';
              row.utilizationRate = ret.toFixed(2) + '%';
            }
          },
        },
      },
    },
    {
      title: '查询结果',
      field: 'originPartNumber',
      width: 210,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          // 必须得两个值一起再请求
          api: async params => {
            const { shortMaterialCode, materialWidth } = params;
            if (shortMaterialCode.length != 8) return null;
            if (isNullOrUnDef(materialWidth)) return null;
            if (!shortMaterialCode) return null;
            const values = await props.getValues();
            const factory = values?.prodInfo?.factory;
            if (!factory) return null;
            params.factory = factory;
            return getMaterialSearchByShortCode(params);
          },
          afterFetch: (res: any, { row }) => {
            console.log('🚀 ~ afterFetch ~ res: ', res);
            if (!res) {
              return res;
            }
            if (isEmpty(res?.data)) {
              row.originPartNumber = '';
              row.originPartNumberName = '';
              row.partNumber = '';
              return null;
            }
            const list = Array.isArray(res?.data) ? res?.data : [];
            res.data = list.map((item: any) => {
              return {
                ...item,
                // item.altMaterial 的值为number类型的0和1，1表示为替代料，0表示为非替代料
                desc: item.altMaterial ? `(${t('dict.CommonCol.alternativeMaterials')} ${t('dict.AltMaterialColumn.priority')}:${item.priority || ''})` : '',
              };
            });
          },
          placeholder: t('dict.PCCColumn.originPartNumber'),
          rowParams: {
            shortMaterialCode: 'eightCode',
            materialWidth: 'width',
          },
          params: {
            toleranceNegative: 0,
          },
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          // singleDefaultFirst: true,
          // preciseParam: 'materialWidth',
          resultField: 'data',
          labelField: 'materialCode',
          valueField: 'materialCode',
          nameFormat: ['materialCode', '', 'desc'],
          immediate: true,
          filterOption: false,
          onChange: handleOriginPartNumberChange,
        },
      },
    },
    {
      title: '材料料号',
      field: 'partNumber',
      width: 160,
      // formatter: 'ApiSelect',
      // editRender: {
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
      //     immediate: true,
      //     labelField: 'Name',
      //     valueField: 'Code',
      //     placeholder: '',
      //   },
      // },
    },
    {
      title: '利用率',
      field: 'utilizationRate',
      width: 100,
      titlePrefix: {
        content: '((整支宽度/使用宽度)向下取整后 * 使用宽度)/整支宽度*100%',
      },
      // editRender: {
      // 	name: 'InputNumber',
      // 	props: {
      // 		rate: true,
      // 		placeholder: t('common.autoCarry'),
      // 	},
      // },
    },
    {
      title: '使用工序',
      field: 'processCode',
      width: 130,
      editRender: {},
      slots: { edit: 'processCode', default: 'processCode_default' },
    },
    {
      title: '出货材料',
      field: 'shippingMaterial',
      formatter: 'ApiSelect',
      width: 100,
      editRender: {
        name: 'ApiSelect',
        cacheField: 'shippingMaterialName',
        props: {
          api: () => baseStore.getDictionaryData('PCC.ShippingMaterial', true),
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
          onChange: (_, data, params) => {
            console.log('🚀 ~ onChange ~ data: ', data);
            const { row } = params;
            if (data && _) {
              row.shippingMaterialName = data.fullName || data.label;
            } else {
              row.shippingMaterialName = '';
            }
          },
        },
      },
    },
    {
      title: '备料信息',
      field: 'prepareMaterialInfo',
      width: 100,
      editRender: {
        name: 'Input',
        props: {
          placeholder: t('dict.PCCColumn.prepareMaterialInfo'),
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
      title: '用量倍数',
      field: 'useQtyMultiple',
      width: 100,
      editRender: {
        name: 'InputNumber',
        props: {
          placeholder: t('common.autoCarry'),
          // precision: 10,
          // step: 0.00000000001,
          onChange: (_, { row }) => emit('calcSingleRowUseQty', row),
        },
      },
    },
    {
      title: '用量/KPCS',
      field: 'useQty',
      width: 130,
      editRender: {
        name: 'InputNumber',
        props: {
          placeholder: t('common.autoCarry'),
          precision: 5,
          step: 0.00001,
          dynamicDisabled: row => {
            // unit为PCS或M时，禁用
            if (row.unit === 'PCS' || row.unit === 'M') {
              return true;
            }
            return false;
          },
        },
      },
    },
    {
      title: '零损耗用量/KPCS',
      field: 'zeroLossUseQty',
      width: 130,
    },
    {
      title: '单位',
      field: 'unit',
      width: 100,
      editRender: {
        name: 'ApiSelect',
        props: {
          placeholder: '',
          api: getUnitListByKeyword,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          filterOption: false,
          notFoundContent: null,
          immediate: false,
          labelField: 'Name',
          valueField: 'Code',
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
      title: '描述',
      field: 'description',
      width: 220,
    },
    {
      title: '颜色',
      field: 'color',
      width: 100,
    },
    {
      title: '原材整支宽度(MM)',
      field: 'wholeWidth',
      width: 160,
      editRender: {
        name: 'InputNumber',
        props: {
          placeholder: t('common.autoCarry'),
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
      title: '原材整支长度(M)',
      field: 'wholeLength',
      width: 160,
      editRender: {
        name: 'InputNumber',
        props: {
          placeholder: t('common.autoCarry'),
          onChange: () => {
            emit('calcDowntimeOneHour');
          },
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
      title: '总厚度(MM)',
      field: 'totalThickness',
      width: 160,
      // editRender: {
      //   name: 'InputNumber',
      //   props: {
      //     placeholder: t('common.autoCarry'),
      //   },
      // },
    },
    {
      title: '厚度公差(MM)',
      field: 'tolerance',
      width: 160,
      // editRender: {
      //   name: 'InputNumber',
      //   props: {
      //     placeholder: t('common.autoCarry'),
      //   },
      // },
    },
    {
      title: '机台运行10H所需米数(M)',
      field: 'metersTenHour',
      width: 200,
      editRender: {
        name: 'InputNumber',
        props: {
          placeholder: t('common.autoCarry'),
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
      title: '备注',
      field: 'remark',
      width: 200,
      editRender: {
        name: 'Input',
        props: {
          placeholder: t('dict.AltMaterialColumn.remark'),
        },
      },
    },
    {
      title: '分条组',
      field: 'splittingGroup',
      width: 200,
      editRender: {
        name: 'Input',
        props: {
          placeholder: t('dict.PCCColumn.splittingGroup'),
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

export function getRules({ materialGetStepList, materialGetlist }, processList) {
  return {
    stepDistanceNumber: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell)) {
            return new Error('请选择步距组号');
          }
          const stepDistanceList = materialGetStepList();
          const target = stepDistanceList.findIndex((o, index) => index == cell);

          if (target === -1) {
            return new Error('请选择正确的步距组号');
          }
          row.stepDistanceNumber = target;
        },
      },
    ],
    eightCode: [
      {
        validator: ({ cell, row, col }) => {
          if (isNullOrUnDef(cell)) {
            return new Error('请输入八码');
          }
          if (cell <= 0) {
            return new Error('请选择正确的八码');
          }
          row.eightCode = cell;
          const {
            editRender: {
              props: { onChange },
            },
          } = col;

          if (isFunction(onChange)) {
            onChange(cell, { row, isPaster: true });
          }
          return true;
        },
      },
    ],
    width: [
      {
        validator: ({ cell, row, col }) => {
          if (isNullOrUnDef(cell)) {
            return new Error('请输入宽度');
          }
          if (cell <= 0) {
            return new Error('请输入正确的宽度');
          }
          row.width = cell;
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(cell, { row, isPaster: true });
          }
          return true;
        },
      },
    ],
    originPartNumber: [
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
    partNumber: [
      {
        validator: ({ col, cell, row }) => {
          console.log('🚀 ~ validator ~ row: ', row);
          const materialList = materialGetlist();
          console.log('🚀 ~ validator ~ materialList: ', materialList);
        },
      },
    ],
    utilizationRate: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.utilizationRate = cell;
        },
      },
    ],
    processCode: [
      {
        validator: ({ col, cell, row }) => {
          console.log('🚀 ~ getRules ~ cell:', cell);
          console.log(Number(cell) - 1);
          console.log('🚀 ~ validator ~ processList: ', processList);
          row.processCode = cell;
          // --------------(cell)}、${processList[Number(cell) - 1]['processCode']}`;
          const processTarget = processList[Number(cell) - 1];
          if (processTarget) {
            row.processName = `${Number(cell)}、${processList[Number(cell) - 1]['processCode']}`;
          } else {
            row.processName = '';
          }
        },
      },
    ],
    shippingMaterial: [
      {
        validator: async ({ col, cell, row }) => {
          const options = await baseStore.getDictionaryData('PCC.ShippingMaterial');
          const target = options.find(o => o.fullName == cell);
          row.shippingMaterial = target?.enCode;
          row.shippingMaterialName = target?.fullName;
        },
      },
    ],
    prepareMaterialInfo: [
      {
        validator: ({ col, cell, row }) => {
          console.log('🚀 ~ prepareMaterialInfo validator ~ cell: ', cell);
          if (isNullOrUnDef(cell) || cell === '') return;
          row.prepareMaterialInfo = cell;
        },
      },
    ],
    useQtyMultiple: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.useQtyMultiple = cell;
        },
      },
    ],
    useQty: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.useQty = cell;
        },
      },
    ],
    unit: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.unit = cell;
        },
      },
    ],
    description: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.description = cell;
        },
      },
    ],
    color: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.color = cell;
        },
      },
    ],
    wholeLength: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.wholeLength = cell;
        },
      },
    ],
    wholeWidth: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.wholeWidth = cell;
        },
      },
    ],
    metersTenHour: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.metersTenHour = cell;
        },
      },
    ],
    remark: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.remark = cell;
        },
      },
    ],
    splittingGroup: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.splittingGroup = cell;
        },
      },
    ],
  };
}

// 根据apiselect 传入 props查找label
function genFormatVal(target, nameFormat: any[], fieldNames = {}) {
  let label = '';
  if (nameFormat && nameFormat.length > 0) {
    nameFormat.forEach((item, index) => {
      if (index % 2 === 0) {
        label += get(target, [item]) || '';
      } else {
        label += item;
      }
    });
  } else {
    label = get(target, fieldNames.label || 'name');
  }

  return label;
}
