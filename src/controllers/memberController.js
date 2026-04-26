import { MemberModel } from '../models/memberModel.js';

export const MemberController = {
  async getAllMembers(req, res) {
    try {
      const members = await MemberModel.getAll();
      res.json(members);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async registerMember(req, res) {
    try {
      const newMember = await MemberModel.create(req.body);
      res.status(201).json({ message: "Anggota berhasil didaftarkan!", data: newMember });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async updateMember(req, res) {
    try {
      const { id } = req.params;
      const member = await MemberModel.update(id, req.body);
      res.json(member);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  async deleteMember(req, res) {
    try {
      const { id } = req.params;
      const result = await MemberModel.delete(id);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
