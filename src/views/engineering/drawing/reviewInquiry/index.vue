<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" />
      </div>
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_download'" @click="handleExport">{{ t('views.business.quota.export') }} </a-button>
            </a-space>
          </template>
          <template #nodeDetail="{ row }">
            <div class="table-a" @dblclick="handleNodeModal(row)">
              {{ t('common.viewDetails') }}
            </div>
          </template>
          <template #dfm="{ row }">
            <a-tag>{{ DFMList.find(item => item.enCode == row.dfm)?.fullName }}</a-tag>
          </template>
          <template #makeEngineeringInfo="{ row }">
            <a-tag>{{ MakeEngineeringInfoList.find(item => item.enCode == row.makeEngineeringInfo)?.fullName }}</a-tag>
          </template>
          <template #reviewResult="{ row }">
            <a-tag>{{ reviewResultList.find(item => item.enCode == row.reviewResult)?.fullName }}</a-tag>
          </template>
          <template #desensitizedDrawingsName="{ row }">
            <template v-if="row.desensitizedDrawingsName">
              <a-tooltip :title="t('common.clickView', [t('common.newDraw')])">
                <FileDoneOutlined class="table-a mr-5px" @click="handleDesensitizeList(row)" />
              </a-tooltip>
              <span class="table-a" @click="handlePreview(row)">{{ row.desensitizedDrawingsName }}</span>
            </template>
          </template>
          <template #action="{ rowIndex, row }">
            <TableAction :outside="true" :actions="getReviewActions(rowIndex)" />
          </template>
        </Grid>
      </div>
    </div>
    <DrawingDetailPop @reload="reload" @register="registerDrawingDetail" />
    <ExportModal @register="registerExportModal" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <Preview ref="filePreviewRef" />
    <DetailPopup @register="registerDetailPopup" />
    <FileListModal @register="registerFileList"></FileListModal>
  </div>
</template>
<script lang="ts" setup>
  import { ActionItem, BasicTable, FormProps, TableAction, useTable } from '/@/components/Table';
  import { getDrawingsReview } from '/@/api/engineering/reviewInquiry';
  import { columns } from '/@/views/engineering/drawing/reviewInquiry/CONFIG';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { cloneDeep } from 'lodash-es';
  import { exportDrawingsReviewUnreviewedList, exportExportExcelSearchPageList } from '/@/api/engineering/drawingReview';
  import { reactive, ref, toRefs } from 'vue';
  import { usePopup } from '/@/components/Popup';
  import DrawingDetailPop from '/@/views/engineering/drawing/drawingReview/components/drawingDetailPop.vue';
  import { useBaseStore } from '/@/store/modules/base';
  import { useModal } from '/@/components/Modal';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import { getNodeDetail } from '/@/api/engineering/ecn';
  import { NodeModal } from '/@/components/CustomComponents';
  import { useRoute } from 'vue-router';
  import { onMounted, computed, watch, nextTick } from 'vue';
  import { useProductCodeLifyCycleStore } from '/@/store/modules/productCodeLifeCycle';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { schemas } from './CONFIG';
  import DetailPopup from '../components/DetailPopup.vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { FileDoneOutlined } from '@ant-design/icons-vue';
  import { FileListModal } from '/@/components/Upload';
  import { fileDownload } from '/@/api/purchase/importMateria';
  import { getDrawingsHistory, getFileInfoHistory } from '/@/api/common/files';

  defineOptions({ name: 'engineering-drawing-reviewInquiry' });

  const filePreviewRef = ref<any | null>(null);
  const baseStore = useBaseStore();
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const [registerDrawingDetail, { openPopup: openDrawingDetail }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerDetailPopup, { openPopup: openDetailPopup }] = usePopup();
  const [registerFileList, { openModal: openFileList }] = useModal();

  // 定义每个列表项的类型（根据实际数据结构补充字段）
  interface IDictionaryItem {
    enCode: string;
    fullName: string;
    [key: string]: any;
  }

  interface IStateType {
    cacheList: any[];
    statusList: IDictionaryItem[];
    DFMList: IDictionaryItem[];
    MakeEngineeringInfoList: IDictionaryItem[];
    reviewResultList: IDictionaryItem[];
  }

  const state = reactive<IStateType>({
    cacheList: [],
    statusList: [],
    DFMList: [],
    MakeEngineeringInfoList: [],
    reviewResultList: [],
  });
  const { statusList, DFMList, MakeEngineeringInfoList, reviewResultList } = toRefs(state);
  const [registerForm, { getFieldsValue, setFieldsValue, setProps, validate, resetFields, updateSchema }] = useForm({
    baseColProps: { span: 4 },
    showActionButtonGroup: true,
    showAdvancedButton: true,
    showResetButton: true,
    showSubmitButton: true,
    autoSubmitOnEnter: true,
    autoAdvancedLine: 1,
    submitFunc: () => searchFn(),
    resetFunc: resetFn,
    labelWidth: 100,
    schemas,
    i18nConfig: {
      moduleCode: 'DrawingsReviewColumn',
      transferRange: ['placeholder'],
      en_US: {
        labelWidth: 150,
      },
    },
  });

  const [Grid, { getSelectRows, getSelectRowKeys, clearSelectedRowKeys, getFetchParams, reload, query }] = useVbenVxeGrid({
    gridOptions: {
      showIndexColumn: true,
      id: 'business-quota-list',
      columns,
      api: params => getDrawingsReview({ ...params, ...getFieldsValue() }),
      rowConfig: {
        keyField: 'Id',
      },
      afterFetch: data => {
        state.cacheList = data.list;
        getTypeOptions();
      },
      i18nConfig: {
        moduleCode: 'DrawingsReviewColumn',
      },
    },
  });

  function searchFn(): Promise<void> {
    return query();
  }
  function resetFn(): any {
    setTimeout(() => {
      searchFn();
    }, 300);
  }

  async function handleExport() {
    const exportColumns = cloneDeep(columns);
    openExportModal(true, {
      api: exportExportExcelSearchPageList,
      listQuery: {
        ...(await getFetchParams()),
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'DrawingsReviewColumn',
      },
    });
  }
  function handleNodeModal(record) {
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }
  function getReviewActions(index): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleApprove.bind(null, index),
        auth: 'btn_detail',
      },
    ];
  }

  function handleDesensitizeList(row) {
    openFileList(true, {
      id: row.desensitizedDrawingsId,
      keyFieldName: 'id',
      params: {
        current: true,
      },
      downloadApi: fileDownload,
      useQuery: true,
      usePath: true,
      useMerge: false,
      listApi: getFileInfoHistory,
    });
  }

  function handlePreview(record) {
    const params = {
      name: record.desensitizedDrawingsName,
      Id: record.desensitizedDrawingsId,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    filePreviewRef.value?.init(params);
  }

  function handleApprove(index) {
    const params = {};
    const rows = getSelectRowKeys();
    if (rows.length <= 0) {
      params.cacheList = state.cacheList;
    } else {
      params.cacheList = rows;
    }
    if (index == -1) {
      params.index = 0;
    } else {
      params.index = index;
    }
    params.sign = 'detail';

    if (params.cacheList.length === 0) return createMessage.warning('当前列表没有待处理图纸');
    // openDrawingDetail(true, params);
    openDetailPopup(true, params);
  }
  async function getTypeOptions() {
    state.statusList = (await baseStore.getDictionaryData('DrawingsReview.Status')) as IDictionaryItem[];
    state.DFMList = (await baseStore.getDictionaryData('DrawingsReview.DFM')) as IDictionaryItem[];
    state.MakeEngineeringInfoList = (await baseStore.getDictionaryData('DrawingsReview.MakeEngineeringInfo')) as IDictionaryItem[];
    state.reviewResultList = (await baseStore.getDictionaryData('DrawingsReview.ReviewResult')) as IDictionaryItem[];
  }

  // 成品编码生命周期跳转到当前页面的处理 开始
  const productCodeLifyCycleStore = useProductCodeLifyCycleStore();
  const routePath = useRoute().path;
  const productCodeLifyCycleParams = computed(() => productCodeLifyCycleStore.lifeCycleParamMap[routePath]);

  watch(productCodeLifyCycleParams, () => {
    productCodeLifyCycleParams.value && reloadByProductCodeLifyCycle();
  });

  function reloadByProductCodeLifyCycle() {
    setTimeout(() => {
      if (!productCodeLifyCycleParams.value) {
        return false;
      }
      const params = getFetchParams() || {};
      if (params.originCode === productCodeLifyCycleParams.value.applyCode && params.insidePartNumber === productCodeLifyCycleParams.value.insidePartNumber) {
        return false;
      }

      // 手动设置筛选条件并提交查询
      const searchInfo = { originCode: productCodeLifyCycleParams.value.applyCode, insidePartNumber: productCodeLifyCycleParams.value.insidePartNumber };
      setFieldsValue(searchInfo);
      ({
        searchInfo,
        page: 1,
      });
      // 清空存储的筛选条件
      productCodeLifyCycleStore.setLifeCycleParam(routePath, null);
    });
  }

  onMounted(async () => {
    await nextTick();
    productCodeLifyCycleParams.value ? reloadByProductCodeLifyCycle() : reload();
  });
  // 成品编码生命周期跳转到当前页面的处理 结束
</script>
