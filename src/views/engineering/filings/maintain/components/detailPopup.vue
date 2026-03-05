<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="true"
    :okText="t('common.submitText')"
    :title="t('common.detailText')"
    destroyOnClose
    class="full-popup popup-top">
    <ScrollContainer class="p-10px">
      <div class="container-box" :class="{ 'half-container-item': isShowProduce }">
        <div class="container-item">
          <Subtitle :title="t('dict.FilingsApplyColumn.GcDataStatus1')">
            <template #afterTitle>
              <Select v-model:value="state.currentLangauge" :options="state.languageOptions" style="width: 160px" @change="handleLangeuageChange" />
            </template>
          </Subtitle>
          <BasicForm @register="registerApplyInfoForm">
            <template #shortMaterialCodes="{ model, field }">
              <MaterialNumberContent :list="model[field]" />
            </template>
            <template #singleMaterialNumbers="{ model, field }">
              <a-textarea disabled :value="Array.isArray(model[field]) ? model[field].join('、') : model[field]" />
            </template>
          </BasicForm>
        </div>
        <div v-if="isShowProduce" class="container-item produce-container">
          <ProduceDetailContainer ref="produceDetailContainerRef" />
        </div>
      </div>
    </ScrollContainer>
  </BasicPopup>
</template>

<script setup lang="ts">
  import { ref, nextTick } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getSchemas, converTableDataByLanguage } from './detailPopupConfig';
  import { getDetail } from '/@/api/engineering/customsAffairsEngineering';
  import { getDict, langList } from './ApplyPopConfig';

  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import { BasicForm, useForm } from '/@/components/Form';
  import { Select } from 'ant-design-vue';
  import ProduceDetailContainer from '/@/views/productionDeal/fillings/maintain/components/detailPopupContainer.vue';
  import MaterialNumberContent from './materialNumberContent.vue';

  const { t } = useI18n();

  const emits = defineEmits(['reload']);
  const [registerPopup, { changeLoading }] = usePopupInner(init);

  const state = ref<any>({
    id: '',
    currentLangauge: 1,
    languageOptions: [],
    originDataList: [],
    affairsProduceOutputs: [],
  });

  /** 是否展示`生产备案资料` */
  const isShowProduce = ref<boolean>(false);
  const produceDetailContainerRef = ref<InstanceType<typeof ProduceDetailContainer>>();

  const [registerApplyInfoForm, { setFieldsValue: setApplyInfoFieldsValue, updateSchema }] = useForm({
    schemas: getSchemas() as any,
    layout: 'vertical',
    labelWidth: 'unset',
    baseColProps: {
      span: 4,
    },
    disabled: true,
    i18nConfig: {
      moduleCode: 'CustomsAffairsEngineeringColumn',
      transferRange: ['label'],
    },
  });

  async function init(data: { id: string }) {
    updateSchema(getSchemas() as any);
    // 状态数据记录
    state.value.id = data?.id || '';

    nextTick(() => {
      getDetailData(data.id);
    });
  }

  async function getDetailData(id: string) {
    changeLoading(true);
    return getDetail(id)
      .then(async res => {
        await getDict();

        const { affairsEngineeringOutputs, translateEngineeringOutputs, affairsProduceOutputs } = res?.data || {};
        const data = [
          ...(affairsEngineeringOutputs || []),
          ...(translateEngineeringOutputs || []).map((item: any) => {
            item.isTranslate = true;
            return item;
          }),
        ].map((item: any) => {
          if (item.secrecyMaterialWeight === null || item.secrecyMaterialWeight === undefined || isNaN(item.secrecyMaterialWeight)) {
            item.secrecyMaterialWeight = '';
          } else {
            // 使用toFixed确保固定小数位显示，避免科学计数法
            item.secrecyMaterialWeight = Number(item.secrecyMaterialWeight).toFixed(7);
          }
          return item;
        });

        state.value.originDataList = data;
        state.value.languageOptions = data.map((item: any) => {
          const target = langList.find(el => `${el.enCode}` === `${item.filingsLanguage}`);
          return {
            label: target.fullName,
            value: item.filingsLanguage,
          };
        });
        state.value.currentLangauge = data[0].filingsLanguage;
        handleLangeuageChange(state.value.currentLangauge);

        isShowProduce.value = Array.isArray(affairsProduceOutputs) && affairsProduceOutputs.length > 0;
        isShowProduce.value &&
          nextTick(() => {
            updateSchema(getSchemas(true) as any);
            produceDetailContainerRef.value && produceDetailContainerRef.value.initData(affairsProduceOutputs?.[0] || {}, false, true);
          });
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  async function handleLangeuageChange(value: number) {
    const targetData = state.value.originDataList.find(item => item.filingsLanguage === value);
    const newData = await converTableDataByLanguage(targetData);
    setApplyInfoFieldsValue(newData);
  }
</script>

<style lang="less" scoped>
  .popup-top {
    top: 0;
  }

  :deep(div.vxe-grid--layout-body-wrapper) {
    padding-left: 0;
    padding-right: 0;
  }

  .container-box {
    display: flex;
    justify-content: space-between;

    .container-item {
      flex: 1;
    }
  }

  .half-container-item {
    .container-item {
      flex: 0 1 49%;
    }
  }

  .produce-container {
    :deep(.lydc-subtitle-container .title) {
      height: 32px;
    }
  }
</style>
