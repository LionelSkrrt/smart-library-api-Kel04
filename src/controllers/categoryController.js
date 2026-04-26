import { CategoryModel } from '../models/categoryModel.js';

export const CategoryController = {
  async getCategories(req, res) {
    try {
      const searchName = req.query.name || '';
      const categories = await CategoryModel.getAll(searchName);
      res.json(categories);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async addCategory(req, res) {
    try {
      const category = await CategoryModel.create(req.body.name);
      res.status(201).json(category);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const category = await CategoryModel.update(id, name);
      res.json(category);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const result = await CategoryModel.delete(id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
