<template>
  <BasicModal
    draggable
    :title="t('dict.CommonCol.img')"
    showOkBtn
    destroy-on-close
    :width="900"
    :height="600"
    v-bind="$attrs"
    :closeFunc="confirmClose"
    :helpMessage="helpMessage"
    @register="registerModal"
    @ok="handleSubmit">
    <Grid class="mt-10px">
      <template #buttons>
        <UploadBtn ref="uploadBtnRef" accept="image/*" type="primary" :buttonText="t('component.upload.batchUpload')" @success="afterUpload" />
      </template>

      <template #message="{ row }">
        <span v-if="!row.message" style="color: rgb(82 196 26)">{{ t('component.batchImport.correct') }}</span>
        <span v-else style="color: rgb(255 77 79)">{{ row.message }}</span>
      </template>

      <template #imgName="{ row, rowIndex }">
        <span class="table-a" @click="handlePreview(rowIndex)">{{ row.imgName }}</span>
      </template>

      <template #action="{ row }">
        <TableAction :outside="true" :actions="getTableActions(row)" />
      </template>
    </Grid>

    <!-- 文件 预览页面 -->
    <PreviewModal ref="filePreviewRef" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ref } from 'vue';
  import { getImageTypeInfo, columns } from './batchUploadImageConfig';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { UploadBtn, PreviewModal } from '/@/components/Upload';
  import { TableAction, ActionItem } from '/@/components/Table';

  const [registerModal, { closeModal }] = useModalInner(init);
  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  const uploadBtnRef = ref<InstanceType<typeof UploadBtn>>();

  type TableData = {
    listField: string;
    message: string;
    insidePartNumber: string;
    imgType: string;
    imgName: string;
    url: string;
    name: string;
  };

  /** 提示消息 */
  const helpMessage = (t('dict.FilingsApply.imageRulesTip') + '\n' + t('dict.FilingsApply.imageExampleTip')).split('\n');

  /** 当前作业页面的数据的产品内部料号合集 */
  const partNumbers = ref<Array<string>>([]);
  /** 用于设置值的回调 */
  let callBack: (data: Array<TableData>) => void = (_data: Array<TableData>) => {};

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      id: 'productionDeal-fillings-maintain-batchUploadImageGrid',
      height: 500,
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      pagerConfig: {
        enabled: false,
      },
      toolbarConfig: {
        enabled: true,
        refresh: false,
        slots: {
          buttons: 'buttons',
        },
      },
      customConfig: {
        allowVisible: false,
      },
      columns,
    },
  });

  function getTableActions(row: any): ActionItem[] {
    return [
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDelete.bind(null, row),
      },
    ];
  }

  async function confirmClose() {
    return new Promise<boolean>(resolve => {
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('dict.FilingsApply.saveImageTip'),
        onOk: () => {
          return resolve(true);
        },
        onCancel: () => {
          return resolve(false);
        },
      });
    });
  }

  function handleDelete(row: any) {
    gridApi.remove(row);
  }

  /**
   * 处理图片列表，转换为表格数据格式
   * @param imageList 图片列表
   */
  function formatImageListToTableData(imageList: Array<{ filePath: string; fileName: string }>): Array<TableData> {
    if (!Array.isArray(imageList)) {
      return [];
    }

    /**
     * 根据`fileName`获取料号及文件类型
     * 如：
     * 800-RAAM043-0C00R-EU0-BCP
     * 800-RAAM043-0C00R-EU0-CCP-200PCS
     * 以`-`为标识，前4个部分为料号，后5个部分为文件类型
     *
     * `message`为错误信息，错误类型如下：
     *  1. 图片名称不符合格式
     *  2. 图片类型不存在
     *  3. 料号不存在于当前作业页面的数据中
     * 其他情况`message`赋值为`正确`
     *
     * `imgType`取`getImageTypeInfo`返回的内容`title`，如果不存在则赋值为空字符串
     */
    return imageList.map(({ filePath, fileName }) => {
      const parts = fileName.split('-').map(item => item.trim());
      let message = '';
      let insidePartNumber = '';
      let imgType = '';
      let listField = '';

      // 检查文件名格式
      if (parts.length < 5) {
        message = t('dict.FilingsApply.illegalImageName');
      } else {
        // 提取前4个部分作为料号
        insidePartNumber = parts.slice(0, 4).join('-');

        // 获取图片类型信息
        const imageTypeInfo = getImageTypeInfo(fileName);

        // 检查图片类型是否存在
        if (imageTypeInfo) {
          imgType = imageTypeInfo.title;
          listField = imageTypeInfo.field;
          // 检查料号是否存在于当前作业页面的数据中
          if (!partNumbers.value.includes(insidePartNumber)) {
            message = t('dict.FilingsApply.illegalInsidePartNumber');
          }
        } else {
          message = t('dict.FilingsApply.illegalImageType');
        }
      }

      return {
        message,
        insidePartNumber,
        imgType,
        listField,
        imgName: fileName,
        url: filePath,
        name: fileName,
      };
    });
  }

  function init(data: {
    imageList: Array<{ filePath: string; fileName: string }>;
    dataList?: Array<{ insidePartNumber: string }>;
    callBack?: (data: Array<TableData>) => void;
  }) {
    partNumbers.value = data.dataList?.map(item => item.insidePartNumber) || [];
    gridApi.reloadData(formatImageListToTableData(data.imageList));
    callBack = typeof data.callBack === 'function' ? data.callBack : (_data: Array<TableData>) => {};
  }

  function afterUpload(fileList: Array<any>) {
    gridApi.reloadData([...gridApi.grid.getTableData().tableData, ...formatImageListToTableData(fileList)]);
    uploadBtnRef.value?.clearUploadFileList();
  }

  function handleSubmit() {
    callBack(gridApi.grid.getTableData().tableData.filter(item => !item.message));
    createMessage.success(t('sys.api.operationSuccess'));
    closeModal();
  }

  const filePreviewRef = ref<any | null>(null);
  /**
   * 文件预览
   * @param index 行数据索引
   */
  async function handlePreview(index: number) {
    const params = {
      currentIndex: index,
      fileList: gridApi.grid.getTableData().tableData.map(item => ({
        name: item.imgName,
        url: item.url,
      })),
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    filePreviewRef.value?.init(params);
  }
</script>
