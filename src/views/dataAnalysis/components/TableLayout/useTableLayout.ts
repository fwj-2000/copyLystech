/*
数据报表通用的页面hook
*/
import { defineComponent, h } from 'vue';
import indexComponent from './index.vue';
import { IHookOptions } from './types';
import Api from './api';

export function useTableLayout(options: IHookOptions): [InstanceType<any>, Api] {
  const api = new Api();
  // 定义组件实例
  const TableLayout = defineComponent(
    (props: {}, { attrs, slots }) => {
      return () => h(indexComponent, { ...props, ...attrs, ...options, api }, slots);
    },
    {
      inheritAttrs: false,
      name: 'tableLayout',
    },
  );

  return [TableLayout, api];
}
