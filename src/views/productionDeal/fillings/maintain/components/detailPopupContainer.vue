<template>
  <Subtitle :title="t('dict.FilingsApplyColumn.ScDataStatus1')" />
  <BasicForm @register="registerApplyInfoForm" />
  <div class="h-550px">
    <Grid>
      <template #file="{ row }">
        <span class="table-a" @click="handlePreview(row)">{{ row.imageName }}</span>
      </template>
      <template #action="{ row }">
        <TableAction :outside="true" :actions="getTableActions(row)" />
      </template>
    </Grid>
  </div>

  <!-- 文件预览 -->
  <PreviewModal ref="filePreviewRef" />
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { downloadByUrl } from '/@/utils/file/download';
  import { getSchemas, getImageTableColumns, convertScientificNumber, formatImageUrl } from './detailPopupConfig';
  import { useI18n } from '/@/hooks/web/useI18n';

  import { BasicForm, useForm } from '/@/components/Form';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { Subtitle } from '/@/components/Subtitle';
  import { PreviewModal } from '/@/components/Upload';

  const { t } = useI18n();
  const isCanEdit = ref<boolean>(false);

  const [registerApplyInfoForm, { setFieldsValue: setApplyInfoFieldsValue, updateSchema }] = useForm({
    schemas: getSchemas() as any,
    layout: 'vertical',
    labelWidth: 'unset',
    baseColProps: {
      span: 4,
    },
    disabled: !isCanEdit.value,
    i18nConfig: {
      moduleCode: 'CustomsAffairsProduceColumn',
      transferRange: ['label'],
    },
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      columns: getImageTableColumns() as any,
      height: '',
      pagerConfig: {
        enabled: false,
      },
      toolbarConfig: {
        enabled: false,
      },
    },
  });

  function getTableActions(row: any): ActionItem[] {
    return [
      {
        label: t('common.downloadText'),
        onClick: handleDownload.bind(null, row),
      },
    ];
  }

  function handleDownload(row: any) {
    downloadByUrl({ url: row.url });
  }

  const filePreviewRef = ref<any>(null);
  // 文件预览
  function handlePreview({ url, imageName }) {
    // 文件预览
    const params = {
      name: imageName,
      url: url,
    };
    filePreviewRef.value?.init(params);
  }

  function initData(data: any, editable = false, isNarrow = false) {
    isCanEdit.value = editable;
    updateSchema(getSchemas(isNarrow) as any);
    // 转换科学计数法
    data.backProductWeight = convertScientificNumber(data.backProductWeight);
    data.productWeight = convertScientificNumber(data.productWeight);
    data.wasteWeight = convertScientificNumber(data.wasteWeight);

    setApplyInfoFieldsValue(data);
    // 图片处理
    const imageList: Array<any> = [];
    ['productWeightPicture', 'backProductWeightPicture', 'productPicture', 'productPictureBack'].forEach(key => {
      const value = data[key];
      if (Array.isArray(value)) {
        imageList.push(
          ...value.map(item => ({
            url: formatImageUrl(item.url),
            imageName: item.name,
          })),
        );
      }
      if (typeof value === 'string') {
        imageList.push({
          url: formatImageUrl(value),
          imageName: data[`${key}Name`],
        });
      }
    });
    gridApi.reloadData(imageList);
  }

  defineExpose({
    initData,
  });
</script>
