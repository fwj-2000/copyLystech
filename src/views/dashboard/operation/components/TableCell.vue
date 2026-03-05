<!-- 表格单元格自定义展示 -->
<template>
  <!-- 可跳转 -->
  <template v-if="props.column.cellType === ECellType.LINK">
    <span class="text-hover" @click="handleGo">
      {{ props.record[props.column.dataIndex as string] }}
    </span>
  </template>
  <!-- 弹窗 -->
  <template v-else-if="props.column.cellType === ECellType.DIALOG">
    <span class="text-hover" @click="handleDialog">
      {{ props.record[props.column.dataIndex as string] }}
    </span>
  </template>
  <template v-else>
    <span> {{ props.record[props.column.dataIndex as string] }}</span>
  </template>

  <!-- 彈窗组件 -->
  <a-modal
    v-model:visible="dialogVisible"
    v-bind="{
      footer: null,
      title: '详情',
    }"
    width="100%">
    <component :is="props.column.dialogCompo" :queryInfo="queryInfo"></component>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, inject } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';

  import { ECellType, IColumnOptions } from '../../types';

  interface IProps {
    column: IColumnOptions;
    record: Record<string, any>;
  }

  const props = withDefaults(defineProps<IProps>(), {
    column: () => ({}),
    record: () => ({}),
  });
  const go = useGo();
  const searchFormValue = inject('searchFormValue');
  const getOrganizeMapInfo = inject('getOrganizeMapInfo', () => ({}));
  const getDateDimParams = inject('getDateDimParams', () => ({}));
  const dialogVisible = ref<boolean>(false);
  const queryInfo = ref<Record<string, string>>({});

  // 弹窗
  const handleDialog = () => {
    dialogVisible.value = true;
    queryInfo.value =
      (props.column.getQuery &&
        props.column?.getQuery({
          record: props.record,
          searchFormValue,
          getDateDimParams,
        })) ||
      {};
  };

  // 跳转
  const handleGo = () => {
    const { getPathUrl } = props.column;
    const url =
      (getPathUrl &&
        getPathUrl({
          searchFormValue,
          record: props.record,
          column: props.column,
          organizeMapInfo: {
            BG: 'MQ',
            ...getOrganizeMapInfo(),
          },
        })) ||
      '';
    if (url) {
      go(url);
    }
  };
</script>
