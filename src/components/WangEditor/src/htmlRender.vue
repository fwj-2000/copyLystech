<template>
  <div class="cursor-pointer underline" @dblclick.stop="handleEdit">
    <span v-if="!row[column.field] || row[column.field] === '<p><br></p>'" style="color: #999">请输入问题详情</span>
    <div v-else class="editor-html" v-html="row?.issueDetail"></div>
  </div>
  <EditModal @register="registerEditModal" @submit="handleSubmit" />
</template>

<script lang="ts" setup>
  import EditModal from './components/EditModal.vue';
  import { useModal } from '/@/components/Modal';

  const [registerEditModal, { openModal: openEditModal, closeModal }] = useModal();
  const { row, column } = defineProps({
    row: {
      type: Object,
      default: () => {},
    },
    column: {
      type: Object,
      default: () => {},
    },
  });

  function handleEdit() {
    openEditModal(true, {});
  }

  function handleSubmit(value) {
    row[column.field] = value;
    closeModal();
  }
</script>
