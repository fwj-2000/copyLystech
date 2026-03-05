<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content bg-white">
        <Grid>
          <template #toolbar-actions>
            <!-- v-auth="'btn_add'" v-auth="'btn_remove'"-->
            <a-button type="primary" @click="handleApply">
              {{ t('common.add') }}
            </a-button>
          </template>
          <template #action="{ row }">
            <TableAction outside :actions="getTableActions(row)" />
          </template>
        </Grid>
      </div>
    </div>
    <ApplyPop @register="registerApply" @reload="reload" />
  </div>
</template>

<script setup lang="ts">
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { ActionItem, TableAction } from '/@/components/Table';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ApplyPop from './components/ApplyPop.vue';
  import { getList, del } from '/@/api/basicData/moduleRules';
  import { usePopup } from '/@/components/Popup';

  defineOptions({ name: 'basicData-moduleRules' });

  const { createMessage } = useMessage();
  const [registerApply, { openPopup: openApplyPop }] = usePopup();
  const { t } = useI18n();

  const columns = [
    { type: 'checkbox', field: 'checkbox', width: 40 },
    {
      title: '模块编码',
      field: 'ModuleEnCode',
    },
    {
      title: '模块名称',
      field: 'ModuleFullName',
    },
    {
      title: 'ID字段',
      field: 'IDField',
    },
    {
      title: '规则名称',
      field: 'RuleName',
    },
    {
      title: '操作',
      field: 'actions',
      slots: { default: 'action' },
      fixed: 'right',
      width: 70,
    },
  ];

  const searchFormSchema = [
    {
      fieldName: 'keyword',
      component: 'Input',
      componentProps: {
        placeholder: t('dict.BusinessRuleColumn.ModuleEnCode') + '/' + t('dict.BusinessRuleColumn.ModuleFullName'),
        submitOnPressEnter: true,
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
    },
    gridOptions: {
      id: 'basicData-moduleRules-list',
      columns: columns,
      showIndexColumn: true,
      api: getList,
      toolbarConfig: {
        delStatus: true,
      },
      i18nConfig: {
        moduleCode: 'BusinessRuleColumn',
      },
      rowConfig: {
        keyField: 'Id',
      },
    },
  });

  const { reload } = gridApi;

  function handleApply() {
    openApplyPop(true, {});
  }

  // async function handleDel() {
  //   const selectKeys = getSelectRowKeys();
  //   if (selectKeys.length === 0) return createMessage.error(t('common.selectText'));
  //   createConfirm({
  //     iconType: 'warning',
  //     title: t('common.tipTitle'),
  //     content: t('common.beforeDelTip'),
  //     onOk: async () => {
  //       try {
  //         const { code, msg } = await del(selectKeys);
  //         if (code === 200) {
  //           createMessage.success(msg);
  //           reload();
  //         }
  //       } catch (e) {
  //         reload();
  //       }
  //     },
  //   });
  // }

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
