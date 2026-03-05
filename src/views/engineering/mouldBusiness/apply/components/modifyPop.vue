<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :title="title"
    :destroyOnClose="true"
    :showFooter="false"
    @ok="handleSubmit"
    :okText="t('common.submit')"
    :okButtonProps="{ class: 'mr-12px' }"
    class="full-popup">
    <div class="h-full pt-10px pb-10px">
      <Grid>
        <template #buttons>
          <Subtitle :title="t('dict.MoldApply.MoldInfo')" class="pb-none" />
          <!-- 上传图纸按钮 -->
          <div class="warp-btn">
            <a-button type="primary" :disabled="uploadBtnDisabled" size="mini" @click="() => openUpload(true, {})">
              {{ t('common.uploadDrawingText') }}
            </a-button>
          </div>
          <a-form layout="inline" style="flex: 1">
            <!-- 修改类型 -->
            <a-form-item :label="t('dict.MoldApply.modifyType')" required>
              <a-checkbox-group
                :value="selectedList"
                :disabled="isFixedModifyType"
                name="modifyType"
                :options="modifyTypeOptions"
                @change="handleModifyTypeChange" />
            </a-form-item>
            <!-- 修改原因 -->
            <a-form-item :label="t('dict.MoldApply.modifyReason')" required>
              <a-input v-model:value="modifyReason" />
            </a-form-item>
          </a-form>
        </template>

        <template #moldNo="{ row }">
          <a-input v-model:value="row.moldNo" />
        </template>
        <template #moldDrawings="{ row }">
          <FileListCell v-if="row.moldDrawings?.length" :list="row.moldDrawings" />
          <span v-else>{{ t('common.pendingUpload') }}</span>
        </template>
      </Grid>
    </div>

    <UploadModal v-bind="uploadState" @register="registerUpload" @success="updateMoldsDrawing" />
  </BasicPopup>
</template>

<script lang="ts" setup>
  import type { VxeGridPropTypes } from 'vxe-table';

  import { ref, reactive, nextTick } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ADD_COLUMNS } from './config';
  import { modifyTypeOptions, MOLD_MODIFY_TYPE, getEditRules } from './modifyPopConfig';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useModal } from '/@/components/Modal';
  import { uploadfiles } from '/@/api/basic/common';
  import { getMoldDetailBySubIds, applyMoldModify } from '/@/api/engineering/mould';
  import { handleAfterPaster } from './handlePaster';
  import { deleteCellValueName } from '/@/adapter/delete-value-event';
  import { isFileSizeExceeded, beforeFileUpload } from '/@/views/engineering/mouldBusiness/components/config';

  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { UploadModal } from '/@/components/Upload';
  import FileListCell from '../../components/fileListCell.vue';

  const emits = defineEmits(['reload']);

  const { createMessage } = useMessage();
  const { t } = useI18n();
  /** 弹窗标题 */
  const title = ref<string>(t('dict.CommonCol.modify'));
  /** 选中的记录ID集合 */
  const ids = ref<Array<string>>([]);
  /** 选中的修改类型 */
  const selectedList = ref<Array<`${MOLD_MODIFY_TYPE}`>>([MOLD_MODIFY_TYPE.模具图纸, MOLD_MODIFY_TYPE.基础信息]);
  /** 是否固定修改类型，使其不可更改 */
  const isFixedModifyType = ref<boolean>(false);
  /** 修改原因 */
  const modifyReason = ref<string>('');

  const [registerPopup, { changeLoading, closePopup, changeOkLoading }] = usePopupInner(init);

  const uploadState = reactive({
    title: t('common.uploadMoldDrawings'),
    param: {},
    mutiple: true,
    api: (form: FormData) => {
      const fileForm = new FormData();
      for (const file of form.getAll('file')) {
        fileForm.append('fileList', file);
      }
      return uploadfiles(fileForm);
    },
    beforeUpload: beforeFileUpload,
  });

  /**
   * 获取表格列配置
   */
  function getColumns(): VxeGridPropTypes.Columns {
    const columns: VxeGridPropTypes.Columns = [...ADD_COLUMNS].filter(item => item.type !== 'checkbox');

    // 【数量(`quantity`)】禁止编辑，先找出索引
    const quantityIndex = columns.findIndex(item => item.field === 'quantity');
    if (quantityIndex === -1) {
      return columns;
    }
    columns[quantityIndex] = {
      ...columns[quantityIndex],
      editRender: {
        enabled: false,
      },
    };

    return columns;
  }

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      id: 'engineering-mouldBusiness-apply-modify',
      showIndexColumn: true,
      columns: getColumns(),
      pagerConfig: {
        enabled: false,
      },
      editRules: {},
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      customConfig: {
        allowVisible: false,
      },
      toolbarConfig: {
        enabled: true,
        refresh: false,
        custom: true,
        slots: {
          buttons: 'buttons',
        },
      },
      clipConfig: {
        isPaste: true,
        beforePasteMethod: ({ targetAreas }) => {
          const { cols, rows } = targetAreas[0];
          for (const row of rows) {
            for (const col of cols) {
              if (isDisableEdit({ row, column: col })) {
                createMessage.warning(t('common.noPastingTip'));
                return false;
              }
            }
          }
          return true;
        },
        afterPasteMethod: handleAfterPaster,
      },
      keyboardConfig: {
        delMethod: ({ row, column }) => {
          // 判断是否禁止编辑，如果禁止编辑，则不执行删除
          if (isDisableEdit({ row, column })) {
            return false;
          }
          row[column.field] = null;
        },
      },
      i18nConfig: {
        moduleCode: 'MoldApplyColumn',
      },
    },
    gridEvents: {
      headerCellDblclick: headerCellDblclick,
      // @ts-ignore
      'cell-delete-value': ({ cellAreas }) => {
        const { cols, rows } = cellAreas[0];
        deleteCellValueName({ cellAreas: [{ cols, rows }] });
        handleAfterPaster({
          currentAreas: [{ cols, rows }],
          pasteCells: new Array(rows.length).fill(new Array(cols.length).fill('')),
          $grid: gridApi,
        });
      },
    },
  });

  /**
   * 是否禁止编辑
   */
  function isDisableEdit({ row, column }) {
    const { editRender } = column;
    return (
      !editRender ||
      editRender.enabled === false ||
      editRender.props?.disabled ||
      (typeof editRender.props?.dynamicDisabled === 'function' && editRender.props?.dynamicDisabled(row))
    );
  }

  function headerCellDblclick({ column }) {
    if (!selectedList.value.includes(MOLD_MODIFY_TYPE.基础信息) || column?.editRender?.props?.disabled) {
      return false;
    }

    const tableData = gridApi.getDataSource();
    const targetValue = tableData[0][column.field];
    if (!targetValue) {
      return false;
    }
    const rows = tableData.slice(1);
    const nameFile = column.editRender.cacheField;
    const targetName = tableData[0][nameFile];
    rows.forEach(item => {
      if (typeof column.editRender?.props?.dynamicDisabled === 'function' && column.editRender.props.dynamicDisabled(item)) {
        return false;
      }

      item[column.field] = targetValue;
      if (nameFile) {
        item[nameFile] = targetName;
      }
    });
    if (column.field !== 'moldPurchaseId' && column.field !== 'salespersonId') {
      handleAfterPaster({ currentAreas: [{ cols: [column], rows }], $grid: gridApi, pasteCells: new Array(rows.length).fill([targetValue]) });
    }
  }

  /**
   * 初始化弹窗
   * @param data
   * @param data.ids 选中的记录ID集合
   * @param data.title 弹窗标题
   * @param data.modifyType 默认选中的修改类型
   * @param data.modifyReason 默认修改原因
   * @param data.isFixedModifyType 是否固定修改类型，使其不可更改
   */
  function init(data: { ids: string[]; title: string; modifyType?: Array<`${MOLD_MODIFY_TYPE}`>; modifyReason?: string; isFixedModifyType?: boolean }) {
    title.value = data.title;
    ids.value = data.ids;
    selectedList.value = data.modifyType || [MOLD_MODIFY_TYPE.模具图纸, MOLD_MODIFY_TYPE.基础信息];
    modifyReason.value = data.modifyReason || '';
    isFixedModifyType.value = data.isFixedModifyType || false;

    nextTick(() => {
      handleModifyTypeChange(selectedList.value);
      getDetail();
    });
  }

  /** 获取详情 */
  function getDetail() {
    if (!ids.value.length) return;
    changeLoading(true);
    getMoldDetailBySubIds(ids.value)
      .then(res => {
        Array.isArray(res?.data) &&
          gridApi.reloadData(res.data).then(() => {
            gridApi.setGridOptions({
              editRules: getEditRules({ moldNoType: res.data[0].moldNoType }),
            });
          });
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  const [registerUpload, { openModal: openUpload }] = useModal();
  /** 上传模具图纸 */
  function updateMoldsDrawing(_id: string, { data }: { data: Array<any> }) {
    if (!data) {
      return false;
    }
    const list = data.map(item => ({
      ...item,
      fileName: item.originFileName,
      filePath: item.fullPath,
    }));
    const tableData = gridApi.getDataSource();
    for (const item of tableData) {
      item.moldDrawings = list;
    }
  }

  /** 上传组件禁用标识 */
  const uploadBtnDisabled = ref<boolean>(false);

  const singleTypes = new Set([MOLD_MODIFY_TYPE.暂停制作, MOLD_MODIFY_TYPE.重启制作, MOLD_MODIFY_TYPE.申请终止]);
  const doubleTypes = new Set([MOLD_MODIFY_TYPE.模具图纸, MOLD_MODIFY_TYPE.基础信息]);
  /** 处理修改类型改变 */
  function handleModifyTypeChange(checkedList: Array<`${MOLD_MODIFY_TYPE}`>) {
    // 比较两个数组的差异，找出其中变化的项
    const diff = checkedList.find(item => !selectedList.value.includes(item)) as MOLD_MODIFY_TYPE | undefined;
    if (diff) {
      // 修改类型有：【模具图纸】、【基础信息】、【暂停制作】、【重启制作】、【申请终止】
      // 当选择了【暂停制作】、【重启制作】、【申请终止】之一时，清空其他选中项，只保留这一项，这些选项与其他选项互斥
      // 当选择了【模具图纸】、【基础信息】之一时，删除当前选中的【暂停制作】、【重启制作】、【申请终止】
      if (singleTypes.has(diff)) {
        selectedList.value = [diff];
      } else if (doubleTypes.has(diff)) {
        selectedList.value = checkedList.filter(item => !singleTypes.has(item as MOLD_MODIFY_TYPE));
      }
    } else {
      selectedList.value = checkedList;
    }
    uploadBtnDisabled.value = !selectedList.value.includes(MOLD_MODIFY_TYPE.模具图纸);
    gridApi.setGridOptions({
      editConfig: {
        enabled: selectedList.value.includes(MOLD_MODIFY_TYPE.基础信息),
      },
    });
  }

  function setLoading(isLoading: boolean) {
    changeLoading(isLoading);
    changeOkLoading(isLoading);
  }

  async function handleSubmit() {
    if (selectedList.value.length === 0) {
      createMessage.warning(t('common.somethingReuqiredTip', [t('dict.MoldApply.modifyType')]));
      return false;
    }

    if (!modifyReason.value) {
      createMessage.warning(t('dict.MoldApply.modifyReasonRequiredTip'));
      return false;
    }

    if (selectedList.value.includes(MOLD_MODIFY_TYPE.基础信息) && (await gridApi.validate(true))) {
      return false;
    }

    const list = gridApi.getDataSource();

    const fileSizeExceededIndex = list.findIndex(el => isFileSizeExceeded(el.moldDrawings));
    if (fileSizeExceededIndex > -1) {
      createMessage.warning(t('dict.MoldApply.fileMaxSize', [fileSizeExceededIndex + 1, '10M']));
      return false;
    }

    setLoading(true);
    applyMoldModify({
      type: selectedList.value,
      list,
      reason: modifyReason.value,
    })
      .then(() => {
        createMessage.success(t('sys.api.operationSuccess'));
        closePopup();
        emits('reload');
      })
      .finally(() => {
        setLoading(false);
      });
  }
</script>

<style scoped lang="less">
  div.pb-none {
    padding-bottom: 0;
  }

  :deep(.ant-form .ant-form-item) {
    margin-bottom: 0;

    + .ant-form-item {
      flex: 1;
    }
  }
</style>
