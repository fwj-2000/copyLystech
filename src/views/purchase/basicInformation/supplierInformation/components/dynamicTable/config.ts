import { h } from 'vue';
import { getlistbycheckprojectname } from '/@/api/productionDeal/ipqc';
import { BasicColumn } from '/@/components/Table';
import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
const baseStore = useBaseStore();
type supplierType = 'Inside' | 'External';
export const ADDRESS_MODULE_TEMPLATE = {
  provinceCityIds: null,
  detailAddress: null,
  // provinceCityName: null,
};
export const CONCAT_MODULE_TEMPLATE = {
  position: null,
  name: null,
  contactInfo: null,
};

export const address_columns: any[] = [
  {
    title: t('component.lydc.areaSelect.modalTitle'),
    field: 'provinceCityIds',
    editRender: {
      cacheField: 'provinceCityName',
    },
    slots: { edit: 'provinceCityIds', default: 'provinceCityIds_default' },
  },
  {
    title: t('dict.Common.street'),
    field: 'detailAddress',
    editRender: {
      name: 'Input',
      props: {
        placeholder: t('dict.Common.street'),
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

export const concat_column = [
  {
    title: t('component.lydc.areaSelect.modalTitle'),
    field: 'provinceCityIds',
    editRender: {
      cacheField: 'provinceCityName',
    },
    slots: { edit: 'provinceCityIds', default: 'provinceCityIds_default' },
  },
  {
    title: t('dict.Common.street'),
    field: 'detailAddress',
    editRender: {
      name: 'Input',
      props: {
        placeholder: t('dict.Common.street'),
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

export function getConcatColumns(supplierType: supplierType) {
  const isInside = supplierType === 'Inside';
  return [
    {
      title: t('dict.CommonCol.fullName'),
      field: 'name',
      dragSort: true,
      editRender: isInside
        ? {
            name: 'CustomUserSelect',
            cacheField: 'fullName',
            props: {
              placeholder: t('dict.CommonCol.fullName'),
            },
          }
        : {
            name: 'Input',
            props: {
              placeholder: t('dict.CommonCol.fullName'),
            },
          },
    },
    {
      title: t('dict.SupplierColumn.contactInfo'),
      field: 'contactInfo',
      editRender: {
        name: 'Input',
        props: {
          placeholder: t('dict.SupplierColumn.contactInfo'),
        },
      },
    },
    {
      title: t('dict.Common.position'),
      field: 'position',
      editRender: {
        name: 'Input',
        props: {
          placeholder: t('dict.Common.position'),
        },
      },
    },
    {
      title: t('common.action'),
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    },
  ];
}

export function concat_columns(supplierType: supplierType) {
  // 内部供应商，联系人为必填项，如果是外部供应商，则置灰不可填写
  const isInside = supplierType === 'Inside';

  return [
    {
      name: t('dict.CommonCol.fullName'),
      dataIndex: 'name',
      slots: { title: 'nameTitle' },
      isEdit: isInside,
      isRequired: isInside,
      inputType: '',
      cpmType: supplierType === 'Inside' ? 'CustomUserSelect' : 'Input',
      cpmSetting: { placeholder: t('dict.CommonCol.fullName') },
    },
    {
      name: t('dict.SupplierColumn.contactInfo'),
      dataIndex: 'contactInfo',
      slots: { title: 'contactInfoTitle' },
      isEdit: isInside,
      isRequired: isInside,
      inputType: '',
      cpmType: 'Input',
      cpmSetting: { placeholder: t('dict.SupplierColumn.contactInfo') },
    },
    {
      name: t('dict.Common.position'),
      dataIndex: 'position',
      slots: { title: 'positionTitle' },
      isEdit: isInside,
      isRequired: isInside,
      inputType: '',
      cpmType: 'Input',
      cpmSetting: { placeholder: t('dict.Common.position') },
    },
  ];
}
