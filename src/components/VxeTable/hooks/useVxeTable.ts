import { reactive, ref } from 'vue';
import { BasicTableProps, VxeGridInstance } from '/@/components/VxeTable';
function deepMerge<T>(target: T, source: Partial<T>): T {
  const output = { ...target };
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key] as any;
    }
  }
  return output;
}
interface UseVxeTableOptions {
  apiFn?: (params: any) => Promise<any>; // API 函数
  columns: any[]; // 列配置
  formSchema?: any[]; // 表单配置
  customGridOptions?: Partial<BasicTableProps>; // 自定义表格配置
  beforeFetch?: (params: any) => any; // 请求前的钩子函数
}
export function useVxeTable(options: UseVxeTableOptions) {
  const { apiFn, columns, formSchema, customGridOptions, beforeFetch } = options;
  const state = reactive<{ tableData: Array<any> }>({
    tableData: [],
  });

  const tableRef = ref<VxeGridInstance>();
  const searchForm = ref<any>({}); // 保存查询表单数据

  // 默认的 gridOptions 配置
  const defaultGridOptions = reactive<BasicTableProps>({
    border: false,
    loading: false,
    stripe: true,
    showOverflow: true,
    showFooter: true,
    height: 'auto',
    columnConfig: {
      resizable: true, // 启用列宽拖拽调整宽度
      drag: false, // 启用行拖拽调整顺序
      useKey: true,
    },
    resizableConfig: {
      //   isDblclickAutoWidth: true, // 启用双击自适应列宽
    },
    rowConfig: {
      drag: true, // 启用行拖拽调整顺序
      useKey: true,
    },
    treeConfig: {
      transform: true,
      rowField: 'Id',
      parentField: 'parentId',
      //   childrenField: 'children',
    },
    formConfig: {
      //   enabled: !!formSchema.length,
      titleWidth: 80,
      titleAlign: 'right',
      items: formSchema,
    },
    // exportConfig: {
    //   columns: columns,
    //   data: state.tableData,
    //   types: ['xlsx'],
    //   filename() {
    //     return `${Date.now()}`;
    //   },
    //   sheetName() {
    //     return `${Date.now()}`;
    //   },
    // },
    toolbarConfig: {
      custom: false,
      zoom: false,
      refresh: false,
      export: false,
      print: false,
      //   slots: {
      //     buttons: 'toolbarButtons',
      //   },
    },
    checkboxConfig: {
      range: true,
    },
    mouseConfig: {
      area: false, // 是否开启区域选取
    },
    areaConfig: {
      multiple: false, // 是否启用多区域选取功能
      selectCellByHeader: false, // 启用后有效，点击列头是否选取当前列的所有单元格
      excludeFields: ['action', 'checkbox', 'sort', 'seq'], // 排除指定列禁止被选取
    },
    keyboardConfig: {
      arrowCursorLock: true, // 方向键光标锁，开启后处于非聚焦式编辑状态，将支持在编辑状态中通过方向键切换单元格。（切换为聚焦编辑状态，可以按 F2 键或者鼠标左键点击输入框，就可以用方向键左右移动输入框的光标）
      isClip: false, // 是否开启复制粘贴
      isArrow: true, // 是否开启方向键功能
      isShift: true, // 是否开启同时按住方向键以活动区域为起始，向指定方向扩展单元格区域
      isTab: true, // 是否开启 Tab 键功能
      isEnter: true, // 是否开启回车键功能
      isEdit: true, // 是否开启任意键进入编辑（功能键除外）
      isBack: true, // 是否开启回退键功能
      isDel: true, // 是否开启删除键功能
      isEsc: false, // 是否开启Esc键关闭编辑功能
      isFNR: false, // 是否开启查找与替换
    },
    pagerConfig: {
      pageSize: 20,
      pageSizes: [10, 20, 50, 100, 500, 1000, 5000, 10000, 50000, 100000],
    },
    scrollX: {
      enabled: false,
    },
    scrollY: {
      enabled: false,
    },
    columns,
    proxyConfig: {
      autoLoad: true,
      response: {
        result: 'data',
        total: 'total',
      },
      ajax: {
        query: args => {
          searchForm.value = args.form || {}; // 保存查询表单数据
          return queryFn(args.page, args.form);
        },
      },
    },
    tableStyle: {
      width: '100%',
    },
    // data:[],
    // footerData: [countRow, meanRow],
  });

  // 合并默认配置和自定义配置
  const gridOptions = reactive<BasicTableProps>(deepMerge(defaultGridOptions, customGridOptions || {}));
  // 获取请求参数（用于导出数据）
  const getFetchParams = () => {
    const pagination = tableRef.value?.pagerConfig;
    return {
      currentPage: pagination?.currentPage || 1,
      pageSize: pagination?.pageSize || 20,
      ...searchForm.value, // 包含查询表单数据
    };
  };

  async function queryFn({ currentPage, pageSize }, searchForm = {}) {
    let params = {
      currentPage,
      pageSize,
      ...searchForm,
    };
    console.log(params, 'params');
    if (beforeFetch) {
      params = beforeFetch(params);
    }

    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await apiFn(params);
        state.tableData = data.list;
        tableRef.value.reloadData(data.list);
        console.log(data, 'data------------');
        resolve({
          data: data.list,
          total: data.pagination.total,
        });
      } catch (error) {
        console.error('Failed to fetch data:', error);
        reject({
          data: [],
          total: 0,
        });
      }
    });
  }

  async function refresh() {
    if (tableRef.value) {
      await tableRef.value.commitProxy('reload'); // 通过 proxy 重新加载数据
    }
  }

  return {
    tableRef,
    gridOptions,
    state,
    refresh,
    getFetchParams,
  };
}
