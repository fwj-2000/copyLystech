import { useMessage } from '/@/hooks/web/useMessage';
import { useI18n } from '/@/hooks/web/useI18n';
import { useDebounceFn } from '@vueuse/core';
import { nextTick } from 'vue';
const { t } = useI18n();
const { createMessage } = useMessage();

const qtyChangValidate = useDebounceFn((value: number, row) => {
  if (!value && value !== 0) {
    row.pQtyAfter = '';
    return;
  }
  // 数据变动后，需要把调配后的申请数量计算出来
  let calValue: number = value;
  // 前置校验
  const { tag, oQtyBefore, pQtyBefore } = row;
  const beforePayQty = pQtyBefore || 0;
  const beforeHasQty = oQtyBefore || 0;
  if (tag == 'release') {
    // 如果是释放方，0<=可调配数据<=调配前占有数量
    if (value > beforeHasQty) {
      calValue = beforeHasQty;
      createMessage.info('0<=调配后占用数量<=调配前占有数量');
    }
  } else {
    // 如果是接收方，调配前已占用数量<=调配后占用数量<=调配前申请数量
    if (value > beforePayQty + beforeHasQty) {
      calValue = beforePayQty;
      createMessage.info('调配后占用数量<=(调配前申请数量+调配前已占用数量)');
    }
    if (value < beforeHasQty) {
      calValue = beforeHasQty;
      createMessage.info('调配后占用数量>=调配已占用数量');
    }
  }
  // 计算调配后申请数量：(调配前申请数量 + 调配前已占用数量) - 调配后占用数量
  if (calValue == value) {
    row.pQtyAfter = (pQtyBefore || 0) + (oQtyBefore || 0) - calValue;
  } else {
    nextTick(() => {
      row.oQtyAfter = calValue;
      row.pQtyAfter = (pQtyBefore || 0) + (oQtyBefore || 0) - calValue;
    });
  }
}, 1000);

const ISOPTION = [
  { id: true, fullName: t('common.yes'), theme: 'green' },
  { id: false, fullName: t('common.no'), theme: 'red' },
];

export const assignBOMColumn = [
  {
    title: '是否启用',
    field: 'enable',
    i18nField: 'enableDes',
    width: 80,
    cellRender: {
      name: 'Tag',
      options: ISOPTION,
    },
  },
  {
    title: '是否默认',
    field: 'isDefaultEnable',
    i18nField: 'isDefaultEnableDes',
    width: 80,
    cellRender: {
      name: 'Tag',
      options: ISOPTION,
    },
  },
  {
    title: '是否保税',
    field: 'isBonded',
    i18nField: 'isBondedDes',
    width: 80,
    cellRender: {
      name: 'Tag',
      options: ISOPTION,
    },
  },
  {
    title: '是否为料头工艺',
    field: 'isStubbar',
    i18nField: 'isStubbarDes',
    width: 80,
    cellRender: {
      name: 'Tag',
      options: ISOPTION,
    },
  },
  {
    title: '工艺',
    field: 'processName',
    width: 50,
  },
  {
    title: '受控时间',
    field: 'effectiveDate',
    width: 120,
    cellRender: {
      name: 'Date',
    },
  },
  {
    title: 'BOM版本',
    field: 'version',
    width: 70,
    formatter: ({ cellValue }) => 'T' + (cellValue || 0),
  },
  {
    title: '产品内部料号',
    field: 'insidePartNumber',
    minWidth: 160,
  },
  {
    title: '旧版内部料号',
    field: 'pnOld',
    width: 160,
  },
  {
    title: '申请数量',
    field: 'qty',
    editRender: {
      name: 'InputNumber',
      props: {
        dynamicDisabled: row => {
          return !row.enable;
        },
      },
    },
    minWidth: 120,
  },
];

export const allocateMaterialsColumn = [
  {
    title: '内部料号',
    field: 'mCode',
    i18nField: 'innerMaterialCode',
    width: 150,
  },
  {
    title: '对应产品内部料号',
    field: 'fCode',
    width: 150,
  },
  {
    title: '旧版内部料号',
    field: 'pnOld',
    width: 180,
  },
  {
    title: '所属PC',
    field: 'pcName',
    width: 120,
  },
  {
    title: '所属MC',
    field: 'mcName',
    width: 120,
  },
  {
    title: '调配前申请数量',
    field: 'pQtyBefore',
    width: 120,
  },
  {
    title: '调配前已占用数量',
    field: 'oQtyBefore',
    width: 120,
  },
  {
    title: '调配后申请数量',
    field: 'pQtyAfter',
    width: 120,
  },
  {
    title: '调配后占用数量',
    field: 'oQtyAfter',
    editRender: {
      name: 'InputNumber',
      props: {
        onChange: (value, { row }) => {
          qtyChangValidate(value, row);
        },
        min: 0,
      },
    },
    width: 130,
  },
];
