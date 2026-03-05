<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :title="t('dict.AddWorkOrderColumn.placeOrder')"
    @ok="handleSaveFn"
    destroyOnClose
    class="full-popup top-0">
    <ScrollContainer style="background: #ebeef5; height: 100%">
      <div class="mb-14px p-12px h-full" style="background: #fff; height: 100%">
        <Grid> </Grid>
      </div>
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
  import { PlaceOrderColumn, PlaceOrderColumnEditRules } from '../config';
  import { cloneDeep } from 'lodash-es';
  import { useModal } from '/@/components/Modal';

  const { createMessage } = useMessage();
  const userStore = useUserStore();
  const emits = defineEmits(['register', 'refresh']);

  const { t } = useI18n();
  const tableData = ref([
    {
      factory: '测试一厂',
      id: 'x001',
      supplierLastTime: '',
      childrenData: [],
    },
    { factory: '测试二厂', id: 'x002', supplierLastTime: '', childrenData: [] },
  ]);

  const [registerPopup] = usePopupInner(init);

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-fedList-PushMaterialList',
      columns: PlaceOrderColumn,
      toolbarConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: 'AddWorkOrderColumn',
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      editRules: PlaceOrderColumnEditRules,
      // data: tableData.value as any[],
    },
  });

  async function init({ data }) {
    gridApi.reloadData(cloneDeep(tableData.value));
  }

  async function handleSaveFn() {
    const tableData = gridApi.getDataSource();
    if (await gridApi.validate(true)) {
      createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
      return;
    }
    console.log('提交=======表格数据', tableData);
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
