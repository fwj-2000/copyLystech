<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="true"
    :okText="t('common.submitText')"
    :cancelButtonProps="{ class: 'mr-12px' }"
    :title="title"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup">
    <ScrollContainer class="p-10px">
      <Subtitle :title="t('common.baseinfo')"></Subtitle>
      <BasicForm @register="registerBaseInfoForm"></BasicForm>
      <Subtitle :title="t('common.process')"></Subtitle>
      <template v-if="state.base.productionType == 1">
        <BasicTable @register="registerSubTable" :dataSource="state.base.quantitativePlanProcesses"> </BasicTable>
      </template>
      <template v-else>
        <div class="p-10px">{{ t('common.noProcessTip') }}</div>
      </template>
    </ScrollContainer>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { reactive, toRefs, nextTick } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import { getSubColumns, baseFormConfig, setDynamicFields } from '../config';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { useTable } from '/@/components/Table';
  import { formatTableDefaultText } from '/@/utils';
  import { BasicForm, useForm } from '/@/components/Form';
  import { getDetails, getDcDetails } from '/@/api/productionPlan/deliveryPlan';
  import { useI18n } from '/@/hooks/web/useI18n';
  import dayjs from 'dayjs';

  const emits = defineEmits(['reload']);
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const { t } = useI18n();

  const state = reactive({
    planTyep: '1',
    base: { quantitativePlanMaterials: [] },
    title: '',
    dynamicPrefix: '',
  }) as any;

  const [registerBaseInfoForm, { setFieldsValue: setBaseInfoFieldsValue, setProps }] = useForm({
    schemas: baseFormConfig,
    layout: 'vertical',
    labelWidth: 220,
    baseColProps: {
      span: 6,
    },
    i18nConfig: {
      moduleCode: 'QuantitativeDeliveryConfirmColumn',
      transferRange: ['placeholder', 'label'],
    },
  });
  const [registerSubTable] = useTable({
    columns: getSubColumns(),
    useSearchForm: false,
    immediate: false,
    striped: true,
    ellipsis: true,
    showTableSetting: false,
    canResize: true,
    resizeHeightOffset: 20,
    pagination: false,
    showIndexColumn: false,
    transformCellText: ({ text }) => formatTableDefaultText(text),
    i18nConfig: {
      moduleCode: 'EngineeringInformationColumn',
    },
  });

  const { title } = toRefs(state);
  async function init(data) {
    state.title = data?.title || t('common.detailText');
    changeLoading(true);
    // 获取动态值
    let titles: any = [];
    // 获取详情
    try {
      const r = await (data?.planType == '1' ? getDcDetails(data?.ids) : getDetails(data.ids));
      if (r.code == 200) {
        const _d = r.data[0];
        state.base = _d;
        if (_d.deliveryPlanList) {
          _d.deliveryPlanList.forEach(item => {
            const time = dayjs(item.deliveryPlanTime).format('YYYY/MM/DD');
            _d[time] = item.deliveryPlanQty || '';
            // 交货计划只显示有值的日期数据
            if (item.deliveryPlanQty) {
              titles.push({
                deliveryPlanTime: item.deliveryPlanTime,
              });
            }
          });
        }
        const configForms = setDynamicFields(titles, {
          planType: data.planType,
          dynamicPrefix: state.dynamicPrefix,
        });
        setProps({
          schemas: configForms,
          disabled: true,
        });
        nextTick(() => {
          setBaseInfoFieldsValue(_d);
        });
      }
    } catch (error) {
      console.log(error);
      closePopup();
    }
    changeLoading(false);
  }

  async function handleSubmit() {
    closePopup();
  }
</script>
<style lang="less" scoped>
  .table-a {
    color: #1890ff;
    cursor: pointer;
    margin-bottom: 10px;
  }
</style>
