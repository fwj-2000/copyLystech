import { bindMethods, mergeWithArrayOverride, StateHandler, Store } from '/@/utils/shared/src';
import { ref } from 'vue';
import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
import { getPccTestStripColumn } from '/@/views/engineering/PCCBeta/components/TestStrip/config';

export class PccTestStripApi {
  public material = {} as any;
  public state: any = null;

  public store: Store<any>;
  public disabled = ref(false);

  private isMounted = false;
  private readonly stateHandler: StateHandler;

  constructor(options: any = {}) {
    const storeState = { ...options };

    this.store = new Store<any>(mergeWithArrayOverride(storeState, {}), {
      onUpdate: () => {
        console.log('🚀 ~ onUpdate ~ this.store.state: ', this.store.state);
        this.state = this.store.state;

        setTimeout(() => {
          console.log('setTimeout this.store.state', this.store.state);
        }, 2000);
      },
    });
    this.state = this.store.state;
    this.stateHandler = new StateHandler();
    bindMethods(this);
  }

  mount(instance: any) {
    console.log('🚀 ~ teststri mount ~ instance: ', instance);
    if (!this.isMounted && instance) {
      this.material = instance;
      this.stateHandler.setConditionTrue();
      this.isMounted = true;
    }
  }

  async reloadData(list) {
    console.log('🚀 ~ reloadData ~ reloadData: ');
    // await this.material.loadData([]);
    return requestIdleCallbackAdapter(() => {
      this.material.reloadData(list);
    });
  }

  async loadData(list) {
    console.log('🚀 ~ loadData ~ loadData: ');
    console.log('🚀 ~ loadData ~ this.material: ', this.material);
    // this.material?.clearData?.();
    // await nextTick();
    return this.material.loadData(list);
  }

  getDataSource() {
    // console.log("🚀 ~ getDataSource ~ getDataSource: ", this.material.getDataSource());
    return this.material.getDataSource();
  }

  setDisabled(disabled: boolean) {
    this.state.disabled = true;
    const { setGridOptions } = this.material;
    if (disabled) {
      const columns = getPccTestStripColumn();
      columns.pop();
      setGridOptions({
        columns,
        editConfig: {
          enabled: false,
        },
        keyboardConfig: {
          isEdit: false,
          isPaste: false,
        },
      });
    }
  }

  unmount() {
    this.isMounted = false;
    this.stateHandler.reset();
  }
}
