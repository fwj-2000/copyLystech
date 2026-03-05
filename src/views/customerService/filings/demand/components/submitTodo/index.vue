<template>
  <Grid>
    <template #toolbar-actions>
      <a-button v-auth="'btn_create'" type="primary" @click="createFilings">{{ t('dict.CommonCol.modify') }}</a-button>
      <a-button type="primary" ghost danger v-auth="'btn_stop'" @click="handleStop">
        {{ t('common.stopText') }}
      </a-button>
    </template>

    <template #nodeDetail="{ row }">
      <div class="table-a cursor-pointer" @click="handleNodeModal(row)"> {{ t('common.detailText') }} </div>
    </template>
  </Grid>

  <NodeModal @register="registerNodeModal" />
  <StopModal @register="registerStopModal" @reload="reload" />

  <Teleport defer to="#popupwrap">
    <ApplyPop @register="registerApplyPop" @reload="handleReload"></ApplyPop>
  </Teleport>
</template>

<script lang="ts" setup>
  import { getColumns, getFormConfig, STATUS_ENUM } from './config';
  import { getList, getNodeList, bulkBackTermination } from '/@/api/customerSerivce/customsAffairsApply';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import { message } from 'ant-design-vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';

  import ApplyPop from '../ApplyPop.vue';
  import { NodeModal, StopModal } from '/@/components/CustomComponents';

  const [registerApplyPop, { openPopup: openMenuPopup }] = usePopup();
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'CAApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'customerService-filings-demand-submitTodo-list',
      columns: getColumns() as any,
      api: (params: any) => getList({ ...params, identification: '3' }),
      pagerConfig: {
        autoHidden: false,
      },
      // toolbarConfig: {
      //   delStatus: true
      // },
      i18nConfig: {
        moduleCode: 'CAApplyColumn',
      },
    },
  });

  const { reload, getSelectRowKeys, clearSelectedRowKeys, getSelectRows } = gridApi;

  function createFilings() {
    const list = getSelectRowKeys();
    if (list.length) {
      return openMenuPopup(true, {
        type: 'add',
        title: t('common.create'),
        list: list || [],
        canAddData: false,
      });
    }
    return message.info(t('common.selectText'));
  }

  function handleReload() {
    reload();
    clearSelectedRowKeys();
  }

  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  function handleNodeModal(record: any) {
    openNodeModal(true, {
      api: getNodeList,
      id: record.id,
    });
  }

  const [registerStopModal, { openModal: openStopModal }] = useModal();
  const allowStopStatus = [STATUS_ENUM.驳回, STATUS_ENUM.撤回];
  /** 终止 */
  async function handleStop() {
    const rows = getSelectRows();
    if (!rows.length) {
      return createMessage.warn(t('common.selectText'));
    }

    // 如果状态不是【驳回】或者【撤回】，则不能终止
    if (rows.some(r => !allowStopStatus.includes(r.status))) {
      return createMessage.warn(t('common.allowStatusTodo', [`${t('dict.FilingsApplyStatusEnum.5')}, ${t('dict.FilingsApplyStatusEnum.4')}`]));
    }

    openStopModal(true, {
      api: bulkBackTermination,
      type: 'stop',
      title: t('common.stopText'),
      required: true,
      beforeFetch: params => {
        return {
          ids: rows.map(el => el.id),
          terminationRemarks: params.remark,
        };
      },
    });
  }

  defineExpose({
    /** 打开详情页面 */
    openDetail: openMenuPopup,
  });
</script>

<style lang="less" scoped>
  :deep(.lydc-content-wrapper-search-box) {
    margin-bottom: 0 !important;
  }

  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }

  .text-border {
    border-bottom: 1px solid #333;
    cursor: pointer;
  }
</style>
