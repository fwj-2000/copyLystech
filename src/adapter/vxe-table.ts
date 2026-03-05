import { h } from 'vue';

import { setupVbenVxeTable, useVbenVxeGrid } from '/@/effects/plugins/vxe-table/index';

import { Button, Image } from 'ant-design-vue';
import { i18n } from '/@/locales/setupI18n';

import { useVbenForm } from './form';
import { handleClearEvent } from '/@/adapter/handle-clear-event';
import {
  apiSelectFilterRender,
  apiSelectRenderTableEdit,
  aSelectFilterRender,
  aSelectRenderTableCell,
  aSelectRenderTableEdit,
  customUserSelectRenderTableCell,
  customUserSelectRenderTableEdit,
  customUserSelectFilterRender,
  datePickerRenderTableEdit,
  datePickerFilterRender,
  dateRenderTableDefault,
  datePickerRenderTableCell,
  defaultFuzzyFilterMethod,
  handleRecallCopyMethod,
  inputFilterRender,
  inputNumberRenderTableEdit,
  inputRenderTableEdit,
  tagRenderTableDefault,
  textareaRenderTableEdit,
  inputNumberRenderTableCell,
  remarkTableRenderCell,
  dateRangeFilterRender,
  editorRenderTableEdit,
  numRenderTableCell,
} from '/@/adapter/utils';
import { renderToolbarToolDelStatus, renderToolbarToolExpandAll } from '/@/effects/common-ui/index';
import { isEmpty, isNullOrUnDef } from '/@/utils/is';
import { createOrUpdateTableCustomData } from '/@/api/system/customData';
import { useUserStore } from '/@/store/modules/user';
import type { VxeTableConstructor, VxeTableDefines, VxeTablePropTypes } from 'vxe-table';
import SuperQueryPopover from '../components/SuperQueryModal/src/SuperQueryPopover.vue';
const authId = 'htxt6e9n6ferljxu';

const userStore = useUserStore();

function shouldStripSortDataByCustomConfig($table: VxeTableConstructor | null | undefined): boolean {
  const customConfig = ($table?.props?.customConfig ?? {}) as VxeTablePropTypes.CustomConfig;
  const storage = customConfig?.storage;
  const disableSortByAllowSort = customConfig?.allowSort === false;
  const disableSortByStorage = typeof storage === 'object' && storage !== null && storage.sort === false;
  return disableSortByAllowSort || disableSortByStorage;
}

function normalizeStoreDataForCustomConfig(
  $table: VxeTableConstructor | null | undefined,
  storeData: VxeTableDefines.CustomStoreData,
): VxeTableDefines.CustomStoreData {
  if (!shouldStripSortDataByCustomConfig($table)) {
    return storeData;
  }
  return {
    ...storeData,
    sortData: [],
  };
}

// 注册通用组件
function initRender(vxeUI) {
  const render = vxeUI.renderer.get('ApiSelect');
  if (!isNullOrUnDef(render)) {
    return;
  }
  vxeUI.renderer.add('CellImage', {
    renderTableDefault(_renderOpts, params) {
      const { column, row } = params;
      return h(Image, { src: row[column.field] });
    },
  });

  vxeUI.renderer.add('CellLink', {
    renderTableDefault(renderOpts) {
      const { props } = renderOpts;
      return h(Button, { size: 'small', type: 'link' }, { default: () => props?.text });
    },
  });

  // 创建工具-`显示删除数据`
  vxeUI.renderer.add('ToolbarToolDelStatus', {
    renderToolbarTool(renderOpts) {
      return renderToolbarToolDelStatus(renderOpts);
    },
  });
  // 创建工具-`一键展开子表`
  vxeUI.renderer.add('ToolbarToolExpandAll', {
    renderToolbarTool(renderOpts) {
      return renderToolbarToolExpandAll(renderOpts);
    },
  });
  // 创建工具-`高级查询`
  vxeUI.renderer.add('ToolbarSuperQuery', {
    renderToolbarTool(renderOpts) {
      return h(SuperQueryPopover, { ...renderOpts.props });
    },
  });

  vxeUI.renderer.mixin({
    Date: {
      renderTableDefault: dateRenderTableDefault,
    },
    Tag: {
      renderTableDefault: tagRenderTableDefault,
    },
    Input: {
      renderTableEdit: inputRenderTableEdit,
      renderTableFilter: inputFilterRender(),
      tableFilterDefaultMethod: defaultFuzzyFilterMethod,
    },
    CustomUserSelect: {
      renderTableEdit: customUserSelectRenderTableEdit,
      renderTableFilter: customUserSelectFilterRender(),
      renderTableCell: customUserSelectRenderTableCell,
    },
    ApiSelect: {
      renderTableEdit: apiSelectRenderTableEdit,
      renderTableFilter: apiSelectFilterRender(),
      tableFilterDefaultMethod: defaultFuzzyFilterMethod,
    },
    ASelect: {
      renderTableEdit: aSelectRenderTableEdit,
      renderTableCell: aSelectRenderTableCell,
      renderTableFilter: aSelectFilterRender(),
    },
    InputNumber: {
      renderTableEdit: inputNumberRenderTableEdit,
      renderTableCell: inputNumberRenderTableCell,
    },
    Textarea: {
      renderTableEdit: textareaRenderTableEdit,
    },
    DatePicker: {
      renderTableEdit: datePickerRenderTableEdit,
      renderTableFilter: datePickerFilterRender(),
      renderTableCell: datePickerRenderTableCell,
    },
    Remark: {
      renderTableDefault: remarkTableRenderCell,
    },
    Editor: {
      renderTableEdit: editorRenderTableEdit,
    },
    DateRange: {
      renderTableFilter: dateRangeFilterRender(),
    },
    Number: {
      renderTableDefault: numRenderTableCell,
    },
  });
}

function clearDefaultEvent(vxeUI) {
  const clearEvent = vxeUI.interceptor.get('event.clearFilter');
  if (!isEmpty(clearEvent)) {
    return;
  }
  vxeUI.interceptor.add('event.clearFilter', handleClearEvent);
  vxeUI.interceptor.add('event.clearEdit', handleClearEvent);
  vxeUI.interceptor.add('event.clearAreas', handleClearEvent);
  // 兼容老版本
  vxeUI.interceptor.add('event.clearActived', handleClearEvent);
}

function initFormats(vxeUI) {
  vxeUI.formats.add('ApiSelect', {
    // 自定义ApiSelect格格式化方法
    tableCellFormatMethod({ column, row }) {
      column.copyDataRow = column.field;
      const {
        editRender: { cacheField },
        field,
      } = column;
      if (cacheField) {
        if (isNullOrUnDef(row.copyData)) {
          row.copyData = {};
        }
        row.copyData[field] = row[cacheField];
        if (field === 'semiFinished') {
          console.log(row[cacheField], 'row[cacheField]row[cacheField]row[cacheField]row[cacheField]');
        }
        return row[cacheField];
      } else {
        if (isNullOrUnDef(row.copyData)) {
          row.copyData = {};
        }
        row.copyData[field] = row[`${field}Name`] || row[field];
        if (field === 'semiFinished') {
          console.log(row[`${field}Name`] || row[field], 'row[`${field}Name`] || row[field]row[`${field}Name`] || row[field]row[`${field}Name`] || row[field]');
        }
        return row[`${field}Name`] || row[field];
      }
    },
  });
}

setupVbenVxeTable({
  configVxeTable: vxeUI => {
    vxeUI.setConfig({
      authId: authId,
      table: {
        border: 'full',
      },
      grid: {
        align: 'left',
        border: 'full',
        columnConfig: {
          resizable: true,
        },
        // height: 'calc(100% - 10px)',
        height: 'auto',
        filterConfig: {
          remote: true,
          // iconNone: 'iconfont icon-shaixuan',
          // iconMatch: '12',
        },
        sortConfig: {
          remote: true,
          multiple: true,
        },
        minHeight: 180,
        stripe: false,
        showOverflow: true,
        showFooter: true,
        // columnConfig: {
        //   resizable: true, // 启用列宽拖拽调整宽度
        //   drag: false, // 启用行拖拽调整顺序
        //   useKey: true,
        // },
        formConfig: {
          // 全局禁用vxe-table的表单配置，使用formOptions
          enabled: false,
        },
        rowConfig: {
          drag: true, // 启用行拖拽调整顺序
          useKey: true,
          keyField: 'id', // 默认主键字段
        },
        exportConfig: {
          types: ['xlsx', 'csv', 'xml', 'txt'],
        },
        proxyConfig: {
          sort: true,
          filter: true,
          autoLoad: true,
          seq: true,
          response: {
            result: 'data.list',
            total: 'data.pagination.total',
            // list: 'data.list',
          },
          showActiveMsg: true,
          showResponseMsg: false,
        },
        // 会与其他模块产生冲突，暂时禁用
        // treeConfig: {
        //   transform: true,
        //   rowField: 'Id',
        //   parentField: 'parentId',
        //   //   childrenField: 'children',
        // },
        checkboxConfig: {
          // range: true,
          highlight: true,
        },
        mouseConfig: {
          area: true, // 是否开启区域选取
        },
        areaConfig: {
          multiple: false, // 是否启用多区域选取功能
          selectCellByHeader: true, // 启用后有效，点击列头是否选取当前列的所有单元格
          excludeFields: ['action', 'checkbox', 'sort', 'radio', 'expand'], // 排除指定列禁止被选取
        },
        customConfig: {
          enabled: true,
          storage: true,
          restoreStore({ id, $table }) {
            if (!id) return {};
            // 读取缓存数据
            const storeData = (userStore.getTableCustomConfig(id) || {}) as VxeTableDefines.CustomStoreData;
            return normalizeStoreDataForCustomConfig($table, storeData);
          },
          async updateStore({ id, storeData, $table }) {
            if (!id) {
              throw new Error('Missing table custom config id');
            }
            const normalizedStoreData = normalizeStoreDataForCustomConfig($table, storeData);
            const res = await createOrUpdateTableCustomData(id, normalizedStoreData);
            if (res.code === 200) {
              // 更新缓存数据
              userStore.setTableCustomConfig({ [id]: normalizedStoreData });
            }
          },
        },
        keyboardConfig: {
          arrowCursorLock: true, // 方向键光标锁，开启后处于非聚焦式编辑状态，将支持在编辑状态中通过方向键切换单元格。（切换为聚焦编辑状态，可以按 F2 键或者鼠标左键点击输入框，就可以用方向键左右移动输入框的光标）
          isClip: true, // 是否开启复制粘贴
          isArrow: true, // 是否开启方向键功能
          isShift: true, // 是否开启同时按住方向键以活动区域为起始，向指定方向扩展单元格区域
          isTab: true, // 是否开启 Tab 键功能
          isEnter: true, // 是否开启回车键功能
          isEdit: true, // 是否开启任意键进入编辑（功能键除外）
          isBack: false, // 是否开启回退键功能
          isDel: true, // 是否开启删除键功能
          isEsc: true, // 是否开启Esc键关闭编辑功能
          isFNR: true, // 是否开启查找与替换
        },
        clipConfig: {
          isPaste: false, // 是否启用粘贴功能
          copyMethod: handleRecallCopyMethod,
        },
        toolbarConfig: {
          custom: true,
          zoom: false,
          refresh: true,
          export: false,
          print: false,
        },
        pagerConfig: {
          autoHidden: false,
          pageSize: 50,
          pageSizes: [20, 50, 100, 200, 500, 1000, 2000, 5000],
        },
        scrollX: {
          gt: 50,
          enabled: true,
        },
        scrollY: {
          gt: 50,
          enabled: true,
        },
        // virtualYConfig: {
        // 	enabled: true,
        // 	oSize: 0,
        // 	gt: 50,
        // 	immediate: true,
        // 	scrollToTopOnChange: true,
        // },
        round: true,
        size: 'mini',
      },
      // @ts-ignore
      // vxeTable国际化，因为当前vxe版本不提供越南语翻译，所以改为手动添加越南语翻译（`src\locales\lang\vi_VN.json`中的`vxe`）
      // 其他语言翻译皆为引入`vxeTable`依赖包所提供的翻译，在`src\locales\lang\`中对应的ts文件导入使用
      i18n: (key, args) => i18n.global.t(key, args),
    });
    clearDefaultEvent(vxeUI);
    initRender(vxeUI);
    initFormats(vxeUI);
  },
  useVbenForm,
});

export { useVbenVxeGrid };

export type * from '/@/effects/plugins/vxe-table/index';
