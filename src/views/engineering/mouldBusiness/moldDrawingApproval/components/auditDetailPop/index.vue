<template>
  <BasicPopup
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="true"
    :title="t('common.detailText')"
    :destroyOnClose="true"
    :showFooter="false"
    :okText="t('common.submit')"
    :okButtonProps="{ class: 'mr-12px' }"
    class="full-popup">
    <template #centerToolbar>
      <template v-if="isAudit && dataList.length > 0">
        <!-- 驳回 -->
        <a-button type="primary" danger ghost class="ml-12px" :loading="loading" @click="() => handleReject()">{{ t('common.rejectText') }}</a-button>
        <!-- 同意 -->
        <a-button type="primary" class="mx-12px" :loading="loading" @click="() => handeleAgree()">{{ t('common.agree') }}</a-button>
      </template>
    </template>
    <div v-if="dataList.length > 0" class="h-full py-10px">
      <MoldDrawingTable v-if="sourceType === SOURCE_TYPE_ENUM.图纸更新" :list="dataList" />
    </div>
    <lydc-empty v-else />
    <RejectModal @register="registerRejectModal" />
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { ref, toRaw } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { SOURCE_TYPE_ENUM } from '../../config';
  import { useModal } from '/@/components/Modal';
  import { bulkMoldDrawingAuditAgree, bulkMoldDrawingAuditReject } from '/@/api/engineering/moldDrawingLibrary';

  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import MoldDrawingTable from './moldDrawingTable.vue';
  import { RejectModal } from '/@/components/CustomComponents';

  const emits = defineEmits(['register', 'reload']);

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const [registerPopup, { closePopup, changeOkLoading, changeLoading }] = usePopupInner(init);

  /** 列表数据 */
  const dataList = ref<Array<any>>([]);
  /** 是否为审核模式，如果是的话，显示审核按钮 */
  const isAudit = ref<boolean>(false);
  /** 数来来源类型 */
  const sourceType = ref<SOURCE_TYPE_ENUM>(SOURCE_TYPE_ENUM.图纸更新);
  const loading = ref<boolean>(false);

  function init(data: { list: Array<any>; isAudit: boolean; sourceType: SOURCE_TYPE_ENUM }) {
    dataList.value = toRaw(data.list || []);
    isAudit.value = data.isAudit || false;
    sourceType.value = data.sourceType || SOURCE_TYPE_ENUM.图纸更新;
  }

  function setLoading(isLoading = false) {
    changeLoading(isLoading);
    changeOkLoading(isLoading);
    loading.value = isLoading;
  }

  /**
   * 审核 - 同意
   */
  async function handeleAgree() {
    setLoading(true);
    bulkMoldDrawingAuditAgree(dataList.value.map(item => item.id))
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        closePopup();
        emits('reload');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  /**
   * 审核 - 驳回
   */
  function handleReject() {
    openRejectModal(true, {
      id: dataList.value.map(item => item.id),
      api: (params: any) =>
        bulkMoldDrawingAuditReject({
          ids: dataList.value.map(item => item.id),
          rejectRemark: params.rejectRemark,
        }).then(() => {
          createMessage.success(t('sys.api.operationSuccess'));
          setLoading(false);
          closePopup();
          emits('reload');
        }),
    });
  }
</script>

<style scoped lang="less">
  :deep(div.pb-none) {
    padding-bottom: 0;
  }
</style>
