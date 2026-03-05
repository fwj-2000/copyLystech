import { useStore } from '/@/utils/shared/src/store';
import { defineComponent, h, onBeforeUnmount, Ref } from 'vue';
import { PccTestStripApi } from '/@/views/engineering/PCCBeta/components/TestStrip/pccTestStripApi';
import PccTestStripContent from '/@/views/engineering/PCCBeta/components/TestStrip/PccTestStrip.vue';

export type ExtendedApi = PccTestStripApi & {
  useStore: <T = {}>(selector?: (state: NoInfer<{}>) => T) => Readonly<Ref<T>>;
};

export function usePccTestStrip(): [ReturnType<typeof defineComponent>, ExtendedApi] {
  const api = new PccTestStripApi();
  const extendedApi: ExtendedApi = api as ExtendedApi;

  extendedApi.useStore = selector => {
    console.log('🚀 ~ useStore ~ selector: ', selector);
    return useStore(api.store, selector);
  };

  const PccTestStrip = defineComponent(
    (props, { attrs, slots }) => {
      onBeforeUnmount(() => {
        api.unmount();
      });
      return () => h(PccTestStripContent, { ...props, ...attrs, api: extendedApi }, slots);
    },
    {
      inheritAttrs: false,
      name: 'PccTestStrip',
    },
  );

  return [PccTestStrip, extendedApi];
}
