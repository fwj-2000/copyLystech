<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="title"
    width="600px"
    :minHeight="100"
    okText="确定"
    cancelText="取消"
    :showContinueBtn="showContinueBtn"
    :continueText="continueText"
    @ok="handleSubmit(0)"
    @continue="handleSubmit(1)"
    :closeFunc="onClose">
    <template #insertFooter>
      <a-space :size="10" v-if="dataForm.id" class="float-left"> </a-space>
    </template>
    <a-row class="dynamic-form">
      <a-form :colon="false" layout="horizontal" labelAlign="left" :labelCol="{ style: { width: '100px' } }" :model="dataForm" :rules="dataRule" ref="formRef">
        <a-row :gutter="15">
          <a-col :span="24" class="ant-col-item">
            <a-form-item name="fileList">
              <template #label>源文件<BasicHelp text="上传单个源文件pdf" /></template>
              <LydcUploadFile
                v-model:value="dataForm.fileList"
                buttonText="点击上传"
                accept=".pdf"
                pathType="defaultPath"
                :fileSize="10"
                sizeUnit="MB"
                :limit="10" />
            </a-form-item>
          </a-col>
          <a-col :span="24" class="ant-col-item">
            <a-form-item name="targetFileType">
              <template #label>目标格式</template>
              <LydcRadio
                v-model:value="dataForm.targetFileType"
                :options="optionsObj.targetFileTypeOptions"
                :fieldNames="optionsObj.targetFileTypeProps"
                direction="horizontal"
                optionType="default"
                :style="{ width: '100%' }" />
            </a-form-item>
          </a-col>
          <a-col :span="24" class="ant-col-item">
            <a-form-item name="terminalCustomerId">
              <template #label>选择终端客户</template>
              <LydcSelect
                v-model:value="dataForm.terminalCustomerId"
                placeholder="请选择"
                :options="optionsObj.convertConfigOptions"
                :fieldNames="optionsObj.convertConfigProps"
                allowClear
                :style="{ width: '100%' }" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-row>
  </BasicModal>
  <SelectModal :config="state.currTableConf" :formData="state.dataForm" ref="selectModal" @select="addForSelect" />
</template>
<script lang="ts" setup>
  import { create } from './helper/api';
  import { reactive, toRefs, nextTick, ref, unref, computed, toRaw, inject } from 'vue';
  import { BasicModal, useModal } from '/@/components/Modal';
  import SelectModal from '/@/components/CommonModal/src/SelectModal.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import type { FormInstance } from 'ant-design-vue';
  import { thousandsFormat } from '/@/utils/lydc';
  import { getTimeUnit, getDateTimeUnit } from '/@/utils/lydc';
  import { getDataInterfaceRes } from '/@/api/systemData/dataInterface';
  import dayjs from 'dayjs';
  import { cloneDeep } from 'lodash-es';

  interface State {
    dataForm: any;
    dataRule: any;
    optionsObj: any;
    currVmodel: any;
    currTableConf: any;
    addTableConf: any;
    tableRows: any;
    title: string;
    continueText: string;
    allList: any[];
    currIndex: number;
    isContinue: boolean;
    submitType: number;
    showContinueBtn: boolean;
  }

  const emit = defineEmits(['reload']);
  const getLeftTreeActiveInfo: (() => any) | null = inject('getLeftTreeActiveInfo', null);
  const userStore = useUserStore();
  const userInfo = userStore.getUserInfo;
  const { createMessage, createConfirm } = useMessage();
  const [registerModal, { openModal, setModalProps }] = useModal();
  const formRef = ref<FormInstance>();
  const selectModal = ref(null);
  const state = reactive<State>({
    dataForm: {
      id: '',
      fileList: [],
      targetFileType: '1',
      terminalCustomerId: undefined,
    },
    dataRule: {
      fileList: [
        {
          required: true,
          message: '请输入源文件',
          trigger: 'change',
        },
      ],
    },
    optionsObj: {
      targetFileTypeOptions: [
        { fullName: '转DXF', id: '1' },
        { fullName: '转DWG', id: '2' },
      ],
      targetFileTypeProps: { label: 'fullName', value: 'id' },
      convertConfigProps: { label: 'name', value: 'f_id' },
    },
    currVmodel: '',
    currTableConf: {},
    tableRows: {},
    addTableConf: {},
    title: '',
    continueText: '',
    allList: [],
    currIndex: 0,
    isContinue: false,
    submitType: 0,
    showContinueBtn: true,
  });
  const { title, continueText, showContinueBtn, dataForm, dataRule, optionsObj } = toRefs(state);

  defineExpose({ init });

  function init(data) {
    state.showContinueBtn = false;
    state.title = !data.id ? '上传文件' : '编辑';
    state.continueText = !data.id ? '确定并新增' : '确定并继续';
    setFormProps({ continueLoading: false });
    state.dataForm.id = data.id;
    openModal();
    state.allList = data.allList;
    state.currIndex = state.allList.length && data.id ? state.allList.findIndex(item => item.id === data.id) : 0;
    nextTick(() => {
      getForm().resetFields();
      setTimeout(initData, 0);
    });
  }
  function initData() {
    changeLoading(true);
    // 设置默认值
    state.dataForm = {
      fileList: [],
      targetFileType: '1',
      convertConfig: undefined,
    };
    getconvertConfigOptions();
    if (getLeftTreeActiveInfo) state.dataForm = { ...state.dataForm, ...(getLeftTreeActiveInfo() || {}) };
    changeLoading(false);
  }
  function getForm() {
    const form = unref(formRef);
    if (!form) {
      throw new Error('form is null!');
    }
    return form;
  }
  function getData(id) {
    // getInfo(id).then((res) => {
    //   state.dataForm = res.data || {};
    //   getconvertConfigOptions();
    //   changeLoading(false);
    // });
  }
  async function handleSubmit(type) {
    try {
      const values = await getForm()?.validate();
      if (!values) return;
      state.submitType = type;
      state.submitType === 1 ? setFormProps({ continueLoading: true }) : setFormProps({ confirmLoading: true });
      const formMethod = state.dataForm.id ? update : create;
      formMethod(state.dataForm)
        .then(res => {
          createMessage.success(res.msg);
          state.submitType === 1 ? setFormProps({ continueLoading: false }) : setFormProps({ confirmLoading: false });
          if (state.submitType == 1) {
            initData();
            state.isContinue = true;
          } else {
            setFormProps({ visible: false });
            emit('reload');
          }
        })
        .catch(() => {
          state.submitType === 1 ? setFormProps({ continueLoading: false }) : setFormProps({ confirmLoading: false });
        });
    } catch (_) {}
  }
  function handlePrev() {
    state.currIndex--;
    handleGetNewInfo();
  }
  function handleNext() {
    state.currIndex++;
    handleGetNewInfo();
  }
  function handleGetNewInfo() {
    changeLoading(true);
    getForm().resetFields();
    const id = state.allList[state.currIndex].id;
    getData(id);
  }
  function setFormProps(data) {
    setModalProps(data);
  }
  function changeLoading(loading) {
    setModalProps({ loading });
  }
  async function onClose() {
    if (state.isContinue) emit('reload');
    return true;
  }

  function getconvertConfigOptions() {
    let templateJson = [];
    let query = {
      paramList: getParamList(templateJson, state.dataForm),
    };
    getDataInterfaceRes('609240935028490181', query).then(res => {
      let data = res.data;
      state.optionsObj.convertConfigOptions = Array.isArray(data) ? data : [];
    });
  }

  function openSelectDialog(key, value) {
    state.currTableConf = state.addTableConf[key + 'List' + value];
    state.currVmodel = key;
    nextTick(() => {
      (selectModal.value as any)?.openSelectModal();
    });
  }
  function addForSelect(data) {
    for (let i = 0; i < data.length; i++) {
      let item = { ...state.tableRows[state.currVmodel], ...data[i] };
      state.dataForm[state.currVmodel].push(cloneDeep(item));
    }
  }
  function getParamList(templateJson, formData, index?) {
    for (let i = 0; i < templateJson.length; i++) {
      if (templateJson[i].relationField && templateJson[i].sourceType == 1) {
        //区分是否子表
        if (templateJson[i].relationField.includes('-')) {
          let tableVModel = templateJson[i].relationField.split('-')[0];
          let childVModel = templateJson[i].relationField.split('-')[1];
          templateJson[i].defaultValue = (formData[tableVModel] && formData[tableVModel][index] && formData[tableVModel][index][childVModel]) || '';
        } else {
          templateJson[i].defaultValue = formData[templateJson[i].relationField] || '';
        }
      }
    }
    return templateJson;
  }
</script>
