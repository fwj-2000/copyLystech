<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="true"
    :showCancelBtn="true"
    :okText="t('common.submitText')"
    :title="t('common.add')"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup">
    <template #insertToolbar>
      <a-divider type="vertical" class="ml-10px"></a-divider>
    </template>
    <div class="h-full popup-container p-10px">
      <Subtitle :title="t('common.addSpec')"></Subtitle>
      <Grid>
        <template #action="{ row, rowIndex }">
          <TableAction outside :actions="getTableActions(row, rowIndex)" />
        </template>
      </Grid>
    </div>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { commonCols } from '../configVxe';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ActionItem, TableAction } from '/@/components/Table';
  import { create, getDetails } from '/@/api/business/material';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { onMounted, ref } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { message } from 'ant-design-vue';
  // import { sortByOrderList } from '../config';
  import { useVbenVxeGrid } from '/@/adapter/vxe-table';

  const { createMessage } = useMessage();

  const emits = defineEmits(['reload']);
  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  const { t } = useI18n();
  const columns = ref<any>([]);
  onMounted(() => {
    const editKeys = ['MaterialLength', 'MaterialWidth', 'MaterialSpec', 'MaterialDesc'];
    const _c = cloneDeep(commonCols)
      .filter(el => el.field !== 'MaterialCode')
      .map(el => {
        if (editKeys.includes(el.field)) {
          // @ts-ignore
          el.editRender = {
            name: el.field === 'MaterialLength' || el.field === 'MaterialWidth' ? 'InputNumber' : 'Input',
            props: {
              onChange: (_v, { row }) => {
                handleEditChange({
                  value: row[el.field],
                  record: row,
                  column: { field: el.field },
                });
              },
            },
          };
        }
        return el;
      })
      .sort((a, b) => {
        // 对columns进行排序，顺序为: `材料长度`、`材料宽度`、`总厚度`、`厚度单位`、`材料规格`、`材料描述`、`材料归属`，其余不变
        const orderList = [
          'MaterialWidth',
          'MaterialLength',
          'TotalThickness',
          'ThicknessUnit',
          'MaterialSpec',
          'MaterialDesc',
          'MaterialAreaName',
          'MaterialDesc',
        ];
        const indexA = orderList.indexOf(a.field);
        const indexB = orderList.indexOf(b.field);
        if (indexA === -1 && indexB === -1) {
          return 0;
        } else if (indexA === -1) {
          return 1;
        } else if (indexB === -1) {
          return -1;
        } else {
          return indexA - indexB;
        }
      });
    columns.value = [
      {
        title: t('component.table.index'),
        type: 'seq',
        width: '50',
        align: 'center',
      },
      { title: '材料内部料号前11位', field: 'MaterialCodeEleven', width: '180' },
      {
        title: '材料内部料号后四位',
        width: '120',
        field: 'MaterialNumber',
        // editRow: true,
        // editComponent: 'Input',
        // editComponentProps: {
        //   minlength: 4,
        //   onblur: e => {
        //     const val = e.srcElement || e.target;
        //     if (val.value.length < 4) {
        //       message.info(t('common.materaiFourBack'));
        //     }
        //   },
        // },
        editRender: {
          name: 'Input',
          props: {
            minlength: 4,
            onblur: e => {
              const val = e.srcElement || e.target;
              if (val.value.length < 4) {
                message.info(t('common.materaiFourBack'));
              }
            },
            onChange: (_v, { row }) => {
              handleEditChange({
                value: row['MaterialNumber'],
                record: row,
                column: { field: 'MaterialNumber' },
              });
            },
          },
        },
      },
    ]
      .concat(_c as any)
      .concat([
        // 操作列
        {
          title: t('common.action'),
          width: '80',
          field: 'action',
          fixed: 'right',
          slots: {
            default: 'action',
          },
        },
      ]);
  });

  const [Grid, gridApi] = useVbenVxeGrid({
    showSearchForm: false,
    gridOptions: {
      columns: commonCols as any,
      rowConfig: {
        keyField: '_X_ROW_KEY',
      },
      editConfig: {
        trigger: 'dblclick',
        mode: 'row',
      },
      pagerConfig: {
        autoHidden: true,
      },
      toolbarConfig: {
        enabled: false,
      },
      clipConfig: {
        isPaste: true,
        afterPasteMethod: handleAfterPaster,
      },
      areaConfig: {
        multiple: true, // 是否启用多区域选取功能
      },
      i18nConfig: {
        moduleCode: 'MaterialWarehouseColumn',
      },
      position: 'modal',
    },
  });

  // async function init(data) {
  //   changeLoading(true);
  //   gridApi.reloadColumn(columns.value);
  //   try {
  //     const r = await getDetails(data.ids);
  //     if (r.code == 200) {
  //       gridApi.reloadData(
  //         r.data.map(item => {
  //           item = {
  //             ...item,
  //             // rowKey: Date.now() + Math.floor(Math.random() * 1000),
  //             onEdit: true,
  //             editable: true,
  //             disabled: {
  //               MaterialFormEnCode: true,
  //             }
  //           };
  //           return item;
  //         }),
  //       );
  //     }
  //   } catch (error) {
  //     closePopup();
  //   }
  //   changeLoading(false);
  // }

  async function init(data) {
    changeLoading(true);
    gridApi.reloadColumn(columns.value);
    try {
      const r = await getDetails(data.ids);
      if (r.code === 200) {
        gridApi.reloadData(r.data || []);
      }
    } catch (error) {
      console.error('🚀 ~ DetailPopupVxe.vue:218 ~ init ~ error:', error);
      closePopup();
    } finally {
      changeLoading(false);
    }
  }

  // function getTableActions(record, index): ActionItem[] {
  //   return [
  //     {
  //       icon: 'ym-diecut ym-diecut-file-copy',
  //       onClick: handleCopy.bind(null, record, index),
  //     },
  //     {
  //       icon: 'icon-ym icon-ym-delete',
  //       onClick: handleDelete.bind(null, record),
  //     },
  //   ];
  // }

  function getTableActions(record): ActionItem[] {
    return [
      {
        icon: 'ym-diecut ym-diecut-file-copy',
        onClick: () => handleCopy(record),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: () => handleDelete(record),
      },
    ];
  }

  function handleDelete(row: any) {
    gridApi.remove(row);
  }

  function handleCopy(record) {
    const copy = cloneDeep(record);
    delete copy._X_ROW_KEY;
    gridApi.grid.insertAt(copy, record);
  }

  function handleEditChange({ value, record, column }) {
    const { field } = column;

    // 如果`长度`，`宽度`，`材料内部料号后四位`，自动计算`材料规格`的值
    if (field === 'MaterialNumber') {
      // 如果是材料内部料号后四位发生了改变，自动赋值给宽度
      const number = value ? value.toString().match(/(\d+)/)[0] : '';
      gridApi.grid.setRow(record, { MaterialWidth: +number });
    }
    ['MaterialLength', 'MaterialWidth', 'MaterialNumber'].includes(field) && setMaterialSpec(record);
  }

  /**
   * @description 根据行数据的内容，自动计算设置`材料规格`的值
   * @param record 表格行数据
   */
  function setMaterialSpec(record: any) {
    const { MaterialLength, MaterialWidth, TotalThickness, ThicknessUnit } = record;
    gridApi.grid.setRow(record, { MaterialSpec: `${+MaterialWidth || 0}MM*${+MaterialLength || 0}M*${+TotalThickness || 0}${ThicknessUnit}` });
  }

  async function handleSubmit() {
    changeOkLoading(true);
    let isvalid = true;
    const params = gridApi.getDataSource().map(item => {
      if (item.MaterialNumber?.length < 4) {
        isvalid = false;
      }
      return {
        SourceId: item.Id,
        MaterialNumber: item.MaterialNumber,
        MaterialLength: item.MaterialLength,
        MaterialWidth: item.MaterialWidth,
        MaterialSpec: item.MaterialSpec,
        MaterialDesc: item.MaterialDesc,
        OriginalModelNumber: item.OriginalModelNumber,
      };
    });
    if (!isvalid) {
      return message.info(t('common.materaiFourBack'));
    }
    try {
      const r = await create(params);
      if (r.code == 200) {
        createMessage.success(t('sys.api.operationSuccess'));
        closePopup();
        emits('reload');
      }
      changeOkLoading(false);
    } catch (error) {
      console.error('🚀 ~ DetailPopupVxe.vue:254 ~ handleSubmit ~ error:', error);
      changeOkLoading(false);
    }
  }

  function handleAfterPaster({ targetAreas }) {
    if (targetAreas.length === 0) {
      return false;
    }
    const { cols, rows } = targetAreas[0];

    cols.forEach((col: any) => {
      rows.forEach((row: any) => {
        handleEditChange({
          value: row[col.field],
          record: row,
          column: col,
        });
      });
    });
  }
</script>

<style scoped lang="less">
  .popup-container {
    display: flex;
    flex-direction: column;
  }

  :deep(.lydc-basic-popup-header) {
    padding-left: 12px;
  }
</style>
