<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :okText="t('common.submitText')"
    destroyOnClose
    :cancelText="t('common.cancel')"
    :title="handleTyle === 'add' ? t('common.add2Text') : t('common.editText')"
    :showOkBtn="false"
    class="full-popup pb-10px top-0">
    <template #appendToolbar>
      <a-button type="primary" class="mx-12px" @click="handleSaveAction()">{{ t('common.submitText') }}</a-button>
    </template>
    <ScrollContainer>
      <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
        <div class="title-stick">
          <div class="gun"></div>
          <div class="title">{{ t('common.baseinfo') }}</div>
        </div>
        <BasicForm @register="registerBasicInfoForm"> </BasicForm>
      </a-card>

      <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
        <div class="title-box">
          <div class="title-stick">
            <div class="gun"></div>
            <div class="title">{{ isElectrodeSchedule ? t('dict.CommonCol.electrodeProcessPlan') : t('dict.CommonCol.subProcessPlan') }}</div>
          </div>
        </div>
        <Grid style="height: auto">
          <template #PlanStartTime="{ row }">
            <LydcDatePicker
              v-model:value="row.planStartTime"
              format="YYYY-MM-DD HH:mm"
              placeholder="请选择"
              @change="datePickerChange($event, row)"
              clearable />
          </template>
        </Grid>
      </a-card>
    </ScrollContainer>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicForm, useForm } from '/@/components/Form';
  import { ScrollContainer } from '/@/components/Container';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { moldpartplan, getplandetailbyid } from '/@/api/engineering/mould';
  import { parentFormSchemas, PlanPartColumn, childrenFormSchemas } from '../config';
  import dayjs from 'dayjs';

  const { t } = useI18n();

  const emit = defineEmits(['reload', 'register']);

  const { createMessage } = useMessage();

  const [registerBasicInfoForm, { setFieldsValue, validateFields, resetSchema }] = useForm({
    layout: 'vertical',
    labelWidth: 220,
    baseColProps: {
      span: 6,
    },
    i18nConfig: {
      moduleCode: 'MoldPartPlanColumn',
      transferRange: ['placeholder', 'label'],
    },
  });

  const [Grid, GridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-partProcessPlan-timeList',
      showIndexColumn: true,
      columns: PlanPartColumn,
      // editConfig: {
      //   trigger: 'dblclick',
      //   mode: 'row',
      // },
      mouseConfig: {
        area: true, // 是否开启区域选取
      },
      areaConfig: {
        multiple: true, // 是否启用多区域选取功能
      },
      keyboardConfig: {
        isClip: true, // 是否开启复制粘贴
        isEdit: true, // 是否开启任意键进入编辑（功能键除外）
        isDel: true, // 是否开启删除键功能
        isEsc: true, // 是否开启Esc键关闭编辑功能
      },
      pagerConfig: {
        autoHidden: true,
      },
      toolbarConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      i18nConfig: {
        moduleCode: 'MoldPartPlanColumn',
      },
    },
    // gridEvents: {
    //   headerCellDblclick: handleHeaderCellDblclick,
    // },
  });

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const detailId = ref('');
  const handleTyle = ref('');
  const isElectrodeSchedule = ref(false);
  async function init(info) {
    isElectrodeSchedule.value = info.isElectrodeSchedule || false;
    handleTyle.value = info.type;
    const schema = info.level === 'parent' ? parentFormSchemas : childrenFormSchemas;
    resetSchema(schema as any);
    // 编辑
    const { id, moldNo, workOrderNo, partNo, quantity, routeMap, planRemark, creatorUserName, electrodeName } = info.record;
    detailId.value = id;
    changeLoading(true);
    setFieldsValue({ id, moldNo, workOrderNo, partNo, quantity, routeMap, planRemark, creatorUserName, electrodeName });
    const { data } = await getplandetailbyid({ id });
    changeLoading(false);
    const table = data.map(item => {
      return {
        ...item,
        planStartTime: item.planStartTime ? dayjs(item.planStartTime).format('YYYY-MM-DD HH:mm') : '',
        actualCompletionTime: item.actualCompletionTime ? dayjs(item.actualCompletionTime).format('YYYY-MM-DD') : '',
      };
    });
    GridApi.grid.reloadData(table);
  }

  // function handleHeaderCellDblclick({ column }) {
  //   if (column.property === 'planStartTime') {
  //     let tableData = GridApi.getDataSource();
  //     for (let i = 0; i < tableData.length; i++) {
  //       if (!tableData[i].planStartTime && i > 0) {
  //         // 计划开始时间=上一个结束时间+上一个工序预估时间+1
  //         const planStartTime = dayjs(tableData[i - 1].planEndTime).add(Number(tableData[i - 1].presetDuration) + 1, 'hour');
  //         tableData[i].planStartTime = planStartTime.format('YYYY-MM-DD HH:mm');
  //         // 计划结束时间=当前计划开始时间+当前工序预估时间
  //         tableData[i].planEndTime = dayjs(planStartTime).add(tableData[i].presetDuration, 'hour');
  //       }
  //     }
  //   }
  // }

  const datePickerChange = (val, row) => {
    if (!val) {
      row.planEndTime = '';
      return;
    }
    const date = dayjs(val);
    if (row.presetDuration) {
      // 加上工时
      row.planEndTime = date.add(row.presetDuration, 'hour');
    }
  };

  // 提交
  const handleSaveAction = async () => {
    const values = await validateFields();
    const gridData = GridApi.getDataSource();
    if (gridData.some(item => !item.planStartTime)) {
      createMessage.warning(t('dict.CommonCol.planStartTimeRequired'));
      return;
    }
    const params = {
      id: detailId.value,
      planRemark: values.planRemark,
      planList: gridData.map(item => {
        return {
          ...item,
          planStartTime: dayjs(item.planStartTime).format('YYYY-MM-DD HH:mm'),
          planEndTime: item.planEndTime ? dayjs(item.planEndTime).format('YYYY-MM-DD') : '',
        };
      }),
    };
    changeLoading(true);
    const { code, msg } = await moldpartplan(params).finally(() => {
      changeLoading(false);
    });
    if (code === 200) {
      createMessage.success(msg);
      emit('reload');
      closePopup();
      return;
    }
    createMessage.error(msg);
  };
</script>
<style lang="less" scoped>
  .full-popup {
    ::v-deep(.vxe-table--body-wrapper) {
      height: auto !important;
    }
  }

  .title-stick {
    display: flex;
    align-items: center;

    .gun {
      border-radius: 2px;
      background: #ff7b00;
      width: 2px;
      height: 14px;
      margin-right: 10px;
    }

    .title {
      color: #1a1a1a;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 22px; /* 157.143% */
    }

    //&:before {

    //}
    :deep(.ant-upload-list-picture-card-container) {
      width: 250px;
      height: 250px;
    }

    :deep(.ant-upload.ant-upload-select-picture-card) {
      width: 250px;
      height: 250px;
    }

    :deep(.ant-upload) {
      width: 250px;
      height: 250px;
    }
  }

  .title-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
