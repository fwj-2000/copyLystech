<template>
  <a-card class="portal-card-box">
    <template #title v-if="activeData.title">
      <CardHeader :title="activeData.title" :card="activeData.card" />
    </template>
    <div class="portal-card-body portal-card-todoList">
      <Grid>
        <template #billNumber="{ row }">
          <span class="table-a" @click="openDetailFn(row)" style="cursor: pointer">{{ row.billNumber ?? row.id }}</span>
        </template>
        <template #prevNodeCommitTime="{ row }">
          {{ row.prevNodeCommitTime ? dayjs(row.prevNodeCommitTime).tz().format('YYYY-MM-DD HH:mm:ss') : null }}
        </template>
        <!-- <template>
            <template v-if="column.dataIndex === 'prevNodeCommitTime'">
              {{ text?dayjs(text).tz().format('YYYY-MM-DD hh:mm:ss'):null }}
            </template>
            <template v-if="column.dataIndex === 'demandType'">
              {{ demandTypes.find(x=>x.enCode==text)?.fullName }}
            </template>
            <template v-if="column.dataIndex === 'status'">
              {{ text??"待处理"}}
            </template>
          </template> -->
      </Grid>
      <template v-if="list.length">
        <a class="item" v-for="(item, i) in list" :key="i">
          <span class="name com-hover" @click="goDetail(item)">{{ item.fullName }}</span>
          <span class="time">{{ dayjs(item.creatorTime).format('YYYY-MM-DD') }}</span>
        </a>
      </template>
      <div class="portal-common-noData" v-else>
        <lydc-empty />
      </div>
    </div>
  </a-card>
</template>
<script lang="ts" setup>
  import { ref, onMounted, reactive, toRefs } from 'vue';
  import CardHeader from '../CardHeader/index.vue';
  import { getFlowTodoList, getDiecutTodoList } from '/@/api/onlineDev/portal';
  import { useRouter } from 'vue-router';
  import { encryptByBase64 } from '/@/utils/cipher';
  import dayjs from 'dayjs';
  import qs from 'qs';
  import { useBaseStore } from '/@/store/modules/base';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();

  defineProps(['activeData']);
  const list = ref<any[]>([]);
  const router = useRouter();
  const baseStore = useBaseStore();
  interface StateType {
    demandTypes: any[];
  }

  const state = reactive<StateType>({
    demandTypes: [],
  });
  const { demandTypes } = toRefs(state);
  const columns = [
    {
      width: 130,
      title: '单号',
      i18nField: 'CommonCol.applyNo',
      field: 'billNumber', // "billNumber"
      // sortable: true,
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
      slots: { default: 'billNumber' },
    },
    {
      width: 120,
      title: '当前节点',
      field: 'currentNodeName',
      i18nField: 'currentNode',
    },
    {
      width: 120,
      title: '需求类型',
      field: 'demandType',
    },
    {
      title: '料号',
      field: 'partNumber',
      filters: [{ data: '' }],
      filterRender: {
        name: 'Input',
      },
      width: 180,
    },
    // {
    //   width: 120,
    //   title: '状态',
    //   dataIndex: 'status',
    // },
    {
      width: 125,
      title: '上一节点处理人',
      field: 'prevNodeHandlerNames',
    },
    {
      width: 140,
      title: '上一节点提交时间',
      field: 'prevNodeCommitTime',
      slots: { default: 'prevNodeCommitTime' },
    },
  ];
  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    formOptions: {
      showDefaultActions: false,
      // collapsed: true,
      // showCollapseButton: true,
      // // 是否在字段值改变时提交表单
      // submitOnChange: false,
      // // 按下回车时是否提交表单
      // submitOnEnter: true,
      // // fieldMappingTime: [['date', ['start', 'end']]],
      // commonConfig: {
      //   componentProps: {},
      //   labelClass: 'w-0',
      // },
      // wrapperClass: 'grid grid-cols-6 gap-4',
      schema: [],
    },
    gridOptions: {
      columns: columns,
      api: getDiecutTodoList,
      toolbarConfig: { enabled: false },
      i18nConfig: {
        moduleCode: 'CommonCol',
      },
      // showIndexColumn: false, //显示序号
      // showTableSetting: false,
    },
  });
  // const { reload } = gridApi;
  // const [registerTable, { getSelectRows, getRowSelection, getSelectRowKeys, clearSelectedRowKeys, reload, getFetchParams, getDataSource }] = useTable({
  //   api: getDiecutTodoList,
  //   title: '',
  //   columns:
  //   maxHeight:200,
  //   rowKey: 'id',
  //   size: "small",
  //   canResize: true,
  //   striped: true,
  //   useSearchForm: false, //使用搜索表单
  //   // bordered: true, //显示表格边框
  //   showIndexColumn: false, //显示序号
  //   showTableSetting: false,
  //   // isTreeTable: true,
  //   // defaultExpandAllRows: true,
  //   pagination: {
  //     pageSize: 30,
  //     size: 'small',
  //   },
  //   // rowSelection: {
  //   //   type: 'checkbox',
  //   //   onChange: (a, b) => {
  //   //   },
  //   // },
  //   // actionColumn: {
  //   //   width: pageTurnConfig.bizType == '3' ? 100 : 60,
  //   //   title: '操作',
  //   //   dataIndex: 'action', //字段
  //   //   fixed: 'right', //显示在右边
  //   // },
  // });
  function openDetailFn(item) {
    if (!item.url) return message.warning(t('sys.notUrlTip'));
    let url =
      item.url +
      (item.url.includes('?') ? '&' : '?') +
      qs.stringify({ id: item.id, billNo: item.billNumber, partNumber: item.partNumber, demandType: item.demandTypeCode });
    router.push(url);

    // let bodyText = item.bodyText ? JSON.parse(item.bodyText) : {};
    // console.log(bodyText, 'bodyText');//{jumpLink: '/engineering/drawing/engineeringReview', isExternalLink: false, linkParamDic: {}}

    // const url = bodyText.jumpLink + '?' + qs.stringify(bodyText.linkParamDic);
    // if (bodyText.isExternalLink) {
    //   window.location.href = url;
    // } else {
    //   router.push(url);
    // }
  }
  async function initData() {
    state.demandTypes = (await baseStore.getDictionaryData('DemandTypeEnum')) as any[];
    console.log(state.demandTypes);
    // getFlowTodoList().then(res => {
    //   list.value = res.data?.list?.length ? res.data.list.slice(0, 7) : [];
    // });
  }
  function goDetail(item) {
    let config = JSON.stringify(item);
    router.push('/workFlowDetail?config=' + encodeURIComponent(encryptByBase64(config)));
  }

  onMounted(() => initData());
</script>
<style lang="css" scoped>
  .ant-table-wrapper {
    padding: 0 1px !important;
  }

  .portal-card-body :deep(.p-2) {
    padding: 0.1rem;
  }
</style>
