<!-- 单文件上传（暂时只支持excel -->
<template>
  <a-upload
    v-feature
    class="upload-area"
    accept=".xls,.xlsx"
    :max-count="1"
    :action="getAction"
    :headers="getHeaders"
    :showUploadList="false"
    :before-upload="beforeUpload"
    @change="handleFileChange">
    <slot :loading="loading">
      <a-button :loading="loading" :type="props.type">
        {{ props.buttonText }}
      </a-button>
    </slot>
  </a-upload>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { getToken } from '/@/utils/auth';
  import { useMessage } from '/@/hooks/web/useMessage';

  import type { UploadChangeParam } from 'ant-design-vue';
  import { isFunction } from '/@/utils/is';

  interface IProps {
    api: string;
    buttonText: string;
    type?: string;
    afterUpload?: (res: any) => void;
  }

  const props = withDefaults(defineProps<IProps>(), {
    api: '',
    type: 'primary',
    buttonText: '上传文件',
  });

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

  function beforeUpload(file) {
    const isRightSize = file.size / 1024 < 10000;
    if (!isRightSize) createMessage.error(`文件大小不能超过10MB`);
    return isRightSize;
  }
</script>
