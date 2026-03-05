import { optionsListApi } from '/@/api/extend/table';
import { FormProps, FormSchema, BasicColumn } from '/@/components/Table';
import { VxeFormItemProps, VxeGridPropTypes } from '/@/components/VxeTable';
import { ref } from 'vue';
import { Input } from 'ant-design-vue';
// import { getMaterialSearchByShortCode } from '/@/api/engineering/pcc';
import { useBaseStore } from '/@/store/modules/base';
import XEUtils from 'xe-utils';

const baseStore = useBaseStore();

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      fixed: 'left',
      width: 200,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 150,
      filters: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
      ],
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '编号',
      dataIndex: 'no',
      width: 150,
      sorter: true,
      defaultHidden: true,
    },
    {
      title: '开始时间',
      width: 150,
      sorter: true,
      dataIndex: 'beginTime',
    },
    {
      title: '结束时间',
      width: 150,
      sorter: true,
      dataIndex: 'endTime',
    },
  ];
}

export function getBasicShortColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      width: 150,
      dataIndex: 'id',
      sorter: true,
      sortOrder: 'ascend',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '地址',
      dataIndex: 'address',
    },
    {
      title: '编号',
      dataIndex: 'no',
      width: 80,
    },
  ];
}

export function getMultipleHeaderColumns(): BasicColumn[] {
  const testRef = ref('姓名:');
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 200,
    },
    {
      title: '姓名',
      customHeaderRender() {
        return <Input placeholder='输入值 更新 自定义title' size='small' v-model:value={testRef.value} />;
      },
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '地址',
      dataIndex: 'address',
      sorter: true,
      children: [
        {
          title: '编号',
          customHeaderRender(column) {
            // 【自定义渲染的】
            return (
              <div>
                _ <span style='background: #f00; color: #fff;'>{testRef.value}</span> _{column.customTitle}
              </div>
            );
          },
          dataIndex: 'no',
          width: 120,
          filters: [
            { text: 'Male', value: 'male', children: [] },
            { text: 'Female', value: 'female', children: [] },
          ],
        },

        {
          title: '开始时间',
          dataIndex: 'beginTime',
          width: 120,
        },
        {
          title: '结束时间',
          dataIndex: 'endTime',
          width: 120,
        },
      ],
    },
  ];
}

export function getCustomHeaderColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      helpMessage: 'headerHelpMessage方式1',
      width: 200,
    },
    {
      // title: '姓名',
      dataIndex: 'name',
      width: 120,
    },
    {
      // title: '地址',
      dataIndex: 'address',
      width: 120,
      sorter: true,
    },

    {
      title: '编号',
      dataIndex: 'no',
      width: 120,
      filters: [
        { text: 'Male', value: 'male', children: [] },
        { text: 'Female', value: 'female', children: [] },
      ],
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      width: 120,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 120,
    },
  ];
}

const cellContent = (_, index) => ({
  colSpan: index === 9 ? 0 : 1,
});

export function getMergeHeaderColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 300,
      customCell: (_, index) => ({
        colSpan: index === 9 ? 6 : 1,
      }),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 300,
      customCell: cellContent,
    },
    {
      title: '地址',
      dataIndex: 'address',
      colSpan: 2,
      width: 120,
      sorter: true,
      customCell: (_, index) => ({
        rowSpan: index === 2 ? 2 : 1,
        colSpan: index === 3 || index === 9 ? 0 : 1,
      }),
    },
    {
      title: '编号',
      dataIndex: 'no',
      colSpan: 0,
      filters: [
        { text: 'Male', value: 'male', children: [] },
        { text: 'Female', value: 'female', children: [] },
      ],
      customCell: cellContent,
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      width: 200,
      customCell: cellContent,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 200,
      customCell: cellContent,
    },
  ];
}
export const getAdvanceSchema = (itemNumber = 6): FormSchema[] => {
  const arr: FormSchema[] = [];
  for (let index = 0; index < itemNumber; index++) {
    arr.push({
      field: `field${index}`,
      label: `字段${index}`,
      component: 'Input',
      colProps: {
        xl: 12,
        xxl: 8,
      },
    });
  }
  return arr;
};
export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      ...getAdvanceSchema(5),
      {
        field: `field11`,
        label: `Slot示例`,
        slot: 'custom',
        colProps: {
          xl: 12,
          xxl: 8,
        },
      },
    ],
  } as any;
}
export function getBasicData() {
  return (() => {
    const arr: any = [];
    for (let index = 0; index < 40; index++) {
      arr.push({
        id: `${index}`,
        name: 'John Brown',
        age: `1${index}`,
        no: `${index + 10}`,
        address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
        beginTime: new Date().toLocaleString(),
        endTime: new Date().toLocaleString(),
      });
    }
    return arr;
  })();
}

export function getTreeTableData() {
  return (() => {
    const arr: any = [];
    for (let index = 0; index < 40; index++) {
      arr.push({
        id: `${index}`,
        name: 'John Brown',
        age: `1${index}`,
        no: `${index + 10}`,
        address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
        beginTime: new Date().toLocaleString(),
        endTime: new Date().toLocaleString(),
        children: [
          {
            id: `l2-${index}-1`,
            name: 'John Brown',
            age: `1`,
            no: `${index + 10}`,
            address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
            beginTime: new Date().toLocaleString(),
            endTime: new Date().toLocaleString(),
            children: [
              {
                id: `l3-${index}-1-1`,
                name: 'John Brown',
                age: `11`,
                no: `11`,
                address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
                beginTime: new Date().toLocaleString(),
                endTime: new Date().toLocaleString(),
              },
              {
                id: `l3-${index}-1-2`,
                name: 'John Brown',
                age: `12`,
                no: `12`,
                address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
                beginTime: new Date().toLocaleString(),
                endTime: new Date().toLocaleString(),
              },
            ],
          },
          {
            id: `l2-${index}-2`,
            name: 'John Brown',
            age: `2`,
            no: `${index + 10}`,
            address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
            beginTime: new Date().toLocaleString(),
            endTime: new Date().toLocaleString(),
            children: [
              {
                id: `l3-${index}-2-1`,
                name: 'John Brown',
                age: `21`,
                no: `21`,
                address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
                beginTime: new Date().toLocaleString(),
                endTime: new Date().toLocaleString(),
              },
              {
                id: `l3-${index}-2-2`,
                name: 'John Brown',
                age: `22`,
                no: `22`,
                address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
                beginTime: new Date().toLocaleString(),
                endTime: new Date().toLocaleString(),
              },
            ],
          },
        ],
      });
    }
    return arr;
  })();
}

export const vxeTableColumns: VxeGridPropTypes.Columns = [
  {
    title: '序号',
    type: 'seq',
    fixed: 'left',
    width: '50',
    align: 'center',
  },
  {
    title: '固定列',
    field: 'name',
    showOverflow: 'tooltip',
    fixed: 'left',
  },
  {
    title: '自适应列',
    field: 'address',
  },
  {
    title: 'Role(筛选)',
    field: 'role',
    filters: [
      { label: 'Develop', value: 'Develop' },
      { label: 'Test', value: 'Test' },
      { label: 'PM', value: 'PM' },
      { label: 'Designer', value: 'Designer' },
    ],
  },
  {
    title: '自定义列(自定义导出)',
    field: 'no',
    showOverflow: 'tooltip',
    align: 'center',
    slots: {
      default: ({ row, rowIndex }) => {
        console.log(row, rowIndex, 'row');
        const text = `自定义${row.no}`;
        return [<div class='text-red-500'>{text}</div>];
      },
    },
    exportMethod: ({ row }) => {
      return `自定义${row.no}导出`;
    },
  },
  {
    title: '输入框',
    field: 'dddd',
    editRender: {
      name: 'AInput',
      placeholder: '请点击输入',
    },
  },
  {
    title: '选择用户',
    field: 'aaa',
    align: 'center',
    editRender: {
      name: 'ACustomUserSelect',
      placeholder: '请选择',
      props: {
        allowClear: true,
        showSearch: true,
      },
    },
  },
  {
    title: '自定义编辑',
    field: 'applyShippingSpaceId',
    align: 'center',
    editRender: {
      name: 'AApiSelect',
      placeholder: '请选择',
      // options: [
      //   { label: '男', value: '1' },
      //   { label: '女', value: '0' }
      // ],
      immediate: true,
      autoSelect: true,
      enabled: true,
      props: {
        api: () => {
          return baseStore.getDictionaryData('DrawingsReview.ReviewResult');
        },
        // emitOptions: true,
        showSearch: true,
        apiSearch: {
          show: true,
          searchName: 'keyword',
        },
        // fieldNames: {
        //   value: 'enCode',
        //   label: 'fullName',
        // },
        resultField: 'data',
        labelField: 'fullName',
        valueField: 'id',
        filterOption: false,
        notFoundContent: null,
        immediate: true,
        afterFetch: options => {
          console.log('afterFetch', options);
        },
      },
    },
  },
  {
    title: '开始时间',
    field: 'beginTime',
    showOverflow: 'tooltip',
    align: 'center',
  },
  {
    title: '结束时间',
    field: 'endTime',
    showOverflow: 'tooltip',
    align: 'center',
  },
  {
    title: '操作',
    align: 'center',
    slots: { default: 'action' },
    fixed: 'right',
  },
];
export const vxeTableFormSchema: VxeFormItemProps[] = [
  {
    field: 'field0',
    title: 'field0',
    itemRender: {
      name: 'AInput',
    },
    span: 6,
  },
  {
    field: 'field1',
    title: 'field1',
    itemRender: {
      name: 'AApiSelect',
      props: {
        api: baseStore.getDictionaryData('DrawingsReview.ReviewResult'),
        resultField: 'list',
        labelField: 'name',
        valueField: 'id',
      },
    },
    span: 6,
  },
  {
    span: 12,
    align: 'right',
    className: '!pr-0',
    itemRender: {
      name: 'AButtonGroup',
      children: [
        {
          props: { type: 'primary', content: '查询', htmlType: 'submit' },
          attrs: { class: 'mr-2' },
        },
        { props: { type: 'default', htmlType: 'reset', content: '重置' } },
      ],
    },
  },
];

export const tableList = [
  {
    id: '0',
    beginTime: '1986-05-23 22:28:30',
    endTime: '1973-09-21 20:31:19',
    address: '雅安市',
    name: '萧超',
    name1: '崔丽',
    name2: '易桂英',
    name3: '乔勇',
    name4: '丁强',
    name5: '贺勇',
    name6: '贾桂英',
    name7: '吕芳',
    name8: '文娟',
    radio1: '选项1',
    radio2: '选项1',
    radio3: '选项1',
    avatar: 'http://dummyimage.com/400x400/f279af/79d3f2&text=Susan',
    imgArr: [
      'http://dummyimage.com/800x600/f2ee79/ca79f2&text=Ptzui Vcmybl Iqckydld Scyxpdy Ahd Zdivuyqd',
      'http://dummyimage.com/800x600/79f2a7/f28379&text=Ikhryahwwc Kfndf Wsqxw Hmq Kgqc Pwebymbb Gvyugrz',
    ],
    imgs: [
      'http://dummyimage.com/800x600/7991f2/b4f279&text=Ufneqb Ahpdmjm Fxulxylvx',
      'http://dummyimage.com/800x600/f279d8/79f2e8&text=Rqjsix Skpk Kykxp Reqspk',
      'http://dummyimage.com/800x600/f2c579/a279f2&text=Segmkfmu Oriigqp Blrkpip Mksblmmw Dbrws',
      'http://dummyimage.com/800x600/79f27e/f27996&text=Zceurtv Kxnmc Iuibfhxcv Crjqsl Bgufhjifjm Eedlthkom',
    ],
    date: '1977-01-31',
    time: '21:35',
    no: 6643829,
    status: 'normal',
    applyShippingSpaceId: '123',
    role: 'Develop',
  },
  // {
  //   id: '1',
  //   beginTime: '1982-12-03 11:50:27',
  //   endTime: '2019-06-24 18:45:17',
  //   address: '肇庆市',
  //   name: '秦超',
  //   name1: '郭秀兰',
  //   name2: '杜娜',
  //   name3: '周平',
  //   name4: '卢芳',
  //   name5: '魏秀英',
  //   name6: '苏强',
  //   name7: '王勇',
  //   name8: '龙勇',
  //   radio1: '选项2',
  //   radio2: '选项2',
  //   radio3: '选项2',
  //   applyShippingSpaceId: '3',
  //   avatar: 'http://dummyimage.com/400x400/79baf2/ddf279&text=Jennifer',
  //   imgArr: [
  //     'http://dummyimage.com/800x600/e379f2/79f2c0&text=Jmekjpwtbp Wwcmqfy Ijwwggz Swnkqeg Wovj Yefgjgnry',
  //     'http://dummyimage.com/800x600/f29d79/7979f2&text=Mjflx Pjtp Mnuaunq Qhuyfyjo Hfgo',
  //     'http://dummyimage.com/800x600/9bf279/f279bf&text=Pnskmgs Ibtjnwnjl Pesmijl Lwos',
  //     'http://dummyimage.com/800x600/79e2f2/f2de79&text=Xngk Quvnbjou Kkegvi Tizvylyx Ndxrdo',
  //   ],
  //   imgs: [
  //     'http://dummyimage.com/800x600/bb79f2/79f297&text=Ghip Fym Gbue Wapiwqep',
  //     'http://dummyimage.com/800x600/f2797d/79a1f2&text=Sqtgvglb Vuseqvooq Bsgoojyc Vpfq Zxw Cxkx',
  //     'http://dummyimage.com/800x600/c4f279/f279e7&text=Kegxrcqg Lpdfwyhn Irjqajoxyk Pfqhbhoke',
  //     'http://dummyimage.com/800x600/79f2d9/f2b679&text=Gnxv Sfqe Hnwv Oghkbv',
  //   ],
  //   date: '2019-03-23',
  //   time: '23:04',
  //   no: 828765,
  //   status: 'disable',
  // },
  // {
  //   id: '2',
  //   beginTime: '1989-12-19 19:51:28',
  //   endTime: '1975-03-06 22:11:58',
  //   address: '固原市',
  //   name: '锺超',
  //   name1: '马秀英',
  //   name2: '邱杰',
  //   name3: '余丽',
  //   name4: '秦娜',
  //   name5: '谢军',
  //   name6: '苏霞',
  //   name7: '段杰',
  //   name8: '谭娟',
  //   radio1: '选项3',
  //   radio2: '选项3',
  //   radio3: '选项3',
  //   avatar: 'http://dummyimage.com/400x400/9279f2/82f279&text=Eric',
  //   imgArr: [
  //     'http://dummyimage.com/800x600/f279a6/79c9f2&text=Klj Tojbmu Jyiimm Ynktv',
  //     'http://dummyimage.com/800x600/ecf279/d479f2&text=Ntlibgqe Oonogvlng Krwyshc Oxjodgc Rre Ayvnt',
  //     'http://dummyimage.com/800x600/79f2b0/f28d79&text=Tfrccbjr Gwqkmknv Igh Rcrqrmtyhr',
  //     'http://dummyimage.com/800x600/7988f2/abf279&text=Qlmionlf Peqnfiuh Bgaftxhefw',
  //   ],
  //   imgs: [
  //     'http://dummyimage.com/800x600/f279ce/79f2f2&text=Bxleyvtl Kewqoy Vlh Jtquj Xwvvqq Vqccuho',
  //     'http://dummyimage.com/800x600/f2cf79/ab79f2&text=Jtyz Tknmyfuio Tvcrwiq Lkw Uhmxxzx Ukkef',
  //   ],
  //   date: '1976-06-12',
  //   time: '07:26',
  //   no: 280266,
  //   status: 'enable',
  // },
  // {
  //   id: '3',
  //   beginTime: '1974-03-02 18:25:17',
  //   endTime: '1977-12-01 13:05:34',
  //   address: '三亚市',
  //   name: '周秀兰',
  //   name1: '秦军',
  //   name2: '邓娟',
  //   name3: '熊军',
  //   name4: '锺伟',
  //   name5: '曾娜',
  //   name6: '郭秀英',
  //   name7: '谭敏',
  //   name8: '乔秀兰',
  //   radio1: '选项4',
  //   radio2: '选项4',
  //   radio3: '选项4',
  //   avatar: 'http://dummyimage.com/400x400/79f288/f2798d&text=Sandra',
  //   imgArr: [
  //     'http://dummyimage.com/800x600/79b0f2/d3f279&text=Ymragl Mkzmh Dihgp Uzwdnrucvu Ozcjfhcv',
  //     'http://dummyimage.com/800x600/ed79f2/79f2c9&text=Ifbygvk Kpuvwnt Ubaaqtvd Ycbubx',
  //   ],
  //   imgs: [
  //     'http://dummyimage.com/800x600/f2a679/8379f2&text=Wjgcdh Xbk Kctknrk Oarcjq Pwmnl',
  //     'http://dummyimage.com/800x600/92f279/f279b5&text=Nddf Kgjkwgo Dpebhyzrri Tginsy Wjfgrt',
  //     'http://dummyimage.com/800x600/79d9f2/f2e879&text=Nvvsvoixrv Cscgsh Bjfl Tlwdkbggis Frvmqdpc',
  //     'http://dummyimage.com/800x600/c479f2/79f2a1&text=Sbgel Qiehdvvc Boelfvqg',
  //   ],
  //   date: '1989-12-06',
  //   time: '22:34',
  //   no: 2946006,
  //   status: 'enable',
  // },
  // {
  //   id: '4',
  //   beginTime: '1985-12-07 00:37:16',
  //   endTime: '1991-05-11 00:34:10',
  //   address: '香港岛',
  //   name: '卢军',
  //   name1: '吴军',
  //   name2: '徐静',
  //   name3: '范涛',
  //   name4: '段刚',
  //   name5: '秦霞',
  //   name6: '方敏',
  //   name7: '宋秀英',
  //   name8: '邓超',
  //   radio1: '选项5',
  //   radio2: '选项5',
  //   radio3: '选项5',
  //   avatar: 'http://dummyimage.com/400x400/f27e79/7997f2&text=Kevin',
  //   imgArr: [
  //     'http://dummyimage.com/800x600/baf279/f279de&text=Hzcxt Gelmbcyqel Vdqnitcne',
  //     'http://dummyimage.com/800x600/79f2e2/f2bf79&text=Pojhu Dkwg Pijdswwpup Lhtsmnudj Bsy Nteb',
  //     'http://dummyimage.com/800x600/9c79f2/79f279&text=Wwlcxx Hyomtq Yrfgo',
  //     'http://dummyimage.com/800x600/f2799c/79c0f2&text=Umynwnp Lozutw Sgyuuml Qqedqipzm Hjrdjbdd Ithtkmnzc',
  //   ],
  //   imgs: [
  //     'http://dummyimage.com/800x600/e3f279/dd79f2&text=Evnmub Yxyotryx Xzbsbwuf Qedto',
  //     'http://dummyimage.com/800x600/79f2ba/f29779&text=Ungjjzbhp Pjli Gaxcq Mdimk Omd Bqkqql',
  //     'http://dummyimage.com/800x600/797ef2/a1f279&text=Bfja Fthc Nvkxzuej Ryvte Hkdv Bobexec',
  //     'http://dummyimage.com/800x600/f279c5/79e8f2&text=Plgs Gwavgds Tykpnoq Focte Dcvexhjhl Vlasumw Hxterge',
  //   ],
  //   date: '1994-09-30',
  //   time: '12:35',
  //   no: 4803447,
  //   status: 'disable',
  // },
  // {
  //   id: '5',
  //   beginTime: '1982-04-21 09:13:16',
  //   endTime: '1987-10-11 03:49:49',
  //   address: '洛阳市',
  //   name: '锺涛',
  //   name1: '邓超',
  //   name2: '姜娟',
  //   name3: '乔磊',
  //   name4: '林洋',
  //   name5: '黄洋',
  //   name6: '杨刚',
  //   name7: '汤艳',
  //   name8: '邵勇',
  //   radio1: '选项6',
  //   radio2: '选项6',
  //   radio3: '选项6',
  //   avatar: 'http://dummyimage.com/400x400/f2d879/b579f2&text=Mark',
  //   imgArr: [
  //     'http://dummyimage.com/800x600/79f291/f27983&text=Itxqumgf Bmownff Ayvg Wleeevtrkf Loprmjbq Qwwx Fmtfjgsp',
  //     'http://dummyimage.com/800x600/79a6f2/caf279&text=Bxxkhfebqg Vrkippdvs Icncqx Iowwf Kicroiaj',
  //     'http://dummyimage.com/800x600/f279ed/79f2d3&text=Tghe Yonswqg Kptxg Hjbowkhhmn',
  //   ],
  //   imgs: [
  //     'http://dummyimage.com/800x600/f2b079/8c79f2&text=Vfcssfndtv Rlpfenaa Mqpqhapsp Fxvvmm',
  //     'http://dummyimage.com/800x600/88f279/f279ac&text=Tusnohlppr Jxrhohmzrp Qqgi Ikqnvlkbwq Pplge Ftjqcgmmy Uwkuxrkuq',
  //   ],
  //   date: '2010-08-26',
  //   time: '17:15',
  //   no: 6682948,
  //   status: 'disable',
  // },
  // {
  //   id: '6',
  //   beginTime: '1996-10-31 04:18:36',
  //   endTime: '1989-07-27 05:24:25',
  //   address: '连云港市',
  //   name: '蔡平',
  //   name1: '黄娟',
  //   name2: '尹艳',
  //   name3: '卢涛',
  //   name4: '白桂英',
  //   name5: '谭平',
  //   name6: '薛娟',
  //   name7: '乔娜',
  //   name8: '侯霞',
  //   radio1: '选项7',
  //   radio2: '选项7',
  //   radio3: '选项7',
  //   avatar: 'http://dummyimage.com/400x400/79cff2/f2f179&text=Kevin',
  //   imgArr: [
  //     'http://dummyimage.com/800x600/ce79f2/79f2aa&text=Rvfmxknchm Joum Hivnoyui Xwysesefvb Jtciey',
  //     'http://dummyimage.com/800x600/f28779/798df2&text=Fhph Xtflgmxnu Jqkbyvjhvf Gcoxdvqs',
  //     'http://dummyimage.com/800x600/b1f279/f279d4&text=Dqwpkhknmi Hdngqxiqy Lnj Uognpdnpl',
  //   ],
  //   imgs: [
  //     'http://dummyimage.com/800x600/79f2ec/f2c979&text=Tfolj Jsebr Ohelxhk Thjm Shrbqboirj',
  //     'http://dummyimage.com/800x600/a579f2/79f282&text=Vrng Meba Ovewlip Nchdxr Pjkikv',
  //     'http://dummyimage.com/800x600/f27993/79b6f2&text=Putxpbhxx Pswrwrwhe Eaoiqlmsu Cndimfeoj Wiwrbv Wxyjs Tculqhhr',
  //   ],
  //   date: '1986-01-18',
  //   time: '12:53',
  //   no: 3289557,
  //   status: 'normal',
  // },
  // {
  //   id: '7',
  //   beginTime: '1970-09-23 10:39:15',
  //   endTime: '2023-09-22 00:48:44',
  //   address: '重庆市',
  //   name: '黎秀兰',
  //   name1: '龚明',
  //   name2: '张刚',
  //   name3: '董磊',
  //   name4: '黎涛',
  //   name5: '戴杰',
  //   name6: '郑强',
  //   name7: '黄强',
  //   name8: '马艳',
  //   radio1: '选项8',
  //   radio2: '选项8',
  //   radio3: '选项8',
  //   avatar: 'http://dummyimage.com/400x400/d9f279/e779f2&text=Amy',
  //   imgArr: [
  //     'http://dummyimage.com/800x600/79f2c4/f2a079&text=Ndpqipzf Pwlmr Pvd',
  //     'http://dummyimage.com/800x600/7d79f2/98f279&text=Aescdnn Ixgksjj Bloet Mpsykwgbp',
  //     'http://dummyimage.com/800x600/f279bb/79def2&text=Vdwsqb Lyg Sivr',
  //   ],
  //   imgs: [
  //     'http://dummyimage.com/800x600/f2e279/be79f2&text=Wzvcog Kykio Syyn Ybcfj Lbbmfxjo Yjqh',
  //     'http://dummyimage.com/800x600/79f29b/f2797a&text=Xcahqt Mhffvzhzu Mypx Pbfzvobmyr Cfwmwnusf',
  //   ],
  //   date: '2024-02-19',
  //   time: '06:13',
  //   no: 6168313,
  //   status: 'disable',
  // },
  // {
  //   id: '8',
  //   beginTime: '2003-09-22 06:04:08',
  //   endTime: '2017-05-08 01:22:54',
  //   address: '长治市',
  //   name: '萧涛',
  //   name1: '冯明',
  //   name2: '何勇',
  //   name3: '梁勇',
  //   name4: '韩秀英',
  //   name5: '方秀英',
  //   name6: '彭丽',
  //   name7: '崔明',
  //   name8: '邵勇',
  //   radio1: '选项9',
  //   radio2: '选项9',
  //   radio3: '选项9',
  //   avatar: 'http://dummyimage.com/400x400/799df2/c0f279&text=Margaret',
  //   imgArr: [
  //     'http://dummyimage.com/800x600/f279e4/79f2dd&text=Gfxvgf Edsso Ycakhz Dnec Dbon Tlvhxrwjy Fqpzznx',
  //     'http://dummyimage.com/800x600/f2b979/9679f2&text=Jef Irdr Rvmqjef Lmjrfgte Hpmsy Augknb',
  //     'http://dummyimage.com/800x600/7ff279/f279a2&text=Xhbu Yevqmm Otcglnjle Aejqrwfzh Qthlqlrmj',
  //   ],
  //   imgs: [
  //     'http://dummyimage.com/800x600/79c5f2/e9f279&text=Hdwmbyeu Cvojcuirb Dwch Yingrhk Tnjgx Hugbbkzw',
  //     'http://dummyimage.com/800x600/d779f2/79f2b4&text=Ogkgvno Wjjcip Frgwfn Ylrqwwc',
  //   ],
  //   date: '1978-06-06',
  //   time: '21:34',
  //   no: 5064088,
  //   status: 'enable',
  // },
  // {
  //   id: '9',
  //   beginTime: '1987-03-20 14:48:01',
  //   endTime: '2017-04-30 05:07:28',
  //   address: '安阳市',
  //   name: '易芳',
  //   name1: '郭桂英',
  //   name2: '周秀兰',
  //   name3: '江勇',
  //   name4: '邓强',
  //   name5: '钱涛',
  //   name6: '姚磊',
  //   name7: '于涛',
  //   name8: '毛静',
  //   radio1: '选项10',
  //   radio2: '选项10',
  //   radio3: '选项10',
  //   avatar: 'http://dummyimage.com/400x400/f29179/7984f2&text=Margaret',
  //   imgArr: [
  //     'http://dummyimage.com/800x600/a7f279/f279cb&text=Ywslyyq Enicflhb Boexcw Qdwnf Upcbnoo',
  //     'http://dummyimage.com/800x600/79eef2/f2d279&text=Yanjw Jafvmtm Opnel Nbhtyw Iclqpf Ugvmwqon',
  //     'http://dummyimage.com/800x600/af79f2/79f28c&text=Crwl Qybaywua Kumvldm Xlvkumphv Pxeosvz Gxltxc Umszbykn',
  //     'http://dummyimage.com/800x600/f27989/79acf2&text=Dpuvjo Tgdyyv Leyrxlkd Nniesxzr',
  //   ],
  //   imgs: [
  //     'http://dummyimage.com/800x600/d0f279/f079f2&text=Ilpoe Dpflp Pqvtaqchtd Stiuiu',
  //     'http://dummyimage.com/800x600/79f2cd/f2aa79&text=Stdpfm Bxssc Vup',
  //     'http://dummyimage.com/800x600/8679f2/8ef279&text=Mukoudv Pnfzx Sfejxrkwt Dmuembg Blpe',
  //     'http://dummyimage.com/800x600/f279b2/79d5f2&text=Fudvywyk Fhe Nvldobp Zdody Aykhi Ywjgluar',
  //   ],
  //   date: '1983-12-24',
  //   time: '04:16',
  //   no: 3568074,
  //   status: 'normal',
  // },
  // {
  //   id: '10',
  //   beginTime: '1975-06-04 13:08:48',
  //   endTime: '1971-11-26 14:09:13',
  //   address: '澳门半岛',
  //   name: '姚勇',
  //   name1: '任强',
  //   name2: '方超',
  //   name3: '叶丽',
  //   name4: '杨平',
  //   name5: '崔刚',
  //   name6: '何刚',
  //   name7: '钱刚',
  //   name8: '赖芳',
  //   radio1: '选项11',
  //   radio2: '选项11',
  //   radio3: '选项11',
  //   avatar: 'http://dummyimage.com/400x400/f2eb79/c879f2&text=Jessica',
  //   imgArr: [
  //     'http://dummyimage.com/800x600/79f2a5/f28179&text=Cnochsti Mpgksyvhb Csljlt Jvbgsidu Rkyutkfd Qvexgk Qaih',
  //     'http://dummyimage.com/800x600/7993f2/b7f279&text=Skbdswseu Tnjhye Qozeahhdp Glqlkkp Ufdfbkln Cmgew',
  //   ],
  //   imgs: [
  //     'http://dummyimage.com/800x600/f279da/79f2e6&text=Eeorrhki Qgtiler Ymqqdkhux Slwqnnvd',
  //     'http://dummyimage.com/800x600/f2c379/9f79f2&text=Rdsey Bxxn Jrvkvn Tqlua Bvhr',
  //     'http://dummyimage.com/800x600/79f27c/f27999&text=Xlgmiy Wmqnga Ldupilenn Frnnhfe Strghrq Mdlimxp',
  //     'http://dummyimage.com/800x600/79bcf2/dff279&text=Ubp Jadhctwt Iey Ewanm Spdrbaqz Phapygc',
  //   ],
  //   date: '2006-11-27',
  //   time: '21:00',
  //   no: 4622413,
  //   status: 'normal',
  // },
  // {
  //   id: '11',
  //   beginTime: '2004-06-30 23:42:22',
  //   endTime: '2020-07-07 09:27:58',
  //   address: '松原市',
  //   name: '杜涛',
  //   name1: '武勇',
  //   name2: '田秀兰',
  //   name3: '黄磊',
  //   name4: '廖伟',
  //   name5: '唐明',
  //   name6: '许杰',
  //   name7: '许娜',
  //   name8: '江磊',
  //   radio1: '选项12',
  //   radio2: '选项12',
  //   radio3: '选项12',
  //   avatar: 'http://dummyimage.com/400x400/e179f2/79f2be&text=Kimberly',
  //   imgArr: [
  //     'http://dummyimage.com/800x600/f29a79/797af2&text=Hywdxkrm Yygcclu Urgo Gsyfk',
  //     'http://dummyimage.com/800x600/9ef279/f279c1&text=Iwcdfuq Hphedxw Alolxucyu Myp',
  //     'http://dummyimage.com/800x600/79e4f2/f2dc79&text=Xweviu Yeggumt Rabxyow Wwcnspdy',
  //     'http://dummyimage.com/800x600/b879f2/79f295&text=Ggfhe Bmsm Kaf Rqv',
  //   ],
  //   imgs: [
  //     'http://dummyimage.com/800x600/f2797f/79a3f2&text=Tthoyh Ippibi Fbnfpxuqe Vsmik Dhjtw Fmutc',
  //     'http://dummyimage.com/800x600/c6f279/f279ea&text=Kyyifncejf Kbnyrtfbl Rtubkif Hbrjcxyfe',
  //   ],
  //   date: '1990-06-14',
  //   time: '21:29',
  //   no: 9720711,
  //   status: 'enable',
  // },
  // {
  //   id: '12',
  //   beginTime: '1980-02-15 01:07:57',
  //   endTime: '1995-10-13 14:22:22',
  //   address: '安康市',
  //   name: '邱强',
  //   name1: '夏刚',
  //   name2: '邵娜',
  //   name3: '刘涛',
  //   name4: '方芳',
  //   name5: '于强',
  //   name6: '龙涛',
  //   name7: '董秀兰',
  //   name8: '黄秀兰',
  //   radio1: '选项13',
  //   radio2: '选项13',
  //   radio3: '选项13',
  //   avatar: 'http://dummyimage.com/400x400/79f2d7/f2b379&text=Barbara',
  //   imgArr: [
  //     'http://dummyimage.com/800x600/9079f2/85f279&text=Dnjdzgtcfn Iqfrqujc Mxiwrytdfu Fmxbkqmn',
  //     'http://dummyimage.com/800x600/f279a8/79cbf2&text=Qdmusbe Hetcftrud Kjizieruqa Hcbgu Miiflptrj Fqpfnpd',
  //     'http://dummyimage.com/800x600/eff279/d179f2&text=Keuuobxn Uumt Ekjbicfoc',
  //     'http://dummyimage.com/800x600/79f2ae/f28b79&text=Othwoc Dgmevouiht Gcxe Sfhhegtmfp',
  //   ],
  //   imgs: [
  //     'http://dummyimage.com/800x600/798af2/adf279&text=Jopb Rebtrwg Hateyesykw Bvoqnpr Ekbhnmcsfo',
  //     'http://dummyimage.com/800x600/f279d0/79f2f0&text=Jnqyoq Stzsigoi Cdpqox Gljk Entgbhj Mvopyn',
  //     'http://dummyimage.com/800x600/f2cc79/a979f2&text=Iioem Tajdciap Jqrnbgs Fzdftixy Gflsos',
  //   ],
  //   date: '1994-08-02',
  //   time: '02:29',
  //   no: 2769350,
  //   status: 'normal',
  // },
  // {
  //   id: '13',
  //   beginTime: '2012-11-21 12:24:27',
  //   endTime: '1985-05-11 04:46:57',
  //   address: '香港岛',
  //   name: '金涛',
  //   name1: '万秀兰',
  //   name2: '程桂英',
  //   name3: '史霞',
  //   name4: '汪平',
  //   name5: '潘芳',
  //   name6: '郑杰',
  //   name7: '丁丽',
  //   name8: '李秀英',
  //   radio1: '选项14',
  //   radio2: '选项14',
  //   radio3: '选项14',
  //   avatar: 'http://dummyimage.com/400x400/79f286/f2798f&text=Dorothy',
  //   imgArr: [
  //     'http://dummyimage.com/800x600/79b2f2/d6f279&text=Wpmvgsoiry Egmui Xfktyaryyb',
  //     'http://dummyimage.com/800x600/eb79f2/79f2c7&text=Qfjfpksut Kkkuolu Ytng Ynnrq',
  //     'http://dummyimage.com/800x600/f2a479/8079f2&text=Jfcu Nswmplckg Icqh Nlmhkkt',
  //     'http://dummyimage.com/800x600/94f279/f279b7&text=Rbtfmu Mmrqd Bwsob Jquvzyv Xgoqa Nuiqoqg Cfliebkp',
  //   ],
  //   imgs: [
  //     'http://dummyimage.com/800x600/79dbf2/f2e579&text=Jrcspykla Awjppbzqj Kdw Luumntpp Nbhy Dmhv',
  //     'http://dummyimage.com/800x600/c279f2/79f29f&text=Crnigfw Fjcphhy Nizanohxf Pufbiugyob Tpnvenjlf',
  //   ],
  //   date: '1985-05-11',
  //   time: '18:57',
  //   no: 7602533,
  //   status: 'normal',
  // },
  // {
  //   id: '14',
  //   beginTime: '2012-12-03 14:56:13',
  //   endTime: '1999-08-24 14:20:18',
  //   address: '三门峡市',
  //   name: '邱刚',
  //   name1: '汪桂英',
  //   name2: '萧敏',
  //   name3: '李洋',
  //   name4: '龚娜',
  //   name5: '龙明',
  //   name6: '赖刚',
  //   name7: '常秀兰',
  //   name8: '周军',
  //   radio1: '选项15',
  //   radio2: '选项15',
  //   radio3: '选项15',
  //   avatar: 'http://dummyimage.com/400x400/f27b79/7999f2&text=Dorothy',
  //   imgArr: [
  //     'http://dummyimage.com/800x600/bdf279/f279e0&text=Gnskm Wtdtybbttr Jopxfr Xxkrd Vkbju',
  //     'http://dummyimage.com/800x600/79f2e0/f2bd79&text=Xsgnyukr Gkwauwo Dxabngfdb Mtryzalj',
  //     'http://dummyimage.com/800x600/9a79f2/7bf279&text=Asft Rgcx Cmsxspy Lwbu Mygu',
  //   ],
  //   imgs: [
  //     'http://dummyimage.com/800x600/f2799e/79c2f2&text=Ihqty Lsstumumre Stsif Ajclyahad',
  //     'http://dummyimage.com/800x600/e5f279/db79f2&text=Rjdjy Laxs Yfmuklss Rdtv Yhmyacsag Dfrtq',
  //     'http://dummyimage.com/800x600/79f2b8/f29479&text=Cbmvkogwqb Dkanikj Kkfvca Muclaea',
  //     'http://dummyimage.com/800x600/7980f2/a4f279&text=Zcaobiz Vydel Woxcxbjsme Ewbxfujj',
  //   ],
  //   date: '1979-12-17',
  //   time: '05:47',
  //   no: 4368590,
  //   status: 'normal',
  // },
  // {
  //   id: '15',
  //   beginTime: '2006-12-02 22:06:33',
  //   endTime: '1970-07-15 22:16:43',
  //   address: '云林县',
  //   name: '程平',
  //   name1: '段超',
  //   name2: '方艳',
  //   name3: '韩静',
  //   name4: '胡刚',
  //   name5: '梁娟',
  //   name6: '卢霞',
  //   name7: '侯勇',
  //   name8: '薛明',
  //   radio1: '选项16',
  //   radio2: '选项16',
  //   radio3: '选项16',
  //   avatar: 'http://dummyimage.com/400x400/f279c7/79eaf2&text=Frank',
  //   imgArr: [
  //     'http://dummyimage.com/800x600/f2d679/b379f2&text=Dytd Utthdt Mowbqgwad Svldieyq Rktrbjje Jgzsc',
  //     'http://dummyimage.com/800x600/79f28f/f27985&text=Prj Hqdvyulp Ybpwbznib Vkfcvhvdgh',
  //   ],
  //   imgs: [
  //     'http://dummyimage.com/800x600/79a9f2/ccf279&text=Ytuecsj Vcjooce Mjdq Pighhprdj Gzo',
  //     'http://dummyimage.com/800x600/f279ef/79f2d1&text=Nqjjrkcc Pcqjp Bcxrtrhb Zeuxlvmps Vqycpj Vasvnt Uoqc',
  //     'http://dummyimage.com/800x600/f2ad79/8a79f2&text=Lmfdynuw Sbwhoxig Oqebrogxf Wfegnvzqoe Dojc Xlgjznkefl Uqsq',
  //     'http://dummyimage.com/800x600/8bf279/f279ae&text=Sslrnmo Slpvjyztj Sdwy Spthxx Hzock Mtzywhyw',
  //   ],
  //   date: '1983-09-01',
  //   time: '22:11',
  //   no: 6508268,
  //   status: 'enable',
  // },
  // {
  //   id: '16',
  //   beginTime: '1993-09-26 01:42:59',
  //   endTime: '2022-07-18 01:20:40',
  //   address: '上海市',
  //   name: '孟娜',
  //   name1: '孔娟',
  //   name2: '钱艳',
  //   name3: '冯娜',
  //   name4: '罗刚',
  //   name5: '唐磊',
  //   name6: '萧娟',
  //   name7: '康桂英',
  //   name8: '叶伟',
  //   radio1: '选项17',
  //   radio2: '选项17',
  //   radio3: '选项17',
  //   avatar: 'http://dummyimage.com/400x400/79d1f2/f2ef79&text=Anthony',
  //   imgArr: [
  //     'http://dummyimage.com/800x600/cc79f2/79f2a8&text=Irncymuog Lolfyb Xiletbq Lwauelpg Edblewiidn Hiovuz Goe',
  //     'http://dummyimage.com/800x600/f28579/7990f2&text=Hiux Espf Lgv Gdeq',
  //     'http://dummyimage.com/800x600/b3f279/f279d6&text=Fcxhh Sjxqx Vni Zimycill Mmwhix',
  //   ],
  //   imgs: [
  //     'http://dummyimage.com/800x600/79f2ea/f2c679&text=Xzmsrpdn Tknwsm Nsehqrsi',
  //     'http://dummyimage.com/800x600/a379f2/79f280&text=Sgvbjkkbs Ibdnuxfi Epnkir Dtrgxf Jkdhrntkb',
  //     'http://dummyimage.com/800x600/f27995/79b8f2&text=Otriu Whxvgimlk Cykqgrl Zbwspasvj Mld Tcgvgo',
  //   ],
  //   date: '1979-10-31',
  //   time: '07:53',
  //   no: 3121829,
  //   status: 'enable',
  // },
  // {
  //   id: '17',
  //   beginTime: '2007-06-16 06:28:28',
  //   endTime: '2008-07-10 01:43:11',
  //   address: '天津市',
  //   name: '朱静',
  //   name1: '陆军',
  //   name2: '姚娜',
  //   name3: '江秀兰',
  //   name4: '苏勇',
  //   name5: '常敏',
  //   name6: '李磊',
  //   name7: '廖娟',
  //   name8: '傅霞',
  //   radio1: '选项18',
  //   radio2: '选项18',
  //   radio3: '选项18',
  //   avatar: 'http://dummyimage.com/400x400/dcf279/e579f2&text=Maria',
  //   imgArr: [
  //     'http://dummyimage.com/800x600/79f2c1/f29e79&text=Mulycwwk Dqyccm Gylhj Jkfqw Kbzq',
  //     'http://dummyimage.com/800x600/7b79f2/9af279&text=Itlggjjety Csmatqq Lsatv Mpwv Sxucwcu Nwtx',
  //   ],
  //   imgs: [
  //     'http://dummyimage.com/800x600/f279bd/79e1f2&text=Wvuztlw Xypdtuwq Oqooxlt Wonyz Mlggd',
  //     'http://dummyimage.com/800x600/f2df79/bc79f2&text=Foqaoda Qfiydkwfs Kkqcn Pjdrdn Stoboik Befu Vcsdea',
  //     'http://dummyimage.com/800x600/79f299/f2797c&text=Jsyvfgryn Dwroccfpd Mtlqb Ykbul Srhsu Cbasqrd Rxiwtbv',
  //     'http://dummyimage.com/800x600/799ff2/c3f279&text=Jwkfm Axzqtwrtp Lcjrekdj Tkcthmbz Dtsyyuk',
  //   ],
  //   date: '1995-03-10',
  //   time: '09:33',
  //   no: 4744382,
  //   status: 'enable',
  // },
  // {
  //   id: '18',
  //   beginTime: '1993-04-13 06:18:32',
  //   endTime: '2018-03-22 15:46:34',
  //   address: '广州市',
  //   name: '胡芳',
  //   name1: '汤静',
  //   name2: '薛杰',
  //   name3: '廖平',
  //   name4: '雷芳',
  //   name5: '陈艳',
  //   name6: '汤杰',
  //   name7: '董强',
  //   name8: '阎平',
  //   radio1: '选项19',
  //   radio2: '选项19',
  //   radio3: '选项19',
  //   avatar: 'http://dummyimage.com/400x400/f279e6/79f2da&text=Brian',
  //   imgArr: [
  //     'http://dummyimage.com/800x600/f2b779/9479f2&text=Xci Scoxucl Mllthppgp Kcgfgkcp Rcz',
  //     'http://dummyimage.com/800x600/81f279/f279a4&text=Xjkqir Toezio Kfqtxihpu Bwmh Cbwmx',
  //     'http://dummyimage.com/800x600/79c8f2/ebf279&text=Hesuxbgeau Kjcrbp Ckejxaqpfi Bubrbq Qhli Gphu',
  //   ],
  //   imgs: [
  //     'http://dummyimage.com/800x600/d579f2/79f2b2&text=Suwvqruu Feprjfaouz Ydqbl Tgjh Njbiirjm Wntst',
  //     'http://dummyimage.com/800x600/f28e79/7986f2&text=Ijzodp Syknnbowf Svydfvtim Hqktk Txjvlkg Qrnwyuoht Kqylswt',
  //     'http://dummyimage.com/800x600/a9f279/f279cd&text=Ulplfabhj Isrge Rvdaptmay',
  //   ],
  //   date: '2013-01-13',
  //   time: '01:36',
  //   no: 655342,
  //   status: 'normal',
  // },
  // {
  //   id: '19',
  //   beginTime: '2005-09-24 13:18:00',
  //   endTime: '1983-06-04 07:48:55',
  //   address: '赣州市',
  //   name: '钱娜',
  //   name1: '姚超',
  //   name2: '吕强',
  //   name3: '朱强',
  //   name4: '乔艳',
  //   name5: '邵刚',
  //   name6: '蒋敏',
  //   name7: '白伟',
  //   name8: '卢芳',
  //   radio1: '选项20',
  //   radio2: '选项20',
  //   radio3: '选项20',
  //   avatar: 'http://dummyimage.com/400x400/79f0f2/f2d079&text=Gary',
  //   imgArr: [
  //     'http://dummyimage.com/800x600/ad79f2/79f289&text=Lnjyx Ntti Bzldj Hiveulpsid Xmnddsrra',
  //     'http://dummyimage.com/800x600/f2798b/79aff2&text=Wsrzeu Xpdew Uocwqs Pfgyiq Wscf Seyhrngvj',
  //     'http://dummyimage.com/800x600/d2f279/ee79f2&text=Xmcscvwjoy Iouitqqc Xksysyx Vrxfkhqr Elbskph',
  //   ],
  //   imgs: [
  //     'http://dummyimage.com/800x600/79f2cb/f2a779&text=Ksirui Irxqtukt Bmhmjcecob',
  //     'http://dummyimage.com/800x600/8479f2/90f279&text=Sloagm Tetqmlfah Kefxqygq Xffgahjd Dnrfusb',
  //     'http://dummyimage.com/800x600/f279b4/79d7f2&text=Qfhe Mlfqx Aixezxq Afxfg Uqdtugfeyi Rghyonfof',
  //   ],
  //   date: '2006-07-15',
  //   time: '12:26',
  //   no: 4956796,
  //   status: 'enable',
  // },
];
