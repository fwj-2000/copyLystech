<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    v-loading="btnLoading"
    :okText="t('common.submit')"
    :title="state.title"
    destroyOnClose
    @ok="handleSaveFn"
    class="full-popup pl-0px pb-0px">
    <ScrollContainer class="p-20px h-full" v-loading="isLoading">
      <BasicForm @register="registerForm">
        <template #material="{ values }">
          <a-auto-complete v-model:value="values.material" :options="state.materialList" style="width: 100%" />
        </template>
      </BasicForm>
      <div class="processRoute-box mb-20px ml-140px">
        <!-- NG路线绑定 -->
        <processRouteDetail
          class="processRoute-detail"
          :bindMaterialList="bindMaterialList"
          :processNameOptions="processNameOptions"
          @chooseNodeAssignInfo="chooseNodeAssignInfoFn"
          @resetPanelInfo="resetPanelInfo"
          @bindMaterialListChange="bindMaterialListChange"></processRouteDetail>

        <!-- 节点补充 -->
        <PropertiesPanel v-show="panelInfo.title" v-bind="panelInfo" ref="propertiesPanelRef" class="ml-12px" @update="updateProperties" />
      </div>

      <BasicForm @register="registerRemarkForm"> </BasicForm>
    </ScrollContainer>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, ref, onMounted } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { getInnermaterialnumberlist } from '/@/api/basicData/processrulestemplate';
  import { useBaseStore } from '/@/store/modules/base';
  import { updateProcessroutebind, thawProcessroutebind } from '/@/api/productionDeal/processroutebind';
  import PropertiesPanel from './PropertiesPanel.vue';
  import processRouteDetail from './processRouteDetail.vue';
  import { ScrollContainer } from '/@/components/Container';
  import { bindaddroute, getbindaddroutedetail, alllistbyfactory } from '/@/api/engineering/mould';
  import { cloneDeep } from 'lodash-es';
  import { buildBitUUID } from '/@/utils/uuid';
  const baseStore = useBaseStore();
  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();

  const emits = defineEmits(['register', 'refresh']);
  interface State {
    title: string;
    id: string;
    materialList: any[];
  }

  const state = reactive<State>({
    title: '', // 新增/编辑
    id: '',
    materialList: [], // 模具编号下拉数组
  });
  const panelInfo = ref({
    title: '',
    currentNodeDetail: {},
  });
  const propertiesPanelRef = ref(); // 节点补充ref
  const bindMaterialList = ref<any[]>([]); // NG路线绑定节点数组
  const isLoading = ref(false);
  const btnLoading = ref(false);
  const partRelationId = ref('');

  const [registerPopup, { closePopup }] = usePopupInner(init);
  const [registerForm, { validateFields, getFieldsValue, setFieldsValue, updateSchema }] = useForm({
    labelWidth: 120,
    actionColOptions: {
      style: {
        marginTop: '24px',
      },
    },
    schemas: getSchemas(),
    layout: 'horizontal',
    i18nConfig: {
      moduleCode: 'ProcessRouteColumn',
    },
  });

  const [registerRemarkForm, { getFieldsValue: getRemarkFieldsValue, setFieldsValue: setRemarkFieldsValue }] = useForm({
    labelWidth: 140,
    actionColOptions: {
      style: {
        marginTop: '24px',
      },
    },
    schemas: [
      {
        field: 'remark',
        label: '备注:',
        component: 'Textarea',
        componentProps: {
          placeholder: '请输入内容',
          maxlength: 200,
          showCount: true,
        },
        colProps: {
          style: {
            paddingRight: '50%',
          },
        },
        i18nField: 'CommonCol.remark',
      },
    ],
    layout: 'horizontal',
    i18nConfig: {
      moduleCode: 'MoldApplyColumn',
    },
  });

  function getSchemas(): FormSchema[] {
    return [
      {
        field: 'processRouteType',
        i18nField: 'processRouteTypeName',
        label: '工艺路线类型:',
        component: 'ApiSelect',
        componentProps: {
          api: () => baseStore.getDictionaryData('ProcessRoute.RouteType'),
          resultField: 'data',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          labelField: 'fullName',
          valueField: 'enCode',
        },
        colProps: { span: 6 },
        rules: [
          {
            required: true,
            message: t('common.enterProcessName'),
            trigger: 'blur',
            validator: (_rule, val) => {
              if (!val) return Promise.reject(t('common.enterProcessName'));
              return Promise.resolve();
            },
          },
        ],
      },
      {
        field: 'material',
        label: '模具编号:',
        component: 'Input',
        componentProps: {
          placeholder: '请选择模具编号',
        },
        rules: [
          {
            required: true,
            message: '请输入模具编号',
            trigger: 'blur',
          },
        ],
        // ifShow: ({ values }) => {
        //   return ['3', '4'].includes(values.processRouteType);
        // },
        i18nField: 'mouldMaterial',
        colProps: { span: 6 },
      },
      {
        field: 'version',
        label: '版本号:',
        component: 'Input',
        componentProps: {
          disabled: true,
        },
        colProps: { span: 4 },
      },
      {
        field: 'partQuantity',
        label: '数量',
        component: 'Input',
        componentProps: {
          placeholder: '请输入',
          disabled: true,
        },
        colProps: { span: 4 },
        i18nField: 'CommonCol.Quantity',
      },
      {
        field: 'partMaterial',
        label: '材质',
        component: 'Input',
        componentProps: {
          placeholder: '请输入',
          disabled: true,
        },
        colProps: { span: 4 },
        i18nField: 'CommonCol.materialName',
      },
    ];
  }

  // 当前点击节点的uuid
  const currentuuid = ref('');
  const chooseNodeAssignInfoFn = item => {
    // 记录当前点击节点的uuid，用于右侧补充信息传递给当前节点
    currentuuid.value = item.uuid;
    panelInfo.value.title = item.processName;
    panelInfo.value.currentNodeDetail = item.currentNodeDetail || {};
    // 将当前节点的补充信息赋值给右侧
    propertiesPanelRef.value.init(panelInfo.value);
  };

  // 右侧补充信息数据发生改变更新父组件节点数组数据
  const updateProperties = (key, value) => {
    bindMaterialList.value = bindMaterialList.value.map(item => {
      if (item.uuid === currentuuid.value) {
        return {
          ...item,
          currentNodeDetail: {
            ...item.currentNodeDetail,
            [key]: value,
          },
        };
      } else {
        return { ...item };
      }
    });
  };

  const resetPanelInfo = () => {
    panelInfo.value = { title: '', currentNodeDetail: {} };
  };

  // 节点数据发生改变更新父组件节点数组数据
  const bindMaterialListChange = val => {
    bindMaterialList.value = cloneDeep(val);
  };

  const getProcessIdByCode = (code: string) => {
    return processNameOptions.value.find(item => item.code === code)?.value;
  };

  // 新增，默认渲染10个节点
  const generateBindMaterialList = () => {
    const array: any[] = [];
    for (let i = 0; i < 10; i++) {
      array.push({
        isUpdateNgRoute: false,
        nodeId: '',
        processId: '',
        processName: '',
        processRouteId: '',
        currentNodeDetail: {},
        uuid: buildBitUUID(),
      });
    }
    if (defaultName.value) {
      // 默认复制工序：CNC铜工+打光+测量
      array[0].processId = getProcessIdByCode('MJ-CNC-T');
      array[1].processId = getProcessIdByCode('MJ-SPI');
      array[2].processId = getProcessIdByCode('MJ-QC');
    }
    return array;
  };

  const defaultName = ref(false);
  const freezeStatus = ref(false);
  async function init({ data, title, from, defaultProcessName }) {
    isLoading.value = true;
    freezeStatus.value = false;
    state.title = title;
    if (!data) return;
    if (from == 'generate') {
      updateSchema([
        {
          field: 'processRouteType',
          componentProps: { disabled: true },
        },
        {
          field: 'material',
          componentProps: {
            disabled: true,
          },
        },
      ]);
    }
    defaultName.value = defaultProcessName;
    const { processRouteType, material, id, partQuantity, partMaterial, version } = data;
    partRelationId.value = data.partRelationId;
    const obj: any = {
      processRouteType: processRouteType ? String(processRouteType) : '',
      material,
      partQuantity,
      partMaterial,
      version,
    };
    setFieldsValue(obj);
    state.id = id || '';
    if (id) {
      // 编辑
      const res = await getbindaddroutedetail({ id });
      bindMaterialList.value = res.data.bindMaterialList.map(item => {
        return {
          ...item,
          uuid: buildBitUUID(),
        };
      });
      setRemarkFieldsValue({ remark: res.data.remark });
      setFieldsValue({ material: res.data.material, partQuantity: res.data.partQuantity, partMaterial: res.data.partMaterial, version: res.data.version });
      freezeStatus.value = res.data.status === 3;
    } else {
      // 新增
      bindMaterialList.value = generateBindMaterialList();
    }
    isLoading.value = false;
  }

  function handleUnfreeze() {
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.ProcessRouteColumn.routeThawTip'),
      onOk: async () => {
        //  解冻
        thawProcessroutebind({ ids: [state.id] }).then(res => {
          createMessage.success(res.msg);
          emits('refresh');
          closePopup();
        });
      },
      onCancel: () => {
        closePopup();
      },
    });
  }

  // 新增、编辑
  async function addProcessroutebindFn(params) {
    const { code, msg } = await bindaddroute(params).finally(() => {
      btnLoading.value = false;
    });
    if (code === 200) {
      if (freezeStatus.value) {
        handleUnfreeze();
      } else {
        createMessage.success(msg);
        closePopup();
      }
      emits('refresh');
    }
  }

  function isExist(value: any) {
    return value !== undefined && value !== null && value !== '';
  }

  // 点击提交
  async function handleSaveFn() {
    const valid = await validateFields();
    if (!valid) return;
    const list = bindMaterialList.value.map(item => {
      return {
        isUpdateNgRoute: item.isUpdateNgRoute,
        nodeId: item.nodeId,
        presetDuration: item.presetDuration,
        processId: item.processId,
        processRouteId: item.processRouteId,
        remark: item.remark,
        currentNodeDetail: {
          ...item.currentNodeDetail,
          isPrintLabel: isExist(item.currentNodeDetail.isPrintLabel) ? item.currentNodeDetail.isPrintLabel : 0,
          isReceive: isExist(item.currentNodeDetail.isReceive) ? item.currentNodeDetail.isReceive : 1,
        },
        ngRouteNodeList: item.ngRouteNodeList,
        ngRouteId: item.ngRouteId,
      };
    });
    const params: any = {
      ...getFieldsValue(),
      ...getRemarkFieldsValue(),
      bindMaterialList: list,
      partRelationId: partRelationId.value,
    };
    btnLoading.value = true;
    if (state.id) {
      params.id = state.id;
    }
    addProcessroutebindFn(params);
  }

  // 获取物料号数组
  async function getInnermaterialnumberlistFn(): Promise<void> {
    try {
      const { data, code } = await getInnermaterialnumberlist({});
      if (code == 200) {
        state.materialList = data.map(item => {
          return {
            value: item.code,
            label: item.name,
          };
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  const processNameOptions = ref<any[]>([]);
  const getAlllistbyfactory = async () => {
    const { data } = await alllistbyfactory({ mainProcess: 'Mold' });
    processNameOptions.value = data.map(item => {
      return {
        label: item.name,
        value: item.id,
        code: item.code,
      };
    });
  };

  onMounted(() => {
    getInnermaterialnumberlistFn();
    // 获取工序下拉数组
    getAlllistbyfactory();
  });
</script>

<style lang="less" scoped>
  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  :deep(.ant-table-body) {
    max-height: 400px !important;
    min-height: 200px !important;
    margin-bottom: 10px;
  }

  :deep(.ant-table) {
    padding: 0 !important;
  }

  :deep(.ant-table-wrapper) {
    height: auto !important;
  }

  .processRoute-box {
    display: flex;
    max-height: calc(100% - 90px);

    .processRoute-detail {
      flex: 1;
    }
  }

  ::v-deep(.scrollbar__view) {
    height: 100%;
  }
</style>
