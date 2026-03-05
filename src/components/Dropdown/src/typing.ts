export interface DropMenu {
  onClick?: Fn;
  to?: string;
  icon?: string;
  event: string | number;
  text: string;
  disabled?: boolean;
  divider?: boolean;
}

export interface SubDropMenu {
  parentId: string | number;
  key: string | number;
  text: string;
  disabled?: boolean;
  children?: SubDropMenu[];
  displayName: string;
  orgCode: string;
}
