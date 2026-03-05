<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button @click="handleDownLoad" type="primary">{{ t('common.downloadTemplate') }}</a-button>
              <a-button @click="handleExport()">{{ t('common.batchExport') }}</a-button>
              <!-- <BeforeImportBtn api="/api/report/netroomsubsidy/importbasis" :buttonText="t('common.importText')" :afterUpload="waitReload" /> -->
              <BeforeImportBtn api="/api/report/netroomsubsidy/importbasissupreg" :buttonText="t('hrBisColumn.btn.additional')" :afterUpload="waitReload" />
              <a-button v-auth="'btn_summary'" @click="handleSubmit"> {{ t('dict.CommonCol.aggregation') }}</a-button>
              <a-button v-auth="'btn_batchRemove'" danger @click="handleBatchDel">{{ t('common.batchDelText') }}</a-button>
              <a-button v-auth="'btn_unlock'" type="primary" @click="handleLockdata">{{ t('sys.lock.unlock') }}</a-button>
              <!-- <a-button type="primary" @click="handleSubmit">{{ t('common.submitText') }}</a-button> -->
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
    getReportDataSupReg,
    exportSupRegData,
    delSupReg,
    getSupRegPageParam,
    subsidyTempDownApi,
    approvalreportdata,
    unlockSupRegData,
  } from '/@/api/hr/netHouseSubsidy';
  import { getHrTrainFormConfig, getHrTrainPageColumns, isBefore20th } from './config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import SubModal from './components/SubModal.vue';
  import { useModal } from '/@/components/Modal';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import BeforeImportBtn from '../components/BeforeImportBtn.vue';
  import { downloadByUrl } from '/@/utils/file/download';
  import type { FormSchemaType, FormSchemaTypeHandle } from './type';
  defineOptions({ name: 'employee-netHouseSubsidy' });
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();

  const formSchema = ref<FormSchemaType>({});
  const columns = ref(getHrTrainPageColumns({}));
  onMounted(() => {
    setFieldValue('month', [dayjs().subtract(1, 'month'), dayjs().subtract(0, 'month')]);
    setFieldValue('durIng', isBefore20th() ? '0' : '1'); // 20号前月中设置0， 20号后月末设置1
    setSubValues();

    getFromValue().then(res => {
      console.log('🚀 ~onMounted res:', res);
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
          ...handleMonthChange(month),
          errorRemarks: errorRemarksStr,
        } as FormSchemaTypeHandle);
      },
      { deep: true },
    );
  });
  const init = async () => {
    getSupRegPageParam({
      ...handleMonthChange(formSchema.value.month),
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
      clearSelectedRowKeys: waitClearSelectedRowKeys,
      reload: waitReload,
      setFieldValue,
      setLatestSubmissionValues,
      getFromValue,
      updateSchema,
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
      id: 'employee-netHouseSubsidy',
      showIndexColumn: true,
      columns: columns.value,
      api: getReportDataSupReg,
      beforeFetch: params => {
        const { errorRemarks, month, ...res } = params;
        console.log('🚀 ~ beforeFetch:', params);
        return {
          ...handleMonthChange(month),
          errorRemarks: errorRemarks ? toRaw(errorRemarks).join(';') : '',
          ...res,
        };
      },
      i18nConfig: {
        moduleCode: 'hrBisColumn',
      },
    },
  });

  const [registerExportModal, { openModal: openExportModal }] = useModal();
  async function handleExport() {
    const { month, durIng, status } = await getFromValue();
    openExportModal(true, {
      api: exportSupRegData,
      listQuery: { durIng, status, ...handleMonthChange(month) },
      exportOptions: getHrTrainPageColumns({}),
      nameProps: 'title',
      idProps: 'field',
    });
  }

  async function setSubValues() {
    const { month, ...res } = await getFromValue();
    setLatestSubmissionValues({ ...handleMonthChange(month), ...res });
  }
  const handleLockdata = () => {
    const idList = getSelectRowKeys();
    if (idList.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.common.afterUnlockingTips'), //'解锁之后当前页面所选数据将被删除',
      onOk: async () => {
        try {
          const { code, msg } = await unlockSupRegData(idList);
          if (code == 200) {
            waitClearSelectedRowKeys();
            createMessage.success(msg || t('common.delSuccess'));
            waitReload();
          } else {
            createMessage.error(msg);
          }
        } catch (e) {}
      },
    });
  };
  const handleBatchSub = async () => {
    // openSubModal(true, {});
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.confirm') + t('dict.CommonCol.aggregation') + '？',
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
      createMessage.warning(t('common.selectText'));
      return;
    }
    console.log(idList, 'idList');
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: async () => {
        try {
          const { code, msg } = await delSupReg(idList);
          if (code == 200) {
            waitClearSelectedRowKeys();
            createMessage.success(msg || t('common.delSuccess'));
            waitReload();
          } else {
            createMessage.error(msg);
          }
        } catch (e) {
          console.error('Error during batch deletion:', e);
        }
      },
    });
  };
  const [registerSubModal, { openModal: openSubModal }] = useModal();

  const handleSubmit = async () => {
    const idList = getSelectRowKeys();
    if (idList.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }
    openSubModal(true, idList);
  };
  /**
   * 处理月份选择器值变化，转换为开始和结束时间维度
   * @param month 月份范围数组，格式为 [startDate, endDate]
   * @returns 包含开始和结束时间维度的对象
   */
  const handleMonthChange = (month: [Date | string | null, Date | string | null] | null) => {
    // 检查month是否存在且有值
    if (month && month.length === 2 && month[0] && month[1]) {
      return {
        startDim: dayjs(month[0]).format('YYYY-MM'),
        endDim: dayjs(month[1]).format('YYYY-MM'),
      };
    }
    // 默认返回空字符串
    return {};
  };
</script>
