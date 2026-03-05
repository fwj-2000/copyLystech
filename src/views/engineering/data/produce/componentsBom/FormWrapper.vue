<script setup lang="ts">
  import { nextTick, reactive, toRefs } from 'vue';
  import { Subtitle } from '/@/components/Subtitle';
  import { BasicForm, useForm } from '/@/components/Form';
  import { ScrollContainer } from '/@/components/Container';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getBaseInfoFormSchema } from '../config';
  import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { cloneDeep } from 'lodash-es';

  const { t } = useI18n();
  const emit = defineEmits(['materialSetState']);

  const getTechnologyItem = () => {
    return {
      stepDistance: '',
      modulus: '',
    };
  };
  const state = reactive({
    technologyList: [getTechnologyItem()],
    disabled: false,
  });
  const { technologyList } = toRefs(state); // 步距

  /**
   * 基础信息
   * */
  const [
    registerBaseInfoForm,
    {
      setFieldsValue,
      validateFields: validateBaseInfoFields,
      resetFields: resetBaseInfoFields,
      updateSchema: updateBaseInfoSchema,
      getFieldsValue: getBaseInfoFieldsValue,
      setProps: setBaseInfoProps,
    },
  ] = useForm({
    schemas: getBaseInfoFormSchema(),
    layout: 'vertical',
    labelWidth: '100%',
    baseColProps: {
      span: 6,
    },
    i18nConfig: {
      moduleCode: 'EngineeringInformationColumn',
      transferRange: ['label', 'placeholder'],
      excludeFields: ['process', 'quantitativePlanUserId'],
    },
  });

  // 监听基础数据处理
  function handleBaseChange(e, data) {
    if (e == 'experimentType') {
      const isDisabled = !data;
      if (isDisabled) {
        setFieldsValue({
          experimentDuration: '',
          experimentQty: '',
        });
      }
      return updateBaseInfoSchema([
        {
          field: 'experimentDuration',
          componentProps: {
            disabled: isDisabled,
          },
        },
        {
          field: 'experimentQty',
          componentProps: {
            disabled: isDisabled,
          },
        },
      ]);
    }
    if (e == 'mould') {
      // 若是不需要开模，则无需填写交期
      const isDisabled = !data;
      if (isDisabled) {
        setFieldsValue({
          estimatedMoldTime: '',
        });
      }
      updateBaseInfoSchema([
        {
          field: 'estimatedMoldTime',
          componentProps: {
            disabled: isDisabled,
          },
        },
      ]);
    }
  }
  // 设置基础数据
  function setBaseInfoFieldsValue(data) {
    const _d = cloneDeep(data);
    _d.experimentType = _d.experimentType || 0;
    nextTick(() => {
      handleBaseChange('experimentType', _d.experimentType);
      handleBaseChange('mould', _d.mould);
    });
    return setFieldsValue(_d);
  }
  // 重置基础信息
  async function resetFormFields() {
    return resetBaseInfoFields();
  }

  /**
   * 步距处理
   * **/
  // 初始化步距信息
  function setTechnologyList(list) {
    state.technologyList = list;
  }
  // 删除步距
  function handleDeleteTechnology(index) {
    state.technologyList.splice(index, 1);
    emitStepDistanceList();
  }
  // 添加步距
  function handleAddTechnology() {
    if (state.disabled) return;
    state.technologyList.push(getTechnologyItem());
    emitStepDistanceList();
  }
  // 获取步距信息
  function getStepDistanceList() {
    return state.technologyList;
  }
  // 初始化步距信息
  function setInitTechnologyList() {
    state.technologyList = [getTechnologyItem()];
  }
  // 校验步距信息
  function validateStepDistanceList() {
    return new Promise((resolve, reject) => {
      const list = state.technologyList;
      if (!list.length) {
        reject(t('dict.PCCColumn.enterMainDistance'));
        return;
      }
      const isExistNull = val => {
        return val === '' || val === null || val === undefined;
      };
      const errArr = list.filter(item => {
        return isExistNull(item.stepDistance) || isExistNull(item.modulus);
      });
      if (errArr.length > 0) {
        reject(t('dict.PCCColumn.enterMainDistance'));
        return;
      }
      resolve(true);
    });
  }

  // 同步步距信息出去
  function emitStepDistanceList() {
    emit('materialSetState', {
      stepDistanceList: getStepDistanceList(),
    });
  }

  // 是否可编辑
  function setDisabled(disabled: boolean) {
    state.disabled = disabled;
    setBaseInfoProps({
      disabled,
    });
  }

  /** 根据 bomType 类型设置编辑状态 */
  function setDisabledByBomType(bomType: number) {
    updateBaseInfoSchema({
      field: 'quantitativePlanUserId',
      componentProps: {
        disabled: bomType !== 1,
      },
    });
  }

  defineExpose({
    setBaseInfoFieldsValue,
    setTechnologyList,
    resetFormFields,
    getBaseInfoFieldsValue,
    getStepDistanceList,
    setDisabled,
    validateStepDistanceList,
    validateBaseInfoFields,
    setInitTechnologyList,
    setDisabledByBomType,
  });
</script>

<template>
  <a-row :gutter="20">
    <a-col :span="18">
      <Subtitle :title="t('common.baseinfo')" id="base-info" />
      <BasicForm @register="registerBaseInfoForm" @field-value-change="(e, data) => handleBaseChange(e, data)"></BasicForm>
    </a-col>
    <a-col :span="6">
      <div class="technology-title" @click="handleAddTechnology">
        <PlusOutlined v-if="!state.disabled" />
        {{ t('common.stepNumber') }}
      </div>
      <ScrollContainer class="technology-box">
        <a-row :gutter="[5, 0]" v-for="(item, index) in technologyList" class="item-box">
          <a-col :span="13">
            <span :class="index == 0 ? 'span-required' : ''">
              {{ index + 1 }}、{{ index === 0 ? t('dict.ProcessLevelEnum.Main') : '' }}{{ t('common.step') }}(MM)
            </span>
            <LydcInputNumber :disabled="state.disabled" v-model:value="item.stepDistance" :placeholder="t('common.step')" />
          </a-col>
          <a-col :span="8">
            <span :class="index == 0 ? 'span-required' : ''">{{ t('common.modules') }}</span>
            <LydcInputNumber :disabled="state.disabled" v-model:value="item.modulus" :placeholder="t('common.modules')" />
          </a-col>
          <a-col :span="3">
            <div v-if="!state.disabled" class="del-wrap" @click="handleDeleteTechnology(index)">
              <DeleteOutlined class="ml-5px" />
            </div>
          </a-col>
        </a-row>
      </ScrollContainer>
    </a-col>
  </a-row>
</template>

<style lang="less" scoped>
  .technology-title {
    color: @primary-color;
    margin-bottom: 5px;
    cursor: pointer;
  }

  .technology-box {
    background-color: #fafafa;
    padding: 5px;

    .item-box {
      margin-bottom: 5px;
    }

    .del-wrap {
      margin-top: 27px;
      color: @primary-color;
    }
  }
</style>
