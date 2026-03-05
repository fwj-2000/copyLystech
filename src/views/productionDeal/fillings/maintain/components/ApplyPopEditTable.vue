<template>
  <div class="h-full requirement-pop p-10px">
    <Subtitle :title="t('dict.FilingsApplyColumn.ScDataStatus1')" class="mt-8px" :extra="{ show: false, hideAdd: true }">
      <template #afterTitle>
        <UploadBtn
          ref="uploadBtnRef"
          :buttonProps="{
            ghost: true,
          }"
          accept="image/*"
          type="primary"
          :buttonText="t('component.upload.batchUpload')"
          class="hidden"
          :customUpload="customUpload"
          @success="showBatchUploadImageModal" />
      </template>
    </Subtitle>
    <Grid style="height: calc(100% - 56px)">
      <template #image="{ row }">
        <a-image v-if="row.productPicture" :width="50" :height="50" :src="row.productPicture" object-fit="cover" loading="lazy" />
        <span v-else>{{ t('common.pendingUpload') }}</span>
      </template>
      <template #imageCounter="{ row }">
        <span v-if="row.imageCounter > 0" class="table-a" @click="() => showUploadImageModal(row)">
          {{ `${t('component.upload.uploaded')}(${row.imageCounter})` }}
        </span>
        <span v-else style="color: #1a1a1a">
          {{ t('common.pendingUpload') }}
        </span>
      </template>
      <template #action="{ row }">
        <TableAction :outside="true" :actions="getTableActions(row)" />
      </template>
    </Grid>

    <UploadImageModal @register="registerUploadImageModal" />
    <BatchUploadImageModal @register="registerBatchUploadImageModal" />
  </div>
</template>

<script lang="ts" setup>
  import type { VxeTableGridOptions } from '/@/adapter/vxe-table';

  import { reactive, nextTick, ref } from 'vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useModal } from '/@/components/Modal';
  import { pick, debounce } from 'lodash-es';
  import { getEditTableColumn, editRules, changeBackProductWeight, changeProductWeight } from './ApplyPopConfig';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { uploadfiles } from '/@/api/basic/common';

  import { TableAction, ActionItem } from '/@/components/Table';
  import { Subtitle } from '/@/components/Subtitle';
  import UploadImageModal from './uploadImageModal.vue';
  import { UploadBtn } from '/@/components/Upload';
  import BatchUploadImageModal from './batchUploadImageModal.vue';

  const emits = defineEmits(['update:uploading']);
  const { createMessage, createConfirm } = useMessage();
  const { t } = useI18n();

  interface State {
    ids: Array<any>;
    initFields: any;
  }

  const state = reactive<State>({
    ids: [],
    initFields: {
      insidePartNumber: '',
      factory: '',
      sellCorporation: '',
      filingsLanguage: '',
      prot: '',
      shipmentType: '',
      pdPersonId: '',
      immediateCustomerPartNumber: '',
      terminalCustomerPartNumber: '',
      immediateCustomerName: '',
    },
  });

  const gridOptions: DeepPartial<VxeTableGridOptions<any>> = {
    id: 'productionDeal-fillings-maintain-edit',
    columns: getEditTableColumn() as any,
    height: 'auto',
    keepSource: true,
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    editRules,
    rowConfig: {
      keyField: '_X_ROW_KEY',
    },
    areaConfig: {
      multiple: true, // 是否启用多区域选取功能
    },
    data: [{ ...state.initFields }],
    showOverflow: false,
    toolbarConfig: {
      enabled: false,
    },
    clipConfig: {
      isPaste: true,
      afterPasteMethod: handleAfterPaster,
      beforePasteMethod: ({ targetAreas }) => {
        // 粘帖前的校验处理
        if (targetAreas.length === 0) {
          return false;
        }
        const { cols } = targetAreas[0];
        for (const col of cols) {
          if (
            // 不是可编辑单元格，禁止粘帖，判断`col.editRender.enabled === false`是因为在配置`editRender.name`的情况下，可以开启编辑，但是此时`col.editRender.enabled`可能为`undefined`
            !col.editRender ||
            col.editRender.enabled === false ||
            col.editRender.props?.disabled === true
          ) {
            createMessage.warning(t('common.noPastingTip'));
            return false;
          }
        }
        return true;
      },
    },
    // @ts-ignore
    i18nConfig: {
      moduleCode: 'CustomsAffairsProduceColumn',
    },
    pagerConfig: {
      enabled: false,
    },
  };
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions,
    gridEvents: {
      // @ts-ignore
      'cell-delete-value': ({ row, column }) => {
        changeBackProductWeight(row);
        changeProductWeight(row);
      },
    },
  });

  function getTableActions(row: any): ActionItem[] {
    return [
      {
        label: '',
        icon: 'icon-ym icon-ym-btn-upload',
        tooltip: t('component.upload.uploadFile'),
        onClick: showUploadImageModal.bind(null, row, false),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        tooltip: t('common.delText'),
        onClick: handleDelete.bind(null, row),
      },
    ];
  }

  function handleAfterPaster({ targetAreas }) {
    if (targetAreas.length === 0) {
      return false;
    }
    const { /** cols, */ rows } = targetAreas[0];
    rows.forEach((row: any) => {
      changeBackProductWeight(row);
      changeProductWeight(row);
    });

    return true;
  }

  /** 获取图片数量 */
  function getImageCount(row: any) {
    return +row.productWeightPicture?.length + +row.backProductWeightPicture?.length + +row.productPicture?.length + +row.productPictureBack?.length;
  }

  const [registerUploadImageModal, { openModal: openUploadImageModal }] = useModal();
  /** 打开上传图片弹窗 */
  function showUploadImageModal(row: any, disabled: boolean = false) {
    openUploadImageModal(true, {
      productWeightPicture: row.productWeightPicture || [],
      backProductWeightPicture: row.backProductWeightPicture || [],
      productPicture: row.productPicture || [],
      productPictureBack: row.productPictureBack || [],
      disabled,
      callBack: (data: any) => {
        gridApi.grid.setRow(row, { ...data, imageCounter: getImageCount(data) });
      },
    });
  }

  const uploadBtnRef = ref<InstanceType<typeof UploadBtn>>();
  /** 点击上传按钮 */
  function handleClickUploadBtn() {
    uploadBtnRef.value?.click();
  }

  const uploadFileTasks = ref<Array<Promise<any>>>([]);
  /**
   * 自定义上传方法，主要是为页面加载状态的显示，和批量上传图片弹窗的显示提供合适的时机
   * 实际上传功能与`UploadBtn`组件的`beforeUpload`方法的默认上传方式相同
   */
  function customUpload(file: File) {
    uploadFileTasks.value.push(
      uploadfiles({
        fileList: file,
      }),
    );
    debounceCustomUpload();
    return false;
  }

  const debounceCustomUpload = debounce(() => {
    emits('update:uploading', true);
    Promise.all(uploadFileTasks.value)
      .then(res => {
        uploadFileTasks.value.length = 0;
        showBatchUploadImageModal(res.map(item => ({ filePath: item.data[0].fullPath, fileName: item.data[0].originFileName })));
      })
      .finally(() => {
        emits('update:uploading', false);
      });
  }, 300);

  const [registerBatchUploadImageModal, { openModal: openBatchUploadImageModal }] = useModal();
  /** 打开批量上传图片弹窗 */
  function showBatchUploadImageModal(imageList: Array<{ filePath: string; fileName: string }>) {
    openBatchUploadImageModal(true, {
      imageList,
      dataList: gridApi.getDataSource(),
      callBack: (list: Array<{ insidePartNumber: string; listField: string; url: string; name: string }>) => {
        // 根据`insidePartNumber`以及`listField`给list数据分组，将`listField`相同的项放到一个数组中，数组元素为{ url, name }
        const groupMap: Map<string, Map<string, Array<{ url: string; name: string }>>> = new Map();
        list.forEach(item => {
          if (!groupMap.has(item.insidePartNumber)) {
            groupMap.set(item.insidePartNumber, new Map());
          }
          if (!groupMap.get(item.insidePartNumber)!.has(item.listField)) {
            groupMap.get(item.insidePartNumber)!.set(item.listField, []);
          }
          groupMap.get(item.insidePartNumber)!.get(item.listField)!.push({ url: item.url, name: item.name });
        });
        // 然后，从`gridApi.getDataSource`获取`insidePartNumber`匹配的行数据，根据`listField`覆盖行数据中对应的`listField`
        gridApi.getDataSource().forEach((row: any) => {
          const target = groupMap.get(row.insidePartNumber);
          if (target) {
            const keys = target.keys();
            for (const key of keys) {
              row[key] = target.get(key);
            }
          }
          row.imageCounter = getImageCount(row);
        });
      },
    });
  }

  // 删除数据
  function handleDelete(row: any) {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.batchDelTip'),
      onOk: () => {
        gridApi.grid.remove(row);
        return Promise.resolve();
      },
    });
  }

  // 获取需要传值给后端的有效字段
  function getEnableCols() {
    // const excludeFields: Array<string> = ['sku', 'semiFinishedProductsPartNumber'];
    const fields: Array<string> = [];
    gridApi.grid
      .getColumns()
      .slice(1, -1)
      .forEach((el: any) => {
        if (!el.disabled) {
          fields.push(el.field);
        }
      });
    return fields.concat([
      'id',
      'customsAffairsApplyId',
      'productWeightPicture',
      'productWeightPictureName',
      'backProductWeightPicture',
      'backProductWeightPictureName',
      'productPicture',
      'productPictureName',
      'productPictureBack',
      'productPictureBackName',
    ]);
  }
  async function getTableData(isValidate = true) {
    const rows = gridApi.getDataSource();

    if (isValidate) {
      // 图片上传必填校验: 纯产品称重图片(productWeightPicture)、带衬背称重图片(backProductWeightPicture)、产品实物图片正面(productPicture)
      const requiredImageFields = ['productWeightPicture', 'backProductWeightPicture', 'productPicture'];
      for (let index = 0; index < rows.length; index++) {
        for (const field of requiredImageFields) {
          if (!rows?.[index]?.[field]?.length) {
            createMessage.warning(t('common.requiredFieldTip', [index + 1, t(`dict.FilingsApplyColumn.${field.charAt(0).toUpperCase() + field.slice(1)}`)]));
            throw new Error(t('common.requiredFieldTip', [index + 1, t(`dict.FilingsApplyColumn.${field.charAt(0).toUpperCase() + field.slice(1)}`)]));
          }
        }
      }

      // 表格必填校验
      if (await gridApi.grid.validate(true)) {
        createMessage.warning(t('dict.SalesSiteColumn.requiredTip'));
        throw new Error(t('dict.SalesSiteColumn.requiredTip'));
      }
    }

    const listField: any = getEnableCols();

    return rows.map(el => pick(el, listField));
  }

  /** 反序列化图片数据 */
  function formatImageDataToArray(data: any, field: string) {
    const value = data?.[field];

    if (Array.isArray(value)) {
      return value;
    }
    if (value && typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (error) {
        // 解析失败，可能是旧数据格式，直接返回单条数据
        return [{ url: value, name: data?.[`${field}Name`] || '' }];
      }
    }
    // 都不符合，直接返回空数组
    return [];
  }

  /**
   * 初始化表格数据
   * @param data
   * @param ids
   */
  function initTableData(data: Array<any>, ids: Array<string>) {
    nextTick(() => {
      state.ids = Array.isArray(ids) ? ids : (ids as string).split(',');
      gridApi.grid.reloadData(
        data.map(item => {
          const obj = {
            ...item,
            productWeightPicture: formatImageDataToArray(item, 'productWeightPicture'),
            backProductWeightPicture: formatImageDataToArray(item, 'backProductWeightPicture'),
            productPicture: formatImageDataToArray(item, 'productPicture'),
            productPictureBack: formatImageDataToArray(item, 'productPictureBack'),
          };

          obj.imageCounter = getImageCount(obj);

          return obj;
        }),
      );
    });
  }

  defineExpose({
    initTableData,
    getTableData,
    handleClickUploadBtn,
  });
</script>

<style scoped lang="less">
  .requirement-pop {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }
</style>
