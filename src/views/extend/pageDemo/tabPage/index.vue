<template>
  <div :id="DOM_CONTAINER_ID" class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <a-tabs v-model:activeKey="activeKey">
          <!-- TODO: `tab`属性为页签名称，根据需要更换 -->
          <a-tab-pane :key="TABS_ENUM.待处理" :tab="t('common.todoText')">
            <DataTable ref="todoTableRef" :tab="TABS_ENUM.待处理" />
          </a-tab-pane>

          <!-- TODO: `tab`属性为页签名称，根据需要更换 -->
          <a-tab-pane :key="TABS_ENUM.已处理" :tab="t('common.doneText')">
            <DataTable :tab="TABS_ENUM.已处理" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { TABS_ENUM, DOM_CONTAINER_ID } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';

  // TODO: 引入不同页签的表格组件；
  // 如果不同页签下的页面相差不大，可以考虑使用同一个组件，然后对传入的参数进行判断即可
  // 如果不同页签下的表格内容相差过大，可以根据情况，为每个页签单独创建一个组件
  import DataTable from './components/dataTable.vue';

  // TODO: 页面名称需要更改，缓存唯一标识，一般是路由code
  defineOptions({ name: 'pageDemo-tabPage' });

  const todoTableRef = ref<InstanceType<typeof DataTable>>();

  const { t } = useI18n();
  // TODO: 设置默认选中的页签,一般是待处理
  const activeKey = ref<`${TABS_ENUM}`>(TABS_ENUM.待处理);

  useRouteParams({ id: {} }, params => {
    if (!params.id) return;
    // TODO: 获取路由参数进入详情页或者对应的页面处理
    todoTableRef.value?.openDetail?.(true, { id: params.id });
  });
</script>

<style lang="less" scoped>
  @import url('/src/design/page.less');
</style>
