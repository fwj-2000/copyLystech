<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box" style="padding-bottom: 12px">
        <a-row>
          <a-col span="12">
            {{ t('dict.CommonCol.applyUser') }}：{{ getUserInfo.userName }}/{{ getUserInfo.userAccount }} 【{{ getUserInfo.departmentName || '--' }}】
          </a-col>
          <a-col span="6"> {{ t('dict.CommonCol.applyTime') }}：{{ dayjs().format('YYYY-MM-DD') }} </a-col>
        </a-row>
      </div>
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #img="{ row, column }">
            <span>{{ row[column.field] }}</span>
          </template>
          <template #msg="{ row }">
            <template v-if="row.errorMsg || row.ErrorMsg || row.warnMsg || row.WarnMsg">
              <span style="color: #ff4d4f">{{ row.errorMsg || row.ErrorMsg || row.warnMsg || row.WarnMsg }}</span>
            </template>
            <template v-else>
              <div style="color: #52c41a">{{ t('component.batchImport.correct') }}</div>
            </template>
          </template>
          <template #action="{ row }">
            <TableAction :outside="true" :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, watchEffect, nextTick } from 'vue';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useUserStore } from '/@/store/modules/user';
  import dayjs from 'dayjs';
  import { deleteImportedData } from '/@/api/basic/common';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { buildUUID } from '/@/utils/uuid';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getColumns } from '../ApplyPopConfig';

  defineOptions({ name: 'imported-list-preview' });
  const emits = defineEmits(['correct']);
  const { createMessage } = useMessage();

  const props = defineProps({
    list: {
      type: Array as PropType<Recordable[]>,
      default: () => [] as any[],
    },
    columns: {
      type: Array as PropType<any[]>,
      default: () => {
        return [];
      },
    },
    apiParams: {
      type: Object,
      default: () => {
        return {};
      },
    },
    usePolling: {
      type: Boolean,
      default: false,
    },
    getTaskDataList: {
      type: Function,
      default: () => {
        return () => {};
      },
    },
    /**
     * 预览表格列头的多语言配置
     */
    i18nConfig: {
      type: Object as PropType<{ moduleCode: string }>,
      default: () => ({
        moduleCode: '',
      }),
    },
    /**
     * 不显示在导入页面的字段
     */
    excludeFields: {
      type: Array,
      default: () => {
        return [];
      },
    },
  });

  const { t } = useI18n();
  const userStore = useUserStore();
  const getUserInfo = computed(() => userStore.getUserInfo || {});

  // 处理导入组件的参数配置
  const _columns = computed(() => {
    const columns: any = [];
    (props.columns || []).forEach(el => {
      // 功能栏和操作栏需要去除
      if (!(el.type || el.field == 'action')) {
        const FIELD = el.importField || el.dataIndex || el.field;
        // 可用字段进行适配转换
        if (!props.excludeFields.includes(FIELD)) {
          const _item: any = {
            title: el.title,
            field: FIELD,
            width: el.width || el.minWidth || 180,
          };
          // 适配时间格式
          if (el.format) {
            if (typeof el.format == 'function') {
              _item.formatter = ({ cellValue, row }) => {
                el.format(cellValue, row, getUserInfo.value);
              };
            }
            // 适配时间格式
            if (el.format.includes('date')) {
              el.cellRender = {
                name: 'Date',
              };
            }
            // 适配tag
            if (el.format.includes('tag')) {
              el.cellRender = {
                name: 'Tag',
                options: JSON.parse(el.format.split('tag|').slice(1) || '[]'),
              };
            }
          }
          if (el.cellRender && !el.importField) {
            _item.cellRender = el.cellRender;
          }
          columns.push(_item);
        }
      }
    });
    columns.unshift({
      title: t('component.batchImport.data'),
      filed: 'errorMsg',
      slots: { default: 'msg' },
      width: 100,
    });
    columns.push({
      title: t('component.table.action'),
      field: 'action',
      slots: { default: 'action' },
      fixed: 'right',
      width: 50,
    });
    return columns;
  });
  // 处理导入的数据
  const getDataList = async params => {
    // 初始化的时候，直接返回传入的list
    if (props.usePolling) {
      const res = await props.getTaskDataList(params);
      const data = res.data.list || [];
      if (data && data.length) {
        let isAllCorrect = false;
        data.map(el => {
          const errMsg = el.ErrorMsg || el.errorMsg;
          if (errMsg) {
            isAllCorrect = true;
          }
          el.uuid = buildUUID();
        });
        if (isAllCorrect) {
          emits('correct', true);
        } else {
          emits('correct', false);
        }
      }

      // 格式化表格数据
      const list = (Array.isArray(data) ? data : []).map(item => {
        const infoData = (Array.isArray(item.infoJsonList) ? item.infoJsonList : []).reduce((obj: any, item) => {
          obj[item.jsonId] = item.value;
          return obj;
        }, {});

        return {
          ...item,
          ...infoData,
        };
      });

      // 动态生成设置表头
      Array.isArray(data?.[0]?.moldeJsonList) && setColumns(data[0].moldeJsonList);

      return {
        data: { list, pagination: res.pagination },
      };
    }
    return props.list;
  };
  // 表格配置
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      columns: _columns.value,
      api: getDataList,
      beforeFetch: params => {
        params = {
          ...params,
          ...props.apiParams.getTaskStatus,
        };
        return params;
      },
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: props.usePolling,
      },
      i18nConfig: props.i18nConfig,
      // showIndexColumn: true,
    },
  });
  const { reload } = gridApi;
  function getTableActions(record): ActionItem[] {
    return [
      {
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('common.delText'),
        modelConfirm: {
          onOk: handleDelete.bind(null, record),
        },
      },
    ];
  }

  // 当使用大数据批导时，需要配置api
  watchEffect(() => {
    if (props.list) {
      nextTick(() => {
        reload();
      });
    }
  });

  // 删除数据
  function handleDelete(record) {
    const id = record.id || record.Id;
    if (id) {
      return deleteImportedData(id).then(res => {
        createMessage.success(res.msg);
        // 如果是大数据类型的批导，直接请求接口获取最新数据，否则直接在前端删除该项
        if (props.usePolling) {
          reload();
        } else {
          gridApi?.remove(record);
        }
      });
    }
    createMessage.info(t('component.batchImport.delTip'));
  }

  function setColumns(list: Array<any>) {
    // gridApi?.reloadColumn(getColumns(list).splice(1, 0, {
    //   title: t('component.batchImport.data'),
    //   filed: 'errorMsg',
    //   slots: { default: 'msg' },
    //   width: 100,
    // }));
    const columns = getColumns(list);
    columns.splice(1, 0, {
      title: t('component.batchImport.data'),
      filed: 'errorMsg',
      slots: { default: 'msg' },
      width: 100,
    });

    gridApi?.reloadColumn(columns);
  }
</script>

<style lang="less" scoped>
  :deep(.lydc-content-wrapper-search-box) {
    margin-bottom: 0 !important;
  }

  .text-border {
    cursor: pointer;
  }
</style>
