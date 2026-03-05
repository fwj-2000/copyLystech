<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.submit')"
    :title="t('dict.FeedList.enterSupplierDeliveryDate')"
    destroyOnClose
    @ok="handleSaveFn"
    class="full-popup top-0">
    <ScrollContainer style="background: #ebeef5; height: 100%">
      <div class="mb-14px p-12px h-full" style="background: #fff; height: 100%">
        <Grid ref="mainTable">
          <template #expand_content="{ row }">
            <div class="expand-wrapper">
              <SupplierDateEditTable
                :tableData="row.supplierDateList"
                :ref="el => setSubTableRef(row.id, el)"
                @refreshMainTableExpand="refreshMainTableExpand"></SupplierDateEditTable>
            </div>
          </template>
        </Grid>
      </div>
    </ScrollContainer>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { enterDeliveryDateColumn } from '../config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import { buildUUID } from '/@/utils/uuid';
  import { getSupplierDetailByInMaterialNos, poSupplierDelivery } from '/@/api/mps/productionPlan/MPS';
  import SupplierDateEditTable from './SupplierDateEditTable.vue';
  import { ScrollContainer } from '/@/components/Container';
  const { t } = useI18n();

  const emits = defineEmits(['reload']);

  const mainTable = ref();
  const subTableRefs = ref({});
  const setSubTableRef = (id, el) => {
    if (el) {
      subTableRefs.value[id] = el;
    }
  };

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { createMessage } = useMessage();

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-fedList-enterDeliveryDateList',
      columns: enterDeliveryDateColumn,
      i18nConfig: {
        moduleCode: '	FeedListColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      expandConfig: {
        expandAll: true,
        showIcon: true,
        iconOpen: 'vxe-icon-square-minus my-icon',
        iconClose: 'vxe-icon-square-plus my-icon',
      },
    },
  });

  const refreshMainTableExpand = () => {
    gridApi.refreshColumn();
    console.log('刷新一下表格==========');
  };

  async function init({ inMaterialNos }) {
    changeLoading(true);
    const { code, data } = await getSupplierDetailByInMaterialNos(inMaterialNos).finally(() => {
      changeLoading(false);
    });
    if (code == 200) {
      gridApi.reloadData(data);
    }
  }

  // 点击提交
  async function handleSaveFn() {
    const tableData = gridApi.getDataSource();
    const submitData = [] as any[];
    for (const row of tableData) {
      const subTable = subTableRefs.value[row.id];
      if (await subTable.childTableValidate()) {
        createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
        return;
      }
      const subData = subTable.getChildData();
      const subDataFormat = subData.map(item => {
        return {
          // ...item,
          supplierDeliveryDate: item.supplierDeliveryDate,
          expectedDeliveryQty: item.expectedDeliveryQty,
          deliverySpec: item.deliverySpec,
          supplierRemark: item.supplierRemark,
          inRemark: item.inRemark,
          impPoId: row.poImpId,
          inMaterialNo: row.inMaterialNo,
          poOrderNo: row.poOrderNo,
        };
      });
      submitData.push(...subDataFormat);
    }

    console.log('保存=======表格数据', submitData);
    changeLoading(true);
    const { code, msg } = await poSupplierDelivery(submitData).finally(() => {
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
