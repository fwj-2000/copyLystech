<template>
  <BasicModal
    destroyOnClose
    v-bind="$attrs"
    :width="1200"
    :height="600"
    @register="registerModal"
    :title="t('common.chooseGroup')"
    :draggable="true"
    showOkBtn
    @ok="handleSave">
    <div style="height: 550px">
      <groupItem
        ref="groupItemRef"
        :team-type="state.teamType"
        :main-process="state.mainProcess"
        updateType="listView"
        @ok="closeModal"
        :reload="state.reload"></groupItem>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import groupItem from './GroupItem.vue';
  import { designProjectMembersTeam } from '/@/api/business/projectMember';
  import { message } from 'ant-design-vue';

  const { t } = useI18n();
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const emits = defineEmits(['register', 'reload']);

  interface State {
    title: string;
    updateType: string;
    teamType: number;
    mainProcess: string;
    ids: string[];
    reload: number;
    rows: any[];
  }
  const state = reactive<State>({
    title: '',
    updateType: '',
    teamType: 1,
    mainProcess: '',
    ids: [],
    reload: 0,
    rows: [],
  });

  function init(data) {
    changeOkLoading(false);
    changeLoading(true);
    state.ids = data.ids || [];
    state.updateType = data.updateType;
    state.teamType = data.teamType;
    state.mainProcess = data.mainProcess;
    state.reload++;
    state.rows = data.rows;
    changeLoading(false);
  }

  // 指定成员
  const groupItemRef = ref();
  const handleSave = async () => {
    const d = groupItemRef.value.getSelectGroup();
    if (d) {
      changeOkLoading(true);
      const commonParams = {
        teamType: state.teamType,
        mainProcess: state.mainProcess,
      };
      const params = state.rows.map(el => {
        const item = {
          ...commonParams,
          factoryId: el.factoryId,
          factory: el.factory,
          factoryName: el.factoryName,
          insideProjectCode: el.insideProjectCode,
          immediateCustomerId: el.immediateCustomerId,
          immediateCustomerName: el.immediateCustomerName,
          immediateCustomerCode: el.immediateCustomerCode,
          materialPartsNumber: el.materialPartsNumber,
          ...d,
        };
        if (el.pdId) {
          item.pdId = el.pdId;
          item.pdName = el.pdName;
        }
        if (el.productionType) {
          item.productionType = el.productionType;
          item.productionTypeDesc = el.productionTypeDesc;
        }
        return item;
      });
      try {
        const r = await designProjectMembersTeam(params);
        if (r.code == 200) {
          emits('reload', d);
          message.success(t('sys.api.operationSuccess'));
          closeModal();
        }
        changeOkLoading(false);
      } catch (e) {
        console.log(e);
        changeOkLoading(false);
      }
    }
  };
</script>
<style lang="less" scoped>
  :deep(.lydc-basic-modal .ant-modal .ant-modal-body > .scrollbar) {
    padding: 0;
  }
</style>
