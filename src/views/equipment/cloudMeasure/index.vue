<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-dropdown>
              <template #overlay>
                <a-menu @click="handleMenuClick">
                  <a-menu-item key="1" value="FAI Template.xlsm">FAI Template</a-menu-item>
                  <a-menu-item key="2" value="Cpk Template.xlsm">Cpk Template</a-menu-item>
                </a-menu>
              </template>
              <a-button type="primary" ghost>
                <i class="icon-ym icon-ym-btn-download"></i>
                {{ t('common.exportTemplate') }}
                <DownOutlined />
              </a-button>
            </a-dropdown>
            <a-button type="primary" @click="ImportTemplate"
              ><i class="icon-ym icon-ym-btn-upload button-preIcon"> </i>{{ t('common.importTemplate') }}
            </a-button>
          </template>
          <template #Status="{ row }">
            <a-tag :color="row.Status === 1 ? 'success' : 'error'">{{ row.Status === 1 ? t('status.yes') : t('status.no') }}</a-tag>
          </template>
          <template #action="{ row }">
            <TableAction :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ImportModal @register="registerImportModal" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { ActionItem } from '/@/components/Table';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getColumn, getFormConfig } from './config';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getCloud, exportData, deleteCloud, downLoadData } from '../../../api/equipment/cloudMeasure';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { onMounted } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { message } from 'ant-design-vue';
  import ImportModal from './components/ImportModal.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { downloadByUrl } from '/@/utils/file/download';
  defineOptions({ name: 'equipment-cloudMeasure' });

  const [registerImportModal, { openModal: openImportModal }] = useModal();

  const { t } = useI18n();
  const [Grid, { reload, getSelectRowKeys, getSelectRows }] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      showCollapseButton: false,
      submitOnChange: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: getFormConfig(),
      i18nConfig: {
        moduleCode: 'CloudMeasure',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'equipment-cloudMeasure-list',
      columns: getColumn(),
      api: getCloud,
      showIndexColumn: true,
      beforeFetch: params => handleParams(params),
      i18nConfig: {
        moduleCode: 'CloudMeasureColumn',
      },
    },
  });

  // 处理参数
  function handleParams(params) {
    if (params.pickerVal) {
      params.startTime = params.pickerVal[0];
      params.endTime = params.pickerVal[1];
      delete params.pickerVal;
    }
    return params;
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          title: '删除',
          onOk: handleDelete.bind(null, record),
        },
      },
      {
        label: t('common.exportReport'),
        onClick: downData.bind(null, record.id),
      },
    ];
  }

  const { createMessage } = useMessage();

  //单个删除
  function handleDelete(record: Recordable) {
    deleteCloud(record.id).then(res => {
      createMessage.success(res.msg);
      reload();
    });
  }

  function ImportTemplate() {
    openImportModal(true, {});
  }

  //下载原始报表
  async function downData(id) {
    downLoadData(id)
      .then(res => {
        if (!res.data.url) return;
        downloadByUrl({ url: res.data.url });
      })
      .catch(err => {
        return message.warning(err);
      });
  }

  //下载FAI，cpk报表
  const handleMenuClick = async (e: Event) => {
    const list = getSelectRowKeys();
    if (list?.length === 0) {
      return message.warning(t('common.selectText'));
    }
    const listData = getSelectRows().map(i => {
      return {
        avr: i.avr,
        materialCode: i.materialCode,
      };
    });
    const boo = hasDifferentValues(listData);
    if (boo) {
      await exportData(e.item.value, list).then(res => {
        if (!res.data.url) return;
        downloadByUrl({ url: res.data.url });
      });
    } else {
      return message.warning('批次或者料号不一致');
    }
  };

  function hasDifferentValues<T>(list: T[]): boolean {
    const avr = list[0].avr;
    const materialCode = list[0].materialCode;
    for (const item of list) {
      if (avr != item.avr || materialCode != item.materialCode) {
        return false;
      }
    }
    return true;
  }

  onMounted(async () => {});
</script>
