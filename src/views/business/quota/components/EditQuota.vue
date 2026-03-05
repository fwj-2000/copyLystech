<template>
  <!--  <BasicPopup v-bind="$attrs" @register="registerPopup" :title="title" class="full-popup">-->
  <a-spin :spinning="loading">
    <div class="content-box">
      <div style="width: 100%; overflow-x: hidden">
        <a-card>
          <a-form autocomplete="off" class="form-wrapper" :layout="'vertical'" ref="formRef" :rules="rules" :model="formState">
            <a-row class="row-margin" :gutter="[62]">
              <a-col :span="8">
                <a-form-item name="ApplyCode" label="报价需求单号">
                  <a-input v-model:value="formState.ApplyCode" disabled />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="ApplyUserName" label="申请人">
                  <a-input v-model:value="formState.ApplyUserName" disabled />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="ApplyDeptName" label="申请部门">
                  <a-input v-model:value="formState.ApplyDeptName" disabled />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="ApplyDate" label="申请日期">
                  <a-date-picker showTime value-format="YYYY/MM/DD HH:mm:ss" v-model:value="formState.ApplyDate" disabled />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="TerminalCustomerCode" label="终端客户代码">
                  <a-input disabled v-model:value="formState.TerminalCustomerCode" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="TerminalCustomerProjectCode" label="终端项目代码">
                  <a-input disabled v-model:value="formState.TerminalCustomerProjectCode" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="InsidePartNumber" label="产品内部料号">
                  <a-input v-model:value="formState.InsidePartNumber" disabled />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="ProjectLeader" label="项目负责人">
                  <lydc-custom-user-select v-model:value="formState.ProjectLeader" placeholder="请选择" :allowClear="true" show-search>
                  </lydc-custom-user-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="DrawingsReviewUserId" label="图纸评审人">
                  <!--                  <lydc-user-select v-model:value="formState.DrawingsReviewUserId" placeholder="选择人员" />-->
                  <lydc-custom-user-select v-model:value="formState.DrawingsReviewUserId" placeholder="请选择" :allowClear="true" show-search>
                  </lydc-custom-user-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="UrgencyLevel" label="紧急程度">
                  <!--                  <a-input v-model:value="formState.UrgencyLevel" />-->
                  <a-select v-model:value="formState.UrgencyLevel" placeholder="请选择紧急程度">
                    <a-select-option value="1">一般</a-select-option>
                    <a-select-option value="2">紧急</a-select-option>
                    <a-select-option value="3">特急</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="RequireDate" label="需求时间">
                  <a-date-picker value-format="YYYY/MM/DD" v-model:value="formState.RequireDate" />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item name="ExpectedProductionDate" label="预计量产日期">
                  <a-date-picker value-format="YYYY/MM/DD" v-model:value="formState.ExpectedProductionDate" />
                </a-form-item>
              </a-col>
              <!-- <a-col :span="8">
                <a-form-item name="TotalQty" label="项目总量(Kpcs)">
                  <a-input-number :step="1" :min="0" :precision="0" v-model:value="formState.TotalQty" />
                </a-form-item>
              </a-col> -->

              <!--      disable分界    -->
              <a-col :span="8">
                <a-form-item name="UnitQty" label="单位用量">
                  <a-input-number :step="1" :min="0" :precision="0" v-model:value="formState.UnitQty" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="Factory" label="工厂">
                  <lydc-select
                    placeholder="请选择工厂"
                    v-model:value="formState.Factory"
                    :options="FactoryList"
                    :fieldNames="{ label: 'Name', value: 'Code' }" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="TenderFactoryQty" label="招标壳厂数(家)">
                  <a-input-number :step="1" :min="0" :precision="0" v-model:value="formState.TenderFactoryQty" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="ProductionCycle" label="量产周期(月)">
                  <a-input-number :step="1" :min="0" :precision="0" v-model:value="formState.ProductionCycle" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="PeakQty" label="峰值数量(Kpcs)/月">
                  <a-input-number :step="1" :min="0" :precision="0" v-model:value="formState.PeakQty" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="PeakMonth" label="峰值月份">
                  <!--                  <a-input v-model:value="formState.PeakMonth" />-->
                  <a-range-picker v-model:value="formState.PeakMonth" picker="month" value-format="YYYY-MM" />
                </a-form-item>
              </a-col>

              <a-col :span="8">
                <a-form-item name="TerminalCustomerProjectStage" label="终端项目阶段">
                  <a-input v-model:value="formState.TerminalCustomerProjectStage" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="Factory" label="产品描述(标签信息)">
                  <a-input v-model:value="formState.Factory" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="ProductDesc" label="产品描述(标签信息)">
                  <a-input v-model:value="formState.ProductDesc" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="TerminalCustomerPartNumber" label="终端客户料号">
                  <a-input disabled v-model:value="formState.TerminalCustomerPartNumber" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="DesensitizedDrawingsName" label="脱敏图纸">
                  <a-input disabled v-model:value="formState.DesensitizedDrawingsName" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="LineRemark" label="行备注">
                  <a-input v-model:value="formState.LineRemark" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="Remark" label="备注">
                  <a-input v-model:value="formState.Remark" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item name="Status" label="状态">
                  <!--                  <a-input v-model:value="formState.Status" />-->
                  <a-select v-model:value="formState.Status" disabled placeholder="请选择状态">
                    <a-select-option value="1">未审核</a-select-option>
                    <a-select-option value="2">已审核</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </div>
    </div>
  </a-spin>
  <!--  </BasicPopup>-->
</template>
<script lang="ts" setup>
  import { defineEmits, defineProps, onMounted, reactive, ref, toRefs, toValue } from 'vue';
  import { getUserSettingInfo } from '/@/api/permission/userSetting';
  import { FormState } from '/@/views/basicData/productCodeApply/types';
  import dayjs from 'dayjs';
  import { useBaseStore } from '/@/store/modules/base';
  import { message } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { putQuotationRequirement } from '/@/api/business/quota';
  import { getFactoryList } from '/@/api/basicData/productCodeApply';

  const emits = defineEmits(['getDrawingList']);
  const props = defineProps(['descState']);
  const router = useRouter();

  // const [registerPopup] = usePopupInner(init);
  const baseStore = useBaseStore();

  const rules = {
    // ApplyReason: [{ required: true, message: '请选择申请原因!' }],
    // InsideProjectCode: [{ required: true, message: '请选择内部项目代码!' }],
    // TerminalCustomerCode: [{ required: true, message: '请选择终端客户代码!' }],
    // TerminalCustomerProjectCode: [{ required: true, message: '请输入终端项目代码!' }],
    // TerminalCustomerPartNumber: [{ required: true, message: '请输入终端客户料号!' }],
    // TerminalCustomerVersion: [{ required: true, message: '请输入终端客户版本号(终端开发阶段)!' }],
    // Config: [{ required: true, message: '请输入Config(产品结构、尺寸等)!' }],
    // ShipPattern: [{ required: true, message: '请选择出货形态!' }],
    // ProductDesc: [{ required: true, message: '请输入产品描述(标签信息)!' }],
    // ImmediateCustomerCode: [{ required: true, message: '请选择直接客户代码!' }],
    // Factory: [{ required: true, message: '请选择工厂!' }],
    // MainProcess: [{ required: true, message: '请选择主要制程!' }],
  };

  const activeKey = ref('1');
  const collapse = ref('1');

  const loading = ref<boolean>(false);
  const state = reactive({
    title: '单个申请',
    reasonTypeOption: [],
    directCustomerList: [],
    terminalCustomerList: [],
    statusTypes: [],
    FactoryList: [],
  });

  const formState = reactive<FormState>({
    ApplyUserId: '',
    ApplyDeptName: '',
    ApplyDate: '',
    TerminalCustomerCode: '',
    TerminalCustomerProjectCode: '',
    InsidePartNumber: null,
    ProjectLeader: null,
    UrgencyLevel: null,
    ShipPattern: '',
    ExpectedProductionDate: '',
    TotalQty: '',
    DosageMultiplier: '',
    TenderFactoryQty: null,
    ProductionCycle: '',
    Factory: '',
    PeakQty: null,
    PeakMonth: null,
    TerminalCustomerProjectStage: '',
    ProductDesc: '',
    TerminalCustomerPartNumber: '',
    DesensitizedDrawingsName: '',
    Remark: '',
  });
  const formRef = ref(null);
  const userInfo = ref({});

  const id = ref(0);

  // 初始化数据
  const getMessage = currentData => {
    loading.value = true;

    console.log(currentData.Id);
    setTimeout(() => {
      loading.value = false;
    }, 200);
    id.value = currentData.Id;
    console.log(currentData);
    console.log(6666);
    Object.assign(formState, {
      ...currentData,
      ExpiryDate: currentData.ExpiryDate && dayjs(currentData.ExpiryDate).format('YYYY/MM/DD'),
      RequireDate: currentData.RequireDate && dayjs(currentData.RequireDate).format('YYYY/MM/DD'),
      ApplyDate: currentData.ApplyDate && dayjs(currentData.ApplyDate).tz().format('YYYY/MM/DD HH:mm:ss'),
      ExpectedProductionDate: currentData.ExpectedProductionDate && dayjs(currentData.ExpectedProductionDate).format('YYYY/MM/DD'),
      ShipPattern: currentData.ShipPattern && dayjs(currentData.ShipPattern).format('YYYY/MM/DD'),
      PeakMonth: [currentData.PeakMonthFrom, currentData.PeakMonthTo],
    });
    console.log(formState);
  };

  const handleSaveAction = () => {
    const formVal = toValue(formRef);
    formVal.validate().then(async val => {
      loading.value = true;
      const userId = userInfo.value.id;
      val.ApplyUserId = userId;
      try {
        console.log(val);
        val.Id = id.value;
        val.PeakMonthFrom = val.PeakMonth[0];
        val.PeakMonthTo = val.PeakMonth[1];
        const res = await putQuotationRequirement(val);
        if (res.code === 200) {
          return message.success('保存成功');
          // router.push('/basicData/productCodeApply');
        }
      } finally {
        loading.value = false;
      }
    });
  };
  const getUserInfo = () => {
    getUserSettingInfo().then(res => {
      const { data } = res;
      userInfo.value = data;
    });
  };
  const getTypeOption = async () => {
    const factory = await getFactoryList();
    state.FactoryList = factory.data.map(item => ({ ...item, Name: `${item.Code}-${item.Name}` }));
    baseStore.getDictionaryData('PartNumberApplyReason').then(res => {
      state.reasonTypeOption = res;
    });
    baseStore.getDictionaryData('PartNumberApplyStatus').then(res => {
      state.statusTypes = res;
    });
  };
  onMounted(() => {
    getTypeOption();
    getUserInfo();
  });
  const { title, reasonTypeOption, terminalCustomerList, directCustomerList, FactoryList } = toRefs(state);
  defineExpose({
    getMessage,
    handleSaveAction,
  });
</script>
<style lang="less" scoped>
  .content-box {
    //padding: 10px 40px;
    height: calc(87vh - 60px);
    width: 100%;
    background: #ebeef5;
    overflow-y: scroll;
  }

  .bottom-box {
    position: relative;
    background: #fff;
    box-shadow: 0 -5px 15px -3px rgb(0 0 0 / 12%), 0 -5px 12px -3px rgb(0 0 0 / 15%), 0 -2px 4px -3px rgb(0 0 0 / 25%);
  }

  .bottom-submit {
    display: flex;
    bottom: 0;
    height: 66px;
    width: 100%;
    padding: 16px;
    flex-direction: row;
    justify-content: end;
  }

  .row-margin {
    margin-bottom: 10px;
  }

  .btn-not-primary {
    color: #ff7b00;
    border: 1px solid #ff7b00;
  }

  .title-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 16px;

    .modal-title {
      color: #1a1a1a;

      /* 中文/标题16 */

      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px; /* 150% */
    }
  }

  .upload-item {
    display: flex;
    flex-direction: column;
  }

  .upload-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .item-title {
    margin-bottom: 10px;
  }
</style>
