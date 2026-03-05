<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="false"
    :title="title"
    @open-change="handleVisibleChange"
    destroyOnClose
    class="full-popup top-0 ly-filing-detail">
    <template #insertToolbar>
      <div class="toggle-current flex" v-if="state.Ids.length > 1">
        <a-button preIcon="icon-ym icon-ym-left" @click="handlePrev" :disabled="state.currentIndex === 0"></a-button>
        <div class="state-box m-2">
          <span style="color: rgb(255 123 0 / var(--tw-bg-opacity))">{{ state.currentIndex + 1 }}</span> / {{ state.Ids.length }}
        </div>
        <a-button preIcon="icon-ym icon-ym-right" @click="handleNext" :disabled="state.currentIndex === state.Ids.length - 1"></a-button>
      </div>
    </template>
    <ScrollContainer style="background: #ebeef5">
      <Card>
        <template #title>
          <div>{{ t('common.baseinfo') }}</div>
        </template>
        <BasicForm @register="registerBaseInfoForm"></BasicForm>
      </Card>
      <div style="display: flex; gap: 12px; padding: 12px 0">
        <Card class="flex-1">
          <template #title> {{ t('dict.EmployeeTrain.MentorAuditText') }} </template>
          <BasicTable @register="registerMentorAuditTable" :data-source="state.base.mentorAuditInfos">
            <template #bodyCell="{ column, index }">
              <template v-if="column.compType == 'img'">
                <a-image
                  class="rotate-90"
                  v-if="state.base.mentorAuditInfos[index][column.dataIndex]"
                  :width="50"
                  :height="100"
                  :src="state.base.mentorAuditInfos[index][column.dataIndex]"
                  :preview="false"
                  object-fit="cover"
                  loading="lazy"></a-image>
                <span v-else>未上传</span>
              </template>
            </template>
          </BasicTable>
        </Card>
      </div>
      <div class="ly-filing-detail-footer" v-if="canEditable">
        <div class="footer-flex">
          <div>
            <a-form>
              <div class="flex justify-between gap-3">
                <a-form-item label="审批是否通过" required>
                  <a-radio-group v-model:value="state.submit.auditStatus" :disabled="!canEditable">
                    <a-radio value="0">{{ t('status.no') }}</a-radio>
                    <a-radio value="1">{{ t('status.yes') }}</a-radio>
                    <a-radio value="2">{{ '全通过' }}</a-radio>
                  </a-radio-group>
                </a-form-item>
              </div>
              <div class="flex justify-between" v-show="state.submit.auditStatus == '0'">
                <a-form-item label="退回类型" required>
                  <a-radio-group v-model:value="state.submit.rollbackType" :disabled="!canEditable">
                    <a-radio value="1">{{ '重签节点' }}</a-radio>
                    <a-radio value="2">{{ '重走审批' }}</a-radio>
                  </a-radio-group>
                </a-form-item>
              </div>
              <div class="flex justify-between" v-show="state.submit.auditStatus == '0'">
                <a-form-item label="退回节点" required style="width: 500px">
                  <a-radio-group v-model:value="state.submit.rollbackNode" button-style="solid" :disabled="!canEditable">
                    <a-radio-button value="1">{{ '员工签审' }}</a-radio-button>
                    <a-radio-button value="2">{{ '办公签审' }}</a-radio-button>
                    <a-radio-button value="3">{{ '车间签审' }}</a-radio-button>
                    <a-radio-button value="4">{{ '班组签审' }}</a-radio-button>
                  </a-radio-group>
                </a-form-item>
              </div>
              <a-form-item label="审批意见">
                <a-textarea v-model:value="state.submit.auditOpinion" :disabled="!canEditable" :cols="100" :rows="1"></a-textarea>
              </a-form-item>
            </a-form>
          </div>
          <div>
            <a-button class="ml-2" @click="handleCancel">{{ t('common.cancel') }}</a-button>
            <a-button class="ml-2" :disabled="state.loading" @click="handleSave" type="primary">{{ t('common.submit') }}</a-button>
          </div>
        </div>
      </div>
    </ScrollContainer>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, ref, computed } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getTrainAndAuditDetails, postHrAudit } from '/@/api/hr/training/employee';
  import { BasicTable, useTable, ActionItem, TableAction } from '/@/components/Table';
  import { ScrollContainer } from '/@/components/Container';
  import { message, Descriptions } from 'ant-design-vue';
  import Card from './Card.vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { BasicForm, useForm } from '/@/components/Form';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useBaseStore } from '/@/store/modules/base';

  const baseStore = useBaseStore();

  const { hasBtnP } = usePermission();

  const emits = defineEmits(['register', 'refresh']);

  const employeeSignImgBse64 = ref('');

  interface State {
    type: 'view' | 'add' | 'edit';
    currentIndex: number;
    base: any;
    Id: string;
    Ids: string[];
    qid: string;
    role: string;
    title: string;
    submit: {
      auditStatus: '0' | '1' | '2';
      auditOpinion: string;
      rollbackType: '1' | '2';
      rollbackNode: '1' | '2' | '3' | '4';
    };
    opsList: [
      {
        value: 0;
        label: '不同意';
      },
      {
        value: 1;
        label: '同意';
      },
    ];
    language: string | number;
    loading: boolean;
    langList: any[];
  }

  const { t } = useI18n();
  const state = reactive<State>({
    Id: '',
    currentIndex: 0,
    Ids: [],
    qid: '',
    title: '',
    type: 'add',
    role: '',
    base: {},
    submit: {
      auditStatus: '1',
      auditOpinion: '',
      rollbackType: '1',
      rollbackNode: '1',
    },
    opsList: [
      {
        value: 0,
        label: '不同意',
      },
      {
        value: 1,
        label: '同意',
      },
    ],
    language: 1,
    loading: false,
    langList: [],
  });

  const globSetting = useGlobSetting();

  const canEditable = computed(() => {
    return state.type === 'edit' || state.type === 'add';
  });

  const { title } = toRefs(state);

  const { createMessage } = useMessage();

  // 培训信息主数据
  const employeeTrainFormConfig: any[] = [
    {
      label: '员工工号:',
      field: 'trainerWorkNo',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '员工姓名:',
      field: 'trainerName',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '档案分组：',
      field: 'recordGrouping',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '厂区：',
      field: 'factoryName',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '入职日期：',
      field: 'employmentDate',
      component: 'DatePicker',
      componentProps: {
        placeholder: '',
        disabled: true,
        // format: 'date|YYYY-MM-DD HH:MM:SS',
        format: 'YYYY-MM-DD',
      },
    },
    {
      label: '打卡班次：',
      field: 'attendanceShift',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '办公培训负责人：',
      field: 'officeTrainingMentorName',
      component: 'Input',
      i18nField: 'officeTrainingCoordinatorName',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '车间培训负责人：',
      field: 'workshopTrainingMentorName',
      component: 'Input',
      i18nField: 'workshopTrainingCoordinatorName',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '班组培训负责人：',
      field: 'teamLevelTrainingMentorName',
      i18nField: 'teamLevelTrainingCoordinatorName',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '导入创建人：',
      field: 'creatorName',
      i18nField: 'creator',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
  ];

  // 员工签审信息
  const employeeAuditFormConfig: any[] = [
    {
      label: t('dict.EmployeeTrain.WorkNoAndNameText'),
      field: 'employeeName',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: t('common.sexText'),
      field: 'employeeSexDesc',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: t('common.BirthdateText'),
      field: 'employeeBirthday',
      component: 'DatePicker',
      componentProps: {
        placeholder: '',
        disabled: true,
        format: 'YYYY-MM-DD',
      },
    },
    {
      label: t('dict.EmployeeTrainingColumn.employmentDate'),
      field: 'employeeEntryDay',
      component: 'DatePicker',
      componentProps: {
        placeholder: '',
        disabled: true,
        format: 'YYYY-MM-DD',
      },
    },
    {
      label: t('dict.DepartmentColumn'),
      field: 'employeeDepartment',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: t('dict.EmployeeTrain.NatureOfWorkText'),
      field: 'natureOfWork',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: t('dict.EmployeeTrain.PreviousJobText'),
      field: 'previousJob',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: t('dict.EmployeeTrain.TechnicalTitleText'),
      field: 'technicalTitleLevel',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: t('formGenerator.component.sign'),
      field: 'ApplyDate',
      component: 'DatePicker',
      slot: 'signature',
      componentProps: {
        placeholder: '',
        disabled: true,
        // format: 'date|YYYY-MM-DD HH:MM:SS',
        format: 'YYYY-MM-DD HH:mm:ss',
      },
    },
  ];

  const mentorAuditTableColumn: any[] = [
    {
      title: '审批人',
      dataIndex: 'mentorName',
      width: 140,
    },
    {
      title: '审批类型',
      dataIndex: 'auditTypeDesc',
      width: 100,
    },
    {
      title: '审批结果',
      dataIndex: 'auditStatusDesc',
      width: 80,
    },
    {
      title: '培训时间1',
      dataIndex: 'trainTime1',
      width: 180,
    },
    {
      title: '培训时间2',
      dataIndex: 'trainTime2',
      width: 180,
    },
    {
      title: '审批意见',
      dataIndex: 'auditOpinion',
      width: 140,
    },
    {
      title: '审批时间',
      dataIndex: 'auditedTime',
      width: 100,
      format: 'date|YYYY-MM-DD HH:mm:ss',
    },
    {
      title: '手签',
      dataIndex: 'handSignature',
      width: 120,
      compType: 'img',
    },
  ];

  const [registerMentorAuditTable] = useTable({
    columns: mentorAuditTableColumn,
    i18nConfig: {
      moduleCode: 'EmployeeTrainingColumn',
    },
    useSearchForm: false,
    ellipsis: true,
    canResize: false,
    pagination: false,
    showTableSetting: false,
  });

  const [registerPopup, { closePopup, changeOkLoading, changeLoading }] = usePopupInner(init);
  const [registerBaseInfoForm, { setFieldsValue: setFilingFieldsValue, updateSchema }] = useForm({
    schemas: employeeTrainFormConfig,
    i18nConfig: {
      moduleCode: 'EmployeeTrainingColumn',
      transferRange: ['label'],
    },
    layout: 'vertical',
    labelWidth: 140,
    baseColProps: {
      span: 4,
    },
    baseRowStyle: {
      'margin-left': '4px',
      'margin-right': '4px',
    },
  });
  const [registerEmployeeSubmitInfoForm, { setFieldsValue: setEmployeeSubmitFieldsValue }] = useForm({
    schemas: employeeAuditFormConfig,
    layout: 'vertical',
    labelWidth: 140,
    baseColProps: {
      span: 8,
    },
  });

  async function init(data) {
    console.log(data);
    state.loading = true;
    state.Id = data.id || data.ids[0];
    state.Ids = data.ids || [];
    state.type = data.type || 'add';
    state.title = data.title;
    state.currentIndex = 0;
    state.submit = {
      auditStatus: '1',
      auditOpinion: '',
      rollbackType: '1',
      rollbackNode: '1',
    };
    getDetail(state.Id);
  }
  async function getDetail(id?: number | string) {
    changeLoading(true);
    try {
      const params = {
        id: id || state.Ids[state.currentIndex],
      };
      const r = await getTrainAndAuditDetails(params as any);
      if (r.code == 200) {
        state.base = r.data;
        setFilingFieldsValue(state.base.trainInfo);
        setEmployeeSubmitFieldsValue(state.base.employeeSignInfo);
        if (state.base.employeeSignInfo.handSignature) {
          employeeSignImgBse64.value = state.base.employeeSignInfo.handSignature;
        }
      }
      changeLoading(false);
      state.loading = false;
    } catch (error) {
      closePopup();
      changeLoading(false);
      state.loading = false;
    }
  }

  function handlePrev() {
    state.currentIndex--;
    getDetail();
  }
  function handleNext() {
    state.currentIndex++;
    getDetail();
  }

  function handleCancel() {
    closePopup();
  }

  // 删除特定值
  const deleteByValue = (arr, target) => {
    return arr.filter(item => item !== target);
  };

  function handleSave() {
    const { Id, submit } = state;
    const dataList = [Id];
    const params = {
      employeeTrainIds: dataList,
      ...state.submit,
    };
    if (!submit.auditStatus) {
      return message.error('必须选择一项审批结果');
    }

    changeOkLoading(false);

    const formMethod = postHrAudit;
    // 由于存在全通过选项  单项操作必须清掉当前id 刷新页面
    if (submit.auditStatus === '0' || submit.auditStatus === '1') {
      // 单项操作
      formMethod(params as any)
        .then(res => {
          changeOkLoading(true);
          // 先判断当前页面的ids 长度是不是等于1 如果等于1 则关掉Popup
          if (state.Ids.length === 1) {
            closePopup();
          } else {
            // 长度大于1 删除当前id 并刷新页面
            state.Ids = deleteByValue(state.Ids, Id);
            // 判断当前index 与新id集合的长度  如果大于或等于 当前index 则重置为0  防止超数据长度
            if (state.currentIndex >= state.Ids.length) {
              // 重置回第一项
              state.currentIndex = 0;
            }
            getDetail();
          }

          createMessage.success(res?.msg || '保存成功');
        })
        .catch(err => {
          changeOkLoading(false);
        });
    } else {
      // 全通过操作 手动调整 参数  审核状态设置 为通过 所有id
      params.auditStatus = '1';
      params.employeeTrainIds = state.Ids;
      formMethod(params as any)
        .then(res => {
          changeOkLoading(true);
          createMessage.success(res?.msg || '保存成功');
          closePopup();
        })
        .catch(err => {
          changeOkLoading(false);
        });
    }
  }
  function handleVisibleChange(v) {
    if (!v) {
      emits('refresh');
    }
  }
</script>

<style lang="less">
  .ly-filing-detail {
    :deep(.ant-table-wrapper) {
      padding: 0 !important;
    }

    &-concat {
      display: flex;
      gap: 20px;

      &-item {
        flex: 1;
      }
    }

    .ant-form .ant-form-item {
      margin-bottom: 8px;
    }

    &-footer {
      position: sticky;
      bottom: 0;
      z-index: 1000;
      background: #fff;
      padding: 8px 12px;
      border-radius: 2px;
      border-top: 1px solid #f0f0f0;

      :deep(.ant-card-body) {
        padding: 12px 12px 8px !important;
      }
    }

    .h2 {
      font-size: 14px;
      font-weight: bold;
      display: flex;
      gap: 10px;
      margin-bottom: 4px;
    }

    .tag {
      width: 50px;
      border-radius: 2px;
      background: rgb(255 123 0 / 10%);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      padding: 2px 8px;
      color: #ff7b00;
      font-size: 12px;
    }

    .footer-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      gap: 20px;
    }
    // 覆写组件样式
    :deep(.lydc-basic-table-action button i) {
      font-size: 18px;
    }

    :deep(.ant-card-body) {
      width: 100%;
      padding: 12px 12px 8px !important;
    }

    :deep(.ant-table-thead > tr > th) {
      border-top: 1px solid rgb(0 0 0 / 6%);
    }

    :deep(.ant-table-thead > tr:first-child > th) {
      border-top: none;
    }

    :deep(.ant-table-thead > tr > th:not(:last-child, .ant-table-selection-column)::before) {
      position: absolute;
      top: 50%;
      right: 0;
      width: 1px;
      height: 1.6em;
      background-color: rgb(0 0 0 / 6%);
      transform: translateY(-50%);
      transition: background-color 0.3s;
      content: '';
    }
  }

  .rotate-90 {
    transform: rotate(-90deg);
    transition: all 0.35s ease;
  }
</style>
