<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #key="{ row }">
            <a-tag v-for="(v, i) in row.key" :key="i">{{ v }}</a-tag>
          </template>
          <!-- <template #toolbar-actions>
            <a-button type="primary" preIcon="icon-ym icon-ym-btn-add" @click="createTemplate1()">{{ t('common.addText') }}</a-button>
          </template> -->
          <!-- <template #action="{ rowIndex, row }">
            <div style="display: flex">
              <a-switch :checked="!row.checkVisibility" @change="handleChange(row)" style="margin-right: 6px" />
              <TableAction :outside="true" :actions="getTableActions(row)" :dropDownActions="getDropDownActions(row)" />
            </div>
          </template> -->
        </Grid>
      </div>
    </div>
    <Form @register="addRegisterFrom" @reload="reload" @submit="addFormSubmit" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, reactive } from 'vue';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useBaseStore } from '/@/store/modules/base';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getPrintTemplateColumns } from './config';
  import { defaultShortcutConfig } from '/@/hooks/web/useShortcutManager';
  import Form from './Form.vue';

  defineOptions({ name: 'system-shortcutKey' });
  const [addRegisterFrom, { openModal: openAddPopup }] = useModal();
  const { t } = useI18n();
  const baseStore = useBaseStore();
  const { createMessage } = useMessage();
  const categoryList = ref<any[]>([]);
  const [Grid, { reload }] = useVbenVxeGrid({
    gridOptions: {
      id: 'business-process-list',
      columns: getPrintTemplateColumns as any,
      showIndexColumn: true,
      // api: getPrintTemplate,
      i18nConfig: {
        moduleCode: 'common',
      },
      columnConfig: {
        isCurrent: true, // 启用列高亮
      },
      currentColumnConfig: {
        isFollowSelected: true, // 高亮跟随选中
      },
      data: defaultShortcutConfig as any,
    },
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        label: t('common.editText'),
        onClick: addOrUpdateHandle.bind(null, record.id),
      },
      {
        label: t('common.delText'),
        color: 'error',
        modelConfirm: {
          onOk: handleDelete.bind(null, record.id),
        },
      },
    ];
  }
  // function getDropDownActions(record): ActionItem[] {
  //   return [
  //     {
  //       label: t('common.copy'),
  //       onClick: handleCopy.bind(null, record),
  //     },
  //   ];
  // }
  // function handleCopy(record) {}
  function addOrUpdateHandle(id = '') {
    openAddPopup(true, {});
  }
  const isOpenModal = ref(false);
  // 启用禁用
  const handleChange = row => {
    // disableEnable({ ids: [row.id], status: !row.enable }).then(res => {
    //   createMessage.success(res.msg);
    //   reload();
    // });
  };

  const createTemplate1 = () => {
    //
    openAddPopup(true, {});
  };
  const addFormSubmit = async (formValue, state, treeData) => {};
  function handleDelete(id) {
    // deletePrintTemplate({ ids: [id] }).then(res => {
    //   createMessage.success(res.msg);
    //   reload();
    // });
  }
  async function getOptions() {
    categoryList.value = (await baseStore.getDictionaryData('PrintTemplate.Category')) as any[];
  }

  onMounted(() => {
    getOptions();
  });
</script>
