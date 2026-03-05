import { hiprint } from './hiprint/index';
import text from '/@/assets/images/print-template/text.png';
import picture from '/@/assets/images/print-template/picture.png';
import word from '/@/assets/images/print-template/word.png';
import rectangle from '/@/assets/images/print-template/rectangle.png';
import circle from '/@/assets/images/print-template/circle.png';
import line from '/@/assets/images/print-template/line.png';
import arrow from '/@/assets/images/print-template/arrow.png';
import triangle from '/@/assets/images/print-template/triangle.png';
import multipleChoices from '/@/assets/images/print-template/multiple-choices.png';
import singleChoice from '/@/assets/images/print-template/single-choice.png';
import logo from '/@/assets/images/print-template/logo.png';
import qrCode from '/@/assets/images/print-template/qr-code.png';
import barcode from '/@/assets/images/print-template/barcode.png';
import table from '/@/assets/images/print-template/table.png';
import { urlToBase64 } from '/@/utils/file/base64Conver';
import { useI18n } from '/@/hooks/web/useI18n';
const { t } = useI18n();
export const dragDefaultItems = [
  { tid: 'customModule.text', label: t('formGenerator.component.text'), icon: text },
  { tid: 'customModule.image', label: t('dict.CommonCol.img'), icon: picture },
  { tid: 'customModule.longText', label: t('dict.SemiFinishedProductsExportSapColumn.longText'), icon: word },
  { tid: 'customModule.rect', label: t('dict.CommonCol.rect'), icon: rectangle },
  { tid: 'customModule.oval', label: t('dict.CommonCol.oval'), icon: circle },
  { tid: 'defaultModule.hline', label: t('dict.CommonCol.HorizontalLine'), icon: line },
  { tid: 'defaultModule.vline', label: t('dict.CommonCol.VerticalLine'), icon: line },
  { tid: 'customModule.arrow', label: t('dict.CommonCol.Arrow'), icon: arrow },
  { tid: 'customModule.triangle', label: t('dict.CommonCol.Triangle'), icon: triangle },
];
export const dragCustomItems = [
  { tid: 'customModule.checkbox', label: t('dict.CommonCol.SingleChoiceBox'), icon: multipleChoices },
  { tid: 'customModule.radio', label: t('dict.CommonCol.Checkbox'), icon: singleChoice },
  { tid: 'customModule.logo', label: 'Logo', icon: logo },
  { tid: 'customModule.qrcode', label: t('formGenerator.component.qrcode'), icon: qrCode },
  { tid: 'customModule.barcode', label: t('formGenerator.component.barcode'), icon: barcode },
  { tid: 'customModule.LydcTable', label: t('dict.CommonCol.table'), icon: table },
  { tid: 'customModule.customTable', label: t('dict.CommonCol.CustomTable'), icon: table },
  { tid: 'customModule.customTableRound', label: t('dict.CommonCol.RoundedTable'), icon: table },
];
export const borderList = [
  { name: '上边框', icon: 'icon-ym icon-ym-report-icon-border-top' },
  { name: '下边框', icon: 'icon-ym icon-ym-report-icon-border-bottom' },
  { name: '右边框', icon: 'icon-ym icon-ym-report-icon-border-right' },
  { name: '左边框', icon: 'icon-ym icon-ym-report-icon-border-left' },
  { name: '显示边框', icon: 'icon-ym icon-ym-report-icon-border-all' },
  { name: '隐藏边框', icon: 'icon-ym icon-ym-report-icon-border-none justify-start' },
];
export const LevelList = [
  { name: '文本左对齐', icon: 'icon-ym icon-ym-report-icon-align-left' },
  { name: '文本水平居中', icon: 'icon-ym icon-ym-report-icon-align-center' },
  { name: '文本右对齐', icon: 'icon-ym icon-ym-report-icon-align-right' },
  { name: '文本顶部对齐', icon: 'icon-ym icon-ym-report-icon-align-top' },
  { name: '文本垂直居中', icon: 'icon-ym icon-ym-report-icon-align-middle' },
  { name: '文本底部对齐', icon: 'icon-ym icon-ym-report-icon-align-bottom' },
];
export const LayoutList = [
  { name: '元素左对齐', icon: 'icon-ym icon-ym-report-icon-align-left', alignmentMethod: 'left' },
  { name: '元素水平居中', icon: 'icon-ym icon-ym-report-icon-align-center', alignmentMethod: 'vertical' },
  { name: '元素右对齐', icon: 'icon-ym icon-ym-report-icon-align-right', alignmentMethod: 'right' },
  { name: '元素顶部对齐', icon: 'icon-ym icon-ym-report-icon-align-top', alignmentMethod: 'top' },
  { name: '元素垂直居中', icon: 'icon-ym icon-ym-report-icon-align-middle', alignmentMethod: 'horizontal' },
  { name: '元素底部对齐', icon: 'icon-ym icon-ym-report-icon-align-bottom', alignmentMethod: 'bottom' },
];
/*
 * 初始化打印元素
 */
export const initLydcPrintElement = async () => {
  const logoBase64Data = await urlToBase64('/resource/img/logo.png');
  const arrow = await urlToBase64('/resource/img/arrow.png');
  const triangle = await urlToBase64('/resource/img/triangle.png');
  const eleConfig = {
    config: [
      {
        tid: 'customModule.logo',
        title: 'Logo',
        data: 'test',
        type: 'image',
        options: {
          src: logoBase64Data,
          width: 100,
          height: 100,
          fit: 'contain',
          fixed: true,
        },
      },
      {
        tid: 'customModule.arrow',
        title: '箭头',
        data: 'test',
        type: 'image',
        options: {
          src: arrow,
          fit: 'contain',
          fixed: true,
        },
      },
      {
        tid: 'customModule.triangle',
        title: '三角形',
        data: 'test',
        type: 'image',
        options: {
          src: triangle,
          fit: 'contain',
          fixed: true,
        },
      },
      {
        tid: 'customModule.checkbox',
        title: '单选框',
        data: 'test',
        type: 'html',
        options: {
          width: 20,
          height: 20,
        },
        formatter: function (options, rows, data, currentPageGridRowsData) {
          console.log(options, rows, data, currentPageGridRowsData, 'options, rows, data, currentPageGridRowsData');
          return `<input style="width:100%;height:100%;" class='custom-radio' type="radio"> `;
        },
      },
      {
        tid: 'customModule.radio',
        title: '复选框',
        data: 'test',
        type: 'html',
        options: {
          width: 20,
          height: 20,
        },
        formatter: function (options, rows, data, currentPageGridRowsData) {
          console.log(options, rows, data, currentPageGridRowsData, 'options, rows, data, currentPageGridRowsData');
          return `<input style="width:100%;height:100%;" class='custom-checkbox' checked type="checkbox"> `;
        },
      },
    ],
  };

  return eleConfig;
};
//自定义拖拽元素配置
export const customProvider = (options, fieldsItems) => {
  console.log(options);
  console.log(fieldsItems);

  const addElementTypes = context => {
    context.removePrintElementTypes('customModule');

    context.addPrintElementTypes('customModule', [
      new hiprint.PrintElementTypeGroup('Custom', [
        ...options.config,
        {
          tid: 'customModule.qrcode',
          title: 'LY',
          data: '',
          type: 'qrcode',
          options: {
            field: 'qrcode',
            testData: '16888888888',
            height: 32,
            fontSize: 12,
            lineHeight: 18,
            zIndex: 1,
            hideTitle: true,
          },
        },
        {
          tid: 'customModule.barcode',
          title: 'LY',
          data: '',
          type: 'barcode',
          options: {
            field: 'barcode',
            testData: '56565656',
            height: 32,
            fontSize: 12,
            lineHeight: 18,
            zIndex: 1,
            hideTitle: true,
          },
        },
        {
          tid: 'customModule.LydcTable',
          title: '表格',
          type: 'table',
          columns: [[{}]],
          field: 'table',
          options: {
            height: 40,
            fontSize: 12,
          },
          editable: true,
          columnDisplayEditable: true, //列显示是否能编辑
          columnDisplayIndexEditable: true, //列顺序显示是否能编辑
          columnTitleEditable: true, //列标题是否能编辑
          columnResizable: true, //列宽是否能调整
          columnAlignEditable: true, //列对齐是否调整
          isEnableEditField: true, //编辑字段
          isEnableContextMenu: true, //开启右键菜单 默认true
          isEnableInsertRow: true, //插入行
          isEnableDeleteRow: true, //删除行
          isEnableInsertColumn: true, //插入列
          isEnableDeleteColumn: true, //删除列
          isEnableMergeCell: true, //合并单元格
        },
        {
          tid: 'customModule.customTable',
          title: '自定义表格',
          type: 'table',
          columns: [[{}]],
          options: {
            tableHeaderRepeat: 'first',
            tableFooterRepeat: 'last',
            fields: [],
            testData: '123',
          },
          testData: '123',
          // styler: function (value, options, target, templateData) {
          //   if (target[0].children[1].children[0]) {
          //     target[0].children[1].children[0].style.height = '100%'
          //     target[0].children[1].children[0].children[0].style.height = '100%'
          //     if (target[0].children[1].children[0].children[0].children.length > 0) {
          //       if (target[0].children[1].children[0].children[0].children[0]) {
          //         target[0].children[1].children[0].children[0].children[0].style.height = '100%'
          //         target[0].children[1].children[0].children[0].children[0].children[0].style.height = '100%'
          //       }
          //     }
          //   }
          // },
          editable: true,
          columnDisplayEditable: true, //列显示是否能编辑
          columnDisplayIndexEditable: true, //列顺序显示是否能编辑
          columnTitleEditable: true, //列标题是否能编辑
          columnResizable: true, //列宽是否能调整
          columnAlignEditable: true, //列对齐是否调整
          isEnableEditField: true, //编辑字段
          isEnableContextMenu: true, //开启右键菜单 默认true
          isEnableInsertRow: true, //插入行
          isEnableDeleteRow: true, //删除行
          isEnableInsertColumn: true, //插入列
          isEnableDeleteColumn: true, //删除列
          isEnableMergeCell: true, //合并单元格
        },
        {
          tid: 'customModule.customTableRound',
          title: '圆角表格',
          type: 'table',
          columns: [[{}]],
          options: {
            fields: [],
            fontSize: 12,
            testData: '22',
          },
          styler: function (value, options, target, templateData) {
            const $head = $(target[0]).find('thead');
            const arr = $head[0].children;
            const lastItem = arr[arr.length - 1]; // 4
            const td = $(target[0]).find('td');
            if (td.length > 0) {
              td.css({
                'white-space': 'pre-wrap' /* 保留空白符和换行 */,
                'word-wrap': 'break-word' /* 允许长单词换行 */,
              });
            }
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
            if (target[0].children[1].children[0]) {
              //修改边框样式
              target[0].children[1].children[0].style.border = '1px solid #000';
              target[0].children[1].children[0].style.borderRadius = '50px';
              target[0].children[1].children[0].style.overflow = 'hidden';
            }
          },
          editable: true,
          columnDisplayEditable: true, //列显示是否能编辑
          columnDisplayIndexEditable: true, //列顺序显示是否能编辑
          columnTitleEditable: true, //列标题是否能编辑
          columnResizable: true, //列宽是否能调整
          columnAlignEditable: true, //列对齐是否调整
          isEnableEditField: true, //编辑字段
          isEnableContextMenu: true, //开启右键菜单 默认true
          isEnableInsertRow: true, //插入行
          isEnableDeleteRow: true, //删除行
          isEnableInsertColumn: true, //插入列
          isEnableDeleteColumn: true, //删除列
          isEnableMergeCell: true, //合并单元格
        },
        {
          tid: 'customModule.text',
          title: '文本',
          type: 'text',
          options: {
            fontSize: 12,
            zIndex: 1,
          },
        },
        {
          tid: 'customModule.image',
          title: '图片',
          type: 'image',
          options: {
            zIndex: 1,
          },
        },
        {
          tid: 'customModule.rect',
          title: '矩形',
          type: 'rect',
          options: {
            zIndex: 1,
          },
        },
        {
          tid: 'customModule.longText',
          title: '长文本',
          type: 'longText',
          options: {
            fontSize: 12,
            zIndex: 1,
          },
        },
        {
          tid: 'customModule.oval',
          title: '椭圆',
          type: 'oval',
          options: {
            zIndex: 1,
          },
        },
      ]),
    ]);
  };
  return {
    addElementTypes: addElementTypes,
  };
};
// 动态文本
export const providerText = function (arr) {
  var addElementTypes = function (context) {
    context.removePrintElementTypes('providerTextModule1');
    context.addPrintElementTypes('providerTextModule1', [new hiprint.PrintElementTypeGroup('自定义文本', arr)]);
  };
  return {
    addElementTypes: addElementTypes,
  };
};
