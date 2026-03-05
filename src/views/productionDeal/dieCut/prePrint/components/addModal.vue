<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :showOkBtn="state.id ? false : true"
    @ok="handleSubmit"
    @cancel="handleCloseFn"
    destroyOnClose
    width="1350px"
    :minHeight="660">
    <template #title>
      <div class="ml-16px">
        <Subtitle :title="state.title" />
      </div>
    </template>
    <div>
      <div class="form-search-block" v-if="!state.id">
        <span>{{ t('common.circulationLabel') }}：</span>
        <div class="w-1/2">
          <LydcInput
            :suffixIcon="'icon-ym icon-ym-scanCode'"
            v-model:value="translateInput"
            :placeholder="t('common.scanText')"
            @Keydown="handlerInputKeydown" />
        </div>
      </div>
      <processBox ref="processBoxs" />
      <div class="form-block" v-if="state.tempListData.length">
        <div class="form-block-content min-h-150px max-h-180px overflow-auto">
          <TempForm
            :tempList="state.tempListData"
            ref="tempFormRef"
            :colSpan="4"
            :isNeedValidate="true"
            :processName="state.processName"
            :operationType="state.operationType"
            :showDefaultClasses="false" />
        </div>
      </div>
      <div class="flex justify-center items-center min-h-[400px]" v-else>
        <img :src="nodata" alt="" />
      </div>
      <div class="h-280px">
        <Subtitle :title="state.title" class="c-title" />
        <BasicTable @register="registerTable">
          <template #bodyCell="{ column, record }">
            <!-- <template v-if="column.dataIndex === 'operatorId'">
              {{ record[column.dataIndex + 'Name'] ? record[column.dataIndex + 'Name'] : record[column.dataIndex] }}
            </template> -->
            <template v-if="column.key === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { reactive, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getDetailbyprocessname, getProcrulesTempDetail } from '/@/api/basicData/processrulestemplate';
  import TempForm from '/@/views/productionPlan/procruleTemp/components/tempForm.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { debounce } from 'lodash-es';
  import { getDetailbydocumentnumber, getPrintnextnode, getStartworknode, startwork } from '/@/api/productionDeal/dieCutPerPrint';
  import { procRuleTempEnum } from '/@/views/productionPlan/procruleTemp/types';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicTable, useTable, ActionItem } from '/@/components/Table';
  import { OperationTypeValue, SharePageType } from '../const';
  import { buildUUID } from '/@/utils/uuid';
  import nodata from '/@/assets/images/process/nodata.png';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { processBox } from '/@/components/processBox';
  import dayjs from 'dayjs';
  let basicProcess = ''; // 用于对比的首次工序
  const processBoxs = ref();
  const { t } = useI18n();
  const userStore = useUserStore();
  const emit = defineEmits(['refresh']);
  interface State {
    dataForm: any;
    templistParams: any;
    detailData: any;
    scanData: any;
    nextData: any;
    nextDataArray: any;
    id: string;
    process: string;
    processName: string;
    operationType: string;
    documentNumber: string;
    title: any;
    tempListData: any[];
    pageType: string;
  }
  const state = reactive<State>({
    dataForm: {},
    templistParams: {},
    detailData: {},
    scanData: [],
    nextData: {},
    nextDataArray: [],
    id: '',
    title: '',
    tempListData: [],
    process: '',
    processName: '',
    operationType: '',
    pageType: '',
    documentNumber: '',
  });
  const tempFormRef = ref();
  const translateInput = ref('');

  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  const [registerTable, { setColumns, insertTableDataRecord, deleteTableDataRecord, getDataSource }] = useTable({
    immediate: false,
    rowKey: 'id',
    useSearchForm: false,
    tableSetting: { size: false, setting: false, redo: false },
    showIndexColumn: false,
    isCanResizeParent: true,
    pagination: false,
    actionColumn: {
      title: t('common.action'),
      dataIndex: 'action',
      width: 60,
    },
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: () => handleDeleteFn(record),
        // auth: 'btn_detail',
      },
    ];
  }

  function handleDeleteFn(record: any) {
    deleteTableDataRecord(record.id);
    state.nextDataArray = state.nextDataArray.filter(o => o.documentNumber !== record.documentNumber);
    const dataSource = getDataSource();
    if (!dataSource.length) {
      basicProcess = '';
    }
  }

  async function handleSubmit() {
    if (!state.nextDataArray.length) {
      return createMessage.warning(t('common.scanCirculationProcess'));
    }
    if (state.id) {
      emit('refresh');
      closeModal();
      return;
    }

    const reqParams = state.nextDataArray;
    changeOkLoading(true);
    const submitApi = startwork;
    try {
      const { code, msg } = await submitApi(reqParams);
      if (code === 200) {
        createMessage.success(msg);
        emit('refresh');
        closeModal();
      }
    } finally {
      changeOkLoading(false);
    }
  }

  async function handleCloseFn() {
    state.tempListData = [];
  }

  // 获取字段配置列表
  async function getProcrulesTempDetailFn(preSetType) {
    changeLoading(true);
    try {
      const { code, data } = await getProcrulesTempDetail({});
      if (code == 200) {
        if (!data.detailList) return;
        state.tempListData = data.detailList.filter(item => {
          if (item.operationTypes.includes(OperationTypeValue[preSetType])) {
            return item;
          }
        });
      }
    } finally {
      changeLoading(false);
    }
  }

  const handlerInputChangeFn = debounce(async val => {
    if (!val) return;
    const getNextNodeApi = state.pageType === SharePageType.StartWork ? getStartworknode : getPrintnextnode;
    changeLoading(true);
    Promise.all([getDetailbydocumentnumber({ documentNumber: val }), getNextNodeApi({ documentNumber: val })])
      .then(res => {
        const [scanData, nextData] = res;
        const tableData = getDataSource();
        let msg = '';
        if (tableData.length) {
          tableData.forEach(o => {
            if (o.documentNumber === val) {
              msg = t('dict.CommonCol.tagExistTip');
            }
          });
        }
        if (msg) {
          return createMessage.warning(msg);
        }

        state.scanData = scanData?.data;
        state.process = state.scanData?.process;
        state.templistParams.processName = state.scanData?.processName;
        state.nextData = nextData?.data;
        processBoxs.value && processBoxs.value.getRouteList(state.nextData);
        if (!basicProcess) {
          basicProcess = state.nextData.process;
        }
        if (basicProcess !== state.nextData?.process) {
          return createMessage.warning(t('dict.CommonCol.processInconsistentTip'));
        }
        state.nextDataArray.push(state.nextData);
        state.templistParams.processName = state.nextData.processName;
        state.templistParams.process = state.nextData.process;

        getDetailbyprocessnameFn(state.templistParams);
      })
      .finally(() => {
        changeLoading(false);
      });
  }, 300);

  const handlerInputKeydown = (e: any) => {
    if (e.keyCode !== 13) return;
    const val = e.target._value;
    const arr = val.split('!') || [];
    translateInput.value = arr[0];
    handlerInputChangeFn(arr[0]);
  };

  // 获取开启的模板配置
  async function getDetailbyprocessnameFn(templistParams) {
    state.tempListData = [];
    const columns: any = [];
    const { code, data } = await getDetailbyprocessname(templistParams);
    if (code === 200) {
      const tableDataObj: any = {};
      if (state.detailData.id) {
        const showData = data.map(o => {
          if (o.fieldEnName === 'uploadProgramFile') {
            o.isChecked = true;
          }
          o.isDisabled = 1;
          o.fieldValue = state.detailData[o.fieldEnName];
          // 开工页面不用展示班次
          // if (o.fieldEnName === 'classes' && o.fieldValue) {
          //   o.fieldValue = String(o.fieldValue);
          // }
          if (o.isMultiSelect === 1) {
            o.fieldValue = o.fieldValue ? o.fieldValue.split(',') : [];
          }
          return o;
        });
        state.tempListData = showData;
        return;
      }
      state.tempListData = data.map(item => {
        if (item.fieldEnName === 'creatorTime') {
          item.fieldValue = Date.now();
        } else if (item.fieldEnName === 'creatorUserName') {
          item.fieldValue = unref(userStore.getUserInfo).userName;
        } else if (item.fieldEnName === 'orgId') {
          item.fieldValue = unref(userStore.getUserInfo).organizeIdList;
        } else {
          //自动带入扫描标签获取的数据
          item.fieldValue = state.scanData[item.fieldEnName];
        }
        // if (item.fieldEnName === 'classes' && item.fieldValue) {
        //   item.fieldValue = String(item.fieldValue);
        // }
        if (item.isMultiSelect === 1) {
          item.fieldValue = item.fieldValue && item.fieldValue.split(',');
        }

        if (state.pageType === SharePageType.StartWork) {
          // 开工：禁用
          item.isDisabled = 1;
        }
        columns.push({
          title: item.fieldCnName,
          dataIndex: item.fieldEnName,
        });
        tableDataObj[item.fieldEnName] = item.fieldValue;
        tableDataObj.id = buildUUID();
        return item;
      });
      setColumns(columns);

      // 字典、api调用、人员组件，需要获取name的值
      const nameObj = state.tempListData.reduce((acc, item) => {
        if (
          item.dataType === procRuleTempEnum['DictType'] ||
          item.dataType === procRuleTempEnum['ApiType'] ||
          item.dataType === procRuleTempEnum['Personnel']
        ) {
          acc[item.fieldEnName] = state.scanData[item.fieldEnName + 'Name'];
        }
        // if (item.fieldEnName === 'classes' && !item.fieldValue) {
        //   acc[item.fieldValue] = getShiftType();
        //   acc[item.fieldEnName] = getShiftType() === '1' ? t('dict.ClassesName.1') : t('dict.ClassesName.2');
        // }
        if (item.fieldEnName === 'creatorUserName' || item.fieldEnName === 'orgId') {
          acc[item.fieldEnName] = item.fieldValue;
        }
        if (item.dataType === procRuleTempEnum['TimeType'] && item.fieldValue) {
          acc[item.fieldEnName] = dayjs(item.fieldValue).format('YYYY-MM-DD HH:mm:ss');
        }
        if (item.dataType === procRuleTempEnum['DateType'] && item.fieldValue) {
          acc[item.fieldEnName] = dayjs(item.fieldValue).format('YYYY-MM-DD');
        }
        return acc;
      }, {});
      const scanItem = {
        ...state.scanData,
        ...nameObj,
        // classes: getShiftType() === '1' ? t('dict.ClassesName.1') : t('dict.ClassesName.2'),
      };
      insertTableDataRecord(scanItem);
    } else {
      state.tempListData = [];
    }
  }
  async function init({ title, data, templistParams, pageType }) {
    basicProcess = '';
    state.nextDataArray = [];
    translateInput.value = '';
    state.title = title;
    state.id = data.id;
    state.pageType = pageType;
    state.processName = templistParams.processName;
    state.operationType = templistParams.operationType;
    state.documentNumber = templistParams.documentNumber;
    state.detailData = data;
    state.templistParams = templistParams;
    state.nextData = {};
    getProcrulesTempDetailFn(templistParams.operationType);
  }
</script>
<style lang="less" scoped>
  .form-block {
    max-height: 540px;

    &-content {
      background: #f5f5f5;
    }
  }

  ::v-deep(.icon-ym-scanCode) {
    color: #ff7b00 !important;
  }

  .form-search-block {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
  }

  ::v-deep(.scroll-container) {
    padding: 16px 20px 0 !important;
  }

  ::v-deep(.lydc-subtitle-container) {
    padding: 0;

    .title {
      font-size: 16px;
    }
  }

  ::v-deep .c-title {
    margin-top: 10px;

    .title {
      font-size: 14px;
    }
  }

  ::v-deep .ant-table-title {
    padding: 4px !important;
  }
</style>
