<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="handleSubmit" :showResetButton="false" />
      </div>
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button type="primary" @click="handleAdd" v-auth="'btn_add'"> {{ t('common.add2Text') }} </a-button>

              <a-button type="primary" v-auth="'btn_upload'" @click="templateDownloadFile({ fileName: '模板名称' })" :loading="templateDownloading">
                {{ t('common.exportTemplate') }}
              </a-button>

              <!-- 批量导入 -->
              <SingleUpload v-bind="uploadOption" v-auth="'btn_upload'" :afterUpload="reload" class="-ml-10px"></SingleUpload>
            </a-space>
          </template>

          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>

    <FormModal @register="registerFormModal" @reload="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import dayjs from 'dayjs';
  import { cloneDeep } from 'lodash-es';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useDownload } from '/@/views/dashboard/hooks/useDownload';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useModal } from '/@/components/Modal';
  import { columns } from './config';

  import { getManpowertargetPage, deleteManpowertarget, templatedownload } from '/@/api/hr/hrGoals';

  import SingleUpload from '/@/views/dashboard/operate/components/SingleUpload.vue';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import FormModal from './components/formModal.vue';

  import type { ManpowertargetItem } from '/@/api/hr/hrGoals';

  defineOptions({ name: 'hrBis-hrGoals' });

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [registerFormModal, { openModal: openFormModal }] = useModal();

  const searchInfo = ref({
    archiveGroup: '',
    factory: '',
    department: '',
    directClassify: '',
    postName: '',
    natureEmployment: '',
    month: '',
  });
  const uploadOption = ref({
    api: '/api/hrbis/manpowertarget/importdata',
    buttonText: t('common.batchImport'),
  });

  const [registerForm] = useForm({
    baseColProps: { span: 5 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    autoAdvancedLine: 1,
    labelWidth: 90,
    actionColOptions: {
      span: 4,
    },
    i18nConfig: {
      moduleCode: 'HrGoalsColumn',
      transferRange: ['placeholder'],
    },
    schemas: [
      // 档案分组
      {
        field: 'archiveGroup',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '档案分组',
        },
      },
      // 厂区
      {
        field: 'factory',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '厂区',
        },
      },
      // 部门
      {
        field: 'department',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '部门',
        },
      },
      // 直/间接分类
      {
        field: 'directClassify',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '直/间接分类',
        },
      },
      // 岗位名称
      {
        field: 'postName',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '岗位名称',
        },
      },
      // 工作性质
      {
        field: 'natureEmployment',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '工作性质',
        },
      },
      // 年月份
      {
        field: 'month',
        label: '',
        component: 'MonthPicker',
        defaultValue: dayjs().subtract(0, 'month'),
        componentProps: {
          picker: 'month',
          format: 'YYYY-MM',
          placeholder: '年月份',
        },
      },
    ],
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'hrBis-hrGoals-list',
      columns,
      api: getManpowertargetPage,
      keyboardConfig: {
        isBack: false,
      },
      pagerConfig: {
        autoHidden: false,
      },
      // @ts-ignore
      beforeFetch: params => {
        return {
          ...params,
          ...searchInfo.value,
        };
      },
      i18nConfig: {
        moduleCode: 'HrGoalsColumn',
      },
    },
  });

  const { loading: templateDownloading, downloadFile: templateDownloadFile } = useDownload({
    requestApi: templatedownload,
  });

  function handleSubmit(values) {
    searchInfo.value = values;
    searchInfo.value.month = dayjs(values.month).format('YYYYMM');
    reload();
  }

  function getTableActions(record: ManpowertargetItem) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleEdit.bind(null, record),
        auth: 'btn_edit',
        tooltip: t('common.editText'),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleDelete.bind(null, record),
        },
        auth: 'btn_remove',
        tooltip: t('common.delText'),
      },
    ];
  }

  function reload() {
    gridApi.reload();
  }

  function handleEdit(row: ManpowertargetItem) {
    openFormModal(true, cloneDeep(row));
  }

  function handleAdd() {
    openFormModal(true, {});
  }

  async function handleDelete(row: ManpowertargetItem) {
    return deleteManpowertarget(row.id as string)
      .then(res => {
        res.code === 200 && createMessage.success(res.msg || t('common.delSuccess'));
      })
      .finally(reload);
  }

  onMounted(() => {
    searchInfo.value.month = dayjs().subtract(0, 'month').format('YYYYMM');
    reload();
  });
</script>
