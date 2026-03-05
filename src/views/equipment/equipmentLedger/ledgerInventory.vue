<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="reload" @reset="initData" />
      </div>

      <div class="lydc-content-dashboard-content bg-white h-full">
        <Grid>
          <template #toolbar-actions>
            <a-space class="w-[100%] space-box">
              <!-- 批量导出 -->
              <a-button v-auth="'btn_download'" class="mr-12px" @click="handleExport">{{ t('common.batchExport') }}</a-button>
              <div class="inventory-tip">{{ t('dict.CommonCol.ledgerInventoryTip') }}</div>
            </a-space>
          </template>
        </Grid>
        <div class="compare-result">{{ compareResult }}</div>
      </div>
    </div>
    <ExportModal @register="registerExportModal" @export="exportAction" />
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { onMounted, ref } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicForm, useForm } from '/@/components/Form';
  import { ledgerInventorySchema, ledgerInventoryColumn, ledgerInventoryColumnExport } from './config';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { comparepage, getfactoryarealist, exportcompare } from '/@/api/equipment/equipmentLedger';
  import dayjs from 'dayjs';

  const { t } = useI18n();

  const props = defineProps({
    state: {
      type: Object,
      default: () => ({}),
    },
  });

  const compareResult = ref('');

  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();

  const [registerForm, { setFieldsValue, getFieldsValue, updateSchema }] = useForm({
    baseColProps: { span: 3 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    autoAdvancedLine: 1,
    actionColOptions: {
      span: 3,
    },
    schemas: ledgerInventorySchema,
    i18nConfig: {
      moduleCode: 'EquipmentLedgerColumn',
      transferRange: ['placeholder'],
    },
  });

  const [Grid, { reload, getFetchParams }] = useVbenVxeGrid({
    gridOptions: {
      id: 'equipment-equipmentLedger-ledgerInventory-list',
      columns: ledgerInventoryColumn,
      api: comparepage,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'EquipmentLedgerColumn',
      },
      proxyConfig: {
        response: {
          result: 'data.list',
          total: 'data.pagination.Total',
        },
      },
      beforeFetch: params => {
        return {
          ...params,
          ...getFieldsValue(),
          weeks: getWeeks(),
        };
      },
      afterFetch: data => {
        compareResult.value = data.compareResult;
      },
    },
  });

  function getWeeks() {
    const weeksDayjs = dayjs(getFieldsValue().weeks);
    return getFieldsValue().weeks ? `${weeksDayjs.endOf('week').year()}-${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}` : '';
  }

  // 批量导出
  const handleExport = async () => {
    const fieldsValue = getFieldsValue();
    openExportModal(true, {
      listQuery: {
        ...(await getFetchParams()),
        ...fieldsValue,
        weeks: getWeeks(),
      },
      exportOptions: ledgerInventoryColumnExport,
      nameProps: 'title',
      idProps: 'field',
    });
  };
  const exportAction = query => {
    exportcompare(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };

  // 获取当前的年-周
  function getYearWeek() {
    const today = dayjs();
    const year = today.year();
    const week = today.isoWeek(); // 获取ISO周数（1-53）
    // 格式化为 YYYY-WW（确保周数两位数，如 01-53）
    return `${year}-${String(week).padStart(2, '0')}`;
  }
  const initData = async () => {
    await setFieldsValue({ weeks: dayjs(new Date()) });
    reload();
  };

  async function updateFactoryAreaList(e) {
    const { data } = await getfactoryarealist({ bu: e });
    updateSchema([
      {
        field: 'factoryArea',
        componentProps: {
          options: data,
        },
      },
    ]);
  }

  onMounted(async () => {
    const { weeks, factoryArea } = props.state;
    await updateFactoryAreaList('');
    updateSchema({
      field: 'bu',
      componentProps: {
        onChange: e => {
          updateFactoryAreaList(e);
          setFieldsValue({ factoryArea: '' });
        },
      },
    });
    if (weeks) {
      const [y, w] = weeks.split('-').map(Number);
      const weeksDayjs = dayjs().year(y).isoWeek(w);
      await setFieldsValue({ weeks: weeksDayjs, factoryArea, type: 0 });
    } else {
      await setFieldsValue({ type: 0, weeks: dayjs(new Date()) });
    }
    reload();
  });
</script>

<style lang="less" scoped>
  .lydc-content-wrapper {
    position: absolute;

    .lydc-content-dashboard-content {
      position: relative;

      .inventory-tip {
        font-size: 12px;
      }

      .compare-result {
        display: flex;
        align-items: center;
        position: absolute;
        font-size: 12px;
        left: 12px;
        height: 36px;
        bottom: 8px;
        width: 650px;
      }
    }
  }

  .btn-wrapper {
    margin-top: 16px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .left-btn {
    display: flex;

    button {
      margin-right: 16px;
    }

    // 选择第二个按钮
    button:nth-child(2) {
      border: #ff7b00 solid 1px;
      color: #ff7b00;
    }
  }

  ::v-deep(.header-orange) {
    color: #ff7b00;
  }

  ::v-deep(.cell-red) {
    color: red;
  }

  ::v-deep(.cell-gray) {
    color: gray;
    font-weight: 500;
  }

  .space-box {
    justify-content: space-between;
  }
</style>
