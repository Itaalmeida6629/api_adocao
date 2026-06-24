const db = require('../config/database.js')

class PetsModel {
  static async findAll() {
    const [rows] = await db.query('SELECT id, name, age, species, size, status, description FROM pets')
    return rows
  }

  static async findAvailable() {
    const [rows] = await db.query(
      "SELECT id, name, age, species, size, status, description FROM pets WHERE status = 'available'"
    )
    return rows
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT id, name, age, species, size, status, description FROM pets WHERE id = ?', [
      id,
    ])
    return rows[0]
  }

  static async create(pet) {
    const { name, age, species, size, status, description } = pet
    const [result] = await db.query(
      'INSERT INTO pets (name, age, species, size, status, description) VALUES (?, ?, ?, ?, ?, ?)',
      [name, age, species, size, status, description ?? null]
    )
    return result.insertId
  }

  static async update(id, data) {
    const fields = []
    const values = []
    for (const key in data) {
      fields.push(`${key} = ?`)
      values.push(data[key])
    }
    values.push(id)
    const [result] = await db.query(`UPDATE pets SET ${fields.join(', ')} WHERE id = ?`, values)
    return result.affectedRows > 0
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM pets WHERE id = ?', [id])
    return result.affectedRows > 0
  }
}

module.exports = PetsModel
