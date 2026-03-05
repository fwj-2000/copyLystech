<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    @ok="handleSaveAction"
    :title="state.type == 'add' ? t('common.add2Text') : t('common.editText')"
    showOkBtn
    :okText="t('common.submitText')"
    destroyOnClose>
    <template #insertToolbar>
      <AddCustomRows v-if="state.type == 'add'" @submit="handleAddColumn" />
    </template>
    <div class="form-pd">
      <Grid style="height: auto">
        <template #action="{ row, $rowIndex }">
          <TableAction outside :actions="getActions(row, $rowIndex)" />
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { nextTick, reactive } from 'vue';
  import { addColumn, editRules } from './config';
  import { cloneDeep } from 'lodash-es';
  import { update, create } from '/@/api/basicData/moduleRules';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { buildUUID } from '/@/utils/uuid';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  const { t } = useI18n();

  const { createMessage } = useMessage();
  const emit = defineEmits(['register', 'reload']);
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  interface StateType {
    type: 'edit' | 'add' | 'view';
  }

  const templateState = [
    {
      ModuleEnCode: 'SnCodeRule',
      IDField: '',
      RuleName: '',
      ModuleFullName: 'SN规则',
      bindType: '2', // 绑定类型 默认为内部料号
    },
  ];

  const state = reactive<StateType>({
    type: 'add',
  });

  const [Grid, GridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'basicData-produceCodeRules-add-list',
      showIndexColumn: true,
      columns: addColumn,
      editRules,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      mouseConfig: {
        area: false, // 是否开启区域选取
      },
      areaConfig: {
        multiple: false, // 是否启用多区域选取功能
      },
      minHeight: 320,
      keyboardConfig: {
        isClip: false, // 是否开启复制粘贴
        isEdit: false, // 是否开启任意键进入编辑（功能键除外）
        isDel: false, // 是否开启删除键功能
        isEsc: false, // 是否开启Esc键关闭编辑功能
      },
      pagerConfig: {
        autoHidden: true,
      },
      toolbarConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      i18nConfig: {
        moduleCode: 'MoldBomColumn',
      },
    },
  });

  function getActions(row, index) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-add text-orange-400 cursor-pointer mx-1',
        tooltip: t('common.add2Text'),
        onClick: handleChangeTable.bind(null, 'addBaseIndex', row, index),
      },
      {
        icon: 'icon-ym icon-ym-delete text-orange-400 cursor-pointer mx-1',
        // auth: 'btn_detail',
        tooltip: t('common.delText'),
        onClick: handleChangeTable.bind(null, 'delete', row, index),
      },
    ];
  }

  function handleChangeTable(type: 'add' | 'update' | 'copy' | 'delete' | 'addBaseIndex', row, index) {
    const tableData = GridApi.getDataSource();
    switch (type) {
      case 'addBaseIndex': {
        let rowData = cloneDeep(templateState[0]);
        const item = cloneDeep({ ...rowData, _X_ROW_KEY: buildUUID() });
        tableData.splice(index + 1, 0, item);
        GridApi.grid.reloadData(tableData);
        break;
      }

      case 'delete':
        GridApi.grid.remove(row);
        break;
      case 'update':
        break;
    }
  }

  // 添加行
  const handleAddColumn = n => {
    for (let i = 0; i < n; i++) {
      let rowData = cloneDeep(templateState[0]);
      GridApi.grid.insertAt(cloneDeep({ ...rowData, _X_ROW_KEY: buildUUID() }), -1);
    }
  };

  async function init(data) {
    changeLoading(true);
    state.type = data.type || 'add';
    if (data.list) {
      GridApi.grid.reloadData(data.list);
    } else if (state.type == 'add') {
      nextTick(() => {
        let rowData = cloneDeep(templateState[0]);
        GridApi.grid.insertAt(cloneDeep({ ...rowData, _X_ROW_KEY: buildUUID() }), -1);
      });
    }
    setTimeout(() => {
      changeLoading(false);
    }, 100);
  }

  async function handleSaveAction() {
    if (await GridApi.validate(true)) {
      createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
      return;
    }
    let _data = GridApi.getDataSource();
    let methods = create;
    if (state.type != 'add') {
      methods = update;
      _data = _data[0];
    }
    const r = await methods(_data);
    if (r.code === 200) {
      closePopup();
      emit('reload');
    }
  }
</script>
<style scoped lang="less">
  .form-pd {
    padding: 12px 24px;
  }
</style>
