<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_download'" class="mr-12px" @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
          <template #processName="{ row }">
            <div class="process-name" @click="handleDetail(row)">{{ row.processName }}</div>
          </template>
          <template #expand_content="{ row }">
            <div class="expand-wrapper p-[10px]">
              <Detail :data="row.flowDetais"></Detail>
            </div>
          </template>
        </Grid>
      </div>
    </div>
    <DetailPopup @register="registerDetail" @reload="reload" />
    <ExportModal @register="registerExport"> </ExportModal>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { usePopup } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import DetailPopup from './components/Detailopup.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { schema, column } from './config';
  import { getSNtraceList } from '/@/api/productionDeal/snTraceabilityReport';
  import ExportModal from './components/exportModal.vue';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import Detail from './components/Detail.vue';
  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  defineOptions({ name: 'productionDeal-basicReport-snTraceabilityReport' });

  const [registerDetail, { openPopup: openDetailPop }] = usePopup();
  const [registerExport, { openModal: openExportModal }] = useModal();

  const snCodes = ref('');

  const [Grid, { reload, getFromValue, resetForm, reloadData }] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-4 gap-4',
      schema: schema,
      i18nConfig: {
        moduleCode: 'SnTraceColumn',
        transferRange: ['placeholder'],
      },
      handleSubmit: params => {
        getList(params);
      },
      handleReset: () => {
        resetForm();
        getList();
      },
    },
    gridOptions: {
      id: 'productionDeal-basicReport-snTraceabilityReport-list',
      showIndexColumn: true,
      columns: column as any,
      expandConfig: {
        expandAll: false,
      },
      toolbarConfig: {
        refresh: false,
        expandAll: true,
      },
      i18nConfig: {
        moduleCode: 'SnTraceColumn',
      },
      pagerConfig: {
        enabled: false,
      },
    },
  });
  // 新增
  const handleDetail = row => {
    if (!hasBtnP('btn_detail')) return message.warning(t('dict.CommonCol.noViewPermissionTip'));
    openDetailPop(true, row);
  };

  // 批量导出
  const handleExport = async () => {
    openExportModal(true);
  };

  const getList = async (params = {}) => {
    const { snCode } = await getFromValue();
    const snCodeList = snCode && snCode.trim().split(/\s+/);
    if (snCodeList.length > 1000) return message.warning(t('dict.CommonCol.supportsNumberQueryTip', [1000]));
    const paramsObj: any = { ...params, snCodes: snCodeList };

    // if (paramsObj.pickerVal) {
    //   paramsObj.begin = paramsObj.pickerVal[0];
    //   paramsObj.end = paramsObj.pickerVal[1];
    //   delete paramsObj.pickerVal;
    // }
    delete paramsObj.snCode;
    getSNtraceList(paramsObj)
      .then(({ data }) => {
        if (data && data.length) {
          snCodes.value = snCode;
        }
        reloadData(data || []);
      })
      .catch(() => {
        reloadData([]);
      });
    // .finally(() => {
    //   setFieldValue('snCode', null);
    // });
  };

  // async function updateProcessTypeList(e) {
  //   const { data } = await alllistbyfactory({ factoryArea: e });
  //   updateSchema([
  //     {
  //       fieldName: 'gxCode',
  //       componentProps: {
  //         options: data,
  //       },
  //     },
  //   ]);
  // }

  onMounted(async () => {
    // updateSchema([
    //   {
    //     fieldName: 'factoryArea',
    //     componentProps: {
    //       onChange: async e => {
    //         updateProcessTypeList(e);
    //         setFieldValue('gxCode', null);
    //         setLatestSubmissionValues(await getFromValue());
    //         query();
    //       },
    //     },
    //   },
    // ]);
  });
</script>

<style lang="less" scoped>
  ::v-deep(textarea) {
    resize: none; /* 禁止拖动改变大小 */
  }

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

  .process-name {
    color: #1890ff;
    cursor: pointer;
  }

  .pass {
    color: green;
  }

  .fail {
    color: red;
  }
</style>
