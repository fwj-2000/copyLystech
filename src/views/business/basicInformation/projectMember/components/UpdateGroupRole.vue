<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :okText="t('common.submitText')"
    :title="t('common.editText')"
    destroyOnClose
    class="full-popup top-0"
    @ok="handleSave">
    <div class="member-pop h-full">
      <Grid />
    </div>
  </BasicPopup>
</template>

<script lang="ts" setup>
  import { reactive, ref, nextTick } from 'vue';
  import { useVbenVxeGrid, VxeGridProps } from '/@/adapter/vxe-table';
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { getProjectMembersSonConfig, updateProjectMembers, getProjectMembersDetails } from '/@/api/business/projectMember';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { setTableList, setDynamicTitle, beforeSaveFormat } from '../utils';
  import { commonCols, pdtCols } from './tableConfig';
  import { handleAfterPasteMethod, isDynamicUserSelectColumn } from './paster';

  const { createMessage } = useMessage();

  const { t } = useI18n();

  // commonCols 的 field列禁止粘贴
  const commonColFields = new Set(commonCols.map(c => c.field).filter(Boolean));

  const state = reactive<any>({
    title: t('common.maintianGroup'),
    ids: [],
    teamType: '',
    loading: false,
    column: [],
    initColumn: commonCols,
  });

  type UserHit = { id: string; fullName: string };

  /** 从当前表格里已有的 _dynamic/pdName 缓存出 name->id，用于粘贴匹配 */
  //  优化版
  function buildNameCacheFromGrid(): Map<string, UserHit> {
    const map = new Map<string, UserHit>();
    const rows = getDataSource() || [];

    rows.forEach(row => {
      processDynamicObjects(row, map);
      processPdFields(row, map);
    });

    return map;
  }
  function processDynamicObjects(row: any, map: Map<string, UserHit>): void {
    const dyn = row?._dynamic || {};

    Object.keys(dyn).forEach(key => {
      const obj = dyn[key];
      addUserToMap(obj?.memberName, obj?.memberId, map);
    });
  }
  function processPdFields(row: any, map: Map<string, UserHit>): void {
    addUserToMap(row?.pdName, row?.pdId, map);
  }
  function addUserToMap(name: any, id: any, map: Map<string, UserHit>): void {
    if (!name || !id) return;

    const trimmedName = String(name).trim();
    const trimmedId = String(id).trim();

    if (trimmedName && trimmedId) {
      map.set(trimmedName, { id: trimmedId, fullName: trimmedName });
    }
  }

  /**
   * 粘贴后处理：
   * - 动态列：xxx_Name -> 回填 xxx (id) + xxx_Name + _dynamic[xxx__obj]
   * - pdName：回填 pdId + pdName
   */
  async function handlePasteEvent({ targetAreas }: any) {
    handleAfterPasteMethod({ targetAreas }, buildNameCacheFromGrid);
  }

  const gridOptions = reactive<VxeGridProps>({
    columns: state.initColumn,
    showIndexColumn: true,
    editConfig: {
      trigger: 'dblclick',
      mode: 'row',
    },
    toolbarConfig: {
      refresh: false,
    },
    customConfig: {
      allowVisible: false,
    },
    pagerConfig: {
      enabled: false,
    },
    keyboardConfig: {
      isClip: true,
      isEdit: true,
      isDel: true,
      isEsc: true,
    },
    keepSource: true,
    rowConfig: {
      keyField: '_X_ROW_KEY',
    },
    clipConfig: {
      isPaste: true,
      beforePasteMethod: ({ targetAreas }: any) => {
        if (!targetAreas?.length) return false;
        // 只禁止 commonCols；其它全部放行
        for (const area of targetAreas) {
          for (const col of area.cols) {
            if (commonColFields.has(col.field)) {
              createMessage.warning('基础信息列不允许粘贴');
              return false;
            }
          }
        }
        return true;
      },
      afterPasteMethod: handlePasteEvent,
    },
    position: 'modal',
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    gridOptions,
    gridEvents: {
      headerCellDblclick: ({ column }) => {
        // 非可编辑列不处理
        if (!column.editRender) {
          return;
        }
        const tableData = gridApi.getDataSource();
        if (tableData.length <= 1) return;
        const firstLine = tableData[0] || '';
        // 如果是动态用户选择列
        if (isDynamicUserSelectColumn(column)) {
          const valueField = column.field.replace('_Name', '');
          const nameField = column.field;
          const value = firstLine[valueField];
          const name = firstLine[nameField];
          for (let i = 1; i < tableData.length; i++) {
            const row = tableData[i];
            row[valueField] = value || '';
            row[nameField] = name;
            const kName = valueField + '__obj';
            row._dynamic = {
              ...row._dynamic,
              [kName]: {
                configColumnName: column.title,
                configType: valueField,
                memberId: value || '',
                memberName: name,
              },
            };
          }
          return;
        }
        if (column.field === 'pdName') {
          const pdId = firstLine.pdId;
          const pdName = firstLine.pdName;
          for (let i = 1; i < tableData.length; i++) {
            const row = tableData[i];
            row.pdId = pdId || '';
            row.pdName = pdName;
          }
          return;
        }
        const value = firstLine.productionType;
        for (let i = 1; i < tableData.length; i++) {
          const row = tableData[i];
          row.productionType = value || '';
        }
      },
    },
  });
  const { reloadColumn, reloadData, getDataSource } = gridApi;

  const [registerPopup, { changeOkLoading, closePopup }] = usePopupInner(init);

  async function init(data: any) {
    state.ids = data.ids || [];
    state.teamType = data.teamType;
    state.mainProcess = data.mainProcess;

    await getDyamicTitleByMainProcess();
    await getDetail();

    // 进入后做一次尺寸稳定，减少“慢慢收缩”感
    await nextTick();
    gridApi.grid.recalculate?.(true);
  }

  async function getDetail() {
    state.loading = true;
    try {
      const params: any = {
        mainProcess: state.mainProcess,
        teamType: state.teamType,
      };
      const r = await getProjectMembersDetails(state.ids, params);
      const d = setTableList(r.data, { editable: true, tableView: false });
      const _data = r.data?.length ? d : [{}];
      reloadData(_data);
    } finally {
      state.loading = false;
    }
  }

  function setInitVal(sourceList: any[]) {
    const d = setDynamicTitle(sourceList);
    const _commonCol = cloneDeep(state.initColumn);
    _commonCol.splice(0, 1);
    let _column = _commonCol.concat(d.column);
    if (state.teamType == '2') {
      _column.splice(6, 0, ...pdtCols);
    }
    reloadColumn(_column);
  }

  async function getDyamicTitleByMainProcess() {
    const res = await getProjectMembersSonConfig({
      mainProcess: state.mainProcess,
      teamType: state.teamType,
    });
    const { data } = res;
    setInitVal(
      data.reduce((pre: any[], cur: any) => {
        return pre.concat(cur.configList);
      }, []),
    );
  }

  const emit = defineEmits(['reload', 'error', 'register']);
  const submitting = ref(false);

  async function handleSave() {
    if (submitting.value) return;
    submitting.value = true;
    changeOkLoading(true);
    try {
      const list = beforeSaveFormat(cloneDeep(getDataSource()));
      await updateProjectMembers(list);
      createMessage.success(t('sys.api.operationSuccess'));
      emit('reload');
      closePopup();
    } catch (e) {
      emit('error', e);
      createMessage.error(t('sys.api.operationFailed'));
    } finally {
      changeOkLoading(false);
      submitting.value = false;
    }
  }
</script>

<style lang="less" scoped>
  .member-pop {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    padding-bottom: 10px;
    padding-right: 10px;
    padding-left: 10px;
  }
</style>
