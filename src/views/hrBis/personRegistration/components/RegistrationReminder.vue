<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit" :okText="t('dict.PrOrderFlowNode.apply')">
    <BasicForm style="height: 100px" @register="registerForm"> </BasicForm>

    <div class="w-full h-[150px] ov mt-4">
      <div class="mb-[10px]">{{ t('common.viewHistoryText') }}：</div>
      <template v-if="savedTags.length > 0">
        <div @click="clickTag(savedTags)" class="bg-[#f1f1f1] p-[10px] rounded-md cursor-pointer flex flex-wrap gap-2 justify-start">
          <a-tag v-for="(item, index) in savedTags" :key="index" closable @close="removeTag(index)">
            {{ item.fullName }}
          </a-tag>
        </div>
      </template>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { sendMessage } from '/@/api/hr/personRegistration';

  const { t } = useI18n();
  const state = ref<any>({});
  const selectItems = ref<any[]>([]);
  const savedTags = ref<any[]>([]); // 历史tag数据

  // 表单 schema
  const schemas: FormSchema[] = [
    {
      field: 'pdUserId',
      label: t('dict.CommonCol.ReminderPeople'),
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: t('dict.CommonCol.ReminderPeople'),
        multiple: true,
        onChange: (value, items) => {
          selectItems.value = items;
        },
      },
    },
  ];

  const getTitle = t('dict.CommonCol.Registration');
  const emit = defineEmits(['register', 'reload', 'submit']);
  const { createMessage } = useMessage();

  const [registerForm, { setFieldsValue, validate }] = useForm({
    labelWidth: 80,
    layout: 'vertical',
    schemas,
  });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  // 初始化
  function init(data) {
    state.value = data.record;
    const saved = localStorage.getItem('selectItems');
    if (saved) {
      try {
        savedTags.value = JSON.parse(saved);
      } catch (e) {
        console.error('解析本地存储失败', e);
      }
    }
  }

  function removeTag(index: number) {
    savedTags.value.splice(index, 1);
    localStorage.setItem('selectItems', JSON.stringify(savedTags.value));
  }

  function clickTag(item: any) {
    const ids = savedTags.value.map(tag => tag.id);
    selectItems.value = savedTags.value;
    setFieldsValue({ pdUserId: ids });
  }

  // 提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    savedTags.value = selectItems.value;
    localStorage.setItem('selectItems', JSON.stringify(savedTags.value));
    sendMessage(values.pdUserId).then(({ msg }) => {
      changeOkLoading(false);
      closeModal();
      createMessage.success(msg);
      emit('submit', values, state);
      emit('reload');
      setFieldsValue({ pdUserId: '' });
      selectItems.value = [];
    });
  }
</script>
