<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button @click="handleDownLoad" type="primary">{{ t('common.downloadTemplate') }}</a-button>

              <a-button danger @click="handleBatchDel">{{ t('common.batchDelText') }}</a-button>
              <!-- <BeforeImportBtn api="/api/report/netroomsubsidy/importStandard" :buttonText="t('common.importText')" :afterUpload="gridApi.reload" /> -->
              <SingleUpload v-for="(item, idx) in uploadButtonList" :key="idx" v-bind="item" :afterUpload="gridApi.reload"></SingleUpload>

              <a-tooltip placement="topLeft" :title="t('dict.common.modifiedTips')">
                <a-button :loading="saveLoading" type="primary" @click="handleSave">
                  {{ t('common.saveText') }}
                </a-button>
              </a-tooltip>
            </a-space>
          </template>
        </Grid>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { getHrTrainFormConfig, getHrTrainPageColumns, uploadButtonList } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getStandardApi, updateStandardApi, subsidyTempDownApi, standardDel } from '/@/api/hr/netHouseSubsidy';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { downloadByUrl } from '/@/utils/file/download';
  // import BeforeImportBtn from '../components/BeforeImportBtn.vue';
  import SingleUpload from '/@/views/dashboard/operate/components/SingleUpload.vue';
  import { message } from 'ant-design-vue';

  const { createMessage, createConfirm } = useMessage();

  defineOptions({ name: 'hrBis-subsidyStandard' });
  const saveLoading = ref<boolean>(false);

  const { t } = useI18n();
  onMounted(async () => {});

  const handleSave = async () => {
    saveLoading.value = true;
    const { updateRecords } = gridApi.getRecordset();
    if (updateRecords.length === 0) {
      createMessage.warning(t('dict.common.dataUnchanged'));
      saveLoading.value = false;
      return;
    }
    const params = updateRecords.map(item => {
      return {
        Id: item.Id ?? '',
        Standard: item.Standard ?? '',
        SpecialWorkShop: item.SpecialWorkShop ?? '',
      };
    });

    updateStandardApi(params)
      .then(({ code, msg }) => {
        if (code == 200) {
          createMessage.success(msg);
          gridApi.reload();
        } else {
          createMessage.error(msg);
        }
      })
      .catch(() => {})
      .finally(() => {
        saveLoading.value = false;
      });
  };
  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      submitOnChange: false,
      showCollapseButton: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getHrTrainFormConfig(),
      resetButtonOptions: {
        content: t('common.resetText'),
        show: false,
      },
      i18nConfig: {
        moduleCode: 'hrBisColumn',
        transferRange: ['placeholder'], //placeholder
      },
    },
    gridOptions: {
      keepSource: true,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
        showStatus: true,
      },
      rowConfig: {
        keyField: 'Id',
      },
      showIndexColumn: true,
      id: 'hrBis-subsidyStandard',
      columns: getHrTrainPageColumns() as any,
      api: getStandardApi,
      i18nConfig: {
        moduleCode: 'hrBisColumn',
      },
    },
  });
  const handleDownLoad = async () => {
    const res = await subsidyTempDownApi({ templateType: '1' });
    if (res.code === 200) {
      const { url, fileName } = res.data;
      downloadByUrl({ url, fileName });
      createMessage.success(res.msg);
    }
  };
  const handleBatchDel = () => {
    const idList = gridApi.getSelectRowKeys();
    if (idList.length === 0) {
      message.warning(t('common.selectText'));
      return;
    }
    console.log(idList, 'idList');
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: async () => {
        try {
          const { code, msg } = await standardDel(idList);
          if (code == 200) {
            gridApi.clearSelectedRowKeys();
            message.success(msg || t('common.delSuccess'));
            gridApi.reload();
          } else {
            message.error(msg);
          }
        } catch (e) {
          // waitReload();
        }
      },
    });
  };
</script>
