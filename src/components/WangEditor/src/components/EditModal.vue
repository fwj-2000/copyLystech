<template>
  <BasicModal :showOkBtn="true" v-bind="$attrs" @register="registerModal" title="编辑" :draggable="true" showOkBtn @ok="handleSubmit">
    <Editor ref="editor" />
  </BasicModal>
</template>
<script setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useTemplateRef } from 'vue';
  import Editor from '../Editor.vue';

  const emit = defineEmits(['register', 'submit']);

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const editorRef = useTemplateRef('editor');

  function init(data) {}

  function handleSubmit() {
    const html = editorRef.value.getHtml();
    emit('submit', html);
  }
</script>
