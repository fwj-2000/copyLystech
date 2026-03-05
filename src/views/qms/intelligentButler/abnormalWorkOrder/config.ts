import { usePermission } from '/@/hooks/web/usePermission';
import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';
import { formatFileSize } from '/@/utils/file/base64Conver';
import { useLocalStorage } from '@vueuse/core';
import { getMachinelCodeList } from '/@/api/qms/iqc/abnormalTimelinessMonitoring';
import { getShiftType } from '/@/utils/time';
import { ASTATUS_AbnormalTimelinessMonitoring } from '../abnormalTimelinessMonitoring/components/config';

import { useBaseStore } from '/@/store/modules/base';
import dayjs from 'dayjs';

const { t } = useI18n();
const baseStore = useBaseStore();
const { value: storeData } = useLocalStorage('qms-intelligentButler-abnormalTimelinessMonitoring', { machineNo: '' });

// 主页form配置
export const formSchema = [
  {
    fieldName: 'innerMaterialNumber',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '请输入内部料号',
    },
    colProps: { span: 5 },
  },
  {
    fieldName: 'workOrderNo',
    label: '',
    component: 'Input',
    defaultValue: '',
    componentProps: {
      placeholder: '请输入工单号',
    },
    colProps: { span: 4 },
  },
  {
    fieldName: 'machineNo',
    label: '',
    component: 'ApiSelect',
    defaultValue: storeData.machineNo,
    componentProps: {
      api: getMachinelCodeList,
      showSearch: true,
      apiSearch: {
        show: true,
        searchName: 'machineNo',
      },
      resultField: 'data',
      labelField: 'machineNo',
      valueField: 'machineNo',
      filterOption: false,
      notFoundContent: null,
      // defaultFirstOption: true,
      immediate: true,
      placeholder: t('dict.SelectMachine'),
      onChange: e => {
        const { value } = useLocalStorage('qms-intelligentButler-abnormalTimelinessMonitoring', { machineNo: e });
        value.machineNo = e;
      },
    },
  },
  {
    fieldName: 'classes',
    label: '',
    component: 'Select',
    colProps: { span: 4 },
    defaultValue: getShiftType(),
    componentProps: {
      placeholder: '班别',
      options: [
        { label: t('common.dayShift'), value: '1' },
        { label: t('common.nightShift'), value: '2' },
      ],
    },
  },
];

// 主页表格column配置
const column = [
  { field: 'checkbox', width: 50, type: 'checkbox' },
  { title: '工单号', field: 'workOrderNo' },
  { title: '内部料号', field: 'innerMaterialNumber' },
  {
    title: '状态',
    field: 'status',
    cellRender: {
      name: 'Tag',
      options: ASTATUS_AbnormalTimelinessMonitoring,
    },
  },
  {
    title: '生产日期',
    field: 'fBizDate',
    formatter: ({ cellValue }) => {
      return cellValue ? dayjs(cellValue).format('YYYY-MM-DD') : '';
    },
  },
  { title: '厂区物理位置', field: 'factoryAddress' },
  { title: '班别', field: 'classesDes' },
  { title: '机台号', field: 'machineNo' },
  { title: '异常类型', field: 'exceptionType' },
  {
    title: '图片',
    field: 'attachmentList',
    slots: { default: 'AttachmentList' },
    width: 100,
    i18nField: 'attachmentName',
  },
  { title: '异常描述', field: 'problemDescription' },
  { title: '处理人', field: 'introducerUserName' },
  {
    title: '处理时间',
    field: 'createTime',
    formatter: ({ cellValue }) => {
      return cellValue ? dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss') : '';
    },
  },
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 100,
    fixed: 'right',
  },
];

export function getColumn(): any {
  const { hasBtnP } = usePermission();
  const columnData = cloneDeep(column);
  if (hasBtnP('btn_detail')) {
    columnData.unshift({ type: 'checkbox', field: 'checkbox', width: 70 });
    columnData.push({
      title: t('common.action'),
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    });
  }
  return columnData;
}

export function getExportColumn() {
  return cloneDeep(column).toSpliced(0, 1);
}

export const detailGridColumn: any[] = [
  {
    title: '序号',
    type: 'seq',
    field: 'index',
    width: 50,
    i18nField: 'number',
  },
  { title: '问题描述', field: 'problemDescription' },
  { title: '维修方案', field: 'repairSolution' },
  { title: '维修盘点', field: 'repairTakeStock' },
  { title: '改善判定', field: 'improveJudge' },
];

export function getDetailGridColumn(): any {
  return detailGridColumn;
}

export const detailAttachmentGridColumn: any[] = [
  {
    title: '序号',
    type: 'seq',
    field: 'index',
    width: 50,
    i18nField: 'number',
  },
  {
    title: '图纸名称',
    field: 'attachmentName',
    slots: {
      default: 'AttachmentName',
    },
    i18nField: 'CommonCol.attachmentName',
  },
  {
    title: '文件大小',
    field: 'attachmentSize',
    formatter: ({ cellValue }) => (cellValue ? formatFileSize(cellValue) : ''),
  },
  { title: '上传人', field: 'uploadUserName' },
  {
    title: '上传时间',
    field: 'uploadTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
  },
];

export function getDetailAttachmentGridColumn(): any {
  const { hasBtnP } = usePermission();
  const columnData = cloneDeep(detailAttachmentGridColumn);
  if (hasBtnP('btn_detail')) {
    columnData.push({
      title: t('common.action'),
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    });
  }
  return columnData;
}

export const detailFormSchemas = [
  {
    field: 'moldNo',
    label: '模具编号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      disabled: true,
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'projectName',
    label: '项目名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      disabled: true,
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'productName',
    label: '产品名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      disabled: true,
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'pdUserId',
    label: 'PD负责人',
    component: 'CustomUserSelect',
    componentProps: {
      disabled: true,
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
    i18nField: 'pdUserName',
  },
  {
    field: 'orderDate',
    label: '开单日期',
    component: 'DatePicker',
    componentProps: {
      disabled: true,
    },
    rules: [{ required: true, trigger: 'blur', message: '必填' }],
  },
  {
    field: 'successTime',
    label: '完成时间',
    component: 'DatePicker',
    componentProps: {
      disabled: true,
    },
    rules: [{ required: true, trigger: 'blur', message: '必填' }],
  },
  {
    field: 'targetNumber',
    label: '目标T次',
    component: 'InputNumber',
    componentProps: {
      disabled: true,
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'currentNumber',
    label: '目前T次',
    component: 'InputNumber',
    componentProps: {
      disabled: true,
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'moldRepairType',
    label: '型修类型',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('moldRepairType'),
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: true,
      filterOption: false,
      disabled: true,
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'isMoldFinish',
    label: '是否提供模具加工',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('YesOrNo'),
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: true,
      filterOption: false,
      disabled: true,
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'urgentLevel',
    label: '紧急程度',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('MoldApply.UrgentLevel'),
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: true,
      filterOption: false,
      disabled: true,
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
    i18nField: 'urgentLevelName',
  },
  {
    field: 'isModifyDraw',
    label: '是否涉及改图',
    component: 'ApiSelect',
    componentProps: {
      api: () => baseStore.getDictionaryData('YesOrNo'),
      labelField: 'fullName',
      valueField: 'enCode',
      showSearch: true,
      filterOption: false,
      disabled: true,
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'drawBeforeVersion',
    label: '改前图档版本',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      disabled: true,
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },
  {
    field: 'drawAfterVersion',
    label: '改后图档版本',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      disabled: true,
    },
    rules: [
      {
        required: true,
        trigger: 'blur',
        message: t('common.required'),
      },
    ],
  },

  {
    field: 'estimatedImportTime',
    label: '预计导入时间',
    component: 'DatePicker',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'reviewUserId',
    label: '审批人',
    component: 'CustomUserSelect',
    componentProps: {
      disabled: true,
    },
    rules: [
      {
        required: true,
        trigger: 'change',
        message: '必填',
      },
    ],
  },

  {
    required: true,
    field: 'productImage',
    label: '产品图片',
    component: 'ImageUpload',
    componentProps: {
      version: '2',
      placeholder: '',
      maxNumber: 8,
      disabled: true,
      updateType: 'all',
    },
    colProps: {
      span: 24,
    },
  },
  {
    required: true,
    field: 'problemImage',
    label: '问题点图片上传',
    component: 'ImageUpload',
    componentProps: {
      version: '2',
      placeholder: '',
      maxNumber: 8,
      disabled: true,
      updateType: 'all',
    },
    colProps: {
      span: 24,
    },
  },
];
