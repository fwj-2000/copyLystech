import PccMaterialContent from './Material.vue';
import { defineComponent, h, onBeforeUnmount } from 'vue';
import { MaterialApi } from './MaterialApi';
import { useStore } from '/@/utils/shared/src/store';
import { Ref } from 'vue';

export type ExtendedApi = MaterialApi & {
  useStore: <T = {}>(selector?: (state: NoInfer<{}>) => T) => Readonly<Ref<T>>;
};

export function useMaterial(): [ReturnType<typeof defineComponent>, ExtendedApi] {
  const api = new MaterialApi();
  const extendedApi: ExtendedApi = api as ExtendedApi;
  extendedApi.useStore = selector => {
    return useStore(api.store, selector);
  };

  const Material = defineComponent(
    (props, { attrs, slots }) => {
      onBeforeUnmount(() => {
        api.unmount();
      });
      return () => h(PccMaterialContent, { ...props, ...attrs, api: extendedApi }, slots);
    },
    {
      inheritAttrs: false,
      name: 'Material',
    },
  );

  return [Material, extendedApi];
}
