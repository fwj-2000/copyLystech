<template>
  <BasicModal destroyOnClose v-bind="$attrs" :width="900" :height="600" @register="registerModal" :title="title" :draggable="true" showOkBtn @ok="handleSave">
    <template #title>
      <Subtitle :title="title" />
    </template>

    <div class="px-12px">
      <div>
        <span class="mr-5px">{{ t('dict.PartNumberApply.selectProject') }}:</span>
        <ApiSelect
          :api="getprojectlist"
          :show-search="true"
          :api-search="{
            show: true,
            searchName: 'code',
          }"
          v-model:value="state.selectedProject"
          result-field="data"
          value-field="InsideProjectCode"
          label-field="InsideProjectCode"
          :filter-option="false"
          :not-found-content="null"
          :immediate="true"
          style="width: 200px"
          :placeholder="t('dict.PartNumberApply.selectProject')"
          @change="handleChangeProject" />
      </div>
      <div v-if="state.selectedProjectCodeList.length > 0" class="flex justify-start flex-wrap">
        <span v-for="(code, index) in state.selectedProjectCodeList" :key="code" class="mr-18px">
          {{ code }}
          <a-button type="text" class="icon-ym icon-ym-delete !bg-transparent px-8px" danger @click="handleDelProject(index)" />
        </span>
      </div>
    </div>
    <a-divider />
    <h3 class="px-12px font-bold">{{ t('dict.CommonCol.insidePartNumber') }}</h3>
    <div class="h-400px">
      <Grid />
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { reactive, computed, nextTick } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getprojectlist } from '/@/api/business/quantitation';
  import { bindProject, bindProjectDisable } from '/@/api/basicData/productCodeApply';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import Subtitle from '/@/views/qms/report/abnormalReport/components/SubTitle.vue';

  const { t } = useI18n();
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const emits = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();

  interface State {
    /** 料号列表 */
    list: Array<any>;
    /** 操作类型: 绑定(`bind`)，禁用(`disable`) */
    type: 'bind' | 'disable';
    /** 当前`ApiSelect`选中的项目 */
    selectedProject: string | undefined;
    /** 选中的项目列表 */
    selectedProjectCodeList: Array<string>;
  }

  const state = reactive<State>({
    list: [],
    type: 'bind',
    selectedProject: undefined,
    selectedProjectCodeList: [],
  });

  const title = computed(() => (state.type === 'bind' ? t('dict.PartNumberApply.bindProject') : t('dict.PartNumberApply.bindProjectDisabled')));

  const columns: Array<any> = [
    {
      title: '产品内部料号',
      field: 'InsidePartNumber',
      width: 180,
    },
    {
      title: '内部项目代码',
      field: 'InsideProjectCode',
      width: 120,
    },
    {
      title: '共用项目代码',
      field: 'InsideProjectCodes',
    },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      id: 'basicData-productCodeApply-bindProject-list',
      columns,
      rowConfig: {
        keyField: 'Id',
      },
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'PartNumberApplyColumn',
      },
    },
  });

  function init(data: State) {
    state.selectedProject = undefined;
    state.selectedProjectCodeList.length = 0;
    Object.assign(state, data);
    initTableData();
  }

  function initTableData() {
    nextTick(() => {
      gridApi.grid.reloadData(state.list);
    });
  }

  function handleChangeProject(value: string) {
    state.selectedProject = undefined;
    if (!value) {
      return;
    }
    state.selectedProjectCodeList.includes(value) ? createMessage.warn(t('common.somethingExist', [value])) : state.selectedProjectCodeList.push(value);
  }

  function handleDelProject(index: number) {
    state.selectedProjectCodeList.splice(index, 1);
  }

  function handleSave() {
    if (state.selectedProjectCodeList.length === 0) {
      return createMessage.warn(t('dict.PartNumberApply.selectProject'));
    }

    const api = state.type === 'bind' ? bindProject : bindProjectDisable;

    changeOkLoading(true);
    changeLoading(true);
    api({ ids: state.list.map(item => item.Id), projects: state.selectedProjectCodeList })
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        emits('reload');
        closeModal();
      })
      .catch(() => {})
      .finally(() => {
        changeOkLoading(false);
        changeLoading(false);
      });
  }
</script>

<style lang="less" scoped>
  :deep(.lydc-basic-modal .ant-modal .ant-modal-body > .scrollbar) {
    padding: 0;
  }
</style>
