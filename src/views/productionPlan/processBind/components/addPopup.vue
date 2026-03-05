<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    v-loading="btnLoading"
    :okText="t('common.submit')"
    :title="title"
    destroyOnClose
    @ok="handleSaveFn"
    class="full-popup pl-0px pr-0px">
    <ScrollContainer class="p-20px" v-loading="isLoading">
      <BasicForm @register="registerForm">
        <!-- <template #material="{ values }">
          <a-auto-complete v-model:value="values.material" :options="state.materialList" style="width: 100%" @change="debounceSearchMaterial" />
        </template> -->
        <template #processRouteId>
          <div class="min-h-[500px]">
            <Grid style="height: 500px">
              <template #action="{ rowIndex, row }">
                <TableAction :actions="getTableActions(row)" />
              </template>
            </Grid>
            <processRouteDetail
              :processRouteItem="state.processRouteItem"
              v-if="state.processRouteItem && state.processRouteItem.bindMaterialList"
              @select="handlerSelectFn"></processRouteDetail>
          </div>
        </template>
      </BasicForm>
    </ScrollContainer>
  </BasicPopup>
  <FlowModal @register="registerFlowModal" :allowClear="false" />
</template>
<script lang="ts" setup>
  import { reactive, toRefs, ref, onMounted } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { ActionItem } from '/@/components/Table';
  import { getlineinfolist, getInnermaterialnumberlist } from '/@/api/basicData/processrulestemplate';
  import { useBaseStore } from '/@/store/modules/base';
  import { getProcessroutemaplist, addProcessroutebind, updateProcessroutebind, thawProcessroutebind } from '/@/api/productionDeal/processroutebind';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { FlowModal } from '/@/components/CustomComponents';
  import { useModal } from '/@/components/Modal';
  import { getRouteDetail } from '/@/api/productionPlan/processRoute';
  import processRouteDetail from './processRouteDetail.vue';
  import { ScrollContainer } from '/@/components/Container';
  import { useDebounceFn } from '@vueuse/core';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { designatedSetAuditUser } from '/@/api/engineering/mould';

  const baseStore = useBaseStore();
  const emits = defineEmits(['register', 'refresh']);
  interface State {
    title: string;
    id: string;
    orgId: string;
    processRouteItem: any;
    bindMaterialList: any[];
    materialList: any[];
    moldDetailId: string;
    bomPartId: string;
    /** 是否显示审核人 */
    isShowReviewer: boolean;
    /** 行数据 */
    row: any;
  }

  const state = reactive<State>({
    title: '',
    id: '',
    orgId: '',
    processRouteItem: {},
    bindMaterialList: [],
    materialList: [],
    moldDetailId: '',
    bomPartId: '',
    isShowReviewer: false,
    row: null,
  });
  const { title } = toRefs(state);
  const isLoading = ref(false);
  const btnLoading = ref(false);
  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  const [registerFlowModal, { openModal: openFlowModal }] = useModal();
  const [registerPopup, { closePopup }] = usePopupInner(init);
  const [registerForm, { validateFields, getFieldsValue, setFieldsValue, updateSchema }] = useForm({
    labelWidth: 140,
    actionColOptions: {
      style: {
        marginTop: '24px',
      },
    },
    schemas: getSchemas(),
    layout: 'horizontal',
    i18nConfig: {
      moduleCode: 'ProcessRouteColumn',
      transferRange: ['label', 'placeholder'],
    },
  });
  const radioChangeEvent = ({ row }) => {
    console.log('单选事件');
  };
  function getSchemas(): FormSchema[] {
    return [
      {
        field: 'designatedAuditUserId',
        i18nField: 'CommonCol.auditUserName',
        label: '审核人',
        component: 'CustomUserSelect',
        // componentProps: {
        //   style: {
        //     width: 'calc(33.33% - 140px)'
        //   }
        // },
        rules: [
          {
            required: true,
            message: t('common.required'),
            trigger: 'blur',
          },
        ],
        ifShow: () => {
          return state.isShowReviewer;
        },
        colProps: { span: 8 },
      },
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
        colProps: { span: 8 },
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
        field: 'lineCode',
        label: '线体名称:',
        component: 'ApiSelect',
        componentProps: {
          api: getlineinfolist,
          placeholder: '请选择线体',
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          useChangeCopy: true,
          labelField: 'name',
          valueField: 'code',
          nameFormat: ['name', '(', 'code', ')'],
        },
        rules: [
          {
            required: true,
            message: '请选择线体',
            trigger: 'blur',
          },
        ],
        ifShow: ({ values }) => {
          return values.processRouteType == '2';
        },
        colProps: { span: 8 },
      },
      {
        field: 'material',
        label: '物料号:',
        component: 'ApiSelect',
        // slot: 'material',
        required: true,
        componentProps: {
          api: getInnermaterialnumberlist,
          placeholder: '请选择物料',
          showSearch: true,
          memoInputVal: true,
          memoInputVagueVal: true,
          apiSearch: {
            show: true,
            searchName: 'searchKey',
          },
          mode: 'multiple',
          resultField: 'data',
          filterOption: true,
          notFoundContent: null,
          immediate: true,
          // useChangeCopy: true,
          labelField: 'code',
          valueField: 'code',
        },
        ifShow: ({ values }) => {
          return values.processRouteType == '1' || values.processRouteType == '6';
        },
        colProps: { span: 8 },
      },
      {
        field: 'mouldMaterial',
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
        ifShow: ({ values }) => {
          return ['3', '4', '5'].includes(values.processRouteType);
        },
        colProps: { span: 8 },
      },
      {
        field: 'processRouteId',
        label: '工艺路线:',
        slot: 'processRouteId',
        component: 'Input',
        colProps: {
          style: {
            paddingRight: '10%',
            borderRadiu: '8px',
          },
        },
        rules: [
          {
            required: true,
            message: '请选择工艺路线',
            trigger: 'blur',
            validator: (_rule, val) => {
              if (!val?.length) return Promise.reject('请选择工艺路线');
              return Promise.resolve();
            },
          },
        ],
      },
      {
        field: 'version',
        label: '版本:',
        component: 'Input',
        componentProps: {
          placeholder: '请输入版本号',
        },
        colProps: { span: 8 },
      },
      {
        field: 'remark',
        label: '备注:',
        component: 'Textarea',
        componentProps: {
          placeholder: '请输入内容',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          maxlength: 200,
          showCount: true,
          // rows:6
        },
        colProps: {
          style: {
            paddingRight: '50%',
          },
        },
      },
    ];
  }

  const columns = [
    { type: 'radio', field: 'checkbox', width: 45 },
    { title: '工艺路线名称', field: 'routeName', align: 'left', width: 70 },
    { title: '工艺路线编码', field: 'routeCode', align: 'left', width: 70 },
    { title: '工艺路线图', field: 'routeMap', align: 'left', width: '' },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 80,
      fixed: 'right',
    },
  ];
  const [Grid, gridApi] = useVbenVxeGrid({
    gridEvents: {
      // currentChange
      radioChange: ({ row }) => {
        state.processRouteItem = row;
        console.log(row, 'row');

        setFieldsValue({ processRouteId: `${row.id}` });
      },
    },
    gridOptions: {
      id: 'productionPlan-processBind-components-addPopup',
      api: getProcessroutemaplist,
      columns: columns as any,
      rowConfig: {
        keyField: 'id',
      },
      pagerConfig: {
        autoHidden: true,
      },
      i18nConfig: {
        moduleCode: 'QuotationRequirementsColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      // @ts-ignore
      proxyConfig: {
        response: {
          result: 'data',
        },
      },
      beforeFetch: params => {
        return { ...params, id: state.id };
      },
    },
  });
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleViewFlow.bind(null, record),
      },
    ];
  }

  function handlerSelectFn(MaterialList) {
    state.bindMaterialList = MaterialList;
  }

  const handleViewFlow = record => {
    openFlowModal(true, {
      title: t('common.add'),
      flowId: record.id,
      flowApi: getRouteDetail,
    });
  };

  const freezeStatus = ref(false);

  function init({ data, title, from, isShowReviewer, row }) {
    freezeStatus.value = false;
    isLoading.value = true;
    state.title = title;
    if (!data) return;
    if (from == 'generate') {
      updateSchema([
        {
          field: 'processRouteType',
          componentProps: { disabled: true },
        },
        {
          field: 'mouldMaterial',
          componentProps: {
            disabled: true,
          },
        },
      ]);
    }
    const { processRouteType, processRouteId, lineCode, material, remark, id, moldDetailId, bomPartId, status } = data;
    state.id = id;
    state.orgId = data.orgId;
    state.moldDetailId = moldDetailId;
    state.bomPartId = bomPartId;
    state.isShowReviewer = isShowReviewer || false;
    state.row = row;
    freezeStatus.value = status === 3;
    gridApi.reload();
    const obj: any = {
      processRouteType: processRouteType ? String(processRouteType) : '',
      processRouteId,
      remark,
      material: material && material.split(','),
      lineCode,
      mouldMaterial: material && material.split(',')[0],
      designatedAuditUserId: row?.designatedAuditUserId || '',
    };
    setFieldsValue(obj);
    setTimeout(() => {
      gridApi.grid.setRadioRowKey(processRouteId);
      const _data = gridApi.getDataSource();
      if (processRouteId) {
        state.processRouteItem = _data.find(item => item.id === processRouteId);
      }
    }, 1000);
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

  async function updateProcessroutebindFn() {
    const { code, msg } = await updateProcessroutebind(state.id, {
      ...getFieldsValue(),
      id: state.id,
      orgId: state.orgId,
      bindMaterialList: state.bindMaterialList,
      moldDetailId: state.moldDetailId,
      bomPartId: state.bomPartId,
      material: getFieldsValue().material && getFieldsValue().material.join(','),
    });
    if (code === 200) {
      /** 如果设置了审核人，则发起对应保存请求 */
      if (state.isShowReviewer && state.row?.id) {
        await designatedSetAuditUser({ id: state.row.id, designatedAuditUserId: getFieldsValue().designatedAuditUserId });
      }

      if (freezeStatus.value) {
        handleUnfreeze();
      } else {
        createMessage.success(msg);
        closePopup();
      }
      emits('refresh');
    }
  }

  async function addProcessroutebindFn() {
    const { code, msg } = await addProcessroutebind({
      ...getFieldsValue(),
      bindMaterialList: state.bindMaterialList,
      moldDetailId: state.moldDetailId,
      bomPartId: state.bomPartId,
      material: getFieldsValue().material && getFieldsValue().material.join(','),
    });
    if (code === 200) {
      /** 如果设置了审核人，则发起对应保存请求 */
      if (state.isShowReviewer && state.row?.id) {
        await designatedSetAuditUser({ id: state.row.id, designatedAuditUserId: getFieldsValue().designatedAuditUserId });
      }

      createMessage.success(msg);
      closePopup();
      emits('refresh');
    }
  }

  async function handleSaveFn(e, val) {
    const valid = await validateFields();
    if (!valid) return;
    btnLoading.value = true;

    try {
      if (state.id) {
        await updateProcessroutebindFn();
      } else {
        await addProcessroutebindFn();
      }
    } catch {
    } finally {
      btnLoading.value = false;
    }
  }
  const debounceSearchMaterial = useDebounceFn(getInnermaterialnumberlistFn, 300);

  async function getInnermaterialnumberlistFn(searchKey: string | number | null = ''): Promise<void> {
    try {
      const { data, code } = await getInnermaterialnumberlist({ searchKey });
      if (code == 200) {
        state.materialList = data.map(item => {
          return {
            value: item.code,
            label: item.name,
          };
        });
      }
      setFieldsValue({ material: searchKey });
    } catch (err) {
      console.error(err);
    }
  }

  onMounted(() => {
    getInnermaterialnumberlistFn();
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
</style>
