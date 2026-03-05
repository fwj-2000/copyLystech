<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box pb-10px">
        <BasicForm @register="registerForm">
          <template #formFooter>
            <a-button type="primary" class="ml-3" @click="searchFn">{{ t('common.queryText') }}</a-button>
            <a-button class="ml-3" @click="resetFn">{{ t('common.resetText') }}</a-button>
          </template>
        </BasicForm>
      </div>
      <div class="lydc-content-wrapper-content bg-white">
        <Grid v-loading="isLoading">
          <template #toolbar-actions>
            <a-space class="btn-block">
              <a-button @click="addFn" type="primary"> {{ t('common.add') }}</a-button>
              <a-button @click="enableFn" type="primary" ghost> {{ t('common.enableText') }}</a-button>
              <a-button @click="disabledFn" type="error" ghost> {{ t('common.disableText') }}</a-button>
              <a-button @click="batchDelFn" type="error" ghost> {{ t('common.batchDelText') }}</a-button>
              <!-- <a-button @click="delFn" type="error" ghost> {{ t('common.delText') }}</a-button> -->
            </a-space>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <AddModal @register="registeAddModal" @reload="reloadFn" />
    <FlowPop @register="registerFlowPop" @refresh="reloadFn" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useModal } from '/@/components/Modal/index.js';
  import { BasicForm, useForm } from '/@/components/Form';
  import { usePopup } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columns, schemas } from './config';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { deleteFlow, disableFlow, enableFlow, getFlowList } from '/@/api/coreCommon/flow.js';
  import AddModal from './components/AddModal.vue';
  import FlowPop from './components/flow/FlowPop.vue';
  import { useFlowSettingStore } from '/@/store/modules/flowSetting.js';
  defineOptions({ name: 'qms-processNodeConfiguration' });
  const useFlowSetting = useFlowSettingStore();

  const { t } = useI18n();
  const isLoading = ref(false);
  const { createMessage } = useMessage();
  const [registeAddModal, { openModal: openAddModal }] = useModal();
  const [registerFlowPop, { openPopup: openFlowPop }] = usePopup();

  const [registerForm, { getFieldsValue, resetFields }] = useForm({
    baseColProps: { span: 6 },
    schemas,
  });
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'qms-processNodeConfiguration',
      columns,
      api: params => getFlowList({ ...params, ...getFieldsValue() }),
    },
  });

  function getTableActions(row: any): ActionItem[] {
    return [
      {
        // icon: 'icon-ym icon-ym-view',
        label: '配置流程',
        onClick: handleDesign.bind(null, row),
        tooltip: t('common.detailText'),
      },
      {
        icon: 'icon-ym icon-ym-edit',
        onClick: handleEdit.bind(null, row),
        tooltip: t('common.editText'),
      },
      {
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('common.delText'),
        modelConfirm: {
          onOk: handleDel.bind(null, row),
        },
      },
    ];
  }

  function addFn() {
    openAddModal(true, {});
  }
  async function enableFlowFn(params) {
    isLoading.value = true;
    try {
      const { code, msg } = await enableFlow(params);
      if (code === 200) {
        createMessage.success(msg);
        reloadFn();
      }
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  }
  async function disableFlowFn(params) {
    isLoading.value = true;
    try {
      const { code, msg } = await disableFlow(params);
      if (code === 200) {
        createMessage.success(msg);
        reloadFn();
      }
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function enableFn(row) {
    const id = await beforeValidateModal();
    if (!id) return;
    enableFlowFn(id);
  }
  async function disabledFn(row) {
    const id = await beforeValidateModal();
    if (!id) return;
    disableFlowFn(id);
  }

  async function deleteFlowFn(params) {
    isLoading.value = true;
    try {
      const { code, msg } = await deleteFlow(params);
      if (code === 200) {
        createMessage.success(msg);
        reloadFn();
      }
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  }
  async function batchDelFn() {
    const id = await beforeValidateModal();
    if (!id) return;
    deleteFlowFn(id);
    // const grid = gridApi.grid;
    // const selectRows = grid.getCheckboxRecords(true);
    // if (!selectRows.length) {
    //   createMessage.error(t('common.selectText'));
    //   return;
    // }
    // const ids = selectRows.map(item => item.id);
    // deleteFlowFn(ids);
  }
  function handleEdit(row) {
    openAddModal(true, { data: row });
  }
  function handleDel(row) {
    deleteFlowFn(row.id);
  }

  function handleDesign(row: any) {
    useFlowSetting.setStateVal('dictKey', row.nodeDic);
    openFlowPop(true, { id: row.id, title: t('layout.header.setting'), routeStatus: row.routeStatus });
  }

  // async function mrbBulkDeleteFn(id) {
  //   try {
  //     const { data, code, msg } = await mrbBulkDelete([id]);
  //     if (code === 200) {
  //       reloadFn();
  //       createMessage.success(msg);
  //     }
  //   } catch (error) {
  //   } finally {
  //   }
  // }

  function searchFn() {
    gridApi?.query();
  }
  function reloadFn() {
    gridApi?.reload();
  }

  function resetFn() {
    resetFields();
    setTimeout(() => {
      gridApi?.query();
    }, 300);
  }

  function beforeValidateModal(): string[] | false {
    const grid = gridApi.grid;
    const selectRows = grid.getCheckboxRecords(true);
    if (!selectRows.length) {
      createMessage.error(t('common.selectText'));
      return false;
    } else if (selectRows.length > 1) {
      createMessage.error('只能选择一条数据');
      return false;
    }
    const id = selectRows[0].id;
    return id;
  }

  onMounted(() => {
    gridApi.query();
  });
</script>

<style lang="less" scoped>
  .btn-block button {
    display: flex;
    align-items: center;
  }
</style>
