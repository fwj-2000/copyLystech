import { bindMethods, mergeWithArrayOverride, StateHandler, Store } from '/@/utils/shared/src';
import { isFunction } from '/@/utils/is';
import { getMaterialColumn } from './config';
import { ref } from 'vue';
import { useI18n } from '/@/hooks/web/useI18n';
import { rowData } from './config';

const { t } = useI18n();

export class MaterialApi {
  public materialGrid = {} as any;
  public state: null | any = null;

  public store: Store<any>;
  public disabled = ref(false);

  private isMounted = false;
  private stateHandler: StateHandler;

  constructor(options: any = {}) {
    const storeState = { ...options };

    this.store = new Store<any>(mergeWithArrayOverride(storeState, {}), {
      onUpdate: () => {
        this.state = this.store.state;
      },
    });
    this.state = this.store.state;
    this.stateHandler = new StateHandler();
    bindMethods(this);
  }

  mount(instance: null | any) {
    if (!this.isMounted && instance) {
      this.materialGrid = instance;
      this.stateHandler.setConditionTrue();
      this.isMounted = true;
    }
  }

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
    return this.materialGrid.reloadData(list);
  }

  getDataSource() {
    return this.materialGrid.getDataSource();
  }

  // 初始化材料列表
  setInitMaterialList() {
    return this.materialGrid.reloadData([{ ...rowData }]);
  }

  // 校验
  validateMaterialList() {
    return new Promise((resolve, reject) => {
      const list = this.materialGrid.getDataSource();
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (!item.stepDistanceNumber) {
          reject(t('dict.PCCColumn.inputMaterialStepPitchGroupNumber', [i + 1]));
          return;
        }
        if (!item.shortMaterialCode) {
          reject(t('dict.PCCColumn.inputMaterialEightDigitCode', [i + 1]));
          return;
        }
        if (!item.originPartNumber) {
          reject(t('dict.PCCColumn.inputMaterialOriginPartNumber', [i + 1]));
          return;
        }
        if (!item.materialCode) {
          reject(t('dict.PCCColumn.inputMaterialOriginPartNumber', [i + 1]));
          return;
        }
        if (!item.materialDosage) {
          reject(t('dict.PCCColumn.inputMaterialUsageMultiplier', [i + 1]));
          return;
        }
        if (!item.qty) {
          reject(t('dict.PCCColumn.inputMaterialUsageMultiplierTip', [i + 1]));
          return;
        }
        if (!item.purchaseUnit) {
          reject(t('dict.PCCColumn.inputMaterialUnit', [i + 1]));
          return;
        }
      }
      resolve(list);
    });
  }

  setDisabled(disabled: boolean) {
    this.disabled.value = disabled;
    const { setGridOptions } = this.materialGrid;
    if (disabled) {
      const columns = getMaterialColumn();
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
