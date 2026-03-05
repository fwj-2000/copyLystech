interface FormSchemaTypeCom {
  month?: string;
  durIng?: string;
  status?: string;
  creatorUserAccount?: string;
  creatorUserId?: string;
}
export interface FormSchemaType extends FormSchemaTypeCom {
  errorRemarks?: string[];
}
export interface FormSchemaTypeHandle extends FormSchemaTypeCom {
  errorRemarks?: string;
}
