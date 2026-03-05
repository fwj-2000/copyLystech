<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.dutyPersonId ? false : true"
    :okText="t('common.submit')"
    :title="state.title"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup bg-[#ebeef5]">
    <div class="bg-white p-24px content-box">
      <BasicForm @register="registerForm" v-if="!state.dutyPersonId"> </BasicForm>
      <Grid class="grid-header">
        <template #toolbar-actions>
          <div v-if="!state.dutyPersonId">
            <!-- <a-button type="primary" class="mr-16px" @click="handleSystemAutoShedule">{{ t('common.systemAutoShedule') }}</a-button> -->
            <a-dropdown class="mr-16px">
              <template #overlay>
                <a-menu @click="batchImportOrExport">
                  <a-menu-item key="import" v-auth="'btn_upload'">
                    <a-upload
                      v-feature
                      name="file"
                      :showUploadList="false"
                      :multiple="false"
                      :beforeUpload="handleBeforeUpload"
                      :disabled="!getFieldsValue().factoryArea">
                      {{ t('common.batchImport') }}
                    </a-upload>
                  </a-menu-item>
                  <a-menu-item key="export" v-auth="'btn_download'">{{ t('common.downloadTemplate') }}</a-menu-item>
                </a-menu>
              </template>
              <a-button v-if="hasBtnP('btn_upload') || hasBtnP('btn_download')">{{ t('common.batchImportOrExport') }}</a-button>
            </a-dropdown>
            <a-button type="error" ghost @click="handleRemove">{{ t('common.batchDelText') }}</a-button>
          </div>
        </template>
        <template #dateField="data">
          <div class="w-full h-full flex justify-center items-center" :class="getDutyTypeColor(data)">
            {{ formatDateField(data) }}
          </div>
        </template>
      </Grid>
    </div>
  </BasicPopup>
  <ClassesSettingModal @register="registerClassesSettingModal" @onSelect="handleClassesSetting" />
</template>

<script setup lang="ts">
  import { baseColumns } from './config';
  import { computed, onMounted, reactive, ref } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicForm, useForm } from '/@/components/Form';
  import { IdateResult, useDate } from '../hooks/useDate';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { BasicPopup, usePopup, usePopupInner } from '/@/components/Popup';
  import { useBaseStore } from '/@/store/modules/base';
  import { getFactoryList } from '/@/api/basicData/factory';
  import { autoSchedule, downloadImporttemplate, getShiftscheduleDetail, importShiftschedule, saveShiftschedule } from '/@/api/productionDeal/shiftSchedule';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import dayjs from 'dayjs';
  import { downloadByUrl } from '/@/utils/file/download';
  import ClassesSettingModal from './ClassesSettingModal.vue';
  import { useModal } from '/@/components/Modal';
  import { transformI18nVxeTable } from '/@/utils/index';
  const emits = defineEmits(['reload']);
  let defaultDate = [dayjs().format('YYYY-MM-DD'), dayjs().add(30, 'day').format('YYYY-MM-DD')];
  const { createMessage } = useMessage();
  const baseStore = useBaseStore();
  const { hasBtnP } = usePermission();
  const { t } = useI18n();
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerClassesSettingModal, { openModal: openClassesSettingModal }] = useModal();

  type TSTATE = {
    id: string;
    title: string;
    dutyPersonId: string;
    gridOptions: {};
    dateArray: IdateResult[];
    scheduleData: any[];
    autoScheduleData: any[];
    dutyTypeMap: Record<string, string>;
    classesMap: Record<string, string>;
  };

  const gridOptions = {
    size: 'default',
    layout: 'full',
    checkboxConfig: {
      checkField: 'isChecked',
      indeterminateField: 'isIndeterminate',
    },
  };

  const state = reactive<TSTATE>({
    id: '',
    dutyPersonId: '',
    title: t('common.addText'),
    gridOptions: gridOptions,
    dateArray: [],
    scheduleData: [],
    autoScheduleData: [],
    dutyTypeMap: {},
    classesMap: {},
  });

  const [registerForm, { validateFields, setFieldsValue, getFieldsValue }] = useForm({
    labelWidth: 100,
    schemas: [
      {
        field: 'factoryArea',
        label: '厂区',
        component: 'ApiSelect',
        componentProps: {
          plcaeholder: '请输入',
          api: getFactoryList,
          labelField: 'Name',
          valueField: 'Code',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          showSearch: true,
          useChangeCopy: true,
          resultField: 'data',
        },
        colProps: { span: 7 },
        rules: [{ required: true, trigger: 'blur' }],
      },
      {
        field: 'schedulingCycle',
        label: t('dict.CommonCol.schedulingCycle'),
        component: 'DateRange',
        componentProps: {
          plcaeholder: '请输入',
          onChange: (date: string[]) => {
            const { dateArray } = useDate(date);
            state.dateArray = dateArray;
            updateColumn();
          },
        },
        colProps: { span: 7 },
        rules: [{ required: true, trigger: 'blur' }],
      },
      // {
      //   field: 'classes',
      //   label: '排班班次',
      //   component: 'ApiSelect',
      //   componentProps: {
      //     api: () => {
      //       return baseStore.getDictionaryData('ClassesName');
      //     },
      //     labelField: 'fullName',
      //     valueField: 'enCode',
      //     filterOption: false,
      //     notFoundContent: null,
      //     immediate: true,
      //   },
      //   colProps: { span: 5 },
      //   rules: [{ required: true, trigger: 'blur' }],
      // },
    ],
    fieldMapToTime: [['schedulingCycle', ['startDate', 'endDate']]],
  });

  const gridEvents = {
    cellDblclick(data) {
      if (state.dutyPersonId) return;
      const { row, column, $rowIndex } = data;
      const currentField = column.field;
      openClassesSettingModal(true, { currentField, data: row, dutyTypeMap: state.dutyTypeMap, index: $rowIndex });
    },
  };

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: state.gridOptions,
    gridEvents,
  });

  async function init({ dutyPersonId }) {
    state.autoScheduleData = [];
    const dutyTypeList: any = await baseStore.getDictionaryData('dutyType');
    state.dutyTypeMap = dutyTypeList.reduce((acc, item) => {
      acc[Number(item.enCode)] = item.fullName;
      return acc;
    }, {});
    const classesList: any = await baseStore.getDictionaryData('ClassesName');
    state.classesMap = classesList.reduce((acc, item) => {
      acc[Number(item.enCode)] = item.fullName;
      return acc;
    }, {});
    state.dutyPersonId = dutyPersonId;
    state.title = dutyPersonId ? t('common.detailText') : t('common.add2Text');
    if (state.dutyPersonId) {
      return getShiftscheduleDetailFn(dutyPersonId);
    }
    // setFieldsValue({ schedulingCycle: defaultDate });
    const { dateArray } = useDate(defaultDate);
    state.dateArray = dateArray;
    updateColumn();
    await validateFields();
  }
  function updateColumn(): void {
    const list = [...baseColumns, ...state.dateArray];
    gridApi?.grid?.reloadColumn(transformI18nVxeTable(list));
  }

  function batchImportOrExport({ key }): void {
    const openMethod = key === 'import' ? handleImport : handleExport;
    openMethod();
  }

  async function handleSubmit() {
    changeLoading(true);
    try {
      const values = await validateFields();
      if (!values) return;
      const { code, msg } = await saveShiftschedule(state.autoScheduleData);
      if (code === 200) {
        createMessage.success(msg);
        emits('reload');
        closePopup();
      } else {
        createMessage.warning(msg);
      }
    } catch (error) {
      console.log(error);
    } finally {
      changeLoading(false);
    }
  }
  function handleImport() {
    // gridApi?.grid?.importData();
  }

  function handleExport() {
    downloadImporttemplate().then(res => {
      downloadByUrl({ url: res.data?.url });
    });
  }

  function forMatDateArray(arr: any[]) {
    const dateObj = {};
    arr.forEach((item: { dutyDate: string | number | Date | dayjs.Dayjs | null | undefined }) => {
      dateObj[dayjs(item.dutyDate).format('YYYY-MM-DD')] = item;
    });
    return dateObj;
  }
  function transfromTableData(dataSource: any[]) {
    const _data = cloneDeep(dataSource);
    const tableData = _data.map(item => {
      const dateArray = forMatDateArray(item.detailList);
      return {
        dutyPersonName: item.dutyPersonName,
        ...dateArray,
      };
    });
    return tableData;
  }
  function handleRemove() {
    const grid = gridApi.grid;
    const selectRows = grid.getCheckboxRecords(true);
    if (selectRows.length === 0) return createMessage.error(t('common.selectText'));
    gridApi?.grid.removeCheckboxRow();
  }

  function formatDateField(data: { row: any; column: any }) {
    const { row, column } = data;
    const field = column.field;
    const classes = row[field]?.classes;
    const dutyType = row[field]?.dutyType;
    if (dutyType === 1) {
      return state.classesMap[classes];
    }
    return state.dutyTypeMap[dutyType];
  }

  function getDutyTypeColor(data: { row: any; column: any }) {
    const { row, column } = data;
    const field = column.field;
    const dutyType = row[field]?.dutyType;
    const classes = row[field]?.classes;
    const classesTypeColorMap = {
      1: 'col-light',
      2: 'col-rest',
      3: 'col-light',
    };
    const classesColorMap = {
      1: 'col-light',
      2: 'col-night',
    };

    if (dutyType === 1) {
      return classesColorMap[classes];
    } else {
      return classesTypeColorMap[dutyType];
    }
  }

  async function getShiftscheduleDetailFn(dutyPersonId: string): Promise<void> {
    try {
      const { data, code } = await getShiftscheduleDetail({ dutyPersonId });
      if (code === 200) {
        defaultDate = [dayjs(data.startDate).format('YYYY-MM-DD'), dayjs(data.endDate).format('YYYY-MM-DD')];
        setFieldsValue({ pickerVal: defaultDate });
        const { dateArray } = useDate(defaultDate);
        state.dateArray = dateArray;
        updateColumn();
        state.autoScheduleData = [];
        state.autoScheduleData.push(data);
        state.scheduleData = transfromTableData(state.autoScheduleData);
        console.log(state.scheduleData);
        gridApi?.grid.reloadData(state.scheduleData);
      }
    } catch (error) {}
  }

  async function handleBeforeUpload(file, fileList) {
    const { factoryArea, startDate, endDate } = await getFieldsValue();
    const fileParams = new FormData();
    fileParams.append('file', file);
    fileParams.append('factoryArea', factoryArea);
    fileParams.append('startDate', dayjs(startDate).format('YYYY-MM-DD'));
    fileParams.append('endDate', dayjs(endDate).format('YYYY-MM-DD'));
    changeLoading(true);
    importShiftschedule(fileParams)
      .then(({ code, data }) => {
        if (code === 200) {
          state.autoScheduleData.push(...data);
          state.scheduleData = transfromTableData(state.autoScheduleData);
          console.log(state.scheduleData);
          gridApi?.grid.reloadData(state.scheduleData);
        }
      })
      .finally(() => {
        changeLoading(false);
      });
    return false;
  }
  function handleClassesSetting(data) {
    const { rows, target } = data;
    gridApi?.grid.setRow(rows, target);
    asyncReqTableData(data);
    // state.autoScheduleData[index] = { ...state.autoScheduleData[index], target };
  }

  function asyncReqTableData(data) {
    const { target, index, currentField } = data;
    state.autoScheduleData[index].detailList.forEach(item => {
      if (dayjs(item.dutyDate).format('YYYY-MM-DD') === currentField) {
        item.dutyType = target.dutyType;
      }
    });
  }
</script>
<style lang="less" scoped>
  ::v-deep(.grid-header) {
    .vxe-header--row {
      height: 80px;
    }

    .vxe-header--column {
      .vxe-cell {
        padding-left: 0;
        padding-right: 0;
      }
    }

    .vxe-cell--title {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      text-align: center;
      align-items: center;
      width: 100%;
    }

    .header-week {
      width: 100%;
      border-bottom: 1px solid var(--vxe-ui-table-border-color);
      padding-bottom: 4px;
    }

    .header-date {
      display: flex;
      width: 100%;
      flex: 1;
      flex-wrap: nowrap;
      padding-top: 6px;
    }

    .vxe-cell {
      padding: 0 !important;
    }
  }

  .content-box {
    height: 96%;
  }

  // .col-rest {
  //   background-color: rgba(244, 41, 41, 0.1);
  //   border-left: 3px solid #ff4d4f;
  //   height: 48px;
  //   width: 100%;
  // }
  .col-rest {
    // background-color: #e6f9f2;
    background-color: rgb(230 249 242 / 50%);
    border-left: 3px solid #04bb78;
    height: 48px;
    width: 100%;
  }

  .col-night {
    height: 48px;
    width: 100%;
    // background-color: #e8f4ff;
    background-color: rgb(232 244 255 / 50%);
    border-left: 3px solid #1890ff;
  }

  .col-light {
    height: 48px;
    width: 100%;
    background-color: rgb(255 242 230 / 50%);
    border-left: 3px solid #ff8a1d;
  }
</style>
