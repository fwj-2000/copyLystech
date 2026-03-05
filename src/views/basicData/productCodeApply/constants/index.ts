export const BATCH_OPERATION_TYPES = {
  IMPORT: 'import',
  SPECIAL_IMPORT: 'specialImport',
  EXPORT: 'export',
} as const;

export const DRAWING_ACTIONS = {
  CHECK_DRAWING: 'handleCheckDrawing',
  BATCH_ENABLE: 'handleBatchEnable',
  BATCH_DISABLED: 'handleBatchDisabled',
} as const;

export const UPLOAD_TYPES = {
  DESENSITIZED: 'desensitized',
  CUSTOMER: 'customer',
} as const;

export const STATUS_TYPES = {
  ENABLED: '1',
  DISABLED: '2',
  PENDING_REVIEW: '3',
} as const;

export const POLLING_CONFIG = {
  INTERVAL: 3000,
  MAX_RETRIES: 10,
} as const;
