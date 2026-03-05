<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-space>
              <a-button v-auth="'upload_image'" type="primary" @click="handleToUpload">{{ t('common.uploadImageText') }}</a-button>
              <a-button v-auth="'btn_batchRemove'" class="mr-12px" danger @click="handelDelete">{{ t('common.batchDelText') }}</a-button>
            </a-space>
          </template>
          <template #sceneImage="{ rowIndex, row }">
            <div @click="imagePreviewProps(row)" class="table-a cursor-pointer">{{ t('common.viewDetails') }}</div>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
  </div>
  <editUpload @register="registerModal" @reload="gridApi.reload" />
  <detailImage @register="registerDetailModal" />
</template>

<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useModal } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { column } from './config';
  import { TableAction } from '/@/components/Table';
  import { getUploadImage, blukDeleteUploadImage } from '/@/api/tools/uploadImage';
  import { dateUtil } from '/@/utils/dateUtil';
  import { getFactorylist } from '/@/api/business/projectMember';
  import { useBaseStore } from '/@/store/modules/base';
  import { useMessage } from '/@/hooks/web/useMessage';
  import editUpload from './components/editUpload.vue';
  import detailImage from './components/detailImage.vue';

  defineOptions({ name: 'tools-uploadImage-index' });
  const baseStore = useBaseStore();
  const { createMessage, createConfirm } = useMessage();
  const [registerModal, { openModal }] = useModal();
  const [registerDetailModal, { openModal: openDetailModal }] = useModal();
  const { t } = useI18n();
  const schemaForm = [
    {
      label: '',
      fieldName: 'imageType',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('imageType'),
        placeholder: t('dict.imageType'), //'图片类型',
        labelField: 'fullName',
        valueField: 'enCode',
        notFoundContent: null,
        immediate: true,
        style: { width: '220px' },
      },
    },
    {
      fieldName: 'mainProcess',
      label: '',
      component: 'ApiSelect',
      // 默认选择模切
      componentProps: {
        api: () => baseStore.getDictionaryData('MainProcess'),
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        placeholder: '主要制程',
        style: 'width: 100%',
        allowClear: true,
        onChange: () => {
          gridApi.setFieldValue('factoryCode', '');
        },
      },
    },
    {
      fieldName: 'factoryCode',
      i18nField: 'factoryName',
      label: '',
      component: 'ApiSelect',
      componentProps: {
        api: getFactorylist,
        apiSearch: {
          show: true,
          searchName: 'code',
        },
        labelField: 'Name',
        valueField: 'Code',
        resultField: 'data',
        beforeFetch: async params => {
          const { mainProcess } = (await gridApi.formApi.getValues()) as any;
          // mainProcess ? (params.mainProcess = mainProcess) : '';
          if (mainProcess) {
            params.mainProcess = mainProcess;
          }
          return params;
        },
        alwaysLoad: true,
        nameFormat: ['Name', '/', 'Code'],
        showSearch: true,
        immediate: false,
        filterOption: false,
        placeholder: '请选择工厂',
      },
    },
    {
      label: '',
      fieldName: 'region',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.PurchaseQuotationColumn.region'), //'区域',
        submitOnPressEnter: true,
      },
    },
    {
      fieldName: 'creatorUserId',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: t('dict.CommonCol.uploadUserName'), //'上传人',
        allowClear: true,
      },
    },

    {
      fieldName: 'pickerVal',
      label: '',
      component: 'RangePicker',
    },
  ];
  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-7 gap-4',
      schema: schemaForm,
    },
    gridOptions: {
      id: 'tools-uploadImage',
      api: getUploadImage,
      columns: column,
      showIndexColumn: true,
      pagerConfig: {
        autoHidden: false,
      },
      beforeFetch: params => {
        const _params = {
          ...params,
        };
        if (params.pickerVal && params.pickerVal.length > 0) {
          _params.creatorTimeStart = dateUtil(params.pickerVal[0]).valueOf();
          _params.creatorTimeEnd = dateUtil(params.pickerVal[1]).endOf('day').valueOf();
          delete _params.pickerVal;
        }
        return _params;
      },
    },
  });

  function getTableActions(record) {
    return [
      {
        icon: 'icon-ym icon-ym-edit',
        onClick: handleRuleEdit.bind(null, record),
        auth: 'btn_edit',
        tooltip: t('common.editText'),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: onDelete.bind(null, record.id),
        },
        auth: 'btn_remove',
        tooltip: t('common.delText'),
      },
    ];
  }

  const handleRuleEdit = (record: any) => {
    openModal(true, record);
  };
  async function onDelete(id) {
    blukDeleteUploadImage([id]).then(res => {
      createMessage.success(res.msg);
      gridApi.reload();
    });
  }
  // 批量删除
  const handelDelete = async () => {
    const ids = gridApi.getSelectRowKeys();
    if (!ids.length) return createMessage.warning(t('dict.CheckDataTip'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.PerformBatchDeletionTip'),
      onOk: async () => {
        // 获取勾选的数据
        const res = await blukDeleteUploadImage(ids);
        if (res.code === 200) {
          createMessage.success(res.msg);
          gridApi.reload();
        }
      },
    });
  };
  function imagePreviewProps(record) {
    openDetailModal(true, record);
  }
  /** 上传按钮事件处理 */
  async function handleToUpload() {
    openModal(true, {});
  }
</script>
