import { usePermission } from '/@/hooks/web/usePermission';
import { cloneDeep } from 'lodash-es';
import { useI18n } from '/@/hooks/web/useI18n';
import { formatFileSize } from '/@/utils/file/base64Conver';

import { useBaseStore } from '/@/store/modules/base';

const { t } = useI18n();
const baseStore = useBaseStore();

// 主页form配置
export function getFormSchema() {
  return [
    {
      fieldName: 'moldNo',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '模具编号',
      },
    },
    {
      fieldName: 'projectName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '项目名称',
      },
    },
    {
      fieldName: 'productName',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '产品名称',
      },
    },
    {
      fieldName: 'pdUserId',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: 'PD负责人',
      },
      i18nField: 'pdUserName',
    },
    {
      fieldName: 'urgentLevel',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '紧急程度',
        api: () => baseStore.getDictionaryData('MoldApply.UrgentLevel'),
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        allowClear: true,
        immediate: true,
      },
      i18nField: 'urgentLevelName',
    },
  ];
}

// 主页表格column配置
const column = [
  {
    title: '单据号',
    sortable: true,
    field: 'documentNumber',
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 180,
  },
  {
    title: '模具编号',
    field: 'moldNo',
    width: 160,
  },
  {
    title: '旧模具编号',
    field: 'oldMoldNo',
    width: 160,
    i18nField: 'CommonCol.oldMoldNo',
  },
  {
    title: '项目名称',
    field: 'projectName',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 150,
  },
  {
    title: '产品名称',
    field: 'productName',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '状态',
    field: 'status',
    // sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'status',
      props: {
        api: () => baseStore.getDictionaryData('repairMoldAuditStatus'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: '',
        },
        filterOption: false,
        notFoundContent: null,
      },
    },
    cellRender: {
      name: 'Tag',
      options: [
        // 草稿
        { id: 0, fullName: t('dict.repairMoldAuditStatus.0'), theme: 'gray', rowKey: 'statusDesc' },
        // 审核中
        { id: 1, fullName: t('dict.repairMoldAuditStatus.1'), theme: 'blue', rowKey: 'statusDesc' },
        // 已处理
        { id: 2, fullName: t('dict.repairMoldAuditStatus.2'), theme: 'green', rowKey: 'statusDesc' },
        // 核准中
        { id: 3, fullName: t('dict.repairMoldAuditStatus.3'), theme: 'blue', rowKey: 'statusDesc' },
        // 驳回
        { id: 4, fullName: t('dict.repairMoldAuditStatus.4'), theme: 'red', rowKey: 'statusDesc' },
        // 撤回
        { id: 5, fullName: t('dict.repairMoldAuditStatus.5'), theme: 'purple', rowKey: 'statusDesc' },
      ],
    },
    width: 120,
    i18nField: 'statusName',
  },
  {
    title: '当前处理人',
    field: 'nodeHandlerName',
    // sortable: true,
    width: 160,
  },
  {
    title: '当前节点',
    field: 'currentNodeName',
    width: 160,
  },
  {
    title: '节点记录',
    field: 'record',
    slots: { default: 'record' },
    width: 100,
    i18nField: 'CommonCol.nodeRecord',
  },
  {
    title: 'PD负责人',
    field: 'pdUserName',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
    width: 160,
  },
  {
    title: '完成时间',
    field: 'successTime',
    sortable: true,
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD',
    },
    width: 160,
  },
  {
    title: '紧急程度',
    field: 'urgentLevel',
    sortable: true,
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      searchField: 'urgentLevel',
      props: {
        api: () => baseStore.getDictionaryData('MoldApply.UrgentLevel'),
        labelField: 'fullName',
        valueField: 'enCode',
        immediate: true,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: '',
        },
        filterOption: false,
        notFoundContent: null,
      },
    },
    cellRender: {
      name: 'Tag',
      options: [
        { id: 1, fullName: t('dict.urgentLevel.1'), theme: 'blue', rowKey: 'statusDesc' },
        { id: 2, fullName: t('dict.urgentLevel.2'), theme: 'yellow', rowKey: 'statusDesc' },
        { id: 3, fullName: t('dict.urgentLevel.3'), theme: 'red', rowKey: 'statusDesc' },
      ],
    },
    width: 120,
    i18nField: 'urgentLevelName',
  },
  {
    title: '附件',
    field: 'attachmentList',
    slots: { default: 'AttachmentList' },
    width: 100,
    i18nField: 'attachmentName',
  },
  {
    title: '创建人',
    field: 'creatorUserName',
    sortable: true,
    width: 180,
    filters: [{ data: '' }],
    filterRender: {
      name: 'Input',
    },
  },
  {
    title: '创建时间',
    field: 'creatorTime',
    cellRender: {
      name: 'Date',
      format: 'YYYY-MM-DD HH:mm:ss',
    },
    width: 160,
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
  },
  {
    field: 'currentNumber',
    label: '目前T次',
    component: 'InputNumber',
    componentProps: {
      disabled: true,
    },
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
  },
  {
    field: 'drawBeforeVersion',
    label: '改前图档版本',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      disabled: true,
    },
  },
  {
    field: 'drawAfterVersion',
    label: '改后图档版本',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      disabled: true,
    },
  },

  {
    field: 'estimatedImportTime',
    label: '预计导入时间',
    component: 'DatePicker',
    componentProps: {
      disabled: true,
    },
  },
  // {
  //   field: 'reviewUserId',
  //   label: '审批人',
  //   component: 'CustomUserSelect',
  //   componentProps: {
  //     disabled: true,
  //   },
  //   rules: [
  //     {
  //       required: true,
  //       trigger: 'change',
  //       message: '必填',
  //     },
  //   ],
  // },

  {
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

export const formSchema = [
  {
    required: true,
    field: 'meetPersonIds',
    label: '与会人员',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '与会人员',
      multiple: true,
      disabled: true,
    },
  },
  {
    field: 'dqeUserId',
    label: '签核',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '签核',
      disabled: true,
    },
    rules: [
      {
        required: true,
        trigger: 'change',
        message: '签核',
      },
    ],
  },
  {
    field: 'pdLeaderId',
    label: ' ',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: 'PD/leader',
      disabled: true,
    },
  },
  {
    field: 'teLeaderId',
    label: ' ',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: 'TE主管',
      disabled: true,
    },
  },
  {
    field: 'rdLeaderId',
    label: ' ',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '研发经理',
      disabled: true,
    },
  },
  {
    field: 'moldUndertakerId',
    label: ' ',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '模具部承办',
      disabled: true,
    },
  },
];
