import { useI18n } from '/@/hooks/web/useI18n';
// import { getFactoryList } from '/@/api/engineering/sample';
import { enableStatusOptions } from '../config';

const { t } = useI18n();

export function getEditTableColumn() {
  return [
    {
      title: t('component.table.index'),
      type: 'seq',
      field: 'seq',
      minWidth: 50,
    },
    {
      title: '优先级',
      field: 'priority',
      width: 200,
      editRender: {
        name: 'InputNumber',
        props: {
          placeholder: '',
        },
      },
    },
    {
      title: '是否启用',
      field: 'enable',
      width: 200,
      editRender: {
        name: 'ASelect',
        props: {
          placeholder: '',
          options: enableStatusOptions,
        },
      },
    },
    {
      title: '调整原因',
      field: 'updateRemark',
      width: 200,
      editRender: {
        name: 'Input',
        props: {
          placeholder: '',
        },
      },
    },
    {
      title: '被替代料',
      field: 'replacedMaterial',
      // @ts-ignore
      i18nField: 'CommonCol.replacedMaterial',
      children: [
        {
          title: t('dict.PCCColumn.eightCode'),
          field: 'orgCode',
          width: 200,
          // editRender: {
          //   name: 'Input',
          //   props: {
          //     placeholder: '',
          //   },
          // },
        },
        {
          title: t('dict.CommonCol.supplierShortName'),
          field: 'orgSupplierName',
          width: 200,
        },
        {
          title: t('dict.CheckMaintainColumn.materialTypeName'),
          field: 'orgTypeName',
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
          // editRender: {
          //   name: 'Input',
          //   props: {
          //     placeholder: '',
          //   },
          // },
        },
        {
          title: t('dict.CommonCol.supplierShortName'),
          field: 'altSupplierName',
          width: 200,
        },
        {
          title: t('dict.CheckMaintainColumn.materialTypeName'),
          field: 'altTypeName',
          width: 200,
        },
        {
          title: t('dict.MaterialDevelopApplyColumn.materialDesc'),
          field: 'altDesc',
          width: 280,
        },
      ],
    },
    {
      title: '工厂',
      field: 'factory',
      // editRender: {
      //   name: 'ApiSelect',
      //   props: {
      //     api: getFactoryList,
      //     resultField: 'data',
      //     labelField: 'Name',
      //     valueField: 'Code',
      //     showSearch: true,
      //     immediate: true,
      //     alwaysLoad: true,
      //     filterOption: (input: string, option: { label: string }) => option.label.includes(input),
      //     notFoundContent: null,
      //   },
      // },
      width: 200,
    },
  ];
}
