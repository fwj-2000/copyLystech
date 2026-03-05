import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';
import { localeList } from '/@/settings/localeSetting';

const { t } = useI18n();
const baseStore = useBaseStore();

export const DETAIL_PAGE_TYPE_ENUM = {
  新增: '1',
  升版: '2',
  修改: '3',
};

export function getColumns() {
  return [
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    {
      title: '模块',
      field: 'moduleEnCode',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: () => baseStore.getDictionaryData('Module'),
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
          filterOption: (input: string, option: any) => {
            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          },
          showSearch: true,
          onChange: (_, data, { row }) => {
            row.moduleFullName = data.fullName;
            row.moduleEnCodeName = data.fullName;
            // console.log('🚀 ~ onChange ~ data: ', data);
            // const { row } = params;
            // if (data && _) {
            // 	row.shippingMaterialName = data.fullName || data.label;
            // } else {
            // 	row.shippingMaterialName = '';
            // }
          },
        },
      },
    },
    {
      title: '模板名称',
      field: 'name',
      editRender: {
        name: 'Input',
        props: {
          placeholder: '请输入模板名称',
        },
      },
    },
    {
      title: '语言',
      field: 'language',
      width: 160,
      editRender: {
        name: 'ASelect',
        props: {
          options: localeList,
          fieldNames: {
            value: 'event',
            label: 'text',
          },
        },
      },
    },
    {
      title: '附件',
      field: 'file',
      slots: {
        default: 'files',
      },
    },
    {
      title: '版本',
      field: 'version',
      width: 100,
    },
    {
      title: t('common.action'),
      width: 160,
      slots: { default: 'action' },
      fixed: 'right',
      field: 'action',
    },
  ];
}
