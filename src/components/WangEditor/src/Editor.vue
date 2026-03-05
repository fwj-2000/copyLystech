<template>
  <div class="wang-editor-container">
    <Toolbar v-if="showToolbar && !props.disabled" :editor="toolBarRef" class="wang-editor-toolbar" :defaultConfig="normalizedToolbarConfig" :mode="mode" />
    <Editor
      class="wang-editor-editor"
      :style="{ height: editorHeight }"
      v-model="editorValue"
      :defaultConfig="mergedEditorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="handleChange"
      @onDestroyed="handleDestroyed"
      @onMaxLength="handleMaxLength"
      @onFocus="handleFocus"
      @onBlur="handleBlur" />
    <div v-if="showFooter" class="wang-editor-footer">
      <slot name="footer">
        <span v-if="maxLength" class="word-count" :class="{ exceed: isExceedMaxLength }"> {{ currentLength }}/{{ maxLength }} </span>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import '@wangeditor-next/editor/dist/css/style.css';
  import { ref, watch, onBeforeUnmount, computed, shallowRef } from 'vue';
  import { Editor, Toolbar } from '@wangeditor-next/editor-for-vue';
  import { merge, cloneDeep, debounce, get } from 'lodash-es';
  import { DomEditor } from '@wangeditor-next/editor';
  import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor-next/editor';

  type ExtendedEditorConfig = Partial<IEditorConfig> & {
    placeholder?: string;
    maxLength?: number;
  };

  interface Props {
    value: string;
    mode?: 'default' | 'simple';
    disabled?: boolean;
    showToolbar?: boolean;
    showFooter?: boolean;
    editorHeight?: string;
    maxLength?: number;
    placeholder?: string;
    toolbarConfig?: Partial<IToolbarConfig>;
    editorConfig?: Partial<IEditorConfig>;
    uploadImageServer?: string;
    uploadImageMaxSize?: number;
    uploadImageAccept?: string[];
    uploadImageTimeout?: number;
    uploadImageFieldName?: string;
    customUpload?: (file: File, insertFn: (url: string, alt?: string, href?: string) => void) => Promise<void>;
  }

  const props = withDefaults(defineProps<Props>(), {
    value: '',
    mode: 'default',
    disabled: false,
    showToolbar: true,
    showFooter: true,
    editorHeight: '300px',
    maxLength: 0,
    placeholder: '请输入内容...',
    toolbarConfig: () => ({}),
    editorConfig: () => ({}),
    uploadImageServer: '',
    uploadImageMaxSize: 2 * 1024 * 1024, // 2M
    uploadImageAccept: () => ['image/*'],
    uploadImageTimeout: 10 * 1000, // 10秒
    uploadImageFieldName: 'file',
    customUpload: undefined,
  });

  const emit = defineEmits<{
    (e: 'update:value', value: string): void;
    (e: 'change', value: string): void;
    (e: 'created', editor: IDomEditor): void;
    (e: 'destroyed', editor: IDomEditor): void;
    (e: 'max-length', editor: IDomEditor): void;
    (e: 'focus', editor: IDomEditor): void;
    (e: 'blur', editor: IDomEditor): void;
    (e: 'blur', editor: IDomEditor): void;
  }>();

  const editorRef = shallowRef<IDomEditor | null>(null);

  const toolBarRef = shallowRef<IDomEditor | null>(null);

  const editorValue = ref(props.value); // 修复：使用 ref 而不是 shallowRef 以支持深度响应

  // 检查是否超出最大字数限制
  const isExceedMaxLength = computed(() => {
    return props.maxLength > 0 && currentLength.value > props.maxLength;
  });

  // 合并编辑器配置
  const mergedEditorConfig = computed<ExtendedEditorConfig>(() => {
    const baseConfig: ExtendedEditorConfig = {
      placeholder: props.placeholder,
      maxLength: props.maxLength,
      MENU_CONF: {
        uploadImage: {
          server: props.uploadImageServer,
          maxFileSize: props.uploadImageMaxSize,
          allowedFileTypes: props.uploadImageAccept,
          timeout: props.uploadImageTimeout,
          fieldName: props.uploadImageFieldName,
          customUpload: props.customUpload || undefined,
        } as IEditorConfig['MENU_CONF']['uploadImage'], // 类型断言确保匹配
      },
    };
    return merge(cloneDeep(baseConfig), cloneDeep(props.editorConfig));
  });

  // 当前字数
  const currentLength = computed(() => {
    if (!editorRef.value) return 0;
    const text = editorRef.value.getText();
    return text.trim().length;
  });

  const showToolbar = computed(() => {
    return props.showToolbar;
  });

  // 编辑器创建回调
  const handleCreated = (editor: IDomEditor) => {
    editorRef.value = editor;
    toolBarRef.value = editor;
    emit('created', editor);
    // console.log(toolBarRef.value.getAllMenuKeys(), 'getAllMenuKeys');
  };

  // 内容变化回调 (带防抖)
  const handleChange = debounce(
    (editor: IDomEditor) => {
      console.log('handleChangehandleChangehandleChangehandleChange');
      if (!editorRef.value || editorRef.value.isDestroyed) return;
      const html = editor.getHtml();
      emit('update:value', html);
      emit('change', html);
    },
    300,
    { leading: false, trailing: true },
  );

  // 编辑器销毁回调
  const handleDestroyed = (editor: IDomEditor) => {
    // console.log('handleDestroyedhandleDestroyedhandleDestroyedhandleDestroyed');
    handleChange.cancel(); // 取消未执行的防抖函数
    emit('destroyed', editor);
  };

  // 达到最大字数限制回调
  const handleMaxLength = (editor: IDomEditor) => {
    emit('max-length', editor);
  };

  // 编辑器聚焦回调
  const handleFocus = (editor: IDomEditor) => {
    emit('focus', editor);
  };

  // 编辑器失焦回调
  const handleBlur = (editor: IDomEditor) => {
    emit('blur', editor);
  };

  // 监听外部传入的 modelValue 变化 (带防抖)
  const debouncedWatch = debounce((newVal: string) => {
    if (newVal !== editorValue.value) {
      editorValue.value = newVal;
    }
  }, 300);

  watch(
    () => props.value,
    newVal => {
      editorValue.value = newVal;
    },
    { immediate: true },
  );

  watch(
    () => props.disabled,
    newVal => {
      if (newVal) {
        editorRef.value?.disable();
      } else {
        editorRef.value?.enable();
      }
    },
    { immediate: true },
  );

  // 组件卸载前清理
  onBeforeUnmount(() => {
    debouncedWatch.cancel();
    handleChange.cancel();
    cleanupEditor();
  });
  // 清理函数
  const cleanupEditor = () => {
    if (editorRef.value && !editorRef.value.isDestroyed) {
      console.trace('destroyed', editorRef.value);
      editorRef.value.destroy();
      editorRef.value = null;
    }
  };

  // 标准化工具栏配置
  const normalizedToolbarConfig = computed(() =>
    merge(
      {
        excludeKeys: ['insertVideo'],
      },
      get(props, 'toolbarConfig', {}),
    ),
  );

  // 暴露编辑器实例和方法
  defineExpose({
    getEditor: () => editorRef.value,
    getHtml: () => editorRef.value?.getHtml(),
    getText: () => editorRef.value?.getText(),
    clear: () => editorRef.value?.clear(),
    disable: () => editorRef.value?.disable(),
    enable: () => editorRef.value?.enable(),
    isDisabled: () => editorRef.value?.isDisabled(),
    focus: () => editorRef.value?.focus(),
    blur: () => editorRef.value?.blur(),
    scrollToElem: (elemId: string) => editorRef.value?.scrollToElem(elemId),
    destroy: () => {
      if (editorRef.value) {
        editorRef.value.destroy();
        editorRef.value = null;
      }
    },
  });
</script>

<style lang="less">
  .wang-editor-container {
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    display: flex;
    flex-direction: column;

    .wang-editor-toolbar {
      //border-bottom: 1px solid #e0e0e0;
    }

    .wang-editor-editor {
      overflow-y: auto;
      padding: 0 10px;
    }

    .wang-editor-footer {
      //border-top: 1px solid #e0e0e0;
      padding: 5px 10px;
      font-size: 12px;
      color: #999;
      display: flex;
      justify-content: flex-end;

      .word-count {
        &.exceed {
          color: #f56c6c;
          font-weight: bold;
        }
      }
    }
  }
</style>
