<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 审批 -->
              <a-button @click="reviewFn" type="primary" v-auth="'btn_review'" v-if="activeKey === 'pending'">{{ t('common.reviewText') }}</a-button>
            </a-space>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <SubmitFormModal @register="registerSubmitFormModal" @reload="reload" />
    <MrbApplyPop @register="registerMrbApplyPop" @reload="reload" />
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ref, computed } from 'vue';
  import { auditMrbapply, getAuditPage } from '/@/api/qms/mrb';
  import { usePopup } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getColumn, getFormSchema } from './config';
  import { TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import MrbApplyPop from '../mrbApply/components/mrbApplyPop/index.vue';
  import SubmitFormModal from '../mrbApply/components/SubmitFormModal.vue';
  import { MRBREVIEW_SCHEMAS } from '../mrbApply/components/mrbApplyPop/config.js';

  const { t } = useI18n();

  const props = defineProps({
    activeKey: {
      type: String,
      default: 'pending',
    },
  });
  const auditStatus = computed(() => {
    return props.activeKey === 'handled' ? 1 : 0;
  });

  const [registerMrbApplyPop, { openPopup: openMrbApplyPopup }] = usePopup();
  const [registerSubmitFormModal, { openModal: openSubmitModal }] = useModal();

  const [Grid, { reload, getSelectRows, getFetchParams }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: getFormSchema(),
      i18nConfig: {
        moduleCode: 'MrbApplyColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: props.activeKey === 'pending' ? 'qms-mrb-mrbAudit-list-wait' : 'qms-mrb-mrbAudit-list-done',
      columns: getColumn(),
      api: getAuditPage,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'MrbApplyColumn',
      },

      beforeFetch: params => {
        return {
          ...params,
          auditStatus: auditStatus.value,
        };
      },
    },
  });

  // 操作
  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleView.bind(null, row),
        tooltip: t('common.detailText'),
        auth: 'btn_view',
      },
    ];
  }

  function handleView(row: any) {
    const params = {
      data: row,
      title: t('common.detailText'),
      mode: 'view',
    };
    openMrbApplyPopup(true, params);
  }

  function reviewFn() {
    // 多条审批
    const list = getSelectRows();
    if (!list.length) return message.warning(t('dict.CheckDataTip'));
    const ids = list.map(item => item.id);

    openSubmitModal(true, {
      title: 'MRB' + t('common.review'),
      submitApi: auditMrbapply,
      formSchema: MRBREVIEW_SCHEMAS,
      apiParams: {
        ids,
      },
    });
  }
</script>

<style lang="less" scoped>
  .lydc-content-wrapper {
    position: absolute;
  }

  .btn-wrapper {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .left-btn {
    display: flex;

    button {
      margin-right: 16px;
    }

    // 选择第二个按钮
    button:nth-child(2) {
      border: #ff7b00 solid 1px;
      color: #ff7b00;
    }
  }

  //:deep(.lydc-basic-table-action button i) {
  //  font-size: 20px;
  //}
</style>
