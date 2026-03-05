<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :title="title"
    :destroyOnClose="true"
    cancel-text="返回"
    :showFooter="false"
    @ok="handleSubmit">
    <!-- <template #insertToolbar>
      <a-button type="primary" class="mr-8px" @click="setLocalCacheDataFn">暂存 </a-button>
      <a-button type="primary" class="mr-8px" @click="handlePrint">打印 </a-button>
    </template> -->
    <div class="p-16px" style="height: 400px">
      <!-- <FilteredInput class="!w-120px" v-model:value="row" placeholder="请输入" input-type="number" :min="1" :max="50" /> -->
      <BasicForm @register="registerForm">
        <template #bindType="{ values }">
          <a-checkbox-group v-model:value="values.bindType" :options="state.bindTypeOptions" @change="onBindTypeChangeFn" />
        </template>
        <template #checkDetail="{ values }">
          <!-- <div @click="openCheckDetailModalFn(values)">
            <span>选择检测清单</span>
            <span v-for="item in values.checkDetail">{{ item }}</span>
          </div> -->
          <a-select
            v-model:value="values.checkDetail"
            mode="multiple"
            style="width: 100%"
            placeholder="请选择检测清单"
            :options="state.groupbylist"
            :open="false"
            maxTagPlaceholder="...."
            :maxTagCount="1"
            @click="openCheckDetailModalFn(values)">
            <template #maxTagPlaceholder="omittedValues">
              <span style="color: red">+ {{ omittedValues.length }} ...</span>
            </template>
          </a-select>
        </template>
        <template #checkWay="{ values }">
          <a-radio-group v-model:value="values.checkWay" @change="checkWayChangeFn">
            <a-radio v-for="item in state.checkWayOptions" :key="item.enCode" :value="item.enCode">{{ item.fullName }}</a-radio>
          </a-radio-group>
        </template>
      </BasicForm>
    </div>
  </BasicPopup>

  <checkDetailModal @register="registerCheckDetailModal" @onSelect="getCheckDetailFn"></checkDetailModal>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, unref, ref, nextTick, onMounted, computed } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import dayjs from 'dayjs';
  import { FilteredInput } from '/@/components/FilteredInput';
  import { BasicForm, useForm } from '/@/components/Form';
  import { formSchems } from './config';
  import { useBaseStore } from '/@/store/modules/base';
  import { getCheckmaintain, addCheckmaintain } from '/@/api/productionDeal/checkmaintain';
  import checkDetailModal from './checkDetailModal.vue';
  import { useModal } from '/@/components/Modal';
  import { getGroupbylist } from '/@/api/productionDeal/badCode';
  import { cloneDeep } from 'lodash-es';
  import { getMaterialList } from '/@/api/purchase/materialBase';

  const baseStore = useBaseStore();
  const userStore = useUserStore();
  const emits = defineEmits(['register', 'reload']);
  interface State {
    title: string;
    id: string;
    bindTypeOptions: any;
    groupbylist: any;
    groupbyDataSource: any;
    checkWayOptions: any;
  }
  const state = reactive<State>({
    title: '',
    id: '',
    bindTypeOptions: [],
    groupbylist: [],
    groupbyDataSource: [],
    checkWayOptions: [],
  });

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { title } = toRefs(state);
  const { t } = useI18n();
  const [registerCheckDetailModal, { openModal: openCheckDetailModal }] = useModal();
  const { createMessage, createConfirm } = useMessage();
  const [registerForm, { setFieldsValue, updateSchema, validate, clearValidate, getFieldsValue }] = useForm({
    schemas: formSchems,
    labelWidth: 120,
    baseColProps: { span: 6 },
    actionColOptions: { span: 24 },
    autoSubmitOnEnter: true,
    submitFunc: handleSubmit,
  });

  async function updateMaterialClassList(e) {
    const result = await getMaterialList({
      displayArea: 'MaterialWarehouse',
      keyword: e,
    });
    const r = result?.data?.list || [];
    updateSchema([
      {
        field: 'materialTypeId',
        componentProps: {
          options: r,
        },
      },
    ]);
  }
  async function getCheckWayOptions() {
    state.checkWayOptions = await baseStore.getDictionaryData('CheckMaintain.CheckWay');
  }

  function onBindTypeChangeFn(data) {
    console.log(data);
    setFieldsValue({
      bindType: data,
    });
    clearValidate();
    console.log(getFieldsValue());
  }

  function checkWayChangeFn(e) {
    setFieldsValue({
      checkWay: e.target.value,
    });
    clearValidate();
    // console.log(getFieldsValue());
  }

  function transformOptionsFn(data) {
    return data.map(item => {
      return { label: item.Description, value: item.Code };
    });
  }

  async function getGroupbylistFn(checkProjectCode) {
    try {
      const { data, code } = await getGroupbylist({ checkProjectCode });
      if (code === 200) {
        let _list = [];
        data.forEach(o => {
          _list = _list.concat(o.list);
        });
        state.groupbylist = transformOptionsFn(_list);
        state.groupbyDataSource = data;
      }
    } catch (error) {}
  }

  function getCheckDetailFn(data) {
    let checkDetail: any = [];
    data.forEach((o: any) => {
      if (o.checkedArr?.length) {
        checkDetail = checkDetail.concat(o.checkedArr);
      }
    });
    console.log(checkDetail, 'checkDetail');
    if (!checkDetail.length) return;
    // checkDetail = checkDetail.filter(item => item);
    checkDetail = checkDetail.filter(Boolean);
    setFieldsValue({ checkDetail: checkDetail });
    clearValidate();
  }

  async function openCheckDetailModalFn(values) {
    if (!values.checkProjectCode) return createMessage.warning('请先选择检测项目');
    await getGroupbylistFn(values.checkProjectCode);
    if (!state.groupbyDataSource.length) return createMessage.warning('当前检测项目无检测清单');
    openCheckDetailModal(true, { dataSource: state.groupbyDataSource, checkDetail: values.checkDetail });
  }

  async function handleSubmit() {
    const validateFlag = await validate();
    console.log(validateFlag);
    if (!validateFlag) return;

    const params = getFieldsValue();
    params.bindType = params.bindType.join(',');
    params.checkDetail = params?.checkDetail ? params.checkDetail.join(',') : '';
    try {
      const { code, msg } = await addCheckmaintain(params);
      if (code === 200) {
        closePopup();
        createMessage.success('保存成功！');
        emits('reload');
      } else {
        createMessage.error(msg);
      }
    } catch (error) {
      console.error(error, 'handleSubmit');
    }
  }

  async function init({ data, title }) {
    state.title = title;
    getCheckWayOptions();
    setFieldsValue({ status: '1' });
    if (data) {
      console.log(data, '回显数据');
      const _data = cloneDeep(data);
      _data.bindType = _data.bindType.split(',') || [];
      _data.checkDetail = _data.checkDetail.split(',') || [];
      _data.status = _data.status ? String(_data.status) : '1';
      _data.checkWay = _data.checkWay ? String(_data.checkWay) : '';
      _data.checkType = _data.checkType ? String(_data.checkType) : '';
      setFieldsValue(_data);
      await getGroupbylistFn(_data.checkProjectCode);
      _data.materialTypeBigId && updateMaterialClassList(_data.materialTypeBigId);
    }

    getBindTypeOptions();
    updateSchema({
      field: 'checkProjectCode',
      componentProps: {
        onChange: item => {
          state.groupbyDataSource = [];
          state.groupbylist = [];
          setFieldsValue({ checkDetail: [] });
        },
      },
    });
    updateSchema({
      field: 'materialTypeBigId',
      componentProps: {
        onChange: e => {
          updateMaterialClassList(e);
        },
      },
    });
  }

  async function getBindTypeOptions() {
    state.bindTypeOptions = [];
    try {
      const _bindTypeOptions: any = await baseStore.getDictionaryData('CheckMaintain.BindType');
      _bindTypeOptions.forEach(o => {
        state.bindTypeOptions.push({ label: o.fullName, value: o.enCode });
      });
    } catch (error) {
      console.error(error, 'handleSubmit');
    }
  }
</script>
