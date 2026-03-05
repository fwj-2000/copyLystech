<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <div class="btn-wrapper">
              <a-button type="primary" @click="handleAddAction" v-auth="'btn_add'">{{ t('common.add2Text') }}</a-button>
              <a-button @click="handleBatchDel" v-auth="'btn_batchRemove'">{{ t('common.batchDelText') }}</a-button>
            </div>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'Type'">
              <div>{{ typeOption.find(item => item?.enCode == record.Type)?.fullName }}</div>
            </template>
            <template v-if="column.dataIndex === 'edit'">
              <div @click="handleEdit(record)">
                <a-button :disabled="!hasBtnP('btn_detail')" type="link"
                  >{{ t('common.configureEncoding') }} <template #icon><SettingOutlined /></template
                ></a-button>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'Status'">
              <a-switch
                :disabled="!hasBtnP('btn_edit')"
                :checkedValue="1"
                :unCheckedValue="0"
                v-model:checked="record.Status"
                @click="handleChangeActive(record)" />
            </template>

            <template v-if="column.key === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
        <RuleModal @register="registerRuleModal" @reload="reload" />
      </div>
    </div>
  </div>
  <settingsRules @register="registerRules" />
</template>

<script lang="ts" setup>
  import { useI18n } from '/@/hooks/web/useI18n';
  import { onMounted, reactive, ref, toRefs } from 'vue';
  import { message, Table } from 'ant-design-vue';
  import { usePopup } from '/@/components/Popup';
  import settingsRules from './components/settingsRules.vue';
  import RuleModal from './components/ruleModal.vue';
  import {
    deleteIdGeneratorRule,
    getIdGeneratorRule,
    postIdsDelGeneratorRule,
    putIdGeneratorRuleDisable,
    putIdGeneratorRuleEnable,
  } from '/@/api/basicData/encodingSettings';
  import { useBaseStore } from '/@/store/modules/base';
  import { ModalComponent } from '/@/views/basicData/encodingSettings/types';
  import { ActionItem, BasicColumn, BasicTable, FormProps, TableAction, useTable } from '/@/components/Table';
  import { SettingOutlined } from '@ant-design/icons-vue';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { useModal } from '/@/components/Modal';

  interface DicChildItem {
    isTree?: number;
    id: string;
    enCode: string;
    fullName: string;
  }

  const { hasBtnP } = usePermission();

  const { t } = useI18n();

  defineOptions({ name: 'basicData-encodingSettings' });
  interface State {
    typeOption: DicChildItem[];
    sign: string;
    Id: string;
  }

  const columns: BasicColumn[] = [
    { title: '规则名称', dataIndex: 'Name', width: 120 },
    { title: '规则类型', dataIndex: 'Type', width: 120 },
    { title: '版本号', dataIndex: 'Version', width: 110 },
    { title: '组织', dataIndex: 'OrgName', width: 180 },
    { title: '描述', dataIndex: 'Description', width: 120 },
    { title: '编辑配置', dataIndex: 'edit', width: 120 },
    { title: '激活', dataIndex: 'Status', width: 100 },
  ];

  interface PageState {
    total: number;
    pageSize: number;
    current: number;
  }

  const [registerRules, { openPopup: openRulesPopup }] = usePopup();
  const [registerRuleModal, { openModal: openRulesModal }] = useModal();
  const baseStore = useBaseStore();

  const state = reactive<State>({
    typeOption: [],
    sign: 'add',
    Id: '',
  });

  const [registerTable, { getRowSelection, reload, setLoading, getForm }] = useTable({
    api: getIdGeneratorRule,
    columns,
    rowKey: 'Id',
    immediate: false,
    useSearchForm: true,
    rowSelection: {
      type: 'checkbox',
      // selectedRowKeys: unref(selectedRowKeys),
      // onChange: onSelectChange,
      // hideDefaultSelections: true,
      selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
    },
    formConfig: getFormConfig(),
    actionColumn: {
      width: 120,
      title: t('component.table.action'),
      dataIndex: 'action',
    },
    i18nConfig: {
      moduleCode: 'IdgeneratorRuleColumn',
    },
  });

  function getFormConfig(): Partial<FormProps> {
    return {
      schemas: [
        {
          field: 'Name',
          label: '规则名称',
          component: 'Input',
          componentProps: {
            placeholder: '请输入申请人',
            submitOnPressEnter: true,
          },
        },
        {
          field: 'Type',
          label: '规则类型',
          component: 'Select',
          componentProps: {
            placeholder: '请选择规则类型',
          },
        },
        {
          field: 'Version',
          label: '版本号',
          component: 'Input',
          componentProps: {
            placeholder: '请输入版本号',
          },
        },
      ],
      i18nConfig: {
        moduleCode: 'IdgeneratorRuleColumn',
        transferRange: ['placeholder', 'label'],
      },
    };
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-extend-pencil',
        onClick: handleRuleEdit.bind(null, record),
        auth: 'btn_edit',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: onDelete.bind(null, record.Id),
        },
        auth: 'btn_detail',
      },
    ];
  }

  function initData(isInit = false) {
    if (isInit) setLoading(true);
    if (isInit) reload({ page: 1 });
    getTypeOptions();
  }

  const getTypeOptions = () => {
    baseStore.getDictionaryData('IDGeneratorRuleType').then(res => {
      state.typeOption = Array.isArray(res) ? res : [res];
      getForm().updateSchema({
        field: 'Type',
        componentProps: {
          options: state.typeOption,
          fieldNames: { value: 'enCode' },
        },
      });
    });
  };
  const pageState = reactive<PageState>({
    total: 0,
    pageSize: 10,
    current: 1,
  });

  const handleEdit = record => {
    openRulesPopup(true, { id: record.Id, title: t('common.encodingConfiguration') });
  };

  const handleAddAction = () => {
    openRulesModal(true, {});
  };

  const handleRuleEdit = (record: any) => {
    state.sign = 'edit';
    state.Id = record.Id;
    openRulesModal(true, {
      ...record,
      Type: record.Type + '',
    });
    // modalVal.clearForm();
    // modalVal.setVisible(true);
    // modalVal.setFormData(record);
  };
  const onDelete = (key: string | number) => {
    deleteIdGeneratorRule(key).then(({ code, msg }) => {
      if (code === 200) {
        reload();
        message.success(msg);
      }
    });
  };

  const handleChangeActive = async record => {
    const { Id, Status } = record;
    if (Status === 1) {
      // 启用
      await putIdGeneratorRuleEnable(Id);
    } else {
      await putIdGeneratorRuleDisable(Id);
    }
    // 禁用
    reload();
  };

  const handleBatchDel = async () => {
    const ids = getRowSelection().selectedRowKeys;
    if (ids.length === 0) {
      return message.warning(t('common.selectText'));
    }
    try {
      const { code } = await postIdsDelGeneratorRule(ids);
      if (code === 200) {
        message.success(t('common.delSuccess'));
      }
      reload();
    } catch (e) {}
  };

  onMounted(() => {
    initData(true);
  });

  const { typeOption, sign, Id } = toRefs(state);
</script>

<style lang="less" scoped>
  .lydc-content-wrapper {
    position: absolute;
  }

  :deep(.lydc-basic-table-action button i) {
    font-size: 18px;
  }

  .edit-text {
    color: #666;
    cursor: pointer;
    font-size: 14px;
    margin-right: 10px;
  }
</style>
