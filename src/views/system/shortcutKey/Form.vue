<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @cancel="handleOpenChange" showOkBtn @ok="handleSubmit" :okText="t('common.okText')">
    <div class="flex w-full justify-start mb-20px">
      <div class="w-80px text-center">组合键 </div>
      <div class="px-10px py-5px bg-[#ccc] rounded-lg">
        {{ state.displayKeyCombination || '暂无按键记录' }}
      </div>
    </div>
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { reactive, onMounted, onUnmounted, computed, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { defaultShortcutConfig } from '/@/hooks/web/useShortcutManager';
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const emit = defineEmits(['register', 'reload', 'submit']);

  const state = reactive({
    id: '',
    displayKeyCombination: '',
  });

  // 表单选项复用
  const keyOptions = [
    { fullName: 'ctrl', id: 0 },
    { fullName: 'shift', id: 1 },
    { fullName: 'alt', id: 2 },
  ];

  const schemas: FormSchema[] = [
    {
      field: 'key1',
      label: '功能名称',
      component: 'Select',
      componentProps: { options: keyOptions },
      // rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
  ];

  const getTitle = computed(() => (state.id ? t('common.editText') : t('common.addText')));

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  const [registerForm, { getFieldsValue, validate, resetFields, clearValidate }] = useForm({ labelWidth: 80, schemas });
  const handleOpenChange = v => {
    console.log(v, 'vvv');
    document.removeEventListener('keydown', handleKeyDown);
    state.displayKeyCombination = '';
    console.log('已移除键盘事件监听');
  };
  // 键盘显示映射
  const keyDisplayMap: Record<string, string> = {
    Control: 'Ctrl',
    Shift: 'Shift',
    Alt: 'Alt',
    Meta: 'Win',
    ' ': 'Space',
    Enter: 'Enter',
    Tab: 'Tab',
    Escape: 'Esc',
    Backspace: 'Backspace',
    Delete: 'Delete',
  };

  const getKeyDisplayName = (key: string) => keyDisplayMap[key] || key.toUpperCase();

  // 按键事件
  const handleKeyDown = (event: KeyboardEvent) => {
    const keys: string[] = [];

    if (event.ctrlKey) keys.push('Ctrl');
    if (event.shiftKey) keys.push('Shift');
    if (event.altKey) keys.push('Alt');
    if (event.metaKey) keys.push('Win');

    const mainKey = event.key;
    if (!['Control', 'Shift', 'Alt', 'Meta'].includes(mainKey)) {
      keys.push(getKeyDisplayName(mainKey));
    }

    if (keys.length > 0) {
      state.displayKeyCombination = keys.join('+');
      console.log('检测到按键组合:', state.displayKeyCombination);
    }
  };

  // 初始化
  function init(data) {
    resetFields();
    clearValidate();
    state.id = data.id;
    state.displayKeyCombination = '';
    document.addEventListener('keydown', handleKeyDown);
    console.log('已开始监听键盘按下事件');
    console.log(defaultShortcutConfig, 'defaultShortcutConfig');
  }

  // 提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(false);
    closeModal();
    emit('reload');
    document.removeEventListener('keydown', handleKeyDown);
    state.displayKeyCombination = '';
    console.log('已移除键盘事件监听');
  }

  // 监听显示值
  watch(
    () => state.displayKeyCombination,
    newCombination => {
      console.log('当前按键组合:', newCombination);
    },
  );
</script>
