import { BookModel } from '../models/bookModel.js';

export const BookController = {
  async getAllBooks(req, res) {
    try {
      const searchTitle = req.query.title || '';
      const books = await BookModel.getAll(searchTitle);
      res.json(books);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async createBook(req, res) {
    try {
      const newBook = await BookModel.create(req.body);
      res.status(201).json(newBook);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async updateBook(req, res) {
    try {
      const { id } = req.params;
      const book = await BookModel.update(id, req.body);
      res.json(book);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async deleteBook(req, res) {
    try {
      const { id } = req.params;
      const result = await BookModel.delete(id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
