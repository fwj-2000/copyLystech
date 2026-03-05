<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="handleSearch" @reset="initData" />
      </div>

      <div class="lydc-content-wrapper-content bg-white">
        <Statistics :summaryInfo="summaryInfo" />
        <Grid class="grid-h">
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_download'" @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
        </Grid>
      </div>
    </div>
    <ExportModal @register="registerExportModal" @export="exportAction" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, nextTick } from 'vue';
  import { useLocalStorage } from '@vueuse/core';
  import dayjs from 'dayjs';
  import { useI18n } from '/@/hooks/web/useI18n';
  import Statistics from './components/Statistics.vue';
  import { useModal } from '/@/components/Modal';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { downloadByUrl } from '/@/utils/file/download';
  import { getMachinestatePage, machinestateSummary, machinestateExportdata } from '/@/api/qms/machineDebug';
  import { getMachinelCodeList } from '/@/api/qms/iqc/abnormalTimelinessMonitoring';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { columns, CLASSES_OPTIONS } from './components/config';
  import { getShiftType } from '/@/utils/time';
  import { ListByUserfactory } from '/@/api/productionPlan/processRoute';

  defineOptions({ name: 'qms-intelligentButler-machineDebug' });
  const { t } = useI18n();

  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();

  const state = ref<any>({
    factoryArea: '',
  });

  const summaryInfo = ref({
    runNumber: '',
    runRatio: '',
    runTime: '',
    testNumber: '',
    testRatio: '',
    testTime: '',
    totalNumber: 0,
    totalRatio: '',
    totalTime: '',
  });

  const [registerForm, { setFieldsValue, getFieldsValue, updateSchema }] = useForm({
    baseColProps: { span: 5 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    autoAdvancedLine: 1,
    actionColOptions: {
      span: 4,
    },
    schemas: [
      {
        field: 'factoryArea',
        label: '',
        i18nField: 'factoryAreaName',
        component: 'ApiSelect',
        componentProps: {
          api: ListByUserfactory,
          placeholder: '所属厂区',
          showSearch: true,
          resultField: 'data',
          filterOption: (inputValue, path) => {
            return [path].some(option => option.label.includes(inputValue));
          },
          notFoundContent: null,
          immediate: true,
          labelField: 'Name',
          valueField: 'Code',
          defaultFirstOption: true,
          allowClear: false,
          onChange: e => {
            state.value.factoryArea = e;
            nextTick(async () => {
              handleSearch();
              const { data } = await getMachinelCodeList({ factoryArea: e });
              updateSchema({
                field: 'machineNo',
                componentProps: {
                  options: data,
                },
              });
            });
          },
        },
      },
      {
        field: 'pickerVal',
        label: '',
        component: 'DateRange',
        componentProps: {
          format: 'YYYY-MM-DD',
          placeholder: [t('dict.CommonCol.startTime'), t('dict.CommonCol.endTime')],
        },
        defaultValue: [dayjs().startOf('day').valueOf(), dayjs().endOf('day').valueOf()],
      },
      // 班次
      {
        field: 'classes',
        component: 'Select',
        label: '',
        componentProps: {
          options: CLASSES_OPTIONS,
        },
        i18nField: 'classesName',
      },
      // 机台
      {
        field: 'machineNo',
        label: '',
        component: 'Select',
        componentProps: {
          fieldNames: {
            value: 'machineNo',
            label: 'machineNo',
          },
          showSearch: true,
          options: [],
          placeholder: t('dict.TechInfoColumn.machineNo'),
          onChange: e => {
            const { value } = useLocalStorage('qms-intelligentButler-machineDebug', { machineNo: e });
            value.machineNo = e;
          },
        },
        i18nField: 'machineNumber',
      },
    ],
    i18nConfig: {
      moduleCode: 'MachineStateColumn',
      transferRange: ['placeholder'],
    },

    fieldMapToTime: [['pickerVal', ['startTime', 'endTime']]],
  });

  const [Grid, { reload, getFetchParams }] = useVbenVxeGrid({
    gridOptions: {
      id: 'qms-intelligentButler-machineDebug-list',
      columns,
      showIndexColumn: true,
      api: getMachinestatePage,
      beforeFetch: params => {
        return {
          ...params,
          ...getFieldsValue(),
        };
      },
      i18nConfig: {
        moduleCode: 'MachineStateColumn',
      },
    },
  });

  // 批量导出
  const handleExport = async () => {
    openExportModal(true, {
      listQuery: {
        ...(await getFetchParams()),
        ...getFieldsValue(),
      },
      exportOptions: columns,
      nameProps: 'title',
      idProps: 'field',
    });
  };

  function exportAction(query) {
    machinestateExportdata(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  }

  function handleSearch() {
    getMachinestateSummary();
    reload();
  }

  async function getMachinestateSummary() {
    const { data } = await machinestateSummary(getFieldsValue());
    summaryInfo.value = data;
  }

  const initData = async ({ isInit }) => {
    const { value: storeData } = useLocalStorage('qms-intelligentButler-machineDebug', { machineNo: '' });
    await setFieldsValue({
      classes: getShiftType(),
      machineNo: storeData.machineNo,
      factoryArea: state.value.factoryArea,
    });
    if (isInit) return;
    getMachinestateSummary();
    reload();
  };

  onMounted(async () => {
    initData({ isInit: true });
  });
</script>

<style scoped lang="less">
  .lydc-content-wrapper-content {
    display: flex;
    flex-direction: column;

    .grid-h {
      flex: 1;
    }
  }
</style>
