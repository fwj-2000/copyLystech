<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    okText="提交"
    title="审批"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup">
    <ScrollContainer class="p-10px">
      <BasicTable @register="registerPackageEditTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'actualStoreQuantity'">
            <FilteredInput v-model:value="record[column.dataIndex]" input-type="number" :min="0" allowClear />
          </template>
        </template>
      </BasicTable>
    </ScrollContainer>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  // import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import { useMessage } from '/@/hooks/web/useMessage';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { BasicColumn, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { FilteredInput } from '/@/components/FilteredInput';
  import { REVIEW_COLUMNS } from './config';
  import { warehouseauditagree } from '/@/api/warehouse/warehouse';
  const { createMessage } = useMessage();
  const emits = defineEmits(['reload']);
  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  const { t } = useI18n();

  const [registerPackageEditTable, { setTableData, getDataSource }] = useTable({
    columns: REVIEW_COLUMNS,
    pagination: false,
    showTableSetting: false,
    striped: true,
    canResize: true,
    resizeHeightOffset: 20,
    showIndexColumn: true,
  });

  async function init({ dataSource }) {
    setTableData(dataSource);
  }

  async function handleSubmit(type = 1) {
    changeOkLoading(true);
    try {
      const { code, msg } = await warehouseauditagree(getDataSource());
      if (code == 200) {
        createMessage.success(msg);
        closePopup();
        emits('reload');
      }
    } catch (error) {
      console.error(error, 'handleSubmit error');
    } finally {
      changeOkLoading(false);
    }
  }
</script>
