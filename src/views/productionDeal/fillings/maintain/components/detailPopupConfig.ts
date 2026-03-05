import { useI18n } from '/@/hooks/web/useI18n';
import { getAppEnvConfig } from '/@/utils/env';
export { convertScientificNumber } from './ApplyPopConfig';

const { t } = useI18n();

export function getSchemas(isNarrow = false) {
  return [
    {
      label: '产品内部料号',
      field: 'insidePartNumber',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '直接客户料号',
      field: 'immediateCustomerPartNumber',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '终端客户料号',
      field: 'terminalCustomerPartNumber',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '带衬背数量(PCS)',
      field: 'backProductQty',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '带衬背总重量(G)',
      field: 'backProductTotalWeight',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '带衬背单重(KG)',
      field: 'backProductWeight',
      component: 'Input',
      componentProps: {
        placeholder: '',
        disabled: true,
      },
    },
    {
      label: '纯产品数量(PCS)',
      field: 'productQty',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '纯产品总重量(G)',
      field: 'productTotalWeight',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '纯产品单重(KG)',
      field: 'productWeight',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },
    {
      label: '废料单重(KG)',
      field: 'wasteWeight',
      component: 'Input',
      componentProps: {
        placeholder: '',
      },
    },

    {
      label: '备注',
      field: 'produceRmk',
      component: 'Textarea',
      colProps: { span: 8 },
      componentProps: {
        placeholder: '',
        rows: 1,
      },
    },
  ].map(item => {
    const span = item?.colProps?.span || 4;
    const doubleSpan = span * 2;
    item.colProps = {
      span: isNarrow ? Math.min(doubleSpan, 24) : span,
    };
    return item;
  });
}

export function getImageTableColumns() {
  return [
    {
      field: 'seq',
      title: t('component.table.index'),
      type: 'seq',
      width: '50',
      align: 'center',
    },
    {
      title: t('common.imageName'),
      field: 'imageName',
      editRender: {
        name: 'Input',
        props: {
          disabled: true,
        },
      },
      slots: { default: 'file' },
    },
    {
      title: t('common.action'),
      width: 100,
      slots: { default: 'action' },
      fixed: 'right',
      field: 'action',
    },
  ];
}

const { VITE_GLOB_API_URL } = getAppEnvConfig();
const IMG_URL_PREFIX = VITE_GLOB_API_URL + '/api/Information/FileInfo/Download/';
/** 格式化图片显示的全路径 */
export function formatImageUrl(url: string) {
  if (url.startsWith('http')) {
    return url;
  }
  return url ? `${IMG_URL_PREFIX}${url}` : '';
  // return url.startsWith('http') ? url : url ? `${IMG_URL_PREFIX}${url}` : '';
}
