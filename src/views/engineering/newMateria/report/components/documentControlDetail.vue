<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="true"
    :title="t('common.detailText')"
    destroyOnClose
    class="full-popup">
    <div class="box">
      <Grid>
        <template #files="{ row }">
          <span v-if="row.materialDevelopImportId" class="table-a" @click="handleFileView(row)"> {{ t('common.detailText') }} </span>
        </template>
      </Grid>
    </div>
  </BasicPopup>

  <FileListModal @register="registerFileList" />
</template>

<script setup lang="ts">
  import { getDetails } from '/@/api/structure/materialCode';
  import dayjs from 'dayjs';
  import { useModal } from '/@/components/Modal';
  import { fileDownload, getFiles } from '/@/api/purchase/importMateria';
  import { useI18n } from '/@/hooks/web/useI18n';

  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { FileListModal } from '/@/components/Upload';

  const emits = defineEmits(['reload']);
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { t } = useI18n();

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      formConfig: {
        enabled: false,
      },
      columns: [
        {
          field: 'seq',
          type: 'seq',
          width: '50',
          align: 'center',
        },
        { title: '主要制程', field: 'mainProcessDesc', minWidth: '160' },
        { title: '材料内部料号', field: 'materialCode', minWidth: '160' },
        {
          title: '材料归属',
          field: 'materialAreaName',
          i18nFile: 'materialAreaName',
          minWidth: 160,
        },
        {
          title: '材料形态',
          field: 'materialForm',
          minWidth: 160,
        },
        { title: '原厂商型号', field: 'originalModelNumber', minWidth: '160' },
        {
          title: '供应商简称',
          field: 'supplierName',
          minWidth: 160,
        },
        {
          title: '原厂商简称',
          field: 'originalManufacturerName',
          minWidth: 160,
        },
        {
          title: '材料类型',
          field: 'materialClassName',
          minWidth: 160,
        },
        { title: '三级分类', field: 'threeLevelName', minWidth: '160' },
        {
          title: '材料宽度(MM)',
          field: 'materialWidth',
          minWidth: 160,
        },
        {
          title: '材料长度(M)',
          field: 'materialLength',
          minWidth: 160,
        },
        {
          title: '总厚度',
          field: 'totalThickness',
          minWidth: 160,
        },
        { title: '材料规格', field: 'materialSpec', minWidth: '160' },
        {
          title: '厚度单位',
          field: 'thicknessUnit',
          minWidth: 160,
        },
        {
          title: '基材类型',
          field: 'materialQualityName',
          i18nField: 'materialQualityName',
          minWidth: 160,
        },
        { title: '基材厚度', field: 'substrateThickness', minWidth: '160' },
        { title: '涂层厚度', field: 'tds', minWidth: '160' },
        { title: '厚度公差', field: 'tolerance', minWidth: '160' },
        {
          title: '涂层类型',
          field: 'coatingType',
          minWidth: 160,
        },
        { title: '颜色', field: 'materialColor', minWidth: '160' },
        { title: '克重(G)', field: 'grammage', minWidth: '160' },
        {
          title: '抗静电功能',
          field: 'antistaticRequirements',
          minWidth: 160,
        },
        {
          title: '结构组成',
          field: 'layers',
          minWidth: 160,
        },
        { title: '附膜', field: 'appendage', minWidth: '160' },
        { title: '其他要求', field: 'otherRequirements', minWidth: '160' },
        { title: '材料描述', field: 'materialDesc', minWidth: '160' },
        { title: '技术资料', field: 'files', slots: { default: 'files' }, minWidth: '160' },
        {
          title: '环保资料失效日期',
          field: 'dataInvalidTime',
          minWidth: 160,
        },
        { title: '是否可选', field: 'isStrategyMaterialDesc', minWidth: '160' },
        { title: '不可选备注', field: 'strategyMaterialRemarks', minWidth: '160' },
      ],
      keyboardConfig: {
        isBack: false,
      },
      pagerConfig: {
        enabled: false,
      },
      editConfig: {
        enabled: true,
        trigger: 'dblclick',
        mode: 'row',
      },
      toolbarConfig: {
        refresh: false,
        custom: false,
      },
    },
  });

  async function init(data) {
    changeLoading(true);
    try {
      const r = await getDetails(data.ids);
      if (r.code == 200) {
        const list = r.data.map(item => {
          return {
            ...item,
            dataInvalidTime: item.dataInvalidTime ? dayjs(item.dataInvalidTime).format('YYYY/MM/DD') : '',
          };
        });
        gridApi.grid.reloadData(list);
      }
    } catch (error) {
      closePopup();
    }
    changeLoading(false);
  }

  const [registerFileList, { openModal: openFileList }] = useModal();
  function handleFileView(record: any) {
    if (record.materialDevelopImportId) {
      openFileList(true, {
        id: record.materialDevelopImportId,
        downloadApi: fileDownload,
        listApi: getFiles,
        hideVersion: true,
      });
    }
  }
</script>

<style lang="less" scoped>
  .box {
    padding: 10px;
    height: calc(100% - 38px);
  }

  .table-a {
    color: #ff7b00;
    cursor: pointer;
  }
</style>
