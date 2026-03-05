<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :cancelText="t('common.closeText')"
    :show-ok-btn="false"
    :title="t('component.nodeModal.modalTitle')"
    :width="1100"
    :minHeight="500"
    destroy-on-close>
    <BasicTable style="min-height: 500px" @register="registerTable"></BasicTable>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { formatTableDefaultText } from '/@/utils';
  import { useBaseStore } from '/@/store/modules/base';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getNodeDetail } from '/@/api/engineering/ecn';

  const emit = defineEmits(['register', 'reload']);
  const { t } = useI18n();

  const state = reactive<{
    id: string;
    api: any;
    fetchSetting: {} | undefined;
  }>({
    id: '',
    api: undefined,
    fetchSetting: {},
  });
  const baseStore = useBaseStore();
  const [registerTable, { setProps }] = useTable({
    api: state.api,
    afterFetch: list => {
      list.forEach((item, index) => {
        if (index > 0) {
          const prevItem = list[index - 1];
          if (prevItem.endTime) {
            item.beginTime = prevItem.endTime;
          }
        }
      });
      return list;
    },
    fetchSetting: {
      ...state.fetchSetting,
    },
    columns: [
      { title: t('component.nodeModal.table.endTime'), dataIndex: 'endTime', format: 'date|YYYY/MM/DD', width: 150 },
      { title: t('component.nodeModal.table.nodeName'), dataIndex: 'nodeName', width: 120 },
      { title: t('component.nodeModal.table.handlerName'), dataIndex: 'handlerName', width: 180 },
      {
        title: t('component.nodeModal.table.action'),
        dataIndex: 'action',
        width: 80,
        editRow: true,
        editComponent: 'ApiSelect',
        editComponentProps: {
          api: () => {
            return baseStore.getDictionaryData('Flow.NodeAction');
          },
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
        },
      },
      {
        title: t('component.nodeModal.table.remark'),
        dataIndex: 'remark',
        width: 170,
      },
      {
        title: t('component.nodeModal.table.duration'),
        dataIndex: 'beginTime',
        width: 200,
        customRender: ({ record }) => {
          return calculateDuration(record.beginTime, record.endTime);
        },
      },
    ],
    rowKey: 'id',
    useSearchForm: false,
    striped: true,
    ellipsis: true,
    canColDrag: true,
    isCanResizeParent: true,
    canResize: true,
    pagination: false,
    resizeHeightOffset: 20,
    showTableSetting: false,
    transformCellText: ({ text }) => formatTableDefaultText(text),
  });
  const [registerModal] = useModalInner(init);
  function init(data) {
    state.api = data.api;
    state.fetchSetting = data.fetchSetting || {};
    setProps({
      api: data.api || getNodeDetail,
      beforeFetch: params => {
        const _p = { ...params, id: data.id };
        return _p;
      },
      fetchSetting: data.fetchSetting || {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  // 定义时间单位常量（毫秒）
  const MS_PER_SECOND = 1000;
  const MS_PER_MINUTE = MS_PER_SECOND * 60;
  const MS_PER_HOUR = MS_PER_MINUTE * 60;
  const MS_PER_DAY = MS_PER_HOUR * 24;
  function calculateDuration(startTimestamp, endTimestamp) {
    // 将时间戳转换为日期对象
    const startDate = new Date(startTimestamp);
    const endDate = new Date(endTimestamp);

    // 计算总的毫秒数差
    const diffInMs = endDate - startDate;

    if (diffInMs <= 60) {
      return '/';
    }
    // 计算各个时间单位的值
    const diffInDays = Math.floor(diffInMs / MS_PER_DAY);
    const diffInHours = Math.floor((diffInMs % MS_PER_DAY) / MS_PER_HOUR);
    const diffInMinutes = Math.floor((diffInMs % MS_PER_HOUR) / MS_PER_MINUTE);
    const diffInSeconds = Math.floor((diffInMs % MS_PER_MINUTE) / MS_PER_SECOND);

    // 构建结果字符串（自动跳过0值单位）
    const result: string[] = [];
    if (diffInDays > 0) {
      result.push(`${diffInDays}${t('component.time.days')}`);
    }
    if (diffInHours > 0) {
      result.push(`${diffInHours}${t('component.time.hours')}`);
    }
    if (diffInMinutes > 0) {
      result.push(`${diffInMinutes}${t('component.time.minutes')}`);
    }
    if (diffInSeconds > 0) {
      result.push(`${diffInSeconds}${t('component.time.seconds')}`);
    }
    return result.join('');
  }
</script>
