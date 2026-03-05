<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicForm @register="registerForm" @submit="reload" @reset="initData" />
      </div>

      <div class="lydc-content-dashboard-content bg-white h-full">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <!-- 批量导出 -->
              <a-button v-auth="'btn_download'" class="mr-12px" @click="handleExport">{{ t('common.batchExport') }}</a-button>
            </a-space>
          </template>
          <template #compareType1="{ row }">
            <div class="table-a" @click="handleDetail(row, '', '1')">{{ row.uploadNumber }}</div>
          </template>
          <template #compareType2="{ row }">
            <div class="table-a" @click="handleDetail(row, '', '2')">{{ row.benchmarkingOK }}</div>
          </template>
          <template #compareType3="{ row }">
            <div class="table-a" @click="handleDetail(row, '', '3')">{{ row.processing }}</div>
          </template>
          <template #compareType41="{ row }">
            <div class="table-a" @click="handleDetail(row, '', '41')">{{ row.cleaned1 }}</div>
          </template>
          <template #compareType42="{ row }">
            <div class="table-a" @click="handleDetail(row, '', '42')">{{ row.cleaned2 }}</div>
          </template>
          <template #compareType43="{ row }">
            <div class="table-a" @click="handleDetail(row, '', '43')">{{ row.cleaned3 }}</div>
          </template>
          <template #compareType44="{ row }">
            <div class="table-a" @click="handleDetail(row, '', '44')">{{ row.cleaned4 }}</div>
          </template>
          <template #compareType45="{ row }">
            <div class="table-a" @click="handleDetail(row, '', '45')">{{ row.cleaned5 }}</div>
          </template>
          <template #compareType46="{ row }">
            <div class="table-a" @click="handleDetail(row, '', '46')">{{ row.cleaned6 }}</div>
          </template>
          <template #compareType5="{ row }">
            <div class="table-a" @click="handleDetail(row, '', '5')">{{ row.NG1 }}</div>
          </template>
          <template #compareType6="{ row }">
            <div class="table-a" @click="handleDetail(row, '', '6')">{{ row.NG2 }}</div>
          </template>
          <template #compareType7="{ row }">
            <div class="table-a" @click="handleDetail(row, '', '7')">{{ row.NG5 }}</div>
          </template>
          <template #factoryAreaCountQty="{ row }">
            <div class="table-a" @click="handleDetail(row, '', '')">{{ row.factoryAreaCountQty }}</div>
          </template>
          <template #equipmentCategoryQty1="{ row }">
            <div class="table-a" @click="handleDetail(row, 1, '')">{{ row.equipmentCategoryQty1 }}</div>
          </template>
          <template #equipmentCategoryQty2="{ row }">
            <div class="table-a" @click="handleDetail(row, 2, '')">{{ row.equipmentCategoryQty2 }}</div>
          </template>
          <template #equipmentCategoryQty3="{ row }">
            <div class="table-a" @click="handleDetail(row, 3, '')">{{ row.equipmentCategoryQty3 }}</div>
          </template>
          <template #equipmentCategoryQty4="{ row }">
            <div class="table-a" @click="handleDetail(row, 4, '')">{{ row.equipmentCategoryQty4 }}</div>
          </template>
          <template #equipmentCategoryQty6="{ row }">
            <div class="table-a" @click="handleDetail(row, 6, '')">{{ row.equipmentCategoryQty6 }}</div>
          </template>
          <template #equipmentCategoryQty5="{ row }">
            <div class="table-a" @click="handleDetail(row, 5, '')">{{ row.equipmentCategoryQty5 }}</div>
          </template>
          <template #equipmentCategoryQty7="{ row }">
            <div class="table-a" @click="handleDetail(row, 7, '')">{{ row.equipmentCategoryQty7 }}</div>
          </template>
          <template #equipmentCategoryQty8="{ row }">
            <div class="table-a" @click="handleDetail(row, 8, '')">{{ row.equipmentCategoryQty8 }}</div>
          </template>
          <template #equipmentCategoryQty9="{ row }">
            <div class="table-a" @click="handleDetail(row, 9, '')">{{ row.equipmentCategoryQty9 }}</div>
          </template>
          <template #equipmentCategoryQty10="{ row }">
            <div class="table-a" @click="handleDetail(row, 10, '')">{{ row.equipmentCategoryQty10 }}</div>
          </template>
          <template #equipmentCategoryQty11="{ row }">
            <div class="table-a" @click="handleDetail(row, 11, '')">{{ row.equipmentCategoryQty11 }}</div>
          </template>
        </Grid>
      </div>
    </div>
    <DetailPopup @register="registerDetail" @reload="reload" />
    <ExportModal @register="registerExportModal" @export="exportAction" />
  </div>
</template>
<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { onMounted } from 'vue';
  import { usePopup } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicForm, useForm } from '/@/components/Form';
  import DetailPopup from './components/Detailopup.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getColumn, equipmentAnalysisSchema } from './config';
  import { useModal } from '/@/components/Modal';
  import { downloadByUrl } from '/@/utils/file/download';
  import { getfactoryarealist, countlist, exportcount } from '/@/api/equipment/equipmentLedger';
  import ExportModal from '/@/components/ExportModal/index.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import dayjs from 'dayjs';

  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const { createMessage } = useMessage();

  defineOptions({ name: 'equipment-equipmentAnalysis' });

  const [registerExportModal, { openModal: openExportModal, closeModal }] = useModal();
  const [registerDetail, { openPopup: openDetailPop }] = usePopup();

  const [registerForm, { setFieldsValue, getFieldsValue, updateSchema }] = useForm({
    baseColProps: { span: 4 },
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
    autoAdvancedLine: 1,
    actionColOptions: {
      span: 3,
    },
    i18nConfig: {
      moduleCode: 'EquipmentLedgerColumn',
      transferRange: ['placeholder'],
    },
    schemas: equipmentAnalysisSchema,
  });

  const [Grid, { reload, getFetchParams }] = useVbenVxeGrid({
    gridOptions: {
      id: 'equipment-equipmentAnalysis-list',
      columns: getColumn(),
      api: countlist,
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'EquipmentLedgerColumn',
      },
      proxyConfig: {
        response: {
          result: 'data',
        },
      },
      pagerConfig: {
        autoHidden: true,
      },
      beforeFetch: params => {
        return {
          ...params,
          ...getFieldsValue(),
          bu: getFieldsValue().bu && getFieldsValue().bu.join(','),
          weeks: getWeeks(),
        };
      },
    },
  });

  function getWeeks() {
    const weeksDayjs = dayjs(getFieldsValue().weeks);
    return getFieldsValue().weeks ? `${weeksDayjs.endOf('week').year()}-${weeksDayjs.endOf('week').week().toString().padStart(2, '0')}` : '';
  }

  // 新增
  const handleDetail = (row, equipmentCategory, compareType) => {
    if (!hasBtnP('btn_detail')) return createMessage.warning(t('dict.CommonCol.noViewPermissionTip'));
    const { type, factoryArea, bu } = row;
    const fieldsValue = getFieldsValue();
    const params = {
      ...fieldsValue,
      type,
      equipmentCategory,
      compareType,
      factoryArea,
      bu,
      weeks: getWeeks(),
    };
    openDetailPop(true, params);
  };

  // 批量导出
  const handleExport = async () => {
    const fieldsValue = getFieldsValue();
    openExportModal(true, {
      listQuery: {
        ...(await getFetchParams()),
        ...fieldsValue,
        weeks: getWeeks(),
      },
      exportOptions: getColumn(),
      nameProps: 'title',
      idProps: 'field',
    });
  };
  const exportAction = query => {
    exportcount(query).then(res => {
      if (!res.data.url) return;
      downloadByUrl({ url: res.data.url });
      closeModal();
    });
  };

  const initData = async () => {
    await setFieldsValue({ weeks: dayjs(new Date()) });
    reload();
  };

  async function updateFactoryAreaList(e) {
    const { data } = await getfactoryarealist({ bu: e.join(',') });
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
    await setFieldsValue({ weeks: dayjs(new Date()) });
    updateFactoryAreaList([]);
    updateSchema({
      field: 'bu',
      componentProps: {
        onChange: e => {
          updateFactoryAreaList(e);
          setFieldsValue({ factoryArea: '' });
        },
      },
    });
    reload();
  });
</script>

<style lang="less" scoped>
  .lydc-content-wrapper {
    position: absolute;
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

  //:deep(.lydc-basic-table-action button i) {
  //  font-size: 20px;
  //}
</style>
