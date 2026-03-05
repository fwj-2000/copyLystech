import PccMaterialContent from './PccMaterial.vue';
import { defineComponent, h, onBeforeUnmount } from 'vue';
import { PccMaterialApi } from '/@/views/engineering/PCCBeta/components/PccMaterial/pccMaterialApi';
import { useStore } from '/@/utils/shared/src/store';
import type { Ref } from 'vue';

export type ExtendedApi = PccMaterialApi & {
  useStore: <T = {}>(selector?: (state: NoInfer<{}>) => T) => Readonly<Ref<T>>;
};

export function usePccMaterial(): [ReturnType<typeof defineComponent>, ExtendedApi] {
  const api = new PccMaterialApi();
  const extendedApi: ExtendedApi = api as ExtendedApi;
  extendedApi.useStore = selector => {
    return useStore(api.store, selector);
  };

  const PccMaterial = defineComponent(
    (props, { attrs, slots }) => {
      onBeforeUnmount(() => {
        api.unmount();
      });
      return () => h(PccMaterialContent, { ...props, ...attrs, api: extendedApi }, slots);
    },
    {
      inheritAttrs: false,
      name: 'PccMaterial',
    },
  );

  return [PccMaterial, extendedApi];
}
