<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    title="委外详情"
    cancel-text="返回"
    destroyOnClose
    class="full-popup top-0"
    style="height: 100%">
    <ScrollContainer style="background: #ebeef5">
      <div class="mb-14px p-12px" style="background: #fff">
        <Subtitle title="基础信息" />
        <div class="info">
          <div>委外人：{{ state.tableData['applyUserName'] || '--' }} </div>
          <div>部门：{{ state.tableData['applyDeptName'] || '--' }}</div>
          <div>委外日期：{{ dayjs(state.tableData['applyDate']).format('YYYY-MM-DD') }} </div>
        </div>
        <BasicTable @register="registerTable"> </BasicTable>
      </div>
      <div class="p-12px" style="background: #fff; height: 450px">
        <Subtitle title="检测信息" />
        <Row class="info-block" :gutter="16">
          <Col :span="6" v-for="item in information" class="mb-4">
            <div>{{ item.label }}:</div>
            <div class="info-value">
              <div v-if="item.field.includes('Time') || item.field.includes('Date')">
                {{ state.tableData[item.field] ? dayjs(state.tableData[item.field]).tz().format('YYYY-MM-DD hh:mm:ss') : '/' }}
              </div>
              <div v-else>
                {{ state.tableData[item.field] || '/' }}
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <!-- </div> -->
    </ScrollContainer>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { computed, reactive, toRefs } from 'vue';
  import dayjs from 'dayjs';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicTable, useTable } from '/@/components/Table';
  import { ScrollContainer } from '/@/components/Container';
  import { formatTableDefaultText } from '/@/utils';
  import { useUserStore } from '/@/store/modules/user';
  import { DETAIL_COLUMNS } from '../config';
  import { Row, Col } from 'ant-design-vue';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';

  const userStore = useUserStore();
  const getUserInfo = computed(() => userStore.getUserInfo);
  const emits = defineEmits(['register', 'refresh']);

  interface State {
    tableData: [];
  }

  const information = [
    {
      field: 'testHardness',
      label: '检测硬度',
    },
    {
      field: 'testCircularJump',
      label: '检测圆跳',
    },

    {
      field: 'spheroidizationName',
      label: '球化',
    },
    {
      field: 'deepColdName',
      label: '深冷',
    },
    {
      field: 'bladeDecideResultName',
      label: '刀刃',
    },
    {
      field: 'testDecideResult',
      label: '检测结果',
    },
    {
      field: 'testUserName',
      label: '检测人',
    },
    {
      field: 'testTime',
      label: '检测时间',
    },
  ];

  const { t } = useI18n();
  const state = reactive<State>({
    tableData: [],
  });

  // const { createMessage } = useMessage();
  // const descOptions = {
  //   column: { xs: 1, sm: 2, md: 4 },
  //   labelStyle: { color: '#999', fontSize: '14px' },
  //   contentStyle: { color: '#1A1A1A', fontSize: '14px' },
  // };
  // const descColumns = [
  //   { title: '委外人', dataIndex: 'ApplyUserName', key: 'ApplyUserName' },
  //   { title: '部门', dataIndex: 'ApplyDeptName', key: 'ApplyDeptName' },
  //   {
  //     title: '委外日期',
  //     dataIndex: 'ApplyDate',
  //     key: 'ApplyDate',
  //     format: 'date|YYYY-MM-DD HH:MM',
  //   },
  // ];

  const [registerPopup] = usePopupInner(init);
  const [registerTable, { setTableData }] = useTable({
    columns: DETAIL_COLUMNS,
    immediate: false,
    pagination: false,
    showTableSetting: false,
    striped: true,
    // showIndexColumn: true,
    canResize: true,
    isCanResizeParent: true,
    scroll: {
      y: 300,
    },
    transformCellText: ({ text }) => formatTableDefaultText(text),
  });

  async function init({ data }) {
    setTableData(data);
    state.tableData = data[0];
  }
</script>

<style lang="less" scope>
  .ant-table-wrapper {
    // padding: 0 !important;
  }

  .info {
    display: flex;
    padding: 10px 0;

    div {
      margin-right: 22px;
    }
  }

  .info-value {
    background-color: #f5f5f5;
    padding: 4px;
    border-radius: 4px;
  }
</style>
