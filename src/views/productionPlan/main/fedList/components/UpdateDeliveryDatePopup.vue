<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    v-loading="btnLoading"
    :okText="t('common.submit')"
    :title="t('dict.FeedList.updateSupplierDeliveryDate')"
    destroyOnClose
    @ok="handleSaveFn"
    class="full-popup top-0">
    <ScrollContainer style="background: #ebeef5; height: 100%">
      <div class="mb-14px p-12px h-full" style="background: #fff; height: 100%">
        <Grid ref="mainTable">
          <template #expand_content="{ row }">
            <div class="expand-wrapper">
              <SupplierDateTable :tableData="row.supplierDetail" :ref="el => setSubTableRef(row.id, el)"></SupplierDateTable>
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
  import { updateDeliveryDateColumn } from '../config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import { getShouldSupplierDetailByInMaterialNos, poUpdateSupplierBatch } from '/@/api/mps/productionPlan/MPS';
  import SupplierDateTable from './SupplierDateTable.vue';
  const { t } = useI18n();

  const emits = defineEmits(['reload']);

  const btnLoading = ref(false);

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
      id: 'productionPlan-main-fedList-updateDeliveryDateList',
      columns: updateDeliveryDateColumn,
      i18nConfig: {
        moduleCode: '	FeedListColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      pagerConfig: {
        autoHidden: true,
      },
      editRules: {
        requireSupplierDelivery: [{ required: true, message: t('common.required') }],
      },
      expandConfig: {
        expandAll: true,
        showIcon: true,
        iconOpen: 'vxe-icon-square-minus my-icon',
        iconClose: 'vxe-icon-square-plus my-icon',
      },
    },
  });

  async function init({ inMaterialNos }) {
    changeLoading(true);
    const { code, data } = await getShouldSupplierDetailByInMaterialNos('1', inMaterialNos).finally(() => {
      changeLoading(false);
    });
    if (code == 200) {
      gridApi.reloadData(data);
    }
  }

  // 点击提交
  async function handleSaveFn() {
    if (await gridApi.validate(true)) {
      createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
      return;
    }
    const tableData = gridApi.getDataSource();
    const submitData = tableData.map(item => {
      return {
        requireSupplierDelivery: item.requireSupplierDelivery,
        impPoId: item.poImpId,
      };
    });
    changeLoading(true);
    const { code, msg } = await poUpdateSupplierBatch(submitData).finally(() => {
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
