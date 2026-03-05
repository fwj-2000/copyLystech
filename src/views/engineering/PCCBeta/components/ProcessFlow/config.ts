import { useI18n } from '/@/hooks/web/useI18n';
import { getProcessAllList } from '/@/api/engineering/quotatios';
import { getUnitListByKeyword } from '/@/api/finance/materialPrice';
import { isFunction, isNullOrUnDef } from '/@/utils/is';
import { get } from 'lodash-es';
import { nextTick } from 'vue';

const { t } = useI18n();

// PCC工艺流程列
export function getProcessFlowColumns(props, updateProcess, emit): any {
  // 如果是编辑，那么新增的时候需要将某些ApiSelect设置默认
  return [
    {
      type: 'seq',
      field: 'seq',
      title: t('dict.CommonCol.seq'),
      width: 50,
    },
    {
      title: '工序',
      field: 'processCode',
      width: 180,
      i18nField: 'productionProcess',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'processName',
        autoFocus: '.ant-select-selection-search-input',
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
          // autofocus: true,
          // autoSelect: true,
          resultField: 'data',
          labelField: 'code',
          valueField: 'code',
          nameFormat: ['code', '(', 'name', ')'],
          immediate: true,
          filterOption: false,
          notFoundContent: null,
          placeholder: t('dict.PCCColumn.productionProcess'),
          onChange: async (processCode, data, { row }) => {
            console.log('🚀 ~ onChange: ~ data:', data);
            console.log('🚀 ~ onChange ~ params: ', processCode);
            if (processCode && data) {
              row.processCode = processCode;
              row.processName = `${data.code || data.value}(${data.name})`;
            }
            if (row.processCode?.startsWith('3')) {
              // 如果是3开头，产能自动计算
              row.capacity = null;
            } else {
              // 如果是1，2,4,5开头，则速度禁用，清空
              row.speed = null;
              row.adjustmentTime = 0;
            }
            // 激光、圆刀单位默认：M/min，平板默认：冲次/min
            const { technology } = await props.getValues();
            console.log('🚀 ~ onChange ~ technology: ', technology);
            const process = technology?.process;
            if (!process) return;
            if (row.processCode?.startsWith('3')) {
              if (process == 1) {
                // 平板
                row.speedUnit = 'SPM/min';
                row.speedUnitName = '冲次/分钟';
              } else {
                // 圆刀 激光
                row.speedUnit = 'M/min';
                row.speedUnitName = '米/分钟';
              }
            }
            console.log('🚀 ~ onChange ~ row: ', row);
            await nextTick();
            updateProcess();
          },
          // onChange: (productionType, data, params) => {
          //   const { row } = params;
          //   if (data) {
          //     row.productionType = productionType;
          //     row.productionTypeName = data.fullName;
          //   } else {
          //     row.productionType = null;
          //     row.productionTypeName = '';
          //   }
          // },
        },
      },
    },
    {
      title: '调机时间(H)',
      field: 'adjustmentTime',
      minWidth: 120,
      editRender: {
        name: 'InputNumber',
        props: {
          // placeholder: t('common.autoCarry'),
          min: 0,
          onChange: async (_, { row, $grid }) => {
            // 重新计算总时间
            // const {  } = params;
            row.adjustmentTime = _;
            const { fullData: datalist, footerData } = $grid.getTableData();
            console.log('🚀 ~ onChange ~ datalist: ', datalist);
            let adjustmentTime = 0;
            datalist.forEach(item => {
              adjustmentTime = Number.parseFloat(item.adjustmentTime || 0) + adjustmentTime;
            });
            console.log('🚀 ~ onChange ~ adjustmentTime: ', adjustmentTime);
            footerData[0].adjustmentTime = adjustmentTime.toFixed(2);
            $grid.updateFooter();
          },
        },
      },
    },
    {
      title: '使用人数',
      field: 'useNumber',
      minWidth: 120,
      // prefixConfig: {
      //   content: t('dict.PCCColumn.capacityTip'),
      // },
      editRender: {
        name: 'InputNumber',
        props: {},
      },
    },
    {
      title: '产能(K/H)',
      field: 'capacity',
      minWidth: 120,
      prefixConfig: {
        content: t('dict.PCCColumn.capacityTip'),
      },
      editRender: {
        name: 'InputNumber',
        props: {
          dynamicDisabled: row => {
            // 如果ProcessCode是3开头，产能自动计算，不允许编辑
            if (isNullOrUnDef(row.processCode)) return false;
            if (row.processCode?.startsWith('3')) {
              return true;
            }
            return false;
          },
          placeholder: t('dict.PCCColumn.capacity'),
        },
      },
    },
    {
      title: '速度',
      field: 'speed',
      minWidth: 120,
      editRender: {
        name: 'InputNumber',
        props: {
          dynamicDisabled: row => {
            // processCode 为3开头时，则可编辑
            if (isNullOrUnDef(row.processCode)) return false;
            if (row.processCode?.startsWith('3')) {
              return false;
            }
            return true;
          },
          onChange: async (speed, { $grid, row }) => {
            // 主工序变更时才会计算单词换料时长、设备稼动率
            // if (row.isMain) {
            updateProcess();
            await nextTick();
            // await emit('calcDowntimeOneHour', emit('calcCapacity', row));
            await emit('calcDowntimeOneHour', ({ downtimeOneHour, utilizationRate }) => {
              emit('calcCapacity', {
                row,
                utilizationRate,
                downtimeOneHour,
                isMain: row.isMain,
                grid: $grid,
              });
            });
            // emit('calcCapacity', row);
            // }
          },
          // onChange: (yieldVal, params) => {
          // 	const { $grid } = params;
          // 	// const datalist = $grid.getFullData();
          // 	const { fullData: datalist, footerData } = $grid.getTableData();
          // 	console.log(footerData, 'footerDatafooterDatafooterData');
          // 	// console.log(datalist);
          // 	// console.log(yieldVal, 'yield');
          // 	// console.log(params, 'params');
          //
          // 	datalist.forEach((item, index) => ({ ...item, seqNumber: index + 1 }));
          // 	let cumulativeProduct = bignumber(1);
          //
          // 	for (let i = datalist.length - 1; i >= 0; i--) {
          // 		const item = datalist[i];
          // 		const yieldValue = bignumber(item.yield) || bignumber(1);
          // 		// 累积计算直通率（包含当前工序）
          // 		cumulativeProduct = multiply(cumulativeProduct, divide(yieldValue, bignumber(100)));
          //
          // 		console.log(cumulativeProduct, 'cumulativeProduct');
          // 		// 计算结果并格式化
          // 		datalist[i].fpy = multiply(cumulativeProduct, bignumber(100)).toNumber().toFixed(2);
          // 	}
          // 	const sumYield = updateYieldSum(datalist);
          // 	console.log(sumYield, 'sumYieldsumYieldsumYieldsumYield');
          // 	footerData[0].yield = sumYield;
          // 	// $grid.updateFooter({
          // 	//   yield: sumYield,
          // 	// })
          // 	console.log('🚀 ~ getProcessColumns ~ datalist:', datalist);
          // 	quotaStore.setProcessList(cloneDeep(datalist));
          // },
        },
      },
    },
    {
      title: '单位',
      field: 'speedUnit',
      minWidth: 120,
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getUnitListByKeyword,
          dynamicDisabled: row => {
            // 如果ProcessCode是1、2、4、5开头，或是isMain是1，则禁用
            if (row.processCode && !row.processCode.startsWith('3')) {
              return true;
            }
            if (row.isMain === 1) {
              return true;
            }
            return false;
          },
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          labelField: 'Name',
          valueField: 'Code',
          placeholder: '',
        },
      },
    },
    {
      title: '不良率',
      field: 'defectRate',
      width: 100,
      editRender: {
        name: 'InputNumber',
        props: {
          rate: true,
          placeholder: t('common.autoCarry'),
          onChange: (_, { row, $grid }) => {
            // 重新计算总时间
            const { fullData: datalist, footerData } = $grid.getTableData();
            row.defectRate = _;
            let defectRate = 0;
            datalist.forEach(item => {
              defectRate = Number.parseFloat(item.defectRate || 0) + defectRate;
            });
            footerData[0].defectRate = defectRate.toFixed(2) + '%';
            $grid.updateFooter();
            emit('calcMaterialUseQty');
          },
          // onChange: (_, data, params) => {
          //   const { row } = params;
          //   if (data) {
          //     row.periodOfDepreciationName = data.fullName;
          //   } else {
          //     row.periodOfDepreciationName = '';
          //   }
          // },
        },
      },
    },
    {
      title: '主工序',
      field: 'isMain',
      minWidth: 120,
      editRender: {
        name: 'ASelect',
        props: {
          placeholder: '',
          options: [
            {
              label: t('common.yes'),
              value: 1,
            },
            {
              label: t('common.no'),
              value: 0,
            },
          ],
          onChange: async (isMain, data, { row, $grid }) => {
            const datalist = $grid.getFullData();
            if (isMain) {
              datalist.forEach(item => {
                item.isMain = 0;
              });
            }
            row.isMain = isMain;
            if (row.isMain) {
              updateProcess();
              await nextTick();
              emit('calcDowntimeOneHour');
            }
            // const { getValues,
            //   getStepDistanceList,
            //   getMaterialList,
            //   setTechnologyTableFieldsValue,
            //   getTechnologyTableFieldsValue
            // } = props;
            // const formValues = await getValues();
            // const { singleRefuelingDuration } = getTechnologyTableFieldsValue()
            // if (row.isMain) {
            //   const [downtimeOneHour, utilizationRate] = calculateUtilizationRate({
            //     processList: $grid.getFullData(),
            //     process: formValues.technology?.process,
            //     stepDistanceList: getStepDistanceList(),
            //     materialList: getMaterialList(),
            //     singleRefuelingDuration
            //   });
            //   setTechnologyTableFieldsValue({
            //     downtimeOneHour: downtimeOneHour.toFixed(2),
            //     utilizationRate: utilizationRate.toFixed(2),
            //   });
            // }
          },
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
    adjustmentTime: [
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
    speed: [
      {
        validator: () => {},
      },
    ],
    speedUnit: [
      {
        validator: () => {},
      },
    ],
    defectRate: [
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
    isMain: [
      {
        validator: () => {},
      },
    ],
  };
}

// 根据apiselect 传入 props查找label
function genFormatVal(target, nameFormat: any[], valueField = '') {
  let label = '';
  if (nameFormat && nameFormat.length > 0) {
    nameFormat.forEach((item, index) => {
      if (index % 2 === 0) {
        label += get(target, [item]) || '';
      } else {
        label += item;
      }
    });
  } else {
    label = get(target, valueField || 'name');
  }

  return label;
}
