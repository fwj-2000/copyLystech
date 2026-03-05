<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="t('dict.CommonCol.viewJSON')"
    showOkBtn
    @ok="handleSubmit"
    :okText="t('component.upload.download')"
    width="800px">
    <json-viewer :value="content" copyable theme="jv-light" :expand-depth="Infinity" />
  </BasicModal>
</template>
<script setup lang="ts">
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { JsonViewer } from 'vue3-json-viewer';
  import 'vue3-json-viewer/dist/vue3-json-viewer.css';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { message } from 'ant-design-vue';

  const emit = defineEmits(['register', 'added', 'reload']);
  const { t } = useI18n();

  const content = ref('');
  const initData = ref({ jsonkh: '', serialNumber: '', result: '' });

  const [registerModal] = useModalInner(init);

  async function init(data) {
    initData.value = data;
    content.value = JSON.parse(data.jsonkh);
  }

  //提交
  async function handleSubmit() {
    const blob = new Blob([initData.value.jsonkh], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // 创建一个a标签并模拟点击来下载文件
    const a = document.createElement('a');
    a.href = url;
    a.download = `${initData.value.serialNumber}_${initData.value.result.toLowerCase() === 'ok' ? 'PASS' : 'FAIL'}_SINKFLOOR_DIMENSION.json`; // 指定下载文件的名称
    document.body.appendChild(a);
    a.click();
    a.remove();
    // 释放URL对象
    URL.revokeObjectURL(url);
    message.success(t('dict.CommonCol.downloadSuccessful'));
  }
</script>
