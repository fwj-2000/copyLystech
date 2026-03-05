import content1 from './static/1.svg';
import content2 from './static/2.svg';
import content3 from './static/3.svg';
import content4 from './static/4.svg';
import content5 from './static/5.svg';
import content6 from './static/6.svg';
import content7 from './static/7.svg';
import content8 from './static/8.svg';
import content9 from './static/9.svg';
import content10 from './static/10.svg';
import content11 from './static/11.svg';
import content12 from './static/12.svg';
import content13 from './static/13.svg';
import content14 from './static/14.svg';
import centerView from './Content/center.vue';
import { EContentType, IContent } from './types';

export const contentList: IContent[] = [
  {
    src: content1,
  },
  {
    src: content2,
  },
  {
    type: EContentType.COMPONENT,
    component: centerView,
    gridStyle: {
      'grid-column-start': 3,
      'grid-column-end': 5,
      'grid-row-start': 1,
      'grid-row-end': 3,
    },
  },
  {
    src: content3,
  },
  {
    src: content4,
  },
  {
    src: content5,
  },
  {
    src: content6,
  },
  {
    src: content7,
  },
  {
    src: content8,
  },
  {
    src: content9,
  },
  {
    src: content10,
  },
  {
    src: content11,
  },
  {
    src: content12,
  },
  {
    src: content13,
  },
  {
    src: content14,
  },
];
