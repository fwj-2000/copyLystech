<!-- 可拖拽组件内容 -->
<template>
  <div class="body-content-compo">
    <draggable class="flex justify-start flex-wrap drag-info" :list="props.list" :disabled="!operable" v-bind="options">
      <template #item="{ element }">
        <a-col
          v-if="element.show.toString() === 'true'"
          v-bind="getColOptions(element.block)"
          class="drag-compo"
          :class="{ hoverable: operable, unmover: element.disabled }">
          <div v-if="operable" class="disabled-wrapper"></div>
          <component
            :is="element.component"
            :queryInfo="props.queryInfo"
            :element="element"
            @updateValues="handleUpdateValues"
            :operable="props.operable"></component>
          <img :src="closeSvg" class="remove-icon" @click="handleRemove(element.id)" />
        </a-col>
      </template>
    </draggable>
  </div>
</template>

<script lang="ts" setup>
  import draggable from 'vuedraggable';
  import { CustomCompoInfo } from '../types';
  import closeSvg from '/@/assets/svg/report/close02.svg';
  // import { defineEmits } from 'vue';

  const emits = defineEmits(['hide', 'updateValues']);

  const options = {
    itemKey: 'id',
    animation: '300',
    filter: '.unmover',
  };

  const props = defineProps({
    list: {
      type: Array<CustomCompoInfo>,
      default: () => [],
    },
    operable: {
      type: Boolean,
      default: true,
    },
    queryInfo: {
      type: Object,
      default: () => ({}),
    },
  });

  // 根据占位获取响应式配置
  const getColOptions = (block: number) => {
    if (block === 2) {
      return { xs: 24, sm: 24, md: 24, lg: 12, xl: 16, xxl: 12 };
    }
    if (block === 3) {
      return { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 18 };
    }
    if (block === 4) {
      return { xs: 24, sm: 24, md: 24, lg: 24, xl: 24, xxl: 24 };
    }
    return { xs: 24, sm: 12, md: 12, lg: 12, xl: 8, xxl: 6 };
  };

  const handleRemove = (id: number) => {
    emits('hide', id);
  };

  const handleUpdateValues = (id: number, values: any) => {
    emits('updateValues', id, values);
  };
</script>

<style lang="less" scoped>
  .body-content-compo {
    position: relative;
    width: 100%;
    padding: 6px 0 12px;

    .disabled-wrapper {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 3;
      width: calc(100% - 12px);
      height: 100%;
      cursor: grab;
    }

    .drag-info {
      margin-left: -6px;
      margin-right: -6px;
      row-gap: 12px;

      .drag-compo {
        padding-left: 6px;
        padding-right: 6px;

        &.hoverable:hover {
          div {
            &:first-child {
              border: 1px solid #ff7b00;
            }
          }

          .remove-icon {
            display: block;
          }
        }

        .remove-icon {
          display: none;
          position: absolute;
          top: -2px;
          right: -2px;
          cursor: pointer;
          z-index: 4;
        }
      }
    }
  }
</style>
