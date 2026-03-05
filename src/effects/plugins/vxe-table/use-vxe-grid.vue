<script lang="ts" setup>
  import type { VxeGridDefines, VxeGridInstance, VxeGridListeners, VxeGridPropTypes, VxeGridProps as VxeTableGridProps, VxeToolbarPropTypes } from 'vxe-table';

  import type { SetupContext } from 'vue';

  import type { VbenFormProps } from '/@/components/VxeTable/ui-kit/form-ui/src/types';

  import type { ExtendedVxeGridApi, VxeGridProps } from './types';

  import { computed, nextTick, onMounted, onUnmounted, ref, toRaw, useSlots, useTemplateRef, watch } from 'vue';
  import { useRoute } from 'vue-router';

  import { EmptyIcon } from '/@/utils/icons/index';
  import { usePreferences } from '/@/utils/preference/src/index';
  import { cn, mergeWithArrayOverride } from '/@/utils/shared/src/index';
  import { cloneDeep, isArray, omit } from 'lodash-es';
  import { transformI18nVxeTable } from '/@/utils/index';
  import { useDelStatus } from '/@/effects/common-ui/index';

  import { VbenHelpTooltip, VbenLoading } from '/@/components/VxeTable/ui-kit/shadcn-ui/index';

  import { VxeGrid, VxeUI } from 'vxe-table';
  import { transformI18nBasicForm } from '/@/utils';
  import { extendProxyOptions } from './extends';
  import { useTableForm } from './init';

  import 'vxe-table/styles/cssvar.scss';
  import 'vxe-pc-ui/styles/cssvar.scss';
  import './style.css';
  import { usePriorityValues } from '/@/utils/composables/use-priority-value';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isFunction, isPromise } from '/@/utils/is';
  import { useLocale } from '/@/locales/useLocale';
  import BasicHelp from '/@/components/Basic/src/BasicHelp.vue';
  import { handleDblClickHead } from '/@/adapter/paster-event';
  import { deleteCellValueName } from '/@/adapter/delete-value-event';

  const { t: $t } = useI18n();

  interface Props extends VxeGridProps {
    api: ExtendedVxeGridApi;
  }

  const props = withDefaults(defineProps<Props>(), {});

  const FORM_SLOT_PREFIX = 'form-';

  const TOOLBAR_ACTIONS = 'toolbar-actions';
  const TOOLBAR_TOOLS = 'toolbar-tools';

  const gridRef = useTemplateRef<VxeGridInstance>('gridRef');
  const wrapRef = useTemplateRef<HTMLDivElement>('wrapRef');

  const state = props.api?.useStore?.();

  const { gridOptions, class: className, gridClass, gridEvents, formOptions, tableTitle, tableTitleHelp, showSearchForm } = usePriorityValues(props, state);

  const { isMobile } = usePreferences();
  const { getLocale } = useLocale();

  const slots: SetupContext['slots'] = useSlots();

  const [Form, formApi] = useTableForm({
    compact: true,
    handleSubmit: async () => {
      const formValues = await formApi.getValues();
      formApi.setLatestSubmissionValues(toRaw(formValues));
      // 查询时，手动重置页码为 1
      const proxyInfo = gridRef.value?.getProxyInfo();
      if (proxyInfo && proxyInfo.pager) {
        proxyInfo.pager.currentPage = 1;
      }
      props.api.query();
    },
    handleReset: async () => {
      await formApi.resetForm();
      const formValues = await formApi.getValues();
      formApi.setLatestSubmissionValues(formValues);
      props.api.reload();
    },
    commonConfig: {
      componentProps: {
        class: 'w-full',
      },
    },
    collapsed: true, // 默认收起
    showCollapseButton: true,
    submitButtonOptions: {
      content: $t('common.queryText'),
    },
    wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  });

  const showTableTitle = computed(() => {
    return !!slots.tableTitle?.() || tableTitle.value;
  });

  const showToolbar = computed(() => {
    return !!slots[TOOLBAR_ACTIONS]?.() || !!slots[TOOLBAR_TOOLS]?.() || showTableTitle.value;
  });

  const isAllExpanded = ref(false);

  props.api?.setExpandStateHandler?.(expanded => {
    isAllExpanded.value = expanded;
  });

  const hasRowExpandColumn = computed(() => {
    const columns = gridOptions.value?.columns as VxeGridPropTypes.Column[] | undefined;
    if (!isArray(columns)) {
      return false;
    }
    const visit = (cols: VxeGridPropTypes.Column[]): boolean => {
      return cols.some(col => {
        if (col?.type === 'expand') {
          return true;
        }
        if (isArray(col?.children) && (col.children?.length || 0) > 0) {
          return visit(col.children as VxeGridPropTypes.Column[]);
        }
        return false;
      });
    };
    return visit(columns);
  });

  const enableRowExpandFeature = computed(() => {
    return Boolean(gridOptions.value?.expandConfig) || hasRowExpandColumn.value;
  });

  const enableTreeExpandFeature = computed(() => Boolean(gridOptions.value?.treeConfig));

  const canToggleExpandAll = computed(() => enableRowExpandFeature.value || enableTreeExpandFeature.value);

  const runExpandLoading = async (grid: VxeGridInstance | undefined, task: () => Promise<void> | void) => {
    if (!grid || typeof grid.setLoading !== 'function') {
      return await task();
    }
    grid.setLoading(true);
    try {
      await task();
    } finally {
      requestAnimationFrame(() => grid.setLoading(false));
    }
  };

  const setExpandState = async (expanded: boolean) => {
    if (!canToggleExpandAll.value) {
      return;
    }
    const grid = gridRef.value;
    if (!grid) {
      return;
    }
    try {
      await runExpandLoading(grid, async () => {
        if (enableRowExpandFeature.value) {
          await grid.setAllRowExpand(expanded);
        }
        if (enableTreeExpandFeature.value) {
          await grid.setAllTreeExpand(expanded);
        }
        isAllExpanded.value = expanded;
      });
    } catch (error) {
      console.error('toggleExpandAll failed:', error);
    }
  };

  const toggleExpandAll = async () => {
    const nextState = !isAllExpanded.value;
    await setExpandState(nextState);
  };

  watch(
    () => [gridOptions.value?.toolbarConfig?.expandAll, canToggleExpandAll.value],
    ([expandAllEnabled, canToggle]) => {
      if (!expandAllEnabled || !canToggle) {
        isAllExpanded.value = false;
      }
    },
  );

  const shouldDefaultExpand = computed(() => Boolean(gridOptions.value?.toolbarConfig?.defaultExpand));

  // `显示删除数据`的数据和设置方法
  const { delStatusParams, setDelStatus, setDeleteMarkColumn } = useDelStatus(gridOptions, gridRef);

  const toolbarOptions = computed(() => {
    const slotActions = slots[TOOLBAR_ACTIONS]?.();
    const slotTools = slots[TOOLBAR_TOOLS]?.();
    const searchBtn: VxeToolbarPropTypes.ToolConfig = {
      code: 'search',
      icon: 'vxe-icon--search',
      circle: true,
      status: showSearchForm.value ? 'primary' : undefined,
      title: $t('common.search'),
    };
    // 将搜索按钮合并到用户配置的toolbarConfig.tools中
    const toolbarConfig: VxeGridPropTypes.ToolbarConfig = {
      tools: (gridOptions.value?.toolbarConfig?.tools ?? []) as VxeToolbarPropTypes.ToolConfig[],
    };
    if (gridOptions.value?.toolbarConfig?.search && !!formOptions.value) {
      toolbarConfig.tools = Array.isArray(toolbarConfig.tools) ? [...toolbarConfig.tools, searchBtn] : [searchBtn];
    }
    if (!Array.isArray(toolbarConfig.tools)) {
      toolbarConfig.tools = [];
    }
    // 是否在工具栏添加`高级查询`按钮
    if (gridOptions.value?.toolbarConfig?.superQuery) {
      const superQueryTool = {
        toolRender: {
          name: 'ToolbarSuperQuery',
          props: {
            columnsOps: gridOptions.value?.columns ?? [],
            onSuperQuery: (params: any) => {
              if (params?.length > 0) {
                props.api?.setSuperQueryParams(params);
                props.api?.query?.({
                  aqp: params,
                });
              } else {
                props.api?.clearSuperQueryParams();
                props.api?.query?.();
              }
            },
          },
        },
      };
      toolbarConfig.tools.unshift(superQueryTool);
    }
    // 是否在工具栏添加`显示删除数据`勾选框
    if (gridOptions.value?.toolbarConfig?.delStatus) {
      const delStatusTool = {
        toolRender: {
          name: 'ToolbarToolDelStatus',
          props: {
            onChange: (event: any) => {
              setDelStatus(event?.target?.checked ? 1 : 0);
              props.api.query();
            },
          },
        },
      };
      toolbarConfig.tools.unshift(delStatusTool);
    }
    // 是否在工具栏添加`一键展开子表`按钮
    if (gridOptions.value?.toolbarConfig?.expandAll) {
      const expandAllTool = {
        toolRender: {
          name: 'ToolbarToolExpandAll',
          props: {
            title: isAllExpanded.value ? $t('common.collapseAll') : $t('common.expandAll'),
            expanded: isAllExpanded.value,
            disabled: !canToggleExpandAll.value,
            onToggle: toggleExpandAll,
          },
        },
      };
      toolbarConfig.tools.unshift(expandAllTool);
    }

    // 更改查询方法
    toolbarConfig.refreshOptions = {
      queryMethod: async () => {
        isAllExpanded.value = false;
        // 查询时，清空高级查询参数
        props.api?.clearSuperQueryParams();
        props.api.query();
      },
    };

    if (!showToolbar.value) {
      return { toolbarConfig };
    }

    // 强制使用固定的toolbar配置，不允许用户自定义
    // 减少配置的复杂度，以及后续维护的成本
    toolbarConfig.slots = {
      ...(slotActions || showTableTitle.value ? { buttons: TOOLBAR_ACTIONS } : {}),
      ...(slotTools ? { tools: TOOLBAR_TOOLS } : {}),
    };
    return { toolbarConfig };
  });

  type Attach = {
    api?: Promise<any>;
    beforeFetch: null | CallableFunction | object | Promise<any>;
    afterFetch: null | CallableFunction;
  };

  const options = computed(() => {
    const globalGridConfig = VxeUI?.getConfig()?.grid ?? {};

    const mergedOptions: VxeTableGridProps & Attach = cloneDeep(
      mergeWithArrayOverride({}, toRaw(toolbarOptions.value), toRaw(gridOptions.value), globalGridConfig),
    );
    // 简化ajax配置
    const { api } = mergedOptions;
    if (api && isFunction(api) && mergedOptions.proxyConfig) {
      if (!mergedOptions.proxyConfig.ajax) {
        mergedOptions.proxyConfig.ajax = {};
      }
      mergedOptions.proxyConfig.ajax = {
        ...mergedOptions.proxyConfig.ajax,
        query: async ({ page, filters, sorts }, params?: any) => {
          // 当表单存在时，获取表单的值
          let formValues = {};
          if (formOptions && formOptions.value !== undefined) {
            formValues = formApi.getLatestSubmissionValues();
          }
          const sidx: any = [];
          const desc: any = [];
          if (sorts && sorts.length > 0) {
            sorts.forEach(item => {
              if (item.column && item.column.sortBy && item.order) {
                sidx.push(item.column.sortBy);
                desc.push(item.order);
              } else if (item.field && item.order) {
                sidx.push(item.field);
                desc.push(item.order);
              }
            });
          }
          // 过滤参数
          const filterParams = filters.reduce((res: {}, filter) => {
            const searchField = filter.column?.filterRender?.searchField || filter.field;
            if (filter.datas && filter.datas.length > 0) {
              const searchValue = filter.datas[0];
              if (isArray(searchField)) {
                searchField.forEach((field, index) => {
                  res[field] = searchValue[index];
                });
              } else {
                res[searchField] = searchValue;
              }
            }
            return res;
          }, {});
          let apiParams = {
            currentPage: page.currentPage,
            pageSize: page.pageSize,
            // `显示删除数据`的参数
            ...delStatusParams.value,
            ...(params || {}),
            // ...filterParams,
            // ...formValues,
            ...Object.assign(filterParams, formValues),
            sidx: sidx.join(','),
            sort: desc.join(','),
          };
          // 加入高级查询
          if (props.api?.getSuperQueryParams) {
            const superQueryParams = props.api.getSuperQueryParams();
            if (superQueryParams) {
              apiParams.aqp = superQueryParams;
            }
          }
          if (mergedOptions.beforeFetch) {
            const beforeFetch = mergedOptions.beforeFetch;
            if (typeof beforeFetch === 'function') {
              // beforeFetch 是promise，需要等待
              if (apiParams instanceof Promise) {
                apiParams = await beforeFetch(apiParams);
              } else {
                apiParams = beforeFetch(apiParams);
              }
            }
            if (typeof beforeFetch === 'object') {
              apiParams = {
                ...apiParams,
                ...beforeFetch,
              };
            }
          }
          return new Promise(resolve => {
            const fetch = api(apiParams);
            fetch
              .then(({ data }) => {
                if (mergedOptions.afterFetch && (isFunction(mergedOptions.afterFetch) || isPromise(mergedOptions.afterFetch))) {
                  mergedOptions.afterFetch(data);
                }
                if (shouldDefaultExpand.value && canToggleExpandAll.value) {
                  requestAnimationFrame(() => {
                    setExpandState(true);
                  });
                }
              })
              .catch(error => {
                throw Error(error);
              });
            return resolve(fetch);
          });
        },
      };
    }
    if (mergedOptions.proxyConfig) {
      const { ajax } = mergedOptions.proxyConfig;
      mergedOptions.proxyConfig.enabled = !!ajax;
      // 不自动加载数据, 由组件控制
      mergedOptions.proxyConfig.autoLoad = false;
    }

    if (mergedOptions.pagerConfig) {
      const mobileLayouts = ['PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump'] as any;
      const layouts = ['Total', 'Sizes', 'Home', 'Jump', ...mobileLayouts, 'End'] as readonly string[];
      mergedOptions.pagerConfig = mergeWithArrayOverride({}, mergedOptions.pagerConfig, {
        pageSize: 20,
        background: true,
        pageSizes: [20, 50, 100, 200, 500],
        className: 'w-full',
        layouts: isMobile.value ? mobileLayouts : layouts,
        size: 'mini' as const,
      });
    }
    if (mergedOptions.formConfig) {
      mergedOptions.formConfig.enabled = false;
    }
    // 国际化转换表头
    const { columns } = mergedOptions;
    if (columns) {
      let otherConfig = mergedOptions?.i18nConfig?.otherConfig;
      let moduleCode = mergedOptions?.i18nConfig?.moduleCode;
      mergedOptions.columns = transformI18nVxeTable(columns, moduleCode, otherConfig);
    }
    if (mergedOptions.showIndexColumn) {
      if (!mergedOptions.columns) return;
      const firstColumn = mergedOptions.columns[0];

      // Check if the first column's type is 'checkbox' or 'radio'
      if (firstColumn && (firstColumn.type === 'checkbox' || firstColumn.type === 'radio')) {
        // Insert the seq column as the second element
        mergedOptions.columns.splice(1, 0, {
          type: 'seq',
          title: $t('component.table.index'),
          width: 50,
        });
      } else {
        // Insert the seq column as the first element
        mergedOptions.columns.unshift({
          type: 'seq',
          title: $t('component.table.index'),
          width: 50,
        });
      }
    }

    // 设置`删除数据状态`列
    setDeleteMarkColumn(mergedOptions.columns);

    // }
    if (mergedOptions.columns) {
      mergedOptions.columns = mergedOptions.columns.map(column => {
        if (!column.slots && column.cellRender?.format === 'YYYY-MM-DD') {
          column.slots = { header: 'date-header' };
        }
        return column;
      });
    }
    // 判断当前组件所处的位置，进行样式调整
    if (typeof mergedOptions?.position == 'undefined') {
      mergedOptions.position = 'page';
    }
    return mergedOptions;
  });

  function onToolbarToolClick(event: VxeGridDefines.ToolbarToolClickEventParams) {
    if (event.code === 'search') {
      props.api?.toggleSearchForm?.();
    }
    (gridEvents.value?.toolbarToolClick as VxeGridListeners['toolbarToolClick'])?.(event);
  }

  const events = computed(() => {
    return {
      headerCellDblclick: params => {
        params.config = options.value?.dblClickHeadConfig || {};
        handleDblClickHead(params, props.api);
      },
      cellDeleteValue: deleteCellValueName,
      ...gridEvents.value,
      toolbarToolClick: onToolbarToolClick,
    };
  });

  const delegatedSlots = computed(() => {
    const resultSlots: string[] = [];

    for (const key of Object.keys(slots)) {
      if (!['empty', 'form', 'loading', TOOLBAR_ACTIONS].includes(key)) {
        resultSlots.push(key);
      }
    }
    return resultSlots;
  });

  const delegatedFormSlots = computed(() => {
    const resultSlots: string[] = [];

    for (const key of Object.keys(slots)) {
      if (key.startsWith(FORM_SLOT_PREFIX)) {
        resultSlots.push(key);
      }
    }
    return resultSlots.map(key => key.replace(FORM_SLOT_PREFIX, ''));
  });

  async function init() {
    await nextTick();
    const globalGridConfig = VxeUI?.getConfig()?.grid ?? {};
    const defaultGridOptions: VxeTableGridProps = mergeWithArrayOverride({}, toRaw(gridOptions.value), toRaw(globalGridConfig));
    // 内部主动加载数据，防止form的默认值影响
    const autoLoad = defaultGridOptions.proxyConfig?.autoLoad;
    const enableProxyConfig = options.value?.proxyConfig?.enabled;
    if (enableProxyConfig && autoLoad) {
      props.api.grid.commitProxy?.('initial', (await formApi.getValues()) ?? {});
      // props.api.grid.commitProxy?.('initial', (await formApi.getValues()) ?? {});
      // props.api.reload(formApi.form?.values ?? {});
    }

    // form 由 vben-form代替，所以不适配formConfig，这里给出警告
    const formConfig = gridOptions.value?.formConfig;
    // 处理某个页面加载多个Table时，第2个之后的Table初始化报出警告
    // 因为第一次初始化之后会把defaultGridOptions和gridOptions合并后缓存进State
    if (formConfig && formConfig.enabled) {
      console.warn('[Vben Vxe Table]: The formConfig in the grid is not supported, please use the `formOptions` props');
    }
    props.api?.setState?.({ gridOptions: defaultGridOptions });
    // form 由 vben-form 代替，所以需要保证query相关事件可以拿到参数
    extendProxyOptions(props.api, defaultGridOptions, () => formApi.getLatestSubmissionValues());
  }

  // formOptions支持响应式
  watch(
    formOptions,
    () => {
      formApi.setState(prev => {
        // 获取在`i18nConfig`配置项中不同语言的表单配置，并且覆盖配置
        const mergeCustomProps: any = {};
        const { i18nConfig } = formOptions.value || {};
        const customProps: any = i18nConfig ? i18nConfig[getLocale.value] : false;
        if (i18nConfig && customProps) {
          Object.assign(mergeCustomProps, omit(customProps, ['moduleCode', 'transferRange', 'i18nConfig']));
          mergeCustomProps.i18nConfig = Object.assign({}, i18nConfig, {
            moduleCode: customProps.moduleCode || i18nConfig.moduleCode,
            transferRange: customProps.transferRange || i18nConfig.transferRange,
            excludeFields: customProps.excludeFields || i18nConfig.excludeFields,
          });
        }
        const finalFormOptions: VbenFormProps = mergeWithArrayOverride({}, mergeCustomProps, formOptions.value, prev);
        return {
          ...finalFormOptions,
          schema: transformI18nBasicForm(
            formOptions.value?.schema || [],
            finalFormOptions?.i18nConfig ?? {
              moduleCode: '',
              transferRange: [],
              excludeFields: [],
            },
          ),
          collapseTriggerResize: !!finalFormOptions.showCollapseButton,
        };
      });
    },
    {
      immediate: true,
    },
  );

  const isCompactForm = computed(() => {
    return formApi.getState()?.compact;
  });

  onMounted(() => {
    const params: any = {};
    if (formOptions.value?.routeConfig?.enabled) {
      // 通过路由参数初始化表单
      const route = useRoute();
      const { query } = route;
      formOptions.value?.schema?.map(item => {
        for (const key in query) {
          if (item.fieldName === key || item.routeField === key) {
            formApi.setFieldValue(item.fieldName, query[key]);
            params[item.fieldName] = query[key];
          }
        }
      });
    }

    // 设置默认的搜索参数
    formApi && formApi.setLatestSubmissionValues({ ...formApi.form.values, ...params });
    props.api?.mount?.(gridRef.value, formApi);
    init();
  });

  onUnmounted(() => {
    formApi?.unmount?.();
    props.api?.unmount?.();
  });
</script>

<template>
  <div ref="wrapRef" :class="cn('h-full rounded-md', className)">
    <VxeGrid
      ref="gridRef"
      :class="
        cn(
          {
            'pt-0': showToolbar && !formOptions,
          },
          gridClass,
          options?.position,
        )
      "
      v-bind="options"
      v-on="events">
      <!-- date-header -->
      <template #date-header="{ column }">
        {{ column.title }}
        <BasicHelp text="Time Zone:Asia/Shanghai" />
      </template>
      <!-- 左侧操作区域或者title -->
      <template v-if="showToolbar" #toolbar-actions="slotProps">
        <slot v-if="showTableTitle" name="table-title">
          <div class="mr-1 pl-1 text-[1rem]">
            {{ tableTitle }}
            <VbenHelpTooltip v-if="tableTitleHelp" trigger-class="pb-1">
              {{ tableTitleHelp }}
            </VbenHelpTooltip>
          </div>
        </slot>
        <slot name="toolbar-actions" v-bind="slotProps"></slot>
      </template>
      <!-- 右侧操作区域 -->
      <template #toolbar-tools></template>

      <!-- 继承默认的slot -->
      <template v-for="slotName in delegatedSlots" :key="slotName" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps"></slot>
      </template>

      <!-- form表单 -->
      <template #form>
        <div v-if="formOptions" v-show="showSearchForm !== false" :class="cn('relative overflow-x-hidden p-10px pb-6px vxe-form', options?.position)">
          <slot name="form">
            <Form>
              <template v-for="slotName in delegatedFormSlots" :key="slotName" #[slotName]="slotProps">
                <slot :name="`${FORM_SLOT_PREFIX}${slotName}`" v-bind="slotProps"></slot>
              </template>
              <template #reset-before="slotProps">
                <slot name="reset-before" v-bind="slotProps"></slot>
              </template>
              <template #submit-before="slotProps">
                <slot name="submit-before" v-bind="slotProps"></slot>
              </template>
              <template #expand-before="slotProps">
                <slot name="expand-before" v-bind="slotProps"></slot>
              </template>
              <template #expand-after="slotProps">
                <slot name="expand-after" v-bind="slotProps"></slot>
              </template>
            </Form>
          </slot>
          <!-- <div class="bg-background-deep z-100 absolute -left-2 bottom-1 h-2 w-[calc(100%)] overflow-hidden md:bottom-2 md:h-3"></div> -->
        </div>
      </template>
      <!-- loading -->
      <template #loading>
        <slot name="loading">
          <VbenLoading :spinning="true" />
        </slot>
      </template>
      <!-- 统一控状态 -->
      <template #empty>
        <slot name="empty">
          <EmptyIcon class="mx-auto" />
          <div class="mt-2">{{ $t('common.noData') }}</div>
        </slot>
      </template>
    </VxeGrid>
  </div>
</template>
<style lang="less" scoped>
  // 按钮间距
  :deep(.vxe-buttons--wrapper button) {
    margin-right: 8px;
  }

  :deep(.vxe-grid--layout-body-wrapper) {
    padding-left: 12px;
    padding-right: 12px;
  }

  :deep(.page .vxe-grid--pager-wrapper) {
    padding-bottom: 8px;
    padding-top: 5px;
  }

  // modal里不加padding
  :deep(.modal .vxe-grid--pager-wrapper) {
    padding: 0;
  }

  :deep(.modal .vxe-grid--layout-body-wrapper) {
    padding: 0;
  }

  .vxe-form&.page {
    border-bottom: 6px solid #ebeef5;
  }

  :deep(.ant-select) {
    width: 100%;
  }

  :deep(.vxe-table) {
    .bg-purple {
      background-color: #d4e0fb;
    }
  }
</style>
