<template>
  <div>
    <!-- 1. 上传触发按钮：点击先显示弹窗，而非直接选文件 -->
    <a-button :loading="loading" @click="openModal(true, {})">
      {{ props.buttonText }}
    </a-button>

    <!-- 2. 参数选择弹窗：日期选择 + 下拉框选择 -->
    <BeforeImportModal :showSupRegMonth="props.showSupRegMonth" @register="registerModal" @handleSubmit="handleModalConfirm" />
    <!-- @reload="waitReload" -->

    <!-- 3. 实际上传组件：隐藏默认按钮，通过ref手动触发 -->
    <a-upload
      ref="uploadRef"
      v-feature
      class="hidden-upload"
      accept=".xls,.xlsx"
      :max-count="1"
      :action="getAction"
      :headers="getHeaders"
      :showUploadList="false"
      :before-upload="beforeUpload"
      @change="handleFileChange">
      <!-- 隐藏默认上传按钮，通过ref触发点击 -->
      <a-button style="display: none">隐藏上传按钮</a-button>
    </a-upload>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { getToken } from '/@/utils/auth';
  import { useMessage } from '/@/hooks/web/useMessage';
  import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
  import { isFunction } from '/@/utils/is';
  import { useModal } from '/@/components/Modal';
  import BeforeImportModal, { BatchModalSubmitData } from './BeforeImportModal.vue';
  const emit = defineEmits(['beforeUpload']);

  interface IProps {
    api: string;
    buttonText: string;
    afterUpload?: (res: any) => void;
    showSupRegMonth?: boolean; // 是否显示补提月字段
  }
  const [registerModal, { openModal }] = useModal();

  const props = withDefaults(defineProps<IProps>(), {
    api: '',
    buttonText: '上传文件',
    showSupRegMonth: false,
  });

  // 全局配置和消息提示
  const globSetting = useGlobSetting();
  const { createMessage } = useMessage();

  // 1. 上传相关状态
  const loading = ref<boolean>(false); // 整体加载状态
  const uploadRef = ref<UploadProps | null>(null); // 上传组件ref（用于手动触发）
  const upLoadPrams = ref<string>(``); // 上传附带参数
  const getAction = computed(() => `${globSetting.apiUrl}${props.api}${upLoadPrams.value}`);

  // 上传请求头（携带token）
  const getHeaders = computed(() => ({ Authorization: getToken() as string }));

  // -------------------------- 事件处理 --------------------------
  //   弹窗确认：参数校验通过后，触发文件选择
  const handleModalConfirm = (e: BatchModalSubmitData) => {
    // 构建上传参数，包含补提月（如果存在）
    let params = `?month=${e.month}&during=${e.durIng}`;
    if (e.supRegMonth) {
      params += `&supRegMonth=${e.supRegMonth}`;
    }
    upLoadPrams.value = params;
    // console.log('upLoadPrams', upLoadPrams.value, getAction);
    // 通过ref手动触发上传组件的点击事件（打开文件选择框）
    // @ts-ignore
    unref(uploadRef)?.$el?.querySelector('button')?.click();
  };

  // 文件上传前校验（保留原有大小校验逻辑）
  const beforeUpload = (file: File) => {
    console.log('beforeUpload');
    const isRightSize = file.size / 1024 < 10000;
    if (!isRightSize) createMessage.error(`文件大小不能超过10MB`);
    return isRightSize;
  };

  // 上传状态变化
  const handleFileChange = ({ file }: UploadChangeParam) => {
    if (file.status === 'error' && !loading.value) {
      createMessage.error('上传失败（补充提示）');
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
  };
</script>

<style lang="less" scoped>
  /* 隐藏上传组件的默认按钮 */
  .hidden-upload {
    display: inline-block;
    width: 0;
    height: 0;
    overflow: hidden;
  }

  /* 弹窗内表单间距优化 */
  .param-form {
    .ant-picker,
    .ant-select {
      margin-bottom: 16px;
    }

    .ant-select:last-child {
      margin-bottom: 0;
    }
  }
</style>
