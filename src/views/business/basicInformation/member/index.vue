<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <a-tabs class="lydc-content-wrapper-tabs bg-white h-full" @change="onChange">
          <a-tab-pane :key="0" tab="未维护" class="h-full member-inner">
            <maintain :reload="state.reload" :mainProcess="state.mainProcess"></maintain>
          </a-tab-pane>
          <a-tab-pane :key="1" tab="已维护" style="height: 100%">
            <maintained :reload="state.reloadTwo"></maintained>
          </a-tab-pane>
          <template #rightExtra>
            <div class="filter-wrap">
              主要制程:
              <LydcSelect v-model:value="state.mainProcess" :options="state.mainProcessList" style="width: 200px" @change="changeMainprocess" />
              <a-button v-auth="'btn_config'" class="ml-3" @click="addOrUpdateHandle()">配置角色</a-button>
            </div>
          </template>
        </a-tabs>
      </div>
    </div>
    <add @register="registerPopup" @reload="reload" />
  </div>
  <groupPopup @register="registerGroupPopup"></groupPopup>
</template>

<script setup lang="ts">
  import { onMounted, reactive, watch } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import maintain from './maintain.vue';
  import maintained from './maintained.vue';
  import add from './components/updateConfigType.vue';
  import { getMainProcess } from './components/config';
  import groupPopup from './components/group/updatePopup.vue';
  import { useMemberStore } from '/@/store/modules/projectMember';

  defineOptions({ name: 'business-basicInformation-member' });

  const { t } = useI18n();

  const [registerPopup, { openPopup }] = usePopup();
  const [registerGroupPopup, { openPopup: openGroupPopup }] = usePopup();

  const state = reactive({
    mainProcess: '1',
    mainProcessList: [],
    reload: 1,
    reloadTwo: 0,
  });

  onMounted(async () => {
    state.mainProcessList = await getMainProcess();
  });

  //新增或者修改
  function addOrUpdateHandle(id = '') {
    openPopup(true, { id, type: id ? 'edit' : 'add' });
  }
  const memberStore = useMemberStore();
  function handleGroup() {
    openGroupPopup(true, {
      maintain: state.mainProcess,
    });
  }

  watch(
    () => memberStore.openGroup,
    () => {
      handleGroup();
    },
    {
      deep: true,
    },
  );

  function changeMainprocess(e) {
    memberStore.updateMainProcess(e);
  }

  function onChange(e) {
    memberStore.updateCurrentMainType(e);
    if (e) {
      state.reloadTwo++;
    }
  }

  const reload = () => {
    state.reload += 2;
  };
</script>

<style lang="less">
  .pldr {
    color: #ff7b00;
  }

  .ant-tabs-content {
    height: 100%;

    & > div {
      height: 100%;
    }
  }

  .ant-tabs-nav-list {
    padding-left: 20px;
  }

  .filter-wrap {
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
  }

  .member-inner {
    display: flex;
    flex-direction: column;
  }
</style>
