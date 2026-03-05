<template>
  <div class="flex center w-[100%]">
    <Card class="w-[47%] mr-[7px]" v-bind="props" />
    <div class="w-[53%] h-[100%] flex flex flex-col">
      <Process class="mb-[7px]" v-bind="props" :value="props.reduceValue || 0" :reference-value="1000" />
      <Process v-bind="props" :value="props.currentMonthValue || 0" :isCurrentMonth="true" :reference-value="1000" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { propOptions } from './config';

  import Card from './card.vue';
  import Process from './process.vue';

  const props = defineProps(propOptions);
</script>

<style scoped lang="less"></style>
