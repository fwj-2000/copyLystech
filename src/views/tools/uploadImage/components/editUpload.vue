<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :width="1010" :title="getTitle" showOkBtn @ok="handleSubmit">
    <BasicForm @register="registerForm" />
    <div class="w-full h-[450px] border border-[#ccc] p-[20px] rounded-[10px] overflow-auto">
      <ImageUpload ref="ImageUploadRef" :maxNumber="99" :value="uploadList" version="2" />
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { getUploadImageById, addUploadImage, updateUploadImage } from '/@/api/tools/uploadImage';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  import { ImageUpload } from '/@/components/Upload';
  import { getFactorylist } from '/@/api/business/projectMember';
  const { t } = useI18n();
  const baseStore = useBaseStore();
  const imageList = ref<any[]>([]);
  const uploadList = ref<any[]>([]);
  const state = ref<any>({ id: '' });
  const ImageUploadRef = ref();
  const schemas: FormSchema[] = [
    {
      field: 'mainProcess',
      label: '主要制程',
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('MainProcess'),
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        placeholder: '主要制程',
        allowClear: true,
        onChange: a => {
          setFieldsValue({ factoryCode: '' });
          getFactorylistValue(a);
        },
      },
      required: true,
      colProps: { span: 6 },
    },
    {
      label: '工厂',
      labelWidth: 80,
      field: 'factoryCode',
      i18nField: 'factory',
      component: 'Select',
      componentProps: {
        placeholder: '工厂',
      },
      required: true,
      colProps: { span: 6 },
    },
    {
      field: 'region',
      label: t('dict.PurchaseQuotationColumn.region'), //'区域',
      labelWidth: 80,
      component: 'Input',
      required: true,
      colProps: { span: 6 },
    },
    {
      field: 'imageType',
      label: t('dict.imageType'), //'图片类型',
      labelWidth: 80,
      component: 'ApiSelect',
      componentProps: {
        api: () => baseStore.getDictionaryData('imageType'),
        placeholder: t('dict.imageType'), //'图片类型',
        labelField: 'fullName',
        valueField: 'enCode',
      },
      required: true,
      colProps: { span: 6 },
    },
  ];
  const getTitle = computed(() => (state.value.id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  const [registerForm, fromApi] = useForm({
    labelWidth: 80,
    schemas: schemas,
  });
  const { setFieldsValue, validate, resetFields, clearValidate } = fromApi;
  function init(data) {
    resetFields();
    clearValidate();
    imageList.value = [];
    uploadList.value = [];
    ImageUploadRef.value.fileList = [];
    state.value = data;
    if (state.value.id) {
      state.value.mainProcess = String(state.value.mainProcess);
      setFieldsValue(state.value);
      imageList.value = state.value.imageList || [];
      uploadList.value = [...imageList.value];
      getFactorylistValue(state.value.mainProcess);
    }
  }
  async function getFactorylistValue(val) {
    let { data } = await getFactorylist({ mainProcess: val });
    fromApi.updateSchema([
      {
        field: 'factoryCode',
        componentProps: {
          options: data,
          fieldNames: {
            label: 'Name',
            value: 'Code',
          },
        },
      },
    ]);
  }
  function formatImageList(list) {
    return list
      .map(item => {
        if (item.response?.data?.[0]) {
          const fileData = item.response.data[0];
          return {
            name: fileData.originFileName,
            url: fileData.fullPath,
          };
        }

        if (item.url) {
          const urlParts = item.url.split('/DocumentFile/');
          const realPath = urlParts[1] ? 'DocumentFile/' + urlParts[1] : '';
          return {
            name: item.name,
            url: realPath,
          };
        }

        return null;
      })
      .filter(Boolean);
  }

  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    if (ImageUploadRef.value.fileList.length <= 0) {
      return createMessage.warning('请上传图片');
    }
    values.imageObj = formatImageList(ImageUploadRef.value.fileList);
    const api = state.value.id ? updateUploadImage : addUploadImage;
    api(values).then(({ msg }) => {
      createMessage.success(msg);
      changeOkLoading(false);
      closeModal();
      resetFields();
      emit('reload');
    });
  }
</script>

<style scoped lang="less">
  :deep(.ant-upload-list) {
    flex-wrap: wrap;
  }
</style>
