<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="pr-10px pl-10px pt-10px bg-white">
        <BasicForm @register="registerForm">
          <template #formFooter>
            <a-button type="primary" class="ml-3" @click="query">{{ t('common.queryText') }}</a-button>
            <a-button class="ml-3" @click="reset">{{ t('common.resetText') }}</a-button>
          </template>
        </BasicForm>
      </div>
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar_buttons>
            <div class="flex">
              <a-button v-auth="'btn_add'" type="primary" @click="handleAdd('add')">
                {{ t('common.addText') }}
              </a-button>
              <a-button v-auth="'btn_edit'" type="primary" ghost @click="handleAdd('edit')">
                {{ t('common.updateText') }}
              </a-button>
              <ModelConfirmButton
                v-bind="{
                  modelConfirm: {
                    onOk: handleBatchDelete.bind(null),
                  },
                }">
                <span v-auth="'btn_batchRemove'">{{ t('common.batchDelText') }}</span>
              </ModelConfirmButton>
              <div class="mr-3">
                <span>{{ t('dict.ApproverType') }}：</span>
                <LydcSelect
                  v-model:value="state.approverType"
                  :options="state.approverTypeList"
                  :fieldNames="{
                    value: 'enCode',
                  }"
                  style="width: 150px"
                  @change="changeFilter" />
              </div>
            </div>
          </template>
        </Grid>
      </div>
    </div>
    <ApplyAuditMember @register="registerApply" @reload="query"></ApplyAuditMember>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { commonCols, endCols, listCols } from './components/tableConfig';
  import { getFcAuditList, bulkDeleteFcAudit } from '/@/api/customerSerivce/fcAudit';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicTableProps } from '/@/components/VxeTable';
  import ApplyAuditMember from './components/ApplyAuditMember.vue';
  import { usePopup } from '/@/components/Popup';
  import { BasicForm, useForm } from '/@/components/Form';
  import { getMainProcess } from '/@/utils/business/index';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useBaseStore } from '/@/store/modules/base';
  import { ModelConfirmButton } from '/@/components/Button';
  import { getListDynamicTitles } from '/@/components/CustomComponents/src/fc/utils';

  defineOptions({ name: 'customerService-information-fcAudit' });

  const baseStore = useBaseStore();
  const { createMessage } = useMessage();
  const state = reactive<any>({
    mainProcess: '1',
    mainProcessList: [],
    approverType: '',
    approverTypeList: [],
  });
  const { t } = useI18n();
  const { hasBtnP } = usePermission();
  const [registerApply, { openPopup: openApply }] = usePopup();
  const [registerForm, { getFieldsValue, resetFields, updateSchema }] = useForm({
    baseColProps: { span: 4 },
    schemas: [
      {
        field: 'approverGroupName',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: t('common.groupName'),
        },
      },
      {
        field: 'configType',
        label: '',
        component: 'Select',
        componentProps: {
          placeholder: t('dict.ProjectMembersGroupColumn.configType'),
        },
      },
      {
        field: 'memberId',
        label: '',
        component: 'CustomUserSelect',
        componentProps: {
          placeholder: t('dict.ProjectMembersGroupColumn.memberId'),
        },
      },
      {
        field: 'mainProcess',
        label: '',
        component: 'Select',
        componentProps: {
          placeholder: t('dict.CommonCol.mainProcess'),
        },
      },
      {
        field: 'creatorUserId',
        label: '',
        component: 'CustomUserSelect',
        componentProps: {
          placeholder: t('dict.CommonCol.creatorUserName'),
        },
      },
    ],
  });

  const gridOptions = reactive<BasicTableProps>({
    api: getTableData,
    columns: commonCols,
    columnConfig: {
      resizable: true,
    },
    formConfig: {
      enabled: false,
    },
    proxyConfig: {
      filter: true,
      response: {
        result: 'data',
        total: 'total',
      },
    },
    toolbarConfig: {
      export: hasBtnP('btn_download'),
      print: false,
      slots: {
        buttons: 'toolbar_buttons',
      },
    },
    showIndexColumn: true,
  });

  async function getTableData({ currentPage = 1, pageSize = 10 }, searchForm = {}) {
    const params = getFieldsValue();
    return getFcAuditList({
      pageSize,
      currentPage,
      ...searchForm,
      ...params,
      approverType: state.approverType,
    }).then(({ data }) => {
      setLoading(false);
      return {
        data: data.list.map(el => {
          el.memberConfigs.forEach(memberItem => {
            el[memberItem.configType] = memberItem.memberNames; // 匹配表头字段
          });
          return el;
        }),
        total: data.pagination.total,
      };
    });
  }

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions,
  });
  const { reloadColumn, query, getSelectRowKeys, clearSelectedRowKeys, setLoading } = gridApi;

  // 获取动态表头
  async function getDynamicTitle() {
    const list = await getListDynamicTitles({
      approverType: state.approverType,
    });
    updateSchema({
      field: 'configType',
      componentProps: {
        options: list,
        fieldNames: {
          value: 'field',
          label: 'title',
        },
      },
    });
    reloadColumn(commonCols.concat(listCols).concat(list).concat(endCols));
  }

  // 更换筛选条件
  function changeFilter(e) {
    getDynamicTitle();
    query();
  }

  // 批量删除
  async function handleBatchDelete() {
    let idList: any = [];
    idList = getSelectRowKeys();
    if (!idList.length) {
      return createMessage.info(t('common.selectText'));
    }
    try {
      await bulkDeleteFcAudit(idList);
      clearSelectedRowKeys();
      query();
      createMessage.success(t(''));
    } catch (error) {}
  }

  // 新增
  function handleAdd(mode) {
    let idList: any = [];
    // 如果是编辑模式需要校验选中数据
    if (mode == 'edit') {
      idList = getSelectRowKeys();
      if (!idList.length) {
        return createMessage.info(t('common.selectText'));
      }
    }
    openApply(true, {
      approverType: state.approverType,
      approverTypeList: state.approverTypeList,
      mainProcessList: state.mainProcessList,
      mode,
      ids: idList,
    });
  }

  function reset() {
    resetFields().then(() => {
      setTimeout(() => {
        query();
      }, 0);
    });
  }

  onMounted(async () => {
    setLoading(true);
    state.approverTypeList = (await baseStore.getDictionaryData('ApproverType')) || [];
    if (state.approverTypeList.length) {
      state.approverType = state.approverTypeList[0].enCode;
    }
    getDynamicTitle();
    query();
    state.mainProcessList = await getMainProcess();
    updateSchema({
      field: 'mainProcess',
      componentProps: {
        options: state.mainProcessList,
      },
    });
  });
</script>

<style lang="less" scoped>
  .table-a {
    color: #ff7b00;
    cursor: pointer;
  }

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
