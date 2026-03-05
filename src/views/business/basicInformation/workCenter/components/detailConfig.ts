/*
 * @Author: wenzhenjin
 * @Date: 2025-05-16 14:48:15
 * @LastEditors: wenzhenjin
 * @LastEditTime: 2025-05-21 08:53:16
 * @FilePath: \lydc.server.web\src\views\business\basicInformation\workCenter\components\detailConfig.ts
 */
import { useI18n } from '/@/hooks/web/useI18n';
import { getQuantitationApplyDetailByMaterial } from '/@/api/business/quantitation';
// import { productionTypeOptions } from '../config';
import { getSubclassCodeList } from '/@/api/purchase/materialBase';
import { getFactoryList } from '/@/api/business/shippingspace';
import { getSapFactoryList } from '/@/api/purchase/supplierInformation';

const { t } = useI18n();

export const DETAIL_PAGE_TYPE_ENUM = {
  新增: '1',
  升版: '2',
  修改: '3',
};

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
      title: '工厂',
      field: 'factory',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getFactoryList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          rowParams: {},
          params: {
            pageSize: 20,
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          filterOption: false,
          nameFormat: ['Name', '(', 'Code', ')'],
          notFoundContent: null,
        },
      },
    },
    {
      title: 'SAP工厂代码',
      field: 'sapCode',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getSapFactoryList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'factoryCode',
          },
          rowParams: {
            factoryCode: 'factory',
          },
          resultField: 'data',
          labelField: 'name',
          valueField: 'code',
          filterOption: false,
          nameFormat: ['name', '(', 'code', ')'],
          notFoundContent: null,
        },
      },
    },
    {
      title: '工作中心代码',
      field: 'code',
      editRender: {
        name: 'Input',
        props: {
          placeholder: '请输入工作中心代码',
        },
      },
    },
    {
      title: '工作中心名称',
      field: 'name',
      editRender: {
        name: 'Input',
        props: {
          placeholder: '请输入工作中心名称',
        },
      },
    },
    {
      title: '备注',
      field: 'remark',
      editRender: {
        name: 'Input',
        props: {
          placeholder: '请输入备注',
        },
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
