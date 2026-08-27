/* eslint-disable */
/* global WebImporter */
/**
 * Parser for table-nutrition. Base: table.
 * Source: https://www.7up.com/en
 * Generated: 2026-08-27
 *
 * Block library (table): multiple columns, multiple rows.
 *   Row 1: block name.
 *   Each subsequent row = a row of tabular data; cells hold headers/labels/values.
 *
 * Source structure: a native <table> with a <thead> header row
 * (Amount Per Serving | % DV) and <tbody> data rows, each a <tr> of two <td>.
 * Some %DV cells are intentionally empty (Sugar, Protein) and are preserved as
 * empty cells to keep every row the same width.
 */
export default function parse(element, { document }) {
  // The mapping selector targets the <table> itself; handle both cases.
  const table = element.matches('table') ? element : element.querySelector('table');
  if (!table) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const rows = Array.from(table.querySelectorAll('tr'));
  if (rows.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Determine the column count from the widest source row so every content
  // row is padded to the same width.
  const columnCount = rows.reduce(
    (max, tr) => Math.max(max, tr.querySelectorAll('th, td').length),
    0,
  );

  const cells = [];
  rows.forEach((tr) => {
    const rowCells = Array.from(tr.querySelectorAll('th, td')).map((cell) => {
      const content = Array.from(cell.childNodes);
      // Preserve text/markup; fall back to trimmed text or empty string.
      return content.length ? content : (cell.textContent.trim() || '');
    });
    // Pad short rows so the table stays rectangular.
    while (rowCells.length < columnCount) rowCells.push('');
    cells.push(rowCells);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'table-nutrition', cells });
  element.replaceWith(block);
}
