<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit" destroyOnClose>
    <BasicForm @register="registerForm">
      <!-- <template #OrgId>
          <lydcOrganizeCascader v-model:value="organizeIdTree" :showSearch="true" @change="onOrganizeChange" />
        </template> -->
    </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { computed, onMounted, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addProcessRoute, updateProcessRoute } from '/@/api/productionPlan/processRoute';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useOrganizeStore } from '/@/store/modules/organize';
  import { LydcOrganizeCascader } from '/@/components/Lydc';
  import { useBaseStore } from '/@/store/modules/base';
  import { addSchemas } from './config';
  import { createFlow, updateFlow } from '/@/api/coreCommon/flow';
  const { t } = useI18n();
  const baseStore = useBaseStore();
  const organizeIdTree = ref([]);
  interface State {
    dataForm: any;
    options: any[];
  }

  const state = reactive<State>({
    dataForm: {},
    options: [],
  });

  const organizeStore = useOrganizeStore();
  const getTitle = computed(() => (state.dataForm.id ? t('common.editText') : t('common.addText')));

  const emit = defineEmits(['register', 'reload', 'saveAndDesign']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields, clearValidate, updateSchema }] = useForm({
    labelWidth: 120,
    schemas: addSchemas,
    layout: 'vertical',
    // i18nConfig: {
    //   moduleCode: 'ProcessRouteColumn',
    // },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init({ data }: any = {}) {
    console.log(data, '输出当前行的数据22');
    resetFields();
    const { id } = data;
    updateSchema({
      field: 'code',
      componentProps: {
        disabled: !!id,
      },
    });
    updateSchema({
      field: 'moduleCode',
      componentProps: {
        disabled: !!id,
      },
    });

    state.dataForm.id = id;
    if (state.dataForm.id) {
      state.dataForm = data;
      setFieldsValue(data);
    }
  }

  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.id,
      organizeIdTree: organizeIdTree.value,
    };

    const formMethod = state.dataForm.id ? updateFlow : createFlow;
    const saveType = state.dataForm.id ? 'update' : 'add';
    formMethod(query)
      .then(({ msg, data }) => {
        organizeIdTree.value = [];
        createMessage.success(msg);
        changeOkLoading(false);
        organizeStore.resetState();
        closeModal();
        const id = saveType === 'add' ? data : '';
        if (state.dataForm.id) {
          emit('reload', id);
        } else {
          emit('saveAndDesign');
        }
      })
      .catch(() => {
        changeOkLoading(false);
      });
  }

  onMounted(async () => {});
</script>
