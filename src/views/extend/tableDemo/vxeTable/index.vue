<template>
  <div class="lydc-content-wrapper">
    <div class="lydc-content-wrapper-center">
      <div class="lydc-content-wrapper-content">
        <vxe-table
          border
          autoResize
          keepSource
          showOverflow
          height="100%"
          :sort-config="{ multiple: false }"
          :colunm-config="{ resizable: true }"
          :mouse-config="{ area: true, extension: true }"
          :area-config="{ extendByCopy: true, extendByCalc: false }"
          :clip-config="{ isRowIncrement: false, isColumnIncrement: false }"
          :keyboard-config="{ isClip: true, isEdit: true, isTab: true, isArrow: true, isEnter: true, isDel: true, isMerge: true, isFNR: true, isChecked: true }"
          :edit-config="{ trigger: 'dblclick', mode: 'cell', showStatus: true }"
          :menu-config="menuConfig"
          :data="tableData"
          @menu-click="menuClick">
          <vxe-column type="seq" width="60"></vxe-column>
          <vxe-column field="a" title="A1" width="100" sortable :filters="aOptions" :edit-render="{ name: '$input' }"></vxe-column>
          <vxe-column field="b" title="B1" width="120" sortable :filters="bOptions" :edit-render="{ name: '$input' }"></vxe-column>
          <vxe-column field="c" title="C1" width="140" sortable :filters="cOptions" :edit-render="{ name: '$input' }"></vxe-column>
          <vxe-column field="d" title="D1" width="200" :edit-render="{ name: '$input' }"></vxe-column>
          <vxe-column field="e" title="E1" width="200" :edit-render="{ name: '$input' }"></vxe-column>
          <vxe-column field="f" title="F1" width="160" :edit-render="{ name: '$input' }"></vxe-column>
          <vxe-column field="g" title="G1" width="160" :edit-render="{ name: '$input' }"></vxe-column>
          <vxe-column field="h" title="H1" width="120" :edit-render="{ name: '$input' }"></vxe-column>
          <vxe-column field="i" title="I1" width="160" :edit-render="{ name: '$input' }"></vxe-column>
          <vxe-column field="j" title="J1" width="200" :edit-render="{ name: '$input' }"></vxe-column>
          <vxe-column field="k" title="K1" width="140" :edit-render="{ name: '$input' }"></vxe-column>
          <vxe-column field="l" title="L1" width="100" :edit-render="{ name: '$input' }"></vxe-column>
          <vxe-column field="m" title="M1" width="180" :edit-render="{ name: '$input' }"></vxe-column>
          <vxe-column field="n" title="N1" width="120" :edit-render="{ name: '$input' }"></vxe-column>
        </vxe-table>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';

  const menuConfig = {
    body: {
      options: [
        [{ code: 'myCode', name: '自定义的菜单' }],
        // 引入 vxe-table-plugin-menus 之后可以直接使用以下内置 code，也可以自行实现扩展
        [
          { code: 'CLEAR_CELL', name: '清除内容 (Del)' },
          { code: 'COPY_CELL', name: '复制 (Ctrl+C)', prefixIcon: 'vxe-icon-copy' },
          { code: 'CUT_CELL', name: '剪贴 (Ctrl+X)', prefixIcon: 'vxe-icon-cut' },
          { code: 'PASTE_CELL', name: '粘贴 (Ctrl+V)', prefixIcon: 'vxe-icon-paste' },
        ],
        [
          { code: 'OPEN_FIND', name: '查找 (Ctrl+F)' },
          { code: 'OPEN_REPLACE', name: '替换 (Ctrl+H)' },
          { code: 'MERGE_OR_CLEAR', name: '合并/取消 (Ctrl+M)', prefixIcon: 'vxe-icon-merge-cells' },
        ],
        [
          { code: 'INSERT_AT_ROW', name: '新增行' },
          { code: 'DELETE_ROW', name: '删除行' },
          { code: 'EDIT_CELL', name: '编辑' },
          { code: 'REVERT_CELL', name: '还原值', prefixIcon: 'vxe-icon-repeat' },
        ],
        [
          { code: 'CLEAR_FILTER', name: '清除筛选' },
          { code: 'CLEAR_ALL_FILTER', name: '清除所有筛选' },
          {
            name: '排序',
            children: [
              { code: 'CLEAR_SORT', name: '清除排序' },
              { code: 'SORT_ASC', name: '升序', prefixIcon: 'vxe-icon-sort-alpha-asc' },
              { code: 'SORT_DESC', name: '倒序', prefixIcon: 'vxe-icon-sort-alpha-desc' },
            ],
          },
        ],
        // 引入 echarts 和 vxe-table-plugin-charts 之后可以直接使用，也可以自行实现扩展
        [
          {
            name: '创建图表',
            children: [
              { code: 'CHART_BAR_X_AXIS', name: '横向柱状图 - 自由选择', prefixIcon: 'vxe-icon-chart-bar-x' },
              { code: 'CHART_BAR_X_AXIS', name: '横向柱状图 - 固定类别', prefixIcon: 'vxe-icon-chart-bar-x', params: { category: 'a' } },
              { code: 'CHART_BAR_Y_AXIS', name: '纵向柱状图 - 自由选择', prefixIcon: 'vxe-icon-chart-bar-y' },
              { code: 'CHART_BAR_Y_AXIS', name: '纵向柱状图 - 固定类别', prefixIcon: 'vxe-icon-chart-bar-y', params: { category: 'a' } },
              { code: 'CHART_LINE', name: '折线图 - 自由选择', prefixIcon: 'vxe-icon-chart-line' },
              { code: 'CHART_LINE', name: '折线图 - 固定类别', prefixIcon: 'vxe-icon-chart-line', params: { category: 'a' } },
              { code: 'CHART_PIE', name: '饼图 - 自由选择', prefixIcon: 'vxe-icon-chart-pie' },
              { code: 'CHART_PIE', name: '饼图 - 固定类别', prefixIcon: 'vxe-icon-chart-pie', params: { category: 'a' } },
            ],
          },
        ],
        [
          { code: 'PRINT_ALL', name: '打印', prefixIcon: 'vxe-icon-print', params: { columns: ['a', 'b', 'c', 'd', 'e'] } },
          { code: 'EXPORT_ALL', name: '导出 CSV', prefixIcon: 'vxe-icon-download', params: { filename: '导出数据', type: 'csv' } },
        ],
      ],
    },
  };

  const aOptions = ref([
    { label: '4', value: '4' },
    { label: '5', value: '5' },
  ]);

  const bOptions = ref([
    { label: '4', value: '4' },
    { label: '5', value: '5' },
  ]);

  const cOptions = ref([
    { label: '4', value: '4' },
    { label: '5', value: '5' },
  ]);

  const tableData = ref([
    { a: 'test1', b: '12', c: '11', d: '6', e: '3', f: '1', g: 3, h: '2', i: '', j: '', k: '', l: '', m: '', n: '' },
    { a: 'test2', b: '6', c: '2', d: '8', e: '5', f: '3', g: 12, h: '3', i: '', j: '', k: '', l: '', m: '', n: '' },
    { a: 'test3', b: '12', c: '1', d: '1', e: '5', f: '1', g: 24, h: '5', i: '', j: '', k: '', l: '', m: '', n: '' },
    { a: 'test4', b: '4', c: '20', d: '11', e: '1', f: '2', g: 17, h: '14', i: '', j: '', k: '', l: '', m: '', n: '' },
    { a: 'test5', b: '12', c: '2', d: '7', e: '6', f: '12', g: 4, h: '7', i: '', j: '', k: '', l: '', m: '', n: '' },
    { a: 'test6', b: '3', c: '3', d: '11', e: '8', f: '2', g: 2, h: '8', i: '', j: '', k: '', l: '', m: '', n: '' },
    { a: 'test7', b: '32', c: '2', d: '5', e: '2', f: '3', g: 1, h: '9', i: '', j: '', k: '', l: '', m: '', n: '' },
    { a: 'test8', b: '4', c: '2', d: '9', e: '7', f: '2', g: 5, h: '24', i: '', j: '', k: '', l: '', m: '', n: '' },
    { a: 'test9', b: '9', c: '12', d: '1', e: '2', f: '2', g: 6, h: '5', i: '', j: '', k: '', l: '', m: '', n: '' },
    { a: 'test10', b: '5', c: '9', d: '15', e: '2', f: '3', g: 8, h: '15', i: '', j: '', k: '', l: '', m: '', n: '' },
  ]);

  // const list: any[] = []
  // for (let index = 0; index < 1000; index++) {
  //   list.push(
  //     { a: 'a', b: 'rewr' + index, c: 100000 + index, d: '546', e: 'lkjl' + index, f: '', g: 10000 + index, h: 'd', i: '', j: '', k: '', l: '', m: '', n: '' }
  //   )
  // }
  // tableData.value = list

  const menuClick = ({ menu }) => {
    switch (menu.code) {
      case 'myCode':
        alert('点击了自定义菜单');
        break;
    }
  };
</script>
