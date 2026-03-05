import { useI18n } from '/@/hooks/web/useI18n';
import { ref } from 'vue';
import { getProductLineCode } from '/@/api/basicData/productLine';
const { t } = useI18n();
export const StatusList = [
  {
    id: 1,
    fullName: t('dict.enableStatus.1'),
  },
  {
    id: 2,
    fullName: t('dict.enableStatus.2'),
  },
];

const mainProcess = ref(1);

const getProductLineCodeFn = async () => {
  const line = await getProductLineCode(' ', mainProcess.value);
  return line;
};

export const ProductStageColumn = [
  { title: '序号', type: 'seq', field: 'index', width: 45 },
  {
    title: '编码',
    field: 'code',
    width: 80,
    i18nField: 'CommonCol.encode',
  },
  {
    title: '简称',
    field: 'name',
    width: 120,
    i18nField: 'CommonCol.abbreviation',
  },
  {
    title: '全称',
    field: 'fullName',
    width: 120,
    i18nField: 'CommonCol.completeName',
  },
  {
    title: '产品线',
    field: 'productLine',
    formatter: 'ApiSelect',
    editRender: {
      name: 'ApiSelect',
      props: {
        // api: getProductLineCodeFn(),
        showSearch: false,
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'id',
        immediate: true,
      },
    },
    // i18nField: 'CustomerProductStage',
  },
  {
    title: '客户产品阶段',
    field: 'customerProductStage',
    editRender: {
      name: 'input',
    },
    i18nField: 'CustomerProductStage',
  },
  {
    title: '内部产品阶段',
    field: 'internalProductStage',
    editRender: {
      name: 'input',
    },
    i18nField: 'InternalProductStage',
  },

  {
    title: '操作',
    field: 'action',
    slots: { default: 'action' },
    width: 100,
    fixed: 'right',
  },
];

export const getProductStageColumn = process => {
  mainProcess.value = process;
  return [
    { title: '序号', type: 'seq', field: 'index', width: 50 },
    {
      title: '编码',
      field: 'code',
      width: 80,
      i18nField: 'CommonCol.encode',
    },
    {
      title: '简称',
      field: 'name',
      width: 120,
      i18nField: 'CommonCol.abbreviation',
    },
    {
      title: '全称',
      field: 'fullName',
      width: 120,
      i18nField: 'CommonCol.completeName',
    },
    {
      title: '产品线',
      field: 'productLineCode',
      formatter: 'ApiSelect',
      editRender: {
        name: 'ApiSelect',
        cacheField: 'productLineName',
        props: {
          api: getProductLineCodeFn,
          showSearch: true,
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          immediate: true,
        },
      },
      i18nField: 'CommonCol.productLine',
    },
    {
      title: '客户产品阶段',
      field: 'customerProductStage',
      editRender: {
        name: 'input',
      },
      i18nField: 'CustomerProductStage',
    },
    {
      title: '内部产品阶段',
      field: 'internalProductStage',
      editRender: {
        name: 'input',
      },
      i18nField: 'InternalProductStage',
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

export const editRules = {
  customerProductStage: [{ required: true, message: t('common.required') }],
  internalProductStage: [{ required: true, message: t('common.required') }],
  productLineCode: [{ required: true, message: t('common.required') }],
};
