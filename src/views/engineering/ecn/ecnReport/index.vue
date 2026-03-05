<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getFormConfig, waitGetColumns } from '/@/views/engineering/ecn/ecnReport/config';
  import { getEcnReport, getNodeDetail } from '/@/api/engineering/ecn';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { NodeModal } from '/@/components/CustomComponents';
  import { TableAction } from '/@/components/Table';
  import InitChangeDetailPopup from '../initChnage/DetailPopup.vue';
  import ProjectInitChangeDetailPopup from '../projectInitChnage/DetailPopup.vue';
  import MaterialHandingDetailPopup from '../materialHanding/components/DetailPopup.vue';
  import SignReviewDetailPopup from '../signReview/components/DetailPopup.vue';
  import ProjectSignReviewDetailPopup from '../projectSignReview/components/DetailPopup.vue';
  import ReviewReleaseDetailPopup from '../ReviewRelease/components/DetailPopup.vue';
  import PigeonholeDetailPopup from '../pigeonhole/components/DetailPopup.vue';
  // import ECRDetailPopup from '../ecr/components/DetailPopup.vue'
  import projectECRDetailPopup from '../projectecr/components/DetailPopup.vue';
  import { useRoute } from 'vue-router';
  import { onMounted, computed, watch, nextTick } from 'vue';
  import { useProductCodeLifyCycleStore } from '/@/store/modules/productCodeLifeCycle';
  import { usePopup } from '/@/components/Popup';
  import { useBaseStore } from '/@/store/modules/base';
  import { cloneDeep } from 'lodash-es';
  defineOptions({
    name: 'engineering-ecn-ecnReport',
  });

  const { t } = useI18n();
  const baseStore = useBaseStore();

  const [registerNodeModal, { openModal: openNodeModal }] = useModal();

  // initChange 详情
  const [initChangeRegisterDetail, { openPopup: initChangeOpenDetail }] = usePopup();
  // projectInitChange详情
  const [projectInitChangeDetailPopup, { openPopup: projectInitChangeOpenDetail }] = usePopup();
  // materialHanding 详情
  const [materialHandingRegisterDetail, { openPopup: materialHandingOpenDetail }] = usePopup();
  // signReview 详情
  const [signReviewDetailPopup, { openPopup: signReviewOpenDetail }] = usePopup();
  // projectSignReview 详情
  const [projectSignReviewDetailPopup, { openPopup: projectSignReviewOpenDetail }] = usePopup();
  // reviewRelease 详情
  const [reviewReleaseDetailPopup, { openPopup: reviewReleaseOpenDetail }] = usePopup();
  // pigeonhole 详情
  const [pigeonholeDetailPopup, { openPopup: pigeonholeOpenDetail }] = usePopup();
  // ECR申请 详情
  // const [ecrDetailPopup, { openPopup: ecrDetailPopupOpenDetail }] = usePopup();
  // ECR审核 详情
  const [projectEcrDetailPopup, { openPopup: projectECRDetailPopupOpenDetail }] = usePopup();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: getFormConfig(),
    gridOptions: {
      id: 'engineering-ecn-ecnReport-list',
      columns: waitGetColumns(),
      api: getTableData,
      // scrollX: {
      //   gt: 10,
      //   enabled: true,
      // },
      showIndexColumn: true,
      // @ts-ignore
      proxyConfig: {
        autoLoad: false,
      },
      i18nConfig: {
        moduleCode: 'ECNColumn',
      },
    },
  });

  const { reloadData, setLoading, getFromValue } = gridApi;

  async function getTableData({ currentPage = 1, pageSize = 10, insidePartNumber = '' }) {
    return getEcnReport({
      pageSize,
      currentPage,
      insidePartNumber,
      ...(await getFromValue()),
    }).then(async ({ data }) => {
      console.log('🚀 ~  ~ data: ', data);
      // console.log(formatOps())
      // return
      const [source, level, docType] = await Promise.all(formatOps());
      const { list } = data;
      // 将list.list数据展开处理，--> 节点Code.列名
      const formatList = list.map(item => {
        console.log('🚀 ~  ~ originitem: ', item);
        const target = { ...formatItem(cloneDeep(item), source, level, docType) };
        // const target = { ...item };
        item?.ecrList?.forEach(item => {
          target[`${item.node}.status`] = item.status;
          target[`${item.node}.duration`] = item.duration;
          target[`${item.node}.endTime`] = item.endTime;
          target[`${item.node}.handlerName`] = item.handlerName;
        });
        item?.list?.forEach(item => {
          target[`${item.node}.status`] = item.status;
          target[`${item.node}.duration`] = item.duration;
          target[`${item.node}.endTime`] = item.endTime;
          target[`${item.node}.handlerName`] = item.handlerName;
        });
        delete target.ecrList;
        delete target.list;
        return target;
      });
      console.log(formatList, '11111111111111111');
      setLoading(false);
      return {
        data: {
          list: formatList,
          pagination: {
            total: data.pagination.total,
            pageSize: data.pagination.pageSize,
            currentPage: data.pagination.currentPage,
          },
        },
      };
    });
  }

  function formatOps() {
    const source = baseStore.getDictionaryData('ECN.ChangeSource');
    const level = baseStore.getDictionaryData('ECN.ChangeLevel');
    const docType = baseStore.getDictionaryData('EngineeringDocApply.DocType', true);
    return [source, level, docType];
  }

  function formatItem(item, source, level, docType) {
    const changeSource = item.changeSource;
    const changeLevel = item.changeLevel;
    const documentType = item.documentType;

    item.changeSource = source.find(val => val.enCode == changeSource)?.fullName;
    item.changeLevel = level.find(val => val.enCode == changeLevel)?.fullName;
    item.documentType = docType.find(val => val.enCode == documentType)?.fullName;

    return item;
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

  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        // auth: 'btn_detail',
        tooltip: t('sys.errorLog.tableActionDesc'),
        onClick: handleDetail.bind(null, row),
      },
    ];
  }

  function handleDetail(currentNode, row) {
    // console.log(row);
    // const { currentNode } = row;
    console.log('🚀 ~ handleDetail ~ currentNode: ', currentNode);
    if (currentNode === 'ECRApplyNode' || currentNode === 'ECREngineeringReview') {
      // ECN审核
      projectECRDetailPopupOpenDetail(true, {
        cacheList: [
          {
            ...row,
            id: row.ecrId,
          },
        ],
        index: 0,
        mode: 'view',
      });
    } else if (currentNode === 'Leader' || currentNode === 'ApplyNode') {
      // ECN审核
      initChangeOpenDetail(true, {
        cacheList: [
          {
            ...row,
            origin: 'ECN',
            id: row.ecnId,
          },
        ],
        index: 0,
        mode: 'view',
      });
    } else if (currentNode === 'PMC' || currentNode === 'MaterialHandle') {
      // PMC物料处理
      materialHandingOpenDetail(true, {
        cacheList: [
          {
            ...row,
            id: row.ecnId,
          },
        ],
        index: 0,
        mode: 'view',
      });
    } else if (currentNode === 'Countersign') {
      // 各部门会签
      signReviewOpenDetail(true, {
        cacheList: [
          {
            ...row,
            id: row.ecnId,
          },
        ],
        index: 0,
        mode: 'view',
      });
    } else if (currentNode === 'FinalHandle') {
      // 最终处理建议
      projectSignReviewOpenDetail(true, {
        cacheList: [
          {
            ...row,
            id: row.ecnId,
          },
        ],
        index: 0,
        mode: 'view',
      });
    } else if (currentNode === 'Manager' || currentNode === 'QAManager' || currentNode === 'OperationManager') {
      // 审核发布
      reviewReleaseOpenDetail(true, {
        cacheList: [
          {
            ...row,
            id: row.ecnId,
          },
        ],
        index: 0,
        mode: 'view',
      });
    } else if (currentNode === 'ExecuteConfirm' || currentNode === 'End') {
      // 归档
      pigeonholeOpenDetail(true, {
        cacheList: [
          {
            ...row,
            id: row.ecnId,
          },
        ],
        index: 0,
        mode: 'view',
      });
    }
  }

  // 成品编码生命周期跳转到当前页面的处理 开始
  const productCodeLifyCycleStore = useProductCodeLifyCycleStore();
  const routePath = useRoute().path;
  const productCodeLifyCycleParams = computed(() => productCodeLifyCycleStore.lifeCycleParamMap[routePath]);

  watch(productCodeLifyCycleParams, () => {
    productCodeLifyCycleParams.value && reloadByProductCodeLifyCycle();
  });

  function reloadByProductCodeLifyCycle() {
    setTimeout(async () => {
      if (!productCodeLifyCycleParams.value) {
        return false;
      }
      const params = await gridApi.getFetchParams();
      if (params.applyCode === productCodeLifyCycleParams.value.applyCode) {
        return false;
      }

      // 手动设置筛选条件并提交查询
      const { pager } = gridApi.grid.getProxyInfo() || {};
      if (pager) {
        pager.currentPage = 1;
      }
      gridApi.formApi.setFieldValue('ecnNumber', productCodeLifyCycleParams.value.applyCode);
      gridApi.formApi.submitForm();
      // 清空存储的筛选条件
      productCodeLifyCycleStore.setLifeCycleParam(routePath, null);
    });
  }

  onMounted(async () => {
    await nextTick();
    productCodeLifyCycleParams.value ? reloadByProductCodeLifyCycle() : gridApi.grid.commitProxy('query');
  });
  // 成品编码生命周期跳转到当前页面的处理 结束
</script>

<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #ECRApplyNode="{ row }">
            <span v-if="row['ECRApplyNode.status'] === 3" class="table-a" @dblclick="() => handleDetail('ECRApplyNode', row)">{{
              t('common.detailText')
            }}</span>
          </template>
          <template #ECREngineeringReview="{ row }">
            <span v-if="row['ECREngineeringReview.status'] === 3" class="table-a" @dblclick="() => handleDetail('ECREngineeringReview', row)">{{
              t('common.detailText')
            }}</span>
          </template>
          <template #ApplyNode="{ row }">
            <span v-if="row['ApplyNode.status'] === 3" class="table-a" @dblclick="() => handleDetail('ApplyNode', row)">{{ t('common.detailText') }}</span>
          </template>
          <template #Leader="{ row }">
            <span v-if="row['Leader.status'] === 3" class="table-a" @dblclick="() => handleDetail('Leader', row)">{{ t('common.detailText') }}</span>
          </template>
          <template #PMC="{ row }">
            <span v-if="row['PMC.status'] === 3" class="table-a" @dblclick="() => handleDetail('PMC', row)">{{ t('common.detailText') }}</span>
          </template>
          <template #MaterialHandle="{ row }">
            <span v-if="row['MaterialHandle.status'] === 3" class="table-a" @dblclick="() => handleDetail('MaterialHandle', row)">{{
              t('common.detailText')
            }}</span>
          </template>
          <template #Countersign="{ row }">
            <span v-if="row['Countersign.status'] === 3" class="table-a" @dblclick="() => handleDetail('Countersign', row)">{{ t('common.detailText') }}</span>
          </template>
          <template #FinalHandle="{ row }">
            <span v-if="row['FinalHandle.status'] === 3" class="table-a" @dblclick="() => handleDetail('FinalHandle', row)">{{ t('common.detailText') }}</span>
          </template>
          <template #Manager="{ row }">
            <span v-if="row['Manager.status'] === 3" class="table-a" @dblclick="() => handleDetail('Manager', row)">{{ t('common.detailText') }}</span>
          </template>
          <template #QAManager="{ row }">
            <span v-if="row['QAManager.status'] === 3" class="table-a" @dblclick="() => handleDetail('QAManager', row)">{{ t('common.detailText') }}</span>
          </template>
          <template #OperationManager="{ row }">
            <span v-if="row['OperationManager.status'] === 3" class="table-a" @dblclick="() => handleDetail('OperationManager', row)">{{
              t('common.detailText')
            }}</span>
          </template>
          <template #ExecuteConfirm="{ row }">
            <span v-if="row['ExecuteConfirm.status'] === 3" class="table-a" @dblclick="() => handleDetail('ExecuteConfirm', row)">{{
              t('common.detailText')
            }}</span>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <NodeModal @register="registerNodeModal" />
    <InitChangeDetailPopup @register="initChangeRegisterDetail" @reload="reloadData" />
    <ProjectInitChangeDetailPopup @register="projectInitChangeDetailPopup" @reload="reloadData" />
    <MaterialHandingDetailPopup @register="materialHandingRegisterDetail" @reload="reloadData" />
    <SignReviewDetailPopup @register="signReviewDetailPopup" @reload="reloadData" />
    <ProjectSignReviewDetailPopup @register="projectSignReviewDetailPopup" @reload="reloadData" />
    <ReviewReleaseDetailPopup @register="reviewReleaseDetailPopup" @reload="reloadData" />
    <PigeonholeDetailPopup @register="pigeonholeDetailPopup" @reload="reloadData" />
    <projectECRDetailPopup @register="projectEcrDetailPopup" @reload="reloadData" />
  </div>
</template>
