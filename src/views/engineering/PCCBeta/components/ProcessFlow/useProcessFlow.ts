import ProcessFlowContent from './ProcessFlow.vue';
import { defineComponent, h } from 'vue';

export function useProcessFlow() {
  const ProcessFlow = defineComponent((props, { attrs, slots }) => {
    return () => h(ProcessFlowContent, { ...props, ...attrs }, slots);
  });

  return {
    ProcessFlow,
  };
}
