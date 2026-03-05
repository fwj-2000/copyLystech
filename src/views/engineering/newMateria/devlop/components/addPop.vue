<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="tempraryStatus"
    :okText="t('common.submitText')"
    :cancelButtonProps="{ class: 'mr-12px' }"
    :title="state.title"
    destroyOnClose
    class="full-popup"
    @ok="handleSave">
    <template #insertToolbar>
      <div class="toggle-current flex" v-if="state.total > 1">
        <a-button preIcon="icon-ym icon-ym-left" @click="handleChangePage('pre')" :disabled="state.currentIndex < 1" />
        <div class="state-box m-2">
          <span>{{ state.currentIndex + 1 }}</span> / {{ state.total }}
        </div>
        <a-button preIcon="icon-ym icon-ym-right" @click="handleChangePage('next')" :disabled="state.currentIndex >= state.total - 1" />
        <a-divider type="vertical" class="ml-10px" />
      </div>
    </template>
    <template #centerToolbar>
      <template v-if="state.type == 'review'">
        <a-button :loading="state.loading" class="mr-12px" type="primary" ghost @click="handleReject">{{ t('common.rejectText') }}</a-button>
        <a-button :loading="state.loading" class="mr-12px" type="primary" @click="handleReview">{{ t('common.agree') }}</a-button>
      </template>

      <UploadBtn
        v-if="canEdit"
        ref="uploadBtnRef"
        :buttonText="t('common.upFiles')"
        :buttonProps="{ class: 'mr-12px' }"
        type="default"
        @success="handleUploadSuccess" />

      <a-button :loading="state.loading" v-if="tempraryStatus" class="mr-12px" @click="handleVerify">
        {{ t('common.metariaDesc') }}
      </a-button>
      <a-button :loading="state.loading" v-if="tempraryStatus" type="primary" ghost @click="handleSave('storage')">
        {{ t('common.temporarySave') }}
      </a-button>
    </template>

    <ScrollContainer>
      <div class="pop-item">
        <subtitle :title="t('common.baseinfo')" />
        <BasicForm
          @register="registerForm"
          @field-value-change="
            (e, data) => {
              handleValueChange(e, data);
            }
          " />
      </div>

      <div class="pop-item">
        <subtitle :title="t('common.metariaInfo')" />
        <BasicForm
          @register="registermaterialSchema"
          @field-value-change="
            (e, data) => {
              handleValueChange(e, data);
            }
          " />
      </div>

      <!-- 附件信息：公共展示组件 FileInfos -->
      <!-- <div class="pop-item">
        <FileInfos v-model:fileList="state.customerFileList" :editable="canEdit">
          <template #title>
            <subtitle :title="t('dict.AttachmentInformation')" />
          </template>
        </FileInfos>
      </div> -->
      <div class="pop-item">
        <subtitle :title="t('dict.AttachmentInformation')" />
        <FileInfos v-if="canEdit || state.customerFileList.length > 0" v-model:fileList="state.customerFileList" :editable="canEdit" />
        <div v-else class="no-file-tip">
          {{ t('common.noAttachment') }}
        </div>
      </div>
    </ScrollContainer>

    <RejectModal @register="registerRejectModal" @reload="handleRejectReload" />
    <FileListModal @register="registerFileList" />
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { computed, nextTick, reactive, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { baseFrorm, materialSchema, refersMaterialSchema } from './config';
  import { useUserStore } from '/@/store/modules/user';
  import { ScrollContainer } from '/@/components/Container';
  import { addNewMaterial, getDetails, storageMaterial, updateMaterial, autoSpec } from '/@/api/engineering/newMateria';
  import dayjs from 'dayjs';
  import { Subtitle } from '/@/components/Subtitle';
  import { useMessage } from '/@/hooks/web/useMessage';
  import * as mathjs from 'mathjs';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getMaterialList, getMaterialSubList } from '/@/api/purchase/materialBase';
  import { getMenuId } from '/@/utils';
  import { useRoute } from 'vue-router';
  import { RejectModal } from '/@/components/CustomComponents';
  import { useModal } from '/@/components/Modal';
  import { rejectMaterial } from '/@/api/engineering/newMateriaReview';
  import { reviewMaterial as reviewMaterialEngineering } from '/@/api/engineering/newMateriaReview';
  import { reviewMaterial as reviewMaterialTechnology } from '/@/api/technologyCenter/newmaterialReview';
  import { dateUtil } from '/@/utils/dateUtil';
  import { FileListModal } from '/@/components/Upload';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import { getBaseDataTerminalCustomerList } from '/@/api/finance/wageRate';
  import { getProductLineCode } from '/@/api/basicData/productLine';
  // 公共组件
  import FileInfos from '/@/components/Upload/src/components/FileInfos.vue';
  import UploadBtn from '/@/components/Upload/src/components/UploadBtn.vue';

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const emits = defineEmits(['register', 'reload']);
  const userStore = useUserStore();
  const getUserInfo = computed(() => userStore.getUserInfo || {});
  const [registerFileList, { openModal: openFileList }] = useModal();

  interface StateType {
    title: string;
    type: 'edit' | 'add' | 'view' | 'detailed' | 'review';
    id: string;
    status: number;
    customerFileList: any[];
    total: 0;
    currentIndex: 0;
    ids: [];
    loading: boolean;
    source: string;
  }

  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerUpload, { openModal: openUpload }] = useModal();
  const editStatus = [0, 3, 4];

  const tempraryStatus = computed(() => {
    if (state.type == 'detailed') return false;
    return editStatus.includes(state.status);
  });

  const uploadBtnRef = ref(null);

  const canEdit = computed(() => {
    // 审核页 & 纯详情页，统一只读
    if (state.type === 'review' || state.type === 'detailed') return false;
    // 状态在 [0:暂存, 3:驳回, 4:撤回] 时可编辑
    return editStatus.includes(state.status);
  });

  const route = useRoute();
  const state = reactive<StateType>({
    title: '新增',
    type: 'add',
    id: '',
    status: 1,
    customerFileList: [],
    total: 0,
    currentIndex: 0,
    ids: [],
    loading: false,
    source: '',
  });

  const [registerForm, { setFieldsValue, getFieldsValue, validate, setProps, updateSchema: updateSchemaBaseForm }] = useForm(baseFrorm(handleInsidePartChange));

  const [
    registermaterialSchema,
    {
      getFieldsValue: getFieldsValueMateria,
      validate: validateMateria,
      setFieldsValue: setFieldsValueMaterial,
      setProps: setPropsMaterial,
      updateSchema,
      resetSchema,
    },
  ] = useForm({
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
    schemas: materialSchema(handleValidate),
  });

  const [registerPopup, { changeOkLoading, closePopup, changeLoading }] = usePopupInner(init);

  async function init(data) {
    state.customerFileList = [];
    const type = data.type || 'add';
    state.id = '';
    state.type = type;
    state.source = data.source || '';
    if (type == 'add') {
      state.title = t('common.add2Text');
      state.status = 0;
      setFieldsValue({
        applyUserName: userStore.getUserInfo.userName,
      });
      state.customerFileList = []; // 新增时清空附件
    } else {
      state.title = data.title || t('common.detailText');
      state.id = data.id;
      if (data.ids) {
        state.id = data.ids[0];
        state.ids = data.ids;
        state.total = data.ids.length;
      }
      getDetail();
    }
  }

  async function getDetail() {
    try {
      changeLoading(true);
      const r = await getDetails([state.id]);
      const _d = r.data[0];
      state.status = _d.status;

      const formData: any = { ..._d };

      setFieldsValue(formData);

      const serverFiles = _d.fileJson || [];
      state.customerFileList = serverFiles.map(item => ({
        fileName: item.fileName,
        filePath: item.filePath,
      }));

      // 如果是“旧版成品编码路径”，重新把这几个字段 schema 设为可编辑
      // 条件：insideNumberOld 有值 && insidePartNumber 为空 && 当前是可编辑状态
      if (
        editStatus.includes(formData.status) && // 0/3/4 等可编辑状态
        formData.insideNumberOld &&
        !formData.insidePartNumber
      ) {
        handleInsidePartChange('initOldNumberMode', {});
      }

      handleValueChange('materialAreaId', formData.materialAreaId, true);
      handleValueChange('materialClassId', formData.materialClassId, true);
      setTimeout(() => handleValueChange('developmentType', formData.developmentType, true));

      if (!editStatus.includes(formData.status) || state.type === 'review' || state.type === 'detailed') {
        handleDisabled();
      }

      nextTick(() => {
        changeRefers(formData.isCustomerRefers);
        setFieldsValueMaterial(formData);
        updateSchemaBaseForm([
          {
            field: 'productTypeId',
            componentProps: {
              defaultLabel: formData.productTypeName,
            },
          },
        ]);
        changeLoading(false);
      });
    } catch (error) {
      changeLoading(false);
      closePopup();
    }
  }

  // 校验基材厚度和总厚度
  function handleValidate(ops) {
    const { materialThickness, materialThicknessTotal } = getFieldsValueMateria();
    if (typeof materialThickness == 'number' && typeof materialThicknessTotal == 'number' && materialThickness >= materialThicknessTotal) {
      return Promise.reject(ops.createMessage as string);
    }
    return Promise.resolve();
  }

  // 切换单号显示
  function handleChangePage(type) {
    if (type == 'pre') {
      state.currentIndex--;
    } else {
      state.currentIndex++;
    }
    state.id = state.ids[state.currentIndex];
    getDetail(); // 切换时重新加载详情（包含附件）
  }

  // 客指变动
  function changeRefers(e) {
    if (e == 0) {
      resetSchema(materialSchema(handleValidate));
    } else {
      resetSchema(refersMaterialSchema);
    }
  }

  // 内部产品料号变动
  function handleInsidePartChange(type, data) {
    if (type === 'clearOldNumber') {
      setFieldsValue({ insideNumberOld: '' });
      return;
    }

    if (type === 'initOldNumberMode') {
      updateSchemaBaseForm([
        {
          field: 'productLineCode',
          component: 'ApiSelect',
          componentProps: {
            disabled: false,
            i18nField: '',
            placeholder: t('dict.PartNumberApplyColumn.ProductLineCode'),
            allowClear: true,
            api: params => {
              return getProductLineCode(' ', params.mainProcess);
            },
            params: {
              mainProcess: '1',
            },
            showSearch: true,
            apiSearch: {
              show: true,
              searchName: 'code',
            },
            labelField: 'Name',
            valueField: 'Code',
            nameFormat: ['Code', '-', 'Name'],
            resultField: 'data',
          },
          rules: [{ required: true, trigger: 'blur', message: '必填' }],
        },
        { field: 'terminalProject', componentProps: { disabled: false } },
        {
          field: 'terminalCustomerCode',
          component: 'ApiSelect',
          componentProps: {
            showSearch: true,
            apiSearch: {
              show: true,
              searchName: 'code',
            },
            api: getBaseDataTerminalCustomerList,
            disabled: false,
            placeholder: '请选择终端客户',
            i18nField: '',
            nameFormat: ['terminalCustomerName', '/', 'terminalCustomerCode'],
            valueField: 'terminalCustomerCode',
            resultField: 'data',
            filterOption: false,
            notFoundContent: null,
            immediate: true,
          },
          rules: [
            {
              required: true,
              trigger: 'blur',
              message: '必填',
            },
          ],
        },
      ]);
      return;
    }

    if (type === 'clearNewNumber') {
      setFieldsValue({
        insidePartNumber: '',
        factoryId: '',
        terminalCustomerCode: '',
        productLineCode: '',
        terminalProject: '',
      });
      handleInsidePartChange('initOldNumberMode', data);
      return;
    }

    const { TerminalCustomerName, ProductLineCode, ProductLineName, TerminalCustomerCode, FactoryId, TerminalCustomerProjectCode } = data;

    setFieldsValue({
      productLineCode: `${ProductLineName ? ProductLineName + '/' : ''}${ProductLineCode}`,
      terminalCustomerCode: `${TerminalCustomerName}/${TerminalCustomerCode}`,
      factoryId: FactoryId,
      terminalProject: TerminalCustomerProjectCode || '',
      insideNumberOld: '',
    });

    updateSchemaBaseForm([
      {
        field: 'terminalCustomerCode',
        componentProps: { disabled: true },
      },
      {
        field: 'productLineCode',
        componentProps: { disabled: true },
      },
      {
        field: 'terminalProject',
        componentProps: { disabled: true },
      },
      {
        field: 'factoryId',
        componentProps: { params: { partNumber: type } },
      },
      {
        field: 'productTypeId',
        componentProps: {
          params: { factoryId: FactoryId },
        },
      },
    ]);
  }

  /// 根据来源选择接口
  async function handleReview() {
    setLoading(true);
    try {
      const reviewApi = state.source === 'technology' ? reviewMaterialTechnology : reviewMaterialEngineering;
      const r = await reviewApi({
        id: state.id,
      });
      setLoading(false);
      if (r.code == 200) {
        createMessage.success(t('sys.api.operationSuccess'));
        if (state.currentIndex == state.ids.length - 1) {
          emits('reload');
          closePopup();
        } else {
          handleChangePage('next');
        }
      }
    } catch (error) {
      setLoading(false);
    }
  }

  // 驳回
  function handleReject() {
    openRejectModal(true, {
      api: rejectMaterial,
      ids: [state.id],
    });
  }

  // 禁用数据
  function handleDisabled() {
    setProps({ disabled: true });
    setPropsMaterial({ disabled: true });
  }

  // 数据变更的联动处理
  async function handleValueChange(field, data, init?: boolean) {
    const judgeField = ['estimateTotal', 'productSizeLong', 'productSizeWide'];
    if (judgeField.includes(field)) {
      const { estimateTotal, productSizeLong, productSizeWide } = getFieldsValue();
      if (estimateTotal && productSizeLong && productSizeWide) {
        const consumption = mathjs.format((productSizeLong * productSizeWide) / 1000, { precision: 5 });
        const area = mathjs.format(Number(consumption) * estimateTotal * 10, { precision: 5 });
        setFieldsValue({
          consumption,
          productArea: area,
        });
      }
      return;
    }
    if (field == 'isCustomerRefers') {
      return changeRefers(data);
    }
    if (field == 'factoryId') {
      return updateSchemaBaseForm([
        {
          field: 'productTypeId',
          componentProps: {
            params: {
              factoryId: data,
            },
          },
        },
      ]);
    }
    if (field == 'developmentType') {
      const isNew = data == 'NewDeveloped';
      if (isNew) {
        setFieldsValueMaterial({
          alternativeMaterialNumber: '',
        });
      }
      return updateSchema({
        field: 'alternativeMaterialNumber',
        componentProps: {
          disabled: isNew,
        },
      });
    }
    if (field == 'materialClassId' || field == 'materialAreaId') {
      const r = await getMaterialList({
        displayArea: 'MaterialWarehouse',
        keyword: data,
      });
      const _list = r?.data?.list || [];
      if (field == 'materialAreaId') {
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
              options: _list.map(item => ({
                label: item.fullName,
                value: item.id,
              })),
            },
          },
        ]);
      } else {
        const r = await getMaterialSubList({
          displayArea: 'MaterialWarehouse',
          keyword: data,
          type: 'BaseMaterialType',
        });
        const _list = r?.data?.list || [];
        if (!init) {
          setFieldsValueMaterial({
            materialQualityId: '',
          });
        }
        updateSchema([
          {
            field: 'materialQualityId',
            componentProps: {
              options: _list.map(item => ({
                label: item.fullName,
                value: item.id,
              })),
            },
          },
        ]);
      }
    }
  }

  //接收 UploadBtn 返回的 [{fileName,filePath}] 列表
  function handleUploadSuccess(list: { fileName: string; filePath: string }[]) {
    const now = dateUtil().valueOf();
    const userName = getUserInfo.value.userName;
    const newFiles = list
      .filter(item => !state.customerFileList.some(f => f.filePath === item.filePath && f.fileName === item.fileName))
      .map(item => ({
        fileName: item.fileName,
        filePath: item.filePath,
        creatorUserName: userName,
        creatorTime: now,
      }));
    state.customerFileList.push(...newFiles);
    uploadBtnRef.value?.handleClear();
  }

  // 提取传值参数（包含附件信息）
  const { hasBtnP } = usePermission();
  function handleParams() {
    const fileJson = state.customerFileList.map(file => ({
      fileName: file.fileName,
      filePath: file.filePath,
    }));
    const params: any = {
      isOperation: hasBtnP('btn_review') ? 1 : 0,
      id: state.id,
      menuId: getMenuId(route),
      ...getFieldsValue(),
      ...getFieldsValueMateria(),
      thicknessUnit: 'MM',
      fileJson,
    };
    const code = params.terminalCustomerCode;
    if (code) {
      if (code.includes('/')) {
        params.terminalCustomerCode = code.split('/')[1];
      } else {
        params.terminalCustomerCode = code;
      }
    }

    delete params.applyDatetime;
    delete params.applyUserName;
    delete params.applyNumber;
    params.estimateProductionTime = params.estimateProductionTime ? dayjs(Number(params.estimateProductionTime)).tz().format('YYYY-MM') : '';
    return params;
  }

  // 生成材料描述
  async function handleVerify() {
    const res = await autoSpec(handleParams());
    if (res.code == 200) {
      createMessage.success(t('sys.api.operationSuccess'));
      setFieldsValueMaterial({
        materialDesc: res.data,
      });
    }
  }

  // 提交
  const handleSave = async type => {
    setLoading(true);
    let isValidate = true;
    // 暂存无需校验
    if (type !== 'storage') {
      const _validate = [validate, validateMateria];
      for (const item of _validate) {
        if (!(await item())) {
          isValidate = false;
        }
      }
    }

    if (isValidate) {
      const params = handleParams();
      let method: any;

      if (type === 'storage') {
        // 暂存：固定调用 storageMaterial
        method = storageMaterial;
      } else if (params.id) {
        // 提交且参数里有 id：走修改接口
        method = updateMaterial;
      } else {
        // 提交且没有 id：走新增接口
        method = addNewMaterial;
      }

      try {
        const r = await method(params);
        if (r.code === 200) {
          createMessage.success(t('sys.api.operationSuccess'));

          if (type === 'storage') {
            // 暂存成功后，保存返回的 id，后续提交时 handleParams 会带上这个 id
            state.id = r.data;
          } else {
            emits('reload');
            closePopup();
          }
        }
      } catch (error) {
        setLoading(false);
      }
    }
    setLoading(false);
  };

  function setLoading(type) {
    changeLoading(type);
    changeOkLoading(type);
    state.loading = type;
  }

  function handleRejectReload() {
    if (state.currentIndex == state.ids.length - 1) {
      closePopup();
      emits('reload');
    } else {
      handleChangePage('next');
    }
  }
</script>

<style lang="less" scoped>
  .pop-item {
    border-bottom: 10px solid #f0f0f0;
    padding: 20px 20px 0;
  }
</style>
