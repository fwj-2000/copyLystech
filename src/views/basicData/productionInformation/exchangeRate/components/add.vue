<template>
  <BasicModal
    destroyOnClose
    :showOkBtn="hasBtnP('btn_edit')"
    v-bind="$attrs"
    @register="registerModal"
    :title="getTitle"
    :draggable="true"
    showOkBtn
    @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { computed, nextTick, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addExchangeRate, getExchangeRateById, updateExchangeRate } from '/@/api/basicData/exchangeRate';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getISOCodeList } from '/@/api/basicData/currency';
  import { debounce } from '/@/utils/debounce';
  import { usePermission } from '/@/hooks/web/usePermission';
  import dayjs from 'dayjs';

  const { createMessage } = useMessage();
  const { t } = useI18n();
  const { hasBtnP } = usePermission();

  interface State {
    dataForm: any;
  }

  const state = reactive<State>({
    dataForm: {},
  });

  const schemas: FormSchema[] = [
    {
      field: 'HoldCurrency',
      label: '持有货币',
      component: 'Select',
      componentProps: {
        showSearch: true,
        placeholder: '请选择',
        onSearch: value => {
          if (!value) {
            value = ' ';
          }
          updateHoldCurrency(value);
        },
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'ExchangeCurrency',
      label: '兑换货币',
      component: 'Select',
      componentProps: {
        showSearch: true,
        placeholder: '请选择',
        onSearch: value => {
          if (!value) {
            value = ' ';
          }
          updateExchangeCurrency(value);
        },
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'ExchangeRateNow',
      label: '当前汇率',
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      rules: [{ required: true, trigger: 'blur', message: '必填' }],
    },
    {
      field: 'ValidityDateStart',
      label: '有效期始',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择',
        row: 3,
        onChange: e => {
          setFieldsValue({
            ValidityDateEnd: dayjs(e).tz().endOf('month').valueOf(),
          });
        },
      },
      rules: [{ required: true, trigger: 'change', message: '必填' }],
    },
    {
      field: 'ValidityDateEnd',
      label: '有效期末',
      component: 'DatePicker',
      componentProps: { placeholder: '请选择', row: 3 },
    },
    {
      field: 'Status',
      label: '状态',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        placeholder: '请选择',
        options: [
          { fullName: t('common.enableText'), id: 1 },
          { fullName: t('common.disableText'), id: 2 },
        ],
      },
    },
  ];

  const getTitle = computed(() => (state.dataForm.Id ? t('common.editText') : t('common.addText')));
  const emit = defineEmits(['register', 'reload']);

  const [registerForm, { setFieldsValue, setProps, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 120,
    // layout: 'vertical',
    schemas: schemas,
    i18nConfig: {
      moduleCode: 'ExchangeRateColumn',
      transferRange: ['label', 'placeholder'],
    },
  });
  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  function init(data) {
    if (data.id) {
      setProps({
        disabled: !hasBtnP('btn_edit'),
      });
    } else {
      setProps({
        disabled: !hasBtnP('btn_add'),
      });
    }
    resetFields();
    state.dataForm.Id = data.id;
    //更新下拉列表
    if (data.industryTypeList)
      nextTick(() => {
        updateSchema([
          {
            field: 'HoldCurrency',
            componentProps: { options: data.industryTypeList },
          },
          {
            field: 'ExchangeCurrency',
            componentProps: { options: data.industryTypeList },
          },
        ]);
      });
    if (state.dataForm.Id) {
      changeLoading(true);
      getExchangeRateById(state.dataForm.Id).then(res => {
        const data = res.data;
        state.dataForm = data;
        setFieldsValue(data); //设置表单值
        changeLoading(false); //用于修改Modal的loading状态
      });
    }
  }
  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      id: state.dataForm.Id,
      ValidityDateStart: dayjs(values.ValidityDateStart).tz().startOf('day').valueOf(),
      ValidityDateEnd: dayjs(values.ValidityDateEnd).tz().endOf('day').valueOf(),
    };
    const formMethod = state.dataForm.Id ? updateExchangeRate : addExchangeRate;
    formMethod(query)
      .then(res => {
        createMessage.success(res.msg);
        changeOkLoading(false); //用于修改确认按钮的loading状态
        closeModal(); //关闭弹窗
        emit('reload');
      })
      .catch(() => {
        changeOkLoading(false);
      });
  }

  const updateHoldCurrency = debounce(getISOCodeByHoldCurrency, 300);
  const updateExchangeCurrency = debounce(getISOCodeByExchangeCurrency, 300);

  //根据持有币别输入值进行更新下拉列表
  async function getISOCodeByHoldCurrency(code) {
    const optionList = (await getISOCodeList(code)).data;
    const optionISO = optionList
      ? optionList.map(i => {
          return {
            id: i.ISOCode,
            fullName: i.ISOCode,
          };
        })
      : [];
    updateSchema([
      {
        field: 'HoldCurrency',
        componentProps: {
          placeholder: '持有货币',
          options: optionISO,
        },
      },
    ]);
  }

  //根据持有币别输入值进行更新下拉列表
  async function getISOCodeByExchangeCurrency(code) {
    const optionList = (await getISOCodeList(code)).data;
    const optionISO = optionList
      ? optionList.map(i => {
          return {
            id: i.ISOCode,
            fullName: i.ISOCode,
          };
        })
      : [];
    updateSchema([
      {
        field: 'ExchangeCurrency',
        componentProps: {
          options: optionISO,
        },
      },
    ]);
  }
</script>
