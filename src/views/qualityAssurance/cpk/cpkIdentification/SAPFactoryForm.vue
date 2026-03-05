<template>
  <BasicModal
    :width="520"
    v-bind="$attrs"
    @register="registerModal"
    canFullscreen
    draggable
    :title="t('common.syncSAPWorkId')"
    showOkBtn
    @ok="handleSubmit"
    destroy-on-close>
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { reactive } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getSAPFactory, postSyncWorkOrder } from '/@/api/qualityAssurance/cpk';
  import { dateUtil } from '/@/utils/dateUtil';
  import { getSapFactoryList } from '/@/api/purchase/supplierInformation';
  import { getFactoryList } from '/@/api/business/shippingspace';
  import { useBaseStore } from '/@/store/modules/base';
  const { t } = useI18n();

  const emit = defineEmits(['reload', 'register']);
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  const [registerForm, { setFieldsValue, clearValidate, validate, resetFields, updateSchema, getFieldsValue, setProps }] = useForm({
    schemas: getSchemas(),
    labelWidth: 100,
  });

  const { createMessage } = useMessage();

  const state = reactive({
    data: {},
  });

  function init(data) {
    state.data = data;
    resetFields();
  }

  function getSchemas() {
    return [
      {
        field: 'factorys',
        label: t('common.factory'),
        component: 'ApiSelect',
        componentProps: {
          api: async () => await useBaseStore().getDictionaryData('CPKWoFactory'),
          // apiSearch: {
          //   show: true,
          //   searchName: 'keyword',
          // },
          mode: 'multiple',
          // resultField: 'data',
          labelField: 'fullName',
          valueField: 'enCode',
          nameFormat: ['enCode', '/', 'fullName'],
          immediate: true,
          notFoundContent: null,
        },
      },
      {
        field: 'actualReleaseDate',
        label: t('common.actualReleaseDate'),
        component: 'DateRange',
        componentProps: {
          placeholder: ['开始日期', '结束日期'],
        },
      },
    ];
  }
  async function handleSubmit() {
    const val = await validate();
    console.log('🚀 ~ handleSubmit ~ val: ', val);
    if (!val) return;
    if (!val.factorys || !val.actualReleaseDate) return createMessage.warn(t('common.selectText'));
    const params = {
      factorys: val.factorys,
      actualReleaseDate1: dateUtil(val.actualReleaseDate[0]).startOf('day').valueOf(),
      actualReleaseDate2: dateUtil(val.actualReleaseDate[1]).endOf('day').valueOf(),
    };
    changeOkLoading(true);
    params.ids = state.data.id;
    postSyncWorkOrder(params)
      .then(({ code, msg, data }) => {
        if (code === 200) {
          createMessage.success(t('dict.CPK.syncSAPTooltip', [data]));
          closeModal();
          emit('reload');
        }
      })
      .finally(() => {
        changeOkLoading(false);
      });
  }
</script>
