import 'echarts-gl';
import { chinaCoords, vemCoords, indiaCoords } from './data';
import ttPng from './static/tt.png';
import tt2Png from './static/tt2.png';

// 文本面板配置
const textPanelOptions = {
  type: 'scatter3D',
  coordinateSystem: 'geo3D',
  symbol: 'none',
  label: {
    show: true,
    formatter: params => {
      const dataMap = {
        中国: { value: '1.2亿', desc: '用户总量' },
        印度: { value: '9800万', desc: '用户总量' },
        越南: { value: '3600万', desc: '用户总量' },
      };
      return `{title|${params.name}}\n{value|${dataMap[params.name].value}}\n{desc|${dataMap[params.name].desc}}`;
    },
    rich: {
      title: {
        fontSize: 16,
        color: '#fff',
        lineHeight: 24,
      },
      value: {
        fontSize: 22,
        color: '#ff7b00',
        fontWeight: 'bold',
        lineHeight: 30,
      },
      desc: {
        fontSize: 14,
        color: '#ccc',
        lineHeight: 20,
      },
    },
    position: 'right',
    distance: 8,
    textStyle: {
      backgroundColor: 'rgba(10,30,60,0.8)',
      borderColor: '#ff7b00',
      borderWidth: 1,
      borderRadius: 4,
      padding: [8, 12],
    },
  },
  data: [
    { name: '中国', value: [116.4, 39.9, 0] }, // 文本位置偏移
    { name: '印度', value: [77.23, 28.61, 0] },
    { name: '越南', value: [105.85, 21.02, 0] },
  ],
};
const getBar3DOptions = ({ data = [], options = {} }: { data?: any[]; options?: any }) => {
  return {
    type: 'bar3D',
    coordinateSystem: 'geo3D',
    bevelSize: 1,
    bevelSmoothness: 5,
    minHeight: 3,
    data,
    barSize: 0.4,
    shading: 'lambert',
    label: {
      show: true,
      distance: 0,
      formatter: '{b}',
      textStyle: {
        color: '#fff',
        fontSize: 16,
      },
    },
    itemStyle: {
      color: '#fe7a00',
    },
    emphasis: {
      label: {
        show: true,
      },
      itemStyle: {
        opacity: 1,
      },
    },
    ...options,
  };
};

// 地图点位
const scatterOptions = {
  type: 'scatter3D',
  coordinateSystem: 'geo3D',
  // symbol: 'path://M0 0 L0 10 L-20 10 L-20 8 L-5 8 L0 0 Z', // 使用 SVG 路径
  // symbol: 'path://M0 0 L-25 0 L-50 25 L-25 25 L-25 50 L-25 0 L0 0Z', // 使用 SVG 路径
  symbol: 'path://M0 0 L-30 0 L-60 20 L-35 20 L-35 30 L-30 30 L-30 60 L-30 0 L0 0Z', // 使用 SVG 路径
  symbolSize: 60, // 散点大小
  itemStyle: {
    color: '#ff7b01', // 散点颜色
  },
  label: {
    show: true,
    distance: 2,
    formatter: '{b}',
    position: 'top',
    color: '#fff',
    fontSize: 16,
  },
  data: [
    {
      name: '深圳',
      value: [114.117, 22.708], //深圳平湖
      // symbolSize: 80, // 散点大小
    },
    {
      name: '东台',
      value: [120.3834, 32.8843], //东台
      symbolSize: 90, // 散点大小
    },
    {
      name: '苏州',
      value: [120.6313, 31.3022], //苏州
      // symbolSize: 30, // 散点大小
    },
    {
      name: '郑州',
      value: [113.6401, 34.7246], //郑州
      // symbolSize: 120, // 散点大小
    },
    {
      name: '成都',
      value: [104.1019, 30.6598], //成都
    },
    {
      name: '越南',
      value: [105.8252, 21.56716], //越南
      // symbolSize: 40, // 散点大小
    },
    {
      name: '印度',
      value: [80.27847, 13.08784], //印度
    },
  ],
};

const geo3dOptions = {
  map: 'word', // 使用注册的地图名称
  shading: 'realistic', // 渲染模式
  baseTexture: ttPng,
  realisticMaterial: {
    // 材质属性
    detailTexture: tt2Png,
    textureTiling: 5,
    roughness: 0.9, // 表面粗糙度 (0-1)
    metalness: 0.5, // 金属质感 (0-1)
  },
  itemStyle: {
    // 设置地图区域的填充颜色
    // color: 'rgb(7, 40, 84, 0.4)',
    // 设置地图边框颜色
    borderColor: 'rgb(55, 177, 248)',
    // 设置地图边框宽度
    borderWidth: 2,
    emphasis: {
      areaColor: 'rgb(7, 40, 84, 0.8)',
    },
  },
  emphasis: {
    label: {
      show: false,
      color: '#fff',
      textStyle: {
        color: '#fff',
      },
    },
    areaColor: 'rgb(7, 40, 84, 0.8)',
  },
  viewControl: {
    // 视角控制
    projection: 'perspective', // 透视投影
    autoRotate: false, // 自动旋转
    autoRotateSpeed: 5, // 旋转速度
    distance: 55, // 观察距离
    alpha: 45, // 水平旋转角度
    minAlpha: 40, // 最小倾斜角度
    maxAlpha: 45, // 最大倾斜角度
    beta: 20, // 垂直倾斜角度 (关键参数)
    minBeta: 10, // 最小倾斜角度
    maxBeta: 30, // 最大倾斜角度
  },
  regionHeight: 1.8, // 区域凸起高度
};

// 流光线条
const linesOptions = {
  type: 'lines3D',
  coordinateSystem: 'geo3D',
  polyline: true,
  effect: {
    show: true,
    period: 3, // 动画周期（秒）
    trailLength: 0.2, // 拖尾长度（0-1）
    trailOpacity: 1,
  },
  lineStyle: {
    color: '#fff',
    width: 1,
    opacity: 0.5,
  },
  data: [
    {
      // 定义流光路径坐标（需根据地图边缘坐标填充）
      coords: chinaCoords,
    },
    {
      coords: indiaCoords,
    },
    {
      coords: vemCoords,
    },
  ],
};

// 连接线配置
// const connectorLines = {
//   type: 'lines3D',
//   coordinateSystem: 'geo3D',
//   polyline: true,
//   effect: {
//     show: true,
//     trailWidth: 2,
//     trailLength: 0.15
//   },
//   lineStyle: {
//     color: 'red',
//     width: 10,
//     opacity: 1
//   },
//   data: [
//     {
//       coords: [
//         [80.27847, 13.08784], // 圆柱顶部
//         [80.27847, 13.08784 - 10, 5] // 文本位置
//       ]
//     },
//   ]
// };

export const mapOptions: any = {
  tooltip: {
    show: true,
    trigger: 'item',
    showDelay: 0,
    transitionDuration: 0.2,
  },
  // 定义地理坐标系
  // geo: geoOptions,
  geo3D: geo3dOptions,
  series: [
    // getBar3DOptions({
    //   data: [{
    //     name: '深圳',
    //     value: [114.117, 22.708, 0], //深圳平湖
    //   },
    //   {
    //     name: '东台',
    //     value: [120.3834, 32.8843, 0], //东台
    //   },
    //   {
    //     name: '郑州',
    //     value: [113.6401, 34.7246, 0], //郑州
    //   },
    //   {
    //     name: '成都',
    //     value: [104.1019, 30.6598, 0], //成都
    //   },
    //   {
    //     name: '越南',
    //     value: [105.8252, 21.56716, 0], //越南
    //   },
    //   {
    //     name: '印度',
    //     value: [80.27847, 13.08784, 0], //印度
    //   }],
    //   options: {
    //     minHeight: 2,
    //   }
    // }),
    // getBar3DOptions({
    //   data: [{
    //     name: '苏州',
    //     value: [120.6313, 31.3022, 0], //苏州
    //   }],
    //   options: {
    //     minHeight: 1,
    //   }
    // }),
    linesOptions,
    // connectorLines,
    scatterOptions,
    // textPanelOptions,
  ],
};
