<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 批量导出 -->
              <a-button class="mr-12px" @click="handleExport" v-auth="'btn_download'">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
          <template #DefectImage1="{ row }">
            <div class="table-a" @dblclick="handlePreview(row.fileUrl, row.fileName)">
              {{ row.fileName }}
            </div>
          </template>

          <template #DefectImage2="{ row }">
            <div class="table-a" @dblclick="handlePreview(row.fileUrl, row.fileName)">
              {{ row.fileName }}
            </div>
          </template>
          <template #DefectImage3="{ row }">
            <div class="table-a" @dblclick="handlePreview(row.fileUrl, row.fileName)">
              {{ row.fileName }}
            </div>
          </template>
        </Grid>
      </div>
    </div>
    <PreviewModal ref="filePreviewRef" />
    <ExportModal @register="registerExportModal" @export="exportAction" />
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ref, onMounted, nextTick } from 'vue';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import { useI18n } from '/@/hooks/web/useI18n';
  // import { usePermission } from '/@/hooks/web/usePermission';
  import { PreviewModal } from '/@/components/Upload';
  import { column, getFormSchema } from './config';
  import { getpage, getmachine, exportExcel, getfloor } from '/@/api/qms/iqc/butlerYield';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import dayjs from 'dayjs';

  const { t } = useI18n();
  // const { hasBtnP } = usePermission();
  defineOptions({ name: 'qms-intelligentButler-butlerYield' });
  const filePreviewRef = ref<ModalComponent | null>(null);
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();

  const state = ref<any>({
    factoryArea: '',
  });

  const [Grid, { getFetchParams, updateSchema, getFromValue, setState, reload }] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: getFormSchema(),
      i18nConfig: {
        moduleCode: 'MacCameraRateColumn',
        transferRange: ['placeholder'],
      },
    },
    //
    gridOptions: {
      id: 'qms-intelligentButler-butlerYield-list',
      columns: column,
      api: getpage,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'MacCameraRateColumn',
      },
      proxyConfig: {
        autoLoad: false,
        response: {
          result: 'data.pageData.list',
          total: 'data.pageData.pagination.total',
        },
      },
      beforeFetch: params => handleParams(params),
      footerCellClassName: 'vxe-foot-data-cell',
      afterFetch: data => {
        const {
          dieYieId,
          dieUPH,
          dieUtilizationRate,
          dieQty,
          cameraQty,
          cameraYieId,
          handQty,
          handBadQty,
          handYieId,
          handRemQty,
          handCompleteRate,
          dieRealUPH,
          achieveRate,
          utilizationRate,
          macAchieveRate,
          OEE,
          eighty,
          nine,
          ten,
          eleven,
          twelve,
          thirteen,
          fourteen,
          fifteen,
          sixteen,
          seventeen,
          eighteen,
          nineteen,
          camBadYieId,
        } = data.summaryData;
        setState({
          gridOptions: {
            footerData: [
              {
                dieYieId,
                dieUPH,
                dieUtilizationRate,
                dieQty,
                cameraQty,
                cameraYieId,
                handQty,
                handBadQty,
                handYieId,
                handRemQty,
                handCompleteRate,
                dieRealUPH,
                achieveRate,
                utilizationRate,
                macAchieveRate,
                OEE,
                eighty,
                nine,
                ten,
                eleven,
                twelve,
                thirteen,
                fourteen,
                fifteen,
                sixteen,
                seventeen,
                eighteen,
                nineteen,
                camBadYieId,
              },
            ],
          },
        });
      },
    },
  });

  // 处理参数
  function handleParams(params) {
    if (params.pickerVal) {
      params.startDate = dayjs(params.pickerVal[0]).format('YYYY-MM-DD');
      params.endDate = dayjs(params.pickerVal[1]).format('YYYY-MM-DD');
      delete params.pickerVal;
    }
    params.factoryArea = state.value.factoryArea;
    return params;
  }

  const handlePreview = (filePath, fileName) => {
    // if (!hasBtnP('btn_detail')) return createMessage.warning('当前账号暂无查看权限');
    const params = {
      name: fileName,
      filePath: filePath,
      previewType: 'localPreview',
      version: 2,
    };
    filePreviewRef.value?.init(params);
  };

  // 批量导出
  const handleExport = async () => {
    const params = {
      ...(await getFetchParams()),
      ...(await getFromValue()),
    };
    params.factoryArea = state.value.factoryArea;
    if (params.pickerVal) {
      params.startDate = dayjs(params.pickerVal[0]).format('YYYY-MM-DD');
      params.endDate = dayjs(params.pickerVal[1]).format('YYYY-MM-DD');
    }
    delete params.pickerVal;

    const exportColumns = column.flatMap(item => {
      if (item.children) {
        return item.children;
      } else {
        return item;
      }
    });
    openExportModal(true, {
      listQuery: handleParams(params),
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
    });
  };
  const exportAction = query => {
    exportExcel(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };

  onMounted(() => {
    updateSchema([
      {
        fieldName: 'factoryArea',
        componentProps: {
          onChange: e => {
            state.value.factoryArea = e;
            nextTick(async () => {
              reload();
              const { data } = await getfloor({ factoryArea: e });
              updateSchema([
                {
                  fieldName: 'floor',
                  componentProps: {
                    options: data,
                  },
                },
              ]);
            });
          },
        },
      },
      {
        fieldName: 'floor',
        componentProps: {
          onChange: async e => {
            const { data } = await getmachine({ id: e, factoryArea: state.value.factoryArea });
            updateSchema([
              {
                fieldName: 'machineNo',
                componentProps: {
                  options: data,
                },
              },
            ]);
          },
        },
      },
    ]);
  });
</script>

<style lang="less" scoped>
  ::v-deep(.cell-red) {
    color: red;
  }

  ::v-deep(.cell-green) {
    color: green;
  }

  :deep(.vxe-table) {
    .vxe-foot-data-cell {
      font-weight: bold;
      color: #000;
      background-color: rgb(255 123 0 / 20%);
    }
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

  //:deep(.lydc-basic-table-action button i) {
  //  font-size: 20px;
  //}
</style>
