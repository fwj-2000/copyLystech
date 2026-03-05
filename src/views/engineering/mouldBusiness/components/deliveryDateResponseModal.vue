<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :width="600" @ok="handleSubmit" destroyOnClose class="lydc-condition-modal">
    <template #title>
      <Subtitle :title="t('dict.CommonCol.replyDeliveryTime')" style="padding-bottom: 0" />
    </template>
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable" :searchInfo="searchInfo" class="lydc-sub-table">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'replyDeliveryTime'">
              <LydcDatePicker v-model:value="record[column.dataIndex]" :placeholder="t('dict.CommonCol.replyDeliveryTime')" clearable />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { getReplydeliverylist, replydelivery } from '/@/api/engineering/mould';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  const emit = defineEmits(['register', 'reload']);
  const columns: BasicColumn[] = [
    { title: '模具编号', dataIndex: 'moldNo' },
    { title: '供应商', dataIndex: 'supplier' },
    { title: '交期回复', dataIndex: 'replyDeliveryTime' },
  ];
  const { createMessage } = useMessage();
  const [registerModal, { closeModal }] = useModalInner(init);
  const [registerTable, { setTableData, getDataSource }] = useTable({
    // api: ,
    columns,
    immediate: false,
    useSearchForm: false,
    rowKey: 'id',
    tableSetting: { size: false, setting: false },
    isCanResizeParent: true,
    canResize: true,
    showTableSetting: false,
    resizeHeightOffset: -74,
    showIndexColumn: false,
  });
  const searchInfo = ref();
  const state = reactive({
    dataSource: [] as any,
  });

  function init({ ids, dataSource }) {
    getReplydeliverylistFn(ids);
  }

  async function getReplydeliverylistFn(ids) {
    try {
      const { code, data, msg } = await getReplydeliverylist(ids);
      if (code === 200) {
        setTableData(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function replydeliveryFn() {
    const params: any = [];
    getDataSource().forEach(o => {
      params.push({
        id: o.id,
        replyDeliveryTime: o.replyDeliveryTime,
      });
    });
    try {
      const { code, data, msg } = await replydelivery(params);
      if (code === 200) {
        createMessage.success(msg);
        emit('reload');
        closeModal();
      } else {
        createMessage.error(msg);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleSubmit() {
    replydeliveryFn();
  }
</script>
