import HalfPartContent from './PccMaterial.vue';
import { defineComponent, h } from 'vue';
import { Ref } from 'vue';

export type ExtendedApi = {
  useStore: <T = {}>(selector?: (state: NoInfer<{}>) => T) => Readonly<Ref<T>>;
};

export function useHalfPart(): [ReturnType<typeof defineComponent>] {
  const HalfPart = defineComponent(
    (props, { attrs, slots }) => {
      return () => h(HalfPartContent, { ...props, ...attrs }, slots);
    },
    {
      inheritAttrs: false,
      name: 'HalfPart',
    },
  );

  return [HalfPart];
}
