import type { VxeGridInstance } from 'vxe-table';

import type { VxeGridProps, ExtendedFormApi } from './types';

import { toRaw } from 'vue';

import { Store } from '/@/utils/shared/src/index';
import { bindMethods, mergeWithArrayOverride, StateHandler } from '/@/utils/shared/src/index';
import { isBoolean, isFunction } from '/@/utils/is';

// 定义一个函数，用于获取默认的VxeGridProps
function getDefaultState(): VxeGridProps {
  return {
    class: '',
    gridClass: '',
    gridOptions: {},
    gridEvents: {},
    formOptions: undefined,
    showSearchForm: true,
  };
}

export class VxeGridApi {
  public formApi = {} as ExtendedFormApi;

  // private prevState: null | VxeGridProps = null;
  public grid = {} as VxeGridInstance;
  public state: null | VxeGridProps = null;

  public store: Store<VxeGridProps>;
  public superQueryParams: Object | null;

  private isMounted = false;

  private stateHandler: StateHandler;
  private expandStateHandler: null | ((expanded: boolean) => void) = null;

  constructor(options: VxeGridProps = {}) {
    const storeState = { ...options };

    const defaultState = getDefaultState();
    this.store = new Store<VxeGridProps>(mergeWithArrayOverride(storeState, defaultState), {
      onUpdate: () => {
        // this.prevState = this.state;
        this.state = this.store.state;
      },
    });

    this.state = this.store.state;
    this.stateHandler = new StateHandler();
    this.superQueryParams = null;
    bindMethods(this);
  }

  mount(instance: null | VxeGridInstance, formApi: ExtendedFormApi) {
    console.log('mountmountmountmount');
    if (!this.isMounted && instance) {
      this.grid = instance;
      this.formApi = formApi;
      this.stateHandler.setConditionTrue();
      this.isMounted = true;
    }
  }

  async query(params: Record<string, any> = {}) {
    try {
      await this.grid.commitProxy('query', toRaw(params));
    } catch (error) {
      console.error('Error occurred while querying:', error);
    }
  }

  setRowExpand(rows, expanded) {
    return this.grid.setRowExpand(rows, expanded);
  }

  expandAll() {
    if (this.grid?.setAllTreeExpand) {
      this.grid.setAllTreeExpand(true);
    }
  }

  collapseAll() {
    if (this.grid?.clearTreeExpand) {
      return this.grid.clearTreeExpand();
    }
  }

  async reload(params: Record<string, any> = {}) {
    try {
      await this.grid.commitProxy('reload', toRaw(params));
    } catch (error) {
      console.error('Error occurred while reloading:', error);
    }
  }

  // 设置高级查询参数
  setSuperQueryParams(params: { aqp: Object }) {
    this.superQueryParams = params;
  }
  // 清除高级查询参数
  clearSuperQueryParams() {
    this.superQueryParams = null;
  }
  // 获取高级查询参数
  getSuperQueryParams() {
    return this.superQueryParams;
  }

  setGridOptions(options: Partial<VxeGridProps['gridOptions']>) {
    this.setState({
      gridOptions: options,
    });
  }

  setLoading(isLoading: boolean) {
    this.setState({
      gridOptions: {
        loading: isLoading,
      },
    });
  }

  setExpandStateHandler(handler: (expanded: boolean) => void) {
    this.expandStateHandler = handler;
  }

  private notifyExpandState(expanded: boolean) {
    this.expandStateHandler?.(expanded);
  }

  setState(stateOrFn: ((prev: VxeGridProps) => Partial<VxeGridProps>) | Partial<VxeGridProps>) {
    if (isFunction(stateOrFn)) {
      this.store.setState(prev => {
        return mergeWithArrayOverride(stateOrFn(prev), prev);
      });
    } else {
      this.store.setState(prev => {
        return mergeWithArrayOverride(stateOrFn, prev);
      });
    }
  }

  toggleSearchForm(show?: boolean) {
    this.setState({
      showSearchForm: isBoolean(show) ? show : !this.state?.showSearchForm,
    });
    // nextTick(() => {
    //   this.grid.recalculate();
    // });
    return this.state?.showSearchForm;
  }

  // 获取选中的行数据
  getSelectRows() {
    return this.grid.getCheckboxRecords() || [];
  }

  // 获取现有的列
  getColumns() {
    return toRaw(this.grid.getColumns()) || [];
  }

  // 获取选中的行数据的key值
  getSelectRowKeys() {
    const gridOptions = this.state?.gridOptions;
    let rowKey = 'id';
    if (gridOptions) {
      rowKey = gridOptions?.rowConfig?.keyField || rowKey;
    }
    return this.getSelectRows().map(item => item[rowKey]) || [];
  }

  // 刷新表格列
  refreshColumn() {
    return this.grid.refreshColumn();
  }

  // 清除选中行
  clearSelectedRowKeys() {
    return this.grid.clearCheckboxRow();
  }

  // 获取表格的所有数据
  getDataSource() {
    return this.grid.getFullData() || [];
  }

  reloadData(datalist) {
    return this.grid.reloadData(datalist);
  }

  loadData(datalist) {
    // return this.grid.loadData(datalist);
    // loadData 方法在某些情况下会有问题，暂时改用 reloadData
    return this.grid.reloadData(datalist);
  }

  remove(row) {
    return this.grid.remove(row);
  }

  insertAt(rows, index) {
    return this.grid.insertAt(rows, index);
  }
  insertNextAt(rows, index) {
    return this.grid.insertNextAt(rows, index);
  }

  recalculate(refull) {
    return this.grid.recalculate(refull);
  }

  clearData() {
    return this.grid.clearData();
  }
  validate(rows) {
    return this.grid.validate(rows);
  }

  async setAllRowExpand(expanded: boolean) {
    if (!this.grid?.setAllRowExpand) {
      return;
    }
    this.grid.setLoading?.(true);
    try {
      const result = await this.grid.setAllRowExpand(expanded);
      this.notifyExpandState(expanded);
      return result;
    } finally {
      requestAnimationFrame(() => this.grid.setLoading?.(false));
    }
  }

  /**
   * 加载列配置并恢复到初始状态
   * 为了重新加载列时，改变props，重新触发国际化的计算
   */
  async reloadColumn(columns) {
    return this.grid.reloadColumn(columns).then(() => {
      this.setState({
        gridOptions: {
          columns,
        },
      });
    });
  }

  /**
   * 加载列配置
   * 为了重新加载列时，改变props，重新触发国际化的计算
   */
  async loadColumn(columns) {
    return this.grid.loadColumn(columns).then(() => {
      this.setState({
        gridOptions: {
          columns,
        },
      });
    });
  }

  async updateSchema(data) {
    return this.formApi.updateSchema(data);
  }

  // 获取查询参数
  async getFetchParams() {
    let params = {
      ...(this.formApi?.getLatestSubmissionValues?.() || {}),
    };
    const proxyConfig = (await this.grid.getProxyInfo?.()) || {};
    if (proxyConfig && proxyConfig.pager) {
      params.currentPage = proxyConfig.pager.currentPage;
      params.pageSize = proxyConfig.pager.pageSize;
    }
    // 加入表格自身的查询参数
    const filters = (await this.grid.getCheckedFilters?.()) || {};
    if (filters && filters.length > 0) {
      filters.forEach(filter => {
        const searchField = filter?.column?.filterRender?.searchField || filter.field;
        params[searchField] = filter.datas[0];
      });
    }
    // 加入高级查询参数
    if (this.superQueryParams) {
      params.aqp = this.superQueryParams;
    }
    return params;
  }

  // 获取表格数据
  async getFromValue() {
    return this.formApi.getValues();
  }

  /**
   * @description 设置表单的值
   * @param key field字段
   * @param value 填充的值
   * */
  async setFieldValue(key, value) {
    return this.formApi.setFieldValue(key, value);
  }

  async resetForm() {
    return this.formApi.resetForm();
  }

  setLatestSubmissionValues(value) {
    return this.formApi.setLatestSubmissionValues(value);
  }

  /**
   * 自定义校验方法，剔除多余的字段
   * @returns Promise<any>
   */
  async validateFn() {
    return new Promise(async (resolve, reject) => {
      const validateFlag = await this.grid.validate(true);
      if (!validateFlag) {
        try {
          const columns = this.state?.gridOptions?.columns || [];
          const validFields = columns.filter(col => col.field && !['seq', 'action'].includes(col.field as string)).map(col => col.field as string);
          const rawData = toRaw(this.grid.getFullData());
          const filteredData = rawData.map(row => {
            return validFields.reduce((obj, field) => {
              obj[field] = row[field];
              return obj;
            }, {} as Record<string, any>);
          });
          resolve(filteredData);
        } catch (e) {
          reject(new Error('数据过滤失败: ' + (e as Error).message));
        }
      } else {
        reject(validateFlag || new Error('表格校验未通过'));
      }
    });
  }
  /**
   * @description 获取表格数据集（获取插入、删除、更改的数据，对于增删改查表格非常方便）
   */
  getRecordset() {
    return this.grid?.getRecordset() ?? {};
  }

  unmount() {
    this.isMounted = false;
    this.stateHandler.reset();
  }
}
