<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :show-cancel-btn="false" :show-ok-btn="false" :title="t('sys.lang.machineTranslate')" :width="700">
    <BasicTable @register="registerTable">
      <template #tableTitle>
        <a-radio-group v-model:value="waitForReturn" button-style="solid">
          <a-radio-button :value="true">{{ t('sys.lang.waitForReturn') }}</a-radio-button>
          <a-radio-button :value="false">{{ t('sys.lang.backgroundTask') }}</a-radio-button>
        </a-radio-group>
        <a-button type="primary" preIcon="icon-ym icon-ym-btn-add" :loading="addLoading" @click="addFileHandle()">{{
          t('sys.lang.createMachineTranslaeFile')
        }}</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <p class="link-text" @click="downloadByUrl({ url: record.url })">{{ t('component.upload.download') }}</p>
        </template>
      </template>
    </BasicTable>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { translateFileList, exportData } from '/@/api/system/baseLang';
  import { downloadByUrl } from '/@/utils/file/download';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();
  const [registerModal, { closeModal }] = useModalInner();

  const waitForReturn = ref<boolean>(false);
  const { createMessage } = useMessage();
  const addLoading = ref<boolean>(false);

  const [registerTable, { reload }] = useTable({
    api: translateFileList,
    columns: [
      { title: t('common.fileName'), dataIndex: 'fileName' },
      { title: t('common.createTime'), dataIndex: 'fileTime', width: 100 },
    ],
    useSearchForm: true,
    pagination: false,
    formConfig: {
      baseColProps: { span: 16 },
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
      ],
    },
    actionColumn: {
      width: 40,
      title: t('common.action'),
      dataIndex: 'action',
    },
  });

  function addFileHandle() {
    addLoading.value = true;
    const listQuery = {
      apiTranslate: true,
      waitForReturn: waitForReturn.value,
    };

    console.log('listQuery', listQuery);

    exportData(listQuery)
      .then(res => {
        addLoading.value = false;
        if (waitForReturn.value) {
          if (!res.data.url) return;
          downloadByUrl({ url: res.data.url });
          reload();
        } else {
          createMessage.success(t('sys.lang.backgroundTaskDesc'));
        }
      })
      .catch(error => {
        addLoading.value = false;
        console.warn(error);
      });
  }
</script>
