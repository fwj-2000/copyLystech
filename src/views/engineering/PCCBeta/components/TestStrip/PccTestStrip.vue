<script setup lang="ts">
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { TableAction } from '/@/components/Table';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table';
  import { buildUUID } from '/@/utils/uuid';
  import { cloneDeep, isError } from 'lodash-es';
  import { getPccTestStripColumn, getRules } from '/@/views/engineering/PCCBeta/components/TestStrip/config';
  import { isNullOrUnDef } from '/@/utils/is';
  import { onMounted } from 'vue';
  import { ExtendedApi } from '/@/views/engineering/PCCBeta/components/TestStrip/use-pccTestStrip';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';

  const { t } = useI18n();

  type Props = {
    api: ExtendedApi;
  };

  const { createMessage } = useMessage();

  const rowData = {
    eightCode: '',
    width: '',
    length: '',
    originPartNumber: '',
    partNumber: '',
    useQty: '',
    testOption: '',
    drawingStandards: '',
    tdsStandards: '',
    materialEffectiveDate: '',
    description: '',
    originalModelNumber: '',
    color: '',
    totalThickness: '',
  };

  const props = withDefaults(defineProps<Props>(), {});

  const [Grid, $grid] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-PCCBeta-PCCDetail-testStrip',
      columns: getPccTestStripColumn(),
      autoResize: true,
      showIndexColumn: true,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      maxHeight: '535px',
      height: '',
      minHeight: 220,
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

      data: [cloneDeep(rowData)],
      clipConfig: {
        isPaste: true,
        // excludeFields: ['originPartNumber'],
        beforePasteMethod: handleBeforePaster,
      },
      i18nConfig: {
        moduleCode: 'PCCColumn',
      },
    },
  });
  const { getDataSource, loadData, remove, insertAt, setLoading } = $grid;

  async function handleChangeTable(type, row) {
    const fullData = getDataSource();
    const data = cloneDeep(fullData);
    const uuid = buildUUID();
    const findIndex = fullData.findIndex(item => item.uuid === row.uuid);
    if (type === 'addBaseIndex') {
      // 新增
      data.splice(findIndex + 1, 0, { ...rowData, uuid });
      loadData(data);
    } else if (type === 'copy') {
      // 复制
      const copyData = cloneDeep(fullData[findIndex]);
      delete copyData.id;
      console.log('🚀 ~ handleChangeTable ~ copyData: ', copyData);
      data.splice(findIndex + 1, 0, { ...copyData, uuid });
      loadData(data);
    } else if (type === 'delete') {
      // 删除
      data.splice(findIndex, 1);
      remove(row);
    }
  }

  async function handleBeforePaster({ targetAreas, pasteCells, $grid }) {
    try {
      const editRules = getRules(props.api);
      const { cols, rows } = targetAreas[0];
      // 校验数据
      pasteCells.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const col = cols[colIndex];
          const originRow = rows[rowIndex];

          const { field } = col;
          const rule = editRules[field];
          const { validator } = rule[0];
          // 对查询结果进行特殊处理，如果当前是材料列，先存储料号。其他列进行校验
          // if (field === 'originPartNumber') {
          //   // setLoading(true);
          //   materialFnList[cell] = validator.bind(null, { col, cell, row: originRow, $grid });
          //   return null;
          // }
          const result = validator({ col, cell, row: originRow, $grid });
          if (isNullOrUnDef(result)) return false;
          if (isError(result)) {
            createMessage.warning(result?.message);
          }
          // 校验数据通过
        });
      });
    } catch (e) {
      console.log(e);
    }
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
    props?.api?.mount?.($grid);
  });
</script>

<template>
  <a-card>
    <Grid class="min-h-220px max-h-535px h-full">
      <template #toolbar-actions>
        <Subtitle
          placement="vxe"
          :title="t('common.testStrip')"
          id="testStrip"
          :defaultValue="2"
          :extra="{ show: !props?.api?.state?.disabled }"
          @addColumn="handleAddRows" />
      </template>
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
  </a-card>
</template>
