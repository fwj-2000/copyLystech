// useTableActions.ts
import { ActionItem } from '/@/components/Table';
import { useMessage } from '/@/hooks/web/useMessage';
import { config, ConfigType, workTypes } from './config';
import { useI18n } from '/@/hooks/web/useI18n';
const { createMessage, createConfirm } = useMessage();
const { t } = useI18n();

export type ButtonType = 'view' | 'edit' | 'delete';
// export type WORKTYPE = 'diecut' | 'manual';

interface TableActionType {
  record: any; // 数据
  openaddModal: any; // 打开指定弹窗的函数
}

const actionsMap = {
  模切: ['view', 'delete'],
  手工: ['view'],
};
/**
 *
 * @param workType 工序类型
 * @param operationType  流转 Exchange = 1 | 报工 ApplyWork = 2
 * @param init 回调函数
 * @returns
 */
export function useTableActions(workType: any, operationType: any, init: Function = () => {}) {
  let curConfig: ConfigType = {};
  const getTableActions = ({ record, openaddModal }: TableActionType): ActionItem[] => {
    if (operationType === 'Exchange ') {
      curConfig = config[operationType];
    } else {
      curConfig = config[workType];
    }
    const actions: ActionItem[] = [];
    const actionKeys = actionsMap[workType] ? actionsMap[workType] : ['view'];
    actionKeys.forEach(key => {
      switch (key) {
        case 'view':
          actions.push({
            icon: 'icon-ym icon-ym-view',
            onClick: () => handleAddFn(record, openaddModal),
            auth: 'btn_detail',
          });
          break;
        case 'delete':
          actions.push({
            icon: 'icon-ym icon-ym-delete',
            onClick: () => handleDeleteFn(record),
            auth: 'btn_remove',
          });
          break;
        case 'edit':
          actions.push({
            icon: 'icon-ym icon-ym-edit',
            onClick: () => handleEditFn(record),
            auth: 'btn_edit',
          });
          break;
        // 可以根据需要添加更多的 case
      }
    });

    return actions;
  };

  const handleAddFn = (data: any, openaddModal: any) => {
    const templistParams = { processName: workType, operationType };
    openaddModal(true, { data, title: data.id ? t('component.upload.view') : '新增模切报数', templistParams });
  };

  const handleDeleteFn = (data: any) => {
    const { deleteTableItem } = curConfig;
    if (!deleteTableItem) return;
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: '此操作将永久删除该数据, 是否继续？',
      onOk: async () => {
        deleteTableItem(data.id).then(res => {
          createMessage.success(res.msg);
          init();
        });
      },
    });
  };

  const handleEditFn = (data: any) => {
    // 实现编辑操作的逻辑
    console.log('编辑操作', data);
  };

  return { getTableActions };
}
