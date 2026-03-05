<template>
  <a-space class="mt-10px">
    <Subtitle :title="t('dict.ECNColumn.finalDecision')" />
  </a-space>
  <Descriptions :labelStyle="{ width: '200px' }" bordered style="margin-top: 10px" :column="4" size="small">
    <DescriptionsItem :label="t('dict.ECN.MaterialHandleWay')" :span="4">
      <a-radio-group :disabled="mode == 'view'" :default-value="1" v-model:value="baseState.materialHandleWayVal">
        <a-radio :value="1">{{ t('dict.ECN.MaterialHandleWay.1') }}</a-radio>
        <a-radio :value="2">{{ t('dict.ECNColumn.accordingToFollowingRequirements') }}</a-radio>
      </a-radio-group>
      <a-input
        :disabled="mode == 'view' || baseState.materialHandleWayVal !== 2"
        style="margin-top: 10px"
        v-model:value="materialHandleWayStr"
        :placeholder="t('dict.ECNColumn.requirements')" />
    </DescriptionsItem>
    <DescriptionsItem :label="t('dict.ECN.ChangeWay')" :span="4">
      <a-radio-group :disabled="mode == 'view'" v-model:value="baseState.changeWayVal">
        <a-radio :value="1">{{ t('dict.ECN.ChangeWay.1') }}</a-radio>
        <a-radio :value="2">{{ t('dict.ECN.ChangeWay.2') }}</a-radio>
        <a-radio :value="3">{{ t('dict.ECN.ChangeWay.3') }}</a-radio>
        <a-radio :value="4">{{ t('dict.ECNColumn.selectDateSwitchToggle') }}</a-radio>
        <a-date-picker :disabled="mode == 'view' || baseState.changeWayVal !== 4" v-model:value="materialHandleTime" style="margin-right: 10px" />
        <a-radio :value="5">{{ t('dict.ECN.ChangeWay.5') }}</a-radio>
      </a-radio-group>
      <a-input
        :disabled="mode == 'view' || baseState.changeWayVal !== 5"
        style="margin-top: 10px"
        v-model:value="changeWayStr"
        :placeholder="t('dict.ECNColumn.requirements')" />
    </DescriptionsItem>
    <DescriptionsItem class="flex-row" :span="4">
      <template #label>
        <div class="flex ct-between">
          {{ t('dict.ECNColumn.ecnIssuanceScope') }}
          <a-button v-if="mode == 'edit'" type="primary" ghost size="small" @click="addSignDeptModal('notice')"
            >{{ t('component.lydc.iconPicker.select') }}
          </a-button>
        </div>
      </template>
      <a-row :gutter="[10, 8]">
        <a-col v-for="item in noticeList" class="flex-row" :span="4">
          <template v-if="item.key === 16">
            {{ item.otherValue }}:
            <lydc-custom-user-select
              :disabled="mode !== 'edit'"
              style="width: 70%"
              v-model:value="item.userId"
              :placeholder="item.otherValue"
              :allowClear="true"
              show-search />
          </template>
          <template v-else>
            {{ item.value }}:
            <lydc-custom-user-select
              :disabled="mode !== 'edit'"
              style="width: 70%"
              v-model:value="item.userId"
              :placeholder="item.value"
              :allowClear="true"
              show-search />
          </template>
        </a-col>
      </a-row>
    </DescriptionsItem>
    <DescriptionsItem class="flex-row" :span="4">
      <template #label>
        <div class="flex ct-between">
          {{ t('dict.ECNColumn.associatedMaterialProcessingDepartment') }}
          <a-button v-if="mode == 'edit'" type="primary" ghost size="small" @click="addSignDeptModal('execute')">{{ t('dict.ECNColumn.select') }} </a-button>
        </div>
      </template>
      <a-row :gutter="[10, 8]">
        <a-col v-for="item in executeConfirmList" class="flex-row" :span="4">
          <template v-if="item.key === 16">
            {{ item.otherValue }}:
            <lydc-custom-user-select
              :disabled="mode !== 'edit'"
              style="width: 70%"
              v-model:value="item.userId"
              :placeholder="item.otherValue"
              :allowClear="true"
              show-search />
          </template>
          <template v-else>
            {{ item.value }}:
            <lydc-custom-user-select
              :disabled="mode !== 'edit'"
              style="width: 70%"
              v-model:value="item.userId"
              :placeholder="item.value"
              :allowClear="true"
              show-search />
          </template>
        </a-col>
      </a-row>
    </DescriptionsItem>

    <DescriptionsItem :labelStyle="{ width: 'max-content' }" :label="t('dict.ECNColumn.filler')" :span="2"> {{ writeName }} </DescriptionsItem>
    <DescriptionsItem :labelStyle="{ width: 'max-content' }" :label="t('dict.ECNColumn.fillingDate')" :span="2"> {{ writeDate }} </DescriptionsItem>
  </Descriptions>
  <a-space class="mt-10px">
    <Subtitle :title="t('common.approval')" />
  </a-space>
  <BasicTable @register="registerTable">
    <template #bodyCell="{ record, column, text }">
      <template v-if="column.dataIndex === 'deptOpinion'"> {{ t('common.agree') }}</template>
      <template v-else-if="column.dataIndex === 'userName'">
        <template v-if="record.role === 'Manager' && mode === 'edit'">
          <CustomUserSelect :placeholder="t('dict.ECN.FlowNode.PDQMEManager')" allowClear :show-search="true" v-model:value="state.Manager" />
        </template>
        <template v-else-if="record.role === 'QAManager' && mode === 'edit'">
          <CustomUserSelect :placeholder="t('dict.ECN.FlowNode.QAManager')" allowClear :show-search="true" v-model:value="state.qaManager" />
        </template>
        <template v-else>
          {{ record.userName }}
        </template>
      </template>
    </template>
  </BasicTable>
  <SignDeptModal @register="registerSignDeptModal" @submit="handleSignDeptModalSubmit" />
</template>
<script setup lang="ts">
  import { Subtitle } from '/@/components/Subtitle';
  import { useTable } from '/@/components/Table';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { getReviewColumns } from './CONFIG';
  import { Descriptions, DescriptionsItem } from 'ant-design-vue';
  import { reactive, toRefs } from 'vue';
  import { useModal } from '/@/components/Modal';
  import SignDeptModal from '/@/views/engineering/ecn/components/SignDeptModal.vue';
  import { dateUtil } from '/@/utils/dateUtil';
  import { useBaseStore } from '/@/store/modules/base';
  import CustomUserSelect from '/@/components/Lydc/Organize/src/CustomUserSelect.vue';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';

  // const userStore = useUserStore();
  // const userInfo = userStore.getUserInfo;
  const [registerSignDeptModal, { openModal: openSignDeptModal, closeModal: closeSignDeptModal }] = useModal();

  const state = reactive({
    baseState: { materialHandleWayVal: 1, changeWayVal: 1 },
    noticeList: [],
    executeConfirmList: [],
    materialHandleWayStr: '',
    changeWayStr: '',
    mode: '',
    materialHandleTime: '',
    qaManager: '',
    Manager: '',
    writeName: '',
    writeDate: '',
    changeLevel: '',
  });

  const baseStore = useBaseStore();
  const { t } = useI18n();
  const { createMessage } = useMessage();

  const { baseState, materialHandleWayStr, changeWayStr, noticeList, executeConfirmList, mode, materialHandleTime, writeName, writeDate, changeLevel } =
    toRefs(state);
  const [
    registerTable,
    {
      setTableData: setTableData,
      setProps: setProps,
      getDataSource: getDataSource,
      updateTableDataRecord: updateTableDataRecord,
      insertTableDataRecord: insertTableDataRecord,
      deleteTableDataRecord: deleteTableDataRecord,
    },
  ] = useTable({
    columns: getReviewColumns(),
    pagination: false,
    striped: true,
    rowKey: 'uuid',
    canResize: false,
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    isCanResizeParent: true,
    i18nConfig: {
      moduleCode: 'ECNColumn',
    },
  });

  async function init(data) {
    console.log(data, 'init review data');
    const deptList = await baseStore.getDictionaryData('ECN.Dept');

    const rolelist = await baseStore.getDictionaryData('ECN.Role');
    const { mode, changeLevel, managerName, id, materialHandleWay, changeWay, changeBeginDate, flowNodeInstanceHisList } = data;
    state.mode = mode;
    state.ecnId = id;
    state.changeLevel = changeLevel;
    if (materialHandleWay?.key == '2') {
      state.baseState.materialHandleWayVal = 2;
      materialHandleWayStr.value = materialHandleWay.value;
    } else {
      state.baseState.materialHandleWayVal = Number(materialHandleWay?.key);
      materialHandleWayStr.value = materialHandleWay?.value;
    }

    if (flowNodeInstanceHisList && flowNodeInstanceHisList.length > 0) {
      const target = flowNodeInstanceHisList.find(item => item.nodeCode === 'FinalHandle');

      if (target) {
        state.writeName = target.handlerName;
        state.writeDate = target.creatorTime ? dateUtil(target.creatorTime).format('YYYY-MM-DD') : '-';
      }
    } else {
      state.writeName = '-';
      state.writeDate = '-';
    }

    if (changeWay?.key == '5') {
      state.baseState.changeWayVal = 5;
      changeWayStr.value = changeWay.value;
    } else if (changeWay?.key == '4') {
      state.baseState.changeWayVal = 4;
      materialHandleTime.value = dateUtil(changeBeginDate);
    } else {
      state.baseState.changeWayVal = Number(changeWay?.key);
      changeWayStr.value = changeWay?.value;
    }

    let noticeList = data.noticeList || [];
    state.noticeList = noticeList.map(item => {
      const target = deptList.find(value => value.enCode === item.key);
      const msg = {
        otherValue: target?.fullName,
        value: target?.fullName,
        key: item.key,
        userId: item.userId,
      };
      if (item.key === '16') {
        msg.otherValue = item.value;
        msg.value = item.value;
      }
      return msg;
    });

    let executeConfirmList = data.executeConfirmList || [];
    state.executeConfirmList = executeConfirmList.map(item => {
      const target = deptList.find(value => value.enCode === item.key);
      const msg = {
        otherValue: target?.fullName,
        value: target?.fullName,
        key: item.key,
        userId: item.userId,
      };
      if (item.key === '16') {
        msg.otherValue = item.value;
        msg.value = item.value;
      }
      return msg;
    });

    // data.reviewList.map(item => {
    //
    // })
    console.log(rolelist, 'rolelist-------------');
    const roleList = rolelist.map(item => {
      console.log(item, 'item------------');
      // pitem.onEdit = true;
      // pitem.editable = true;
      const target = {
        role: item.enCode,
        // onEdit: true,
        // editable: true,
        disabled: {
          role: true,
          userId: true,
          reviewComments: true,
        },
      };
      data?.reviewList?.map(v => {
        console.log(item.enCode, 'item enCode');
        if (item?.enCode === v?.role) {
          if (v?.userName) {
            target.userName = v?.userName;
            target.userId = v?.userId;
            target.reviewComments = v?.reviewComments;
            target.creatorTime = v?.creatorTime;

            if (v.role == 'Manager') {
              state.Manager = v.userId;
            }
            if (v.role == 'QAManager') {
              state.qaManager = v.userId;
            }
          }
        }
      });

      // if(target.userId === userInfo.userId && mode == 'edit'){
      //   target.onEdit = true
      //   target.editable = true
      //   target.disabled.reviewComments = false
      // }
      // console.log(userInfo, 'userInfouserInfouserInfo')
      return target;
    });
    console.log(roleList, 'roleList');

    setTableData(roleList);
    // const list = rolelist.map((item, index) => {
    //   const target = {
    //     role: item.enCode,
    //     disabled: {
    //       role: true,
    //       userId: true,
    //       reviewComments: true
    //     }
    //   };
    //   if (item.enCode === "Manager") {
    //     target.userName = managerName;
    //   }
    //   data.reviewList.map((v, i) => {
    //     if (v.role === item.enCode) {
    //       target.reviewComments = v.reviewComments;
    //       // target
    //     }
    //     console.log(item.enCode, "-10928319823");
    //     if (item.enCode === "OperationManager" && changeLevel == "2" && v.role) {
    //       target.userName = v.userName;
    //     } else {
    //       if (v.role === item.enCode && item.userName) {
    //         console.log(v.role === item.enCode);
    //         console.log(item.enCode);
    //         console.log(v.role);
    //         target.userName = item.userName;
    //       }
    //     }
    //     if (index === i) {
    //       target.creatorTime = v.creatorTime;
    //     }
    //   });
    //   return target;
    // }).filter(item => item);
    // console.log(list);
    // setTableData(list);
  }

  function submit(isValidate = false) {
    const { baseState, noticeList, executeConfirmList } = state;

    if (isValidate) {
      // 如果需要校验，则执行下方校验逻辑
      if (Array.isArray(noticeList) && noticeList.length > 0 && noticeList.some(item => !item.userId)) {
        // `ECN发放范围`如果选择了部门，则必须选择该部门的通知人
        createMessage.warning(t('dict.ECN.personRequired', [t('dict.ECNColumn.ecnIssuanceScope')]));
        throw new Error(t('dict.ECN.personRequired', [t('dict.ECNColumn.ecnIssuanceScope')]));
      }
      if (Array.isArray(executeConfirmList) && executeConfirmList.length > 0 && executeConfirmList.some(item => !item.userId)) {
        // `关联物料处理部门`如果选择了部门，则必须选择该部门的执行确认人
        createMessage.warning(t('dict.ECN.personRequired', [t('dict.ECNColumn.associatedMaterialProcessingDepartment')]));
        throw new Error(t('dict.ECN.personRequired', [t('dict.ECNColumn.associatedMaterialProcessingDepartment')]));
      }
    }

    console.log(baseState);
    const materialHandleWay = {
      key: baseState.materialHandleWayVal,
      value: baseState.materialHandleWayVal === 2 ? state.materialHandleWayStr : '',
    };
    const changeWay = {
      key: baseState.changeWayVal,
      value: baseState.changeWayVal === 5 ? state.changeWayStr : '',
    };

    // const datalist = dataSource.map(item => ({
    //   ecnId: state.ecnId,
    //   reviewComments: item.reviewComments,
    //   role: item.role,
    //   userId: item.userId
    // }));
    const data = {
      materialHandleWay,
      changeWay,
      noticeList,
      executeConfirmList,
      qaManager: state.qaManager,
      Manager: state.Manager,
    };
    if (baseState.changeWayVal === 4) {
      data.changeBeginDate = dateUtil(state.materialHandleTime).valueOf();
    }

    return data;
  }

  function addSignDeptModal(type) {
    let countersignList = [];
    if (type === 'notice') {
      countersignList = state.noticeList;
    } else if (type === 'execute') {
      countersignList = state.executeConfirmList;
    }
    openSignDeptModal(true, {
      type,
      countersignList,
    });
  }

  function handleSignDeptModalSubmit(data) {
    state.countersignList = data;
    const { type } = data;
    if (type === 'notice') {
      state.noticeList = data.countersignList;
    } else if (type === 'execute') {
      state.executeConfirmList = data.countersignList;
    }
    closeSignDeptModal();
  }

  defineExpose({
    init,
    submit,
  });
</script>
<style lang="less" scoped>
  :deep(.ant-radio-disabled .ant-radio-inner::after) {
    background: rgb(255 123 0 / 70%);
  }

  :deep(.ant-radio-checked .ant-radio-inner) {
    border-color: rgb(255 123 0 / 70%) !important;
  }

  :deep(.ant-radio-disabled + span) {
    color: #1a1a1a;
  }

  :deep(.ant-checkbox-disabled + span) {
    color: #1a1a1a;
  }
</style>
