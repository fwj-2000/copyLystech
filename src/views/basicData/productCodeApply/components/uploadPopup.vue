<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :title="t('component.upload.batchUpload')"
    :destroyOnClose="true"
    :ok-text="t('common.submit')"
    :confirmLoading="loading"
    @ok="handleSubmit">
    <template #insertToolbar>
      <a-upload v-feature name="fileList" :showUploadList="false" :multiple="true" :beforeUpload="handleBeforeUpload" @change="handleFileChange">
        <a-button type="primary" class="mx-12px" :loading="loading">
          <template v-if="!loading">
            <upload-outlined></upload-outlined>
            {{ t('common.uploadText') }}
          </template>
          <template v-else> {{ currentFakeProgress }} / {{ allFiles.length }} </template>
        </a-button>
      </a-upload>
    </template>
    <div style="height: 400px">
      <div class="warp">
        <div class="warp-left pl-12px">
          <Subtitle :title="key === UPLOAD_TYPES.CUSTOMER ? t('common.customerOriginalImage') : t('dict.CommonCol.drawingshistory')">
            <template #afterTitle>
              <a-space>
                <a-divider type="vertical" class="ml-10px"></a-divider>
                <!-- 上传成功 -->
                <span class="font-normal"
                  >{{ t('component.upload.uploadSuccess') }}: <span style="color: #52c41a">{{ fileCounter.success }}</span></span
                >
                <a-divider type="vertical" class="ml-10px"></a-divider>
                <!-- 上传失败 -->
                <span class="font-normal"
                  >{{ t('component.upload.uploadError') }}: <span style="color: #ff4d4f">{{ fileCounter.error }}</span></span
                >
              </a-space>
              <a-space v-if="key === UPLOAD_TYPES.CUSTOMER">
                <a-divider id="process" type="vertical" class="ml-10px"></a-divider>
                <div class="flex" style="width: 300px">
                  {{ t(['dict.CommonCol.prjDrawingsName', 'sys.lang.translate']) }}：
                  <lydc-select
                    style="width: 200px"
                    v-model:value="translateState.targetLanguages"
                    :multiple="true"
                    :maxTagCount="1"
                    placeholder="请选择"
                    :options="translateState.options"></lydc-select>
                </div>
              </a-space>
            </template>
          </Subtitle>
        </div>
        <BasicTable @register="registerTable">
          <template #bodyCell="{ column, record, index }">
            <!--            <template v-if="column.dataIndex === 'version'"> T{{ record[column.dataIndex] }} </template>-->
            <template v-if="column.dataIndex === 'action'">
              <TableAction :actions="getTableActions(record, index)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { computed, reactive, toRefs } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { ActionItem, BasicTable, TableAction, useTable } from '/@/components/Table';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { UPLOAD_POP_COLUMNS } from '../config';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { batchUploadCustomerDrawings, batchUploadDesensitizedDrawings, batchUploadSubmit } from '/@/api/basicData/productCodeApply';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { isEmpty } from '/@/utils/is';
  import { useBaseStore } from '/@/store/modules/base';
  import { UPLOAD_TYPES } from '../constants';

  const baseStore = useBaseStore();

  const { t } = useI18n();
  const emits = defineEmits(['reload', 'register']);
  const { createMessage } = useMessage();

  type UploadType = (typeof UPLOAD_TYPES)[keyof typeof UPLOAD_TYPES];

  const translateState = reactive({
    targetLanguages: ['zh-CN'],
    options: [],
  });

  interface State {
    fileList: any[];
    key: UploadType | '';
    loading: boolean;
  }

  const state = reactive<State>({
    fileList: [],
    key: '',
    loading: false,
  });

  const { key, loading } = toRefs(state);

  const [registerPopup, { closePopup }] = usePopupInner(init);
  const [registerTable, { setTableData }] = useTable({
    // api: getMoldapplyDetail,
    // title: '',
    columns: UPLOAD_POP_COLUMNS,
    rowKey: 'id',
    // isCanResizeParent: true,
    canResize: true, //自适应高度
    formConfig: {
      //搜索框
      labelWidth: 100,
      // schemas: searchFormSchema,
      autoAdvancedLine: 0, //自动展开行
      showAdvancedButton: false,
      showResetButton: false,
      baseColProps: { span: 5 },
      actionColOptions: {
        span: 5,
      },
    },
    striped: true,
    useSearchForm: false, //使用搜索表单
    showTableSetting: false, //刷新按钮,默认打开
    showIndexColumn: true, //显示序号
    pagination: false,
    actionColumn: {
      width: 90,
      title: '操作',
      dataIndex: 'action', //字段
      fixed: 'right', //显示在右边
    },
    // i18nConfig: {
    //   moduleCode: 'PartNumberApplyColumn',
    // },
  });

  const fileCounter = computed<{ success: number; error: number }>(() => {
    if (!Array.isArray(state.fileList)) {
      return { success: 0, error: 0 };
    }
    return state.fileList.reduce(
      (counter, item) => {
        +item.status === 1 ? counter.success++ : counter.error++;
        return counter;
      },
      { success: 0, error: 0 },
    );
  });

  function getTableActions(record, index): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDeleteItem.bind(null, index),
      },
    ];
  }

  async function handleSubmit() {
    if (isEmpty(state.fileList)) return createMessage.warn(t('common.selectFiles'));
    const hasInvalidStatus = state.fileList.some(item => item.status !== 1);
    if (hasInvalidStatus) return createMessage.warning(t('common.statusErrorItemNotAllowedSubmitted'));
    const payload = state.fileList.map(item => ({ ...item }));
    const { code, msg } = await batchUploadSubmit({
      list: payload,
      targetLanguages: translateState.targetLanguages.join(','),
    });
    if (code === 200) {
      createMessage.success(msg);
      emits('reload');
      closePopup();
    }
  }
  // 配置常量
  const BATCH_SIZE = 1; // 每批1个文件
  const MAX_CONCURRENT_UPLOADS = 5; // 最大并发上传数
  const FAKE_PROGRESS_INTERVAL = 300; // 虚假进度更新间隔(ms)

  // // 状态跟踪
  // const uploadState = reactive({
  //   pendingBatches: [] as File[][],
  //   activeUploads: 0,
  //   allFiles: [] as any[],
  //   processedFiles: 0,
  //
  // });

  // 状态跟踪
  const uploadState = reactive({
    pendingBatches: [] as File[][],
    activeUploads: 0,
    allFiles: [] as any[],
    processedFiles: 0,
    fakeProgressInterval: null as ReturnType<typeof setInterval> | null,
    currentFakeProgress: 0,
    lastRealProgress: 0,
  });

  const { allFiles, currentFakeProgress } = toRefs(uploadState);

  function resetQueueProgress() {
    uploadState.pendingBatches = [];
    uploadState.activeUploads = 0;
    uploadState.allFiles = [];
    uploadState.processedFiles = 0;
    uploadState.currentFakeProgress = 0;
    uploadState.lastRealProgress = 0;
    if (uploadState.fakeProgressInterval) {
      clearInterval(uploadState.fakeProgressInterval);
      uploadState.fakeProgressInterval = null;
    }
  }

  function resetUploadState() {
    resetQueueProgress();
    state.fileList = [];
    state.loading = false;
    setTableData([]);
  }

  function handleBeforeUpload(file: File, fileList: File[]) {
    // 去重处理
    fileList.forEach(item => {
      if (!state.fileList.some(v => v.name === item.name)) {
        state.fileList.push(item);
      }
    });

    // 不是最后一个文件就直接结束（仍然阻止自动上传）
    if (file.name !== fileList[fileList.length - 1].name) {
      return false;
    }

    // 重置上传状态
    resetQueueProgress();
    uploadState.allFiles = [...state.fileList];

    // 分批处理文件
    for (let i = 0; i < state.fileList.length; i += BATCH_SIZE) {
      const batch = state.fileList.slice(i, i + BATCH_SIZE);
      uploadState.pendingBatches.push(batch);
    }

    // 没有批次就不启动队列处理，但依旧阻止自动上传
    if (!isEmpty(uploadState.pendingBatches)) {
      state.loading = true;
      setTableData(
        state.fileList.map(f => ({
          ...f,
          uploadstatus: '等待上传',
          progress: 0,
        })),
      );

      startFakeProgress();
      processNextBatch();
    }

    return false;
  }

  function startFakeProgress() {
    if (uploadState.fakeProgressInterval) return;
    uploadState.fakeProgressInterval = setInterval(() => {
      // 只在有活动上传时更新虚假进度
      if (uploadState.activeUploads > 0) {
        // 计算当前批次的最大可能进度
        const currentBatchIndex = Math.floor(uploadState.processedFiles / BATCH_SIZE);
        const currentBatchStart = currentBatchIndex * BATCH_SIZE;
        const currentBatchSize = Math.min(BATCH_SIZE, uploadState.allFiles.length - currentBatchStart);
        const maxProgressForBatch = uploadState.lastRealProgress + currentBatchSize;

        // 限制虚假进度不超过当前批次的最大进度和总文件数
        uploadState.currentFakeProgress = Math.min(uploadState.currentFakeProgress + 1, maxProgressForBatch, uploadState.allFiles.length);

        // 更新当前批次文件的进度
        const currentBatchEnd = Math.min(currentBatchStart + BATCH_SIZE, state.fileList.length);

        for (let i = currentBatchStart; i < currentBatchEnd; i++) {
          const file = state.fileList[i];
          if (file.progress < uploadState.currentFakeProgress) {
            file.progress = uploadState.currentFakeProgress;
            file.uploadstatus = '上传中';
          }
        }

        setTableData([...state.fileList]);
      }
    }, FAKE_PROGRESS_INTERVAL);
  }

  async function processNextBatch() {
    // 检查是否还有待处理的批次且未超过最大并发数
    while (uploadState.pendingBatches.length > 0 && uploadState.activeUploads < MAX_CONCURRENT_UPLOADS) {
      const batch = uploadState.pendingBatches.shift()!;
      uploadState.activeUploads++;

      try {
        await uploadBatch(batch);
      } catch (error) {
        // 更新失败状态
        batch.forEach(file => {
          const index = state.fileList.findIndex(f => f.name === file.name);
          if (index !== -1) {
            state.fileList[index].uploadstatus = '上传失败';
            state.fileList[index].error = error.message || '上传失败';
          }
        });
      } finally {
        uploadState.activeUploads--;
        setTableData([...state.fileList]); // 更新表格

        // 检查是否所有批次都已完成
        if (uploadState.pendingBatches.length === 0 && uploadState.activeUploads === 0) {
          if (uploadState.fakeProgressInterval) {
            clearInterval(uploadState.fakeProgressInterval);
            uploadState.fakeProgressInterval = null;
          }
          setTableData([...state.fileList]);
          state.loading = false;
        } else {
          processNextBatch();
        }
      }
    }
  }

  async function uploadBatch(batch: File[]) {
    const fileParams = new FormData();
    const batchStartIndex = uploadState.processedFiles;

    // 准备FormData并更新状态
    batch.forEach(file => {
      fileParams.append('fileList', file);
      const index = state.fileList.findIndex(f => f.name === file.name);
      if (index !== -1) {
        state.fileList[index].status = '上传中';
        state.fileList[index].progress = uploadState.currentFakeProgress;
      }
    });

    setTableData([...state.fileList]); // 更新表格

    // 确定使用哪个上传函数
    let fetchFn = null;
    if (state.key === UPLOAD_TYPES.CUSTOMER) {
      fetchFn = batchUploadCustomerDrawings;
    } else if (state.key === UPLOAD_TYPES.DESENSITIZED) {
      fetchFn = batchUploadDesensitizedDrawings;
    }
    if (!fetchFn) return;

    // 使用axios上传以便跟踪进度
    const response = await fetchFn(fileParams, {
      onUploadProgress: progressEvent => {
        // 真实进度计算（基于已上传字节）
        const realPercentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

        // 计算当前批次的大小（可能是小于BATCH_SIZE的最后一批）
        const currentBatchSize = batch.length;

        // 更新真实进度基准
        uploadState.lastRealProgress = batchStartIndex + Math.floor((realPercentCompleted * currentBatchSize) / 100);

        // 确保虚假进度不超过真实进度
        if (uploadState.currentFakeProgress > uploadState.lastRealProgress) {
          uploadState.currentFakeProgress = uploadState.lastRealProgress;
        }
      },
    });

    const { code, data } = response;
    if (code === 200) {
      // 批次完成，立即跳到下一个10的倍数
      const batchEndProgress = batchStartIndex + BATCH_SIZE;
      uploadState.currentFakeProgress = batchEndProgress;
      uploadState.lastRealProgress = batchEndProgress;

      // 更新文件状态
      data.forEach((item: any) => {
        const findIndex = state.fileList.findIndex(v => v.name === item.originFileName);
        if (findIndex !== -1) {
          state.fileList[findIndex] = {
            ...state.fileList[findIndex],
            ...item,
            uploadstatus: '上传成功',
            progress: batchEndProgress,
          };
        }
      });

      uploadState.processedFiles += batch.length;
      setTableData([...state.fileList]);
    } else {
      // 标记整个批次为失败
      batch.forEach(file => {
        const index = state.fileList.findIndex(f => f.name === file.name);
        if (index !== -1) {
          state.fileList[index].uploadstatus = '上传失败';
          state.fileList[index].error = '服务器返回错误';
        }
      });
    }
  }

  // -------------------------废弃--------------------------------
  // function handleBeforeUpload(file, fileList) {
  //   fileList.forEach(item => {
  //     const findIndex = state.fileList.findIndex(v => {
  //       return v.name === item.name;
  //     });
  //     if (findIndex == -1) {
  //       state.fileList.push(item);
  //     }
  //   });
  //   if (file.name === fileList[fileList.length - 1].name) {
  //     const fileParams = new FormData();
  //     state.fileList.forEach(file => {
  //       fileParams.append('fileList', file);
  //     });
  //     let fetchFn = null;
  //     if (state.mode === 'customer') {
  //       fetchFn = batchUploadCustomerDrawings;
  //     } else if (state.mode === 'desensitized') {
  //       fetchFn = batchUploadDesensitizedDrawings;
  //     }
  //     if (!fetchFn) return;
  //     state.loading = true;
  //     fetchFn(fileParams)
  //       .then(({ code, data }) => {
  //         console.log('state.fileListstate.fileListstate.fileList', state.fileList);
  //         console.log('datadatadatadatadata', data);
  //         if (code === 200) {
  //           data.forEach((item: any) => {
  //             const findIndex = state.fileList.findIndex(v => {
  //               console.log(v.name, 'v.name');
  //               console.log(item.originFileName, 'item.originFileName');
  //               return v.name === item.originFileName;
  //             });
  //             console.log(findIndex);
  //             if (findIndex !== -1) {
  //               state.fileList[findIndex] = {
  //                 ...state.fileList[findIndex],
  //                 ...item,
  //               };
  //             }
  //           });
  //           console.log(state.fileList, 'state.fileListstate.fileListstate.fileList');
  //           setTableData(state.fileList);
  //           state.loading = false;
  //         } else {
  //           state.loading = false;
  //         }
  //       })
  //       .finally(() => {});
  //   }
  //   return false;
  // }

  function handleFileChange({ file }) {
    if (file.status === 'done' && file.response) {
      const { data } = file.response;
      state.fileList = state.fileList?.concat(data);
      setTableData(state.fileList);
    }
  }

  function handleDeleteItem(i) {
    state.fileList.splice(i, 1);
    setTableData([...state.fileList]);
  }

  async function init(data) {
    const uploadType = (data?.key || '') as UploadType | '';
    state.key = uploadType;
    resetUploadState();
    translateState.targetLanguages = ['zh-CN'];
    translateState.options = (await baseStore.getDictionaryData('Language')).map(item => {
      return { id: item.enCode, fullName: item.fullName };
    });
  }
</script>
