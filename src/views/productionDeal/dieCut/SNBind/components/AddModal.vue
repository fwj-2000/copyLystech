<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('dict.CommonCol.scanQRCode')"
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
      <!-- <div :class="['form-block-right', tableLength === SNLength ? 'block-green' : 'block-orange']">{{ tableLength }} / {{ SNLength }}</div> -->
      <div class="form-block-right">
        <span class="form-block-right-label">{{ t('dict.CommonCol.SNNumber') }}：</span>
        <div class="form-block-right-number">
          <span :class="[tableLength === SNLength ? 'block-green' : 'block-orange']">{{ tableLength }}</span> / <span>{{ SNLength }}</span>
        </div>
      </div>
    </div>

    <Grid>
      <template #action="{ row }">
        <TableAction outside :actions="getActions(row)" />
      </template>
    </Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { TableAction } from '/@/components/Table';
  import { checktemplabel, getsninfo, addDispatchcode, getDispatchcodeDetail, getsnbindqty } from '/@/api/productionDeal/SNBind';
  import { message } from 'ant-design-vue';

  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const documentNumber = ref(''); // 热压标签
  const snCode = ref(''); // SN
  const isDetail = ref(false);
  const SNLength = ref(0);
  const tableLength = ref(0);

  const columns = [
    {
      title: 'SN',
      field: 'snCode',
    },
    {
      title: '产品编码',
      field: 'productCode',
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 60,
      fixed: 'right',
    },
  ];

  const [registerModal, { closeModal, changeOkLoading, changeLoading }] = useModalInner(init);

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionDeal-dieCut-SNBind-SNlist',
      columns,
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

  function getActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('common.delText'),
        disabled: isDetail.value,
        onClick: handleDelete.bind(null, row),
      },
    ];
  }

  const handleDelete = row => {
    gridApi.grid.remove(row);
    tableLength.value--;
  };

  // 热压标签扫描，校验热压标签
  const templabelInputKeydown = async (e: any) => {
    if (e.keyCode !== 13) return;
    changeLoading(true);
    checktemplabel({ documentNumber: documentNumber.value })
      .then(() => {
        document.getElementsByClassName('sn-input')[0]?.querySelector('input')?.focus();
      })
      .catch(() => {
        // 扫描失败清空热压标签
        documentNumber.value = '';
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
    // SN最多扫描数量
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
    const { data } = await getsninfo({ documentNumber: documentNumber.value, snCode: snCode.value }).finally(() => {
      // 清空SN
      snCode.value = '';
      changeLoading(false);
    });
    tableLength.value++;
    gridApi.grid.loadData([data, ...tableList]);
  };

  const resetData = () => {
    isDetail.value = false;
    documentNumber.value = '';
    snCode.value = '';
    tableLength.value = 0;
  };

  async function init(data) {
    resetData();
    const id = data && data.id;
    nextTick(() => {
      document.getElementsByClassName('hot-input')[0]?.querySelector('input')?.focus();
    });
    const res = await getsnbindqty();
    SNLength.value = res.data.snBindQty;
    if (id) {
      isDetail.value = true;
      const { data } = await getDispatchcodeDetail(id);
      gridApi.loadData([data]);
    }
  }

  //提交
  async function handleSubmit() {
    const detailList = gridApi.getDataSource();
    if (!detailList.length) return createMessage.error(t('dict.CommonCol.scanLabelTip'));
    if (detailList.length < SNLength.value) return createMessage.error(t('dict.CommonCol.SNMinLengthTip'));
    changeOkLoading(true);
    const res = await addDispatchcode({ documentNumber: documentNumber.value, detailList }).finally(() => {
      changeOkLoading(false);
    });
    createMessage.success(res.msg);
    changeOkLoading(false); //用于修改确认按钮的loading状态
    // closeModal(); //关闭弹窗
    emit('reload', res.data);
    gridApi.grid.loadData([]);
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
