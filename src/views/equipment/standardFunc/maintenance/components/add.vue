<template>
    <BasicModal
      v-bind="$attrs"
      @register="registerModal"
      :height="700"
      width="720px"
      :centered="true"
      :canFullscreen="true"
      :draggable="true"
      :title="getTitle"
      showOkBtn
      @ok="handleSubmit">
      <BasicForm @register="registerForm"> </BasicForm>
    </BasicModal>
  </template>
  
  <script lang="ts" setup>
    import { BasicModal, useModalInner } from '/@/components/Modal';
    import { BasicForm, useForm, FormSchema } from '/@/components/Form';
    import { getEquipmentByCode, getEquipmentList } from '/@/api/equipment/information';
    import { getMItemList } from '/@/api/equipment/maintenanceItems';
    import { addMaintenance, updateMaintenance } from '/@/api/equipment/maintenance';
    import { useMessage } from '/@/hooks/web/useMessage';
    import { useI18n } from '/@/hooks/web/useI18n';
    import { computed, reactive } from 'vue';
  
    const { t } = useI18n();
    const { createMessage } = useMessage();
    const emit = defineEmits(['register', 'reload']);
  
    interface State {
      dataForm: any;
      equipmentClassList: any[];
      maintenPlanTypeList: any[];
    }
  
    const state = reactive<State>({
      dataForm: {},
      equipmentClassList: [],
      maintenPlanTypeList: [],
    });
  
    const getTitle = computed(() => (state.dataForm.id ? t('common.editText') : t('common.addText')));
    const schemas: FormSchema[] = [
      {
        field: 'equipmentCode',
        label: '设备编码',
        component: 'ApiSelect',
        componentProps: {
          placeholder: '请输入设备编码',
          labelField: 'Name',
          valueField: 'Code',
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'Code',
          },
          api: async v => {
            // 动态获取数据
            const r = await getEquipmentList(v);
            if (r.code == 200) {
              return r.data.map(el => {
                el.Name = el.Code + '/' + el.Name;
                return el;
              });
            }
          },
          onkeydown: key => onkeydown(key),
        },
      },
      {
        field: 'Name',
        label: '设备名称',
        component: 'Input',
        componentProps: {
          readonly: true,
          placeholder: '自动带入',
          disabled: true,
        },
      },
      {
        field: 'CategoryName',
        label: '设备分类',
        component: 'Input',
        componentProps: {
          placeholder: '自动带入',
          disabled: true,
        },
      },
      {
        field: 'Specification',
        label: '规格型号',
        component: 'Input',
        componentProps: {
          placeholder: '自动带入',
          disabled: true,
        },
      },
      {
        field: 'SerialNumber',
        label: '机身序列号',
        component: 'Input',
        componentProps: {
          placeholder: '自动带入',
          disabled: true,
        },
      },
      {
        field: 'SupplierName',
        label: '设备制造商',
        component: 'Input',
        componentProps: {
          placeholder: '自动带入',
          disabled: true,
        },
      },
      {
        field: 'Position',
        label: '设备位置',
        component: 'Input',
        componentProps: {
          placeholder: '自动带入',
          disabled: true,
        },
      },
      {
        field: 'FactoryAreaName',
        label: '厂区',
        component: 'Input',
        componentProps: {
          placeholder: '自动带入',
          disabled: true,
        },
      },
      {
        field: 'ArrivalTime',
        label: '到厂时间',
        component: 'DatePicker',
        componentProps: {
          format: 'YYYY-MM-DD',
          placeholder: '自动带入',
          disabled: true,
        },
      },
      {
        field: 'lastTime',
        label: '上次保养时间',
        component: 'DatePicker',
        componentProps: {
          format: 'YYYY-MM-DD',
          placeholder: '自动带入',
          disabled: true,
        },
      },
      {
        field: 'itemsId',
        label: '保养项目',
        component: 'Select',
        componentProps: {
          placeholder: '请选择',
          mode: 'multiple',
        },
      },
      {
        field: 'planType',
        label: '计划类型',
        component: 'Select',
        componentProps: {
          placeholder: '请选择',
        },
        rules: [{ required: true, trigger: 'change', message: '必填' }],
      },
      {
        field: 'planTime',
        label: '计划保养日期',
        component: 'DatePicker',
        componentProps: {
          placeholder: '请输入',
        },
        rules: [{ required: true, trigger: 'blur', message: '必填' }],
      },
    ];
  
    const [registerForm, { validate, resetFields, updateSchema, setFieldsValue, getFieldsValue }] = useForm({
      labelWidth: 140,
      schemas: schemas,
      layout: 'vertical',
      baseColProps: {
        span: 12,
      },
    });
  
    const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);
  
    async function init(data) {
      resetFields();
      state.dataForm.id = data.id;
      state.equipmentClassList = data.equipmentClassList;
      state.maintenPlanTypeList = data.maintenPlanTypeList;
      if (data.maintenPlanTypeList) updateSchema({ field: 'planType', componentProps: { options: data.maintenPlanTypeList } });
    }
  
    async function handleSubmit() {
      const values = await validate();
      if (!values) return;
      values.itemsId = values.itemsId.join(',');
      console.log(values);
      changeOkLoading(true);
      const query = {
        ...values,
        id: state.dataForm.id,
      };
      const formMethod = state.dataForm.id ? updateMaintenance : addMaintenance;
  
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
  
    //设备编码输入框回车事件
    function onkeydown(key) {
      if (key.key == 'Enter') {
        const code = getFieldsValue()['equipmentCode'];
        //查询设备信息
        getEquipmentByCode(code).then(res => {
          if (res.data && res.data.Id) {
            //给form表单赋值
            setFieldsValue(res.data);
            //查询保养项目
            const enCode = state.equipmentClassList.find(c => c.fullName == res.data.CategoryName)?.id;
            getMItemList({ category: enCode }).then(r => {
              const options = r.data.map(i => {
                return { id: i.id, fullName: i.name };
              });
              updateSchema({
                field: 'itemsId',
                componentProps: {
                  options: options,
                },
              });
              setFieldsValue({ itemsId: r.data.map(i => i.id) });
            });
          }
        });
      }
    }
  </script>
  