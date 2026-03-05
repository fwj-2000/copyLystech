<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button type="primary" @click="handleDetail('')">{{ t('common.addText') }}</a-button>
              <a-button type="primary" ghost @click="handleExport" v-auth="'btn_download'">{{ t('common.batchExport') }}</a-button>
              <ModelConfirmButton
                v-auth="'btn_batchRemove'"
                v-bind="{
                  modelConfirm: {
                    onOk: batchDelete.bind(null),
                  },
                }">
                <span>{{ t('common.batchDelText') }}</span>
              </ModelConfirmButton>
            </a-space>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <updatePop @register="registerupdatePop" @refresh="reload" />
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { onMounted } from 'vue';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { getVerifyList, bulkdelete, exportDataToExcel } from '/@/api/business/dataVerify';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePopup } from '/@/components/Popup';
  import updatePop from './components/UpdatePop.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { columnsVxe, schemaFormConfig } from './config';
  import { useRoute } from 'vue-router';
  import { ModelConfirmButton } from '/@/components/Button';
  import { downloadFile } from '/@/utils/file/download';
  const route = useRoute();

  const { t } = useI18n();
  const { createMessage } = useMessage();

  defineOptions({ name: 'business-dataVerify-list' });

  const [registerupdatePop, { openPopup: openUpdatePopup }] = usePopup();

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: schemaFormConfig(),
    },
    gridOptions: {
      id: 'business-dataVerify-list',
      showIndexColumn: true,
      columns: columnsVxe,
      api: getVerifyList,
      beforeFetch: params => handleParams(params),
    },
  });
  const { getSelectRowKeys, reload, getSelectRows } = gridApi;

  // 处理参数
  function handleParams(params) {
    if (params.pickerVal) {
      params.StartTime = params.pickerVal[0];
      params.EndTime = params.pickerVal[1];
      delete params.pickerVal;
    }
    return params;
  }

  const handleExport = async () => {
    const rows = getSelectRows();
    if (!rows || rows.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    }
    if (rows.find(item => item.hasError == 1)) {
      return createMessage.warning(t('存在校验信息为异常的数据，请先修复错误数据再进行导出'));
    }
    try {
      exportDataToExcel(rows.map(item => item.id).join(',')).then(res => {
        createMessage.success(res.msg);
        downloadFile(res.data);
      });
    } catch (e) {}
  };
  function handleDetail(id = '') {
    openUpdatePopup(true, { id, title: t('common.editText'), type: 'view' });
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-view',
        onClick: handleDetail.bind(null, record.id),
      },
    ];
  }
  function batchDelete() {
    const idList = getSelectRowKeys();
    if (!idList || idList.length === 0) {
      createMessage.warning(t('common.selectText'));
      return;
    } else {
      try {
        bulkdelete(idList).then(res => {
          createMessage.success(res.msg);
          reload();
        });
      } catch (e) {
        reload();
      }
    }
  }
  onMounted(() => {
    const { id } = route.query as any;
    if (id) {
      handleDetail(id);
    }
  });
</script>
