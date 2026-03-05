interface TypeOptionItem {
  id: string;
  parentId: string;
  fullName: string;
  enCode: string;
  enabledMark: number;
  sortCode: number;
}


export type TypeOption = TypeOptionItem[];

export interface ModalComponent {
  $el: HTMLElement;
  resetForm: () => void;
  setVisible: (visible: boolean) => void;
  clearForm: () => void;
  Form: () => void;
  setFormData: (data: Record<string, any>) => void;
}
