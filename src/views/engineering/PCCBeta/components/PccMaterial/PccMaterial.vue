<script setup lang="ts">
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { TableAction } from '/@/components/Table';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { cloneDeep, isError, without } from 'lodash-es';
  import { buildUUID } from '/@/utils/uuid';
  import { getPccMaterialColumn, getRules } from '/@/views/engineering/PCCBeta/components/PccMaterial/config';
  import { onMounted, watch, ref, useTemplateRef } from 'vue';
  import { ExtendedApi } from '/@/views/engineering/PCCBeta/components/PccMaterial/use-pccMaterial';
  import { isEmpty, isNullOrUnDef } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { resetPartNumber } from './autoSelectInsidePartNumber';

  const { t } = useI18n();
  type Props = {
    api: ExtendedApi;
    getValues: () => Promise<any[]>;
  };

  const { createMessage } = useMessage();

  const gridRef = useTemplateRef('gridRef');

  const props = withDefaults(defineProps<Props>(), {});
  const emit = defineEmits(['calcDowntimeOneHour', 'calcSingleRowUseQty']);
  const disabled = ref(false);
  watch(
    () => props.api.state.disabled,
    () => {
      disabled.value = props.api.state.disabled;
    },
    {
      deep: true,
    },
  );

  const rowData = {
    stepDistanceNumber: 1,
    eightCode: '',
    width: '',
    originPartNumber: '',
    partNumber: null,
    processCode: null,
    shippingMaterial: null,
    description: '',
    useQtyMultiple: 1,
    color: '',
    useQty: '',
    unit: 'M',
    wholeLength: '',
    wholeWidth: '',
    utilizationRate: '',
    metersTenHour: '',
    remark: '',
  };

  const gridOptions = {
    id: 'engineering-PCCBeta-PCCDetail-material',
    autoResize: true,
    columns: getPccMaterialColumn(emit, props),
    showIndexColumn: true,
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    maxHeight: '735px',
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
    data: [cloneDeep(rowData)],
    clipConfig: {
      isPaste: true,
      // excludeFields: ['originPartNumber'],
      beforePasteMethod: handleBeforePaster,
    },
    i18nConfig: {
      moduleCode: 'PCCColumn',
    },
    dblClickHeadConfig: {
      excludeFields: ['eightCode', 'width', 'originPartNumber', 'partNumber', 'useQty', 'unit', 'wholeLength', 'wholeWidth', 'metersTenHour'],
    },
  };

  const [Grid, $grid] = useVbenVxeGrid({
    gridOptions,
    gridEvents: {
      'cell-delete-value': ({ row: originRow, column, cellAreas, activeArea }) => {
        console.log('🚀 ~ cell-delete-value ~ activeArea: ', activeArea);
        console.log('🚀 ~ cell-delete-value ~ column: ', column);
        console.log('🚀 ~ cell-delete-value ~ originRow: ', originRow);
        console.log('🚀 ~ cell-delete-value ~ cellAreas: ', cellAreas);
        // console.log(cellAreas, activeArea, 'cellAreas, activeAreacellAreas, activeAreacellAreas, activeAreacellAreas, activeArea');
        // console.log("🚀 ~ cell-delete-value ~ row, column: ", row, column);
        // 支持按delete按键删除Name

        cellAreas[0].cols.forEach(col => {
          console.log('🚀 ~  ~ col: ', col);
          const field = col.field;
          cellAreas[0].rows.forEach(row => {
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
          });
        });

        // cellAreas[0].rows.forEach(row => {
        //   if (!isNullOrUnDef(row[`${field}Name`])) {
        //     row[`${field}Name`] = null;
        //   }
        //   if (field === 'processCode') {
        //     row['processName'] = null;
        //   }
        //   // 删除键需要清空料号
        //   if (['eightCode', 'width'].includes(field)) {
        //     row[field] = null;
        //     resetPartNumber({ row });
        //   }
        // });
      },
    },
  });
  const { getDataSource, loadData, remove, insertAt, setLoading } = $grid;

  // const stepDistanceNumber = computed(() => {
  //   console.log("🚀 ~  ~ props?.api?.materialGetStepList?.(): ", props?.api?.materialGetStepList?.());
  //   console.log('stepDistanceNumberstepDistanceNumberstepDistanceNumber');
  //   return props?.api?.materialGetStepList?.();
  // });

  const getStepDistanceNumber = () => {
    return props?.api?.materialGetStepList?.();
  };

  const getProcessList = () => {
    return props?.api?.materialGetProcessList?.();
  };

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
      // remove(row);
      loadData(data);
    }
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

  function handleAddRows(rowCount) {
    const rows = [];
    for (let i = 0; i < rowCount; i++) {
      rows.push({ ...rowData, uuid: buildUUID() });
    }
    requestIdleCallbackAdapter(() => {
      insertAt(rows, -1);
    });
  }

  onMounted(() => {
    props.api?.mount?.($grid);
  });

  // function handleBeforePaster(...rest) {
  //   debugger;
  function handleBeforePaster({ targetAreas, pasteCells, $grid }) {
    try {
      const editRules = getRules(props.api, getProcessList());
      const { cols, rows } = targetAreas[0];

      const materialFnList = {};
      // 校验数据
      pasteCells.forEach((row, rowIndex) => {
        without(row, '').forEach((cell, colIndex) => {
          const col = cols[colIndex];
          const originRow = rows[rowIndex];

          const { field } = col;
          const rule = editRules[field];
          const { validator } = rule[0];
          // 对查询结果进行特殊处理，如果当前是材料列，先存储料号。其他列进行校验
          if (field === 'originPartNumber') {
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
        // getMaterialQueryByMaterialCode(Object.keys(materialFnList)).then(({ data }) => {
        //   data.forEach(item => {
        //     // 执行校验函数
        //     const result = materialFnList[item['materialCode']]?.(item);
        //   });
        // });
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }
</script>

<template>
  <a-card>
    <Grid class="min-h-300px max-h-735px h-full" ref="gridRef">
      <template #toolbar-actions>
        <Subtitle
          placement="vxe"
          :title="t('common.metaria')"
          id="material"
          :defaultValue="2"
          :extra="{ show: !props.api?.state?.disabled }"
          @addColumn="handleAddRows" />
      </template>
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>

      <template #stepDistanceNumber="{ row }">
        <a-select v-model:value="row.stepDistanceNumber" allowClear @change="() => emit('calcSingleRowUseQty', row)">
          <a-select-option v-for="(_, index) in getStepDistanceNumber()" :key="index" :value="index + 1">
            {{ index + 1 }}
          </a-select-option>
        </a-select>
      </template>
      <template #stepDistanceNumber_default="{ row }">
        {{ isNullOrUnDef(row.stepDistanceNumber) ? null : row.stepDistanceNumber }}
      </template>
      <template #processCode="{ row }">
        <a-select
          v-model:value="row.processCode"
          allowClear
          @change="
            index => {
              if (isNullOrUnDef(index)) return (row.processName = null);
              const target = getProcessList()[index - 1];
              row.processName = target.processCode ? `${index}、${target.processCode}` : null;
            }
          ">
          <a-select-option v-for="(item, index) in getProcessList()" :key="index" :value="index + 1"> {{ index + 1 }}、{{ item.processCode }} </a-select-option>
        </a-select>
      </template>
      <template #processCode_default="{ row }">
        {{ isNullOrUnDef(row.processName) ? null : row.processName }}
      </template>
    </Grid>
  </a-card>
</template>
