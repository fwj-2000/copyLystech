<script setup lang="ts">
  import { Card, CardContent, CardHeader, CardTitle } from '/@/components/VxeTable/ui-kit/shadcn-ui/index';

  interface Props {
    title: string;
  }

  defineOptions({
    name: 'AnalysisChartCard',
  });

  withDefaults(defineProps<Props>(), {});
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-xl">{{ title }}</CardTitle>
    </CardHeader>
    <CardContent>
      <slot></slot>
    </CardContent>
  </Card>
</template>
