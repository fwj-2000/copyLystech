<template>
  <BasicPopup v-bind="$attrs" @register="registerPopup" :showOkBtn="true" :okText="t('common.submit')" :title="title" @ok="handleSave" class="full-popup">
    <!-- <template #insertToolbar>
      <a-button v-if="state.show.submit" class="mr-3" @click="handleSave('storage')" type="primary" ghost>{{ t('common.temporarySave') }}</a-button>
    </template> -->
    <div class="h-full">
      <div class="lydc-content-wrapper-search-box p-12px">
        <Subtitle :title="t('common.baseinfo')" />
        <BasicForm @register="registerForm" />
      </div>
      <div style="height: calc(100% - 250px)">
        <Subtitle :title="t('dict.CommonCol.ruleMsg')" class="ml-12px pb-0"> </Subtitle>
        <DynamicTable ref="addDynamicTable">
          <template #edit_createTime="{ row }">
            <div class="flex">
              {{ console.log(row) }}
              <LydcTimeRange :value="row.createTime" class="mr-12px" @change="onCreateTimeChangeFn($event, row)"></LydcTimeRange>
              <vxe-input v-model="row.week" clearable></vxe-input>
            </div>
          </template>
          <template #default_createTime="{ row }">
            {{ formatTimeFn(row.createTime) }}
            {{ row.week ? '/' + row.week : '' }}
          </template>
        </DynamicTable>
      </div>

      <!-- <Grid :columns="columns" style="height: calc(100% - 170px)" :gridEvents="{ headerCellDblclick: handleDblClickHead }">
        <template #action="{ row }">
          <TableAction :outside="true" :actions="getTableActions(row)" />
        </template>
      </Grid> -->
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { reactive, toRefs, nextTick, h, ref, unref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { TableAction, ActionItem } from '/@/components/Table';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { Subtitle } from '/@/components/Subtitle';
  import { addColumns, addSchema, addTemplate } from './config';
  import DynamicTable from './DynamicTable.vue';
  import { LydcDatePicker, LydcDateRange, LydcTimePicker, LydcTimeRange } from '/@/components/Lydc/DatePicker';

  const emits = defineEmits(['register', 'refresh']);

  interface State {
    id: string;
    title: string;
    mode: 'add' | 'edit' | 'view';
  }

  const { t } = useI18n();
  const state = reactive<State>({
    id: '',
    title: '',
    mode: 'add',
  });
  const { title } = toRefs(state);
  const addDynamicTable = ref();
  const { createMessage } = useMessage();

  const [registerForm, { updateSchema, validate, getFieldsValue, setFieldsValue, setProps: setPropsForm }] = useForm({
    baseColProps: { span: 6 },
    labelWidth: '200',
    layout: 'vertical',
    // i18nConfig: {
    //   moduleCode: 'QuantitativeApplyColumn',
    //   transferRange: ['label', 'placeholder'],
    // },
    schemas: addSchema,
  });

  const [registerPopup, { closePopup, changeOkLoading, changeLoading }] = usePopupInner(init);

  async function init(data) {
    state.title = data.title;
    state.id = data.id;
    const mode = data.mode || state.mode;
    addDynamicTable.value.initFn({
      mode,
      columns: addColumns,
      rowTemplate: addTemplate,
      vxeConfig: {
        gridOptions: {
          id: 'qms-intelligentButler-abnormalMsgConfig-edit',
        },
      },
      // editRules: BADPRODUCTTYPE_COLUMNS_RELUS,
      // data: detailData?.badTypeList || [],
    });
  }

  async function handleSave(type) {
    // 校验
    const validateResult = await validate();
    if (!validateResult) {
      // createMessage.warning(t('common.validateError'));
      return;
    }
    const _tableData = unref(addDynamicTable).getParamsFn();
    const _params = { ...getFieldsValue(), id: state.id, _tableData };
    console.log(_params, '请求数据');
  }

  function onCreateTimeChangeFn(value, data) {
    unref(addDynamicTable).gridApi.grid.setRow(data, { createTime: value });
    console.log(value, data);
  }

  function formatTimeFn(value) {
    if (!value) return '';
    return value[0] + ' - ' + value[1];
  }
</script>

<style lang="less">
  .lydc-subtitle-container {
    padding: 0 !important;
  }
  // :deep(.lydc-basic-table-action button i) {
  //   font-size: 18px;
  // }

  // .table-a {
  //   color: #ff7b00;
  //   cursor: pointer;
  // }
</style>
