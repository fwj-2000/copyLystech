import type { VxeGridPropTypes } from 'vxe-table';

import { IS_MEET_OPTIONS, IS_MEET_ENUM } from '../config';
import { useI18n } from '/@/hooks/web/useI18n';
import { confirmModifyOptions } from '/@/views/engineering/mouldBusiness/components/config';
import { MOLD_MODIFY_TYPE } from '/@/views/engineering/mouldBusiness/apply/components/modifyPopConfig';

export { downloadMoldDrawings, STATUS_ENUM, STATUS_OPTIONS } from '../config';
export { ITEM_TYPE_ENUM } from '/@/views/engineering/mouldBusiness/components/config';

const { t } = useI18n();

/** 评审【新增】数据 表格列配置 */
export const ADD_COLUMNS: VxeGridPropTypes.Columns = [
  { type: 'seq', width: 50 },
  // 下一节点处理人(PMC)
  {
    title: t('dict.CommonCol.nextHandler', ['PMC']),
    field: 'designatedPmcReviewerId',
    editRender: {
      name: 'CustomUserSelect',
    },
  },
  {
    title: '材质',
    field: 'material',
    width: 280,
    editRender: {
      enabled: true,
    },
    slots: {
      edit: 'editMaterial',
    },
  },
  {
    title: '交期回复',
    field: 'deliveryTime',
    editRender: {
      name: 'DatePicker',
      props: {
        valueFormat: 'YYYY-MM-DD',
      },
    },
  },
  {
    title: '工艺是否满足',
    field: 'isProcessMeet',
    editRender: {
      name: 'ASelect',
      props: {
        options: IS_MEET_OPTIONS,
        fieldNames: {
          label: 'fullName',
          value: 'id',
        },
        onChange: (isProcessMeet: number | string, _data: any, { row }) => {
          if (`${isProcessMeet}` === IS_MEET_ENUM.满足) {
            row.notMeetReason = '';
          } else {
            row.deliveryTime = null;
          }
        },
      },
    },
  },
  {
    title: '不满足原因',
    field: 'notMeetReason',
    editRender: {
      name: 'Input',
      props: {
        dynamicDisabled: (row: any) => `${row.isProcessMeet}` === IS_MEET_ENUM.满足,
      },
    },
  },
  { title: '模具料号', field: 'moldNo', width: 150 },
  { title: '模具类型', field: 'moldTypeName', width: 150 },
  { title: '模具备注', field: 'moldRemark', width: 150 },
  { title: '产品类型', field: 'productTypeName', width: 150 },
  { title: '客户要求交期', field: 'requireDeliveryTime', cellRender: { name: 'Date', format: 'YYYY-MM-DD' }, width: 150 },
  { title: '工厂', field: 'factoryName', width: 150 },
];

/** 评审【修改】数据 表格列配置 */
export const MODIFY_COLUMNS: VxeGridPropTypes.Columns = [
  { type: 'seq', width: 50 },
  {
    title: '模具实物状态',
    field: 'moldPhysicalStatus',
    width: 260,
    editRender: {
      name: 'ASelect',
      props: {
        options: confirmModifyOptions,
        // 如果修改类型不包含【申请终止】，则该项不可编辑
        dynamicDisabled: (row: any) => !Array.isArray(row.modifyType) || row.modifyType.every((el: number | string) => `${el}` !== MOLD_MODIFY_TYPE.申请终止),
      },
    },
  },
  // 下一节点处理人(PMC)
  {
    title: t('dict.CommonCol.nextHandler', ['PMC']),
    field: 'designatedPmcReviewerId',
    editRender: {
      name: 'CustomUserSelect',
    },
  },
  {
    title: '材质',
    field: 'material',
    width: 280,
    editRender: {
      enabled: true,
    },
    slots: {
      edit: 'editMaterial',
    },
  },
  {
    title: '交期回复',
    field: 'deliveryTime',
    editRender: {
      name: 'DatePicker',
      props: {
        valueFormat: 'YYYY-MM-DD',
        // 修改类型为：【暂停制作】【申请终止】则交期回复置灰不能改
        dynamicDisabled: (row: any) =>
          Array.isArray(row.modifyType) &&
          row.modifyType.some((el: number | string) => `${el}` === MOLD_MODIFY_TYPE.申请终止 || `${el}` === MOLD_MODIFY_TYPE.暂停制作),
      },
    },
  },
  {
    title: '工艺是否满足',
    field: 'isProcessMeet',
    editRender: {
      name: 'ASelect',
      props: {
        options: IS_MEET_OPTIONS,
        fieldNames: {
          label: 'fullName',
          value: 'id',
        },
        onChange: (isProcessMeet: number | string, _data: any, { row }) => {
          if (`${isProcessMeet}` === IS_MEET_ENUM.满足) {
            row.notMeetReason = '';
          } else {
            row.deliveryTime = null;
          }
        },
      },
    },
  },
  {
    title: '不满足原因',
    field: 'notMeetReason',
    editRender: {
      name: 'Input',
      props: {
        dynamicDisabled: (row: any) => `${row.isProcessMeet}` === IS_MEET_ENUM.满足,
      },
    },
  },
  { title: '模具料号', field: 'moldNo', width: 150 },
  { title: '修改类型', field: 'modifyTypeName', width: 100 },
  { title: '修改原因', field: 'modifyReason', width: 200 },
  { title: '模具类型', field: 'moldTypeName', width: 150 },
  { title: '模具备注', field: 'moldRemark', width: 150 },
  { title: '产品类型', field: 'productTypeName', width: 150 },
  { title: '客户要求交期', field: 'requireDeliveryTime', cellRender: { name: 'Date', format: 'YYYY-MM-DD' }, width: 150 },
  { title: '工厂', field: 'factoryName', width: 150 },
];

/** 编辑表单校验规则 */
export const editRules = {
  // 模具实物状态
  moldPhysicalStatus: [
    {
      validator: ({ cellValue, row }) => {
        // 当存在修改类型时，如果修改类型包含【申请终止】，模具实物状态不能为空
        if (Array.isArray(row.modifyType) && row.modifyType.some((el: number | string) => `${el}` === MOLD_MODIFY_TYPE.申请终止) && !cellValue) {
          return new Error(t('dict.MouldRoom.moldPhysicalStatusRequiredTip'));
        }
      },
    },
  ],
  // 下一节点处理人(PMC)
  designatedPmcReviewerId: [{ required: true, message: t('common.required') }],
  // // 材质
  // material: [{ required: true, message: t('common.required') }],
  // // 工艺是否满足
  // isProcessMeet: [{ required: true, message: t('common.required') }],
  // // 不满足原因
  // notMeetReason: [
  //   {
  //     validator: ({ cellValue, row }) => {
  //       // 不满足时，校验不满足原因是否为空
  //       if (`${row.isProcessMeet}` === IS_MEET_ENUM.不满足 && !cellValue) {
  //         return new Error(t('dict.MouldRoom.notMeetReasonRequiredTip'));
  //       }
  //     },
  //   },
  // ],
};
