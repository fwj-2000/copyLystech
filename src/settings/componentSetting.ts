// 用于配置某些组件的常规配置，而无需修改组件
import type { SorterResult } from '../components/Table';

export default {
  // 表格配置
  table: {
    // 表格接口请求通用配置，可在组件prop覆盖
    // 支持 xxx.xxx.xxx格式
    fetchSetting: {
      // 传给后台的当前页字段
      pageField: 'currentPage',
      // 传给后台的每页显示多少条的字段
      sizeField: 'pageSize',
      // 接口返回表格数据的字段
      listField: 'list',
      // 接口返回表格总数的字段
      totalField: 'pagination.total',
    },
    // 可选的分页选项
    pageSizeOptions: ['50', '100', '500'],
    //默认每页显示多少条
    defaultPageSize: 50,
    // 默认尺寸
    defaultSize: 'small',
    // 默认排序方法
    defaultSortFn: (sortInfo: SorterResult) => {
      const { field, order } = sortInfo;
      if (field && order) {
        return {
          // 排序字段
          sidx: field,
          // 排序方式 asc/desc
          sort: order === 'ascend' ? 'asc' : 'desc',
        };
      } else {
        return {};
      }
    },
    // 自定义过滤方法
    defaultFilterFn: (data: Partial<Recordable<string[]>>) => {
      return data;
    },
  },
  vxeTable: {
    showAuthLog: true, // 是否在控制台显示授权信息，专业版支持关闭
    authId: 'htxt6e9n6ferljxu',
    onAuth(e) {
      // 打印授权状态
      console.log(e.status);
    },
    table: {
      border: true,
      stripe: true,
      columnConfig: {
        resizable: true,
        isCurrent: true,
        isHover: true,
      },
      rowConfig: {
        isCurrent: true,
        isHover: true,
      },
      emptyRender: {
        name: 'AEmpty',
      },
      printConfig: {},
      exportConfig: {},
      customConfig: {
        storage: true,
      },
      // sortConfig: { multiple: false },
      // colunmConfig: { resizable: true },
      // mouseConfig: { area: true, extension: true },
      // areaConfig: { extendByCopy: true, extendByCalc: false },
      // clipConfig: { isRowIncrement: false, isColumnIncrement: false },
      // keyboardConfig: { isClip: true, isEdit: true, isTab: true, isArrow: true, isEnter: true, isDel: true, isMerge: true, isFNR: true, isChecked: true },
      // menuConfig: {
      //   body: {
      //     options: [
      //       [{ code: 'myCode', name: '自定义的菜单' }],
      //       // 引入 vxe-table-plugin-menus 之后可以直接使用以下内置 code，也可以自行实现扩展
      //       [
      //         { code: 'CLEAR_CELL', name: '清除内容 (Del)' },
      //         { code: 'COPY_CELL', name: '复制 (Ctrl+C)', prefixIcon: 'vxe-icon-copy' },
      //         { code: 'CUT_CELL', name: '剪贴 (Ctrl+X)', prefixIcon: 'vxe-icon-cut' },
      //         { code: 'PASTE_CELL', name: '粘贴 (Ctrl+V)', prefixIcon: 'vxe-icon-paste' },
      //       ],
      //       [
      //         { code: 'OPEN_FIND', name: '查找 (Ctrl+F)' },
      //         { code: 'OPEN_REPLACE', name: '替换 (Ctrl+H)' },
      //         { code: 'MERGE_OR_CLEAR', name: '合并/取消 (Ctrl+M)', prefixIcon: 'vxe-icon-merge-cells' },
      //       ],
      //       [
      //         { code: 'INSERT_AT_ROW', name: '新增行' },
      //         { code: 'DELETE_ROW', name: '删除行' },
      //         { code: 'EDIT_CELL', name: '编辑' },
      //         { code: 'REVERT_CELL', name: '还原值', prefixIcon: 'vxe-icon-repeat' },
      //       ],
      //       [
      //         { code: 'CLEAR_FILTER', name: '清除筛选' },
      //         { code: 'CLEAR_ALL_FILTER', name: '清除所有筛选' },
      //         {
      //           name: '排序',
      //           children: [
      //             { code: 'CLEAR_SORT', name: '清除排序' },
      //             { code: 'SORT_ASC', name: '升序', prefixIcon: 'vxe-icon-sort-alpha-asc' },
      //             { code: 'SORT_DESC', name: '倒序', prefixIcon: 'vxe-icon-sort-alpha-desc' },
      //           ],
      //         },
      //       ],
      //       // 引入 echarts 和 vxe-table-plugin-charts 之后可以直接使用，也可以自行实现扩展
      //       [
      //         {
      //           name: '创建图表',
      //           children: [
      //             { code: 'CHART_BAR_X_AXIS', name: '横向柱状图 - 自由选择', prefixIcon: 'vxe-icon-chart-bar-x' },
      //             { code: 'CHART_BAR_X_AXIS', name: '横向柱状图 - 固定类别', prefixIcon: 'vxe-icon-chart-bar-x', params: { category: 'a' } },
      //             { code: 'CHART_BAR_Y_AXIS', name: '纵向柱状图 - 自由选择', prefixIcon: 'vxe-icon-chart-bar-y' },
      //             { code: 'CHART_BAR_Y_AXIS', name: '纵向柱状图 - 固定类别', prefixIcon: 'vxe-icon-chart-bar-y', params: { category: 'a' } },
      //             { code: 'CHART_LINE', name: '折线图 - 自由选择', prefixIcon: 'vxe-icon-chart-line' },
      //             { code: 'CHART_LINE', name: '折线图 - 固定类别', prefixIcon: 'vxe-icon-chart-line', params: { category: 'a' } },
      //             { code: 'CHART_PIE', name: '饼图 - 自由选择', prefixIcon: 'vxe-icon-chart-pie' },
      //             { code: 'CHART_PIE', name: '饼图 - 固定类别', prefixIcon: 'vxe-icon-chart-pie', params: { category: 'a' } },
      //           ],
      //         },
      //       ],
      //       [
      //         { code: 'PRINT_ALL', name: '打印', prefixIcon: 'vxe-icon-print', params: { columns: ['a', 'b', 'c', 'd', 'e'] } },
      //         { code: 'EXPORT_ALL', name: '导出 CSV', prefixIcon: 'vxe-icon-download', params: { filename: '导出数据', type: 'csv' } },
      //       ],
      //     ],
      //   },
      // }
    },
    grid: {
      toolbarConfig: {
        enabled: true,
        export: true,
        zoom: true,
        print: true,
        refresh: true,
        custom: true,
      },
      pagerConfig: {
        pageSizes: [20, 50, 100, 500],
        pageSize: 20,
        autoHidden: true,
      },
      proxyConfig: {
        form: true,
        props: {
          result: 'items',
          total: 'total',
        },
      },
      zoomConfig: {},
      mouseConfig: {
        area: true,
      },
      areaConfig: {
        multiple: true,
      },
      keyboardConfig: {
        isClip: true,
        isEdit: true,
        isDel: true,
        isEsc: true, // 是否开启Esc键关闭编辑功能
      },
    },
  },
  // 滚动组件配置
  scrollbar: {
    // 是否使用原生滚动样式
    // 开启后，菜单，弹窗，抽屉会使用原生滚动条组件
    native: false,
  },
};
