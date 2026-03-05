<template>
  <BasicModal
    v-bind="$attrs"
    :width="900"
    :height="600"
    :title="t('common.audit')"
    destroyOnClose
    class="batch-modal"
    :showOkBtn="true"
    :okText="t('common.submit')"
    @ok="handleSubmit"
    @register="registerModal">
    <div class="tip">{{ tip }}</div>
    <div style="height: 500px">
      <Grid />
    </div>
    <template v-if="isAgree && isAbnormal" #insertFooter>
      <Switch v-model:checked="appendApproverInfo.isAppend" />
      <span class="ml-6px mr-6px">{{ t('dict.mouldBusiness.supervisorReview') }}</span>
      <!-- <CustomUserSelect
        v-model:value="appendApproverInfo.signatureComment"
        :placeholder="t('common.selectPerson')"
        allowClear
        :show-search="true"
        :disabled="!appendApproverInfo.isAppend"
        class="mr-[10px] w-[200px] text-left" /> -->
      <Input
        v-model:value="appendApproverInfo.signatureComment"
        :placeholder="t('common.remark')"
        :disabled="!appendApproverInfo.isAppend"
        class="w-200px mr-20px" />
    </template>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { nextTick, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { auditColumns, auditColumnsEditRules, AUDIT_ENUM, DEMAND_TYPE_ENUM } from './configVxe';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { bulkagree, bulkreject } from '/@/api/productionDeal/mouldBusinessMaintenance';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { Switch, Input } from 'ant-design-vue';

  const emits = defineEmits(['reload']);
  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [registerModal, { changeLoading, closeModal }] = useModalInner(init);

  const tip = ref<string>(t('dict.mouldBusiness.auditArgeeTip'));
  const isAgree = ref<boolean>(true);
  const isAbnormal = ref<boolean>(false);

  const appendApproverInfo = ref<{ isAppend: boolean; signatureComment: string; approverName: string }>({
    isAppend: false,
    signatureComment: '',
    approverName: '',
  });

  function initAppendApproverInfo() {
    appendApproverInfo.value = {
      isAppend: false,
      signatureComment: '',
      approverName: '',
    };
  }

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: undefined,
    gridOptions: {
      id: 'productionDeal-mouldBusiness-maintenanceAudit-audit',
      // @ts-ignore
      treeConfig: false,
      mouseConfig: {
        area: true,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      columns: auditColumns,
      keyboardConfig: {
        isBack: false,
      },
      pagerConfig: {
        enabled: false,
        autoHidden: false,
      },
      toolbarConfig: {
        refresh: false,
        custom: false,
      },
      editConfig: {
        enabled: true,
        trigger: 'click',
      },
      editRules: auditColumnsEditRules,
      i18nConfig: {
        moduleCode: 'MoldRepairApplyColumn',
      },
      position: 'modal',
    },
  });

  /**
   * @description 初始化修改记录
   * @param data 修改数据列表
   */
  function init(data: { list: Array<any>; type: `${AUDIT_ENUM}`; demandType: `${DEMAND_TYPE_ENUM}` }) {
    initAppendApproverInfo();
    isAgree.value = data.type === AUDIT_ENUM.同意;

    isAbnormal.value = `${data.demandType}` === `${DEMAND_TYPE_ENUM.生产退模}`;
    if (isAbnormal.value) {
      tip.value = isAgree.value ? t('dict.mouldBusiness.auditAbnormalAgreeTip') : t('dict.mouldBusiness.auditAbnormalRejectTip');
    } else {
      tip.value = isAgree.value ? t('dict.mouldBusiness.auditAgreeTip') : t('dict.mouldBusiness.auditRejectTip');
    }

    nextTick(() => {
      gridApi.reloadColumn(isAgree.value ? auditColumns.slice(0, -1) : auditColumns);
      gridApi.grid.reloadData(data.list || []);
    });
  }

  async function handleSubmit() {
    if (await gridApi.grid.validate(true)) {
      return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
    }

    changeLoading(true);
    const list = gridApi.getDataSource();
    const api = isAgree.value
      ? bulkagree({
          ids: list.map(item => item.id),
          isAddSignature: appendApproverInfo.value.isAppend,
          signatureComment: appendApproverInfo.value.signatureComment,
        })
      : bulkreject({
          list: list.map(item => {
            return { id: item.id, rejectRemark: item.rejectReason };
          }),
        });
    api
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        closeModal();
      })
      .finally(() => {
        changeLoading(false);
      });
  }
</script>

<style lang="less" scoped>
  .tip {
    box-sizing: border-box;

    /* Auto layout */
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 10px 16px;
    margin-bottom: 5px;
    height: 42px;
    background: rgb(255 123 0 / 10%);
    border: 1px solid #ff7b00;
    border-radius: 4px;
  }
</style>
