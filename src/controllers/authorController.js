import { AuthorModel } from '../models/authorModel.js';

export const AuthorController = {
  async getAuthors(req, res) {
    try {
      // Menangkap query parameter ?name=
      const searchName = req.query.name || ''; 
      const authors = await AuthorModel.getAll(searchName);
      res.json(authors);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  
  // ... (fungsi addAuthor tetap sama) ...

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
