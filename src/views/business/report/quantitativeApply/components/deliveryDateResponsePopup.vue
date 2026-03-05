<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="true"
    okText="提交"
    title="交期回复"
    destroyOnClose
    class="full-popup">
    <ScrollContainer class="p-10px">
      <Subtitle title="交期回复" />
      <BasicTable @register="registerPackageEditTable" />
    </ScrollContainer>
  </BasicPopup>
</template>

<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { useTable } from '/@/components/Table';
  import { getDeliveryDateDetailById } from '/@/api/engineering/sampleApply';

  const emits = defineEmits(['reload']);
  const [registerPopup, { changeLoading }] = usePopupInner(init);

  const columns: any[] = [
    { title: '单号', dataIndex: 'applyCode' },
    { title: '产品内部料号', dataIndex: 'insidePartNumber', width: 260 },
    { title: '需求数量(PCS)', dataIndex: 'demandQty' },
    { title: '客户要求交期', dataIndex: 'customerDeliveryTime', format: 'date|YYYY-MM-DD' },
    { title: '样品预估交期', dataIndex: 'sampleEstimateDeliveryTime', format: 'date|YYYY-MM-DD' },
    { title: '备注', dataIndex: 'remark' },
  ];

  const [registerPackageEditTable, { setTableData }] = useTable({
    columns,
    pagination: false,
    showTableSetting: false,
    striped: true,
    canResize: true,
    resizeHeightOffset: 20,
    showIndexColumn: false,
  });

  async function init(id: string) {
    if (!id) {
      return false;
    }
    changeLoading(true);
    return getDeliveryDateDetailById(id)
      .then(res => {
        if (res.code !== 200) {
          return res;
        }
        setTableData([res.data]);
      })
      .catch(e => {
        console.warn('init error：', e);
      })
      .finally(() => {
        changeLoading(false);
      });
  }
</script>
