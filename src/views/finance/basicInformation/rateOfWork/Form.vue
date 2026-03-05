<!--
 * @Author: wen zhenjin wen.zhen.jin@lingyiitech.com
 * @Date: 2024-07-26 10:42:47
 * @LastEditors: wen zhenjin wen.zhen.jin@lingyiitech.com
 * @LastEditTime: 2024-09-11 11:04:33
 * @FilePath: \lydc.server.web\src\views\finance\basicInformation\rateOfWork\Form.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit" destroy-on-close>
    <BasicForm @register="registerForm">
      <template #orgId>
        <lydcOrganizeSelect v-model:value="organizeIdTree" placeholder="请选择" @change="onOrganizeChange" />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { computed, ref, unref, reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addBaseDataSupplier, editBaseDataSupplier } from '/@/api/purchase/supplierInformation';
  import { useBaseStore } from '/@/store/modules/base';
  import { toRefs } from '@vueuse/shared';

  const { createMessage } = useMessage();
  const emit = defineEmits(['register', 'reload']);

  const [registerForm, { setFieldsValue, clearValidate, validate, resetFields, updateSchema }] = useForm({
    schemas: getSchemas(),
    layout: 'vertical',
    labelWidth: 320,
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
  const { t } = useI18n();
  const id = ref('');

  async function init(data) {
    state.organizeIdTree = [];
    changeLoading(true);
    resetFields();
    getTypeOps();
    id.value = data.id;
    // state.dataForm.workLogoIcon = undefined;
    // state.selfUrl = '';
    if (id.value) {
      setFieldsValue(data);
      console.log(data);
      state.organizeIdTree = data.organizeIdTree.split(',');
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
        field: 'code',
        label: '供应商编号',
        component: 'Input',
        componentProps: { placeholder: '请输入', maxlength: 50 },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'orgId',
        label: '组织名称',
        component: 'OrganizeSelect',
        slot: 'orgId',
        componentProps: { placeholder: '请选择', maxlength: 50 },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'name',
        label: '供应商名称',
        component: 'Input',
        componentProps: { placeholder: '请输入', maxlength: 50 },
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
        componentProps: { placeholder: '请选择', maxlength: 50 },
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

  const getTitle = computed(() => (!unref(id) ? t('common.addText') : t('common.editText')));

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
