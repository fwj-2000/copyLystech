<template>
  <a-space class="mt-10px">
    <Subtitle :title="t('dict.ECNColumn.materialHandling')" />
    <p class="mb-16px">({{ t('dict.ECNColumn.convertToFinishedProductQuantity') }}, KPCS)</p>
  </a-space>

  <BasicTable @register="registerTable">
    <template #headerCell="{ column, index, record }">
      <template v-if="column.dataIndex === 'insidePartNumber'">
        <!--        <PlusSquareOutlined style="color: #ff7b00" />-->
        <MinusSquareOutlined style="color: #ff7b00" />
        {{ column.customTitle }}
      </template>
      <template v-else>
        {{ column.customTitle }}
      </template>
    </template>
  </BasicTable>
  <Descriptions :labelStyle="{ width: '200px' }" bordered style="margin-top: 10px" :column="4" size="small">
    <DescriptionsItem :labelStyle="{ width: 'max-content' }" :label="t('dict.ECNColumn.filler')" :span="1"> {{ writeName }} </DescriptionsItem>
    <DescriptionsItem :labelStyle="{ width: 'max-content' }" :label="t('dict.ECNColumn.fillingDate')" :span="1"> {{ writeDate }} </DescriptionsItem>
    <DescriptionsItem :labelStyle="{ width: 'max-content' }" :label="t('dict.CommonCol.applyUser')" :span="1"> {{ applyName }} </DescriptionsItem>
    <DescriptionsItem :labelStyle="{ width: 'max-content' }" :label="t('dict.ECNColumn.processingDate')" :span="1"> {{ applyDate }} </DescriptionsItem>
  </Descriptions>
</template>
<script setup lang="ts">
  import { Subtitle } from '/@/components/Subtitle';
  import Template from '/@/views/engineering/pcc/pccApply/components/Template.vue';
  import { MinusSquareOutlined } from '@ant-design/icons-vue';
  import { useTable } from '/@/components/Table';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { getApplyColumns } from './CONFIG';
  import { Descriptions, DescriptionsItem } from 'ant-design-vue';
  import { reactive, toRefs } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';

  const state = reactive({
    detailData: {},
    writeName: '',
    writeDate: '',
    applyName: '',
    applyDate: '',
  });

  const { t } = useI18n();
  const { detailData, writeName, writeDate, applyName, applyDate } = toRefs(state);

  const [registerTable, { setTableData, setProps, getDataSource, updateTableDataRecord, insertTableDataRecord, deleteTableDataRecord }] = useTable({
    columns: getApplyColumns(),
    pagination: false,
    showTableSetting: false,
    striped: true,
    rowKey: 'id',
    isCanResizeParent: true,
    canResize: false,
    showIndexColumn: false,
    i18nConfig: {
      moduleCode: 'ECNColumn',
    },
  });

  function init(data) {
    console.log(data, 'materialDisposeRef init');
    state.detailData = data;
    const { partNumberList, dataFilter, flowNodeInstanceHisList } = data;
    if (flowNodeInstanceHisList && flowNodeInstanceHisList.length > 0) {
      const PMCNodeTarget = flowNodeInstanceHisList.find(item => item.nodeCode === 'PMC');
      const materialHandleNodeTarget = flowNodeInstanceHisList.find(item => item.nodeCode === 'MaterialHandle');

      if (PMCNodeTarget) {
        state.writeName = PMCNodeTarget?.handlerName;
        state.writeDate = PMCNodeTarget.creatorTime ? dateUtil(PMCNodeTarget.creatorTime).format('YYYY-MM-DD HH:mm:ss') : '-';
      }
      if (materialHandleNodeTarget) {
        state.applyName = materialHandleNodeTarget?.handlerName || '-';
        state.applyDate = materialHandleNodeTarget?.creatorTime ? dateUtil(materialHandleNodeTarget.creatorTime).format('YYYY-MM-DD HH:mm:ss') : '-';
      }
    } else {
      state.writeName = '-';
      state.writeDate = '-';
      state.applyName = '-';
      state.applyDate = '-';
    }

    console.log(partNumberList, 'partNumberList init');
    let editRowSetting = {};
    // onEdit: true,
    //   editable: true,
    //   disabled: {
    //   comments: true
    // }
    console.log(data.currentNode, 'data.currentNode');
    if (data.currentNode === 'PMC') {
      editRowSetting = {
        onEdit: true,
        editable: true,
        disabled: {
          comments: true,
        },
      };
    } else if (data.currentNode === 'MaterialHandle') {
      editRowSetting = {
        onEdit: true,
        editable: true,
        disabled: {
          shippedQty: true,
          finishedGoodsInventory: true,
          wipFinishedQty: true,
          semiFinishedGoodsQty: true,
          inventoryMaterialQty: true,
          unfulfilledOrders: true,
        },
      };
    }
    if (data.mode === 'view') {
      editRowSetting = {
        onEdit: false,
        editable: false,
      };
    }
    const list = partNumberList.map(item => {
      return {
        id: item.id,
        insidePartNumber: item.insidePartNumber,
        shippedQty: item.shippedQty,
        finishedGoodsInventory: item.finishedGoodsInventory,
        wipFinishedQty: item.wipFinishedQty,
        semiFinishedGoodsQty: item.semiFinishedGoodsQty,
        inventoryMaterialQty: item.inventoryMaterialQty,
        unfulfilledOrders: item.unfulfilledOrders,
        comments: item.comments,
        ...editRowSetting,
      };
    });
    setTableData(list);
  }

  function submit() {
    const dataSource = getDataSource();
    const list = dataSource.map(item => ({
      id: item.id,
      insidePartNumber: item.insidePartNumber,
      shippedQty: item.shippedQty,
      finishedGoodsInventory: item.finishedGoodsInventory,
      wipFinishedQty: item.wipFinishedQty,
      semiFinishedGoodsQty: item.semiFinishedGoodsQty,
      inventoryMaterialQty: item.inventoryMaterialQty,
      unfulfilledOrders: item.unfulfilledOrders,
      comments: item.comments,
    }));
    const datalist = [];
    list.forEach(item => {
      console.log(item);
      const target = cloneDeep(item);
      const o = Object.values({
        ...target,
        id: '',
        insidePartNumber: '',
      });
      const isAllEmpty = o.every(item => !item);
      if (!isAllEmpty) {
        datalist.push(item);
      }
    });
    return datalist;
  }

  defineExpose({
    init,
    submit,
  });
</script>
