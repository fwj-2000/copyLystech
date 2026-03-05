<!-- 单文件上传（暂时只支持excel -->
<template>
  <div class="w-[100%] bg-red">
    <a-upload
      v-feature
      class="inline-block w-[100%]"
      accept=".xls,.xlsx"
      :max-count="1"
      :action="getAction"
      :headers="getHeaders"
      :showUploadList="false"
      :before-upload="beforeUpload"
      @change="handleFileChange">
      <slot :loading="loading">
        <div class="w-[100%]"> {{ buttonText }}</div>
      </slot>
    </a-upload>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, computed } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { getToken } from '/@/utils/auth';
  import { useMessage } from '/@/hooks/web/useMessage';

  import type { UploadChangeParam } from 'ant-design-vue';
  import { isFunction } from '/@/utils/is';

  interface IProps {
    api: string;
    buttonText: string;
    afterUpload?: (res: any) => void;
  }

  export default defineComponent({
    name: 'SingleUpload',
    props: {
      api: {
        type: String,
        default: '',
      },
      buttonText: {
        type: String,
        default: '上传文件',
      },
      afterUpload: {
        type: Function,
        default: undefined,
      },
    },
    setup(props: IProps) {
      const globSetting = useGlobSetting();
      const { createMessage } = useMessage();
      const loading = ref<boolean>(false);

      const getAction = computed(() => `${globSetting.apiUrl}${props.api}`);
      const getHeaders = computed(() => ({ Authorization: getToken() as string }));

      function handleFileChange({ file }: UploadChangeParam) {
        loading.value = true;
        if (file.status === 'error') {
          loading.value = false;
          createMessage.error('上传失败');
          return;
        }
        if (file.status === 'done') {
          loading.value = false;
          if (file.response.code !== 200) {
            createMessage.error(file.response.msg);
          } else {
            createMessage.success('上传成功');
            if (isFunction(props.afterUpload)) {
              props.afterUpload(file.response.data);
            }
          }
        }
      }

      function beforeUpload(file: File) {
        const isRightSize = file.size / 1024 < 10000;
        if (!isRightSize) createMessage.error(`文件大小不能超过10MB`);
        return isRightSize;
      }

      return {
        loading,
        getAction,
        getHeaders,
        handleFileChange,
        beforeUpload,
      };
    },
  });
</script>

<style lang="less" scoped>
  .ant-upload {
    display: inline-block;
    width: 100%;
  }

  :deep(.ant-upload-wrapper .ant-upload) {
    .ant-upload;
  }
</style>
