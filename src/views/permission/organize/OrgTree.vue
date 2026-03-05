<template>
  <BasicPopup v-bind="$attrs" @register="registerPopup" title="组织架构图" class="full-popup">
    <Vue3TreeOrg
      :data="list"
      lazy
      :load="loadData"
      :default-expand-level="1"
      center
      :props="props"
      :toolBar="toolBar"
      collapsable
      :node-draggable="false"
      :clone-node-drag="false" />
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { getDepartmentSelectorAsyncByAuth } from '/@/api/permission/organize';
  import { reactive, toRefs } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Vue3TreeOrg } from 'vue3-tree-org';
  import 'vue3-tree-org/lib/vue3-tree-org.css';

  const [registerPopup, { changeLoading }] = usePopupInner(init);
  const state = reactive({
    list: {},
    props: {
      label: 'fullName',
      pid: 'parentId',
    },
    toolBar: { scale: true, restore: true, expand: false, zoom: true, fullscreen: true },
    parentId: '0',
  });
  const { list, props, toolBar } = toRefs(state);

  function init() {
    state.parentId = '0';
    changeLoading(true);
    getDepartmentSelectorAsyncByAuth(state.parentId, {}).then(res => {
      const list = res.data.list.map(o => {
        const obj = o;
        if (obj.hasChildren) obj.children = [];
        return obj;
      });
      state.list = {
        id: '-1',
        fullName: '组织架构图',
        children: list,
      };
      changeLoading(false);
    });
  }
  function loadData(node, resolve) {
    if (node.$$level === 0) return;
    state.parentId = node.id;
    getDepartmentSelectorAsyncByAuth(state.parentId, {}).then(res => {
      const list = (res.data.list || []).map(o => {
        const obj = o;
        if (obj.hasChildren) obj.children = [];
        return obj;
      });
      resolve(list);
    });
  }
</script>
<style lang="less" scoped>
  :deep(.zoom-container) {
    padding-top: 5px;
  }
</style>
