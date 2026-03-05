<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.submit')"
    :title="t('dict.PCCApplyColumn.generate')"
    @ok="() => handleSave(true)"
    class="full-popup">
    <template #centerToolbar>
      <a-button :loading="state.loading" @click="handleSave(false)" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template>
    <div class="h-full requirement-pop p-10px">
      <div class="lydc-content-wrapper-search-box pt-8px mb-16px">
        <Subtitle :title="t('common.baseinfo')" />
        <BasicForm @register="registerForm" />
      </div>
      <!-- 模具领用信息 -->
      <div v-show="showTable" class="flex-1">
        <Grid>
          <template #toolbar-actions>
            <Subtitle :title="t('common.moIdUseInfo')" placement="vxe"></Subtitle>
          </template>
          <template #remainPer="{ row }">
            <div class="remain-tag" :class="calculatePercentageStyle(row)">{{ calculateRemainingLifePercentage(row) }}</div>
          </template>
        </Grid>
      </div>
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { pick } from 'lodash-es';
  import { dateUtil } from '/@/utils/dateUtil';
  import { getDetail, generateMoid, generateTempStorage } from '/@/api/productionDeal/moIdUse';
  import { useUserStore } from '/@/store/modules/user';
  import { generateColumn, generateSchema, calculateRemainingLifePercentage, calculatePercentageStyle } from './config';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicForm, useForm } from '/@/components/Form';
  import { reactive, ref } from 'vue';

  const emits = defineEmits(['register', 'reload']);

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const showTable = ref(false);

  const [registerForm, { updateSchema, validate, getFieldsValue, setFieldsValue, setProps }] = useForm({
    baseColProps: { span: 4 },
    labelWidth: '200',
    layout: 'vertical',
    // i18nConfig: {
    //   moduleCode: 'QuantitativeApplyColumn',
    //   transferRange: ['label', 'placeholder'],
    // },
    schemas: generateSchema,
  });

  const gridOptions: VxeGridProps = {
    id: 'productionDeal-mouldBusiness-use-generate',
    columns: generateColumn,
    showIndexColumn: true,
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    proxyConfig: {
      enabled: false,
    },
    clipConfig: {
      isPaste: true,
    },
    pagerConfig: {
      enabled: false,
    },
    i18nConfig: {
      moduleCode: 'MoldReceiveRefundColumn',
    },
    position: 'modal',
    toolbarConfig: {
      refresh: false,
      zoom: true,
    },
    customConfig: {
      allowVisible: false,
    },
  };
  const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  const userStore = useUserStore();
  const state = reactive({
    applyNo: '',
    loading: false,
  });
  async function init(data) {
    setFieldsValue({
      applyUserName: userStore.getUserInfo.userName,
      applyDate: dateUtil(new Date()).format('YYYY-MM-DD'),
    });
    changeLoading(true);
    showTable.value = false;
    const params = data.applyNo ? [data.applyNo] : data.ids;
    getDetail(params)
      .then(res => {
        const { outputs } = res.data;
        const resData = (outputs || []).map((item: any) => {
          return {
            ...item,
          };
        });
        setFieldsValue(res.data);
        state.applyNo = res.data.moldReceiveApplyNo;
        gridApi.grid.reloadData(resData);
        setTimeout(() => {
          changeLoading(false);
          showTable.value = true;
        }, 300);
      })
      .catch(() => {
        closePopup();
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  async function handleSave(isSubmit = false) {
    if (isSubmit && (await gridApi.grid.validate(true))) {
      return createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
    }
    const { receiveMoldUserIds, affairsType } = getFieldsValue();
    const params = {
      moldReceiveApplyCrInputs: gridApi.grid
        .getFullData()
        .map(item => pick(item, ['id', 'moldNumber', 'outShippingSpaceCode', 'callShippingSpaceCode', 'temporaryOrder', 'remark', 'workshopLocation'])),
      receiveMoldUserIds,
      affairsType,
      applyNo: state.applyNo,
    };
    changeOkLoading(true);
    state.loading = true;
    const method = isSubmit ? generateMoid : generateTempStorage;
    method(params)
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        closePopup();
      })
      .catch(() => {})
      .finally(() => {
        emits('reload');
        changeOkLoading(false);
        state.loading = false;
      });
  }
</script>

<style lang="less" scoped>
  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .requirement-pop {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }

  :deep(.border-right) {
    border-right: 1px solid rgb(228 228 231);
  }

  .remain-tag {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    padding: 2px;

    &.red {
      background-color: rgb(255 77 79 / 20%);
      color: #ff4d4f;
    }

    &.yellow {
      background-color: rgb(255 123 0 / 20%);
      color: #faad14;
    }
  }
</style>
