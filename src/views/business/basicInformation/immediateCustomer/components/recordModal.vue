<template>
  <BasicModal
    v-bind="$attrs"
    :width="900"
    :height="600"
    :title="t('dict.PartNumberApplyColumn.record')"
    destroyOnClose
    class="batch-modal"
    :showOkBtn="false"
    @register="registerModal">
    <div style="height: 500px">
      <Grid />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { nextTick } from 'vue';
  import { recordColumns } from '../config';
  import { useI18n } from '/@/hooks/web/useI18n';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const emit = defineEmits(['reload']);
  const { t } = useI18n();

  const [registerModal] = useModalInner(init);

  const [Grid, gridApi] = useVbenVxeGrid({
    formOptions: undefined,
    gridOptions: {
      // @ts-ignore
      treeConfig: false,
      mouseConfig: {
        area: false,
      },
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      columns: recordColumns,
      keyboardConfig: {
        isBack: false,
      },
      pagerConfig: {
        enabled: false,
        autoHidden: false,
      },
      toolbarConfig: {
        refresh: false,
        custom: false,
      },
      position: 'modal',
    },
  });

  /**
   * @description 初始化修改记录
   * @param data 修改数据列表
   */
  function init(data: Array<{ originDatas: { [key: string]: any }; modifyDatas: { [key: string]: any }; modifyDateTime: string; modifyUserName: string }>) {
    nextTick(() => {
      const [list, mergeCells] = formatData(data);
      gridApi.grid.reloadData(list);
      setTimeout(gridApi.grid.setMergeCells, 0, mergeCells);
    });
  }

  /**
   * 获取格式话之后的数据并且计算应该合并单元格
   * @param data
   */
  function formatData(
    data: Array<{ originDatas: { [key: string]: any }; modifyDatas: { [key: string]: any }; modifyDateTime: string; modifyUserName: string }>,
  ) {
    const originList = Array.isArray(data) ? data : [];
    const list: Array<any> = [];
    const mergeCells: Array<{ row: number; col: number; rowspan: number; colspan: number }> = [];
    let rowIndex = 0;
    originList.forEach((item, index) => {
      const keys = Object.keys(item.originDatas);
      list.push(
        ...(keys.length === 0
          ? [
              {
                modifyUserName: item.modifyUserName,
                modifyDateTime: item.modifyDateTime,
                field: '',
                oldValue: '',
                newValue: '',
                _id: index,
              },
            ]
          : keys.map(key => ({
              modifyUserName: item.modifyUserName,
              modifyDateTime: item.modifyDateTime,
              field: key,
              oldValue: item.originDatas[key],
              newValue: item.modifyDatas[key],
              _id: index,
            }))),
      );

      if (keys.length > 1) {
        mergeCells.push(
          {
            row: rowIndex,
            col: 1,
            rowspan: keys.length,
            colspan: 1,
          },
          {
            row: rowIndex,
            col: 2,
            rowspan: keys.length,
            colspan: 1,
          },
        );
      }
      rowIndex += keys.length || 1;
    });
    return [list, mergeCells];
  }
</script>
