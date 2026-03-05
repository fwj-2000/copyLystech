<template>
  <BasicModal
    :width="700"
    :minHeight="500"
    v-bind="$attrs"
    canFullscreen
    :draggable="true"
    @register="registerModal"
    title="价格导出"
    showOkBtn
    :okText="index === cacheList.length - 1 ? '报价导出' : '保存并下一个'"
    @ok="handleSubmit"
    destroy-on-close>
    <div class="header-detail">
      <div class="item">
        <!--        {{ cacheList[0].code }}&#45;&#45;{{ index }}-->
        <div class="label">产品内部料号:</div>
        <div class="value">{{ cacheList[index]?.parentPartInfo.code || '' }}</div>
      </div>
      <div class="item">
        <div class="label">产品成本价格:</div>
        <div class="value highlight">{{ cacheList[index]?.parentPartInfo.singleCost }}</div>
      </div>
    </div>
    <a-divider />
    <!--    <BasicForm @register="registerForm"></BasicForm>-->
    <div>
      <a-row v-for="(item, index) in dataList" style="margin-bottom: 12px">
        <a-col :span="2" style="display: flex; align-items: center">报价{{ index + 1 }}</a-col>
        <a-col :span="6">
          <a-input-number
            :max="99"
            :min="0"
            v-model:value="item.gp"
            addon-after="%"
            @change="handleGPChange(item, $event)"
            :disabled="item.disabled"></a-input-number>
        </a-col>
        <a-col :offset="1" :span="10">
          <a-input v-model:value="item.price" disabled></a-input>
        </a-col>
        <a-col :offset="1">
          <a-button @click="add(index)">
            <template #icon>
              <PlusOutlined />
            </template>
          </a-button>
        </a-col>
        <a-col v-if="!item.disabled" :offset="1">
          <a-button @click="del(index)">
            <template #icon>
              <MinusOutlined />
            </template>
          </a-button>
        </a-col>
      </a-row>
    </div>
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
  import { reactive, toRefs, ref } from 'vue';
  import { Subtitle } from '/@/components/Subtitle';
  import { PlusOutlined, MinusOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons-vue';
  import { bignumber, divide, subtract } from 'mathjs';
  import { exportQuotation, saveGp } from '/@/api/business/priceConfirmation';
  import { downloadByUrl } from '/@/utils/file/download';
  import { router } from '/@/router/index';

  const emit = defineEmits(['reload', 'register']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const state = reactive({
    cacheList: [],
    index: 0,
    dataList: [],
    singleCost: 0,
  });

  const { cacheList, index, dataList } = toRefs(state);
  const n = ref(2);
  function init(data, index = 0) {
    state.cacheList = data.cacheList;
    state.index = index;
    console.log(data.cacheList);
    console.log(index);

    const singleCost = data.cacheList[state.index]?.parentPartInfo?.singleCost;
    let gpList = data.cacheList[state.index]?.gpList;
    if (gpList?.length <= 0) {
      gpList = [
        {
          gp: 20,
          price: divide(bignumber(singleCost), subtract(bignumber(1), divide(bignumber(20), bignumber(100)))).toFixed(6),
          disabled: true,
        },
        {
          gp: 25,
          price: divide(bignumber(singleCost), subtract(bignumber(1), divide(bignumber(25), bignumber(100)))).toFixed(6),
          disabled: true,
        },
      ];
      state.dataList = gpList;
    } else {
      console.log(gpList);
      state.dataList = gpList.map(item => {
        return {
          ...item,
          gp: item.gp * 100,
          price: divide(bignumber(singleCost), subtract(bignumber(1), divide(bignumber(item.gp * 100), bignumber(100)))).toFixed(6),
          disabled: item.gp == 0.25 || item.gp == 0.2,
        };
      });
    }
    state.singleCost = singleCost;
    changeLoading(true);
    setTimeout(() => {
      changeLoading(false);
    }, 300);
  }

  function add(index) {
    // state.dataList.push();
    state.dataList.splice(index + 1, 0, {
      gp: '',
      price: '',
      disabled: false,
    });
  }

  function del(index) {
    state.dataList.splice(index, 1);
  }

  function handleGPChange(item, e) {
    item.price = divide(bignumber(state.singleCost), subtract(bignumber(1), divide(bignumber(e), bignumber(100)))).toFixed(6);
  }
  async function handleSubmit() {
    const list = state.dataList.map(item => {
      return {
        ...item,
        gp: item.gp / 100,
      };
    });
    const { code } = await saveGp(state.cacheList[state.index].id, list);
    if (code === 200) {
      createMessage.success('保存成功');
      if (state.index === state.cacheList.length - 1) {
        const ids = state.cacheList.map(item => item.id);
        const { data } = await exportQuotation({
          ids: ids.join(),
        });
        downloadByUrl({
          url: data.url,
        });
        createMessage.success('保存成功，已导出报价单');
      } else {
        init(
          {
            cacheList: state.cacheList,
          },
          state.index + 1,
        );
      }
    }
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
