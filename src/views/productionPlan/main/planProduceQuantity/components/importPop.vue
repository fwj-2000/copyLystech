<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.saveText')"
    :okButtonProps="okBtnProps"
    :title="title"
    destroyOnClose
    class="full-popup p-10px"
    @ok="handleSave"
    @visible-change="handleVisibleChange">
    <uploadExcelData v-if="!!state.tempList.length" :list="state.tempList" />
    <BatchImport
      v-else
      :tplInfo="{ title: '批量导入' }"
      :template-api="templateDownload"
      :save-import-api="importSave"
      :preview-api="importPreview"
      class="mt-16px"
      @update="updateExcelInfo" />
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, onMounted } from 'vue';
  import { importPreview, importSave, templateDownload } from '/@/api/productionPlan/planProduceQuantity';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BatchImport } from '/@/components/Import';
  import uploadExcelData from './uploadExcelData.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();

  const emits = defineEmits(['register', 'reload']);

  interface State {
    title: string;
    searchDate: string;
    tableList: any[];
    tempList: any[];
    BatchCode: any;
  }

  const { t } = useI18n();
  const state = reactive<State>({
    title: '',
    searchDate: '',
    tableList: [],
    tempList: [],
    BatchCode: '',
  });

  const okBtnProps = reactive({
    disabled: true,
  });

  const { title } = toRefs(state);

  const [registerPopup, { changeOkLoading, closePopup }] = usePopupInner(init);

  function init(data) {
    state.title = '批量导入';
    state.searchDate = data.searchDate;
    state.tempList = [];
    okBtnProps.disabled = true;
    state.BatchCode = '';
  }
  function updateExcelInfo(BatchCode, list) {
    state.BatchCode = BatchCode || '';
    okBtnProps.disabled = !state.BatchCode;
    state.tempList = list;
  }
  const handleVisibleChange = v => {
    if (!v) {
      okBtnProps.disabled = true;
      state.BatchCode = '';
    }
  };
  const handleSave = () => {
    changeOkLoading(true);
    importSave({ batchCode: state.BatchCode, searchDate: state.searchDate })
      .then(res => {
        changeOkLoading(false);
        createMessage.success(res?.message || '导入成功');
        closePopup();
        emits('reload');
      })
      .catch(err => {
        console.log(err, 'err');
      });
  };
  onMounted(() => {
    init({});
  });
</script>
