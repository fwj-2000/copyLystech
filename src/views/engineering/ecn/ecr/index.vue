<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" @click="handleApprove(-1)" type="primary">{{ t('common.add2Text') }} </a-button>
            <ModelConfirmButton
              v-auth="'btn_recall'"
              v-bind="{
                modelConfirm: {
                  title: t('common.tipTitle'),
                  content: t('common.withdrawSelectedData'),
                  onOk: handleRecall.bind(null),
                },
                ghost: true,
                type: 'primary',
              }">
              <span>{{ t('common.revoke') }}</span>
            </ModelConfirmButton>
            <a-button v-auth="'btn_stop'" @click="handleTerminate" type="primary" ghost>{{ t('common.stopText') }} </a-button>
            <a-button v-auth="'btn_download'" @click="handleExport">{{ t('views.business.quota.export') }} </a-button>
            <ModelConfirmButton
              v-auth="'btn_batchRemove'"
              v-bind="{
                modelConfirm: {
                  title: t('common.tipTitle'),
                  content: t('common.beforeDelTip'),
                  onOk: handleBatchDel.bind(null),
                },
              }">
              <span>{{ t('common.batchDelText') }}</span>
            </ModelConfirmButton>
          </template>
          <!-- <template #bodyCell="{ column, index, record }">
            <template v-if="column.key === 'nodeDetail'">
              <span class="table-a" @click="handleNodeModal(record)"> {{ t('common.viewDetails') }} </span>
            </template>
            <template v-else-if="column.key === 'action'">
              <TableAction :actions="getActions(index)" />
            </template>
          </template> -->
          <template #nodeDetail="{ row }">
            <span class="table-a" @click="handleNodeModal(row)">{{ t('common.viewDetails') }}</span>
          </template>
          <template #action="{ rowIndex }">
            <TableAction outside :actions="getActions(rowIndex)" />
          </template>
        </Grid>
      </div>
    </div>
    <DetailPopup @register="registerDetail" @reload="reload" />
    <NodeModal @register="registerNodeModal"></NodeModal>
    <ExportModal @register="registerExportModal" />
    <StopModal @register="registerStopModal" @reload="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ActionItem, BasicTable, TableAction, useTable } from '/@/components/Table';
  import { column, getVxeSchema } from '/@/views/engineering/ecn/ecr/CONFIG';
  import { deleteEcr, exportEcr, getEcnPageList, getEcrPageList, getNodeDetail, stopEcr, withdrawEcr } from '/@/api/engineering/ecn';
  import { useI18n } from '/@/hooks/web/useI18n';
  import DetailPopup from './components/DetailPopup.vue';
  import { usePopup } from '/@/components/Popup';
  import { NodeModal, StopModal } from '/@/components/CustomComponents';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useModal } from '/@/components/Modal';
  import { ModelConfirmButton } from '/@/components/Button';
  import { message } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useRouteParams } from '/@/hooks/core/useRouteParams';

  defineOptions({ name: 'engineering-ecn-ecr' });
  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  const [registerDetail, { openPopup: openDetail }] = usePopup();
  const [registerExportModal, { openModal: openExportModal }] = useModal();
  const [registerNodeModal, { openModal: openNodeModal }] = useModal();
  const [registerStopModal, { openModal: openStopModal }] = useModal();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      // fieldMappingTime: [['date', ['start', 'end']]],
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },

      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: getVxeSchema(),
      i18nConfig: {
        moduleCode: 'ECNColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'engineering-ecn-ecr-list',
      columns: column,
      useSearchForm: true,
      // toolbarConfig: {
      //   superQuery: true, //高级查询
      // },
      api: getEcrPageList,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'ECNColumn',
      },
      beforeFetch: params => {
        if (params.time && params.time.length > 0) {
          params.startTime = params.time[0];
          params.endTime = params.time[1];
          delete params.time;
        }
        return params;
      },
      tableSetting: {
        delStatus: true,
      },
    },
  });
  const { reload, setLoading, getFetchParams, getSelectRowKeys, clearSelectedRowKeys, getDataSource } = gridApi;

  // const [registerTable, { getFetchParams, reload, getSelectRowKeys, setLoading, clearSelectedRowKeys }] = useTable({
  //   api: getEcrPageList,
  //   columns: getColumns(),
  //   bordered: true,
  //   rowKey: 'id',
  //   beforeFetch: params => {
  //     if (params.time && params.time.length > 0) {
  //       // params.startTime = dateUtil(params.time[0]).format('YYYY-MM-DD 00:00:00');
  //       // params.endTime = dateUtil(params.time[1]).format('YYYY-MM-DD 23:59:59');
  //       params.startTime = params.time[0];
  //       params.endTime = params.time[1];
  //       delete params.time;
  //     }
  //   },
  //   afterFetch: data => {
  //     state.cacheList = data;
  //   },
  //   tableSetting: {
  //     delStatus: true,
  //   },
  //   rowSelection: { type: 'checkbox' },
  //   useSearchForm: true,
  //   formConfig: getFormConfig(),
  //   actionColumn: {
  //     width: 80,
  //     title: t('component.table.action'),
  //     dataIndex: 'action',
  //   },
  //   i18nConfig: {
  //     moduleCode: 'c',
  //   },
  // });

  function getActions(index: number): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleApprove.bind(null, index),
        // auth: 'btn_detail',
      },
    ];
  }

  function handleApprove(index: number) {
    const hasP = hasBtnP('btn_edit');
    openDetail(true, {
      cacheList: getDataSource(),
      index,
      mode: hasP ? 'edit' : 'view',
    });
  }

  function handleNodeModal(record) {
    console.log(record);
    openNodeModal(true, {
      api: getNodeDetail,
      id: record.id,
      fetchSetting: {
        listField: 'flowNodeInstanceHisList',
      },
    });
  }

  async function handleRecall() {
    setLoading(true);
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      withdrawEcr(idList)
        .then(({ code, msg }) => {
          if (code === 200) {
            return message.success(msg);
          } else {
            return message.error(msg);
          }
        })
        .finally(() => {
          clearSelectedRowKeys();
          setLoading(false);
          reload();
        });
    }
  }

  async function handleExport() {
    const exportColumns = cloneDeep(column);
    openExportModal(true, {
      api: exportEcr,
      listQuery: {
        ...(await getFetchParams()),
      },
      exportOptions: exportColumns,
      nameProps: 'title',
      idProps: 'field',
      i18nConfig: {
        moduleCode: 'ECNColumn',
      },
    });
  }

  function handleBatchDel() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      deleteEcr(idList).then(({ code, msg }) => {
        if (code == 200) {
          message.success(msg);
        } else {
          message.error(msg);
        }
        reload();
      });
    } else {
      message.info(t('common.selectText'));
    }
  }

  function handleTerminate() {
    const idList = getSelectRowKeys() || [];
    if (idList.length) {
      return openStopModal(true, {
        api: stopEcr,
        beforeFetch: params => {
          params.ids = idList;
          return params;
        },
      });
    }
    message.info(t('common.selectText'));
  }

  // useRouteParams({ id: {} }, params => {
  //   if (!params.id) return;
  //   getEcrPageList({ id: params.id }).then(res => {
  // 	  if (res.data?.list && res.data.list.length > 0) {
  // 		  // handleEdit(0, res.data.list[0]);
  // 	  }
  //   });
  // });
  useRouteParams({ billNo: {} }, params => {
    if (!params.billNo) return;
    getEcrPageList({
      applyCode: params.billNo,
    }).then(res => {
      if (res.data?.list && res.data.list.length > 0) {
        openDetail(true, {
          cacheList: res.data.list,
          index: 0,
          mode: 'edit',
        });
      }
    });
  });
</script>
