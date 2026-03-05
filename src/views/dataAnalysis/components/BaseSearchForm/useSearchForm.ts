/*
数据报表通用的搜索表单
*/

import { defineComponent, h } from 'vue';

import indexComponent from './index.vue';
import { IHookOptions } from './types';
import Api from './api';

export function useSearchForm(options: IHookOptions): [InstanceType<any>, Api] {
  const api = new Api();
  // 定义组件实例
  const SearchForm = defineComponent(
    (props: any, { attrs, slots }) => {
      return () => h(indexComponent, { ...props, ...attrs, ...options, api }, slots);
    },
    {
      inheritAttrs: false,
      name: 'baseSearchForm',
    },
  );

  return [SearchForm, api];
}
