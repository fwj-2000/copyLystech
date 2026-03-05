<template>
  <ScrollContainer style="background: #ebeef5" v-loading="loading">
    <div class="card">
      <BasicForm @register="registerForm" />
      <div class="text-right">
        <a-button @click="resetFields">{{ t('common.cancelText') }}</a-button>
        <a-button class="ml-5" type="primary" @click="print">{{ t('common.print') }}</a-button>
      </div>
    </div>
    <div class="card mt-16px">
      <div class="subtitle-container">
        <div class="title">
          <span class="line"></span>
          手册浏览
          <span class="ml-14px">手册类型:</span>
          <a-select v-model:value="state.mesType" placeholder="请选择类型" class="mesSelect" @select="onSelectMesType">
            <a-select-option v-for="item in state.mesTypeList" :key="item.id" :value="item.fullName">{{ item.fullName }}</a-select-option>
          </a-select>
        </div>
      </div>
      <a-row class="h-680px" :wrap="false">
        <a-col flex="230px">
          <div class="approve-node">
            <a-input v-model:value="state.mesSelectValue" placeholder="请输入查询内容" class="searchInput" @change="searchChange()">
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input>
            <div style="height: 80%">
              <div v-for="(item, index) in state.mesList" :key="item.name">
                <div class="node-label" :class="{ active: state.currentActiveName === item.name }" @click="clickMesFile(item.name, item.fileFullName)">{{
                  item.name
                }}</div>
              </div>
            </div>
          </div>
        </a-col>
        <a-col flex="auto" class="p-16px pt-0px">
          <p class="font-semibold pb-10px" style="border-bottom: 1px solid #e5e5e5">{{ t('component.upload.preview') }}</p>
          <iframe width="100%" height="89%" :src="state.url" allowfullscreen></iframe>
        </a-col>
      </a-row>
    </div>
  </ScrollContainer>
</template>
<script lang="ts" setup>
  import { reactive, onMounted, ref } from 'vue';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getMesfilelist, PreviewFile, addDieCutPerPrint } from '/@/api/productionDeal/dieCutPerPrint';
  import { getWorkOrderDesc } from '/@/api/productionDeal/workOrder';
  import { getMachineNoList } from '/@/api/basicData/processrulestemplate';
  import { getFactoryList } from '/@/api/basicData/factory';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import { ScrollContainer } from '/@/components/Container';
  import { useBaseStore } from '/@/store/modules/base';
  import { debounce } from '/@/utils/debounce';
  import { getlineinfolist } from '/@/api/basicData/processrulestemplate';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';

  defineOptions({ name: 'productionDeal-dieCut-printList' });

  const { t } = useI18n();

  const baseStore = useBaseStore();

  interface State {
    dataForm: any;
    mesAllList: any;
    mesList: any;
    mesTypeList: any;
    mesType: any;
    mesSelectValue: any;
    url: string;
    workOrderType: string;
    currentActiveName: any;
  }

  const state = reactive<State>({
    dataForm: {},
    mesAllList: [],
    mesList: [],
    mesTypeList: [],
    mesType: null,
    mesSelectValue: null,
    url: '',
    workOrderType: '',
    currentActiveName: null,
  });

  const loading = ref(false);

  const schemas: FormSchema[] = [
    {
      field: 'workOrderNo',
      label: '工单号',
      component: 'Input',
      componentProps: {
        // useScan:true,
        suffixIcon: 'icon-ym icon-ym-scanCode1',
        placeholder: '请输入或扫码',
        onChange: e => {
          workOrderNoChange(e);
        },
        onKeyDown: e => {
          splitScanData(e);
        },
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 6 },
    },
    {
      field: 'innerMaterialNumber',
      label: '产品内部料号',
      component: 'Input',
      componentProps: { placeholder: '自动带入', disabled: true },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 6 },
    },
    {
      field: 'workOrderQuantity',
      label: '工单数量',
      component: 'InputNumber',
      componentProps: { placeholder: '自动带入', disabled: true },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 6 },
    },
    {
      field: 'plansQuantity',
      label: '当班计划数（K）',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 6 },
    },
    {
      field: 'machineNo',
      label: '机台号',
      component: 'ApiSelect',
      componentProps: {
        api: getMachineNoList,
        placeholder: '请选择机台号',
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
        // nameFormat: ['name', '(', 'code', ')'],
      },
      colProps: {
        span: 6,
      },
    },
    {
      field: 'operatorId',
      label: '操作员',
      component: 'CustomUserSelect',
      componentProps: {
        multiple: false,
        allowClear: true,
        showSearch: true,
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 6 },
    },
    {
      field: 'classes',
      label: '班次',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择班次',
        api: () => {
          return baseStore.getDictionaryData('ClassesName');
        },
        labelField: 'fullName',
        valueField: 'enCode',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
      },
      colProps: { span: 6 },
    },
    {
      field: 'printNumber',
      label: '打印张数',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 6 },
    },
    {
      field: 'sheetQuantity',
      label: '每张数量',
      component: 'InputNumber',
      componentProps: { placeholder: '请输入' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 6 },
    },
    {
      field: 'produceDate',
      label: '生产日期',
      component: 'DatePicker',
      componentProps: { placeholder: '请选择日期' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 6 },
    },
    {
      field: 'lineCode',
      label: '线体',
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
      colProps: {
        span: 6,
      },
    },
    {
      field: 'factoryType',
      label: '厂别',
      component: 'Select',
      componentProps: { placeholder: '请选择类型' },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
      colProps: { span: 6 },
    },
  ];

  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerModal, { openModal: openFormModal }] = useModal();
  const [registerForm, { setFieldsValue, getFieldsValue, validate, resetFields, clearValidate, updateSchema }] = useForm({
    labelWidth: 140,
    schemas: schemas,
    layout: 'vertical',
  });

  const workOrderNoChange = debounce((e, type) => {
    if (e) {
      getWorkOrderDesc({ workOrderNo: e })
        .then(res => {
          if (res.code == 200) {
            const data = { innerMaterialNumber: '', workOrderQuantity: '' };
            data.innerMaterialNumber = res.data.productCode;
            data.workOrderQuantity = res.data.quantity;
            state.workOrderType = res.data.workOrderType;
            setFieldsValue(data); //设置表单值
          } else {
            createMessage.error(res.msg);
          }
        })
        .catch(() => {});
    }
  }, 600);

  //扫码输入工单
  const splitScanData = e => {
    if (e.keyCode === 13) {
      const str = e.target.value || '';
      setFieldsValue({ workOrderNo: str });
    }
  };

  // 厂别列表
  async function getFarhors() {
    const list = (await getFactoryList()).data;

    const optionsList = list.map(i => {
      return {
        id: i.Code,
        fullName: i.Name,
      };
    });
    updateSchema({
      field: 'factoryType',
      componentProps: {
        options: optionsList,
      },
    });
  }
  getFarhors();

  function onSelectMesType(mestype) {
    const formValue = getFieldsValue();
    if (mestype && formValue.workOrderNo) {
      const query = { productCode: formValue.innerMaterialNumber, workOrderType: state.workOrderType, type: mestype };
      loading.value = true;
      getMesfilelist(query)
        .then(res => {
          state.mesList = res.data;
          state.mesAllList = res.data;
          loading.value = false;
        })
        .catch(e => {
          console.log(e);
          loading.value = false;
        });
    }
  }

  function searchChange() {
    state.mesList = state.mesAllList.filter(item => item.name.includes(state.mesSelectValue));
  }

  function clickMesFile(name, filePath) {
    loading.value = true;
    state.currentActiveName = name;
    PreviewFile({ filePath: filePath })
      .then(res => {
        const blob = new Blob([res.data], { type: 'application/pdf' });
        state.url = URL.createObjectURL(blob);

        loading.value = false;
      })
      .catch(e => {
        console.log(e);
        loading.value = false;
      });
  }

  async function print() {
    const formValue = getFieldsValue();
    console.log(formValue, 'ssss');
    const values = await validate();
    if (values) {
      const { code, data, msg } = await addDieCutPerPrint(formValue);
      if (code === 200) {
        createMessage.success(msg);
        console.log(data);
      } else {
        createMessage.error(msg);
      }
    }
    //  openFormModal(true)
  }

  onMounted(async () => {
    const mesTypeList = (await baseStore.getDictionaryData('DieCutPerPrint.Type')) as any[];
    const optionsMesTypeList = mesTypeList.map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });
    state.mesTypeList = optionsMesTypeList;
  });
</script>

<style lang="less" scoped>
  .card {
    padding: 16px;
    background: #fff;
    border-radius: 8px;

    .approve-node {
      box-sizing: border-box;
      color: #fff;
      overflow: hidden;
      // min-width: 230px;
      height: 100%;
      align-items: center;
      flex-shrink: 0;
      border-radius: 4px;
      background: #f5f5f5;
      justify-content: flex-start;

      .searchInput {
        align-self: baseline;
        width: 90%;
        margin: 16px 10px;
      }

      .node-label {
        //background: #fff;
        font-size: 14px;
        color: #000;
        width: 90%;
        text-align: left;
        cursor: pointer;
        margin: 0 10px;
        margin-bottom: 12px;
      }

      .active {
        background: #fff;
      }
    }
  }

  .subtitle-container {
    padding-bottom: 16px;

    .title {
      color: #1a1a1a;
      font-size: 14px;
      font-weight: 700;

      .mesSelect {
        width: 130px;
        margin-left: 10px;
      }
    }

    .line {
      &::before {
        content: '';
        display: inline-block;
        width: 2px;
        height: 14px;
        background-color: #ff7b00;
        border-radius: 2px;
        position: relative;
        top: 2px;
        margin-right: 8px;
      }
    }
  }

  ::v-deep(.icon-ym-scanCode1) {
    color: #ff7b00 !important;
  }
</style>
