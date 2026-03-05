<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :cancelText="t('common.closeText')"
    @close="handleClose"
    :title="title"
    class="full-popup workorder-detail-popup">
    <ScrollContainer>
      <div class="card">
        <Subtitle :title="t('common.BasicInformation')" />
        <div>
          <div v-for="(item, index) in state.activeFormSchemas" :key="index" class="inline-block mb-16px" :class="item.field == 'remark' ? 'w-3/4' : 'w-1/4'">
            <span class="form-label">{{ item.label }}:</span>
            <span class="form-text ml-10px">{{ formatDetailValue(item) }}</span>
          </div>
        </div>
      </div>
      <div class="card pb-26px">
        <Subtitle :title="state.relTitle" />
        <div v-if="state.dataDetail.relWorkOrderDetail">
          <div v-for="(item, index) in state.activeFormSchemas" :key="index" class="inline-block mb-16px" :class="item.field == 'remark' ? 'w-3/4' : 'w-1/4'">
            <span class="form-label">{{ item.label }}:</span>
            <span class="form-text ml-10px">{{ formatRelDetailValue(item) }}</span>
          </div>
        </div>
        <div>{{ t('common.noData') }}~</div>
      </div>
    </ScrollContainer>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, onMounted, computed, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { ScrollContainer } from '/@/components/Container';
  import { getWorkOrderDetail } from '/@/api/productionDeal/workOrder';
  import dayjs from 'dayjs';
  import Subtitle from './subtitle.vue';

  defineOptions({ name: 'extend-formDemo-verifyForm' });

  const { t } = useI18n();

  const emits = defineEmits(['register', 'reload']);

  const state = reactive({
    id: '',
    relTitle: '关联工单详情',
    title: '',
    isDevPlatform: false,
    dataDetail: {
      relWorkOrderDetail: {},
    },
    btnLoading: false,
    activeFormSchemas: [] as any,
  });
  const { title } = toRefs(state);

  const [registerPopup] = usePopupInner(init);

  const newFormSchemas = [
    {
      field: 'mouldNo',
      label: '模具编码',
      labelWidth: 100,
    },
    {
      field: 'workOrderTypeDesc',
      label: '工单类型',
      labelWidth: 100,
    },
    {
      field: 'workOrderDate',
      label: '工单日期',
      labelWidth: 100,
    },
    {
      field: 'productCode',
      label: '内部料号',
      labelWidth: 100,
    },
    {
      field: 'difficultyLevelName',
      label: '难度',
      labelWidth: 100,
    },
    {
      field: 'deliveryTime',
      label: '交期',
      labelWidth: 100,
    },
    {
      field: 'personnelName',
      label: '人员',
      labelWidth: 100,
    },
    {
      field: 'factoryArea',
      label: '厂区',
      labelWidth: 100,
    },
    {
      field: 'creatorUserName',
      label: '创建人',
      labelWidth: 100,
    },
    {
      field: 'creatorTime',
      label: '创建时间',
      labelWidth: 100,
    },
    {
      field: 'lastModifyUserName',
      label: '修改人',
      labelWidth: 100,
    },
    {
      field: 'lastModifyTime',
      label: '修改时间',
      labelWidth: 100,
    },
    {
      field: 'remark',
      label: '备注',
      labelWidth: 100,
    },
  ];
  const formSchemas = [
    {
      field: 'workOrderNo',
      label: '工单号',
      labelWidth: 100,
    },
    {
      field: 'dataSourcesDesc',
      label: '数据来源',
      labelWidth: 100,
    },
    {
      field: 'workOrderTypeDesc',
      label: '工单类型',
      labelWidth: 100,
    },
    {
      field: 'bomTypeDesc',
      label: 'BOM类型',
      labelWidth: 100,
    },
    {
      field: 'workOrderDate',
      label: '工单日期',
      labelWidth: 100,
    },
    {
      field: 'relationWorkOrderNo',
      label: '关联工单',
      labelWidth: 100,
    },
    {
      field: 'processRouteTypeDesc',
      label: '工艺路线优先类型',
      labelWidth: 100,
    },
    {
      field: 'productCode',
      label: '内部料号',
      labelWidth: 100,
    },
    {
      field: 'quantity',
      label: '数量',
      labelWidth: 100,
    },
    {
      field: 'produceWorkshopCode',
      label: '生产车间编码',
      labelWidth: 100,
    },
    {
      field: 'difficultyLevelName',
      label: '难度',
      labelWidth: 100,
    },
    {
      field: 'pccDieCutEfficiency',
      label: 'PCC模切效率(K/H)',
      labelWidth: 100,
    },
    {
      field: 'pccManualEfficiency',
      label: 'PCC手工效率(K/H)',
      labelWidth: 100,
    },
    {
      field: 'bOrderTypeDesc',
      label: 'B/非B工单',
      labelWidth: 100,
    },
    {
      field: 'creatorUserName',
      label: '创建人',
      labelWidth: 100,
    },
    {
      field: 'creatorTime',
      label: '创建时间',
      labelWidth: 100,
    },
    {
      field: 'lastModifyUserName',
      label: '修改人',
      labelWidth: 100,
    },
    {
      field: 'lastModifyTime',
      label: '修改时间',
      labelWidth: 100,
    },
    {
      field: 'remark',
      label: '备注',
      labelWidth: 100,
    },
  ];

  function getDetail() {
    getWorkOrderDetail(state.id).then(res => {
      state.dataDetail = res?.data;
      const relationWorkOrderNo = res?.data?.relationWorkOrderNo || '';
      state.relTitle = '关联工单' + relationWorkOrderNo + t('common.detailText');
    });
  }

  function init(data) {
    console.log(data);
    const { workOrderType, id, title, isDevPlatform } = data;
    state.id = id;
    state.title = title + '工单详情';
    state.isDevPlatform = isDevPlatform;
    console.log(workOrderType, 'workOrderType');
    state.activeFormSchemas = [3, 4].includes(workOrderType) ? newFormSchemas : formSchemas;
    console.log(state.activeFormSchemas);
    // newFormSchemas
    getDetail();
  }
  function formatDetailValue(item) {
    if (state.dataDetail) {
      const val = state.dataDetail[item.field] || '';
      const formatDateArr = ['creatorTime', 'lastModifyTime', 'deliveryTime'];
      if (formatDateArr.includes(item.field) && val) return dayjs(val).format('YYYY-MM-DD');
      if (item.field == 'workOrderDate' && val) return dayjs(val).format('YYYY-MM-DD');
      return val;
    } else {
      return '';
    }
  }
  function formatRelDetailValue(item) {
    if (state.dataDetail.relWorkOrderDetail) {
      const val = state.dataDetail.relWorkOrderDetail[item.field] || '';
      const formatDateArr = ['creatorTime', 'lastModifyTime', 'deliveryTime'];
      if (formatDateArr.includes(item.field) && val) return dayjs(val).format('YYYY-MM-DD');
      if (item.field == 'workOrderDate' && val) return dayjs(val).format('YYYY-MM-DD');
      return val;
    } else {
      return '';
    }
  }
  function handleClose() {
    emits('reload');
  }
  onMounted(() => {});
</script>

<style lang="less" scoped>
  .workorder-detail-popup {
    :deep(.lydc-basic-form .ant-form-item:not(.ant-form-item-with-help)) {
      margin-bottom: 12px;
    }

    .card {
      padding: 0 24px;
      background: #fff;
      margin-top: 16px;

      .form-label {
        color: #999;

        /* 中文/正文14 */

        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
      }

      .form-text {
        // height: 22px;
        padding: 4px;
        align-items: center;
        gap: 8px;
        align-self: stretch;
        overflow: hidden;
        color: #1a1a1a;
        text-overflow: ellipsis;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
        height: 30px; /* 157.143% */
      }
    }
  }
</style>
