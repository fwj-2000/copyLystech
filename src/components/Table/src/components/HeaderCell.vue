<template>
  <EditTableHeaderCell v-if="getIsEdit">
    {{ getTitle }}
  </EditTableHeaderCell>
  <span v-else>{{ getTitle }}</span>
  <BasicHelp v-if="getHelpMessage" :text="getHelpMessage" :class="`${prefixCls}__help`" />
</template>
<script lang="ts">
  import type { PropType } from 'vue';
  import type { BasicColumn } from '../types/table';
  import { defineComponent, computed } from 'vue';
  import BasicHelp from '/@/components/Basic/src/BasicHelp.vue';
  import EditTableHeaderCell from './EditTableHeaderIcon.vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'TableHeaderCell',
    components: {
      EditTableHeaderCell,
      BasicHelp,
    },
    props: {
      column: {
        type: Object as PropType<BasicColumn>,
        default: () => ({}),
      },
    },
    setup(props) {
      const { prefixCls } = useDesign('basic-table-header-cell');

      const getIsEdit = computed(() => !!props.column?.edit);
      // const getTitle = computed(() => props.column?.customTitle || props.column?.title);
      const getTitle = computed(() => {
        const column = props.column as BasicColumn;
        if (typeof column.customHeaderRender === 'function') {
          return column.customHeaderRender(column);
        }
        return column?.customTitle || props.column?.title;
      });
      // 判断是否为YYYY-MM-DD日期格式
      const isDateFormatYYYYMMDD = computed(() => {
        const { format } = props.column;
        return typeof format === 'string' && format.startsWith('date|') && format.includes('YYYY-MM-DD') && !format.includes('HH:mm');
      });
      const getHelpMessage = computed(() => {
        if (isDateFormatYYYYMMDD.value) {
          return props.column?.helpMessage ? props.column?.helpMessage + ' Time Zone:Asia/Shanghai' : 'Time Zone:Asia/Shanghai';
        }
        return props.column?.helpMessage;
      });

      return { prefixCls, getIsEdit, getTitle, getHelpMessage };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-table-header-cell';

  .@{prefix-cls} {
    &__help {
      margin-left: 8px;
      color: rgb(0 0 0 / 65%) !important;
    }
  }
</style>
