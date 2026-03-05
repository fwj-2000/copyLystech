export interface DraggableComponentMeta {
  tid: string;
  label: string;
  icon: string;
  printConfig?: any; // hiPrint 的配置，用于注册
  condition?: () => boolean;
}
//
export const provider1Components: DraggableComponentMeta[] = [
  {
    tid: 'providerModule1.header',
    label: '单据表头',
    icon: 'glyphicon-header',
    printConfig: {
      title: '单据表头',
      data: '单据表头',
      type: 'text',
      options: {
        testData: '单据表头',
        height: 17,
        fontSize: 16.5,
        fontWeight: '700',
        textAlign: 'center',
        hideTitle: true,
      },
    },
  },
  {
    tid: 'providerModule1.qrcode',
    label: '二维码',
    icon: 'glyphicon-qrcode',
    printConfig: {
      title: '二维码',
      data: '二维码数据',
      type: 'text',
      options: {
        field: 'qrcode',
        testData: '二维码数据',
        height: 32,
        fontSize: 12,
        textType: 'qrcode',
      },
    },
  },
];
