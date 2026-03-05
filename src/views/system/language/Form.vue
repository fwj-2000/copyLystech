<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit" :width="800">
    <a-form :colon="false" :labelCol="{ style: { width: '120px' } }" :model="dataForm" :rules="formRules" ref="formElRef">
      <a-form-item :label="t('dict.TranslateType')" name="type">
        <a-select v-model:value="dataForm.type" placeholder="请选择">
          <a-select-option v-for="option in typeOptions" :value="option.enCode">
            {{ option.fullName }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="t('label.TranslationTag')" name="enCode">
        <lydc-input v-model:value="dataForm.enCode" :placeholder="t('common.enterKeyword')" />
      </a-form-item>
      <a-form-item :label="item.fullName" :name="item.enCode" v-for="item in categoryList">
        <lydc-textarea
          v-model:value="dataForm[item.enCode]"
          :autoSize="{ minRows: 1 }"
          show-count
          :maxlength="500"
          :placeholder="t('sys.lang.enterKeyword')"
          @focus="handleTextareaFocus(item.enCode)" />
      </a-form-item>
    </a-form>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { onUnmounted, onMounted } from 'vue';
  import { create, update, getInfo, realTimeTranslate } from '/@/api/system/baseLang';
  import { computed, reactive, ref, toRefs } from 'vue';
  import type { FormInstance } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  interface State {
    dataForm: any;
    formRules: any;
    categoryList: any[];
    typeOptions: any[];
  }

  const defaultForm = {
    id: '',
    type: 0,
    enCode: '',
    map: {},
  };
  const emit = defineEmits(['register', 'reload']);
  const formElRef = ref<FormInstance>();
  const state = reactive<State>({
    dataForm: {
      id: '',
      type: 0,
      enCode: '',
      map: {},
    },
    formRules: {
      enCode: [
        { required: true, message: '必填', trigger: 'change' },
        { pattern: /^[a-zA-Z][a-zA-Z0-9._-]*$/, message: '只能输入字母、数字、点、横线和下划线，且以字母开头', trigger: 'change' },
      ],
    },
    categoryList: [],
    typeOptions: [],
  });
  const { dataForm, formRules, categoryList, typeOptions } = toRefs(state);
  const currentFocusField = ref(''); // 存储当前焦点所在的字段
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const getTitle = computed(() => (!state.dataForm.id ? t('common.addText') : t('common.editText')));

  function init(data) {
    changeLoading(true);
    changeOkLoading(false);
    state.dataForm = { ...defaultForm };
    formElRef.value?.resetFields();
    state.dataForm.id = data.id;
    state.categoryList = data.categoryList;
    state.typeOptions = data.typeOptions;
    if (state.dataForm.id) {
      getInfo(state.dataForm.id).then(res => {
        state.dataForm = res.data;
        for (let [key, value] of Object.entries(res.data.map || {})) {
          state.dataForm[key] = value;
        }
        changeLoading(false);
      });
    } else {
      changeLoading(false);
    }
  }
  async function handleSubmit() {
    try {
      const values = await formElRef.value?.validate();
      if (!values) return;
      if (!state.dataForm.map) state.dataForm.map = {};
      for (let i = 0; i < state.categoryList.length; i++) {
        state.dataForm.map[state.categoryList[i].enCode] = state.dataForm[state.categoryList[i].enCode] || '';
      }
      changeOkLoading(true);
      const formMethod = state.dataForm.id ? update : create;
      formMethod(state.dataForm)
        .then(res => {
          createMessage.success(res.msg);
          changeOkLoading(false);
          closeModal();
          emit('reload');
        })
        .catch(() => {
          changeOkLoading(false);
        });
    } catch (_) {}
  }
  // 处理文本框获取焦点事件
  function handleTextareaFocus(fieldName) {
    currentFocusField.value = fieldName;
  }

  // 处理按键监听事件
  async function handleKeyDown(event) {
    if (event.altKey && event.key === 'q') {
      // 阻止默认的Tab行为
      event.preventDefault();

      // 如果没有焦点字段，不执行操作
      if (!currentFocusField.value) return;
      // 如果没有值，不执行操作
      const currentValue = state.dataForm[currentFocusField.value];
      if (!currentValue) return;

      changeLoading(true);
      createMessage.success(t('sys.lang.translating') + ` “${currentValue}”`);
      realTimeTranslate({ text: currentValue, lang: currentFocusField.value })
        .then(res => {
          // 更新其他字段的值
          changeLoading(false);
          if (res && res.data) {
            for (const key in res.data) {
              if (key !== currentFocusField.value && state.categoryList.some(item => item.enCode === key)) {
                state.dataForm[key] = res.data[key];
              }
            }
          } else {
            createMessage.error(t('sys.lang.translatefail'));
          }
        })
        .catch(() => {
          createMessage.error(t('sys.lang.translatefail'));
          changeLoading(false);
        });
    }
  }
  // 在组件挂载时添加事件监听
  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
  });

  // 在组件卸载时移除事件监听
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
</script>
