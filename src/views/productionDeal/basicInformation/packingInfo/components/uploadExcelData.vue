<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box" style="border-bottom: 1px solid #dbdbdb; padding-bottom: 12px">
        <a-row>
          <a-col span="6"> 申请人：{{ getUserInfo.userName }}/{{ getUserInfo.userAccount }} </a-col>
          <a-col span="6"> 申请部门：{{ getUserInfo.departmentName || '--' }} </a-col>
          <a-col span="6"> 申请时间：{{ dayjs().format('YYYY-MM-DD') }} </a-col>
        </a-row>
      </div>
      <div class="lydc-content-wrapper-content bg-white">
        <BasicTable @register="registerTable" :dataSource="props.list">
          <template #bodyCell="{ column, record, text }">
            <template v-if="column.dataIndex === 'ErrorMsg'">
              <template v-if="record.ErrorMsg">
                <a-tooltip :title="text">
                  <div style="color: #ff4d4f; cursor: pointer">数据错误</div>
                </a-tooltip>
              </template>
              <template v-else>
                <div style="color: #52c41a">正确</div>
              </template>
            </template>
            <template v-if="column.key === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, computed } from 'vue';
  import { BasicTable, TableAction, useTable, ActionItem } from '/@/components/Table';
  import { formatTableDefaultText } from '/@/utils';
  import { useUserStore } from '/@/store/modules/user';
  import { BasicColumn } from '/@/components/Table';
  import dayjs from 'dayjs';

  defineOptions({ name: 'quantitation-requirement' });

  const props = defineProps({
    list: {
      type: Array as PropType<Recordable[]>,
      default: () => [] as any[],
    },
  });
  const userStore = useUserStore();
  const getUserInfo = computed(() => userStore.getUserInfo || {});

  const importColumns: BasicColumn[] = [
    { title: 'excel行号', dataIndex: 'Number', width: 120, key: 'Number', sorter: true },
    { title: '数据', dataIndex: 'ErrorMsg', width: 100 },
    { title: '内部料号', dataIndex: 'InnerMaterialCode' },
    { title: '包装类型', dataIndex: 'PackingType' },
    { title: '数量(pcs)', dataIndex: 'Quantity' },
    { title: '纸盒规格', dataIndex: 'PaperBoxSpec' },
    { title: '纸箱规格', dataIndex: 'PaperCartonSpec' },
    { title: '生产日期', dataIndex: 'DateCode' },
    { title: '批次号', dataIndex: 'LotNo' },
    { title: '标签名称', dataIndex: 'LabelTemplateName' },
    { title: '是否启用', dataIndex: 'StatusName' },
  ];

  const [registerTable, { reload }] = useTable({
    columns: importColumns,
    useSearchForm: false,
    showTableSetting: false,
    striped: true,
    ellipsis: true,
    tableSetting: {
      size: false,
      redo: false,
      setting: false,
    },
    formConfig: {},
    isCanResizeParent: true,
    canResize: true,
    pagination: {
      pageSize: 100,
    },
    transformCellText: ({ text }) => formatTableDefaultText(text),
  });

  function getTableActions(record): ActionItem[] {
    return [
      {
        // label: t('common.delText'),
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleDelete.bind(null, record.id),
        },
      },
    ];
  }
  function handleDelete(id) {
    // delTable(id).then(res => {
    //   createMessage.success(res.msg);
    //   reload();
    // });
    console.log(id, 'id');
  }
  onMounted(() => {
    reload();
  });
</script>

<style lang="less" scoped>
  :deep(.lydc-content-wrapper-search-box) {
    margin-bottom: 0 !important;
  }

  .text-border {
    border-bottom: 1px solid #333;
    cursor: pointer;
  }
</style>
