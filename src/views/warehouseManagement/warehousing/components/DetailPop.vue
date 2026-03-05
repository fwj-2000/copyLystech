<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :title="state.title"
    :cancel-text="t('common.back')"
    destroyOnClose
    class="full-popup top-0"
    style="height: 100%">
    <ScrollContainer style="background: #ebeef5">
      <div class="mb-14px p-12px" style="background: #fff">
        <Subtitle :title="t('common.baseinfo')" />
        <div class="info">
          <div>{{ t('dict.OutsourceManageColumn.applyUserName') }}：{{ getUserInfo.userName }}/{{ getUserInfo.userAccount }} </div>
          <div>{{ t('dict.DepartmentColumn') }}：{{ getUserInfo.departmentName || '--' }}</div>
          <div>{{ t('dict.OutsourceManageColumn.qutsourcingDate') }}：{{ dayjs().format('YYYY-MM-DD') }} </div>
        </div>
        <BasicTable @register="registerTable"> </BasicTable>
      </div>
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
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';

  const userStore = useUserStore();
  const getUserInfo = computed(() => userStore.getUserInfo);
  const emits = defineEmits(['register', 'refresh']);

  interface State {
    tableData: [];
    title: string;
  }

  const { t } = useI18n();
  const state = reactive<State>({
    tableData: [],
    title: '',
  });

  const [registerPopup] = usePopupInner(init);
  const [registerTable, { setTableData }] = useTable({
    columns: DETAIL_COLUMNS,
    immediate: false,
    pagination: false,
    showTableSetting: false,
    striped: true,
    showIndexColumn: true,
    canResize: true,
    isCanResizeParent: false,
    scroll: {
      y: 300,
    },
    transformCellText: ({ text }) => formatTableDefaultText(text),
  });

  async function init({ title, data }) {
    state.title = title;
    state.tableData = data[0];
    setTableData(data);
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
