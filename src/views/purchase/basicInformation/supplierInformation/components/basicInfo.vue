<template>
  <Card style="border-radius: 8px; margin-bottom: 12px">
    <Subtitle :title="t('common.baseinfo')" style="padding-bottom: 0; margin-bottom: 16px" />
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
  </Card>
</template>
<script setup lang="ts">
  import { Subtitle } from '/@/components/Subtitle';
  import { BASICINFO_SCHEMAS } from './config';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { Card } from 'ant-design-vue';
  import { ref, reactive, onMounted, toRefs, unref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useUserStore } from '/@/store/modules/user';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  const emits = defineEmits(['onSupplierTypeChange']);
  const userStore = useUserStore();
  const { hasBtnP } = usePermission();
  interface State {
    organizeIdTree: any;
  }
  const state = reactive<State>({
    organizeIdTree: [],
  });
  const { organizeIdTree } = toRefs(state);

  const [registerForm, { updateSchema, setFieldsValue, getFieldsValue, setProps, validate, clearValidate }] = useForm({
    labelWidth: 220,
    baseColProps: { span: 6 },
    actionColOptions: { span: 24 },
    autoSubmitOnEnter: true,
    layout: 'vertical',
    // fieldMapToTime: [['checkDate', ['StartTime', 'EndTime']]],
    schemas: BASICINFO_SCHEMAS,
    i18nConfig: {
      moduleCode: 'SupplierColumn',
      transferRange: ['placeholder', 'label'],
    },
  });

  function onOrganizeChange(val) {
    setFieldsValue({ orgId: !val || !val.length ? '' : val[val.length - 1] });
    if (!val || !val.length) return;
    clearValidate('orgId');
  }

  function init({ tableData, openModel }) {
    if (openModel === 'view') {
      setProps({
        disabled: true,
      });
    }
    if (openModel === 'add') {
      tableData.creatorUserName = unref(userStore.getUserInfo).userName;
      tableData.orgId = unref(userStore.getUserInfo).organizeId;
      state.organizeIdTree = unref(userStore.getUserInfo).organizeIdList;
    }

    if (tableData?.organizeIdTree) {
      state.organizeIdTree = tableData.organizeIdTree.split(',');
    }
    setFieldsValue(tableData);
  }

  onMounted(() => {
    updateSchema({
      field: 'supplierType',
      componentProps: {
        onChange: value => {
          console.log(value, '999999999');
          emits('onSupplierTypeChange', value);
        },
      },
    });
  });

  async function getParamsFn() {
    const validateFlag = await validate();
    if (!validateFlag) return false;
    return getFieldsValue();
  }

  defineExpose({
    getParamsFn,
    init,
  });
</script>
