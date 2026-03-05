<!-- 
  * 自定义列配置弹窗，为实现表格展开的子表个性化列配置的功能，模仿VxeTable的列配置功能实现
 -->
<template>
  <BasicModal
    :title="t('common.columnConfig')"
    canFullscreen
    :draggable="true"
    v-bind="$attrs"
    :width="878"
    @register="registerModal"
    destroy-on-close
    :cancelText="t('common.closeText')"
    :show-ok-btn="false">
    <Grid :style="{ minHeight: '550px' }">
      <template #width="{ row }">
        <VxeNumberInput
          :modelValue="row.width"
          type="integer"
          :min="30"
          :max="500"
          :step="1"
          size="mini"
          @change="(e: VxeNumberInputDefines.ChangeEventParams) => handleWidthChange(e, row)" />
      </template>

      <template #fixed="{ row }">
        <VxeRadioGroup
          :modelValue="row.fixed"
          :options="fixedOptions"
          type="button"
          size="mini"
          @change="(e: VxeRadioGroupDefines.ChangeEventParams) => handleFixedChange(e, row)" />
      </template>
    </Grid>

    <template #footer>
      <!-- 恢复默认 -->
      <a-button @click="reset"> {{ t('common.restoreDefault') }} </a-button>
      <!-- 取消 -->
      <a-button @click="closeModal"> {{ t('common.cancel') }} </a-button>
      <!-- 确认 -->
      <a-button type="primary" @click="submit"> {{ t('common.confirm') }} </a-button>
    </template>
  </BasicModal>
</template>

<script lang="ts" setup>
  import type { VxeGridPropTypes } from 'vxe-table';
  import type { VxeRadioGroupDefines, VxeNumberInputDefines } from 'vxe-pc-ui';
  import type { AppProviderContextProps } from '/@/components/Application/src/useAppContext';
  import type { ExCustomStoreData } from './types';

  import { createAppProviderContext } from '/@/components/Application/src/useAppContext';
  import { ref, nextTick } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getVxeTableId, saveTableCustomData, getTableCustomData } from './config';
  import { useRoute } from 'vue-router';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { VxeRadioGroup, VxeNumberInput } from 'vxe-pc-ui';

  const props = defineProps({
    appProviderContext: {
      type: Object as () => AppProviderContextProps | null,
      default: () => null,
    },
  });

  // 通过`createVNode`使用本组件时，需要手动获取并提供上下文给组件使用
  props.appProviderContext && createAppProviderContext(props.appProviderContext);

  const [registerModal, { closeModal }] = useModalInner(initData);
  const { t } = useI18n();
  const route = useRoute();
  const { createConfirm } = useMessage();

  /** 冻结值 枚举 */
  const enum FIXED_ENUM {
    左侧 = 'left',
    不设置 = 'unset',
    右侧 = 'right',
  }

  /** 冻结 选项 */
  const fixedOptions = [
    // 左侧
    { label: t('common.leftSide'), value: FIXED_ENUM.左侧 },
    // 不设置
    { label: t('common.notSet'), value: FIXED_ENUM.不设置 },
    // 右侧
    { label: t('common.rightSide'), value: FIXED_ENUM.右侧 },
  ];

  /** 自定义列配置表格  */
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'expaned-table-custom-column-config',
      columns: [
        {
          type: 'checkbox',
          title: t('dict.CommonCol.all'),
          width: 80,
          align: 'center',
          headerAlign: 'left',
        },
        // 列标题
        {
          title: t('common.columnTitle'),
          field: 'field',
          formatter: ({ row }) => row.title || '',
          dragSort: true,
        },
        // 列宽(像素)
        {
          title: t('common.columnWidthPixels'),
          field: 'widthValue',
          width: 140,
          slots: {
            default: 'width',
          },
        },
        // 冻结列
        {
          title: t('common.frozenColumn'),
          field: 'fixed',
          width: 200,
          align: 'center',
          headerAlign: 'left',
          slots: {
            default: 'fixed',
          },
        },
      ],
      mouseConfig: {
        area: false,
      },
      columnConfig: {
        isCurrent: false,
      },
      headerCellConfig: {
        height: 44,
      },
      cellConfig: {
        height: 44,
      },
      rowConfig: {
        keyField: 'field',
        isCurrent: false,
        drag: true,
      },
      rowDragConfig: {
        showIcon: true,
        trigger: 'cell',
      },
      checkboxConfig: {
        highlight: false,
      },
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      position: 'modal',
    },
  });

  const state: { columns: Readonly<VxeGridPropTypes.Columns>; callback?: Function } = { columns: [] };

  /**
   * 初始化数据
   * @param data 初始化数据
   * @param data.columns 列配置数据，可选
   * @param data.callback 点击"确认"保存成功之后的回调函数，可选
   */
  function initData(data: { columns?: VxeGridPropTypes.Columns; callback?: Function }) {
    const columns = (data.columns || []).map(item => ({
      ...item,
      // 设置列字段，处理type和field的情况
      field: getField(item),
    }));
    Object.assign(state, { ...data, columns: columns });
    nextTick(() => loadData(formatColumns(columns)));
  }

  /**
   * 获取列字段
   * @param column 列配置项
   * @returns 列字段，若有type则返回type=${xxx}，否则返回field
   */
  function getField(column: VxeGridPropTypes.Column) {
    return column.field || (column.type ? `type=${column.type}` : undefined);
  }

  /** 格式化 列配置数据 */
  function formatColumns(columns: Readonly<VxeGridPropTypes.Columns> = []) {
    const config: ExCustomStoreData = getTableCustomData(getVxeTableId(route.path));
    const { sortData, fixedData, resizableData, visibleData } = config;

    // 创建排序映射表，兼容对象和数组两种结构
    const sortMap = Array.isArray(sortData)
      ? sortData.reduce((map, item, index) => {
          // 处理数组结构: [ { k: 'field1' }, { k: 'field2' } ]
          map[item.k] = index;
          return map;
        }, {} as Record<string, number>)
      : sortData; // 处理对象结构: { field1: 0, field2: 1 }，或者`undefined`

    // 使用reduce格式化列数据并应用配置，同时过滤掉不存在columnField的列
    const cols = columns.reduce((result, col) => {
      const columnField = col.field;

      // 过滤掉不存在columnField的列
      columnField &&
        result.push({
          title: col.title || '',
          field: columnField, // 确保field属性存在
          fixed: fixedData?.[columnField] || col.fixed || FIXED_ENUM.不设置,
          width: resizableData?.[columnField] || col.width,
          visible: visibleData?.[columnField] ?? col.visible ?? true,
        });

      return result;
    }, [] as Array<any>);

    // 根据排序映射表调整列顺序
    sortMap && cols.sort((a, b) => (sortMap[a.field] ?? Infinity) - (sortMap[b.field] ?? Infinity));

    return cols;
  }

  /**  获取提交数据 */
  function getConfig() {
    const config: ExCustomStoreData = {
      sortData: [],
      fixedData: {},
      visibleData: {},
      resizableData: {},
    };
    const list = gridApi.getDataSource();
    const selectedRowKeys = gridApi.getSelectRowKeys();

    for (let i = 0, len = list.length; i < len; i++) {
      const item = list[i];
      const field = item.field;

      config.sortData![i] = { k: field };
      config.resizableData![field] = item.width;
      if (!selectedRowKeys.includes(field)) {
        config.visibleData![field] = false;
      }
      if (item.fixed !== FIXED_ENUM.不设置) {
        config.fixedData![field] = item.fixed;
      }
    }

    return config;
  }

  /** 冻结列 变更 */
  function handleFixedChange(e: VxeRadioGroupDefines.ChangeEventParams, row: VxeGridPropTypes.Column) {
    row.fixed = e.label || FIXED_ENUM.不设置;
  }

  /** 列宽度 变更 */
  function handleWidthChange(e: VxeNumberInputDefines.ChangeEventParams, row: VxeGridPropTypes.Column) {
    row.width = e.value;
  }

  /** 表格加载数据 */
  async function loadData(data: Readonly<VxeGridPropTypes.Columns>) {
    return gridApi.reloadData(data).then(() => {
      /** `visible`有可能没有设置，为`undefined`，这也是等同于`true`，需要正常显示 */
      return gridApi.grid.setCheckboxRow(
        data.filter(item => item.visible !== false),
        true,
      );
    });
  }

  /** 重置 */
  function reset() {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.restoreDetaultColumnTip'),
      onOk: async () => {
        return loadData(state.columns).then(submit);
      },
    });
  }

  const submitLoading = ref<boolean>(false);
  /** 提交 */
  async function submit() {
    const storeData = getConfig();
    const id = getVxeTableId(route.path);

    submitLoading.value = true;
    return saveTableCustomData(id, storeData)
      .then(() => {
        // 更新缓存数据
        typeof state.callback === 'function' && state.callback(storeData);
        closeModal();
      })
      .finally(() => {
        submitLoading.value = false;
      });
  }
</script>

<style scoped lang="scss">
  :deep(div.vxe-table--header-wrapper.body--wrapper) {
    background: #fff;
  }
</style>
