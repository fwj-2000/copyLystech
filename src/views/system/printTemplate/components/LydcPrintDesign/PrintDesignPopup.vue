<template>
  <BasicPopup v-bind="$attrs" :showOkBtn="true" :okText="t('common.submitText')" destroyOnClose class="full-popup" @register="registerPopup" @ok="handleSubmit">
    <PrintTemplateCreator v-if="printComponent" ref="printTemplateCreatorRef" :template-data="templateData" :treeDataValue="treeDataValue" />
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { addPrintTemplate } from '/@/api/system/printTemplate';
  import { useMessage } from '/@/hooks/web/useMessage';
  import PrintTemplateCreator from './src/designIndex.vue';

  defineOptions({ name: 'PrintDesignPopup' });
  const props = defineProps({
    templateData: {
      type: Object,
      default: () => {},
    },
    // 模板数据
    templateValue: {
      type: Object,
      default: () => {},
    },
    treeDataValue: {
      type: Array,
      default: () => [],
    },
  });
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const printTemplateCreatorRef = ref(null);
  const printComponent = ref(false);
  const [registerPopup, { changeOkLoading, closePopup, changeLoading }] = usePopupInner(init);
  const emit = defineEmits(['register', 'reload']);
  function init() {
    printComponent.value = true;
  }

  /**
   * @description 提交
   */
  async function handleSubmit() {
    let json = printTemplateCreatorRef.value!.getTemplateJson();
    // console.log(props.templateData, 'props.templateData');

    props.templateData.sqlTemplate = JSON.stringify(props.templateData.sqlTemplate);
    let data = {
      ...props.templateData,
      parameterJson: '[]',
      template_json: JSON.stringify(json),
    };
    let res = await addPrintTemplate(data);
    if (res.code == 200) {
      createMessage.success(res.msg);
      changeOkLoading(false);
      closePopup();
      emit('reload');
      printComponent.value = false;
    }
  }
</script>
