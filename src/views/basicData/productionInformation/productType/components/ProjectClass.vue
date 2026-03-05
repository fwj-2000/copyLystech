<template>
  <BasicModal
    :width="1000"
    v-bind="$attrs"
    @register="registerModal"
    canFullscreen
    draggable
    :title="t('component.lydc.popupSelect.modalTitle')"
    @ok="handleSubmit"
    destroy-on-close>
    <div style="height: 500px">
      <Grid>
        <template #toolbar-actions>
          <a-space>
            <a-button type="primary" @click="handleAdd"> {{ t('common.add') }} </a-button>
            <a-button danger @click="handleDel"> {{ t('common.delText') }} </a-button>
          </a-space>
        </template>
        <!--        <template #desensitizedDrawingsName="{ row }">-->
        <!--          <div class="table-a" @dblclick="handlePreview(row)">-->
        <!--            {{ row.desensitizedDrawingsName }}-->
        <!--          </div>-->
        <!--        </template>-->

        <template #action="{ row }">
          <TableAction outside :actions="getTableActions(row)" />
        </template>
        <template #action_edit="{ row }">
          <TableAction outside :actions="getEditTableActions(row)" />
        </template>
      </Grid>
    </div>
    <Preview ref="filePreviewRef" />
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicColumn, BasicTable, FormProps, TableAction, useTable } from '/@/components/Table';
  import Preview from '/@/views/basicData/productCodeApply/components/Preview.vue';
  import { ref, unref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { usePermission } from '/@/hooks/web/usePermission';
  import { confirmUpgradeVersion, getPccHandledPage, getPccTomake, postConvertHistoryData } from '/@/api/engineering/pcc';
  import { useBaseStore } from '/@/store/modules/base';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table';
  import { isNullOrUnDef } from '/@/utils/is';
  import { addProjectType, deleteProductType, delProjectClass, getProjectClassPage } from '/@/api/basicData/exchangeRate';
  import { cloneDeep } from 'lodash-es';
  import { message } from 'ant-design-vue';
  import { isEmpty } from 'xe-utils';

  const baseStore = useBaseStore();
  const filePreviewRef = ref<any | null>(null);
  const { t } = useI18n();
  const { createMessage, createConfirm } = useMessage();
  const { hasBtnP } = usePermission();
  const emit = defineEmits(['submit', 'register']);

  const columns = [
    {
      type: 'checkbox',
      field: 'checkbox',
      width: 70,
    },
    // 来源单号
    {
      title: t('dict.PCCColumn.projectClass'),
      field: 'projectClass',
      editRender: {
        name: 'Input',
        props: {
          placeholder: t('dict.PCCColumn.projectClass'),
        },
      },
    },
    {
      title: '操作',
      field: 'action',
      editRender: {},
      slots: {
        default: 'action',
        edit: 'action_edit',
      },
      width: 70,
      fixed: 'right',
    },
  ];

  const [registerModal, { closeModal, changeLoading, changeOkLoading }] = useModalInner(init);

  const [Grid, { getDataSource, reloadData, remove, insertAt, setLoading, reload, getSelectRowKeys, clearSelectedRowKeys }] = useVbenVxeGrid({
    formOptions: {
      collapsed: false,
      showCollapseButton: false,
      submitOnEnter: true,
      commonConfig: {
        componentProps: {},
        labelClass: 'w-0',
      },
      wrapperClass: 'grid grid-cols-4 gap-4',
      schema: getFormConfig(),
    },
    gridOptions: {
      api: getProjectClassPage,
      columns,
      rowConfig: {
        keyField: 'id',
      },
      height: 'auto',
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'CommonCol',
      },
      toolbarConfig: {
        refresh: false,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
        // beforeEditMethod: ({ row }) => {
        //   if (!row.flag) return false;
        //   return true;
        // },
      },
      customConfig: {
        allowVisible: false,
      },
      mouseConfig: {
        area: true, // 是否开启区域选取
      },
      areaConfig: {
        multiple: true, // 是否启用多区域选取功能
      },
      autoClear: false,
      position: 'modal',
      id: 'components-upgrade-modal',
    },
  });

  function handleAdd() {
    const list = getDataSource();
    if (list.some(item => item.flag)) return createMessage.warning('请先保存当前行');
    insertAt({
      projectClass: '',
      flag: true,
    });
  }

  async function handleDel() {
    const rows = getSelectRowKeys();
    if (rows.length === 0) {
      return createMessage.warning(t('common.selectDelDatasTip'));
    } else {
      const delList = rows.filter(item => !item.includes('row'));
      if (rows[0].includes('row')) {
        reloadData(getDataSource().filter(item => !item.flag));
      }
      if (isEmpty(delList)) return;
      createConfirm({
        iconType: 'warning',
        title: t('common.tipTitle'),
        content: t('common.delTip'),
        onOk: async () => {
          try {
            setLoading(true);
            const { code } = await delProjectClass(delList);
            if (code == 200) {
              clearSelectedRowKeys();
              message.success(t('common.delSuccess'));
              setLoading(false);
            }
            reload();
          } catch (e) {
            console.error('🚀 ~ ProjectClass.vue:176 ~ handleDel ~ e:', e);
            clearSelectedRowKeys();
            reload();
            setLoading(false);
          }
        },
      });
    }
  }

  function getTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: () => {
            setLoading(true);
            if (row.flag) {
              reloadData(getDataSource().filter(item => !item.flag));
              setLoading(false);
              return;
            }
            delProjectClass([row.id])
              .then(({ code, msg }) => {
                if (code === 200) {
                  createMessage.success(msg);
                  reload();
                }
              })
              .finally(() => {
                setLoading(false);
              });
          },
        },
      },
    ];
  }

  function getEditTableActions(row) {
    return [
      {
        icon: 'icon-ym icon-ym-success',
        onClick: saveAction.bind(null, row),
      },
    ];
  }

  function saveAction(row) {
    const params = {
      projectClass: row.projectClass,
      id: row.id,
    };
    if (params.id.includes('row')) {
      delete params.id;
    }
    addProjectType([
      {
        ...params,
      },
    ]).then(({ code, msg }) => {
      if (code === 200) {
        createMessage.success(msg);
        reload();
      }
    });
  }

  function getFormConfig(): Partial<FormProps> {
    return [
      {
        fieldName: 'projectClass',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: t('dict.PCCColumn.projectClass'),
        },
      },
    ];
  }
  function init() {
    console.log('init');
    changeLoading(false);
    changeOkLoading(false);
  }
  async function handleSubmit() {
    setLoading(true);

    const rows = getDataSource().map(item => {
      if (item.flag) delete item.id;
      return item;
    });

    addProjectType(rows)
      .then(({ code, msg }) => {
        if (code === 200) {
          createMessage.success(msg);
          reload();
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }
</script>
