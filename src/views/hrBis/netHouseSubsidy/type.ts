interface FormSchemaTypeCom {
  month?: [Date | string | null, Date | string | null] | null;
  durIng?: string;
  status?: string;
  creatorUserAccount?: string;
  creatorUserId?: string;
  startDim?: string;
  endDim?: string;
}
export interface FormSchemaType extends FormSchemaTypeCom {
  errorRemarks?: string[];
}
export interface FormSchemaTypeHandle extends FormSchemaTypeCom {
  errorRemarks?: string;
}
