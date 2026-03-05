<!-- 人员出勤明细 -->
<template>
  <a-card class="common-content-wrapper">
    <!-- 表单筛选条件 -->
    <a-form ref="formRef" class="search-wrapper flex ct-between" :model="searchFormValue">
      <div class="flex ct-start">
        <a-form-item name="date">
          <a-date-picker v-model:value="searchFormValue.queryTime" :allow-clear="false"></a-date-picker>
        </a-form-item>
        <a-form-item name="groupName">
          <div class="flex">
            <div class="flex px-6px" style="height: 32px; color: #1a1a1a; background-color: #e6e6e6">
              档案分组
              <a-popover placement="right">
                <template #content>
                  <div>档案分组筛选优先级高于组织层级</div>
                </template>
                <img :src="vectorSvg" style="margin: 0 0 1px 4px" />
              </a-popover>
            </div>
            <a-select style="width: 104px; text-align: left" v-model:value="searchFormValue.groupName">
              <a-select-option value="">全部</a-select-option>
              <a-select-option v-for="(item, idx) in docOptions" :key="idx" :value="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </div>
        </a-form-item>
        <a-form-item name="orgCode">
          <a-select style="width: 184px; text-align: left" v-model:value="searchFormValue.orgCode">
            <a-select-option v-for="(item, idx) in ORG_CODE_OPTIONS" :key="idx" :value="item.value"> {{ item?.label || item.value }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="type">
          <a-select style="width: 84px; text-align: left" v-model:value="searchFormValue.type">
            <a-select-option v-for="(item, idx) in TYPE_OPTIONS" :key="idx" :value="item.value"> {{ item?.label || item.value }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="status">
          <a-select style="width: 84px; text-align: left" v-model:value="searchFormValue.status">
            <a-select-option v-for="(item, idx) in PERSONNEL_DETAIL_STATUS_OPTIONS" :key="idx" :value="item.value">
              {{ item?.label || item.value }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-input v-model:value="keyword" placeholder="请输入工号或者姓名" />
        </a-form-item>
        <a-form-item>
          <a-input v-model:value="searchFormValue.dept" placeholder="请输入部门" />
        </a-form-item>
        <a-form-item>
          <a-input v-model:value="searchFormValue.postnamemh" placeholder="请输入岗位" />
        </a-form-item>
        <a-button type="primary" @click="handleSearch">搜索</a-button>
      </div>
      <a-button type="primary" :loading="exportLoading" ghost @click="exportToExcel">下载明细</a-button>
    </a-form>
    <!-- 分布图表 -->
    <div class="chart-container mb-16px flex">
      <!-- 人员分布图表 -->
      <div class="left-chart-container flex gap-12px" :class="{ full: !isShowPie }" style="height: 100%">
        <div class="w-[50%] h-[100%]">
          <PostDistributionChart
            v-model:value="searchFormValue.posclan"
            @update:value="handlePosclanUpdate"
            class="chart-wrapper"
            groupName="By族群分布"
            :info="posclanList">
          </PostDistributionChart>
        </div>
        <div class="w-[50%] h-[100%]">
          <PostDistributionChart
            v-model:value="searchFormValue.postname"
            @update:value="handlePostnameUpdate"
            class="chart-wrapper"
            groupName="By岗位人数分布"
            :info="groupList">
          </PostDistributionChart>
        </div>
      </div>
      <!-- 模切工等级分布 -->
      <div v-if="isShowPie" class="right-chart-container" style="height: 100%">
        <GradeDistributionChart
          class="chart-wrapper"
          :info="state.pielist"
          v-model:postname="searchFormValue.skillLevel"
          @update:skillLevel="handleSkillLevelUpdate" />
      </div>
    </div>
    <!-- 数据列表 -->
    <div class="table-container relative flex gap-12px items-start h-[100%] h-[274px]">
      <!-- 考勤总结 -->
      <div class="w-[226px] h-[100%]">
        <div class="absolute top-0 left-0 w-[226px] h-[100%] warm-box p-[12px]">
          <p>出勤总结</p>
          <div class="summary-list">
            <div
              :class="['item w-[100%] p-6px flex justify-start items-start text-hover', `${idx + 1}` === `${searchFormValue.noBrush}` ? 'select' : '']"
              v-for="(item, idx) in summaryList"
              :key="idx"
              @click="handleNoBrushUpdate(idx + 1)">
              <div class="h-[15px] flex center mr-[6px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 12 14" fill="none">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0.0244141 5.92045C0.0244141 3.18111 2.24507 0.960449 4.98441 0.960449C5.33788 0.960449 5.62441 1.24699 5.62441 1.60045C5.62441 1.95391 5.33788 2.24045 4.98441 2.24045C2.952 2.24045 1.30441 3.88803 1.30441 5.92045C1.30441 7.56564 2.26625 9.21986 3.32154 10.5214C3.83935 11.16 4.35871 11.6882 4.74885 12.0567C4.83423 12.1373 4.91321 12.2101 4.98441 12.2745C5.00469 12.2562 5.02561 12.2371 5.04713 12.2174C5.33802 11.951 5.73659 11.5647 6.16385 11.0879C7.0275 10.1242 7.96776 8.83579 8.40936 7.45366C8.51693 7.11697 8.87709 6.93123 9.21378 7.03881C9.55047 7.14639 9.73621 7.50654 9.62863 7.84323C9.10692 9.47609 8.02989 10.9236 7.11707 11.9422C6.65611 12.4566 6.22665 12.8729 5.91158 13.1614C5.75385 13.3059 5.62426 13.4188 5.53306 13.4964C5.48744 13.5352 5.45138 13.5652 5.42616 13.586L5.3966 13.6102L5.3882 13.617L5.38565 13.6191L5.38479 13.6197L5.38447 13.62C5.38434 13.6201 5.38422 13.6202 4.98441 13.1204C4.58461 13.6202 4.58446 13.6201 4.5843 13.62L4.58389 13.6196L4.58279 13.6187L4.57939 13.616L4.568 13.6068L4.52747 13.5735C4.49284 13.5448 4.44329 13.5031 4.38095 13.4494C4.25633 13.342 4.0803 13.1859 3.86997 12.9872C3.45012 12.5907 2.88948 12.0209 2.32729 11.3275C1.22257 9.96504 0.0244141 8.01926 0.0244141 5.92045ZM4.98441 13.1204L4.58461 13.6202C4.81835 13.8072 5.15048 13.8072 5.38422 13.6202L4.98441 13.1204Z"
                    fill="#1A1A1A"
                    fill-opacity="0.7" />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.85355 3.70707C8.04882 3.51181 8.04882 3.19522 7.85355 2.99996C7.65829 2.8047 7.34171 2.8047 7.14645 2.99996L5.92676 4.21965L4.70707 2.99996C4.51181 2.8047 4.19522 2.8047 3.99996 2.99996C3.8047 3.19522 3.8047 3.51181 3.99996 3.70707L5.21965 4.92676L3.99996 6.14645C3.8047 6.34171 3.8047 6.65829 3.99996 6.85355C4.19522 7.04882 4.51181 7.04882 4.70707 6.85355L5.92676 5.63386L7.14645 6.85355C7.34171 7.04882 7.65829 7.04882 7.85355 6.85355C8.04882 6.65829 8.04882 6.34171 7.85355 6.14645L6.63386 4.92676L7.85355 3.70707Z"
                    fill="#5F5E5E" />
                </svg>
              </div>
              <div class="flex flex-col items-start justify-evenly w-[100%] h-[100%]">
                <p class="text-[15px] text-[rgba(26,26,26,0.7)]"> {{ item?.Detail }}: </p>
                <div class="w-[90%]" style="text-align: right">
                  <span class="text-[#FF4D4F] text-[15px] font-bold">{{ item?.Num }}</span>
                  <span class="mr-12px text-[13px]">人</span>
                  <span class="text-[#FF4D4F] text-[15px] font-bold">{{ item?.Proportion }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-[calc(100%-226px)] h-[100%] warm-box min-h-[274px]">
        <BasicTable v-if="!isEmpty(ORG_CODE_OPTIONS)" class="table-wrapper" @register="registerTable"></BasicTable>
      </div>
    </div>
    <!-- end -->
  </a-card>
</template>

<script lang="ts" setup>
  import { isEmpty } from 'lodash-es';
  import { ref, Ref, reactive, computed, watch, unref } from 'vue';
  import dayjs from 'dayjs';
  import { useRoute } from 'vue-router';
  import { useDebounceFn } from '@vueuse/core';
  import { BasicTable, BasicColumn, useTable, PaginationProps } from '/@/components/Table';
  import { getAttendanceDetails, getOrganization, getOrganizationDoc } from '/@/api/dashbord/operate';
  import { downloadAttendanceDetails } from '/@/api/dashbord/report';
  import { saveTableDatasToExcel } from '/@/utils/file/download';
  import { PERSONNEL_DETAIL_STATUS_OPTIONS } from '/@/views/dashboard/operate/config';

  import { IOptions } from '/@/views/dashboard/operate/types';

  import PostDistributionChart from './PostDistributionChart/index.vue';
  import GradeDistributionChart from './GradeDistributionChart/index.vue';
  import vectorSvg from '/@/assets/svg/report/vector_primary.svg';

  defineOptions({ name: 'dashboard-operate-attendanceRate-personnelDetail' });

  const route = useRoute();

  // 类型下拉选项配置
  const TYPE_OPTIONS: IOptions[] = [
    { label: '全部', value: '' },
    { value: 'DL' },
    { value: 'DL1' },
    { value: 'DL2' },
    { value: 'IDL' },
    { value: 'IDL1' },
    { value: 'IDL2' },
    { value: 'IDL3' },
    { value: '正式工' },
    { value: '临时工' },
    { value: '派遣工' },
    { value: '手工' },
    { value: '模切' },
    { value: '职员' },
  ];

  // 下载明细加载
  const exportLoading = ref(false);
  const isShowPie = ref(false);

  const ORG_CODE_OPTIONS = ref<IOptions[]>([]);

  const { query: routeQuery } = route;
  const routeDate = dayjs((routeQuery?.date as string) || new Date());
  const routeType = (routeQuery?.type as string) || '';
  const searchFormValue = reactive({
    queryTime: routeDate,
    type: routeType,
    status: (routeQuery.status || '2') as string,
    orgCode: (routeQuery.orgCode || '') as string,
    postname: '',
    skillLevel: '',
    groupName: '',
    posclan: '',
    noBrush: '',
  });

  const keyword = ref('');
  const groupList = ref([]);
  const posclanList = ref([]);
  const summaryList: Ref<any[]> = ref([]);
  const state = reactive({
    pielist: [],
  });

  const paginationInfo: Ref<PaginationProps> = ref({
    current: 1,
    pageSize: 100,
    total: 0,
    pageSizeOptions: ['100', '500', '1000'],
  });

  const docOptions = ref([]);

  getOrganizationDoc({}).then(res => {
    docOptions.value = res.data.list || [];
  });

  const columns: BasicColumn[] = [
    { width: 124, title: '工号', dataIndex: 'WorkNo', fixed: 'left' },
    { width: 74, title: '姓名', dataIndex: 'CName', fixed: 'left' },
    {
      width: 84,
      title: '是否出勤',
      fixed: 'left',
      dataIndex: 'IsOnduty',
    },
    {
      title: '上班卡',
      dataIndex: 'BrushTime1',
      customRender: ({ record }) => {
        return record.BrushTime1 ? '◯' : '✕';
      },
      customCell: record => {
        return {
          style: {
            'font-size': '18px',
            'font-weight': 'bold',
            color: record.BrushTime1 ? '#94e197' : '#ff4d4f !important',
          },
        };
      },
    },
    {
      title: '下班卡',
      dataIndex: 'BrushTime2',
      customRender: ({ record }) => {
        return record.BrushTime2 ? '◯' : '✕';
      },
      customCell: record => {
        return {
          style: {
            'font-size': '18px',
            'font-weight': 'bold',
            color: record.BrushTime2 ? '#94e197 !important' : '#ff4d4f !important',
          },
        };
      },
    },
    { width: 54, title: '班别', dataIndex: 'BCType' },
    { title: '厂区', dataIndex: 'Factory' },
    {
      title: '部门',
      dataIndex: 'Dept6',
      customRender: ({ record }) => {
        const list = [
          ...(record.Dept5 !== record.Factory ? [record.Dept5] : []),
          ...(record.Dept6 ? [record.Dept6] : []),
          ...(record.Dept7 ? [record.Dept7] : []),
        ];
        return list.join('-');
      },
    },
    { title: '族群', dataIndex: 'PosclanNames' },
    { title: '岗位', dataIndex: 'PostName' },
    { width: 74, title: 'DL/IDL', dataIndex: 'IDLType' },
    { title: '工种', dataIndex: 'ClsName', width: 124 },
    { title: '工序', dataIndex: 'DLType', width: 74 },
    { title: '技能等级', dataIndex: 'SkillLevel', width: 124 },
    { title: '类型', dataIndex: 'TypeName', width: 124 },
    { title: '在职天数', dataIndex: 'ZZDayNum' },
    { title: '档案分组', dataIndex: 'GroupName' },
  ];

  const searchInfo = computed(() => {
    return {
      queryTime: searchFormValue.queryTime.unix() * 1000,
      type: searchFormValue.type,
      status: searchFormValue.status,
      keyword: keyword.value,
      dept: searchFormValue.dept,
      postnamemh: searchFormValue.postnamemh,
      orgCode: searchFormValue.orgCode,
      groupName: searchFormValue.groupName,
    };
  });

  // watch(
  //   () => searchInfo,
  //   () => {
  //     handleSearchDebounce();
  //   },
  //   { deep: true },
  // );

  // 接口返回数据处理
  const afterFetchMth = () => {
    const { grouplist, pielist, isShowPie: isShowPieRes = false, posclanlist = [], summarylist = [] } = getRawDataSource();
    groupList.value = grouplist;
    posclanList.value = posclanlist;
    state.pielist = pielist;
    summaryList.value = summarylist;
    isShowPie.value = isShowPieRes && !isEmpty(pielist);
  };

  const [registerTable, { reload, getRawDataSource, getPaginationRef }] = useTable({
    api: getAttendanceDetails,
    columns,
    useSearchForm: false,
    showTableSetting: false,
    bordered: false,
    pagination: paginationInfo,
    striped: true,
    canResize: true,
    resizeHeightOffset: 28,
    searchInfo,
    fetchSetting: {
      listField: 'list.list',
      totalField: 'list.pagination.total',
    },
    afterFetch: afterFetchMth,
  });

  // 获取组织架构列表
  getOrganization().then(res => {
    const {
      data: { list },
    } = res;
    ORG_CODE_OPTIONS.value = [
      ...(list.find(item => item.org_Code === 'MQ')
        ? [
            { label: 'BG', value: '' },
            { label: '运营', value: 'AllBU' },
            { label: '模具厂', value: 'MQ1008' },
          ]
        : []),
      ...list.map(item => ({
        label: item.org_Name || item.Org_Name || '',
        value: item.org_Code || item.Org_Code || '',
      })),
    ];
    if (routeQuery.orgName) {
      searchFormValue.orgCode = (ORG_CODE_OPTIONS.value.find(item => item.label === routeQuery.orgName) || ORG_CODE_OPTIONS[0]).value;
    }
  });
  // 搜索
  const handleSearch = () => {
    searchFormValue.postname = '';
    searchFormValue.posclan = '';
    searchFormValue.noBrush = '';
    reload({
      searchInfo: searchInfo.value,
    });
  };
  const handleSearchDebounce = useDebounceFn(handleSearch, 500);

  // 岗位条件改变
  const handlePostnameUpdate = postname => {
    searchFormValue.postname = postname;
    reload({
      searchInfo: {
        ...searchInfo.value,
        postname,
        posclanNames: searchFormValue.posclan,
      },
    });
  };

  // 族群条件改变
  const handlePosclanUpdate = posclan => {
    searchFormValue.posclan = posclan;
    searchFormValue.postname = '';
    searchFormValue.noBrush = '';
    reload({
      searchInfo: {
        ...searchInfo.value,
        posclanNames: posclan,
      },
    });
  };

  // 模切工等级条件改变
  const handleSkillLevelUpdate = skillLevel => {
    reload({
      searchInfo: {
        ...searchInfo.value,
        skillLevel,
      },
    });
  };

  // 出勤总结条件变更
  const handleNoBrushUpdate = value => {
    searchFormValue.noBrush = value;
    reload({
      searchInfo: {
        ...searchInfo.value,
        postname: searchFormValue.postname,
        posclanNames: searchFormValue.posclan,
        noBrush: value,
      },
    });
  };

  // 导出明细
  const exportToExcel = () => {
    const paginationRef = getPaginationRef();
    const total = (paginationRef && (paginationRef as PaginationProps).total) || 0;
    exportLoading.value = true;
    downloadAttendanceDetails({
      ...unref(searchInfo),
      pageSize: total,
    })
      .then(res => {
        const { list = [] } = res.data || {};
        saveTableDatasToExcel({
          columns: unref(columns),
          tableList: list,
          fileName: '明细数据',
        });
        exportLoading.value = false;
      })
      .catch(() => {
        exportLoading.value = false;
      });
  };
</script>

<style lang="less" scoped>
  @rightChartWidth: 466px;

  .common-content-wrapper {
    height: 100%;
    overflow-y: auto;

    .chart-container {
      height: 380px;
      width: 100%;

      .left-chart-container {
        width: calc(100% - @rightChartWidth);

        &.full {
          width: 100%;
        }
      }

      .right-chart-container {
        position: relative;
        width: @rightChartWidth;
        margin-left: 12px;
      }

      .chart-wrapper {
        min-width: 100%;
        height: 100%;
      }
    }

    .table-container {
      width: 100%;
      height: calc(100% - 380px);
      background-color: #fff;

      .summary-list {
        .item {
          height: 64px;
          margin-top: 16px;
          border-radius: 4px;
          border: 1px solid #fdfdfd;
          background: linear-gradient(277deg, #fffcf2 0%, #fff 72.08%);
          box-shadow: 0 0 4px 0 rgb(0 0 0 / 8%);
          backdrop-filter: blur(1px);

          &.select {
            background: linear-gradient(277deg, #ffc289 0%, #fff 72.08%);
          }
        }
      }
    }

    .warm-box {
      box-shadow: 0 6px 15px 0 rgb(0 0 0 / 5%);
    }

    .empty-wrapper {
      height: 60vh;
    }

    .search-wrapper {
      position: relative;
      z-index: 2;
      width: 100%;
      margin-bottom: 12px;
      text-align: right;
      margin-top: -12px;

      :deep(.ant-form-item) {
        margin: 0 12px 0 0;
      }
    }
  }
</style>
