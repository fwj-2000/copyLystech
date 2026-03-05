<template>
  <div class="supplier-item">
    <!-- 新增或暂存状态需显示删除按钮 -->
    <img v-show="showDel" class="supplier-del" src="./icon_del.svg" @click="onDelete" />
    <!-- 将需要排序的元素统一包裹在order容器中 -->
    <div class="order-group">
      <!-- 工程复核信息 -->
      <div v-show="showResult" class="inner" :style="{ order: resultPosition.resultOrder }">
        <div class="flex">
          <b style="font-weight: bold">{{ t('dict.MaterialDevelopmentApplySonNode.EngineeringReview') }}: </b>
          <span :style="{ color: props.values.status == 1 ? '#52C41A' : '#FAAD14' }" class="flex ml-5px">
            <img v-if="props.values.status == 1" src="/@/assets/svg/report/success.svg" />
            <img v-else src="/@/assets/svg/report/err_tip.svg" />
            <span>{{ handleStatusDesc(props.values.status, IS_SATISFY_LIST) }}</span>
          </span>
          <span class="ml-3" v-if="props.recommendType == 2">{{ t('common.notReason') }}： {{ props.values.conclusionRemarks || '/' }}</span>
        </div>
        <div class="flex" v-if="props.type != 'detailed'">
          <a-button type="link" @click="handleDetail">{{ t('common.viewHistory') }}</a-button>
          <span v-if="showUpdateBtn">
            <a-divider type="vertical"></a-divider>
            <a-button type="primary" ghost @click="handleChange">{{ t('common.updateText') }}</a-button>
          </span>
        </div>
      </div>

      <!-- 供应商主体信息 + 附件模块 -->
      <div :style="{ order: 2 }">
        <BasicForm @register="registerForm"></BasicForm>
        <!-- 附件上传区域 -->
        <div class="supplier-attach-row">
          <span class="attach-label"> {{ t('common.attachment') }}</span>
          <UploadBtn
            v-if="editType"
            ref="uploadBtnRef"
            :buttonText="t('common.upFiles')"
            :buttonProps="{ class: 'mr-12px' }"
            type="default"
            @success="handleUploadSuccess" />
          <div v-if="!supplierFileList || supplierFileList.length === 0" class="no-file-tip">
            {{ t('common.noAttachment') }}
          </div>
        </div>
        <FileInfos v-model:fileList="supplierFileList" :editable="editType && props.canEdit" />
      </div>

      <!-- 工程回复action -->
      <div :style="{ order: 3 }" class="inner-wrap" v-show="showEniggerReply">
        <replayItem ref="replyRef" :recommend-type="props.recommendType"></replayItem>
      </div>

      <div :style="{ order: resultPosition.beforeResultOrder }">
        <slot name="beforeResult"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, onMounted, ref, computed } from 'vue';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { getSuppliers } from '/@/api/purchase/newMateria';
  import replayItem from './ReplayItem.vue';
  import { isEditStatus, isEditStatusEngineering } from './utils';
  import { handleStatusDesc, IS_SATISFY_LIST } from '/@/components/CustomComponents/src/material/Constant';
  import { useI18n } from '/@/hooks/web/useI18n';

  // 公共上传 & 附件展示组件
  import UploadBtn from '/@/components/Upload/src/components/UploadBtn.vue';
  import FileInfos from '/@/components/Upload/src/components/FileInfos.vue';

  const { t } = useI18n();

  const emits = defineEmits(['onDelete', 'onUpdate', 'onDetail']);
  const initFlag = ref(true); // 是否为初始化
  const uploadBtnRef = ref(null);

  const purchaseSchema: FormSchema[] = [
    {
      field: 'supplierId',
      i18nField: 'supplierName',
      label: '供应商名称',
      component: 'ApiSelect',
      componentProps: {
        api: getSuppliers,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'supplierName',
        },
        params: {
          pageSize: 100,
        },
        beforeFetch: params => {
          if (initFlag.value) {
            initFlag.value = false;
            params.supplierName = props.values.supplierName;
            return params;
          }
        },
        resultField: 'data',
        labelField: 'shortName',
        valueField: 'id',
        filterOption: false,
        notFoundContent: null,
        nameFormat: ['shortName', '/', 'code'],
        immediate: true,
      },
      required: true,
      colProps: {
        span: 12,
      },
    },
    {
      field: 'manufacturerMaterialsCode',
      label: '供应商材料编码',
      component: 'Input',
      required: true,
      colProps: {
        span: 12,
      },
    },
  ];
  const engineerSchema: FormSchema[] = [
    {
      field: 'supplierMaterialsInformation',
      label: '供应商材料信息',
      component: 'Textarea',
      componentProps: {
        rows: 1,
        maxlength: 200,
      },
      required: true,
      colProps: {
        span: 10,
      },
    },
    {
      field: 'remarks',
      i18nField: 'CommonCol.remark',
      label: '备注',
      component: 'Input',
      colProps: {
        span: 10,
      },
    },
    {
      field: 'verificationOrder',
      label: '验证优先级',
      component: 'InputNumber',
      componentProps: { min: 1 },
      required: true,
      colProps: {
        span: 4,
      },
    },
  ];

  const showUpdateBtn = ref(false);

  const [registerForm, { setFieldsValue, getFieldsValue, setProps }] = useForm({
    labelWidth: 220,
    layout: 'vertical',
    baseColProps: {
      span: 4,
    },
    rowProps: {
      align: 'middle',
      justify: 'start',
      gutter: 5,
    },
    schemas: [],
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
    },
  });

  const props = defineProps({
    type: {
      type: String, // 'add': 添加状态 'detailed'：仅浏览, 'view'
      default: 'add',
    },
    values: {
      type: Object,
      default: () => ({}),
    },
    recommendType: {
      type: Number,
      default: 2,
    },
    role: {
      type: String,
      default: '1', // 1: 采购；2：工程
    },
    // 该单号的当前状态
    orderStatus: {
      type: [String, Number],
      default: '',
    },
    // 工程复核结果的指定位置
    resultPosition: {
      type: String,
      default: 'top',
    },
    canEdit: {
      type: Boolean,
      default: true,
    },
  });

  // 工程复核的显示区域
  const resultPosition = computed(() => {
    const resultOrder = props.resultPosition === 'bottom' ? 5 : 1;
    return {
      resultOrder,
      beforeResultOrder: resultOrder - 1,
    };
  });

  const showEniggerReply = ref(false); // 工程回复
  const showResult = ref(false); // 工程回复结果
  // const editType = ref(props.type == 'add'); // 编辑状态
  const editType = ref(props.type == 'add' && props.canEdit); // 编辑状态
  const showDel = ref(props.type == 'add' && props.canEdit);

  // 当前供应商的附件列表
  const supplierFileList = ref<{ fileName: string; filePath: string }[]>([]);

  function handleChange() {
    if (!props.canEdit) return;
    editType.value = true;
    emits('onUpdate');
    setProps({
      disabled: false,
    });
  }

  function handleDetail() {
    emits('onDetail');
  }

  function handleDisabled(y: boolean) {
    // if (y) {
    //   setProps({ disabled: true });
    //   editType.value = false;
    // } else {
    //   setProps({ disabled: false });
    //   editType.value = true;
    // }
    const disabled = y || !props.canEdit;
    setProps({ disabled });
    editType.value = !disabled;
    if (disabled) {
      showDel.value = false;
    }
  }

  onMounted(() => {
    if (props.type != 'add') {
      handleDisabled(true);
    }
    if (props.role == '2') {
      // 工程界面
      setProps({
        schemas: engineerSchema,
      });
      const { temporaryStorage, status, upStatus } = props.values as any;
      console.log('upStatus', upStatus);
      if (!temporaryStorage && status >= 0) {
        showEniggerReply.value = false;
        showResult.value = true;
      } else {
        showEniggerReply.value = true;
        emits('onUpdate');
        nextTick(() => {
          replyRef.value.setFieldsValue(props.values);
        });
      }
      if (isEditStatusEngineering(props.orderStatus) && upStatus == 1) {
        showEniggerReply.value = true;
        showResult.value = false;
        emits('onUpdate');
      }
    } else {
      // 采购
      setProps({
        schemas: [...purchaseSchema, ...engineerSchema],
      });
      // 暂存需要可编辑
      const { status, temporaryStorage } = props.values as any;
      const temporary = temporaryStorage && !status;
      const isEdit = isEditStatus(props.orderStatus) && !status;
      if (temporary || isEdit) {
        handleDisabled(false);
        emits('onUpdate');
        showDel.value = true;
      }
      if (status >= 0) {
        showResult.value = true;
      }
      // 工程不满足，且当前为可编辑状态时才显示修改按钮
      if ((props.values as any).status == 2 && isEditStatus(props.orderStatus)) {
        showUpdateBtn.value = true;
      }
    }

    // 初始化附件（如果后端有传，比如 values.fileJson 或 values.supplierFileList）
    const v: any = props.values;
    if (v && Array.isArray(v.fileJson)) {
      supplierFileList.value = v.fileJson.map((f: any) => ({
        fileName: f.fileName,
        filePath: f.filePath,
      }));
    }

    if (props.values) {
      nextTick(() => {
        setFieldsValue(props.values);
      });
    }
  });

  function onDelete() {
    emits('onDelete');
  }

  // 上传成功：合并到当前供应商附件列表
  function handleUploadSuccess(list: { fileName: string; filePath: string }[]) {
    const exist = supplierFileList.value;
    const merged = [...exist];
    list.forEach(item => {
      if (!merged.some(f => f.fileName === item.fileName && f.filePath === item.filePath)) {
        merged.push(item);
      }
    });
    supplierFileList.value = merged;
    uploadBtnRef.value?.handleClear();
  }

  const replyRef = ref();
  function getValues() {
    if (editType.value) {
      return {
        recommendType: props.recommendType,
        values: {
          id: (props.values as any).id,
          ...getFieldsValue(),
          // 如果后端需要附件，可以把这一行一起带过去（可按你们接口字段名调整）
          fileJson: supplierFileList.value,
        },
      };
    }
    if (props.role == '2') {
      return {
        recommendType: props.recommendType,
        values: {
          id: (props.values as any).id,
          ...replyRef.value.getFieldsValue(),
        },
      };
    }
    return false;
  }

  defineExpose({
    getValues,
  });
</script>

<style lang="less" scoped>
  .supplier-item {
    background: #f7f7f7;
    padding: 10px 10px 2px;
    margin-bottom: 10px;
    border-radius: 8px;
    position: relative;

    .order-group {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 10px; // 控制元素间距

      .review-section {
        order: 3;
      }
    }

    .supplier-del {
      position: absolute;
      right: 15px;
      cursor: pointer;
      z-index: 2;
    }

    .inner {
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #dbdbdb;
      background: #fff;
      margin-bottom: 7px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .inner-wrap {
      padding-bottom: 10px;
    }
  }

  .supplier-attach-row {
    display: flex;
    align-items: center;
    margin-top: 8px;
    margin-bottom: 4px;

    .attach-label {
      margin-right: 8px;
      font-family: 'HarmonyOS Sans', sans-serif;
      font-weight: 700;
      font-size: 14px;
      line-height: 22px;
      letter-spacing: 0;
      text-align: left;
    }
  }

  // 禁用状态下，输入框内字体颜色调整
  ::v-deep(.ant-form) {
    .ant-select-disabled.ant-select div.ant-select-selector,
    .ant-input-affix-wrapper-disabled,
    .ant-input[disabled],
    .ant-input-number-disabled {
      color: inherit;
    }
  }
</style>
