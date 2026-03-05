<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable" :columns="columns">
          <template #tableTitle>
            <a-button type="primary" preIcon="icon-ym icon-ym-btn-add" @click="addOrUpdateHandle()">{{ t('common.addText') }}</a-button>
            <a-button type="primary" @click="openTranslateModal(true, {})">{{ t('sys.lang.machineTranslate') }}</a-button>
            <a-button type="link" @click="openImportModal(true, {})">
              <i class="icon-ym icon-ym-btn-upload button-preIcon"></i>{{ t('common.importText') }}
            </a-button>
            <a-button type="link" :loading="exportLoading" @click="handleExport()">
              <i class="icon-ym icon-ym-btn-download button-preIcon"></i>{{ t('common.exportText') }}
            </a-button>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'code'">
              <p @dblclick="copyCode(record.code)">{{ record.code }}</p>
            </template>
            <template v-if="column.key === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
      <Form @register="registerForm" @reload="reload" />
      <ImportModal @register="registerImportModal" @reload="reload" />
      <TranslateModal @register="registerTranslateModal" @reload="reload" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onBeforeMount, ref } from 'vue';
  import { getBaseLangList, delBaseLang, exportData } from '/@/api/system/baseLang';
  import { BasicTable, useTable, TableAction, BasicColumn, ActionItem } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import Form from './Form.vue';
  import ImportModal from './ImportModal.vue';
  import TranslateModal from './TranslateModal.vue';
  import { copyTextToClipboard } from '/@/hooks/web/useCopyToClipboard';

  defineOptions({ name: 'commonWords' });

  const baseStore = useBaseStore();
  const { createMessage } = useMessage();
  const { t } = useI18n();
  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerImportModal, { openModal: openImportModal }] = useModal();
  const [registerTranslateModal, { openModal: openTranslateModal }] = useModal();
  const categoryList = ref<any[]>([]);
  const columns = ref<BasicColumn[]>([]);
  const exportLoading = ref<boolean>(false);
  const typeOptions = ref<any[]>([]);
  // const typeOptions = [
  //   { id: 0, fullName: t('dict.TranslateType.client') },
  //   { id: 1, fullName: t('dict.TranslateType.server') },
  // ];

  const [registerTable, { reload, getFetchParams, getForm }] = useTable({
    api: getBaseLangList,
    useSearchForm: true,
    formConfig: {
      schemas: [
        {
          field: 'keyword',
          label: t('common.keyword'),
          component: 'Input',
          componentProps: {
            placeholder: t('common.enterKeyword'),
            submitOnPressEnter: true,
          },
        },
        {
          field: 'type',
          label: t('dict.TranslateType'),
          component: 'Select',
          componentProps: { fieldNames: { value: 'enCode' } },
        },
      ],
    },
    actionColumn: {
      width: 100,
      title: t('common.action'),
      dataIndex: 'action',
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
  function addOrUpdateHandle(id = '') {
    openFormModal(true, { id, categoryList: categoryList.value, typeOptions: typeOptions.value });
  }
  function handleDelete(id) {
    delBaseLang(id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }
  async function getColumns() {
    const preList = [
      { title: t('label.TranslationTag'), dataIndex: 'code' },
      { title: t('dict.TranslateType'), dataIndex: 'typeName', width: 100 },
    ];
    categoryList.value = (await baseStore.getDictionaryData('Language', false, false)) as any[];
    let list: any[] = categoryList.value.map(o => ({ title: o.fullName, dataIndex: o.enCode }));
    columns.value = [...preList, ...list];
  }

  async function getTypeOptions() {
    const typeRes = await baseStore.getDictionaryData('TranslateType', true, true);
    typeOptions.value = typeRes as any[];
    getForm().updateSchema({ field: 'type', componentProps: { options: typeRes } });
  }

  function handleExport() {
    exportLoading.value = true;
    const listQuery = {
      type: getFetchParams().type,
      keyword: getFetchParams().keyword,
    };

    console.log('listQuery', listQuery);
    exportData(listQuery)
      .then(res => {
        exportLoading.value = false;
        if (!res.data.url) return;
        downloadByUrl({ url: res.data.url });
      })
      .catch(error => {
        exportLoading.value = false;
        console.warn(error);
      });
  }

  function copyCode(code) {
    copyTextToClipboard(`t('${code}')`);
    createMessage.success(t('common.copySuccess'));
  }

  onBeforeMount(async () => {
    console.log('language on Mounted');
    await getColumns();
    await getTypeOptions();
  });
</script>
