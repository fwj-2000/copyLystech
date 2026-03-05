<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="divForm">
        <BasicForm @register="registerForm" @submit="handleSubmit" @reset="handleReset"></BasicForm>
      </div>
      <div class="lydc-content-wrapper-content">
        <ScrollContainer :key="sum">
          <grid-layout
            :layout.sync="layout"
            :col-num="3"
            :row-height="38"
            :is-draggable="false"
            :is-resizable="false"
            :is-mirrored="false"
            :vertical-compact="true"
            :margin="[10, 10, 10, 10]"
            :use-css-transforms="true">
            <grid-item v-for="item in layout" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i" :key="item.i" class="gridItem">
              <Parser :item="item" :data="state.data" :list="state.list" :lines="state.lines" :fmac="state.fmac" :detailed="true" />
            </grid-item>
          </grid-layout>
        </ScrollContainer>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { ScrollContainer } from '/@/components/Container';
  import { getTitle, getMacData } from '/@/api/productionDeal/tagPrint';
  import Parser from '../tagPrint/components/parser.vue';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { useBaseStore } from '/@/store/modules/base';

  const baseStore = useBaseStore();
  interface State {
    data: any[];
    list: any[];
    lines: number[];
    fmac: string;
  }

  const sum = ref(0);
  const state = reactive<State>({
    data: [],
    list: [],
    lines: [],
    fmac: '',
  });

  const layout = [
    //x:第几列 y:第几行 w:初始宽度的倍数  h:初始高度的倍数 i:ID
    { x: 0, y: 0, w: 3, h: 8, i: '0', lydcKey: 'title' },
    { x: 0, y: 1, w: 3, h: 7, i: '2', lydcKey: 'lineChart' },
  ];

  const schemas: FormSchema[] = [
    {
      field: 'EntDate',
      label: '',
      component: 'DatePicker',
      defaultValue: Date.now(),
      componentProps: {
        format: 'YYYY-MM-DD',
        placeholder: '请选择日期',
      },
      colProps: { span: 5 },
    },
    {
      field: 'Fmachine',
      label: '',
      component: 'Input',
      defaultValue: '',
      componentProps: {
        placeholder: '请输入机台号',
      },
      colProps: { span: 5 },
    },
    {
      field: 'Fteam',
      label: '',
      component: 'InputNumber',
      defaultValue: '',
      componentProps: {
        placeholder: '组别',
      },
      colProps: { span: 5 },
    },
    {
      field: 'DataBase',
      label: '',
      component: 'Select',
      componentProps: {
        placeholder: '选择厂区',
      },
      rules: [{ type: 'string' }],
      colProps: { span: 5 },
    },
  ];

  const [registerForm, { updateSchema, getFieldsValue }] = useForm({
    labelAlign: 'left',
    labelWidth: 60,
    baseColProps: { span: 5 },
    schemas,
    showActionButtonGroup: true,
    showAdvancedButton: false,
    compact: true,
  });

  //提交
  async function handleSubmit(values) {
    await getData(values);
    handleSearch();
  }

  //重置
  function handleSearch() {
    sum.value++;
  }

  //查询数据库字典
  async function getDataBase() {
    const process = (await baseStore.getDictionaryData('DataBase')) as any[];
    const optionsProcess = process.map(i => {
      return {
        id: i.enCode,
        fullName: i.fullName,
      };
    });
    if (!optionsProcess.length) return;
    updateSchema({
      field: 'DataBase',
      defaultValue: optionsProcess[0].id,
      componentProps: {
        options: optionsProcess,
      },
    });
  }

  async function getData(values) {
    const entry = (await getTitle(values)).data;
    state.fmac = entry?.Fmachine;
    var lines;
    if (entry) {
      if (!values) {
        let mac = { Fmachine: entry.Fmachine };
        lines = (await getMacData(mac)).data;
      } else {
        values.Fmachine = entry?.Fmachine;
        lines = (await getMacData(values)).data;
      }
    }
    var arr: number[] = [];
    for (let i: number = 8; i < 20; i++) {
      let a = lines?.find(c => c.hour == i)?.total;
      if (a) {
        arr.push(a);
      } else {
        arr.push(0);
      }
    }
    state.lines = arr;
    if (entry) {
      state.list = entry;
      state.data = [
        ['type', '计划数量', '模切数量'],
        ['工单数量', entry.Qty, entry.SQty],
        ['当班进度', entry.FplanQty, entry.FQty],
      ];
    } else {
      state.list = [];
      state.data = [
        ['type', '计划数量', '模切数量'],
        ['工单数量', 0, 0],
        ['当班进度', 0, 0],
      ];
    }
  }

  async function handleReset() {
    getData('');
    handleSearch();
  }

  onMounted(() => {
    getDataBase();
    setTimeout(() => {
      var b = getFieldsValue();
      getData(b);
    }, 1000);
  });
</script>

<style lang="less" scoped>
  .gridItem {
    background-color: #fff;
  }

  .divForm {
    margin: 0px 10px 0px 10px;
    padding: 10px 10px 0;
    flex-shrink: 0;
    background-color: @component-background;
  }
</style>
