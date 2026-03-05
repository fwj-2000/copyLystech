<template>
  <a-space class="mt-10px">
    <Subtitle :title="t('dict.ECNColumn.departmentalCoSignature')" />
  </a-space>
  <div class="h-full flex p-4" style="align-items: start">
    <div class="flex flex-col pr-4 w-1/2">
      <BasicTable @register="registerLeftTable">
        <template #bodyCell="{ record, column, text }">
          <template v-if="column.dataIndex === 'reviewComments'">
            <template v-if="record.userId !== getUserInfo.userId || mode === 'view'">
              <div class="h-80px flex-start" style="justify-content: center; flex-direction: column; display: flex; padding-left: 10px">
                <LydcTag v-if="record.reviewResult == 1" theme="green" :text="t('common.agree')"></LydcTag>
                <LydcTag v-if="record.reviewResult == 2" theme="red" :text="t('common.disagree')"></LydcTag>
                {{ text }}
              </div>
            </template>
            <template v-else>
              <div class="h-80px">
                <a-radio-group :disabled="mode !== 'edit'" v-model:value="record.reviewResult">
                  <a-radio :value="1">{{ t('common.agree') }}</a-radio>
                  <a-radio :value="2">{{ t('common.disagree') }}</a-radio>
                </a-radio-group>
                <!-- <a-switch checked-children="同意" un-checked-children="不同意" :checked-value="1" :un-checked-value="2" v-model:checked="record.reviewResult" /> -->
                <div class="mt-10px" style="display: flex; flex-direction: column">
                  <a-textarea v-model:value="record.reviewComments" :autoSize="{ minRows: 1, maxRows: 6 }" :placeholder="t('common.reasonInput')"></a-textarea>
                </div>
              </div>
            </template>
          </template>
        </template>
      </BasicTable>
    </div>

    <div class="flex flex-col pr-4 w-1/2">
      <BasicTable @register="registerRightTable">
        <template #bodyCell="{ record, column, text }">
          <template v-if="column.dataIndex === 'reviewComments'">
            <template v-if="record.userId !== getUserInfo.userId || mode === 'view'">
              <div class="h-80px flex-start" style="justify-content: center; flex-direction: column; display: flex; padding-left: 10px">
                <LydcTag v-if="record.reviewResult == 1" theme="green" :text="t('common.agree')"></LydcTag>
                <LydcTag v-if="record.reviewResult == 2" theme="red" :text="t('common.disagree')"></LydcTag>
                {{ text }}
              </div>
            </template>
            <template v-else>
              <div class="h-80px">
                <a-radio-group :disabled="mode !== 'edit'" v-model:value="record.reviewResult">
                  <a-radio :value="1">{{ t('common.agree') }}</a-radio>
                  <a-radio :value="2">{{ t('common.disagree') }}</a-radio>
                </a-radio-group>
                <!-- <a-switch checked-children="同意" un-checked-children="不同意" :checked-value="1" :un-checked-value="2" v-model:checked="record.reviewResult" /> -->
                <div class="mt-10px" style="display: flex; flex-direction: column">
                  <a-textarea v-model:value="record.reviewComments" :autoSize="{ minRows: 1, maxRows: 6 }" placeholder="请输入原因"></a-textarea>
                </div>
              </div>
            </template>
          </template>
        </template>
      </BasicTable>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { Subtitle } from '/@/components/Subtitle';
  import Template from '/@/views/engineering/pcc/pccApply/components/Template.vue';
  import { useTable } from '/@/components/Table';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { getSignDeptColumns } from './CONFIG';
  import { computed, reactive, toRaw, toRefs } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useI18n } from '/@/hooks/web/useI18n';

  const userStore = useUserStore();
  const getUserInfo = computed(() => userStore.getUserInfo || {});
  const { t } = useI18n();
  const state = reactive({
    mode: '',
  });
  const { mode } = toRefs(state);
  const [
    registerLeftTable,
    {
      setTableData: setLeftTableData,
      setProps: setLeftProps,
      getDataSource: getLeftDataSource,
      updateTableDataRecord: updateLeftTableDataRecord,
      insertTableDataRecord: insertLeftTableDataRecord,
      deleteTableDataRecord: deleteLeftTableDataRecord,
    },
  ] = useTable({
    columns: getSignDeptColumns(),
    pagination: false,
    bordered: true,
    striped: true,
    rowKey: 'id',
    canResize: false,
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    isCanResizeParent: true,
  });
  const [
    registerRightTable,
    {
      setTableData: setRightTableData,
      setProps: setRightProps,
      getDataSource: getRightDataSource,
      updateTableDataRecord: updateRightTableDataRecord,
      insertTableDataRecord: insertRightTableDataRecord,
      deleteTableDataRecord: deleteRightTableDataRecord,
    },
  ] = useTable({
    columns: getSignDeptColumns(),
    bordered: true,
    pagination: false,
    striped: true,
    rowKey: 'uuid',
    canResize: false,
    showTableSetting: false,
    tableSetting: { fullScreen: true },
    showIndexColumn: false,
    isCanResizeParent: true,
  });

  function init(data) {
    state.mode = data.mode;
    const { countersignList } = data;
    const leftData = [];
    const rightData = [];
    countersignList.forEach((item, index) => {
      if (index % 2 === 0) {
        leftData.push({
          ...item,
          disabled: getUserInfo.value.userId !== item.userId,
          deptName: item.deptName,
          reviewComments: item.reviewComments,
          reviewResult: item.reviewResult,
          userName: item.userName,
        });
        if (getUserInfo.value.userId === item.userId) {
          item.reviewResult = 2;
        }
      } else {
        rightData.push({
          ...item,
          disabled: getUserInfo.value.userId !== item.userId,
          deptName: item.deptName,
          reviewComments: item.reviewComments,
          reviewResult: item.reviewResult,
          userName: item.userName,
        });
        if (getUserInfo.value.userId === item.userId) {
          item.reviewResult = 2;
        }
      }
    });
    console.log(leftData, 'leftData');
    console.log(rightData, 'rightData');
    setLeftTableData(leftData);
    setRightTableData(rightData);
  }

  function submit() {
    console.log('submit');
    const leftData = getLeftDataSource();
    const rightData = getRightDataSource();

    const data = toRaw(leftData).concat(toRaw(rightData));
    // data.forEach((item) => {
    //   item.reviewResult = !!;
    // });
    return data.filter(item => item.userId === getUserInfo.value.userId);
  }

  defineExpose({
    init,
    submit,
  });
</script>
<style scoped lang="less"></style>
