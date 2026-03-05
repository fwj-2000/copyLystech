<template>
  <BasicModal v-bind="$attrs" :title="state.title" width="1000px" @register="registerModal" showOkBtn @ok="handleSubmit" destroy-on-close>
    <div class="bind-factory">
      <div class="mt-4 bind-factory-cont">
        <a-checkbox-group v-model:value="state.factoryCodes" name="factoryId">
          <a-checkbox v-for="item in state.factoryList" :key="item.Code" :value="item.Code">{{ item.Code }}/{{ item.Name }}</a-checkbox>
        </a-checkbox-group>
        <Empty v-if="!state.factoryList.length" />
      </div>
      <a-divider style="margin: 15px 0" />
      <div>
        <div class="bold">{{ t(state.type == 'bind' ? 'common.bind' : 'common.unbind', [t('common.list')]) }}</div>
        <Grid></Grid>
      </div>
    </div>
  </BasicModal>
</template>
<script setup lang="ts">
  import { reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getFactoryList } from '/@/api/customerSerivce/index';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { Empty } from 'ant-design-vue';
  const { t } = useI18n();

  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  const state = reactive<{
    factoryCodes: string[];
    factoryList: { Code: string; Name: string }[];
    mainProcess: string;
    list: any[];
    submitApi: null | Function;
    title: string;
    type: 'bind' | 'unbind';
  }>({
    factoryCodes: [],
    factoryList: [],
    mainProcess: '1',
    list: [],
    submitApi: null,
    title: '',
    type: 'bind',
  });

  // 渲染列表
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'component-BindFactoryModal',
      columns: [
        {
          title: '半成品料号',
          field: 'semiFinishedProductsPartNumber',
          width: 200,
        },
        {
          title: '工厂',
          field: 'factoryNames',
          minWidth: 200,
        },
      ],
      showIndexColumn: true,
      pagerConfig: {
        enabled: false,
      },
      height: 350,
      i18nConfig: {
        moduleCode: 'SemiFinishedProductsColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      position: 'modal',
    },
  });

  function init(data: { type: 'bind' | 'unbind'; mainProcess: string; list: any[]; submitApi: Function; tableConfig?: any }) {
    state.mainProcess = data.mainProcess || '1';
    state.factoryCodes = [];
    state.type = data.type;
    state.title = data.type === 'bind' ? t('common.bind', [t('common.factory')]) : t('common.unbind', [t('common.factory')]);
    if (data.tableConfig) {
      gridApi.setGridOptions(data.tableConfig);
    }
    // 获取工厂列表
    handleGetFactor();
    // 获取列表详情
    state.list = data.list;
    gridApi.grid.reloadData(data.list);
    state.submitApi = data.submitApi;
  }

  function handleGetFactor() {
    if (state.factoryList.length) return;
    getFactoryList({
      mainProcess: state.mainProcess,
    }).then(res => {
      state.factoryList = res.data;
    });
  }
  async function handleSubmit() {
    if (state.factoryCodes.length === 0) {
      return createMessage.error('请选择工厂');
    }
    changeOkLoading(true);
    try {
      const res = await state.submitApi({
        ids: state.list.map(item => item.Id || item.id),
        factories: state.factoryCodes,
      });
      const { code } = res;
      if (code !== 200) {
        return changeOkLoading(false);
      }
      closeModal();
      createMessage.success(res.msg);
      emit('reload');
      changeOkLoading(false);
    } catch (error) {
      changeOkLoading(false);
    }
  }
</script>
<style lang="less">
  .bind-factory {
    .ant-checkbox-group {
      display: flex;
      flex-wrap: wrap;
      gap: 10px 10px;

      .ant-checkbox-wrapper {
        width: 200px;
      }
    }

    .bold {
      font-weight: bold;
      margin-bottom: 10px;
    }
  }
</style>
