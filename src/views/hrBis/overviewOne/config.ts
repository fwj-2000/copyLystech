import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
import { getfloorList, getReportDataSelectOptParam } from '/@/api/hr/netHouseSubsidy';
import { IS_YSE_LIST } from '../config';
import dayjs from 'dayjs';
import { ref } from 'vue';
import type { FormSchemaTypeHandle } from './type';
let workShopFloorListCache: any[] = [];
const fetchParams = ref<FormSchemaTypeHandle>({});
// 表单配置
export const getHrTrainFormConfig = () => {
  return [
    {
      fieldName: 'month',
      label: '',
      labelWidth: 100,
      component: 'DatePicker',
      componentProps: {
        format: 'YYYY-MM',
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'durIng',
      component: 'Select',
      filterOption: true,
      componentProps: {
        options: [
          { label: t('hrBis.monthMid'), value: '0' },
          { label: t('hrBis.monthEnd'), value: '1' },
        ],
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'status',
      component: 'Select',
      filterOption: true,
      componentProps: {
        options: [
          { label: t('common.submitTodo'), value: '0' },
          { label: t('dict.mrbApplyStatus.1'), value: '2' },
          { label: t('hrBis.archive'), value: '4' },
        ],
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'errorRemarks', //错误备注
      component: 'Select',
      placeholder: t('dict.hrBisColumn.errorRemarks'),
      filterOption: true,
      componentProps: {
        mode: 'multiple',
        maxTagCount: 1,
        options: [
          { label: t('dict.hrBisColumn.errorRemarks.0'), value: '工号姓名对不上' },
          { label: t('dict.hrBisColumn.errorRemarks.1'), value: '提报天数超出最大上班天数' },
          { label: t('dict.hrBisColumn.errorRemarks.2'), value: '职员级不享有' },
          { label: t('dict.hrBisColumn.errorRemarks.3'), value: '残疾工(GK)不享有' },
          { label: t('dict.hrBisColumn.errorRemarks.4'), value: '岗位标准为空，请联系HR维护' },
        ],
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'creatorUserAccount',
      component: 'Select',
      componentProps: {
        filterOption: true,
        allowClear: true,
      },
    },
    {
      label: '',
      fieldName: 'creatorUserId',
      component: 'Select',
      componentProps: {
        filterOption: true,
        allowClear: true,
      },
    },
  ];
};
export const getHrTrainPageColumns = (params: any) => {
  fetchParams.value = params;
  const column = [
    { type: 'checkbox', field: 'checkbox', width: 50 },
    {
      title: '月份',
      field: 'month',
      width: 70,
    },
    {
      title: '期间',
      field: 'durIngDesc',
      width: 60,
    },
    {
      title: '审批层级部门（第4级）',
      field: 'deptNameLevel4',
      width: 90, // 层级名称较长，适当加宽
      ...getcomColProps('deptNameLevel4'),
    },
    {
      title: '审批层级部门（第5级）',
      field: 'deptNameLevel5Or1',
      width: 90,
      ...getcomColProps('deptNameLevel5Or1'),
    },
    {
      title: '审批层级部门（第6级）',
      field: 'deptNameLevel6',
      width: 90,
      ...getcomColProps('deptNameLevel6'),
    },
    {
      title: '部门（第7级）',
      field: 'deptNameLevel7',
      width: 100,
      ...getcomColProps('deptNameLevel7'),
    },
    {
      title: '部门简称',
      field: 'simName',
      width: 80,
      ...getcomColProps('simName'),
    },
    {
      title: '工号',
      field: 'workNo',
      width: 100,
      editRender: {
        name: 'Input',
      },
      ...getcomColProps('workNo'),
    },
    {
      title: '姓名',
      field: 'userName',
      width: 100,
      editRender: {
        name: 'Input',
      },
      ...getcomColProps('userName'),
    },
    {
      title: '入职日期',
      field: 'effectDay',
      width: 100,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
      sortable: true,
    },
    {
      title: '离职生效日期',
      field: 'lastdimiDate',
      width: 100,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD',
      },
      sortable: true,
    },
    {
      title: '档案分组',
      field: 'groupName',
      width: 100,
      ...getcomColProps('groupName'),
    },
    {
      title: '员工组',
      field: 'gzclsName',
      width: 120,
      ...getcomColProps('gzclsName'),
    },
    {
      title: '岗位名称',
      field: 'postName',
      width: 100,
      ...getcomColProps('postName'),
    },
    {
      title: '用工性质类型',
      field: 'dlEnterTypeName',
      width: 100,
      ...getcomColProps('dlEnterTypeName'),
    },
    {
      title: '是否整月在净房',
      field: 'isWholeMonthDesc',
      width: 70,
      filters: [{ data: '' }],
      filterRender: {
        name: 'ASelect',
        searchField: 'isWholeMonth',
        props: {
          fieldNames: {
            label: 'label',
            value: 'value',
          },
          options: IS_YSE_LIST,
        },
      },
      editRender: {
        name: 'ASelect',
        props: {
          options: IS_YSE_LIST,
          onChange: (_value: string, option: any, { row }) => {
            console.log(option, _value);
            row.isWholeMonth = option.value * 1;
          },
        },
      },
    },
    {
      title: '净房车间上班天数（部门提报）',
      field: 'workDaysNum',
      align: 'right',
      width: 70,
      editRender: {
        name: 'Input',
      },
    },
    {
      title: '最大上班天数(初次提交)',
      field: 'contiworkdaysSubmit',
      align: 'right',
      width: 90,
    },

    {
      title: '补贴标准金额',
      field: 'standard',
      align: 'right',
      width: 60,
    },
    {
      title: '补贴金额(初次提交)',
      field: 'subsidyAmountSubmit',
      align: 'right',
      width: 80,
    },
    {
      title: '净房车间上班天数取数（归档）',
      field: 'dataRetrieval',
      align: 'right',
      width: 80,
    },
    {
      title: '最大上班天数(归档)',
      field: 'contiworkdaysArchive',
      align: 'right',
      width: 80,
    },
    {
      title: '补贴金额(归档)',
      field: 'subsidyAmountArchive',
      align: 'right',
      width: 70,
    },
    {
      title: '补发金额',
      field: 'supRegAmount',
      align: 'right',
      width: 80,
    },
    {
      title: '当月净房补贴合计',
      field: 'totalAmount',
      align: 'right',
      width: 80,
    },
    {
      title: '净房车间楼层',
      field: 'workshopFloor',
      width: 100,
      editRender: {
        name: 'ApiSelect',
        props: {
          api: getWorkShopFloorApi,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          immediate: true,
        },
      },
      ...getcomColProps('workshopFloor'),
    },
    {
      title: '创建人工号',
      field: 'creatorUserAccount',
      width: 100,
      ...getcomColProps('creatorUserAccount'),
    },
    {
      title: '创建人姓名',
      field: 'creatorUserId',
      width: 70,
    },
    {
      title: '提交人',
      field: 'submitUserName',
      width: 70,
      editRender: {
        name: 'Input',
      },
      ...getcomColProps('submitUserName'),
    },
    {
      title: '提交时间',
      field: 'submitTime',
      width: 120,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm',
      },
      sortable: true,
    },
    {
      title: '归档时间',
      field: 'archiveTime',
      width: 120,
      cellRender: {
        name: 'Date',
        format: 'YYYY-MM-DD HH:mm',
      },
      sortable: true,
    },
    {
      title: '状态',
      field: 'statusDesc',
      width: 60,
    },
    {
      title: '备注',
      field: 'remarks',
      width: 120,
      editRender: {
        name: 'Input',
      },
      ...getcomColProps('remarks'),
    },
    {
      title: '错误备注',
      field: 'errorRemarks',
      width: 120,
    },
  ];

  return column;
};
const getcomColProps = (paramName: string) => {
  return {
    filters: [{ data: '' }],
    filterRender: {
      name: 'ApiSelect',
      props: {
        // params,
        beforeFetch: (params: any) => {
          // console.log('🚀 ~ beforeFetch ~ params:', params, fetchParams.value);
          return { ...params, ...fetchParams.value, paramName };
        },
        api: getReportDataSelectOptParam,
        afterFetch: (res: any) => {
          res.data = res.data.map((item: any) => {
            return {
              Name: item,
              Code: item,
            };
          });
          return res;
        },
        showSearch: true,
        apiSearch: {
          show: true,
        },
        resultField: 'data',
        labelField: 'Name',
        valueField: 'Code',
        filterOption: true,
        notFoundContent: null,
        // alwaysLoad: true,
      },
    },
  };
};

export const isBefore20th = () => {
  return dayjs().date() <= 20;
};

/**
 * 获取净房车间楼层，支持缓存机制
 * @returns 净房车间楼层
 */
async function getWorkShopFloorApi(): Promise<any[]> {
  // 如果缓存中有数据，直接返回
  if (workShopFloorListCache.length > 0) {
    return workShopFloorListCache;
  }
  try {
    // 调用 API 获取数据
    const response = await getfloorList();
    // 更新缓存并返回数据
    workShopFloorListCache = response.data
      ? response.data.map(item => {
          return {
            Name: item,
            Code: item,
          };
        })
      : [];

    return workShopFloorListCache;
  } catch (error) {
    console.error('获取工厂列表失败:', error);
    // 返回空数组作为默认值
    return [];
  }
}
