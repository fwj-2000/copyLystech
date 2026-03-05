<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="false"
    :okText="t('common.submit')"
    :title="title"
    destroyOnClose
    class="full-popup">
    <div class="flow-details" v-loading="isShowLoading">
      <div class="flow-details-info p-14px pb-0">
        <div class="title-box">
          <Subtitle :title="t('common.baseinfo')" />
        </div>
        <a-row :gutter="[8, 8]">
          <a-col :span="6"> {{ t('dict.ProcessRouteColumn.processRouteTypeName') }}：{{ routeTypeOptions[dataInfo.processRouteType] }} </a-col>

          <a-col :span="6" v-if="dataInfo.processRouteType === 2"> {{ t('dict.LineInfoColumn.LineName') }} ：{{ dataInfo.lineName }} </a-col>
          <a-col :span="6" v-else>{{ t('dict.PurchaseQuotationColumn.materialName') }} ：{{ dataInfo.material }} </a-col>
          <a-col :span="6"> {{ t('dict.ProcessRouteColumn.routeName') }}：{{ dataInfo.processRouteTypeName }} </a-col>
          <a-col :span="6"> {{ t('dict.CommonCol.creatorUserName') }}：{{ dataInfo.creatorUserName }} </a-col>
          <a-col :span="6">
            {{ t('dict.CommonCol.creatorTime') }} ：{{ dataInfo.creatorTime ? dayjs(dataInfo.creatorTime).tz().format('YYYY-MM-DD HH:mm:ss') : '/' }}
          </a-col>
          <a-col :span="6"> {{ t('dict.CommonCol.lastModifyUserName') }} ：{{ dataInfo.lastModifyUserName }} </a-col>
          <a-col :span="6">
            {{ t('dict.CommonCol.lastModifyTime') }} ：{{ dataInfo.lastModifyTime ? dayjs(dataInfo.lastModifyTime).tz().format('YYYY-MM-DD HH:mm:ss') : '/' }}
          </a-col>
          <a-col :span="24"> {{ t('dict.CommonCol.remark') }} ：{{ dataInfo.remark }} </a-col>
        </a-row>
      </div>
      <div class="icon-box">
        <img :src="hxz" />
        <img :src="hxz" />
        <img :src="hxz" />
        <img :src="hxz" />
      </div>
    </div>
    <div class="line"> </div>

    <div class="content-warp" ref="detailsBox">
      <div class="flowContent">
        <Subtitle :title="t('common.viewProcessRoute')" />
        <FlowContent ref="FlowContentRef" wrapClassName="FlowContent" />
      </div>

      <div class="materiarlDetails">
        <Subtitle :title="t('common.bomMaterial')" />
        <BasicTable @register="registerMetarialTable"></BasicTable>
      </div>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getProcessroutebindDetails } from '/@/api/productionDeal/processroutebind';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { getRouteDetail } from '/@/api/productionPlan/processRoute';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import hxz from '/@/assets/images/process/hxz.png';
  import { FlowContent } from '/@/components/CustomComponents';
  import dayjs from 'dayjs';
  const emits = defineEmits(['register', 'refresh']);
  const baseStore = useBaseStore();
  const [registerPopup, { closePopup }] = usePopupInner(init);
  const { t } = useI18n();
  const routeTypeOptions = {};
  interface State {
    title: string;
    id: string;
    dataInfo: any;
  }

  const state = reactive<State>({
    title: '',
    id: '',
    dataInfo: {},
  });

  const detailsBox = ref<HTMLElement>();
  const FlowContentRef = ref();
  const isShowLoading = ref(false);
  const { title, dataInfo } = toRefs(state);
  const columns: BasicColumn[] = [
    { title: '工序名称', dataIndex: 'processName', width: 60 },
    { title: '物料', dataIndex: 'materials' },
  ];
  const [registerMetarialTable, { setTableData }] = useTable({
    columns,
    immediate: true,
    useSearchForm: false,
    rowKey: 'id',
    showTableSetting: false, //刷新按钮,默认打开
    isCanResizeParent: true,
    showIndexColumn: false, //显示序号
    pagination: false,
  });

  function init(data) {
    state.title = data?.title;
    state.id = data?.id || '';
    getDataFn();
    getOptionsFn();
  }

  async function getOptionsFn() {
    const routeType: any = await baseStore.getDictionaryData('ProcessRoute.RouteType');
    routeType.forEach(item => {
      routeTypeOptions[item.enCode] = item.fullName;
    });
  }

  async function getDataFn() {
    isShowLoading.value = true;
    const { code, data } = await getProcessroutebindDetails(state.id);
    if (code === 200) {
      state.dataInfo = data;
      setTableData(data.bindMaterialList);
      // handleViewFlow(state.dataInfo.processRouteId);
      console.log(FlowContent.value, 'FlowContent.value');
      FlowContentRef.value?.init({
        title: t('dict.ProcessRouteColumn.routeMap'),
        flowId: state.dataInfo.processRouteId,
        flowApi: getRouteDetail,
        isPreview: true,
      });
    }
    isShowLoading.value = false;
  }
</script>

<style lang="less" scoped>
  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  :deep(.details-box) {
    position: relative !important;
  }

  .flow-details {
    position: relative !important;
    border-bottom: 12px solid #ebeef5;
    padding-bottom: 20px;
  }

  .content-warp {
    position: relative;
    height: 100%;
    display: flex;
  }

  .materiarlDetails {
    position: absolute;
    left: 52%;
    width: 47%;
    height: 100%;
    border-left: 12px solid #ebeef5;
    padding: 20px 0 0 20px;
  }

  .icon-box {
    padding: 0 20px;
    position: absolute;
    bottom: -28px;
    left: 0;
    display: flex;
    justify-content: space-around;
    z-index: 9999;
    width: 100%;
  }

  .flowContent {
    position: relative;
    width: 52%;
    padding: 20px;
  }
</style>
