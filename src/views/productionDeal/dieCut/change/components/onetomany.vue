<template>
  <div>
    <div class="form-search-block">
      <div>{{ t('common.circulationLabel') }}：</div>
      <!-- 流转标签 -->
      <div class="w-1/2">
        <LydcInput
          :disabled="labelInputDisabled"
          :suffixIcon="'icon-ym icon-ym-scanCode'"
          v-model:value="translateInput"
          :placeholder="t('common.scanText')"
          @Keydown="handlerInputKeydown" />
      </div>
    </div>

    <!-- form模板 -->
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

    <!-- 表格 -->
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
    <AllocateModal @register="registerAllocate" @closeModal="handleAllocateFn"> </AllocateModal>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, unref } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { getDetailbyprocessname, getProcrulesTempDetail } from '/@/api/basicData/processrulestemplate';
  import TempForm from '/@/views/productionPlan/procruleTemp/components/tempForm.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  // import { usePrePrintModel } from '../hooks/usePrePrintModel';
  import { useUserStore } from '/@/store/modules/user';
  import { cloneDeep, debounce } from 'lodash-es';
  import { getDetailbydocumentnumber, getPrintnextnode, transferOnetomany } from '/@/api/productionDeal/dieCutPerPrint';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicTable, useTable, ActionItem } from '/@/components/Table';
  import { OperationTypeValue } from '../const';
  import { buildUUID } from '/@/utils/uuid';
  import nodata from '/@/assets/images/process/nodata.png';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import AllocateModal from './allocateModal.vue';
  import { getShiftType } from '/@/utils/time';
  import { procRuleTempEnum } from '/@/views/productionPlan/procruleTemp/types';
  import { processBox } from '/@/components/processBox';
  import dayjs from 'dayjs';
  // let basicProcess = ''; // 用于判断每一次扫描的标签都需要一致
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
    // id: String;
    processName: string;
    operationType: string;
    // documentNumber: String;
    // title: any;
    tempListData: any[];
    // pageType: string;
  }
  const state = reactive<State>({
    templistParams: {}, // 列表传过来的厂区
    // detailData: {},
    scanDetailData: {},
    // processDetailData: {},
    // nextDataArray: [],
    // id: '',
    // title: '',
    tempListData: [],
    processName: '',
    operationType: '', // 用于获取模板配置
    // pageType: '',
    // documentNumber: '',
  });
  const tempFormRef = ref();
  const translateInput = ref(''); // 流转标签
  const labelInputDisabled = ref(false);
  const newTableData = ref<any[]>([]);

  const { createMessage } = useMessage();
  const [registerAllocate, { openModal: openAllocate }] = useModal();
  const [registerTable, { setColumns, insertTableDataRecord, deleteTableDataRecord, getDataSource, setTableData }] = useTable({
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
      width: 80,
    },
  });

  function getTableActions(record, index): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-edit',
        onClick: () => handleEditFn(record, index),
        tooltip: t('common.edit'),
        // auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-generator-tree',
        onClick: () => openAllocateFn(record, index),
        // auth: 'btn_detail',
        tooltip: t('dict.CommonCol.allocate'),
        ifShow: !record.isAllocate,
      },
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: () => handleDeleteFn(record, index),
        tooltip: t('common.delText'),
        // auth: 'btn_detail',
      },
    ];
  }

  function handleEditFn(record, index) {
    currentIndex.value = index;
    // 将模板内容展示为当前行的模板内容
    if (record.tempListData) {
      state.tempListData = record.tempListData;
    }
  }

  // 用户分配时，复制当前行
  const currentRow = ref<any>({});
  // 用于修改模板信息时，对应修改表格当前行的模板信息
  const currentIndex = ref(0);
  function openAllocateFn(record, index) {
    currentIndex.value = index;
    if (!record.tempListData) {
      record.tempListData = state.tempListData;
    }
    currentRow.value = record;
    openAllocate(true, {});
  }

  function handleAllocateFn(num) {
    for (let i = 0; i < num; i++) {
      const copyRowData = cloneDeep({ ...currentRow.value, id: buildUUID(), isAllocate: true });
      const copyNewRowData = cloneDeep({ ...newTableData.value[currentIndex.value], id: buildUUID(), isAllocate: true });
      insertTableDataRecord(copyRowData);
      newTableData.value.push(copyNewRowData);
    }
  }

  function handleDeleteFn(record: any, index) {
    deleteTableDataRecord(record.id);
    newTableData.value.splice(index, 1);
    // state.nextDataArray = state.nextDataArray.filter(o => o.documentNumber !== record.documentNumber);
    const dataSource = getDataSource();
    if (!dataSource.length) {
      // basicProcess = '';
      labelInputDisabled.value = false;
    }
  }
  const oldVal = ref<any[]>([]);

  function findChangedObjects(list, newList) {
    const changedObjects: any[] = [];

    for (let i = 0; i < list.length; i++) {
      const originalItem = list[i];
      const newItem = newList[i];

      if (originalItem.fieldEnName === newItem.fieldEnName && JSON.stringify(originalItem.fieldValue) !== JSON.stringify(newItem.fieldValue)) {
        changedObjects.push(newItem);
      }
    }
    return changedObjects;
  }

  const getClassesName = classes => {
    if (!classes) return getShiftType() === '1' ? t('dict.ClassesName.1') : t('dict.ClassesName.2');
    if (classes === '1' || classes === '2') {
      return classes === '1' ? t('dict.ClassesName.1') : t('dict.ClassesName.2');
    }
    return classes;
  };

  function tempFormChange(newVal) {
    const table = getDataSource();
    const changedObjects = findChangedObjects(oldVal.value, newVal);
    // 处理模板的数据渲染表格
    // 有fieldValueName，渲染fieldValueName，渲染名称
    const changePropertyObj = Object.fromEntries(changedObjects.map(item => [item.fieldEnName, item.fieldValueName || item.fieldValue]));
    const tableItem = {
      ...table[currentIndex.value],
      ...changePropertyObj,
      classes: getClassesName(changePropertyObj.classes),
      tempListData: newVal,
    };
    const tableData = table.map((item, index) => {
      if (index === currentIndex.value) {
        return tableItem;
      }
      return item;
    });
    setTableData(tableData);

    // 处理模板的数据给newTableData用于提交
    // 将多选的数据，fieldValue转成字符串传给newTableData，用于保存
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
    // 数据拿的是fieldValue，获取到的是code值
    const newObj = Object.fromEntries(tableNewVal.map(item => [item.fieldEnName, item.fieldValue]));
    const newTableItem = {
      ...table[currentIndex.value],
      ...newObj,
    };
    // newTableData用于存储数据（表格数据部分值为name，需要存储code的值）
    newTableData.value = newTableData.value.map((item, index) => {
      if (index === currentIndex.value) {
        return newTableItem;
      }
      return item;
    });
    oldVal.value = cloneDeep(newVal);
  }

  function isNone(value: any) {
    return value === undefined || value === null || value === '';
  }

  async function checkRequired() {
    const table = getDataSource();
    let validatPass = true;
    for (let i = 0; i < table.length; i++) {
      for (let j = 0; j < table[i].tempListData.length; j++) {
        if (table[i].tempListData[j].isRequired === 1 && isNone(table[i].tempListData[j].fieldValue)) {
          validatPass = false;
          currentIndex.value = i;
          state.tempListData = table[i].tempListData;
          await tempFormRef.value.validateFormFn();
          break;
        }
      }
    }
    return validatPass;
  }

  async function handleSubmit() {
    if (!newTableData.value.length) {
      return createMessage.warning(t('common.scanCirculationProcess'));
    }
    if (!(await checkRequired())) return createMessage.warning(t('dict.CommonCol.enterRequiredFields'));

    emit('changeLoading', true);
    try {
      const { code, msg } = await transferOnetomany(newTableData.value);
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
        oldVal.value = cloneDeep(state.tempListData);
      }
    } finally {
      emit('changeLoading', false);
    }
  }

  // 表格显示名称的逻辑：
  // 1、回车时，是判断类型为（字典下拉、api下拉、人员组件下拉），则加字段后面拼接上Name得到新的字段的value并赋值给改字段后再插入表格渲染名称数据
  // 2、form模板修改时，如果是下拉数据的话，使用fieldValueName字段渲染数据。（流转标签扫码的时候会先给form里面的下拉数据增加fieldValueName字段。切换下拉框数据的时候会同步更改fieldValueName字段）
  const handlerInputChangeFn = debounce(async val => {
    if (!val) return;
    translateInput.value = '';
    emit('changeLoading', true);
    // getDetailbydocumentnumber用于获取模板详情
    // getPrintnextnode用于获取工序详情
    Promise.all([getDetailbydocumentnumber({ documentNumber: val }), getPrintnextnode({ documentNumber: val })])
      .then(res => {
        const [scanDetailData, processDetailData] = res;
        const scanDetail = scanDetailData?.data;
        const processDetail = processDetailData?.data;

        // // 标签不能重复校验
        // const tableData = getDataSource();
        // let msg = '';
        // if (tableData.length) {
        //   tableData.forEach(o => {
        //     if (o.documentNumber === val) {
        //       msg = '已存在该标签，请重新扫码！';
        //     }
        //   });
        // }
        // if (msg) {
        //   return createMessage.warning(msg);
        // }

        // // 流转标签转换-每一次扫描的标签工序都要一致
        // if (!basicProcess) {
        //   basicProcess = processDetail?.process;
        // }
        // if (basicProcess !== processDetail?.process) {
        //   return createMessage.warning('录入工序不一致，请重新扫码！');
        // }

        // 获取模板详情
        state.scanDetailData = scanDetail;
        processBoxs.value && processBoxs.value.getRouteList(state.scanDetailData);

        // 获取工序名称
        state.templistParams.processName = processDetail?.processName;
        state.templistParams.process = processDetail?.process;

        // 只允许扫描一次，清除数据和才可再次扫描标签
        labelInputDisabled.value = true;

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
          // 创建时间为当前时间
          item.fieldValue = Date.now();
        } else if (item.fieldEnName === 'creatorUserName') {
          // 创建人为当前操作人
          item.fieldValue = unref(userStore.getUserInfo).userName;
        } else if (item.fieldEnName === 'orgId') {
          item.fieldValue = unref(userStore.getUserInfo).organizeIdList;
        } else {
          // 模板自动带入扫描标签获取的详情数据
          item.fieldValue = state.scanDetailData[item.fieldEnName];
        }
        // 班次类型转换赋值
        if (item.fieldEnName === 'classes' && item.fieldValue) {
          item.fieldValue = String(item.fieldValue);
        }
        // 多选的字段需要将fieldValue转为数组用于渲染form
        if (item.isMultiSelect === 1) {
          item.fieldValue = item.fieldValue && item.fieldValue.split(',');
        }
        // 判断类型为（字典下拉、api下拉、人员组件下拉），同时获取名称给fieldValueName，避免修改form模板的时候导致表格显示的名称又还原成id（修改form模板后表格的一些名称如操作员是根据fieldValueName显示的）
        if (
          item.dataType === procRuleTempEnum['DictType'] ||
          item.dataType === procRuleTempEnum['ApiType'] ||
          item.dataType === procRuleTempEnum['Personnel']
        ) {
          item.fieldValueName = state.scanDetailData[item.fieldEnName + 'Name'];
        }
        // if (state.pageType === SharePageType.StartWork) {
        //   item.isDisabled = 1;
        // }
        columns.push({
          title: item.fieldCnName,
          dataIndex: item.fieldEnName,
        });
        // tableDataObj[item.fieldEnName] = item.fieldValue;
        // tableDataObj.id = buildUUID();
        return item;
      });

      oldVal.value = cloneDeep(state.tempListData);
      // 回车时，是判断类型为（字典下拉、api下拉、人员组件下拉），则加字段后面拼接上Name得到新的字段的value并赋值给改字段后再插入表格渲染名称数据
      const nameObj = state.tempListData.reduce((acc, item) => {
        if (
          item.dataType === procRuleTempEnum['DictType'] ||
          item.dataType === procRuleTempEnum['ApiType'] ||
          item.dataType === procRuleTempEnum['Personnel']
        ) {
          acc[item.fieldEnName] = state.scanDetailData[item.fieldEnName + 'Name'];
        }
        if (item.fieldEnName === 'classes' && !item.fieldValue) {
          acc[item.fieldValue] = getShiftType();
          acc[item.fieldEnName] = getShiftType() === '1' ? t('dict.ClassesName.1') : t('dict.ClassesName.2');
        }
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
      const dataItem = {
        ...state.scanDetailData,
        ...nameObj,
        classes: getShiftType() === '1' ? t('dict.ClassesName.1') : t('dict.ClassesName.2'),
        tempListData: state.tempListData,
      };
      // 设置表头
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
    // basicProcess = '';
    translateInput.value = '';
    state.scanDetailData = {};
    // state.title = 'title';
    // state.id = data.id;
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
