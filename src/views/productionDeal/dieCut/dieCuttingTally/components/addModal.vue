<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :showOkBtn="!state.id"
    @ok="handleSubmit"
    @cancel="handleCloseFn"
    destroyOnClose
    width="1350px"
    :minHeight="state.id ? 550 : 660">
    <template #title>
      <div class="ml-16px">
        <Subtitle :title="state.title" />
      </div>
    </template>
    <div :class="state.id ? 'h-[500px]' : 'h-[650px]'">
      <!-- 流转标签 -->
      <div class="form-search-block" v-if="!state.id">
        <div class="w-[70px] form-search-block-label"> {{ t('dict.CommonCol.transformTag') }}：</div>
        <div class="w-1/2">
          <LydcInput
            :suffixIcon="'icon-ym icon-ym-scanCode'"
            v-model:value="translateInput"
            :placeholder="t('common.scanText')"
            @Keydown="handlerInputKeydown" />
        </div>
      </div>
      <!-- SN -->
      <!-- <div class="form-search-block" v-if="!state.id && state.operationType === 'ApplyWork'">
        <div class="w-[70px] form-search-block-label"> SN：</div>
        <LydcInput
          class="w-1/2"
          :suffixIcon="'icon-ym icon-ym-scanCode'"
          v-model:value="translateInputSN"
          :placeholder="t('common.scanText')"
          @Keydown="handlerInputSNKeydown" />
      </div> -->
      <div class="form-block">
        <processBox ref="processBoxs" />
        <div :class="['form-block-content', 'min-h-150px', 'overflow-auto', state.id ? '' : 'max-h-180px']" v-if="state.tempListData.length">
          <TempForm
            :tempList="state.tempListData"
            ref="tempFormRef"
            :colSpan="4"
            :isNeedValidate="true"
            :processName="state.templistParams.processName"
            :operationType="state.operationType"
            @tempFormChange="tempFormChange" />
        </div>
      </div>
      <div class="h-320px mt-20px" v-if="!state.id">
        <Grid>
          <template #action="{ row, $rowIndex }">
            <TableAction outside :actions="getTableActions(row, $rowIndex)" />
          </template>
        </Grid>
      </div>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { reactive, ref, unref, nextTick } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getDetailbyprocessname, getProcrulesTempDetail } from '/@/api/basicData/processrulestemplate';
  import TempForm from '/@/views/productionPlan/procruleTemp/components/tempForm.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useTallyModel } from '../hooks/useTallyModel';
  import { useUserStore } from '/@/store/modules/user';
  import { TableAction } from '/@/components/Table';
  import { getShiftType } from '/@/utils/time';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep, debounce } from 'lodash-es';
  import { procRuleTempEnum } from '/@/views/productionPlan/procruleTemp/types';
  import { Subtitle } from '/@/components/Subtitle';
  import {
    getProcessCirculationTagDetail,
    getProcessDiecutquantityTagdetail,
    getProcessPrePrintDetailBySn,
    diecutquantityBathadd,
  } from '/@/api/productionDeal/dieCuttingTally';
  import { message } from 'ant-design-vue';
  import { processBox } from '/@/components/processBox';
  import dayjs from 'dayjs';

  const { t } = useI18n();
  const userStore = useUserStore();
  const { createMessage } = useMessage();
  const emit = defineEmits(['refresh']);
  const processBoxs = ref();
  interface State {
    dataForm: any;
    templistParams: any;
    detailData: any;
    scanData: any;
    id: string;
    process: string;
    operationType: string;
    title: any;
    tempListData: any[];
  }
  const state = reactive<State>({
    dataForm: {},
    templistParams: {},
    detailData: {},
    scanData: [],
    id: '',
    title: '',
    tempListData: [],
    process: '',
    operationType: '',
  });
  const tempFormRef = ref();
  const translateInput = ref('');
  const translateInputSN = ref('');
  const currentIndex = ref(0);

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionDeal-dieCut-dieCuttingTally-reportWorklist',
      showIndexColumn: true,
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
    },
  });

  function getTableActions(row, index) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: handleEdit.bind(null, row, index),
        // auth: 'btn_edit',
      },
      // 删除
      {
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('dict.ProgressStatusEnum.8'),
        onClick: handleDelete.bind(null, row, index),
        // auth: 'btn_edit',
      },
    ];
  }

  async function handleEdit(row, index) {
    const res = await tempFormRef.value.validateFormFn();
    if (!res) return;
    currentIndex.value = index;

    // 更改模板为当前点击项
    if (row.tempListData) {
      state.tempListData = row.tempListData;
    }
    // 修改模板工序名称
    state.templistParams.processName = row.processName;
  }

  const handleDelete = (row, index) => {
    gridApi?.grid.remove(row);
    newTableData.value.splice(index, 1);
  };

  const newTableData = ref<any[]>([]);

  const getClassesName = classes => {
    if (classes === '1' || classes === '2') {
      return classes === '1' ? t('dict.ClassesName.1') : t('dict.ClassesName.2');
    }
    return classes;
  };

  function tempFormChange(newVal) {
    const table = gridApi?.getDataSource();
    // 只将表格的多选设置为string，模板组件的数据类型不要发生变化
    const tableNewVal = cloneDeep(newVal).map(item => {
      if (item.isMultiSelect === 1) {
        return {
          ...item,
          fieldValue: Array.isArray(item.fieldValue) ? item.fieldValue.join(',') : '',
        };
      } else {
        return { ...item };
      }
    });
    const obj = Object.fromEntries(tableNewVal.map(item => [item.fieldEnName, item.fieldValueName || item.fieldValue]));
    const newObj = Object.fromEntries(
      newVal.map(item => {
        if (item.isMultiSelect === 1) {
          return [item.fieldEnName, item.fieldValue && item.fieldValue.join(',')];
        } else {
          return [item.fieldEnName, item.fieldValue];
        }
      }),
    );
    const tableItem = {
      ...table[currentIndex.value],
      ...obj,
      classes: getClassesName(obj.classes),
      tempListData: newVal,
    };
    const newTableItem = {
      ...table[currentIndex.value],
      ...newObj,
    };

    const tableData = table.map((item, index) => {
      if (index === currentIndex.value) {
        return tableItem;
      }
      return item;
    });
    // newTableData用于存储数据（表格数据部分值为name，需要存储code的值）
    newTableData.value = newTableData.value.map((item, index) => {
      if (index === currentIndex.value) {
        return newTableItem;
      }
      return item;
    });
    gridApi?.reloadData(tableData);
  }

  // 获取字段配置列表
  async function getProcrulesTempDetailFn(preSetType) {
    const operationType = {
      Exchange: '1',
      ApplyWork: '2',
      PrePrint: '3',
    };
    changeLoading(true);
    try {
      const { code, data } = await getProcrulesTempDetail({});
      if (code == 200) {
        if (!data.detailList) return;
        state.tempListData = data.detailList.filter(item => {
          return item.operationTypes.includes(operationType[preSetType]);
        });
      }
    } finally {
      changeLoading(false);
    }
  }

  function isNone(value: any, isMultiSelect: number) {
    if (isMultiSelect === 1) {
      return value === undefined || value === null || (Array.isArray(value) && value.length === 0);
    } else {
      return value === undefined || value === null || value === '';
    }
  }

  function checkRequired() {
    const table = gridApi.getDataSource();
    let validatPass = true;
    for (let i = 0; i < table.length; i++) {
      for (let j = 0; j < table[i].tempListData.length; j++) {
        if (table[i].tempListData[j].isRequired === 1 && isNone(table[i].tempListData[j].fieldValue, table[i].tempListData[j].isMultiSelect)) {
          validatPass = false;
          currentIndex.value = i;
          state.tempListData = table[i].tempListData;
          break;
        }
      }
    }
    return validatPass;
  }

  async function handleSubmit() {
    if (state.id) {
      // emit('refresh');
      closeModal();
      return;
    }
    if (!checkRequired()) return createMessage.warning(t('dict.CommonCol.enterRequiredFields'));

    // const paramsData = newTableData.value.map(item => {
    //   return {
    //     ...item,
    //     ...item.tempListData.reduce((accumulator, current) => {
    //       if (current.isMultiSelect === 1) {
    //         accumulator[current.fieldEnName] = current.fieldValue.join(',');
    //       } else {
    //         accumulator[current.fieldEnName] = current.fieldValue;
    //       }
    //       return accumulator;
    //     }, {}),
    //   };
    // });
    changeOkLoading(true);
    try {
      const { code, msg } = await diecutquantityBathadd(newTableData.value);
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

  const handlerInputChangeFn = debounce(async val => {
    if (!val) return;
    changeLoading(true);
    const api = state.operationType === 'ApplyWork' ? getProcessDiecutquantityTagdetail : getProcessCirculationTagDetail;
    try {
      const { data, code } = await api({ documentNumber: val });
      if (code === 200) {
        processBoxs.value && processBoxs.value.getRouteList(data);
        state.scanData = data;
        state.process = data.process;
        state.templistParams.processName = data.processName;
        getDetailbyprocessnameFn(state.templistParams, state.detailData);
      }
    } finally {
      changeLoading(false);
    }
  }, 300);

  const handlerInputSNChangeFn = debounce(async val => {
    if (!val) return;
    changeLoading(true);
    try {
      const { data, code } = await getProcessPrePrintDetailBySn({ snCode: val }).finally(() => {
        translateInputSN.value = '';
      });
      if (code === 200) {
        processBoxs.value && processBoxs.value.getRouteList(data);
        state.scanData = data;
        state.process = data.process;
        state.templistParams.processName = data.processName;
        getDetailbyprocessnameFn(state.templistParams, state.detailData);
      }
    } finally {
      changeLoading(false);
    }
  }, 300);

  const handlerInputKeydown = async (e: any) => {
    if (e.keyCode !== 13) return;
    const tableList = gridApi?.getDataSource();
    // const workOrderNo = state.tempListData.filter(item => item.fieldEnName === 'workOrderNo')[0]?.fieldValue;
    // 根据工单号判断表格里面是否有form表单的数据，有就校验form表单是否必填
    // if (tableList.length > 0 && tableList.some(item => item.workOrderNo === workOrderNo)) {
    //   const res = await tempFormRef.value.validateFormFn().catch(() => {
    //     message.warning('请先输入必填项');
    //   });
    //   if (!res) return;
    // }
    if (tableList.some(item => item.documentNumber === translateInput.value)) {
      message.warning(t('dict.CommonCol.notScanSameCirculationLabelTip'));
      return;
    }
    const val = e.target._value;
    const arr = val.split('!') || [];
    translateInput.value = arr[0];
    handlerInputChangeFn(arr[0]);
  };

  const handlerInputSNKeydown = async (e: any) => {
    if (e.keyCode !== 13) return;
    const tableList = gridApi?.getDataSource();
    // const workOrderNo = state.tempListData.filter(item => item.fieldEnName === 'workOrderNo')[0]?.fieldValue;
    // 根据工单号判断表格里面是否有form表单的数据，有就校验form表单是否必填
    // if (tableList.length > 0 && tableList.some(item => item.workOrderNo === workOrderNo)) {
    //   const res = await tempFormRef.value.validateFormFn().catch(() => {
    //     message.warning('请先输入必填项');
    //   });
    //   if (!res) return;
    // }
    if (tableList.some(item => item.snCode === translateInputSN.value)) {
      message.warning(t('dict.CommonCol.notScanSameCirculationLabelTip'));
      return;
    }
    const val = e.target._value;
    const arr = val.split('!') || [];
    translateInputSN.value = arr[0];
    handlerInputSNChangeFn(arr[0]);
  };

  // 获取开启的模板配置
  async function getDetailbyprocessnameFn(templistParams, mergeItem: any = {}) {
    state.tempListData = [];
    const { code, data } = await getDetailbyprocessname(templistParams);
    if (code === 200) {
      if (mergeItem.id) {
        const showData = data.map(o => {
          o.isDisabled = 1;
          o.fieldValue = mergeItem[o.fieldEnName];
          if (o.fieldEnName === 'classes') {
            o.fieldValue = String(o.fieldValue);
          }
          if (o.isMultiSelect === 1) {
            o.fieldValue = o.fieldValue ? o.fieldValue.split(',') : [];
          }
          return o;
        });
        state.tempListData = showData;
        return;
      }
      state.tempListData = data.map(item => {
        //自动带入扫描标签获取的数据
        item.fieldValue = state.scanData[item.fieldEnName];
        if (item.fieldEnName === 'creatorTime') {
          item.fieldValue = Date.now();
        } else if (item.fieldEnName === 'creatorUserName') {
          item.fieldValue = unref(userStore.getUserInfo).userName;
        } else if (item.fieldEnName === 'orgId') {
          item.fieldValue = unref(userStore.getUserInfo).organizeIdList;
        } else if (item.fieldEnName === 'classes' && item.fieldValue) {
          //自动带入扫描标签获取的数据
          item.fieldValue = String(item.fieldValue);
        }

        // 班次类型转换赋值
        if (item.fieldEnName === 'classes' && item.fieldValue) {
          item.fieldValue = String(item.fieldValue);
        }
        if (item.isMultiSelect === 1) {
          item.fieldValue = item.fieldValue ? item.fieldValue.split(',') : [];
          item.fieldValueName = state.scanData[item.fieldEnName + 'Name'];
        }
        return item;
      });
      // 字典、api调用、人员组件，需要获取name的值
      const nameObj = state.tempListData.reduce((acc, item) => {
        if (
          item.dataType === procRuleTempEnum['DictType'] ||
          item.dataType === procRuleTempEnum['ApiType'] ||
          item.dataType === procRuleTempEnum['Personnel']
        ) {
          acc[item.fieldEnName] = state.scanData[item.fieldEnName + 'Name'];
        }
        if (item.dataType === procRuleTempEnum['TimeType'] && item.fieldValue) {
          acc[item.fieldEnName] = dayjs(item.fieldValue).format('YYYY-MM-DD HH:mm:ss');
        }
        if (item.dataType === procRuleTempEnum['DateType'] && item.fieldValue) {
          acc[item.fieldEnName] = dayjs(item.fieldValue).format('YYYY-MM-DD');
        }
        return acc;
      }, {});
      const dataList = {
        processName: templistParams.processName,
        ...state.scanData,
        tempListData: state.tempListData,
        ...nameObj,
        classes: getShiftType() === '1' ? t('dict.ClassesName.1') : t('dict.ClassesName.2'),
      };
      newTableData.value.push({
        processName: templistParams.processName,
        ...state.scanData,
        tempListData: state.tempListData,
        classes: getShiftType(),
      });
      gridApi?.grid.insertAt(dataList, -1);
      nextTick(() => {
        currentIndex.value = gridApi?.getDataSource().length - 1;
      });
    }
  }
  async function init({ title, data, templistParams }) {
    translateInput.value = '';
    translateInputSN.value = '';
    state.tempListData = [];
    newTableData.value = [];
    state.title = title;
    state.id = data.id;
    state.operationType = templistParams.operationType;
    state.detailData = data;
    state.scanData = [];
    state.templistParams = templistParams;
    const { getTableColumns } = useTallyModel({
      workType: '',
      operationType: templistParams.operationType,
      orgId: templistParams.orgId,
    });
    if (state.id) {
      processBoxs.value && processBoxs.value.getRouteList(data);
      state.templistParams.process = data.process;
      state.templistParams.processName = data.processName;
      getDetailbyprocessnameFn(state.templistParams, state.detailData);
    } else {
      const columns = (await getTableColumns({ operationType: state.operationType, orgId: templistParams.orgId })).map(item => {
        return {
          ...item,
          field: item.dataIndex,
        };
      });
      if (columns.length === 0) {
        gridApi?.reloadColumn([]);
      } else {
        columns.push({
          title: '操作',
          field: 'action',
          slots: { default: 'action' },
          width: 100,
          fixed: 'right',
        });
        gridApi?.reloadColumn(columns);
      }
      getProcrulesTempDetailFn(templistParams.operationType);
    }
  }
</script>
<style lang="less" scoped>
  .title {
    padding-bottom: 0;
    font-size: 16px;
    font-weight: 600;
  }

  .form-block {
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

  :deep(.icon-ym-scanCode) {
    color: #ff7b00 !important;
  }

  .form-search-block {
    margin-bottom: 12px;
    display: flex;
    align-items: center;

    .form-search-block-label {
      text-align: right;
    }
  }

  :deep(.scroll-container) {
    padding: 16px 20px 0 !important;
  }

  :deep(.subtitle-container) {
    padding: 0;

    .title {
      font-size: 16px;
    }
  }
</style>
