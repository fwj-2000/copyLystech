import { BasicColumn } from '/@/components/Table';
import { usePermission } from '/@/hooks/web/usePermission';
import { useI18n } from '/@/hooks/web/useI18n';
import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();

export const importTableColumns: BasicColumn[] = [
  { title: '档案分组', dataIndex: 'recordGrouping', key: 'recordGrouping', width: 150 },
  { title: '厂区', dataIndex: 'factoryName', key: 'factoryName', width: 150 },
  { title: '入职日期', dataIndex: 'employmentDate', key: 'employmentDate', width: 150, format: 'date|YYYY-MM-DD' },
  { title: '工号', dataIndex: 'trainerWorkNo', key: 'trainerWorkNo', width: 150 },
  { title: '姓名', dataIndex: 'trainerName', key: 'trainerName', width: 150 },
  { title: '打卡班次', dataIndex: 'attendanceShift', key: 'attendanceShift', width: 150 },
  { title: '办公级培训负责人', dataIndex: 'officeTrainingCoordinatorName', key: 'officeTrainingCoordinatorName', width: 150 },
  { title: '车间级培训负责人', dataIndex: 'workshopTrainingCoordinatorName', key: 'workshopTrainingCoordinatorName', width: 150 },
  { title: '班组级培训负责人', dataIndex: 'teamLevelTrainingCoordinatorName', key: 'teamLevelTrainingCoordinatorName', width: 150 },
];

export const STATUS_OPTIONS = [
  { id: 0, fullName: '员工待提交', theme: 'gray', rowKey: 'statusDesc' },
  { id: 1, fullName: '办公待签审', theme: 'blue', rowKey: 'statusDesc' },
  { id: 2, fullName: '办公已签审', theme: 'red', rowKey: 'statusDesc' },
  { id: 3, fullName: '车间待签审 ', theme: 'yellow', rowKey: 'statusDesc' },
  { id: 4, fullName: '车间已签审', theme: 'purple', rowKey: 'statusDesc' },
  { id: 5, fullName: '班组待签审', theme: 'green', rowKey: 'statusDesc' },
  { id: 6, fullName: 'HR待终审', theme: 'gray', rowKey: 'statusDesc' },
  { id: 7, fullName: '已归档', theme: 'green', rowKey: 'statusDesc' },
];

// 表单配置
export const getHrTrainFormConfig = () => {
  return [
    {
      fieldName: 'trainerWorkNo',
      label: '',
      component: 'Input',
      labelWidth: 50,
      componentProps: {
        placeholder: t('dict.CommonCol.workNo'),
      },
    },
    {
      fieldName: 'trainerName',
      label: '',
      component: 'Input',
      labelWidth: 50,
      componentProps: {
        placeholder: t('dict.CommonCol.fullName'),
      },
    },
    {
      fieldName: 'officeMentorId',
      label: '',
      component: 'CustomUserSelect',
      labelWidth: 50,
      componentProps: {
        placeholder: t('dict.EmployeeTrainingColumn.officeTrainingCoordinatorName'),
      },
    },
    {
      fieldName: 'workshopMentorId',
      label: '',
      component: 'CustomUserSelect',
      labelWidth: 50,
      componentProps: {
        placeholder: t('dict.EmployeeTrainingColumn.workshopTrainingCoordinatorName'),
      },
    },
    {
      fieldName: 'teamLevelMentorId',
      label: '',
      component: 'CustomUserSelect',
      labelWidth: 50,
      componentProps: {
        placeholder: t('dict.EmployeeTrainingColumn.teamLevelTrainingCoordinatorName'),
      },
    },
    {
      fieldName: 'status',
      label: '',
      i18nField: 'CommonCol.labelStatus',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('EmployeeTrain.Status'),
        disabled: false,
        showSearch: false,
        resultField: 'data',
        placeholder: t('common.selectPlaceholder'),
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
    },
    {
      fieldName: 'pickerVal',
      label: '',
      labelWidth: 100,
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
      },
    },
  ];
};

export const getHrTrainPageColumns = () => {
  const { hasBtnP } = usePermission();
  const column = [
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    {
      title: '工号',
      field: 'trainerWorkNo',
      width: 100,
    },
    {
      title: '姓名',
      field: 'trainerName',
      width: 100,
    },
    {
      title: '档案分组',
      field: 'recordGrouping',
      width: 100,
    },
    {
      title: '厂区',
      field: 'factoryName',
      width: 100,
    },
    {
      title: '入职日期',
      field: 'employmentDate',
      width: 120,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
      sortable: true,
    },
    {
      title: '打卡班次',
      field: 'attendanceShift',
      width: 120,
    },
    {
      title: '流程状态',
      field: 'statusName',
      width: 100,
    },
    {
      title: '当前流程节点',
      field: 'currentNodeName',
      width: 120,
    },
    {
      title: '当前处理人',
      field: 'currentHandlerName',
      width: 120,
    },
    {
      title: '办公级培训负责人',
      field: 'officeTrainingCoordinatorName',
      width: 160,
    },
    {
      title: '车间级培训负责人',
      field: 'workshopTrainingCoordinatorName',
      width: 160,
    },
    {
      title: '班组级培训负责人',
      field: 'teamLevelTrainingCoordinatorName',
      width: 160,
    },
    {
      title: '创建人',
      field: 'creator',
      width: 100,
    },
    {
      title: '创建时间',
      field: 'createdTime',
      width: 150,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm',
      },
      sortable: true,
    },
  ];
  if (hasBtnP('btn_edit')) {
    column.unshift({ type: 'checkbox', field: 'checkbox', width: 70 });
    column.push({
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 120,
      fixed: 'right',
    });
  }
  return column;
};
