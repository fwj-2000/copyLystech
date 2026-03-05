import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();

const teams = [
  {
    name: '工序名称1',
    region: 'LPL',
    group: 'B',
    color: 'rgb(218, 232, 252, 0.9)',
  },
  {
    name: '工序名称2',
    region: 'LPL',
    group: 'C',
  },
  {
    name: '工序名称3',
    region: 'LPL',
    group: 'A',
  },
  {
    name: '工序名称4',
    region: 'LCK',
    group: 'D',
  },
  {
    name: '工序名称5',
    region: 'LCK',
    group: 'C',
  },
  {
    name: '工序名称6',
    region: 'LCK',
    group: 'B',
  },
  {
    name: '工序名称7',
    region: 'LEC',
    group: 'A',
  },
  {
    name: '工序名称8',
    region: 'LEC',
    group: 'B',
  },
  {
    name: '工序名称9',
    region: 'LCS',
    group: 'A',
  },
  {
    name: '工序名称10',
    region: 'LCS',
    group: 'D',
  },
  {
    name: '工序名称11',
    region: 'PCS',
    group: 'D',
  },
  {
    name: '工序名称12',
    region: 'VCS',
    group: 'C',
  },
  {
    name: '工序名称13',
    region: 'LPL',
  },
  {
    name: '工序名称14',
    region: 'LCK',
  },
  {
    name: '工序名称15',
    region: 'LEC',
  },
  {
    name: '工序名称16',
    region: 'LEC',
  },
  {
    name: '工序名称17',
    region: 'PCS',
  },
  {
    name: '工序名称18',
    region: 'LCS',
  },
  {
    name: '工序名称19',
    region: 'VCS',
  },
  {
    name: '工序名称20',
    region: 'LJL',
  },
  {
    name: '工序名称21',
    region: 'LCO',
  },
  {
    name: '工序名称22',
    region: 'TCL',
  },
  {
    name: '工序名称23',
    region: 'LLA',
  },
  {
    name: '工序名称24',
    region: 'CBLOL',
  },
];

export const teamList = teams.map((team, index) => ({
  x: 60 + 120 * Math.floor(index / 12),
  y: 30 + (index % 12) * 40,
  type: 'flow-node',
  text: team.name,
  properties: {
    region: team.region,
  },
}));

export const groupData = {
  nodes: [
    {
      id: 'groupA_1',
      x: 400,
      y: 40,
      type: 'flow-node',
      text: '工序名称1',
      properties: {
        region: '1',
      },
    },
    {
      id: 'groupA_2',
      x: 400,
      y: 80,
      type: 'flow-node',
      text: '工序名称2',
      properties: {
        region: 'LCK',
      },
    },
    {
      id: 'groupA_3',
      x: 400,
      y: 120,
      type: 'flow-node',
      text: '工序名称3',
      properties: {
        region: 'LPL',
      },
    },
    {
      id: 'groupA_4',
      x: 400,
      y: 160,
      type: 'flow-node',
      text: '工序名称4',
    },

    {
      id: 'groupB_1',
      x: 400,
      y: 220,
      type: 'flow-node',
      text: '工序名称5',
      properties: {
        region: 'LPL',
      },
    },
    {
      id: 'groupB_2',
      x: 400,
      y: 260,
      type: 'flow-node',
      text: '工序名称6',
      properties: {
        region: 'LEC',
      },
    },
    {
      id: 'groupB_3',
      x: 400,
      y: 300,
      type: 'flow-node',
      text: '工序名称7',
      properties: {
        region: 'LCK',
      },
    },
    {
      id: 'groupB_4',
      x: 400,
      y: 340,
      type: 'flow-node',
      text: '工序名称8',
    },

    {
      id: 'groupC_1',
      x: 400,
      y: 400,
      type: 'flow-node',
      text: '工序名称9',
      properties: {
        region: 'LEC',
      },
    },
    {
      id: 'groupC_2',
      x: 400,
      y: 440,
      type: 'flow-node',
      text: '工序名称10',
      properties: {
        region: 'LPL',
      },
    },
    {
      id: 'groupC_3',
      x: 400,
      y: 480,
      type: 'flow-node',
      text: '工序名称11',
      properties: {
        region: 'VCS',
      },
    },
    {
      id: 'groupC_4',
      x: 400,
      y: 520,
      type: 'flow-node',
      text: '工序名称12',
    },

    {
      id: 'groupD_1',
      x: 400,
      y: 580,
      type: 'flow-node',
      text: '工序名称13',
      properties: {
        region: 'LCK',
      },
    },
    {
      id: 'groupD_2',
      x: 400,
      y: 620,
      type: 'flow-node',
      text: '工序名称14',
      properties: {
        region: 'PCS',
      },
    },
    {
      id: 'groupD_3',
      x: 400,
      y: 660,
      type: 'flow-node',
      text: '工序名称15',
      properties: {
        region: 'LCS',
      },
    },
    {
      id: 'groupD_4',
      x: 400,
      y: 700,
      type: 'flow-node',
      text: '工序名称16',
    },
    // 8强
    {
      id: 'groupA1_1',
      x: 600,
      y: 100,
      type: 'flow-node',
      text: 'TBD',
    },
    {
      id: 'groupA1_2',
      x: 600,
      y: 160,
      type: 'flow-node',
      text: 'TBD',
    },

    {
      id: 'groupB1_1',
      x: 600,
      y: 280,
      type: 'flow-node',
      text: 'TBD',
    },
    {
      id: 'groupB1_2',
      x: 600,
      y: 340,
      type: 'flow-node',
      text: 'TBD',
    },

    {
      id: 'groupC1_1',
      x: 600,
      y: 460,
      type: 'flow-node',
      text: 'TBD',
    },
    {
      id: 'groupC1_2',
      x: 600,
      y: 520,
      type: 'flow-node',
      text: 'TBD',
    },

    {
      id: 'groupD1_1',
      x: 600,
      y: 640,
      type: 'flow-node',
      text: 'TBD',
    },
    {
      id: 'groupD1_2',
      x: 600,
      y: 700,
      type: 'flow-node',
      text: 'TBD',
    },
    // 四强
    {
      id: 'groupA2_1',
      x: 800,
      y: 200,
      type: 'flow-node',
      text: 'TBD',
    },
    {
      id: 'groupA2_2',
      x: 800,
      y: 260,
      type: 'flow-node',
      text: 'TBD',
    },
    {
      id: 'groupA2_3',
      x: 800,
      y: 500,
      type: 'flow-node',
      text: 'TBD',
    },
    {
      id: 'groupA2_4',
      x: 800,
      y: 560,
      type: 'flow-node',
      text: 'TBD',
    },
    // 决赛
    {
      id: 'groupA3_3',
      x: 1000,
      y: 340,
      type: 'flow-node',
      text: 'TBD',
    },
    {
      id: 'groupA3_4',
      x: 1000,
      y: 400,
      type: 'flow-node',
      text: 'TBD',
    },
    // 冠军
    {
      id: 'groupA4_1',
      x: 1200,
      y: 370,
      type: 'flow-node',
      text: 'TBD',
    },
    // 队伍
    // ...teamList,
  ],
  edges: [
    {
      type: 'better-line',
      sourceNodeId: 'groupA_1',
      targetNodeId: 'groupA1_1',
      startPoint: {
        x: 450,
        y: 40,
      },
      endPoint: {
        x: 550,
        y: 100,
      },
      pointsList: [
        {
          x: 450,
          y: 40,
        },
        {
          x: 500,
          y: 40,
        },
        {
          x: 500,
          y: 100,
        },
        {
          x: 550,
          y: 100,
        },
      ],
    },
    {
      type: 'better-line',
      sourceNodeId: 'groupA_2',
      targetNodeId: 'groupA1_1',
      startPoint: {
        x: 450,
        y: 80,
      },
      endPoint: {
        x: 550,
        y: 100,
      },
      pointsList: [
        {
          x: 450,
          y: 80,
        },
        {
          x: 500,
          y: 80,
        },
        {
          x: 500,
          y: 100,
        },
        {
          x: 550,
          y: 100,
        },
      ],
    },
    {
      type: 'better-line',
      sourceNodeId: 'groupA_3',
      targetNodeId: 'groupA1_1',
      startPoint: {
        x: 450,
        y: 120,
      },
      endPoint: {
        x: 550,
        y: 100,
      },
      properties: {},
      pointsList: [
        {
          x: 450,
          y: 120,
        },
        {
          x: 500,
          y: 120,
        },
        {
          x: 500,
          y: 100,
        },
        {
          x: 550,
          y: 100,
        },
      ],
    },
    {
      type: 'better-line',
      sourceNodeId: 'groupA_4',
      targetNodeId: 'groupA1_1',
      startPoint: {
        x: 450,
        y: 160,
      },
      endPoint: {
        x: 550,
        y: 100,
      },
      pointsList: [
        {
          x: 450,
          y: 160,
        },
        {
          x: 500,
          y: 160,
        },
        {
          x: 500,
          y: 100,
        },
        {
          x: 550,
          y: 100,
        },
      ],
    },
    {
      type: 'better-line',
      sourceNodeId: 'groupB_1',
      targetNodeId: 'groupB1_1',
      startPoint: {
        x: 450,
        y: 220,
      },
      endPoint: {
        x: 550,
        y: 280,
      },
      properties: {},
      pointsList: [
        {
          x: 450,
          y: 220,
        },
        {
          x: 500,
          y: 220,
        },
        {
          x: 500,
          y: 280,
        },
        {
          x: 550,
          y: 280,
        },
      ],
    },
    {
      type: 'better-line',
      sourceNodeId: 'groupB_2',
      targetNodeId: 'groupB1_1',
      startPoint: {
        x: 450,
        y: 260,
      },
      endPoint: {
        x: 550,
        y: 280,
      },
      pointsList: [
        {
          x: 450,
          y: 260,
        },
        {
          x: 500,
          y: 260,
        },
        {
          x: 500,
          y: 280,
        },
        {
          x: 550,
          y: 280,
        },
      ],
    },
    {
      type: 'better-line',
      sourceNodeId: 'groupB_3',
      targetNodeId: 'groupB1_1',
      startPoint: {
        x: 450,
        y: 300,
      },
      endPoint: {
        x: 550,
        y: 280,
      },
      pointsList: [
        {
          x: 450,
          y: 300,
        },
        {
          x: 500,
          y: 300,
        },
        {
          x: 500,
          y: 280,
        },
        {
          x: 550,
          y: 280,
        },
      ],
    },
    {
      type: 'better-line',
      sourceNodeId: 'groupB_4',
      targetNodeId: 'groupB1_1',
      startPoint: {
        x: 450,
        y: 340,
      },
      endPoint: {
        x: 550,
        y: 280,
      },
      pointsList: [
        {
          x: 450,
          y: 340,
        },
        {
          x: 500,
          y: 340,
        },
        {
          x: 500,
          y: 280,
        },
        {
          x: 550,
          y: 280,
        },
      ],
    },
    {
      type: 'better-line',
      sourceNodeId: 'groupC_1',
      targetNodeId: 'groupC1_1',
      startPoint: {
        x: 450,
        y: 400,
      },
      endPoint: {
        x: 550,
        y: 460,
      },
      properties: {},
      pointsList: [
        {
          x: 450,
          y: 400,
        },
        {
          x: 500,
          y: 400,
        },
        {
          x: 500,
          y: 460,
        },
        {
          x: 550,
          y: 460,
        },
      ],
    },
    {
      type: 'better-line',
      sourceNodeId: 'groupC_2',
      targetNodeId: 'groupC1_1',
      startPoint: {
        x: 450,
        y: 440,
      },
      endPoint: {
        x: 550,
        y: 460,
      },
      pointsList: [
        {
          x: 450,
          y: 440,
        },
        {
          x: 500,
          y: 440,
        },
        {
          x: 500,
          y: 460,
        },
        {
          x: 550,
          y: 460,
        },
      ],
    },
    {
      type: 'better-line',
      sourceNodeId: 'groupC_3',
      targetNodeId: 'groupC1_1',
      startPoint: {
        x: 450,
        y: 480,
      },
      endPoint: {
        x: 550,
        y: 460,
      },
      properties: {},
      pointsList: [
        {
          x: 450,
          y: 480,
        },
        {
          x: 500,
          y: 480,
        },
        {
          x: 500,
          y: 460,
        },
        {
          x: 550,
          y: 460,
        },
      ],
    },
    {
      type: 'better-line',
      sourceNodeId: 'groupC_4',
      targetNodeId: 'groupC1_1',
      startPoint: {
        x: 450,
        y: 520,
      },
      endPoint: {
        x: 550,
        y: 460,
      },
      properties: {},
      pointsList: [
        {
          x: 450,
          y: 520,
        },
        {
          x: 500,
          y: 520,
        },
        {
          x: 500,
          y: 460,
        },
        {
          x: 550,
          y: 460,
        },
      ],
    },
    {
      id: '5230b0ec-5271-4fa7-955e-f00bbf4b5939',
      type: 'better-line',
      sourceNodeId: 'groupD_1',
      targetNodeId: 'groupD1_1',
      startPoint: {
        x: 450,
        y: 580,
      },
      endPoint: {
        x: 550,
        y: 640,
      },
      properties: {},
      pointsList: [
        {
          x: 450,
          y: 580,
        },
        {
          x: 500,
          y: 580,
        },
        {
          x: 500,
          y: 640,
        },
        {
          x: 550,
          y: 640,
        },
      ],
    },
    {
      id: '9e9397d8-a86a-46cd-a4f5-afdaeabb27c7',
      type: 'better-line',
      sourceNodeId: 'groupD_2',
      targetNodeId: 'groupD1_1',
      startPoint: {
        x: 450,
        y: 620,
      },
      endPoint: {
        x: 550,
        y: 640,
      },
      properties: {},
      pointsList: [
        {
          x: 450,
          y: 620,
        },
        {
          x: 500,
          y: 620,
        },
        {
          x: 500,
          y: 640,
        },
        {
          x: 550,
          y: 640,
        },
      ],
    },
    {
      id: '1d4f8e12-edf3-4bf3-b30e-6fcc11515193',
      type: 'better-line',
      sourceNodeId: 'groupD_3',
      targetNodeId: 'groupD1_1',
      startPoint: {
        x: 450,
        y: 660,
      },
      endPoint: {
        x: 550,
        y: 640,
      },
      properties: {},
      pointsList: [
        {
          x: 450,
          y: 660,
        },
        {
          x: 500,
          y: 660,
        },
        {
          x: 500,
          y: 640,
        },
        {
          x: 550,
          y: 640,
        },
      ],
    },
    {
      id: '89547de0-25a1-4ce1-9f63-e388306e0a1b',
      type: 'better-line',
      sourceNodeId: 'groupD_4',
      targetNodeId: 'groupD1_1',
      startPoint: {
        x: 450,
        y: 700,
      },
      endPoint: {
        x: 550,
        y: 640,
      },
      properties: {},
      pointsList: [
        {
          x: 450,
          y: 700,
        },
        {
          x: 500,
          y: 700,
        },
        {
          x: 500,
          y: 640,
        },
        {
          x: 550,
          y: 640,
        },
      ],
    },
    {
      id: '5a42d095-8efb-4af8-963c-53abbc85ce8a',
      type: 'better-line',
      sourceNodeId: 'groupD1_1',
      targetNodeId: 'groupA2_4',
      startPoint: {
        x: 650,
        y: 640,
      },
      endPoint: {
        x: 750,
        y: 560,
      },
      properties: {},
      pointsList: [
        {
          x: 650,
          y: 640,
        },
        {
          x: 700,
          y: 640,
        },
        {
          x: 700,
          y: 560,
        },
        {
          x: 750,
          y: 560,
        },
      ],
    },
    {
      id: 'af3b3eb4-5c4f-4b7f-a687-3a125ac6751d',
      type: 'better-line',
      sourceNodeId: 'groupD1_2',
      targetNodeId: 'groupA2_4',
      startPoint: {
        x: 650,
        y: 700,
      },
      endPoint: {
        x: 750,
        y: 560,
      },
      properties: {},
      pointsList: [
        {
          x: 650,
          y: 700,
        },
        {
          x: 700,
          y: 700,
        },
        {
          x: 700,
          y: 560,
        },
        {
          x: 750,
          y: 560,
        },
      ],
    },
    {
      id: 'aa7152ca-75a2-4e91-96d9-2d0509292386',
      type: 'better-line',
      sourceNodeId: 'groupC1_2',
      targetNodeId: 'groupA2_3',
      startPoint: {
        x: 650,
        y: 520,
      },
      endPoint: {
        x: 750,
        y: 500,
      },
      properties: {},
      pointsList: [
        {
          x: 650,
          y: 520,
        },
        {
          x: 700,
          y: 520,
        },
        {
          x: 700,
          y: 500,
        },
        {
          x: 750,
          y: 500,
        },
      ],
    },
    {
      id: '31fd67a9-a5de-4549-810c-22c1e4c75883',
      type: 'better-line',
      sourceNodeId: 'groupC1_1',
      targetNodeId: 'groupA2_3',
      startPoint: {
        x: 650,
        y: 460,
      },
      endPoint: {
        x: 750,
        y: 500,
      },
      properties: {},
      pointsList: [
        {
          x: 650,
          y: 460,
        },
        {
          x: 700,
          y: 460,
        },
        {
          x: 700,
          y: 500,
        },
        {
          x: 750,
          y: 500,
        },
      ],
    },
    {
      id: '0c6a5dd9-2ac1-4642-adea-0459761468cf',
      type: 'better-line',
      sourceNodeId: 'groupB1_2',
      targetNodeId: 'groupA2_2',
      startPoint: {
        x: 650,
        y: 340,
      },
      endPoint: {
        x: 750,
        y: 260,
      },
      properties: {},
      pointsList: [
        {
          x: 650,
          y: 340,
        },
        {
          x: 700,
          y: 340,
        },
        {
          x: 700,
          y: 260,
        },
        {
          x: 750,
          y: 260,
        },
      ],
    },
    {
      id: '82a269d8-633a-423c-bab0-a27ddec7b51e',
      type: 'better-line',
      sourceNodeId: 'groupB1_1',
      targetNodeId: 'groupA2_2',
      startPoint: {
        x: 650,
        y: 280,
      },
      endPoint: {
        x: 750,
        y: 260,
      },
      properties: {},
      pointsList: [
        {
          x: 650,
          y: 280,
        },
        {
          x: 700,
          y: 280,
        },
        {
          x: 700,
          y: 260,
        },
        {
          x: 750,
          y: 260,
        },
      ],
    },
    {
      id: 'af8d820b-8631-4c71-855d-e4bb9111b396',
      type: 'better-line',
      sourceNodeId: 'groupA1_2',
      targetNodeId: 'groupA2_1',
      startPoint: {
        x: 650,
        y: 160,
      },
      endPoint: {
        x: 750,
        y: 200,
      },
      properties: {},
      pointsList: [
        {
          x: 650,
          y: 160,
        },
        {
          x: 700,
          y: 160,
        },
        {
          x: 700,
          y: 200,
        },
        {
          x: 750,
          y: 200,
        },
      ],
    },
    {
      id: 'd74636ae-5e3f-4663-bc63-576ad14a57e0',
      type: 'better-line',
      sourceNodeId: 'groupA1_1',
      targetNodeId: 'groupA2_1',
      startPoint: {
        x: 650,
        y: 100,
      },
      endPoint: {
        x: 750,
        y: 200,
      },
      properties: {},
      pointsList: [
        {
          x: 650,
          y: 100,
        },
        {
          x: 700,
          y: 100,
        },
        {
          x: 700,
          y: 200,
        },
        {
          x: 750,
          y: 200,
        },
      ],
    },
    {
      id: 'aefc154a-ceae-4c7a-bc86-de1df47abb1e',
      type: 'better-line',
      sourceNodeId: 'groupA2_2',
      targetNodeId: 'groupA3_3',
      startPoint: {
        x: 850,
        y: 260,
      },
      endPoint: {
        x: 950,
        y: 340,
      },
      properties: {},
      pointsList: [
        {
          x: 850,
          y: 260,
        },
        {
          x: 900,
          y: 260,
        },
        {
          x: 900,
          y: 340,
        },
        {
          x: 950,
          y: 340,
        },
      ],
    },
    {
      id: '915b79d0-5a4f-4b6b-a0f4-25c6696e1e4f',
      type: 'better-line',
      sourceNodeId: 'groupA2_1',
      targetNodeId: 'groupA3_3',
      startPoint: {
        x: 850,
        y: 200,
      },
      endPoint: {
        x: 950,
        y: 340,
      },
      properties: {},
      pointsList: [
        {
          x: 850,
          y: 200,
        },
        {
          x: 900,
          y: 200,
        },
        {
          x: 900,
          y: 340,
        },
        {
          x: 950,
          y: 340,
        },
      ],
    },
    {
      id: '60a2a390-1ec0-4364-a4ba-a7d0e7210ea4',
      type: 'better-line',
      sourceNodeId: 'groupA2_3',
      targetNodeId: 'groupA3_4',
      startPoint: {
        x: 850,
        y: 500,
      },
      endPoint: {
        x: 950,
        y: 400,
      },
      properties: {},
      pointsList: [
        {
          x: 850,
          y: 500,
        },
        {
          x: 900,
          y: 500,
        },
        {
          x: 900,
          y: 400,
        },
        {
          x: 950,
          y: 400,
        },
      ],
    },
    {
      id: '14e527af-7dff-49a9-ba50-90cd225b033d',
      type: 'better-line',
      sourceNodeId: 'groupA2_4',
      targetNodeId: 'groupA3_4',
      startPoint: {
        x: 850,
        y: 560,
      },
      endPoint: {
        x: 950,
        y: 400,
      },
      properties: {},
      pointsList: [
        {
          x: 850,
          y: 560,
        },
        {
          x: 900,
          y: 560,
        },
        {
          x: 900,
          y: 400,
        },
        {
          x: 950,
          y: 400,
        },
      ],
    },
    {
      id: '5828896a-f80d-4995-b3b7-fa21be4e82cf',
      type: 'better-line',
      sourceNodeId: 'groupA3_3',
      targetNodeId: 'groupA4_1',
      startPoint: {
        x: 1050,
        y: 340,
      },
      endPoint: {
        x: 1150,
        y: 370,
      },
      properties: {},
      pointsList: [
        {
          x: 1050,
          y: 340,
        },
        {
          x: 1100,
          y: 340,
        },
        {
          x: 1100,
          y: 370,
        },
        {
          x: 1150,
          y: 370,
        },
      ],
    },
    {
      id: 'a9198a4d-5e85-4478-80fd-ad4f379be275',
      type: 'better-line',
      sourceNodeId: 'groupA3_4',
      targetNodeId: 'groupA4_1',
      startPoint: {
        x: 1050,
        y: 400,
      },
      endPoint: {
        x: 1150,
        y: 370,
      },
      properties: {},
      pointsList: [
        {
          x: 1050,
          y: 400,
        },
        {
          x: 1100,
          y: 400,
        },
        {
          x: 1100,
          y: 370,
        },
        {
          x: 1150,
          y: 370,
        },
      ],
    },
  ],
};

export const dataJson = {
  flowElementList: [
    {
      incoming: [],
      outgoing: ['Flow_33inf2k'],
      dockers: [],
      type: 2,
      properties: {
        a: 'efrwe',
        b: 'wewe',
        name: '开始',
        x: 280,
        y: 200,
        text: {
          x: 280,
          y: 200,
          value: '开始',
        },
        logicFlowType: 'bpmn:startEvent',
      },
      key: 'Event_1d42u4p',
    },
    {
      incoming: ['Flow_379e0o9'],
      outgoing: [],
      dockers: [],
      type: 3,
      properties: {
        a: 'efrwe',
        b: 'wewe',
        name: '结束',
        x: 920,
        y: 200,
        text: {
          x: 920,
          y: 200,
          value: '结束',
        },
        logicFlowType: 'bpmn:endEvent',
      },
      key: 'Event_08p8i6q',
    },
    {
      incoming: ['Flow_0pfouf0'],
      outgoing: ['Flow_3918lhh'],
      dockers: [],
      type: 6,
      properties: {
        a: 'efrwe',
        b: 'wewe',
        name: '网关',
        x: 580,
        y: 200,
        text: {
          x: 580,
          y: 200,
          value: '网关',
        },
        logicFlowType: 'bpmn:exclusiveGateway',
      },
      key: 'Gateway_1fngqgj',
    },
    {
      incoming: ['Flow_33inf2k'],
      outgoing: ['Flow_0pfouf0'],
      dockers: [],
      type: 4,
      properties: {
        a: 'efrwe',
        b: 'wewe',
        name: '用户',
        x: 420,
        y: 200,
        text: {
          x: 420,
          y: 200,
          value: '用户',
        },
        logicFlowType: 'bpmn:userTask',
      },
      key: 'Activity_2mgtaia',
    },
    {
      incoming: ['Flow_3918lhh'],
      outgoing: ['Flow_379e0o9'],
      dockers: [],
      type: 5,
      properties: {
        a: 'efrwe',
        b: 'wewe',
        name: '服务',
        x: 760,
        y: 200,
        text: {
          x: 760,
          y: 200,
          value: '服务',
        },
        logicFlowType: 'bpmn:serviceTask',
      },
      key: 'Activity_1sp8qc8',
    },
    {
      incoming: ['Event_1d42u4p'],
      outgoing: ['Activity_2mgtaia'],
      type: 1,
      dockers: [],
      properties: {
        name: '边',
        text: {
          x: 331,
          y: 200,
          value: '边',
        },
        startPoint: {
          x: 298,
          y: 200,
        },
        endPoint: {
          x: 370,
          y: 200,
        },
        pointsList: [
          {
            x: 298,
            y: 200,
          },
          {
            x: 370,
            y: 200,
          },
        ],
        logicFlowType: 'bpmn:sequenceFlow',
      },
      key: 'Flow_33inf2k',
    },
    {
      incoming: ['Activity_2mgtaia'],
      outgoing: ['Gateway_1fngqgj'],
      type: 1,
      dockers: [],
      properties: {
        name: '边2',
        text: {
          x: 507,
          y: 200,
          value: '边2',
        },
        startPoint: {
          x: 470,
          y: 200,
        },
        endPoint: {
          x: 555,
          y: 200,
        },
        pointsList: [
          {
            x: 470,
            y: 200,
          },
          {
            x: 555,
            y: 200,
          },
        ],
        logicFlowType: 'bpmn:sequenceFlow',
      },
      key: 'Flow_0pfouf0',
    },
    {
      incoming: ['Gateway_1fngqgj'],
      outgoing: ['Activity_1sp8qc8'],
      type: 1,
      dockers: [],
      properties: {
        name: '边3',
        text: {
          x: 664,
          y: 200,
          value: '边3',
        },
        startPoint: {
          x: 605,
          y: 200,
        },
        endPoint: {
          x: 710,
          y: 200,
        },
        pointsList: [
          {
            x: 605,
            y: 200,
          },
          {
            x: 710,
            y: 200,
          },
        ],
        logicFlowType: 'bpmn:sequenceFlow',
      },
      key: 'Flow_3918lhh',
    },
    {
      incoming: ['Activity_1sp8qc8'],
      outgoing: ['Event_08p8i6q'],
      type: 1,
      dockers: [],
      properties: {
        name: '边4',
        text: {
          x: 871,
          y: 200,
          value: '边4',
        },
        startPoint: {
          x: 810,
          y: 200,
        },
        endPoint: {
          x: 902,
          y: 200,
        },
        pointsList: [
          {
            x: 810,
            y: 200,
          },
          {
            x: 902,
            y: 200,
          },
        ],
        logicFlowType: 'bpmn:sequenceFlow',
      },
      key: 'Flow_379e0o9',
    },
  ],
};

export const approveNodes = [
  {
    type: 'flow-node',
    label: '工序名称1',
    // style: {
    //   width: '30px',
    //   height: '30px',
    //   borderRadius: '15px',
    //   border: '2px solid #FF6347',
    // },
    style: {
      //   width: '140px',
      //   height: '30px',
      //   borderRadius: '4px',
      //   border: '2px solid #FF6347',
    },
    property: {
      username: '',
      time: '',
      startTime: '',
      endTime: '',
    },
  },
  {
    type: 'flow-node',
    label: '工序名称2',
    style: {
      //   width: '50px',
      //   height: '40px',
      //   borderRadius: '4px',
      //   border: '2px solid #3CB371',
    },
  },
  // {
  //   type: 'approver',
  //   label: '审批',
  //   style: {
  //     width: '50px',
  //     height: '40px',
  //     borderRadius: '4px',
  //     border: '2px solid #3CB371',
  //   }
  // },
  {
    type: 'flow-node',
    label: '工序名称3',
    style: {
      //   width: '30px',
      //   height: '30px',
      //   border: '2px solid #6495ED',
      //   transform: 'rotate(45deg)',
    },
  },
  {
    type: 'flow-node',
    label: '工序名称4',
    style: {
      //   width: '30px',
      //   height: '30px',
      //   borderRadius: '15px',
      //   border: '2px solid red',
    },
  },
  {
    type: 'flow-node',
    label: '工序名称5',
    style: {
      //   width: '30px',
      //   height: '30px',
      //   borderRadius: '15px',
      //   border: '2px solid red',
    },
  },
  {
    type: 'flow-node',
    label: '工序名称6',
    style: {
      //   width: '30px',
      //   height: '30px',
      //   borderRadius: '15px',
      //   border: '2px solid red',
    },
  },
  {
    type: 'flow-node',
    label: '工序名称7',
    style: {
      //   width: '30px',
      //   height: '30px',
      //   borderRadius: '15px',
      //   border: '2px solid red',
    },
  },
  {
    type: 'flow-node',
    label: '工序名称8',
    style: {
      //   width: '30px',
      //   height: '30px',
      //   borderRadius: '15px',
      //   border: '2px solid red',
    },
  },
];

export const approveUser = [
  {
    label: '直接上级',
    value: 'leader',
  },
  {
    label: 'T3领导',
    value: 't3Leader',
  },
  {
    label: 'T2领导',
    value: 't2Leader',
  },
  {
    label: 'T1领导',
    value: 't1Leader',
  },
];

// 主题
export const themeApprove = {
  rect: {
    // 矩形样式
    radius: 8,
    stroke: '#3CB371',
  },
  circle: {
    r: 25,
    stroke: '#FF6347',
  },
  polygon: {
    stroke: '#6495ED',
  },
  polyline: {
    strokeWidth: 1,
  },
  edgeText: {
    background: {
      fill: 'white',
    },
  },
};

export const data = {
  nodes: [
    {
      id: '28df2fbe-f32b-4a9b-b544-7e70d7187b33',
      type: 'start',
      x: 210,
      y: 210,
      text: { x: 210, y: 210, value: '申请' },
      properties: {},
    },
    {
      id: '64179bd7-c60e-433c-8df7-97c8e98f855d',
      type: 'approver',
      x: 350,
      y: 210,
      text: { x: 350, y: 210, value: '审批' },
      properties: {
        labelColor: '#000000',
        approveTypeLabel: '直接上级',
        approveType: 'leader',
      },
    },
    {
      id: 'fcb96f10-720e-40e5-8ed0-ebdd0a46f234',
      type: 'jugement',
      x: 510,
      y: 210,
      text: { x: 510, y: 210, value: '判断报销是否\n大于1000元' },
      properties: { api: '' },
    },
    {
      id: '9f119df3-c449-4e5d-a67a-cb351b9cbdb5',
      type: 'approver',
      x: 670,
      y: 210,
      text: { x: 670, y: 210, value: '审批' },
      properties: {
        labelColor: '#000000',
        approveTypeLabel: 'T2领导',
        approveType: 't2Leader',
      },
    },
    {
      id: 'ef34f09c-38ea-4ad4-acd2-cc2f464a2be6',
      type: 'end',
      x: 850,
      y: 210,
      text: { x: 850, y: 210, value: '结束' },
      properties: {},
    },
  ],
  edges: [
    {
      id: '0d87b1eb-2389-445a-9f34-6227940b2072',
      type: 'polyline',
      sourceNodeId: '28df2fbe-f32b-4a9b-b544-7e70d7187b33',
      targetNodeId: '64179bd7-c60e-433c-8df7-97c8e98f855d',
      startPoint: { x: 235, y: 210 },
      endPoint: { x: 300, y: 210 },
      text: { x: 51.25, y: 0, value: '' },
      properties: {},
      pointsList: [
        { x: 235, y: 210 },
        { x: 300, y: 210 },
      ],
    },
    {
      id: 'd99e7451-b379-411e-b0da-df11be8be20a',
      type: 'polyline',
      sourceNodeId: '64179bd7-c60e-433c-8df7-97c8e98f855d',
      targetNodeId: 'fcb96f10-720e-40e5-8ed0-ebdd0a46f234',
      startPoint: { x: 400, y: 210 },
      endPoint: { x: 475, y: 210 },
      text: { x: 437.5, y: 210, value: '通过' },
      properties: {},
      pointsList: [
        { x: 400, y: 210 },
        { x: 475, y: 210 },
      ],
    },
    {
      id: '4c615802-15d8-442c-be22-b65430286123',
      type: 'polyline',
      sourceNodeId: 'fcb96f10-720e-40e5-8ed0-ebdd0a46f234',
      targetNodeId: '9f119df3-c449-4e5d-a67a-cb351b9cbdb5',
      startPoint: { x: 545, y: 210 },
      endPoint: { x: 620, y: 210 },
      text: { x: 582.5, y: 210, value: '是' },
      properties: {},
      pointsList: [
        { x: 545, y: 210 },
        { x: 620, y: 210 },
      ],
    },
    {
      id: '934ae03a-6ee0-4568-a2b4-8bcede565e0b',
      type: 'polyline',
      sourceNodeId: '9f119df3-c449-4e5d-a67a-cb351b9cbdb5',
      targetNodeId: 'ef34f09c-38ea-4ad4-acd2-cc2f464a2be6',
      startPoint: { x: 720, y: 210 },
      endPoint: { x: 825, y: 210 },
      text: { x: -10, y: 0, value: '' },
      properties: {},
      pointsList: [
        { x: 720, y: 210 },
        { x: 825, y: 210 },
      ],
    },
    {
      id: 'bd5e1dd0-1978-46f7-851b-d31c03aebee9',
      type: 'polyline',
      sourceNodeId: '64179bd7-c60e-433c-8df7-97c8e98f855d',
      targetNodeId: 'ef34f09c-38ea-4ad4-acd2-cc2f464a2be6',
      startPoint: { x: 350, y: 170 },
      endPoint: { x: 850, y: 185 },
      text: { x: 600, y: 140, value: '驳回' },
      properties: {},
      pointsList: [
        { x: 350, y: 170 },
        { x: 350, y: 140 },
        { x: 850, y: 140 },
        { x: 850, y: 185 },
      ],
    },
    {
      id: '453139c3-faa1-4e3a-a413-38f251243baa',
      type: 'polyline',
      sourceNodeId: 'fcb96f10-720e-40e5-8ed0-ebdd0a46f234',
      targetNodeId: 'ef34f09c-38ea-4ad4-acd2-cc2f464a2be6',
      startPoint: { x: 510, y: 245 },
      endPoint: { x: 850, y: 235 },
      text: { x: 680, y: 275, value: '否' },
      properties: {},
      pointsList: [
        { x: 510, y: 245 },
        { x: 510, y: 275 },
        { x: 850, y: 275 },
        { x: 850, y: 235 },
      ],
    },
  ],
};

// 条件选项
export const CONDITION_OPTIONS = [
  { id: 1, fullName: t('status.yes') },
  { id: 0, fullName: t('status.no') },
];
