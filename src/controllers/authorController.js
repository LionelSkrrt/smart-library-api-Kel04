import { AuthorModel } from '../models/authorModel.js';

export const AuthorController = {
  // 1. Fungsi Get All (dengan fitur search)
  async getAuthors(req, res) {
    try {
      const searchName = req.query.name || ''; 
      const authors = await AuthorModel.getAll(searchName);
      res.json(authors);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  
  // 2. Fungsi Add Author (Ini yang tadi hilang / tertimpa)
  async addAuthor(req, res) {
    try {
      const { name, nationality } = req.body;
      const author = await AuthorModel.create(name, nationality);
      res.status(201).json(author);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // 3. Fungsi Update Author
  async updateAuthor(req, res) {
    try {
      const { id } = req.params;
      const { name, nationality } = req.body;
      const author = await AuthorModel.update(id, name, nationality);
      res.json(author);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // 4. Fungsi Delete Author
  async deleteAuthor(req, res) {
    try {
      const { id } = req.params;
      const result = await AuthorModel.delete(id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
