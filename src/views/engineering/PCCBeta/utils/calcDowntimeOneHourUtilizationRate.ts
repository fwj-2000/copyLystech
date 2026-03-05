import { BigNumber, bignumber } from 'mathjs';

enum ProcessTypeTag {
  T = 1, // 平板
  R = 2, // 圆刀
  L = 3, // 激光
}

interface Process {
  isMain: 0 | 1;
  speed?: number;
}

interface StepDistance {
  isMain: boolean;
  stepDistance?: number;
}

interface Material {
  wholeLength?: number;
}

interface Input {
  processList: Process[];
  process: ProcessTypeTag;
  stepDistanceList: StepDistance[];
  materialList: Material[];
  singleRefuelingDuration: number;
}

type UtilizationResult = [BigNumber, BigNumber];

const SIXTY = bignumber(60);

function getMainProcess(processList: Process[]): Process {
  const mainProcess = processList.find(item => item.isMain === 1);
  if (!mainProcess) {
    throw new Error('未找到主工艺');
  }
  return mainProcess;
}

function getMainSpeed(process: Process, processType: ProcessTypeTag, stepDistanceList: StepDistance[]): BigNumber {
  const baseSpeed = bignumber(process.speed ?? 0);

  if (processType !== ProcessTypeTag.T) {
    return baseSpeed;
  }

  const mainStep = stepDistanceList.find(item => item.isMain);
  if (mainStep?.stepDistance) {
    return baseSpeed.times(mainStep.stepDistance).dividedBy(1000);
  }

  return baseSpeed;
}

function getReciprocalSum(materialList: Material[]): BigNumber {
  const validMaterials = materialList.filter(m => m.wholeLength !== undefined && m.wholeLength > 0);

  const reciprocalSum = validMaterials.reduce<BigNumber>((sum, material) => {
    const length = bignumber(material.wholeLength); // 这里已确保 wholeLength 一定是 number
    return sum.plus(bignumber(1).dividedBy(length));
  }, bignumber(0));

  if (reciprocalSum.isZero()) {
    throw new Error('材料长度无效，无法计算倒数之和');
  }

  return reciprocalSum;
}

function calcDowntimeOneHour(v: BigNumber, h: BigNumber, reciprocalSum: BigNumber): BigNumber {
  const numerator = SIXTY.times(v).times(h);
  const denominator = bignumber(1).dividedBy(reciprocalSum).plus(v.times(h));
  return numerator.dividedBy(denominator);
}

function calcUtilizationRate(downtimeOneHour: BigNumber): BigNumber {
  return SIXTY.minus(downtimeOneHour).dividedBy(SIXTY).times(100);
}

/**
 * 1H停机时长(MIN) & 设备稼动率
 * (60 * 主工序速度 * 小时数) /
 * (1 / (1/材料1长度 + 1/材料2长度 + 1/材料n长度) + 主工序速度 * 小时数)
 */
export function calculateUtilizationRate(input: Input): UtilizationResult {
  const mainProcess = getMainProcess(input.processList);
  const v = getMainSpeed(mainProcess, input.process, input.stepDistanceList);
  const h = bignumber(input.singleRefuelingDuration || 1);
  const reciprocalSum = getReciprocalSum(input.materialList);

  const downtimeOneHour = calcDowntimeOneHour(v, h, reciprocalSum);
  const utilizationRate = calcUtilizationRate(downtimeOneHour);

  return [downtimeOneHour, utilizationRate];
}
