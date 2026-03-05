<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-dashboard-content bg-white h-full">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'btn_resend'" type="primary" @click="resendData">{{ t('common.resend') }}</a-button>
            </a-space>
          </template>
        </Grid>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { columns, schemaForm } from './config';
  import { getFcMiddleDataList, againPushMds } from '/@/api/mps/productionPlan/fcMiddleData';
  import { onMounted } from 'vue';
  import dayjs from 'dayjs';
  import { cloneDeep } from 'lodash-es';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getYearWeekFormat } from '/@/views/productionPlan/main/utils/index';

  defineOptions({ name: 'productionPlan-main-fcMiddleData' });

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [Grid, { getFromValue, reloadColumn, reload, setLatestSubmissionValues, resetForm, getSelectRows }] = useVbenVxeGrid({
    formOptions: {
      showCollapseButton: false,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: schemaForm,
      handleSubmit: reloadTable,
      handleReset: reset,
      i18nConfig: {
        // moduleCode: 'FCMiddleDataColumn',
        // transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'productionPlan-main-fcMiddleData-list',
      columns: [],
      api: getFcMiddleDataList,
      showIndexColumn: true,
      beforeFetch: params => {
        const weeksDayjs = dayjs(params.searchDate);
        return {
          ...params,
          // searchDate: getFieldsValue().searchDate.replace('-', 'WK'),
          searchDate: `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`,
        };
      },
      i18nConfig: {
        // moduleCode: 'FcMiddleDataColumn',
      },
    },
  });

  const resendData = async () => {
    const rows = await getSelectRows();
    if (rows.length === 0) {
      return createMessage.warning(t('common.selectDataTip'));
    }
    // 只有待推送的才能推送
    const hasInvalidStatus = rows.some(item => item.isPushMds == 2 || item.isPushMds == 3);
    if (hasInvalidStatus) {
      return createMessage.warning(t('tip.MPS.tip3')); // 只能重新推送 未推送 状态的数据
    }
    const ids = rows.map(item => item.id);
    const { code, msg } = await againPushMds(ids);
    if (code == 200) {
      createMessage.success(msg);
      reload();
    } else {
      createMessage.error(msg);
    }
  };

  async function reset() {
    await resetForm();
    reloadTable();
  }

  async function reloadTable() {
    // const fields = await getFieldsValue();
    const fields = await getFromValue();
    setLatestSubmissionValues(fields);
    const dataList = cloneDeep(columns);
    dataList.splice(7, 0, ...getYearWeekFormat({ yearWeek: fields.searchDate }));
    reloadColumn(dataList);
    reload();
  }

  const initData = async () => {
    reloadTable();
  };

  onMounted(async () => {
    initData();
  });
</script>
