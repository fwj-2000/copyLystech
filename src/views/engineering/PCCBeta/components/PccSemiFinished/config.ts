import { useI18n } from '/@/hooks/web/useI18n';
import { isEmpty } from '/@/utils/is';
import { getUnitListByKeyword } from '/@/api/finance/materialPrice';
import { getSemiFinishedProductsList } from '/@/api/engineering/semifinishedproducts';

const { t } = useI18n();

// PCC材料
export function getSemiFinishedColumn(props, emit): any {
  // 如果是编辑，那么新增的时候需要将某些ApiSelect设置默认
  return [
    {
      title: '半成品料号',
      field: 'semiFinished',
      minWidth: 210,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'semiFinished',
        dblClickHead: false,
        props: {
          // 必须得两个值一起再请求
          // api: async params => {
          //   const { shortMaterialCode, materialWidth } = params;
          //   if (shortMaterialCode.length != 8) return null;
          //   if (!(materialWidth && shortMaterialCode)) return null;
          //   return (params);
          // },
          api: getSemiFinishedProductsList,
          beforeFetch: async params => {
            const values = await props.getValues();
            params.factory = values?.prodInfo?.factory;
            const bomType = values?.prodInfo?.bomType || '';
            if (bomType === 4) {
              params.bomType = bomType;
            }
            return params;
          },
          afterFetch: (res: any, { row }) => {
            if (!res) {
              return res;
            }
            if (isEmpty(res?.data)) {
              row.semiFinished = '';
              row.semiFinishedName = '';
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
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'semiFinishedProductsPartNumber',
          },
          resultField: 'data',
          labelField: 'semiFinishedProductsPartNumber',
          valueField: 'semiFinishedProductsPartNumber',
          filterOption: false,
          immediate: true,
          onChange: (_, data, params) => {
            const { row } = params;
            row.productionTypeName = data.productionTypeName || '待维护';
            row.isBom = data.isBom;
            row.semiFinishedName = data.semiFinishedProductsPartNumber || data.value;
            row.semiFinished = data.semiFinishedProductsPartNumber || data.value;
            console.log(row);
          },
        },
      },
    },
    {
      title: '生产类型',
      field: 'productionTypeName',
      width: 120,
    },
    {
      title: '有无BOM',
      field: 'isBom',
      minWidth: 160,
      formatter: ({ cellValue }) => {
        console.log('🚀 ~ formatter ~ cellValue: ', cellValue);
        return cellValue ? '有' : '无';
      },
    },
    {
      title: '备料信息',
      field: 'preparation',
      width: 100,
      editRender: {
        name: 'Input',
        props: {},
      },
    },
    {
      title: '用量倍数',
      field: 'materialDosage',
      width: 100,
      editRender: {
        name: 'InputNumber',
        props: {
          precision: 3,
          step: 0.001,
          onChange: (materialDosage, { row, $grid }) => {
            // onChange: (...rest) => {
            //   console.log(rest, 'restrestrestrestrest');
            emit('calcSemiFinishedUseQty', row, $grid);
          },
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
          precision: 5,
          step: 0.00001,
          dynamicDisabled: row => {
            // unit为PCS或M时，禁用
            if (row.unit === 'PCS' || row.unit === 'M') {
              return true;
            }
            return false;
          },
          onChange: (useQty, { row }) => {
            const { origin } = row;
            origin.useQty = Number.isNaN(useQty) ? 0 : useQty;
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
