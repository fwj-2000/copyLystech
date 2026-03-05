<script lang="ts" setup>
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getMentorAuditSchemas } from '/@/views/hrBis/writeSignature/config';
  import { useForm, BasicForm } from '/@/components/Form';
  import Signature from './components/Signature.vue';
  import { onMounted, reactive, ref, toRefs, h, watch } from 'vue';
  import { getQueryParams } from '/@/views/hrBis/writeSignature/components/getQueryParams';
  import { getPendingAuditEmployee, postSubmitMentorAudit } from '/@/api/hr/training/employee';
  import { dateUtil } from '/@/utils/dateUtil';
  import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons-vue';

  import {
    Checkbox as VanCheckbox,
    CheckboxGroup as VanCheckboxGroup,
    Divider as VanDivider,
    DatePicker as VanDatePicker,
    Field as VanField,
    Popup as VanPopup,
    TimePicker as VanTimePicker,
  } from 'vant';

  import 'vant/lib/index.css';
  import { useI18n } from '/@/hooks/web/useI18n';

  // 新增接口定义
  interface TrainTimeModel {
    startTime: string;
    endTime: string;
  }

  const { createMessage } = useMessage();

  const ifShowSignature = ref(false);
  const base64 = ref('');
  const step = ref<'1' | '2' | '3' | '4'>('1'); // '1': 表单 '2'：签名 '3'： 保存成功
  const auditTypeName = ref('');
  const enterDateStr = ref('');
  const employeeCheckGroup = ref(null);
  const { t } = useI18n();

  const pickerDateValue = ref(dateUtil().format('YYYY-MM-DD').split('-'));
  const pickerTimeValue = ref(dateUtil().format('HH:mm').split(':'));

  // 第一轮培训
  const firstTrainRoundStartDateShowPicker = ref(false); // 开始日期选择器
  const firstTrainRoundEndDateShowPicker = ref(false); // 结束日期选择器
  const firstTrainRoundStartTimeShowPicker = ref(false); // 开始时间选择器
  const firstTrainRoundEndTimeShowPicker = ref(false); // 结束时间选择器
  const firstTrainRoundStartDateResult = ref(''); // 开始日期
  const firstTrainRoundEndDateResult = ref(''); // 结束日期
  const firstTrainRoundStartTimeResult = ref(''); // 开始时间
  const firstTrainRoundEndTimeResult = ref(''); // 结束时间
  // 开始日期选择器 确认事件
  const firstTrainRoundStartDateConfirm = ({ selectedValues }) => {
    firstTrainRoundStartDateResult.value = selectedValues.join('/');
    // 如果结束日期为空，可以默认等于开始日期
    if (firstTrainRoundEndDateResult.value === '') {
      firstTrainRoundEndDateResult.value = selectedValues.join('/');
    }
    firstTrainRoundStartDateShowPicker.value = false;
  };
  // 结束日期选择器 确认事件
  const firstTrainRoundEndDateConfirm = ({ selectedValues }) => {
    firstTrainRoundEndDateResult.value = selectedValues.join('/');
    firstTrainRoundEndDateShowPicker.value = false;
  };
  // 开始时间 确认事件
  const firstTrainRoundStartTimeConfirm = ({ selectedValues }) => {
    firstTrainRoundStartTimeResult.value = selectedValues.join(':');
    firstTrainRoundStartTimeShowPicker.value = false;
  };
  // 结束时间 确认事件
  const firstTrainRoundEndTimeConfirm = ({ selectedValues }) => {
    firstTrainRoundEndTimeResult.value = selectedValues.join(':');
    firstTrainRoundEndTimeShowPicker.value = false;
  };

  // 第二轮培训
  const secondTrainRoundStartDateShowPicker = ref(false);
  const secondTrainRoundEndDateShowPicker = ref(false);
  const secondTrainRoundStartTimeShowPicker = ref(false);
  const secondTrainRoundEndTimeShowPicker = ref(false);
  const secondTrainRoundStartDateResult = ref('');
  const secondTrainRoundEndDateResult = ref('');
  const secondTrainRoundStartTimeResult = ref('');
  const secondTrainRoundEndTimeResult = ref('');
  // 开始日期选择器 确认事件
  const secondTrainRoundStartDateConfirm = ({ selectedValues }) => {
    secondTrainRoundStartDateResult.value = selectedValues.join('/');
    // 如果结束日期为空，可以默认等于开始日期
    if (secondTrainRoundEndDateResult.value === '') {
      secondTrainRoundEndDateResult.value = selectedValues.join('/');
    }
    secondTrainRoundStartDateShowPicker.value = false;
  };
  // 结束日期选择器 确认事件
  const secondTrainRoundEndDateConfirm = ({ selectedValues }) => {
    secondTrainRoundStartDateResult.value = selectedValues.join('/');
    // 如果结束日期为空，可以默认等于开始日期
    if (secondTrainRoundEndDateResult.value === '') {
      secondTrainRoundEndDateResult.value = selectedValues.join('/');
    }
    secondTrainRoundStartDateShowPicker.value = false;
  };
  // 开始时间 确认事件
  const secondTrainRoundStartTimeConfirm = ({ selectedValues }) => {
    secondTrainRoundStartTimeResult.value = selectedValues.join(':');
    secondTrainRoundStartTimeShowPicker.value = false;
  };
  // 结束时间 确认事件
  const secondTrainRoundEndTimeConfirm = ({ selectedValues }) => {
    secondTrainRoundEndTimeResult.value = selectedValues.join(':');
    secondTrainRoundEndTimeShowPicker.value = false;
  };

  const auditTypeMap = {
    1: '办公培训',
    2: '车间培训',
    3: '班组培训',
  } as const;

  const [registerForm, { setFieldsValue, setProps, validate, resetFields }] = useForm({
    labelWidth: 100,
    schemas: getMentorAuditSchemas(),
    layout: 'horizontal',
  });

  interface EmployeeCheckItem {
    id: number; // 确保id为number类型
    fullName: string;
  }

  const employeeIsCheckAll = ref(false);
  const employeeCheckedResult = ref([]);
  const employeeIsIndeterminate = ref(true);
  const employeeTrainTotalCount = ref(0);
  const pendingAuditCount = ref(0);

  const employeePendingTrainList = ref<EmployeeCheckItem[]>([]);

  const initOrRefresh = async () => {
    const { cacheKey } = getQueryParams();
    if (!cacheKey) return;

    try {
      const { code, data } = await getPendingAuditEmployee({ cacheKey });
      if (code === 200) {
        const formData = {
          ...data,
        };
        // 转换复选框选项
        const checkboxOptions = data.pendingAuditEmployeeInfos.map(item => ({
          fullName: item.employeeName,
          id: item.id,
        }));
        employeePendingTrainList.value = checkboxOptions;

        if (data.auditEmployeeTotal) {
          employeeTrainTotalCount.value = data.auditEmployeeTotal;
        }

        if (data.pendingAuditEmployeeCount) {
          pendingAuditCount.value = data.pendingAuditEmployeeCount;
        }

        const needSecondTrain = data.auditType === 3;
        if (data.auditType) {
          auditTypeName.value = auditTypeMap[data.auditType] || '未知培训类型';
        }

        if (data.enterDate) {
          enterDateStr.value = dateUtil(data.enterDate).format('YYYY-MM-DD');
        }

        // 动态更新表单配置
        setProps({
          schemas: getMentorAuditSchemas(needSecondTrain), // 传入转换后的选项
        });
        console.log(formData);
        setFieldsValue(formData);
      }
    } catch (error) {
      //createMessage.error('获取审批数据失败');
      step.value = '4';
    }
  };

  onMounted(async () => {
    await initOrRefresh();
  });

  // 全选处理逻辑调整
  const handleCheckAll = (val: boolean) => {
    employeeCheckedResult.value = val ? employeePendingTrainList.value.map(item => item.id) : [];
    employeeIsIndeterminate.value = false;
  };

  const handleCheckedEmployeeChange = (value: string[]) => {
    const checkedCount = value.length;
    employeeIsCheckAll.value = checkedCount === employeePendingTrainList.value.length;
    employeeIsIndeterminate.value = checkedCount > 0 && checkedCount < employeePendingTrainList.value.length;
  };

  function handleSubmit() {
    const { cacheKey } = getQueryParams();
    validate().then(params => {
      if (!params) return;
      if (!base64.value) return createMessage.warning('请先签字');
      if (employeeCheckedResult.value.length === 0) return createMessage.warning('请选择员工');
      // 组装培训时间
      const trainTimeModels: TrainTimeModel[] = [];
      // 处理第一组时间（必填）
      if (
        firstTrainRoundStartDateResult.value &&
        firstTrainRoundEndDateResult.value &&
        firstTrainRoundStartTimeResult.value &&
        firstTrainRoundEndTimeResult.value
      ) {
        const [startYear, startMonth, startDay] = firstTrainRoundStartDateResult.value.split('/');
        const [startHour, startMinute] = firstTrainRoundStartTimeResult.value.split(':');
        const startStr = `${startYear}-${startMonth}-${startDay} ${startHour}:${startMinute}:00`;
        const [endYear, endMonth, endDay] = firstTrainRoundEndDateResult.value.split('/');
        const [endHour, endMinute] = firstTrainRoundEndTimeResult.value.split(':');
        const endStr = `${endYear}-${endMonth}-${endDay} ${endHour}:${endMinute}:00`;

        // 转换为时间戳进行比较
        const startTimestamp = new Date(startStr).getTime();
        const endTimestamp = new Date(endStr).getTime();

        // 有效性校验（防止无效日期）
        if (Number.isNaN(startTimestamp) || Number.isNaN(endTimestamp)) {
          return createMessage.error('存在无效日期');
        }

        // 时间顺序校验
        if (startTimestamp >= endTimestamp) {
          return createMessage.error('开始时间大于结束时间');
        }

        trainTimeModels.push({
          startTime: startStr, // 转换为时间戳
          endTime: endStr,
        });
      } else {
        return createMessage.error('1轮培训时间未填写完整');
      }
      // 处理第二组时间
      if (
        secondTrainRoundStartDateResult.value ||
        secondTrainRoundEndDateResult.value ||
        secondTrainRoundStartTimeResult.value ||
        secondTrainRoundEndTimeResult.value
      ) {
        if (
          secondTrainRoundStartDateResult.value &&
          secondTrainRoundEndDateResult.value &&
          secondTrainRoundStartTimeResult.value &&
          secondTrainRoundEndTimeResult.value
        ) {
          const [startYear, startMonth, startDay] = secondTrainRoundStartDateResult.value.split('/');
          const [startHour, startMinute] = secondTrainRoundStartTimeResult.value.split(':');
          const startStr = `${startYear}-${startMonth}-${startDay} ${startHour}:${startMinute}:00`;
          const [endYear, endMonth, endDay] = secondTrainRoundEndDateResult.value.split('/');
          const [endHour, endMinute] = secondTrainRoundEndTimeResult.value.split(':');
          const endStr = `${endYear}-${endMonth}-${endDay} ${endHour}:${endMinute}:00`;

          // 转换为时间戳进行比较
          const startTimestamp = new Date(startStr).getTime();
          const endTimestamp = new Date(endStr).getTime();

          // 有效性校验（防止无效日期）
          if (Number.isNaN(startTimestamp) || Number.isNaN(endTimestamp)) {
            return createMessage.error('存在无效日期');
          }

          // 时间顺序校验
          if (startTimestamp >= endTimestamp) {
            return createMessage.error('开始时间大于结束时间');
          }
          trainTimeModels.push({
            startTime: startStr, // 转换为时间戳
            endTime: endStr,
          });
        } else {
          return createMessage.error('2轮培训时间未填写完整');
        }
      }

      postSubmitMentorAudit(cacheKey, {
        ...params,
        employeeTrainIds: employeeCheckedResult.value,
        trainTimeModels: trainTimeModels,
        handSignature: base64.value,
      }).then(({ code, msg }) => {
        if (code == 200) {
          step.value = '3'; // 改为控制成功页面显示
          return;
        }
      });
    });
  }

  // 打开签名
  function handleShowSignature() {
    step.value = '2';
  }

  // 关闭签名
  function handleCloseSignature() {
    step.value = '1';
  }

  function handleSignatureSubmit(base64Str) {
    base64.value = base64Str;
  }
</script>

<template>
  <a-button :loading="saveLoading" v-show="step == '1'" class="fixed-submit-btn" type="primary" ghost @click="handleSubmit">
    {{ t('common.submit') }}
  </a-button>
  <a-card v-show="step == '1'">
    <template #title> 新员工培训导师签审 - {{ auditTypeName }} </template>
    <!-- <template #extra>
      <a-button type="primary" ghost @click="handleSubmit">确定 </a-button>
    </template> -->
    <p>注意：本批次学员的入职日期为：{{ enterDateStr }}</p>
    <p
      >当前签审进度[待签审/(总培训-已签审)]：<span style="color: #52c41a; font-weight: 600">{{ pendingAuditCount }}</span
      ><span style="color: #666">/{{ employeeTrainTotalCount }}</span></p
    >
    <BasicForm @register="registerForm">
      <template #employeeCheckAll="{ model, field }">
        <div>
          <!-- 全选复选框 -->
          <van-checkbox v-model="employeeIsCheckAll" :indeterminate="employeeIsIndeterminate" @change="handleCheckAll"> 全选 </van-checkbox>
          <van-divider />
          <van-checkbox-group
            style="padding-top: 5px"
            v-model="employeeCheckedResult"
            @change="handleCheckedEmployeeChange"
            direction="horizontal"
            shape="square">
            <van-checkbox style="margin-top: 0.5rem" v-for="item in employeePendingTrainList" :key="item.id" :name="item.id">
              {{ item.fullName }}
            </van-checkbox>
          </van-checkbox-group>
        </div>
      </template>
      <template #firstRoundTrain="{ model, field }">
        <div>
          <van-field
            v-model="firstTrainRoundStartDateResult"
            required
            is-link
            readonly
            name="firstStartDatePicker"
            label="开始日期"
            placeholder="点击选择日期"
            @click="firstTrainRoundStartDateShowPicker = true" />
          <van-popup v-model:show="firstTrainRoundStartDateShowPicker" destroy-on-close position="bottom">
            <van-date-picker :model-value="pickerDateValue" @confirm="firstTrainRoundStartDateConfirm" @cancel="firstTrainRoundStartDateShowPicker = false" />
          </van-popup>
          <van-field
            v-model="firstTrainRoundStartTimeResult"
            required
            is-link
            readonly
            name="firstDateStartTimePicker"
            label="开始时间"
            placeholder="点击选择时间"
            @click="firstTrainRoundStartTimeShowPicker = true" />
          <van-popup v-model:show="firstTrainRoundStartTimeShowPicker" destroy-on-close position="bottom">
            <van-time-picker :model-value="pickerTimeValue" @confirm="firstTrainRoundStartTimeConfirm" @cancel="firstTrainRoundStartTimeShowPicker = false" />
          </van-popup>
          <van-field
            v-model="firstTrainRoundEndDateResult"
            required
            is-link
            readonly
            name="firstEndDatePicker"
            label="结束日期"
            placeholder="点击选择日期"
            @click="firstTrainRoundEndDateShowPicker = true" />
          <van-popup v-model:show="firstTrainRoundEndDateShowPicker" destroy-on-close position="bottom">
            <van-date-picker :model-value="pickerDateValue" @confirm="firstTrainRoundEndDateConfirm" @cancel="firstTrainRoundEndDateShowPicker = false" />
          </van-popup>
          <van-field
            v-model="firstTrainRoundEndTimeResult"
            required
            is-link
            readonly
            name="firstDateEndTimePicker"
            label="结束时间"
            placeholder="点击选择时间"
            @click="firstTrainRoundEndTimeShowPicker = true" />
          <van-popup v-model:show="firstTrainRoundEndTimeShowPicker" destroy-on-close position="bottom">
            <van-time-picker :model-value="pickerTimeValue" @confirm="firstTrainRoundEndTimeConfirm" @cancel="firstTrainRoundEndTimeShowPicker = false" />
          </van-popup>
        </div>
      </template>
      <template #secondRoundTrain="{ model, field }">
        <div>
          <van-field
            v-model="secondTrainRoundStartDateResult"
            required
            is-link
            readonly
            name="secondStartDatePicker"
            label="开始日期"
            placeholder="点击选择日期"
            @click="secondTrainRoundStartDateShowPicker = true" />
          <van-popup v-model:show="secondTrainRoundStartDateShowPicker" destroy-on-close position="bottom">
            <van-date-picker :model-value="pickerDateValue" @confirm="secondTrainRoundStartDateConfirm" @cancel="secondTrainRoundStartDateShowPicker = false" />
          </van-popup>
          <van-field
            v-model="secondTrainRoundStartTimeResult"
            required
            is-link
            readonly
            name="secondDateStartTimePicker"
            label="开始时间"
            placeholder="点击选择时间"
            @click="secondTrainRoundStartTimeShowPicker = true" />
          <van-popup v-model:show="secondTrainRoundStartTimeShowPicker" destroy-on-close position="bottom">
            <van-time-picker :model-value="pickerTimeValue" @confirm="secondTrainRoundStartTimeConfirm" @cancel="secondTrainRoundStartTimeShowPicker = false" />
          </van-popup>
          <van-field
            v-model="secondTrainRoundEndDateResult"
            required
            is-link
            readonly
            name="secondEndDatePicker"
            label="结束日期"
            placeholder="点击选择日期"
            @click="secondTrainRoundEndDateShowPicker = true" />
          <van-popup v-model:show="secondTrainRoundEndDateShowPicker" destroy-on-close position="bottom">
            <van-date-picker :model-value="pickerDateValue" @confirm="secondTrainRoundEndDateConfirm" @cancel="secondTrainRoundEndDateShowPicker = false" />
          </van-popup>
          <van-field
            v-model="secondTrainRoundEndTimeResult"
            required
            is-link
            readonly
            name="secondDateEndTimePicker"
            label="结束时间"
            placeholder="点击选择时间"
            @click="secondTrainRoundEndTimeShowPicker = true" />
          <van-popup v-model:show="secondTrainRoundEndTimeShowPicker" destroy-on-close position="bottom">
            <van-time-picker :model-value="pickerTimeValue" @confirm="secondTrainRoundEndTimeConfirm" @cancel="secondTrainRoundEndTimeShowPicker = false" />
          </van-popup>
        </div>
      </template>
      <template #signature="{ model, field }">
        <div class="relative" @click="handleShowSignature">
          <div v-if="!base64" class="h-50px w-full">请点击这里，进行签字 </div>
          <div v-else class="h-50px rotate-90 absolute left-[23%]" style="translate: -50% -50%">
            <img style="height: 230px" :src="base64" />
          </div>
        </div>
      </template>
    </BasicForm>
  </a-card>
  <template v-motion-slide-bottom v-if="step == '2'">
    <Signature @submit="handleSignatureSubmit" @close="handleCloseSignature" />
  </template>
  <a-card v-if="step == '3'" class="success-page">
    <div class="success-container">
      <check-circle-filled class="success-icon" />
      <h2 class="success-title">信息提交成功</h2>
      <p class="success-text">感谢您的认真签审与付出！</p>
      <p class="success-tip">您现在可以安全关闭本页面</p>
    </div>
  </a-card>
  <!-- 错误提示页面 -->
  <a-card v-if="step === '4'" class="error-page">
    <div class="error-container">
      <CloseCircleFilled class="error-icon" />
      <h2 class="error-title">数据加载失败</h2>
      <p class="error-text">链接已失效或错误链接访问，请稍后再试</p>
      <p class="error-tip">如持续出现该问题，请联系HR文员</p>
    </div>
  </a-card>
</template>

<style lang="less" scoped>
  .tem-container {
    background: @app-main-background;
    overflow: auto;
    position: relative;
    padding: 0;

    .signs {
      position: absolute;
      right: 10px;
      top: 70px;

      &.print {
        top: 20px;
      }
    }

    .tem_list {
      width: 800px;
      margin: 0 auto;
      background: @component-background;
      color: @text-color-label;
      position: relative;
      padding: 0 40px 15px;
      font-size: 12px;
    }

    h1 {
      padding-top: 36px;
      font-size: 24px;
    }

    h2 {
      font-size: 18px;
    }

    h1,
    h2 {
      text-align: center;
      color: @text-color-label;
      font-weight: 700;
    }

    .title {
      border-bottom: 2px dashed #000;
      padding-left: 30px;
      line-height: 30px;
      font-size: 12px;
    }

    .lip {
      padding: 20px 0;
    }

    .table-box {
      padding: 0 1px 0 0;
    }

    .demo-form-inline {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .temdate {
      text-align: right;
      margin: 20px 60px;
    }

    .seal {
      text-align: right;
      margin: 10px 120px;
      padding-bottom: 40px;
    }

    .sigbut {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: @text-color-label;
      padding: 8px;
      border: 1px solid @border-color-base1;
      border-top: 0;

      .left-bu {
        display: flex;
        align-items: center;

        .clear-bu,
        .sure {
          margin-left: 5px;
        }
      }
    }

    .online-sig {
      border: 1px solid @border-color-base1;
      border-top: 0;
      height: 150px;
      padding-top: 10px;
    }

    :deep(.form-required) {
      & > div > div > label::before {
        display: inline-block;
        margin-inline-end: 4px;
        color: #ed6f6f;
        font-size: 14px;
        font-family: SimSun, sans-serif;
        line-height: 1;
        content: '*';
      }
    }
  }

  .fixed-submit-btn {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 999;
    box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

    // 适配移动端
    @media (max-width: 768px) {
      right: 30px;
      top: 16px;
      padding: 5px 16px;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px -8px rgb(0 0 0 / 16%), 0 9px 28px 0 rgb(0 0 0 / 12%), 0 12px 48px 16px rgb(0 0 0 / 9%);
    }
  }

  .rotate-90 {
    transform: rotate(-90deg);
    transition: all 0.35s ease;
  }

  .success-page {
    text-align: center;

    :deep(.ant-card-body) {
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .success-container {
    padding: 40px 0;

    .success-icon {
      font-size: 80px;
      color: #52c41a;
      margin-bottom: 24px;
    }

    .success-title {
      font-size: 28px;
      color: @text-color;
      margin-bottom: 16px;
    }

    .success-text {
      font-size: 16px;
      color: @text-color-secondary;
      margin-bottom: 8px;
    }

    .success-tip {
      font-size: 14px;
      color: @text-color-secondary;
      opacity: 0.8;
    }
  }

  .error-page {
    text-align: center;

    :deep(.ant-card-body) {
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .error-container {
    padding: 40px 0;

    .error-icon {
      font-size: 80px;
      color: #ff4d4f;
      margin-bottom: 24px;
    }

    .error-title {
      font-size: 28px;
      color: @text-color;
      margin-bottom: 16px;
    }

    .error-text {
      font-size: 16px;
      color: @text-color-secondary;
      margin-bottom: 8px;
    }

    .error-tip {
      font-size: 14px;
      color: @text-color-secondary;
      opacity: 0.8;
    }
  }
</style>
