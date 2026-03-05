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
    <ScrollContainer class="p-10px">
      <Subtitle :title="t('common.addSpec')"></Subtitle>
      <BasicTable :columns="columns" @register="registerTable" @edit-change="handleEditChange">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'action'">
            <TableAction :actions="getTableActions(record, index)" />
          </template>
        </template>
      </BasicTable>
    </ScrollContainer>
  </BasicPopup>
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import { commonCols } from '../config';
  import { useMessage } from '/@/hooks/web/useMessage';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { useTable, ActionItem, TableAction } from '/@/components/Table';
  import { create, getDetails } from '/@/api/business/material';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { formatTableDefaultText } from '/@/utils';
  import { onMounted, ref } from 'vue';
  import { cloneDeep } from 'lodash-es';
  import { message } from 'ant-design-vue';
  // import { sortByOrderList } from '../config';

  const { createMessage } = useMessage();

  const emits = defineEmits(['reload']);
  const [registerPopup, { closePopup, changeLoading, changeOkLoading }] = usePopupInner(init);

  const { t } = useI18n();
  const columns = ref<any>([]);
  onMounted(() => {
    const editKeys = ['MaterialLength', 'MaterialWidth', 'MaterialSpec'];
    const _c = cloneDeep(commonCols)
      .filter(el => el.dataIndex !== 'MaterialCode')
      .map(el => {
        if (editKeys.includes(el.dataIndex)) {
          el.editRow = true;
          el.editComponent = el.dataIndex === 'MaterialSpec' ? 'Input' : 'InputNumber';
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
        const indexA = orderList.indexOf(a.dataIndex as string);
        const indexB = orderList.indexOf(b.dataIndex as string);
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
      { title: '材料内部料号前11位', dataIndex: 'MaterialCodeEleven' },
      {
        title: '材料内部料号后四位',
        dataIndex: 'MaterialNumber',
        editRow: true,
        editComponent: 'Input',
        editComponentProps: {
          minlength: 4,
          onblur: e => {
            const val = e.srcElement || e.target;
            if (val.value.length < 4) {
              message.info(t('common.materaiFourBack'));
            }
          },
        },
      },
    ].concat(_c);
  });
  const [registerTable, { setTableData, getDataSource, deleteTableDataRecord, insertTableDataRecord, updateTableData }] = useTable({
    pagination: false,
    showTableSetting: false,
    striped: true,
    canResize: true,
    rowKey: 'Id',
    resizeHeightOffset: 20,
    actionColumn: {
      title: t('common.action'),
      dataIndex: 'action',
      width: 130,
    },
    transformCellText: ({ text }) => formatTableDefaultText(text),
    i18nConfig: {
      moduleCode: 'MaterialWarehouseColumn',
    },
  });

  async function init(data) {
    changeLoading(true);
    try {
      const r = await getDetails(data.ids);
      if (r.code == 200) {
        setTableData(
          r.data.map(item => {
            item = {
              ...item,
              onEdit: true,
              editable: true,
              disabled: {
                MaterialFormEnCode: true,
              },
            };
            return item;
          }),
        );
      }
    } catch (error) {
      console.error('🚀 ~ DetailPopup.vue:142 ~ init ~ error:', error);
      closePopup();
    }
    changeLoading(false);
  }

  function getTableActions(record, index): ActionItem[] {
    return [
      {
        icon: 'ym-diecut ym-diecut-file-copy',
        onClick: handleCopy.bind(null, record, index),
      },
      {
        icon: 'icon-ym icon-ym-delete',
        onClick: handleDelete.bind(null, record.id),
      },
    ];
  }
  function handleDelete(id = '') {
    deleteTableDataRecord(id);
  }
  function handleCopy(record, index) {
    insertTableDataRecord({ ...record }, index + 1);
  }

  function handleEditChange({ value, record, column, index }) {
    const { dataIndex } = column;

    // 如果`长度`，`宽度`，`材料内部料号后四位`，自动计算`材料规格`的值
    if (dataIndex === 'MaterialNumber') {
      // 如果是材料内部料号后四位发生了改变，自动赋值给宽度
      const number = value ? value.toString().match(/(\d+)/)[0] : '';
      updateTableData(index, 'MaterialWidth', +number);
    }
    ['MaterialLength', 'MaterialWidth', 'MaterialNumber'].includes(dataIndex) && setMaterialSpec(record, index);
  }

  /**
   * @description 根据行数据的内容，自动计算设置`材料规格`的值
   * @param record 表格行数据
   * @param index 表格行索引
   */
  function setMaterialSpec(record: any, index: number) {
    const { MaterialLength, MaterialWidth, TotalThickness, ThicknessUnit } = record;
    updateTableData(index, 'MaterialSpec', `${+MaterialWidth || 0}M*${+MaterialLength || 0}MM*${+TotalThickness || 0}${ThicknessUnit}`);
  }

  async function handleSubmit() {
    changeOkLoading(true);
    let isvalid = true;
    const params = getDataSource().map(item => {
      if (item.MaterialNumber.length < 4) {
        isvalid = false;
      }
      return {
        SourceId: item.Id,
        MaterialNumber: item.MaterialNumber,
        MaterialLength: item.MaterialLength,
        MaterialWidth: item.MaterialWidth,
        MaterialSpec: item.MaterialSpec,
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
      console.error('🚀 ~ DetailPopup.vue:216 ~ handleSubmit ~ error:', error);
      changeOkLoading(false);
    }
  }
</script>
