import type { VxeGridInstance } from 'vxe-table';
import type { ShallowRef } from 'vue';

import { computed, ref, h, watch } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';

export const DEL_STATUS_KEY = '_deleteMark';

const PARAM_KEY = 'deleteMark';

/**
 * 设置`删除状态`列
 * @param columns
 * @returns
 */
function _setDeleteMarkColumn(columns: Array<any>) {
  if (!columns || !Array.isArray(columns)) {
    return false;
  }
  const targetIndex = columns.findIndex(item => item.field && !item.type);
  if (targetIndex === -1) {
    return false;
  }
  const { t } = useI18n();
  columns.splice(targetIndex, 0, {
    title: t('component.basicTable.dataStatus'),
    field: PARAM_KEY,
    type: PARAM_KEY,
    width: 100,
    visible: false,
    slots: {
      default: ({ row }) => {
        const _delStatus = row[PARAM_KEY] && row[PARAM_KEY] != 0;
        const _color = _delStatus ? '#FF4D4F' : '#52C41A';
        const _text = _delStatus ? t('common.delText') : t('common.normalText');
        return h('span', { style: { color: _color } }, _text);
      },
    },
  });
  return;
}

/**
 * 显示删除数据的hook
 * @param options
 */
export function useDelStatus(options: any, gridRef: Readonly<ShallowRef<VxeGridInstance | null>>) {
  const delStatus = ref(options[DEL_STATUS_KEY]);

  function setDelStatus(status: 1 | 0) {
    delStatus.value = status;
  }

  const isHasDelStatus = computed(() => {
    return options.value?.toolbarConfig?.delStatus;
  });

  const delStatusParams = computed(() => {
    return isHasDelStatus.value && delStatus.value ? { [PARAM_KEY]: 1 } : {};
  });

  /**
   * 设置`删除状态`列
   * @param columns
   * @returns
   */
  function setDeleteMarkColumn(columns: Array<any>) {
    if (!isHasDelStatus.value) {
      return false;
    }
    _setDeleteMarkColumn(columns);
  }

  watch(
    () => delStatusParams.value,
    () => {
      if (!isHasDelStatus.value || !gridRef.value) {
        return false;
      }
      delStatus.value ? gridRef.value.showColumn(PARAM_KEY) : gridRef.value.hideColumn(PARAM_KEY);
    },
    { deep: true },
  );

  return { delStatusParams, setDelStatus, setDeleteMarkColumn };
}
