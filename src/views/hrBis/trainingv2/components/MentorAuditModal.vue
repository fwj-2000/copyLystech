<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" :draggable="true" :width="620" showOkBtn @ok="handleSubmit">
    <!-- 新增的显示日期的 label -->
    <div style="margin-bottom: 12px; font-weight: bold; color: red; text-align: center"> 入职日期：{{ formattedDate }} </div>
    <BasicForm @register="registerForm" />
    <!-- 添加提示信息 -->
    <div class="form-footer">
      <span class="form-tip">
        <span class="chinese">审批提交前请先确保个人签名图片已存在。如果还没有，请在右上角用户->个人信息->个人签名处进行操作</span>
        <br />
        <span class="english"
          >Before submitting for approval, please ensure your personal signature image exists. If not, please go to the top right corner -> User -> Personal
          Information -> Personal Signature.</span
        >
      </span>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs';
  import { computed, reactive } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { mentorBatchAudit } from '/@/api/hr/training/employee';
  import { useI18n } from '/@/hooks/web/useI18n';

  interface State {
    dataForm: any;
  }

  // 新增接口定义
  interface TrainTimeModel {
    startTime: string;
    endTime: string;
  }

  const state = reactive<State>({
    dataForm: {
      dataList: [],
      joinDate: '',
    },
  });

  const { t } = useI18n();

  const schemas: FormSchema[] = [
    {
      component: 'Radio',
      componentProps: {
        options: [
          {
            fullName: t('common.passThroughText'),
            id: 1,
          },
          {
            fullName: t('common.notPassThroughText'),
            id: 0,
          },
        ],
      },
      field: 'auditResult',
      label: '审批结果',
    },
    {
      field: 'pickerVal',
      label: '培训时间',
      component: 'DateRange',
      componentProps: {
        format: 'YYYY-MM-DD HH:mm',
        placeholder: [t('component.lydc.dateRange.startPlaceholder'), t('component.lydc.dateRange.endPlaceholder')],
        width: '300px',
      },
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: t('common.selectPlaceholder'),
        maxlength: 200,
      },
      field: 'auditOpinion',
      label: t('dict.EmployeeTrainingColumn.auditOpinion'),
    },
  ];

  const getTitle = computed(() => t('common.mentorReviewText'));
  const emit = defineEmits(['register', 'reload']);
  const { createMessage } = useMessage();
  const [registerForm, { setFieldsValue, validate, resetFields, updateSchema }] = useForm({
    labelWidth: 100,
    schemas: schemas,
  });
  const [registerModal, { closeModal, changeOkLoading }] = useModalInner(init);

  function init(data) {
    resetFields();
    console.log(data);
    if (data.list) {
      state.dataForm.dataList = data.list;
    } else {
      state.dataForm.dataList = [];
    }
    if (data.date) {
      state.dataForm.joinDate = data.date;
    }
  }

  // 使用 dayjs 转换时间戳为 'YYYY-MM-DD' 格式
  const formattedDate = computed(() => {
    return dayjs(state.dataForm.joinDate).format('YYYY-MM-DD');
  });

  //提交
  async function handleSubmit() {
    const values = await validate();
    if (!values) return;
    changeOkLoading(true);

    const [startTrainTime, endTrainTime] = values?.pickerVal ?? [dayjs(), dayjs()];

    const trainTimeModels: TrainTimeModel[] = [];

    console.log(startTrainTime, endTrainTime);

    trainTimeModels.push({
      startTime: startTrainTime, // 为时间戳
      endTime: endTrainTime,
    });

    const query = {
      ...values,
      employeeTrainIds: state.dataForm.dataList,
      trainTimeModels: trainTimeModels,
    };

    const formMethod = mentorBatchAudit;
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
</script>
<style scoped>
  .form-footer {
    margin-top: 16px; /* 调整与表单的间距 */
    text-align: center;
  }

  .form-tip {
    font-size: 13px;
    color: #888;
  }

  .chinese,
  .english {
    margin-right: 10px;
  }
</style>
