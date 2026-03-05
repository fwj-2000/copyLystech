<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :showCancelBtn="true"
    title="CPK仓位代码维护"
    :destroyOnClose="true"
    :ok-text="t('common.submit')"
    :confirmLoading="loading"
    class="h-full"
    @ok="handleSubmit">
    <template #centerToolbar>
      <a-button class="mx-12px" :loading="loading" v-if="true" @click="handleSubmit" type="primary">{{ t('common.submit') }} </a-button>
    </template>
    <Grid class="h-full" style="height: calc(100% - 50px)">
      <template #action="{ row, rowIndex }">
        <TableAction outside :actions="getAction(row, rowIndex)" />
      </template>
    </Grid>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { nextTick, reactive, toRefs } from 'vue';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';
  import { getAddColumns } from '../config';
  import { cloneDeep } from 'lodash-es';
  import { ActionItem, TableAction } from '/@/components/Table';
  import { buildUUID } from '/@/utils/uuid';
  import { postCpkPositionCodeSave, postCpkPositionCodeUpdate } from '/@/api/qualityAssurance/cpk';
  import { isEmpty } from '/@/utils/is';

  const emit = defineEmits(['register', 'reload']);

  const { t } = useI18n();
  const { createMessage } = useMessage();

  const state = reactive({
    loading: false,
    mode: 'add',
    data: { id: '' },
  });

  const { loading } = toRefs(state);

  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);

  const [Grid, { loadData, reloadData, getDataSource, reloadColumn, setGridOptions }] = useVbenVxeGrid({
    gridOptions: {
      id: 'qualityAssurance-cpk-cpkPositionCode-addPopup',
      showIndexColumn: true,
      columns: getAddColumns as any,
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      editRules: {
        factory: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
        sapFactory: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
        locationType: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
        productType: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
        workOrderType: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
        locationCode: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
        locFactoryCode: [{ required: true, message: t('dict.CommonCol.enterRequiredFields') }],
      },
      toolbarConfig: {
        enabled: true,
      },
      pagerConfig: {
        enabled: false,
      },
      keyboardConfig: {
        isClip: true, // 是否开启复制粘贴
        isEdit: true, // 是否开启任意键进入编辑（功能键除外）
        isDel: true, // 是否开启删除键功能
        isEsc: true, // 是否开启Esc键关闭编辑功能
      },
      clipConfig: {
        isPaste: true,
        // beforePasteMethod: handleBeforePaster,
      },
      i18nConfig: {
        moduleCode: 'CPKPositionCode',
      },
    },
  });

  const rowData = {
    factory: '',
    workOrderType: '',
    isTag: 0,
    isTagName: '否',
  };

  async function init(data) {
    state.mode = 'add';
    console.log('🚀 ~ init ~ data: ', isEmpty(data), data);
    if (isEmpty(data)) {
      // 新增
      const columns = getAddColumns as any;
      setGridOptions({
        columns,
      });
      reloadData([cloneDeep(rowData)]);
    } else {
      state.mode = 'edit';
      state.data = data[0];
      // 禁用操作列
      const columns = getAddColumns.filter(item => item.field !== 'action') as any;
      setGridOptions({
        columns,
      });
      await nextTick();
      reloadData(data);
    }
  }

  function handleSubmit() {
    const datalist = getDataSource();
    console.log('🚀 ~ handleSubmit ~ datalist: ', datalist);
    const valid = validateParams(datalist);
    if (valid) {
      if (state.mode === 'add') {
        postCpkPositionCodeSave(datalist).then(({ code, msg }) => {
          if (code == 200) {
            createMessage.success(msg);
            emit('reload');
            closePopup();
          }
        });
      } else {
        postCpkPositionCodeUpdate({ ...datalist[0], id: state.data.id }).then(({ code, msg }) => {
          if (code === 200) {
            createMessage.success(msg);
            emit('reload');
            closePopup();
          }
        });
      }
    }
  }

  function validateParams(list) {
    let flag = true;
    try {
      list.forEach((item, index) => {
        if (!item.factory) {
          throw new Error(`第${index + 1}行请选择工厂`);
        }
        if (!item.workOrderType) {
          throw new Error(`第${index + 1}行请输入工单类型`);
        }
      });
    } catch (e) {
      createMessage.error(e.message);
      flag = false;
    }

    return flag;
  }

  function getAction(row): ActionItem[] {
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
        // auth: 'btn_remove',
        modelConfirm: {
          onOk: handleChangeTable.bind(null, 'delete', row),
        },
      },
    ];
  }

  async function handleChangeTable(type, row) {
    const fullData = getDataSource();
    const data = cloneDeep(fullData);
    const findIndex = fullData.findIndex(item => item.uuid === row.uuid);
    if (type === 'addBaseIndex') {
      // 新增
      data.splice(findIndex + 1, 0, { ...rowData, uuid: buildUUID() });
      loadData(data);
    } else if (type === 'copy') {
      // 复制
      const copyData = cloneDeep(fullData[findIndex]);
      delete copyData.id;
      data.splice(findIndex + 1, 0, {
        ...copyData,
        uuid: buildUUID(),
      });
      loadData(data);
    } else if (type === 'delete') {
      // 删除
      data.splice(findIndex, 1);
      // remove(row);
      loadData(data);
    }
  }
</script>

<style lang="less" scoped>
  :deep(.scrollbar__view) {
    height: 100%;

    & > div {
      height: 100%;
    }
  }

  :deep(.scroll-container) {
    height: 100%;
  }

  :deep(.ant-spin-nested-loading) {
    height: 100%;
  }

  :deep(.ant-spin-container) {
    height: 100%;
  }
</style>
