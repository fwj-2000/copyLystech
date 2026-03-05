<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-search-box">
        <BasicTable @register="registerTable">
          <template #tableTitle>
            <!-- v-auth="'btn_add'" v-auth="'btn_remove'"-->
            <a-button type="primary" preIcon="icon-ym icon-ym-btn-add" @click="handleApply">
              {{ t('common.add') }}
            </a-button>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <TableAction :actions="getTableActions(record)" />
            </template>
          </template>
        </BasicTable>
      </div>
    </div>
    <ApplyPop @register="registerApply" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { ActionItem, BasicTable, TableAction, useTable } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ApplyPop from './components/ApplyPop.vue';
  import { getList, del } from '/@/api/basicData/moduleRules';
  import { usePopup } from '/@/components/Popup';
  import { usePermission } from '/@/hooks/web/usePermission';

  defineOptions({ name: 'basicData-moduleRules' });

  const { hasBtnP } = usePermission();

  const { createMessage, createConfirm } = useMessage();
  const [registerApply, { openPopup: openApplyPop }] = usePopup();
  const { t } = useI18n();
  const columns = [
    {
      title: '模块编码',
      dataIndex: 'ModuleEnCode',
      width: 180,
    },
    {
      title: '模块名称',
      dataIndex: 'ModuleFullName',
      width: 200,
    },
    {
      title: 'ID字段',
      dataIndex: 'IDField',
      width: 170,
    },
    {
      title: '规则名称',
      dataIndex: 'RuleName',
      width: 170,
    },
  ];

  const [registerTable, { reload, getForm, getSelectRowKeys, setSelectedRowKeys, getFetchParams }] = useTable({
    api: getList,
    columns,
    bordered: true,
    rowKey: 'Id',
    useSearchForm: false,
    i18nConfig: {
      moduleCode: 'BusinessRuleColumn',
    },
    formConfig: {
      i18nConfig: {
        moduleCode: 'BusinessRuleColumn',
        transferRange: ['placeholder'],
      },
      schemas: [
        {
          field: 'code',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '模块编号',
            i18nFile: 'ModuleEnCode',
            submitOnPressEnter: true,
          },
        },
        {
          field: 'name',
          label: '',
          component: 'Input',
          componentProps: {
            placeholder: '模块名称',
            i18nFile: 'ModuleFullName',
            submitOnPressEnter: true,
          },
        },
      ],
    },

    // rowSelection: {
    //   type: 'checkbox',
    // },
    actionColumn: {
      width: 70,
      title: t('common.action'),
      dataIndex: 'action',
    },
  });

  function handleApply() {
    openApplyPop(true, {});
  }

  async function handleDel() {
    const selectKeys = getSelectRowKeys();
    if (selectKeys.length === 0) return createMessage.error(t('common.selectText'));
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('common.beforeDelTip'),
      onOk: async () => {
        try {
          const { code, msg } = await del(selectKeys);
          if (code === 200) {
            setSelectedRowKeys([]);
            createMessage.success(msg);
            reload();
          }
        } catch (e) {
          setSelectedRowKeys([]);
          reload();
        }
      },
    });
  }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'icon-ym icon-ym-btn-preview',
        onClick: handleEdit.bind(null, record),
        // auth: 'btn_detail',
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: onDelete.bind(null, record.Id),
          // auth: 'btn_remove',
        },
      },
    ];
  }

  function handleEdit(record) {
    openApplyPop(true, {
      type: 'edit',
      list: [record],
    });
  }

  async function onDelete(id) {
    const { code, msg } = await del(id);
    if (code === 200) {
      createMessage.success(msg);
      reload();
    }
  }
</script>

<style lang="less" scoped>
  :deep(.icon-ym) {
    font-size: 18px;
  }
</style>
