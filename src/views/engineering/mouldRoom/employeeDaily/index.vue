<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_download'" class="mr-12px" @click="handleExport">{{ t('common.batchExport') }}</a-button>
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" />
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { EmployeeDailyReport, EmployeeDailyReportExport } from '/@/api/engineering/employeeDaily';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { column, getFormSchema, getExportColumn } from './config';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { dateUtil } from '/@/utils/dateUtil';

  const { t } = useI18n();
  defineOptions({ name: 'engineering-mouldRoom-employeeDaily' });
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();

  const [Grid, { reload, getSelectRows, getFetchParams }] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: getFormSchema(),
      i18nConfig: {
        moduleCode: 'RepairMoldColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-mouldRoom-employeeDaily',
      columns: column as any,
      api: EmployeeDailyReport,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'employeeDaily',
      },
      beforeFetch: params => {
        const _params = {
          ...params,
        };
        if (params.pickerVal && params.pickerVal.length > 0) {
          _params.StartTime = dateUtil(params.pickerVal[0]).valueOf();
          _params.EndTime = dateUtil(params.pickerVal[1]).valueOf();
          delete _params.pickerVal;
        }
        if (params.planDate) {
          _params.planDate = dateUtil(params.planDate).valueOf();
        }
        return _params;
      },
    },
  });

  //导出
  const handleExport = async () => {
    let arr = await getFetchParams();
    if (arr.pickerVal && arr.pickerVal.length > 0) {
      arr.StartTime = dateUtil(arr.pickerVal[0]).valueOf();
      arr.EndTime = dateUtil(arr.pickerVal[1]).valueOf();
      delete arr.pickerVal;
    }
    openExportModal(true, {
      api: EmployeeDailyReportExport,
      listQuery: arr,
      exportOptions: column,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'ProcessColumn',
      },
    });
  };
</script>
