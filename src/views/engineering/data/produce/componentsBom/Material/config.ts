import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';
import { getUnitListByKeyword } from '/@/api/finance/materialPrice';
import { getMaterialSearchByShortCode } from '/@/api/engineering/pcc';
import { isFunction, isNullOrUnDef } from '/@/utils/is';
import { isEmpty } from '/@/utils/is';
import { handleOriginPartNumberChange, getDebouncedFunction } from './autoSelectInsidePartNumber';

const baseStore = useBaseStore();
const { t } = useI18n();

export function resetPartNumber(row) {
  row.originPartNumber = '';
  row.materialCode = '';
}

export function getMaterialColumn(emit, props): any {
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
      field: 'shortMaterialCode',
      width: 180,
      editRender: {
        name: 'Input',
        props: {
          onChange: (e, { row, isPaster }) => {
            row.factory = props?.currentData?.factory;
            const debounceSelectInsidePartNumber = getDebouncedFunction(row, 350);
            debounceSelectInsidePartNumber({ row });
          },
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
          onChange: (e, { row, isPaster }) => {
            row.factory = props?.currentData?.factory;
            const debounceSelectInsidePartNumber = getDebouncedFunction(row, 350);
            debounceSelectInsidePartNumber({ row });
          },
        },
      },
    },
    {
      title: '查询结果',
      field: 'materialCode',
      i18nField: 'originPartNumber',
      width: 210,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'materialCode',
        props: {
          // 必须得两个值一起再请求
          api: async params => {
            const { shortMaterialCode, materialWidth } = params;
            if (shortMaterialCode.length != 8) return null;
            // if (!(materialWidth && shortMaterialCode)) return null;
            if (isNullOrUnDef(materialWidth) || isNullOrUnDef(shortMaterialCode)) return null;
            params.factory = props.currentData?.factory;
            return getMaterialSearchByShortCode(params);
          },

          afterFetch: (res: any, { row }) => {
            if (!res) {
              return res;
            }
            if (isEmpty(res?.data)) {
              resetPartNumber(row);
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
          rowParams: {
            shortMaterialCode: 'shortMaterialCode',
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
          // preciseParam: 'materialWidth',
          resultField: 'data',
          labelField: 'materialCode',
          valueField: 'materialCode',
          nameFormat: ['materialCode', '', 'desc'],
          immediate: false,
          filterOption: false,
          onChange: handleOriginPartNumberChange,
        },
      },
    },
    {
      title: '材料料号',
      field: 'originPartNumber',
      i18nField: 'partNumber',
      width: 160,
    },
    {
      title: '利用率',
      field: 'materialUtilization',
      width: 100,
      titlePrefix: {
        content: '((整支宽度/使用宽度)向下取整后 * 使用宽度)/整支宽度*100%',
      },
    },
    {
      title: '使用工序',
      field: 'processNumber',
      width: 130,
      editRender: {},
      slots: { edit: 'processCode', default: 'processCode_default' },
    },
    {
      title: '出货材料',
      field: 'shippingMaterials',
      formatter: 'ApiSelect',
      width: 100,
      editRender: {
        name: 'ApiSelect',
        cacheField: 'shippingMaterialsName',
        props: {
          api: () => baseStore.getDictionaryData('PCC.ShippingMaterial', true),
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
          onChange: (_, data, params) => {
            const { row } = params;
            if (data && _) {
              row.shippingMaterialsName = data.fullName || data.label;
            } else {
              row.shippingMaterialsName = '';
            }
          },
        },
      },
    },
    {
      title: '备料信息',
      field: 'preparationMaterials',
      width: 100,
      editRender: {
        name: 'Input',
        props: {
          placeholder: t('dict.PCCColumn.prepareMaterialInfo'),
        },
      },
    },
    {
      title: '用量倍数',
      field: 'materialDosage',
      width: 100,
      editRender: {
        name: 'InputNumber',
        props: {
          placeholder: t('common.autoCarry'),
          onChange: (materialDosage, { row }) => emit('calcSingleRowUseQty', row),
        },
      },
    },
    {
      title: '用量/KPCS',
      field: 'qty',
      width: 130,
      editRender: {
        name: 'InputNumber',
        props: {
          placeholder: t('common.autoCarry'),
          precision: 5,
          step: 0.00001,
          dynamicDisabled: row => {
            // unit为PCS或M时，禁用
            if (row.purchaseUnit === 'PCS' || row.purchaseUnit === 'M') {
              return true;
            }
            return false;
          },
          // onChange: (qty, { row }) => {
          //   const { origin } = row;
          //   origin.qty = isNaN(qty) ? 0 : qty;
          // },
        },
      },
    },
    {
      title: '单位',
      field: 'purchaseUnit',
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
        },
      },
    },
    {
      title: '描述',
      field: 'materialDesc',
      width: 220,
    },
    {
      title: '颜色',
      field: 'materialColor',
      width: 100,
    },
    {
      title: '原材整支长度(M)',
      field: 'materialLength',
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
      title: '原材整支宽度(MM)',
      field: 'materialWidth',
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
      title: '备注',
      field: 'remarks',
      width: 200,
      editRender: {
        name: 'Input',
        props: {
          placeholder: t('dict.AltMaterialColumn.remark'),
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
    shortMaterialCode: [
      {
        validator: ({ cell, row, col }) => {
          if (isNullOrUnDef(cell)) {
            return new Error('请输入八码');
          }
          if (cell <= 0) {
            return new Error('请选择正确的八码');
          }
          row.shortMaterialCode = cell;
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
    materialCode: [
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
    originPartNumber: [
      {
        validator: ({ col, cell, row }) => {
          console.log('🚀 ~ validator ~ row: ', row);
          const materialList = materialGetlist();
          console.log('🚀 ~ validator ~ materialList: ', materialList);
        },
      },
    ],
    materialUtilization: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.materialUtilization = cell;
        },
      },
    ],
    processNumber: [
      {
        validator: ({ col, cell, row }) => {
          row.processNumber = cell;
          row.processName = `${Number(cell)}、${processList[Number(cell) - 1]['processNumber']}`;
        },
      },
    ],
    shippingMaterials: [
      {
        validator: async ({ col, cell, row }) => {
          const options = await baseStore.getDictionaryData('PCC.ShippingMaterial');
          const target = options.find(o => o.fullName == cell);
          row.shippingMaterials = target?.enCode;
          row.shippingMaterialsName = target?.fullName;
        },
      },
    ],
    preparationMaterials: [
      {
        validator: ({ col, cell, row }) => {
          console.log('🚀 ~ preparationMaterials validator ~ cell: ', cell);
          if (isNullOrUnDef(cell) || cell === '') return;
          row.preparationMaterials = cell;
        },
      },
    ],
    qty: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.qty = cell;
        },
      },
    ],
    purchaseUnit: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.purchaseUnit = cell;
        },
      },
    ],
    materialLength: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.materialLength = cell;
        },
      },
    ],
    materialWidth: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.materialWidth = cell;
        },
      },
    ],
  };
}

export const rowData = {
  stepDistanceNumber: 1,
  shortMaterialCode: '',
  width: '',
  originPartNumber: '',
  materialCode: null,
  processNumber: null,
  shippingMaterials: null,
  materialDesc: '',
  materialDosage: 1,
  materialColor: '',
  qty: '',
  purchaseUnit: 'M',
  materialLength: '',
  materialWidth: '',
  remarks: '',
};
