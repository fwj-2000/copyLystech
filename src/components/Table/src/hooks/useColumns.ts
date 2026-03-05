import type { BasicColumn, BasicTableProps, CellFormat, GetColumnsParams } from '../types/table';
import type { PaginationProps } from '../types/pagination';
import type { ComputedRef } from 'vue';
import { computed, h, reactive, ref, Ref, toRaw, unref, watch } from 'vue';
import { renderEditCell } from '../components/editable';
import { usePermission } from '/@/hooks/web/usePermission';
import { useI18n } from '/@/hooks/web/useI18n';
import { isArray, isBoolean, isFunction, isMap, isString } from '/@/utils/is';
import { cloneDeep, isEqual } from 'lodash-es';
import { formatToDate } from '/@/utils/dateUtil';
import { hexToRGB, lighten } from '/@/utils/color';
import { ACTION_COLUMN_FLAG, DEFAULT_ALIGN, DEFAULT_RESIZABLE, DEFAULT_WIDTH, INDEX_COLUMN_FLAG } from '../const';
import { useBaseStore } from '/@/store/modules/base';

const baseStore = useBaseStore();

function handleItem(item: BasicColumn, ellipsis: boolean) {
  const { key, dataIndex, children } = item;
  // 设置默认的align为center
  item.align = item.align || DEFAULT_ALIGN;
  // 设置默认的resizable为true
  item.resizable = item.resizable || DEFAULT_RESIZABLE;
  // 如果resizable为true，并且没有设置宽度，设置默认宽度为170
  if (item.resizable && !item.width) {
    item.width = DEFAULT_WIDTH;
  }
  if (!key) {
    item.key = dataIndex as string;
  }
  if (ellipsis) {
    if (!isBoolean(item.ellipsis)) {
      Object.assign(item, {
        ellipsis,
      });
    }
  }
  if (children && children.length) {
    handleChildren(children, !!ellipsis);
  }
}

function handleChildren(children: BasicColumn[] | undefined, ellipsis: boolean) {
  if (!children) return;
  children.forEach(item => {
    const { children } = item;
    handleItem(item, ellipsis);
    handleChildren(children, ellipsis);
  });
}

function handleIndexColumn(propsRef: ComputedRef<BasicTableProps>, getPaginationRef: ComputedRef<boolean | PaginationProps>, columns: BasicColumn[]) {
  const { t } = useI18n();

  const { showIndexColumn, indexColumnProps, isTreeTable } = unref(propsRef);

  let pushIndexColumns = false;
  if (unref(isTreeTable)) {
    return;
  }
  columns.forEach(() => {
    const indIndex = columns.findIndex(column => column.flag === INDEX_COLUMN_FLAG);
    if (showIndexColumn) {
      pushIndexColumns = indIndex === -1;
    } else if (!showIndexColumn && indIndex !== -1) {
      columns.splice(indIndex, 1);
    }
  });
  if (!columns.length) pushIndexColumns = true;

  if (!pushIndexColumns) return;

  const isFixedLeft = columns.some(item => item.fixed === 'left');
  const pagination = unref(getPaginationRef);
  columns.unshift({
    flag: INDEX_COLUMN_FLAG,
    width: 50,
    title: t('component.table.index'),
    align: 'center',
    customRender: ({ index }) => {
      // 如果有分页信息，计算分页序号
      if (pagination && typeof pagination !== 'boolean') {
        const current = pagination.current || 1;
        const pageSize = pagination.pageSize || 10;
        return `${(current - 1) * pageSize + index + 1}`;
      }
      // 无分页信息就返回默认序号
      return `${index + 1}`;
    },
    ...(isFixedLeft
      ? {
          fixed: 'left',
        }
      : {}),
    ...indexColumnProps,
  });
}

function handleActionColumn(propsRef: ComputedRef<BasicTableProps>, columns: BasicColumn[]) {
  const { actionColumn } = unref(propsRef);
  if (!actionColumn) return;

  const hasIndex = columns.findIndex(column => column.flag === ACTION_COLUMN_FLAG);
  if (hasIndex === -1) {
    columns.push({
      ...columns[hasIndex],
      fixed: 'right',
      ...actionColumn,
      flag: ACTION_COLUMN_FLAG,
    });
  }
}

export function useColumns(propsRef: ComputedRef<BasicTableProps>, getPaginationRef: ComputedRef<boolean | PaginationProps>) {
  const columnsRef = ref(unref(propsRef).columns) as unknown as Ref<BasicColumn[]>;
  let cacheColumns = unref(propsRef).columns;

  const getColumnsRef = computed(() => {
    const columns = cloneDeep(unref(columnsRef));

    handleIndexColumn(propsRef, getPaginationRef, columns);
    handleActionColumn(propsRef, columns);
    if (!columns) {
      return [];
    }
    const { ellipsis } = unref(propsRef);

    columns.forEach(item => {
      const { customRender, slots } = item;

      handleItem(item, Reflect.has(item, 'ellipsis') ? !!item.ellipsis : !!ellipsis && !customRender && !slots);
    });
    return columns;
  });

  function isIfShow(column: BasicColumn): boolean {
    const ifShow = column.ifShow;

    let isIfShow = true;

    if (isBoolean(ifShow)) {
      isIfShow = ifShow;
    }
    if (isFunction(ifShow)) {
      isIfShow = ifShow(column);
    }
    return isIfShow;
  }
  const { hasColumnP } = usePermission();

  const getViewColumns = computed(() => {
    const viewColumns = sortFixedColumn(unref(getColumnsRef));

    const mapFn = column => {
      const { slots, customRender, format, edit, editRow, flag } = column;

      if (!slots || !slots?.title) {
        // column.slots = { title: `header-${dataIndex}`, ...(slots || {}) };
        column.customTitle = column.title;
        Reflect.deleteProperty(column, 'title');
      }
      const isDefaultAction = [INDEX_COLUMN_FLAG, ACTION_COLUMN_FLAG].includes(flag!);
      if (!customRender && format && !edit && !isDefaultAction) {
        column.customRender = ({ text, record, index }) => {
          return formatCell(text, format, record, index);
        };
      }

      // edit table
      if ((edit || editRow) && !isDefaultAction) {
        column.customRender = renderEditCell(column);
      }
      return reactive(column);
    };

    const columns = cloneDeep(viewColumns);
    return columns
      .filter(column => hasColumnP(column.auth) && isIfShow(column))
      .map(column => {
        // Support table multiple header editable
        if (column.children?.length) {
          column.children = column.children.map(mapFn);
        }
        return mapFn(column);
      });
  });

  watch(
    () => unref(propsRef).columns,
    columns => {
      columnsRef.value = columns;
      cacheColumns = columns?.filter(item => !item.flag) ?? [];
    },
  );

  function setCacheColumnsByField(dataIndex: string | undefined, value: Partial<BasicColumn>) {
    if (!dataIndex || !value) {
      return;
    }
    cacheColumns.forEach(item => {
      if (item.dataIndex === dataIndex) {
        Object.assign(item, value);
        return;
      }
    });
  }
  /**
   * set columns
   * @param columnList key｜column
   */
  function setColumns(columnList: Partial<BasicColumn>[] | (string | string[])[]) {
    const columns = cloneDeep(columnList);
    if (!isArray(columns)) return;

    if (columns.length <= 0) {
      columnsRef.value = [];
      return;
    }

    const firstColumn = columns[0];

    const cacheKeys = cacheColumns.map(item => item.dataIndex);

    if (!isString(firstColumn) && !isArray(firstColumn)) {
      columnsRef.value = columns as BasicColumn[];
    } else {
      const columnKeys = (columns as (string | string[])[]).map(m => m.toString());
      const newColumns: BasicColumn[] = [];
      cacheColumns.forEach(item => {
        newColumns.push({
          ...item,
          defaultHidden: !columnKeys.includes(item.dataIndex?.toString() || (item.key as string)),
        });
      });
      // Sort according to another array
      if (!isEqual(cacheKeys, columns)) {
        newColumns.sort((prev, next) => {
          return columnKeys.indexOf(prev.dataIndex?.toString() as string) - columnKeys.indexOf(next.dataIndex?.toString() as string);
        });
      }
      columnsRef.value = newColumns;
    }
  }

  function getColumns(opt?: GetColumnsParams) {
    const { ignoreIndex, ignoreAction, sort } = opt || {};
    let columns = toRaw(unref(getColumnsRef));
    if (ignoreIndex) {
      columns = columns.filter(item => item.flag !== INDEX_COLUMN_FLAG);
    }
    if (ignoreAction) {
      columns = columns.filter(item => item.flag !== ACTION_COLUMN_FLAG);
    }

    if (sort) {
      columns = sortFixedColumn(columns);
    }

    return columns;
  }
  function getCacheColumns() {
    return cacheColumns;
  }
  function setCacheColumns(columns: BasicColumn[]) {
    if (!isArray(columns)) return;
    cacheColumns = columns.filter(item => !item.flag);
  }

  /**
   * 拖拽列宽修改列的宽度
   */
  function setColumnWidth(w: number, col: BasicColumn) {
    col.width = w;
  }

  return {
    getColumnsRef,
    getCacheColumns,
    getColumns,
    setColumns,
    setColumnWidth,
    getViewColumns,
    setCacheColumnsByField,
    setCacheColumns,
  };
}

function sortFixedColumn(columns: BasicColumn[]) {
  const fixedLeftColumns: BasicColumn[] = [];
  const fixedRightColumns: BasicColumn[] = [];
  const defColumns: BasicColumn[] = [];
  for (const column of columns) {
    if (column.fixed === 'left') {
      fixedLeftColumns.push(column);
      continue;
    }
    if (column.fixed === 'right') {
      fixedRightColumns.push(column);
      continue;
    }
    defColumns.push(column);
  }
  return [...fixedLeftColumns, ...defColumns, ...fixedRightColumns].filter(item => !item.defaultHidden);
}

function formatToTag(record, list, text) {
  if (text == null || typeof text == 'undefined') return '/';
  const _list = JSON.parse(list);
  if (!_list.length) {
    return text;
  }
  let tempObj = _list.find(o => o.id == text);
  if (!tempObj) {
    if (!_list[0].rowKey) {
      return '/';
    }
    tempObj = _list[0];
  }
  const _class = tempObj.theme ? tempObj.theme + ' table-tag' : '';
  let customAttr: any = {
    class: _class,
  };
  if (!_class) {
    const color = tempObj.color || 'blue';
    customAttr = {
      class: 'custom table-tag',
      style: {
        '--tag-color': color,
        '--tag-bg-color': hexToRGB(lighten(color, 10), 0.1),
      },
    };
  }
  return h('div', customAttr, record[tempObj.rowKey] || tempObj.fullName);
}

// TODO 解决customRender异步问题
async function formatToDictionaryText(dictId, text) {
  const options = await baseStore.getDictionaryData(dictId);
  console.log(options);
  if (!options || !(options instanceof Array)) {
    return text;
  }
  const target = options.find(item => item.enCode == text);
  console.log(target);
  if (!target) {
    return text;
  }
  return target.fullName;
}

// format cell
export function formatCell(text: string, format: CellFormat, record: Recordable, index: number) {
  if (!format) {
    return text;
  }

  // custom function
  if (isFunction(format)) {
    return format(text, record, index);
  }

  try {
    if (isString(format) && typeof text !== 'undefined' && text !== null) {
      // date type
      const DATE_FORMAT_PREFIX = 'date|';
      if (format.startsWith(DATE_FORMAT_PREFIX)) {
        const dateFormat = format.replace(DATE_FORMAT_PREFIX, '');

        if (!dateFormat) {
          return text;
        }
        return formatToDate(text, dateFormat);
      }
      // state type
      const STATUS_PREFIX = 'tag|';
      if (format.startsWith(STATUS_PREFIX)) {
        const tagFormat = format.replace(STATUS_PREFIX, '');

        if (!tagFormat) {
          return text;
        }
        return formatToTag(record, tagFormat, text);
      }

      // dictionary type
      const DICTIONARY_PREFIX = 'dict|';
      if (format.startsWith(DICTIONARY_PREFIX)) {
        const dictId = format.replace(DICTIONARY_PREFIX, '');

        if (!dictId) {
          return text;
        }
        console.log(dictId, 'dictId');
        return formatToDictionaryText(dictId, text);
      }
    }

    // Map
    if (isMap(format)) {
      return format.get(text);
    }
  } catch (error) {
    return text;
  }
}
