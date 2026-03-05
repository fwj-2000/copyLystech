import { useI18n } from '/@/hooks/web/useI18n';
import { getProcessAllList } from '/@/api/engineering/quotatios';
import { isFunction, isNullOrUnDef } from '/@/utils/is';
import { nextTick } from 'vue';
const { t } = useI18n();

export function getProcessFlowColumns(props, updateProcess): any {
  // 如果是编辑，那么新增的时候需要将某些ApiSelect设置默认
  return [
    {
      title: '工序',
      field: 'processCode',
      width: 180,
      i18nField: 'productionProcess',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'processName',
        dblClickHead: false,
        props: {
          cacheField: 'processName',
          api: getProcessAllList,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          params: {
            mainProcess: 1,
          },
          defaultOpen: true,
          singleDefaultFirst: true,
          resultField: 'data',
          labelField: 'code',
          valueField: 'code',
          nameFormat: ['code', '(', 'name', ')'],
          immediate: true,
          filterOption: false,
          placeholder: t('dict.PCCColumn.productionProcess'),
          onChange: async (processCode, data, { row }) => {
            if (processCode && data) {
              row.processCode = processCode || data.value;
              row.processName = `${data.code || data.value}(${data.name})`;
            }
            await nextTick();
            updateProcess();
          },
        },
      },
    },
    {
      title: '调机时间(H)',
      field: 'lineAdjustmentTime',
      minWidth: 120,
      editRender: {
        name: 'InputNumber',
        props: {
          min: 0,
          onChange: async (_, { row, $grid }) => {
            // 重新计算总时间
            const { fullData: datalist, footerData } = $grid.getTableData();
            let lineAdjustmentTime = 0;
            datalist.forEach(item => {
              lineAdjustmentTime = parseFloat(item.lineAdjustmentTime || 0) + lineAdjustmentTime;
            });
            footerData[0].lineAdjustmentTime = lineAdjustmentTime.toFixed(2);
            $grid.updateFooter();
          },
        },
      },
    },
    {
      title: '不良率',
      field: 'defectiveRate',
      width: 100,
      editRender: {
        name: 'InputNumber',
        props: {
          rate: true,
          placeholder: t('common.autoCarry'),
          onChange: (_, { row, $grid }) => {
            // 重新计算总时间
            const { fullData: datalist, footerData } = $grid.getTableData();
            row.defectiveRate = _;
            let defectiveRate = 0;
            datalist.forEach(item => {
              defectiveRate = parseFloat(item.defectiveRate || 0) + defectiveRate;
            });
            footerData[0].defectiveRate = defectiveRate.toFixed(2) + '%';
            $grid.updateFooter();
          },
        },
      },
    },
    {
      title: '产能(K/H)',
      field: 'capacity',
      minWidth: 120,
      editRender: {
        name: 'InputNumber',
        props: {
          placeholder: t('dict.PCCColumn.capacity'),
        },
      },
    },
    {
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      title: '操作',
      fixed: 'right',
    },
  ];
}

export function getRules() {
  return {
    processCode: [
      {
        validator: ({ col, cell, row }, data) => {
          if (isNullOrUnDef(cell)) {
            return new Error('请选择工序');
          }
          if (!data) {
            return new Error('请选择正确的工序');
          }
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(data.code, data, { row });
          }
        },
      },
    ],
    lineAdjustmentTime: [
      {
        validator: ({ col, cell, row, $grid }) => {
          if (isNullOrUnDef(cell)) {
            return new Error('请输入工序');
          }
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(cell, { row, $grid });
          }
        },
      },
    ],
    capacity: [
      {
        validator: () => {},
      },
    ],
    defectiveRate: [
      {
        validator: ({ col, cell, row, $grid }) => {
          if (isNullOrUnDef(cell)) {
            return new Error('请输入不良率');
          }
          const {
            editRender: {
              props: { onChange },
            },
          } = col;
          if (isFunction(onChange)) {
            onChange(cell, { row, $grid });
          }
        },
      },
    ],
  };
}
