<!-- 批量导入 -->
<template>
  <!-- 批量导入 -->
  <a-dropdown :trigger="['click']">
    <template #overlay>
      <a-menu :items="menuItems" @click="handleClickBatchItem"> </a-menu>
    </template>
    <a-button :loading="batchLoading">{{ t('common.batchImport') }}</a-button>
  </a-dropdown>
</template>

<script lang="ts" setup>
  import { Ref, computed, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';

  import { MenuItemType } from './types';
  import { isFunction } from 'lodash-es';

  interface IProps {
    methods: Record<string, any>;
    formParams: () => Record<string, any>; // 修改为函数类型
    menuItems: MenuItemType[];
  }
  const props = withDefaults(defineProps<IProps>(), {
    menuItems: () => [],
    formParams: () => ({}),
  });

  const batchLoading = ref(false);
  const { t } = useI18n();

  const menuItems: Ref<MenuItemType[]> = computed(() => {
    return props.menuItems.filter(item => {
      const { auth } = item;
      const { hasBtnP } = usePermission();
      return !auth || hasBtnP(auth);
    });
  });

  // 批量导入
  const handleClickBatchItem = async ({ item }) => {
    console.log(item, 'item.originItemValue', props.formParams());

    batchLoading.value = true;
    // 添加安全判断
    if (!item.originItemValue) return;
    const { key, clickMethod } = item.originItemValue;
    // 安全访问 methods
    if (props.methods?.[key] && isFunction(props.methods[key])) {
      await props.methods[key]();
    }

    if (clickMethod && isFunction(clickMethod)) {
      await clickMethod(props.formParams()).catch(() => {});
    }
    batchLoading.value = false;
  };
  // const handleClickBatchItem = async ({ item }) => {
  //   batchLoading.value = true;
  //   const { key, clickMethod } = item.originItemValue;
  //   const method = props.methods[key];
  //   if (isFunction(method)) {
  //     await method();
  //   }
  //   if (clickMethod) {
  //     await clickMethod(props.formParams).catch(() => {});
  //   }
  //   batchLoading.value = false;
  // };
</script>
