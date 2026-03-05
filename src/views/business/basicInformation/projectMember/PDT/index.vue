<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <a-tabs class="lydc-content-wrapper-tabs bg-white h-full" @change="handleTabChang">
          <a-tab-pane :key="0" :tab="`PDT${t('common.group')}-${t('common.toMaintain')}`" class="h-full member-inner">
            <toMaintain :teamType="state.teamType" :reload="state.reload" :main-process="state.mainProcess" @openGroupPopup="openGroup"></toMaintain>
          </a-tab-pane>
          <a-tab-pane :key="1" :tab="`PDT${t('common.group')}-${t('common.maintained')}`" style="height: 100%">
            <maintained :teamType="state.teamType" :reload="state.reloadTwo" :main-process="state.mainProcess" @openUpdate="openUpdateGroupRole"></maintained>
          </a-tab-pane>
          <template #rightExtra>
            <div class="filter-wrap">
              {{ t('dict.MainProcess') }}:
              <LydcSelect v-model:value="state.mainProcess" :options="state.mainProcessList" style="width: 200px" @change="changeMainprocess" />
            </div>
          </template>
        </a-tabs>
      </div>
    </div>
    <groupPopup @register="registerGroupPopup"></groupPopup>
    <UpdateGroupRole @register="registerUpdateGroupRole" @reload="reload"></UpdateGroupRole>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, defineAsyncComponent } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import UpdateGroupRole from '../components/UpdateGroupRole.vue';
  import groupPopup from '../components/GroupMatinPopup.vue';
  import { getMainProcess } from '/@/utils/business/index';
  import { useMemberStore } from '/@/store/modules/projectMember';
  defineOptions({ name: 'business-basicInformation-projectMember-PDT' });
  const memberStore = useMemberStore();

  const maintained = defineAsyncComponent(() => import('./maintained.vue'));
  const toMaintain = defineAsyncComponent(() => import('./toMaintain.vue'));
  const { t } = useI18n();

  const state = reactive({
    mainProcess: '1',
    mainProcessList: [],
    teamType: '2',
    reload: 1,
    reloadTwo: 0,
    tableData: [],
  });
  const [registerGroupPopup, { openPopup: openGroupPopup }] = usePopup();
  const [registerUpdateGroupRole, { openPopup }] = usePopup();
  function openGroup() {
    openGroupPopup(true, {
      mainProcess: state.mainProcess,
      teamType: state.teamType,
    });
  }
  // 修改成员
  function openUpdateGroupRole(ids) {
    // 打开更改项目组弹框
    openPopup(true, {
      ids: ids,
      teamType: state.teamType,
      mainProcess: state.mainProcess,
    });
  }

  onMounted(async () => {
    state.mainProcessList = await getMainProcess();
  });

  function reload() {
    state.reload++;
    state.reloadTwo++;
  }
  function changeMainprocess(e) {
    memberStore.updateMainProcess(e);
    reload();
  }

  function handleTabChang(e) {
    if (e == 1) {
      state.reloadTwo++;
    }
  }
</script>

<style lang="less" scoped>
  .pldr {
    color: #ff7b00;
  }

  :deep(.ant-tabs-content) {
    height: 100%;

    & > div {
      height: 100%;
    }
  }

  :deep(.ant-tabs-nav-list) {
    padding-left: 20px;
  }

  .filter-wrap {
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
