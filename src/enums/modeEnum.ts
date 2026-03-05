/**
 * menu type
 * @desc 编辑类型
 */
export enum ModeTypeEnum {
  /**
   * 新增模式
   */
  ADD = 'add',

  /**
   * 编辑模式
   */
  EDIT = 'edit',

  /**
   * 审核编辑模式（可编辑）
   */
  AUDIT_EDIT = 'audit_edit',

  /**
   * 审核查看模式（不可编辑）
   */
  AUDIT_VIEW = 'audit_view',

  /**
   * 查看模式（不可编辑）
   */
  VIEW = 'view',
}
