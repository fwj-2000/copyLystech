<template>
  <Calendar v-bind="getBindValue">
    <slot></slot>
    <template #dateCellRender="{ current }" v-if="props.isShowHoliady && !slots.dateCellRender">
      <div :class="dateCellRender(current).class" v-if="dateCellRender(current).name">
        {{ dateCellRender(current).work ? '(补)' : dateCellRender(current).name }}
      </div>
    </template>
  </Calendar>
</template>

<script lang="ts" setup>
  import { Calendar } from 'ant-design-vue';
  import { computed, unref, useSlots } from 'vue';
  import { useAttrs } from '/@/hooks/core/useAttrs';
  import dayjs, { Dayjs } from 'dayjs';
  import { getDayDetail } from '/@/utils/holidays';
  const slots = useSlots();

  defineOptions({ name: 'LydcCalendar', inheritAttrs: false });
  const props = defineProps({
    isShowHoliady: {
      type: Boolean,
      default: false,
    },
  });
  const attrs = useAttrs({ excludeDefaultKeys: false });

  const getBindValue = computed(() => ({ ...unref(attrs) }));

  function getHolidayName(name) {
    try {
      const _holidays = name.split(',')[1];
      return _holidays;
    } catch (error) {
      return '';
    }
  }
  const dateCellRender = (current: Dayjs) => {
    const dateStr = dayjs(current).format('YYYY-MM-DD');
    const { name, work } = getDayDetail(dateStr);
    const _holidays = getHolidayName(name);

    return {
      name: _holidays,
      work,
      class: _holidays ? (work ? 'text-[red]' : 'text-[green]') : '',
    };
  };
</script>
