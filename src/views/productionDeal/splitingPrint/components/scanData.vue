<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" destroyOnClose @ok="handleSubmit">
    <div class="pr-8 pt-5 pl-5">
      <BasicForm @register="registerForm">
        <template #factoryCode="{ model, field }">
          <lydc-select
            v-model:value="model[field]"
            :options="state.factoryList"
            :fieldNames="{
              label: 'fullName',
              value: 'code',
            }"
            show-search
            :showArrow="false"
            allowClear
            :filter-option="false"
            :not-found-content="null"
            :defaultActiveFirstOption="true"
            @search="fetchFactoryByName"
            @focus="fetchFactoryByName($event.target.value)" />
        </template>
        <template #innerMaterialCode="{ model, field }">
          <a-input v-model:value="model[field]" placeholder="请输入" @keydown="splitScanData" />
        </template>
      </BasicForm>
    </div>
    <a-card class="padding-left">
      <div class="flex justify-end pb-2">
        <a-button type="primary" preIcon="icon-ym icon-ym-report-icon-preview-print" @click="openPrintModalFn">打印预览</a-button>
        <a-button type="primary" preIcon="icon-ym icon-ym-report-icon-preview-print" class="btn-left">保存</a-button>
      </div>
      <BasicTable @register="registerTable" :columns="columns" :data-source="state.materialList">
        <template #bodyCell="{ column, index }">
          <template v-if="column.key != 'action'">
            <template v-if="column.dataIndex === 'LabelQuantity'">
              <a-input type="number" :min="1" v-model:value="state.tempList[index][column.dataIndex]"></a-input>
            </template>
          </template>
          <template v-else>
            <TableAction :actions="getTableActions(index)" />
          </template>
        </template>
      </BasicTable>
    </a-card>
  </BasicModal>

  <PrintModal @register="registerPrintModal" />
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getFactroys, getMaterials, addRecordData, columns, formSchema } from './config';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { BasicTable, useTable, TableAction, ActionItem } from '/@/components/Table';
  import { cloneDeep } from 'lodash-es';
  import { LydcSelect } from '/@/components/Lydc';
  import { debounce } from '/@/utils/debounce';
  import { PrintModal } from '/@/components/CommonModal';
  const getTitle = computed(() => {
    return t('扫描物料');
  });

  interface State {
    tempList: any[];
    factoryList: any[];
    materialList: any[];
  }

  const state = reactive<State>({
    tempList: [],
    factoryList: [],
    materialList: [],
  });

  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const { t } = useI18n();

  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    schemas: formSchema,
    labelAlign: 'left',
    autoFocusFirstItem: true,
    baseColProps: {
      span: 8,
    },
  });
  const [registerPrintModal, { openModal: openPrintModal }] = useModal();

  const [registerModal, { changeOkLoading }] = useModalInner(init);

  const [registerTable, { getSelectRows }] = useTable({
    columns,
    immediate: false,
    useSearchForm: false,
    showTableSetting: false,
    showIndexColumn: true,
    pagination: false,
    actionColumn: {
      width: 80,
      title: t('common.action'),
      dataIndex: 'action',
    },
    rowSelection: {
      type: 'checkbox',
    },
  });

  function getTableActions(index): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-report-icon-preview-print',
        modelConfirm: {},
      },
    ];
  }

  function init() {
    resetFields();
    state.tempList = [];
    state.materialList = [];
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      MaterialItems: state.tempList,
    };
    const formMethod = addRecordData;
    formMethod(query)
      .then(res => {
        createMessage.success(res.msg);
        changeOkLoading(false); //用于修改确认按钮的loading状态
        emit('reload');
      })
      .catch(() => {
        changeOkLoading(false);
      });
  }

  const fetchFactoryByName = debounce(v => {
    getFactroys(v)
      .then(res => {
        state.factoryList = res || [];
      })
      .catch(err => {
        state.factoryList = [];
      });
  }, 500);

  //扫码之后，分割字符串中内容
  const splitScanData = async e => {
    if (e.keyCode === 13) {
      const data = e.target.value.split('!');
      const result = {
        innerMaterialCode: data[0],
      };
      // state.dataForm = result;
      setFieldsValue(result);

      const input = await validate();
      // input.startTime = input.pickerVal[0];
      // input.endTime = input.pickerVal[1];

      changeOkLoading(true);

      getMaterials(input)
        .then(res => {
          state.materialList = res;
          state.tempList = cloneDeep(state.materialList);
          changeOkLoading(false);
        })
        .catch(err => {
          state.materialList = [];
        });
    }
  };

  function openPrintModalFn() {
    const printData = getSelectRows();
    let printList: any = [];
    if (!printData.length) return createMessage.warning('请选择打印对象');
    printData.forEach(item => {
      printList.push({
        FactoryCode: item.FactoryCode, //工厂代码
        WorkOrderNo: item.WorkOrderNo, //工单号
        Material: item.Material, //物料
        BranchQuantity: item.BranchQuantity, //支数
        DemandedQuantity: item.DemandedQuantity, //需求数量
        Specifications: item.Specifications, //规格
        VolumeQuantity: item.VolumeQuantity, //卷数
        LeaveMaterial: item.LeaveMaterial, //余料
        TransformOrder: item.TransformOrder, //转单
      });
    });
    openPrintModal(true, {
      printData: printList,
      templateId: '624044989587914693',
    });
  }
</script>
<style scoped>
  .btn-left {
    margin-left: 10px;
  }

  .scrollbar {
    padding: 0 !important;
  }
</style>
