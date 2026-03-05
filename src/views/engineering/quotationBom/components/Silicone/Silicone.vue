<script setup lang="ts">
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table';
  import { cloneDeep, isError, reject } from 'lodash-es';
  import { isEmpty, isNullOrUnDef } from '/@/utils/is';
  import { buildUUID } from '/@/utils/uuid';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { TableAction } from '/@/components/Table';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  import { getSiliconeColumns } from '/@/views/engineering/quotationBom/components/Silicone/config';
  import { getRules } from '/@/views/engineering/quotationBom/components/Silicone/getRules';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import { ref, reactive } from 'vue';
  import { calculateSum } from '/@/views/engineering/quotationBom/components/BomPackage/config';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { expandPasteCells } from '../config';
  import { queryMaterialsByCodesCached, queryUsersByCellsCached } from '/@/views/engineering/quotationBom/utils/lookupCache';

  const { createMessage } = useMessage();
  const rowData = {};

  const sumCost = ref(0);

  const { hasBtnP } = usePermission();
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

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-quotationBom-makeQuotation-edit-silicon',
      showIndexColumn: true,
      columns: handleColumn(getSiliconeColumns(props, sumCost)),
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      // toolbarConfig: {
      //   enabled: false,
      // },
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
      maxHeight: '760px',
      height: '',
      minHeight: '220px',
      data: [],
      // footerData: [sum],
      clipConfig: {
        isPaste: true,
        // afterPasteMethod: handleAfterPaster,
        beforePasteMethod: handleBeforePaster,
      },
    },
  });

  const { getDataSource, remove, insertAt } = gridApi;

  function handleColumn(columns) {
    const hasPermission = hasBtnP('price-silicone');
    if (hasPermission) {
      return columns;
    }
    const filterArray = ['price', 'cost'];
    // 没有权限只展示部分列
    return reject(columns, item => filterArray.includes(item.field));
  }

  // 粘贴
  function handleBeforePaster({ targetAreas, pasteCells, $grid }) {
    try {
      const editRules = getRules(gridApi);
      const { cols, rows } = targetAreas[0];

      expandPasteCells(pasteCells, rows);

      // 收集粘贴的物料料号
      const materialFnList: any = [];
      // 收集采购ID
      const purchaserFnList: any = [];
      // 校验数据
      pasteCells.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const col = cols[colIndex];
          const originRow = rows[rowIndex];

          const { field } = col;
          const rule = editRules[field];
          const { validator } = rule[0];
          // 对查询结果进行特殊处理，如果当前是材料列，先存储料号。其他列进行校验
          if (field === 'insideCode') {
            // setLoading(true);
            materialFnList.push({
              cell,
              fn: validator.bind(null, { col, cell, row: originRow, $grid }),
            });
            return null;
          } else if (field === 'purchaserId') {
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
        queryMaterialsByCodesCached(materialFnList.map(item => item.cell)).then(materialMap => {
          materialFnList.forEach(item => item.fn(materialMap.get(item.cell)));
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
    const rows = [];
    for (let i = 0; i < rowCount; i++) {
      rows.push({ ...rowData, uuid: buildUUID() });
    }
    requestIdleCallbackAdapter(() => {
      insertAt(rows, -1);
    });
  }

  async function handleChangeTable(type, row) {
    const uuid = buildUUID();
    if (type === 'addBaseIndex') {
      // 新增
      try {
        await gridApi.insertNextAt([{ ...rowData, uuid }], row);
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
      const columns = handleColumn(getSiliconeColumns(props, sumCost));
      columns.pop();
      gridApi.setGridOptions({
        columns,
      });
    }
  }
  defineExpose({
    siliconeGridApi: gridApi,
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
        <Subtitle title="硅胶件" id="silicone" class="mt-8px" :extra="{ show: true, hideAdd: true }">
          <template #afterTitle>
            <a-space v-if="hasBtnP('price-silicone')">
              <a-divider id="silicone" type="vertical" class="ml-10px"></a-divider>
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
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
  </a-card>
</template>
