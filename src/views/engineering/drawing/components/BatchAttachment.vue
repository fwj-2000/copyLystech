<script setup lang="ts">
  import { computed, nextTick, reactive, ref, toRefs } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { Spin } from 'ant-design-vue';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import Template from '/@/views/engineering/pcc/pccApply/components/Template.vue';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table';
  import { getUploadAttachList, getUploadRules } from '/@/views/engineering/drawing/components/config';
  import { isEmpty, isNullOrUnDef } from '/@/utils/is';
  import { compact, defaultsDeep, isError } from 'lodash-es';
  import { getUserIdByPhone, getUserInfoList } from '/@/api/permission/user';
  import { FileDoneOutlined } from '@ant-design/icons-vue';
  import { useModal } from '/@/components/Modal';
  import FileListModal from './FileListModal.vue';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  import { uploadFiles } from '/@/api/engineering/pcc';
  import { PreviewModal } from '/@/components/Upload';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useUserStore } from '/@/store/modules/user';
  import { putDrawingsReviewReviewBatch, saveDrawingsReviewBatch } from '/@/api/engineering/drawingReview';
  import { splitArrayIntoChunks } from '/@/utils/splitArrayIntoChunks';
  import { selectMultiple } from '/@/api/business/quota';
  import { CONDITIONAL_OPTIONS } from '/@/views/business/quantitation/requirement/config';
  import { useBaseStore } from '/@/store/modules/base';
  import { getUserListByAccountList } from '/@/api/business/salesForecast';
  import { handleDblClickHead } from '/@/adapter/paster-event';

  const emit = defineEmits(['register', 'reload']);
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const [registerFileList, { openModal: openFileList, closeModal: closeFileListModal }] = useModal();
  const filePreviewRef = ref<ModalComponent | null>(null);
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const baseStore = useBaseStore();

  const userStore = useUserStore();
  const getUserInfo = computed(() => userStore.getUserInfo || {});

  const state = reactive({
    loading: false,
  });

  // 状态跟踪
  const uploadState = reactive({
    activeUploads: 0,
    allFiles: [] as any[],
  });

  const { loading } = toRefs(state);
  const uploadProgress = computed(() => {
    return `${uploadState.activeUploads} / ${uploadState.allFiles.length}`;
  });
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'qualityAssurance-cpk-cpkUploadReport-uploadReport',
      columns: getUploadAttachList(),
      showIndexColumn: true,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      toolbarConfig: {
        enabled: true,
      },
      pagerConfig: {
        enabled: false,
      },
      keyboardConfig: {
        isClip: true, // 是否开启复制粘贴
        isEdit: true, // 是否开启任意键进入编辑（功能键除外）
        isDel: true, // 是否开启删除键功能
        isEsc: true, // 是否开启Esc键关闭编辑功能
      },
      rowConfig: {
        keyField: 'id',
      },
      clipConfig: {
        isPaste: true,
        beforePasteMethod: handleBeforePaster,
        afterPasteMethod: handleAfterPaster,
      },
      i18nConfig: {
        moduleCode: 'DrawingsReviewColumn',
      },
    },
    gridEvents: {
      headerCellDblclick: (params: any) => {
        const rows = gridApi.getDataSource();
        if (rows.length === 0) {
          return false;
        }

        // 如果双击的是`评审结论`的表头，相关联动值的变化
        if (params.column.field === 'reviewResult') {
          return handleAfterPasterReviewResultCustoms([params.column], rows, [Array(rows.length).fill(rows[0]['reviewResultName'])], {
            key: 'reviewResult',
            dictKey: 'DrawingsReview.ReviewResult',
          });
        }

        // 双击其他表头，则进行默认处理
        return handleDblClickHead(params, gridApi);
      },
    },
  });

  const { loadData, reloadData, getDataSource, reloadColumn, getSelectRows, clearSelectedRowKeys } = gridApi;

  function init(data) {
    console.log(getUserInfo.value, 'getUserInfo.valuegetUserInfo.value');
    console.log('🚀 ~ init ~ data: ', data);
    reloadData(
      data.list.map(item => ({
        ...item,
        attachment: [],
        pdLeader: getUserInfo.value.managerId,
        pdLeaderName: getUserInfo.value.manager,
      })),
    );
  }

  function handleAfterPaster({ targetAreas, pasteCells }) {
    console.log('1111111111111111111');

    if (targetAreas.length === 0) {
      return;
    }
    const { cols, rows, rowIndex, columns } = targetAreas[0];
    // 当黏贴只有一行有数据时，将粘贴的数据填充到每一行
    const pasteCellData = [...pasteCells];
    if (pasteCellData.length === 1 && rows.length > 1) {
      const target = pasteCells[0];
      pasteCellData.length = 0;
      for (let i = 0; i < rows.length; i++) {
        pasteCellData.push(target);
      }
    }
    // 找出粘贴的第几列，如粘贴料号，粘贴区域第0列就是料号，对应excel也是第0列
    // const list = pasteCells.map(item => item[targetIndex]);
    // const chunks = splitArrayIntoChunks(list, 1000);
  }

  function handleUserPaste(
    cols: Array<{ field: string }>,
    rows: Array<{
      isDeclareCustoms: string;
    }>,
    pasteCells: string[][],
  ) {
    const targetIndex = cols.findIndex((item: any) => item.field === 'pdLeader' || item.field === 'epm');
    if (targetIndex == -1) return;
    const target = cols[targetIndex];
    console.log('🚀 ~ handleUserPaste ~ target: ', target);

    const userFnList = [];
    rows.forEach((item, index) => {
      const targetValue = pasteCells?.[index]?.[targetIndex] || pasteCells?.[0]?.[targetIndex];
    });
  }

  async function handleAfterPasterReviewResultCustoms(
    cols: Array<{ field: string; editRender: any }>,
    rows: Array<{
      isDeclareCustoms: string;
    }>,
    pasteCells: string[][],
    config: {
      key: string;
      dictKey: string;
    },
  ) {
    const { key, dictKey } = config;
    const targetIndex = cols.findIndex((item: any) => item.field === key);
    if (targetIndex == -1) return false;
    const reviewResultList = await baseStore.getDictionaryData(dictKey);

    const onChangeFn = cols[targetIndex].editRender?.props?.onChange;

    const dataList = rows.map((item, index) => {
      const targetValue = pasteCells?.[index]?.[targetIndex] || pasteCells?.[0]?.[targetIndex];
      const target = reviewResultList.find(unit => unit.fullName == targetValue);
      Object.assign(item, {
        [key]: target?.enCode,
        [`${key}Name`]: target?.fullName,
      });
      typeof onChangeFn === 'function' && onChangeFn(target?.enCode, target, { row: item });
      return item;
    });
    if (dataList.length == 0) return false;
    nextTick(() => {
      gridApi.grid.setRow(dataList);
    });
  }

  function handleBeforePaster({ targetAreas, pasteCells, $grid }) {
    try {
      const editRules = getUploadRules();
      const { cols, rows } = targetAreas[0];

      // 收集用户ID
      const userFnList = [];
      // 校验数据
      pasteCells.forEach((row, rowIndex) => {
        console.log('🚀 ~  ~ row: ', row);
        row.forEach((cell, colIndex) => {
          console.log('🚀 ~  ~ cell: ', cell);
          const col = cols[colIndex];
          console.log('🚀 ~  ~ col: ', col);
          const originRow = rows[rowIndex];
          const { field } = col;
          const rule = editRules[field];
          const { validator } = rule[0];

          // if (field === 'pdLeader' || field === 'epm') {
          // 	userFnList.push({
          // 		cell,
          // 		fn: validator.bind(null, { col, cell, row: originRow, $grid }),
          // 	});
          // 	return null;
          // }
          const result = validator({ col, cell, row: originRow, $grid });
          if (isNullOrUnDef(result)) return false;
          if (isError(result)) {
            createMessage.warning(result?.message);
          }
          // 校验数据通过
        });
      });
      handleUserPaste(cols, rows, pasteCells);
      setTimeout(() => {
        console.log(getDataSource());
      }, 3000);

      handleAfterPasterUser(pasteCells, cols, rows, { id: 'pdLeader', name: 'pdLeaderName' });
      handleAfterPasterUser(pasteCells, cols, rows, { id: 'epm', name: 'epmName' });
      // 重新执行粘贴的料号逻辑
      handleAfterPasterReviewResultCustoms(cols, rows, pasteCells, {
        key: 'reviewResult',
        dictKey: 'DrawingsReview.ReviewResult',
      });
      handleAfterPasterReviewResultCustoms(cols, rows, pasteCells, {
        key: 'makeEngineeringInfo',
        dictKey: 'DrawingsReview.MakeEngineeringInfo',
      });
      handleAfterPasterReviewResultCustoms(cols, rows, pasteCells, {
        key: 'dfm',
        dictKey: 'DrawingsReview.DFM',
      });
      if (!isEmpty(userFnList)) {
        const keys = userFnList.map(item => {
          return item.cell.match(/(\d+)(?!.*\d)/)[0];
        });

        getUserIdByPhone({ accounts: compact(keys) }).then(({ data }) => {
          console.log('🚀 ~  ~ data: ', data);
          // 执行校验函数
          userFnList.forEach(value => {
            const target = data.find(item => `${item.RealName}/${item.Account}` === value.cell);
            // 执行缓存函数
            // value.fn(target);
          });
        });
        return false;
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  function handleAfterPasterUser(pasteCells, cols: Array<{ field: string }>, rows: Array<any>, fieldConfig: { id: string; name: string }) {
    const targetIndex = cols.findIndex((item: any) => item.field === fieldConfig.id);
    if (targetIndex == -1 || rows.length === 0) return false;
    const { idList, accountList } = rows.reduce<{ idList: Array<string>; accountList: Array<string> }>(
      (obj, item: { [key: string]: string }) => {
        const value = pasteCells[0][0];
        // 如果是纯数字组成，则是id，否则按照accountList计算
        if (value && /^\d+$/.test(value)) {
          obj.idList.push(value);
        } else if (value) {
          const account = value.split('/').pop() || '';
          account && obj.accountList.push(account);
        }
        return obj;
      },
      { idList: [], accountList: [] },
    );
    console.log('🚀 ~ handleAfterPasterUser ~ idList, accountList: ', idList, accountList);

    Promise.all([
      idList.length > 0 ? getUserInfoList([...new Set(idList)]) : Promise.resolve({ data: [] }),
      accountList.length > 0 ? getUserListByAccountList([...new Set(accountList)]) : Promise.resolve({ data: {} }),
    ]).then(res => {
      const userList = [
        ...(res[0]?.data?.list || []),
        ...Object.values(res[1]?.data || {}).map((item: any) => ({ ...item, fullName: item.MergeName, id: item.Id })),
      ];
      rows.forEach((row: any) => {
        const target = userList.find(item => item.id === pasteCells[0][0] || item.fullName === pasteCells[0][0]);
        Object.assign(row, { [fieldConfig.id]: target?.id || '', [fieldConfig.name]: target?.fullName || '' });
      });
    });
  }

  function validateParams(list) {
    let flag = false;
    try {
      list.map((item, index) => {
        if (isNullOrUnDef(item.reviewResult)) {
          flag = false;
          throw new Error('请选择评审结论');
        }
        if (isNullOrUnDef(item.makeEngineeringInfo)) {
          flag = false;
          throw new Error('请选择工程资料能否制作');
        }
        if (item.dfm == 1) {
          if (isEmpty(item.attachment)) {
            throw new Error('请上传附件');
            return (flag = false);
          }
        }
        if (isNullOrUnDef(item.dfm)) {
          flag = false;
          throw new Error('请选择是否提DFM');
        }
        if (isNullOrUnDef(item.pdLeader)) {
          flag = false;
          throw new Error('请选择下一节点处理人');
        }
        if (isNullOrUnDef(item.epm)) {
          flag = false;
          throw new Error('请选择EMP');
        }
        return (flag = true);
      });
    } catch (e) {
      console.trace(e);
      createMessage.warning(e.message);
    }
    return flag;
  }

  function handleSubmit() {
    let list = getDataSource().map(item => {
      return {
        ...item,
        dfmAttachment: item.attachment,
        saveAndCommit: true,
      };
    });
    console.log('🚀 ~ handleSubmit ~ list: ', list);
    if (!validateParams(list)) return;
    changeLoading(true);
    saveDrawingsReviewBatch(list).then(({ msg, code }) => {
      if (code === 200) {
        changeLoading(false);
        createMessage.success(msg);
        emit('reload');
        closePopup();
      }
    });
  }

  function handleAttachList(row) {
    openFileList(true, {
      useQuery: true,
      usePath: true,
      useMerge: false,
      fileList: row.attachment,
      row,
    });
  }

  function handlePreview(row) {
    const params = {
      name: row.attachment[0].fileName,
      url: row.attachment[0].filePath,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    filePreviewRef.value?.init(params);
  }

  function beforeInstallUpload(file: File, fileList: File[]) {
    const rows = getSelectRows();
    console.log('🚀 ~ beforeInstallUpload ~ rows: ', rows);
    if (isEmpty(rows)) {
      createMessage.warning(t('common.selectText'));
      return false;
    }
    // beforeUpload每个文件上传都会跑一次，只判定在最后一个文件执行上传
    if (file.name !== fileList[fileList.length - 1].name) return;
    const errorList = [];
    uploadState.activeUploads = 0;
    uploadState.allFiles = fileList;
    state.loading = true;
    fileList.forEach(item => {
      requestIdleCallbackAdapter(() => {
        const formData = new FormData();
        formData.append('fileList', item);
        uploadFiles(formData)
          .then(({ code, msg, data }) => {
            if (code == 200) {
              rows.forEach(row => {
                defaultsDeep(row, { attachment: [] });
                row.attachment.unshift({
                  fileName: data[0].originFileName,
                  filePath: data[0].fullPath,
                  creatorUserName: getUserInfo.value.userName,
                  creatorTime: dateUtil().valueOf(),
                });
              });
              uploadState.activeUploads = uploadState.activeUploads + 1;
              nextTick(() => {
                if (uploadState.activeUploads === uploadState.allFiles.length) {
                  state.loading = false;
                  clearSelectedRowKeys();
                }
              });
            }
          })
          .finally(e => {
            errorList.push(item);
          })
          .catch(e => {
            console.log(e, 'eeeeeeeeeeeeeeeee');
          });
      });
    });
    return false;
  }

  async function handleDeleteAttach(row, index) {
    row.attachment.splice(index, 1);
    await nextTick();
    if (isEmpty(row.attachment)) {
      closeFileListModal();
    }
  }
</script>

<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    @ok="handleSubmit"
    :showOkBtn="true"
    :showCancelBtn="true"
    :title="t('common.upFiles')"
    :destroyOnClose="true"
    :ok-text="t('common.submit')"
    class="h-full">
    <Spin :spinning="loading" :tip="uploadProgress" class="h-full">
      <Grid>
        <template #toolbar-actions>
          <Subtitle title="图纸评审信息" class="mt-8px" :extra="{ show: true, hideAdd: true }">
            <template #afterTitle>
              <a-space>
                <a-upload :multiple="true" :before-upload="beforeInstallUpload" :showUploadList="false">
                  <a-button type="primary" ghost>{{ t('common.upFiles') }} </a-button>
                </a-upload>
              </a-space>
            </template>
          </Subtitle>
        </template>
        <template #attachment="{ row }">
          <template v-if="row.attachment && row.attachment.length > 0">
            <a-tooltip :title="t('common.clickView', [t('common.newDraw')])">
              <FileDoneOutlined class="table-a mr-5px" @click="handleAttachList(row)" />
            </a-tooltip>
            <span class="table-a" @click="handlePreview(row)">{{ row.attachment[0].fileName }}</span>
          </template>
        </template>
      </Grid>
    </Spin>
    <FileListModal @register="registerFileList" @delete="handleDeleteAttach"></FileListModal>
    <PreviewModal ref="filePreviewRef"></PreviewModal>
  </BasicPopup>
</template>

<style lang="less" scoped>
  :deep(.scrollbar__view) {
    height: 100%;

    & > div {
      height: 100%;
    }
  }

  :deep(.scroll-container) {
    height: 100%;
  }

  :deep(.ant-spin-nested-loading) {
    height: 100%;
  }

  :deep(.ant-spin-container) {
    height: 100%;
  }
</style>
