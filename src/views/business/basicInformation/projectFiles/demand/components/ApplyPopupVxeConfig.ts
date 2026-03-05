import { useBaseStore } from '/@/store/modules/base';
import { useI18n } from '/@/hooks/web/useI18n';
import { getPartNumberFactoryList } from '/@/api/basicData/factory';
import { getEnablePartNumberApply } from '/@/api/basicData/productCodeApply';

const baseStore = useBaseStore();
const { t } = useI18n();

export function getColumns() {
  return [
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      width: 240,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getEnablePartNumberApply,
          showSearch: true,
          autoFocus: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          params: {
            statusTag: '1,3',
          },
          resultField: 'data.list',
          labelField: 'InsidePartNumber',
          valueField: 'InsidePartNumber',
          immediate: false,
          filterOption: null,
          onChange: (_: string, data: any, params: any) => {
            handleInnerPartNumberChange(params.row, data);
          },
        },
      },
    },
    {
      title: '工厂',
      field: 'factory',
      i18nField: 'factory',
      width: 240,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getPartNumberFactoryList,
          placeholder: '请选择',
          showSearch: true,
          rowParams: {
            partNumber: 'insidePartNumber',
          },
          apiSearch: {
            show: true,
            searchName: 'factory',
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          nameFormat: ['Code', '/', 'Name'],
        },
      },
    },
    {
      title: '阶段',
      field: 'stage',
      cacheField: 'stageName',
      formatter: 'ApiSelect',
      width: 200,
      editRender: {
        name: 'ApiSelect',
        props: {
          api: () => baseStore.getDictionaryData('projDocStage'),
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
          filterOption: true,
          onChange: async (_v: any, _data: any, params: any) => {
            handleStageChange(params.row);
          },
        },
      },
    },
    {
      title: '文件类型',
      field: 'fileType',
      formatter: 'ApiSelect',
      cacheField: 'fileTypeName',
      width: 200,
      editRender: {
        name: 'ApiSelect',
        dynamicOptionsField: 'fileTypeOptions',
        props: {
          filterOption: true,
          showSearch: true,
          labelField: 'fullName',
          valueField: 'enCode',
          // optionFilterProp: 'label',
        },
      },
    },
    {
      title: '角色',
      field: 'docUploadUserRole',
      formatter: 'ApiSelect',
      cacheField: 'docUploadUserRoleName',
      width: 200,
      editRender: {
        name: 'ApiSelect',
        dynamicOptionsField: 'roleOptions',
        props: {
          filterOption: true,
          showSearch: true,
          labelField: 'fullName',
          valueField: 'enCode',
          optionFilterProp: 'label',
          onChange: (_: any, _data: any, { row }) => {
            changeMaintPersonId(row);
          },
        },
      },
    },
    {
      title: '资料维护人',
      field: 'docUploadUser',
      // formatter: ({ cellValue, row }) => row.docUploadUserName || cellValue || '',
      width: 200,
      editRender: {
        cacheField: 'docUploadUserName',
        name: 'CustomUserSelect',
      },
    },
    {
      title: 'DQE',
      field: 'dqe',
      width: 200,
      // formatter: ({ cellValue, row }) => row.dqeName || cellValue || '',
      editRender: {
        cacheField: 'dqeName',
        name: 'CustomUserSelect',
      },
    },
    {
      title: t('common.action'),
      field: 'action',
      width: 100,
      slots: { default: 'action' },
      fixed: 'right',
    },
  ];
}

/**
 * 产品内部料号发生改变处理
 * @param row
 * @param option
 */
export function handleInnerPartNumberChange(row: any, option: any) {
  row.factory = '';
  row.docUploadUser = '';
  row.docUploadUserName = '';
  row.dqe = '';
  row.dqeName = '';
  row.roleOptions = [];
  row.docUploadUserRole = '';
  row.memberOptions = [];

  if (!option) {
    return false;
  }

  row.factory = option.Factory || option.factory || '';
  row.factoryName = option.FactoryName || option.factoryName || '';
  const { members } = option;
  if (Array.isArray(members) && members.length > 0) {
    row.roleOptions = members.map(item => {
      return {
        label: item.configColumnName,
        value: item.configType,
      };
    });

    row.memberOptions = members;
    const DQEPerson = members.find(item => item.configType == 'DQE');
    row.dqe = DQEPerson?.memberId || '';
    row.dqeName = DQEPerson?.memberName || '';

    changeMaintPersonId(row);
  }
}

/**
 * `阶段`发生改变处理
 * @param row
 */
export async function handleStageChange(row: any) {
  row.fileType = '';
  row.fileTypeName = '';
  row.fileTypeOptions = [];
  if (!row.stage) {
    return false;
  }

  row.fileTypeOptions = (((await baseStore.getDictionaryData(row.stage + 'FileType')) as Array<any>) || []).map(el => {
    return {
      value: el.enCode,
      label: el.fullName,
    };
  });
}

/**
 * @description 更改资料维护人
 */
export function changeMaintPersonId(row: any) {
  row.docUploadUser = '';
  row.docUploadUserName = '';

  // 根据产品内部料号所带的人员，以及用户选择的角色，自动带出对应的`资料维护人员`
  if (row.insidePartNumber && row.docUploadUserRole && Array.isArray(row.memberOptions) && row.memberOptions.length > 0) {
    const pdPerson = row.memberOptions.find((item: any) => item.configType == row.docUploadUserRole);
    row.docUploadUser = pdPerson?.memberId || '';
    row.docUploadUserName = pdPerson?.memberName || '';
  }
}
