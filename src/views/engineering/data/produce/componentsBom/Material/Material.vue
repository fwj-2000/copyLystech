<script setup lang="ts">
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { TableAction } from '/@/components/Table';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table';
  import { cloneDeep, isError } from 'lodash-es';
  import { buildUUID } from '/@/utils/uuid';
  import { getMaterialColumn, getRules } from './config';
  import { onMounted } from 'vue';
  import { ExtendedApi } from './useMaterial';
  import { isEmpty, isNullOrUnDef } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getMaterialQueryByMaterialCode } from '/@/api/engineering/pcc';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { rowData } from './config';
  import { resetPartNumber } from './config';

  const { t } = useI18n();
  type Props = {
    api: ExtendedApi;
    currentData: {};
  };

  const { createMessage } = useMessage();
  const emit = defineEmits(['calcSingleRowUseQty']);

  const props = withDefaults(defineProps<Props>(), {});

  const gridOptions = {
    id: 'engineering-data-produce-material',
    autoResize: true,
    columns: getMaterialColumn(emit, props),
    showIndexColumn: true,
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
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
    // editRules: getProcessRules(),
    height: '',
    minHeight: 300,
    data: [cloneDeep(rowData)],
    clipConfig: {
      isPaste: true,
      // excludeFields: ['materialCode'],
      // afterPasteMethod: handleAfterPaster,
      beforePasteMethod: handleBeforePaster,
    },
    i18nConfig: {
      moduleCode: 'PCCColumn',
    },
    position: 'modal',
    dblClickHeadConfig: {
      excludeFields: ['shortMaterialCode', 'width', 'materialCode', 'originPartNumber', 'qty', 'purchaseUnit', 'materialLength', 'materialWidth'],
    },
  };

  const [Grid, $grid] = useVbenVxeGrid({
    gridOptions,
    gridEvents: {
      'cell-delete-value': ({ row, column }) => {
        // 支持按delete按键删除Name
        const { field } = column;
        if (!isNullOrUnDef(row[`${field}Name`])) {
          row[`${field}Name`] = null;
        }
        if (field === 'processNumber') {
          row['processName'] = null;
        }
        // 删除键需要清空料号
        if (['shortMaterialCode', 'width'].includes(field)) {
          row[field] = null;
          resetPartNumber(row);
        }
      },
    },
  });
  const { getDataSource, loadData, remove, insertAt, setLoading } = $grid;

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
      data.splice(findIndex, 1);
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

  function handleBeforePaster({ targetAreas, pasteCells, $grid }) {
    try {
      const editRules = getRules(props.api, getProcessList());
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
          if (field === 'materialCode') {
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
        //     const result = materialFnList[item['originPartNumber']]?.(item);
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
    <Grid ref="gridRef">
      <template #toolbar-actions>
        <Subtitle placement="vxe" :title="t('common.metaria')" id="material" :extra="{ show: !props.api?.disabled.value }" @addColumn="handleAddRows" />
      </template>
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>

      <template #stepDistanceNumber="{ row }">
        <a-select v-model:value="row.stepDistanceNumber" allowClear>
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
          v-model:value="row.processNumber"
          allowClear
          @change="
            index => {
              if (isNullOrUnDef(index)) {
                row.processName = null;
              } else {
                const target = getProcessList()[index - 1];
                row.processName = target.processCode ? `${index}、${target.processCode}` : null;
              }
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
