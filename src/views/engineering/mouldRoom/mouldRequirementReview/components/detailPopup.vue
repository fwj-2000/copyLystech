<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.isCanEdit"
    :showCancelBtn="false"
    :title="state.title"
    destroyOnClose
    :showFooter="false"
    :okText="t('common.submit')"
    :okButtonProps="{ class: 'mr-12px' }"
    @ok="handleSubmitFn"
    class="full-popup pb-10px">
    <div class="detail">
      <div class="detail-header">
        <Subtitle :title="t('common.reviewInfo')" />
      </div>
      <div class="detail-content">
        <Grid>
          <template #editMaterial="{ row }">
            <a-input-group compact>
              <a-input v-model:value="row.material" :readonly="true" allow-clear style="width: calc(100% - 70px)" />
              <a-button class="ml-5px px-6px" style="color: rgb(24 144 255)" @click="openMaterialModalFn(row)"
                ><i class="icon-ym icon-ym-btn-add" name="icon"></i
              ></a-button>
              <a-button class="ml-5px px-6px text-red-500" @click="delMaterial(row)"><i class="icon-ym icon-ym-btn-clearn"></i></a-button>
            </a-input-group>
          </template>
        </Grid>
      </div>
    </div>
  </BasicPopup>
  <MaterialClassSelect @register="registerMaterialClassSelectModal" @select="handlerSelect" />
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { getReviewDataList, reviewApply } from '/@/api/engineering/mould';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ADD_COLUMNS, MODIFY_COLUMNS, editRules, ITEM_TYPE_ENUM } from './detailConfig';
  import { isNullOrUnDef } from '/@/utils/is';
  import { handleDblClickHead } from '/@/adapter/paster-event';

  import { Subtitle } from '/@/components/Subtitle';
  import MaterialClassSelect from './materialClassModal.vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';

  const emits = defineEmits(['reload']);

  const state = reactive({
    title: '',
    columns: [] as any,
    tableData: [] as any,
    isCanEdit: false,
  });
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const [registerMaterialClassSelectModal, { openModal: openMaterialClassSelectModal }] = useModal();
  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      height: 'auto',
      columns: ADD_COLUMNS,
      rowConfig: {
        keyField: 'uuid',
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: 'MouldRoomColumn',
      },
      editRules,
    },
    gridEvents: {
      headerCellDblclick: ({ column }) => {
        const rows = handleDblClickHead({ column, config: {} }, gridApi);
        // 如果是【工艺是否满足`isProcessMeet`】，触发对应的`change`事件
        if (column.field === 'isProcessMeet' && typeof column.editRender?.props?.onChange === 'function') {
          const changeFn = column.editRender.props.onChange;
          rows.forEach((row: any) => changeFn(row.isProcessMeet, {}, { row }));
        }
      },
    },
  });

  const { getDataSource, reloadData, validate, reloadColumn, setGridOptions } = gridApi;

  function updateTableData(data = []) {
    state.tableData = data;
    return reloadData(data);
  }

  async function init(data: { title: string; ids: string[]; isCanEdit: boolean }) {
    const { title, ids, isCanEdit = false } = data;
    state.title = title;
    state.isCanEdit = isCanEdit;

    setGridOptions({
      editConfig: {
        enabled: isCanEdit,
      },
    });

    try {
      changeLoading(true);
      const { data, code } = await getReviewDataList(ids);
      if (code !== 200) {
        return;
      }
      let isModify = false;
      const list = data.map((item: any) => {
        // 判断是否存在【修改审批】的数据
        if (!isModify && `${item.itemType}` === ITEM_TYPE_ENUM.修改审批) {
          isModify = true;
        }
        return {
          ...item,
          isProcessMeet: isNullOrUnDef(item.isProcessMeet) ? '' : `${item.isProcessMeet}`,
        };
      });
      reloadColumn(isModify ? MODIFY_COLUMNS : ADD_COLUMNS).then(() => updateTableData(list));
    } finally {
      changeLoading(false);
    }
  }

  function delMaterial(record) {
    record.material = null;
  }

  function openMaterialModalFn(item) {
    openMaterialClassSelectModal(true, { id: item.applyId, materials: item.material });
  }

  function handlerSelect(data) {
    state.tableData.forEach(item => {
      if (item.applyId == data.id && data?.list?.[0]) {
        item.material = [data.list[0]?.materialClass, data.list[0]?.specification].join(',');
      }
    });
  }

  function setLoading(isLoading: boolean) {
    changeLoading(isLoading);
    changeOkLoading(isLoading);
  }

  async function handleSubmitFn() {
    try {
      if (await validate(true)) {
        createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
        return;
      }

      setLoading(true);
      const params = getDataSource();
      const { code, msg } = await reviewApply({ list: params, bizType: 0 });
      if (code === 200) {
        createMessage.success(msg);
        emits('reload');
        closePopup();
        return;
      }
      createMessage.error(msg);
    } finally {
      setLoading(false);
    }
  }
</script>

<style lang="less" scoped>
  .detail {
    height: 100%;

    &-header {
      padding-top: 10px;
      padding-left: 10px;
      display: flex;
      align-items: top;
    }

    &-content {
      height: calc(100% - 75px);
    }

    &-footer {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 100%;
      text-align: right;
      height: 52px;
      line-height: 52px;
      padding-right: 16px;
      background: #fff;
    }
  }

  .drawings-name {
    display: flex;
    align-items: baseline;
    flex-wrap: nowrap;

    a {
      position: relative;
      display: inline-block;
      width: 150px;
      padding-right: 14px;
      margin-right: 14px;

      .icon-ym-btn-download {
        position: absolute;
        right: 0;
        color: #333;
        cursor: pointer;
      }
    }
  }

  .disabled-class {
    pointer-events: none;
  }
</style>
