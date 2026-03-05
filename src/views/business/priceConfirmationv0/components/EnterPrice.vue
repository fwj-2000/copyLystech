<template>
  <BasicModal
    :minHeight="500"
    v-bind="$attrs"
    canFullscreen
    :draggable="true"
    @register="registerModal"
    title="价格导出"
    showOkBtn
    :okText="index === cacheList.length - 1 ? '提交' : '保存并下一个'"
    @ok="handleSubmit"
    destroy-on-close>
    <div class="header-detail">
      <div class="item">
        <div class="label">产品内部料号:</div>
        <div class="value">{{ cacheList[index]?.parentPartInfo.code || '' }}</div>
      </div>
      <div class="item">
        <div class="label">成本价格:</div>
        <div class="value highlight">{{ cacheList[index]?.parentPartInfo.singleCost }}</div>
      </div>
    </div>
    <a-divider />
    <BasicForm @register="registerForm"></BasicForm>

    <template #footer>
      <div style="display: flex; justify-content: space-between">
        <div>
          <a-button @click="handlePre">
            <template #icon><LeftOutlined /></template>
          </a-button>
          {{ index + 1 }} / {{ cacheList.length }}
          <a-button @click="handleNext">
            <template #icon><RightOutlined /></template>
          </a-button>
        </div>
        <div>
          <a-space>
            <a-button
              key="back"
              @click="
                () => {
                  emit('reload');
                  closeModal();
                }
              "
              >取消</a-button
            >
            <a-button key="submit" type="primary" @click="handleSubmit">{{ index === cacheList.length - 1 ? '提交' : '保存并下一个' }}</a-button>
          </a-space>
        </div>
      </div>
    </template>
  </BasicModal>
</template>
<script setup lang="tsx">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { reactive, toRefs } from 'vue';
  import { saveBidding } from '/@/api/business/priceConfirmation';
  import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useBaseStore } from '/@/store/modules/base';

  const emit = defineEmits(['reload', 'register']);

  const baseStore = useBaseStore();
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const state = reactive({
    cacheList: [],
    index: 0,
    dataList: [],
    singleCost: 0,
  });

  const [registerForm, { setFieldsValue, clearValidate, validate, resetFields, updateSchema, getFieldsValue, setProps }] = useForm({
    schemas: getSchemas(),
    layout: 'horizontal',
  });

  function getSchemas(): FormSchema[] {
    return [
      {
        field: 'biddingResult',
        label: '结果',
        component: 'ApiSelect',
        componentProps: {
          placeholder: '请选择结果',
          api: () => {
            return baseStore.getDictionaryData('Quotation.BiddingResult');
          },
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
        },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
        colProps: {
          span: 24,
        },
      },
      {
        field: 'biddingPrice',
        label: '竞价价格',
        component: 'InputNumber',
        componentProps: { placeholder: '请输入竞价价格', maxlength: 50 },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
        colProps: {
          span: 24,
        },
      },

      {
        field: 'biddingRemark',
        label: '备注',
        component: 'Textarea',
        componentProps: { placeholder: '请输入备注', maxlength: 50 },
        colProps: {
          span: 24,
        },
      },
    ];
  }

  const { cacheList, index, dataList } = toRefs(state);
  function init(data, index = 0) {
    state.cacheList = data.cacheList;
    state.index = index;
    const currentData = data.cacheList[state.index];
    const singleCost = currentData?.parentPartInfo?.singleCost;
    state.singleCost = singleCost;
    if (currentData.biddingPrice) {
      setFieldsValue({
        biddingResult: currentData.biddingResult + '',
        biddingPrice: currentData.biddingPrice,
        biddingRemark: currentData.biddingRemark,
      });
    } else {
      resetFields();
    }
    changeLoading(true);
    setTimeout(() => {
      changeLoading(false);
    }, 300);
  }

  async function handleSubmit() {
    validate().then(async res => {
      if (!res) return;
      changeLoading(true);
      saveBidding({
        id: state.cacheList[state.index].id,
        ...res,
      })
        .then(({ code, msg }) => {
          if (code == 200) {
            createMessage.success(msg);
            if (state.index === state.cacheList.length - 1) {
              emit('reload');
              closeModal();
              return;
            }
            state.index = state.index + 1;
            init(
              {
                cacheList: state.cacheList,
              },
              state.index,
            );
            resetFields();
            changeLoading(false);
          }
        })
        .catch(e => {
          changeLoading(false);
        });
    });
  }
  function handlePre() {
    if (state.index == 0) return createMessage.warning('已经是第一条数据了');
    state.index = state.index - 1;
    init(
      {
        cacheList: state.cacheList,
      },
      state.index,
    );
  }
  function handleNext() {
    if (state.index == state.cacheList.length - 1) return createMessage.warning('已经是最后一条数据了');
    state.index = state.index + 1;
    init(
      {
        cacheList: state.cacheList,
      },
      state.index,
    );
  }
</script>
<style lang="less" scoped>
  .header-detail {
    display: block;

    .item {
      display: inline-block;
      margin-right: 32px;

      .label {
        display: inline-block;
        color: #666;

        /* 中文/正文14 */

        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
      }

      .value {
        display: inline-block;
        color: #1a1a1a;
        //text-overflow: ellipsis;

        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        margin-left: 8px;
      }

      .highlight {
        color: #1890ff;

        /* 中文/标题14 */

        font-size: 14px;
        font-style: normal;
        font-weight: 700;
        line-height: 22px;
      }
    }
  }

  //:deep(.ant-form .ant-form-item) {
  //  margin-bottom: 12px;
  //}
  //:deep(.lydc-basic-form .ant-form-item) {
  //  margin-bottom: 12px;
  //}
  :deep(.ant-form-item) {
    margin-bottom: 12px !important;
  }

  :deep(.lydc-basic-form) {
    margin-bottom: 0;
  }

  :deep(.ant-input-group .lydc-basic-form .ant-form-item) {
    margin-bottom: 0;
  }
</style>
