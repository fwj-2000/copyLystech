<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <a-button v-auth="'btn_add'" type="primary" @click="addOrUpdateHandle()">{{ t('common.add') }}</a-button>
            <a-button v-auth="'oneClickOk'" type="primary" @click="oneClickOk" v-if="searchKey === '0'">一键过站</a-button>
          </template>
          <template #action="{ rowIndex, row }">
            <TableAction :outside="true" :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <add @register="registerForm" @reload="GridApi.reload" />
    <addMQ @register="registerFormMQ" @reload="GridApi.reload" />
    <ProcessSelect @register="registerProcessSelect" @reload="GridApi.reload" />
  </div>
</template>

<script setup lang="ts">
  import { ActionItem } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import TableAction from '/@/components/Table/src/components/TableAction.vue';
  import { getManualAssignmentCode, getManualAssignmentCodeMQ } from '/@/api/productionDeal/manualAssignmentCode';
  import { columns, columnsMQ, getFormSchema, getFormSchemaMQ } from './config';
  import { useModal } from '/@/components/Modal';
  import { reactive } from 'vue';
  import add from './components/add.vue';
  import addMQ from './components/addMQ.vue';
  import ProcessSelect from './components/ProcessSelect.vue';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { dateUtil } from '/@/utils/dateUtil';

  const { t } = useI18n();

  interface State {
    typeList: any[];
    processTypeList: any[];
  }
  const props = defineProps({
    searchKey: { default: '0' },
  });
  const state = reactive<State>({
    typeList: [],
    processTypeList: [],
  });
  const [registerForm, { openModal: openFormModal }] = useModal();
  const [registerFormMQ, { openModal: openFormModalMQ }] = useModal();
  const [registerProcessSelect, { openModal: openProcessSelectModal }] = useModal();
  const [Grid, GridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: true,
      // 是否在字段值改变时提交表单
      submitOnChange: false,
      showCollapseButton: false,
      // 按下回车时是否提交表单
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-6 gap-4',
      schema: props.searchKey === '0' ? getFormSchema() : getFormSchemaMQ(),
    },
    gridOptions: {
      id: 'productionDeal-dieCut-manualAssignmentCode-index',
      columns: props.searchKey === '0' ? columns : (columnsMQ as any),
      showIndexColumn: true,
      showFooter: false,
      api: props.searchKey === '0' ? getManualAssignmentCode : getManualAssignmentCodeMQ,
      rowConfig: {
        keyField: 'id',
        isCurrent: false, // 完全禁用行高亮
      },
      columnConfig: {
        isCurrent: true, // 启用列高亮
      },
      currentColumnConfig: {
        isFollowSelected: true, // 高亮跟随选中
      },
      beforeFetch: params => {
        const _params = {
          ...params,
        };
        if (_params.date && _params.date.length > 0) {
          _params.StartTime = dateUtil(params.date[0]).valueOf();
          _params.EndTime = dateUtil(params.date[1]).endOf('day').valueOf();
          delete _params.date;
        }

        return _params;
      },
    },
  });
  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-edit',
        onClick: addOrUpdateHandle.bind(null, record),
        auth: 'btn_detail',
      },
    ];
  }

  //新增或者修改
  function addOrUpdateHandle(record = '') {
    let apiValue = props.searchKey === '0' ? openFormModal : openFormModalMQ;
    apiValue(true, { record, typeList: state.typeList, processTypeList: state.processTypeList });
  }
  const oneClickOk = () => {
    openProcessSelectModal(true, {});
  };
</script>
