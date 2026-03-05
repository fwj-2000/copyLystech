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
  import { getEPMBatchReviewList, getUploadAttachList, getUploadRules } from '/@/views/engineering/drawing/components/config';
  import { isEmpty, isNullOrUnDef } from '/@/utils/is';
  import { compact, defaultsDeep, isError } from 'lodash-es';
  import { getUserIdByPhone } from '/@/api/permission/user';
  import { FileDoneOutlined } from '@ant-design/icons-vue';
  import { useModal } from '/@/components/Modal';
  import FileListModal from './FileListModal.vue';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  import { uploadFiles } from '/@/api/engineering/pcc';
  import { PreviewModal } from '/@/components/Upload';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useUserStore } from '/@/store/modules/user';
  import { saveDrawingsCommitBatch, saveDrawingsReviewBatch } from '/@/api/engineering/drawingReview';

  const emit = defineEmits(['register', 'reload']);
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const [registerFileList, { openModal: openFileList, closeModal: closeFileListModal }] = useModal();
  const filePreviewRef = ref<ModalComponent | null>(null);
  const { t } = useI18n();
  const { createMessage } = useMessage();

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

  function init(data) {
    console.log(getUserInfo.value, 'getUserInfo.valuegetUserInfo.value');
    console.log('🚀 ~ init ~ data: ', data);
    reloadData(
      data.list.map(item => ({
        ...item,
        attachment: item.replyAttachments || [],
        pdLeader: getUserInfo.value.managerId,
        pdLeaderName: getUserInfo.value.manager,
        reviewResultName: item.reviewResult == 1 ? '通过' : '不通过',
        makeEngineeringInfoName: item.makeEngineeringInfo == 1 ? '能' : '不能',
        dfmName: item.dfm == 1 ? '是' : '否',
        reviewOpinionName: item.reviewOpinion == 1 ? '同意并升版图纸' : item.reviewOpinion == 2 ? '不同意' : '同意不升版图纸',
      })),
    );
  }

  const [Grid, { loadData, reloadData, getDataSource, reloadColumn, getSelectRows, clearSelectedRowKeys }] = useVbenVxeGrid({
    gridOptions: {
      id: 'qualityAssurance-cpk-cpkUploadReport-uploadReport',
      columns: getEPMBatchReviewList(),
      showIndexColumn: true,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      toolbarConfig: {
        enabled: true,
      },
      scrollY: {
        enabled: false,
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
      },
      i18nConfig: {
        moduleCode: 'DrawingsReviewColumn',
      },
    },
  });

  function handleBeforePaster({ targetAreas, pasteCells, $grid }) {
    try {
      const editRules = getUploadRules();
      const { cols, rows } = targetAreas[0];

      // 收集用户ID
      const userFnList = [];
      // 校验数据
      pasteCells.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const col = cols[colIndex];
          const originRow = rows[rowIndex];

          const { field } = col;
          const rule = editRules[field];
          const { validator } = rule[0];

          if (field === 'pdLeader' || field === 'epm') {
            userFnList.push({
              cell,
              fn: validator.bind(null, { col, cell, row: originRow, $grid }),
            });
            return null;
          }
          const result = validator({ col, cell, row: originRow, $grid });
          if (isNullOrUnDef(result)) return false;
          if (isError(result)) {
            createMessage.warning(result?.message);
          }
          // 校验数据通过
        });
      });
      // 重新执行粘贴的料号逻辑
      console.log('🚀 ~ handleBeforePaster ~ userFnList: ', userFnList);
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
            value.fn(target);
          });
        });
        return false;
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  function validateParams(list) {
    let flag = false;
    try {
      list.map((item, index) => {
        if (isNullOrUnDef(item.reviewOpinion)) {
          throw new Error('请选择客户意见');
          return (flag = false);
        }
        if (isNullOrUnDef(item.pdReviewer)) {
          throw new Error('请选择下一节点处理人');
          return (flag = false);
        }
        if (isEmpty(item.attachment)) {
          throw new Error('请上传附件');
          return (flag = false);
        }
        return (flag = true);
      });
    } catch (e) {
      createMessage.warning(e.message);
    }
    return flag;
  }

  function handleSubmit(type) {
    let list = getDataSource().map(item => {
      return {
        ...item,
        reviewId: item.id,
        replyAttachment: item.attachment,
        saveAndCommit: type === 'commit',
      };
    });
    if (type === 'commit') {
      if (!validateParams(list)) return;
    }
    changeLoading(true);
    saveDrawingsCommitBatch({
      list,
    })
      .then(({ msg, code }) => {
        if (code === 200) {
          createMessage.success(msg);
          emit('reload');
          closePopup();
        }
      })
      .finally(() => {
        changeLoading(false);
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
    :showOkBtn="false"
    :showCancelBtn="true"
    title="DFM评审"
    :destroyOnClose="true"
    :ok-text="t('common.submit')"
    class="h-full">
    <template #centerToolbar>
      <a-button class="ml-12px" :loading="loading" v-if="true" ghost @click="handleSubmit('save')" type="primary">暂存 </a-button>
      <a-button class="mx-12px" :loading="loading" v-if="true" @click="handleSubmit('commit')" type="primary">{{ t('common.submit') }} </a-button>
    </template>
    <Spin :spinning="loading" :tip="uploadProgress" class="h-full">
      <Grid style="height: calc(100% - 50px)">
        <template #toolbar-actions>
          <Subtitle title="DFM回复" class="mt-8px" :extra="{ show: true, hideAdd: true }">
            <template #afterTitle>
              <a-space>
                <a-upload :multiple="true" :before-upload="beforeInstallUpload" :showUploadList="false">
                  <a-button type="primary" ghost>上传附件 </a-button>
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
