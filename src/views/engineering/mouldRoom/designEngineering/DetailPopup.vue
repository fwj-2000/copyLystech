<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="true"
    :title="t('common.detailText')"
    :destroyOnClose="true"
    :showFooter="false">
    <a-card class="lydc-content-wrapper-search-box mb-16px">
      <div class="title-stick">
        <div class="gun"></div>
        <div class="title">{{ t('common.baseinfo') }}</div>
      </div>
      <BasicForm @register="registerForm"> </BasicForm>

      <!-- <div class="files">
        <div class="files-item" v-for="(item, index) in fileList" :key="index">
          <div class="item-list">
            <div class="name">{{ item.name }}：</div>
            <div class="list-right">
              <a class="item-file-name ellipsis mr-10px" @click.stop="handlePreview(item)">{{ item.fileName }}</a>
              <div>
                <a-button type="link" @click="handleDownloadFile(item)" v-if="item.fileName">
                  <template #icon>
                    <i class="icon-ym icon-ym-btn-download"></i>
                  </template>
                </a-button>
                <div v-else>--</div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </a-card>

    <a-card style="margin-top: 10px">
      <div class="title-stick">
        <div class="gun"></div>
        <div class="title">BOM</div>
      </div>

      <Grid style="height: 300px">
        <template #IsRubberPart="{ row }">
          <div>{{ row.isRubberPart === 1 ? t('dict.YesOrNoStatus.1') : t('dict.YesOrNoStatus.2') }}</div>
        </template>
        <template #IsDrawOrder="{ row }">
          <div>{{ row.isDrawOrder === 1 ? t('dict.YesOrNoStatus.1') : t('dict.YesOrNoStatus.2') }}</div>
        </template>
        <template #IsLeaveMargin="{ row }">
          <div>{{ row.isLeaveMargin === 1 ? t('dict.YesOrNoStatus.1') : t('dict.YesOrNoStatus.2') }}</div>
        </template>
        <template #EnabledStatus="{ row }">
          <div>{{ row.enabledStatus === 1 ? t('dict.YesOrNoStatus.1') : t('dict.YesOrNoStatus.2') }}</div>
        </template>
      </Grid>
    </a-card>
  </BasicPopup>
  <PreviewModal ref="filePreviewRef" />
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicForm, useForm } from '/@/components/Form';
  import { column } from '/@/views/engineering/mouldRoom/moldBOM/config';
  import { newFormSchemas, repairFormSchemas } from './config';
  import { PreviewModal } from '/@/components/Upload';
  import { useGlobSetting } from '/@/hooks/setting';
  import dayjs from 'dayjs';

  const { t } = useI18n();
  const emits = defineEmits(['register', 'reload']);

  const type = ref('');
  const globSetting = useGlobSetting();
  const [registerPopup] = usePopupInner(init);

  const [registerForm, { setFieldsValue, resetSchema }] = useForm({
    // schemas: type.value === 'newMold' ? newFormSchemas : repairFormSchemas,
    layout: 'vertical',
    labelWidth: 220,
    baseColProps: {
      span: 6,
    },
    i18nConfig: {
      moduleCode: 'MoldApplyColumn',
      transferRange: ['placeholder', 'label'],
    },
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: type.value === 'newMold' ? 'engineering-mouldRoom-designEngineering-list-BOM' : 'engineering-mouldRoom-designEngineeringRepair-list-BOM',
      columns: column,
      pagerConfig: {
        autoHidden: true,
      },
      toolbarConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      scrollY: {
        enabled: false,
      },
      spanMethod(data) {
        const { row, $rowIndex: rowIndex, column, visibleData } = data;
        const spanFields = [
          'checkbox',
          'bomDocumentNumber',
          'projectCode',
          'productName',
          'bomVersion',
          'erpSystem',
          'productMaterials',
          'expenseAttribution',
          'action',
        ];
        const diffField = 'bomId';
        const cellValue = row[diffField];

        if (cellValue && spanFields.includes(column.field)) {
          const prevRow = visibleData[rowIndex - 1];

          // 如果上一行存在且相同，则合并到首行
          if (prevRow && prevRow[diffField] === cellValue) {
            return { rowspan: 0, colspan: 0 };
          }

          // 计算连续相同值的行数
          let countRowspan = 1;
          while (rowIndex + countRowspan < visibleData.length && visibleData[rowIndex + countRowspan][diffField] === cellValue) {
            countRowspan++;
          }

          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 };
          }
        }
      },
      i18nConfig: {
        moduleCode: 'MoldBomColumn',
      },
    },
  });

  const filePreviewRef = ref<any | null>(null);
  async function handlePreview(item) {
    const params = {
      name: item.fileName,
      filePath: item.filePath,
      previewType: 'localPreview',
      version: 2,
    };
    filePreviewRef.value?.init(params);
  }

  async function handleDownloadFile(item) {
    const { filePath, fileName } = item;
    window.open(`${globSetting.apiUrl}/api/Information/fileinfo/downloadfile?filePath=${filePath}&fileName=${fileName}`);
  }

  // const fileList = ref<{ name: string; fileName: string; filePath: string; type?: string }[]>([]);
  function init(data) {
    type.value = data.dataSourceType;
    const schemes = type.value === 'newMold' ? newFormSchemas : repairFormSchemas;
    resetSchema(schemes as any);
    setFieldsValue({
      factoryMoldNo: data.factoryMoldNo,
      moldNo: data.moldNo,
      projectName: data.projectName,
      productName: data.productName,
      factoryAreaName: data.factoryAreaName,
      t0DeliveryDate: dayjs(data.t0DeliveryDate).format('YYYY-MM-DD'),
      // customerDrawAttaName: data.customerDrawAttaName,
      // dfmAttaName: data.dfmAttaName,
      // drawing3dName: data.drawing3dName,
      // drawing2dName: data.drawing2dName,
      // drawingSpecialName: data.drawingSpecialName,
      remark: data.remark,
      creatorUserName: data.creatorUserName,
    });
    // fileList.value = [
    //   {
    //     name: '客户图纸',
    //     filePath: data.drawingSpecialUrl,
    //     fileName: data.drawingSpecialName,
    //     type: 'newMold',
    //   },
    //   {
    //     name: '附件',
    //     filePath: data.attachmentUrl,
    //     fileName: data.attachmentName,
    //     type: 'repairMold',
    //   },
    //   {
    //     name: 'DFM附件',
    //     filePath: data.dfmAttaUrl,
    //     fileName: data.dfmAttaName,
    //   },
    //   {
    //     name: '3D组立图',
    //     filePath: data.drawing3dUrl,
    //     fileName: data.drawing3dName,
    //   },
    //   {
    //     name: '2D图纸',
    //     filePath: data.drawing2dUrl,
    //     fileName: data.drawing2dName,
    //   },
    //   {
    //     name: '特殊做法文件',
    //     filePath: data.drawingSpecialUrl,
    //     fileName: data.drawingSpecialName,
    //   },
    // ];
    // if (data.dataSourceType === 'newMold') {
    //   fileList.value = fileList.value.filter(item => item.type !== 'repairMold');
    // }
    // if (data.dataSourceType === 'repairMold') {
    //   fileList.value = fileList.value.filter(item => item.type !== 'newMold');
    // }
    gridApi.grid.reloadData(data.bomList);
  }
</script>

<style lang="less" scoped>
  .title-stick {
    display: flex;
    align-items: center;

    .gun {
      border-radius: 2px;
      background: #ff7b00;
      width: 2px;
      height: 14px;
      margin-right: 10px;
    }

    .title {
      color: #1a1a1a;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 22px; /* 157.143% */
    }
  }

  .files {
    display: flex;
    flex-wrap: wrap;

    .files-item {
      width: 33%;
      margin-top: 4px;

      .item-list {
        display: flex;
        align-items: center;

        .name {
          flex-shrink: 0;
        }

        .list-right {
          flex: 1;
          display: flex;
          align-items: center;

          .item-file-name {
            max-width: 90%;
            word-break: break-all;
          }
        }
      }
    }
  }
</style>
