<!--
 * @Author: wenzhenjin
 * @Date: 2025-04-08 14:18:55
 * @LastEditors: zengjianyu zeng.jian.yu@lingyiitech.com
 * @LastEditTime: 2025-10-16 17:21:28
 * @FilePath: \lydc.server.web\src\views\engineering\quotationBom\components\Material\Material.vue
-->
<script setup lang="ts">
  import { useMessage } from '/@/hooks/web/useMessage';
  import { buildUUID } from '/@/utils/uuid';
  import { cloneDeep, isError } from 'lodash-es';
  import { useVbenVxeGrid, type VxeGridProps } from '/@/adapter/vxe-table';
  import { getMaterialColumns, calculateCostCenterPrice, calculateSum } from './config';
  import { reactive, watch, ref, defineAsyncComponent } from 'vue';
  import { useQuotaStore } from '/@/views/engineering/quotationBom/store/index';
  import { bignumber, chain, format, divide } from 'mathjs';
  import { isEmpty, isNullOrUnDef } from '/@/utils/is';
  import { getRules } from '/@/views/engineering/quotationBom/components/Material/getRules';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  import { expandPasteCells } from '../config';
  import { queryMaterialsByCodesCached, queryUsersByCellsCached } from '/@/views/engineering/quotationBom/utils/lookupCache';

  const TableAction = defineAsyncComponent(() => import('/@/components/Table').then(m => m.TableAction));
  const Subtitle = defineAsyncComponent(() => import('/@/components/Subtitle/src/Subtitle.vue'));
  const AddCustomRows = defineAsyncComponent(() => import('/@/views/engineering/pcc/pccApply/components/AddCustomRows.vue'));

  const sumCost = ref(0);

  const { createMessage } = useMessage();

  const { hasBtnP } = usePermission();

  const quotaStore = useQuotaStore();

  const rowData = {
    eightCode: '',
    singleWidth: null,
    originInsideCode: '',
    insideCode: '',
    materialDescription: '',
    singleStepDistance: null,
    singleProcessLosses: 0,
    singleModulus: null,
    singleUseQty: null,
    singleStepLength: null,
    purchaserId: null,
    hasPrice: null,
    wholeWidth: '',
    wholeLength: '',
    wholePrice: '',
    wholeUnit: '',
    utilizationRate: '',
    // 用量倍数，默认为`1`
    materialDosage: 1,
  };

  const props = defineProps({
    currentData: {
      type: Object,
      default: {},
    },
    formValues: {
      type: Object,
      default: {},
    },
    fpy: {
      type: Object,
      default: {},
    },
  });
  const gridOptions = {
    id: 'engineering-quotationBom-makeQuotation-edit-material',
    showIndexColumn: true,
    columns: handleColumn(getMaterialColumns(props, sumCost)),
    maxHeight: '800px',
    minHeight: '260px',
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    scrollY: {
      enabled: true,
      gt: 40,
    },
    mouseConfig: {
      area: true, // 是否开启区域选取
    },
    areaConfig: {
      multiple: true, // 是否启用多区域选取功能
    },
    pagerConfig: {
      enabled: false,
      pageSize: 1000,
    },
    keyboardConfig: {
      isClip: true, // 是否开启复制粘贴
      isEdit: true, // 是否开启任意键进入编辑（功能键除外）
      isDel: true, // 是否开启删除键功能
      isEsc: true, // 是否开启Esc键关闭编辑功能
    },
    showOverflow: true,
    keepSource: true,
    rowConfig: {
      keyField: 'uuid',
    },
    // editRules: getProcessRules(),
    height: '',
    data: [cloneDeep(rowData)],
    // footerData: [sum],
    clipConfig: {
      isPaste: true,
      // afterPasteMethod: handleAfterPaster,
      excludeFields: ['originInsideCode'],
      beforePasteMethod: handleBeforePaster,
    },
    dblClickHeadConfig: {
      excludeFields: ['eightCode', 'singleWidth', 'originInsideCode', 'materialDescription', 'materialTypeFromManufacturer'],
    },
  };

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions,
    gridEvents: {
      'cell-delete-value': ({ row, column }) => {
        // 支持按delete按键删除Name
        const { field } = column;
        if (!isNullOrUnDef(row[`${field}Name`])) {
          row[`${field}Name`] = null;
        }
        if (field === 'eightCode') {
          row['insideCode'] = null;
          row['originInsideCode'] = null;
          row['originInsideCodeName'] = null;
        }
      },
    },
  });

  function filterColumnsWithLodash(columns, excludedFields) {
    const hiddenFields = new Set(excludedFields || []);
    const walk = cols =>
      (cols || [])
        .map(col => {
          if (hiddenFields.has(col.field)) return null;
          if (Array.isArray(col.children) && col.children.length) {
            const children = walk(col.children);
            if (children.length) return { ...col, children };
            const { children: _children, ...rest } = col;
            return rest;
          }
          return col;
        })
        .filter(Boolean);
    return walk(columns);
  }

  function handleColumn(columns) {
    if (hasBtnP('price-material')) return columns;
    return filterColumnsWithLodash(columns, ['cost', 'wholePrice']);
  }

  const { getDataSource, remove, insertAt } = gridApi;
  // 监听还原直通率变化
  watch(
    () => quotaStore.getFirstProcessFpy,
    newFpy => {
      const datalist = getDataSource();
      if (!Array.isArray(datalist) || datalist.length === 0) return;

      const fpy = newFpy || 100;
      const nextSingleProcessLosses =
        format(
          chain(bignumber(1))
            .subtract(divide(bignumber(fpy), bignumber(100)))
            .multiply(100)
            .done(),
          { notation: 'fixed', precision: 2 },
        ) + '%';

      // 重置材料制程损耗
      // 公式 1 - (singleProcessLosses / 100)
      requestIdleCallbackAdapter(() => {
        datalist.forEach(item => {
          item.singleProcessLosses = nextSingleProcessLosses;

          const { singleWidth, wholePrice, wholeWidth, wholeLength, singleStepDistance, singleModulus, singleProcessLosses, wholeUnit, materialDosage } = item;
          item.cost = calculateCostCenterPrice(
            wholePrice,
            wholeWidth,
            singleWidth,
            wholeLength,
            singleStepDistance,
            singleModulus,
            singleProcessLosses,
            wholeUnit,
            materialDosage,
          );
        });
      });
    },
  );

  // 粘贴
  function handleBeforePaster({ targetAreas, pasteCells, $grid }) {
    try {
      const editRules = getRules(gridApi);
      const { cols, rows } = targetAreas[0];

      expandPasteCells(pasteCells, rows);

      // 收集粘贴的物料料号
      const materialFnList = {};
      // 收集采购ID
      const purchaserFnList = [];
      // 校验数据
      pasteCells.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const col = cols[colIndex];
          const originRow = rows[rowIndex];

          const { field } = col;
          const rule = editRules[field];
          const { validator } = rule[0];
          // 对查询结果进行特殊处理，如果当前是材料列，先存储料号。其他列进行校验
          if (field === 'originInsideCode') {
            // setLoading(true);
            materialFnList[cell] = validator.bind(null, { col, cell, row: originRow, $grid });
            return null;
          } else if (field === 'purchaserId') {
            // purchaserFnList[cell] = validator.bind(null, { col, cell, row: originRow, $grid });
            purchaserFnList.push({
              cell,
              fn: validator.bind(null, { col, cell, row: originRow, $grid }),
            });
            return null;
          }

          const result = validator({ col, cell, row: originRow, $grid });
          if (isNullOrUnDef(result)) return false;
          if (isError(result)) {
            createMessage.warning(result?.message);
          }
          // 校验数据通过
        });
      });
      // 重新执行粘贴的料号逻辑
      if (!isEmpty(materialFnList)) {
        queryMaterialsByCodesCached(Object.keys(materialFnList)).then(materialMap => {
          Object.keys(materialFnList).forEach(code => materialFnList[code]?.(materialMap.get(code)));
        });
      }
      if (!isEmpty(purchaserFnList)) {
        queryUsersByCellsCached(purchaserFnList.map(item => item.cell)).then(userMap => {
          purchaserFnList.forEach(value => value.fn(userMap.get(value.cell)));
        });
        return false;
      }
    } catch (e) {}
    return false;
  }

  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-add',
        // auth: 'btn_upload_pic',
        // tooltip: t('common.uploadDrawingText'),
        onClick: handleChangeTable.bind(null, 'addBaseIndex', row),
      },
      {
        icon: 'icon-ym icon-ym-btn-copy',
        auth: 'btn_detail',
        // tooltip: t('sys.errorLog.tableActionDesc'),
        onClick: handleChangeTable.bind(null, 'copy', row),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        auth: 'btn_remove',
        modelConfirm: {
          onOk: handleChangeTable.bind(null, 'delete', row),
        },
        // tooltip: t('common.deleted'),
      },
    ];
  }

  function handleAddRows(rowCount) {
    const rows: Array<any> = [];
    const fpy = quotaStore.getFirstProcessFpy || 0;
    const singleProcessLosses =
      format(
        chain(bignumber(1))
          .subtract(divide(bignumber(fpy), bignumber(100)))
          .multiply(100)
          .done(),
        { notation: 'fixed', precision: 2 },
      ) + '%';
    for (let i = 0; i < rowCount; i++) {
      rows.push({ ...rowData, uuid: buildUUID(), singleProcessLosses });
    }
    requestIdleCallbackAdapter(() => {
      insertAt(rows, -1);
    });
  }

  async function handleChangeTable(type, row) {
    const uuid = buildUUID();
    if (type === 'addBaseIndex') {
      // 新增
      const fpy = quotaStore.getFirstProcessFpy || 0;
      const singleProcessLosses =
        format(
          chain(bignumber(1))
            .subtract(divide(bignumber(fpy), bignumber(100)))
            .multiply(100)
            .done(),
          { notation: 'fixed', precision: 2 },
        ) + '%';
      try {
        await gridApi.insertNextAt([{ ...rowData, singleProcessLosses, uuid }], row);
      } catch (e: any) {
        createMessage.error(e?.message || '插入失败');
      }
    } else if (type === 'copy') {
      // 复制
      const copyData = cloneDeep(row);
      delete copyData.id;

      try {
        await gridApi.insertNextAt([{ ...copyData, uuid }], row);
      } catch (e: any) {
        createMessage.error(e?.message || '插入失败');
      }
    } else if (type === 'delete') {
      // 删除
      remove(row);
    }
  }
  const state = reactive({
    disabled: false,
  });
  function setDisabled(disabled: boolean) {
    state.disabled = disabled;
    if (disabled) {
      const columns = handleColumn(getMaterialColumns(props, sumCost));
      columns.pop();
      gridApi.setGridOptions({
        columns,
      });
    }
  }

  defineExpose({
    materialGridApi: gridApi,
    getDataSource,
    reloadData: gridApi.reloadData,
    calculateSum: calculateSum.bind(null, gridApi.grid, sumCost),
    setDisabled,
  });
</script>

<template>
  <a-card>
    <Grid>
      <template #toolbar-actions>
        <Subtitle title="材料" class="mt-8px" id="material" :extra="{ show: true, hideAdd: true }">
          <template #afterTitle>
            <a-space v-if="hasBtnP('price-material')">
              <a-divider id="process" type="vertical" class="ml-10px"></a-divider>
              <div
                >成本小计/KPCS:<span style="color: #ff7b00" class="ml-10px">{{ sumCost }}</span></div
              >
            </a-space>
          </template>
        </Subtitle>
      </template>
      <template #toolbar-tools>
        <AddCustomRows v-if="!state.disabled" @submit="handleAddRows" />
      </template>
      <template #action="{ rowIndex, row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
  </a-card>
</template>
