<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    v-loading="btnLoading"
    :okText="t('common.submit')"
    :title="getTitle"
    destroyOnClose
    @ok="handleSaveFn"
    class="full-popup">
    <div class="h-full p-10px">
      <Subtitle :title="t('人员登记')" />
      <Grid style="height: calc(100% - 74px)">
        <template #action="{ rowIndex, row }">
          <TableAction outside :actions="getAction(row)" />
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>
<script lang="ts" setup>
  import { ref, nextTick, unref, computed } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { addColumn, ADD_TABLE_ROW_DATA } from '../config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addCrossBgSupport, updateCrossBgSupport } from '/@/api/hr/personRegistration';
  import { cloneDeep } from 'lodash-es';
  import { getuserlistselector } from '/@/api/qms/personnelArrangementOptimiz';
  import { buildUUID } from '/@/utils/uuid';
  import { TableAction } from '/@/components/Table';
  import Subtitle from '/@/components/Subtitle/src/Subtitle.vue';
  const { t } = useI18n();

  const emits = defineEmits(['register', 'reload']);

  const btnLoading = ref(false);

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const { createMessage } = useMessage();
  const state = ref<any>({});
  const type = ref('add');
  let Drop: any = {};
  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions: {
      id: 'engineering-clientRollout-shipmentData-maintainCQEList',
      columns: addColumn(Drop) as any,
      i18nConfig: {
        moduleCode: 'NpiShipmentOnlineColumn',
      },
      toolbarConfig: {
        enabled: false,
      },
      pagerConfig: {
        autoHidden: true,
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      editRules: {
        position: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
        deptLevel04: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
        deptLevel05: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
        employeeGroup: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
        employeeType: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
        auditUserId: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
        startDate: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
        endDate: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
        supportType: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
        supportSubType2: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
        targetBg: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
        targetPlant: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
        handoverType: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
        costTransferFlag: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
      },
      position: 'modal',
    },
  });

  const getTitle = computed(() => (type.value == 'edit' ? t('common.edit') : t('common.add2Text')));
  async function init({ DropDownList, record }) {
    Drop = unref(DropDownList);
    let newColumn = addColumn(Drop);
    newColumn.forEach((item: any) => {
      if (record.id && (item.field == 'employeeId' || item.field == 'auditUserId')) {
        if (item.field == 'employeeId') {
          item.field = 'employeeName';
        }
        if (item.field == 'auditUserId') {
          item.field = 'auditUserName';
        }
        item.editRender.enabled = !record.id;
        item.editRender.name = 'Input';
      }
    });
    nextTick(async () => {
      if (record.id) {
        // 禁用操作列
        const columns = newColumn.filter(item => item.field !== 'action') as any;
        gridApi.setGridOptions({
          columns: columns as any,
        });
        type.value = 'edit';
        state.value = record;
        gridApi.grid.loadData([state.value]);
      } else {
        gridApi.setGridOptions({
          columns: newColumn as any,
        });
        let { data } = await getuserlistselector({ keyword: '11227909' });
        type.value = 'add';
        ADD_TABLE_ROW_DATA.auditUserName = data.list[0].fullName || '';
        ADD_TABLE_ROW_DATA.auditUserId = data.list[0].id || '';
        gridApi.grid.loadData([cloneDeep(ADD_TABLE_ROW_DATA)]);
      }
    });
  }
  function getAction(row) {
    return [
      {
        icon: 'icon-ym icon-ym-btn-add',
        onClick: handleChangeTable.bind(null, 'addBaseIndex', row),
      },
      {
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleChangeTable.bind(null, 'copy', row),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleChangeTable.bind(null, 'delete', row),
        },
      },
    ];
  }
  async function handleChangeTable(type, row) {
    const fullData = gridApi.getDataSource();
    const data = cloneDeep(fullData);
    const findIndex = fullData.findIndex(item => item.uuid === row.uuid);
    if (type === 'addBaseIndex') {
      // 新增
      data.splice(findIndex + 1, 0, { ...cloneDeep(ADD_TABLE_ROW_DATA), uuid: buildUUID() });
      gridApi.loadData(data);
    } else if (type === 'copy') {
      // 复制
      const copyData = cloneDeep(fullData[findIndex]);
      delete copyData.id;
      data.splice(findIndex + 1, 0, {
        ...copyData,
        uuid: buildUUID(),
      });
      gridApi.loadData(data);
    } else if (type === 'delete') {
      // 删除
      data.splice(findIndex, 1);
      gridApi.loadData(data);
    }
  }
  // 点击提交
  async function handleSaveFn() {
    if (await gridApi.validate(true)) {
      createMessage.warning(t('dict.CommonCol.enterRequiredFields'));
      return;
    }

    const dataList = type.value == 'add' ? gridApi.getDataSource() : gridApi.getDataSource()[0];
    changeLoading(true);
    let api = type.value == 'add' ? addCrossBgSupport : updateCrossBgSupport;
    const { code, msg } = await api(dataList).finally(() => {
      changeLoading(false);
    });
    if (code === 200) {
      createMessage.success(msg);
      emits('reload');
      closePopup();
      return;
    }
    createMessage.error(msg);
  }
</script>
