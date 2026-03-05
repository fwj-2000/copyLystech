<template>
  <BasicPopup v-bind="$attrs" @register="registerPopup" :showOkBtn="false" :showCancelBtn="false" :title="title" destroyOnClose class="full-popup">
    <template #insertToolbar>
      <a-divider type="vertical"></a-divider>
    </template>
    <template #centerToolbar>
      <a-button type="primary" :loading="confirmLoading" class="mr-10px" @click="handleSubmit">
        {{ t('common.submit') }}
      </a-button>
    </template>
    <ScrollContainer class="p-10px" v-loading="confirmLoading">
      <Subtitle :title="t('common.baseinfo')"></Subtitle>
      <BasicForm @register="registerBaseInfoForm" @field-value-change="handleValueChange" />
    </ScrollContainer>
  </BasicPopup>
</template>

<script setup lang="ts">
  import { reactive, toRefs, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import { baseFormConfig } from '../config';
  import { BasicForm, useForm } from '/@/components/Form';
  import { updateInfo, getDetails } from '/@/api/business/material';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';

  const emits = defineEmits(['reload']);
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { createMessage } = useMessage();

  const { t } = useI18n();

  const state = reactive({
    title: '',
    base: {},
  }) as any;

  const specFields = ['MaterialLength', 'MaterialWidth', 'TotalThickness'];
  async function handleValueChange(field: string) {
    // 自动计算设置`材料规格`的值
    if (specFields.includes(field)) {
      const { MaterialWidth, MaterialLength, TotalThickness } = getFieldBase();
      setBaseInfoFieldsValue({
        MaterialSpec: `${+MaterialWidth || 0}MM*${+MaterialLength || 0}M*${+TotalThickness || 0}${state.base?.ThicknessUnit || ''}`,
      });
    }
  }

  const [registerBaseInfoForm, { getFieldsValue: getFieldBase, setFieldsValue: setBaseInfoFieldsValue }] = useForm({
    schemas: baseFormConfig,
    layout: 'vertical',
    labelWidth: '100%',
    baseColProps: {
      span: 6,
    },
    i18nConfig: {
      moduleCode: 'MaterialWarehouseColumn',
    },
  });

  const { title } = toRefs(state);

  async function init(data: any) {
    state.title = data?.title || t('common.detailText');
    state.ids = data.ids;
    state.id = data.ids[0];
    state.base = {};
    changeLoading(true);
    try {
      const r = await getDetails([state.id]);
      if (r.code == 200) {
        const _d = r.data[0];
        state.base = _d;
        setBaseInfoFieldsValue(_d);
      }
    } catch (error) {
      console.log(error);
      closePopup();
    }
    changeLoading(false);
  }

  const confirmLoading = ref<boolean>(false);
  async function handleSubmit() {
    confirmLoading.value = true;
    return updateInfo({
      Id: state.id,
      ...getFieldBase(),
    })
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        closePopup();
      })
      .finally(() => {
        confirmLoading.value = false;
      });
  }
</script>
