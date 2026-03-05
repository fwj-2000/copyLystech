import type { Ref } from 'vue';

import { useI18n } from '/@/hooks/web/useI18n';
import { getFactoryList } from '/@/api/customerSerivce/index';
import { h } from 'vue';
import { checkAllPriorityInTable, checkAllSameTableData } from '../config';
import { getShortMaterialCodeList } from '/@/api/structure/materialCode';

const { t } = useI18n();

export function getEditTableColumn(mainProcess?: Ref<number | string>) {
  return [
    {
      title: t('component.table.index'),
      type: 'seq',
      field: 'seq',
      minWidth: 50,
    },
    {
      title: '被替代料',
      field: 'replacedMaterial',
      i18nField: 'CommonCol.replacedMaterial',
      children: [
        {
          title: t('dict.PCCColumn.eightCode'),
          field: 'orgCode',
          width: 200,
          editRender: {
            name: 'ApiSelect',
            props: {
              api: getShortMaterialCodeList,
              resultField: 'data',
              labelField: 'shortMaterialCode',
              valueField: 'shortMaterialCode',
              apiSearch: {
                show: true,
                searchName: 'shortMaterialCode',
              },
              showSearch: true,
              immediate: true,
              alwaysLoad: true,
              filterOption: false,
              notFoundContent: null,
              onChange(_: any, option: any, params: any) {
                handleMaterialCodeChange('orgCode', option, params.row);
                checkAllSameTableData(params.$grid.getTableData().fullData);
              },
            },
          },
        },
        {
          title: t('dict.CommonCol.supplierShortName'),
          field: 'orgSupplier',
          formatter: ({ cellValue, row }) => row.orgSupplierName || cellValue || '',
          width: 200,
        },
        {
          title: t('dict.CheckMaintainColumn.materialTypeName'),
          field: 'orgType',
          formatter: ({ cellValue, row }) => row.orgTypeName || cellValue || '',
          width: 200,
        },
        {
          title: t('dict.MaterialDevelopApplyColumn.materialDesc'),
          field: 'orgDesc',
          width: 280,
        },
      ],
    },
    {
      title: '替代料',
      field: 'alternativeMaterials',
      // @ts-ignore
      i18nField: 'CommonCol.alternativeMaterials',
      children: [
        {
          title: t('dict.PCCColumn.eightCode'),
          field: 'altCode',
          width: 200,
          editRender: {
            name: 'ApiSelect',
            props: {
              api: getShortMaterialCodeList,
              resultField: 'data',
              labelField: 'shortMaterialCode',
              valueField: 'shortMaterialCode',
              apiSearch: {
                show: true,
                searchName: 'shortMaterialCode',
              },
              showSearch: true,
              immediate: true,
              alwaysLoad: true,
              filterOption: false,
              notFoundContent: null,
              onChange(_: any, option: any, params: any) {
                handleMaterialCodeChange('altCode', option, params.row);
                checkAllSameTableData(params.$grid.getTableData().fullData);
              },
            },
          },
        },
        {
          title: t('dict.CommonCol.supplierShortName'),
          field: 'altSupplier',
          formatter: ({ cellValue, row }) => row.altSupplierName || cellValue || '',
          width: 200,
        },
        {
          title: t('dict.CheckMaintainColumn.materialTypeName'),
          field: 'altType',
          formatter: ({ cellValue, row }) => row.altTypeName || cellValue || '',
          width: 200,
        },
        {
          title: t('dict.MaterialDevelopApplyColumn.materialDesc'),
          field: 'altDesc',
          width: 280,
        },
      ],
    },
    // 工厂
    {
      title: t('dict.CommonCol.factoryName'),
      field: 'factory',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'factoryName',
        props: {
          api: getFactoryList,
          beforeFetch: (params: any) => {
            return { ...params, mainProcess: mainProcess?.value || '' };
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          showSearch: true,
          immediate: true,
          alwaysLoad: true,
          filterOption: (input: string, option: { label: string }) => option.label.includes(input),
          notFoundContent: null,
          onChange: (_: any, _option: any, { $grid }) => {
            checkAllSameTableData($grid.getTableData().fullData);
          },
        },
      },
      width: 200,
    },
    {
      title: '优先级',
      field: 'priority',
      width: 200,
      editRender: {
        name: 'InputNumber',
        props: {
          placeholder: '',
          onChange(_: number, { $grid }) {
            checkAllPriorityInTable($grid.getTableData().fullData);
          },
        },
      },
    },
    {
      title: '备注',
      field: 'remark',
      width: 300,
      editRender: {
        name: 'Input',
        props: {
          placeholder: '',
        },
      },
    },
    {
      title: '校验信息',
      field: 'checkMessage',
      width: 200,
      i18nField: 'CommonCol.checkMessage',
      slots: {
        default: ({ row }) => {
          return h('span', { style: { color: '#ff4d4f' } }, row.checkMessage);
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

/**
 * 材料八码 发生改变的处理
 * @param codeField
 * @param row
 * @param option
 */
export function handleMaterialCodeChange(codeField: 'orgCode' | 'altCode', option: any, row: any) {
  const fieldMap =
    codeField === 'orgCode' ? { supplier: 'orgSupplier', type: 'orgType', desc: 'orgDesc' } : { supplier: 'altSupplier', type: 'altType', desc: 'altDesc' };
  row[fieldMap.supplier] = option?.supplierId || '';
  row[fieldMap.supplier + 'Name'] = option?.supplierName || '';
  row[fieldMap.type] = option?.materialClassId || '';
  row[fieldMap.type + 'Name'] = option?.materialClassName || '';
  row[fieldMap.desc] = option?.materialDesc || '';
}
