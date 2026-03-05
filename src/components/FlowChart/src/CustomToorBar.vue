<template>
  <div :class="`${prefixCls}-toolbar`" class="flex items-center px-2 py-1 select-none">
    <template v-for="item in toolbarItemList" :key="item.type">
      <Tooltip placement="bottom" v-bind="item.disabled ? { visible: false } : {}">
        <template #title>{{ item.tooltip }}</template>
        <span :class="`${prefixCls}-toolbar__icon`" v-if="item.icon || item.customIcon" @click="onControl(item)">
          <img v-if="item.customIcon" :src="item.customIcon" alt="" srcset="" :class="item.disabled ? 'cursor-not-allowed disabeld' : 'cursor-pointer'" />
          <i v-else :class="[item.disabled ? 'cursor-not-allowed disabeld' : 'cursor-pointer', item.icon]" />
          <!-- <SvgIcon
            :name="item.icon"
            :class="item.disabled ? 'cursor-not-allowed disabeld' : 'cursor-pointer'"
          /> -->
          <!-- <Icon :type="item.icon" /> -->
        </span>
      </Tooltip>
      <Divider v-if="item.separate" type="vertical" />
    </template>
  </div>
</template>
<script lang="ts">
  import type { ToolbarConfig } from './types';

  import { defineComponent, ref, onUnmounted, unref, nextTick, watchEffect } from 'vue';
  import { Divider, Tooltip } from 'ant-design-vue';
  import { SvgIcon, Icon } from '/@/components/Icon';

  import { useFlowChartContext } from './useFlowContext';
  import { ToolbarTypeEnum } from './enum';

  import actualSizeIcon from '/@/assets/icons/process/actual_size.svg';
  import fitViewIcon from '/@/assets/icons/process/fit_view.svg';
  // import deleteIcon from '/@/assets/icons/delete.svg';
  // import queueIcon from '/@/assets/icons/queue.svg';
  // import rollfrontIcon from '/@/assets/icons/rollfront.svg';
  // import rollbackIcon from '/@/assets/icons/rollback.svg';
  import zoomOutIcon from '/@/assets/icons/process/zoom_out.svg';
  import zoomInIcon from '/@/assets/icons/process/zoom_in.svg';

  export default defineComponent({
    name: 'FlowChartToolbar',
    components: { SvgIcon, Divider, Tooltip, Icon },
    props: {
      prefixCls: String,
    },
    emits: ['view-data', 'clone-node', 'delete-node'],
    setup(_, { emit }) {
      const toolbarItemList = ref<ToolbarConfig[]>([
        {
          type: ToolbarTypeEnum.UNDO,
          icon: 'ym-custom ym-custom-undo',
          // icon: rollbackIcon,
          tooltip: '后退',
          disabled: true,
        },
        {
          type: ToolbarTypeEnum.REDO,
          icon: 'ym-custom ym-custom-redo',
          // icon: rollfrontIcon,
          tooltip: '前进',
          disabled: true,
        },
        { separate: true },
        {
          type: ToolbarTypeEnum.CLONE_NODE,
          icon: 'icon-ym icon-ym-btn-copy',
          // icon: queueIcon,
          tooltip: '复制',
          disabled: true,
        },
        {
          type: ToolbarTypeEnum.DELETE_NODE,
          icon: 'icon-ym icon-ym-delete',
          // icon: deleteIcon,
          tooltip: '删除',
          disabled: true,
        },
        { separate: true },
        {
          type: ToolbarTypeEnum.ZOOM_IN,
          // icon: 'codicon:zoom-out',
          customIcon: zoomOutIcon,
          tooltip: '缩小',
        },
        {
          type: ToolbarTypeEnum.ZOOM_OUT,
          // icon: 'codicon:zoom-in',
          customIcon: zoomInIcon,
          tooltip: '放大',
        },
        {
          type: ToolbarTypeEnum.RESET_ZOOM,
          customIcon: actualSizeIcon,
          tooltip: '重置比例',
        },
        {
          type: ToolbarTypeEnum.FIT_VIEW,
          customIcon: fitViewIcon,
          tooltip: '适配屏幕',
        },
      ]);

      const { logicFlow } = useFlowChartContext();

      function onHistoryChange({ data: { undoAble, redoAble } }) {
        const itemsList = unref(toolbarItemList);
        const undoIndex = itemsList.findIndex(item => item.type === ToolbarTypeEnum.UNDO);
        const redoIndex = itemsList.findIndex(item => item.type === ToolbarTypeEnum.REDO);
        if (undoIndex !== -1) {
          unref(toolbarItemList)[undoIndex].disabled = !undoAble;
        }
        if (redoIndex !== -1) {
          unref(toolbarItemList)[redoIndex].disabled = !redoAble;
        }
      }

      function onNodeSelect({ data, e, position }) {
        const itemsList = unref(toolbarItemList);
        const cloneIndex = itemsList.findIndex(item => item.type === ToolbarTypeEnum.CLONE_NODE);
        const delIndex = itemsList.findIndex(item => item.type === ToolbarTypeEnum.DELETE_NODE);
        if (cloneIndex !== -1) {
          unref(toolbarItemList)[cloneIndex].disabled = data.type == 'flow-node' ? false : true;
        }
        if (delIndex !== -1) {
          unref(toolbarItemList)[delIndex].disabled = false;
        }
      }

      function onBlankClick() {
        const itemsList = unref(toolbarItemList);
        const cloneIndex = itemsList.findIndex(item => item.type === ToolbarTypeEnum.CLONE_NODE);
        const delIndex = itemsList.findIndex(item => item.type === ToolbarTypeEnum.DELETE_NODE);
        if (cloneIndex !== -1) {
          unref(toolbarItemList)[cloneIndex].disabled = true;
        }
        if (delIndex !== -1) {
          unref(toolbarItemList)[delIndex].disabled = true;
        }
      }

      const onControl = item => {
        const lf = unref(logicFlow);
        if (!lf) {
          return;
        }
        switch (item.type) {
          case ToolbarTypeEnum.ZOOM_IN:
            lf.zoom();
            break;
          case ToolbarTypeEnum.ZOOM_OUT:
            lf.zoom(true);
            break;
          case ToolbarTypeEnum.CLONE_NODE:
            emit('clone-node');
            break;
          case ToolbarTypeEnum.DELETE_NODE:
            emit('delete-node');
            break;
          case ToolbarTypeEnum.RESET_ZOOM:
            lf.resetZoom();
            break;
          case ToolbarTypeEnum.FIT_VIEW:
            lf.fitView();
            break;
          case ToolbarTypeEnum.UNDO:
            lf.undo();
            break;
          case ToolbarTypeEnum.REDO:
            lf.redo();
            break;
          // case ToolbarTypeEnum.SNAPSHOT:
          //   lf.getSnapshot();
          //   break;
          // case ToolbarTypeEnum.VIEW_DATA:
          //   emit('view-data');
          // break;
        }
      };

      watchEffect(async () => {
        if (unref(logicFlow)) {
          await nextTick();
          unref(logicFlow)?.on('history:change', onHistoryChange);
          unref(logicFlow)?.on('element:click', onNodeSelect);
          unref(logicFlow)?.on('blank:click', onBlankClick);
        }
      });

      onUnmounted(() => {
        unref(logicFlow)?.off('history:change', onHistoryChange);
        unref(logicFlow)?.off('element:click', onNodeSelect);
        unref(logicFlow)?.off('blank:click', onBlankClick);
      });
      return { toolbarItemList, onControl };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-flow-chart-toolbar';

  html[data-theme='dark'] {
    .lf-dnd {
      background: #080808;
    }
  }
  .@{prefix-cls} {
    height: 36px;
    background-color: @app-content-background;
    border-bottom: 1px solid @border-color-base;

    .disabeld {
      color: @disabled-color;
    }

    &__icon {
      display: inline-block;
      padding: 2px 4px;
      margin-right: 10px;

      &:hover {
        color: @primary-color;
      }
    }
  }
</style>
