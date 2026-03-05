<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :title="t('dict.AddWorkOrderColumn.pushWorkOrderList')"
    @ok="handleSaveFn"
    destroyOnClose
    class="full-popup top-0">
    <ScrollContainer>
      <div class="mb-14px p-12px h-full">
        <Grid> </Grid>
      </div>
    </ScrollContainer>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ScrollContainer } from '/@/components/Container';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { PushWorkOrderColumn, PushWorkOrderColumnEditRules } from './pushWorkerConfig';
  import { cloneDeep } from 'lodash-es';

  const { createMessage } = useMessage();
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

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-fedList-PushWorkOrderList',
      columns: PushWorkOrderColumn,
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
      editRules: PushWorkOrderColumnEditRules,
      // data: tableData.value as any[],
    },
  });

  async function init(data) {
    gridApi.reloadData(cloneDeep(tableData.value));
  }

  async function handleSaveFn() {
    changeLoading(true);
    const tableData = gridApi.getDataSource();
    if (await gridApi.validate(true)) {
      createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
      changeLoading(false);
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
