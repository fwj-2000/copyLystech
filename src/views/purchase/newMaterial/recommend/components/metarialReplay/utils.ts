const editStatus = [3, 4, 6, 15, 16];

// 采购：可编辑状态
export const isEditStatus = status => {
  if (editStatus.includes(status)) {
    return true;
  }
  return false;
};

// 工程：可编辑状图案
const EditStatusEngineering = [3, 4, 6, 15];
export const isEditStatusEngineering = status => {
  if (EditStatusEngineering.includes(status)) {
    return true;
  }
  return false;
};
