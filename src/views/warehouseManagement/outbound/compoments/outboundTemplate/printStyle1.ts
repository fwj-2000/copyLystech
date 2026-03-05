const style = `<style>
@page {
  size: auto; /* auto is the initial value */
  margin: 3mm; /* this affects the margin in the printer settings */
}
body {
  height: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
}

html {
  height: 100%;
  box-sizing: border-box;
}

#app {
  height: 100%;
}

* {
  margin: 0;
  padding: 0;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

.no-padding {
  padding: 0px !important;
}

.padding-content {
  padding: 4px 0;
}

a:focus,
a:active {
  outline: none;
}

a,
a:focus,
a:hover {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
}

div:focus {
  outline: none;
}

.fr {
  float: right;
}

.fl {
  float: left;
}

.pr-5 {
  padding-right: 5px;
}

.pl-5 {
  padding-left: 5px;
}

.block {
  display: block;
}

.pointer {
  cursor: pointer;
}

.inlineBlock {
  display: block;
}

.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: ' ';
  clear: both;
  height: 0;
}

aside {
  background: #eef1f6;
  padding: 8px 24px;
  margin-bottom: 20px;
  border-radius: 2px;
  display: block;
  line-height: 32px;
  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  color: #2c3e50;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.text-center {
  text-align: center;
}

* {
  box-sizing: border-box;
}
h1{
  padding: 36px 0 12px;
}
.tem_list h1,
.tem_list h2 {
  text-align: center;
  color: #606266;
}

h1,
h2,
h3 {
  text-align: center !important;
}

p,
h4 {
  width: 720px !important;
  margin: 0 auto !important;
}

p.title {
  border-bottom: 2px dashed #606266;
  line-height: 30px;
  font-size: 12px;
  color: #606266;
  padding-left: 30px;
}

table {
  border: 1px solid black; 
  border-collapse: collapse;
  margin-right: 1px
}

td {
    border: 1px solid black;    /* 单元格内边框 */
    padding: 5px;           /* 单元格内边距 */
}

.title {
  border-bottom: 2px dashed #000 !important;
  padding-left: 30px;
  line-height: 30px;
  font-size: 12px;
}
    .print {
    margin: 0 auto;
    width: 740px;
    text-align: left;
    padding-top: 10px;
  }
  .print-header {
    display: flex;
    justify-content: center;
    text-align: center;
    border-bottom: 1px solid #333;
  }

  .print-title {
    width: 100%;
  }
  .print-title div {
    height: 36px;
    line-height: 36px;
  }
  .print-title > div {
    height: 50px;
    line-height: 50px;
  }

  .print-content {
    width: 100%;
    border: 1px solid #333;
    border-bottom: none;
    border-top: none;
  }
  .row {
    min-height: 34px;
    line-height: 34px;
    display: flex;
    border-bottom: 1px solid #333;
    box-sizing: border-box;
  }
  .col {
    display: flex;
    width: 52%;
  }
  .col:last-child{
    width: 48%;
  }

  .col:last-child .value {
    border-right: none;
  }

  .label {
    border-right: 1px solid #333;
    width: 80px;
    min-width: 95px;
    text-align: left;
    padding-left: 6px;
    display: flex;
    justify-content: left;
    align-items: center;
  }
  .value {
    display: flex;
    flex: 1;
    border-right: 1px solid #333;
    min-width: 140px;
    display: flex;
    padding-left: 12px;
  }
  .sub-col {
    flex: 1;
    border-right: 1px solid #333;
    text-align: center;
  }
  .sub-col:last-child {
    border-right: none;
  }

  .size-block {
    width: 210px;
  }
  .sub-label {
    text-align: left;
    padding-left: 6px;
    min-width: 90px;
    display: flex;
  }
  .label-span-block {
    max-width: 100px;
    min-width: 95px;
  }
  .label-span {
    padding-left: 0;
    max-width: 100px;
  }
  .label-span div {
    width: 50%;
    text-align: center;
  }
  .sub-label div {
    border-left: 1px solid #333;
  }

  .size-block-value {
    display: flex;
  }
  .size-block-value div {
    width: 33.33%;
    border-right: 1px solid #333;
  }
  .size-block-value div:last-child {
    border-right: none;
  }
  .remark {
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .check-content {
    width: 100%;
  }
  .check-content-block {
    width: 100%;
    display: flex;
    border-bottom: 1px solid #333;
  }
  .check-content-block:last-child {
    border-bottom: none;
  }
  .check-block {
  }
  .check-block:last-child {
    border-bottom: none;
  }
  .check-info {
    min-width: 0;
    width: 76.8%;
    border-right: 1px solid #333;
    padding-left: 12px;
  }
  .check-result {
    display: flex;
    align-items: center;
    padding-left: 12px;
  }

  .check-block-title {
    width: 80%;
    text-align: center;
    border-right: 1px solid #333;
    font-size: 14px;
    font-weight: 600;
  }
  .check-block-content {
    width: 80%;
    text-align: left;
    border-right: 1px solid #333;
  }

  .exteriorList .sub-value,
  .packList .sub-value {
    padding-left: 12px;
    width: 100%;
  }
  .exteriorList .col {
    width: 100%;
  }

  .print-footer {
    padding-top: 24px;
  }
  .print-footer-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 14px;
  }
  .sign {
    position: relative;
  }
  .chgz-logo {
    position: absolute;
    top: -15px;
    right: -15px;
  }
  .bdr-0 {
    border-right: none;
  }
  .fs-12px {
    font-size: 12px;
  }
  .order-style {
    font-size: 14px;
    font-weight: 600;
  }
</style>`;
export default style;
