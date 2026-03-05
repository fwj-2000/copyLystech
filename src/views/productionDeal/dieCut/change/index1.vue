<template>
  <PerprintPage pageType="Change" />
</template>
<script setup lang="ts">
  import { SharePageType } from '../prePrint/const';
  import PerprintPage from '/@/views/productionDeal/dieCut/prePrint/index.vue';

  defineOptions({ name: `productionDeal-dieCut-change` });
</script>
