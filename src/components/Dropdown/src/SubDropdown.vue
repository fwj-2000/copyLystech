<template>
  <a-dropdown>
    <span @click.prevent>
      <slot></slot>
    </span>
    <template #overlay>
      <a-menu>
        <template v-for="item in props.dropMenuList" :key="item.key">
          <SubMenuItem :item="item" @menuClick="handleClickMenu"></SubMenuItem>
        </template>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import type { SubDropMenu } from './typing';
  import { Dropdown, Menu } from 'ant-design-vue';
  import SubMenuItem from './SubMenuItem.vue';

  const ADropdown = Dropdown;
  const AMenu = Menu;

  const emit = defineEmits(['menuChange']);

  const props = defineProps({
    /**
     * the trigger mode which executes the drop-down action
     * @default ['hover']
     * @type string[]
     */
    trigger: {
      type: Array as PropType<('contextmenu' | 'click' | 'hover')[]>,
      default: () => {
        return ['contextmenu'];
      },
    },
    dropMenuList: {
      type: Array as PropType<(SubDropMenu & Recordable)[]>,
      default: () => [],
    },
  });

  const handleClickMenu = item => {
    emit('menuChange', item);
  };
</script>
