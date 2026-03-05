<script lang="ts" setup>
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getSchemas } from '/@/views/hrBis/writeSignature/config';
  import { useForm, BasicForm } from '/@/components/Form';
  import Signature from './components/Signature.vue';
  import { onMounted, reactive, ref, toRefs, h } from 'vue';
  import { getQueryParams } from '/@/views/hrBis/writeSignature/components/getQueryParams';
  import { postEmployeeFillInfo, getEmployeeFillInfo, getNewTemplateConfig } from '/@/api/hr/training/employee';
  import { dateUtil } from '/@/utils/dateUtil';
  import { CheckCircleFilled } from '@ant-design/icons-vue';
  import { CloseCircleFilled } from '@ant-design/icons-vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { Collapse, CollapseItem } from 'vant';
  import 'vant/lib/index.css';

  const { t } = useI18n();
  const { createMessage } = useMessage();
  const base64 = ref('');
  const step = ref<'1' | '2' | '3' | '4' | '5'>('1'); // '1': 表单 '2'：签名 '3'： 保存成功
  const saveLoading = ref(false);
  const activeName = ref('');
  const officeTrainContent = ref('');
  const workshopTrainContent = ref('');
  const teamLevelTrainContent = ref('');

  const [registerForm, { setFieldsValue, setProps, validate, resetFields }] = useForm({
    labelWidth: 100,
    schemas: getSchemas(),
    layout: 'horizontal',
  });

  onMounted(async () => {
    const { cacheKey } = getQueryParams();
    if (!cacheKey) return;

    try {
      step.value = '1';
      const { code, data } = await getEmployeeFillInfo({ cacheKey });
      if (code === 200) {
        if (data === '1011') {
          step.value = '5';
        } else {
          const formData = {
            ...data,
            employmentDate: data.employmentDate ? dateUtil(data.employmentDate) : undefined,
          };
          setFieldsValue(formData);
          if (data.handSignature) base64.value = data.handSignature;
          await getTemplateContentConfig(data.version);
        }
      }
    } catch (error) {
      step.value = '4';
    }
  });

  const getTemplateContentConfig = async version => {
    try {
      const r = await getNewTemplateConfig({
        version: version,
      });

      if (r.code == 200 && r.data) {
        officeTrainContent.value = r.data.officeTrainContent;
        workshopTrainContent.value = r.data.workshopTrainContent;
        teamLevelTrainContent.value = r.data.teamLevelTrainContent;
      }
    } catch (error) {
      createMessage.error('获取培训内容模板失败');
    }
  };

  function handleSubmit() {
    const { cacheKey } = getQueryParams();
    validate()
      .then(params => {
        if (!params) return;
        if (!base64.value) return createMessage.warning('请先签字');
        // createMessage.success('提交成功');
        saveLoading.value = true;
        postEmployeeFillInfo(cacheKey, {
          ...params,
          ValidityDateEnd: dateUtil(params.employmentDate).endOf('month').valueOf(),
          handSignature: base64.value,
        }).then(({ code, msg }) => {
          if (code == 200) {
            step.value = '3'; // 改为控制成功页面显示
            // createMessage.success(t('sys.api.operationSuccess'));
          }
        });
      })
      .finally(() => {
        saveLoading.value = false;
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
    {{ t('common.saveText') }}
  </a-button>
  <!-- <template #extra>
    <a-button type="primary" ghost @click="handleSubmit">确定 </a-button>
  </template> -->
  <a-card :loading="saveLoading" v-show="step == '1'">
    <template #title> 新员工培训 </template>
    <BasicForm @register="registerForm">
      <template #trainContent="{ model, field }">
        <div class="relative">
          <Collapse v-model="activeName" accordion>
            <CollapseItem title="办公培训" name="1"> {{ officeTrainContent }} </CollapseItem>
            <CollapseItem title="车间培训" name="2"> {{ workshopTrainContent }} </CollapseItem>
            <CollapseItem title="班组培训" name="3"> {{ teamLevelTrainContent }} </CollapseItem>
          </Collapse>
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
  <!-- 提交成功 -->
  <a-card v-if="step == '3'" class="success-page">
    <div class="success-container">
      <check-circle-filled class="success-icon" />
      <h2 class="success-title">信息提交成功</h2>
      <p class="success-text">感谢您的认真填写与付出！</p>
      <p class="success-tip">您现在可以安全关闭本页面</p>
    </div>
  </a-card>
  <!-- 错误提示页面 -->
  <a-card v-if="step === '4'" class="error-page">
    <div class="error-container">
      <CloseCircleFilled class="error-icon" />
      <h2 class="error-title">数据加载失败</h2>
      <p class="error-text">链接已提交数据或错误链接访问，请稍后再试</p>
      <p class="error-tip">如持续出现该问题，请联系HR文员</p>
    </div>
  </a-card>
  <a-card v-if="step == '5'" class="success-page">
    <div class="success-container">
      <check-circle-filled class="success-icon" />
      <h2 class="success-title">检测到信息已提交</h2>
      <p class="success-text">感谢您的时间与付出！</p>
      <p class="success-tip">您现在可以安全关闭本页面</p>
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
