<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.submit')"
    :title="title"
    destroyOnClose
    @ok="handleSaveFn"
    class="full-popup p-10px">
    <ScrollContainer class="p-20px" v-loading="isLoading">
      <Subtitle title="基础信息" />
      <div class="bacic-data">
        <BasicForm @register="registerForm">
          <template #ercode="{ model, field }">
            <LydcInput
              suffixIcon="icon-ym icon-ym-scanCode"
              v-model:value="model[field]"
              :placeholder="t('common.inputText')"
              @change="handlerInputChangeFn"
              @Keydown="handlerInputKeydown" />
          </template>
        </BasicForm>
      </div>

      <Subtitle title="检查项目" />
      <div class="bacic-data">
        <BasicTable @register="registerTable" :data-source="tableData">
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'badCode'">
              {{ record.CheckClass }}
            </template>
            <template v-if="column.dataIndex === 'badQuantity'">
              <FilteredInput v-model:value="record[column.dataIndex]" input-type="number" :min="0" />
            </template>
            <template v-if="column.dataIndex === 'badRate'">
              <a-input v-model:value="record[column.dataIndex]" placeholder="请输入" :min="0" :precision="0">
                <template #suffix> % </template>
              </a-input>
            </template>
            <template v-if="column.dataIndex === 'checkTime'">
              <lydc-date-picker v-model:value="record[column.dataIndex]" />
            </template>
            <template v-if="column.dataIndex === 'remark'">
              <FilteredInput v-model:value="record[column.dataIndex]"> </FilteredInput>
            </template>
          </template>
        </BasicTable>
      </div>
    </ScrollContainer>
  </BasicPopup>
  <FlowModal @register="registerFlowModal" />
</template>
<script lang="ts" setup>
  import { reactive, toRefs, unref, ref, nextTick } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { BasicTable, useTable, BasicColumn, ActionItem } from '/@/components/Table';
  import { useBaseStore } from '/@/store/modules/base';
  // import { getProcessroutemaplist, addProcessroutebind, updateProcessroutebind } from '/@/api/productionDeal/processroutebind';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { FlowModal } from '/@/components/CustomComponents';
  import { useModal } from '/@/components/Modal';
  import { getRouteDetail } from '/@/api/productionPlan/processRoute';
  import { ScrollContainer } from '/@/components/Container';
  import { useFqc } from './config';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  import { FilteredInput } from '/@/components/FilteredInput';
  import { addFqcdailywork, editFqcdailywork, getFqcdailyworkDetail } from '/@/api/productionDeal/fqcdailywork';
  import { getDetailbydocumentnumber } from '/@/api/productionDeal/dieCutPerPrint';

  const baseStore = useBaseStore();
  const emits = defineEmits(['register', 'refresh']);
  interface State {
    title: string;
    id: string;
    orgId: string;
    processRouteItem: any;
    bindMaterialList: any[];
  }

  const state = reactive<State>({
    title: '',
    id: '',
    orgId: '',
    processRouteItem: {},
    bindMaterialList: [],
  });
  const { title } = toRefs(state);
  const isLoading = ref(false);
  const { t } = useI18n();
  const { FqcCheckFormSchema, tableData } = useFqc();
  const { createMessage } = useMessage();
  const [registerFlowModal, { openModal: openFlowModal }] = useModal();
  const [registerPopup, { closePopup }] = usePopupInner(init);
  const [registerForm, { validateFields, getFieldsValue, clearValidate, setFieldsValue, updateSchema }] = useForm({
    labelWidth: 140,
    actionColOptions: {
      style: {
        marginTop: '24px',
      },
    },
    schemas: FqcCheckFormSchema,
    // layout: 'horizontal',
    layout: 'vertical',
  });
  const columns: BasicColumn[] = [
    { title: '检验小类', dataIndex: 'badCode', align: 'left', sorter: true },
    { title: '不合格数量', dataIndex: 'badQuantity', align: 'left', sorter: true },
    { title: '不合格占比', dataIndex: 'badRate', align: 'left', width: '' },
    { title: '检验时间', dataIndex: 'checkTime', align: 'left', width: '', format: 'date|YYYY-MM-DD HH:mm:ss' },
    { title: '备注', dataIndex: 'remark', align: 'left', width: '' },
  ];
  const [registerTable, { getDataSource, setTableData }] = useTable({
    title: '',
    columns,
    rowKey: 'Id',
    isCanResizeParent: true,
    canResize: true, //自适应高度
    striped: true,
    useSearchForm: false, //使用搜索表单
    showTableSetting: false, //刷新按钮,默认打开
    showIndexColumn: true, //显示序号
    pagination: false,
  });

  async function getFqcdailyworkDetailFn(id) {
    try {
      const { data, code } = await getFqcdailyworkDetail(id);
      if (code === 200) {
        data.classes = data.classes ? String(data.classes) : data.classes;
        data.checkType = data.checkType ? String(data.checkType) : data.checkType;
        data.qaConfirm = data.qaConfirm ? String(data.qaConfirm) : data.qaConfirm;
        setFieldsValue(data);
        setTableData(data.checkList);
        console.log(data);
      }
    } catch (error) {}
  }

  function init({ record, type, title, id }) {
    state.title = title;
    state.id = id;
    getFqcdailyworkDetailFn(id);
    // if (!data) return;
    // updateSchema({
    //   field: 'checkProjectsName',
    //   componentProps: {
    //     options: checkProjectsNameOption,
    //   },
    // });
  }

  const handlerInputKeydown = (i, e: any) => {
    const val = e.target._value;
    const arr = val.split('!') || [];
    // updateTableData(i, 'transformTag', arr[0]);
  };

  async function handlerInputChangeFn(i, val: any) {
    try {
      const { data, code } = await getDetailbydocumentnumber({ documentNumber: val });
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function updateFqcdailyworkFn() {
    const { code, data, msg } = await editFqcdailywork(state.id, { ...getFieldsValue(), checkList: getDataSource() });
    if (code === 200) {
      createMessage.success(msg);
      closePopup();
      emits('refresh');
    }
  }

  async function addFqcdailyworkFn() {
    const { code, data, msg } = await addFqcdailywork({ ...getFieldsValue(), checkList: getDataSource() });
    if (code === 200) {
      createMessage.success(msg);
      closePopup();
      emits('refresh');
    }
  }

  async function handleSaveFn(e, val) {
    const obj = { ...getFieldsValue(), checkList: getDataSource() };
    console.log(obj);
    const valid = await validateFields();
    if (!valid) return;
    if (state.id) {
      updateFqcdailyworkFn();
    } else {
      addFqcdailyworkFn();
    }
  }
</script>

<style lang="less" scoped>
  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  :deep(.ant-table-body) {
    max-height: 300px !important;
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
