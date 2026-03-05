const defaultIsNud = '';
const isNudOptions = [
  { label: '全部', value: '' },
  { label: 'NUD', value: 'true' },
  { label: '非NUD', value: 'false' },
];

const defaultIsNpi = '';
const isNpiOptions = [
  { label: '全部', value: '' },
  { label: 'NPI', value: 'true' },
  { label: 'MP', value: 'false' },
];

export const allOptions = [
  {
    label: 'NUD',
    field: 'isNud',
    width: 74,
    default: defaultIsNud,
    options: isNudOptions,
    $attrs: {},
  },
  {
    label: 'NPI',
    field: 'isNpi',
    width: 74,
    default: defaultIsNpi,
    options: isNpiOptions,
    $attrs: {},
  },
];
