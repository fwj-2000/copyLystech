<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" showOkBtn @ok="handleSubmit" width="860px">
    <div class="h-640px">
      <BasicForm @register="registerForm"> </BasicForm>
      <div class="h-280px">
        <div class="mb-10px">{{ t('common.materialInfo') }}</div>
        <Grid>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { debounce, cloneDeep } from 'lodash-es';
  import { reactive, ref, nextTick, unref, onMounted } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { checkmaterialcode, scanMaterials, getmateriallist, getLabelDetail, getLabelDetailBySn, checkSnCode } from '/@/api/productionDeal/pcScanMaterials';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import dayjs from 'dayjs';
  import { useRoute } from 'vue-router';
  import { useBaseStore } from '/@/store/modules/base';
  const baseStore = useBaseStore();
  const route = useRoute();
  let materialsTypeOptions: any;
  let materialsTypeName = '普通类型';
  const materialsType: any = route.query.materialsType || 0; // 扫描物料类型
  const { t } = useI18n();

  interface State {
    snCode: string;
    documentNumber: string;
    factoryArea: string;
    process: string;
    processName: string;
    routeBindId: string;
    routeId: string;
    routeNodeId: string;
  }

  const state = reactive<State>({
    snCode: '',
    documentNumber: '',
    factoryArea: '',
    process: '',
    processName: '',
    routeBindId: '',
    routeId: '',
    routeNodeId: '',
  });

  const column = [
    { title: 'SN', field: 'snCode', width: 90, ifShow: materialsType == 0 },
    { title: '物料类型', field: 'materialsTypeName', width: 90 },
    { title: '材料编号', field: 'materialCode', width: 160 },
    { title: '规格', field: 'materialSpecs', width: 120 },
    { title: '批次', field: 'materialBatch', width: 70 },
    { title: '生产日期', field: 'materialProductionDate', width: 100 },
    { title: '有效日期', field: 'materialEffectiveDate', width: 100 },
    { title: '唯一码', field: 'uniqueCode', width: 180 },
    { title: '数量', field: 'materialQuantity', width: 70 },
    { title: '材质', field: 'texture', width: 70 },
    { title: '供应商编号', field: 'materialSupplier', width: 100 },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 70,
      fixed: 'right',
    },
  ];

  const [Grid, { getFetchParams, remove, insertAt, reloadData, getDataSource }] = useVbenVxeGrid({
    gridOptions: {
      id: 'pcScanMaterials-Add-list',
      columns: column,
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        enabled: false,
      },
    },
  });

  const schemas: FormSchema[] = [
    {
      field: 'documentNumber',
      label: '流转标签',
      component: 'Input',
      componentProps: {
        suffixIcon: 'icon-ym icon-ym-scanCode1',
        placeholder: '请输入或扫描标签',
        // onkeydown: e => {
        //   workOrderNoKeydown(e);
        // },
        onChange: e => {
          getDiecutquantityDetailFn(e);
        },
      },
    },
    {
      field: 'materialCode',
      label: '物料',
      component: 'Input',
      componentProps: {
        suffixIcon: 'icon-ym icon-ym-scanCode1',
        placeholder: '请输入或扫描物料',
        // onkeydown: e => {
        //   materialCodeKeydown(e);
        // },
        onChange: e => {
          materialCodeKeydown(e);
        },
      },
      rules: [{ required: false, trigger: 'blur', message: t('component.form.enterOrScan') }],
    },
    {
      field: 'snCode',
      label: 'SN',
      component: 'Input',
      componentProps: {
        suffixIcon: 'icon-ym icon-ym-scanCode1',
        placeholder: '请输入或扫描SN',
        onkeydown: e => {
          snCodeKeydown(e);
        },
      },
      rules: [{ required: false, trigger: 'blur', message: t('component.form.enterOrScan') }],
    },
    {
      field: 'workOrderNo',
      label: '工单编码',
      component: 'Input',
      componentProps: {
        placeholder: '自动带入',
        disabled: true,
      },
      rules: [{ required: true, trigger: 'blur', message: t('component.form.scanTips') }],
    },
    {
      field: 'innerMaterialNumber',
      label: '产品编码',
      component: 'Input',
      componentProps: { placeholder: '自动带入', disabled: true },
      rules: [{ required: true, trigger: 'blur', message: t('component.form.scanTips') }],
    },
    {
      field: 'productionDate',
      label: '生产日期',
      component: 'DatePicker',
      componentProps: { placeholder: '自动带入', disabled: true },
      rules: [{ required: false, trigger: 'blur', message: t('component.form.scanTips') }],
    },
    {
      field: 'tagsQuantityPcs',
      label: '标签数（PCS）',
      component: 'Input',
      componentProps: { placeholder: '自动带入', disabled: true },
      rules: [{ required: true, trigger: 'blur', message: t('component.form.scanTips') }],
    },
    {
      field: 'productionBatch',
      label: '生产批次',
      component: 'Input',
      componentProps: { placeholder: '自动带入', disabled: true },
      rules: [{ required: true, trigger: 'blur', message: t('component.form.scanTips') }],
    },
    {
      field: 'remark',
      label: '备注',
      component: 'Input',
      componentProps: { placeholder: '请输入', showCount: true, maxlength: 200 },
    },
  ];
  const scanData = ref({});
  const getTitle = t('common.scanMaterials');
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();

  const [registerForm, { setFieldsValue, validate, resetFields, getFieldsValue }] = useForm({
    labelWidth: 160,
    baseColProps: { span: 12 },
    layout: 'vertical',
    schemas: schemas,
  });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  function getTableActions(record) {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDelete.bind(null, record),
      },
    ];
  }

  function handleDelete(record) {
    remove(record);
  }

  function init() {
    resetFields();
    reloadData([]);
  }

  //扫码之后，分割字符串中内容
  // const workOrderNoKeydown = e => {
  //   if (e.keyCode !== 13) return;
  //   // 单据号!料号!工单号!批次号!数量!guid
  //   // const data = e.target._value.split('！');
  //   // setTimeout(() => {
  //   //   setFieldsValue({ workOrderNo: data[2] });
  //   // }, 800);
  // };

  // 110-3M1050TC-0500!500MM*100M!241007!2024-10-07!2025-10-06!1864505315784527872!100.0!YFY02
  let data;
  // 料号!规格!批次!生产日期!有效日期!唯一码!数量!供应商编号
  const materialCodeKeydown = e => {
    if (!e) return;
    if (e?.target?.value) {
      if (e.keyCode !== 13) return;
      if (e.includes('!')) {
        data = e.split('!');
      } else if (e.includes('-')) {
        data = e.split('-');
      } else {
        return;
      }
    } else {
      if (e.includes('!')) {
        data = e.split('!');
      } else if (e.includes('-')) {
        data = e.split('-');
      } else {
        return;
      }
    }
    let obj: any = {};
    setTimeout(async () => {
      // 模具扫料处理[编码！规格！批次！材质！供应商代码]
      if (data && data.length === 4) {
        const [texture, materialSpecs, materialBatch, materialSupplier] = data;
        scanData.value = {
          texture,
          materialSpecs,
          materialBatch,
          materialSupplier,
        };
      } else if (data && data.length === 5) {
        const [materialCode, materialSpecs, materialBatch, texture, materialSupplier] = data;
        scanData.value = {
          materialCode,
          materialSpecs,
          materialBatch,
          texture,
          materialSupplier,
        };
        obj = {
          materialCode,
          materialsType,
        };
      } else {
        const [materialCode, materialSpecs, materialBatch, materialProductionDate, materialEffectiveDate, uniqueCode, materialQuantity, materialSupplier] =
          data;
        scanData.value = {
          materialsType,
          materialsTypeName,
          materialCode,
          materialSpecs,
          materialBatch,
          materialProductionDate,
          materialEffectiveDate,
          uniqueCode,
          materialQuantity,
          materialSupplier,
        };
        obj = {
          materialCode,
          materialsType,
          uniqueCode,
        };

        if (materialEffectiveDate) {
          const diffTime = isWithin60Days(materialEffectiveDate);
          if (diffTime < 0) {
            createMessage.warning('物料已过期');
            return;
          } else if (diffTime < 60) {
            createMessage.warning('有效期小于60天');
          }
        }
      }
      setFieldsValue({ materialCode: '' });

      // 物料编码为空，则不校验
      if (!obj?.materialCode) return insertAt(unref(scanData), -1);

      const { innerMaterialNumber } = getFieldsValue();
      if (!state.snCode) {
        if (!innerMaterialNumber || !state.documentNumber) {
          return;
        }
      }

      const param = {
        ...obj,
        innerMaterialNumber,
        documentNumber: state.documentNumber,
        snCode: state.snCode,
        routeBindId: state.routeBindId,
        routeId: state.routeId,
        routeNodeId: state.routeNodeId,
        materialsType,
      };
      const { data: _data, msg } = await checkmaterialcode(param);
      if (_data !== true) return createMessage.warning(msg);
      insertAt(unref(scanData), -1);
    }, 800);
  };

  const snCodeKeydown = async e => {
    if (!e) return;
    if (e?.target?.value) {
      if (e.keyCode == 13) {
        data = e.target.value;
        if (materialsType == '0') {
          console.log(1111111111);
          const { code, msg } = await checkSnCode({ snCode: data });
          if (code === 200) {
            scanData.value = {
              snCode: data,
            };
            insertAt(unref(scanData), -1);
            setFieldsValue({ snCode: '' });
          } else {
            createMessage.error(msg);
          }
        } else {
          getSnCodeInfo(data);
        }
      }
    }
  };

  async function getSnCodeInfo(snCode) {
    const { code, data, msg } = await getLabelDetailBySn({ snCode });
    if (code === 200) {
      const {
        snCode,
        documentNumber,
        workOrderNo,
        innerMaterialNumber,
        productionDate,
        tagsQuantityPcs,
        productionBatch,
        factoryArea,
        process,
        processName,
        routeBindId,
        routeId,
        routeNodeId,
      } = data;
      state.snCode = snCode;
      state.documentNumber = documentNumber;
      state.factoryArea = factoryArea;
      state.process = process;
      state.processName = processName;
      state.routeBindId = routeBindId;
      state.routeId = routeId;
      state.routeNodeId = routeNodeId;

      const result = {
        workOrderNo,
        innerMaterialNumber,
        productionDate,
        tagsQuantityPcs,
        productionBatch,
        materialsTypeName,
      };
      setFieldsValue(result); //设置表单值
    } else {
      state.snCode = '';
      state.documentNumber = '';
      state.factoryArea = '';
      state.process = '';
      state.processName = '';
      state.routeBindId = '';
      state.routeId = '';
      state.routeNodeId = '';

      const result = {
        snCode: '',
        workOrderNo: '',
        innerMaterialNumber: '',
        productionDate: '',
        tagsQuantityPcs: '',
        productionBatch: '',
        materialsTypeName: '',
      };
      setFieldsValue(result); //设置表单值

      createMessage.error(msg);
    }
  }

  function isWithin60Days(timestamp) {
    const baseDate = dayjs().tz();
    const targetDate = dayjs(timestamp).tz();
    const diffDays = targetDate.diff(baseDate, 'day');
    return diffDays;
  }

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);
    const query = {
      ...values,
      ...scanData.value,
      ...state,
      materialsType,
      detailList: getDataSource(),
    };

    const formMethod = scanMaterials;
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

  const getDiecutquantityDetailFn = debounce(async newVal => {
    const arr = newVal.replace(/！/g, '!').split('!') || [];
    const label = arr[0];
    const { code, data, msg } = await getLabelDetail({ documentNumber: label });
    if (code === 200) {
      const {
        snCode,
        documentNumber,
        workOrderNo,
        innerMaterialNumber,
        productionDate,
        tagsQuantityPcs,
        productionBatch,
        factoryArea,
        process,
        processName,
        routeBindId,
        routeId,
        routeNodeId,
      } = data;
      state.snCode = snCode;
      state.documentNumber = documentNumber;
      state.factoryArea = factoryArea;
      state.process = process;
      state.processName = processName;
      state.routeBindId = routeBindId;
      state.routeId = routeId;
      state.routeNodeId = routeNodeId;

      const result = {
        snCode,
        workOrderNo,
        innerMaterialNumber,
        productionDate,
        tagsQuantityPcs,
        productionBatch,
        materialsTypeName,
      };
      setFieldsValue(result); //设置表单值
      const res = await getmateriallist({ workOrderNo, documentNumber });
      reloadData(res.data);
    } else {
      state.snCode = '';
      state.documentNumber = '';
      state.factoryArea = '';
      state.process = '';
      state.processName = '';
      state.routeBindId = '';
      state.routeId = '';
      state.routeNodeId = '';

      const result = {
        snCode: '',
        workOrderNo: '',
        innerMaterialNumber: '',
        productionDate: '',
        tagsQuantityPcs: '',
        productionBatch: '',
        materialsTypeName: '',
      };
      setFieldsValue(result); //设置表单值

      createMessage.error(msg);
    }
  }, 300);

  onMounted(() => {
    const _materialsTypeOptions: any = baseStore.getDictionaryData('materialsType') || [];
    try {
      if (!_materialsTypeOptions.length) return;
      _materialsTypeOptions.forEach(item => {
        if (!materialsTypeOptions[item.enCode]) materialsTypeOptions[item.enCode] = item.fullName;
      });
      materialsTypeName = materialsTypeOptions[materialsType];
    } catch (error) {
      console.log(error);
    }
    console.log(materialsTypeName);
  });
</script>

<style lang="less" scoped>
  ::v-deep(.icon-ym-scanCode1) {
    color: #ff7b00 !important;
  }
</style>
