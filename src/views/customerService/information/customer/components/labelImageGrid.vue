<template>
  <Grid style="height: 450px">
    <template #toolbar-actions>
      <!-- 上传图片 -->
      <UploadBtn type="primary" accept="image/*" :buttonText="t('common.uploadImageText')" @success="afterUploadImage" />
      <!-- 启用 -->
      <a-button type="primary" :disabled="disabled" ghost @click="handleEnable">
        {{ t('common.enableText') }}
      </a-button>
      <!-- 禁用 -->
      <a-button type="primary" :disabled="disabled" ghost danger @click="handleDisable">
        {{ t('common.disableText') }}
      </a-button>
    </template>

    <!-- 标签图片 -->
    <template #labelImage="{ row }">
      <span class="table-a" @click="() => handlePreviewImage(row)">
        {{ row.labelImageName || '' }}
      </span>
    </template>
    <!-- 操作 -->
    <template #action="{ row }">
      <TableAction outside :actions="getActions(row)" />
    </template>
  </Grid>

  <PreviewModal ref="filePreviewRef" />
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getCustomerLabelImageList, deleteLabelImage, uploadLabelImage, enableLabelImage, disableLabelImage } from '/@/api/business/customerCode';
  import { useMessage } from '/@/hooks/web/useMessage';

  import UploadBtn from '/@/components/Upload/src/components/UploadBtn.vue';
  import { PreviewModal } from '/@/components/Upload';
  import { TableAction } from '/@/components/Table';

  const { t } = useI18n();
  const emit = defineEmits(['reload', 'updateList']);

  const { createConfirm, createMessage } = useMessage();

  const columns: Array<any> = [
    {
      type: 'checkbox',
      field: 'checkbox',
      width: 50,
    },
    { title: t('component.table.index'), type: 'seq', field: 'index', width: 50 },
    // 标签图片
    {
      title: t('dict.CustomerColumn.labelImage'),
      field: 'labelImageName',
      minWidth: 100,
      slots: {
        default: 'labelImage',
      },
    },
    // 是否启用
    {
      title: t('dict.CommonCol.isEnable'),
      field: 'enable',
      width: 100,
      cellRender: {
        name: 'Tag',
        options: [
          { id: true, fullName: t('common.enableText'), theme: 'green' },
          { id: false, fullName: t('common.disableText'), theme: 'red' },
        ],
      },
    },
    // 操作
    {
      title: t('common.action'),
      field: 'action',
      slots: { default: 'action' },
      width: 60,
      fixed: 'right',
    },
  ];

  const [Grid, { setLoading, reload, clearSelectedRowKeys, getSelectRowKeys }] = useVbenVxeGrid({
    gridOptions: {
      api: getTableData,
      columns,
      toolbarConfig: {
        enabled: true,
        export: false,
        custom: false,
      },
      editConfig: {
        trigger: 'click',
        mode: 'row',
      },
      pagerConfig: {
        autoHidden: true,
      },
      rowConfig: {
        keyField: 'id',
      },
    },
  });

  /** 请求参数，记录当前的`客户信息id(customerId)`，`场景类型编码(sceneTypeCode)` */
  const query = ref({ customerId: '', sceneTypeCode: '' });
  /**
   * 获取表格数据
   * @param params
   */
  function getTableData(params: any) {
    clearSelectedRowKeys();
    if (disabled.value) {
      return Promise.resolve({
        data: {
          list: [],
          pagination: {
            total: 0,
          },
        },
      });
    }
    return getCustomerLabelImageList({
      ...params,
      id: query.value.customerId,
      sceneType: query.value.sceneTypeCode,
    });
  }

  /**
   * 禁用表格编辑状态
   */
  const disabled = computed(() => {
    return !query.value.customerId || !query.value.sceneTypeCode;
  });

  /** 获取操作列配置 */
  function getActions(row: any) {
    return [
      {
        icon: 'icon-ym icon-ym-delete text-orange-400 cursor-pointer mx-1',
        tooltip: t('common.delText'),
        onClick: deleteTableRow.bind(null, row),
      },
    ];
  }

  /**
   * 删除标签图片数据
   * @param row
   * @param index
   */
  async function deleteTableRow(row: any) {
    if (disabled.value) {
      return false;
    }

    if (row.enable) {
      return createMessage.warning(t('dict.Customer.deleteEnableTip'));
    }

    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.delTip'),
      onOk: async () => {
        setLoading(true);
        return deleteLabelImage(row.id)
          .then(() => {
            createMessage.success(t('common.delSuccess'));
            reload();
          })
          .catch(() => {})
          .finally(() => {
            setLoading(false);
          });
      },
    });
  }

  /** 启用 */
  function handleEnable() {
    const rowKeys = getSelectRowKeys();
    if (rowKeys.length === 0 || rowKeys.length > 1) {
      return createMessage.warning(t('common.selectSingleDataTip'));
    }

    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.beforeEnableTip'),
      onOk: async () => {
        setLoading(true);
        return enableLabelImage(rowKeys[0], query.value.sceneTypeCode)
          .then(() => {
            createMessage.success(t('sys.api.operationSuccess'));
            reload();
          })
          .catch(() => {})
          .finally(() => {
            setLoading(false);
          });
      },
    });
  }

  /** 禁用 */
  function handleDisable() {
    const rowKeys = getSelectRowKeys();
    if (rowKeys.length === 0 || rowKeys.length > 1) {
      return createMessage.warning(t('common.selectSingleDataTip'));
    }

    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.beforeEnableTip'),
      onOk: async () => {
        setLoading(true);
        return disableLabelImage(rowKeys[0])
          .then(() => {
            createMessage.success(t('sys.api.operationSuccess'));
            reload();
          })
          .catch(() => {})
          .finally(() => {
            setLoading(false);
          });
      },
    });
  }

  /**
   * 重新加载表格数据
   * @param customerId 客户主信息id
   * @param sceneTypeCode 场景类型编码
   */
  function reloadTableData(customerId: string, sceneTypeCode: string) {
    if (query.value.customerId === customerId && query.value.sceneTypeCode === sceneTypeCode) {
      return false;
    }

    query.value = { customerId, sceneTypeCode };
    reload();
  }

  const filePreviewRef = ref<InstanceType<typeof PreviewModal>>();
  /**
   * 图片预览
   * @param row
   */
  function handlePreviewImage(row: any) {
    filePreviewRef.value &&
      filePreviewRef.value.init({
        previewType: 'localPreview',
        filePath: row.labelImagePath,
        // @ts-ignore
        name: row.labelImageName,
      });
  }

  /** 拿到服务器文件的名称和链接，调用接口保存到对应的场景中 */
  function afterUploadImage(uploadFileList: Array<{ filePath: string; fileName: string }>) {
    setLoading(true);
    uploadLabelImage(query.value.customerId, query.value.sceneTypeCode, uploadFileList)
      .then(() => {
        // 保存，则给出提示并且重新加载数据
        createMessage.success(t('component.upload.uploadSuccess'));
        reload();
      })
      .finally(() => {
        setLoading(false);
      });
  }

  defineExpose({ reloadTableData });
</script>
