import { useI18n } from '/@/hooks/web/useI18n';
import type { FormSchema } from '/@/components/VxeTable/ui-kit/form-ui/src/types';
import { useUserStore } from '/@/store/modules/user';

const userStore = useUserStore();

const { t } = useI18n();
export function getStatus(k?: string) {
  const keyName = ''; // 转成前端文案
  return [
    { id: 0, fullName: t('common.draft'), value: 0, label: t('common.draft'), theme: 'gray', rowKey: keyName }, //草稿
    { id: 1, fullName: t('common.doing'), value: 1, label: t('common.doing'), theme: 'blue', rowKey: keyName }, //在办
    { id: 2, fullName: t('common.stopText'), value: 2, label: t('common.stopText'), theme: 'red', rowKey: keyName }, //终止
    { id: 3, fullName: t('common.rejectText'), value: 3, label: t('common.rejectText'), theme: 'yellow', rowKey: keyName }, //驳回
    { id: 4, fullName: t('common.revoke'), value: 4, label: t('common.revoke'), theme: 'purple', rowKey: keyName }, //撤回
    { id: 5, fullName: t('common.endding'), value: 5, label: t('common.endding'), theme: 'green', rowKey: keyName }, //结案
    { id: 6, fullName: t('common.todoText'), value: 6, label: t('common.todoText'), theme: 'gray', rowKey: keyName }, //待处理
    { id: 7, fullName: t('common.doneText'), value: 7, label: t('common.doneText'), theme: 'green', rowKey: keyName }, //已处理
    { id: 8, fullName: t('common.delText'), value: 8, label: t('common.delText'), theme: 'gray', rowKey: keyName }, //删除
    { id: 9, fullName: t('common.submitTodo'), value: 9, label: t('common.submitTodo'), theme: 'gray', rowKey: keyName }, //待提交 -- to dev
    { id: 10, fullName: t('common.submitted'), value: 10, label: t('common.submitted'), theme: 'green', rowKey: keyName }, //已提交
    { id: 11, fullName: t('common.agree'), value: 11, label: t('common.agree'), theme: 'green', rowKey: keyName }, //同意
    { id: 12, fullName: t('common.disagree'), value: 12, label: t('common.disagree'), theme: 'yellow', rowKey: keyName }, //不同意
    { id: 13, fullName: t('status.applyStatus.waiting'), value: 13, label: t('status.applyStatus.waiting'), theme: 'blue', rowKey: keyName }, //待回复
    { id: 14, fullName: t('common.notFoundMetarail'), value: 14, label: t('common.notFoundMetarail'), theme: 'red', rowKey: keyName }, //不寻料
    { id: 15, fullName: t('common.toRecomend'), value: 15, label: t('common.toRecomend'), theme: 'gray', rowKey: keyName }, //待推荐
    { id: 16, fullName: t('common.toConfirm'), value: 16, label: t('common.toConfirm'), theme: 'blue', rowKey: keyName }, //待确认
    { id: 17, fullName: t('common.toCheck'), value: 17, label: t('common.toCheck'), theme: 'gray', rowKey: keyName }, //待验证
    { id: 18, fullName: t('comon.reSendSample'), value: 18, label: t('comon.reSendSample'), theme: 'purple', rowKey: keyName }, //重新送样
    { id: 19, fullName: t('common.reRecommend'), value: 19, label: t('common.reRecommend'), theme: 'purple', rowKey: keyName }, //重新推荐
    { id: 20, fullName: t('common.backEngineer'), value: 20, label: t('common.backEngineer'), theme: 'red', rowKey: keyName }, //退回工程
    { id: 21, fullName: t('common.ending'), value: 21, label: t('common.ending'), theme: 'green', rowKey: keyName }, //结束
    { id: 26, fullName: t('common.toImport'), value: 26, label: t('common.toImport'), theme: 'gray', rowKey: keyName }, //待导入
    { id: 27, fullName: t('common.imported'), value: 27, label: t('common.imported'), theme: 'green', rowKey: keyName }, //已导入
    { id: 28, fullName: t('common.notImport'), value: 28, label: t('common.notImport'), theme: 'red', rowKey: keyName }, //不导入
  ];
}

export function getQuantityStatus(k: string = 'statusDesc') {
  const keyName = ''; // 转成前端文案
  return [
    { id: 1, fullName: t('common.toVerify'), theme: 'gray', rowKey: keyName }, //待检
    { id: 2, fullName: 'NG', theme: 'yellow', rowKey: keyName }, //
    { id: 3, fullName: 'OK', theme: 'green', rowKey: keyName }, //
    { id: 4, fullName: t('common.specialStatus'), theme: 'purple', rowKey: keyName }, //特采
    { id: 5, fullName: t('common.todoText'), theme: 'yellow', rowKey: keyName }, //待处理
    { id: 6, fullName: t('common.rejectText'), theme: 'red', rowKey: keyName }, //驳回
    { id: 7, fullName: t('common.revoke'), theme: 'purple', rowKey: keyName }, //撤回
    { id: 8, fullName: t('common.stopText'), theme: 'red', rowKey: keyName }, //终止
    { id: 9, fullName: t('common.recheckStatus'), theme: 'yellow', rowKey: keyName }, //复检
    { id: 10, fullName: t('comon.reSendSample'), theme: 'blue', rowKey: keyName }, //重新送样
    { id: 11, fullName: t('common.importText'), theme: 'green', rowKey: keyName }, //导入
    { id: 12, fullName: t('common.ending'), theme: 'red', rowKey: keyName }, //结束
    { id: 15, fullName: t('common.backEngineer'), theme: 'red', rowKey: keyName }, //退回工程
    { id: 16, fullName: t('common.reRecommend'), theme: 'purple', rowKey: keyName }, //重新推荐
  ];
}

// 品质流程之后的查询条件
export function getQuanlityFormConfig(hasBtn): FormSchema[] {
  const list = [
    {
      label: '',
      fieldName: 'applyNumber',
      component: 'Input',
      componentProps: {
        placeholder: '需求单号',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'insidePartNumber',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      fieldName: 'insideNumberOld',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '旧版成品编码',
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'materialNumber',
      component: 'Input',
      componentProps: {
        placeholder: '材料流水编码',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'factoryName',
      component: 'Input',
      componentProps: {
        placeholder: '工厂',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'supplierName',
      component: 'Input',
      componentProps: {
        placeholder: '供应商名称',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'manufacturerMaterialsCode',
      component: 'Input',
      componentProps: {
        placeholder: '供应商材料编码',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'applyUserId',
      i18nField: 'pd',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: 'PD',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'purchaseUserId',
      i18nField: 'purchaseUserName',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '开发采购',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    // {
    //   label: '',
    //   fieldName: 'pickerVal',
    //   labelWidth: 100,
    //   component: 'DateRange',
    //   componentProps: {
    //     format: 'YYYY-MM-DD',
    //     submitOnPressEnter: true,
    //   },
    // },
  ];
  if (hasBtn('btn_supplier')) return list;
  return list.filter(item => item.fieldName !== 'supplierName' && item.fieldName !== 'manufacturerMaterialsCode');
}

export const quanlityformConfig = [
  {
    label: '',
    fieldName: 'applyNumber',
    component: 'Input',
    componentProps: {
      placeholder: '需求单号',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'insidePartNumber',
    component: 'Input',
    componentProps: {
      placeholder: '产品内部料号',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'materialNumber',
    component: 'Input',
    componentProps: {
      placeholder: '材料流水编码',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'factoryName',
    component: 'Input',
    componentProps: {
      placeholder: '工厂',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'supplierName',
    component: 'Input',
    componentProps: {
      placeholder: '供应商名称',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'manufacturerMaterialsCode',
    component: 'Input',
    componentProps: {
      placeholder: '供应商材料编码',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'applyUserId',
    i18nField: 'pd',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: 'PD',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'purchaseUserId',
    i18nField: 'purchaseUserName',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '开发采购',
      submitOnPressEnter: true,
    },
  },
  {
    label: '',
    fieldName: 'pickerVal',
    labelWidth: 100,
    component: 'DateRange',
    componentProps: {
      format: 'YYYY-MM-DD',
      submitOnPressEnter: true,
    },
  },
];

export function getQuanlityformConfigVxeDefaultUser() {
  return [
    {
      label: '',
      fieldName: 'applyNumber',
      component: 'Input',
      componentProps: {
        placeholder: '需求单号',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'insidePartNumber',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      fieldName: 'insideNumberOld',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '旧版成品编码',
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'purchaseUserId',
      i18nField: 'purchaseUserName',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '开发采购',
        defaultValue: userStore.userInfo?.userId,
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'materialNumber',
      component: 'Input',
      componentProps: {
        placeholder: '材料流水编码',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'factoryName',
      component: 'Input',
      componentProps: {
        placeholder: '工厂',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'supplierName',
      component: 'Input',
      componentProps: {
        placeholder: '供应商名称',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    // {
    //   label: '',
    //   fieldName: 'manufacturerMaterialsCode',
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '供应商材料编码',
    //     submitOnPressEnter: true,
    //     allowClear: true,
    //   },
    // },
    {
      label: '',
      fieldName: 'originalModelNumber',
      component: 'Input',
      componentProps: {
        placeholder: '原厂商型号',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'applyUserId',
      i18nField: 'pd',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: 'PD',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      fieldName: 'pickerVal',
      label: '',
      labelWidth: 100,
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        submitOnPressEnter: true,
        placehoder: [''],
        allowClear: true,
      },
    },
  ];
}

export const quanlityformConfigVxe = [
  {
    label: '',
    fieldName: 'applyNumber',
    component: 'Input',
    componentProps: {
      placeholder: '需求单号',
      submitOnPressEnter: true,
      allowClear: true,
    },
  },
  {
    label: '',
    fieldName: 'insidePartNumber',
    component: 'Input',
    componentProps: {
      placeholder: '产品内部料号',
      submitOnPressEnter: true,
      allowClear: true,
    },
  },
  {
    fieldName: 'insideNumberOld',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '旧版成品编码',
      allowClear: true,
    },
  },
  {
    label: '',
    fieldName: 'purchaseUserId',
    i18nField: 'purchaseUserName',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: '开发采购',
      submitOnPressEnter: true,
      allowClear: true,
    },
  },
  {
    label: '',
    fieldName: 'materialNumber',
    component: 'Input',
    componentProps: {
      placeholder: '材料流水编码',
      submitOnPressEnter: true,
      allowClear: true,
    },
  },
  {
    label: '',
    fieldName: 'factoryName',
    component: 'Input',
    componentProps: {
      placeholder: '工厂',
      submitOnPressEnter: true,
      allowClear: true,
    },
  },
  {
    label: '',
    fieldName: 'supplierName',
    component: 'Input',
    componentProps: {
      placeholder: '供应商名称',
      submitOnPressEnter: true,
      allowClear: true,
    },
  },
  {
    label: '',
    fieldName: 'manufacturerMaterialsCode',
    component: 'Input',
    componentProps: {
      placeholder: '供应商材料编码',
      submitOnPressEnter: true,
      allowClear: true,
    },
  },
  {
    label: '',
    fieldName: 'applyUserId',
    i18nField: 'pd',
    component: 'CustomUserSelect',
    componentProps: {
      placeholder: 'PD',
      submitOnPressEnter: true,
      allowClear: true,
    },
  },
  // {
  //   fieldName: 'pickerVal',
  //   label: '',
  //   labelWidth: 100,
  //   component: 'RangePicker',
  //   componentProps: {
  //     format: 'YYYY-MM-DD',
  //     submitOnPressEnter: true,
  //     placehoder: [''],
  //   },
  // },
];

export function getQuanlityformConfigVxe(hasBtn) {
  const list = [
    {
      label: '',
      fieldName: 'applyNumber',
      component: 'Input',
      componentProps: {
        placeholder: '需求单号',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'insidePartNumber',
      component: 'Input',
      componentProps: {
        placeholder: '产品内部料号',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      fieldName: 'insideNumberOld',
      label: '',
      component: 'Input',
      componentProps: {
        placeholder: '旧版成品编码',
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'materialNumber',
      component: 'Input',
      componentProps: {
        placeholder: '材料流水编码',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'factoryName',
      component: 'Input',
      componentProps: {
        placeholder: '工厂',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'supplierName',
      component: 'Input',
      componentProps: {
        placeholder: '供应商名称',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'manufacturerMaterialsCode',
      component: 'Input',
      componentProps: {
        placeholder: '供应商材料编码',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'applyUserId',
      i18nField: 'pd',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: 'PD',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'purchaseUserId',
      i18nField: 'purchaseUserName',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: '开发采购',
        submitOnPressEnter: true,
        allowClear: true,
      },
    },
    {
      fieldName: 'pickerVal',
      label: '',
      labelWidth: 100,
      component: 'RangePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
        submitOnPressEnter: true,
        placehoder: [''],
        allowClear: true,
      },
    },
  ];
  if (hasBtn('btn_supplie1r')) return list;
  return list.filter(item => item.fieldName !== 'supplierName' && item.fieldName !== 'manufacturerMaterialsCode');
}

export const IS_OPTION_LIST = [
  {
    id: 1,
    fullName: t('dict.TransferEnum.Yes'),
    value: 1,
    label: t('dict.TransferEnum.Yes'),
  },
  {
    id: 0,
    fullName: t('dict.TransferEnum.No'),
    value: 0,
    label: t('dict.TransferEnum.No'),
  },
];

export const IS_SATISFY_LIST = [
  { id: 1, fullName: t('dict.OpinionTypeEnum.Satisfy'), value: 1, label: t('dict.OpinionTypeEnum.Satisfy'), theme: 'green' },
  { id: 2, fullName: t('dict.OpinionTypeEnum.Discontent'), value: 2, label: t('dict.OpinionTypeEnum.Discontent'), theme: 'yellow' },
];

// 处理状态显示国际化
export function handleStatusDesc(id, list) {
  if (typeof id == 'undefined' || id == null || id == '') {
    return '';
  }
  const findObj = list.find(el => el.id == id);
  if (findObj) {
    return findObj.fullName;
  }
  return '';
}
