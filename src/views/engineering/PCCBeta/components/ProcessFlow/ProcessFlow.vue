<script setup lang="ts">
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { TableAction } from '/@/components/Table';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table';
  import { cloneDeep, isError } from 'lodash-es';
  import { buildUUID } from '/@/utils/uuid';
  import { getProcessFlowColumns, getRules } from '/@/views/engineering/PCCBeta/components/ProcessFlow/config';
  import { nextTick, reactive } from 'vue';
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
    // getStepDistanceList: {
    //   type: Function,
    //   default: () => {
    //     return () => {};
    //   },
    // },
    // getMaterialList: {
    //   type: Function,
    //   default: () => {
    //     return () => {};
    //   },
    // },
    // setTechnologyTableFieldsValue: {
    //   type: Function,
    //   default: () => {
    //     return () => {};
    //   },
    // },
    // getTechnologyTableFieldsValue: {
    //   type: Function,
    //   default: () => {
    //     return () => {};
    //   },
    // },
  });

  const emit = defineEmits(['updateProcess', 'materialSetState', 'calcDowntimeOneHour', 'calcMaterialUseQty', 'calcCapacity', 'calcCapacity']);
  const sum = reactive({
    seq: '合计',
    adjustmentTime: '0.00',
    defectRate: '0.00%',
  });

  const rowData = {
    processCode: null,
    processCodeName: '',
    adjustmentTime: 0,
    capacity: null,
    speed: null,
    speedUnit: null,
    defectRate: 0,
    useNumber: 1,
    isMain: 0,
  };

  const gridOptions = {
    id: 'engineering-PCCBeta-PCCDetail-processFlow',
    columns: getProcessFlowColumns(props, updateProcess, emit),
    autoResize: true,
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    maxHeight: '570px',
    minHeight: '300px',
    height: '',
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
      pageSize: 1000,
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

    data: [],
    footerData: [sum],
    clipConfig: {
      excludeFields: ['isMain'],
      isPaste: true,
      // afterPasteMethod: handleAfterPaster,
      beforePasteMethod: handleBeforePaster,
    },
    i18nConfig: {
      moduleCode: 'PCCColumn',
    },
    dblClickHeadConfig: {
      excludeFields: ['processCode', 'capacity', 'speed', 'speedUnit', 'isMain'],
    },
  };

  const [Grid, { getDataSource, loadData, remove, insertAt, setLoading, reloadData, recalculate, setGridOptions }] = useVbenVxeGrid({
    gridOptions,
  });

  function getInitList() {
    return [
      {
        ...rowData,
        processCode: '101',
        processName: `101(${t('dict.PCCApplyColumn.materialPreparation')})`,
        uuid: buildUUID(),
        useNumber: 1,
        isMain: 0,
      },
      {
        ...rowData,
        processCode: null,
        processName: null,
        uuid: buildUUID(),
        useNumber: 1,
        isMain: 1,
      },
      {
        ...rowData,
        processCode: '401',
        processName: `401(${t('dict.PCCApplyColumn.ordinaryEnvironmentTidying')})`,
        uuid: buildUUID(),
        useNumber: 1,
        isMain: 0,
      },
      {
        ...rowData,
        processCode: '501',
        processName: `501(${t('dict.PCCApplyColumn.manualPackaging')})`,
        uuid: buildUUID(),
        useNumber: 1,
        isMain: 0,
      },
    ];
  }

  async function handleChangeTable(type, row) {
    const fullData = getDataSource();
    const data = cloneDeep(fullData);
    const findIndex = fullData.findIndex(item => item.uuid === row.uuid);
    if (type === 'addBaseIndex') {
      // 新增
      const { technology } = await props.getValues();
      const process = technology.process;
      data.splice(findIndex + 1, 0, {
        ...rowData,
        uuid: buildUUID(),
        speedUnitName: process === 1 ? '冲次/分钟' : '米/分钟',
      });
      loadData(data);
    } else if (type === 'copy') {
      // 复制
      const copyData = cloneDeep(fullData[findIndex]);
      delete copyData.id;
      data.splice(findIndex + 1, 0, { ...copyData, isMain: 0, uuid: buildUUID() });
      loadData(data);
      // insertAt(
      //   {
      //     ...copyData,
      //     uuid: buildUUID(),
      //   },
      //   findIndex + 1,
      // );
    } else if (type === 'delete') {
      // 删除
      data.splice(findIndex, 1);
      remove(row);
    }
    // requestIdleCallbackAdapter(() => {
    //   recalculate(true)
    // })
    emit('updateProcess', data);
    emit('materialSetState', {
      processList: data,
    });
  }

  async function updateProcess() {
    await nextTick();
    const data = getDataSource();
    emit('updateProcess', data);
    emit('materialSetState', {
      processList: data,
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
        // auth: 'btn_detail',
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

  function setProcessFlowTable(list) {
    return new Promise((resolve, reject) => {
      let adjustmentTime = 0;
      let defectRate = 0;
      list.forEach(item => {
        adjustmentTime = Number.parseFloat(item.adjustmentTime || 0) + adjustmentTime;
        defectRate = Number.parseFloat(item.defectRate || 0) + defectRate;
      });
      sum.adjustmentTime = adjustmentTime.toFixed(2);
      console.log('🚀 ~ setProcessFlowTable ~ defectRate: ', defectRate);

      sum.defectRate = defectRate.toFixed(2) + '%';
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
      const columns = getProcessFlowColumns(props, updateProcess, emit);
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

  defineExpose({
    setProcessFlowTable,
    getDataSource,
    setDisabled,
  });

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
          validateFnList[formatProcess]?.(item);
        });
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  async function handleAddRows(rowCount) {
    const { technology } = await props.getValues();
    console.log('🚀 ~ handleAddRows ~ rowCount: ', rowCount);
    const process = technology.process;
    const rows = [];
    for (let i = 0; i < rowCount; i++) {
      rows.push({
        ...rowData,
        uuid: buildUUID(),
        speedUnit: process === 1 ? 'SPM/min' : 'M/D',
        speedUnitName: process === 1 ? '冲次/分钟' : '米/分钟',
      });
    }
    requestIdleCallbackAdapter(() => {
      insertAt(rows, -1);
    });
  }
</script>

<template>
  <a-card>
    <Grid class="min-h-300px max-h-570px h-full">
      <template #toolbar-actions>
        <Subtitle placement="vxe" :title="t('common.process')" id="process" :defaultValue="2" :extra="{ show: !state.disabled }" @addColumn="handleAddRows" />
      </template>
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
  </a-card>
</template>

<style lang="scss" scoped>
  //:deep(.vxe-table--body-wrapper .body--wrapper){
  //	height: max-content !important;
  //}
</style>
