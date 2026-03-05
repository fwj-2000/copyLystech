<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box" style="border-bottom: 1px solid #dbdbdb; padding-bottom: 12px">
        <a-row>
          <a-col span="6"> {{ t('dict.CommonCol.applyUser') }}：{{ getUserInfo.userName }}/{{ getUserInfo.userAccount }} </a-col>
          <a-col span="6"> {{ t('component.batchImport.department') }}：{{ getUserInfo.departmentName || '--' }} </a-col>
          <a-col span="6"> {{ t('dict.CommonCol.applyTime') }}：{{ dayjs().format('YYYY-MM-DD') }} </a-col>
        </a-row>
      </div>
      <div class="lydc-content-wrapper-content bg-white">
        <BasicTable @register="registerTable" rowKey="uuid" :dataSource="props.list" :columns="_columns">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'errorMsg'">
              <template v-if="record.errorMsg || record.ErrorMsg">
                <!--                <a-tooltip>-->
                <!--                  <template #title>-->
                <!--                    <span>{{ record.errorMsg || record.ErrorMsg }}</span>-->
                <!--                  </template>-->
                <!--                  <div style="color: #ff4d4f; cursor: pointer">数据错误</div>-->
                <!--                </a-tooltip>-->
                <span style="color: #ff4d4f">{{ record.errorMsg || record.ErrorMsg }}</span>
              </template>
              <template v-else>
                <div style="color: #52c41a">{{ t('component.batchImport.correct') }}</div>
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
  import { onMounted, computed, watchEffect, nextTick, ref, watch } from 'vue';
  import { BasicTable, TableAction, useTable, ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formatTableDefaultText } from '/@/utils';
  import { useUserStore } from '/@/store/modules/user';
  import dayjs from 'dayjs';
  import { deleteImportedData } from '/@/api/basic/common';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { buildUUID } from '/@/utils/uuid';

  defineOptions({ name: 'quantitation-requirement' });
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

  // 当使用大数据批导时，需要配置api
  watchEffect(() => {
    if (props.usePolling) {
      nextTick(() => {
        setProps({
          api: props.getTaskDataList,
          rowKey: 'uuid',
        });
        reload();
      });
    }
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
        // 判断字段是否是需要去除的
        if (!props.excludeFields.includes(FIELD)) {
          const _item: any = {
            title: el.title,
            dataIndex: FIELD,
            width: el.width || el.minWidth || 180,
          };
          if (el.format) {
            _item.format = el.format;
          }
          // 适配时间格式
          if (el.cellRender && el.cellRender.name == 'Date') {
            _item.format = 'date|YYYY-MM-DD HH:MM:ss';
          }
          columns.push(_item);
        }
      }
    });
    columns.unshift({
      title: t('component.batchImport.data'),
      dataIndex: 'errorMsg',
      width: 100,
    });
    return columns;
  });

  const [registerTable, { reload, setProps, deleteSelectRowByKey }] = useTable({
    useSearchForm: false,
    beforeFetch: params => {
      params = {
        ...params,
        ...props.apiParams.getTaskStatus,
      };
      return params;
    },
    rowKey: 'uuid',
    afterFetch: data => {
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
    },
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
    i18nConfig: props.i18nConfig,
    actionColumn: {
      width: 80,
      title: t('common.action'),
      dataIndex: 'action',
    },
  });

  function getTableActions(record): ActionItem[] {
    return [
      // {
      //   // label: t('common.editText'),
      //   icon: 'icon-ym icon-ym-view',
      //   onClick: addOrUpdateHandle.bind(null, record.id),
      // },
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
          deleteSelectRowByKey(record.uuid);
        }
      });
    }
    createMessage.info(t('component.batchImport.delTip'));
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
