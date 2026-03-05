<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="state.id ? false : true"
    :okText="t('common.submit')"
    :title="title"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup">
    <!-- v-loading="isLoading" -->
    <ScrollContainer class="bg-[#ebeef5]">
      <!-- 循环 -->
      <div class="process-block bg-[#fff] p-20px" v-for="(item, index) in processList" :key="item.uuid" @click="handleClickBlock(index)">
        <div class="opera-block">
          <div class="select-block">
            <!-- 标签类型下拉 -->
            <div>
              <span> {{ t('common.labelType') }}： </span>
              <LydcSelect
                :disabled="state.id ? true : false"
                @change="handleTagTypeChange"
                class="!w-200px"
                v-model:value="item.tagType"
                :placeholder="t('common.inputText')"
                allowClear
                :fieldNames="{ label: 'fullName', value: 'id' }"
                :options="[
                  { fullName: '首件卡', id: '1' },
                  { fullName: '非首件卡', id: '2' },
                ]" />
            </div>

            <!-- 工序下拉 -->
            <div>
              <span> {{ t('dict.ProcessSchedulingColumn.processName') }}： </span>
              <!-- @options-change="handleWorkTypeOptionsChange" -->
              <!-- <ApiSelect
                class="!w-200px"
                :api="getlistbyfactory"
                placeholder="请选择"
                v-model:value="item.processName"
                :show-search="true"
                :filter-option="true"
                result-field="data"
                label-field="name"
                value-field="name"
                key="id"
                :disabled="state.id ? true : false"
                :not-found-content="null"
                :defaultFirstOption="true"
                :immediate="true"
                "
                
                @keydown.enter="(val, data) => handleWorkTypeChange(val, data, item)">
              </ApiSelect> -->
              <a-select
                :showSearch="true"
                :filterOption="(value, option) => option.value.includes(value)"
                style="width: 200px"
                v-model:value="item.processName"
                @change="handleWorkTypeChange(item)">
                <a-select-option :value="item.name" v-for="(item, index) in factoryList" :key="index">{{ item.name }}</a-select-option>
              </a-select>
            </div>
          </div>
          <div class="flex">
            <!-- 添加行 -->
            <AddCustomRows v-if="index === 0 && !state.id" :lable="t('dict.CommonCol.addQuantity')" @submit="handleAddColumn" />
            <div class="delete-box ml-20px" v-if="processList.length > 1 && !state.id" @click.stop="deleteProcess(index)">
              <img src="/@/assets/svg/delete.svg" class="icon-delete mr-4px" alt="" />
              <div>{{ t('common.delText') }}</div>
            </div>
          </div>
          <!-- <div v-else>
          <span> 流转标签： </span>
          <LydcInput
            :suffixIcon="'icon-ym icon-ym-scanCode'"
            v-model:value="state.translateInput"
            :placeholder="t('common.scanText')"
            @change="handlerInputChangeFn"
            @Keydown="handlerInputKeydown" />
        </div> -->
        </div>
        <div v-loading="item.isLoading" class="process-form-block mb-16px">
          <div v-if="item.tempListData && item.tempListData.length">
            <Subtitle :title="t('dict.ProcessSchedulingColumn.processName') + '：' + item.processName" style="padding-bottom: 0" />
            <!-- 工序输入表单 -->
            <TempForm
              :tempList="item.tempListData"
              ref="tempFormRef"
              :colSpan="8"
              :isNeedValidate="true"
              :processName="item.processName"
              :operationType="state.operationType"
              @onProductCodeChange="handleProductCodeChange"
              @onWordOrderNoChange="handleWordOrderNoChange" />
          </div>
        </div>
      </div>

      <!-- pcc -->
      <Card class="pcc-preview">
        <div class="pcc-preview-block">
          <Subtitle :title="t('common.PCCVersion')" />
          <LydcSelect
            :disabled="state.id ? true : false"
            @change="handlePccVersionChange"
            class="!w-200px"
            v-model:value="state.pccVersion"
            placeholder="请选择PCC预览版本"
            allowClear
            :fieldNames="{ label: 'version', value: 'applyCode' }"
            :options="state.pccOptions" />
        </div>
        <div class="pcc-preview-content" @mousemove="handleMouseMove">
          <div class="nodata-block" v-show="!state.pccCacheList.length">
            <img :src="nodata" alt="" />
            <span class="text-[#999] text-lg">{{ t('common.noData') }}</span>
          </div>
          <DetailPopup @register="registerDetail" v-show="state.pccCacheList.length" />
        </div>
      </Card>
    </ScrollContainer>
  </BasicPopup>
  <PrintModal @register="registerPrintModal" />
</template>
<script lang="ts" setup>
  import { reactive, toRefs, unref, ref, computed } from 'vue';
  import { BasicPopup, usePopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ScrollContainer } from '/@/components/Container';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import TempForm from '/@/views/productionPlan/procruleTemp/components/tempForm.vue';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  // import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { getPccversionlist, getRoutenodedetail, getlistbyfactory, processpreprintBathadd } from '/@/api/productionDeal/dieCutPerPrint';
  import { cloneDeep } from 'lodash-es';
  import { useUserStore } from '/@/store/modules/user';
  import { getDetailbyprocessname } from '/@/api/basicData/processrulestemplate';
  import DetailPopup from '/@/views/engineering/pcc/pccApply/components/DetailPopup.vue';
  import { getPccList } from '/@/api/engineering/pcc';
  import { useModal } from '/@/components/Modal';
  import { PrintModal } from '/@/components/CommonModal';
  import { Card } from 'ant-design-vue';
  import nodata from '/@/assets/images/process/nodata.png';
  import dayjs from 'dayjs';
  import { buildBitUUID } from '/@/utils/uuid';

  // let usePrePrintModelConfig: any = {};
  const userStore = useUserStore();
  const emits = defineEmits(['register', 'refresh']);
  interface State {
    title: string;
    id: string;
    // tempListData: any;
    detailData: any;
    templistParams: any;
    tagType: string;
    processName: string;
    // translateInput: string;
    operationType: string;
    productCode: string;
    wordOrderNo: string;
    pccVersion: string;
    scanData: any;
    pccOptions: any;
    isReadPcc: boolean;
    pccCacheList: any;
  }

  // 用户输入工单号后会查询一个接口获取到产品编码，根据工单号和产品编码查询PCC的数据。点击新增的时候需要判断是否阅读，阅读了才可以新增
  // 通过工序和工单号获取是否阅读的字段，这个时候不管是切换工序或是切换工单号阅读都会重置为未读
  const state = reactive<State>({
    title: '',
    id: '',
    // tempListData: [],
    pccCacheList: [],
    scanData: [],
    pccOptions: [],
    tagType: '1',
    processName: '',
    // translateInput: '',
    operationType: '',
    detailData: {},
    templistParams: {},
    productCode: '',
    wordOrderNo: '',
    pccVersion: '',
    isReadPcc: false,
  });
  const { title } = toRefs(state);
  // const isLoading = ref(false);
  const tempFormRef = ref();
  const currentIndex = ref(0);

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerPrintModal, { openModal: openPrintModal }] = useModal();

  const currentProcess = computed(() => {
    return processList.value[currentIndex.value];
  });

  // 第一个表格添加行
  const handleAddColumn = n => {
    if (state.isReadPcc) {
      return createMessage.warning(t('common.pleaseCheckPCC'));
    }
    // if (!hasBtnP('btn_edit')) return;
    for (let i = 0; i < n; i++) {
      const item = cloneDeep({ ...processItem.value, uuid: buildBitUUID() });
      processList.value.push(item);
    }
  };

  const deleteProcess = index => {
    processList.value.splice(index, 1);
  };

  const handleClickBlock = index => {
    currentIndex.value = index;
  };

  async function getRoutenodedetailFn(workOrderNo, process) {
    if (!workOrderNo || !process) return;
    const { data, code } = await getRoutenodedetail({ workOrderNo, process });
    if (code == 200) {
      const { process, processId, processName, routeBindId, routeId, routeNodeId } = data;
      currentProcess.value.process = process;
      currentProcess.value.processId = processId;
      currentProcess.value.processName = processName;
      currentProcess.value.routeBindId = routeBindId;
      currentProcess.value.routeId = routeId;
      currentProcess.value.routeNodeId = routeNodeId;
      state.isReadPcc = data?.isReadPcc === '1';
    }
  }

  async function goDetailFn(id) {
    state.pccCacheList = [];
    try {
      const { data, code } = await getPccList({ originCode: id });
      if (code === 200) {
        state.pccCacheList = data.list;
        if (!state.pccCacheList?.length) {
          return createMessage.warning(t('common.noPCCDetails'));
        }
        openDetail(true, {
          index: 0,
          mode: 'view',
          cacheList: state.pccCacheList,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmit() {
    if (state.isReadPcc) {
      return createMessage.warning(t('common.pleaseCheckPCC'));
    }
    if (state.id) {
      emits('refresh');
      closePopup();
      return;
    }
    let list: any[] = [];
    for (let i = 0; i < tempFormRef.value.length; i++) {
      list.push(await tempFormRef.value[i].validateFormFn());
    }

    list.forEach(list_item => {
      list_item.forEach(item => {
        if (item.isMultiSelect === 1) {
          item.fieldValue = item.fieldValue.join(',');
        }
      });
    });
    const param = processList.value.map((obj, idx) => ({
      ...obj,
      ...list[idx].reduce((acc, { fieldEnName, fieldValue }) => {
        // acc[fieldEnName] = fieldValue;
        if (acc[fieldEnName] === 'uploadProgramFile' && fieldValue) {
          const _uploadData = JSON.parse(acc.fieldValue);
          acc['uploadProgramFile'] = _uploadData.Id;
          acc['uploadProgramFileName'] = _uploadData.OriginFileName;
          acc['uploadProgramType'] = acc['uploadProgramType']?.length ? acc['uploadProgramType'].join(',') : '';
        } else {
          acc[fieldEnName] = fieldValue;
        }
        return acc;
      }, {}),
    }));
    changeLoading(true);
    try {
      const { code, msg, data } = await processpreprintBathadd(param);
      if (code === 200) {
        createMessage.success(msg);
        emits('refresh');
        openPrintModalFn(data);
        closePopup();
      } else {
        console.log(msg);
      }
    } finally {
      changeLoading(false);
    }
  }

  function handleProductCodeChange(e) {
    // state.productCode = e ? e : state.productCode;
    if (!e) return;
    currentProcess.value.productCode = e;
    getPccversionlistFn(e);
  }

  function handleWordOrderNoChange(e) {
    // state.wordOrderNo = e;
    currentProcess.value.wordOrderNo = e;
    getRoutenodedetailFn(currentProcess.value.wordOrderNo, currentProcess.value.process);
  }

  function openPrintModalFn(data: any = []) {
    let printList: any = [];
    printList = data.map(item => {
      if (item.printDate) {
        item.printDate = dayjs(item.printDate).tz().format('YYYY-MM-DD HH:mm:ss');
      }
      if (item.creatorTime) {
        item.creatorTime = dayjs(item.printDate).tz().format('YYYY-MM-DD HH:mm:ss');
      }
      item.productCode = item.productCode ? item.productCode : item.mouldNo;
      item.machineNo = item.machineNo ? item.machineNo : '';
      item.sheetQuantity = item.sheetQuantity ? item.sheetQuantity : '';
      item.batchNo = item.batchNo ? item.batchNo : '';
      item.creatorUserName = item.creatorUserName ? item.creatorUserName : '';
      item.creatorTime = item.creatorTime ? item.creatorTime : '';
      item.documentNumber = item.documentNumber ? item.documentNumber : '';
      item.workOrderNo = item.workOrderNo ? item.workOrderNo : '';
      item.title = `系统流转${item.tagType === '1' ? '（首件）' : ''}标签`;

      return item;
    });
    openPrintModal(true, {
      printData: printList,
      templateId: data[0]?.templateId || '657424936553414597',
    });
  }

  function handleMouseMove() {
    state.isReadPcc = false;
  }

  function handlePccVersionChange(e) {
    if (!e) return;
    goDetailFn(e);
  }

  async function getPccversionlistFn(productCode) {
    const { data, code } = await getPccversionlist({ productCode });
    if (code === 200) {
      if (!data.length) return;
      state.pccOptions = data.map(item => {
        item.version = 'T' + item.version;
        return item;
      });
      state.pccVersion = state.pccOptions[0]?.applyCode;
      goDetailFn(state.pccVersion);
    }
  }

  // const handlerInputChangeFn = debounce(async val => {
  //   try {
  //     const { data, code } = await getNextroutenode({ documentNumber: val });
  //     console.log(data, '根据单据号获取预打印信息');
  //     if (code === 200) {
  //       state.scanData = data;
  //       state.templistParams.processName = data.processName;
  //       state.productCode = data.productCode;
  //       state.templistParams.routeBindId = data.routeBindId;
  //       await getDetailbyprocessnameFn();
  //       getPccversionlistFn(data.productCode);
  //     }
  //   } catch (error) {
  //     console.log('查询流转标签信息');
  //   }
  // }, 300);

  // 获取开启的模板配置
  async function getDetailbyprocessnameFn() {
    try {
      // isLoading.value = true;
      currentProcess.value.isLoading = true;
      const { detailData, templistParams } = state;
      currentProcess.value.tempListData = [];
      const params = {
        operationType: templistParams.operationType,
        orgId: templistParams.orgId,
        processName: currentProcess.value.processName,
      };
      const { code, data } = await getDetailbyprocessname(params);
      if (code === 200) {
        if (detailData.id) {
          const showData = data.map(o => {
            if (o.fieldEnName === 'uploadProgramFile') {
              o.isChecked = true;
            }
            o.isDisabled = 1;
            o.fieldValue = detailData[o.fieldEnName];
            if (o.fieldEnName === 'classes' && o.fieldValue) {
              o.fieldValue = String(o.fieldValue);
            }
            if (o.isMultiSelect === 1) {
              o.fieldValue = o.fieldValue ? o.fieldValue.split(',') : [];
            }
            // 通过产品编码获取pcc数据
            if (o.fieldEnName === 'productCode' && detailData[o.fieldEnName]) {
              getPccversionlistFn(detailData[o.fieldEnName]);
            }

            return o;
          });
          currentProcess.value.tempListData = showData;
          return;
        }
        currentProcess.value.tempListData = data.map(item => {
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
            item.fieldValue = item.fieldValue ? item.fieldValue.split(',') : [];
          }
          return item;
        });
      }
    } finally {
      // isLoading.value = false;
      currentProcess.value.isLoading = false;
    }
  }
  function handleTagTypeChange(e) {
    // 切换成首件卡的时候需要获取开启的模板配置
    if (e == '1') {
      getDetailbyprocessnameFn();
    }
  }

  // function handleWorkTypeOptionsChange(o) {
  //   console.log(o);
  // }
  // 切换工序的时候需要获取开启的模板配置
  async function handleWorkTypeChange(item) {
    // state.templistParams.process = data?.code;
    currentProcess.value.process = factoryList.value.find(item => item.name === currentProcess.value.processName)?.code;
    currentProcess.value.wordOrderNo = '';
    if (!currentProcess.value.process) return;
    getRoutenodedetailFn(currentProcess.value.wordOrderNo, currentProcess.value.process);
    if (state.id) {
      item.processName = state.processName;
    } else {
      // item.processName = e;
      await getDetailbyprocessnameFn();
    }
  }

  const handlerInputKeydown = (e: any) => {
    if (e.keyCode !== 13) return;
    const val = e.target._value;
    const arr = val.split('!') || [];
    state.translateInput = arr[0];
  };

  function initVal() {
    currentIndex.value = 0;
    processList.value = [];
    // state.tempListData = [];
    state.pccOptions = [];
    state.pccVersion = '';
    state.isReadPcc = false;
  }

  const processList = ref<any[]>([]);
  const processItem = ref<any>({
    tagType: '', // 标签类型
    process: '', // 工序
    processName: '', // 工序名称
    tempListData: [], // 工序动态表单数据
    wordOrderNo: '', // 工单号
    productCode: '', // 产品编码
  });

  const factoryList = ref<any[]>([]);
  const handleGetlistbyfactory = async () => {
    const { data } = await getlistbyfactory({ factoryArea: state.templistParams.orgId });
    factoryList.value = data || [];
  };

  async function init({ title, data, templistParams }) {
    initVal();
    state.title = title;
    state.id = data.id;
    state.operationType = templistParams.operationType;
    state.detailData = data;
    state.templistParams = templistParams;
    // state.templistParams.processName = data?.processName;
    // state.templistParams.process = data?.process;
    state.processName = data.processName;
    // state.tagType = data.tagType ? String(data.tagType) : '1';
    // usePrePrintModelConfig = usePrePrintModel(templistParams);
    // 获取工序下拉列表
    await handleGetlistbyfactory();

    const process = {
      ...templistParams,
      tagType: data.tagType ? String(data.tagType) : '1',
      process: data?.process || (factoryList.value.length && factoryList.value[0].code) || '',
      processName: data?.processName || (factoryList.value.length && factoryList.value[0].name) || '',
    };
    const item = cloneDeep({ ...process, uuid: buildBitUUID() });
    // 默认显示一个
    processList.value.push(item);
    // 获取pcc是否读取及工序表单配置
    await handleWorkTypeChange(item);

    processItem.value = cloneDeep(currentProcess.value);
    if (state.id) {
      getDetailbyprocessnameFn();
    }
  }
</script>

<style lang="less" scoped>
  .process-block {
    border-radius: 8px;
    margin-bottom: 16px;

    .opera-block {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;

      .select-block {
        display: flex;

        div {
          display: flex;
          align-items: center;
        }

        span {
          min-width: 80px;
          text-align: right;
        }
      }
    }

    .process-form-block {
      padding: 10px 12px;
      min-height: 400px;
      border: 1px solid #eaeaea;
    }
  }

  .pcc-preview {
    &-block {
      display: flex;
      align-items: baseline;
    }

    &-content {
      position: relative;
      top: 0;
      left: 0;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      height: 600px;
      background: #fff;
      display: flex;
      align-items: top;
      justify-content: center;

      :deep(.lydc-basic-popup-header) {
        display: none;
      }

      .nodata-block {
        position: absolute;
        text-align: center;
        padding-top: 150px;
      }
    }
  }

  .delete-box {
    display: flex;
    color: red;
    align-items: center;
    cursor: pointer;
  }
</style>
