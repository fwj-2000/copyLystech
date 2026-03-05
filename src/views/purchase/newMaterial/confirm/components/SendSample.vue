<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showCancelBtn="true"
    :showOkBtn="true"
    :title="t('common.sendSample')"
    destroyOnClose
    @ok="handleSave"
    class="full-popup">
    <div class="h-full p-10px">
      <Subtitle :title="t('common.sendSample')" />
      <Grid style="height: calc(100% - 20px)"></Grid>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { sampleColumns } from '../config';
  import { sendSamples, getMaterialConfirmDetails } from '/@/api/purchase/newMateriaConfirm';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDateTime } from '/@/hooks/web/useDateTime';
  import { dateUtil } from '/@/utils/dateUtil';

  const emits = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { formatDate } = useDateTime();

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const [Grid, { reloadData, getDataSource }] = useVbenVxeGrid({
    gridOptions: {
      id: 'purchase-newMaterial-confirm-sample',
      columns: sampleColumns,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'MaterialDevelopApplyColumn',
      },
      editConfig: {
        trigger: 'click',
        mode: 'row',
      },
      toolbarConfig: {
        enabled: false,
      },
    },
  });

  async function init(data) {
    getDetail(data.ids);
  }

  // 获取采样详情
  async function getDetail(ids) {
    changeLoading(true);
    const r = await getMaterialConfirmDetails(ids);
    reloadData(
      r.data.map(el => {
        if (el.expectedSampleDate) {
          el.expectedSampleDate = formatDate(el.expectedSampleDate);
        }
        return el;
      }),
    );
    changeLoading(false);
  }

  const { t } = useI18n();
  async function handleSave() {
    changeLoading(true);
    try {
      const params = getDataSource().map(obj => {
        return {
          id: obj.id,
          // manufacturerId: obj.manufacturerId,
          // modelNumber: obj.modelNumber,
          specifications: obj.specifications,
          expectedSampleDate: dateUtil(obj.expectedSampleDateTime).valueOf(),
          sqeUserId: obj.sqeUserId,
          sendSamplesRemarks: obj.sendSamplesRemarks,
        };
      });
      const r = await sendSamples(params);
      if (r.code == 200) {
        createMessage.success(t('sys.api.operationSuccess'));
        closePopup();
        emits('reload');
      }
      changeLoading(false);
    } catch (error) {
      console.error(error);
      changeLoading(false);
    }
  }
</script>
