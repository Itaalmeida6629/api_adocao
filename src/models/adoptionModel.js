const db = require('../config/database.js')

class AdoptionModel {
  static async findAll() {
    const [rows] = await db.query('SELECT id, user_id, pet_id, adoption_date FROM adoptions')
    return rows
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT id, user_id, pet_id, adoption_date FROM adoptions WHERE id = ?', [id])
    return rows[0]
  }

  static async findByUserAndPet(userId, petId) {
    const [rows] = await db.query(
      'SELECT id, user_id, pet_id, adoption_date FROM adoptions WHERE user_id = ? AND pet_id = ?',
      [userId, petId]
    )
    return rows[0]
  }

  static async create(adoption) {
    const { user_id, pet_id } = adoption
    const [result] = await db.query('INSERT INTO adoptions (user_id, pet_id) VALUES (?, ?)', [user_id, pet_id])
    return result.insertId
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM adoptions WHERE id = ?', [id])
    return result.affectedRows > 0
  }
}

module.exports = AdoptionModel
