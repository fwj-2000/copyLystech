import SignatureContent from './Signature.vue';
import { defineComponent, h, ref } from 'vue';
import type { VxeGridProps } from '/@/effects/plugins/vxe-table/types';
import { bindMethods, mergeWithArrayOverride, StateHandler, Store } from '/@/utils/shared/src';
import { useStore } from '/@/utils/shared/src/store';

class SignatureApi {
  public store;
  public signature = {};
  public state = null;

  private isMounted = false;

  constructor() {
    bindMethods(this);

    this.store = new Store<VxeGridProps>(mergeWithArrayOverride({}, {}), {
      onUpdate: () => {
        // this.prevState = this.state;
        this.state = this.store.state;
      },
    });
  }

  mount(instance) {
    if (!this.isMounted && instance) {
      this.signature = instance;
    }
  }

  unmount() {
    this.isMounted = false;
  }
}

export function useSignature() {
  const extendedApi = new SignatureApi();

  extendedApi.useStore = selector => {
    return useStore(extendedApi.store, selector);
  };
  // const proxy = {
  // 	clear: () => signatureRef.value?.clear(),
  // };

  console.log(extendedApi);

  const Signature = defineComponent((props, { attrs, slots }) => {
    return () => h(SignatureContent, { ...props, ...attrs, api: extendedApi }, slots);
  });

  return [Signature, extendedApi];
}
