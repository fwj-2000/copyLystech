import buildPartNumber from '/@/views/engineering/PCCBeta/components/PccMaterial/buildPartNumber';
import { omit } from 'lodash-es';
import { isExist } from '/@/utils/is';
export default function handleOriginPartNumberChange(materialCode, data, params, disAssignFields) {
  if (!materialCode || !data) return;
  const { row } = params;
  const { width, eightCode: rowEightCode } = row;
  if (!(isExist(width) && rowEightCode)) {
    row.partNumber = '';
    row.originPartNumberName = '';
    row.originPartNumber = '';
    return;
  }
  // 选中查询结果
  const [_, eightCode, calcWidth] = materialCode?.split('-');
  const { materialDesc, materialName, materialLength, materialWidth, materialColor, originalModelNumber, totalThickness, tolerance } = data;
  const partNumber = buildPartNumber(calcWidth, row.width, eightCode, materialCode);
  if (isExist(width) && isExist(materialWidth)) {
    if (width === 0) {
      row.utilizationRate = '100%';
    } else {
      row.utilizationRate = ((Math.floor(materialWidth / width) / (materialWidth / width)) * 100).toFixed(2) + '%';
    }
  }
  // if (assign) {
  //   Object.assign(row, data);
  // }

  console.log(disAssignFields, 'disAssignFieldsdisAssignFieldsdisAssignFieldsdisAssignFields');
  // console.log(pick(data, assignFields), 'pick(data, assignFields)pick(data, assignFields)pick(data, assignFields)pick(data, assignFields)');
  // if (assignFields && !isEmpty(assignFields)) {
  //   Object.assign(row, pick(data, assignFields));
  // }

  Object.assign(
    row,
    omit(
      {
        description: materialDesc || materialName || null,
        wholeLength: materialLength,
        wholeWidth: materialWidth,
        color: materialColor,
        partNumber,
        originalModelNumber,
        totalThickness,
        tolerance,
      },
      disAssignFields,
    ),
  );
}
