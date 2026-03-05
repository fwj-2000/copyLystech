<template>
  <BasicPopup v-bind="$attrs" showOkBtn @register="registerPopup" :okText="t('common.submit')" :title="title" @ok="handleSave(true)" class="full-popup">
    <template #centerToolbar>
      <a-button @click="handleSave(false)" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>
    <div class="h-full requirement-pop p-10px">
      <Subtitle :title="title" class="mt-8px" :extra="{ show: state.type == 'add', hideAdd: true }">
        <template #extra>
          <AddCustomRows @submit="addColumn" />
        </template>
      </Subtitle>
      <Grid>
        <template #action="{ row, rowIndex }">
          <TableAction :outside="true" :actions="getTableActions(row, rowIndex)" />
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { cloneDeep, pick } from 'lodash-es';
  import { temporaryStorage, createTemporaryReceive, getTemporaryOrderDetail } from '/@/api/productionDeal/moIdUseBack';
  import { Subtitle } from '/@/components/Subtitle';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { buildUUID } from '/@/utils/uuid';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import { applyTempUseColumn } from './usebackConfig';

  const emits = defineEmits(['register', 'reload']);

  interface State {
    type: 'add' | 'edit' | 'view';
    title: string;
    base: any;
    line: number;
    id: string;
  }

  const { t } = useI18n();
  const state = reactive<State>({
    title: '',
    type: 'add',
    base: {},
    line: 1,
    id: '',
  });
  const { title } = toRefs(state);
  const { createMessage } = useMessage();

  const gridOptions: VxeGridProps = {
    id: 'warehouse-mouldBusiness-useBack-apply',
    columns: applyTempUseColumn,
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    rowConfig: {
      keyField: '_X_ROW_KEY',
    },
    toolbarConfig: {
      enabled: false,
    },
    i18nConfig: {
      moduleCode: 'WarehouseBaseColumn',
    },
    showIndexColumn: true,
    pagerConfig: {
      enabled: false,
    },
    position: 'modal',
  };
  const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
  const { getDataSource, reloadData } = gridApi;

  const [registerPopup, { closePopup, changeOkLoading, changeLoading }] = usePopupInner(init);

  async function init(data) {
    const type = data.mode || 'add';
    state.title = type == 'add' ? t('common.add') : t('common.editText');
    state.type = type;
    if (data.ids) {
      getDetail(data);
    } else {
      addColumn(1);
    }
  }

  // 获取详情
  function getDetail(data) {
    changeLoading(true);
    getTemporaryOrderDetail(data.ids)
      .then(res => {
        reloadData(res.data);
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  function getTableActions(row, rowIndex): ActionItem[] {
    return [
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-add',
        tooltip: t('common.addText'),
        onClick: addColumn.bind(null, 1, rowIndex),
      },
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleCopy.bind(null, row),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDelete.bind(null, row),
      },
    ];
  }

  /**
   * @description 删除整行
   * */
  function handleDelete(row) {
    gridApi.grid.remove(row);
  }
  /**
   * @description 新增
   * @param line 新增的行数
   * @param rowIndex 指定起增行
   * */
  function addColumn(line, rowIndex?: number) {
    const list = getDataSource();
    // if (typeof rowIndex != 'undefined') {
    //   list.splice(rowIndex + 1, 0, {
    //     _X_ROW_KEY: buildUUID(),
    //   });
    // } else {
    //   for (let i = 0; i < line; i++) {
    //     list.push({
    //       _X_ROW_KEY: buildUUID(),
    //     });
    //   }
    // }
    if (rowIndex === undefined) {
      for (let i = 0; i < line; i++) {
        list.push({
          _X_ROW_KEY: buildUUID(),
        });
      }
    } else {
      list.splice(rowIndex + 1, 0, {
        _X_ROW_KEY: buildUUID(),
      });
    }
    reloadData(list);
  }
  /**
   * @description 复制整行
   * */
  function handleCopy(row) {
    const item = cloneDeep(row);
    delete item.id;
    item._X_ROW_KEY = buildUUID();
    item.temporaryOrder = '';
    const list = getDataSource();
    const index = list.findIndex(el => el._X_ROW_KEY == row._X_ROW_KEY);
    list.splice(index + 1, 0, item);
    reloadData(list);
  }

  /**
   * @description 提交
   * */
  async function handleSave(isSubmit) {
    const list = getDataSource().map(el => pick(el, ['id', 'moldPartNumber', 'receiveMoldUserIds', 'confirmGrantUserId']));
    changeLoading(true);
    const method = isSubmit ? createTemporaryReceive : temporaryStorage;
    method(list)
      .then(res => {
        changeLoading(false);
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        closePopup();
        // if (isSubmit) {
        // }
        // state.id = res.data;
      })
      .catch(err => {
        changeLoading(false);
      });
  }
</script>

<style lang="less">
  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .table-a {
    color: #ff7b00;
    cursor: pointer;
  }

  .requirement-pop {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }
</style>
