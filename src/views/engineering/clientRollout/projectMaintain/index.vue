<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="reload" @reset="reload" />
      </div>
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 项目维护阶段 -->
              <a-button type="primary" v-auth="'btn_maintain'" @click="handleMaintain">{{ t('dict.CommonCol.projectMaintenance') }}</a-button>
              <a-button ghost type="primary" v-auth="'btn_transitionStage'" @click="handleTransitionStage">{{ t('dict.CommonCol.transitionStage') }}</a-button>
              <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
          <template #stageChangeLog="{ row }">
            <div class="table-a" v-auth="'btn_detail'" @click="handleDetail(row.id)">{{ t('common.viewDetails') }} </div>
          </template>
        </Grid>
      </div>
    </div>
    <!-- <ProjectMaintainPopup @register="registerProjectMaintain" @reload="reload"></ProjectMaintainPopup> -->
    <DetailPopup @register="registerDetailPopup"></DetailPopup>
    <TransitionStageModal @register="registerTransitionStageModal" @reload="reload"></TransitionStageModal>
    <ExportModal @register="registerExportModal" @export="exportAction" />
    <ProjectMaintainModal @register="registerProjectMaintain" @reload="reload"> </ProjectMaintainModal>
  </div>
</template>
<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { columns, getFormSchema, getExportColumn } from './config';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getProjectStage, projectStageExportData } from '/@/api/engineering/clientRollout';
  // import { usePopup } from '/@/components/Popup';
  // import ProjectMaintainPopup from './components/ProjectMaintainPopup.vue';
  import { useModal } from '/@/components/Modal';
  import DetailPopup from './components/DetailPopup.vue';
  import TransitionStageModal from './components/TransitionStageModal.vue';
  import { message } from 'ant-design-vue';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { downloadByUrl } from '/@/utils/file/download';
  import ProjectMaintainModal from './components/ProjectMaintainModal.vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { getFactoryList } from '/@/api/basicData/productCodeApply';

  const { t } = useI18n();

  defineOptions({ name: 'engineering-clientRollout-projectMaintain' });

  const [registerProjectMaintain, { openModal: openProjectMaintain }] = useModal();
  const [registerDetailPopup, { openModal: openDetailPopup }] = useModal();
  const [registerTransitionStageModal, { openModal: openTransitionStageModal }] = useModal();
  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();

  const [registerForm, { getFieldsValue }] = useForm({
    baseColProps: { span: 4 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    autoAdvancedLine: 1,
    actionColOptions: {
      span: 4,
    },
    i18nConfig: {
      moduleCode: 'NpiProjectStageColumn',
      transferRange: ['placeholder'],
    },
    schemas: [
      // {
      //   field: 'factory',
      //   label: '',
      //   component: 'Input',
      //   componentProps: {
      //     placeholder: '工厂',
      //     allowClear: true,
      //   },
      //   i18nField: 'FactoryName',
      // },
      {
        field: 'factory',
        label: '',
        component: 'ApiSelect',
        componentProps: {
          api: getFactoryList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          immediate: true,
        },
        i18nField: 'CommonCol.factoryName',
      },
      {
        field: 'insidePartNumber',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '产品内部料号',
          allowClear: true,
        },
        i18nField: 'CommonCol.insidePartNumber',
      },
      {
        field: 'pickerVal',
        label: '',
        labelWidth: 100,
        component: 'DateRange',
      },
      {
        field: 'directCustomer',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: '直接客户代码',
          allowClear: true,
        },
        i18nField: 'CommonCol.immediateCustomerCode',
      },
      {
        field: 'maintainersUserId',
        label: '',
        component: 'CustomUserSelect',
        componentProps: {
          placeholder: '修改人',
        },
        i18nField: 'CommonCol.updateUser',
      },
    ],
    fieldMapToTime: [['pickerVal', ['maintainersStartTime', 'maintainersEndTime']]],
  });

  const [Grid, { reload, getSelectRows, getFetchParams }] = useVbenVxeGrid({
    // formOptions: {
    //   showCollapseButton: false,
    //   // 是否在字段值改变时提交表单
    //   submitOnChange: false,
    //   // 按下回车时是否提交表单
    //   submitOnEnter: true,
    //   commonConfig: {
    //     componentProps: {},
    //     labelClass: 'w-0',
    //   },
    //   wrapperClass: 'grid grid-cols-5 gap-4',
    //   schema: getFormSchema(),
    //   i18nConfig: {
    //     moduleCode: 'NpiProjectStageColumn',
    //     transferRange: ['placeholder'],
    //   },
    // },
    gridOptions: {
      id: 'engineering-clientRollout-projectMaintain-list',
      columns,
      api: getProjectStage,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'NpiProjectStageColumn',
      },
      // 当数据源被更改时，自动将纵向滚动条滚动到顶部
      virtualYConfig: {
        scrollToTopOnChange: true,
      },
      beforeFetch: params => {
        return {
          ...params,
          ...getFieldsValue(),
        };
      },
    },
  });

  // 项目维护阶段
  const handleMaintain = () => {
    const rows = getSelectRows();
    if (!rows.length) return message.warning(t('dict.CheckDataTip'));
    let productLineCodeSame = true;
    let terminalCustomerCodeSame = true;
    if (rows.length > 1) {
      const firstRow = rows[0];
      productLineCodeSame = rows.every(item => item.productLineCode === firstRow.productLineCode);
      terminalCustomerCodeSame = rows.every(item => item.terminalCustomerCode === firstRow.terminalCustomerCode);
    }
    if (!productLineCodeSame || !terminalCustomerCodeSame) {
      return message.warning(t('dict.CommonCol.customersProductlinesConsistent'));
    }
    openProjectMaintain(true, { row: rows[0], ids: rows.map(item => item.id) });
  };

  // 转阶段
  const handleTransitionStage = () => {
    const rows = getSelectRows();
    if (!rows.length) return message.warning(t('dict.CheckDataTip'));
    if (rows.some(item => item.status === 0)) {
      return message.warning(t('dict.CommonCol.transferredTip'));
    }
    let productLineCodeSame = true;
    let terminalCustomerCodeSame = true;
    if (rows.length > 1) {
      const firstRow = rows[0];
      productLineCodeSame = rows.every(item => item.productLineCode === firstRow.productLineCode);
      terminalCustomerCodeSame = rows.every(item => item.terminalCustomerCode === firstRow.terminalCustomerCode);
    }
    if (!productLineCodeSame || !terminalCustomerCodeSame) {
      return message.warning(t('dict.CommonCol.customersProductlinesConsistent'));
    }
    openTransitionStageModal(true, { row: rows[0], ids: rows.map(item => item.id) });
  };

  // 查看阶段变更记录
  const handleDetail = id => {
    openDetailPopup(true, { id });
  };

  // 批量导出
  const handleExport = async () => {
    const exportColumns = getExportColumn();
    openExportModal(true, {
      listQuery: {
        ...(await getFetchParams()),
        ...getFieldsValue(),
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
    });
  };

  function exportAction(query) {
    projectStageExportData(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  }

  onMounted(() => {
    reload();
  });
</script>
<style lang="less" scoped>
  .title-stick {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .gun {
      border-radius: 2px;
      background: #ff7b00;
      width: 2px;
      height: 14px;
      margin-right: 10px;
    }

    .title {
      color: #1a1a1a;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 22px; /* 157.143% */
    }
  }

  .search-bar {
    display: flex;
    align-items: center;

    .search-form {
      flex: 1;
    }

    .search-time {
      margin-left: 100px;
      display: flex;
      align-items: center;
    }
  }

  .data-info {
    margin-top: 20px;
    display: flex;

    .number-box {
      flex: 1;

      .panel {
        display: flex;
        margin-bottom: 20px;
      }
    }
  }

  .dark-blue {
    border-top: 4px solid #3874ff;
    background: #ccdbff;
  }

  .light-blue {
    border-top: 4px solid #5ebeff;
    background: #cceaff;
  }

  .green {
    border-top: 4px solid #4bbeaa;
    background: #ccffe7;
  }

  .yellow-green {
    border-top: 4px solid #72ed25;
    background: #e0ffcc;
  }

  .yellow {
    border-top: 4px solid #facc14;
    background: #fec;
  }

  .aqua {
    border-top: 4px solid #25ede3;
    background: #ccfffc;
  }

  .orange {
    border-top: 4px solid #ff7b00;
    background: #ffe5cc;
  }
</style>
