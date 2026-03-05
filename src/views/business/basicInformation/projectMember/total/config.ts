import { VxeFormItemProps } from '/@/components/VxeTable';
import { useBaseStore } from '/@/store/modules/base';

const baseStore = useBaseStore();

export const vxeTableFormSchema: VxeFormItemProps[] = [
  {
    field: 'ApplyCode',
    title: '',
    itemRender: {
      name: 'AInput',
      props: {
        placeholder: '内部项目代码',
      },
    },
    span: 4,
  },
  {
    field: 'InsidePartNumber',
    title: '',
    itemRender: {
      name: 'AInput',
      props: {
        placeholder: '直接客户',
      },
    },
    span: 4,
  },
  {
    field: 'Factory',
    title: '',
    itemRender: {
      name: 'AInput',
      props: {
        placeholder: '工厂',
      },
    },
    span: 4,
  },
  // 工厂
  {
    field: 'ProductionType',
    title: '',
    itemRender: {
      name: 'AApiSelect',
      props: {
        placeholder: '生产类型',
        api: baseStore.getDictionaryData('ProductionTypeEnum'),
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'enCode',
        style: 'width: 100%',
      },
    },
    span: 4,
  },
  {
    field: 'TerminalCustomerPartNumber',
    title: '',
    itemRender: {
      name: 'AInput',
      props: {
        placeholder: '终端客户料号',
      },
    },
    span: 4,
  },
  {
    field: 'ImmediateCustomerPartNumber',
    title: '',
    itemRender: {
      name: 'AInput',
      props: {
        placeholder: '直接客户料号',
      },
    },
    span: 4,
  },
  {
    span: 12,
    align: 'left',
    className: '!pr-0',
    itemRender: {
      name: 'AButtonGroup',
      children: [
        {
          props: { type: 'primary', content: '查询', htmlType: 'submit' },
          attrs: { class: 'mr-2' },
        },
        { props: { type: 'default', htmlType: 'reset', content: '重置' } },
      ],
    },
  },
];
