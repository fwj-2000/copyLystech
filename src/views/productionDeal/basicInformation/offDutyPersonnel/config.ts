import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();

// 主页form配置
export function getFormSchema() {
  return [
    {
      fieldName: 'leaveTime',
      label: '',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请假日期',
      },
    },
    {
      fieldName: 'classes',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '班次',
        api: () => {
          return baseStore.getDictionaryData('ClassesName');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },
    {
      fieldName: 'userId',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '人员',
      },
      // i18nField: 'pdUserName',
    },
  ];
}

const getClassesName = classes => {
  if (classes === 1) {
    return t('common.dayShift');
  }
  if (classes === 2) {
    return t('dict.NightShift');
  }
};

// 主页表格column配置
const column = [
  {
    title: '类型',
    field: 'takeLeaveTypeName',
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'takeLeaveType',
      props: {
        api: () => baseStore.getDictionaryData('takeLeaveType'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: false,
        filterOption: false,
        notFoundContent: null,
      },
    },
  },

  {
    title: '请假日期',
    sortable: true,
    field: 'leaveTime',
    width: 200,
  },
  {
    title: '班次',
    field: 'classes',
    width: 160,
    formatter: ({ cellValue }) => getClassesName(cellValue),
  },
  {
    title: '人员',
    field: 'userName',
    i18nField: 'userId',
  },
  {
    title: '备注',
    field: 'remark',
  },
];

export function getColumn(): any {
  const columnData = cloneDeep(column);
  columnData.unshift({ type: 'checkbox', field: 'checkbox', width: 70 });
  columnData.push({
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 100,
    fixed: 'right',
  });
  return columnData;
}

export function getExportColumn() {
  return cloneDeep(column);
}
