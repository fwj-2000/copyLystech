<template>
  <div class="h-full w-full">
    <!-- 纸张大小 A3、A4 等 -->
    <!-- 自定义纸张 -->

    <div class="flex h-full w-full">
      <div class="flex-2 h-full left tool-list">
        <div class="tab-container">
          <!-- Tab标题栏 -->
          <div class="tab-header flex-wrap justify-between">
            <button v-for="(tab, index) in tabs" :key="index" class="tab-button" :class="{ active: activeKey === index }" @click="tabChange(index)">
              <div class="active-line"></div>
              {{ tab.title }}
            </button>
          </div>
          <!-- Tab内容区 -->
          <div class="tab-content">
            <toolsList v-show="activeKey == 0" />
            <treeCustom v-show="activeKey == 1" @updateTreeData="updateTreeData" :newFieldItems="newFieldItems" :templateData="templateData" />
            <hiprintTemplate v-if="activeKey == 2" @clickTemplate="clickTemplate" />
          </div>
        </div>
      </div>
      <div class="flex-5 h-full center">
        <div class="flex tool-header align-center">
          <PaperSettings
            :paperSizes="paperTypes"
            :curPaperType="curPaperType"
            @setPaper="setPaper"
            v-model:paperWidth="paperWidth"
            v-model:paperHeight="paperHeight"
            @setPaperOther="setPaperOther" />
          <div class="h-30px w-1px bg-[#999191] mx-10px"></div>
          <div class="flex align-center">
            <button class="w-10px mx-2px" @click="changeScale(false)">-</button>
            <div class="w-40px text-center">{{ (scaleValue * 100).toFixed(0) }}%</div>
            <button class="w-10px mx-2px" @click="changeScale(true)">+</button>
          </div>
          <div class="h-30px w-1px bg-[#999191] mx-10px"></div>
          <a-select v-model:value="fontSizeValue" @change="handleChange" ref="select" style="min-width: 70px">
            <a-select-option v-for="(v, i) of fontSize" :key="i" :value="v">{{ v }}</a-select-option>
          </a-select>
          <div class="h-30px w-1px bg-[#999191] mx-10px"></div>
          <a-popover placement="bottom">
            <template #content>
              <p>{{ t('dict.CommonCol.RotatingPaper') }}</p>
            </template>
            <i class="ym-custom ym-custom-crop-rotate text-[16px] mx-10px cursor-pointer" @click.stop="rotatePaper"></i>
          </a-popover>
          <a-popover placement="bottom">
            <template #content>
              <p>{{ t('dict.CommonCol.EmptyThePaper') }}</p>
            </template>
            <i class="icon-ym icon-ym-btn-clearn text-[18px] mx-10px cursor-pointer" @click.stop="clearPaper"></i>
          </a-popover>
          <div class="text-[18px] font-bold mx-10px cursor-pointer" @click="setOption('加粗')">B</div>
          <div class="text-[18px] mx-10px cursor-pointer" @click="setOption('变细')">B</div>
          <i class="icon-ym icon-ym-report-icon-underline text-[16px] mx-10px cursor-pointer" @click="setOption('下划线')"></i>
          <i class="ym-custom ym-custom-format-strikethrough-variant text-[16px] mx-10px cursor-pointer" @click="setOption('删除线')"></i>
          <div class="h-30px w-1px bg-[#999191] mx-10px"></div>
          <DropDownSetting @alignmentMethod="alignmentMethod" :list="LayoutList">
            <i class="ym-custom ym-custom-format-align-justify"></i>
          </DropDownSetting>
          <div class="h-30px w-1px bg-[#999191] mx-10px"></div>
          <DropDownSetting @setOption="setOption" :list="borderList">
            <i class="icon-ym icon-ym-report-icon-border-all"></i>
          </DropDownSetting>
          <div class="h-30px w-1px bg-[#999191] mx-10px"></div>
          <DropDownSetting @setOption="setOption" :list="LevelList">
            <i class="icon-ym icon-ym-report-icon-align-left"></i>
          </DropDownSetting>
          <div class="h-30px w-1px bg-[#999191] mx-10px"></div>
          <WordColorPicker v-model:selectedColor="colorValue" @submit="submit" />
          <a-popover placement="bottom">
            <template #content>
              <p>{{ t('dict.CommonCol.PreviewPrint') }}</p>
            </template>
            <button class="font-thin text-20px my-10px mx-8px" @click.stop="previewPrint"> <i class="icon-ym icon-ym-report-icon-preview"></i> </button>
          </a-popover>
          <!-- <button class=" ml-10" @click.stop="directPrint">
            直接打印(需要连接客户端)
            <i class="iconfont sv-printer" />
          </button>
          <button class="api  ml-10 btn-style" @click.stop="demo"> ⎙ </button> -->
        </div>
        <!-- 设计器的容器 -->
        <div ref="printTemplateDesign" id="lydc-print-template" style="margin: 36px 47px 00"></div>
      </div>
      <div class="flex-2 h-full right">
        <!-- 元素参数的容器 -->
        <div v-show="showOptions" id="print-element-option-setting"></div>
      </div>
    </div>
    <TablePicker v-model:visible="showPicker" @select="handleTableSelect" />
    <fieldBuilder @register="registerFieldBuilder" @expression-created="handleExpressionCreated" :treeData="treeData" />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, nextTick, toRaw, onUnmounted } from 'vue';
  import { hiprint as lydcPrint, defaultElementTypeProvider, disAutoConnect } from './hiprint/index';
  import toolsList from './components/tools-list.vue';
  import treeCustom from './components/tree-custom-parent.vue';
  import TablePicker from './components/gridSelector.vue';
  import hiprintTemplate from './components/hiprint-template.vue';
  import fieldBuilder from './components/fieldBuilder.vue';
  import { customProvider, providerText, initLydcPrintElement, borderList, LevelList, LayoutList } from './config';
  import { useModal } from '/@/components/Modal';
  import { useI18n } from '/@/hooks/web/useI18n';
  // 组合式函数 hooks
  import { usePaper } from './hooks/use-paper';
  import { useZoom } from './hooks/use-zoom';
  // 工具
  import { newLydcPrintPrintTemplate, flattenTreeWithPrefix, flattenAndTransformFields, convertTimestampToFormattedDate } from './utils/templateHelper';
  import { TreeDataItem } from 'ant-design-vue/es/tree/Tree';
  import WordColorPicker from './components/WordColorPicker.vue';
  import PaperSettings from './components/PaperSettings.vue';
  import DropDownSetting from './components/DropDownSetting.vue';
  defineOptions({ name: 'PrintTemplateCreator' });
  const { t } = useI18n();
  const [registerFieldBuilder, { openModal: openFieldBuilder }] = useModal();
  const props = defineProps({
    templateData: { type: Object, default: null },
    editMode: { type: Boolean, default: true },
    treeDataValue: { type: Array, default: [] },
  });
  const tabs = [{ title: t('dict.CommonCol.Control') }, { title: t('dict.IDGeneratorRuleSeqType.3') }, { title: t('dict.PCCApplyColumn.commonTemplate') }];
  const emit = defineEmits(['update:visible', 'save', 'cancel']);
  const TEMPLATE_KEY = 'PrintTemplateCreator';
  const { paperTypes, curPaper, curPaperType, paperPopVisible, paperWidth, paperHeight, showPaperPop, setPaper, setPaperOther } = usePaper(TEMPLATE_KEY);
  const { scaleValue, changeScale } = useZoom(TEMPLATE_KEY);
  const activeKey = ref(0);
  const treeData = ref<any>([]);
  const showPicker = ref(false);
  const fontSizeValue = ref(12);
  const colorValue = ref('#FFFFFF');
  const showOptions = ref(true);
  const handleExpressionCreated = (expression: string) => {
    let els = lydcPrintTemplate.getSelectEls();
    if (els.length == 1) {
      els[0].updateOption('field', expression);
    }
  };
  function flattenTreeData(treeData: TreeDataItem[]): TreeDataItem[] {
    const result: TreeDataItem[] = [];
    function traverse(node: TreeDataItem) {
      result.push(node);
      if (node.children && node.children.length > 0) {
        node.children.forEach(child => traverse(child));
      }
    }
    treeData.forEach(root => traverse(root));
    return result;
  }

  let fieldItems: any = [];
  let newFieldItems: any = [];
  interface TableCell {
    width: number;
    colspan: number;
    rowspan: number;
    checked: boolean;
    [key: string]: any;
  }
  let tableData: TableCell[][] = [];
  let PanelJson;
  // 动态创建表格
  const handleTableSelect = ({ rows, cols }) => {
    // 创建一个 rows × cols 的二维数组
    tableData = Array.from({ length: rows + 1 }, () =>
      Array.from({ length: cols }, () => ({
        width: 85.25, // 默认宽度
        colspan: 1, // 默认跨列数
        rowspan: 1, // 默认跨行数
        checked: true, // 默认选中状态
      })),
    );
    let lastElement = PanelJson.panels[0].printElements[PanelJson.panels[0].printElements.length - 1];
    lastElement.options.height = 20 * rows;
    lastElement.options.top = 0;
    lastElement.options.left = 0;
    lastElement.options.tableHeaderBackground = '#fff';
    lastElement.options.columns = tableData;
    lastElement.options.width = PanelJson.panels[0].width * 2.834645669291339;
    if (lastElement.printElementType.title == '自定义表格') {
      lastElement.options.styler = function (value, options, target, templateData) {
        const $head = $(target[0]).find('thead');
        const td = $(target[0]).find('td');
        if (td.length > 0) {
          td.css({
            'white-space': 'pre-wrap' /* 保留空白符和换行 */,
            'word-wrap': 'break-word' /* 允许长单词换行 */,
          });
        }
        const arr = $head[0].children;
        const lastItem = arr[arr.length - 1]; // 4
        lastItem.style.height = '0';
        lastItem.style.border = '1px solid transparent';
        lastItem.style.userSelect = 'none';
        lastItem.style.visibility = 'hidden';
        lastItem.style.pointerEvents = 'none';
        for (let i = 0; i < lastItem.children.length; i++) {
          lastItem.children[i].style.height = '0';
          lastItem.children[i].style.border = 'none';
          lastItem.children[i].style.opacity = '0';
          lastItem.children[i].style.userSelect = 'none';
        }
      };
    }
    lydcPrintTemplate.update(PanelJson);
  };
  const updateTreeData = data => {
    treeData.value = data;
    nextTick(async () => {
      let options = await initLydcPrintElement();
      initLydcPrint(options);
      buildLeftElement();
    });
  };
  const fontSize = [
    6, 6.75, 7.5, 8.25, 9, 9.75, 10.5, 11.25, 12, 12.75, 13.5, 14.25, 15, 15.75, 16.5, 17.25, 18, 18.75, 19.5, 20.25, 21, 21.75, 22, 22.5, 23, 23.5, 24, 24.5,
    25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29, 29.5, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
  ];
  // 模板对象
  let lydcPrintTemplate;
  const templateRef = ref<any>(null);

  // 获取 DOM 元素
  const providerContainer1 = ref<HTMLElement | null>(null);
  const printTemplateDesign = ref<HTMLElement | null>(null);
  const demo = () => {
    lydcPrintTemplate.selectPanel(1);
  };

  // autoConnect((status, msg) => {
  //   // if (status) {
  //   //   lydcPrintTemplate.print2(printData, {
  //   //     printer: '',
  //   //     title: 'lydcPrint打印',
  //   //   });
  //   // }
  // });
  const setOption = (val, item?) => {
    let els = lydcPrintTemplate.getSelectEls();
    if (els.length > 0) {
      els.forEach(element => {
        if (element.printElementType.type == 'text') {
          switch (val) {
            case '加粗':
              return element.updateOption('fontWeight', 900);
            case '变细':
              return element.updateOption('fontWeight', 400);
            case '下划线':
              return element.updateOption('textDecoration', 'underline');
            case '删除线':
              return element.updateOption('textDecoration', 'line-through');
            case '上边框':
              return element.updateOption('borderTop', 'solid');
            case '下边框':
              return element.updateOption('borderBottom', 'solid');
            case '左边框':
              return element.updateOption('borderLeft', 'solid');
            case '右边框':
              return element.updateOption('borderRight', 'solid');
            case '显示边框':
              element.updateOption('borderTop', 'solid');
              element.updateOption('borderBottom', 'solid');
              element.updateOption('borderLeft', 'solid');
              element.updateOption('borderRight', 'solid');
              return;
            case '隐藏边框':
              element.updateOption('borderTop', undefined);
              element.updateOption('borderBottom', undefined);
              element.updateOption('borderLeft', undefined);
              element.updateOption('borderRight', undefined);
              return;
            case '文本左对齐':
              element.updateOption('textAlign', 'left');
              return;
            case '文本右对齐':
              element.updateOption('textAlign', 'right');
              return;
            case '文本水平居中':
              element.updateOption('textAlign', 'center');
              return;
            case '文本顶部对齐':
              element.updateOption('textContentVerticalAlign', 'top');
              return;
            case '文本垂直居中':
              element.updateOption('textContentVerticalAlign', 'middle');
              return;
            case '文本底部对齐':
              element.updateOption('textContentVerticalAlign', 'bottom');
              return;
            case '字体':
              element.updateOption('fontSize', item);
              return;
            case '字体颜色':
              console.log(colorValue.value, 'colorValue');

              element.updateOption('color', colorValue.value);
              return;
            default:
              return;
          }
        }
        // element.updateOption('fontSize', 12);
      });
    }
  };
  const handleChange = (value: string) => {
    setOption('字体', value);
  };
  const alignmentMethod = val => {
    console.log(val, 'valvall');
    lydcPrintTemplate.setElsAlign(val);
  };
  // 点击模板
  const clickTemplate = async item => {
    const savedTemplate = item.template_json;
    if (savedTemplate) {
      templateRef.value = JSON.parse(savedTemplate);
      let temp = toRaw(templateRef.value);
      lydcPrintTemplate.update(temp);
      curPaper.value.width = templateRef.value?.panels[0].width;
      curPaper.value.height = templateRef.value?.panels[0].height;
      paperWidth.value = templateRef.value?.panels[0].width;
      paperHeight.value = templateRef.value?.panels[0].height;
    }
  };
  const tabChange = async tab => {
    activeKey.value = tab;
    if (tab === 0) {
      let options = await initLydcPrintElement();
      lydcPrint.init({ providers: [customProvider(options, fieldItems)] });
    } else {
      lydcPrint.init({ providers: [providerText(flattenTreeData(treeData.value))] });
    }
  };
  const submit = () => {
    setOption('字体颜色');
  };
  // 初始化
  const initLydcPrint = options => {
    lydcPrint.init({
      providers: [customProvider(options, fieldItems), providerText(flattenTreeData(treeData.value)), new defaultElementTypeProvider()],
    });
  };

  // 构建左侧可拖拽元素
  const buildLeftElement = () => {
    if (providerContainer1.value) {
      // 清空容器
      providerContainer1.value.innerHTML = '';
      // 构建模块
      lydcPrint.PrintElementTypeManager.build(providerContainer1.value, 'providerModule1');
    }
    // eslint-disable-next-line no-undef
    lydcPrint.PrintElementTypeManager.buildByHtml($('.ep-draggable-item'));
  };

  // 构建设计器
  const buildDesigner = () => {
    // eslint-disable-next-line no-undef
    $('#lydc-print-template').empty();
    // 如果是编辑模式且有模板数据，使用传入的模板数据
    // const templateData = props.editMode && props.templateData.value ? props.templateData.value : defaultTemplate;
    // templateRef.value = templateData;
    lydcPrintTemplate = newLydcPrintPrintTemplate(TEMPLATE_KEY, {
      template: templateRef.value,
      settingContainer: '#print-element-option-setting',
      onImageChooseClick: target => {
        // 创建input，模拟点击，然后 target.refresh 更新
        let input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.click();
        input.onchange = function () {
          let file = this.files[0];
          let reader = new FileReader();
          if (file) {
            //通过文件流行文件转换成Base64字行串
            reader.readAsDataURL(file);
            //转换成功后
            reader.onloadend = function () {
              // 通过 target.refresh 更新图片元素
              target.refresh(reader.result);
            };
          }
        };
        input.remove();
      },
      onDataChanged: (type, json) => {
        // 模板发生改变回调
        console.log(type, 'type', json, 'json'); // 新增、移动、删除、修改(参数调整)、大小、旋转
        if (type == '新增') {
          let newJson = json;
          let lastElement = newJson.panels[0].printElements[newJson.panels[0].printElements.length - 1];
          if (lastElement.printElementType.title == '自定义表格' || lastElement.printElementType.title == '圆角表格') {
            PanelJson = json;
            showPicker.value = true;
          } else if (lastElement.printElementType.title == '单选框') {
            lastElement.options.formatter = `function (options, rows, data, currentPageGridRowsData) {
              console.log(options, rows, data, currentPageGridRowsData, 'options, rows, data, currentPageGridRowsData');
              return '<input style="width:100%;height:100%;" checked type="radio">';
            }`;
            lydcPrintTemplate.update(json);
          } else if (lastElement.printElementType.title == '表格') {
            lastElement.options.fields = flattenAndTransformFields(treeData.value);
            lastElement.options.width = newJson.panels[0].width * 2.834645669291339;
            lastElement.options.top = 0;
            lastElement.options.left = 0;
            lydcPrintTemplate.update(json);
          } else if (lastElement.printElementType.title == '长文本') {
            lastElement.options.width = newJson.panels[0].width * 2.834645669291339;
            lydcPrintTemplate.update(json);
          }
        }
        // if (type == '大小') {
        //   json.panels[0].printElements.forEach((v, i) => {
        //     if (v.printElementType.title == '自定义表格') {
        //       $('.hiprint-printElement-table').each(function (index, element) {
        //         console.log(Number(element.style.height.replace('pt', '')) === v.options.height);
        //         if (Number(element.style.height.replace('pt', '')) === v.options.height) {
        //           $(element)
        //             .find('thead')
        //             .css('height', v.options.height + 'pt');
        //         }
        //       });
        //     }
        //   });
        // }
      },
      onClickField() {
        let els = lydcPrintTemplate.getSelectEls();
        if (els.length == 1) {
          openFieldBuilder(true, els[0]);
        }
      },
      onclick(e) {
        nextTick(() => {
          let els = lydcPrintTemplate.getSelectEls();
          const isSpecial = ['空白', '自定义表格'].includes(e);
          if (els.length > 1 && !isSpecial) {
            showOptions.value = false;
          } else {
            showOptions.value = true;
          }
          if (els.length == 1) {
            fontSizeValue.value = els[0].options.fontSize;
            colorValue.value = els[0].options.color;
          }
        });
      },
      onUpdateError: e => {
        // 更新失败回调
        console.log(e, 'e');
      },
    });
    curPaper.value.width = templateRef.value?.panels[0].width;
    curPaper.value.height = templateRef.value?.panels[0].height;
    paperWidth.value = templateRef.value?.panels[0].width;
    paperHeight.value = templateRef.value?.panels[0].height;
    // lydcPrintTemplate.setFields(fieldItems);

    lydcPrintTemplate.design('#lydc-print-template');
    // console.log(lydcPrintTemplate, lydcPrint, 'lydcPrintTemplate');
  };
  // 打印预览
  function resolveTemplateField(field, data) {
    if (!field || !field.includes('${')) return;

    const matches = field.match(/\$\{([^}]+)\}/g);
    if (!matches) return;

    let result = field;
    matches.forEach(match => {
      const key = match.slice(2, -1);
      result = result.replace(match, data[key] ?? '');
    });

    data[field] = result;
  }

  // 处理一个 panel
  function processPanel(panel, data) {
    panel.printElements.forEach(element => {
      resolveTemplateField(element.options.field, data);
    });
  }

  // 处理单条打印数据
  function processPrintItem(item, templateJson) {
    const newItem = convertTimestampToFormattedDate({ ...item });

    templateJson.panels.forEach(panel => {
      processPanel(panel, newItem);
    });

    return newItem;
  }

  // 打印预览（主入口）
  const previewPrint = printData => {
    const templateJson = getTemplateJson();

    const options = {};
    const ext = {
      callback: () => {
        console.log('浏览器打印窗口已打开');
      },
      styleHandler: () => '<link href="/css/print-lock.css" media="print" rel="stylesheet">',
    };

    const dataToPrint = printData.length ? printData.map(item => processPrintItem(item, templateJson)) : processPrintItem(printData, templateJson);

    lydcPrintTemplate.print(dataToPrint, options, ext);
  };

  /**
   * 直接打印: 借助客户端,静默打印(无弹窗直接打印)
   * 注意：需要先连接客户端
   */
  const directPrint = printData => {
    if (lydcPrint.hiwebSocket.opened) {
      lydcPrintTemplate.print2(printData, {
        styleHandler: () => {
          // 这里拼接成放html->head标签内的css/style
          // 重写样式：所有文本红色
          // let css = '<style>.hiprint-printElement-text{color:red !important;}</style>';
          // return css;
        },
      });
    } else {
      alert('请先连接客户端(刷新网页), 然后再点击「直接打印」');
    }
  };

  // 旋转纸张
  const rotatePaper = () => {
    lydcPrintTemplate.rotatePaper();
  };

  // 清空所有元素
  const clearPaper = () => {
    lydcPrintTemplate.clear();
  };

  // 获取模板 JSON
  const getTemplateJson = () => {
    return lydcPrintTemplate.getJson();
  };
  // 暴露方法给父组件
  defineExpose({
    getTemplateJson,
    clickTemplate,
    previewPrint,
  });

  onMounted(async () => {
    if (JSON.stringify(props.templateData) !== '{}' && props.templateData?.template_json) {
      templateRef.value = JSON.parse(props.templateData?.template_json);
    }
    if (props.treeDataValue.length > 0) {
      newFieldItems = flattenTreeWithPrefix(props.treeDataValue as any);
      console.log(newFieldItems, 'newFieldItems');
    }
    let options = await initLydcPrintElement();
    initLydcPrint(options);
    buildLeftElement();
    buildDesigner();
    disAutoConnect();
  });
</script>

<style scoped>
  /* 区域 */
  .left {
    background: white;
    border: 1px solid #d9d9d9;
    border-right: none;
  }

  .left::-webkit-scrollbar {
    display: none;
  }

  .center {
    background: #f5f7fa;
    border: 1px solid #d9d9d9;
    overflow: auto;
  }

  .right {
    background: white;
    border: 1px solid #d9d9d9;
    border-left: none;
    overflow: auto;
    max-width: 280px;
  }

  /* 左侧拖拽元素样式 */
  .title {
    font-size: 14px;
    font-weight: 400;
    margin: 0 0 13px;
  }

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
    padding: 4px 10px;
    margin: 10px 8px 4px;
    width: 38%;
    min-height: 60px;
    border-radius: 4px;
    box-shadow: 2px 2px 2px 2px rgb(171 171 171 / 20%);
  }

  .item .iconfont {
    font-size: 1.5rem;
  }

  .item span {
    font-size: 14px;
  }

  .flex-2 {
    flex: 2;
  }

  .flex-5 {
    flex: 5;
  }

  .ml-10 {
    margin-left: 10px;
  }

  .tool-list {
    max-width: 280px;
  }

  .btn-style {
    font-size: 20px;
    font-weight: 200;
  }

  .hiprint-container {
    padding: 16px;
  }

  .tab-container {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    font-family: Arial, sans-serif;
  }

  .tab-container::-webkit-scrollbar {
    display: none;
  }

  .tab-header {
    display: flex;
    border-bottom: 1px solid #ddd;
    height: 45px;
    width: 100%;
    flex-wrap: nowrap;
  }

  .tab-button {
    padding: 0 20px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: #999;
    position: relative;
    transition: all 0.3s ease;
    word-wrap: break-word;

    /* 或 */
    overflow-wrap: break-word;
  }

  .active .active-line {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 3px;
    border-radius: 2px;
    background-color: #ff7b00;
  }

  .tab-button.active {
    color: #000;
  }

  .tab-content {
    padding: 20px 13px;
    min-height: 200px;
    border-radius: 4px;
    height: calc(100% - 44px);
    display: flex;
  }

  .tool-header {
    padding: 0 10px;
    margin-bottom: 10px;
    background-color: #f2f2f2;
    min-height: 45px;
    justify-content: flex-start;
    border-bottom: 1px solid #e6e6e6;
    z-index: 999;
    flex-wrap: wrap;
  }
</style>
<style>
  .hiprint_rul_wrapper {
    display: none;
  }

  #print-element-option-setting .prop-tabs .prop-tab-items li.active {
    position: relative;
    color: #000;
    border-bottom: none;
    height: 100%;
  }

  #print-element-option-setting .prop-tabs .prop-tab-items li.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    max-width: 100px;
    height: 3px;
    background: #ff7b00;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    transition: all 0.3s ease;
  }

  #print-element-option-setting .auto-submit {
    height: 30px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  #print-element-option-setting .hiprint-option-item-datatype {
    height: 30px;
    border-radius: 5px;
    border: 1px solid #ccc;
  }

  #print-element-option-setting .prop-tabs .prop-tab-items {
    display: flex;
    justify-content: space-between;
    color: #ccc;
    font-weight: 400;
    padding: 0;
    height: 45px;
  }

  #print-element-option-setting .prop-tabs .prop-tab-items .prop-tab-item .tab-title {
    font-weight: 400;
    display: inline-block;
    height: 100%;
    line-height: 45px;
  }

  #print-element-option-setting .hiprint-option-items .hiprint-option-item {
    margin-bottom: 12px;
  }

  #print-element-option-setting .hiprint-option-item-settingBtn {
    background-color: #ff7b00;
  }

  #print-element-option-setting .hiprint-option-item-deleteBtn {
    background-color: #fff;
    border: 1px solid red;
    color: red;
  }

  #print-element-option-setting .hiprint-option-item-label {
    color: #666;
  }

  #lydc-print-template .hiprint-printPanel .hiprint-printPaper:last-child {
    background-color: #fff;
  }

  #lydc-print-template .hiprint-printElement-table-handle {
    width: 15px;
    height: 15px;
    opacity: 0.8;
    background-color: #ff7b00;
  }

  select {
    /* 移除默认样式 */

    /* Chrome/Safari */
    appearance: none; /* Firefox */

    /* 添加自定义细箭头图标 */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    background-size: 12px;
    padding-right: 30px; /* 为箭头留出空间 */
  }

  .custom-checkbox[type='checkbox'] {
    accent-color: #f00;

    /* 修改选中颜色为红色 */
  }
</style>
