<script setup lang="ts">
  import { useMessage } from '/@/hooks/web/useMessage';
  import { TableAction } from '/@/components/Table';
  import { buildUUID } from '/@/utils/uuid';
  import { cloneDeep, isError, reject } from 'lodash-es';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { isNullOrUnDef } from '/@/utils/is';
  import { getBomPackageColumns, calculateSum } from './config';
  import { getRules } from './getRules';
  import { ref, reactive, defineAsyncComponent } from 'vue';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { expandPasteCells } from '../config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { queryMaterialsByCodesCached, queryUsersByCellsCached } from '/@/views/engineering/quotationBom/utils/lookupCache';

  const Subtitle = defineAsyncComponent(() => import('/@/components/Subtitle/src/Subtitle.vue'));
  const AddCustomRows = defineAsyncComponent(() => import('/@/views/engineering/pcc/pccApply/components/AddCustomRows.vue'));

  const { t } = useI18n();

  const { createMessage } = useMessage();

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
  });
  const sumCost = ref(0);

  const rowData: any = {
    moldType: '',
    uuid: buildUUID(),
  };

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-quotationBom-makeQuotation-edit-package',
      showIndexColumn: true,
      columns: handleColumn(getBomPackageColumns(props, sumCost)),
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
      data: [cloneDeep(rowData)] as any[],
      // footerData: [sum],
      clipConfig: {
        isPaste: true,
        // afterPasteMethod: handleAfterPaster,
        beforePasteMethod: handleBeforePaster,
      },
    } as any,
  });

  const { getDataSource, remove, insertAt } = gridApi;

  function handleColumn(columns: any[]) {
    const hasPermission = hasBtnP('price-packaging');
    if (hasPermission) return columns;

    const hiddenFields = new Set(['price', 'cost']); // 使用 Set 提升存在性判断性能

    return reject(columns, item => hiddenFields.has(item.field));
  }
  function handleAddRows(rowCount) {
    const rows: any[] = [];
    for (let i = 0; i < rowCount; i++) {
      rows.push({ ...rowData, uuid: buildUUID() });
    }
    requestIdleCallbackAdapter(() => {
      insertAt(rows, -1);
    });
  }

  function handleBeforePaster({ targetAreas, pasteCells, $grid }: any): void {
    try {
      const editRules = getRules(gridApi);
      const { cols, rows } = targetAreas[0];

      expandPasteCells(pasteCells, rows);

      // 收集粘贴的物料料号
      const materialFnList: { cell: any; fn: any }[] = [];
      // 收集粘贴的采购人员
      const purchaserFnList: { cell: any; fn: any }[] = [];

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
            materialFnList.push({
              cell,
              fn: validator.bind(null, { col, cell, row: originRow, $grid }),
            });
            return;
          }

          if (field === 'purchaserId') {
            purchaserFnList.push({
              cell,
              fn: validator.bind(null, { col, cell, row: originRow, $grid }),
            });
            return;
          }

          const result = validator({ col, cell, row: originRow, $grid });
          if (isNullOrUnDef(result)) return;

          if (isError(result)) {
            createMessage.warning(result?.message);
          }
          // 校验数据通过
        });
      });

      // 重新执行粘贴的料号逻辑
      if (materialFnList.length > 0) {
        queryMaterialsByCodesCached(materialFnList.map(item => item.cell)).then(materialMap => {
          materialFnList.forEach(item => item.fn(materialMap.get(item.cell)));
        });
      }

      if (purchaserFnList.length > 0) {
        queryUsersByCellsCached(purchaserFnList.map(item => item.cell)).then(userMap => {
          purchaserFnList.forEach(value => value.fn(userMap.get(value.cell)));
        });

        return;
      }
    } catch (e) {
      console.error('handleBeforePaster error:', e);
    }
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
      const columns = handleColumn(getBomPackageColumns(props, sumCost));
      columns.pop();
      gridApi.setGridOptions({
        columns,
      });
    }
  }

  function reloadData(dataList: Array<any>) {
    gridApi.reloadData(dataList);
    if (!Array.isArray(dataList) || dataList.length === 0) {
      handleAddRows(1);
      return false;
    }
  }

  defineExpose({
    packageGridApi: gridApi,
    getDataSource,
    reloadData,
    calculateSum: calculateSum.bind(null, gridApi.grid, sumCost),
    setDisabled,
  });
</script>

<template>
  <a-card>
    <Grid>
      <template #toolbar-actions>
        <Subtitle :title="t('common.package')" class="mt-8px" id="packaging" :extra="{ show: true, hideAdd: true }">
          <template #afterTitle>
            <a-space v-if="hasBtnP('price-packaging')">
              <a-divider type="vertical" class="ml-10px"></a-divider>
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
