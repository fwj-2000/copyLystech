<template>
  <a-sub-menu v-if="!isEmpty(props.item?.children)" :key="props.item.key" :title="props.item.text"
    @click.stop="handleClickMenu(props.item)">
    <SubMenuItem v-for="subItem in props.item?.children" :key="subItem.key" :item="subItem"
      @menuClick="handleClickMenu"></SubMenuItem>
  </a-sub-menu>
  <a-menu-item v-else @click.stop="handleClickMenu(props.item)">{{ props.item.text }}</a-menu-item>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import type { SubDropMenu } from './typing';
import { Menu } from 'ant-design-vue';
import { isEmpty } from 'lodash-es';

const AMenuItem = Menu.Item;
const emit = defineEmits(['menuClick']);

const props = defineProps({
  item: {
    type: Object as PropType<SubDropMenu>,
    default: () => ({}),
  },
});

const handleClickMenu = item => {
  emit('menuClick', item);
};
</script>
