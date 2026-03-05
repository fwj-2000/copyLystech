<template>
  <div class="flex h-full">
    <a-card style="width: 48%; height: 100%">
      <div class="flex justify-between mb-2">
        <div class="flex">
          <ApiSelect
            :api="getSlectOps"
            :show-search="true"
            :api-search="{
              show: true,
              searchName: 'code',
            }"
            :params="{ type: 1, mainProcess: memberStore.mainProcess }"
            :style="{ width: '200px' }"
            v-model:value="state.innerCode"
            placeholder="请选择内部项目代码"
            result-field="data"
            label-field="code"
            value-field="code"
            allowClear
            :filter-option="false"
            :not-found-content="null"
            :immediate="true" />
          <a-button @click="search">查询</a-button>
        </div>
        <div>
          <!-- <a-button class="mr-3">少量维护</a-button> -->
          <a-button v-auth="'btn_group'" @click="openGroup">项目团队</a-button>
        </div>
      </div>
      <BasicTable @register="registerTable"></BasicTable>
    </a-card>
    <div style="width: 4%; height: 100%" class="flex role-transfer">
      <div class="role-transfer-left" @click="change">
        <i class="icon-ym icon-ym-right"></i>
      </div>
    </div>
    <a-card style="width: 48%; height: 100%">
      <div class="pb-3 flex">
        <a-select class="flex-1" :open="false" v-model:value="state.team.teamName" @click="selectTeam" placeholder="请选择项目团队"></a-select>
        <div class="ml-10">
          <a-button v-auth="'btn_add_main'" type="primary" @click="handleSave">提交</a-button>
        </div>
      </div>
      <BasicTable @register="registerSelectTable" :data-source="state.selectList">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.dataIndex == 'materia'">{{ state.selectTempList[index][column.dataIndex] }}</template>
          <template v-if="column.dataIndex == 'productionType'">
            <lydcSelect :options="state.productionTypeList" v-model:value="state.selectTempList[index].productionType"></lydcSelect>
          </template>
          <template v-if="column.key == 'action'">
            <TableAction :actions="getTableActions(index, record)" />
          </template>
        </template>
      </BasicTable>
    </a-card>
  </div>
  <groupModal @register="registerModal" @reload="getTeamList"></groupModal>
</template>
<script setup lang="ts">
  import { reactive } from 'vue';
  import { BasicTable, useTable, ActionItem, TableAction } from '/@/components/Table';
  import { useMemberStore } from '/@/store/modules/projectMember';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { message } from 'ant-design-vue';
  import groupModal from '../group/groupModal.vue';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { getSlectOps, getMetaiaList, savewaitmaintain } from '/@/api/business/member';
  import { useModal } from '/@/components/Modal';
  import { cloneDeep } from 'lodash-es';
  import { formatSelect } from './utils';
  const memberStore = useMemberStore();
  const { t } = useI18n();

  const state = reactive({
    selectList: [],
    selectTempList: [],
    innerCode: undefined,
    team: {
      id: '',
      teamName: undefined,
    },
    productionTypeList: [
      {
        id: 1,
        fullName: '自制',
      },
      {
        id: 2,
        fullName: '外购',
      },
    ],
  });
  const [registerTable, { getSelectRows, reload, clearSelectedRowKeys }] = useTable({
    api: getMetaiaList,
    beforeFetch: param => {
      param.insideProjectCode = state.innerCode;
      param.mainProcess = memberStore.mainProcess;
      return param;
    },
    columns: [
      {
        title: '料件号',
        dataIndex: 'materialPartsNumber',
      },
    ],
    useSearchForm: false, // 使用搜索表单
    immediate: false,
    showTableSetting: false,
    canResize: true,
    showIndexColumn: false,
    rowSelection: { type: 'checkbox' },
    pagination: {
      pageSize: 30,
      size: 'small',
    },
  });

  const [registerModal, { openModal }] = useModal();

  const [registerSelectTable] = useTable({
    columns: [
      {
        title: '料件号',
        dataIndex: 'materialPartsNumber',
      },
      {
        title: '生产类型',
        dataIndex: 'productionType',
      },
    ],
    useSearchForm: false, // 使用搜索表单
    immediate: false,
    showTableSetting: false,
    canResize: true,
    showIndexColumn: false,
    resizeHeightOffset: 20,
    pagination: false,
    actionColumn: {
      width: 80,
      title: t('common.action'),
      dataIndex: 'action',
    },
  });
  function getTableActions(index, Record): ActionItem[] {
    return [
      {
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        disabled: state.selectList.length <= 1,
        onClick: handleDelete.bind(null, index),
        // modelConfirm: {
        //   onOk: handleDelete.bind(null, index),
        // },
      },
    ];
  }
  function handleDelete(index) {
    state.selectTempList.splice(index, 1);
    state.selectList.splice(index, 1);
  }
  function search() {
    // 将查询后的填充到表格里
    reload();
  }
  function change() {
    // 获取到左边的选项，传送到右边
    const rows = getSelectRows();
    if (rows.length < 1) {
      return message.info(t('common.selectText'));
    }
    const _list = cloneDeep(rows).map(el => {
      el.productionType = 1;
      return el;
    });
    const _filnalList = formatSelect(state.selectTempList, _list);
    state.selectTempList = cloneDeep(_filnalList);
    state.selectList = cloneDeep(_filnalList);
    clearSelectedRowKeys();
  }

  // 保存维护人员
  async function handleSave() {
    if (state.selectTempList.length) {
      const r = await savewaitmaintain(state.selectTempList, state.team.id);
      if (r.code == 200) {
        message.success(t('sys.api.operationSuccess'));
        state.selectTempList = [];
        state.selectList = [];
      }
    } else {
      message.info('请先选择数据');
    }
  }

  // 项目成员选择
  function selectTeam() {
    openModal(true, {});
  }
  function getTeamList(d) {
    state.team = {
      id: d[0].id,
      teamName: d[0].teamName,
    };
  }
  function openGroup() {
    memberStore.openGroupModal();
  }
</script>
<style lang="less" scoped>
  .role-transfer {
    min-height: 160px;
    padding: 0 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;

    &-left,
    &-right {
      width: 34px;
      height: 34px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      border-radius: 4px;
      border: 1px solid #dbdbdb;
      cursor: pointer;

      &:hover {
        box-shadow: 0 0 2px 1px rgb(0 0 0 / 5%), 0 0 2px 0 rgb(45 45 46 / 20%);
      }
    }

    &-left.disabled,
    &-right.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
</style>
