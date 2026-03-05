<template>
  <div id="TablePanel" class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white h-full">
        <a-tabs :activeKey="activeKey" class="h-full" @tabClick="handleClose" v-show="state.inspectionDataTabList.length">
          <a-tab-pane v-for="item in state.inspectionDataTabList" :key="item.value" :tab="t('common.' + item.value)">
            <!-- <component :is="importCpmByName(item.value)" :params="{ applyId: state.applyId, code: item.code }" :ref="el => setTabRef(el)" /> -->
            <component :is="importCpmByName(item.value)" :params="{ applyId: state.applyId, code: item.code }" :ref="el => setTabRef(el, item.value)" />
          </a-tab-pane>
        </a-tabs>
        <div class="position-relative">
          <div class="nodata-block" v-show="!state.inspectionDataTabList.length">
            <img :src="nodata" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, defineAsyncComponent, reactive, computed, unref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { inspectionDataTabList, InspectionTabs } from '../config';
  import { useBaseStore } from '/@/store/modules/base';
  import { useMessage } from '/@/hooks/web/useMessage';
  import nodata from '/@/assets/images/process/nodata.png';
  const { createConfirm } = useMessage();

  const cpmlist: any = {};
  const activeKey = ref<InspectionTabs>(InspectionTabs.VisualInspection);
  const tabRefs: any = ref([]);
  const { t } = useI18n();
  const baseStore = useBaseStore();
  interface IState {
    IQCTabMap: any;
    inspectionDataTabList: any;
    data: any;
    applyId: string;
  }
  const state = reactive<IState>({
    IQCTabMap: {},
    inspectionDataTabList: [],
    data: [],
    applyId: '',
  });

  /**
   * 动态设置Ref
   */
  function setTabRef(el, value) {
    if (el) {
      tabRefs.value[value] = el;
    }
  }

  /**
   * 获取当前操作组件
   */
  function getCurCpmFn() {
    return tabRefs.value[activeKey.value];
  }

  /**
   * 检查是否有未保存的数据
   */
  async function handleClose(e) {
    try {
      // setTimeout(async () => {
      await getCurCpmFn().checkUnsavedDataFn();
      activeKey.value = e;
      // }, 300);
    } catch (error) {
      console.log(error, '发生了错误');
      // activeKey.value = e;
    }
  }

  function importCpmByName(name: InspectionTabs) {
    if (!cpmlist[name]) {
      cpmlist[name] = defineAsyncComponent(() => import(`../${name}/index.vue`));
    }
    return cpmlist[name];
  }
  async function init({ data, applyId }: any): Promise<void> {
    state.data = data;
    state.applyId = applyId;
    let IQCTabMap = {};
    baseStore.getDictionaryData('IQCTabMap').then(r => {
      r.forEach(rItem => {
        IQCTabMap[rItem.enCode] = rItem.fullName;
        IQCTabMap[rItem.fullName + 'sortCode'] = rItem.sortCode;
      });
      state.IQCTabMap = IQCTabMap;
      state.inspectionDataTabList = data.map(item => {
        const tabName = IQCTabMap[item.testProjectCode];
        if (!tabName) return;

        return {
          label: item.testProjectName,
          value: tabName,
          sortCode: IQCTabMap[tabName + 'sortCode'],
          code: item.testProjectCode,
        };
      });
      state.inspectionDataTabList.sort((a, b) => {
        return a.sortCode - b.sortCode;
      });

      activeKey.value = state.inspectionDataTabList[0].value;
    });
  }
  async function submitFn() {
    await getCurCpmFn().submitFn();
  }
  defineExpose({ init, submitFn });
</script>

<style lang="less" scoped>
  :deep .ant-tabs .ant-tabs-content {
    height: 100%;
  }

  .nodata-block {
    position: absolute;
    text-align: center;
    padding-top: 150px;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
