import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { nextTick, toRaw } from 'vue';
import { getDropDownList } from '/@/api/hr/personRegistration';
import dayjs from 'dayjs';
const { t } = useI18n();
const { createMessage } = useMessage();
export const costTransferFlagOptions = [
  {
    fullName: t('common.yes'),
    id: '1',
    theme: 'green',
  },
  {
    fullName: t('common.no'),
    id: '0',
    theme: 'red',
  },
];
export const { data: dropDownList } = await getDropDownList();
export const formSchema = () => {
  return [
    {
      fieldName: 'employeeId',
      label: '',
      component: 'CustomUserSelect',
      componentProps: {
        placeholder: t('dict.EmployeeTrain.WorkNoAndNameText'), //'工号/姓名',
        allowClear: true,
      },
    },
    {
      fieldName: 'auditStatus',
      component: 'Select',
      label: '',
      componentProps: {
        allowClear: true,
        placeholder: t('dict.CAApplyColumn.reviewStatus'), //'审核状态',
        options: dropDownList.auditStatusList,
        fieldNames: { label: 'fullName', value: 'id' },
      },
    },
    {
      fieldName: 'employeeGroup',
      component: 'Select',
      label: '',
      componentProps: {
        allowClear: true,
        placeholder: t('dict.CommonCol.employeeGroup'), //员工分组',
        options: dropDownList.employeeGroupList,
        fieldNames: { label: 'fullName', value: 'id' },
      },
    },
    {
      fieldName: 'employeeType',
      component: 'Select',
      label: '',
      componentProps: {
        allowClear: true,
        placeholder: t('dict.CommonCol.employeeType'), //员工类型',
        options: dropDownList.employeeTypeList,
        fieldNames: { label: 'fullName', value: 'id' },
      },
    },
    {
      fieldName: 'supportType',
      component: 'Select',
      label: '',
      componentProps: {
        allowClear: true,
        placeholder: t('dict.CommonCol.SupportType'), //'支援类型',
        options: dropDownList.supportTypeList,
        fieldNames: { label: 'fullName', value: 'id' },
      },
    },
    {
      fieldName: 'currentStatus',
      component: 'Select',
      label: '',
      componentProps: {
        allowClear: true,
        placeholder: t('dict.CommonCol.CurrentStatus'), //'当前状态',
        options: [
          { id: 1, fullName: '异动' },
          { id: 2, fullName: '支援中' },
          { id: 3, fullName: '已结束' },
        ],
        fieldNames: { label: 'fullName', value: 'id' },
      },
    },
    {
      fieldName: 'deptLevel05',
      component: 'Select',
      label: '',
      componentProps: {
        allowClear: true,
        placeholder: t('dict.CommonCol.fiveFloorBranch'), //'05层部门',
        options: dropDownList.deptLevel05List,
        fieldNames: { label: 'fullName', value: 'id' },
      },
    },
  ];
};

// 主页表格column配置
export const column = (isImport = false) => {
  return [
    { field: 'checkbox', width: 50, type: 'checkbox' },
    {
      title: t('dict.EmployeeTrain.WorkNoAndNameText'), //'工号/姓名',
      field: 'employeeName',
      width: 200,
    },
    {
      title: t('dict.CommonCol.CurrentStatus'), //'当前状态',
      field: 'currentStatus',
      width: 100,
      cellRender: {
        name: 'Tag',
        options: [
          {
            fullName: '异动',
            id: '异动',
            theme: 'gray',
          },
          {
            fullName: '支援中',
            id: '支援中',
            theme: 'green',
          },
          {
            fullName: '结束支援',
            id: '结束支援',
            theme: 'green',
          },
        ],
      },
    },
    {
      title: t('dict.CAApplyColumn.reviewStatus'), //'审核状态',
      field: 'auditStatusText',
      cellRender: {
        name: 'Tag',
        options: [
          {
            fullName: '待提交',
            id: '待提交',
            theme: 'gray',
          },
          {
            fullName: 'HR审核中',
            id: 'HR审核中',
            theme: 'yellow',
          },
          {
            fullName: '已通过',
            id: '已通过',
            theme: 'green',
          },
          {
            fullName: '已驳回',
            id: '已驳回',
            theme: 'red',
          },
        ],
      },
      width: 120,
    },
    {
      title: t('dict.CommonCol.FourFloorBranch'), //'04层部门',
      field: 'deptLevel04Text',
      width: 120,
    },
    {
      title: t('dict.CommonCol.fiveFloorBranch'), //'05层部门',
      field: 'deptLevel05Text',
      width: 120,
    },
    {
      title: t('dict.hrBisColumn.Position'), //'岗位',
      field: 'position',
      width: 150,
    },
    {
      title: t('dict.CommonCol.employeeGroup'), //'员工分组',
      field: 'employeeGroupText',
      width: 120,
    },
    {
      title: t('dict.CommonCol.employeeType'), //'员工类型',
      field: 'employeeTypeText',
      width: 120,
    },
    {
      title: t('dict.CommonCol.SupportType'), //'支援类型',
      field: 'supportTypeText',
      width: 120,
    },
    {
      title: t('dict.CommonCol.SupportType2'), //'支援类型子项2',
      field: 'supportSubType2Text',
      width: 120,
    },
    {
      title: t('dict.CommonCol.SupportTransferBG'), //'被支援/异动BG',
      field: 'targetBgText',
      width: 120,
    },
    {
      title: t('dict.CommonCol.SupportFactory'), //'被支援/异动厂区',
      field: 'targetPlant',
      width: 120,
    },
    {
      title: t(['dict.IQCApplyColumn.auditUserName', isImport ? 'dict.CommonCol.workNo' : '']), //'审核人',
      field: 'auditUserName',
      width: 200,
    },
    {
      title: t('dict.CommonCol.SupportTime'), //'被支援/异动开始时间',
      field: 'startDate',
      cellRender: {
        name: 'Date',
      },
      width: 150,
    },
    {
      title: t('dict.CommonCol.supportEndTime'), //'支援结束时间',
      field: 'endDate',
      cellRender: {
        name: 'Date',
      },
      width: 150,
    },
    {
      title: t('dict.CommonCol.costTransferFlag'), //'费用是否转嫁',
      field: 'costTransferFlagName',
      cellRender: {
        name: 'Tag',
        options: costTransferFlagOptions,
      },
      width: 100,
    },
    {
      title: t('dict.CommonCol.HandoverForm'), //'交接形式',
      field: 'handoverTypeText',
      width: 120,
    },
    {
      title: isImport ? t('dict.CommonCol.promotionCode') : t('dict.CommonCol.promotionName'), //'交接/提拔人工号姓名',
      width: 200,
      field: 'handoverEmployeeName',
    },
    {
      title: t('dict.CommonCol.SupportDays'), //'支援天数',
      field: 'supportDays',
      visible: !isImport,
      width: 80,
    },
    {
      title: t('dict.CommonCol.yearSupportDays'), //'年度累计支援天数',
      field: 'annualSupportDays',
      visible: !isImport,
      width: 120,
    },
    {
      title: t('dict.OriginCountryColumn.creatorUserName'), // 创建人
      field: 'creatorName',
      visible: !isImport,
      width: 200,
    },
    {
      title: t('dict.OriginCountryColumn.creatorTime'), // 创建时间
      field: 'creatorTime',
      cellRender: {
        name: 'Date',
      },
      visible: !isImport,
      width: 120,
    },
    {
      title: t('dict.OriginCountryColumn.lastModifyUserName'), // 修改人姓名
      field: 'lastModifyUserName',
      visible: !isImport,
      width: 200,
    },
    {
      title: t('dict.ShipmentDetailsColumn.lastModifyTime'), //'最后修改时间',
      field: 'lastModifyTime',
      cellRender: {
        name: 'Date',
      },
      visible: !isImport,
      width: 120,
    },
    {
      title: t('dict.CommonCol.remark'), //'备注',
      field: 'remark',
      width: 200,
    },
    {
      title: t('dict.MoldBomColumn.action'), //操作',
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    },
  ];
};

// 判断结束时间是否早于开始时间
function isEarlier(time1, time2) {
  return dayjs(time1).isBefore(dayjs(time2));
}

const getList = async (obj, key) => {
  // return new Promise((resolve, reject) => {
  //   resolve(obj[key]);
  // });
  return obj[key];
};
export const addColumn = a => {
  const DrapList = toRaw(a);
  return [
    {
      title: t('dict.EmployeeTrain.WorkNoAndNameText'), //'工号/姓名',
      width: 300,
      field: 'employeeId',
      editRender: {
        name: 'CustomUserSelect',
        // cacheField: 'employeeName',
      },
    },
    {
      title: t('dict.CommonCol.FourFloorBranch'), //'04层部门',
      field: 'deptLevel04',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'deptLevel04Text',
        props: {
          api: async params => {
            return getList(DrapList, 'deptLevel04List');
          },
          alwaysLoad: true,
          labelField: 'fullName',
          valueField: 'id',
          filterOption: false,
          notFoundContent: null,
          onChange(a, b, c) {
            c.row.deptLevel05 = '';
          },
        },
      },
    },
    {
      title: t('dict.CommonCol.fiveFloorBranch'), //'05层部门',
      field: 'deptLevel05',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'deptLevel05Text',
        props: {
          api: async params => {
            if (!params.deptLevel04) {
              // return Promise.resolve([]);
              return [];
            }
            const list: any = DrapList.deptLevel05List;
            let obj = {
              '1': ['101', '102'],
              '2': ['103', '104', '105', '106', '107'],
              '3': ['201', '301', '302'],
              '4': ['401', '402'],
              '5': ['501', '502'],
              '6': ['601'],
              '7': ['704', '705', '703', '702', '701'],
              '8': ['403'],
              '9': ['801', '803'],
            };
            let deptLeve = params.deptLevel04 || '';
            let edptLeveArr = obj[deptLeve] || [];
            let newRes = list.filter(item => edptLeveArr.includes(item.id));
            // return Promise.resolve(newRes);
            return newRes;
          },
          rowParams: { deptLevel04: 'deptLevel04' },
          alwaysLoad: true,
          labelField: 'fullName',
          valueField: 'id',
          filterOption: false,
          notFoundContent: null,
        },
      },
    },
    {
      title: t('dict.hrBisColumn.Position'), //'岗位',
      field: 'position',
      editRender: {
        name: 'Input',
      },
    },
    {
      title: t('dict.CommonCol.employeeGroup'), //'员工分组',
      field: 'employeeGroup',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'employeeGroupText',
        props: {
          api: async params => {
            return getList(DrapList, 'employeeGroupList');
          },
          alwaysLoad: true,
          labelField: 'fullName',
          valueField: 'id',
          filterOption: false,
          notFoundContent: null,
          onChange(a, b, c) {
            c.row.employeeType = '';
          },
        },
      },
    },
    {
      title: t('dict.CommonCol.employeeType'), //'员工类型',
      field: 'employeeType',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'employeeTypeText',
        props: {
          api: async params => {
            if (!params.employeeGroup) {
              // return Promise.resolve([]);
              return [];
            }
            const list: any = DrapList.employeeTypeList;
            let newRes = list.filter(item => {
              if (params.employeeGroup == '1') {
                return item.id !== '4';
              } else {
                return item.id == '4';
              }
            });
            // return Promise.resolve(newRes);
            return newRes;
          },
          rowParams: { employeeGroup: 'employeeGroup' },
          alwaysLoad: true,
          labelField: 'fullName',
          valueField: 'id',
          filterOption: false,
          notFoundContent: null,
        },
      },
    },
    {
      title: t('dict.IQCApplyColumn.auditUserName'), //'审核人',
      width: 300,
      field: 'auditUserId',
      editRender: {
        name: 'CustomUserSelect',
        // cacheField: 'auditUserName',
      },
    },
    {
      title: t('dict.CommonCol.SupportTime'), //'被支援/异动开始时间',
      field: 'startDate',
      editRender: {
        name: 'DatePicker',
        props: {
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD',
          onChange: (data, { row }) => {
            if (!row.endDate) {
              return;
            }
            if (isEarlier(row.endDate, data)) {
              createMessage.warning('结束时间不能早于开始时间');
              nextTick(() => {
                row.startDate = '';
              });
              return;
            }
          },
        },
      },
    },
    {
      title: t('dict.CommonCol.supportEndTime'), //'支援结束时间',
      field: 'endDate',
      editRender: {
        name: 'DatePicker',
        props: {
          format: 'YYYY-MM-DD',
          valueFormat: 'YYYY-MM-DD',
          onChange: (data, { row }) => {
            if (!row.endDate) {
              return;
            }
            if (isEarlier(data, row.endDate)) {
              createMessage.warning('结束时间不能早于开始时间');
              nextTick(() => {
                row.endDate = '';
              });
              return;
            }
          },
        },
      },
    },
    {
      title: t('dict.CommonCol.costTransferFlag'), //'费用是否转嫁',
      field: 'costTransferFlag',
      editRender: {
        name: 'ASelect',
        props: {
          options: costTransferFlagOptions,
          fieldNames: { label: 'fullName', value: 'id' },
        },
      },
    },
    {
      title: t('dict.CommonCol.SupportType'), //'支援类型',
      field: 'supportType',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'supportTypeText',
        props: {
          api: async params => {
            return getList(DrapList, 'supportTypeList');
          },
          alwaysLoad: true,
          labelField: 'fullName',
          valueField: 'id',
          filterOption: false,
          notFoundContent: null,
          onChange(a, b, c) {
            c.row.supportSubType2 = '';
            c.row.targetBg = '';
          },
        },
      },
    },
    {
      title: t('dict.CommonCol.SupportType2'), //'支援类型子项2',
      field: 'supportSubType2',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'supportSubType2Text',
        props: {
          api: async params => {
            if (!params.supportType) {
              // return Promise.resolve([]);
              return [];
            }
            const list: any = DrapList.supportSubType2List;
            let newRes = list.filter(item => {
              if (params.supportType == 1) {
                return item.id == '1' || item.id == '2' || item.id == '3';
              } else {
                return item.id == '4' || item.id == '5' || item.id == '6';
              }
            });
            // return Promise.resolve(newRes);
            return newRes;
          },
          rowParams: { supportType: 'supportType' },
          alwaysLoad: true,
          labelField: 'fullName',
          valueField: 'id',
          filterOption: false,
          notFoundContent: null,
          onChange(a, b, c) {
            c.row.targetBg = '';
          },
        },
      },
    },
    {
      title: t('dict.CommonCol.SupportTransferBG'), //'被支援/异动BG',
      field: 'targetBg',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'targetBgText',
        props: {
          api: async params => {
            if (!params.supportSubType2) {
              // return Promise.resolve([]);
              return [];
            }
            const list: any = DrapList.targetBgList;
            let obj = {
              '1': ['1', '2', '6'],
              '4': ['1', '2', '6'],
              '2': ['4', '5'],
              '5': ['4', '5'],
              '3': ['3'],
              '6': ['3'],
            };
            let deptLeve = params.supportSubType2 || '';
            let edptLeveArr = obj[deptLeve] || [];
            let newRes = list.filter(item => edptLeveArr.includes(item.id));
            // return Promise.resolve(newRes);
            return newRes;
          },
          rowParams: { supportSubType2: 'supportSubType2' },
          alwaysLoad: true,
          labelField: 'fullName',
          valueField: 'id',
          filterOption: false,
          notFoundContent: null,
        },
      },
    },
    {
      title: t('dict.CommonCol.SupportFactory'), //'被支援/异动厂区',
      field: 'targetPlant',
      minWidth: 100,
      width: 220,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: t('dict.CommonCol.HandoverForm'), //'交接形式',
      field: 'handoverType',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'handoverTypeText',
        props: {
          api: async params => {
            return getList(DrapList, 'handoverTypeList');
          },
          alwaysLoad: true,
          labelField: 'fullName',
          valueField: 'id',
          filterOption: false,
          notFoundContent: null,
        },
      },
    },
    {
      title: t('dict.CommonCol.promotionName'), //'交接/提拔人工号姓名',
      width: 300,
      field: 'handoverEmployee',
      editRender: {
        name: 'CustomUserSelect',
        cacheField: 'handoverEmployeeName',
      },
    },
    {
      title: t('dict.CommonCol.remark'), //'备注',
      field: 'remark',
      minWidth: 100,
      width: 220,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: '操作',
      field: 'action',
      slots: { default: 'action' },
      width: 100,
      fixed: 'right',
    },
  ];
};

export const ADD_TABLE_ROW_DATA = {
  handoverEmployee: '',
  handoverType: '',
  targetPlant: '',
  targetBg: '',
  supportSubType2: '',
  supportType: '',
  endDate: '',
  startDate: '',
  auditUserId: '',
  auditUserName: '',
  employeeType: '',
  employeeGroup: '',
  position: '',
  deptLevel05: '',
  deptLevel04: '',
  employeeName: '',
};
