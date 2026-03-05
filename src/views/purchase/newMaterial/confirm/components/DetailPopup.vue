<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="tempraryStatus"
    :cancelButtonProps="{ class: 'mr-12px' }"
    :title="state.title"
    :okText="t('common.submitText')"
    destroyOnClose
    class="full-popup"
    @ok="handleSave">
    <template #insertToolbar>
      <BasicPopPage :config="state" @change="handleChangePage" />
      <a-divider type="vertical" class="ml-10px"></a-divider>
    </template>

    <ScrollContainer>
      <!-- 送样确认 -->
      <div v-show="showSample" class="pop-item">
        <div class="pop-item-content">
          <subtitle :title="t('common.sendSample')" />
          <BasicForm @register="registerSampleForm" />
        </div>
      </div>

      <!-- 工程复核 -->
      <div class="pop-item">
        <div class="pop-item-content">
          <subtitle :title="t('dict.MaterialDevelopmentApplySonNode.EngineeringReview')" />
          <BasicForm @register="registerProjectForm" />
        </div>
      </div>

      <!-- 供应商材料信息 + 供应商附件 -->
      <div class="pop-item">
        <div class="pop-item-content">
          <subtitle :title="t('dict.MaterialDevelopQualityDesensitizationColumn.supplierMaterialsInformation')" />
          <BasicForm @register="registerForm" />
          <FileInfos v-if="state.fileList && state.fileList.length" :fileList="state.fileList" :editable="false">
            <template #title>
              <span class="attach-label">
                {{ t('common.attachment') }}
              </span>
            </template>
          </FileInfos>
        </div>
      </div>
      <div class="pop-item">
        <div class="pop-item-content">
          <subtitle :title="t('common.baseinfo')" />
          <BasicForm @register="registerBaseForm" />
        </div>
      </div>
      <div class="pop-item">
        <div class="pop-item-content">
          <subtitle :title="t('common.metariaInfo')" />
          <BasicForm @register="registerMetariaForm" />
        </div>
      </div>
      <div class="pop-item">
        <div class="pop-item-content">
          <subtitle :title="t('dict.AttachmentInformation')" />
          <FileInfos v-if="state.devFileList && state.devFileList.length" v-model:fileList="state.devFileList" :editable="false"> </FileInfos>
          <div v-else>{{ t('common.noAttachment') }}</div>
        </div>
      </div>
    </ScrollContainer>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { computed, reactive, nextTick, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { purchaseSchema, sampleSchema } from '../config';
  // 复用工程新材料开发里的 schema
  import { baseFrorm, materialSchema as devMaterialSchema } from '/@/views/engineering/newMateria/devlop/components/config';
  import { ScrollContainer } from '/@/components/Container';
  import { getDetails as getDevDetails } from '/@/api/engineering/newMateria';
  import { getMaterialConfirmDetails, commitMaterialConfirm } from '/@/api/purchase/newMateriaConfirm';
  import { Subtitle } from '/@/components/Subtitle';
  import { message } from 'ant-design-vue';
  import { handleStatusDesc, IS_SATISFY_LIST } from '/@/components/CustomComponents/src/material/Constant';
  import { BasicPopPage } from '/@/components/Basic';
  import FileInfos from '/@/components/Upload/src/components/FileInfos.vue';

  const { t } = useI18n();
  const emits = defineEmits(['register', 'reload']);

  interface StateType {
    title: string;
    type: 'edit' | 'add' | 'view' | 'detailed';
    id: string;
    // 供应商附件列表
    fileList: { fileName: string; filePath: string }[];
    // 开发单附件列表（materialDevelopApplyId 对应的）
    devFileList: { fileName: string; filePath: string; [key: string]: any }[];
    total: 0;
    currentIndex: 0;
    ids: [];
  }

  const state = reactive<StateType>({
    title: t('common.detailText'),
    type: 'add',
    id: '',
    fileList: [],
    devFileList: [],
    total: 0,
    currentIndex: 0,
    ids: [],
  });

  const tempraryStatus = computed(() => {
    if (state.type == 'detailed' || state.type == 'view') {
      return false;
    }
    return true;
  });

  const showSample = ref(false); // 是否显示送样模块

  // 送样确认
  const [registerSampleForm, { setFieldsValue: setFieldsValueSample, setProps: setPropsSample }] = useForm({
    labelWidth: 320,
    layout: 'vertical',
    baseColProps: {
      span: 4,
    },
    schemas: sampleSchema,
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
    },
  });

  const [registerForm, { setFieldsValue, getFieldsValue, setProps, updateSchema }] = useForm({
    labelWidth: 320,
    layout: 'vertical',
    baseColProps: {
      span: 4,
    },
    schemas: purchaseSchema,
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
    },
  });

  const [registerProjectForm, { setFieldsValue: setFieldsValueProject }] = useForm({
    labelWidth: 320,
    layout: 'vertical',
    baseColProps: {
      span: 6,
    },
    schemas: [
      {
        field: 'engineeringStatusDesc',
        label: t('common.result'),
        component: 'Input',
        componentProps: {
          disabled: true,
        },
      },
      {
        field: 'conclusionRemarks',
        label: t('common.notReason'),
        component: 'Textarea',
        componentProps: {
          rows: 1,
          autoSize: true,
          placeholder: '/',
          disabled: true,
        },
        colProps: {
          span: 18,
        },
      },
    ],
  });

  const [registerBaseForm, { setFieldsValue: setBaseFormFields, setProps: setBaseFormProps }] = useForm(baseFrorm());

  const [registerMetariaForm, { setFieldsValue: setMetariaFormFields, setProps: setMetariaFormProps }] = useForm({
    labelWidth: 220,
    layout: 'vertical',
    baseColProps: {
      span: 4,
    },
    rowProps: {
      align: 'top',
      justify: 'start',
      gutter: 5,
    },
    i18nConfig: {
      moduleCode: 'MaterialDevelopApplyColumn',
      transferRange: ['placeholder', 'label'],
    },
    schemas: devMaterialSchema(),
  });

  const [registerPopup, { changeOkLoading, closePopup, changeLoading }] = usePopupInner(init);

  async function init(data) {
    const type = data.type || 'edit';
    state.type = type;
    state.title = data.title || t('common.detailText');
    showSample.value = false;
    state.id = data.id;
    if (data.ids) {
      state.ids = data.ids;
      state.id = data.ids[0];
      state.total = data.ids.length;
    }
    getDetail();
  }

  function handleDisabled(order) {
    // 状态为待处理，或工程复核为满足时，不可编辑供应商表单
    const disabled = order.handleStatus !== 6 || order.engineeringStatus == 1;
    setProps({ disabled });
  }

  /**
   * 解析文件Json字符串为数组
   * @param _d 包含 fileJson 或 files 字符串的对象
   */
  function parseFileJson(_d: any) {
    let fileList: Array<any>;

    if (Array.isArray(_d.fileJson)) {
      fileList = _d.fileJson;
    } else if (typeof _d.files === 'string' && _d.files) {
      try {
        fileList = JSON.parse(_d.files);
      } catch {
        fileList = [];
      }
    } else {
      fileList = [];
    }

    return fileList;
  }

  async function getDetail() {
    try {
      changeLoading(true);
      setPropsSample({ disabled: true });
      setBaseFormProps({ disabled: true });
      setMetariaFormProps({ disabled: true });

      const r = await getMaterialConfirmDetails([state.id]);
      const _d = r.data[0];

      state.id = _d.id;
      handleDisabled(_d);

      // 工程状态转文字
      _d.engineeringStatusDesc = handleStatusDesc(_d.engineeringStatus, IS_SATISFY_LIST);

      // 供应商材料信息 & 工程复核
      setFieldsValue(_d);
      setFieldsValueProject(_d);

      // 供应商附件
      state.fileList = parseFileJson(_d);

      // 送样模块
      if (_d.specifications && _d.specifications !== '') {
        setFieldsValueSample(_d);
        showSample.value = true;
      } else {
        showSample.value = false;
      }

      // 通过 materialDevelopApplyId 获取新材料开发信息：baseinfo + metariaInfo + 附件
      if (_d.materialDevelopApplyId) {
        try {
          const devRes = await getDevDetails([_d.materialDevelopApplyId]);
          const dev = devRes.data?.[0];
          if (dev) {
            // 基本信息 & 材料信息
            setBaseFormFields(dev);
            setMetariaFormFields(dev);

            // 开发单附件 fileJson
            if (Array.isArray(dev.fileJson)) {
              state.devFileList = dev.fileJson.map(file => ({
                fileName: file.fileName,
                filePath: file.filePath,
                creatorUserName: file.creatorUserName,
                creatorTime: file.creatorTime,
              }));
            } else {
              state.devFileList = [];
            }
          } else {
            state.devFileList = [];
          }
        } catch (e) {
          console.error('load dev details error', e);
          state.devFileList = [];
        }
      } else {
        state.devFileList = [];
      }

      nextTick(() => {
        handleSupplierChange(_d.supplierName);
        changeLoading(false);
      });
    } catch (error) {
      console.error(error);
      closePopup();
    }
  }

  function handleChangePage(type) {
    if (type === 'pre') {
      state.currentIndex--;
    } else {
      state.currentIndex++;
    }
    state.id = state.ids[state.currentIndex];
    getDetail();
  }

  // 填充供应商名称（原逻辑）
  async function handleSupplierChange(value) {
    updateSchema([
      {
        field: 'supplierId',
        componentProps: {
          defaultLabel: value,
        },
      },
    ]);
  }

  // 提交：只提交供应商材料信息字段
  const handleSave = async type => {
    changeOkLoading(true);
    let isValidate = true;
    let params: any = {};
    if (isValidate) {
      params = {
        id: state.id,
        ...getFieldsValue(),
      };
      const method = commitMaterialConfirm;
      try {
        const r = await method(params);
        if (r.code === 200) {
          message.success(t('sys.api.operationSuccess'));
          emits('reload');
          closePopup();
        }
      } catch (error) {
        console.error(error);
        changeOkLoading(false);
      }
    }
    changeOkLoading(false);
  };
</script>

<style scoped lang="less">
  .attach-label {
    margin-right: 8px;
    font-family: 'HarmonyOS Sans', sans-serif;
    font-weight: 700;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0;
    text-align: left;
  }

  .pop-item {
    border-bottom: 10px solid #f0f0f0;
  }

  .pop-item-content {
    padding: 10px;
  }
</style>
