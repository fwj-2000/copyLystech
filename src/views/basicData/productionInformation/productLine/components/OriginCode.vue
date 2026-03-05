<template>
  <BasicModal
    :width="1000"
    v-bind="$attrs"
    @register="registerModal"
    canFullscreen
    draggable
    :showOkBtn="false"
    :title="t('component.lydc.popupSelect.modalTitle')"
    @ok="handleSubmit"
    destroy-on-close>
    <div style="height: 500px">
      <Grid>
        <template #toolbar-actions>
          <a-space>
            <a-button type="primary" @click="handleAdd"> {{ t('common.add') }} </a-button>
          </a-space>
        </template>
        <template #action_edit="{ row }">
          <TableAction outside :actions="getEditTableActions(row)" />
        </template>
      </Grid>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { FormProps, TableAction } from '/@/components/Table';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useBaseStore } from '/@/store/modules/base';
  import { useVbenVxeGrid } from '/@/effects/plugins/vxe-table';
  import { addProductLineCode, getProductLineCodeList } from '/@/api/basicData/productLine';

  const baseStore = useBaseStore();
  const { t } = useI18n();
  const { createMessage } = useMessage();

  const columns = [
    {
      type: 'checkbox',
      field: 'checkbox',
      width: 70,
    },
    // 来源单号
    {
      title: t('dict.CommonCol.productLine'),
      field: 'code',
      editRender: {
        name: 'Input',
        props: {
          placeholder: t('dict.CommonCol.productLine'),
        },
      },
    },
    {
      title: t('dict.MainProcess'),
      field: 'mainProcessEnum',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'mainProcess',
        props: {
          placeholder: t('dict.MainProcess'),
          api: () => baseStore.getDictionaryData('MainProcess', true),
          showSearch: true,
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          immediate: true,
          dynamicDisabled: row => {
            return !row.flag;
          },
        },
      },
    },
    {
      title: '操作',
      field: 'action',
      editRender: {},
      slots: {
        edit: 'action_edit',
      },
      width: 70,
      fixed: 'right',
    },
  ];

  const [registerModal, { changeLoading, changeOkLoading }] = useModalInner(init);

  const [Grid, { getDataSource, insertAt, setLoading, reload }] = useVbenVxeGrid({
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
      api: getProductLineCodeList,
      columns,
      rowConfig: {
        keyField: 'id',
      },
      height: 'auto',
      showIndexColumn: true,
      i18nConfig: {
        moduleCode: 'CommonCol',
      },
      proxyConfig: {
        response: {
          result: 'data.list',
          total: 'data.pagination.Total',
        },
      },
      toolbarConfig: {
        refresh: false,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
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
      code: row.code,
      mainProcess: row.mainProcessEnum,
      id: row.id,
    };
    if (typeof params.id === 'string' && params.id.includes('row')) {
      delete params.id;
    }
    addProductLineCode([
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
        fieldName: 'mainProcess',
        i18nField: 'CommonCol.mainProcess',
        label: '',
        component: 'ApiSelect',
        required: true,
        componentProps: {
          api: () => baseStore.getDictionaryData('MainProcess', true),
          showSearch: true,
          placeholder: '请选择主要制程',
          labelField: 'fullName',
          valueField: 'enCode',
          filterOption: false,
          immediate: true,
        },
      },
      {
        fieldName: 'code',
        label: '',
        component: 'Input',
        componentProps: {
          placeholder: t('dict.CommonCol.productLine'),
        },
      },
    ];
  }
  function init() {
    changeLoading(false);
    changeOkLoading(false);
  }
  function handleSubmit() {
    setLoading(true);

    const rows = getDataSource().map(item => {
      if (item.flag) delete item.id;
      return item;
    });

    addProductLineCode(rows)
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
