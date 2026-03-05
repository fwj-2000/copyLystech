<template>
  <BasicModal v-bind="$attrs" :width="1000" @register="registerModal" @ok="handleSubmit" title="打印设计">
    <PrintTemplateCreator ref="printTemplateCreatorRef" :template-data="templateData" :treeDataValue="treeDataValue" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import PrintTemplateCreator from './src/designIndex.vue';
  import { addPrintTemplate } from '/@/api/system/printTemplate';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';

  defineOptions({ name: 'PrintDesignModal' });
  const props = defineProps({
    templateData: {
      type: Object,
      default: () => {},
    },
    templateValue: {
      type: Object,
      default: () => {},
    },
    treeDataValue: {
      type: Array,
      default: () => [],
    },
  });
  const emit = defineEmits(['register', 'reload']);
  const { t } = useI18n();

  const printTemplateCreatorRef = ref(null);

  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  const { createMessage } = useMessage();

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
      closeModal();
      emit('reload');
    }
  }
  function init() {}
</script>
