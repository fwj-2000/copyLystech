<template>
  <BasicModal v-bind="$attrs" @register="registerModal" title="新增" showOkBtn @ok="handleSubmit" destroyOnClose>
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addManualAssignmentCode } from '/@/api/productionDeal/manualAssignmentCode';

  const schemas: FormSchema[] = [
    {
      field: 'productCode',
      label: '产品',
      component: 'ApiSelect',
      componentProps: {
        api: getProductCode,
        placeholder: '产品',
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'searchKey',
        },
        memoInputVal: true,
        resultField: 'data',
        filterOption: true,
        notFoundContent: null,
        immediate: true,
        useChangeCopy: true,
        labelField: 'fullName',
        valueField: 'id',
      },
      required: true,
    },
    {
      field: 'date',
      label: '日期',
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM-DD',
      },
      required: true,
    },
    {
      field: 'qty',
      label: '数量',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入招标模切厂家数',
        min: 1,
        step: 1,
        precision: 0,
      },
      required: true,
    },
  ];

  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { validate }] = useForm({
    labelWidth: 120,
    schemas: schemas,
    layout: 'vertical',
    i18nConfig: {
      moduleCode: 'CommonCol',
      transferRange: ['label', 'placeholder'],
    },
  });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);
  function init(data) {
    // console.log(data, 'data');
  }
  function getProductCode(a) {
    return new Promise((resolve, reject) => {
      const list = [
        { id: '880-TGW605-08-00', fullName: '880-TGW605-08-00' },
        { id: '880-TGW606-08-00', fullName: '880-TGW606-08-00' },
      ];

      // 根据 searchKey 匹配
      let result: any = [];
      if (a.searchKey) {
        result = list.filter(item => item.fullName.includes(a.searchKey));
      } else {
        result = list;
      }

      // 如果找不到返回空数组
      resolve({
        data: result,
      });
    });
  }
  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    addManualAssignmentCode(values)
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
</script>
