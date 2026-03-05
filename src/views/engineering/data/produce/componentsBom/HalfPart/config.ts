import { useI18n } from '/@/hooks/web/useI18n';
import { isNullOrUnDef } from '/@/utils/is';
import { getSemiFinishedProductsList } from '/@/api/engineering/semifinishedproducts';

const { t } = useI18n();

export function getHalfPartColumn(props, emit): any {
  return [
    {
      title: '半成品料号',
      field: 'semiFinishedProductsPart',
      minWidth: 120,
      editRender: {
        name: 'ApiSelect',
        cacheField: 'semiFinishedProductsPart',
        dblClickHead: false,
        props: {
          api: getSemiFinishedProductsList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'semiFinishedProductsPartNumber',
          },
          beforeFetch: params => {
            return { ...params, factory: props?.config?.factory, mainProcess: props?.config?.mainProcess };
          },
          resultField: 'data',
          labelField: 'semiFinishedProductsPartNumber',
          valueField: 'semiFinishedProductsPartNumber',
          filterOption: false,
          onChange: (_, data, params) => {
            const { row } = params;
            row.productionTypeName = data.productionTypeName || '待维护';
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
      title: '备料信息',
      field: 'materialPreparation',
      width: 100,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: '用量倍数',
      field: 'materialDosage',
      width: 100,
      editRender: {
        name: 'InputNumber',
        props: {
          onChange: (_, { row }) => {
            console.log('🚀 ~ onChange ~ row: ', row);
            emit('calcHalfPartUseQty', row);
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
          placeholder: t('common.autoCarry'),
          precision: 5,
          step: 0.00001,
          dynamicDisabled: row => {
            // unit为PCS时，禁用
            return row.unit === 'PCS';
          },
          onChange: (qty, { row }) => {
            const { origin } = row;
            origin.qty = isNaN(qty) ? 0 : qty;
          },
        },
      },
    },
    {
      title: '单位',
      field: 'unit',
      width: 100,
      editRender: {
        name: 'Input',
        props: {
          disabled: true,
          defaultValue: 'PCS',
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
          placeholder: t('dict.CommonCol.remark'),
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

export function getHalfPartRules() {
  return {
    semiFinishedProductsPart: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.semiFinishedProductsPart = cell;
        },
      },
    ],
    materialPreparation: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.materialPreparation = cell;
        },
      },
    ],
    materialDosage: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.materialDosage = cell;
        },
      },
    ],
    remarks: [
      {
        validator: ({ col, cell, row }) => {
          if (isNullOrUnDef(cell) || cell === '') return;
          row.remarks = cell;
        },
      },
    ],
  };
}
