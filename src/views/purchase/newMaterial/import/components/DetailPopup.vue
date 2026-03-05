<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="tempraryStatus"
    :title="state.title"
    :okText="t('common.submitText')"
    :cancelButtonProps="{ class: 'mr-12px' }"
    destroyOnClose
    class="full-popup"
    @ok="handleSave">
    <template #insertToolbar>
      <div class="toggle-current flex" v-if="state.total > 1">
        <a-button preIcon="icon-ym icon-ym-left" @click="handleChangePage('pre')" :disabled="state.currentIndex < 1"></a-button>
        <div class="state-box m-2">
          <span>{{ state.currentIndex + 1 }}</span> / {{ state.total }}
        </div>
        <a-button preIcon="icon-ym icon-ym-right" @click="handleChangePage('next')" :disabled="state.currentIndex >= state.total - 1"></a-button>
        <a-divider type="vertical" class="ml-10px"></a-divider>
      </div>
    </template>
    <template #centerToolbar>
      <a-button class="mr-12px" v-if="state.type !== 'detailed'" @click="handleUpload">{{ t('common.upFiles') }}</a-button>
      <a-button class="mr-12px" v-if="tempraryStatus" @click="handleVerify">{{ t('common.metariaDesc') }}</a-button>
      <a-button :loading="state.storageLoading" v-if="tempraryStatus" type="primary" ghost @click="handleSave('storage')">{{
        t('common.temporarySave')
      }}</a-button>
    </template>
    <ScrollContainer>
      <div class="pop-item">
        <subtitle :title="t('common.baseinfo')"></subtitle>
        <BasicForm @register="registerForm"></BasicForm>
      </div>
      <!-- <div class="pop-item">
        <subtitle :title="t('common.projectInfo')"></subtitle>
        <BasicForm
          @register="registerProjectForm"
          @field-value-change="
            (e, data) => {
              handleValueChange(e, data);
            }
          "></BasicForm>
      </div> -->
      <div class="pop-item">
        <subtitle :title="t('common.metariaInfo')"></subtitle>
        <BasicForm
          @register="registerMaterialForm"
          @field-value-change="
            (e, data) => {
              handleValueChange(e, data);
            }
          "></BasicForm>
      </div>
      <div class="pop-item">
        <subtitle :title="t('dict.MaterialDevelopApplyColumn.files')"></subtitle>
        <div style="margin-bottom: 20px">
          <FilesList :list="state.fileList" :download-api="fileDownload" :del-api="delFileDownload" :disabled="state.type == 'detailed'"></FilesList>
        </div>
      </div>
    </ScrollContainer>
    <UploadModal @register="registerUpload" @success="handleAfterUpload" />
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { computed, reactive, nextTick } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { baseFrorm, materialFrorm } from '../config';
  import { ScrollContainer } from '/@/components/Container';
  import { getDetails, storageMaterial, updateMaterial, upload, fileDownload, delFileDownload, getFiles } from '/@/api/purchase/importMateria';
  import { Subtitle } from '/@/components/Subtitle';
  import { message } from 'ant-design-vue';
  import { getMaterialList } from '/@/api/purchase/materialBase';
  import FilesList from './FilesList.vue';
  import { useModal } from '/@/components/Modal';
  import { FileListModal, UploadModal } from '/@/components/Upload';
  import { autoSpec } from '/@/api/engineering/newMateria';

  const { t } = useI18n();
  const emits = defineEmits(['register', 'reload']);

  interface StateType {
    title: string;
    type: 'edit' | 'add' | 'view' | 'detailed';
    id: string;
    fileList: any[];
    total: 0;
    currentIndex: 0;
    ids: [];
    storageLoading: boolean;
  }

  const tempraryStatus = computed(() => {
    if (state.type == 'detailed') {
      return false;
    }
    return true;
  });

  const state = reactive<StateType>({
    title: '新增',
    type: 'add',
    id: '',
    fileList: [],
    total: 0,
    currentIndex: 0,
    ids: [],
    storageLoading: false,
  });

  const [registerUpload, { openModal: openUpload }] = useModal();

  const [registerForm, { setFieldsValue, getFieldsValue, validate, setProps }] = useForm(baseFrorm());
  // const [
  //   registerProjectForm,
  //   { validate: validateProject, getFieldsValue: getFieldsValueProject, setFieldsValue: setFieldsValueProject, setProps: setPropsProject },
  // ] = useForm(projectFrorm(handleInsidePartChange));
  const [
    registerMaterialForm,
    { getFieldsValue: getFieldsValueMateria, validate: validateMateria, setFieldsValue: setFieldsValueMaterial, setProps: setPropsMaterial, updateSchema },
  ] = useForm(materialFrorm(handleValidate, handleValueChange));
  const [registerPopup, { changeOkLoading, closePopup, changeLoading }] = usePopupInner(init);
  async function init(data) {
    const type = data.type || 'edit';
    state.type = type;
    state.title = data.title || t('common.detailText');
    state.id = data.id;
    if (data.ids) {
      state.ids = data.ids;
      state.id = data.ids[0];
      state.total = data.ids.length;
    }
    getDetail();
  }

  async function getDetail() {
    try {
      changeLoading(true);
      const r = await getDetails([state.id]);
      const _d = r.data[0];
      handleSupplierChange(_d.supplierName, 'supplierId');
      // handleSupplierChange(_d.originalManufacturerName, 'originalManufacturerId');
      state.id = _d.id;
      state.fileList = _d.technologyInfoList;
      setFieldsValue(_d);
      // setFieldsValueProject(_d);
      setFieldsValueMaterial(_d);
      handleValueChange('materialAreaId', _d.materialAreaId, true);
      handleValueChange('materialClassId', _d.materialClassId, true);
      if (state.type == 'detailed') {
        handleDisabled();
      }
      nextTick(() => {
        changeLoading(false);
      });
    } catch (error) {
      closePopup();
    }
  }

  function handleValidate(ops) {
    const { substrateThickness, materialThicknessTotal } = getFieldsValueMateria();
    if (typeof substrateThickness == 'number' && typeof materialThicknessTotal == 'number' && substrateThickness >= materialThicknessTotal) {
      return Promise.reject(ops.createMessage as string);
    }
    return Promise.resolve();
  }

  function handleChangePage(type) {
    if (type == 'pre') {
      state.currentIndex--;
    } else {
      state.currentIndex++;
    }
    state.id = state.ids[state.currentIndex];
    getDetail();
  }

  // 内部产品料号变动
  function handleInsidePartChange(value, data) {
    const { TerminalCustomerName, ProductLineCode } = data;
    setFieldsValue({
      productLineCode: ProductLineCode,
      terminalCustomerName: TerminalCustomerName,
    });
  }

  // 上传文件
  function handleUpload() {
    openUpload(true, {
      id: state.id,
      title: t('dict.MaterialDevelopApplyColumn.files'),
      uploadApi: upload,
    });
  }
  async function handleAfterUpload() {
    const r = await getFiles(state.id);
    state.fileList = r.data;
  }

  function handleDisabled() {
    setProps({ disabled: true });
    // setPropsProject({ disabled: true });
    setPropsMaterial({ disabled: true });
  }

  // 获取供应商详情
  async function handleSupplierChange(value, field) {
    updateSchema([
      {
        field: field,
        componentProps: {
          defaultLabel: value,
        },
      },
    ]);
  }

  async function handleValueChange(e, data, init?: boolean) {
    const leng = ['materialLength', 'materialWidth', 'materialThicknessTotal'];

    if (leng.includes(e)) {
      const values = getFieldsValueMateria();
      if (e === 'materialLength') {
        values.materialLength = data;
      } else if (e === 'materialWidth') {
        values.materialWidth = data;
      } else if (e === 'materialThicknessTotal') {
        values.materialThicknessTotal = data;
      }

      const { materialLength, materialWidth, materialThicknessTotal } = values;

      let _t = materialWidth ? materialWidth + 'MM * ' : '';
      _t += materialLength ? materialLength + 'M * ' : '';
      _t += materialThicknessTotal ? materialThicknessTotal + 'MM' : '';

      return setFieldsValueMaterial({
        materialSpec: _t,
      });
    }

    if (e == 'materialAreaId' || e == 'materialClassId') {
      const r = await getMaterialList({
        displayArea: 'MaterialWarehouse',
        keyword: data,
      });
      const _list = r?.data?.list || [];
      if (e == 'materialAreaId') {
        if (!init) {
          setFieldsValueMaterial({
            materialClassId: '',
            materialQualityId: '',
          });
        }
        updateSchema([
          {
            field: 'materialClassId',
            componentProps: {
              options: _list,
            },
          },
        ]);
      } else {
        if (!init) {
          setFieldsValueMaterial({
            materialQualityId: '',
          });
        }
        updateSchema([
          {
            field: 'materialQualityId',
            componentProps: {
              options: _list,
            },
          },
        ]);
      }
    }
  }

  //  生成材料描述
  async function handleVerify() {
    const params = {
      ...getFieldsValue(),
      ...getFieldsValueMateria(),
      thicknessUnit: 'MM', // 厚度单位,给个默认值
    };
    const res = await autoSpec(params);
    if (res.code == 200) {
      message.success(t('sys.api.operationSuccess'));
      const { data } = res;
      setFieldsValueMaterial({
        materialDesc: data,
      });
    }
  }

  // 提交
  const handleSave = async type => {
    if (type !== 'storage') {
      changeOkLoading(true);
    } else {
      state.storageLoading = true;
    }

    const _validate = [validate, validateMateria];
    let isValidate = true;
    if (type !== 'storage') {
      _validate.forEach(async item => {
        if (!(await item())) {
          isValidate = false;
        }
      });
    }

    let params: any = {};
    if (isValidate) {
      params = {
        id: state.id,
        ...getFieldsValueMateria(),
        thicknessUnit: 'MM',
        documentControlId: getFieldsValue().documentControlId,
      };
      let method = updateMaterial;
      if (type == 'storage') {
        method = storageMaterial;
      }
      try {
        const r = await method(params);
        if (r.code == 200) {
          message.success(t('sys.api.operationSuccess'));
          emits('reload');
          if (type !== 'storage') closePopup();
        }
      } catch (error) {
        if (type !== 'storage') changeOkLoading(false);
        else state.storageLoading = false;
      }
    }

    if (type !== 'storage') {
      changeOkLoading(false);
    } else {
      state.storageLoading = false;
    }
  };
</script>
<style lang="less" scoped>
  .pop-item {
    border-bottom: 10px solid #f0f0f0;
    padding: 20px 20px 0;
  }

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
