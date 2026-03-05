<template>
  <BasicModal
    :title="t('dict.DrawingsReviewColumn.openDetail')"
    canFullscreen
    :draggable="true"
    :width="800"
    v-bind="$attrs"
    @register="registerModal"
    destroy-on-close
    showOkBtn
    class="detail-modal"
    @ok="handleModalSubmit">
    <!--  <a-modal v-model:visible="visible" ok-text="确认" cancel-text="取消" width="620" @ok="handleConfirm" class="modal-wrapper">-->

    <BasicTable class="w-full" style="min-height: 500px" @register="registerTable">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.dataIndex === 'action'">
          <TableAction :actions="getTableActions(record)" />
        </template>
        <template v-else-if="column.dataIndex === 'reviewResult'">
          <a-tag :color="REVIEW_MAP.find(item => item.id === text)?.color">{{ REVIEW_MAP.find(item => item.id === text).fullName }}</a-tag>
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <template v-if="record?.contentList.length > 0">
          <BasicTable @register="registerSubTable" v-loading="record.childTableLoading" :data-source="record.contentList"> </BasicTable>
        </template>
        <template v-else>
          <Empty />
        </template>
      </template>
    </BasicTable>
    <!--  </a-modal>-->
  </BasicModal>
</template>
<script lang="ts" setup>
  import { defineEmits, nextTick, onMounted, reactive, ref, toRefs } from 'vue';
  import { ActionItem, BasicColumn, BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getDrawingsReviewRecord } from '/@/api/engineering/drawingReview';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Empty } from 'ant-design-vue';
  import { useBaseStore } from '/@/store/modules/base';
  const { t } = useI18n();

  const baseStore = useBaseStore();

  const REVIEW_MAP = [
    {
      id: '1',
      fullName: t('common.agree'),
      color: 'success',
    },
    {
      id: '2',
      fullName: t('common.disagree'),
      color: 'error',
    },
  ];
  const emits = defineEmits(['getTable', 'register']);
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const columns: BasicColumn = [
    {
      title: t('dict.DrawingsReviewColumn.originCode'),
      dataIndex: 'originCode',
      width: 180,
    },
    {
      title: t('dict.DrawingsReviewColumn.reviewTime'),
      dataIndex: 'reviewDate',
      format: 'date|YYYY-MM-DD HH:mm:ss',
      width: 180,
    },
    {
      title: t('dict.DrawingsReviewColumn.reviewResult'),
      dataIndex: 'reviewResult',
      width: 180,
    },
  ];

  const state = reactive({
    partNumber: '',
    issueTypes: [],
  });
  const { partNumber } = toRefs(state);
  const [registerTable, { reload }] = useTable({
    api: getDrawingsReviewRecord,
    useSearchForm: false,
    pagination: false,
    beforeFetch: params => {
      if (state.partNumber) {
        params.insidePartNumber = state.partNumber;
      }
    },

    showTableSetting: false,
    isCanResizeParent: true,
    columns,
    immediate: false,
    actionColumn: {
      width: 70,
      title: t('views.business.quota.action'),
      dataIndex: 'action',
    },
  });

  const subColumns: BasicColumn[] = [
    {
      title: t('dict.DrawingsReview.IssueType'),
      dataIndex: 'issueType',
      customRender: ({ text }) => {
        return state.issueTypes.find(item => item.enCode == text).fullName;
      },
    },
    {
      title: t('dict.DrawingsReviewColumn.problemDescription'),
      dataIndex: 'issueDetail',
    },
  ];
  const [registerSubTable, { reload: subReload, getSelectRows: subGetSelectRows }] = useTable({
    columns: subColumns,
    pagination: false,
    bordered: true,
    showTableSetting: false,
    showIndexColumn: false,
    rowSelection: {
      type: 'checkbox',
    },
    canResize: false,
    scroll: { x: undefined },
  });

  function init(data) {
    state.partNumber = data.insidePartNumber;
    nextTick(() => {
      reload();
    });
  }

  function handleModalSubmit() {
    console.log('handleModalSubmit');
    const rows = subGetSelectRows();
    console.log(rows);
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleEdit.bind(null, record),
      },
    ];
  }

  function handleEdit(record) {
    window.open(`${window.location.href}?openDetail=true&id=${record.id}`, '_blank');
  }

  const visible = ref<boolean>(false);
  const setVisible = async (e: boolean, data) => {
    if (e) {
      // 如果是打开。请求数据
      // const { code, data: ctx } = await getDrawingsReviewRecord({
      //   insidePartNumber: data.insidePartNumber,
      // });
      // state.list = ctx;
      // console.log(ctx)
      // state.partNumber = data;
    }

    visible.value = e;
  };

  onMounted(() => {
    getOps();
  });

  async function getOps() {
    const list = await baseStore.getDictionaryData('DrawingsReview.IssueType');
    state.issueTypes = list;
  }

  defineExpose({
    setVisible,
  });
</script>

<style lang="less" scoped>
  //  modal样式start

  .title-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 20px;

    .modal-title {
      color: #1a1a1a;

      /* 中文/标题16 */

      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px; /* 150% */
    }
  }

  .form-wrapper {
    padding: 20px 36px;
  }

  :deep(.icon-ym-btn-preview) {
    font-size: 18px;
  }

  .inside-part-number {
    margin-top: 8px;
    margin-bottom: 4px;
    margin-left: 35px;
    color: #999;

    /* 中文/正文13 */

    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 153.846% */
  }

  //:deep(.lydc-basic-modal .ant-modal .ant-modal-body > .scrollbar){
  //  padding: 0 !important;
  //}
  //
  //:deep(.scroll-container){
  //  padding: 0;
  //}
</style>
