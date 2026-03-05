<template>
  <a-tabs type="card" class="bg-white h-full" @change="changeConfigType">
    <a-tab-pane :key="3" tab="料件号" class="h-full">
      <metaria></metaria>
    </a-tab-pane>
    <a-tab-pane :key="2" tab="直接客户">
      <customer></customer>
    </a-tab-pane>
    <a-tab-pane :key="1" tab="内部项目代码">
      <innerCode></innerCode>
    </a-tab-pane>
  </a-tabs>
</template>
<script setup lang="ts">
  import metaria from './components/maintain/materia.vue';
  import customer from './components/maintain/customer.vue';
  import innerCode from './components/maintain/innerCode.vue';
  import { useMemberStore } from '/@/store/modules/projectMember';

  const memberStore = useMemberStore();
  function changeConfigType(e) {
    memberStore.updateconfigType(e, '0');
  }
</script>
