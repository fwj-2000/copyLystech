<template>
  <div :class="`${prefixCls}`">
    <div :class="customClass" class="table-tag" :style="customStyle">
      <span v-if="props.text">{{ props.text }}</span>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { hexToRGB, lighten } from '/@/utils/color';

  defineOptions({ name: 'LydcTag', inheritAttrs: false });
  const { prefixCls } = useDesign('tag');
  const props = defineProps({
    theme: { type: String, default: 'green' },
    text: {
      type: String,
      default: '',
    },
    color: { type: String, default: '' },
  });

  const customClass = computed(() => {
    if (props.color) {
      return 'custom';
    }
    return props.theme || 'green';
  });

  const customStyle = computed(() => {
    if (props.color) {
      return {
        '--tag-color': props.color,
        '--tag-bg-color': hexToRGB(lighten(props.color, 10), 0.1),
      };
    }
    return {};
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-tag';
  .@{prefix-cls} {
    // tag 状态样式
    .table-tag {
      position: relative;
      display: inline-block;
      border-radius: 4px;
      padding: 4px 8px 4px 20px;

      &::after {
        content: '';
        position: absolute;
        left: 8px;
        top: 50%;
        transform: translateY(-50%);
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #52c41a;
      }
    }

    .green.table-tag {
      background: rgb(82 196 26 / 10%);
      color: #52c41a;

      &::after {
        background: #52c41a;
      }
    }

    .gray.table-tag {
      background: #f2f4f6;
      color: #999;

      &::after {
        background: #999;
      }
    }

    .blue.table-tag {
      background: rgb(24 144 255 / 10%);
      color: #1890ff;

      &::after {
        background: #1890ff;
      }
    }

    .yellow.table-tag {
      background: rgb(250 173 20 / 10%);
      color: #faad14;

      &::after {
        background: #faad14;
      }
    }

    .red.table-tag {
      background: rgb(255 77 79 / 10%);
      color: #ff4d4f;

      &::after {
        background: #ff4d4f;
      }
    }

    .purple.table-tag {
      background: rgb(218 91 251 / 10%);
      color: #da5bfb;

      &::after {
        background: #da5bfb;
      }
    }

    .custom.table-tag {
      background: var(--tag-bg-color);
      color: var(--tag-color);

      &::after {
        background: var(--tag-color);
      }
    }
  }
</style>
