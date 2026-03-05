<template>
  <BasicModal
    canFullscreen
    draggable
    :title="t('dict.FcDataColumn.productCategory')"
    showOkBtn
    destroy-on-close
    :width="800"
    :height="600"
    v-bind="$attrs"
    @register="registerModal"
    @ok="handleSubmit">
    <div>
      <div>
        <Subtitle :title="t('dict.FcDataColumn.productCategory')" :extra="{ show: true, hideAdd: true }">
          <template #extra>
            <AddCustomRows @submit="addColumnText" />
          </template>
        </Subtitle>
        <Grid>
          <template #action="{ row }">
            <TableAction :outside="true" :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
  </BasicModal>
</template>
<script setup lang="ts">
  import { computed, reactive, toRefs, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import { Subtitle } from '/@/components/Subtitle';
  import { buildUUID } from '/@/utils/uuid';
  import { getBasePage, saveBase } from '/@/api/customerSerivce/fcData';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';

  const emit = defineEmits(['register', 'reload']);
  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      showIndexColumn: true,
      toolbarConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: 'id',
      },
      height: '500px',
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      columns: [
        {
          title: '产品类别',
          field: 'productCategory',
          width: 540,
          filters: [{}],
          filterRender: {
            name: 'Input',
          },
          editRender: {
            name: 'Input',
            autoFocus: true,
          },
        },
        {
          title: t('common.action'),
          field: 'action',
          width: 80,
          slots: {
            default: 'action',
          },
        },
      ],
      api: (params: any) => getBasePage({ ...params }),
      clipConfig: {
        isPaste: true,
      },
      i18nConfig: {
        moduleCode: 'FcDataColumn',
      },
    },
  });
  const { getDataSource } = gridApi;

  interface State {
    delIdList: string[]; // 删除ID列表
  }
  const state = reactive<State>({
    delIdList: [],
  });

  const [registerModal, { changeLoading, changeOkLoading, closeModal }] = useModalInner(init);

  function init(data) {
    changeOkLoading(false);
    console.log(111);
    gridApi.reload();
  }

  function getTableActions(row): ActionItem[] {
    return [
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleCopyText.bind(null, row),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDeleteText.bind(null, row),
      },
    ];
  }

  function handleCopyText(row) {
    const item = cloneDeep(row);
    item.id = buildUUID();
    const list = getDataSource();
    const index = list.findIndex(el => el.id == row.id);
    list.splice(index, 0, item);
    gridApi.grid.reloadData(list);
  }
  function handleDeleteText(row) {
    state.delIdList.push(row.id);
    gridApi.grid.remove(row);
  }

  // 增加列数
  function addColumnText(line) {
    const list = getDataSource();
    for (let i = 0; i < line; i++) {
      list.push({
        id: buildUUID(),
        productCategory: '',
      });
    }
    gridApi.grid.reloadData(list);
  }

  async function handleSubmit() {
    changeOkLoading(true);
    try {
      const params = {
        saveList: getDataSource(),
        delIdList: state.delIdList,
      };
      const res = await saveBase(params);
      if (res.code == 200) {
        closeModal();
        //emit('reload');
        createMessage.success(t('sys.api.operationSuccess'));
      }
    } finally {
      changeOkLoading(false);
    }
  }
</script>
