<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_downloadTemplate'" @click="handleDownLoad" type="primary">{{ t('common.downloadTemplate') }}</a-button>
              <a-button v-auth="'btn_download'" @click="handleExport()">{{ t('common.batchExport') }}</a-button>
              <BeforeImportBtn
                v-auth="'btn_upload'"
                api="/api/report/netroomsubsidy/importbasis"
                :buttonText="t('common.importText')"
                :afterUpload="waitReload" />
              <!-- <BeforeImportBtn
                v-auth="'btn.additional'"
                api="/api/report/netroomsubsidy/importbasissupreg"
                :buttonText="t('hrBisColumn.btn.additional')"
                :showSupRegMonth="true"
                :afterUpload="waitReload" /> -->
              <a-button v-auth="'btn_Archive'" @click="handleBatchSub"> {{ t('hrBis.clickArchive') }}</a-button>
              <a-button v-auth="'btn_batchRemove'" danger @click="handleBatchDel">{{ t('common.batchDelText') }}</a-button>
              <a-button v-auth="'btn_unlock'" type="primary" @click="handleLockdata">{{ t('sys.lock.unlock') }}</a-button>
              <a-tooltip placement="topLeft" :title="t('dict.common.modifiedTips')">
                <a-button v-auth="'btn_save'" :loading="saveLoading" type="primary" @click="handleSave">
                  {{ t('common.saveText') }}
                </a-button>
              </a-tooltip>
              <a-button v-auth="'btn_submit'" type="primary" @click="handleSubmit">{{ t('common.submitText') }}</a-button>
              <!-- <a-button v-auth="'btn.additional'" type="primary" @click="handleSubmit">{{ t('hrBisColumn.btn.additional') }}</a-button> -->
            </a-space>
          </template>
        </Grid>
      </div>
    </div>
    <SubModal @register="registerSubModal" @reload="waitReload" />
    <ExportModal @register="registerExportModal" :dataType="1" />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, toRaw, watch, ref } from 'vue';
  import dayjs from 'dayjs';
  import {
    getReportdata,
    unlockbasisdata,
    exportReportDataApi,
    addorupdatebasis,
    subsidyTempDownApi,
    basisdel,
    submitbasisdata,
    reportdatapageparam,
    approvalreportdata,
  } from '/@/api/hr/netHouseSubsidy';
  import { getHrTrainFormConfig, getHrTrainPageColumns, isBefore20th } from './config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { message } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import SubModal from './components/SubModal.vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import BeforeImportBtn from '../components/BeforeImportBtn.vue';
  import { downloadByUrl } from '/@/utils/file/download';
  import type { FormSchemaType, FormSchemaTypeHandle } from './type';
  defineOptions({ name: 'hrBis-overviewOne' });
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();

  const formSchema = ref<FormSchemaType>({});
  const columns = ref(getHrTrainPageColumns({}));
  const saveLoading = ref(false);
  onMounted(() => {
    setFieldValue('month', dayjs().subtract(0, 'month').format('YYYY-MM'));
    setFieldValue('durIng', isBefore20th() ? '0' : '1'); // 20号前月中设置0， 20号后月末设置1
    setSubValues();

    getFromValue().then(res => {
      formSchema.value = res;
    });
    watch(
      () => [formSchema.value.month, formSchema.value.durIng, formSchema.value.status],
      () => {
        init();
      },
      { deep: true },
    );
    watch(
      () => [formSchema.value],
      () => {
        const { errorRemarks, month, ...res } = formSchema.value;
        const errorRemarksStr = errorRemarks ? errorRemarks.toString() : '';
        columns.value = getHrTrainPageColumns({
          ...res,
          month: handleMonthChange(month),
          errorRemarks: errorRemarksStr,
        } as FormSchemaTypeHandle);
      },
      { deep: true },
    );
  });
  const init = async () => {
    reportdatapageparam({
      month: handleMonthChange(formSchema.value.month),
      durIng: formSchema.value.durIng,
      status: formSchema.value.status,
    }).then(res => {
      const workNoList = res.data.workNoList.map(item => ({
        label: item,
        value: item,
      }));
      const userNameList = Object.entries(res.data.userNameList).map(([key, value]) => ({
        label: value,
        value: key,
      }));
      updateSchema([
        {
          fieldName: 'creatorUserAccount',
          componentProps: {
            options: workNoList,
          },
        },
        {
          fieldName: 'creatorUserId',
          componentProps: {
            options: userNameList,
          },
        },
      ]);
    });
  };

  const [
    Grid,
    {
      getSelectRows: waitGetSelectRows,
      clearSelectedRowKeys: waitClearSelectedRowKeys,
      reload: waitReload,
      setFieldValue,
      setLatestSubmissionValues,
      getFromValue,
      getDataSource,
      updateSchema,
      getRecordset,
      getSelectRowKeys,
    },
  ] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: true,
      // 按下回车时是否提交表单
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
      id: 'hrBis-overviewOne',
      keepSource: true,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
        showStatus: true,
      },
      showIndexColumn: true,
      columns: columns.value,
      api: getReportdata,
      beforeFetch: params => {
        const { errorRemarks, month, ...res } = params;
        return {
          ...res,
          month: month ? handleMonthChange(month) : '',
          errorRemarks: errorRemarks ? toRaw(errorRemarks).join(';') : '',
        };
      },
      i18nConfig: {
        moduleCode: 'hrBisColumn',
      },
    },
  });

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  async function handleExport() {
    const columnsKeys = ['checkbox', 'contiworkdaysArchive', 'totalAmount', 'subsidyAmountArchive', 'dataRetrieval', 'supRegAmount'];
    const defaultSelectedKeys = columns.value.filter(item => !columnsKeys.includes(item.field)).map(item => item.field);
    const { month, durIng, status } = await getFromValue();

    openExportModal(true, {
      api: exportReportDataApi,
      listQuery: { durIng, status, month: handleMonthChange(month) },
      exportOptions: getHrTrainPageColumns({}),
      nameProps: 'title',
      idProps: 'field',
      defaultSelectedKeys,
    });
  }
  const handleLockdata = () => {
    const idList = getSelectRowKeys();
    if (idList.length === 0) {
      message.warning(t('common.selectText'));
      return;
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.common.afterUnlockingTips'), //'解锁之后当前页面所选数据将被删除',
      onOk: async () => {
        try {
          const { code, msg } = await unlockbasisdata(idList);
          if (code == 200) {
            waitClearSelectedRowKeys();
            message.success(msg || t('common.delSuccess'));
            waitReload();
          } else {
            message.error(msg);
          }
        } catch (e) {}
      },
    });
  };

  const [registerSubModal, { openModal: openSubModal }] = useModal();
  const handleBatchSub = async () => {
    // openSubModal(true, {});
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.confirm') + t('hrBis.clickArchive') + '？',
      onOk: async () => {
        try {
          approvalreportdata({})
            .then(res => {
              createMessage.success(res.msg);
            })
            .catch(() => {});
        } catch (e) {}
      },
    });
  };
  async function setSubValues() {
    let { month, ...res } = await getFromValue();
    const monthRes = handleMonthChange(month);
    setLatestSubmissionValues({ month: monthRes, ...res });
    // console.log('刷新表格数据' );
    // isrRefresh ? waitReload() : '';
  }

  const handleMonthChange = month => {
    return month ? dayjs(month).format('YYYY-MM') : '';
  };
  const handleSave = async () => {
    saveLoading.value = true;
    const { updateRecords } = getRecordset();
    if (updateRecords.length === 0) {
      createMessage.warning(t('dict.common.dataUnchanged'));
      saveLoading.value = false;
      return;
    }
    const params = updateRecords.map(item => {
      return {
        id: item.id ?? '',
        workNo: item.workNo ?? '',
        userName: item.userName ?? '',
        isWholeMonth: item.isWholeMonth ?? '',
        workDaysNum: item.workDaysNum ?? '',
        workshopFloor: item.workshopFloor ?? '',
        submitUserName: item.submitUserName ?? '',
        remarks: item.remarks ?? '',
        month: item.month ?? '',
        durIng: item.durIng ?? '',
      };
    });

    addorupdatebasis(params)
      .then(({ code, msg }) => {
        if (code == 200) {
          createMessage.success(msg);
          waitReload();
        } else {
          createMessage.error(msg);
        }
      })
      .catch(() => {})
      .finally(() => {
        saveLoading.value = false;
      });
  };
  const handleDownLoad = async () => {
    const res = await subsidyTempDownApi({ templateType: '0' });
    if (res.code === 200) {
      const { url, fileName } = res.data;
      downloadByUrl({ url, fileName });
      createMessage.success(res.msg);
    }
  };
  const handleBatchDel = () => {
    const idList = getSelectRowKeys();
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
          const { code, msg } = await basisdel(idList);
          if (code == 200) {
            waitClearSelectedRowKeys();
            message.success(msg || t('common.delSuccess'));
            waitReload();
          } else {
            message.error(msg);
          }
        } catch (e) {
          // waitReload();
        }
      },
    });
  };
  async function handleSubmit() {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.confirm') + t('common.submitText') + '？',
      onOk: async () => {
        try {
          submitbasisdata({})
            .then(res => {
              createMessage.success(res.msg);
            })
            .catch(() => {});
        } catch (e) {}
      },
    });
  }
</script>
