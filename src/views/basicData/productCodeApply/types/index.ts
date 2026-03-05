export interface FormState {
  ApplyUserId: string;
  ApplyDeptId: string;
  ApplyDate: string;
  ExpiryDate: string;
  InsidePartNumber: string;
  ApplyReason: string | null;
  InsideProjectCode: string | null;
  TerminalCustomerCode: string | null;
  TerminalProjectCode: string;
  TerminalCustomerPartNumber: string;
  TerminalCustomerVersion: string;
  ProductDesc: string;
  ShipPattern: string | null;
  ImmediateCustomerCode: string;
  Factory: string | null;
  MainProcess: string | null;
  ImmediateCustomerDrawingNumber: string;
  TerminalCustomerDrawingNumber: string;
  ImmediateCustomerProjectCode: string;
  ImmediateCustomerPartNumber: string;
  ImmediateCustomerPartVersion: string;
  Remark: string;
}

export interface ApiResponse {
  code: number;
  msg: string;
  data?: any;
}

export interface ProductCodeApplyRecord {
  Id: string;
  ApplyCode: string;
  InsidePartNumber: string;
  Status: number;
  DesensitizedDrawingsId?: string;
  DesensitizedDrawingsName?: string;
  TerminalCustomerPartNumber: string;
  TerminalCustomerPartVersion: string;
  ProductDesc: string;
  ShipPattern: string | null;
  ImmediateCustomerCode: string;
  Factory: string | null;
  MainProcess: string | null;
  ImmediateCustomerDrawingNumber: string;
  TerminalCustomerDrawingNumber: string;
  ImmediateCustomerProjectCode: string;
  ImmediateCustomerPartNumber: string;
  ImmediateCustomerPartVersion: string;
  Remark: string;
}

export interface BatchOperationConfig {
  title: string;
  importPreviewApi: Function;
  importSaveApi: Function;
  templateApi: Function;
  previewColumn: any[];
  usePolling: boolean;
  pollingParams: PollingParams;
  apiParams: any;
}

export interface PollingParams {
  interval: number;
  getTaskStatus: Function;
  getTaskDataList: Function;
  cancelTask: Function;
  taskRead: Function;
}
