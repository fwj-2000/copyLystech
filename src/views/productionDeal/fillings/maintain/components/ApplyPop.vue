<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="false"
    :okText="t('common.submit')"
    :title="t('dict.ProductTypeColumn.Maintenance')"
    @ok="() => handleSave(true)"
    class="full-popup popup-top">
    <template #centerToolbar>
      <a-button class="ml-12px" :loading="isLoading" @click="() => handleClickUploadBtn()">{{ t('component.upload.batchUpload') }}</a-button>
      <a-button class="ml-12px" :loading="isLoading" @click="() => handleSave(false)" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>
    <ApplyPopEditTable ref="applyPopEditTableRef" @update:uploading="setLoading" />
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { nextTick, ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getDetail, save, temporaryStorage } from '/@/api/productionDeal/customsAffairsProduce';

  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import ApplyPopEditTable from './ApplyPopEditTable.vue';

  const { t } = useI18n();
  const emits = defineEmits(['register', 'reload']);

  const { createMessage } = useMessage();
  const ids = ref<Array<string>>([]);

  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  async function init(data: { ids?: Array<string> }) {
    return nextTick(() => {
      if (data.ids && data.ids.length > 0) {
        getTableData(data.ids);
      }
    });
  }

  const applyPopEditTableRef = ref<InstanceType<typeof ApplyPopEditTable>>();
  function getTableData(idList: Array<string>) {
    changeLoading(true);
    ids.value = Array.isArray(idList) ? idList : (idList as string).split(',');
    getDetail(idList)
      .then(res => {
        applyPopEditTableRef.value && applyPopEditTableRef.value.initTableData(res.data, idList);
      })
      .catch(() => {
        closePopup();
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  function handleClickUploadBtn() {
    applyPopEditTableRef.value?.handleClickUploadBtn();
  }

  const isLoading = ref<boolean>(false);
  /**
   * 设置加载状态
   * @param loading
   */
  function setLoading(loading = false) {
    changeLoading(loading);
    changeOkLoading(loading);
    isLoading.value = loading;
  }

  async function handleSave(isSubmit = false) {
    if (!applyPopEditTableRef.value) {
      return false;
    }

    const list = await applyPopEditTableRef.value.getTableData(isSubmit);

    if (!list) {
      return false;
    }

    const api = isSubmit ? save : temporaryStorage;

    setLoading(true);
    return api(list)
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        isSubmit ? closePopup() : nextTick(() => getTableData(ids.value));
      })
      .finally(() => {
        setLoading(false);
      });
  }
</script>

<style lang="less" scoped>
  .popup-top {
    top: 0;
  }

  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  :deep(.basic-content-wrap) {
    display: inline-flex;
  }

  .basic-form {
    display: inline-block;
    width: 200px;
    margin-right: 8px;
  }
</style>
