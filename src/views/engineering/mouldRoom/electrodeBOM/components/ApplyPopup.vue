<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :okText="t('common.submitText')"
    destroyOnClose
    :cancelText="t('common.cancel')"
    :title="handleTyle === 'add' ? t('common.add2Text') : t('common.editText')"
    :showOkBtn="false"
    class="full-popup pb-10px top-0">
    <template #appendToolbar>
      <a-button type="primary" class="mx-12px" @click="handleSaveAction()">{{ t('common.submitText') }}</a-button>
    </template>
    <ScrollContainer>
      <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
        <div class="title-stick">
          <div class="gun"></div>
          <div class="title">{{ t('common.baseinfo') }}</div>
        </div>
        <BasicForm @register="registerBasicInfoForm"> </BasicForm>
      </a-card>

      <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
        <div class="title-box">
          <div class="title-stick">
            <div class="gun"></div>
            <div class="title">{{ t('dict.CommonCol.electrodeInfo') }}</div>
          </div>
          <!-- 添加行 -->
          <AddCustomRows @submit="handleAddColumn" />
        </div>
        <Grid style="height: auto">
          <template #action="{ row, $rowIndex }">
            <TableAction outside :actions="getActions(row, $rowIndex)" />
          </template>
        </Grid>
      </a-card>
    </ScrollContainer>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { nextTick, ref } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { BasicForm, useForm } from '/@/components/Form';
  import { ScrollContainer } from '/@/components/Container';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { electrodebomDetail, electrodebom } from '/@/api/engineering/mould';
  import { TableAction } from '/@/components/Table';
  import { detailFormSchemas, ElectrodeInfoColumn, ELECTRODE_TABLE_ROW_DATA } from '../config';
  import { buildUUID } from '/@/utils/uuid';
  import { AddCustomRows } from '/@/components/AddCustomRows';
  import { cloneDeep } from 'lodash-es';
  import { useBaseStore } from '/@/store/modules/base';

  const baseStore = useBaseStore();
  const { t } = useI18n();
  const emit = defineEmits(['reload', 'register']);

  const { createMessage } = useMessage();

  const [registerBasicInfoForm, { setFieldsValue, validateFields }] = useForm({
    schemas: detailFormSchemas,
    layout: 'vertical',
    labelWidth: 220,
    baseColProps: {
      span: 6,
    },
    i18nConfig: {
      moduleCode: 'ElectrodeBomColumn',
      transferRange: ['placeholder', 'label'],
    },
  });

  const [Grid, GridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-mouldRoom-electrodeBOM-electrodelist',
      showIndexColumn: true,
      columns: ElectrodeInfoColumn,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      minHeight: 320,
      mouseConfig: {
        area: true, // 是否开启区域选取
      },
      areaConfig: {
        multiple: true, // 是否启用多区域选取功能
      },
      keyboardConfig: {
        isClip: true, // 是否开启复制粘贴
        isEdit: true, // 是否开启任意键进入编辑（功能键除外）
        isDel: true, // 是否开启删除键功能
        isEsc: true, // 是否开启Esc键关闭编辑功能
      },
      pagerConfig: {
        autoHidden: true,
      },
      toolbarConfig: {
        enabled: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      i18nConfig: {
        moduleCode: 'ElectrodeBomColumn',
      },
    },
  });

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  function getActions(row, index) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-add text-orange-400 cursor-pointer mx-1',
        tooltip: t('common.add2Text'),
        onClick: handleChangeTable.bind(null, 'addBaseIndex', row, index),
      },
      {
        icon: 'icon-ym icon-ym-btn-copy text-orange-400 cursor-pointer mx-1',
        tooltip: t('common.copy'),
        onClick: handleChangeTable.bind(null, 'copy', row, index),
      },
      {
        icon: 'icon-ym icon-ym-delete text-orange-400 cursor-pointer mx-1',
        tooltip: t('common.delText'),
        onClick: handleChangeTable.bind(null, 'delete', row, index),
      },
    ];
  }

  function handleChangeTable(type: 'add' | 'update' | 'copy' | 'delete' | 'addBaseIndex', row, index) {
    const tableData = GridApi.getDataSource();
    switch (type) {
      case 'addBaseIndex':
        const enabledStatus = getEnabledStatusName('1');
        const item = cloneDeep({ ...ELECTRODE_TABLE_ROW_DATA, _X_ROW_KEY: buildUUID(), enabledStatus });
        tableData.splice(index + 1, 0, item);
        GridApi.grid.reloadData(tableData);
        break;
      case 'copy':
        const copyRowData = cloneDeep({ ...row, _X_ROW_KEY: buildUUID(), id: '' });
        tableData.splice(index + 1, 0, copyRowData);
        GridApi.grid.reloadData(tableData);
        break;
      case 'delete':
        GridApi.grid.remove(row);
        break;
      case 'update':
        break;
    }
  }

  const detailId = ref('');
  const handleTyle = ref('');
  const yesOrNoList = ref<any>([]);
  async function init(info) {
    handleTyle.value = info.type;
    yesOrNoList.value = await baseStore.getDictionaryData('enableStatus');
    if (info.type === 'add') {
      // 新增
      detailId.value = '';
      nextTick(() => {
        // 默认启用"是"
        const enabledStatus = getEnabledStatusName('1');
        // GridApi.grid.insertAt(cloneDeep({ ...ELECTRODE_TABLE_ROW_DATA, _X_ROW_KEY: buildUUID(), enabledStatus }), -1);
        const newList = [...GridApi.getDataSource(), cloneDeep({ ...ELECTRODE_TABLE_ROW_DATA, _X_ROW_KEY: buildUUID(), enabledStatus })];
        GridApi.grid.loadData(newList);
      });
    } else {
      // 编辑
      detailId.value = info.bomId;
      changeLoading(true);
      const { data } = await electrodebomDetail({ id: info.bomId });
      changeLoading(false);
      const { moldNo, partNo, electrodeMaterial, electrodeDesigner, totalWeight, totalQuantity, detailList } = data;
      setFieldsValue({ moldNo, partNo, electrodeMaterial, electrodeDesigner, totalWeight, totalQuantity });
      const table = detailList.map(item => {
        return {
          ...item,
          enabledStatus: getEnabledStatusName(item.enabledStatus.toString()),
        };
      });
      GridApi.grid.reloadData(table);
    }
  }

  // 添加行
  const handleAddColumn = n => {
    // 默认启用"是"
    const enabledStatus = getEnabledStatusName('1');
    for (let i = 0; i < n; i++) {
      // GridApi.grid.insertAt(cloneDeep({ ...ELECTRODE_TABLE_ROW_DATA, _X_ROW_KEY: buildUUID(), enabledStatus }), -1);

      const newList = [...GridApi.getDataSource(), cloneDeep({ ...ELECTRODE_TABLE_ROW_DATA, _X_ROW_KEY: buildUUID(), enabledStatus })];
      GridApi.grid.loadData(newList);
    }
  };

  const getEnabledStatusValue = val => {
    const encode = yesOrNoList.value.find(item => item.fullName === val)?.enCode;
    return encode ? Number(encode) : '';
  };
  const getEnabledStatusName = val => {
    return yesOrNoList.value.find(item => item.enCode === val)?.fullName?.toString();
  };

  // 提交
  const handleSaveAction = async () => {
    const values = await validateFields();
    const detailList = GridApi.getDataSource().map(item => {
      return {
        ...item,
        enabledStatus: getEnabledStatusValue(item.enabledStatus),
      };
    });
    const params = {
      id: detailId.value,
      ...values,
      detailList,
    };
    changeLoading(true);
    const { code, msg } = await electrodebom(params).finally(() => {
      changeLoading(false);
    });
    if (code === 200) {
      createMessage.success(msg);
      emit('reload');
      closePopup();
      return;
    }
    createMessage.error(msg);
  };
</script>
<style lang="less" scoped>
  .full-popup {
    ::v-deep(.vxe-table--body-wrapper) {
      height: auto !important;
    }
  }

  .title-stick {
    display: flex;
    align-items: center;

    .gun {
      border-radius: 2px;
      background: #ff7b00;
      width: 2px;
      height: 14px;
      margin-right: 10px;
    }

    .title {
      color: #1a1a1a;
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: 22px; /* 157.143% */
    }

    //&:before {

    //}
    :deep(.ant-upload-list-picture-card-container) {
      width: 250px;
      height: 250px;
    }

    :deep(.ant-upload.ant-upload-select-picture-card) {
      width: 250px;
      height: 250px;
    }

    :deep(.ant-upload) {
      width: 250px;
      height: 250px;
    }
  }

  .title-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
