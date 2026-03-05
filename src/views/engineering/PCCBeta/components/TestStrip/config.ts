import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';
import { getMaterialSearchByShortCode } from '/@/api/engineering/pcc';
import { isFunction, isNullOrUnDef } from '/@/utils/is';
import selectInsidePartNumber from '/@/views/engineering/PCCBeta/components/PccMaterial/autoSelectInsidePartNumber';
import handleOriginPartNumberChange from '/@/views/engineering/PCCBeta/components/PccMaterial/handleOriginPartNumberChange';

const baseStore = useBaseStore();
const { t } = useI18n();

export function getPccTestStripColumn() {
  return [
    {
      title: '材料八码',
      field: 'eightCode',
      width: 120,
      editRender: {
        name: 'Input',
        dblClickHead: false,
        props: {
          onChange: (_, { row }) => {
            selectInsidePartNumber({ row }, ['eightCode']);
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
          onChange: (_, { row }) => {
            selectInsidePartNumber({ row }, ['eightCode']);
          },
        },
      },
    },
    {
      title: '长度(MM)',
      field: 'length',
      width: 120,
      editRender: {
        name: 'InputNumber',
        props: {},
      },
    },
    {
      title: '查询结果',
      field: 'originPartNumber',
      width: 210,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        dblClickHead: false,
        props: {
          api: async params => {
            const { shortMaterialCode, materialWidth } = params;
            if (shortMaterialCode.length != 8) return null;
            if (!(materialWidth && shortMaterialCode)) return null;
            params.altMaterial = 1;
            return getMaterialSearchByShortCode(params);
          },
          afterFetch: (res: any) => {
            if (!res) {
              return res;
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
          singleDefaultFirst: true,
          // preciseParam: 'materialWidth',
          resultField: 'data',
          labelField: 'materialCode',
          valueField: 'materialCode',
          immediate: true,
          filterOption: false,
          nameFormat: ['materialCode', '', 'desc'],
          // onChange: (materialCode, data, params) => {
          //   if (!materialCode || !data) return;
          //   const { row } = params;
          //   // 选中查询结果
          //   const [_, eightCode, calcWidth] = materialCode?.split('-');
          //   const { materialDesc, materialName, materialLength, materialWidth, materialColor, totalThickness, originalModelNumber } = data;
          //   const partNumber = buildPartNumber(calcWidth, row.width, eightCode, materialCode);
          //   Object.assign(row, {
          //     description: materialDesc || materialName || null,
          //     wholeLength: materialLength,
          //     wholeWidth: materialWidth,
          //     color: materialColor,
          //     eightCode,
          //     partNumber,
          //     totalThickness,
          //     originalModelNumber,
          //   });
          // },
          onChange: handleOriginPartNumberChange,
        },
      },
    },
    {
      title: '材料料号',
      field: 'partNumber',
      width: 160,
    },
    {
      title: '数量(条)',
      field: 'qty',
      width: 120,
      editRender: {
        name: 'InputNumber',
        props: {},
      },
    },
    {
      title: '用量(M/工单)',
      field: 'useQty',
      width: 120,
      editRender: {
        name: 'InputNumber',
        props: {},
      },
    },
    {
      title: '用途',
      field: 'testOption',
      formatter: 'ApiSelect',
      width: 180,
      editRender: {
        name: 'ApiSelect',
        cacheField: 'testOptionName',
        props: {
          api: () => baseStore.getDictionaryData('TestOption'),
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: '',
          },
          filterOption: false,
          notFoundContent: null,
        },
      },
    },
    {
      title: '图纸标准',
      field: 'drawingStandards',
      width: 120,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    {
      title: 'TDS标准',
      field: 'tdsStandards',
      width: 120,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    {
      title: '材料有效期(月)',
      field: 'materialEffectiveDate',
      width: 160,
      editRender: {
        name: 'InputNumber',
        props: {
          min: 1,
        },
      },
    },
    {
      title: '材料描述',
      field: 'description',
      i18nField: 'partNumberDescription',
      width: 120,
      // editRender: {
      //   name: 'Input',
      //   props: {},
      // },
    },
    {
      title: '原厂商型号',
      field: 'originalModelNumber',
      width: 120,
    },
    {
      title: '颜色',
      field: 'color',
      width: 120,
    },
    {
      title: '总厚度(MM)',
      field: 'totalThickness',
      width: 120,
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

export function getRules(props) {
  return {
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
          // row.originPartNumber = null;
          // row.originPartNumberName = null;
          // if (isNullOrUnDef(cell)) {
          //   return new Error('请选择正确的料号');
          // }
          // const {
          //   editRender: {
          //     props: { valueField, onChange },
          //   },
          // } = col;
          // if (!data) {
          //   return new Error('请选择正确的料号');
          // }
          // if (isFunction(onChange)) {
          //   onChange(data[valueField], data, { row });
          // }
        },
      },
    ],
    testOption: [
      {
        validator: async ({ col, cell, row }, data) => {
          console.log('🚀 ~ validator ~ cell: ', cell);
          if (isNullOrUnDef(cell)) {
            return new Error('请选择正确的用途');
          }

          const testOptions = await baseStore.getDictionaryData('TestOption');
          const testOption = testOptions.find(item => item.fullName === cell);
          console.log('🚀 ~ validator ~ testOption: ', testOption);
          row.testOption = testOption?.enCode;
          row.testOptionName = testOption?.fullName;
        },
      },
    ],
  };
}

// 生成内部料号
function buildPartNumber(calcWidth: string, width: number, eightCode: string, materialCode: string): string {
  const retNum = Number(calcWidth) - width;

  let partNumber = '';
  if (retNum > 3) {
    // partNumber = `600-${eightCode}-${(width || 9999)?.toString()?.padStart(4, 0)}`;
    partNumber = `600-${eightCode}-${(width || calcWidth || '0000')?.toString()?.padStart(4, 0)}`;
  } else {
    // partNumber = materialCode;
    if (!materialCode) return;
    const [startCode, eightCode, calcWidth] = materialCode?.split('-');
    partNumber = `${startCode}-${eightCode}-${(width || calcWidth || '0000')?.toString()?.padStart(4, 0)}`;
  }
  return partNumber;
}
