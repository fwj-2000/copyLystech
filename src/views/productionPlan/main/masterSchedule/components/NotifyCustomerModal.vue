<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="t('dict.MasterDemandPlanColumn.notifyCustomerDes')" showOkBtn @ok="handleSubmit" width="1400px">
    <Grid></Grid>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { sendmessage } from '/@/api/mps/productionPlan/MPS';
  import dayjs from 'dayjs';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';

  const props = defineProps({
    searchDate: {
      type: String,
    },
  });
  const emit = defineEmits(['register', 'reload']);
  const { t } = useI18n();
  const { createMessage } = useMessage();

  const [registerModal, { changeLoading, closeModal }] = useModalInner(init);

  const columns = [
    {
      title: '内部料号',
      field: 'innerMaterialCode',
      width: 140,
    },
    {
      title: '客服',
      field: 'customerId',
      editRender: {
        cacheField: 'customerName',
        name: 'CustomUserSelect',
      },
      width: 140,
    },
    {
      title: '排程交期',
      field: 'schedulingDelivery',
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
      width: 100,
    },
    {
      title: '排程备注',
      field: 'schedulingRemark',
      width: 100,
    },
    {
      title: '回复交期',
      field: 'replyDeliveryDate',
      children: [],
    },
    // {
    //   title: '客户确认交期',
    //   field: 'confirmDelivery',
    //   cellRender: {
    //     name: 'Date',
    //     format: 'YYYY-MM-DD',
    //   },
    //   editRender: {
    //     name: 'DatePicker',
    //     props: {
    //       valueFormat: 'YYYY-MM-DD',
    //     },
    //   },
    //   width: 145,
    // },
  ];

  // 当前周数二级表头
  function getWeekDays(yearWeek) {
    if (!yearWeek) {
      return [];
    }
    const weeksDayjs = dayjs(yearWeek);
    const yearWeekFormat = `${weeksDayjs.endOf('week').year()}WK${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}`;
    const [year, week] = yearWeekFormat.split('WK').map(Number);
    const monday = dayjs().year(year).isoWeek(week).day(1); // 直接定位到周一
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const titles = [
      t('dict.MasterDemandPlanColumn.monday'),
      t('dict.MasterDemandPlanColumn.tuesday'),
      t('dict.MasterDemandPlanColumn.wednesday'),
      t('dict.MasterDemandPlanColumn.thursday'),
      t('dict.MasterDemandPlanColumn.friday'),
      t('dict.MasterDemandPlanColumn.saturday'),
      t('dict.MasterDemandPlanColumn.sunday'),
    ];
    const result: any[] = [];

    for (let i = 0; i < 7; i++) {
      const date = monday.add(i, 'day');
      result.push({
        title: `${titles[i]}(${date.format('MM/DD')})`,
        field: days[i],
        editRender: {
          name: 'InputNumber',
          props: { step: 100 },
        },
        width: 120,
        i18nField: 'DISABLED', // 不做翻译处理
      });
    }
    result.push({
      title: t('dict.MasterDemandPlanColumn.remark'),
      field: 'remark',
      editRender: {
        name: 'Input',
      },
      width: 160,
    });

    return result;
  }

  const editRules = {
    customerId: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
    monday: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
    tuesday: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
    wednesday: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
    thursday: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
    friday: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
    saturday: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
    sunday: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
  };

  const [Grid, { reloadColumn, reloadData, validate, getDataSource }] = useVbenVxeGrid({
    gridOptions: {
      id: 'productionPlan-main-masterSchedule-list-notifyCustomerModal',
      columns,
      showIndexColumn: true,
      clipConfig: {
        isPaste: true,
      },
      i18nConfig: {
        moduleCode: 'MasterDemandPlanColumn',
        otherConfig: {
          minWidth: 0,
          resizeable: true,
        },
      },
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        autoHidden: true,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      editRules,
      position: 'modal',
    },
  });

  async function init({ notifyData, searchDate }) {
    changeLoading(true);
    const dataList = columns.map(item => {
      if (item.field === 'replyDeliveryDate') {
        return {
          ...item,
          children: getWeekDays(searchDate),
        };
      } else {
        return { ...item };
      }
    });
    reloadColumn(dataList);
    reloadData(notifyData);
    changeLoading(false);
  }

  async function handleSubmit() {
    if (await validate(true)) {
      createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
      return;
    }
    changeLoading(true);
    const tableData = await getDataSource();
    const { code, msg } = await sendmessage(tableData).finally(() => {
      changeLoading(false);
    });
    if (code == 200) {
      createMessage.success(t('tip.MPS.tip12')); // 通知客服成功
      emit('reload');
      closeModal();
    } else {
      createMessage.error(msg);
    }
  }
</script>
