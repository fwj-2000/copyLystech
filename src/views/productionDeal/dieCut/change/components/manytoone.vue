<template>
  <div>
    <div class="form-search-block">
      <span>{{ t('common.circulationLabel') }}：</span>
      <div class="w-1/2">
        <LydcInput :suffixIcon="'icon-ym icon-ym-scanCode'" v-model:value="translateInput" :placeholder="t('common.scanText')" @Keydown="handlerInputKeydown" />
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
          @tempFormChange="tempFormChange" />
      </div>
    </div>
    <div class="flex justify-center items-center min-h-[400px]" v-else>
      <img :src="nodata" alt="" />
    </div>
    <div class="h-280px">
      <Subtitle :title="t('dict.CommonCol.transformation')" class="c-title" />
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record, index }">
          <!-- <template v-if="column.dataIndex === 'operatorId'">
            {{ record[column.dataIndex + 'Name'] ? record[column.dataIndex + 'Name'] : record[column.dataIndex] }}
          </template> -->
          <template v-if="column.key === 'action'">
            <TableAction :actions="getTableActions(record, index)" />
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
  import nodata from '/@/assets/images/process/nodata.png';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { procRuleTempEnum } from '/@/views/productionPlan/procruleTemp/types';
  import { processBox } from '/@/components/processBox';
  let basicProcess = ''; // 用于对比的首次工序
  const processBoxs = ref();
  const { t } = useI18n();
  const userStore = useUserStore();
  const emit = defineEmits(['refresh', 'changeLoading', 'closeModal']);
  // let usePrePrintModelConfig: any = {};
  interface State {
    templistParams: any;
    // detailData: any;
    scanDetailData: any;
    // processDetailData: any;
    // nextDataArray: any;
    // process: String;
    processName: string;
    operationType: string;
    // documentNumber: String;
    // title: any;
    tempListData: any[];
    // pageType: string;
  }
  const state = reactive<State>({
    templistParams: {},
    // detailData: {},
    scanDetailData: {},
    // processDetailData: {},
    // nextDataArray: [],
    // title: '',
    tempListData: [],
    // process: '',
    processName: '',
    operationType: '',
    // pageType: '',
    // documentNumber: '',
  });
  const tempFormRef = ref();
  const translateInput = ref('');
  const newTableData = ref<any[]>([]);

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

  function getTableActions(record, index): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: () => handleDeleteFn(record, index),
        // auth: 'btn_detail',
      },
    ];
  }

  function handleDeleteFn(record: any, index) {
    deleteTableDataRecord(record.id);
    newTableData.value.splice(index, 1);
    // state.nextDataArray = state.nextDataArray.filter(o => o.documentNumber !== record.documentNumber);
    const dataSource = getDataSource();
    if (!dataSource.length) {
      basicProcess = '';
    }
  }

  function tempFormChange(newVal) {
    state.tempListData = newVal;
  }

  function isNone(value: any) {
    return value === undefined || value === null || value === '';
  }

  function checkoutFormSomeEmpty() {
    return state.tempListData.some(item => item.isRequired === 1 && isNone(item.fieldValue));
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
      printNextList: newTableData.value,
    };
    // if (!state.nextDataArray.length) {
    //   return createMessage.warning(t('common.scanCirculationProcess'));
    // }

    // let params: any = {};
    // if (state.pageType === SharePageType.Change) {
    //   const res = await tempFormRef.value.validateFormFn();
    //   params = {
    //     processName: state.templistParams.processName,
    //     process: state.process,
    //     documentNumber: translateInput.value,
    //   };

    //   res.forEach(o => {
    //     if (o.fieldEnName === 'uploadProgramFile' && o.fieldValue) {
    //       params['uploadProgramFile'] = o.fieldValue;
    //       params['uploadProgramFileName'] = o.uploadProgramFileNames;
    //       params['uploadProgramType'] = params['uploadProgramType']?.length ? params['uploadProgramType'].join(',') : '';
    //     } else if (o.fieldEnName === 'transformTag' && o.fieldValue) {
    //       params.documentNumber = o.fieldValue;
    //     } else {
    //       params[o.fieldEnName] = o.fieldValue;
    //     }
    //   });
    //   params.factory ||= state.templistParams.orgId;
    //   params.printNextList = state.nextDataArray;
    // }
    emit('changeLoading', true);
    // const reqParams = state.pageType === SharePageType.Change ? params : state.nextDataArray;
    // const submitApi = state.pageType === SharePageType.Change ? transfer : startwork;
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

  // 首次进来获取form模板信息，获取字段配置列表
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
    translateInput.value = '';
    emit('changeLoading', true);
    // getDetailbydocumentnumber获取标签详情
    Promise.all([getDetailbydocumentnumber({ documentNumber: val }), getPrintnextnode({ documentNumber: val })])
      .then(res => {
        const [scanDetailData, processDetailData] = res;
        const scanDetail = scanDetailData?.data;
        const processDetail = processDetailData?.data;

        // 校验扫描的标签是否重复
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

        // 每次扫描的工序需要一致
        if (!basicProcess) {
          basicProcess = processDetail.process;
        }
        if (basicProcess !== processDetail?.process) {
          return createMessage.warning(t('dict.CommonCol.processInconsistentTip'));
        }

        // 获取模板详情
        state.scanDetailData = scanDetail;
        processBoxs.value && processBoxs.value.getRouteList(state.scanDetailData);
        // state.process = state.scanDetailData?.process;
        // state.templistParams.processName = state.scanDetailData?.processName;
        // state.processDetailData = processDetail;

        // state.nextDataArray.push(state.processDetailData);
        // 获取工序名称
        state.templistParams.processName = processDetail.processName;
        state.templistParams.process = processDetail.process;

        // insertTableDataRecord(scanDetailData.data);
        // 获取form模板配置
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
      // const tableDataObj: any = {};
      // if (state.detailData.id) {
      //   const showData = data.map(o => {
      //     if (o.fieldEnName === 'uploadProgramFile') {
      //       o.isChecked = true;
      //     }
      //     o.isDisabled = 1;
      //     o.fieldValue = state.detailData[o.fieldEnName];
      //     if (o.fieldEnName === 'classes' && o.fieldValue) {
      //       o.fieldValue = String(o.fieldValue);
      //     }
      //     return o;
      //   });
      //   return (state.tempListData = showData);
      // }
      state.tempListData = data.map(item => {
        if (item.fieldEnName === 'creatorTime') {
          item.fieldValue = Date.now();
        } else if (item.fieldEnName === 'creatorUserName') {
          item.fieldValue = unref(userStore.getUserInfo).userName;
        } else if (item.fieldEnName === 'orgId') {
          item.fieldValue = unref(userStore.getUserInfo).organizeIdList;
        } else {
          //自动带入扫描标签获取的数据
          item.fieldValue = state.scanDetailData[item.fieldEnName];
        }
        if (item.fieldEnName === 'classes' && item.fieldValue) {
          item.fieldValue = String(item.fieldValue);
        }
        if (item.isMultiSelect === 1) {
          item.fieldValue = item.fieldValue.split(',');
        }
        // if (state.pageType === SharePageType.StartWork) {
        //   item.isDisabled = 1;
        // }

        columns.push({
          title: item.fieldCnName,
          dataIndex: item.fieldEnName,
        });
        return item;
      });

      // 回车时，是判断类型为（字典下拉、api下拉、人员组件下拉），则加字段后面拼接上Name得到新的字段的value并赋值给改字段后再插入表格渲染名称数据
      const nameObj = state.tempListData.reduce((acc, item) => {
        if (
          item.dataType === procRuleTempEnum['DictType'] ||
          item.dataType === procRuleTempEnum['ApiType'] ||
          item.dataType === procRuleTempEnum['Personnel']
        ) {
          acc[item.fieldEnName] = state.scanDetailData[item.fieldEnName + 'Name'];
        }
        return acc;
      }, {});
      const dataItem = {
        ...state.scanDetailData,
        ...nameObj,
      };
      setColumns(columns);
      // 插入表格数据
      insertTableDataRecord(dataItem);
      // newTableData用于提交（Id）
      newTableData.value.push(state.scanDetailData);
    } else {
      state.tempListData = [];
    }
  }
  async function init({ templistParams }) {
    // state.nextDataArray = [];
    translateInput.value = '';
    // state.title = title;
    // state.pageType = pageType;
    // state.processName = templistParams.processName;
    state.operationType = templistParams.operationType;
    // state.documentNumber = templistParams.documentNumber;
    // usePrePrintModelConfig = usePrePrintModel(templistParams);
    // state.detailData = data;
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
    display: flex;
    align-items: center;
    margin-bottom: 12px;
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
