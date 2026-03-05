<script setup lang="ts">
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { TableAction } from '/@/components/Table';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { cloneDeep, isError } from 'lodash-es';
  import { buildUUID } from '/@/utils/uuid';
  import { getProcessFlowColumns, getRules } from './config';
  import { reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isEmpty, isNullOrUnDef } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getProcessAllList } from '/@/api/engineering/quotatios';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const props = defineProps({
    getValues: {
      type: Function,
      default: () => {
        return () => {};
      },
    },
  });

  const emit = defineEmits(['materialSetState']);
  const sum = reactive({
    seq: t('component.table.summary'),
    lineAdjustmentTime: '0.00',
    defectiveRate: '0.00%',
  });

  const rowData = {
    processCode: null,
    processCodeName: '',
    lineAdjustmentTime: 0,
    capacity: null,
    defectiveRate: 0,
  };

  const gridOptions = {
    id: 'engineering-data-produce-processFlow',
    columns: getProcessFlowColumns(props, updateProcess),
    autoResize: true,
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    height: '',
    minHeight: 300,
    toolbarConfig: {
      refresh: false,
    },
    customConfig: {
      allowVisible: false,
    },
    pagerConfig: {
      enabled: false,
    },
    rowConfig: {
      keyField: 'uuid',
    },
    footerData: [sum],
    clipConfig: {
      isPaste: true,
      // afterPasteMethod: handleAfterPaster,
      beforePasteMethod: handleBeforePaster,
    },
    i18nConfig: {
      moduleCode: 'PCCColumn',
    },
    position: 'modal',
    showIndexColumn: true,
  };

  const [Grid, { getDataSource, loadData, remove, insertAt, reloadData, setGridOptions }] = useVbenVxeGrid<VxeGridProps>({
    gridOptions,
  });

  function setInitList() {
    reloadData([
      {
        ...rowData,
      },
    ]);
    sum.lineAdjustmentTime = '0.00';
    sum.defectiveRate = '0.00%';
  }

  function handleChangeTable(type, row) {
    const fullData = getDataSource();
    const data = cloneDeep(fullData);
    const findIndex = fullData.findIndex(item => item.uuid === row.uuid);
    switch (type) {
      case 'addBaseIndex':
        data.splice(findIndex + 1, 0, { ...rowData, uuid: buildUUID() });
        break;
      case 'copy':
        const copyData = cloneDeep(fullData[findIndex]);
        delete copyData.id;
        data.splice(findIndex + 1, 0, { ...copyData, isMain: 0, uuid: buildUUID() });
        //复制行,需要同步更新总计数据
        setProcessFlowTable(data);
        break;
      case 'delete':
        data.splice(findIndex, 1);
        // 删除,需要同步更新总计数据
        setProcessFlowTable(data);
        break;
    }
    loadData(data);
    emit('materialSetState', {
      processList: data,
    });
  }

  function updateProcess() {
    emit('materialSetState', {
      processList: getDataSource(),
    });
  }
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

  // 填充数据
  function setProcessFlowTable(list) {
    return new Promise((resolve, reject) => {
      let lineAdjustmentTime = 0;
      let defectiveRate = 0;
      list.forEach(item => {
        lineAdjustmentTime = parseFloat(item.lineAdjustmentTime || 0) + lineAdjustmentTime;
        defectiveRate = parseFloat(item.defectiveRate || 0) + defectiveRate;
      });
      sum.lineAdjustmentTime = lineAdjustmentTime.toFixed(2);
      sum.defectiveRate = defectiveRate.toFixed(2) + '%';
      requestIdleCallbackAdapter(() => {
        reloadData(list);
        resolve(list);
      });
    });
  }

  const state = reactive({
    disabled: false,
  });

  function setDisabled(disabled: boolean) {
    state.disabled = disabled;
    if (disabled) {
      const columns = getProcessFlowColumns(props, updateProcess);
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

  // 检验数据
  function validateProcessFlow() {
    return new Promise((resolve, reject) => {
      const list = getDataSource();
      if (!list || !list.length) {
        reject(t('common.inputText', [t('common.process')]));
        return;
      }
      list.forEach((item, index) => {
        if (isNullOrUnDef(item.processCode)) {
          throw new Error(t('dict.PCCColumn.selectProcessFlowProcess', [index + 1]));
        } else if (isNullOrUnDef(item.lineAdjustmentTime)) {
          throw new Error(t('dict.PCCColumn.inputProcessFlowSetupTime', [index + 1]));
        } else if (isNullOrUnDef(item.defectiveRate)) {
          throw new Error(t('dict.PCCColumn.inputProcessFlowDefectiveRate', [index + 1]));
        }
      });
      resolve(true);
    });
  }

  async function handleBeforePaster({ targetAreas, pasteCells, $grid }) {
    try {
      const editRules = getRules();
      const { cols, rows } = targetAreas[0];

      const validateFnList = {};
      // 校验数据
      pasteCells.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const col = cols[colIndex];
          const originRow = rows[rowIndex];

          const { field } = col;
          const rule = editRules[field];
          const { validator } = rule[0];
          // 对查询结果进行特殊处理，如果当前是材料列，先存储料号。其他列进行校验
          if (field === 'processCode') {
            validateFnList[cell] = validator.bind(null, { col, cell, row: originRow, $grid });
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
      if (!isEmpty(validateFnList)) {
        const { data } = await getProcessAllList();
        console.log('🚀 ~ handleBeforePaster ~ data: ', data);
        console.log(validateFnList);
        data.forEach(item => {
          // 执行校验函数
          const formatProcess = `${item.code}(${item.name})`;
          const result = validateFnList[formatProcess]?.(item);
        });
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  function handleAddRows(rowCount) {
    const rows: any = [];
    for (let i = 0; i < rowCount; i++) {
      rows.push({ ...rowData, uuid: buildUUID() });
    }
    requestIdleCallbackAdapter(() => {
      insertAt(rows, -1);
    });
  }

  defineExpose({
    setProcessFlowTable,
    getDataSource,
    setDisabled,
    validateProcessFlow,
    setInitList,
  });
</script>

<template>
  <a-card>
    <Grid class="min-h-300px h-full">
      <template #toolbar-actions>
        <Subtitle placement="vxe" :title="t('common.process')" id="process" :extra="{ show: !state?.disabled }" @addColumn="handleAddRows" />
      </template>
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
  </a-card>
</template>
