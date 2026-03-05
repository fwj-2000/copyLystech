<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="handleSearch" @reset="handleReset" />
      </div>

      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 新增 -->
              <a-button type="primary" @click="handleAdd" v-auth="'btn_add'">{{ t('common.add') }}</a-button>
            </a-space>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ApplyPop @register="registerApply" @reload="reload" />

    <PrintInputModal @register="registerPrintInput" @openPrintPop="handleOpenPrintPop"> </PrintInputModal>
    <PrintPop @register="registerPrintPop" />
    <PrintListPop @register="registerPrintListPop" @handleReprint="handleReprint" />
    <designindex v-show="false" ref="designindexPrint" />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getProduceCodeRulePage, del } from '/@/api/basicData/moduleRules';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { columns, getFormSchema } from './components/config';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import PrintPop from './components/printPop.vue';
  import PrintListPop from './components/printListPop.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ApplyPop from './components/ApplyPop.vue';
  import PrintInputModal from './components/printInputModal.vue';
  import { usePopup } from '/@/components/Popup';
  import { getPrintTemplateDetail, getAllPrintTemplate } from '/@/api/productionDeal/packagePrint';
  import designindex from '/@/views/system/printTemplate/components/LydcPrintDesign/src/designIndex.vue';

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  defineOptions({ name: 'basicData-produceCodeRules' });
  const { createMessage, createConfirm } = useMessage();
  const [registerApply, { openPopup: openApplyPop }] = usePopup();
  const [registerPrintInput, { openModal: openPrintInput }] = useModal();
  const [registerPrintPop, { openPopup: openPrintPop }] = usePopup();
  const [registerPrintListPop, { openPopup: openPrintList }] = usePopup();

  interface DesignindexPrintType {
    clickTemplate: (data: any) => void;
    previewPrint: (data: any) => void;
  }

  const designindexPrint = ref<DesignindexPrintType>();

  const [registerForm, { getFieldsValue, clearValidate }] = useForm({
    baseColProps: { span: 5 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    autoAdvancedLine: 1,
    actionColOptions: {
      span: 4,
    },
    schemas: getFormSchema(),
    i18nConfig: {
      moduleCode: 'BusinessRuleColumn',
      transferRange: ['placeholder'],
    },
  });

  const [Grid, { reload }] = useVbenVxeGrid({
    gridOptions: {
      id: 'basicData-produceCodeRules-list',
      columns: columns(),
      api: getProduceCodeRulePage,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'BusinessRuleColumn',
      },
      beforeFetch: params => {
        return {
          ...params,
          ...getFieldsValue(),
        };
      },
      rowConfig: {
        keyField: 'Id',
      },
    },
  });

  function handleAdd() {
    openApplyPop(true, {});
  }

  // 操作
  function getTableActions(record) {
    return [
      {
        icon: 'icon-ym icon-ym-report-icon-preview-printPreview',
        onClick: handlePrint.bind(null, record),
        auth: 'btn_print',
        tooltip: t('dict.CommonCol.print'),
      },
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleView.bind(null, record),
        auth: 'btn_detail',
        tooltip: t('common.view'),
      },
      {
        icon: 'icon-ym icon-ym-edit',
        onClick: handleEdit.bind(null, record),
        auth: 'btn_edit',
        tooltip: t('common.editText'),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: onDelete.bind(null, record.Id),
        },
        auth: 'btn_remove',
        tooltip: t('common.delText'),
      },
    ];
  }

  async function handleOpenPrintPop(data) {
    const list = data.map(item => {
      return {
        ...item,
        templateName: state.value.templateName,
      };
    });
    getPrintTemplateDetail(state.value.templateId).then(res => {
      if (designindexPrint.value && designindexPrint.value.clickTemplate) {
        designindexPrint.value.clickTemplate(res.data);
        designindexPrint.value.previewPrint(list);
      }
    });
    // openPrintPop(true, data);
  }

  function handleReprint(data) {
    if (!state.value.templateId) return createMessage.warning(t('dict.CommonCol.templateUnConfigured'));
    const list = data.map(item => {
      return {
        ...item,
        templateName: state.value.templateName,
      };
    });
    getPrintTemplateDetail(state.value.templateId).then(res => {
      if (designindexPrint.value && designindexPrint.value.clickTemplate) {
        designindexPrint.value.clickTemplate(res.data);
        designindexPrint.value.previewPrint(list);
      }
    });
    // openPrintPop(true, rows);
  }

  function handlePrint(row) {
    if (!state.value.templateId) return createMessage.warning(t('dict.CommonCol.templateUnConfigured'));
    openPrintInput(true, row);
  }

  function handleView(row) {
    openPrintList(true, row);
  }

  function handleEdit(record) {
    openApplyPop(true, {
      type: 'edit',
      list: [record],
    });
  }

  async function onDelete(id) {
    const { code, msg } = await del(id);
    if (code === 200) {
      createMessage.success(msg);
      reload();
    }
  }

  function handleSearch() {
    reload();
  }

  function handleReset() {
    clearValidate();
    reload();
  }

  const state = ref({
    templateId: '',
    templateName: '',
  });
  onMounted(async () => {
    reload();
    const { data } = await getAllPrintTemplate({ firstCategoryCode: 'HotPressLabel' });
    state.value.templateId = data[0].id;
    state.value.templateName = data[0].name;
  });
</script>

<style lang="less" scoped>
  .lydc-content-wrapper {
    position: absolute;
  }

  .btn-wrapper {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .left-btn {
    display: flex;

    button {
      margin-right: 16px;
    }

    // 选择第二个按钮
    button:nth-child(2) {
      border: #ff7b00 solid 1px;
      color: #ff7b00;
    }
  }
</style>
