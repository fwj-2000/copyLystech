<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit" width="800px">
    <BasicForm @register="registerForm">
      <template #Machine>
        <div class="flex justify-start flex-wrap">
          <div class="flex justify-start flex-wrap first-container">
            <a-button preIcon="icon-ym icon-ym-btn-add" type="primary" class="mb-12px" ghost @click="addMachine">{{ t('dict.CommonCol.addMachine') }}</a-button>
            <span class="ml-12px mr-12px mb-12px">→</span>

            <ApiSelect
              v-if="isInit"
              style="width: 175px; margin-bottom: 12px"
              :api="params => getEquipmentListFn(params, 0)"
              :placeholder="`${t('dict.SelectMachine')}1`"
              :show-search="true"
              :api-search="{
                show: true,
                searchName: 'equipmentCodeOrName',
              }"
              v-model:value="state.MachineCodeList[0]"
              result-field="data"
              label-field="name"
              value-field="code"
              :nameFormat="['name', '/', 'code']"
              :memoInputVal="true"
              :memoInputVagueVal="true"
              :alwaysLoad="true"
              :filter-option="false"
              :not-found-content="null"
              :immediate="true" />

            <span class="first-delete-btn" v-if="state.MachineCodeList.length > 1" @click="removeMachine(0)"> × </span>
          </div>
          <a-form-item-rest>
            <div class="flex machine-item" v-for="(_, index) in state.MachineCodeList.slice(1)" :key="index">
              <span class="ml-12px mr-12px">→</span>

              <ApiSelect
                style="width: 175px"
                :api="params => getEquipmentListFn(params, index + 1)"
                :placeholder="`${t('dict.SelectMachine')}${index + 2}`"
                :show-search="true"
                :api-search="{
                  show: true,
                  searchName: 'equipmentCodeOrName',
                }"
                v-model:value="state.MachineCodeList[index + 1]"
                result-field="data"
                label-field="name"
                value-field="code"
                :nameFormat="['name', '/', 'code']"
                :memoInputVal="true"
                :memoInputVagueVal="true"
                :alwaysLoad="true"
                :filter-option="false"
                :not-found-content="null"
                :immediate="true" />

              <span class="delete-btn" @click="() => removeMachine(index + 1)">×</span>
            </div>
          </a-form-item-rest>
          <div style="color: #ed6f6f; position: absolute; top: 32px" v-if="state.flag">{{ t('dict.SelectMachine') }}</div>
        </div>
      </template>
    </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, reactive, watch, ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import {
    addLineInfo,
    updateLineInfo,
    getLineInfoById,
    getLocationAreaAllList,
    getEquipmentList,
    getLineEquipmentCodeList,
    lineTypeList,
  } from '/@/api/productionDeal/lineInfo';
  import { useI18n } from '/@/hooks/web/useI18n';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { getFactoryList } from '/@/api/customerSerivce';
  import { getWorkshopList } from '/@/api/productionDeal/physicalLocation';
  import { useBaseStore } from '/@/store/modules/base';
  const { t } = useI18n();
  const baseStore = useBaseStore();

  interface State {
    dataForm: any;
    machineOptions: any;
    MachineCodeList: any;
    flag: any;
  }

  const state = reactive<State>({
    dataForm: {},
    machineOptions: [],
    MachineCodeList: [null],
    flag: false,
  });
  // 是否获取到全部机台
  const allMachineFlag = ref(false);

  const schemas: FormSchema[] = [
    {
      field: 'FactoryAreaCode',
      label: '所属厂区',
      component: 'Select',
      componentProps: {
        allowClear: false,
        placeholder: '请输入',
        onChange: (e, data) => {
          getWorkshopListFn(data);
          updateLineTypeList(e);
          setFieldsValue({ WorkshopCode: '', LocationId: '', LineType: null });
          clearValidate('WorkshopCode');
          clearValidate('LocationId');
          // 机台号跟厂区相关联，切换厂区之后机台号要重置
          state.MachineCodeList = [null];
        },
      },
      i18nField: 'FactoryAreaName',
      required: true,
    },
    {
      field: 'LineCode',
      label: '线体编码',
      component: 'Input',
      componentProps: { placeholder: '请输入', disabled: true },
    },
    // {
    //   field: 'LineType',
    //   label: '类型',
    //   component: 'ApiSelect',
    //   componentProps: {
    //     placeholder: '请输入',
    //     api: () => {
    //       return baseStore.getDictionaryData('lineInfoType');
    //     },
    //     // resultField: 'data',
    //     labelField: 'fullName',
    //     valueField: 'enCode',
    //     filterOption: false,
    //     notFoundContent: null,
    //     immediate: true,
    //   },
    //   i18nField: 'LineTypeName',
    //   required: true,
    // },
    {
      field: 'LineType',
      label: '类型',
      component: 'Select',
      componentProps: {
        fieldNames: {
          value: 'code',
          label: 'name',
        },
        options: [],
        placeholder: '类型',
      },
      required: true,
      i18nField: 'LineTypeName',
    },
    {
      field: 'LineName',
      label: '线体名称',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
      required: true,
    },
    {
      field: 'WorkshopCode',
      label: '生产车间',
      component: 'Select',
      componentProps: {
        placeholder: '请输入',
        onChange: (_, data) => {
          getLocationAreaAllListFn(data);
          setFieldsValue({ LocationId: '' });
          clearValidate('LocationId');
        },
      },
      required: true,
    },
    {
      field: 'LocationId',
      label: '物理位置',
      component: 'Select',
      componentProps: { placeholder: '请输入' },
      i18nField: 'LocationArea',
      required: true,
    },
    {
      field: 'NeedOnline',
      label: '是否需要联机',
      component: 'Select',
      // defaultValue: 1,
      componentProps: {
        placeholder: '请选择',
        options: [
          { fullName: t('dict.isAssembleName.1'), id: 1 },
          { fullName: t('dict.isAssembleName.2'), id: 0 },
        ],
      },
      i18nField: 'NeedOnlineName',
    },
    {
      field: 'IsOnline',
      label: '是否联机',
      component: 'Select',
      // defaultValue: 1,
      componentProps: {
        placeholder: '请选择',
        options: [
          { fullName: t('dict.isAssembleName.1'), id: 1 },
          { fullName: t('dict.isAssembleName.2'), id: 0 },
        ],
      },
      i18nField: 'IsOnlineName',
    },
    // {
    //   field: 'process',
    //   label: '工序',
    //   component: 'ApiSelect',
    //   componentProps: {
    //     placeholder: '请输入',
    //     api: alllistbyfactory,
    //     labelField: 'name',
    //     valueField: 'id',
    //     resultField: 'data',
    //     filterOption: (input: string, option: any) => {
    //       return option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    //     },
    //     notFoundContent: null,
    //     immediate: true,
    //     beforeFetch: () => {
    //       return {
    //         mainProcess: 'Mold',
    //       };
    //     },
    //   },
    //   // i18nField: 'LineTypeName',
    //   required: true,
    // },
    {
      field: 'MachineCodeList',
      label: '机台',
      component: 'Select',
      componentProps: { placeholder: '请输入' },
      slot: 'Machine',
      colProps: {
        span: 24,
      },
      // rules: [
      //   {
      //     required: true,
      //     trigger: 'blur',
      //     validator: async _rule => {
      //       if (state.MachineCodeList.length == 0 || state.MachineCodeList[0] === null) {
      //         throw new Error(t('dict.PartNumberApplyColumn.valueNotEmpty'));
      //       }
      //     },
      //   },
      // ],
      i18nField: 'MachineListDisplay',
    },
    {
      field: 'Status',
      label: '是否启用',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        placeholder: '请选择',
        options: [
          { fullName: t('common.enableText'), id: 1 },
          { fullName: t('common.disableText'), id: 2 },
        ],
      },
      rules: [{ required: true, trigger: 'change', message: '必填', type: 'number' }],
    },
    {
      field: 'Remark',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入' },
    },
  ];

  const getTitle = computed(() => (state.dataForm.Id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema, clearValidate, getFieldsValue }] = useForm({
    labelWidth: '120',
    layout: 'vertical',
    baseColProps: {
      span: 12,
    },
    schemas: schemas,
    i18nConfig: {
      moduleCode: 'LineInfoColumn',
      transferRange: ['placeholder', 'label'],
    },
  });
  const isInit = ref(false);
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  async function updateLineTypeList(e) {
    const { data } = await lineTypeList({ factoryArea: e });
    updateSchema({
      field: 'LineType',
      componentProps: {
        options: data,
      },
    });
  }

  function init(data) {
    isInit.value = false;
    updateSchema({ field: 'FactoryAreaCode', componentProps: { disabled: false } });
    nextTick(() => {
      state.MachineCodeList = [null];
      isInit.value = true;
    });
    state.flag = false;
    resetFields();
    state.dataForm.Id = data.id;

    getEquipmentList({}).then(({ code, data }) => {
      if (code == 200) {
        state.machineOptions = data;
      }
    });

    getFactoryList({}).then(({ code: factoryCode, data: factoryList }) => {
      if (factoryCode === 200) {
        updateSchema({
          field: 'FactoryAreaCode',
          componentProps: {
            options: factoryList,
            fieldNames: { value: 'Code', label: 'Name' },
          },
        });
      }
    });

    if (state.dataForm.Id) {
      allMachineFlag.value = true;
      updateSchema({ field: 'FactoryAreaCode', componentProps: { disabled: true } });
      changeLoading(true);
      getLineInfoById(state.dataForm.Id).then(res => {
        const data = res.data;
        state.dataForm = data;
        // 这里可能需要给MachineCodeList赋值
        state.MachineCodeList = data.MachineCodeList;

        getWorkshopList({ keyword: data.FactoryAreaCode || '' }).then(({ code, data }) => {
          if (code == 200) {
            updateSchema({
              field: 'WorkshopCode',
              componentProps: {
                options: data.map(item => ({
                  ...item,
                  formattedLabel: `${item.Name}/${item.Code}`,
                })),
                fieldNames: { value: 'Code', label: 'formattedLabel' },
              },
            });
          }
        });
        getLocationAreaAllList({ keyword: data.WorkshopCode || '' }).then(({ code, data }) => {
          if (code == 200) {
            updateSchema({
              field: 'LocationId',
              componentProps: {
                options: data,
                fieldNames: { value: 'Id', label: 'LocationArea' },
              },
            });
          }
        });

        setTimeout(() => {
          allMachineFlag.value = false;
        }, 1000);
        if (data.FactoryAreaCode) {
          updateLineTypeList(data.FactoryAreaCode);
        }
        setFieldsValue(data); //设置表单值
        changeLoading(false); //用于修改Modal的loading状态
      });
    }
  }

  const getEquipmentListFn = async (params, index) => {
    const val = state.MachineCodeList && state.MachineCodeList[index];
    const { FactoryAreaCode } = getFieldsValue();
    let paramsObj = {
      ...params,
      factoryCode: FactoryAreaCode,
      equipmentSelectCodes: state.MachineCodeList.filter(item => item && item !== val),
      getFlag: allMachineFlag.value ? 1 : 0,
    };
    const res = await getLineEquipmentCodeList(paramsObj);
    return res;
  };

  function getWorkshopListFn(data) {
    getWorkshopList({ keyword: data.Code }).then(({ code, data }) => {
      if (code == 200) {
        updateSchema({
          field: 'WorkshopCode',
          componentProps: {
            options: data.map(item => ({
              ...item,
              formattedLabel: `${item.Name}/${item.Code}`,
            })),
            fieldNames: { value: 'Code', label: 'formattedLabel' },
          },
        });
      }
    });
  }
  function getLocationAreaAllListFn(data) {
    getLocationAreaAllList({ keyword: data.Code }).then(({ code, data }) => {
      if (code == 200) {
        updateSchema({
          field: 'LocationId',
          componentProps: {
            options: data,
            fieldNames: { value: 'Id', label: 'LocationArea' },
          },
        });
      }
    });
  }

  function addMachine() {
    state.MachineCodeList.push(null);
  }
  function removeMachine(index) {
    if (state.MachineCodeList.length > 1) {
      state.MachineCodeList.splice(index, 1);
    }
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (state.MachineCodeList[0] == null && state.MachineCodeList.length == 1) {
      state.flag = true;
    }
    if (state.MachineCodeList.every(item => item == null)) {
      state.flag = true;
    }
    if (state.flag) return;
    if (!values) return;
    changeOkLoading(true);
    // 去掉机台未选的
    const filterMachineCodes = state.MachineCodeList.filter(item => item !== null);
    const query = {
      ...values,
      id: state.dataForm.Id,
      MachineCodeList: filterMachineCodes,
    };
    const formMethod = state.dataForm.Id ? updateLineInfo : addLineInfo;
    formMethod(query)
      .then(res => {
        createMessage.success(res.msg);
        changeOkLoading(false); //用于修改确认按钮的loading状态
        closeModal(); //关闭弹窗
        emit('reload');
      })
      .catch(() => {
        changeOkLoading(false);
      });
  }

  watch(
    () => state.MachineCodeList,
    newVal => {
      if (newVal[0] == null || newVal.some(item => item != null)) {
        state.flag = false;
      } else {
        state.flag = true;
      }
    },
    { deep: true },
  );
</script>
<style lang="less" scoped>
  .machine-item {
    position: relative;
    margin-bottom: 12px;
  }

  .first-container {
    position: relative;

    .first-delete-btn {
      position: absolute;
      top: -4px;
      right: -10px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #a5a5a5;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 15px;
      font-weight: bold;
    }
  }

  .delete-btn {
    position: absolute;
    right: -10px;
    transform: translateY(-50%);
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #a5a5a5;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 15px;
    font-weight: bold;
  }

  :deep(.ant-form-item-rest) {
    margin-left: -4px !important; /* 负margin消除间隙 */
    margin-right: 0 !important;
  }
</style>
