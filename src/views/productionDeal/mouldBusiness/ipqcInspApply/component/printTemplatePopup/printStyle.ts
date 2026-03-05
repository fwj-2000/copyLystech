const style = `<style>
@media print {
  @page {
    margin: 0.25in !important; 
    size: A4 portrait;  // 明确指定 A4 纸张和纵向打印
  }
  body {
    margin: 0;
    padding: 0;
  }
.print {
    margin: 0 auto;
    width: 740px;
    page-break-after: avoid; // 避免不必要的分页
    page-break-inside: avoid;
  }

  .print-header {
    display: flex;
    padding-bottom: 6px;
    justify-content: center;
  }
    
  .print-header img{
    width: 52px;
    height: 47px;
  }

  .print-title {
    margin-left: 12px;
  }

  .print-content {
    width: 100%;
    border: 1px solid #333;
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
  }

  .w-1{
    width: 100%;
  }

  .label {
    border-right: 1px solid #333;
    width: 88px;
    min-width: 88px;
    text-align: left;
    padding-left: 10px;
    display: flex;
    justify-content: left;
    align-items: center;
  }

  .value {
    /* flex: 1; */
    border-right: 1px solid #333;
    min-width: 150px;
    padding-left: 10px;
    display: flex;
  }

  .sub-col {
    min-width: 102px;
    border-right: 1px solid #333;
    text-align: center;
  }

  .sub-label {
    border-bottom: 1px solid #333;
  }
  .sub-col:last-child {
    border-right: none;
  }

  .size-block {
    width: 210px;
  }

  .size-block .sub-label {
    border-bottom: 1px solid #333;
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
    justify-content: space-around;
    flex-wrap: nowrap;
    /* padding-left: 6px; */
    /* margin-right: -8px; */
    position: relative;
  }

  .check-result span {
   padding: 0 !important;
  }

  .check-block-title {
    width: 79.6%;
    text-align: center;
    border-right: 1px solid #333;
    font-size: 16px;
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

  .bdb-1 {
    border-bottom: 1px solid #000;
    padding-bottom: 4px;
  }

  .fs-14 {
    font-size: 14px;
  }

  .bd-0 {
    border: none;
  }

  .pl-6px {
    padding-left: 6px;
  }

  .pl-0 {
    padding-left: 0;
  }
// 添加屏幕显示样式
@media screen {
  .print {
    margin: 0 auto;
    width: 740px;
    background: #fff;
    padding: 20px;
  }
}
  
</style>`;
export default style;
