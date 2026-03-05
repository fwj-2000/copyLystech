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
