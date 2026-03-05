import type { VxeGridPropTypes } from 'vxe-table';

import { useI18n } from '/@/hooks/web/useI18n';
import { MOLD_MODIFY_TYPE } from '/@/views/engineering/mouldBusiness/apply/components/modifyPopConfig';
import { MEET_OPTIONS } from '../config';

export { downloadMoldDrawings, STATUS_ENUM, STATUS_OPTIONS } from '../config';
export { ITEM_TYPE_ENUM } from '/@/views/engineering/mouldBusiness/components/config';

const { t } = useI18n();

/** 详情 列配置 */
export const COLUMNS: VxeGridPropTypes.Columns = [
  { type: 'seq', width: 50 },
  {
    title: '交期回复',
    field: 'deliveryTime',
    editRender: {
      name: 'DatePicker',
      props: {
        valueFormat: 'YYYY-MM-DD',
        // 如果修改类型包含【申请终止】或【暂停制作】，则价格不可编辑
        dynamicDisabled: (row: any) => isTerminateOrPause(row),
      },
    },
  },
  {
    title: '价格',
    field: 'quotation',
    editRender: {
      name: 'Input',
      props: {
        // 如果修改类型包含【申请终止】或【暂停制作】，则价格不可编辑
        dynamicDisabled: (row: any) => isTerminateOrPause(row),
      },
    },
  },
  { title: '模具料号', field: 'moldNo', width: 150 },
  { title: '模具类型', field: 'moldTypeName', width: 150 },
  { title: '模具备注', field: 'moldRemark', width: 150 },
  { title: '产品类型', field: 'productTypeName', width: 150 },
  { title: '客户要求交期', field: 'requireDeliveryTime', cellRender: { name: 'Date', format: 'YYYY-MM-DD' }, width: 150 },
  { title: '工厂', field: 'factoryName', width: 150 },
  {
    title: '材质',
    field: 'material',
    width: 200,
  },
  {
    title: '工艺是否满足',
    field: 'isProcessMeet',
    cellRender: { name: 'Tag', options: MEET_OPTIONS },
    width: 150,
  },
  {
    title: '不满足原因',
    field: 'notMeetReason',
    width: 200,
  },
  { title: '修改类型', field: 'modifyTypeName', i18nField: 'modifyType', width: 200 },
  { title: '修改原因', field: 'modifyReason', width: 200 },
];

/** 编辑表单校验规则 */
export const editRules = {
  // 交期回复
  deliveryTime: [
    {
      validator: ({ cellValue, row }) => {
        // 如果修改类型不包含【申请终止】或【暂停制作】，则交期回复必填
        if (!isTerminateOrPause(row) && !cellValue) {
          return new Error(t('common.required'));
        }
      },
    },
  ],
  // 价格
  // quotation: [
  //   {
  //     validator: ({ cellValue, row }) => {
  //       // 如果修改类型不包含【申请终止】或【暂停制作】，则价格必填
  //       if (!isTerminateOrPause(row) && !cellValue && cellValue !== 0) {
  //         return new Error(t('common.required'));
  //       }
  //     },
  //   },
  // ],
};

/**
 * 是否包含【申请终止】或【暂停制作】
 * @param row
 * @returns
 */
function isTerminateOrPause(row: { modifyType: Array<number | string> }) {
  return (
    Array.isArray(row.modifyType) &&
    row.modifyType.some((el: number | string) => `${el}` === MOLD_MODIFY_TYPE.申请终止 || `${el}` === MOLD_MODIFY_TYPE.暂停制作)
  );
}
