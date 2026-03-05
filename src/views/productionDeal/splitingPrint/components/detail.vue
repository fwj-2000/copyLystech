<template>
  <BasicPopup v-bind="$attrs" @register="registerPopup" :title="getTitle" class="full-popup top-0">
    <ScrollContainer style="background: #ebeef5">
      <div class="popup-inner">
        <Card>
          <template #title>基础信息</template>
          <SimpleTable :colums="simpleColumns" :dataSource="state.base" :group-num="4"></SimpleTable>
        </Card>
        <Card>
          <template #title>打印记录</template>
          <BasicTable @register="registerTable" :columns="menuTableColumns" :dataSource="state.tableList">
            <template #bodyCell="{ column, index }">
              <template v-if="column.key != 'action'"> </template>
            </template>
          </BasicTable>
        </Card>
      </div>
    </ScrollContainer>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { computed, reactive } from 'vue';
  import dayjs from 'dayjs';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { BasicTable, useTable } from '/@/components/Table';
  import { ScrollContainer } from '/@/components/Container';
  import { SimpleTable } from '/@/components/SimpleTable';
  import { getSplitingRecordDetail } from '/@/api/productionDeal/splitingPrint';
  import { useI18n } from '/@/hooks/web/useI18n';
  import Card from './Card.vue';

  const { t } = useI18n();
  const emits = defineEmits(['register', 'refresh']);

  interface State {
    base: any;
    id: string;
    tableList: any[];
  }

  const state = reactive<State>({
    base: {},
    id: '',
    tableList: [],
  });

  const getTitle = computed(() => t('分切打印详情'));

  const simpleColumns = [
    { title: '工厂代码', dataIndex: 'FactoryCode' },
    { title: '类型', dataIndex: 'Type', key: 'Type' },
    { title: '工单号', dataIndex: 'WorkOrderNo', key: 'WorkOrderNo' },
    { title: '支数', dataIndex: 'BranchQuantity', key: 'BranchQuantity' },
    { title: '总打印数量', dataIndex: 'TotalQuantity', key: 'TotalQuantity' },
    { title: '剩余打印数量', dataIndex: 'LeavePrintQuantity', key: 'LeavePrintQuantity' },
    { title: '需求数量', dataIndex: 'DemandedQuantity', key: 'DemandedQuantity' },
    { title: '规格', dataIndex: 'Specifications', key: 'Specifications' },
    { title: '卷数', dataIndex: 'VolumeQuantity', key: 'VolumeQuantity' },
    { title: '余料', dataIndex: 'LeaveMaterial', key: 'LeaveMaterial' },
    { title: '转单', dataIndex: 'TransformOrder', key: 'TransformOrder' },
    { title: '标签数量', dataIndex: 'LabelQuantity', key: 'LabelQuantity' },
    { title: '已打印卷数', dataIndex: 'PrintedVolumeQuantity', key: 'PrintedVolumeQuantity' },
    {
      title: '创建时间',
      dataIndex: 'CreatorTime',
      key: 'CreatorTime',
      format: text => {
        return text && text !== 'null' ? dayjs(Number(text)).tz().format('YYYY-MM-DD HH:MM:ss') : '-';
      },
    },
    { title: '创建人', dataIndex: 'CreatorUserName', key: 'CreatorUserName' },
    { title: '备注', dataIndex: 'Remark', key: 'Remark' },
  ];

  const menuTableColumns: any[] = [
    { title: '打印编码', dataIndex: 'PrintCode', width: 240 },
    { title: '内部料号', dataIndex: 'InnerMaterialCode', width: 160 },
    { title: '打印数量', dataIndex: 'PrintQuantity', width: 160 },
    { title: '打印人', dataIndex: 'CreatorUserName', width: 200 },
    { title: '打印时间', dataIndex: 'CreatorTime' },
  ];

  const [registerPopup, { changeLoading }] = usePopupInner(init);
  const [registerTable] = useTable({
    immediate: false,
    pagination: false,
    showTableSetting: false,
    striped: true,
    showIndexColumn: true,
    canResize: false,
    scroll: {
      y: 300,
    },
  });

  async function init(data) {
    state.id = data.id;
    changeLoading(true);
    await getSplitingRecordDetail(state.id).then(res => {
      const data = res.data;
      state.base = data;
      state.tableList = data.PrintRecords;
      changeLoading(false);
    });
  }
</script>

<style lang="less">
  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .popup-inner {
    background: #ebeef5;
    padding-top: 10px;
  }
</style>
