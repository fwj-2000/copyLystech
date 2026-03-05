<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :width="800" @ok="handleSubmit" destroyOnClose class="lydc-condition-modal">
    <template #title>
      <Subtitle title="计划完工时间" style="padding-bottom: 0" />
    </template>
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <Grid>
          <template #planCompleteTime="{ rowIndex, row }">
            <LydcDatePicker v-model:value="row['planCompleteTime']" placeholder="计划完工时间" clearable />
          </template>
        </Grid>
      </div>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Subtitle } from '/@/components/Subtitle';
  import { getReplydeliverylist, replydelivery } from '/@/api/engineering/mould';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { updatecompletetime } from '/@/api/productionPlan/processscheduling';
  import { cloneDeep } from 'lodash-es';
  import { useI18n } from 'vue-i18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  const { t } = useI18n();
  const emit = defineEmits(['register', 'reload']);
  const columns = [
    { title: t('dict.ProcessSchedulingColumn.workOrderNo'), field: 'workOrderNo' },
    { title: t('dict.CommonCol.workOrderNo'), field: 'moldNo' },
    { title: t('dict.CommonCol.planCompleteTime'), field: 'planCompleteTime', slots: { default: 'planCompleteTime' } },
  ];
  const { createMessage } = useMessage();
  const [registerModal, { closeModal }] = useModalInner(init);
  const searchInfo = ref();
  const state = reactive({
    dataSource: [] as any,
  });
  const [Grid, GridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'processSchedulingPlan-components-workPlanModal',
      columns: columns,
      showIndexColumn: true,
      height: 440,
      showFooter: false,
      rowConfig: {
        keyField: 'id',
        isCurrent: false, // 完全禁用行高亮
      },
      i18nConfig: {
        moduleCode: 'MouldRoomColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      columnConfig: {
        isCurrent: true, // 启用列高亮
      },
      currentColumnConfig: {
        isFollowSelected: true, // 高亮跟随选中
      },
    },
  });
  function init({ data }) {
    state.dataSource = cloneDeep(data);
    console.log(data);
    state.dataSource = state.dataSource.filter(item => item.parentId);
    state.dataSource = state.dataSource.map(item => {
      delete item._X_ROW_CHILD;
      delete item._X_ROW_KEY;
      delete item.children;
      return item;
    });
    GridApi.reloadData(state.dataSource);
    // getReplydeliverylistFn(ids);
    // state.dataSource = dataSource;
    // console.log(dataSource);
    // changeLoading(true);
    // nextTick(() => {
    //   changeLoading(false);
    // });
  }

  async function getReplydeliverylistFn(ids) {
    try {
      const { code, data } = await getReplydeliverylist(ids);
      if (code === 200) {
        GridApi.grid.reloadData(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function updatecompletetimeFn() {
    const params: any = [];
    // GridApi.getDataSource().forEach(o => {
    //   params.push({
    //     id: o.id,
    //     replyDeliveryTime: o.replyDeliveryTime,
    //   });
    // });
    try {
      const { code, msg } = await updatecompletetime({ list: GridApi.getDataSource() });
      if (code === 200) {
        createMessage.success(msg);
        emit('reload');
        closeModal();
      } else {
        createMessage.error(msg);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function handleSubmit() {
    updatecompletetimeFn();
  }
</script>
