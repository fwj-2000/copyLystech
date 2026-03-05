<script setup lang="ts">
  import { dateUtil } from '/@/utils/dateUtil';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicColumn, useTable } from '/@/components/Table';
  import { uploadPCCImg } from '/@/api/sys/upload';
  import { reactive, toRefs, ref } from 'vue';
  import { UploadStatus } from '/@/views/basicData/productCodeApply/types';
  import { UploadFile } from 'ant-design-vue';
  import { Subtitle } from '/@/components/Subtitle';
  import { uploadInstallFile, getIsOngoing } from '/@/api/engineering/pcc';
  import { ImageUpload } from '/@/components/Upload';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { downloadByUrl } from '/@/utils/file/download';
  import { http2s } from '/@/adapter/utils';
  import successSvg from '/@/assets/svg/report/success.svg';
  import { formatFileSize } from '/@/utils/file/base64Conver';
  import errorSvg from '/@/assets/svg/report/error.svg';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table';
  import Preview from '/@/views/engineering/pcc/pccApply/components/Preview.vue';
  import { ModeTypeEnum } from '/@/enums/modeEnum';

  const { t } = useI18n();

  const props = defineProps({
    state: {
      type: Object,
      default: () => ({}),
    },
  });

  const state = reactive<{ installImageList: Array<any>; customerFileList: Array<any> }>({
    // mode: 'view',
    installImageList: [],
    customerFileList: [],
  });

  const { createMessage } = useMessage();

  const { /** mode, */ installImageList } = toRefs(state);

  // 工艺流程
  // const [
  //   registerTechnologyDetailTable,
  //   {
  // 	  setTableData: setTechnologyDetailTableData,
  // 	  getDataSource: getTechnologyDetailDataSource,
  // 	  setCacheColumnsByField: setTechnologyDetailCacheColumnsByField,
  // 	  updateTableDataRecord: updateTechnologyDetailTableDataRecord,
  // 	  updateTableData: updateTechnologyDetailTableData,
  // 	  insertTableDataRecord: insertTechnologyDetailTableDataRecord,
  // 	  deleteTableDataRecord: deleteTechnologyDetailTableDataRecord,
  //   },
  // ] = useTable({
  //   columns: getTechnologyDetailColumns(),
  //   pagination: false,
  //   showTableSetting: false,
  //   striped: true,
  //   showIndexColumn: false,
  //   isTreeTable: false,
  //   isCanResizeParent: true,
  //   canResize: false,
  //   rowKey: 'uuid',
  //   i18nConfig: {
  // 	  moduleCode: 'PCCColumn',
  //   },
  // });

  const [Grid, { reloadData, setGridOptions }] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-PCCBeta-PCCDetail-fileUpload',
      columns: getTechnologyDetailColumns() as any,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      toolbarConfig: {
        enabled: false,
      },
      columnConfig: {
        resizable: true,
      },
      mouseConfig: {
        area: true, // 是否开启区域选取
      },
      areaConfig: {
        multiple: true, // 是否启用多区域选取功能
      },
      pagerConfig: {
        enabled: false,
      },
      keyboardConfig: {
        isClip: true, // 是否开启复制粘贴
        isEdit: true, // 是否开启任意键进入编辑（功能键除外）
        isDel: true, // 是否开启删除键功能
        isEsc: true, // 是否开启Esc键关闭编辑功能
        isEnter: false,
      },
      showOverflow: false,
      rowConfig: {
        keyField: 'uuid',
      },
      // editRules: getProcessRules(),
      height: '',
      data: [],
      clipConfig: {
        isPaste: true,
        excludeFields: ['processName'],
        // afterPasteMethod: handleAfterPaster,
        beforePasteMethod: handleBeforePaster,
      },
      i18nConfig: {
        moduleCode: 'PCCColumn',
      },
    },
  });

  function handleBeforePaster({ targetAreas, pasteCells, $grid }) {
    const { cols, rows } = targetAreas[0];
    let flag = false;
    pasteCells.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const col = cols[colIndex];
        const { field } = col;
        if (field === 'description') {
          flag = true;
        }
      });
    });

    return flag;
  }

  function getTechnologyDetailColumns() {
    return [
      {
        title: '工序',
        field: 'processName',
        width: '160',
        formatter: ({ rowIndex, cellValue }) => {
          if (cellValue) {
            return `${rowIndex + 1}、${cellValue}`;
          }
          return '';
        },
      },
      {
        title: '工序描述',
        field: 'description',
        editRow: true,
        formatter: '',
        editRender: {
          name: 'Editor',
          props: {
            placeholder: t('common.processDescription'),
            editorHeight: '115px',
            mode: 'simple',
            toolbarConfig: {
              toolbarKeys: ['bold', 'color', 'bulletedList', 'numberedList'],
            },
          },
        },
        slots: { default: 'description' },
      },
      {
        title: '工艺示意图',
        field: 'imageList',
        // width: 240,
        slots: { default: 'imageList' },
      },
    ];
  }

  const customerState = reactive({
    procedure: 1,
    uploadStatus: UploadStatus.BeforeUploading,
    uploadFileInfo: {} as UploadFile,
  });

  function beforeInstallUpload(file) {
    const params = {
      file: file,
      filePath: 'PCC',
    };
    uploadInstallFile(params)
      .then(({ code, msg, data }) => {
        if (code == 200) {
          state.installImageList = [];
          state.installImageList.push(data);
          createMessage.success(msg);
        }
      })
      .catch(() => {
        // changeLoading(false);
      });
    return false;
  }

  function handleDelInstallImage() {
    state.installImageList = [];
  }

  const filePreviewRef = ref<any | null>(null);

  async function handlePreview(item) {
    if (!item.flagPath) {
      const params = {
        file: item,
        filePath: 'PCC',
      };
      const {
        data: { filePath },
      } = await uploadInstallFile(params);
      item.flagPath = filePath;
    }
    const params = {
      name: item.name,
      url: item.flagPath,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    filePreviewRef.value?.init(params);
  }

  function downloadInstallFile() {
    downloadByUrl({
      url: http2s(state.installImageList[0].filePath),
      target: '_blank',
      fileName: state.installImageList[0].fileName,
    });
  }

  function getRowSpan(record, index) {
    // 根据Version判断行合并
    if (index === 0 || record?.flagVersion !== state.customerFileList[index - 1]?.flagVersion) {
      const count = state.customerFileList.slice(index).filter(item => item.flagVersion === record.flagVersion).length;
      return count;
    }
    return 0;
  }

  const sampleColumns: BasicColumn[] = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      dataIndex: 'action',
      colSpan: 2,
      // customCell: (record, index, column) => {
      //   const rowSpan = getRowSpan(record, index);
      //   return { rowSpan };
      // }
    },
    {
      title: '',
      colSpan: 0,
      dataIndex: 'delete',
    },
  ];

  const customerUpload = async info => {
    customerState.procedure = 1;
    const interval = setInterval(() => {
      if (customerState.procedure >= 99) return clearInterval(interval);
      customerState.procedure += 1;
    }, 100);
    try {
      customerState.uploadFileInfo = info.file;
      // customerState.uploadStatus = UploadStatus.Uploading;
      // const { msg } = await uploadCustomerDrawings(state.Id, { file: info.file });
      // message.success(msg);
      const params = {
        file: info.file,
        filePath: 'PCC',
      };
      const {
        data: { filePath },
      } = await uploadInstallFile(params);
      state.customerFileList.forEach(item => {
        if (item.name === info.file.name) {
          item.flagPath = filePath;
        }
      });
      // 上传成功
      // customerState.procedure = 100;
      // customerState.uploadStatus = UploadStatus.Success;
    } catch (e) {
      customerState.uploadStatus = UploadStatus.Error;
    } finally {
      clearInterval(interval);
    }
  };

  const customerUploadOption = {
    name: 'file',
    showUploadList: false,
    customRequest: customerUpload,
    beforeUpload: beforeUpload,
  };

  function handleDownload(record) {
    downloadByUrl({
      url: http2s(record.flagPath),
      fileName: record.name,
      target: '_blank',
    });
  }

  function beforeUpload(file, fileList) {
    return new Promise((resolve, reject) => {
      if (state.customerFileList.find(item => item.status == 1)) return false;
      customerState.uploadStatus = UploadStatus.BeforeUploading;
      // const { index, cacheList } = props.state;
      const customerFileList = state.customerFileList;
      // getIsOngoing({
      //   PartNumber: cacheList[index].insidePartNumber,
      // }).then(({ data }) => {
      //   if (data) {
      //     // flag = false
      //     createMessage.warning('该料号有工程图纸在审核中，不能上传新的工程图纸');
      //     resolve(true);
      //   } else {
      //     // 判断重复
      //     fileList.map(file => {
      //       if (!customerFileList.find(item => item.uid == file.uid || item.name == file.name)) {
      //         file.flagVersion = 0;
      //         file.isNewUpload = true;
      //         customerFileList.unshift(file);
      //         reject();
      //       }
      //     });
      //   }
      // });
      for (const file of fileList) {
        // 判断重复
        if (!customerFileList.find(item => item.uid == file.uid || item.name == file.name)) {
          file.flagVersion = 0;
          file.isNewUpload = true;
          customerFileList.unshift(file);
        } else {
          createMessage.warning(t('common.somethingExist', [file.name]));
          return reject('文件已存在');
        }
      }
      resolve(true);
    });
  }

  function handleDeletePic(index) {
    state.customerFileList.splice(index, 1);
  }

  // installImageList: [],
  //   customerFileList: [],

  function setInstallImageList(list) {
    // state.installImageList = list;
    state.installImageList.length = 0;
    state.installImageList.push(...list);
  }

  function setCustomerFileList(list) {
    state.customerFileList = list;
  }

  function getCustomerFileList() {
    return state.customerFileList;
  }

  function getInstallImageList() {
    return state.installImageList;
  }

  function setTechnologyDetailTableData(list) {
    reloadData(list);
  }

  function handleFileChange(e, index, record) {
    record.imageList = e;
  }

  function setDisabled(disabled: boolean) {
    console.log('setDisabledsetDisabledsetDisabledsetDisabledsetDisabled');
    if (disabled) {
      setGridOptions({
        editConfig: {
          enabled: false,
        },
        keyboardConfig: {
          isEdit: false,
          isPaste: false,
        },
      });
    }
  }

  function resetFileList() {
    state.installImageList = [];
    state.customerFileList = [];
  }

  defineExpose({
    setTechnologyDetailTableData,
    setInstallImageList,
    setCustomerFileList,
    getCustomerFileList,
    getInstallImageList,
    setDisabled,
    resetFileList,
  });
</script>

<template>
  <a-card class="lydc-content-wrapper-search-box" style="border-bottom: 1px solid #dbdbdb">
    <div class="flex flex-row justify-between">
      <Subtitle :title="t('dict.PCCApplyColumn.processFlowDetails')" id="processFlowDetails" />
    </div>
    <Grid>
      <template #description="{ row, rowIndex }">
        <div v-html="row.description"></div>
      </template>
      <template #imageList="{ row, rowIndex }">
        <!--        <ImageUpload-->
        <!--          :api="uploadPCCImg"-->
        <!--          width="120px"-->
        <!--          height="120px"-->
        <!--          v-model:value="row.imageList"-->
        <!--          style="min-height: 115px; margin-bottom: 0"-->
        <!--          :maxNumber="3"-->
        <!--          @change="handleFileChange($event, rowIndex, row)" />-->
        <ImageUpload
          :disabled="props.state.mode == 'view'"
          version="2"
          v-model:value="row.imageList"
          updateType="all"
          :maxNumber="props.state.mode == 'view' ? row.imageList?.length : 5"
          :api="null"
          class="min-h-165px mb-0" />
        <!--				:draggablePreview="true"-->
      </template>
    </Grid>
  </a-card>
  <div class="bottom-detail">
    <a-card>
      <Subtitle :title="t('dict.PCCApplyColumn.documentUpload')" />
      <a-row style="align-items: center">
        <a-col :span="3">
          <div class="agn-center">{{ t('dict.PCCApplyColumn.installationDiagram') }}:</div>
        </a-col>
        <a-col :span="18">
          <div v-if="installImageList.length > 0" class="message flex justify-start">
            <div
              class="name cursor-pointer"
              @click="handlePreview({ ...installImageList[0], flagPath: installImageList[0].filePath, name: installImageList[0].fileName })">
              {{ installImageList[0]?.fileName }}
            </div>
            <i
              v-if="props.state.mode !== 'view'"
              @click="downloadInstallFile"
              class="icon-ym icon-ym-btn-download ml-15px"
              style="color: #ff7b00; cursor: pointer"></i>
            <i
              v-if="props.state.mode !== 'view'"
              class="icon-ym icon-ym-delete ml-10px"
              @click.stop="handleDelInstallImage"
              style="color: #ff7b00; cursor: pointer"></i>
          </div>
          <div v-else>
            <div class="message" style="color: #dbdbdb">{{ t('dict.PCCApplyColumn.uploadFile') }} </div>
          </div>
        </a-col>
        <a-col v-if="props.state.mode !== 'view'" :span="3" style="display: flex; justify-content: flex-end">
          <a-upload v-feature :multiple="false" :before-upload="beforeInstallUpload" :showUploadList="false">
            <a-button :disabled="props.state.mode !== 'edit'" class="agn-center" style="text-align: right">{{ t('common.uploadText') }} </a-button>
          </a-upload>
        </a-col>
      </a-row>
    </a-card>
    <div v-if="props.state.bomType == 4" class="engine-upload-wrapper">
      <div class="engine-upload">
        <Subtitle :title="t('dict.PCCApplyColumn.sampleDrawing')" />
      </div>
      <div class="upload-wrapper-item">
        <a-upload v-feature class="btn-upload" :multiple="true" v-bind="customerUploadOption"></a-upload>
        <a-upload-dragger
          v-feature
          :multiple="true"
          :disabled="
            !(props.state.mode !== ModeTypeEnum.VIEW && props.state.mode !== ModeTypeEnum.AUDIT_VIEW) ||
            state.customerFileList.findIndex(item => item.status == 1) !== -1
          "
          :class="customerState.uploadStatus === UploadStatus.Error ? 'upload-pic upload-error' : 'upload-pic'"
          v-bind="customerUploadOption">
          <!--    上传前      -->
          <!--          {{ console.log(props, 'propspropspropspropsprops') }}-->
          <!--          {{  props.state.mode }}-->
          <!--          {{  props.state.mode !== ModeTypeEnum.VIEW }}-->
          <!--          {{  props.state.mode !== ModeTypeEnum.AUDIT_VIEW }}-->
          <template v-if="customerState.uploadStatus === UploadStatus.BeforeUploading">
            <div v-if="state.customerFileList.length <= 0" class="before-box"> {{ t('component.upload.canDragToUpload') }} </div>
            <div v-else>
              <a-table :data-source="state.customerFileList" bordered :columns="sampleColumns" :pagination="false" class="pic-list">
                <template #bodyCell="{ column, record, text, index }">
                  <template v-if="column.dataIndex === 'name'">
                    <a @click.stop="handlePreview(record)">{{ record.name }}</a>
                  </template>
                  <template v-else-if="column.dataIndex === 'action'">
                    <!--                                  <a-button type="link" :disabled="record.flagVersion == 0" @click.stop="handleDownload(record)">下载 </a-button>-->
                    <a-button type="link" @click.stop="handleDownload(record)">{{ t('common.downloadText') }} </a-button>
                  </template>
                  <template v-else-if="column.dataIndex === 'delete'">
                    <!--                    <a-button type="link" :disabled="record.flagVersion != 0" @click.stop="handleDeletePic(index)">删除 </a-button>-->
                    <a-button type="link" :disabled="props.state.cacheList[props.state.index]?.status == 3" @click.stop="handleDeletePic(index)"
                      >删除
                    </a-button>
                  </template>
                </template>
              </a-table>
            </div>
          </template>
          <!--    上传中      -->
          <template v-if="customerState.uploadStatus === UploadStatus.Uploading">
            <!--              <template v-if="state.uploadStatus === UploadStatus.BeforeUploading">-->
            <div class="uploading">
              <a-progress style="width: 80%" :percent="customerState.procedure" size="small" />
            </div>
          </template>
          <!--    上传失败      -->
          <template v-if="customerState.uploadStatus === UploadStatus.Error">
            <div class="error-info">
              <p class="filename flex ct-start">
                {{ customerState.uploadFileInfo.name }}
                <img :src="errorSvg" style="margin-left: 12px" alt="上传失败图标" />
              </p>
              <p class="info">{{ t('component.upload.fileSize') }}： {{ formatFileSize(customerState.uploadFileInfo.size || 0) }}</p>
              <p class="info" style="margin-bottom: 0">{{ t('common.uploadDate') }}： {{ dateUtil().format('YYYY/MM/DD HH:mm:ss') }}</p>
              <div class="btn-container">
                <a-upload v-feature v-bind="customerUploadOption">
                  <!--                    <a-button>重新选择</a-button>-->
                </a-upload>
                <!-- <a-button danger style="margin-left: 20px" @click="handleRemoveCustomerFile">{{ t('component.upload.del') }} </a-button> -->
              </div>
            </div>
          </template>
          <!--    上传成功      -->
          <template v-if="customerState.uploadStatus === UploadStatus.Success">
            <div class="error-info">
              <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 10px">
                <img :src="successSvg" style="height: 22px; margin-right: 12px" alt="上传成功图标" />
                <div class="info" style="margin-bottom: 0">{{ t('component.upload.uploadSuccess') }} </div>
              </div>
              <p class="info" style="margin-bottom: 0">{{ t('common.uploadDate') }}： {{ dateUtil().format('YYYY/MM/DD HH:mm:ss') }}</p>
              <div class="btn-container">
                <!-- <a-button ghost type="primary" style="margin-left: 20px" @click="handleRemoveCustomerFile">继续上传 </a-button> -->
              </div>
            </div>
          </template>
        </a-upload-dragger>
      </div>
    </div>
  </div>
  <Preview ref="filePreviewRef" />
</template>

<style lang="less" scoped>
  .technology-detail-wrapper {
    display: flex;
    flex-direction: column;

    .detail-wrapper {
      display: flex;
      flex-direction: row;
    }

    .left-detail {
      flex: 4;
    }

    .right-detail {
      flex: 2;
      display: flex;
      flex-direction: column;

      .agn-center {
        display: flex;
        align-items: center;
      }

      .message {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 4px 15px;
        border: 1px solid #dbdbdb;
        border-radius: 3px;
        margin: 0 5px;

        .name {
          color: #ff7b00;
        }
      }

      .engine-upload {
        margin: 5px 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

  .engine-upload-wrapper {
    display: flex;
    flex-direction: column;
  }

  // 上传前
  .before-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    min-height: 200px;
    color: #999;
  }

  // 上传中
  .uploading {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .uploading-title {
      display: flex;
      flex-direction: row;
      width: 100%;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
    }

    .upload-name {
      margin-right: 20px;
      width: 200px;
    }
  }

  .upload-wrapper-item {
    display: flex;
    flex-direction: column;
    width: 100%;

    & > span:last-of-type {
      height: max-content;
      // min-height: 200px;
    }

    .upload-btn-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 10px;

      .tip {
        margin-left: 8px;
      }
    }
  }

  //ant-upload-list ant-upload-list-picture-card
  :deep(.ant-upload-list) {
    display: flex;
  }

  :deep(.upload-pic) {
    width: 100%;
  }

  :deep(.ant-upload-list-item-actions) {
    display: flex;
    align-items: center;
    justify-content: center;

    & > a > span {
      display: flex;
      height: 24px;
      align-items: center;
      justify-content: center;
      margin-right: 20px !important;
      margin-top: 2px !important;
    }
  }

  :deep(.wang-editor-container .wang-editor-editor) {
    padding: 0;
  }

  :deep(ul, ol) {
    list-style: disc;
    margin-left: 20px;
  }

  :deep(ol, li) {
    list-style: auto;
    margin-left: 20px;
  }

  :deep(.ant-upload.ant-upload-select-picture-card) {
    height: 155px !important;
    width: 155px !important;
  }

  :deep(.ant-upload-list-item-container) {
    height: 155px !important;
    width: 155px !important;
  }
</style>
