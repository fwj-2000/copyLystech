import { watch } from 'fs';
import { ref, computed, unref, onMounted, watchEffect, nextTick } from 'vue';
import type { Ref } from 'vue';

export function useTableSelection(tableContainer: Ref<HTMLElement | null>, getViewColumns: any, tableData: Ref<any[]>, getProps) {
  const isMouseDown = ref(false);
  const startCell = ref<HTMLElement | null>(null);
  const endCell = ref<HTMLElement | null>(null);
  const { enableDragSelect } = unref(getProps);
  // 新增：当前活动的单元格
  const activeCell = ref<HTMLElement | null>(null);

  const handleTableMouseDown = async (event: MouseEvent) => {
    clearSelection();
    if (!enableDragSelect) return;
    const target = event.target as HTMLElement;
    if (target.tagName === 'TD') {
    //   event.preventDefault(); // 阻止默认的文本选择行为
      target.focus(); // 阻止默认的文本选择行为
      isMouseDown.value = true;
      startCell.value = target;
      endCell.value = target;
      activeCell.value = target; // 设置 activeCell 为起始单元格
      toggleSelection(startCell.value, endCell.value);
    } else {
      clearSelection();
    }
  };

  const handleTableMouseMove = (event: MouseEvent) => {
    if (!enableDragSelect) return;
    if (isMouseDown.value) {
      const target = event.target as HTMLElement;
      if (target.tagName === 'TD') {
        endCell.value = target;
        activeCell.value = startCell.value; // 保持 activeCell 为起始单元格
        clearSelection();
        toggleSelection(startCell.value, endCell.value);
      }
    }
  };

  // 监听鼠标松开事件
  const handleTableMouseUp = event => {
    if (!enableDragSelect) return;
    isMouseDown.value = false;
  };

  const toggleSelection = (start: HTMLElement, end: HTMLElement) => {
    const startRow = (start.parentElement as HTMLTableRowElement).rowIndex + 1;
    const startCol = start.cellIndex;
    const endRow = (end.parentElement as HTMLTableRowElement).rowIndex + 1;
    const endCol = end.cellIndex;

    // 确定左上角和右下角
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);
    // 遍历表格，选中区域
    const rows = tableContainer.value?.querySelectorAll('tr');
    if (rows) {
      for (let i = minRow; i <= maxRow; i++) {
        const row = rows[i];
        const cells = row.querySelectorAll('td');
        for (let j = minCol; j <= maxCol; j++) {
          const cell = cells[j];
          cell.style.position = 'relative';
          //   cell.style.pointerEvents = 'user-select-none';
          // cell.style.userSelect = 'none';

          // 添加蒙版层
          const overlay = document.createElement('div');
          overlay.classList.add('selected-overlay');
          cell.appendChild(overlay);
        }
      }
    }
  };

  const clearSelection = () => {
    const selectedOverlays = tableContainer.value?.querySelectorAll('.selected-overlay');
    selectedOverlays?.forEach(overlay => {
      const cell = overlay.parentElement as HTMLTableCellElement;
      cell.removeChild(overlay); // 移除蒙版层
    });
  };

  const getSelectedData = () => {
    // 获取所有带有蒙版层的单元格
    const selectedOverlays = tableContainer.value?.querySelectorAll('.selected-overlay');
    console.log(selectedOverlays, '当前选中的selectedOverlays');
    if (!selectedOverlays || selectedOverlays.length === 0) return null;

    // 获取选中区域的行列范围
    const rows = new Set<number>();
    const cols = new Set<number>();
    selectedOverlays.forEach(overlay => {
      const cell = overlay.parentElement as HTMLTableCellElement;
      const row = (cell.parentElement as HTMLTableRowElement).rowIndex + 1;
      const col = cell.cellIndex;
      rows.add(row);
      cols.add(col);
    });

    const minRow = Math.min(...rows);
    const maxRow = Math.max(...rows);
    const minCol = Math.min(...cols);
    const maxCol = Math.max(...cols);

    // 按行和列提取数据
    let result = '';
    const tableRows = tableContainer.value?.querySelectorAll('tr');
    if (tableRows) {
      for (let i = minRow; i <= maxRow; i++) {
        const row = tableRows[i];
        const cells = row.querySelectorAll('td');
        let rowData = [];
        for (let j = minCol; j <= maxCol; j++) {
          const cell = cells[j];
          // 检查单元格是否有蒙版层
          if (cell.querySelector('.selected-overlay')) {
            rowData.push(cell.innerText);
          } else {
            rowData.push(''); // 如果单元格未被选中，填充空字符串
          }
        }
        result += rowData.join('\t') + '\n'; // 列用制表符分隔，行用换行符分隔
      }
    }
    console.log(result);
    return result.trim(); // 去除最后的换行符
  };

  onMounted(() => {
    document.addEventListener('copy', event => {
      const selectedData = getSelectedData();
      if (selectedData) {
        event.clipboardData?.setData('text/plain', selectedData);
        event.preventDefault(); // 阻止默认复制行为
      }
    });
  });

  //     document.removeEventListener('copy', handleCopy);
  //     document.removeEventListener('paste', handlePaste);

  // ---------------- 外部复制进来-----------------------
  const getPasteStartCell = (start, end) => {
    const startRow = (start.parentElement as HTMLTableRowElement).rowIndex + 1;
    const startCol = start.cellIndex;
    const endRow = (end.parentElement as HTMLTableRowElement).rowIndex + 1;
    const endCol = end.cellIndex;
    const minRow = Math.min(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    return [minRow, minCol];
  };
  // 新增：处理粘贴事件
  const handlePaste = (event: ClipboardEvent) => {
    console.log(event, '6666666');
    // event.preventDefault(); // 阻止默认行为
    // event.stopPropagation(); // 停止事件冒泡
    try {
      event.preventDefault();
      // 获取起始行和列
      const [startRow, startCol] = getPasteStartCell(startCell.value, endCell.value);

      // 获取粘贴的文本
      const text = event.clipboardData?.getData('text/plain');
      if (!text) return;

      // 按行和列拆分粘贴的内容
      const lines = text.split('\n');
      lines.forEach((line, rowOffset) => {
        const cols = line.split('\t');
        cols.forEach((value, colOffset) => {
          const targetRow = startRow + rowOffset;
          const targetCol = startCol + colOffset;
          const cell = getCell(targetRow, targetCol);
          if (cell) {
            cell.textContent = value;
            // 更新数据源
            updateData(targetRow, targetCol, value);
          } else {
          }
        });
      });
    } catch (error) {
      console.log(error, 'handlePaste error');
    }
  };

  const getCell = (row: number, col: number): HTMLTableCellElement | null => {
    const rowElement = tableContainer.value?.querySelectorAll('tr')[row];
    if (rowElement) {
      return rowElement.querySelectorAll('td')[col];
    }
    return null;
  };

  const updateData = (row: number, col: number, value: string) => {
    console.log(row, col, value, 'updateData');
    try {
      row = row - 1; // 调整行索引（从 0 开始）
      console.log(row);
      const columns = unref(getViewColumns); // 获取当前列定义
      const columnKey = columns[col]?.dataIndex; // 获取列对应的 dataIndex（即字段名）
      if (tableData.value[row] && tableData.value[row][columnKey] !== undefined) {
        tableData.value[row][columnKey] = value;
        // 通知表格更新
        // updateTableDataRecord(row, tableData);
      }
    } catch (error) {
      console.log(error, 'updateData error');
    }
  };

  return {
    isMouseDown,
    startCell,
    endCell,
    activeCell,
    clearSelection,
    toggleSelection,
    getSelectedData,
    handleTableMouseDown,
    handleTableMouseMove,
    handleTableMouseUp,
    handlePaste,
  };
}
