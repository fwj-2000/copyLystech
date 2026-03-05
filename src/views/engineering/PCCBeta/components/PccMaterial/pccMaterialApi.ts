import { bindMethods, mergeWithArrayOverride, StateHandler, Store } from '/@/utils/shared/src';
import { isFunction } from '/@/utils/is';
import { getPccMaterialColumn } from '/@/views/engineering/PCCBeta/components/PccMaterial/config';
import { ref } from 'vue';

export class PccMaterialApi {
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
    // const unsub = this.store.subscribe(() => {
    // 	console.log("🚀 ~  ~ this.state: ", this.state);
    // });
    this.stateHandler = new StateHandler();
    bindMethods(this);
  }

  mount(instance: any) {
    if (!this.isMounted && instance) {
      this.material = instance;
      this.stateHandler.setConditionTrue();
      this.isMounted = true;
    }
  }

  // materialSetState((pre) => { return 1 })
  materialSetState(stateOrFn: ((prev: any) => Partial<any>) | Partial<any>) {
    if (isFunction(stateOrFn)) {
      this.store.setState(prev => {
        return mergeWithArrayOverride(stateOrFn(prev), prev);
      });
    } else {
      this.store.setState(prev => mergeWithArrayOverride(stateOrFn, prev));
    }
  }

  materialGetProcessList() {
    return this.state?.processList || [];
  }

  materialGetStepList() {
    return this.state?.stepDistanceList || [];
  }

  materialGetlist() {
    return this.state?.list || [];
  }

  reloadData(list) {
    return this.material.reloadData(list);
  }

  getDataSource() {
    console.log('🚀 ~ getDataSource ~ his.material: ', this.material);
    return this.material.getDataSource();
  }

  setDisabled(disabled: boolean) {
    this.state.disabled = true;
    const { setGridOptions } = this.material;
    if (disabled) {
      const columns = getPccMaterialColumn(() => {});
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
