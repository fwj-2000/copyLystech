<template>
  <BasicModal
    :width="1200"
    v-bind="$attrs"
    :title="state.mode === 'review' ? '审核' : '附件'"
    :draggable="true"
    :showOkBtn="state.mode !== 'view'"
    :ok-text="state.mode === 'EPMQPM1Review' ? t('common.saveText') : t('common.submitText')"
    @ok="handleSubmit"
    @register="registerModal">
    <Grid>
      <template #toolbar-actions>
        <div class="flex">
          <!-- state.mode === 'review'时，显示上传文件 -->
          <!-- 审核节点为`EPMQPM1`时，即`mode`为`EPMQPM1Review`也需要显示上传文件 -->
          <a-upload
            v-feature
            v-if="state.mode === 'review' || state.mode === 'EPMQPM1Review'"
            :multiple="true"
            :before-upload="beforeInstallUpload"
            :showUploadList="false">
            <a-button type="primary" v-if="!loading" ghost>{{ t('component.upload.choose') }} </a-button>
            <div v-else style="color: #ff7b00">{{ uploadProgress }}</div>
          </a-upload>
          <template v-if="state.mode === 'review'">
            <div class="ml-15px mr-10px">{{ nextNodeName }} : </div>
            <LydcCustomUserSelect v-model:value="state.nextHandlerId" :multiple="true" style="width: 280px" />
            <div class="flex">
              <div class="ml-15px mr-10px" style="margin-bottom: 6px">{{ t('common.remark') }} :</div>
              <a-textarea
                v-model:value="state.auditRemark"
                :auto-size="{ minRows: 2, maxRows: 4 }"
                style="width: 320px"
                :placeholder="t('common.inputText') + t('common.remark')" />
            </div>
          </template>
        </div>
      </template>
      <template #toolbar-tools>
        <div v-if="state.mode === 'review'" class="toggle-current">
          <a-button preIcon="icon-ym icon-ym-left" @click="changeCurrent('pre')"></a-button>
          <div class="state-box">
            <span>{{ index + 1 }}</span>
            / {{ cacheList.length }}
          </div>
          <a-button preIcon="icon-ym icon-ym-right" @click="changeCurrent('next')"></a-button>
        </div>
      </template>
      <template #attachment="{ row }">
        <span class="table-a" @click="handlePreview(row)">{{ row.fileName }}</span>
      </template>
      <template #action="{ row }">
        <i class="icon-ym icon-ym-download cursor-pointer mr-10px" style="color: rgb(26 144 255)" @click="handleDownload(row)" />
        <i v-if="state.mode !== 'view'" class="icon-ym icon-ym-delete cursor-pointer" style="color: rgb(26 144 255)" @click="handleDelete(row)" />
      </template>
    </Grid>
    <Preview ref="filePreviewRef" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table';
  import { getAttachmentColumns } from '/@/views/qualityAssurance/cpk/cpkUploadReport/config';
  import { downloadFile } from '/@/utils/file/download';
  import { getAppEnvConfig } from '/@/utils/env';
  import Preview from '/@/components/Upload/src/components/Preview.vue';
  import { ref, reactive, toRefs, computed, nextTick, onMounted } from 'vue';
  import { uploadfiles } from '/@/api/basic/common';
  import { defaultsDeep } from 'lodash-es';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { postCpkCommitWithFile } from '/@/api/qualityAssurance/cpk';
  import { message } from 'ant-design-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { requestIdleCallbackAdapter } from '/@/utils/polyfills';
  import Template from '/@/views/engineering/pcc/pccApply/components/print/template.vue';
  import LydcCustomUserSelect from '/@/components/Lydc/Organize/src/CustomUserSelect.vue';
  import { useBaseStore } from '/@/store/modules/base';

  const baseStore = useBaseStore();

  const { VITE_GLOB_API_URL } = getAppEnvConfig();
  const { t } = useI18n();

  const IMG_URL_PREFIX = VITE_GLOB_API_URL + '/api/Information/FileInfo/Download/';

  const emit = defineEmits(['register', 'reload', 'changeFileList']);
  const { createMessage } = useMessage();

  const state = reactive({
    mode: '',
    cacheList: [],
    index: 0,
    loading: false,
    nextHandlerId: [],
    CPKFlowNode: [],
    auditRemark: '',
  });

  const userStore = useUserStore();
  const getUserInfo = computed(() => userStore.getUserInfo || {});

  const { mode, cacheList, index, loading } = toRefs(state);
  const filePreviewRef = ref();

  const currentValue = computed(() => {
    return state.cacheList[state.index];
  });

  const nextNodeName = computed(() => {
    const { currentNode } = state.cacheList[state.index];
    let nextNode = '';
    // if (currentNode == 'Technician') {
    //   nextNode = 'QE';
    // } else if (currentNode == 'QE') {
    //   nextNode = 'PD';
    // } else if (currentNode == 'PD') {
    //   nextNode = 'EPMQPM';
    // }
    if (currentNode == 'QE') {
      nextNode = 'PD';
    } else if (currentNode == 'PD') {
      nextNode = 'Technician';
    } else if (currentNode == 'Technician') {
      nextNode = 'EPMQPM1';
    }
    console.log(state.CPKFlowNode, 'state.CPKFlowNodestate.CPKFlowNode');
    if (nextNode == '') return '';
    const nextNodeName = state.CPKFlowNode?.find(item => item.enCode == nextNode)?.fullName || '';
    return nextNodeName;
  });

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  const [Grid, { loadData, reloadData, getDataSource }] = useVbenVxeGrid({
    gridOptions: {
      id: 'qualityAssurance-cpk-cpkUploadReport-uploadReport',
      columns: getAttachmentColumns(),
      minHeight: 500,
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
      rowConfig: {
        keyField: 'uuid',
      },
      clipConfig: {
        isPaste: true,
      },
      // i18nConfig: {
      // 	moduleCode: 'PCCColumn',
      // },
    },
  });

  function init(data) {
    state.loading = false;
    state.cacheList = data;
    state.index = 0;
    state.mode = data[0]?.mode || data.mode;
    state.auditRemark = data[0]?.auditRemark || '';
    // 回显handleId
    if (data[0].currentNode == 'QE') {
      const target = data[0].reviewList.find(item => item.node === 'PD');
      state.nextHandlerId = target?.handlerList || [];
    } else if (data[0].currentNode == 'PD') {
      const target = data[0].reviewList.find(item => item.node.includes('Technician'));
      state.nextHandlerId = target?.handlerList || [];
    } else if (data[0].currentNode == 'Technician') {
      const target = data[0].reviewList.find(item => item.node.includes('EPMQPM'));
      state.nextHandlerId = target?.handlerList || [];
    }
    const fileList = data[0].fileList.map(item => ({
      ...item,
      insidePN: data[0].insidePN,
      wo: data[0].wo,
    }));
    state.cacheList[state.index] = {
      ...state.cacheList[state.index],
      fileList,
    };
    reloadData(state.cacheList[state.index]?.fileList);
  }

  function handleSubmit() {
    if (state.mode === 'EPMQPM1Review') {
      // 审核节点为`EPMQPM1`时，直接触发`changeFileList`事件，并返回新的文件，关闭弹窗
      emit('changeFileList', state.cacheList[state.index]);
      closeModal();
      return;
    }

    if (state.mode !== 'review') {
      // CPK报告上传
      emit('changeFileList', state.cacheList[state.index]);
      return;
    }
    // CPK审核
    const params = {
      saveAndCommit: true,
      list: [
        {
          ...state.cacheList[state.index],
          handlerList: state.nextHandlerId,
          auditRemark: state.auditRemark,
        },
      ],
    };
    console.log('🚀 ~ handleSubmit ~ params: ', params);
    changeOkLoading(true);
    postCpkCommitWithFile(params)
      .then(({ code, msg }) => {
        console.log('🚀 ~  ~ { code, msg }: ', { code, msg });
        if (code !== 200) return createMessage.error(msg);
        createMessage.success(msg);
        if (state.index + 1 === state.cacheList.length) {
          // 最后一条 关闭弹窗，刷新列表，其他的跳转到下一条审核
          closeModal();
          emit('reload');
        } else {
          changeCurrent('next');
        }
        // closeModal();
        // emit('reload');
      })
      .finally(() => {
        changeOkLoading(false);
      });
  }

  function handlePreview(row) {
    console.log(row);
    filePreviewRef.value?.init({
      filePath: row.filePath,
      name: row.fileName,
      version: 2,
    });
  }

  function handleDelete(row) {
    console.log('🚀 ~ handleDelete ~ row: ', row);
    const index = state.cacheList[state.index]?.fileList.findIndex(item => item.uuid === row.uuid);
    state.cacheList[state.index]?.fileList?.splice(index, 1);
    reloadData(state.cacheList[state.index]?.fileList);
  }
  // 状态跟踪
  const uploadState = reactive({
    activeUploads: 0,
    allFiles: [] as any[],
  });

  const uploadProgress = computed(() => {
    return `${uploadState.activeUploads} / ${uploadState.allFiles.length}`;
  });

  function beforeInstallUpload(file, fileList) {
    const { cacheList, index } = state;
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
        uploadfiles(formData)
          .then(({ code, msg, data }) => {
            if (code == 200) {
              defaultsDeep(cacheList[index], { fileList: [] });
              state.cacheList[state.index]?.fileList.push({
                fileName: data[0].originFileName,
                filePath: data[0].fullPath,
                creatorUserName: getUserInfo.value.userName,
                creatorTime: dateUtil().valueOf(),
                wo: cacheList[index]['wo'],
                insidePN: cacheList[index]['insidePN'],
              });
              uploadState.activeUploads = uploadState.activeUploads + 1;
              nextTick(() => {
                if (uploadState.activeUploads === uploadState.allFiles.length) {
                  state.loading = false;
                  reloadData(state.cacheList[state.index]?.fileList);
                }
              });
            }
          })
          .finally(() => {
            errorList.push(item);
            state.loading = false;
          });
      });
    });
    // console.log(getUserInfo.value, 'getUserInfo');
    // const { cacheList, index } = state;
    // const formData = new FormData();
    // formData.append('fileList', file);
    // uploadfiles(formData)
    //   .then(({ code, msg, data }) => {
    //     if (code == 200) {
    //       defaultsDeep(cacheList[index], { fileList: [] });
    //       state.cacheList[state.index]?.fileList.push({
    //         // ...cacheList[index],
    //         fileName: data[0].originFileName,
    //         filePath: data[0].fullPath,
    //         creatorUserName: getUserInfo.value.userName,
    //         creatorTime: dateUtil().valueOf(),
    //         wo: cacheList[index]['wo'],
    //         insidePN: cacheList[index]['insidePN'],
    //       });
    //       createMessage.success(msg);
    //       reloadData(state.cacheList[state.index]?.fileList);
    //     }
    //   })
    //   .catch(() => {
    //     // changeLoading(false);
    //   });
    return false;
  }

  function handleDownload(row) {
    downloadFile({ url: row.filePath, target: '_blank', fileName: row.fileName });
  }

  function changeCurrent(type: 'pre' | 'next') {
    const { cacheList, index } = state;
    // 上一个
    if (type === 'pre') {
      if (index === 0) {
        return message.warning('当前已经是第一个');
      }
      state.index = index - 1;
      state.auditRemark = cacheList[state.index]?.auditRemark || '';
      if (cacheList[index].currentNode == 'Technician') {
        const target = cacheList[index].reviewList.find(item => item.node === 'QE');
        state.nextHandlerId = target?.handlerList || [];
      } else if (cacheList[index].currentNode == 'QE') {
        const target = cacheList[index].reviewList.find(item => item.node === 'PD');
        state.nextHandlerId = target?.handlerList || [];
      } else if (cacheList[index].currentNode == 'PD') {
        const target = cacheList[index].reviewList.find(item => item.node.includes('EPMQPM'));
        state.nextHandlerId = target?.handlerList || [];
      }
      console.log(state.nextHandlerId, 'state.nextHandlerId');
      const fileList = cacheList[index].fileList.map(item => ({
        ...item,
        insidePN: cacheList[index].insidePN,
        wo: cacheList[index].wo,
      }));
      state.cacheList[state.index] = {
        ...state.cacheList[state.index],
        fileList,
      };
      reloadData(state.cacheList[state.index]?.fileList);
    }
    // 下一个
    if (type === 'next') {
      if (index === state.cacheList.length - 1) {
        return message.warning('当前已经是最后一个');
      }
      state.index = index + 1;
      state.auditRemark = cacheList[state.index]?.auditRemark || '';
      if (cacheList[index].currentNode == 'Technician') {
        const target = cacheList[index].reviewList.find(item => item.node === 'QE');
        state.nextHandlerId = target?.handlerList || [];
      } else if (cacheList[index].currentNode == 'QE') {
        const target = cacheList[index].reviewList.find(item => item.node === 'PD');
        state.nextHandlerId = target?.handlerList || [];
      } else if (cacheList[index].currentNode == 'PD') {
        const target = cacheList[index].reviewList.find(item => item.node.includes('EPMQPM'));
        state.nextHandlerId = target?.handlerList || [];
      }
      const fileList = cacheList[state.index].fileList.map(item => ({
        ...item,
        insidePN: cacheList[state.index].insidePN,
        wo: cacheList[state.index].wo,
      }));
      console.log('🚀 ~ changeCurrent ~ fileList: ', fileList);
      state.cacheList[state.index] = {
        ...state.cacheList[state.index],
        fileList,
      };
      console.log('🚀 ~ changeCurrent ~ state.cacheList[state.index]: ', state.cacheList[state.index]);
      reloadData(state.cacheList[state.index]?.fileList);
    }
  }

  onMounted(async () => {
    state.CPKFlowNode = await baseStore.getDictionaryData('CPKFlowNode');
  });
</script>

<style lang="less" scoped>
  .toggle-current {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 10px;
  }

  .state-box {
    margin: 0 10px;
  }

  :deep(.scrollbar) {
    padding: 0 5px !important;
  }
</style>
