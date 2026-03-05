import PccPackageContent from './PccPackage.vue';
import { defineComponent, h } from 'vue';

export function usePccPackage() {
  const PccMaterial = defineComponent((props, { attrs, slots }) => {
    return () => h(PccPackageContent, { ...props, ...attrs }, slots);
  });

  return PccMaterial;
}
