<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :title="t('dict.FeedPlanColumn.pushMaterialList')"
    @ok="handleSaveFn"
    destroyOnClose
    class="full-popup top-0">
    <ScrollContainer style="background: #ebeef5; height: 100%">
      <div class="mb-14px h-full" style="background: #fff; height: 100%">
        <Grid ref="mainTable">
          <template #expand_content="{ row }">
            <div class="expand-wrapper">
              <ChildTable :tableData="row.poList" :ref="el => setSubTableRef(row.id, el)" @refreshMainTableExpand="refreshMainTableExpand"></ChildTable>
            </div>
          </template>

          <!-- <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template> -->
        </Grid>
      </div>
      <SelectPOModal @register="registerSelectPOModal" @selectPOForChild="selectPOForChild" @refreshMainTableExpand="refreshMainTableExpand"> </SelectPOModal>
    </ScrollContainer>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { computed, reactive, toRefs, ref, nextTick } from 'vue';
  import dayjs from 'dayjs';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ScrollContainer } from '/@/components/Container';
  import { useUserStore } from '/@/store/modules/user';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { PushMaterialColumn, PushMaterialColumnEditRules } from '../config';
  import ChildTable from './ChildTable.vue';
  import { cloneDeep } from 'lodash-es';
  import { useModal } from '/@/components/Modal';
  import SelectPOModal from './SelectPOModal.vue';
  import { TableAction } from '/@/components/Table';
  import { getPODetailsByPoOrderNos, poFeedList } from '/@/api/mps/productionPlan/MPS';

  const { createMessage } = useMessage();
  const userStore = useUserStore();
  const emits = defineEmits(['register', 'refresh', 'reload']);

  const [registerSelectPOModal, { openModal: openSelectPOModal }] = useModal();

  const { t } = useI18n();

  const mainTable = ref();
  const subTableRefs = ref({});
  const setSubTableRef = (id, el) => {
    if (el) {
      subTableRefs.value[id] = el;
    }
  };

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-fedList-PushMaterialList',
      columns: PushMaterialColumn,
      toolbarConfig: {
        // enabled: false,
        expandAll: true,
      },
      i18nConfig: {
        moduleCode: 'FeedPlanColumn',
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      editRules: PushMaterialColumnEditRules,
      expandConfig: {
        expandAll: true,
        showIcon: true,
        iconOpen: 'vxe-icon-square-minus my-icon',
        iconClose: 'vxe-icon-square-plus my-icon',
      },
    },
  });

  function getTableActions(record) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: openPOList.bind(null, record),
        tooltip: t('dict.feedPlan.selectPO'),
      },
    ];
  }

  function openPOList(row: { row: object }) {
    openSelectPOModal(true, {
      row: row,
    });
  }

  const selectPOForChild = data => {
    const subTable = subTableRefs.value[data.id];
    subTable.reloadChildTable(data.childrenData);
  };

  const refreshMainTableExpand = () => {
    gridApi.refreshColumn();
    console.log('刷新一下表格==========');
  };

  const getUserInfo = computed(() => userStore.getUserInfo || {});

  async function init({ ids }) {
    changeLoading(true);
    const { code, data } = await getPODetailsByPoOrderNos(ids).finally(() => {
      changeLoading(false);
    });
    if (code == 200) {
      // 给周别、进料PCMC赋值
      const dataFormat = data.map(item => {
        return {
          ...item,
          week: `WK${dayjs().week()}`,
          inPcMcUserName: getUserInfo.value.userName,
          inPcMcUserId: getUserInfo.value.userId,
          inQtyTotal: '', // 进料数量
          // 给polist添加本次分配数量inQty
          poList: item.poList.map(poItem => {
            return {
              ...poItem,
              inQty: '',
            };
          }),
        };
      });
      gridApi.reloadData(dataFormat);
    }
  }

  async function handleSaveFn() {
    const tableData = gridApi.getDataSource();
    if (await gridApi.validate(true)) {
      // createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
      return;
    }

    for (const row of tableData) {
      if (row.poList?.length > 0) {
        const subTable = subTableRefs.value[row.id];
        if (await subTable.childTableValidate()) {
          // createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
          return;
        }
      }
    }

    const data = tableData.map(item => {
      let poImpInputs = [] as any[];
      for (let po of item.poList) {
        if (po.inQty > 0) {
          poImpInputs.push({
            poOrderNo: po.poOrderNo,
            inQty: po.inQty,
          });
        }
      }
      return {
        inRemark: item.inRemark,
        buyer: item.buyer,
        requireSupplierDelivery: item.requireSupplierDelivery,
        totalInQty: item.inQtyTotal, // 进料数量
        poImpInputs,
      };
    });
    changeLoading(true);
    const { code, msg } = await poFeedList(data).finally(() => {
      changeLoading(false);
    });
    if (code === 200) {
      createMessage.success(msg);
      emits('reload');
      closePopup();
    } else {
      createMessage.error(msg);
    }
  }
</script>

<style lang="less" scope>
  :deep(.vxe-body--row-expanded-cell .row-current) {
    padding-left: 0 !important;
  }

  .scroll-container .scrollbar__view {
    height: 100%;
  }

  .my-icon {
    color: rgb(255 123 0 / 100%) !important;
  }

  .expand-wrapper {
    margin: 18px auto;
  }

  .vxe-body--row-expanded-cell {
    background: rgb(0 0 0 / 2%) !important;
  }
</style>
