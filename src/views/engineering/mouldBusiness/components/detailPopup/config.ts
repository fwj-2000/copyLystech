import { ADD_COLUMNS } from '/@/views/engineering/mouldBusiness/apply/components/config';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { h, ref } from 'vue';
import { MOLD_MODIFY_TYPE } from '/@/views/engineering/mouldBusiness/apply/components/modifyPopConfig';
import { MOLD_PHYSICAL_STATUS, confirmModifyOptions } from '../config';

import { RadioGroup, Radio } from 'ant-design-vue';

export { handleAfterPaster } from '/@/views/engineering/mouldBusiness/apply/components/handlePaster';
export { ITEM_TYPE_ENUM } from '/@/views/engineering/mouldBusiness/components/config';
/** 编辑规则 */
export { getAddEeditRules as getEditRules } from '/@/views/engineering/mouldBusiness/apply/components/config';

const { t } = useI18n();
const { createConfirm } = useMessage();

/** 获取通用列配置 */
function getCommonCols() {
  const cols = [...ADD_COLUMNS];
  // 获取仓位所在位置
  const index = cols.findIndex(item => item.field === 'shippingSpaceCode');

  if (index !== -1) {
    // 仓位显示调整
    cols.splice(index, 1, {
      field: 'shippingSpaceCode',
      title: '仓位',
      width: 200,
      formatter: ({ row }: any) => {
        return [row.shippingSpaceCode, row.shippingSpaceName].filter(Boolean).join('/');
      },
    });
  }

  return cols;
}

/** 数据表格列配置 */
export const COLUMNS = [
  ...getCommonCols(),
  {
    title: '脱敏图纸',
    field: 'drawingshistory',
    width: 150,
    slots: { default: 'drawingshistory' },
  },
];

/** 纯详情页面列配置 */
export function getDetailColumns() {
  const columns = [...COLUMNS];
  const checkboxIndex = columns.findIndex(item => item.type === 'checkbox');

  columns.splice(
    checkboxIndex === 0 ? 1 : 0,
    0,
    {
      title: '单据类型',
      field: 'itemTypeName',
      width: 80,
    },
    {
      title: '修改类型',
      field: 'modifyTypeName',
      width: 150,
    },
    {
      title: '修改原因',
      field: 'modifyReason',
      width: 200,
    },
  );

  return columns;
}

/** 对比表格列配置 */
export function getCompareColumns() {
  const list = [...COLUMNS];
  list.splice(
    list.findIndex(item => item.field === 'moldDrawings') + 1,
    0,
    {
      title: '修改类型',
      field: 'modifyTypeName',
      width: 150,
    },
    {
      title: '修改原因',
      field: 'modifyReason',
      width: 200,
    },
  );
  return list;
}

/** 弹窗模式 */
export enum DETAIL_POPUP_MODE {
  /** 编辑模式 */
  编辑 = 'edit',
  /** 审核模式 */
  审核 = 'audit',
  /** 详情模式 */
  详情 = 'detail',
}

/**
 * 确认修改模具物理状态: 如果修改类型是  申请终止，则采购同意的时候，弹窗让用户勾选是否存在模具实物
 * @param rows 选中的行数据
 * @returns
 */
export function confirmModify(rows: Array<any>) {
  const value = ref(MOLD_PHYSICAL_STATUS.有实物回仓);

  return new Promise<string>((resolve, reject) => {
    if (rows.every(item => !Array.isArray(item.modifyType) || item.modifyType.every((type: number | string) => `${type}` !== MOLD_MODIFY_TYPE.申请终止))) {
      return resolve('');
    }

    return createConfirm({
      iconType: 'warning',
      title: t('dict.MoldApply.moldPhysicalCondition'),
      content: h(
        RadioGroup,
        {
          value: value,
          onChange: e => {
            value.value = e.target.value;
          },
        },
        confirmModifyOptions.map((o, i) => h(Radio, { value: o.value, style: { marginTop: i > 0 ? '8px' : '0px' } }, o.label)),
      ),
      onOk: () => {
        resolve(value.value);
      },
      onCancel: () => {
        reject(new Error(t('common.cancel')));
      },
    });
  });
}
