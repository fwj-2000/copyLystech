<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { reactive, toRefs } from 'vue';

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const state = reactive({
    modifyList: [
      {
        type: '22',
        value: '11',
      },
    ],
    options: [],
  });

  const { modifyList } = toRefs(state);

  function init() {
    console.log('🚀 ~ BulkEditModal.vue:20 ~ init ~ init !');
  }

  async function handleSubmit() {
    console.log('🚀 ~ BulkEditModal.vue:24 ~ handleSubmit ~ handleSubmit !');
  }
</script>

<template>
  <BasicModal
    canFullscreen
    :draggable="true"
    v-bind="$attrs"
    @register="registerModal"
    title="批量修改"
    :width="600"
    showOkBtn
    @ok="handleSubmit"
    destroy-on-close>
    <a-row v-for="(item, index) in modifyList" :gutter="16">
      <!--      <div class="content-box">-->
      <!--        <div class="left-box">-->
      <!--          <div>修改字段: </div>-->
      <!--          <Input  />-->
      <!--        </div>-->
      <!--      </div>-->
      <a-col :span="12">
        <div>修改字段: </div>
        <LydcInput />
      </a-col>
      <a-col :span="12">
        <div>值: </div>
        <LydcInput />
      </a-col>
    </a-row>
  </BasicModal>
</template>
