<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <div class="btn-wrapper">
              <a-button type="primary" @click="handleAddAction" v-auth="'btn_add'">{{ t('common.add2Text') }}</a-button>
              <a-button @click="handleBatchDel" v-auth="'btn_batchRemove'">{{ t('common.batchDelText') }}</a-button>
            </div>
          </template>
          <template #type="{ row }">
            <div>{{ typeOption.find(item => item?.enCode == row.Type)?.fullName }}</div>
          </template>
          <template #edit="{ row }">
            <a-button :disabled="!hasBtnP('btn_detail')" type="link" @click="handleEdit(row)">
              {{ t('common.configureEncoding') }}
            </a-button>
          </template>
          <template #status="{ row }">
            <a-switch :disabled="!hasBtnP('btn_edit')" :checkedValue="1" :unCheckedValue="0" v-model:checked="row.Status" @click="handleChangeActive(row)" />
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
  </div>
  <RuleModal @register="registerRuleModal" @reload="reload" />
  <settingsRules @register="registerRules" />
</template>

<script lang="ts" setup>
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { onMounted, reactive, toRefs } from 'vue';
  import { message } from 'ant-design-vue';
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
  import { ActionItem, TableAction } from '/@/components/Table';
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

  const columns = [
    { type: 'checkbox', field: 'checkbox', width: 40 },
    { title: '规则名称', field: 'Name', minWidth: 120 },
    {
      title: '规则类型',
      field: 'Type',
      minWidth: 120,
      slots: { default: 'type' },
    },
    { title: '版本号', field: 'Version', width: 140 },
    { title: '描述', field: 'Description', minWidth: 120 },
    { title: '组织', field: 'OrgName', minWidth: 150 },
    {
      title: '编辑配置',
      field: 'edit',
      width: 120,
      slots: { default: 'edit' },
    },
    {
      title: '激活',
      field: 'Status',
      width: 100,
      slots: { default: 'status' },
    },
    {
      title: '操作',
      field: 'actions',
      slots: { default: 'action' },
      fixed: 'right',
      width: 120,
    },
  ];

  const [registerRules, { openPopup: openRulesPopup }] = usePopup();
  const [registerRuleModal, { openModal: openRulesModal }] = useModal();
  const baseStore = useBaseStore();

  const state = reactive<{
    typeOption: DicChildItem[];
  }>({
    typeOption: [],
  });

  const searchFormSchema = [
    {
      fieldName: 'Name',
      component: 'Input',
      componentProps: {
        placeholder: '请输入规则名称',
        submitOnPressEnter: true,
      },
    },
    {
      fieldName: 'Type',
      component: 'Select',
      componentProps: {
        placeholder: '请选择规则类型',
        fieldNames: {
          value: 'enCode',
          label: 'fullName',
        },
      },
    },
    {
      fieldName: 'Version',
      component: 'Input',
      componentProps: {
        placeholder: '请输入版本号',
      },
    },
  ];

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      showCollapseButton: false,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-5 gap-4',
      schema: searchFormSchema,
      i18nConfig: {
        moduleCode: 'IdgeneratorRuleColumn',
        transferRange: ['placeholder'],
      },
    },
    gridOptions: {
      id: 'basicData-encodingSettings-list',
      columns: columns,
      showIndexColumn: true,
      api: getIdGeneratorRule,
      tableSetting: {
        delStatus: true,
      },
      i18nConfig: {
        moduleCode: 'IdgeneratorRuleColumn',
      },
      rowConfig: {
        keyField: 'Id',
      },
    },
  });

  const { reload, getSelectRowKeys, updateSchema } = gridApi;

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

  const handleEdit = record => {
    openRulesPopup(true, { id: record.Id, title: t('common.encodingConfiguration') });
  };

  const handleAddAction = () => {
    openRulesModal(true, {
      sign: 'add',
    });
  };

  const handleRuleEdit = (record: any) => {
    // state.sign = 'edit';
    // state.Id = record.Id;
    openRulesModal(true, {
      ...record,
      Type: record.Type + '',
      sign: 'edit',
    });
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
      // 禁用
      await putIdGeneratorRuleDisable(Id);
    }
    reload();
  };

  const handleBatchDel = async () => {
    const ids = getSelectRowKeys();
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
    baseStore.getDictionaryData('IDGeneratorRuleType').then(res => {
      state.typeOption = Array.isArray(res) ? res : [res];
      console.log(state.typeOption);
      updateSchema([
        {
          fieldName: 'Type',
          componentProps: {
            options: state.typeOption,
          },
        },
      ]);
    });
  });

  const { typeOption } = toRefs(state);
</script>
