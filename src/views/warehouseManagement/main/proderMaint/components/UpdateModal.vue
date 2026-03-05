<template>
  <BasicModal
    v-bind="$attrs"
    :width="700"
    :showOkBtn="!disabled"
    :title="t('common.updateText')"
    destroyOnClose
    class="batch-modal"
    @register="registerModal"
    @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getFactoryList } from '/@/api/business/shippingspace';
  import { getProductionPersonnelDetail, updateProductionPersonnel } from '/@/api/warehouse/mainProder';

  const { createMessage } = useMessage();

  const { t } = useI18n();
  const emit = defineEmits(['reload']);

  const id = ref('');
  const disabled = ref(false);
  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);
  function init(data) {
    changeLoading(true);
    resetFields();
    id.value = data.id;
    getProductionPersonnelDetail(data.id)
      .then(res => {
        setFieldsValue(res.data);
        // 已审核不给修改
        if (res.data.statusEnum == 2) {
          setProps({
            disabled: true,
          });
          disabled.value = true;
        } else {
          disabled.value = false;
        }
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  const schemas: FormSchema[] = [
    {
      field: 'factory',
      i18nField: 'CommonCol.factory',
      label: '工厂',
      component: 'ApiSelect',
      required: true,
      componentProps: {
        api: getFactoryList,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'factoryCode',
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        nameFormat: ['Code', '/', 'Name'],
        filterOption: false,
      },
    },
    {
      field: 'swipeUserId',
      i18nField: 'swipeUserName',
      label: '制单员',
      component: 'CustomUserSelect',
      required: true,
    },
    {
      field: 'receiveMoldUserIds',
      i18nField: 'receiveMoldUserNames',
      label: '领料人',
      component: 'CustomUserSelect',
      componentProps: {
        multiple: true,
      },
      required: true,
    },
    {
      field: 'refundMoldUserIds',
      i18nField: 'refundMoldUserNames',
      label: '退料人',
      component: 'CustomUserSelect',
      componentProps: {
        multiple: true,
      },
      required: true,
    },
  ];
  const [registerForm, { setFieldsValue, validate, resetFields, setProps }] = useForm({
    layout: 'vertical',
    labelWidth: 400,
    schemas: schemas,
    i18nConfig: {
      moduleCode: 'ProductionPersonnelColumn',
      transferRange: ['label'],
    },
  });
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeLoading(true);
    const query = {
      ...values,
    };
    updateProductionPersonnel(id.value, query)
      .then(res => {
        createMessage.success(res.msg);
        changeLoading(false); //用于修改确认按钮的loading状态
        closeModal(); //关闭弹窗
        emit('reload');
      })
      .catch(() => {
        changeLoading(false);
      });
  }
</script>
