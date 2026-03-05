<template>
  <a-card>
    <Grid class="min-h-300px max-h-735px h-full" ref="gridRef">
      <template #toolbar-actions>
        <Subtitle
          placement="vxe"
          :title="t('dict.CommonCol.supplierContact')"
          id="material"
          :defaultValue="1"
          :extra="{ show: !props.disabled }"
          @addColumn="handleAddRows" />
      </template>
      <template #provinceCityIds="{ row }">
        <lydc-area-select
          v-model:value="row.provinceCityIds"
          allowClear
          @change="(val, data) => handleAreaSelect(val, data, index, row)"
          :placeholder="t('component.lydc.areaSelect.modalTitle')"></lydc-area-select>
      </template>
      <template #provinceCityIds_default="{ row }">
        <span>{{ row.provinceCityName }}</span>
      </template>
      <template #action="{ row }">
        <TableAction outside :actions="getTableActions(row)" />
      </template>
    </Grid>
  </a-card>
</template>
<script setup lang="ts">
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { TableAction } from '/@/components/Table';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { address_columns, getConcatColumns } from '/@/views/purchase/basicInformation/supplierInformation/components/dynamicTable/config';
  import { cloneDeep } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { buildUUID } from '/@/utils/uuid';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  import { isEmpty, isExist } from '/@/utils/is';

  const { t } = useI18n();

  const state = {
    type: '',
  };

  const rowData = {
    provinceCityIds: '',
    detailAddress: '',
  };
  const props = withDefaults(
    defineProps<{
      disabled: boolean;
    }>(),
    {},
  );

  const [Grid, { insertAt, getDataSource, loadData, reloadData, reloadColumn }] = useVbenVxeGrid({
    gridOptions: {
      id: 'purchase-basicInformation-supplierInformation-add-address',
      autoResize: true,
      columns: getConcatColumns(),
      showIndexColumn: true,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
        autoClear: false,
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
      i18nConfig: {
        moduleCode: 'PCCColumn',
      },
    },
  });

  const handleAreaSelect = (val, data, i, row) => {
    const cityName = data.reduce((pre, cur) => {
      return pre + cur.fullName + '/';
    }, '');
    row.provinceCityName = cityName;
  };

  async function init(data) {
    console.log('🚀 ~ init ~ data: ', data);
    state.type = data.openModel;
    if (isExist(data.columns) && !isEmpty(data.columns)) {
      await reloadColumn(data.columns);
    }
    if (isExist(data.tableData) && !isEmpty(data.tableData)) {
      reloadData(data.tableData);
    }
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
      // remove(row);
      loadData(data);
    }
  }

  defineExpose({
    init,
    getDataSource,
    reloadColumn,
  });
</script>
