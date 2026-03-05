<template>
  <div>
    <div class="form-search-block">
      <div>SN：</div>
      <div class="w-1/2">
        <LydcInput :suffixIcon="'icon-ym icon-ym-scanCode'" v-model:value="translateInput" :placeholder="t('common.scanText')" @Keydown="handlerInputKeydown" />
      </div>
    </div>
    <div class="form-block" v-if="state.tempListData.length">
      <div class="form-block-headerBox">
        <div class="form-block-header">
          SN：
          <span class="form-block-title">{{ state.templistParams?.processName || '--' }}</span>
        </div>
        <div class="triangle-right"></div>
      </div>
      <div class="form-block-content min-h-150px max-h-180px overflow-auto">
        <TempForm
          :tempList="state.tempListData"
          ref="tempFormRef"
          :colSpan="4"
          :isNeedValidate="true"
          :processName="state.templistParams?.processName"
          :operationType="state.operationType"
          @tempFormChange="tempFormChange" />
      </div>
    </div>
    <div class="flex justify-center items-center min-h-[400px]" v-else>
      <img :src="nodata" alt="" />
    </div>
    <div class="h-280px">
      <Subtitle :title="state.title" class="c-title" />
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operatorId'">
            {{ record[column.dataIndex + 'Name'] ? record[column.dataIndex + 'Name'] : record[column.dataIndex] }}
          </template>
          <template v-if="column.key === 'action'">
            <TableAction :actions="getTableActions(record)" />
          </template>
        </template>
      </BasicTable>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, unref } from 'vue';
  import { getDetailbyprocessname, getProcrulesTempDetail } from '/@/api/basicData/processrulestemplate';
  import TempForm from '/@/views/productionPlan/procruleTemp/components/tempForm.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { debounce } from 'lodash-es';
  import { getDetailbydocumentnumber, getPrintnextnode, transferManytoone } from '/@/api/productionDeal/dieCutPerPrint';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicTable, useTable, ActionItem } from '/@/components/Table';
  import { OperationTypeValue } from '../const';
  import { buildUUID } from '/@/utils/uuid';
  import nodata from '/@/assets/images/process/nodata.png';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  let basicProcess = ''; // 用于对比的首次工序
  const { t } = useI18n();
  const userStore = useUserStore();
  const emit = defineEmits(['refresh', 'changeLoading', 'closeModal']);
  interface State {
    templistParams: any;
    scanData: any;
    nextData: any;
    nextDataArray: any;
    process: string;
    // processName: String;
    operationType: string;
    // documentNumber: String;
    title: any;
    tempListData: any[];
    pageType: string;
  }
  const state = reactive<State>({
    templistParams: {},
    scanData: [],
    nextData: {},
    nextDataArray: [],
    title: '',
    tempListData: [],
    process: '',
    // processName: '',
    operationType: '',
    pageType: '',
    // documentNumber: '',
  });
  const tempFormRef = ref();
  const translateInput = ref('');

  const { createMessage } = useMessage();
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

  function tempFormChange(newVal) {
    state.tempListData = newVal;
  }

  function checkoutFormSomeEmpty() {
    return state.tempListData.some(item => item.isRequired === 1 && !item.fieldValue);
  }

  async function handleSubmit() {
    const table = getDataSource();
    if (!table.length) return createMessage.warning(t('common.scanCirculationProcess'));
    if (checkoutFormSomeEmpty()) return createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
    const formData = state.tempListData.reduce((accumulator, current) => {
      if (current.isMultiSelect === 1) {
        accumulator[current.fieldEnName] = current.fieldValue.join(',');
      } else {
        accumulator[current.fieldEnName] = current.fieldValue;
      }
      return accumulator;
    }, {});
    const paramsData = {
      ...formData,
      printNextList: table,
    };
    if (!state.nextDataArray.length) {
      return createMessage.warning(t('common.scanCirculationProcess'));
    }

    emit('changeLoading', true);

    try {
      const { code, msg } = await transferManytoone(paramsData);
      if (code === 200) {
        createMessage.success(msg);
        emit('refresh');
        emit('closeModal');
      }
    } finally {
      emit('changeLoading', false);
    }
  }

  // 获取字段配置列表
  async function getProcrulesTempDetailFn(preSetType) {
    emit('changeLoading', true);
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
      emit('changeLoading', false);
    }
  }

  const handlerInputChangeFn = debounce(async val => {
    if (!val) return;
    // getNextNodeApi校验标签是否有效
    emit('changeLoading', true);
    // getDetailbydocumentnumber获取标签详情
    Promise.all([getDetailbydocumentnumber({ documentNumber: val }), getPrintnextnode({ documentNumber: val })])
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
        // state.templistParams.processName = state.scanData?.processName;
        state.nextData = nextData?.data;
        if (!basicProcess) {
          basicProcess = state.nextData.process;
        }
        if (basicProcess !== state.nextData?.process) {
          return createMessage.warning(t('dict.CommonCol.processInconsistentTip'));
        }
        state.nextDataArray.push(state.nextData);
        state.templistParams.processName = state.nextData.processName;
        state.templistParams.process = state.nextData.process;

        insertTableDataRecord(scanData.data);
        getDetailbyprocessnameFn(state.templistParams);
      })
      .finally(() => {
        emit('changeLoading', false);
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
        if (item.fieldEnName === 'classes' && item.fieldValue) {
          item.fieldValue = String(item.fieldValue);
        }
        if (item.isMultiSelect === 1) {
          item.fieldValue = item.fieldValue.split(',');
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
      // insertTableDataRecord(tableDataObj);
    } else {
      state.tempListData = [];
    }
  }
  async function init({ title, templistParams }) {
    state.nextDataArray = [];
    translateInput.value = '';
    state.title = title;
    // state.processName = templistParams.processName;
    state.operationType = templistParams.operationType;
    // state.documentNumber = templistParams.documentNumber;
    state.templistParams = templistParams;
    getProcrulesTempDetailFn(templistParams.operationType);
  }
  defineExpose({ init, handleSubmit });
</script>
<style lang="less" scoped>
  .form-block {
    max-height: 540px;

    &-headerBox {
      border-bottom: 2px solid #ff7b00;
      display: flex;
      align-items: center;
    }

    &-header {
      padding: 10px;
      background: #ff7b00;
      color: #fff;
      font-weight: 600;
      font-size: 14px;
      display: inline-block;
      border-radius: 4px 6px 0 0;
    }

    &-title {
      font-size: 12px;
    }

    .triangle-right {
      display: inline-block;
      width: 0;
      height: 0;
      border-bottom: 42px solid #ff7b00;
      border-right: 38px solid transparent;
      position: relative;
      top: 0;
      left: -4px;
    }

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
