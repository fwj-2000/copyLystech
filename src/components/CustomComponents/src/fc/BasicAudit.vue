<template>
  <div>
    <div class="flex">
      <Subtitle :title="t('common.auditInfo')"></Subtitle>
      <BasicForm class="flex-1 w-full ml-3" @register="registerForm"></BasicForm>
    </div>
    <BasicForm @register="registerRoleForm"></BasicForm>
  </div>
</template>
<script lang="ts" setup>
  import { PropType, onMounted, watch } from 'vue';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Subtitle } from '/@/components/Subtitle';
  import { getMainProcess } from '/@/utils/business/index';
  import { getFcAuditList } from '/@/api/customerSerivce/fcAudit';
  import { getListDynamicTitles } from './utils';

  const { t } = useI18n();
  const emit = defineEmits(['reload']);
  const props = defineProps({
    approverType: {
      type: String,
      defualt: '', // 审批类型ApproverType字典的code
    },
    // 需要自定义添加的formitem
    schemas: {
      type: Array as PropType<FormSchema[]>,
      default: [],
    },
  });

  // 初始信息
  const [registerForm, { getFieldsValue, updateSchema, setFieldsValue, validate }] = useForm({
    layout: 'horizontal',
    labelWidth: 100,
    baseColProps: { span: 6 },
    schemas: [
      {
        field: 'approverGroupId',
        label: t('common.groupName'),
        component: 'ApiSelect',
        required: true,
        componentProps: {
          api: getFcAuditList,
          resultField: 'data.list',
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'approverGroupName',
          },
          params: {
            mainProcess: '1',
            approverType: props.approverType,
          },
          valueField: 'id',
          labelField: 'approverGroupName',
          filterOption: false,
          immediate: false,
          onChange: (value, data) => {
            handleAduitGroupChange(data);
          },
        },
      },
      {
        field: 'mainProcess',
        label: t('dict.CommonCol.mainProcess'),
        component: 'Select',
        defaultValue: '1',
        required: true,
        componentProps: {
          allowClear: false,
          onChange: handleMainProcessChange,
        },
      },
      ...props.schemas,
    ],
  });
  const [
    registerRoleForm,
    {
      getFieldsValue: getFieldsValueRole,
      resetSchema: resetSchemaRole,
      setFieldsValue: setFieldsValueRole,
      resetFields: resetFieldsRole,
      validate: validateRole,
    },
  ] = useForm({
    layout: 'vertical',
    labelWidth: '100%',
    baseColProps: { span: 8 },
    schemas: [],
  });

  // 数据初始化
  async function init() {
    updateMainProcess();
    updateRoleList();
  }
  onMounted(() => {
    init();
  });
  // 监听审批类型变化
  watch(
    () => props.approverType,
    () => {
      updateRoleList();
      handleApproverGroupId();
    },
  );

  /**
   * 更新主要制程列表
   * */
  async function updateMainProcess() {
    try {
      const mainProcessList = await getMainProcess();
      updateSchema({
        field: 'mainProcess',
        componentProps: {
          options: mainProcessList,
        },
      });
    } catch (error) {
      console.error('获取主要制程报错：', error);
    }
  }
  /**
   *  更新角色列表
   * */
  async function updateRoleList() {
    if (!props.approverType) {
      console.error('请传入审批类型的code，code从字典获取');
      return;
    }
    try {
      const list = await getListDynamicTitles(
        {
          approverType: props.approverType,
        },
        'form',
      );
      resetSchemaRole(list);
    } catch (error) {
      console.error('配置角色列表报错：', error);
    }
  }

  /**
   * 审批组变更
   * @param data 审批组数据项
   * */
  async function handleAduitGroupChange(data) {
    resetFieldsRole();
    if (data) {
      const currentRole = {};
      (data.memberConfigs || []).forEach(item => {
        currentRole[item.configType] = item.memberIds;
      });
      setFieldsValueRole(currentRole);
    }
  }

  /**
   * 主要制程
   * @param data 主要制程数据项
   * */
  async function handleMainProcessChange(val) {
    resetFieldsRole();
    setFieldsValue({
      approverGroupId: '',
    });
    handleApproverGroupId(val);
  }
  // 动态更换项目组的审批参数
  function handleApproverGroupId(mainProcess?: string) {
    updateSchema({
      field: 'approverGroupId',
      componentProps: {
        params: {
          mainProcess: mainProcess || getFieldsValue().mainProcess,
          approverType: props.approverType,
        },
      },
    });
  }

  /**
   * 获取当前数据值
   * */
  function getValues() {
    return {
      ...getFieldsValue(),
      ...getFieldsValueRole(),
    };
  }

  // 对外可以调用的接口
  defineExpose({
    getValues,
    validateAll: async () => Promise.all([validate(), validateRole()]),
  });
</script>
