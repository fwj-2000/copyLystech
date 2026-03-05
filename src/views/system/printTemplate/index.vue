<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <!-- <a-button type="primary" preIcon="icon-ym icon-ym-btn-add" @click="createTemplate()">{{ '打开H模板' }}</a-button> -->
            <a-button type="primary" preIcon="icon-ym icon-ym-btn-add" @click="createTemplate1()">{{ t('common.addText') }}</a-button>
            <!-- <lydc-upload-btn url="/api/system/printDev/Actions/Import" accept=".bp" @on-success="waitReload"></lydc-upload-btn> -->
          </template>
          <template #category="{ row }">
            <div>{{ row.category + '1231' }}</div>
          </template>
          <template #action="{ rowIndex, row }">
            <div style="display: flex">
              <a-switch :checked="!row.enable" @change="handleChange(row)" style="margin-right: 6px" />
              <TableAction :outside="true" :actions="getTableActions(row)" :dropDownActions="getDropDownActions(row)" />
            </div>
          </template>
        </Grid>
      </div>
    </div>
    <addForm @register="addRegisterFrom" @reload="waitReload" @submit="addFormSubmit" />
    <copyForm @register="copyRegisterFrom" @reload="waitReload" />
    <PrintDesignModal
      @register="registerPrintDesignModal"
      :templateValue="templateValue"
      :treeDataValue="treeDataValue"
      :templateData="templateData"
      @reload="waitReload" />
    <PrintDesignPopup
      @register="registerPrintDesignPop"
      :templateValue="templateValue"
      :treeDataValue="treeDataValue"
      :templateData="templateData"
      @reload="waitReload" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, reactive } from 'vue';
  import { BasicTable, useTable, TableAction, BasicColumn, ActionItem } from '/@/components/Table';
  import { getPrintTemplate, deletePrintTemplate, disableEnable } from '/@/api/system/printTemplate';
  import { useModal } from '/@/components/Modal';
  import { usePopup } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useBaseStore } from '/@/store/modules/base';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getPrintTemplateColumns, getCommonColumns, getPrintTemplateFormConfig } from './config';
  import addForm from './addForm.vue';
  import copyForm from './copyForm.vue';
  import PrintDesignModal from './components/LydcPrintDesign/PrintDesignModal.vue';
  import PrintDesignPopup from './components/LydcPrintDesign/PrintDesignPopup.vue';

  defineOptions({ name: 'system-printDev' });

  const { t } = useI18n();
  const baseStore = useBaseStore();
  const { createMessage } = useMessage();
  const categoryList = ref<any[]>([]);

  const [registerPrintDesignModal, { openModal: openPrintDesignModal }] = useModal();
  const [registerPrintDesignPop, { openPopup: openPrintDesignPopup }] = usePopup();

  const [
    Grid,
    {
      getSelectRows: waitGetSelectRows,
      getSelectRowKeys: waitGetSelectRowKeys,
      clearSelectedRowKeys: waitClearSelectedRowKeys,
      setLoading: waitSetLoading,
      reload: waitReload,
      setFieldValue: waitSetFieldValue,
      getFetchParams,
    },
  ] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: getPrintTemplateFormConfig(),
      i18nConfig: {
        moduleCode: 'CommonCol',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'business-process-list',
      columns: getPrintTemplateColumns(),
      showIndexColumn: true,
      showFooter: false,
      api: getPrintTemplate,
      rowConfig: {
        keyField: 'id',
        isCurrent: false, // 完全禁用行高亮
      },
      i18nConfig: {
        moduleCode: 'common',
      },
      columnConfig: {
        isCurrent: true, // 启用列高亮
      },
      currentColumnConfig: {
        isFollowSelected: true, // 高亮跟随选中
      },
    },
  });

  const [addRegisterFrom, { openModal: openAddPopup }] = useModal();
  const [copyRegisterFrom, { openModal: openCopyPopup }] = useModal();

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
  function getDropDownActions(record): ActionItem[] {
    return [
      {
        label: t('common.copy'),
        onClick: handleCopy.bind(null, record),
      },
    ];
  }
  function handleCopy(record) {
    openCopyPopup(true, { record });
  }
  function addOrUpdateHandle(id = '') {
    openAddPopup(true, { id, categoryList: categoryList.value });
  }
  const isOpenModal = ref(false);
  const templateData = ref({});
  const templateValue = ref({});
  const treeDataValue = ref([]);
  // 启用禁用
  const handleChange = row => {
    disableEnable({ ids: [row.id], status: !row.enable }).then(res => {
      createMessage.success(res.msg);
      waitReload();
    });
  };

  const createTemplate1 = () => {
    openAddPopup(true, {
      id: '',
      title: '创建打印模板',
    });
    isOpenModal.value = false;
  };
  const addFormSubmit = async (formValue, state, treeData) => {
    templateData.value = formValue;
    templateValue.value = state;
    treeDataValue.value = treeData;

    if (isOpenModal.value) {
      openPrintDesignModal(true, {
        id: '',
        title: '创建打印模板',
      });
    } else {
      openPrintDesignPopup(true, {
        id: '',
        title: '创建打印模板',
      });
    }
  };
  function handleDelete(id) {
    deletePrintTemplate({ ids: [id] }).then(res => {
      createMessage.success(res.msg);
      waitReload();
    });
  }
  async function getOptions() {
    categoryList.value = (await baseStore.getDictionaryData('PrintTemplate.Category')) as any[];
  }

  onMounted(() => {
    getOptions();
  });
</script>
