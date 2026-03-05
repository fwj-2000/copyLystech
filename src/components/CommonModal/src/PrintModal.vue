<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="state.title" :showOkBtn="false" destroyOnClose width="540px">
    <BasicForm @register="registerForm" />
    <div class="iframe-container">
      <iframe ref="iframeEl" :src="state.src" :width="state.width" :height="state.height"></iframe>
    </div>

    <template v-if="state.customPrint" #footer>
      <div class="footer-container">
        <!-- 取消 按钮 -->
        <a-button @click="closeModal">{{ t('common.cancel') }}</a-button>
        <!-- 打印 按钮 -->
        <a-button type="primary" @click="handleCustomPrint">{{ t('common.printText') }}</a-button>
      </div>
    </template>
  </BasicModal>
</template>

<script setup lang="ts">
  interface PrintDataItem {
    [K: string]: any;
  }

  interface InitParams {
    title?: string;
    printData: PrintDataItem[]; // 打印数据 json
    templateId: string | number; // 打印模板ID
    customPrint?: (el: HTMLIFrameElement) => {}; // 自定义打印方法
  }

  import { nextTick, reactive, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { getLabelTemplateList } from '/@/api/productionDeal/labelTemplate';
  import { useI18n } from '/@/hooks/web/useI18n';

  const globSetting = useGlobSetting();
  const { t } = useI18n();
  const { createMessage } = useMessage();
  const schemas: FormSchema[] = [
    {
      field: 'LabelTemplateId',
      label: '标签模板',
      component: 'ApiSelect',
      componentProps: {
        api: getLabelTemplateList,
        placeholder: '请选择标签模板',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'labelName',
        },
        resultField: 'data',
        labelField: 'LabelName',
        valueField: 'Id',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      colProps: {
        span: 12,
      },
    },
  ];
  const [registerForm, { setFieldsValue }] = useForm({
    labelWidth: 140,
    // schemas: schemas,
    layout: 'vertical',
  });
  const [registerModal, { closeModal }] = useModalInner(init);
  const state = reactive({
    iframeSrc: '',
    src: '',
    title: '',
    width: '100%',
    height: '600',
    /** 自定义打印方法 */
    customPrint: null as any,
  });

  const apiUrl = globSetting.apiUrl;
  const printUrl = globSetting.printPageUrl;

  async function init({ title = '打印', printData, templateId, customPrint }: InitParams) {
    state.title = title;
    state.customPrint = customPrint || null;
    setFieldsValue({ LabelTemplateId: templateId });
    if (!printData.length) {
      createMessage.warning('缺少打印数据');
      closeModal();
    } else if (!templateId) {
      createMessage.warning('缺少打印模板id');
      closeModal();
    }
    const formData = new URLSearchParams();
    formData.append('printData', JSON.stringify(printData));
    try {
      const { data }: any = await setPrintData(formData);
      nextTick(() => {
        state.src = `${apiUrl}/printIndex?id=${templateId}&printDataId=${data}`;
      });
    } catch (error) {
      console.error('function setPrintData error:', error);
    }
  }

  function setPrintData(formData: URLSearchParams): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(apiUrl + '/printIndex/setPrintData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          resolve(data);
        })
        .catch(error => reject(error));
    });
  }

  const iframeEl = ref<HTMLIFrameElement>();
  function handleCustomPrint() {
    if (typeof state.customPrint === 'function') {
      (state.customPrint as Function)(iframeEl.value);
    }
  }
</script>

<style scoped>
  .iframe-container {
    position: relative;
    width: 100%;
    height: 500px;
    border: 1px solid #e5e5e5;
  }

  iframe {
    width: 100%;
    height: 100%;
    border: none; /* 移除边框 */
  }
</style>
