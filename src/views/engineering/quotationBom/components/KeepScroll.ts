/**
 * 由于这个组件只用于调用 useKeepScroll，保持滚动位置，不渲染实际内容
 */

import useKeepScroll from '/@/hooks/event/useKeepScroll';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'KeepScroll',
  setup() {
    useKeepScroll({
      getScrollDom: () => {
        const _dom = document.querySelector('.getScrollValue');
        return _dom?.children[0] as HTMLElement;
      },
    });

    // 由于这个组件只用于调用 hook，不渲染任何内容，返回空的渲染函数
    return () => null;
  },
});
