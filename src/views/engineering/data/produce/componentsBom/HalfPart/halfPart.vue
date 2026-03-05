<script setup lang="ts">
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { TableAction } from '/@/components/Table';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table';
  import { cloneDeep, isError } from 'lodash-es';
  import { buildUUID } from '/@/utils/uuid';
  import { getHalfPartColumn, getHalfPartRules } from './config';
  import { nextTick, onMounted, reactive } from 'vue';
  import { ExtendedApi } from './useHalfPart';
  import { isEmpty, isNullOrUnDef } from '/@/utils/is';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getBatchSemiFinishedProducts } from '/@/api/engineering/semifinishedproducts';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const { createMessage } = useMessage();

  interface Config {
    mainProcess: string;
    factory: string;
  }
  type Props = {
    api?: ExtendedApi | null;
    config: Config;
  };
  const emit = defineEmits(['calcHalfPartUseQty']);

  const props = withDefaults(defineProps<Props>(), {
    api: null,
    config: () =>
      ({
        factory: '',
        mainProcess: '',
      } as Props['config']),
  });

  const state = reactive({
    disabled: false,
  });

  // 初始数据
  const rowData = {
    semiFinishedProductsPart: '',
    qty: '',
    unit: 'PCS',
    remarks: '',
    materialDosage: 1,
  };

  const gridOptions = {
    id: 'engineering-data-produce-haldpart',
    columns: getHalfPartColumn(props, emit),
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
      // afterPasteMethod: handleAfterPaster,
      beforePasteMethod: handleBeforePaster,
    },
    i18nConfig: {
      moduleCode: 'PCCColumn',
    },
    position: 'modal',
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
      },
    },
  });
  const { getDataSource, loadData, reloadData, insertAt, setLoading, setGridOptions } = $grid;

  // 设置表格数据
  function setHalfPartTableData(data) {
    reloadData(data);
  }
  // 表格数据初始化
  function setInit() {
    reloadData([cloneDeep(rowData)]);
  }

  // 处理表格数据
  async function handleChangeTable(type, row) {
    const data = cloneDeep(getDataSource());
    const findIndex = data.findIndex(item => item.uuid === row.uuid);
    switch (type) {
      case 'addBaseIndex':
        data.splice(findIndex + 1, 0, { ...rowData, uuid: buildUUID() });
        break;
      case 'copy':
        const copyData = cloneDeep(data[findIndex]);
        delete copyData.id;
        data.splice(findIndex + 1, 0, {
          ...copyData,
          uuid: buildUUID(),
        });
        break;
      case 'delete':
        data.splice(findIndex, 1);
        break;
    }
    setHalfPartTableData(data);
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

  // 添加行
  function handleAddRows(rowCount) {
    const rows: any = [];
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

  // 粘贴数据预处理
  function handleBeforePaster({ targetAreas, pasteCells, $grid }) {
    try {
      const editRules = getHalfPartRules();
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
          if (field === 'semiFinishedProductsPart') {
            materialFnList[cell] = validator.bind(null, { col, cell, row: originRow, $grid });
            return null;
          }
          const result = validator({ col, cell, row: originRow, $grid });
          if (isNullOrUnDef(result)) return false;
          if (isError(result)) {
            createMessage.warning(result?.message);
          }
        });
      });
      // 重新执行粘贴的料号逻辑
      if (!isEmpty(materialFnList)) {
        getBatchSemiFinishedProducts({
          mainProcess: props.config.mainProcess,
          factory: props.config.factory,
          partNumbers: Object.keys(materialFnList),
        }).then(({ data }) => {
          if (data.length == 0) return createMessage.warning(t('没有可用的半成品料号'));
          let dataIndex = 0;
          const datalist = rows.map(item => {
            const hasId = data.findIndex((el: any) => el.semiFinishedProductsPartNumber === item.semiFinishedProductsPart);
            if (hasId > -1) {
              const dataItem = data[hasId];
              item.productionTypeName = dataItem.productionTypeName;
              data.splice(hasId, 1); // 删除已使用的半成品料号
            } else {
              if (dataIndex < data.length) {
                const dataItem = data[dataIndex];
                item.semiFinishedProductsPart = dataItem.semiFinishedProductsPartNumber;
                item.productionTypeName = dataItem.productionTypeName;
                dataIndex++;
              }
            }
            return item;
          });
          console.log('datalist', datalist, $grid);
          // 更新表格数据
          $grid.setRow(datalist);
        });
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  // 校验数据
  function validateHalfPart() {
    return new Promise((resolve, reject) => {
      const data = getDataSource();
      const validateType = t('dict.SemiFinishedProductsExportSapColumn.partNumber');
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (isNullOrUnDef(item.semiFinishedProductsPart)) {
          reject(t('common.validate', [validateType, i + 1, t('dict.SemiFinishedProductsExportSapColumn.partNumber')]));
          return;
        }
        if (isNullOrUnDef(item.materialDosage)) {
          reject(t('common.validate', [validateType, i + 1, t('dict.PCCColumn.useQtyMultiple')]));
          return;
        }
      }
      resolve(true);
    });
  }

  // 校验是否重复
  function validateSameHalfPart() {
    return new Promise((resolve, reject) => {
      const data = getDataSource();
      // 校验第几行与第几行的料号是否重复
      const seenParts = new Set();
      for (let i = 0; i < data.length; i++) {
        const part = data[i].semiFinishedProductsPart;
        if (seenParts.has(part)) {
          // 找到第一个重复出现的行号
          for (let j = 0; j < i; j++) {
            if (data[j].semiFinishedProductsPart === part) {
              reject(t('dict.Quotation.sameHalfFinishedPartTip', [j + 1, i + 1]));
              return;
            }
          }
        }
        seenParts.add(part);
      }
      resolve(true);
    });
  }

  // 是否可编辑
  function setDisabled(disabled: boolean) {
    state.disabled = disabled;
    nextTick(() => {
      const columns = getHalfPartColumn(props, emit);
      const _gridOptions: any = {
        columns,
        editConfig: {
          enabled: true,
        },
      };
      if (disabled) {
        _gridOptions.columns.pop();
        _gridOptions.editConfig = {
          enabled: false,
        };
        _gridOptions.keyboardConfig = {
          isEdit: false,
          isPaste: false,
        };
      }
      setGridOptions(_gridOptions);
    });
  }

  // 暴露出去的方法
  defineExpose({
    setDisabled,
    getDataSource,
    setHalfPartTableData,
    setInit,
    validateHalfPart,
    validateSameHalfPart,
  });
</script>

<template>
  <a-card>
    <Grid>
      <template #toolbar-actions>
        <Subtitle
          placement="vxe"
          :title="t('dict.CommonCol.SemiFinishedProduct')"
          id="halfPart"
          :extra="{ show: !state?.disabled }"
          @addColumn="handleAddRows" />
      </template>
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
  </a-card>
</template>
