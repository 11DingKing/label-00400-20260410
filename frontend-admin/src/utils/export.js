/**
 * 数据导出工具
 */
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// 导出Excel
export const exportToExcel = (data, columns, filename = 'export') => {
  const headers = columns.map((col) => col.title);
  const keys = columns.map((col) => col.dataIndex);
  
  const rows = data.map((item) =>
    keys.map((key) => {
      const col = columns.find((c) => c.dataIndex === key);
      if (col?.render) {
        const rendered = col.render(item[key], item);
        return typeof rendered === 'string' ? rendered : item[key];
      }
      return item[key];
    })
  );

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, `${filename}.xlsx`);
};
