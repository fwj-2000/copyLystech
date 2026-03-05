<template>
  <BasicModal v-bind="$attrs" @register="registerModal" showOkBtn @ok="handleSubmit" @cancel="handleCloseFn" destroyOnClose width="1350px" :minHeight="660">
    <template #title>
      <div class="ml-16px">
        <Subtitle :title="t('dict.CommonCol.singleProductReport')" />
      </div>
    </template>
    <div class="h-[550px]">
      <!-- SN -->
      <div class="form-search-block">
        <div class="w-[70px] form-search-block-label"> SN：</div>
        <div class="w-1/2">
          <LydcInput
            class="sn-input"
            :suffixIcon="'icon-ym icon-ym-scanCode'"
            :disabled="isCheck"
            v-model:value="translateInputSN"
            :placeholder="t('common.scanText')"
            @Keydown="handlerInputSNKeydown" />
        </div>
        <!-- 确定 -->
        <a-button type="primary" class="ml-12px" @click="handleClickSure" :disabled="tableLength > 0">{{ t('common.okText') }}</a-button>
      </div>
      <div class="form-block">
        <processBox ref="processBoxs" />
        <div :class="['form-block-content', 'min-h-150px', 'overflow-auto', 'max-h-180px']" v-if="state.tempListData.length">
          <TempForm
            :tempList="state.tempListData"
            ref="tempFormRef"
            :colSpan="4"
            :isNeedValidate="true"
            :processName="state.templistParams.processName"
            :process="state.templistParams.process"
            :operationType="state.operationType"
            @tempFormChange="tempFormChange"
            @inputKeydown="inputKeydown" />
        </div>
      </div>
      <div class="h-320px mt-20px">
        <Grid>
          <template #toolbar-actions>
            <a-button v-if="isCNC" danger @click="handleDeleteAllCNC" :disabled="tableLength < 1">{{ t('common.delText') }}</a-button>
            <a-button v-else danger @click="handleDeleteAll" :disabled="!isCheck">{{ t('common.delText') }}</a-button>
          </template>
          <template #action="{ $rowIndex }">
            <TableAction outside :actions="getTableActions($rowIndex)" />
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
  import { getDetailbyprocessname, getProcrulesTempDetail, SNUsrerCheck } from '/@/api/basicData/processrulestemplate';
  import TempForm from '/@/views/productionPlan/procruleTemp/components/tempForm.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useTallyModel } from '../hooks/useTallyModel';
  import { useUserStore } from '/@/store/modules/user';
  import { TableAction } from '/@/components/Table';
  import { getShiftType } from '/@/utils/time';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { cloneDeep } from 'lodash-es';
  import { procRuleTempEnum } from '/@/views/productionPlan/procruleTemp/types';
  import { Subtitle } from '/@/components/Subtitle';
  import { getProcessPrePrintDetailBySn, snbathadd } from '/@/api/productionDeal/dieCuttingTally';
  import { message } from 'ant-design-vue';
  import { processBox } from '/@/components/processBox';
  import dayjs from 'dayjs';
  const processBoxs = ref();
  const { t } = useI18n();
  const userStore = useUserStore();
  const { createMessage } = useMessage();
  const emit = defineEmits(['refresh']);
  interface State {
    dataForm: any;
    templistParams: any;
    scanData: any;
    operationType: string;
    tempListData: any[];
  }
  const state = reactive<State>({
    dataForm: {},
    templistParams: {},
    scanData: [],
    tempListData: [],
    operationType: '',
  });
  const tempFormRef = ref();
  const translateInputSN = ref('');
  const translateInputSNCache = ref('');
  const isCheck = ref(false);
  const cavityNoQty = ref(4);
  const singleReportQty = ref(0);

  const [registerModal, { changeLoading, changeOkLoading }] = useModalInner(init);

  const gridEvents = {
    checkboxChange: ({ row, checked }) => {
      if (!isCNC.value) return;
      let tableList = gridApi.getDataSource();
      if (!checked) {
        // 去掉勾选也要将同一单据的其他勾选去掉
        const unSelectList = tableList.filter(item => item.groupId === row.groupId);
        gridApi.grid.setCheckboxRow(unSelectList, false);
      }
      const groupIds = gridApi.getSelectRows().map(item => item.groupId);
      // 相同单据号的也要一起同步勾选
      const selectList = tableList.filter(item => groupIds.includes(item.groupId));
      gridApi.grid.setCheckboxRow(selectList, true);
    },
  };

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionDeal-dieCut-change-applyWork-SN-list',
      // toolbarConfig: {
      //   enabled: false,
      // },
      pagerConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: 'uId',
      },
      rowClassName: ({ row }) => {
        const { isVerifyOk } = row;
        return isVerifyOk === '0' ? 'cell-red' : '';
      },
      // i18nConfig: {
      //   moduleCode: 'RepairMoldColumn',
      // },
    },
    gridEvents,
  });

  function getTableActions(index) {
    return [
      // 删除
      {
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('dict.ProgressStatusEnum.8'),
        onClick: handleDelete.bind(null, index),
        disabled: isCheck.value || isCNC.value,
        // auth: 'btn_edit',
      },
    ];
  }

  const handleDelete = index => {
    const tableList = gridApi.getDataSource();
    if (isCavityNo.value) {
      const list = tableList.map((item, item_index) => {
        if (item_index === index) {
          return {
            ...item,
            cavityNo: '',
            documentNumber: '',
          };
        } else {
          return item;
        }
      });
      gridApi?.grid.reloadData(list);
    } else {
      tableList.splice(index, 1);
      const tableListLength = tableList.length;
      const list = tableList.map((item, index) => {
        return {
          ...item,
          rowId: (tableListLength - index).toString(),
          uId: (tableListLength - index).toString(),
        };
      });
      gridApi?.grid.reloadData(list);
      tableLength.value--;
    }
  };

  const handleDeleteAll = () => {
    const tableList = gridApi.getDataSource();
    const selectRowIds = gridApi.getSelectRows().map(item => item.rowId);
    const list = tableList.filter(item => !selectRowIds.includes(item.rowId));
    gridApi.grid.reloadData(list);
    tableLength.value = list.length;
  };

  const handleDeleteAllCNC = () => {
    const tableList = gridApi.getDataSource();
    const selectRowIds = gridApi.getSelectRows().map(item => item.rowId);
    const list = tableList
      .filter(item => !selectRowIds.includes(item.rowId))
      .map((table_item, table_index) => {
        return {
          ...table_item,
          rowId: (table_index + 1).toString(),
          uId: (table_index + 1).toString(),
        };
      });
    gridApi.grid.reloadData(list);
    tableLength.value = list.length;
    if (tableLength.value === 0) {
      isCNC.value = false;
    }
  };

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

  const oldVal = ref<any[]>([]);

  const getClassesName = classes => {
    if (classes === '1' || classes === '2') {
      return classes === '1' ? t('dict.ClassesName.1') : t('dict.ClassesName.2');
    }
    return classes;
  };

  function tempFormChange(newVal) {
    const changedObjects = findChangedObjects(oldVal.value, newVal);
    const changePropertyObj = Object.fromEntries(changedObjects.map(item => [item.fieldEnName, item.fieldValueName || item.fieldValue]));
    firstDataItem.value = {
      ...firstDataItem.value,
      ...changePropertyObj,
      classes: getClassesName(changePropertyObj.classes ? changePropertyObj.classes : firstDataItem.value.classes),
    };
    const tableList = gridApi?.getDataSource()?.map(item => {
      return {
        ...item,
        ...changePropertyObj,
        classes: getClassesName(changePropertyObj.classes ? changePropertyObj.classes : item.classes),
      };
    });

    gridApi.reloadData(tableList);
    oldVal.value = cloneDeep(newVal);
  }

  function isMoldMatchProduct(productCode, mouldNo) {
    if (!productCode || !mouldNo) return;
    // 产品编号
    const productCodeSplit = productCode.split('-');
    //  模具编号
    const mouldNoSplit = mouldNo.split('-');

    if (mouldNoSplit.length && !productCodeSplit[1].includes(mouldNoSplit[0])) {
      return false;
    }
    return true;
  }

  function inputKeydown(item) {
    if (item.fieldEnName === 'mouldNo') {
      // 产品编号
      const productCode = oldVal.value.find(item => item.fieldEnName === 'productCode')?.fieldValue;
      if (!isMoldMatchProduct(productCode, item.fieldValue)) {
        item.fieldValue = '';
        createMessage.warning(t('dict.CommonCol.moldNotMatchProduct'));
        return;
      }
    }
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
        oldVal.value = cloneDeep(state.tempListData);
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
    let validatPass = true;
    for (let i = 0; i < oldVal.value.length; i++) {
      if (oldVal.value[i].isRequired === 1 && isNone(oldVal.value[i].fieldValue, oldVal.value[i].isMultiSelect)) {
        validatPass = false;
        break;
      }
    }
    return validatPass;
  }

  async function handleSubmit() {
    if (!checkRequired()) return createMessage.warning(t('dict.CommonCol.enterRequiredFields'));

    const formData = oldVal.value.reduce((accumulator, current) => {
      accumulator[current.fieldEnName] = current.isMultiSelect === 1 ? current.fieldValue.join(',') : current.fieldValue;
      return accumulator;
    }, {});
    const tableList = gridApi.getDataSource();
    if (tableList.some(item => item.isVerifyOk === '0')) return createMessage.warning(t('dict.CommonCol.deleteIncorrectSNTip'));
    if (isCavityNo.value && tableList.some(item => !item.cavityNo)) return createMessage.warning(t('dict.CommonCol.hasEmptyCavity'));
    if (!isCavityNo.value && tableList.length < singleReportQty.value)
      return createMessage.warning(t('dict.CommonCol.singleReportQtyTip', [singleReportQty.value.toString()]));

    if (oldVal.value.some(item => item.fieldEnName === 'mouldNo')) {
      // 判断产品编号和模具号是否一致
      const productCode = oldVal.value.find(item => item.fieldEnName === 'productCode')?.fieldValue;
      const mouldNo = oldVal.value.find(item => item.fieldEnName === 'mouldNo')?.fieldValue;
      if (!isMoldMatchProduct(productCode, mouldNo)) {
        state.tempListData = oldVal.value.map(item => {
          if (item.fieldEnName === 'mouldNo') {
            return {
              ...item,
              fieldValue: '',
            };
          } else {
            return { ...item };
          }
        });
        const list = tableList.map(item => {
          return {
            ...item,
            mouldNo: '',
          };
        });
        gridApi.reloadData(list);
        oldVal.value = cloneDeep(state.tempListData);
        createMessage.warning(t('dict.CommonCol.moldNotMatchProduct'));
        return;
      }
    }

    const params = {
      ...state.scanData,
      ...formData,
      snCodeList: tableList.map(item => {
        return {
          snCode: isCavityNo.value ? item.documentNumber : item.snCode,
          rowId: item.rowId,
          cavityNo: item.cavityNo,
          uId: item.uId,
        };
      }),
    };
    changeOkLoading(true);
    try {
      isCheck.value = true;
      const { msg, data } = await snbathadd(params);
      if (data === true) {
        createMessage.success(msg);
        state.tempListData = state.tempListData.map(item => {
          return {
            ...item,
            fieldValue: '',
          };
        });
        emit('refresh');
        gridApi.grid.loadData([]);
        resetData();
        setTimeout(() => {
          document.getElementsByClassName('sn-input')[0]?.querySelector('input')?.focus();
        }, 500);
      } else {
        const list = data.map(item => {
          return {
            ...item,
            classes: item.classesName,
            uId: item.rowId,
          };
        });

        await gridApi.reloadData(list);
        const verifyFailureList = data
          .filter(item => item.isVerifyOk === '0')
          .map(item => {
            return {
              ...item,
              uId: item.rowId,
            };
          });
        setTimeout(() => {
          gridApi.grid.setCheckboxRow(verifyFailureList, true);
        }, 500);
      }
    } finally {
      changeOkLoading(false);
    }
  }

  async function handleCloseFn() {
    state.tempListData = [];
  }

  const handlerInputSNChangeFn = async (val, isCNC = false) => {
    if (!val) return;
    changeLoading(true);
    try {
      const tableList = gridApi.getDataSource();
      translateInputSN.value = '';
      const { data, code } = await getProcessPrePrintDetailBySn({ snCode: val });
      if (code === 200) {
        if (tableList.length && (data.routeNodeId !== tableList[0].routeNodeId || data.routeId !== tableList[0].routeId)) {
          message.error(t('dict.CommonCol.scanSameProcessSNTip'));
          throw new Error(t('dict.CommonCol.scanSameProcessSNTip'));
        }
        if (data.warnMsg) {
          createMessage.warning({ content: data.warnMsg, duration: 3 });
        }
        singleReportQty.value = data.singleReportQty;
        processBoxs.value && processBoxs.value.getRouteList(data);
        let res = await SNUsrerCheck({
          FactoryArea: data.factory,
          ProcessCode: data.process,
        });
        if (!res.data) {
          message.error(t('dict.CommonCol.DQGXCZRBSN'));
          throw new Error(t('dict.CommonCol.DQGXCZRBSN'));
        }
        state.scanData = data;
        state.templistParams.processName = data.processName;
        state.templistParams.process = data.process;
        if (isCNC && tableList.length) return;
        await getDetailbyprocessnameFn(state.templistParams);
      }
    } finally {
      changeLoading(false);
    }
  };

  function cavityNoNoneExitFn() {
    const tableList = gridApi?.getDataSource();
    // 同一批次的SN还没扫完需将相应的模穴号都填充完整才可以扫描下一批次的
    const firstFourElements = tableList.slice(0, cavityNoQty.value);
    const cavityNo = Number(translateInputSNCache.value[3]);
    if (firstFourElements.some(item => Number(item.cavityNo) === cavityNo) && firstFourElements.some(item => !item.rowId)) {
      createMessage.warning(t('dict.CommonCol.SNIncorrectTip'));
      translateInputSN.value = '';
      translateInputSNCache.value = '';
      return;
    }

    const groupedList = tableList.reduce((acc, item, index) => {
      if (index % cavityNoQty.value === 0) {
        acc.push([]);
      }
      acc[acc.length - 1].push(item);
      return acc;
    }, []);

    const isFilled = groupedList.every(subArray => subArray[cavityNo - 1] && subArray[cavityNo - 1].cavityNo);
    if (isFilled) {
      translateInputSN.value = '';
      translateInputSNCache.value = '';
      createMessage.warning(t('dict.CommonCol.SNIncorrectTip'));
      return;
    }

    for (let i = groupedList.length - 1; i >= 0; i--) {
      // 检查当前子数组的第n个元素是否存在
      const item = groupedList[i][cavityNo - 1];
      if (item && !item.cavityNo) {
        if (!item.rowId) {
          totalIndex.value++;
          item.rowId = totalIndex.value;
        }
        item.cavityNo = cavityNo;
        item.documentNumber = translateInputSNCache.value;
        break; // 找到后即退出循环
      }
    }

    const flatList = groupedList.reduce((acc, current) => acc.concat(current), []);
    translateInputSN.value = '';
    translateInputSNCache.value = '';

    gridApi.reloadData(flatList);
  }

  function nextBatchCavityNoFn() {
    const tableList = gridApi?.getDataSource();
    // 扫描下一批次
    // 获取模穴号
    const cavityNo = Number(translateInputSNCache.value[3]);
    const copyItem = tableList[tableList.length - 1];
    // 创建一个包含四个对象的数组
    const list = Array.from({ length: cavityNoQty.value }, (_, index) => ({
      ...copyItem,
      cavityNo: '',
      uId: (tableList.length + index + 1).toString(), // rowId 从 1 开始
      rowId: '', // rowId 从 1 开始
      documentNumber: '',
    }));
    // 根据第四个字符的值，将字符填充到数组中对应索引位置的对象中
    if (cavityNo >= 1 && cavityNo <= cavityNoQty.value) {
      totalIndex.value++;
      list[cavityNo - 1] = {
        ...list[cavityNo - 1],
        cavityNo: cavityNo,
        documentNumber: translateInputSNCache.value,
        rowId: totalIndex.value,
      };
    }
    translateInputSN.value = '';
    translateInputSNCache.value = '';
    gridApi.reloadData([...list, ...tableList]);
  }

  function handleCavityNoKeyDown() {
    const tableList = gridApi?.getDataSource();
    const cavityNoNoneExit = tableList.some(item => !item.cavityNo);
    if (cavityNoNoneExit) {
      // 同一批次的SN还没扫完需将相应的模穴号都填充完整才可以扫描下一批次的
      cavityNoNoneExitFn();
    } else {
      // 扫描下一批次
      // 获取模穴号
      nextBatchCavityNoFn();
    }
  }

  function handleHasTableListKeyDown() {
    const tableList = gridApi?.getDataSource();
    if (isCavityNo.value) {
      handleCavityNoKeyDown();
    } else {
      if (singleReportQty.value && tableList.length >= singleReportQty.value) {
        translateInputSN.value = '';
        translateInputSNCache.value = '';
        // `当前工序单次报工数量为${singleReportQty.value}`
        message.warning(t('dict.CommonCol.singleReportQtyTip', [singleReportQty.value.toString()]));
        return;
      }
      gridApi.reloadData([
        {
          ...tableList[0],
          creatorTime: dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
          snCode: translateInputSN.value,
          rowId: (tableList.length + 1).toString(),
          uId: (tableList.length + 1).toString(),
        },
        ...tableList,
      ]);

      translateInputSN.value = '';
      tableLength.value++;
    }
  }

  const handlerInputSNKeydown = async (e: any) => {
    if (e.keyCode !== 13) return;

    const tableList = gridApi?.getDataSource();
    if (isCavityNo.value && tableList.some(item => item.documentNumber === translateInputSN.value)) {
      translateInputSN.value = '';
      translateInputSNCache.value = '';
      message.warning(t('dict.CommonCol.notScanSameCirculationLabelTip'));
      return;
    }

    if (!isCavityNo.value && tableList.some(item => item.snCode === translateInputSN.value)) {
      translateInputSN.value = '';
      translateInputSNCache.value = '';
      message.warning(t('dict.CommonCol.notScanSameCirculationLabelTip'));
      return;
    }

    const val = e.target._value;
    const arr = val.split('!') || [];
    translateInputSN.value = arr[0];
    translateInputSNCache.value = arr[0];
    if (!translateInputSN.value) return;
    if (isCNC.value) {
      if (!arr[0]) return;
      await handlerInputSNChangeFn(arr[0], isCNC.value);
      scanCNC({ ...firstDataItem.value, ...state.scanData });
      translateInputSN.value = '';
      tableLength.value++;
      return;
    }
    if (tableList.length) {
      handleHasTableListKeyDown();
    } else {
      // 第一次扫描
      handlerInputSNChangeFn(arr[0]);
    }
  };

  const firstDataItem = ref<any>({});

  // 获取开启的模板配置
  async function getDetailbyprocessnameFn(templistParams) {
    state.tempListData = [];
    const columns: any = [];
    const { code, data } = await getDetailbyprocessname(templistParams);
    if (code === 200) {
      state.tempListData = data.map(item => {
        if (item.fieldEnName === 'creatorTime') {
          // 创建时间为当前时间
          item.fieldValue = Date.now();
        } else if (item.fieldEnName === 'creatorUserName') {
          // 创建人为当前操作人
          item.fieldValue = unref(userStore.getUserInfo).userName;
        } else if (item.fieldEnName === 'operatorId') {
          // 创建人为当前操作人
          item.fieldValue = unref(userStore.getUserInfo).userId;
          item.fieldValueName = unref(userStore.getUserInfo).userName;
        } else if (item.fieldEnName === 'orgId') {
          item.fieldValue = unref(userStore.getUserInfo).organizeIdList;
        } else {
          // 模板自动带入扫描标签获取的详情数据
          item.fieldValue = state.scanData[item.fieldEnName];
        }
        // 班次类型转换赋值
        if (item.fieldEnName === 'classes' && item.fieldValue) {
          item.fieldValue = String(item.fieldValue);
        }
        // 多选的字段需要将fieldValue转为数组用于渲染form
        if (item.isMultiSelect === 1) {
          item.fieldValue = item.fieldValue && item.fieldValue.split(',');
          if (item.fieldEnName !== 'operatorId') {
            item.fieldValueName = state.scanData[item.fieldEnName + 'Name'];
          }
        }
        // 判断类型为（字典下拉、api下拉、人员组件下拉），同时获取名称给fieldValueName，避免修改form模板的时候导致表格显示的名称又还原成id（修改form模板后表格的一些名称如操作员是根据fieldValueName显示的）
        if (
          (item.dataType === procRuleTempEnum['DictType'] ||
            item.dataType === procRuleTempEnum['ApiType'] ||
            item.dataType === procRuleTempEnum['Personnel']) &&
          item.fieldEnName !== 'operatorId'
        ) {
          item.fieldValueName = state.scanData[item.fieldEnName + 'Name'];
        }
        columns.push({
          title: item.fieldCnName,
          field: item.fieldEnName,
        });

        return item;
      });
      if (state.tempListData.some(item => item.fieldEnName === 'cavityNo')) {
        isCavityNo.value = true;
        state.tempListData = state.tempListData.filter(item => item.fieldEnName !== 'cavityNo');
      }

      oldVal.value = cloneDeep(state.tempListData);
      // 回车时，是判断类型为（字典下拉、api下拉、人员组件下拉），则加字段后面拼接上Name得到新的字段的value并赋值给改字段后再插入表格渲染名称数据
      const nameObj = state.tempListData.reduce((acc, item) => {
        if (
          item.dataType === procRuleTempEnum['DictType'] ||
          item.dataType === procRuleTempEnum['ApiType'] ||
          item.dataType === procRuleTempEnum['Personnel']
        ) {
          acc[item.fieldEnName] = state.scanData[item.fieldEnName + 'Name'];
        }
        // 根据当前时间默认设置白班或者晚班
        if (item.fieldEnName === 'classes' && !item.fieldValue) {
          acc[item.fieldValue] = getShiftType();
          acc[item.fieldEnName] = getShiftType() === '1' ? t('dict.ClassesName.1') : t('dict.ClassesName.2');
        }
        // 获取当前人员信息和创建时间creatorUserName、creatorTime、orgId
        // SN没有流转标签打印，没有配置创建人，默认给定当前系统登录人员
        if (item.fieldEnName === 'creatorUserName' || item.fieldEnName === 'orgId') {
          acc[item.fieldEnName] = item.fieldValue;
        }
        if (item.fieldEnName === 'operatorId') {
          acc[item.fieldEnName] = item.fieldValueName;
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
        ...state.scanData,
        ...nameObj,
        classes: getShiftType() === '1' ? t('dict.ClassesName.1') : t('dict.ClassesName.2'),
      };
      gridApi?.reloadColumn([
        { field: 'checkbox', width: 50, type: 'checkbox' },
        { field: 'rowId', title: t('dict.CommonCol.seq'), width: 50 },
        {
          title: '错误信息',
          field: 'errorMsg',
          width: 180,
        },
        ...columns,
        {
          title: '操作',
          field: 'action',
          slots: { default: 'action' },
          width: 100,
          fixed: 'right',
        },
      ]);
      firstDataItem.value = dataItem;
    }
  }

  const tableLength = ref(0);
  const isCavityNo = ref(false);
  const totalIndex = ref(0);
  const isCNC = ref(false);

  const afterHandleClickSure = () => {
    translateInputSNCache.value = '';
    tableLength.value++;
    document.getElementsByClassName('sn-input')[0]?.querySelector('input')?.focus();
  };

  const scanCNC = dataItem => {
    const tableList = gridApi.getDataSource();
    const groupId = Date.now();
    const snCodes = (dataItem.snCodes || []).map((item, index) => {
      let sncode = {
        ...dataItem,
        rowId: (tableList.length + index + 2).toString(),
        uId: (tableList.length + index + 2).toString(),
        snCode: item,
        groupId,
      };
      delete sncode.snCodes;
      return sncode;
    });
    let data = {
      ...dataItem,
      rowId: (tableList.length + 1).toString(),
      uId: (tableList.length + 1).toString(),
      snCode: translateInputSNCache.value,
      groupId,
    };
    delete data.snCodes;
    gridApi.reloadData([data, ...snCodes, ...tableList]);
  };

  const handleClickSure = () => {
    if (!state.scanData?.routeId) return createMessage.warning(t('dict.CommonCol.scanSNTip'));
    const tableList = gridApi.getDataSource();
    if (isCavityNo.value) {
      // 获取模穴号
      const cavityNo = Number(translateInputSNCache.value[3]);
      // 创建一个包含四个对象的数组
      const list = Array.from({ length: cavityNoQty.value }, (_, index) => ({
        ...firstDataItem.value,
        uId: (index + 1).toString(), // rowId 从 1 开始
        rowId: '', // rowId 从 1 开始
        documentNumber: '',
      }));
      totalIndex.value++;
      // 根据第四个字符的值，将字符填充到数组中对应索引位置的对象中
      if (cavityNo >= 1 && cavityNo <= cavityNoQty.value) {
        list[cavityNo - 1] = {
          ...list[cavityNo - 1],
          cavityNo: cavityNo,
          documentNumber: translateInputSNCache.value,
          rowId: totalIndex.value,
        };
      }
      gridApi.reloadData(list);
      afterHandleClickSure();
      return;
    }

    // CNC1、CNC2
    if (firstDataItem.value.processName === 'CNC1' || firstDataItem.value.processName === 'CNC2') {
      isCNC.value = true;
      scanCNC(firstDataItem.value);
      afterHandleClickSure();
      return;
    }

    gridApi.reloadData([{ ...firstDataItem.value, rowId: '1', uId: '1', snCode: translateInputSNCache.value }, ...tableList]);
    afterHandleClickSure();
  };

  const resetData = () => {
    isCavityNo.value = false;
    translateInputSN.value = '';
    translateInputSNCache.value = '';
    tableLength.value = 0;
    state.scanData = {};
    isCheck.value = false;
    totalIndex.value = 0;
    isCNC.value = false;
  };
  async function init({ templistParams }) {
    resetData();
    state.tempListData = [];

    state.operationType = templistParams.operationType;
    state.templistParams = templistParams;

    nextTick(() => {
      document.getElementsByClassName('sn-input')[0]?.querySelector('input')?.focus();
    });

    const { getTableColumns } = useTallyModel({
      workType: '',
      operationType: templistParams.operationType,
      orgId: templistParams.orgId,
    });

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
    // }
  }
</script>
<style lang="less" scoped>
  .title {
    padding-bottom: 0;
    font-size: 16px;
    font-weight: 600;
  }

  ::v-deep(.cell-red) {
    color: red;
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
