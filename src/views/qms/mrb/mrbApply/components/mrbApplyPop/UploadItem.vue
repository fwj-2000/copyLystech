<template>
  <a-upload
    v-feature
    v-model:file-list="internalFileList"
    v-bind="mergedUploadParams"
    class="upload-area"
    @download="handleFileDownload"
    @remove="handleFileRemove"
    @preview="handleFilePreview">
    <a-button v-if="internalFileList?.length < mergedUploadParams.maxCount && mergedUploadParams.showUploadBtn">
      <upload-outlined></upload-outlined>{{ t('component.upload.uploadFile') }}</a-button
    >

    <template #itemRender="data">
      <a-space>
        <span :class="[data.file.status === 'error' ? 'text-[red]' : '', 'w-140px', 'flex', 'flex-start', 'align-center']">
          <i class="icon-ym icon-ym-h5" style="color: blue"></i>
          <div class="text-ellipsis">
            <a-tooltip>
              <template #title>{{ data.file.name }}</template>
              {{ data.file.name }}
            </a-tooltip>
          </div>
        </span>
        <a href="javascript:;" @click="data.actions.preview" v-if="mergedUploadParams.showUploadList.showPreviewIcon">{{ t('common.previewText') }}</a>
        <a href="javascript:;" @click="data.actions.download" v-if="mergedUploadParams.showUploadList.showDownloadIcon">{{ t('common.downloadText') }}</a>
        <a href="javascript:;" @click="data.actions.remove" v-if="mergedUploadParams.showUploadList.showRemoveIcon">{{ t('common.delText') }}</a>
      </a-space>
    </template>
  </a-upload>
  <Preview ref="filePreviewRef" />
</template>

<script setup lang="ts">
  import { ref, watch, computed } from 'vue';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import Preview from '/@/components/Upload/src/components/Preview.vue';
  import { getToken } from '/@/utils/auth';
  import { uploadfiles } from '/@/api/basic/common';
  import { useI18n } from 'vue-i18n';
  import { useGlobSetting } from '/@/hooks/setting';
  const globSetting = useGlobSetting();
  const { t } = useI18n();
  // 外部回显需要展示的数据格式：
  // const fileList = [
  //   {
  //     fullPath: item.reportPath,
  //     originFileName: item.reportName,
  //     name: item.reportName,
  //   },
  // ];
  const props = withDefaults(
    defineProps<{
      fileList?: any[];
      uploadParams?: Object;
    }>(),
    {
      fileList: () => [],
      uploadParams: () => ({}),
    },
  );

  const emit = defineEmits(['update:fileList', 'change']);

  const filePreviewRef = ref();
  const isViewModel = ref(false);
  const internalFileList = ref([...props.fileList]);
  const mergedUploadParams = computed(() => ({
    showUploadBtn: true,
    multiple: true,
    name: 'fileList',
    maxCount: 10,
    headers: { Authorization: getToken() as string },
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: true,
    },
    beforeUpload: handleBeforeUpload,
    ...props.uploadParams,
  }));

  // watch(
  //   () => props.fileList,
  //   newVal => {
  //     console.log(newVal);
  //     // 使用哈希比对避免不必要的更新
  //     const currentHash = JSON.stringify(internalFileList.value);
  //     const newHash = JSON.stringify(newVal);
  //     if (currentHash !== newHash) {
  //       internalFileList.value = [...newVal];
  //     }
  //   },
  //   { deep: true },
  // );
  function emitUpdate(list: any[]) {
    emit('update:fileList', list);
    emit('change', list);
  }
  function updateFileList(newList) {
    internalFileList.value = internalFileList.value.map(item => {
      if (item?.name === newList.name) {
        return {
          ...item,
          ...newList,
        };
      }
      return item;
    });
    emitUpdate(internalFileList.value);
  }

  function handleFileDownload(e) {
    const { fullPath, name } = e;
    const params = { url: fullPath, fileName: name };
    if (e.response) {
      const { data } = e.response;
      params.url = data[0].fullPath;
      params.fileName = data[0].originFileName;
    }
    openResouces(params);
  }

  function handleFilePreview(e) {
    const { fullPath, name } = e;
    const params = { url: fullPath, fileName: name };
    if (e.response) {
      const { data } = e.response;
      params.url = data[0].fullPath;
      params.fileName = data[0].fileName;
    }
    filePreviewRef.value?.init({
      filePath: params.url,
      name: params.fileName,
      version: 2,
    });
  }

  function handleBeforeUpload(file) {
    const fileParams = new FormData();
    fileParams.append('fileList', file);
    uploadfilesFn(fileParams);
    return false;
  }

  async function uploadfilesFn(params) {
    try {
      const { data } = await uploadfiles(params);
      if (data) {
        const newFile = {
          fullPath: data[0].fullPath,
          originFileName: data[0].originFileName,
          name: data[0].originFileName,
        };

        updateFileList(newFile);
      }
    } catch (error) {
      console.error(error);
      emit('change', { success: false, error });
    }
  }

  function handleFileRemove(e) {
    const newFileList = internalFileList.value.filter(item => item.fullPath !== e.fullPath);
    emitUpdate(newFileList);
  }

  function openResouces({ url, fileName }: { url: string; fileName: string }) {
    return window.open(`${globSetting.apiUrl}/api/Information/fileinfo/downloadfile?filePath=${url}&fileName=${fileName}`);
  }
</script>
