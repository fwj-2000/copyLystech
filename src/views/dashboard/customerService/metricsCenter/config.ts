import WeeklyAnalysis from './Content/WeeklyAnalysis/index.vue';
import Accuracy from './Content/Accuracy/index.vue';
import ScrollComparison from './Content/ScrollComparison/index.vue';
import TransactionModeAndCurrency from './Content/TransactionModeAndCurrency/index.vue';
import ForecastDemandRecords from './Content/ForecastDemandRecords/index.vue';
import ProductCategory from './Content/ProductCategory/index.vue';
import Project from './Content/Project/index.vue';
import MarginDistribution from './Content/MarginDistribution/index.vue';
import ProjectPhase from './Content/ProjectPhase/index.vue';
import PartNumber from './Content/PartNumber/index.vue';

const singleBlock = {
  xs: 'grid-column: span 24;',
  sm: 'grid-column: span 24;',
  xl: 'grid-column: span 6;',
  xxl: 'grid-column: span 6;',
};
const multiBlock2 = {
  xs: 'grid-column: span 24;',
  sm: 'grid-column: span 24;',
  xl: 'grid-column: span 12;',
  xxl: 'grid-column: span 12;',
};
const multiBlock3 = {
  xs: 'grid-column: span 24;',
  sm: 'grid-column: span 24;',
  xl: 'grid-column: span 18;',
  xxl: 'grid-column: span 18;',
};
const multiBlock4 = {
  xs: 'grid-column: span 24;',
  sm: 'grid-column: span 24;',
  xl: 'grid-column: span 24;',
  xxl: 'grid-column: span 24;',
};
// 所有页面组件配置
export const componentList = [
  {
    gridStyle: multiBlock2,
    component: WeeklyAnalysis,
  },
  {
    gridStyle: multiBlock2,
    component: Accuracy,
  },
  {
    gridStyle: multiBlock3,
    component: ScrollComparison,
  },
  {
    gridStyle: singleBlock,
    component: TransactionModeAndCurrency,
  },
  {
    gridStyle: multiBlock4,
    component: ForecastDemandRecords,
  },
  {
    gridStyle: multiBlock2,
    component: ProductCategory,
  },
  {
    gridStyle: multiBlock2,
    component: Project,
  },
  {
    gridStyle: multiBlock2,
    component: MarginDistribution,
  },
  {
    gridStyle: multiBlock2,
    component: ProjectPhase,
  },
  {
    gridStyle: multiBlock2,
    component: PartNumber,
  },
];
