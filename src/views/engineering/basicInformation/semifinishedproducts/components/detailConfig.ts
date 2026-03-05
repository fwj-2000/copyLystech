import { useI18n } from '/@/hooks/web/useI18n';
import { getInnermaterialnumberPage } from '/@/api/business/quantitation';
import { productionTypeOptions } from '../config';
import { getSubclassCodeList } from '/@/api/purchase/materialBase';

import { useBaseStore } from '/@/store/modules/base';
import { getFactoryList } from '/@/api/customerSerivce';
const baseStore = useBaseStore();
const { t } = useI18n();

export function getEditTableColumn(mainProcess: any) {
  return [
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 240,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getInnermaterialnumberPage,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'insidePartNumber',
          },
          params: {
            pageSize: 20,
          },
          resultField: 'data.list',
          labelField: 'insidePartNumber',
          valueField: 'insidePartNumber',
          filterOption: false,
          onChange: (_, _data, params) => {
            handleInsidePartNumberChange(params);
          },
        },
      },
    },
    {
      title: '半成品料号',
      field: 'semiFinishedProductsPartNumber',
      width: 200,
      // formatter: ({ cellValue }) => cellValue || t('component.lydc.common.autoGenerate'),
      editRender: {
        name: 'Input',
        props: {
          placeholder: t('component.lydc.common.autoGenerate'),
          disabled: true,
        },
      },
    },
    {
      title: '旧版半成品料号',
      field: 'oldPartNumber',
      width: 240,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: '料件号',
      field: 'sku',
      width: 160,
      // formatter: ({ cellValue }) => cellValue || t('common.autoCarry'),
      editRender: {
        name: 'Input',
        props: {
          placeholder: t('common.autoCarry'),
          disabled: true,
        },
      },
    },
    {
      title: '版本',
      field: 'version',
      width: 160,
      editRender: {
        name: 'Input',
        props: {
          placeholder: '',
          onChange: (_, params) => {
            handleVersionOrConfigChange(params);
          },
        },
      },
    },
    {
      title: 'Config',
      field: 'config',
      width: 160,
      editRender: {
        name: 'Input',
        props: {
          placeholder: '',
          onChange: (_, params) => {
            handleVersionOrConfigChange(params);
          },
        },
      },
    },
    {
      title: '出货形态',
      field: 'shipPattern',
      formatter: 'ApiSelect',
      width: 160,
      editRender: {
        name: 'ApiSelect',
        props: {
          api: () => baseStore.getDictionaryData('DieCutShipPattern'),
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          allowClear: true,
          immediate: true,
          resultField: '',
        },
      },
    },
    {
      // 工厂
      title: '工厂',
      field: 'factoryList',
      width: 260,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'factoryNames',
        props: {
          api: getFactoryList,
          filterOption: false,
          allowClear: true,
          apiSearch: {
            show: true,
            searchName: 'factory',
          },
          beforeFetch: params => {
            const _p = params || {};
            _p.mainProcess = _p.mainProcessEnum || mainProcess.value;
            return _p;
          },
          rowParams: {
            mainProcessEnum: 'mainProcessEnum',
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          nameFormat: ['Code', '/', 'Name'],
          mode: 'multiple',
        },
      },
    },
    {
      title: '物料类型',
      field: 'materialTypeCode',
      width: 160,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'materialTypeName',
        props: {
          api: getSubclassCodeList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          // onChange(_: any, option: any, { row }) {
          //   row.materialTypeName = option?.label || '';
          // },
        },
      },
    },
    {
      title: '半成品描述',
      field: 'semiFinishedProductsDesc',
      width: 240,
      editRender: {
        name: 'Input',
        props: {
          options: '',
        },
      },
    },
    {
      title: '生产类型',
      field: 'productionType',
      width: 160,
      editRender: {
        name: 'ASelect',
        props: {
          options: productionTypeOptions,
          fieldNames: { label: 'fullName', value: 'enCode' },
        },
      },
    },
    {
      title: '备注',
      field: 'remarks',
      width: 240,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: t('common.action'),
      width: 100,
      slots: { default: 'action' },
      fixed: 'right',
      field: 'action',
    },
  ];
}

export const editRules = {
  insidePartNumber: [{ required: true, message: t('common.required') }],
  version: [{ required: true, message: t('common.required') }],
  config: [{ required: true, message: t('common.required') }],
  materialTypeCode: [{ required: true, message: t('common.required') }],
  semiFinishedProductsDesc: [{ required: true, message: t('common.required') }],
  productionType: [{ required: true, message: t('common.required') }],
  shipPattern: [{ required: true, message: t('common.required') }],
  factoryList: [{ required: true, message: t('common.required') }],
};

/**
 * 产品内部料号发生改变的处理，更改`料件号`
 * @param param0
 */
export function handleInsidePartNumberChange({ $grid, row }) {
  let sku = '';
  if (row.insidePartNumber) {
    sku = row.insidePartNumber.split('-')[1];
  }
  $grid.setRow(row, { sku });
}

/**
 * 版本和Config发生改变时，更改`半成品料号`
 * @param param0
 * @returns
 */
export function handleVersionOrConfigChange({ $grid, row }) {
  let semiFinishedProductsPartNumber = row.semiFinishedProductsPartNumber;
  if (!semiFinishedProductsPartNumber) {
    return false;
  }
  const semiFinishedProductsPartNumberList = semiFinishedProductsPartNumber.split('-');
  $grid.setRow(row, {
    semiFinishedProductsPartNumber: `${semiFinishedProductsPartNumberList[0]}-${semiFinishedProductsPartNumberList[1]}-${row.version}-${row.config}`,
  });
}
