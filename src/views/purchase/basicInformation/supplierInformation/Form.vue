<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" :showOkBtn="hasBtnP('btn_edit')" @ok="handleSubmit" destroy-on-close>
    <BasicForm @register="registerForm">
      <template #orgId>
        <lydcOrganizeSelect
          :lastLevel="3"
          :disabled="!hasBtnP('btn_edit')"
          v-model:value="organizeIdTree"
          :placeholder="t('common.chooseText')"
          @change="onOrganizeChange" />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { computed, reactive, ref, unref, nextTick } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addBaseDataSupplier, editBaseDataSupplier } from '/@/api/purchase/supplierInformation';
  import { useBaseStore } from '/@/store/modules/base';
  import { toRefs } from '@vueuse/shared';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useUserStore } from '/@/store/modules/user';
  const { t } = useI18n();

  const userStore = useUserStore();
  const { hasBtnP } = usePermission();
  const { createMessage } = useMessage();
  const emit = defineEmits(['register', 'reload']);

  const [registerForm, { setFieldsValue, setProps, clearValidate, validate, resetFields, updateSchema }] = useForm({
    schemas: getSchemas(),
    layout: 'vertical',
    labelWidth: 320,
    i18nConfig: {
      moduleCode: 'SupplierColumn',
      transferRange: ['placeholder', 'label'],
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  interface State {
    organizeIdTree: number[];
  }
  const state = reactive<State>({
    organizeIdTree: [],
  });
  const { organizeIdTree } = toRefs(state);
  const baseStore = useBaseStore();
  const id = ref('');

  const userInfo = computed(() => {
    return userStore.getUserInfo || {};
  });

  async function init(data) {
    if (data.id) {
      setProps({
        disabled: !hasBtnP('btn_edit'),
      });
    } else {
      setProps({
        disabled: !hasBtnP('btn_add'),
      });
    }
    state.organizeIdTree = [];
    changeLoading(true);
    resetFields();
    getTypeOps();
    id.value = data.id;
    if (id.value) {
      setFieldsValue(data);
      console.log(data);
      state.organizeIdTree = data.organizeIdTree.split(',');
    } else {
      // 新增
      setFieldsValue({
        orgId: unref(userInfo).organizeId,
      });
      state.organizeIdTree = unref(userInfo).organizeIdList;
    }
    changeLoading(false);

    // if (id.value) {
    //   changeLoading(true);
    //   getInfo(id.value).then(res => {
    //     const data = res.data;
    //     state.dataForm = res.data;
    //     const propertyJson = data.propertyJson ? JSON.parse(data.propertyJson) : null;
    //     state.propertyJson = propertyJson || { iconBackgroundColor: '' };
    //     setFieldsValue(data);
    //     getSelfUrl(res.data.enCode);
    //     changeLoading(false);
    //   });
    // }
  }

  function getSchemas(): FormSchema[] {
    return [
      {
        field: 'sapCode',
        label: '供应商SAP代码',
        component: 'Input',
        componentProps: { placeholder: '请输入', maxlength: 50 },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'name',
        label: '供应商名称',
        component: 'Input',
        componentProps: { placeholder: '请输入', maxlength: 50 },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      // {
      //   field: 'code',
      //   label: '供应商编号',
      //   component: 'Input',
      //   componentProps: { placeholder: '请输入', maxlength: 50 },
      //   rules: [{ required: true, trigger: 'blur', message: '必填' }],
      // },
      {
        field: 'supplierType',
        label: '供应商类别',
        component: 'ApiSelect',
        componentProps: {
          api: async () => {
            return await baseStore.getDictionaryData('SupplierTypeEnum');
          },
          resultField: 'data',
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
        },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'shortName',
        label: '供应商简称',
        component: 'Input',
        componentProps: { placeholder: '请输入', maxlength: 50 },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'status',
        label: '是否启用',
        component: 'Select',
        defaultValue: '1',
        componentProps: { placeholder: t('common.chooseText'), maxlength: 50 },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'orgId',
        label: '组织名称',
        component: 'OrganizeSelect',
        slot: 'orgId',
        componentProps: { placeholder: t('common.chooseText'), maxlength: 50 },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'remark',
        label: '备注',
        component: 'Textarea',
        componentProps: { placeholder: '请输入', maxlength: 200 },
      },
    ];
  }

  const getTitle = computed(() => (unref(id) ? t('common.editText') : t('common.addText')));

  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: id.value,
    };
    const formMethod = id.value ? editBaseDataSupplier : addBaseDataSupplier;
    formMethod(query)
      .then(res => {
        createMessage.success(res.msg);
        changeOkLoading(false);
        closeModal();
        emit('reload');
      })
      .catch(() => {
        changeOkLoading(false);
      });
  }

  async function getTypeOps() {
    const list = await baseStore.getDictionaryData('Supplier.Status');
    updateSchema({
      field: 'status',
      componentProps: {
        options: list,
        fieldNames: { value: 'enCode' },
      },
    });
  }
  function onOrganizeChange(val) {
    setFieldsValue({ orgId: !val || !val.length ? '' : val[val.length - 1] });
    if (!val || !val.length) return;
    clearValidate('orgId');
  }
</script>
