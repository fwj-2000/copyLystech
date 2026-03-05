<!--
 * @Author: wenzhenjin
 * @Date: 2025-05-14 14:26:49
 * @LastEditors: zengjianyu zeng.jian.yu@lingyiitech.com
 * @LastEditTime: 2025-10-16 17:21:40
 * @FilePath: \lydc.server.web\src\views\engineering\quotationBom\components\Mold\Mold.vue
-->
<script setup lang="ts">
  import { useMessage } from '/@/hooks/web/useMessage';
  import { TableAction } from '/@/components/Table';
  import { buildUUID } from '/@/utils/uuid';
  import { cloneDeep, difference, get, isError, reject } from 'lodash-es';

  import { useVbenVxeGrid, type VxeGridProps } from '/@/adapter/vxe-table';
  import { union, keys as lodashKeys, isEqual, uniq } from 'lodash-es';
  import { bignumber, chain, format, divide } from 'mathjs';
  import { isEmpty, isNullOrUnDef } from '/@/utils/is';
  import { getMoldColumns } from './config';
  import { getRules } from './getRules';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import AddCustomRows from '/@/views/engineering/pcc/pccApply/components/AddCustomRows.vue';
  import { ref, reactive } from 'vue';
  import { calculateSum } from '/@/views/engineering/quotationBom/components/Mold/config';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { expandPasteCells } from '../config';
  import { queryMaterialsByCodesCached } from '/@/views/engineering/quotationBom/utils/lookupCache';

  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  const { createMessage } = useMessage();
  const rowData = {
    moldType: '',
  };

  const { hasBtnP } = usePermission();
  const sumCost = ref(0);

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-quotationBom-makeQuotation-edit-mold',
      columns: getMoldColumns(sumCost),
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
      maxHeight: '740px',
      height: '',
      minHeight: '220px',
      data: [cloneDeep(rowData)],
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
    const hasPermission = hasBtnP('price-mould');
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
      const materialFnList = {};
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
        const keys = Object.keys(materialFnList);
        queryMaterialsByCodesCached(keys).then(materialMap => {
          keys.forEach(code => materialFnList[code]?.(materialMap.get(code)));
        });
      }
    } catch (e) {}
    return false;
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
      const columns = getMoldColumns(sumCost);
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
    moldGridApi: gridApi,
    getDataSource,
    calculateSum: calculateSum.bind(null, gridApi.grid, sumCost),
    setDisabled,
    reloadData,
  });
</script>

<template>
  <a-card>
    <Grid>
      <template #toolbar-actions>
        <Subtitle title="模具" class="mt-8px" id="mould" :extra="{ show: true, hideAdd: true }">
          <template #afterTitle>
            <a-space v-if="hasBtnP('price-mould')">
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
