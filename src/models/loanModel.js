import { pool } from '../config/db.js';

export const LoanModel = {
  async createLoan(book_id, member_id, due_date) {
    const client = await pool.connect(); // Menggunakan client untuk transaksi
    try {
      await client.query('BEGIN'); // Mulai transaksi database

      // 1. Cek ketersediaan buku
      const bookCheck = await client.query('SELECT available_copies FROM books WHERE id = $1', [book_id]);
      if (bookCheck.rows[0].available_copies <= 0) {
        throw new Error('Buku sedang tidak tersedia (stok habis).');
      }

      // 2. Kurangi stok buku
      await client.query('UPDATE books SET available_copies = available_copies - 1 WHERE id = $1', [book_id]);

      // 3. Catat transaksi peminjaman
      const loanQuery = `
        INSERT INTO loans (book_id, member_id, due_date) 
        VALUES ($1, $2, $3) RETURNING *
      `;
      const result = await client.query(loanQuery, [book_id, member_id, due_date]);

      await client.query('COMMIT'); // Simpan semua perubahan
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK'); // Batalkan jika ada error
      throw error;
    } finally {
      client.release();
    }
  },

  async getAllLoans() {
    const query = `
      SELECT l.*, b.title as book_title, m.full_name as member_name 
      FROM loans l
      JOIN books b ON l.book_id = b.id
      JOIN members m ON l.member_id = m.id
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  async getTopBorrowers() {
    const query = `
      SELECT
        m.id          AS member_id,
        m.full_name,
        m.email,
        m.member_type,
        COUNT(l.id)::int                                   AS total_loans,
        MAX(l.loan_date)                                   AS last_loan_date,
        (
          SELECT b2.title
          FROM loans l2
          JOIN books b2 ON l2.book_id = b2.id
          WHERE l2.member_id = m.id
          GROUP BY b2.title
          ORDER BY COUNT(*) DESC
          LIMIT 1
        )                                                  AS favorite_book_title,
        (
          SELECT COUNT(*)::int
          FROM loans l3
          JOIN books b3 ON l3.book_id = b3.id
          WHERE l3.member_id = m.id
            AND b3.title = (
              SELECT b4.title
              FROM loans l4
              JOIN books b4 ON l4.book_id = b4.id
              WHERE l4.member_id = m.id
              GROUP BY b4.title
              ORDER BY COUNT(*) DESC
              LIMIT 1
            )
        )                                                  AS favorite_book_count
      FROM members m
      JOIN loans l ON l.member_id = m.id
      GROUP BY m.id, m.full_name, m.email, m.member_type
      ORDER BY total_loans DESC
      LIMIT 3
    `;
    const result = await pool.query(query);
    return result.rows.map(row => ({
      member_id:    row.member_id,
      full_name:    row.full_name,
      email:        row.email,
      member_type:  row.member_type,
      total_loans:  row.total_loans,
      last_loan_date: row.last_loan_date,
      favorite_book: {
        title:          row.favorite_book_title,
        times_borrowed: row.favorite_book_count
      }
    }));
  },

  async returnBook(loan_id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Cek validitas data peminjaman
      const loanCheck = await client.query('SELECT * FROM loans WHERE id = $1', [loan_id]);
      if (loanCheck.rows.length === 0) throw new Error('Data peminjaman tidak ditemukan.');
      if (loanCheck.rows[0].status === 'RETURNED') throw new Error('Buku ini sudah dikembalikan sebelumnya.');

      const book_id = loanCheck.rows[0].book_id;

      // 2. Ubah status peminjaman menjadi RETURNED dan catat return_date
      const updateLoanQuery = `
        UPDATE loans 
        SET status = 'RETURNED', return_date = CURRENT_DATE 
        WHERE id = $1 RETURNING *
      `;
      const loanResult = await client.query(updateLoanQuery, [loan_id]);

      // 3. Tambahkan kembali available_copies di tabel books
      await client.query('UPDATE books SET available_copies = available_copies + 1 WHERE id = $1', [book_id]);

      await client.query('COMMIT'); 
      return loanResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK'); 
      throw error;
    } finally {
      client.release();
    }
  }
};

    
