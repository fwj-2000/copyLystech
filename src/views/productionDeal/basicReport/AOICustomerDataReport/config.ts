import dayjs from 'dayjs';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
// 主页form配置
export const schema = [
  {
    // 产品
    fieldName: 'product',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: t('dict.CommonCol.product'),
      allowClear: true,
    },
  },
  {
    fieldName: 'serialNumbers',
    label: '',
    component: 'Textarea',
    componentProps: {
      placeholder: 'SN',
      allowClear: true,
      rows: 1,
    },
  },
  {
    fieldName: 'pickerVal',
    label: '',
    component: 'RangePicker',
    defaultValue: [dayjs().subtract(1, 'days'), dayjs()],
    componentProps: {
      format: 'YYYY-MM-DD HH:mm',
      placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
    },
  },
  {
    // 结果
    fieldName: 'result',
    label: '',
    component: 'Select',
    componentProps: {
      fieldNames: {
        value: 'code',
        label: 'name',
      },
      options: [
        { code: 'OK', name: 'OK' }, // 待发送
        { code: 'NG', name: 'NG' }, // 发送中
      ],
      placeholder: t('common.result'),
      allowClear: true,
    },
  },
  {
    // 发送状态
    fieldName: 'sendStatus',
    label: '',
    component: 'Select',
    componentProps: {
      fieldNames: {
        value: 'code',
        label: 'name',
      },
      options: [
        { code: 1, name: '待提交' }, // 待发送
        { code: 2, name: '审核中' }, // 发送中
        { code: 3, name: '审核失败' }, // 发送失败
        { code: 4, name: '待发送' }, // 发送成功
        { code: 5, name: '发送中' }, // 发送成功
        { code: 6, name: '发送失败' }, // 发送成功
        { code: 6, name: '发送成功' }, // 发送成功
      ],
      placeholder: t('dict.CommonCol.deliveryStatus'),
      allowClear: true,
    },
  },
  {
    fieldName: 'sNLevel',
    label: '',
    component: 'Input',
    componentProps: {
      placeholder: '等级',
      allowClear: true,
    },
  },
];

// 主页表格column配置
export const column = [
  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: '60',
    fixed: 'right',
  },
];

export const pushRecordColumn = [
  {
    title: '单据ID',
    field: 'billId',
  },
  {
    title: '推送主题',
    field: 'title',
  },
  {
    title: '业务标识',
    field: 'tag',
    width: 100,
  },
  {
    title: '推送类型',
    field: 'transfertype',
    width: 80,
  },
  {
    title: '单据备注',
    field: 'billremark',
  },
  {
    title: '推送内容',
    field: 'inputtext',
  },
  {
    title: '响应结果',
    field: 'outputtext',
    width: 80,
  },
  {
    title: '状态',
    field: 'status',
    cellRender: {
      name: 'Tag',
      options: [
        { id: 1, fullName: t('dict.CommonCol.toBeSent'), theme: 'gray', rowKey: 'statusDesc' },
        { id: 2, fullName: t('dict.CommonCol.sending'), theme: 'blue', rowKey: 'statusDesc' },
        { id: 3, fullName: t('dict.CommonCol.failedToSend'), theme: 'red', rowKey: 'statusDesc' },
        { id: 4, fullName: t('dict.CommonCol.sentSuccessfully'), theme: 'green', rowKey: 'statusDesc' },
      ],
    },
    width: 100,
  },
  {
    title: '响应消息',
    field: 'msg',
    width: 200,
  },
  {
    title: '推送次数',
    field: 'times',
    width: 80,
  },
];
