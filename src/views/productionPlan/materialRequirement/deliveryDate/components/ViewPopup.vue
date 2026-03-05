<template>
  <!-- :okText="t('common.submitText')" -->
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="true"
    :cancelButtonProps="{ class: 'mr-12px' }"
    :title="t('common.deliveryDate')"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup">
    <ScrollContainer class="p-10px">
      <Subtitle :title="t('common.baseinfo')"></Subtitle>
      <BasicForm @register="registerBaseInfoForm"></BasicForm>
      <Subtitle :title="t('common.metariaInfo')"></Subtitle>
      <SubTable ref="subTableRef"></SubTable>
    </ScrollContainer>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import { baseFormConfig } from '../config';
  import { BasicForm, useForm } from '/@/components/Form';
  import { getMcDetails, getBomDetail } from '/@/api/productionPlan/mainplan';
  import { reactive, defineAsyncComponent, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';

  const SubTable = defineAsyncComponent(() => import('./BomTable.vue'));

  const { t } = useI18n();

  const emits = defineEmits(['reload']);
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const state = reactive({
    base: {},
    quantitativePlanMaterials: [],
  });

  const [registerBaseInfoForm, { setFieldsValue: setBaseInfoFieldsValue }] = useForm({
    schemas: baseFormConfig,
    layout: 'vertical',
    labelWidth: 120,
    baseColProps: {
      span: 6,
    },
    i18nConfig: {
      moduleCode: 'QuantitativeDeliveryConfirmColumn',
      transferRange: ['label', 'placeholder'],
      excludeFields: ['process'],
    },
  });

  const subTableRef = ref();
  async function init(data) {
    changeLoading(true);
    try {
      const r = await getMcDetails(data.ids);
      if (r.code == 200) {
        state.base = r.data[0];
        setBaseInfoFieldsValue(r.data[0]);
      }
      subTableRef.value.init({
        detailApi: () => {
          return getBomDetail({
            id: data.ids[0],
          });
        },
      });
    } catch (error) {
      closePopup();
    }
    changeLoading(false);
  }

  async function handleSubmit() {
    closePopup();
  }
</script>
