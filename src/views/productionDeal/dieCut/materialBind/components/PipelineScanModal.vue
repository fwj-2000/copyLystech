<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('dict.CommonCol.firstLineScan')"
    :showOkBtn="!isDetail"
    @ok="handleSubmit"
    width="700px"
    destroy-on-close>
    <div class="form-block">
      <div class="form-block-left">
        <div class="form-search-block">
          <div class="form-label">{{ t('dict.CommonCol.hotPressedLabel') }}：</div>
          <div class="w-2/3">
            <LydcInput
              class="hot-input"
              :disabled="isDetail"
              :suffixIcon="'icon-ym icon-ym-scanCode'"
              v-model:value="documentNumber"
              :placeholder="t('dict.CommonCol.scanLabel')"
              @Keydown="templabelInputKeydown" />
          </div>
        </div>
        <div class="form-search-block">
          <div class="form-label">{{ t('dict.CuttingSnColumn.productCode') }}：</div>
          <div class="w-2/3">
            <LydcInput class="hot-input" disabled="true" v-model:value="insidePartNumber" :placeholder="t('dict.CuttingSnColumn.productCode')" />
          </div>
        </div>
        <div class="form-search-block">
          <div class="form-label">SN：</div>
          <div class="w-2/3">
            <LydcInput
              class="sn-input"
              :suffixIcon="'icon-ym icon-ym-scanCode'"
              :disabled="isDetail"
              v-model:value="snCode"
              :placeholder="t('dict.CommonCol.scanLabel')"
              @Keydown="SNInputKeydown" />
          </div>
        </div>
      </div>
      <div class="form-block-right">
        <span class="form-block-right-label">{{ t('dict.CommonCol.SNNumber') }}：</span>
        <div class="form-block-right-number">
          <span :class="[tableLength === SNLength ? 'block-green' : 'block-orange']">{{ tableLength }}</span> / <span>{{ SNLength }}</span>
        </div>
      </div>
    </div>

    <Grid> </Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getsninfo, getStackmaterialDetail, getStackmaterial, onesncreate } from '/@/api/productionDeal/materialBind';
  import { getInfoById } from '/@/api/productionDeal/materialNumInfo';
  import { cloneDeep } from 'lodash-es';
  import { message } from 'ant-design-vue';

  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const documentNumber = ref(''); // 热压标签
  const snCode = ref(''); // SN
  const isDetail = ref(false);
  const SNLength = ref(0);
  const tableLength = ref(0);
  const insidePartNumber = ref(''); // 内部料号
  const columns = [
    {
      title: '层数',
      field: 'layers',
      width: 60,
    },
    {
      title: 'SN',
      field: 'snCode',
    },
    {
      title: '产品编码',
      field: 'productCode',
    },
  ];

  const [registerModal, { changeOkLoading, changeLoading }] = useModalInner(init);

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionDeal-dieCut-materialBind-pipelineScanSNlist',
      columns,
      showIndexColumn: true,
      height: 300,
      pagerConfig: {
        autoHidden: true,
      },
      toolbarConfig: {
        enabled: false,
      },
      i18nConfig: {
        moduleCode: 'StackMaterialColumn',
      },
    },
  });

  const detailData = ref<any>({});
  // 热压标签扫描，校验热压标签
  // getStackmaterial
  const templabelInputKeydown = async (e: any) => {
    if (e.keyCode !== 13) return;
    changeLoading(true);
    const { data } = await getStackmaterial({ documentNumber: documentNumber.value });
    const list = data.list;
    gridApi.grid.loadData(list);
    tableLength.value = list.length;
    document.getElementsByClassName('sn-input')[0]?.querySelector('input')?.focus();
    getInfoById({ documentNumber: documentNumber.value })
      .then(res => {
        insidePartNumber.value = res.data.innerMaterialNumber;
        SNLength.value = res.data.sNQuantity;
      })
      .finally(() => {
        changeLoading(false);
      });
  };

  const SNInputKeydown = async (e: any) => {
    if (e.keyCode !== 13) return;
    // 校验热压标签
    if (!documentNumber.value) {
      snCode.value = '';
      message.error(t('dict.CommonCol.scanHotLabelTip'));
      return;
    }
    const tableList = gridApi.getDataSource();
    // SN最多扫描9个
    if (tableList.length >= SNLength.value) {
      snCode.value = '';
      message.error(t('dict.CommonCol.SNMaxLengthTip'));
      return;
    }
    // SN不能重复扫描
    if (tableList.some(item => item.snCode === snCode.value)) {
      snCode.value = '';
      message.error(t('dict.CommonCol.repeatedlyScanSameSNTip'));
      return;
    }
    changeLoading(true);
    const { data } = await getsninfo({ documentNumber: documentNumber.value, snCode: snCode.value })
      .catch(() => {
        // 清空SN;
        snCode.value = '';
      })
      .finally(() => {
        changeLoading(false);
      });
    detailData.value = cloneDeep(data);
    // SN码的层次只能从1-9，有且只有9个
    if (Number(data.layers) !== tableList.length + 1) {
      snCode.value = '';
      // message.error(`当前SN的层数${data.layers}有误，需扫描层数${tableList.length + 1}`);
      message.error(t('dict.CommonCol.currentSNIncorrectTip', [data.layers, tableList.length + 1]));
      return;
    }
    tableLength.value++;
    await gridApi.grid.loadData([data, ...tableList]);
    handleSubmit();
  };

  const resetData = () => {
    isDetail.value = false;
    documentNumber.value = '';
    snCode.value = '';
    tableLength.value = 0;
  };

  async function init(data) {
    insidePartNumber.value = '';
    SNLength.value = 0;
    resetData();
    const id = data && data.id;
    nextTick(() => {
      document.getElementsByClassName('hot-input')[0]?.querySelector('input')?.focus();
    });
    if (id) {
      isDetail.value = true;
      const { data } = await getStackmaterialDetail(id);
      gridApi.loadData([data]);
    }
  }

  //提交
  async function handleSubmit() {
    if (!documentNumber.value) return createMessage.error(t('dict.CommonCol.scanHotLabelTip'));
    if (!snCode.value) return createMessage.error(t('dict.CommonCol.scanLabelTip'));
    changeOkLoading(true);
    const res = await onesncreate({ ...detailData.value, documentNumber: documentNumber.value, snCode: snCode.value }).finally(() => {
      changeOkLoading(false);
    });
    createMessage.success(res.msg);
    changeOkLoading(false); //用于修改确认按钮的loading状态
    emit('reload');
    gridApi.grid.loadData([]);
    insidePartNumber.value = '';
    SNLength.value = 0;
    resetData();
    document.getElementsByClassName('hot-input')[0]?.querySelector('input')?.focus();
  }
</script>

<style lang="less" scoped>
  .form-block {
    display: flex;

    .form-block-left {
      flex: 1;

      .form-search-block {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        .form-label {
          width: 80px;
          text-align: right;
        }

        :deep(.icon-ym-scanCode) {
          color: #ff7b00 !important;
        }
      }
    }

    .form-block-right {
      margin: 20px 20px 0 0;
      height: fit-content;
      display: flex;
      align-items: center;
      font-size: 16px;

      .form-block-right-label {
        color: #1a1a1a;
      }

      .form-block-right-number {
        color: #1a1a1a;
        padding: 4px 12px;
        border-radius: 4px;
        border: 1px solid #f0f0f0;
        background: #dbdbdb;

        .block-green {
          color: #00b42a;
        }

        .block-orange {
          color: #ff7b00;
        }
      }
    }
  }
</style>
