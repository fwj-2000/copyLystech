<template>
  <BasicModal
    canFullscreen
    :draggable="true"
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    :width="600"
    showOkBtn
    @ok="handleSubmit"
    destroy-on-close>
    <BasicForm @register="registerForm">
      <template #orgId>
        <lydcOrganizeSelect :disabled="sign === 'view'" v-model:value="organizeIdTree" @change="onOrganizeChange" />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { computed, ref, unref, reactive } from 'vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addBaseDataSupplier, editBaseDataSupplier } from '/@/api/purchase/supplierInformation';
  import { useBaseStore } from '/@/store/modules/base';
  import { toRefs } from '@vueuse/shared';
  import { add, bignumber, divide } from 'mathjs';
  import { addBaseDataWagerate, editBaseDataWagerate } from '/@/api/finance/wageRate';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { getExceptionTypeList } from '/@/api/qms/iqc/abnormalTimelinessMonitoring';
  import { getFactoryList } from '/@/api/business/shippingspace';
  import { useUserStore } from '/@/store/modules/user';

  const { hasBtnP } = usePermission();
  const { createMessage } = useMessage();
  const emit = defineEmits(['register', 'reload']);

  const [registerForm, { setFieldsValue, clearValidate, validate, resetFields, updateSchema, getFieldsValue, setProps }] = useForm({
    schemas: getSchemas(),
    labelWidth: 120,
    i18nConfig: {
      moduleCode: 'WageRateColumn',
      transferRange: ['label', 'placeholder'],
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  interface State {
    organizeIdTree: number[];
    sign: 'edit' | 'view';
  }
  const state = reactive<State>({
    organizeIdTree: [],
    sign: 'edit',
  });
  const { organizeIdTree, sign } = toRefs(state);
  const baseStore = useBaseStore();
  const { t } = useI18n();
  const id = ref('');

  const userStore = useUserStore();

  async function init(data) {
    state.organizeIdTree = [];
    changeLoading(true);
    resetFields();
    getTypeOps();
    id.value = data.id;
    // state.dataForm.workLogoIcon = undefined;
    // state.selfUrl = '';
    if (id.value) {
      setFieldsValue({
        ...data,
        factoryList: data.factoryList.map(item => item.code),
        indirectManTotal: (data.indirectManTotal * 100).toFixed(2),
      });
      console.log(data);
      state.organizeIdTree = data.organizeIdTree.split(',');
    } else {
      // 新增
      const { organizeIdList } = userStore.getUserInfo;
      state.organizeIdTree = organizeIdList;
    }
    state.sign = data.sign;
    if (data.sign === 'view') {
      setProps({
        disabled: true,
      });
    }
    changeLoading(false);

    // if (id.value) {
    //   changeLoading(true);
    //   getInfo(id.value).then(res => {
    //     const data = res.data;
    //     state.dataForm = res.data;
    //     const propertyJson = data.propertyJson ? JSON.parse(data.propertyJson) : null;
    //     state.propertyJson = propertyJson || { iconBackgroundColor: '' };
    //     setFieldsValue(data);
    //     getSelfUrl(res.data.enCode);
    //     changeLoading(false);
    //   });
    // }
  }

  function getSchemas(): FormSchema[] {
    return [
      {
        field: 'orgId',
        label: '组织',
        component: 'OrganizeSelect',
        slot: 'orgId',
        i18nField: 'orgName',
        componentProps: { maxlength: 50 },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'mainProcess',
        label: '主要制程',
        component: 'Select',
        componentProps: { maxlength: 50 },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'factoryList',
        label: '工厂',
        component: 'ApiSelect',
        componentProps: {
          api: getFactoryList,
          labelField: 'Name',
          valueField: 'Code',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          mode: 'multiple',
          resultField: 'data',
          nameFormat: ['Name', '(', 'Code', ')'],
          apiSearch: {
            show: true,
            searchName: 'factoryCode',
          },
        },
      },
      {
        field: 'baseName',
        label: '基数',
        component: 'Input',
        componentProps: { maxlength: 50 },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'indirect',
        label: '直接',
        component: 'Input',
        componentProps: {
          maxlength: 50,
          onChange: e => {
            calculateCount('indirect', e);
          },
        },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'direct',
        label: '间接',
        component: 'Input',
        componentProps: {
          maxlength: 50,
          onChange: e => {
            calculateCount('direct', e);
          },
        },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'indirectDirect',
        label: '间/直%(公允)',
        component: 'Input',
        componentProps: {
          maxlength: 200,
        },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'total',
        label: '合计',
        component: 'Input',
        componentProps: {
          maxlength: 200,
          disabled: true,
        },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'coefficient',
        label: '系数',
        component: 'Input',
        componentProps: { maxlength: 200 },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'indirectManTotal',
        label: '间接总人工',
        component: 'Input',
        componentProps: {
          maxlength: 200,
          disabled: true,
          suffix: '%',
        },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'status',
        label: '是否启用',
        component: 'Select',
        defaultValue: '1',
        componentProps: {
          options: [
            { fullName: '禁用', id: '0' },
            { fullName: '启用', id: '1' },
          ],
          fieldNames: {
            label: 'fullName',
            value: 'id',
          },
        },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      {
        field: 'remark',
        label: '备注',
        component: 'Textarea',
        componentProps: { maxlength: 200 },
      },
    ];
  }

  const getTitle = computed(() => (unref(id) ? t('common.editText') : t('common.addText')));

  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: id.value,
    };
    const formMethod = id.value ? editBaseDataWagerate : addBaseDataWagerate;
    formMethod(query)
      .then(res => {
        createMessage.success(res.msg);
        changeOkLoading(false);
        closeModal();
        emit('reload');
      })
      .catch(() => {
        changeOkLoading(false);
      });
  }

  async function getTypeOps() {
    const list = await baseStore.getDictionaryData('Supplier.Status');
    updateSchema({
      field: 'status',
      componentProps: {
        options: list,
        fieldNames: { value: 'enCode' },
      },
    });
    const mainProcesslist = await baseStore.getDictionaryData('MainProcess');

    updateSchema({
      field: 'mainProcess',
      componentProps: {
        options: mainProcesslist,
        fieldNames: { value: 'enCode', label: 'fullName' },
      },
    });
  }

  function calculateCount(type, e) {
    if (type === 'direct') {
      const value = getFieldsValue('indirect');
      // 合计
      const total = add(bignumber(e || 0), bignumber(value.indirect || 0)).toString();
      // 间接总人工
      const indirectManTotal =
        divide(bignumber(e || 0), bignumber(total))
          .toNumber()
          .toFixed(2) * 100;
      setFieldsValue({
        total,
        indirectManTotal,
      });
    }
    if (type === 'indirect') {
      const value = getFieldsValue('direct');
      // 合计
      const total = add(bignumber(e || 0), bignumber(value.direct || 0)).toString();
      // 间接总人工
      const indirectManTotal = divide(bignumber(e || 0), bignumber(total))
        .toNumber()
        .toFixed(2);
      setFieldsValue({
        total,
        indirectManTotal,
      });
    }
  }
  function onOrganizeChange(val) {
    setFieldsValue({ orgId: !val || !val.length ? '' : val[val.length - 1] });
    if (!val || !val.length) return;
    clearValidate('orgId');
  }
</script>
