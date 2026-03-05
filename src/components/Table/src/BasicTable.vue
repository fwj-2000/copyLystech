<template>
  <div
    class="padding"
    ref="wrapRef"
    :class="getWrapperClass"
    @mousedown.native="handleMouseDown"
    @mouseup.native="handleMouseUp"
    @mousemove.native="handleMouseMove">
    <BasicForm
      ref="formRef"
      submitOnReset
      v-bind="getFormProps"
      v-if="getBindValues.useSearchForm"
      :tableAction="tableAction"
      @register="registerForm"
      @submit="handleSearchInfoChange"
      @advanced-change="redoHeight"
      @field-value-change="useDebounceFn(redoHeight, 300)()"
      class="search-form">
      <template #[replaceFormSlotKey(item)]="data" v-for="item in getFormSlotKeys">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </BasicForm>
    <div class="pl-10px pr-10px bg-white">
      <Table
        ref="tableElRef"
        v-bind="getBindValues"
        :rowClassName="getRowClassName"
        v-show="getEmptyDataIsShowTable"
        @change="handleTableChange"
        @resizeColumn="setColumnWidth">
        <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
          <slot :name="item" v-bind="data || {}"></slot>
        </template>
        <template #headerCell="data">
          <HeaderCell :column="data.column.class == 'ant-table-row-expand-icon-cell' ? { ...data.column, title: '' } : data.column" />
        </template>
        <!-- 增加对antdv3.x兼容 -->
        <template #bodyCell="data">
          <slot name="bodyCell" v-bind="data || {}"></slot>
        </template>
        <template #emptyText>
          <div class="nodata-img">
            <img :src="nodata" />
            <span>{{ t('common.noData') }}~</span>
          </div>
        </template>
        <!-- <template #[`header-${column.dataIndex}`] v-for="(column, index) in columns" :key="index">
        <HeaderCell :column="column" />
      </template> -->
      </Table>
    </div>
  </div>
  <!-- </ConfigProvider> -->
</template>
<script lang="ts">
  import type { BasicTableProps, ColumnChangeParam, SizeType, TableActionType } from './types/table';
  import { InnerHandlers } from './types/table';

  import { computed, defineComponent, inject, ref, toRaw, unref, watchEffect } from 'vue';
  import { Table, ConfigProvider } from 'ant-design-vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { PageWrapperFixedHeightKey } from '/@/enums/pageEnum';
  import HeaderCell from './components/HeaderCell.vue';

  import { usePagination } from './hooks/usePagination';
  import { useColumns } from './hooks/useColumns';
  import { useDataSource } from './hooks/useDataSource';
  import { useLoading } from './hooks/useLoading';
  import { useRowSelection } from './hooks/useRowSelection';
  import { useTableScroll } from './hooks/useTableScroll';
  import { useTableScrollTo } from './hooks/useScrollTo';
  import { useCustomRow } from './hooks/useCustomRow';
  import { useTableStyle } from './hooks/useTableStyle';
  import { useTableHeader } from './hooks/useTableHeader';
  import { useTableExpand } from './hooks/useTableExpand';
  import { createTableContext } from './hooks/useTableContext';
  import { useTableFooter } from './hooks/useTableFooter';
  import { useTableForm } from './hooks/useTableForm';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useDebounceFn } from '@vueuse/core';

  import { omit } from 'lodash-es';
  import { basicProps } from './props';
  import { isFunction } from '/@/utils/is';
  import { warn } from '/@/utils/log';
  import nodata from '/@/assets/images/process/no-data.svg';
  import { useI18n } from 'vue-i18n';
  import { transformI18nBasicTable, transformI18nCode } from '/@/utils';

  export default defineComponent({
    name: 'BasicTable',
    components: {
      Table,
      BasicForm,
      HeaderCell,
    },
    props: basicProps,
    emits: [
      'fetch-success',
      'fetch-error',
      'selection-change',
      'register',
      'row-click',
      'row-dbClick',
      'row-contextmenu',
      'row-mouseenter',
      'row-mouseleave',
      'edit-end',
      'edit-cancel',
      'edit-row-end',
      'edit-change',
      'expanded-rows-change',
      'change',
      'columns-change',
    ],
    setup(props, { attrs, emit, slots, expose }) {
      const { t } = useI18n();
      const tableElRef = ref(null);
      const tableData = ref<Recordable[]>([]);

      const wrapRef = ref(null);
      const formRef = ref(null);
      const innerPropsRef = ref<Partial<BasicTableProps>>();

      const { prefixCls } = useDesign('basic-table');
      const [registerForm, formActions] = useForm();

      const getProps = computed(() => {
        return {
          ...props,
          ...unref(innerPropsRef),
        } as BasicTableProps;
      });

      const isFixedHeightPage = inject(PageWrapperFixedHeightKey, false);
      watchEffect(() => {
        unref(isFixedHeightPage) &&
          props.canResize &&
          warn("'canResize' of BasicTable may not work in PageWrapper with 'fixedHeight' (especially in hot updates)");
      });

      const { getLoading, setLoading } = useLoading(getProps);
      const { getPaginationInfo, getPagination, setPagination, setShowPagination, getShowPagination } = usePagination(getProps);

      const {
        getRowSelection,
        getRowSelectionRef,
        getSelectRows,
        setSelectedRows,
        clearSelectedRowKeys,
        getSelectRowKeys,
        deleteSelectRowByKey,
        setSelectedRowKeys,
      } = useRowSelection(getProps, tableData, emit);

      const { getExpandOption, expandAll, expandRows, collapseAll, getIsExpanded, collapseRows } = useTableExpand(getProps, tableData, emit);

      const {
        handleTableChange: onTableChange,
        getDataSourceRef,
        getDataSource,
        getRawDataSource,
        getFetchParams,
        setTableData,
        updateTableDataRecord,
        deleteTableDataRecord,
        insertTableDataRecord,
        findTableDataRecord,
        fetch,
        getRowKey,
        reload,
        getAutoCreateKey,
        updateTableData,
      } = useDataSource(
        getProps,
        {
          tableData,
          getPaginationInfo,
          setLoading,
          setPagination,
          getFieldsValue: formActions.getFieldsValue,
          clearSelectedRowKeys,
          expandAll,
        },
        emit,
      );

      function handleTableChange(...args) {
        onTableChange.call(undefined, ...args);
        emit('change', ...args);
        // 解决通过useTable注册onChange时不起作用的问题
        const { onChange } = unref(getProps);
        onChange && isFunction(onChange) && onChange.call(undefined, ...args);
      }

      const { getViewColumns, getColumns, setCacheColumnsByField, setColumnWidth, setCacheColumns, setColumns, getColumnsRef, getCacheColumns } = useColumns(
        getProps,
        getPaginationInfo,
      );

      const { getScrollRef, redoHeight, handleMouseDown, handleMouseUp, handleMouseMove } = useTableScroll(
        getProps,
        tableElRef,
        getColumnsRef,
        getRowSelectionRef,
        getDataSourceRef,
        wrapRef,
        formRef,
      );

      const { scrollTo } = useTableScrollTo(tableElRef, getDataSourceRef);

      const { customRow } = useCustomRow(getProps, {
        setSelectedRowKeys,
        getSelectRowKeys,
        clearSelectedRowKeys,
        getAutoCreateKey,
        emit,
      });

      const { getRowClassName } = useTableStyle(getProps, prefixCls);

      const handlers: InnerHandlers = {
        onColumnsChange: (data: ColumnChangeParam[]) => {
          emit('columns-change', data);
          // support useTable
          unref(getProps).onColumnsChange?.(data);
        },
      };

      const { getHeaderProps } = useTableHeader(getProps, slots, handlers);

      const { getFooterProps } = useTableFooter(getProps, getScrollRef, tableElRef, getDataSourceRef);

      const { getFormProps, replaceFormSlotKey, getFormSlotKeys, handleSearchInfoChange } = useTableForm(getProps, slots, fetch, getLoading);

      const getBindValues = computed(() => {
        const dataSource = unref(getDataSourceRef);
        let propsData: Recordable = {
          ...attrs,
          ...unref(getProps),
          customRow: unref(getProps).customRow || customRow,
          ...unref(getHeaderProps),
          scroll: unref(getScrollRef),
          loading: unref(getLoading),
          tableLayout: 'fixed',
          rowSelection: unref(getRowSelectionRef),
          rowKey: unref(getRowKey),
          columns: toRaw(unref(getViewColumns)),
          pagination: toRaw(unref(getPaginationInfo)),
          dataSource,
          footer: unref(getFooterProps),
          ...unref(getExpandOption),
          striped: true,
        };
        // if (slots.expandedRowRender) {
        //   propsData = omit(propsData, 'scroll');
        // }

        // 添加国际化配置
        const { i18nConfig } = propsData;
        if (i18nConfig) {
          const { moduleCode } = i18nConfig;
          // if (moduleCode && moduleCode !== '') {
          const newColumns = transformI18nBasicTable(unref(getViewColumns), moduleCode);
          propsData.columns = toRaw(newColumns);
          // propsData.columns = toRaw(
          //   unref(getViewColumns).map(el => {
          //     // 特殊表头和自定义表头，不做处理
          //     if (!el.dataIndex) {
          //       return el;
          //     }
          //     // 优先使用i18nField
          //     const i18nFieldCode = el.i18nField || el.dataIndex;

          //     const tCode = transformI18nCode(moduleCode, i18nFieldCode);
          //     const resultText = t(tCode);
          //     if (resultText === tCode) return el;
          //     el.customTitle = resultText ? resultText : el.customTitle;
          //     return el;
          //   }),
          // );
          // }
        }

        propsData = omit(propsData, ['class', 'onChange']);
        return propsData;
      });

      const getWrapperClass = computed(() => {
        const values = unref(getBindValues);
        return [
          prefixCls,
          attrs.class,
          {
            [`${prefixCls}-form-container`]: values.useSearchForm,
            [`${prefixCls}--inset`]: values.inset,
          },
        ];
      });

      const getEmptyDataIsShowTable = computed(() => {
        const { emptyDataIsShowTable, useSearchForm } = unref(getProps);
        if (emptyDataIsShowTable || !useSearchForm) {
          return true;
        }
        return !!unref(getDataSourceRef).length;
      });

      function setProps(props: Partial<BasicTableProps>) {
        innerPropsRef.value = { ...unref(innerPropsRef), ...props };
      }

      const tableAction: TableActionType = {
        reload,
        getSelectRows,
        setSelectedRows,
        clearSelectedRowKeys,
        getSelectRowKeys,
        deleteSelectRowByKey,
        setPagination,
        setTableData,
        updateTableDataRecord,
        deleteTableDataRecord,
        insertTableDataRecord,
        findTableDataRecord,
        redoHeight,
        setSelectedRowKeys,
        setColumns,
        setLoading,
        getDataSource,
        getRawDataSource,
        getFetchParams,
        setProps,
        getRowSelection,
        getPaginationRef: getPagination,
        getColumns,
        getCacheColumns,
        emit,
        updateTableData,
        setShowPagination,
        getShowPagination,
        setCacheColumnsByField,
        expandAll,
        expandRows,
        collapseAll,
        collapseRows,
        getIsExpanded,
        scrollTo,
        getSize: () => {
          return unref(getBindValues).size as SizeType;
        },
        setCacheColumns,
      };
      createTableContext({ ...tableAction, wrapRef, getBindValues });

      expose(tableAction);

      emit('register', tableAction, formActions);

      return {
        formRef,
        tableElRef,
        getBindValues,
        getLoading,
        registerForm,
        handleSearchInfoChange,
        getEmptyDataIsShowTable,
        handleTableChange,
        setColumnWidth,
        getRowClassName,
        wrapRef,
        tableAction,
        redoHeight,
        getFormProps: getFormProps as any,
        replaceFormSlotKey,
        getFormSlotKeys,
        getWrapperClass,
        columns: getViewColumns,
        useDebounceFn,
        handleMouseDown,
        handleMouseUp,
        handleMouseMove,
        nodata,
        t,
      };
    },
  });
</script>
<style lang="less">
  @border-color: #cecece4d;

  @prefix-cls: ~'@{namespace}-basic-table';

  [data-theme='dark'] {
    .ant-table-tbody > tr:hover.ant-table-row-selected > td,
    .ant-table-tbody > tr.ant-table-row-selected td {
      background-color: #262626;
    }
  }

  .@{prefix-cls} {
    max-width: 100%;
    height: 100%;

    &-row__striped {
      td {
        background-color: @app-content-background;
      }
    }

    &-form-container {
      .ant-form {
        width: 100%;
        padding: 10px 10px 0;
        margin-bottom: 10px;
        background-color: @component-background;
      }
    }

    .ant-table-cell {
      .ant-tag {
        margin-right: 0;
      }

      // tag 状态样式
      .table-tag {
        position: relative;
        display: inline-block;
        border-radius: 4px;
        padding: 4px 8px 4px 20px;

        &::after {
          content: '';
          position: absolute;
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #52c41a;
        }
      }

      .green.table-tag {
        background: rgb(82 196 26 / 10%);
        color: #52c41a;

        &::after {
          background: #52c41a;
        }
      }

      .gray.table-tag {
        background: #f2f4f6;
        color: #999;

        &::after {
          background: #999;
        }
      }

      .blue.table-tag {
        background: rgb(24 144 255 / 10%);
        color: #1890ff;

        &::after {
          background: #1890ff;
        }
      }

      .yellow.table-tag {
        background: rgb(250 173 20 / 10%);
        color: #faad14;

        &::after {
          background: #faad14;
        }
      }

      .red.table-tag {
        background: rgb(255 77 79 / 10%);
        color: #ff4d4f;

        &::after {
          background: #ff4d4f;
        }
      }

      .purple.table-tag {
        background: rgb(218 91 251 / 10%);
        color: #da5bfb;

        &::after {
          background: #da5bfb;
        }
      }

      .custom.table-tag {
        background: var(--tag-bg-color);
        color: var(--tag-color);

        &::after {
          background: var(--tag-color);
        }
      }

      // a标签样式
      .table-a {
        color: #1890ff;
        cursor: pointer;
      }
    }

    .ant-table-wrapper {
      height: 100%;
      background-color: @component-background;
      border-radius: 2px;

      .ant-table-title {
        // min-height: 40px;
        padding: 10px 0;
      }

      .ant-table-container {
        border: none;
      }

      .ant-table.ant-table-bordered .ant-table-title {
        border: none !important;
      }
    }

    .ant-table {
      width: 100%;
      overflow-x: hidden;

      &-title {
        display: flex;
        border-bottom: none;
        justify-content: space-between;
        align-items: center;
      }
    }

    .ant-pagination {
      padding: 8px 12px 4px !important;
      margin: 0 !important;
    }

    .ant-table-footer {
      padding: 0;

      .ant-table-wrapper {
        padding: 0;
      }

      table {
        border: none !important;
      }

      .ant-table-body {
        overflow-x: hidden !important;
        //  overflow-y: scroll !important;
      }

      td {
        padding: 12px 8px;
      }
    }

    &--inset {
      .ant-table-wrapper {
        padding: 0;
      }
    }
  }

  .nodata-img {
    img {
      width: 88px;
      margin: 10px auto;
    }

    span {
      font-size: 14px;
      color: #999;
    }
  }
</style>
