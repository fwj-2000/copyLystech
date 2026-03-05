<template>
  <div class="template-box" :class="{ 'cursor-pointer': type === 'view' }">
    <BasicForm @register="registerForm" />
    <div class="button-list">
      <template v-if="type === 'edit'">
        <!-- 保存 -->
        <a-button type="primary" ghost class="w-full" :loading="saveLoading" @click="save">
          {{ t('common.saveText') }}
        </a-button>
        <!-- 取消 -->
        <a-button class="w-full" @click="cancel">{{ t('common.cancelText') }}</a-button>
      </template>
      <!-- <template v-else> -->
      <!-- 编辑 -->
      <!-- <a-button type="primary" ghost class="w-full" @click="edit">{{ t('common.editText') }}</a-button> -->
      <!-- 删除 -->
      <!-- <a-button danger ghost class="w-full" :loading="delLoading" @click="del">{{ t('common.delText') }}</a-button> -->
      <!-- </template> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, ref, watch } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { addCustomsAffairsMoldeRelativeCustomsMolde /** deleteCustomsAffairsMoldeRelativeCustomsMolde */ } from '/@/api/logisticAffairs/customsAffairsMake';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { /** cloneDeep, */ omit } from 'lodash-es';

  import { BasicForm, useForm } from '/@/components/Form';

  const props = defineProps({
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  });

  const { t } = useI18n();

  const { createMessage /** createConfirm */ } = useMessage();

  const emits = defineEmits(['remove', 'add', 'edit']);

  const type = ref<'edit' | 'view'>('view');
  function setType(value: 'edit' | 'view') {
    type.value = value;
    const isCanEdit = value === 'edit';
    updateSchema({ field: 'moldeName', componentProps: { disabled: !isCanEdit } });
    updateSchema({ field: 'moldeCode', componentProps: { disabled: !isCanEdit } });
  }

  //表单
  const [registerForm, { validate, setFieldsValue, updateSchema, clearValidate }] = useForm({
    labelWidth: '100%',
    layout: 'vertical',
    autoSubmitOnEnter: false,
    schemas: [
      // 客户模板名称
      {
        field: 'moldeName',
        component: 'Input',
        label: t('dict.CustomsAffairsMoldeRelative.moldeName'),
        componentProps: {
          disabled: true,
          onClick: e => {
            e.stopPropagation();
          },
        },
        rules: [{ required: true, trigger: 'blur', message: t('common.required') }],
      },
      // 客户模板编码
      {
        field: 'moldeCode',
        component: 'Input',
        componentProps: {
          disabled: true,
          placeHolder: t('component.lydc.common.autoGenerate'),
          onClick: e => {
            e.stopPropagation();
          },
        },
        label: t('dict.CustomsAffairsMoldeRelative.moldeCode'),
      },
    ],
  });

  const formData = ref<any>({});
  async function setFormData(data: any) {
    formData.value = data;
    await nextTick();
    setFieldsValue(data);
    clearValidate();
    if (!data.id) {
      setType('edit');
    }
  }
  watch(
    () => props.data,
    () => {
      setFormData(props.data);
    },
    { immediate: true, deep: true },
  );

  const saveLoading = ref<boolean>(false);
  function save(e: MouseEvent) {
    e.stopPropagation();

    saveLoading.value = true;
    validate()
      .then(res => {
        const data = omit(res, ['_id', 'type']);
        return Object.keys(data).length > 0 ? addCustomsAffairsMoldeRelativeCustomsMolde([data as any]) : Promise.reject();
      })
      .then(res => {
        createMessage.success(t('sys.api.operationSuccess'));
        const item = res?.data?.[0] || {};
        emits('add', Object.assign(formData.value, { ...item, id: item.Id || item.id }));
        setType('view');
      })
      .finally(() => {
        saveLoading.value = false;
      });
  }

  function cancel(e: MouseEvent) {
    e.stopPropagation();

    setType('view');
    if (formData.value.id) {
      setFieldsValue(formData.value);
    } else {
      emits('remove');
    }
  }

  // function edit(e: MouseEvent) {
  //   e.stopPropagation();

  //   setType('edit');
  //   setFieldsValue(formData.value);
  // }

  // const delLoading = ref<boolean>(false);
  // function del(e: MouseEvent) {
  //   e.stopPropagation();

  //   if (!formData.value.id) {
  //     return Promise.reject();
  //   }
  //   createConfirm({
  //     iconType: 'warning',
  //     title: t('common.tipTitle'),
  //     content: t('common.sureToDeleteText'),
  //     onOk: async () => {
  //       delLoading.value = true;
  //       await deleteCustomsAffairsMoldeRelativeCustomsMolde(formData.value.id)
  //         .then(() => {
  //           emits('remove');
  //           createMessage.success(t('sys.api.operationSuccess'));
  //         })
  //         .catch(() => {})
  //         .finally(() => {
  //           delLoading.value = false;
  //         });
  //       return Promise.resolve();
  //     },
  //   });
  // }
</script>

<style scoped lang="less">
  .template-box {
    border: 1px solid rgb(219 219 219);
    border-radius: 5px;
    width: 100%;
    padding: 8px;
    margin-top: 8px;
  }

  .button-list {
    display: flex;
    justify-content: space-between;

    > * {
      width: 48%;
    }
  }
</style>
