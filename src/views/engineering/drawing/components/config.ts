import { FormSchema } from '/@/components/VxeTable/ui-kit/form-ui/src/types';
import { useI18n } from '/@/hooks/web/useI18n';
import { set } from 'lodash-es';
import { useUserStore } from '/@/store/modules/user';
import { computed } from 'vue';
import { useBaseStore } from '/@/store/modules/base';
import { getPartNumberApplySearch } from '/@/api/engineering/drawingReviewRequirements';
import { handleInnerPartNumberChange } from '/@/views/business/basicInformation/projectFiles/demand/components/ApplyPopupVxeConfig';
import z from 'zod';

const { t } = useI18n();
const baseStore = useBaseStore();
const userStore = useUserStore();
const getUserInfo = computed(() => userStore.getUserInfo || {});

const DFMListPromise = baseStore.getDictionaryData('DrawingsReview.DFM');
const makeEngineeringInfoListPromise = baseStore.getDictionaryData('DrawingsReview.MakeEngineeringInfo');
const reviewResultListPromise = baseStore.getDictionaryData('DrawingsReview.ReviewResult');

/** 客户意见 选项 */
const reviewOpinionOptions = [
  // 不同意
  {
    label: t('dict.DrawingsReview.ReviewOpinion.2'),
    value: 2,
  },
  // 同意不升版图纸
  {
    label: t('dict.DrawingsReview.ReviewOpinion.3'),
    value: 3,
  },
  // 同意并升版图纸 (该选项会终止流程)
  {
    label: t('dict.DrawingsReview.ReviewOpinion.1'),
    value: 1,
  },
];

export function getBaseFormSchema(): FormSchema[] {
  return [
    {
      fieldName: 'insidePartNumber',
      label: '产品内部料号',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'factory',
      label: '工厂',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'immediateCustomerPartNumber',
      i18nField: 'common.immediateCustomerPartNumber',
      label: '直接客户料号',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'terminalCustomerPartNumber',
      label: '终端客户料号',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Input',
      formItemClass: 'col-span-8',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'applyUserName',
      label: '申请人',
      component: 'Input',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'productDesc',
      label: '产品描述',
      component: 'Input',
      formItemClass: 'col-span-8',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'desensitizedDrawingsName',
      label: '脱敏图纸',
      component: 'Input',
      formItemClass: 'col-span-8',
      componentProps: {
        disabled: true,
      },
    },
    // {
    //   fieldName: 'history',
    //   label: '图纸评审记录',
    //   component: 'Input',
    //   componentProps: {
    //     disabled: true,
    //   },
    // },
  ];
}

export function getEPMReviewFormSchema(): FormSchema[] {
  return [
    {
      fieldName: 'reviewOpinion',
      label: '客户意见',
      component: 'Select',
      componentProps: {
        options: reviewOpinionOptions,
        placeholder: t('common.inputPlaceholder'),
      },
    },
    {
      fieldName: 'reviewRemark',
      label: '备注',
      component: 'Textarea',
      i18nField: 'remark',
      componentProps: {
        placeholder: t('common.inputPlaceholder'),
      },
    },
    {
      fieldName: 'customAttach',
      label: '客户回复附件',
      component: 'Input',
      formItemClass: 'custom-attach',
      labelClass: 'custom-attach',
      componentProps: {
        placeholder: t('common.inputPlaceholder'),
      },
    },
  ];
}

export function getPDOpinionReviewSchema() {
  return [
    {
      fieldName: 'reviewOpinion',
      label: '客户意见',
      component: 'Select',
      componentProps: {
        disabled: true,
        options: reviewOpinionOptions,
      },
    },
    {
      fieldName: 'ourOpinion',
      label: '我司意见',
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '接受客户意见',
            value: 1,
          },
          {
            label: '不接受客户意见',
            value: 2,
          },
        ],
        placeholder: t('common.inputPlaceholder'),
      },
      rules: z.number({ required_error: '请选择我司意见' }),
    },
    {
      fieldName: 'reviewRemark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: t('common.inputPlaceholder'),
      },
    },
    {
      fieldName: 'customAttach',
      label: '客户回复附件',
      component: 'Input',
      formItemClass: 'custom-attach',
      labelClass: 'custom-attach',
    },
    // {
    // 	fieldName: 'communicationAttach',
    // 	label: '沟通附件',
    // 	component: 'Input',
    // },
  ];
}

export function getReviewFormSchema(): FormSchema[] {
  return [
    {
      fieldName: 'reviewOpinion',
      label: '客户意见',
      component: 'Select',
      componentProps: {
        options: reviewOpinionOptions,
      },
    },
    {
      fieldName: 'ourOpinion',
      label: '我司意见',
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '接受客户意见',
            value: 1,
          },
          {
            label: '不接受客户意见',
            value: 2,
          },
        ],
      },
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      // componentProps: {
      // },
    },
    {
      fieldName: 'customAttach',
      label: '客户回复附件',
      component: 'Input',
      formItemClass: 'custom-attach',
      labelClass: 'custom-attach',
    },
    {
      fieldName: 'communicationAttach',
      label: '沟通附件',
      component: 'Input',
      // componentProps: {
      // },
    },
  ];
}

export function getPdLeaderOpinionReviewFormSchema(): FormSchema[] {
  return [
    {
      fieldName: 'reviewOpinion',
      label: '客户意见',
      component: 'Select',
      componentProps: {
        disabled: true,
        options: reviewOpinionOptions,
      },
    },
    {
      fieldName: 'ourOpinion',
      label: '我司意见',
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '接受客户意见',
            value: 1,
          },
          {
            label: '不接受客户意见',
            value: 2,
          },
        ],
        placeholder: t('common.inputPlaceholder'),
      },
      rules: z.number({ required_error: '请选择我司意见' }),
    },
    {
      fieldName: 'reviewRemark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        placeholder: t('common.inputPlaceholder'),
      },
    },
    {
      fieldName: 'customAttach',
      label: '客户回复附件',
      component: 'Input',
      formItemClass: 'custom-attach',
      labelClass: 'custom-attach',
    },
    {
      fieldName: 'communicationAttach',
      label: '沟通附件',
      component: 'Input',
      formItemClass: 'custom-attach',
      labelClass: 'custom-attach',
      // componentProps: {
      // },
    },
  ];
}

export function getEPMConfirmReviewFormSchema(): FormSchema[] {
  return [
    {
      fieldName: 'reviewOpinion',
      label: '客户意见',
      component: 'Select',
      componentProps: {
        disabled: true,
        options: reviewOpinionOptions,
      },
    },
    {
      fieldName: 'ourOpinion',
      label: '我司意见',
      component: 'Select',
      componentProps: {
        disabled: true,
        options: [
          {
            label: '接受客户意见',
            value: 1,
          },
          {
            label: '不接受客户意见',
            value: 2,
          },
        ],
      },
      rules: z.number({ required_error: '请选择我司意见' }),
    },
    {
      fieldName: 'reviewRemark',
      label: '备注',
      component: 'Textarea',
      componentProps: {
        disabled: true,
      },
    },
    {
      fieldName: 'customAttach',
      label: '客户回复附件',
      component: 'Input',
      formItemClass: 'custom-attach',
      labelClass: 'custom-attach',
    },
    {
      fieldName: 'communicationAttach',
      label: '沟通附件',
      component: 'Input',
      formItemClass: 'custom-attach',
      labelClass: 'custom-attach',
      // componentProps: {
      // },
    },
  ];
}

// PD Leader意见
export function getPdLeaderReviewer(): FormSchema[] {
  return [
    {
      // 评审结论
      fieldName: 'reviewResult',
      label: t('dict.DrawingsReview.ReviewResult'),
      component: 'Select',
      componentProps: {
        disabled: true,
        options: [
          {
            label: '通过',
            value: 1,
          },
          {
            label: '不通过',
            value: 2,
          },
        ],
      },
    },
    {
      fieldName: 'makeEngineeringInfo',
      label: '工程资料能否制作',
      component: 'Select',
      componentProps: {
        disabled: true,
        options: [
          {
            label: '能',
            value: 1,
          },
          {
            label: '不能',
            value: 2,
          },
        ],
      },
    },
    {
      fieldName: 'dfm',
      label: '是否提DFM',
      component: 'Select',
      componentProps: {
        disabled: true,
        options: [
          {
            label: '是',
            value: 1,
          },
          {
            label: '否',
            value: 2,
          },
        ],
      },
    },
    {
      fieldName: 'pdLeaderReviewer',
      label: '下一节点处理人(PD Leader)',
      component: 'CustomUserSelect',
      componentProps: {
        defaultValue: getUserInfo.value.managerId,
      },
    },
  ];
}

export function getPdLeaderOpinion(): FormSchema[] {
  return [
    {
      // 评审结论
      fieldName: 'reviewResult',
      label: t('dict.DrawingsReview.ReviewResult'),
      component: 'Select',
      componentProps: {
        disabled: true,
        options: [
          {
            label: '通过',
            value: 1,
          },
          {
            label: '不通过',
            value: 2,
          },
        ],
      },
    },
    {
      fieldName: 'makeEngineeringInfo',
      label: '工程资料能否制作',
      component: 'Select',
      componentProps: {
        disabled: true,
        options: [
          {
            label: '能',
            value: 1,
          },
          {
            label: '不能',
            value: 2,
          },
        ],
      },
    },
    {
      fieldName: 'dfm',
      label: '是否提DFM',
      component: 'Select',
      componentProps: {
        disabled: true,
        options: [
          {
            label: '是',
            value: 1,
          },
          {
            label: '否',
            value: 2,
          },
        ],
      },
    },
    {
      fieldName: 'epmConfirmer',
      label: '下一节点处理人',
      component: 'CustomUserSelect',
      componentProps: {
        // defaultValue: getUserInfo.value.managerId,
      },
    },
  ];
}

// EPM评审
export function getEPMReviewSchema(): FormSchema[] {
  return [
    {
      // 评审结论
      fieldName: 'reviewResult',
      label: t('dict.DrawingsReview.ReviewResult'),
      component: 'Select',
      componentProps: {
        disabled: true,
        options: [
          {
            label: '通过',
            value: 1,
          },
          {
            label: '不通过',
            value: 2,
          },
        ],
      },
    },
    {
      fieldName: 'makeEngineeringInfo',
      label: '工程资料能否制作',
      component: 'Select',
      componentProps: {
        disabled: true,
        options: [
          {
            label: '能',
            value: 1,
          },
          {
            label: '不能',
            value: 2,
          },
        ],
      },
    },
    {
      fieldName: 'dfm',
      label: '是否提DFM',
      component: 'Select',
      componentProps: {
        disabled: true,
        options: [
          {
            label: '是',
            value: 1,
          },
          {
            label: '否',
            value: 2,
          },
        ],
      },
    },
    {
      fieldName: 'pdReviewer',
      i18nField: 'nextPdReviewer',
      label: '下一节点处理人(PD)',
      component: 'CustomUserSelect',
      componentProps: {},
    },
  ];
}

// EPM确认
export function getEPMConfirmSchema(): FormSchema[] {
  return [
    {
      // 评审结论
      fieldName: 'reviewResult',
      label: t('dict.DrawingsReview.ReviewResult'),
      component: 'Select',
      componentProps: {
        disabled: true,
        options: [
          {
            label: '通过',
            value: 1,
          },
          {
            label: '不通过',
            value: 2,
          },
        ],
      },
    },
    {
      fieldName: 'makeEngineeringInfo',
      label: '工程资料能否制作',
      component: 'Select',
      componentProps: {
        disabled: true,
        options: [
          {
            label: '能',
            value: 1,
          },
          {
            label: '不能',
            value: 2,
          },
        ],
      },
    },
    {
      fieldName: 'dfm',
      label: '是否提DFM',
      component: 'Select',
      componentProps: {
        disabled: true,
        options: [
          {
            label: '是',
            value: 1,
          },
          {
            label: '否',
            value: 2,
          },
        ],
      },
    },
  ];
}

// 上传附件列表
export function getUploadAttachList() {
  return [
    { field: 'checkbox', width: 50, type: 'checkbox' },
    {
      title: '需求类型',
      field: 'demandTypeName',
      minWidth: 160,
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      minWidth: 220,
    },
    {
      title: '附件',
      field: 'attachment',
      minWidth: 160,
      slots: { default: 'attachment' },
    },
    {
      title: '评审结论',
      field: 'reviewResult',
      minWidth: 160,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: () => baseStore.getDictionaryData('DrawingsReview.ReviewResult'),
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
          onChange: async (e, data, { row }) => {
            if (e == 1) {
              const list = await makeEngineeringInfoListPromise;
              const target = list.find(item => item.enCode == 1);
              row.makeEngineeringInfo = target.enCode;
              row.makeEngineeringInfoName = target.fullName;
            } else if (e == 2) {
              const list = await DFMListPromise;
              const target = list.find(item => item.enCode == 1);
              row.dfm = target.enCode;
              row.dfmName = target.fullName;
            }
          },
        },
      },
    },
    {
      title: '工程资料能否制作',
      field: 'makeEngineeringInfo',
      i18nField: 'canPrepareEngineeringMaterials',
      minWidth: 160,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          dynamicDisabled: row => {
            return row.reviewResult && row.reviewResult == 1;
          },
          api: () => baseStore.getDictionaryData('DrawingsReview.MakeEngineeringInfo'),
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
        },
      },
    },
    {
      title: '是否提DFM',
      field: 'dfm',
      i18nField: 'submitDFMInquiry',
      minWidth: 160,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          dynamicDisabled: row => {
            return row.reviewResult && row.reviewResult == 2;
          },
          api: () => baseStore.getDictionaryData('DrawingsReview.DFM'),
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
        },
      },
    },
    {
      title: '下一节点处理人(PD Leader)',
      field: 'pdLeader',
      minWidth: 220,
      editRender: {
        name: 'CustomUserSelect',
        props: {
          // multiple: true,
        },
      },
    },
    {
      title: 'EPM',
      field: 'epm',
      minWidth: 160,
      editRender: {
        name: 'CustomUserSelect',
        props: {
          // multiple: true,
        },
      },
    },
  ];
}

// EPM批量审核
export function getEPMBatchReviewList() {
  return [
    { field: 'checkbox', width: 50, type: 'checkbox' },
    {
      title: '需求类型',
      field: 'demandTypeName',
      minWidth: 160,
    },
    {
      title: '产品内部料号',
      field: 'insidePartNumber',
      minWidth: 220,
    },
    {
      title: '评审结论',
      field: 'reviewResultName',
      minWidth: 160,
    },
    {
      title: '工程资料能否制作',
      field: 'makeEngineeringInfoName',
      minWidth: 160,
    },
    {
      title: '是否提DFM',
      field: 'dfmName',
      i18nField: 'submitDFMInquiry',
      minWidth: 160,
    },
    {
      title: '客户意见',
      field: 'reviewOpinion',
      minWidth: 220,
      editRender: {
        name: 'ASelect',
        props: {
          options: reviewOpinionOptions,
        },
      },
    },
    {
      title: '备注',
      field: 'remark',
      minWidth: 220,
      editRender: {
        name: 'Textarea',
      },
    },
    {
      title: '下一节点处理人(PD)',
      field: 'pdReviewer',
      minWidth: 220,
      editRender: {
        name: 'CustomUserSelect',
      },
    },
    {
      title: '客户回复附件',
      field: 'attachment',
      minWidth: 160,
      slots: { default: 'attachment' },
    },
  ];
}

export function getUploadRules() {
  return {
    reviewResult: [
      {
        validator: ({ col, cell, row }) => {
          if (!cell) {
            return;
          }
          row.reviewResult = cell;
          if (cell === '1') {
            row.reviewResultName = '是';
          }
          if (cell === '2') {
            row.reviewResultName = '否';
          }
        },
      },
    ],
    makeEngineeringInfo: [
      {
        validator: ({ col, cell, row }) => {
          if (!cell) {
            return;
          }
          row.makeEngineeringInfo = cell;
          if (cell === '1') {
            row.makeEngineeringInfoName = '能';
          }
          if (cell === '2') {
            row.makeEngineeringInfoName = '不能';
          }
        },
      },
    ],
    dfm: [
      {
        validator: ({ col, cell, row }) => {
          if (!cell) {
            return;
          }
          row.dfm = cell;
          if (cell === '1') {
            row.dfmName = '是';
          }
          if (cell === '2') {
            row.dfmName = '否';
          }
        },
      },
    ],
    reviewOpinion: [
      {
        validator: ({ col, cell, row }) => {
          if (!cell) {
            return;
          }
          row.reviewOpinion = +cell;
          if (cell === '1') {
            row.reviewOpinionName = '是';
          }
          if (cell === '2') {
            row.reviewOpinionName = '否';
          }
        },
      },
    ],
    // reviewOpinion: [{
    //   validator: ({ col, cell, row }) => {
    //     if (!cell) {
    //       return;
    //     }
    //     row.reviewOpinion = cell;
    //     if (cell == '1') {
    //       row.reviewOpinionName = '同意不升版图纸';
    //     }
    //     if (cell == '2') {
    //       row.reviewOpinionName = '同意并升版图纸';
    //     }
    //     if (cell == '3') {
    //       row.reviewOpinionName = '不同意';
    //     }
    //     console.log(row, 'rowrowrowrowrowrow')
    //   },
    // },],
    pdLeader: [
      {
        validator: ({ col, cell, row }, data) => {
          // console.log('🚀 ~ validator ~ data: ', data);
          // // 设置复制数据
          // col.copyDataRow = col.field.replaceAll('Id', 'Name');
          // set(row, `copyData.${col['field'].replaceAll('Id', 'Name')}`, `${data.RealName}/${data.Account}`);
          //
          // row.pdLeaderName = `${data.RealName}/${data.Account}`;
          // row.pdLeader = data.Id;
        },
      },
    ],
    epm: [
      {
        // validator: (...rest) => {
        validator: ({ col, cell, row }, data) => {
          // console.log('🚀 ~ validator ~ data: ', data);
          // // 设置复制数据
          // col.copyDataRow = col.field.replaceAll('Id', 'Name');
          // set(row, `copyData.${col['field'].replaceAll('Id', 'Name')}`, `${data.RealName}/${data.Account}`);
          //
          // row.epmName = `${data.RealName}/${data.Account}`;
          // row.epm = data.Id;
        },
      },
    ],
  };
}

export function getQuestionColumns() {
  return [
    {
      title: '问题类型',
      field: 'issueType',
      formatter: 'ApiSelect',
      width: 280,
      editRender: {
        name: 'ApiSelect',
        props: {
          api: () => baseStore.getDictionaryData('DrawingsReview.IssueType'),
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
          onChange: (_, data, { row }) => {
            row.issueTypeName = data.label || data.fullName;
          },
        },
      },
    },
    {
      title: '问题详情',
      field: 'issueDetail',
      editRow: true,
      width: 280,
      className: 'cell-start',
      // cellRender: {
      //   name: 'Editor',
      // },
      editRender: {
        // name: 'Editor',
        name: 'Textarea',
        props: {
          // key: '1111111111111111',
          // placeholder: t('common.processDescription'),
          // editorHeight: '105px',
          // mode: 'simple',
          // toolbarConfig: {
          //   toolbarKeys: ['bold', 'color', 'bulletedList', 'numberedList'],
          // },
          autoSize: { minRows: 6, maxRows: 6 },
        },
      },
      slots: { default: 'issueDetail' },
    },
    {
      title: '问题图片',
      field: 'issueDetailImage',
      width: 350,
      slots: { default: 'issueDetailImage' },
    },
    {
      title: '建议方案',
      field: 'scenario',
      editRow: true,
      width: 280,
      editRender: {
        // name: 'Editor',
        name: 'Textarea',
        props: {
          // key: '222222222222222',
          // placeholder: t('common.processDescription'),
          // editorHeight: '105px',
          // mode: 'simple',
          // toolbarConfig: {
          //   toolbarKeys: ['bold', 'color', 'bulletedList', 'numberedList'],
          // },
          autoSize: { minRows: 6, maxRows: 6 },
        },
      },
      slots: { default: 'scenario' },
    },
    {
      title: '建议方案图片',
      field: 'scenarioImage',
      width: 350,
      slots: { default: 'scenarioImage' },
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 80,
      fixed: 'right',
    },
  ];
}
