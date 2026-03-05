import type { VxeGridPropTypes } from 'vxe-table';

import { createVNode, render, getCurrentInstance, onMounted, onBeforeUnmount, defineComponent } from 'vue';
import { useModal } from '/@/components/Modal';
import { useAppProviderContext } from '/@/components/Application';
import { transformI18nVxeTable } from '/@/utils';
import { SUB_COLUMNS } from './config';

import ExpandedTable from './expandedTable.vue';
import ExpandCustomModal from './expandCustomModal.vue';

// 默认props配置
const DEFAULT_PROPS = { columns: SUB_COLUMNS, i18nModuleCode: 'MoldApplyColumn' };

/**
 * 展开子表组件hook
 * @param props 配置项
 * @param props.columns 列配置数据
 * @param props.i18nModuleCode 国际化代码
 * @returns 展开子表组件`ExpandedTable`；打开子表自定义列弹窗`openExpandCustomModal`；
 */
export function useExpandedTable(props: { columns?: VxeGridPropTypes.Columns; i18nModuleCode?: string } = DEFAULT_PROPS) {
  const [registerCustomModal, { openModal: openCustomModal, closeModal: closeCustomModal }] = useModal();

  const parentInstance = getCurrentInstance();
  // 获取当前组件的AppProvider上下文
  const appContext = useAppProviderContext();
  const modalVNode = createVNode(ExpandCustomModal, { onRegister: registerCustomModal, appProviderContext: appContext });

  // 在创建VNode后立即设置应用上下文, 确保组件在初始化时就能访问到路由等全局状态
  if (parentInstance?.appContext) {
    modalVNode.appContext = parentInstance.appContext;
  }

  // 渲染弹窗到容器
  onMounted(() => {
    // 创建容器
    parentInstance?.proxy?.$el && render(modalVNode, parentInstance.proxy.$el);
  });

  // 组件卸载时，移除弹窗容器
  onBeforeUnmount(() => {
    closeCustomModal();
    render(null, parentInstance?.proxy?.$el);
  });

  /** 列配置 */
  const columns = props.i18nModuleCode && props.columns ? [...transformI18nVxeTable(props.columns, props.i18nModuleCode)] : props.columns || [];

  return {
    /** 展开子表组件 */
    ExpandedTable: defineComponent({
      name: 'WrappedExpandedTable',
      props: ExpandedTable.props,
      setup(wrappedProps: InstanceType<typeof ExpandedTable>['$props'], { slots }) {
        const { columns: wrappedPropsColumns } = wrappedProps;
        // 合并默认props和传入的props
        return () =>
          createVNode(
            ExpandedTable,
            { ...wrappedProps, columns: Array.isArray(wrappedPropsColumns) && wrappedPropsColumns.length > 0 ? wrappedPropsColumns : columns },
            slots,
          );
      },
    }),
    /**
     * 打开自定义列配置弹窗
     * @param data 初始化数据
     * @param data.columns 列配置数据，可选
     * @param data.callback 点击"确认"保存成功之后的回调函数，可选
     */
    openExpandCustomModal: (data: { columns?: VxeGridPropTypes.Columns; callback?: Function }) =>
      openCustomModal(true, { columns: Array.isArray(data?.columns) ? data.columns : columns, callback: data?.callback }),
  };
}
