<template>
  <div class="w-full yl-colllapse mb-10px">
    <a-collapse v-model:activeKey="state.activeKey" style="background: #fff" :bordered="false">
      <a-collapse-panel key="1" :style="customStyle">
        <template #header>
          <div class="flex yl-colllapse-header" @click="handleClick">
            <div>
              <span class="required">{{ t('dict.MaterialDevelopMaterialConfirmColumn.materialCode') }}: </span>
              <ApiSelect
                style="width: 200px"
                v-model:value="state.value"
                showSearch
                resultField="data"
                labelField="MaterialCode"
                valueField="MaterialCode"
                :api="getMetarialCode"
                :apiSearch="{ show: true, searchName: 'shortMaterialCode' }"
                :filter-option="false"
                :disabled="showDisabled"
                @change="(e, data) => handleChange(e, data)" />
            </div>
            <div class="ml-10px flex" v-if="showResult">
              <b style="font-weight: bold; margin-right: 3px">{{ t('dict.MaterialDevelopmentApplySonNode.EngineeringReview') }}: </b>
              <img v-if="props.values.conclusionStatus == 1" src="/@/assets/svg/report/success.svg" />
              <img v-else src="/@/assets/svg/report/err_tip.svg" />
              <span :style="{ color: props.values.conclusionStatus == 1 ? '#52C41A' : '#FAAD14' }">
                <!-- props.values.conclusionStatusDesc -->
                {{ handleStatusDesc(props.values.conclusionStatus, IS_SATISFY_LIST) }}
              </span>
              <span class="ml-5px">{{ t('common.notReason') }} : {{ props.values.conclusionRemarks || '/' }}</span>
            </div>
          </div>
        </template>
        <template #extra>
          <div class="flex">
            <img v-if="showDel" class="supplier-del" src="./icon_del.svg" @click="onDelete" />
            <a-button v-if="showResult" type="link" @click="handleDetail">{{ t('common.viewHistory') }} </a-button>
          </div>
        </template>
        <BasicInfo
          :config="commonCols"
          layout="vertical"
          :data-source="state.metarials"
          :columns="4"
          :i18nConfig="{ moduleCode: 'MaterialWarehouseColumn' }"></BasicInfo>
      </a-collapse-panel>
    </a-collapse>
    <div class="inner" v-if="showEniggerReply">
      <replayItem ref="replyRef" :recommend-type="props.recommendType"></replayItem>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { nextTick, onMounted, reactive, ref } from 'vue';
  import { BasicInfo } from '/@/components/CustomComponents';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import { getMetarialCode } from '/@/api/business/material';
  import replayItem from './ReplayItem.vue';
  import { isEditStatus } from './utils';
  import { handleStatusDesc, IS_SATISFY_LIST } from '/@/components/CustomComponents/src/material/Constant';
  import { commonCols } from '/@/views/business/basicInformation/material/config';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { t } = useI18n();

  const emits = defineEmits(['onDelete', 'onUpdate', 'onDetail']);
  const props = defineProps({
    type: {
      type: String,
      default: 'add',
    },
    values: {
      type: Object,
      default: () => {},
    },
    recommendType: {
      type: Number,
      default: 2,
    },
    role: {
      type: String,
      default: '1', // 1: 采购；2：工程
    },
    orderStatus: {
      type: [String, Number],
      default: '',
    },
  });
  const customStyle = 'background:#f3f3f3;border-radius: 4px;margin-bottom: 14px;border: 0;overflow: hidden';
  const state = reactive({
    value: '',
    metarials: props.values,
    activeKey: '1',
  });
  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
  };

  function onDelete() {
    emits('onDelete');
  }
  function handleDetail() {
    emits('onDetail');
  }
  function handleChange(e, data) {
    state.metarials = data;
  }
  const showDisabled = ref(props.type != 'add');
  const showEniggerReply = ref(false);
  const showResult = ref(false);
  const editType = ref(props.type == 'add'); // 编辑状态
  const replyRef = ref();
  const showDel = ref(props.type == 'add'); // 删除icon

  function handleDisabled(y: boolean) {
    if (y) {
      showDisabled.value = true;
      editType.value = false;
    } else {
      showDisabled.value = false;
      editType.value = true;
    }
  }
  // 处理八码
  async function handleCode(code) {
    if (code) {
      const r = await getMetarialCode({
        materialCode: code,
      });
      if (r.data) {
        state.metarials = r.data[0];
      }
    }
  }

  function getValues() {
    if (editType.value) {
      return {
        recommendType: props.recommendType,
        values: {
          id: props.values.id,
          materialCode: state.metarials.value,
          shortMaterialCode: state.metarials.ShortMaterialCode,
        },
      };
    }
    if (props.role == '2') {
      return {
        recommendType: props.recommendType,
        values: {
          id: props.values.id,
          ...replyRef.value.getFieldsValue(),
        },
      };
    }
    return false;
  }

  // 初始化
  onMounted(() => {
    // 工程界面
    if (props.role == '2') {
      const { conclusionStatus, temporaryStorage } = props.values;
      // 非暂存状态、有结论时，不做结论展示
      if (!temporaryStorage && conclusionStatus >= 0) {
        showEniggerReply.value = false;
      } else {
        showEniggerReply.value = true;
        emits('onUpdate');
        nextTick(() => {
          replyRef.value.setFieldsValue(props.values);
        });
      }
      if (conclusionStatus >= 0) {
        showResult.value = true;
      }
    } else {
      // 采购
      // 暂存需要可编辑
      const { conclusionStatus, temporaryStorage } = props.values;
      const temporary = temporaryStorage && !conclusionStatus;
      const isEdit = isEditStatus(props.orderStatus) && !conclusionStatus;
      // 非暂存状态、有结论时，不做结论展示
      if (temporary || isEdit) {
        handleDisabled(false);
        emits('onUpdate');
        showDel.value = true;
      }
      if (conclusionStatus >= 0) {
        showResult.value = true;
      }
    }
    if (props.values) {
      const { materialCode } = props.values;
      state.value = materialCode;
      handleCode(materialCode);
    }
  });
  defineExpose({
    getValues,
  });
</script>
<style lang="less" scoped>
  :deep(.ant-divider-horizontal) {
    margin: 0 0 20px;
  }

  .yl-colllapse {
    background: #f3f3f3;
    border-radius: 8px;

    .required {
      position: relative;

      &::after {
        position: absolute;
        content: '*';
        color: red;
        left: -5px;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    &-header {
      justify-content: space-between;
    }

    .inner {
      padding: 0 10px 10px;
    }
  }
</style>
