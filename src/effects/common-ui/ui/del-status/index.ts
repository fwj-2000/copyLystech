import { i18n } from '/@/locales/setupI18n';
import { h } from 'vue';

import { Checkbox } from 'ant-design-vue';

/**
 * 渲染`显示删除数据`工具栏
 * @param props
 * @returns
 */
export function renderToolbarToolDelStatus(renderOpts: any) {
  return h(
    Checkbox,
    renderOpts.props,
    // @ts-ignore
    i18n.global.t('common.showDelCol'),
  );
}

export { useDelStatus } from './useDelStatus';
