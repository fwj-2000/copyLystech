<template>
  <Card style="border-radius: 8px; margin-bottom: 12px">
    <Subtitle :title="t('common.baseinfo')" style="padding-bottom: 0; margin-bottom: 16px" />
    <BasicForm @register="registerForm"> </BasicForm>
  </Card>
</template>
<script setup lang="ts">
  import { Subtitle } from '/@/components/Subtitle';
  import { BASICINFO_FORMCONFIG } from './config';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { Card } from 'ant-design-vue';
  import { ref, reactive, onMounted } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getProcesspreprintdetail } from '/@/api/productionDeal/ipqc';
  import { useI18n } from '/@/hooks/web/useI18n';
  const { t } = useI18n();
  const [registerForm, { updateSchema, setFieldsValue, getFieldsValue, setProps, validate }] = useForm(BASICINFO_FORMCONFIG);
  const { createMessage } = useMessage();

  function updateFormConfigFn() {
    updateSchema({
      field: 'transformTag',
      componentProps: {
        onkeydown: e => {
          workOrderNoKeydown(e);
        },
        // onChange: e => {
        //   getDiecutquantityDetailFn(e);
        // },
      },
    });
  }

  // 扫码之后，分割字符串中内容
  // const workOrderNoKeydown = e => {
  //   if (e.keyCode !== 13) return;
  //   // const data = e.target._value.split('！');
  //   // setTimeout(() => {
  //   // setFieldsValue({ transformTag: data[2] }); //设置表单值
  //   // }, 800);
  // };

  function workOrderNoKeydown(e: any) {
    const val = e.target._value;
    // 工单号扫码枪赋值
    if (e.keyCode !== 13) return;
    const arr = val.split('!') || [];
    if (!arr.length) {
      createMessage.error('请扫描正确的工单号！');
      return;
    }
    const documentNumber = arr[0];
    setFieldsValue({ transformTag: documentNumber }); //设置表单值
    getDiecutquantityDetailFn(documentNumber);
  }

  async function getDiecutquantityDetailFn(documentNumber) {
    const { code, data, msg } = await getProcesspreprintdetail({ documentNumber });
    if (code === 200) {
      const { workOrderNo, machineNo, mouldNo, process } = data;
      const result = {
        workOrderNo,
        machineNo,
        mouldNo,
        process,
      };
      setFieldsValue(result); //设置表单值
    } else {
      createMessage.error(msg);
    }
  }

  function init({ tableData, openModel }) {
    if (openModel === 'view') {
      setProps({
        disabled: true,
      });
    }
    if (tableData.checkType) {
      tableData.checkType = String(tableData.checkType);
      tableData.classes = String(tableData.classes);
    }
    setFieldsValue(tableData);
  }

  onMounted(() => {
    updateFormConfigFn();
  });

  async function getParamsFn(type) {
    const validateFlag = await validate();
    if (!validateFlag && type) return false;
    return getFieldsValue();
  }

  defineExpose({
    getParamsFn,
    init,
  });
</script>
