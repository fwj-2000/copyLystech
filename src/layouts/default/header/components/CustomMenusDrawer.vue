<template>
  <BasicDrawer v-bind="$attrs" @register="registerDrawer" width="340px" class="full-drawer portal-toggle-drawer" :title="t('layout.header.customMenus')">
    <div class="tool">
      <a-input-search :placeholder="t('common.drawerSearchText')" allowClear v-model:value="keyword" @search="initData" />
    </div>
    <div class="main">
      <div class="item" v-if="list.length">
        <div class="item-list">
          <div class="item-list-item" v-for="(item, i) in list" :key="i" @click="handleClick(item)" :class="{ active: item.currentSystem }">
            <p class="com-hover">{{ item.fullName }}</p>
            <i class="icon-ym icon-ym-delete" @click.stop="handleDel(item.id)"></i>
          </div>
        </div>
      </div>
      <lydc-empty v-else />
    </div>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, toRefs } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getToken } from '/@/utils/auth';
  import { encryptByBase64 } from '/@/utils/cipher';
  import { getMenuCustomDataList, delMenuCustomData } from '/@/api/system/customData';
  import { useRouter } from 'vue-router';

  interface State {
    list: any[];
    keyword: string;
  }

  defineEmits(['register']);
  const state = reactive<State>({
    list: [],
    keyword: '',
  });
  const { list, keyword } = toRefs(state);
  const globSetting = useGlobSetting();
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const router = useRouter();
  const [registerDrawer, { changeLoading, closeDrawer }] = useDrawerInner(init);

  function init() {
    state.keyword = '';
    initData();
  }
  function initData() {
    changeLoading(true);
    getMenuCustomDataList({ keyword: state.keyword })
      .then(res => {
        state.list = res.data.list;
        changeLoading(false);
      })
      .catch(() => {
        changeLoading(false);
      });
  }
  function handleClick(item) {
    let path = '/' + item.urlAddress;
    router.push(path);
    closeDrawer();
  }
  function handleDel(id) {
    delMenuCustomData(id).then(res => {
      createMessage.success(res.msg).then(() => {
        initData();
      });
    });
  }
</script>
