<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :showOkBtn="false"
    @cancel="handleCloseFn"
    destroyOnClose
    width="1000px"
    :minHeight="state.id ? 500 : 700">
    <template #title>
      <div class="ml-16px">
        <Subtitle :title="state.title" />
      </div>
    </template>
    <div :class="state.id ? 'h-[500px]' : 'h-[700px]'">
      <div class="form-block">
        <processBox ref="processBoxs" />
        <div :class="['form-block-content', 'min-h-180px', 'overflow-auto', state.id ? '' : 'max-h-240px']" v-if="state.tempListData.length">
          <TempForm
            :tempList="state.tempListData"
            ref="tempFormRef"
            :colSpan="6"
            :isNeedValidate="true"
            :processName="state.processName"
            :operationType="state.operationType" />
        </div>
      </div>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { reactive, ref, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getDetailbyprocessname } from '/@/api/basicData/processrulestemplate';
  import TempForm from '/@/views/productionPlan/procruleTemp/components/tempForm.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { Subtitle } from '/@/components/Subtitle';
  import { processBox } from '/@/components/processBox';

  const userStore = useUserStore();
  const processBoxs = ref();
  const emit = defineEmits(['refresh']);
  interface State {
    dataForm: any;
    templistParams: any;
    detailData: any;
    scanData: any;
    id: string;
    processName: string;
    process: string;
    operationType: string;
    title: any;
    tempListData: any[];
    uploadProgramFile: string;
    uploadProgramFileName: string;
  }
  const state = reactive<State>({
    dataForm: {},
    templistParams: {},
    detailData: {},
    scanData: [],
    id: '',
    title: '',
    tempListData: [],
    processName: '',
    process: '',
    operationType: '',
    uploadProgramFile: '',
    uploadProgramFileName: '',
  });
  const tempFormRef = ref();
  const translateInput = ref('');

  const [registerModal] = useModalInner(init);

  async function handleCloseFn() {
    state.tempListData = [];
  }

  // 获取开启的模板配置
  async function getDetailbyprocessnameFn(templistParams, mergeItem: any = {}) {
    state.tempListData = [];
    const { code, data } = await getDetailbyprocessname(templistParams);
    if (code === 200) {
      if (mergeItem.id) {
        const showData = data.map(o => {
          if (o.fieldEnName === 'uploadProgramFile') {
            o.isChecked = true;
            o.uploadProgramFileName = mergeItem.uploadProgramFileName;
          }
          o.isDisabled = 1;
          o.fieldValue = mergeItem[o.fieldEnName];
          if (o.fieldEnName === 'classes') {
            o.fieldValue = String(o.fieldValue);
          }
          if (o.isMultiSelect === 1) {
            o.fieldValue = o.fieldValue ? o.fieldValue.split(',') : [];
          }
          return o;
        });
        state.tempListData = showData;
        return;
      }
      state.tempListData = data.map(item => {
        //自动带入扫描标签获取的数据
        item.fieldValue = state.scanData[item.fieldEnName];
        if (item.fieldEnName === 'creatorTime') {
          item.fieldValue = Date.now();
        } else if (item.fieldEnName === 'creatorUserName') {
          item.fieldValue = unref(userStore.getUserInfo).userName;
        } else if (item.fieldEnName === 'orgId') {
          item.fieldValue = unref(userStore.getUserInfo).organizeIdList;
        } else if (item.fieldEnName === 'classes' && item.fieldValue) {
          //自动带入扫描标签获取的数据
          item.fieldValue = String(item.fieldValue);
        }
        if (item.isMultiSelect === 1) {
          item.fieldValue = item.fieldValue ? item.fieldValue.split(',') : [];
          item.fieldValueName = state.scanData[item.fieldEnName + 'Name'];
        }
        return item;
      });
    }
  }

  async function init({ title, data, templistParams }) {
    console.log(title, data, templistParams);
    translateInput.value = '';
    state.tempListData = [];
    state.title = title;
    state.id = data.id;
    state.uploadProgramFile = data.uploadProgramFile;
    state.uploadProgramFileName = data.uploadProgramFileName;
    state.processName = templistParams.processName;
    state.operationType = templistParams.operationType;
    state.detailData = data;
    state.templistParams = templistParams;

    if (state.id) {
      processBoxs.value && processBoxs.value.getRouteList(data);
      state.templistParams.process = data.process;
      state.templistParams.processName = data.processName;
      getDetailbyprocessnameFn(state.templistParams, state.detailData);
    }
  }
</script>
<style lang="less" scoped>
  .title {
    padding-bottom: 0;
    font-size: 16px;
    font-weight: 600;
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
