<script lang="ts" setup>
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { TableAction } from '/@/components/Table';
  import { cloneDeep, isError } from 'lodash-es';
  import { buildUUID } from '/@/utils/uuid';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table';
  import { isEmpty, isNullOrUnDef } from '/@/utils/is';
  import { resetPartNumber } from '/@/views/engineering/PCCBeta/components/PccMaterial/autoSelectInsidePartNumber';
  import { getSemiFinishedColumn } from '/@/views/engineering/PCCBeta/components/PccSemiFinished/config';
  import { getRules } from '/@/views/engineering/PCCBeta/components/PccSemiFinished/getRules';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, nextTick } from 'vue';
  import { getBatchSemiFinishedProductsByCode } from '/@/api/engineering/semifinishedproducts';
  import { ModeTypeEnum } from '/@/enums/modeEnum';

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const emit = defineEmits(['calcSemiFinishedUseQty']);

  const props = defineProps({
    getValues: {
      type: Function,
      default: () => {
        return () => {};
      },
    },
  });

  const state = reactive({
    mode: ModeTypeEnum.EDIT,
  });

  const rowData = {
    semiFinished: null,
    productionTypeName: null,
    hasBom: null,
    preparation: null,
    materialDosage: null,
    qty: null,
    unit: 'PCS',
    remarks: null,
  };

  const [Grid, { getDataSource, loadData, remove, insertAt, setLoading, reloadData, setGridOptions }] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-PCCBeta-PCCDetail-semiFinished',
      autoResize: true,
      columns: getSemiFinishedColumn(props, emit),
      showIndexColumn: true,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      maxHeight: '535px',
      minHeight: '200px',
      toolbarConfig: {
        refresh: false,
      },
      customConfig: {
        allowVisible: false,
      },
      mouseConfig: {
        area: true, // 是否开启区域选取
      },
      areaConfig: {
        multiple: true, // 是否启用多区域选取功能
      },
      pagerConfig: {
        enabled: false,
      },
      keyboardConfig: {
        isClip: true, // 是否开启复制粘贴
        isEdit: true, // 是否开启任意键进入编辑（功能键除外）
        isDel: true, // 是否开启删除键功能
        isEsc: true, // 是否开启Esc键关闭编辑功能
      },
      keepSource: true,
      rowConfig: {
        keyField: 'uuid',
      },
      // editRules: getProcessRules(),
      height: '',
      data: [cloneDeep(rowData)],
      clipConfig: {
        isPaste: true,
        beforePasteMethod: handleBeforePaster,
      },
      i18nConfig: {
        moduleCode: 'PCCColumn',
      },
    },
    gridEvents: {
      'cell-delete-value': ({ row, column }) => {
        // 支持按delete按键删除Name
        const { field } = column;
        if (!isNullOrUnDef(row[`${field}Name`])) {
          row[`${field}Name`] = null;
        }
        if (field === 'processCode') {
          row['processName'] = null;
        }
        // 删除键需要清空料号
        if (['eightCode', 'width'].includes(field)) {
          row[field] = null;
          resetPartNumber({ row });
        }
      },
    },
  });

  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-add',
        onClick: handleChangeTable.bind(null, 'addBaseIndex', row),
      },
      {
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleChangeTable.bind(null, 'copy', row),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        auth: 'btn_remove',
        modelConfirm: {
          onOk: handleChangeTable.bind(null, 'delete', row),
        },
      },
    ];
  }

  async function handleChangeTable(type, row) {
    const fullData = getDataSource();
    const data = cloneDeep(fullData);
    const findIndex = fullData.findIndex(item => item.uuid === row.uuid);
    if (type === 'addBaseIndex') {
      // 新增
      data.splice(findIndex + 1, 0, { ...rowData, uuid: buildUUID() });
      loadData(data);
    } else if (type === 'copy') {
      // 复制
      const copyData = cloneDeep(fullData[findIndex]);
      delete copyData.id;
      data.splice(findIndex + 1, 0, {
        ...copyData,
        uuid: buildUUID(),
      });
      loadData(data);
    } else if (type === 'delete') {
      // 删除
      data.splice(findIndex, 1);
      loadData(data);
    }
  }

  function handleBeforePaster({ targetAreas, pasteCells, $grid }) {
    try {
      const editRules = getRules();
      const { cols, rows } = targetAreas[0];

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
          if (field === 'semiFinished') {
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
        getBatchSemiFinishedProductsByCode(Object.keys(materialFnList)).then(({ data }) => {
          console.log(materialFnList, 'materialFnListmaterialFnListmaterialFnListmaterialFnList');
          data.forEach(item => {
            // 执行校验函数
            console.log(item['semiFinishedProductsPartNumber'], "item['semiFinished']");
            materialFnList[item['semiFinishedProductsPartNumber']]?.(item);
          });
        });
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  function handleAddRows(rowCount) {
    if (state.mode === ModeTypeEnum.AUDIT_EDIT) return createMessage.warn('审核状态下不能新增行');
    const rows = [];
    for (let i = 0; i < rowCount; i++) {
      rows.push({ ...rowData, uuid: buildUUID() });
    }
    requestIdleCallbackAdapter(() => {
      insertAt(rows, -1);
    });
  }

  // 设置表格数据
  function setSemiFinishedTableData(data) {
    console.log('🚀 ~ setSemiFinishedTableData ~ data: ', data);
    reloadData(
      (data || []).map(item => ({
        ...item,
        uuid: item.id,
        semiFinishedName: item.semiFinished,
      })),
    );
    setTimeout(() => {
      console.log(getDataSource(), 'getDataSource()getDataSource()getDataSource()');
    }, 3000);
  }
  // 表格数据初始化
  function setInit() {
    reloadData([cloneDeep(rowData)]);
  }

  // 是否可编辑
  function setDisabled(disabled: boolean) {
    state.disabled = disabled;
    if (disabled) {
      const columns = getSemiFinishedColumn(props);
      columns.pop();
      setGridOptions({
        columns,
        editConfig: {
          enabled: false,
        },
        keyboardConfig: {
          isEdit: false,
          isPaste: false,
        },
      });
    }
  }

  async function setReviewNode(data) {
    await nextTick();
    state.mode = ModeTypeEnum.AUDIT_EDIT;
    const columns = getSemiFinishedColumn(props);
    columns.pop();
    setGridOptions({
      columns,
    });
    console.log(columns, 'columnscolumnscolumns');
    await nextTick();
    console.log(123123123);
    const list = data.map(item => ({
      ...item,
      semiFinishedName: item.semiFinished,
    }));
    console.log(list, 'listlistlistlistlistlistlistlist');
    reloadData(list);
  }

  // 暴露出去的方法
  defineExpose({
    setDisabled,
    getDataSource,
    setSemiFinishedTableData,
    setInit,
    setReviewNode,
  });
</script>

<template>
  <a-card>
    <Grid>
      <template #toolbar-actions>
        <Subtitle
          placement="vxe"
          v-if="!state.disabled"
          :title="t('dict.CommonCol.SemiFinishedProduct')"
          id="halfFinished"
          :defaultValue="2"
          :extra="{ show: true }"
          @addColumn="handleAddRows" />
        <Subtitle v-else :title="t('dict.CommonCol.SemiFinishedProduct')" id="halfFinished" />
      </template>
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
  </a-card>
</template>
