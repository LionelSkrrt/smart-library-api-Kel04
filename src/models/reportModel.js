import { pool } from '../config/db.js';

export const ReportModel = {
  async getStats() {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM books) AS total_books,
        (SELECT COUNT(*) FROM authors) AS total_authors,
        (SELECT COUNT(*) FROM categories) AS total_categories,
        (SELECT COUNT(*) FROM loans WHERE status = 'BORROWED') AS active_loans
    `;
    const result = await pool.query(query);
    // Mengubah tipe data output COUNT dari string/bigint ke integer standar
    return {
      total_books: parseInt(result.rows[0].total_books),
      total_authors: parseInt(result.rows[0].total_authors),
      total_categories: parseInt(result.rows[0].total_categories),
      active_loans: parseInt(result.rows[0].active_loans)
    };
  }
};