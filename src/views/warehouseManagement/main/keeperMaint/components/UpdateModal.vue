<template>
  <BasicModal
    v-bind="$attrs"
    :width="700"
    :title="t('common.updateText')"
    :showOkBtn="!disabled"
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
  import { getFactoryList } from '/@/api/business/quantitation';
  import { getShipList } from '/@/api/common/basedata';
  import { getWarehouseBaseDetail, updateWarehouseBase } from '/@/api/warehouse/main';
  import { getSapFactoryList } from '/@/api/purchase/supplierInformation';

  const { createMessage } = useMessage();

  const { t } = useI18n();
  const emit = defineEmits(['reload']);
  const disabled = ref(false);

  const id = ref('');
  const [registerModal, { closeModal, changeLoading }] = useModalInner(init);
  function init(data) {
    changeLoading(true);
    resetFields();
    id.value = data.id;
    getWarehouseBaseDetail(data.id)
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
      label: '工厂',
      i18nField: 'CommonCol.factory',
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
        onChange: () => setFieldsValue({ sapFactory: '', shippingSpaceCode: '' }),
      },
    },
    {
      field: 'sapFactory',
      label: 'SAP工厂代码',
      component: 'ApiSelect',
      required: true,
      componentProps: {
        api: (params: any) => getSapFactoryList({ ...params, factoryCode: getFieldsValue()?.['factory'] || '' }),
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        resultField: 'data',
        labelField: 'name',
        valueField: 'code',
        showSearch: true,
        filterOption: false,
        notFoundContent: null,
        nameFormat: ['code', '/', 'name'],
        alwaysLoad: true,
        immediate: true,
        onChange: () => setFieldsValue({ shippingSpaceCode: '' }),
      },
    },
    {
      field: 'shippingSpaceCode',
      label: '仓位',
      component: 'ApiSelect',
      required: true,
      componentProps: {
        api: (params: any) => {
          const formData = getFieldsValue() || {};
          return getShipList({ ...params, factoryCode: formData['factory'] || '', sapFactoryCode: formData['sapFactory'] || '' });
        },
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'shippingSpace',
        },
        resultField: 'data',
        labelField: 'shippingSpaceName',
        valueField: 'shippingSpaceCode',
        nameFormat: ['shippingSpaceCode', '/', 'shippingSpaceName'],
        filterOption: false,
        alwaysLoad: true,
        immediate: true,
      },
    },
    {
      label: '仓位地址',
      field: 'shippingAddress',
      component: 'Input',
      componentProps: {
        placeholder: '仓位地址',
      },
    },
    {
      field: 'warehouseKeeperIds',
      i18nField: 'warehouseKeeperNames',
      label: '仓管员',
      component: 'CustomUserSelect',
      componentProps: {
        multiple: true,
      },
      required: true,
    },
  ];
  const [registerForm, { setFieldsValue, validate, resetFields, setProps, getFieldsValue }] = useForm({
    layout: 'vertical',
    labelWidth: 400,
    schemas: schemas,
    i18nConfig: {
      moduleCode: 'WarehouseBaseColumn',
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
    updateWarehouseBase(id.value, query)
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
